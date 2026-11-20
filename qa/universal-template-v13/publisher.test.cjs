'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const x=require('./publisher-core.cjs');let checks=0;
const eq=(actual,want,msg)=>{assert.deepEqual(actual,want,msg);checks++};
const ok=(condition,msg)=>{assert(condition,msg);checks++};
const throws=(fn,re)=>{assert.throws(fn,re);checks++};
const mk=(tag='A',lesson='LAB_MATH_PILOT_'+tag,src='SYNTHETIC_QA_ONLY')=>({
 request_id:'LAB_PILOT_'+tag,lesson_id:lesson,level:'LV2',
 renderer_id:'D2',skill_id:'COLUMN_ADD',question_count:'20',
 generator_mode:'DETERMINISTIC',generator_rule:'D2_PV100_ADD_WITH_CARRY_V1',
 visual_intent:'DECORATIVE',count_unit:'',source_status:src,
 requested_by_ref:'QA_TEST_OPERATOR',request_status:'REQUESTED'
});
const arr=xs=>[x.HEADERS,...xs.map(r=>x.HEADERS.map(k=>r[k]||''))];
const a=mk('A'),b=mk('B');
eq(x.HEADERS.length,13);eq(x.importSheetRectangle(arr([a,b])).length,2);
throws(()=>x.importSheetRectangle([x.HEADERS.slice().reverse(),x.HEADERS.map(k=>a[k]||'')]),/SHEET_HEADER_DRIFT/);
throws(()=>x.importSheetRectangle(arr([a,a])),/DUPLICATE_REQUEST_ID/);
const formula=mk();formula.requested_by_ref='=IMPORTXML("x","y")';
throws(()=>x.importSheetRectangle(arr([formula])),/FORMULA_OR_CELL_VALUE_REJECTED/);
const negative=[
 ['generator_mode','AI_AUTO_PUBLISH','GENERATOR_OR_RENDERER_NOT_APPROVED_IN_LAB'],
 ['renderer_id','D10','GENERATOR_OR_RENDERER_NOT_APPROVED_IN_LAB'],
 ['skill_id','WORD_PROBLEM','GENERATOR_OR_RENDERER_NOT_APPROVED_IN_LAB'],
 ['question_count','51','COUNT_OUTSIDE_LAB_LIMIT'],
 ['question_count','-1','COUNT_OUTSIDE_LAB_LIMIT'],
 ['visual_intent','EXACT_COUNT','REQUEST_VISUAL_OR_STATE_INVALID'],
 ['request_status','APPROVED','REQUEST_VISUAL_OR_STATE_INVALID'],
 ['source_status','OWNER_SIGNED','UNKNOWN_SOURCE_PROVENANCE']
];
for(const [k,v,why] of negative){const row={...a,[k]:v};eq(x.validateRequest(row).reason,why,'reject '+k)}
for(const r of [a,b]){
 const first=x.proposeDeterministic(r),second=x.proposeDeterministic(r);
 eq(first.ok,true);eq(first.aiBuilderMode,'DETERMINISTIC_ENGINE_NO_LLM_CALL');
 eq(first.pack.questions.length,20);
 eq(x.hash(first.pack),x.hash(second.pack),'generator reproducible');
 const check=x.validateBatch(r,first.pack);
 eq(check.ok,true,'public actual D2 original core compile');
 eq(check.checks.withCarry,20);
 const IDs=new Set(first.pack.questions.map(q=>q.questionId));eq(IDs.size,20);
 ok(first.pack.questions.every(q=>q.publicVariant.a+q.publicVariant.b<=99));
 ok(first.pack.questions.every(q=>q.publicVariant.a%10+q.publicVariant.b%10>=10));
 ok(JSON.stringify(first.pack).indexOf('"answerKey"')===-1);
 const plan=x.makePlan(r,check,{lessonId:r.lesson_id,revision:'REV0001',
  expectedRevision:'REV0001',activePointer:'NONE'});
 eq(plan.reviewGate.state,'PENDING_OWNER_APPROVAL');
 eq(plan.candidateState,'STAGED_QA_ONLY');
 eq(plan.allowedToWriteActual,false);eq(plan.studentReleaseAllowed,false);
 eq(plan.activePointerAfter,'NONE');eq(plan.writeOperations,0);
 ok(/^staging:\/\/ULT_V13\/LAB_MATH_PILOT_[AB]\/sha256-[a-f0-9]{16}\/public\.json$/.test(plan.proposed.publicJsonUri));
 eq(plan.planSha256.length,64);
 const altered=structuredClone(first.pack);altered.questions[0].publicVariant.answerKey=1;
 eq(x.validateBatch(r,altered).reason,'BAD_PUBLIC_PACK_SCHEMA_OR_PRIVATE_DATA');
 const added=structuredClone(first.pack);added.questions[0].publicVariant.ownerApproval='FAKE';
 eq(x.validateBatch(r,added).reason,'PUBLIC_MATH_POLICY_FAIL');
 const changed=structuredClone(first.pack);changed.questions[0].rendererId='D10';
 eq(x.validateBatch(r,changed).reason,'QUESTION_POLICY_MISMATCH');
 const bad=structuredClone(first.pack);bad.questions[0].skillId='WORD_PROBLEM';
 eq(x.validateBatch(r,bad).reason,'QUESTION_POLICY_MISMATCH');
 const noCarry=structuredClone(first.pack);const p=noCarry.questions[0].publicVariant;
 p.b=10;
 eq(x.validateBatch(r,noCarry).reason,'MISSING_REQUIRED_CARRY');
 throws(()=>x.makePlan(r,check,{lessonId:r.lesson_id,revision:'REV0002',
  expectedRevision:'REV0001',activePointer:'NONE'}),/STALE_MANIFEST_COMPARE_AND_SWAP/);
 const suspicious=x.makePlan(r,check,{lessonId:r.lesson_id,revision:'REV0001',
  activePointer:'NONE'},[{decision:'APPROVE',signedBy:'AI_DATA_BUILDER'}]);
 eq(suspicious.reviewGate.state,'PENDING_EXTERNAL_SIGNATURE_VERIFICATION');
 eq(suspicious.allowedToWriteActual,false);
}
const inputA=x.proposeDeterministic(a).pack,inputB=x.proposeDeterministic(b).pack;
ok(x.hash(inputA)!==x.hash(inputB),'distinct A/B versions');
const b020=mk('B020','MATH_B020','STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE');
b020.request_id='B020_DRY_BLOCK';
const bc=x.proposeDeterministic(b020);
eq(bc.ok,true);
const v=x.validateBatch(b020,bc.pack);eq(v.ok,true);
const bg=x.makePlan(b020,v,{lessonId:'MATH_B020',revision:'REV0001',activePointer:'NONE'});
eq(bg.reviewGate.state,'BLOCKED_SOURCE');eq(bg.proposed,null,'real B20 must not even receive a stage URI');
eq(bg.allowedToWriteActual,false);eq(bg.activePointerAfter,'NONE');
eq(x.evaluateGate(b020,v,[{signature:'FAKE_OWNER'}]).studentReleaseAllowed,false);
const ai={requestId:'LAB_PILOT_A',state:'AI_CANDIDATE_ONLY',questions:inputA.questions};
eq(x.acceptAICandidateEnvelope(ai).stage,'PROPOSE_ONLY');
eq(x.acceptAICandidateEnvelope({...ai,approved:true}).ok,false);
eq(x.acceptAICandidateEnvelope({...ai,publish:true}).ok,false);
eq(x.acceptAICandidateEnvelope({...ai,questions:[{answerKey:'53'}]}).ok,false);
eq(x.simulateRollback({currentRevision:'REV0002',expectedRevision:'REV0001',
 history:['V1'],targetRelease:'V1',ownerApproved:true,qaApproved:true}).reason,'STALE_ROLLBACK_POINTER');
