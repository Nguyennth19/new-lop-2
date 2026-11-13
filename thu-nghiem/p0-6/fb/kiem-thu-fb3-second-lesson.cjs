'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createB21OnlyMultiLessonRegistry,catalog,trusted}=require('./fb2-trusted-adapters.cjs');
const {createMultiLessonRegistry}=require('./fb2-multi-lesson-registry.cjs');
const {verify,evidence,BLOB}=require('./fb3-b20-independent-verifier.cjs');
const {createDemo}=require('../composer-fixtures-v1.cjs');
const copy=structuredClone;
const r=createB21OnlyMultiLessonRegistry();
const request=(lessonId,lessonVersion)=>({featureFlag:true,environment:'ISOLATED_TEST',
 lessonId,lessonVersion,allowStudentUse:false,deploy:false,persist:false,awardStars:false,releaseReady:false});
const b20=()=>request('toan_b20','p0.6-fb-test-b20-v1');
const b21=()=>request('toan_b21','p0.6-fb-test-b21-v1');
let n=0;const test=(label,fn)=>{fn();n++;console.log('PASS '+label)};
test('both lessons are eligible for isolated TEST through distinct anchors',()=>{
 const a=r.select(b20()),b=r.select(b21());assert.equal(a.ok,true);assert.equal(b.ok,true);
 assert.equal(a.questions,30);assert.equal(b.questions,8);
 assert.equal(a.status,'ISOLATED_TEST_PREVIEW_ONLY');assert.equal(b.status,a.status);
 assert.equal(a.releaseReady,false);assert.equal(b.releaseReady,false);
});
test('B20 distinct source and policy hashes cannot equal B21 by accident',()=>{
 const a=r.select(b20()),b=r.select(b21());
 assert.notEqual(a.contentSha256,b.contentSha256);
 assert.notEqual(a.policySha256,b.policySha256);
 assert.notEqual(a.receiptSha256,b.receiptSha256);
 assert.equal(BLOB.source,'b14d556c5deeb561106e0c81f275387bef538842');
 assert.equal(evidence.qaRunId,43460267147);
});
test('B20 H1/H2 source stays unchanged and has independent 30/6 proof',()=>{
 const a=verify(b20());assert.equal(a.ok,true);assert.equal(a.questions,30);
 assert.equal(a.browserQaRunId,43460267147);
});
test('different lessonId/version cannot invoke B20 own verifier',()=>{
 const rejected=verify(b21());assert.equal(rejected.ok,false);
 assert.equal(r.select({...b20(),lessonVersion:'p0.6-fb-test-b20-v2'}).code,'FB2_VERSION_MISMATCH');
});
test('B21 anchor substituted for B20 is rejected',()=>{
 const fake=copy(catalog),x=fake.lessons.find(e=>e.lessonId==='toan_b20');
 x.trustedAdapterId='INHERITED_B21_F_B_1';
 const t=createMultiLessonRegistry(fake,trusted);
 assert.equal(t.select(b20()).code,'FB2_TRUST_ANCHOR_MISSING_OR_MISMATCH');
});
test('B20 anchor substituted for B21 is rejected',()=>{
 const fake=copy(catalog),x=fake.lessons.find(e=>e.lessonId==='toan_b21');
 x.trustedAdapterId='INDEPENDENT_B20_F_B_3';
 const t=createMultiLessonRegistry(fake,trusted);
 assert.equal(t.select(b21()).code,'FB2_TRUST_ANCHOR_MISSING_OR_MISMATCH');
});
test('foreign B24 and Vietnamese lessons remain blocked',()=>{
 assert.equal(r.select(request('toan_b24','p0.6-fb-test-b24-v1')).code,'FB2_INDEPENDENT_QA_REQUIRED');
 assert.equal(r.select(request('tieng_viet_doc_hieu','p0.6-fb-test-tv-v1')).code,'FB2_INDEPENDENT_QA_REQUIRED');
});
test('B20 and B21 rollback receipts are individually scoped, not global mutable writes',()=>{
 const a=r.rollback('toan_b20','END_B20'),b=r.rollback('toan_b21','END_B21');
 assert.equal(a.lessonId,'toan_b20');assert.equal(b.lessonId,'toan_b21');
 assert.equal(a.featureFlag,false);assert.equal(b.featureFlag,false);
 assert.equal(r.select(b21()).ok,true);assert.equal(r.select(b20()).ok,true);
});
test('both lessons default to blocked and cannot use production or persistence',()=>{
 assert.equal(r.select({...b20(),featureFlag:false}).code,'FB2_FLAG_OFF');
 assert.equal(r.select({...b21(),featureFlag:false}).code,'FB2_FLAG_OFF');
 for(const req of [b20(),b21()]){
  assert.equal(r.select({...req,environment:'PRODUCTION'}).code,'FB2_ENVIRONMENT_DENIED');
  assert.equal(r.select({...req,persist:true}).code,'FB2_CAPABILITY_DENIED');
  assert.equal(r.select({...req,awardStars:true}).code,'FB2_CAPABILITY_DENIED');
  assert.equal(r.select({...req,deploy:true}).code,'FB2_CAPABILITY_DENIED');
 }
});
test('B20 trust evidence is independent of B21 E03 Composer fixtures',()=>{
 const data=fs.readFileSync(path.join(__dirname,'fb3-b20-independent-verifier.cjs'),'utf8');
 assert.doesNotMatch(data,/createDemo|composer-fixtures|B21_.*_SHA/);
 const b21Result=createDemo();assert.equal(b21Result.ok,true);
 assert.equal(b21Result.lesson.questions.length,8);
});
test('registry retains four unique lessons and no production flags',()=>{
 const list=r.list();assert.equal(list.length,4);
 assert.equal(new Set(list.map(x=>x.lessonId)).size,4);
 assert.equal(list.filter(x=>x.hasIndependentEvidence).length,2);
 const raw=JSON.parse(fs.readFileSync(path.join(__dirname,'fb2-lesson-catalog.candidate.json'),'utf8'));
 assert.equal(raw.defaultFeatureFlag,false);assert.equal(raw.releaseReady,false);
 assert(raw.lessons.every(x=>x.allowStudentUse===false&&x.deploy===false&&x.releaseReady===false));
});
console.log(JSON.stringify({suite:'P0.6-FB3-SECOND-LESSON-INDEPENDENT-ONBOARDING',passed:n,failed:0,
 b20:30,b21:8,qaB20:43460267147,releaseReady:false}));
