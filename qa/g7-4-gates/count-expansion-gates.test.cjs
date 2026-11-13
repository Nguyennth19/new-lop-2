'use strict';
const assert=require('node:assert/strict');
const {countDecision,composeCount,expansionDecision}=require('./count-expansion-gates.cjs');
const sha='a'.repeat(64);
const asset={assetId:'red_apple',sourceSha256:sha,visualApproval:'OWNER_VISUAL_APPROVED',countCategory:'SINGLE_OBJECT_CANDIDATE'};
const review={assetId:'red_apple',sourceSha256:sha,decision:'COUNT_SAFE_APPROVED',ownerApproved:true,objectsPerAsset:1,countUnit:'quả táo',render44pxEvidence:'evidence/red-apple-44.png',reviewer:'owner',reviewDate:'2026-11-13'};
const intake={conceptKey:'fruit.apple',subject:'TIENG_ANH',lessonId:'TA2-L01',usage:'VOCABULARY',proposedAssetId:'apple_new',sourceRepository:'microsoft/fluentui-emoji',sourceCommit:'b'.repeat(40),license:'MIT',licenseEvidence:'LICENSE',sha256:sha,securityQa:'PASS',visualQa:'OWNER_APPROVED',semanticQa:'OWNER_APPROVED'};
const tests=[
 ['current pilot must stay count-blocked',()=>assert.equal(countDecision(asset,null).ok,false)],
 ['explicit evidence can qualify a single object',()=>assert.equal(countDecision(asset,review).ok,true)],
 ['missing 44px evidence is blocked',()=>assert.equal(countDecision(asset,{...review,render44pxEvidence:null}).ok,false)],
 ['SHA drift is blocked',()=>assert.equal(countDecision(asset,{...review,sourceSha256:'b'.repeat(64)}).ok,false)],
 ['multi-object remains blocked even with owner signoff',()=>assert.equal(countDecision({...asset,countCategory:'COMPOSITE_BLOCKED'},review).ok,false)],
 ['owner false is blocked',()=>assert.equal(countDecision(asset,{...review,ownerApproved:false}).ok,false)],
 ['noninteger requested count blocked',()=>assert.equal(composeCount(asset,review,3.5).ok,false)],
 ['correct repetition has exact total',()=>assert.equal(composeCount(asset,review,3).totalObjects,3)],
 ['valid intake only eligible for review, not runtime',()=>{let x=expansionDecision(intake);assert.equal(x.ok,true);assert.equal(x.runtimeEnabled,false)}],
 ['duplicate ID requires reuse',()=>assert.ok(expansionDecision(intake,['apple_new']).reasons.includes('DUPLICATE_ID_USE_EXISTING'))],
 ['unverified license blocks',()=>assert.equal(expansionDecision({...intake,licenseEvidence:''}).ok,false)],
 ['count-intent needs separate count gate',()=>assert.ok(expansionDecision({...intake,usage:'COUNT_OBJECT'}).reasons.includes('COUNT_QA_REQUIRED'))],
 ['unsupported subject blocks',()=>assert.equal(expansionDecision({...intake,subject:'OTHER'}).ok,false)],
 ['floating source ref blocks',()=>assert.equal(expansionDecision({...intake,sourceCommit:'main'}).ok,false)]
];
let failures=0;for(const [name,test] of tests){try{test();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}}
console.log(tests.length-failures+'/'+tests.length,'PASS');process.exitCode=failures?1:0;