eq(x.simulateRollback({currentRevision:'REV0002',expectedRevision:'REV0002',
 history:['V1'],targetRelease:'UNKNOWN',ownerApproved:true,qaApproved:true}).reason,'UNKNOWN_ROLLBACK_TARGET');
eq(x.simulateRollback({currentRevision:'REV0002',expectedRevision:'REV0002',
 history:['V1'],targetRelease:'V1',ownerApproved:true,qaApproved:false}).reason,
 'ROLLBACK_REQUIRES_INDEPENDENT_APPROVAL');
eq(x.simulateRollback({currentRevision:'REV0002',expectedRevision:'REV0002',
 history:['V1'],targetRelease:'V1',ownerApproved:true,qaApproved:true}).activeManifestUnchanged,true);
throws(()=>x.proposedStagingPaths({lesson:{id:'../HACK'},packId:'LAB_PILOT_A'},
 'a'.repeat(64)),/UNSAFE_PATH_ID/);
const out=path.join(__dirname,'dist');
for(const name of ['LAB_PILOT_A_PUBLIC_CANDIDATE.json','LAB_PILOT_B_PUBLIC_CANDIDATE.json']){
 const parsed=JSON.parse(fs.readFileSync(path.join(out,name),'utf8'));
 eq(parsed.questions.length,20);eq(x.validatePublicPack(parsed).ok,true);
}
const report=JSON.parse(fs.readFileSync(path.join(out,'QA_READBACK.json'),'utf8'));
eq(report.syntheticQuestions,40);eq(report.externalWrites,0);eq(report.publishedRealLessons,0);
const blocked=JSON.parse(fs.readFileSync(path.join(out,'BLOCKED_MATH_B020_READ_ONLY.json'),'utf8'));
eq(blocked.contentNotExported,true);eq(blocked.releaseDecision,'NO_GO');
const manifest=JSON.parse(fs.readFileSync(path.join(out,'RELEASE_MANIFEST_CANDIDATE.json'),'utf8'));
eq(manifest.actualActivePointer,'NONE');eq(manifest.productionStudentPlayable,false);
console.log('ULT_V13_PUBLISHER_DRY_RUN_CONTRACT_PASS',checks,'assertions; 2 synthetic packs / 40 questions / B020 source blocked / zero external writes');
