'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {assess,checkLock,prospective,gitBlobSha}=require('./owner-evidence-lock-validator.cjs');
const intake=require('./owner-decision-intake.pending.v1.json'),lock=require('./approval-evidence-lock.v1.json');
const cp=require('./checkpoint.c085.v1.json'),base=require('../g7-6-b6-c084/owner-signoff-gate.pending.v1.json');
let n=0;const eq=(x,y)=>{assert.deepEqual(x,y);n++},yes=x=>{assert.ok(x);n++};
eq(intake.records.length,6);eq(lock.evidenceFiles.length,9);eq(intake.trustAnchors.activeCount,0);eq(intake.allSixSigned,false);
eq(base.approvedTrustAnchors.length,0);eq(intake.allowTESTRegistration,false);eq(lock.permissions.p06Test,false);
for(const x of intake.records){eq(x.currentStatus,'PENDING_NO_SUBMITTED_OWNER_DECISION');eq(x.submittedSignature,null);eq(x.validCryptoProof,false);eq(x.independentlyAuthorized,false);eq(x.ownerDecisionRecorded,false);eq(x.approvedScope.length,0);}
eq(assess().code,'AUTHORIZED_TRUST_ANCHORS_ABSENT');
eq(assess(intake.records.slice(1)).code,'SIX_UNIQUE_PACKETS_REQUIRED');
eq(assess([...intake.records.slice(0,5),intake.records[0]]).code,'SIX_UNIQUE_PACKETS_REQUIRED');
const modified=intake.records.map((x,i)=>i===0?{...x,currentStatus:'VERIFIED'}:x);
eq(assess(modified).code,'UNVERIFIED_MARKED_VERIFIED_C08-D5');
eq(assess(intake.records.map((x,i)=>i===0?{...x,expectedScope:'B065'}:x)).code,'ROLE_SCOPE_EXPECTATION_MISMATCH_C08-D5');
eq(assess(intake.records.map((x,i)=>i===0?{...x,evidenceSourceCommit:'bad'}:x)).code,'EVIDENCE_BASE_COMMIT_MISMATCH_C08-D5');
eq(assess(intake.records.map((x,i)=>i===0?{...x,currentStatus:'RECEIVED_UNVERIFIED'}:x)).code,'EVIDENCE_LINK_REQUIRED_C08-D5');
eq(assess(intake.records.map((x,i)=>i===0?{...x,ownerDecisionRecorded:true}:x)).code,'OWNER_DECISION_NOT_CONFIRMED_BY_AUTHORITY_C08-D5');
const full=assess(intake.records,[{keyId:'UNAUTHORIZED_PLACEHOLDER'}]);eq(full.code,'SIGNATURE_OR_AUTHORITY_UNVERIFIED');
const lockCheck=checkLock({readFile:p=>fs.readFileSync(path.resolve(__dirname,'../../',p)),blobSha:gitBlobSha});eq(lockCheck.ok,true);eq(lockCheck.ownerApproved,false);
const bad=checkLock({readFile:p=>Buffer.concat([fs.readFileSync(path.resolve(__dirname,'../../',p)),Buffer.from('!')]),blobSha:gitBlobSha});eq(bad.code.startsWith('LOCKED_GIT_BLOB_CHANGED_'),true);
const sim=prospective();eq(sim.ok,false);eq(sim.testRegistrationAllowed,false);
for(const x of Object.values(cp.protectedChanges))eq(x,false);
eq(cp.counts.signedOwnerDecisions,0);eq(cp.counts.registeredLessonIds,0);eq(cp.gates.C08,'PENDING');eq(cp.gates.C09,'PENDING');
if(process.argv[2]){const cat=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../',process.argv[2],'thu-nghiem/p0-6/fb/fb2-lesson-catalog.candidate.json'),'utf8'));eq(cat.schemaVersion,'p0.6.fb2.catalog.v1');for(const id of ['toan_b27','toan_b65'])yes(!cat.lessons.some(x=>x.lessonId===id));}
console.log('C085_OWNER_INTAKE_EVIDENCE_LOCK_PASS',n,'assertions; all six owner records pending; no active registration');
