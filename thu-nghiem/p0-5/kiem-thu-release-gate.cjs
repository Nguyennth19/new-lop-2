#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {assess,EXPECTED_SESSIONS}=require('./release-gate.cjs');
let passed=0,failed=0;
function test(name,fn){try{fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+':'+e.message)}}
const baseline=()=>({
 staticCi:{conclusion:'success',runId:43268208017,sha:'c84b93802df59a6861e5e37d770eef13e56eb66a',
  modes:{FAST:'PASS',FULL_SAFE:'PASS',UI_REGRESSION:'PASS'},scope:'OFFLINE_ONLY'},
 webapp:{environment:'TEST',deploymentId:'qa-test-deployment',sourceCommit:'c84b93802df59a6861e5e37d770eef13e56eb66a',
  ping:'PASS',load:'PASS',noWrites:true,noStars:true,sheetBindingVerified:true,approvalFlagReset:true},
 sessions:{runtime:'TEST_WEBAPP',results:Object.entries(EXPECTED_SESSIONS).map(([sessionId,total])=>({
  sessionId,total,correct:total,wrongCorrect:0,recorded:false,starsAwarded:0}))},
 browser:{environment:'TEST',desktop:'PASS',mobile:'PASS',visualBaseline:'PASS',inputFlow:'PASS',
  imageFallback:'PASS',evidenceRef:'qa://browser-test-artefact'},
 pedagogy:{signedOff:true,questionCount:30,lessonId:'toan_b20',reviewer:'pedagogy-reviewer',
   sourceStatus:'PEDAGOGY_SIGNED_OFF',evidenceRef:'qa://signed-review'}
});
const clone=v=>JSON.parse(JSON.stringify(v));
test('no evidence cannot release',()=>{const r=assess({});assert.equal(r.releaseReady,false);assert.equal(r.status,'RELEASE_BLOCKED');assert.equal(Object.values(r.gates).filter(x=>x.status==='PENDING').length,5)});
test('complete synthetic fixtures exercise release state (NOT real approval)',()=>assert.equal(assess(baseline()).releaseReady,true));
test('static missing mode blocks',()=>{const x=baseline();x.staticCi.modes.FULL_SAFE='FAIL';assert.equal(assess(x).gates.STATIC.status,'FAIL')});
test('wrong environment blocks',()=>{const x=baseline();x.webapp.environment='PROD';assert.equal(assess(x).releaseReady,false)});
test('missing TEST sheet binding blocks',()=>{const x=baseline();x.webapp.sheetBindingVerified=false;assert.equal(assess(x).gates.WEBAPP.status,'PENDING')});
test('P03 flag not reset blocks',()=>{const x=baseline();x.webapp.approvalFlagReset=false;assert.equal(assess(x).releaseReady,false)});
test('missing sixth session blocks',()=>{const x=baseline();x.sessions.results.pop();assert.equal(assess(x).gates.SESSIONS.status,'PENDING')});
test('duplicate ID blocks',()=>{const x=baseline();x.sessions.results[5].sessionId=x.sessions.results[0].sessionId;assert.equal(assess(x).gates.SESSIONS.status,'FAIL')});
test('wrong grading blocks',()=>{const x=baseline();x.sessions.results[0].wrongCorrect=1;assert.equal(assess(x).releaseReady,false)});
test('unapproved star blocks',()=>{const x=baseline();x.sessions.results[0].starsAwarded=1;assert.equal(assess(x).gates.SESSIONS.status,'FAIL')});
test('offline session test not accepted as webapp',()=>{const x=baseline();x.sessions.runtime='OFFLINE';assert.equal(assess(x).gates.SESSIONS.status,'PENDING')});
test('browser smoke pending blocks',()=>{const x=baseline();x.browser.mobile='PENDING';assert.equal(assess(x).gates.BROWSER.status,'PENDING')});
test('unsigned pedagogy blocks',()=>{const x=baseline();x.pedagogy.signedOff=false;assert.equal(assess(x).releaseReady,false)});
test('staging source unsigned blocks even with mistaken signoff',()=>{const x=baseline();x.pedagogy.sourceStatus='STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF';assert.equal(assess(x).gates.PEDAGOGY.status,'FAIL')});
test('invalid CI SHA blocks',()=>{const x=baseline();x.staticCi.sha='fake';assert.equal(assess(x).gates.STATIC.status,'FAIL')});
console.log(JSON.stringify({suite:'P0.5-gate-contract',passed,failed}));
if(failed)process.exitCode=1;
