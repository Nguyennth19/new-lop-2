'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createMultiLessonRegistry}=require('./fb2-multi-lesson-registry.cjs');
const {createB21OnlyMultiLessonRegistry,catalog,trusted}=require('./fb2-trusted-adapters.cjs');
let passed=0;
const t=(name,fn)=>{fn();passed++;console.log('PASS '+name)};
const registry=createB21OnlyMultiLessonRegistry();
const req=(id='toan_b21',v='p0.6-fb-test-b21-v1')=>({
 featureFlag:true,environment:'ISOLATED_TEST',lessonId:id,lessonVersion:v,
 allowStudentUse:false,deploy:false,persist:false,awardStars:false,releaseReady:false
});
const c=structuredClone;
t('catalog contains B21+B20 separately accepted and two PENDING lessons',()=>{
 const list=registry.list();assert.equal(list.length,4);
 assert.equal(list.find(x=>x.lessonId==='toan_b21').hasIndependentEvidence,true);
 assert.equal(list.find(x=>x.lessonId==='toan_b20').state,'INDEPENDENT_ACCEPTED_TEST_ONLY');
 assert(list.filter(x=>x.state==='PENDING_INDEPENDENT_QA').length===2);
});
t('B21 inherits exact E03/F-A verification and remains preview only',()=>{
 const v=registry.select(req());assert.equal(v.ok,true);
 assert.equal(v.questions,8);assert.equal(v.status,'ISOLATED_TEST_PREVIEW_ONLY');
 assert.equal(v.releaseReady,false);assert.equal(v.noWrites,true);assert.equal(v.noStars,true);
});
t('feature flag disabled by default and other environment denied',()=>{
 assert.equal(registry.select({}).code,'FB2_FLAG_OFF');
 assert.equal(registry.select({...req(),featureFlag:false}).code,'FB2_FLAG_OFF');
 assert.equal(registry.select({...req(),environment:'PRODUCTION'}).code,'FB2_ENVIRONMENT_DENIED');
});
t('unknown lessons, wrong version, wrong subject are not substituted',()=>{
 assert.equal(registry.select(req('toan_b99')).code,'FB2_LESSON_UNKNOWN');
 assert.equal(registry.select(req('toan_b21','p0.6-fb-test-b21-v2')).code,'FB2_VERSION_MISMATCH');
 assert.equal(registry.select(req('tieng_viet_doc_hieu','p0.6-fb-test-tv-v1')).code,'FB2_INDEPENDENT_QA_REQUIRED');
 assert.equal(registry.select(req('toan_b24','p0.6-fb-test-b24-v1')).code,'FB2_INDEPENDENT_QA_REQUIRED');
});
t('reject storage, student, stars, deployment and release escalation',()=>{
 for(const [key,value] of [['allowStudentUse',true],['deploy',true],['persist',true],['awardStars',true],['releaseReady',true]]){
  assert.equal(registry.select({...req(),[key]:value}).code,'FB2_CAPABILITY_DENIED',key);
 }
});
t('pending B24 with forged approvals cannot borrow B21 adapter',()=>{
 const altered=c(catalog);const e=altered.lessons.find(x=>x.lessonId==='toan_b24');
 Object.assign(e,{state:'INHERITED_ACCEPTED_TEST_ONLY',
 sourceRef:'E03_COMPOSER_B21',rendererRef:'FA_G5_B21_ISOLATED_PREVIEW',
 policyReviewRef:'FA_OWNER_APPROVAL_G7_G8_20261113.md',qaEvidenceRef:'FA_G5_BROWSER_QA_20261113.md',
 trustedAdapterId:'INHERITED_B21_F_B_1'});
 const reg=createMultiLessonRegistry(altered,trusted);
 assert.equal(reg.select(req('toan_b24','p0.6-fb-test-b24-v1')).code,'FB2_TRUST_ANCHOR_MISSING_OR_MISMATCH');
});
t('unsigned extra lesson cannot be activated by JSON only',()=>{
 const altered=c(catalog);const e=altered.lessons.find(x=>x.lessonId==='toan_b24');
 Object.assign(e,{state:'INHERITED_ACCEPTED_TEST_ONLY',sourceRef:'SELF_APPROVED',
 rendererRef:'SELF_RENDERER',policyReviewRef:'SELF_SIGNED',
 qaEvidenceRef:'FAKE_QA',trustedAdapterId:'B24_FAKE'});
 const reg=createMultiLessonRegistry(altered,trusted);
 assert.equal(reg.select(req('toan_b24','p0.6-fb-test-b24-v1')).code,'FB2_TRUST_ANCHOR_MISSING_OR_MISMATCH');
});
t('invalid forged independent evidence fails closed even with matching anchor',()=>{
 const altered=c(catalog);const e=altered.lessons.find(x=>x.lessonId==='toan_b24');
 Object.assign(e,{state:'INHERITED_ACCEPTED_TEST_ONLY',sourceRef:'B24_OWN_SOURCE',
 rendererRef:'B24_OWN_RENDERER',policyReviewRef:'B24_OWN_PEDAGOGY',
 qaEvidenceRef:'B24_OWN_QA',trustedAdapterId:'B24_PRIVATE'});
 const anchor={B24_PRIVATE:{lessonId:e.lessonId,lessonVersion:e.lessonVersion,
 sourceRef:e.sourceRef,rendererRef:e.rendererRef,policyReviewRef:e.policyReviewRef,
 qaEvidenceRef:e.qaEvidenceRef,verify:()=>({ok:true,status:'ISOLATED_TEST_PREVIEW_ONLY',
 lessonId:e.lessonId,lessonVersion:e.lessonVersion,questions:8,
 noWrites:true,noStars:true,releaseReady:false,deploymentAuthorized:false})}};
 assert.equal(createMultiLessonRegistry(altered,anchor).select(req('toan_b24',e.lessonVersion)).code,'FB2_INDEPENDENT_PROOF_FAILED');
});
t('per-lesson rollback is scoped, deterministic and fail-closed',()=>{
 for(const id of ['toan_b21','toan_b20','toan_b24','tieng_viet_doc_hieu']){
  const out=registry.rollback(id,'TEST_STOP');
  assert.equal(out.status,'ROLLED_BACK_TO_BLOCKED_DEFAULT');assert.equal(out.lessonId,id);
  assert.equal(out.featureFlag,false);assert.equal(out.releaseReady,false);
 }
 assert.equal(registry.rollback('not_found').code,'FB2_ROLLBACK_LESSON_UNKNOWN');
 assert.equal(registry.select(req()).ok,true,'rollback receipt cannot mutate another lesson');
});
t('duplicate lesson and unsafe catalog are rejected',()=>{
 const dup=c(catalog);dup.lessons.push(c(dup.lessons[0]));
 assert.throws(()=>createMultiLessonRegistry(dup,trusted),/FB2_ENTRY_INVALID/);
 for(const field of ['releaseReady','defaultFeatureFlag']){
  const unsafe=c(catalog);unsafe[field]=true;
  assert.throws(()=>createMultiLessonRegistry(unsafe,trusted),/FB2_CATALOG_INVALID/);
 }
});
t('pending lessons cannot carry a full approved bundle with pending status',()=>{
 const altered=c(catalog),e=altered.lessons[1];
 Object.assign(e,{sourceRef:'X_SOURCE',rendererRef:'X_RENDER',policyReviewRef:'X_POLICY',
 qaEvidenceRef:'X_QA',trustedAdapterId:'X_ADAPTER'});
 assert.throws(()=>createMultiLessonRegistry(altered,trusted),/FB2_PENDING_CANNOT_SELF_APPROVE/);
});
t('B20 data and inherited F-B.1 remain unchanged',()=>{
 const {buildCandidate,createGovernance}=require('./fb-lesson-release-gate.cjs');
 const b21=createGovernance({candidate:buildCandidate()});
 assert.equal(b21.check(req()).ok,true);
 const data=fs.readFileSync(path.resolve(__dirname,'../../bai-20-bien-the/runtime.json'));
 const sha=require('node:crypto').createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
 assert.equal(sha,'b14d556c5deeb561106e0c81f275387bef538842');
});
console.log(JSON.stringify({suite:'P0.6-FB2-ISOLATED-MULTI-LESSON-GOVERNANCE',passed,failed:0,
 b21:'INHERITED_PASS',otherLessons:'BLOCKED',releaseReady:false,noWrites:true}));
