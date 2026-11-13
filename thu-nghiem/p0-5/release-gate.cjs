#!/usr/bin/env node
'use strict';
/* P0.5 pure release gate — evidence evaluation only, no network, DB, Sheets, grading or UI.
 * Static CI is verified separately by GitHub Actions. Other gates need explicit
 * documented TEST deployment evidence, not assumed from offline PASS.
 */
const fs=require('node:fs');
const STATES=Object.freeze({PASS:'PASS',FAIL:'FAIL',PENDING:'PENDING'});
const EXPECTED_SESSIONS=Object.freeze({'LV1-A':6,'LV1-B':6,'LV2-A':5,'LV2-B':5,'LV3-A':4,'LV3-B':4});
const EXPECTED_IDS=Object.keys(EXPECTED_SESSIONS);
const code=(gate,reason)=>({gate,code:reason});
const isObject=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const hex40=s=>typeof s==='string'&&/^[a-f0-9]{40}$/i.test(s);
const safeText=s=>typeof s==='string'&&s.trim().length>0;
function gateResult(ok,missing,errors) {
 return {status:errors.length?STATES.FAIL:missing.length?STATES.PENDING:ok?STATES.PASS:STATES.PENDING,missing,errors};
}
function assess(evidence){
 const e=isObject(evidence)?evidence:{};
 const output={version:'p0.5-release-gate-v1',lessonId:'toan_b20',
   status:'BLOCKED',releaseReady:false,gates:{},errors:[],
   provenance:'DECLARED_EVIDENCE_REQUIRES_INDEPENDENT_VERIFICATION',
   checkedAt:null};
 const staticErrors=[],staticMissing=[];
 const ci=e.staticCi;
 if(!isObject(ci))staticMissing.push('CI_RUN_EVIDENCE');
 else {
  if(ci.conclusion!=='success')staticErrors.push('CI_NOT_SUCCESS');
  if(!hex40(ci.sha))staticErrors.push('CI_COMMIT_SHA_INVALID');
  if(!Number.isSafeInteger(ci.runId)||ci.runId<=0)staticErrors.push('CI_RUN_ID_INVALID');
  const required=['FAST','FULL_SAFE','UI_REGRESSION'];
  for(const mode of required){
   if(!ci.modes||ci.modes[mode]!=='PASS')staticErrors.push('CI_MODE_'+mode+'_NOT_PASS');
  }
  if(ci.scope!=='OFFLINE_ONLY')staticErrors.push('CI_SCOPE_INVALID');
 }
 output.gates.STATIC=gateResult(true,staticMissing,staticErrors);
 const webErrors=[],webMissing=[];
 const web=e.webapp;
 if(!isObject(web))webMissing.push('TEST_DEPLOYMENT_EVIDENCE');
 else {
  if(web.environment!=='TEST')webErrors.push('WEBAPP_NOT_TEST');
  if(!safeText(web.deploymentId)||!safeText(web.sourceCommit))webMissing.push('WEBAPP_ID_AND_COMMIT');
  if(web.ping!=='PASS'||web.load!=='PASS')webMissing.push('WEBAPP_PING_AND_LOAD');
  if(web.noWrites!==true||web.noStars!==true)webErrors.push('WEBAPP_NO_WRITE_NOT_CONFIRMED');
  if(web.sheetBindingVerified!==true)webMissing.push('TEST_SHEET_BINDING_VERIFICATION');
  if(web.approvalFlagReset!==true)webMissing.push('P03_FLAG_LOCK_CONFIRMATION');
 }
 output.gates.WEBAPP=gateResult(true,webMissing,webErrors);
 const sessionErrors=[],sessionMissing=[];
 const s=e.sessions;
 if(!isObject(s)||!Array.isArray(s.results))sessionMissing.push('SIX_REAL_SESSION_RESULTS');
 else {
  const seen=new Set();
  for(const entry of s.results){
   if(!isObject(entry)||!Object.hasOwn(EXPECTED_SESSIONS,entry.sessionId)||seen.has(entry.sessionId)){
    sessionErrors.push('SESSION_ID_UNKNOWN_OR_DUPLICATE');continue;
   }
   seen.add(entry.sessionId);
   const expected=EXPECTED_SESSIONS[entry.sessionId];
   if(entry.total!==expected||entry.correct!==expected||entry.wrongCorrect!==0)
    sessionErrors.push('SESSION_GRADING_MISMATCH_'+entry.sessionId);
   if(entry.recorded!==false||entry.starsAwarded!==0)
    sessionErrors.push('SESSION_WRITE_CONTRACT_FAILED_'+entry.sessionId);
  }
  if(seen.size!==EXPECTED_IDS.length)sessionMissing.push('SIX_COMPLETE_SESSION_IDS');
  if(s.runtime!=='TEST_WEBAPP')sessionMissing.push('SESSIONS_NOT_FROM_REAL_TEST_WEBAPP');
 }
 output.gates.SESSIONS=gateResult(true,sessionMissing,sessionErrors);
 const browserErrors=[],browserMissing=[];
 const b=e.browser;
 if(!isObject(b))browserMissing.push('BROWSER_DEVICE_EVIDENCE');
 else {
  if(b.environment!=='TEST')browserErrors.push('BROWSER_NOT_TEST');
  if(b.desktop!=='PASS'||b.mobile!=='PASS')browserMissing.push('DESKTOP_MOBILE_SMOKE');
  if(b.visualBaseline!=='PASS'||b.inputFlow!=='PASS'||b.imageFallback!=='PASS')
    browserMissing.push('VISUAL_INPUT_FALLBACK');
  if(!safeText(b.evidenceRef))browserMissing.push('BROWSER_EVIDENCE_REFERENCE');
 }
 output.gates.BROWSER=gateResult(true,browserMissing,browserErrors);
 const pedagogyErrors=[],pedagogyMissing=[];
 const p=e.pedagogy;
 if(!isObject(p))pedagogyMissing.push('PEDAGOGY_OWNER_SIGNOFF');
 else{
  if(p.signedOff!==true)pedagogyMissing.push('PEDAGOGY_NOT_SIGNED');
  if(p.questionCount!==30||p.lessonId!=='toan_b20')pedagogyErrors.push('PEDAGOGY_SCOPE_INVALID');
  if(!safeText(p.reviewer)||!safeText(p.evidenceRef))pedagogyMissing.push('PEDAGOGY_REVIEWER_AND_REFERENCE');
  if(p.sourceStatus==='STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF')
   pedagogyErrors.push('SOURCE_EXPLICITLY_UNSIGNED');
 }
 output.gates.PEDAGOGY=gateResult(true,pedagogyMissing,pedagogyErrors);
 for(const [name,gate] of Object.entries(output.gates))
  for(const error of gate.errors)output.errors.push(code(name,error));
 output.releaseReady=Object.values(output.gates).every(g=>g.status===STATES.PASS);
 output.status=output.releaseReady?'RELEASE_READY':'RELEASE_BLOCKED';
 return output;
}
if(require.main===module){
 let input={};
 try{
  if(process.argv[2])input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const output=assess(input);console.log(JSON.stringify(output));
  // The gate is a test: pending release != script malfunction, but exit failure
  // prevents any automated deployment from treating it as approved.
  if(!output.releaseReady)process.exitCode=1;
 }catch(e){console.error(JSON.stringify({version:'p0.5-release-gate-v1',status:'RELEASE_BLOCKED',
   errors:[code('INPUT','INVALID_EVIDENCE_FILE')]}));process.exitCode=1;}
}
module.exports={assess,EXPECTED_SESSIONS};
