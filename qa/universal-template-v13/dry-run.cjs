'use strict';
/* Local artifacts ONLY. No network, no external SDK, no GAS.
 * Simulate control-sheet rows -> 2 public JSON candidate packages -> QA reports ->
 * staging-only manifest, approval gate and rollback plans.
 */
const fs=require('node:fs'),path=require('node:path'),core=require('./publisher-core.cjs');
const out=path.resolve(__dirname,'dist');fs.mkdirSync(out,{recursive:true});
const {HEADERS,contract,importSheetRectangle,proposeDeterministic,validateBatch,makePlan,
 hash}=core;
const makeRow=({requestId,lessonId,sourceStatus})=>({
 request_id:requestId,lesson_id:lessonId,level:'LV2',renderer_id:'D2',
 skill_id:'COLUMN_ADD',question_count:'20',generator_mode:'DETERMINISTIC',
 generator_rule:'D2_PV100_ADD_WITH_CARRY_V1',visual_intent:'DECORATIVE',
 count_unit:'',source_status:sourceStatus,requested_by_ref:'QA_TEST_OPERATOR',
 request_status:'REQUESTED'
});
const rows=[
 makeRow({requestId:'LAB_PILOT_A',lessonId:'LAB_MATH_PILOT_A',sourceStatus:'SYNTHETIC_QA_ONLY'}),
 makeRow({requestId:'LAB_PILOT_B',lessonId:'LAB_MATH_PILOT_B',sourceStatus:'SYNTHETIC_QA_ONLY'}),
 makeRow({requestId:'B020_DRY_BLOCK',lessonId:'MATH_B020',
  sourceStatus:'STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE'})
];
const rectangle=[HEADERS,...rows.map(row=>HEADERS.map(h=>row[h]||''))];
const inputs=importSheetRectangle(rectangle);
const write=(name,data)=>fs.writeFileSync(path.join(out,name),
 typeof data==='string'?data:JSON.stringify(data,null,2)+'\n','utf8');
const first=['A','B'],cases=[],events=[];
let i=0;
for(const request of inputs){
 const created=proposeDeterministic(request);
 if(!created.ok)throw Error(request.request_id+' GENERATOR_'+created.reason);
 const validation=validateBatch(request,created.pack);
 if(!validation.ok)throw Error(request.request_id+' VALIDATOR_'+validation.reason);
 const manifest={lessonId:request.lesson_id,revision:'REV0001',activePointer:'NONE',expectedRevision:'REV0001'};
 const plan=makePlan(request,validation,manifest);
 const saved={
  requestId:request.request_id,lessonId:request.lesson_id,scope:plan.reviewGate.state,
  generator:created.aiBuilderMode,validated:validation.checks,
  publicSha256:validation.digest,planSha256:plan.planSha256,
  actualWrites:0,actualManifestChanged:false,releaseEligible:false
 };
 i++;
 const eventId='ULT_V13_EVT_'+String(i).padStart(3,'0');
 events.push({eventId,batchId:request.request_id,event:'VALIDATION_AND_RELEASE_PLAN',
  actor:'LAB_DRY_RUN_ENGINE',before:'REQUESTED',after:plan.candidateState,
  qaDigest:validation.digest,previousActivePointer:'NONE',
  resultingActivePointer:'NONE',actualExternalWrites:0});
 if(request.source_status==='SYNTHETIC_QA_ONLY'){
  write(request.request_id+'_PUBLIC_CANDIDATE.json',created.pack);
  write(request.request_id+'_PUBLISH_PLAN.json',plan);
  saved.stagingUri=plan.proposed.publicJsonUri;
  if(plan.reviewGate.state!=='PENDING_OWNER_APPROVAL')throw Error('OWNER_GATE_FAILED_TO_CLOSE');
 }else{
  if(plan.reviewGate.state!=='BLOCKED_SOURCE')throw Error('B020_MUST_BE_BLOCKED');
  write('BLOCKED_MATH_B020_READ_ONLY.json',{
   sourceStatus:request.source_status,requestId:request.request_id,
   reason:plan.reviewGate.reason,questionCount:Number(request.question_count),
   contentNotExported:true,activePointerUnchanged:true,
   releaseDecision:'NO_GO',realSourceAccess:'NOT_USED',
   projectPolicy:'P1.2_SOURCE_CANDIDATE_IS_NOT_STUDENT_PLAYABLE'
  });
 }
 cases.push(saved);
}
for(const [name,columns] of Object.entries(contract.proposedTabs)){
 // Template headers only, no student answers or live values.
 const csv=columns.map(x=>'"'+x.replaceAll('"','""')+'"').join(',')+'\n';
 write(name+'.HEADER_TEMPLATE.csv',csv);
}
write('AI_BUILDER_INTAKE_CONTRACT.json',{
 version:'ULT_V13_AI_CANDIDATE_ADAPTER_V1',providerConnected:false,
 process:'AI proposes structured candidates; deterministic generator handles math examples; never self-publishes',
 aiOutputRequired:{requestId:'UPPERCASE_ID',state:'AI_CANDIDATE_ONLY',
  provenance:{generatorModel:'external_model_reference',promptPolicyVersion:'required'},
  questions:'untrusted structured candidates; independently validated'},
 promotionRequires:['validated_schema','validated_math','validated_skill',
  'independent_sgk_source_gate','independent_pedagogy_review',
  'external_verified_owner_approval','cas_version','publisher_service']
});
write('SHEET_READ_ONLY_RECEIPT.json',{
 status:'DRY_RUN_LOCAL_FIXTURE_NOT_LIVE_SHEET_DATA',
 headersObservedBeforeDesign:contract.sourceReadOnly.observedTabs,
 sourceSpreadsheetId:contract.sourceReadOnly.spreadsheetId,
 proposedTabsCreatedInGoogleSheets:0,existingTabsModified:0
});
write('RELEASE_MANIFEST_CANDIDATE.json',{
 schema:'ULT_V13_CANDIDATE_MANIFEST',mode:'DRY_RUN',
 actualActivePointer:'NONE',productionStudentPlayable:false,
 releaseStatus:'NOT_AUTHORIZED',cases
});
write('ROLLBACK_PLAN.json',{
 schema:'ULT_V13_ROLLBACK_PLAN_V1',mode:'DRY_RUN_NO_EXTERNAL_WRITE',
 activeBefore:'NONE',activeAfter:'NONE',targetVersion:'NONE',
 canExecuteRealRollback:false,reason:'NO_APPROVED_ACTIVE_RELEASE_IN_LAB'
});
write('EVENT_LEDGER_APPEND_ONLY.jsonl',events.map(e=>JSON.stringify(e)).join('\n')+'\n');
write('QA_READBACK.json',{
 contract:'LOP2_ULT_V13_SHEET_CONTROL_V1',status:'SOURCE_DRY_RUN_PASS',
 inputs:inputs.length,syntheticPacks:2,syntheticQuestions:40,
 blockedRealLessonCandidates:1,cases,externalWrites:0,
 approvedRealLessons:0,publishedRealLessons:0,manifestUpdatedReal:false,
 digest:hash(cases)
});
console.log('ULT_V13_SHEET_TO_JSON_DRY_RUN_CREATED',JSON.stringify({
 requests:inputs.length,publicQ:40,syntheticPacks:2,realB020SourceBlocked:true,
 ownerApprovalPending:true,externalWrites:0}));
