'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {buildCandidate,createGovernance}=require('./fb-lesson-release-gate.cjs');
const {createDemo}=require('../composer-fixtures-v1.cjs');
const c=buildCandidate(),gate=createGovernance({candidate:c});
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name)};
const request=()=>({featureFlag:true,environment:'ISOLATED_TEST',lessonId:'toan_b21',
 lessonVersion:'p0.6-fb-test-b21-v1',allowStudentUse:false,deploy:false,
 persist:false,awardStars:false,releaseReady:false});
test('inherits exact F-A accepted source hashes and E03 composer output',()=>{
 const r=createDemo();
 assert.equal(c.contentSha256,r.report.lessonSha256);
 assert.equal(c.policySha256,r.report.policySha256);
 assert.equal(c.receiptSha256,r.report.receiptSha256);
 assert.equal(r.coverage.total,8);
});
test('preview only with explicit TEST feature flag can resolve',()=>{
 const v=gate.check(request());assert.equal(v.ok,true);
 assert.equal(v.status,'ISOLATED_TEST_PREVIEW_ONLY');
 assert.deepEqual(v.byLevel,{LV1:4,LV2:2,LV3:2});
 assert.equal(v.deploymentAuthorized,false);assert.equal(v.releaseReady,false);
});
test('feature flag defaults off, impossible to self-activate',()=>{
 assert.equal(gate.check({}).code,'FB_FEATURE_FLAG_OFF');
 assert.equal(gate.check({...request(),featureFlag:false}).code,'FB_FEATURE_FLAG_OFF');
});
test('reject environment and lesson scope escalation',()=>{
 assert.equal(gate.check({...request(),environment:'PRODUCTION'}).code,'FB_ENVIRONMENT_DENIED');
 assert.equal(gate.check({...request(),lessonId:'toan_b20'}).code,'FB_LESSON_NOT_ALLOWED');
 assert.equal(gate.check({...request(),lessonVersion:'p0.6-fb-test-b21-v2'}).code,'FB_VERSION_MISMATCH');
});
test('block student use, deploy, persisted grade and stars',()=>{
 for(const [field,value] of [['allowStudentUse',true],['deploy',true],['persist',true],
  ['awardStars',true],['releaseReady',true]])
 assert.equal(gate.check({...request(),[field]:value}).code,'FB_FORBIDDEN_CAPABILITY',field);
});
test('reject policy/content/receipt drift without modifying source',()=>{
 for(const field of ['contentSha256','policySha256','receiptSha256']){
  const bad={...c,[field]:'0'.repeat(64)};
  assert.equal(createGovernance({candidate:bad}).check(request()).code,'FB_SOURCE_DRIFT');
 }
});
test('fail closed on tainted source or incomplete composition',()=>{
 const r=createDemo();r.lesson.questions.pop();
 const tainted=createGovernance({candidate:c,compose:()=>({...r,coverage:{...r.coverage,total:7}})});
 assert.equal(tainted.check(request()).code,'FB_SOURCE_DRIFT');
});
test('reject an unsafe or unsigned candidate',()=>{
 for(const patch of [{allowStudentUse:true},{releaseReady:true},{deploymentAuthorized:true},
  {g5:'BLOCKED'},{g7:'PENDING'},{g8:'PENDING'},{qaRunId:0},
  {environment:'PRODUCTION'},{rollbackTarget:'DEPLOY_PREVIOUS'}]){
  assert.throws(()=>createGovernance({candidate:{...c,...patch}}),/FB_CANDIDATE_NOT_SAFE/);
 }
});
test('rollback affects only B21 and never activates another lesson',()=>{
 const r=gate.rollback('TEST_END');assert.equal(r.featureFlag,false);
 assert.equal(r.lessonId,'toan_b21');assert.equal(r.status,'ROLLED_BACK_TO_BLOCKED_DEFAULT');
 assert.equal(r.deploymentAuthorized,false);assert.equal(r.releaseReady,false);
});
test('source B20 H1 runtime untouched and no persisted API in governance',()=>{
 const q=fs.readFileSync(path.resolve(__dirname,'../../bai-20-bien-the/runtime.json'));
 const crypto=require('node:crypto');
 const sha=crypto.createHash('sha1').update('blob '+q.length+'\0').update(q).digest('hex');
 assert.equal(sha,'b14d556c5deeb561106e0c81f275387bef538842');
 const src=fs.readFileSync(path.join(__dirname,'fb-lesson-release-gate.cjs'),'utf8');
 assert.doesNotMatch(src,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|localStorage\s*\.|fetch\s*\(/);
});
console.log(JSON.stringify({suite:'P0.6-FB-PER-LESSON-TEST-GOVERNANCE',passed:count,failed:0,
 priorFAQA:43454026078,releaseReady:false,noStudentData:true}));
