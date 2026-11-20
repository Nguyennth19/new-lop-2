'use strict';
/*
 * ULT V1.3 – deterministic SOURCE-ONLY Data Publisher / Approval Gate.
 * DRY RUN: no external API, no Sheet, Drive, GitHub or GAS write endpoints.
 * All staged files are local CI artifacts; any public source grade is LAB-only.
 */
const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const contract=require('./SHEET_CONTROL_CONTRACT_V1.json');
const ROOT=path.resolve(__dirname,'../..');
const SHA_BASE='1b69e277f8de6cb156f46a1d85af33bdad70c0ef';
const ID=/^[A-Z][A-Z0-9_]{5,79}$/;
const REQUEST_ID=/^[A-Z0-9][A-Z0-9_-]{5,79}$/;
const levels=new Set(['LV1','LV2','LV3']);
const unsafe=new Set(['__proto__','constructor','prototype','answer','answers','answerKey',
 'correct','correctAnswer','correctOptionId','correctOptionIds','expected','expectedResult',
 'privateAnswer','privateVariant','gradingKey','solution','solutionPrompt','teacherSolution',
 'studentId','score','stars','starCredit','privateKeyRef']);
let columnCore=null;
function ordered(data){if(Array.isArray(data))return data.map(ordered);
 if(data&&typeof data==='object')return Object.fromEntries(
  Object.keys(data).sort().map(k=>[k,ordered(data[k])]));
 return data;
}
const canonical=x=>JSON.stringify(ordered(x));
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:canonical(x)).digest('hex');
function fail(code){return {ok:false,reason:code}}
function secureTree(obj,depth=0){
 if(depth>15)return false;
 if(obj===null||typeof obj==='boolean')return true;
 if(typeof obj==='number')return Number.isFinite(obj);
 if(typeof obj==='string')return obj.length<=1200;
 if(Array.isArray(obj))return obj.length<=150&&obj.every(v=>secureTree(v,depth+1));
 if(!obj||typeof obj!=='object'||Object.getPrototypeOf(obj)!==Object.prototype||
  Object.keys(obj).length>80)return false;
 return Object.entries(obj).every(([k,v])=>!unsafe.has(k)&&k.length<100&&secureTree(v,depth+1));
}
function loadOriginalD2(){
 if(columnCore)return columnCore;
 const code=fs.readFileSync(path.join(ROOT,'47_D2V12_Core.html'),'utf8');
 const win={};win.window=win;win.globalThis=win;win.console=console;
 vm.runInNewContext(code,win,{filename:'47_D2V12_Core.html',timeout:2500});
 if(!win.KLColumnV12||typeof win.KLColumnV12.publicPlan!=='function')
  throw Error('D2_CORE_UNAVAILABLE');
 columnCore=win.KLColumnV12;return columnCore;
}
const HEADERS=contract.proposedTabs['11_YeuCau_Data'];
function importSheetRectangle(rows){
 if(!Array.isArray(rows)||rows.length<2||rows.length>101||!Array.isArray(rows[0]))
  throw Error('INVALID_SHEET_RECTANGLE');
 if(rows[0].length!==HEADERS.length||rows[0].some((v,i)=>v!==HEADERS[i]))
  throw Error('SHEET_HEADER_DRIFT');
 const requests=[];
 for(const line of rows.slice(1)){
  if(!Array.isArray(line)||line.length>HEADERS.length)throw Error('INVALID_ROW_WIDTH');
  const row=Object.fromEntries(HEADERS.map((h,i)=>[h,String(line[i]??'').trim()]));
  if(Object.values(row).some(x=>x.length>350||/^[=+@]/.test(x)))
   throw Error('FORMULA_OR_CELL_VALUE_REJECTED');
  requests.push(row);
 }
 const dup=new Set();
 for(const r of requests){if(dup.has(r.request_id))throw Error('DUPLICATE_REQUEST_ID');
  dup.add(r.request_id);}
 return requests;
}
function validateRequest(r){
 if(!r||Object.getPrototypeOf(r)!==Object.prototype||
  Object.keys(r).sort().join('|')!==HEADERS.slice().sort().join('|'))
  return fail('REQUEST_COLUMNS_MISMATCH');
 if(!REQUEST_ID.test(r.request_id)||!ID.test(r.lesson_id)||!levels.has(r.level))
  return fail('REQUEST_IDENTIFIER_OR_LEVEL_INVALID');
 if(r.renderer_id!=='D2'||r.skill_id!=='COLUMN_ADD'||r.generator_mode!=='DETERMINISTIC'||
   r.generator_rule!=='D2_PV100_ADD_WITH_CARRY_V1')
  return fail('GENERATOR_OR_RENDERER_NOT_APPROVED_IN_LAB');
 if(!/^(?:[1-9]|[1-4][0-9]|50)$/.test(r.question_count))
  return fail('COUNT_OUTSIDE_LAB_LIMIT');
 if(r.visual_intent!=='DECORATIVE'||r.count_unit!==''||r.request_status!=='REQUESTED')
  return fail('REQUEST_VISUAL_OR_STATE_INVALID');
 if(!REQUEST_ID.test(r.requested_by_ref)||!['SYNTHETIC_QA_ONLY',
  'STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE'].includes(r.source_status))
  return fail('UNKNOWN_SOURCE_PROVENANCE');
 return {ok:true,count:Number(r.question_count)};
}
function proposeDeterministic(r){
 const chk=validateRequest(r);if(!chk.ok)return chk;
 // Reproducible synthetic exercises, not official textbook content.
 const seed=Number.parseInt(hash(r.request_id).slice(0,8),16)>>>0;
 const questions=[],num=chk.count;
 const pool=[];
 // Finite prevalidated pool; no retry loops, no duplicate pairs and no
 // dependence on any LLM for arithmetic.
 for(let a=20;a<=79;a++)for(let b=11;b<=39;b++){
  if(a+b<=99&&a%10+b%10>=10)pool.push({a,b});
 }
 if(num>pool.length)return fail('INSUFFICIENT_VALID_VARIANTS');
 let state=seed;
 for(let j=pool.length-1;j>0;j--){
  state=(Math.imul(state,1664525)+1013904223)>>>0;
  const pick=state%(j+1);
  [pool[j],pool[pick]]=[pool[pick],pool[j]];
 }
 for(let i=0;i<num;i++){
  const {a,b}=pool[i];
  questions.push({
   lessonId:r.lesson_id,
   questionId:r.request_id+'_Q'+String(i+1).padStart(3,'0'),
   rendererId:'D2',skillId:'COLUMN_ADD',questionType:'vertical',
   level:r.level,visualIntent:'DECORATIVE',countUnit:null,assetId:null,
   publicVariant:{variantId:'COL_'+r.request_id+'_V'+String(i+1).padStart(3,'0'),
    profile:'PV100',operation:'ADD',level:r.level,a,b,carryPolicy:'OPTIONAL_HINT',assetId:null}
  });
 }
 return {ok:true,
  aiBuilderMode:'DETERMINISTIC_ENGINE_NO_LLM_CALL',
  pack:{schemaVersion:'LOP2_UNIVERSAL_LAB_PUBLIC_V1',packId:r.request_id,
   status:'LAB_FIXTURE_ONLY_NO_GAS_RELEASE',
   lesson:{id:r.lesson_id,subject:'MATH',title:'QA dry-run '+r.lesson_id,grade:2,
    studentRelease:false,sourceStatus:r.source_status},questions}};
}
function acceptAICandidateEnvelope(envelope){
 // Future LLM integration point; candidates are always PROPOSALS. No auto-approval.
 if(!envelope||!secureTree(envelope)||envelope.state!=='AI_CANDIDATE_ONLY'||
  !REQUEST_ID.test(envelope.requestId||'')||!Array.isArray(envelope.questions))
  return fail('UNTRUSTED_AI_ENVELOPE');
 if(envelope.approved||envelope.publish||envelope.ownerSigned||
  envelope.approvalState||envelope.manifestUri)return fail('AI_CANNOT_APPROVE');
 return {ok:true,stage:'PROPOSE_ONLY',candidates:envelope.questions.length,approved:false};
}
function exactKeys(object,keys){
 return object&&typeof object==='object'&&!Array.isArray(object)&&
  Object.keys(object).sort().join('|')===keys.slice().sort().join('|');
}
function validatePublicPack(pack,{maxQuestions=50}={}){
 if(!pack||!secureTree(pack)||
  !exactKeys(pack,['schemaVersion','packId','status','lesson','questions'])||
  !exactKeys(pack.lesson,['id','subject','title','grade','studentRelease','sourceStatus'])||
  pack.schemaVersion!=='LOP2_UNIVERSAL_LAB_PUBLIC_V1'||
  !REQUEST_ID.test(pack.packId||'')||pack.status!=='LAB_FIXTURE_ONLY_NO_GAS_RELEASE'||
  !pack.lesson||!ID.test(pack.lesson.id||'')||pack.lesson.studentRelease!==false||
  pack.lesson.subject!=='MATH'||pack.lesson.grade!==2||
  !Array.isArray(pack.questions)||pack.questions.length===0||
  pack.questions.length>maxQuestions)return fail('BAD_PUBLIC_PACK_SCHEMA_OR_PRIVATE_DATA');
 const seen=new Set(),core=loadOriginalD2();let withCarry=0;
 for(const q of pack.questions){
  if(!q||
    !exactKeys(q,['lessonId','questionId','rendererId','skillId','questionType',
      'level','visualIntent','countUnit','assetId','publicVariant'])||
    q.lessonId!==pack.lesson.id||!REQUEST_ID.test(q.questionId||'')||
    seen.has(q.questionId)||q.rendererId!=='D2'||q.skillId!=='COLUMN_ADD'||
    q.questionType!=='vertical'||!levels.has(q.level)||
    q.visualIntent!=='DECORATIVE'||q.assetId!==null||q.countUnit!==null)
   return fail('QUESTION_POLICY_MISMATCH');
  seen.add(q.questionId);
  const p=q.publicVariant;
  if(!p||
   !exactKeys(p,['variantId','profile','operation','level','a','b','carryPolicy','assetId'])||
   p.profile!=='PV100'||p.operation!=='ADD'||
   p.level!==q.level||p.carryPolicy!=='OPTIONAL_HINT'||p.assetId!==null||
   !Number.isInteger(p.a)||!Number.isInteger(p.b)||
   p.a<0||p.b<0||p.a+p.b>99||p.a+p.b<0)return fail('PUBLIC_MATH_POLICY_FAIL');
  if(p.a%10+p.b%10<10)return fail('MISSING_REQUIRED_CARRY');
  withCarry++;
  const plan=core.publicPlan(p);
  if(!plan.ok)return fail('ORIGINAL_D2_RENDERER_REJECTS_'+(plan.reason||'VARIANT'));
 }
 return {ok:true,checks:{schema:'PASS',privacy:'PASS',math:'PASS',
  renderer:'PASS',questionCount:pack.questions.length,withCarry},
  digest:hash(pack)};
}
function assessSource(request,pack){
 if(request.lesson_id!==pack.lesson.id)return fail('LESSON_SOURCE_MISMATCH');
 if(request.source_status!=='SYNTHETIC_QA_ONLY'||
  !request.lesson_id.startsWith('LAB_MATH_'))
  return fail('REAL_LESSON_SOURCE_NOT_APPROVED');
 return {ok:true,scope:'LAB_SYNTHETIC_ONLY'};
}
function evaluateGate(request,validation,signatures=[]){
 if(!validation?.ok)return {state:'REJECTED',reason:validation?.reason||'VALIDATOR_NOT_PASS'};
 const source=assessSource(request,validation.pack);
 if(!source.ok)return {state:'BLOCKED_SOURCE',reason:source.reason,
  studentReleaseAllowed:false};
 // This process does not have access to a trusted signer/provider and cannot
 // promote a real ACTIVE release. NEVER equate sheet cells with signature proof.
 if(signatures.length>0)return {state:'PENDING_EXTERNAL_SIGNATURE_VERIFICATION',
  reason:'SHEET_APPROVAL_CELLS_NOT_TRUSTED',studentReleaseAllowed:false};
 return {state:'PENDING_OWNER_APPROVAL',reason:'OWNER_AND_INDEPENDENT_QA_REQUIRED',
  studentReleaseAllowed:false,labStagingAllowed:true};
}
function validateBatch(request,pack){
 const req=validateRequest(request);if(!req.ok)return req;
 const check=validatePublicPack(pack,{maxQuestions:Number(request.question_count)});
 if(!check.ok)return check;
 if(check.checks.questionCount!==Number(request.question_count))
  return fail('REQUEST_COUNT_MISMATCH');
 if(pack.questions.some(q=>q.level!==request.level||q.lessonId!==request.lesson_id))
  return fail('DATA_ENVELOPE_MISMATCH');
 return {...check,pack,requestId:request.request_id};
}
function proposedStagingPaths(pack,digest){
 if(!REQUEST_ID.test(pack.packId)||!ID.test(pack.lesson.id)||!/^[a-f0-9]{64}$/.test(digest))
  throw Error('UNSAFE_PATH_ID');
 const revision='sha256-'+digest.slice(0,16);
 return {version:revision,
  publicJsonUri:'staging://ULT_V13/'+pack.lesson.id+'/'+revision+'/public.json',
  manifestCandidateUri:'staging://ULT_V13/'+pack.lesson.id+'/'+revision+'/manifest-candidate.json'};
}
function makePlan(request,validation,observed,signatures=[]){
 if(!observed||!REQUEST_ID.test(observed.revision||'')||
  typeof observed.activePointer!=='string'||!ID.test(observed.lessonId||''))
  throw Error('INVALID_OBSERVED_MANIFEST');
 if(observed.lessonId!==request.lesson_id)throw Error('MANIFEST_LESSON_MISMATCH');
 if(observed.expectedRevision!==undefined&&observed.expectedRevision!==observed.revision)
  throw Error('STALE_MANIFEST_COMPARE_AND_SWAP');
 const gate=evaluateGate(request,validation,signatures);
 const dig=validation?.ok?validation.digest:null;
 const paths=dig?proposedStagingPaths(validation.pack,dig):null;
 const proposal={
  contract:'LOP2_ULT_V13_PUBLISH_PLAN_V1',mode:'DRY_RUN_NO_EXTERNAL_WRITE',
  requestId:request.request_id,lessonId:request.lesson_id,
  sourceStatus:request.source_status,validation:validation?.ok?'PASS':'FAIL',
  validationDigest:dig,reviewGate:gate,
  observedManifest:{revision:observed.revision,activePointer:observed.activePointer},
  proposed:gate.labStagingAllowed?paths:null,
  allowedToWriteActual:false,studentReleaseAllowed:false,
  candidateState:gate.labStagingAllowed?'STAGED_QA_ONLY':gate.state,
  activePointerAfter:observed.activePointer,writeOperations:0,
  rollbackPlan:{mode:'PLAN_ONLY',requiresOwnerAndQA:true,rollbackTarget:observed.activePointer,
   activePointerAfterDryRun:observed.activePointer}
 };
 proposal.planSha256=hash(proposal);
 return proposal;
}
function simulateRollback({currentRevision,expectedRevision,history,targetRelease,ownerApproved=false,
 qaApproved=false}){
 if(!REQUEST_ID.test(currentRevision||'')||currentRevision!==expectedRevision)
  return fail('STALE_ROLLBACK_POINTER');
 if(!Array.isArray(history)||!history.includes(targetRelease))
  return fail('UNKNOWN_ROLLBACK_TARGET');
 if(!ownerApproved||!qaApproved)
  return fail('ROLLBACK_REQUIRES_INDEPENDENT_APPROVAL');
 return {ok:true,mode:'DRY_RUN',wouldRestoreTo:targetRelease,
  actualWrites:0,activeManifestUnchanged:true};
}
module.exports=Object.freeze({
 contract,HEADERS,hash,canonical,secureTree,
 importSheetRectangle,validateRequest,proposeDeterministic,
 acceptAICandidateEnvelope,validatePublicPack,validateBatch,
 assessSource,evaluateGate,proposedStagingPaths,makePlan,simulateRollback
});
