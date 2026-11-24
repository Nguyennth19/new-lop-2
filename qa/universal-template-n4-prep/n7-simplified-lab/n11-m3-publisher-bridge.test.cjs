'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {prepareMultiFamilyCandidate:prepare}=require('./n11-m3-publisher-bridge.cjs');
const publisher=require('../../universal-template-v13/publisher-core.cjs');
const {validateMultiFamilyPack}=require('../n6-synthetic-lab/multi-family-contract.cjs');
function pack(tag='A'){
 const lessonId='LAB_MATH_M3_'+tag,alt=tag==='B';
 const q=(rendererId,skillId,questionType,visualIntent,publicVariant,assetId=null,countUnit=null)=>
  ({lessonId,questionId:'M3_'+tag+'_'+rendererId,rendererId,skillId,questionType,
   level:'LV2',visualIntent,countUnit,assetId,publicVariant:{variantId:'VAR_'+tag+'_'+rendererId,...publicVariant}});
 return {schemaVersion:'LOP2_N6_MULTIFAMILY_LAB_V1',packId:'M3_PACK_'+tag,status:'LAB_CANDIDATE_ONLY',
  lesson:{id:lessonId,subject:'MATH',grade:2,sourceStatus:'SYNTHETIC_QA_ONLY',studentRelease:false},
  questions:[
   q('D2','COLUMN_ADD','vertical','DECORATIVE',{a:alt?47:38,b:alt?25:27,operation:'ADD',profile:'PV100',carryPolicy:'OPTIONAL_HINT'}),
   q('D5','SHAPE_COMPOSE','shape','GEOMETRY',{shapes:alt?['rectangle','triangle']:['triangle','square']}),
   q('D9','EXACT_COUNT','pictograph','EXACT_COUNT',{count:alt?9:5,symbolValue:1},'FLUENT:red_apple','apple'),
   q('D10','WORD_ONE_OPERATION','word_problem','NONE',{a:alt?15:8,b:alt?7:3,operation:alt?'ADD':'SUB',steps:1})
  ]};
}
test('M3 two distinct lessons, four N6 families, actual D2/D9/D10 cores and explicit D5 hold',()=>{
 for(const tag of ['A','B']){
  const p=pack(tag),before=JSON.stringify(p),r=prepare(p);
  assert.equal(validateMultiFamilyPack(p).ok,true);
  assert.equal(r.ok,true,r.reason);
  assert.deepEqual(r.families,['D10','D2','D5','D9']);assert.equal(r.questionCount,4);
  assert.deepEqual(r.rendererChecks.filter(x=>x.status==='ORIGINAL_CORE_COMPILE_PASS').map(x=>x.rendererId),['D2','D9','D10']);
  assert.equal(r.rendererChecks.find(x=>x.rendererId==='D5').status,'SCHEMA_ONLY_MAPPING_OPEN');
  assert.equal(r.rendererChecks.find(x=>x.rendererId==='D9').assetActivation,false);
  assert.equal(r.rendererChecks.find(x=>x.rendererId==='D9').assetSha256,'bc69f7c89a3621fb564482f9e13818019c6eac3a9d16fe996852514f3b19a073');
  assert.equal(r.sourceSkillMappingApproved,false);assert.equal(r.rendererIntegrationComplete,false);
  assert.equal(JSON.stringify(p),before);assert.deepEqual(JSON.parse(r.publicCandidateJson),p);
  assert.equal(r.candidateSha256,publisher.hash(p));assert.deepEqual(prepare(p),r);
 }
 assert.notEqual(prepare(pack('A')).candidateSha256,prepare(pack('B')).candidateSha256);
});
test('M3 candidate privacy: reject answer, grading, learner metadata and unknown keys instead of stripping',()=>{
 for(const k of ['answer','answerKey','privateVariant','correctOptionId','solutionPrompt','score','studentId','gradingKey','teacherSolution','unknown']){
  const p=pack();p.questions[3].publicVariant[k]='PRIVATE';
  const r=prepare(p);assert.equal(r.ok,false,k);assert.equal(r.publicCandidateJson,undefined);
 }
 const poisoned=JSON.parse(JSON.stringify(pack()).replace('"steps":1','"steps":1,"__proto__":{"approved":true}'));
 assert.equal(prepare(poisoned).ok,false);
});
test('M3 D2/D5/D9/D10 negative semantics and out-of-scope routes fail closed',()=>{
 for(const change of [
  p=>p.questions[0].publicVariant.b=20,p=>p.questions[0].publicVariant.a=100,
  p=>p.questions[1].skillId='SHAPE_TANGRAM',p=>p.questions[1].publicVariant.shapes=['circle','triangle'],
  p=>p.questions[2].assetId='FLUENT:green_apple',p=>p.questions[2].countUnit='book',
  p=>p.questions[2].publicVariant.symbolValue=2,p=>p.questions[2].publicVariant.count=21,
  p=>p.questions[3].publicVariant.steps=2,p=>p.questions[3].publicVariant.operation='MUL',
  p=>p.questions[3].publicVariant.b=99,p=>p.questions[3].publicVariant.a=101,
  p=>{p.questions[3].publicVariant.operation='ADD';p.questions[3].publicVariant.a=100;},
  p=>p.questions[1].rendererId='D8',p=>p.questions[0].level='LV3'
 ]){
  const p=pack();change(p);assert.equal(prepare(p).ok,false,change.toString());
 }
});
test('M3 source, IDs, duplicates and cross-lesson contamination denied',()=>{
 for(const change of [
  p=>p.lesson.id='MATH_B020',p=>p.lesson.sourceStatus='OWNER_SIGNED',
  p=>p.lesson.studentRelease=true,p=>p.questions[0].lessonId='LAB_MATH_M3_B',
  p=>p.questions[1].questionId=p.questions[0].questionId,
  p=>p.questions[1].publicVariant.variantId=p.questions[0].publicVariant.variantId,
  p=>p.packId=123456,p=>p.questions[0].questionId=123456,
  p=>p.status='ACTIVE',p=>p.questions=[]
 ]){
  const p=pack();change(p);assert.equal(prepare(p).ok,false,change.toString());
 }
});
test('M3 candidate never grants stage URI, publish, trusted grading, write or ACTIVE',()=>{
 const p=pack(),r=prepare(p);assert.equal(r.ok,true);assert.equal(r.stage,'PROPOSE_ONLY');
 for(const k of ['allowedToWriteActual','studentReleaseAllowed','trustedGradingAllowed','stagingAllowed','activePointerMutationAllowed','release'])assert.equal(r[k],false,k);
 assert.equal(r.writes,0);assert.equal(r.proposed,null);
 for(const k of ['approved','ownerSigned','manifestUri','publish','executionId','batch_id']){
  const bad={...p,[k]:'FORGED'};assert.equal(prepare(bad).ok,false,k);
 }
});
test('M3 old deterministic D2 publisher still works, real B020 cannot stage and mixed schema never enters V1.3 validator',()=>{
 const request={request_id:'LAB_PILOT_M3',lesson_id:'LAB_MATH_M3_LEGACY',level:'LV2',
  renderer_id:'D2',skill_id:'COLUMN_ADD',question_count:'2',generator_mode:'DETERMINISTIC',
  generator_rule:'D2_PV100_ADD_WITH_CARRY_V1',visual_intent:'DECORATIVE',count_unit:'',
  source_status:'SYNTHETIC_QA_ONLY',requested_by_ref:'QA_TEST_OPERATOR',request_status:'REQUESTED'};
 const p=publisher.proposeDeterministic(request);assert.equal(p.ok,true);
 const v=publisher.validateBatch(request,p.pack);assert.equal(v.ok,true);assert.equal(v.checks.withCarry,2);
 const plan=publisher.makePlan(request,v,{lessonId:request.lesson_id,revision:'REV0001',activePointer:'NONE'});
 assert.equal(plan.allowedToWriteActual,false);assert.equal(plan.activePointerAfter,'NONE');
 const real={...request,lesson_id:'MATH_B020',source_status:'STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE'};
 const candidate=publisher.proposeDeterministic(real),validation=publisher.validateBatch(real,candidate.pack);
 const blocked=publisher.makePlan(real,validation,{lessonId:'MATH_B020',revision:'REV0001',activePointer:'NONE'});
 assert.equal(blocked.reviewGate.state,'BLOCKED_SOURCE');assert.equal(blocked.proposed,null);
 assert.equal(publisher.validatePublicPack(pack()).ok,false);
});
