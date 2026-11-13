'use strict';
/** F-B.3 separate B20 JSON version proof and logical rollback receipt (QA artifact only). */
const fs=require('node:fs'),path=require('node:path');
const {verify,evidence,BLOB}=require('./fb3-b20-independent-verifier.cjs');
const {createB21OnlyMultiLessonRegistry}=require('./fb2-trusted-adapters.cjs');
const r=createB21OnlyMultiLessonRegistry();
const q={featureFlag:true,environment:'ISOLATED_TEST',lessonId:'toan_b20',
 lessonVersion:'p0.6-fb-test-b20-v1',allowStudentUse:false,deploy:false,persist:false,
 awardStars:false,releaseReady:false};
const proof=verify(q),gate=r.select(q);
if(!proof.ok||!gate.ok||proof.contentSha256!==gate.contentSha256||proof.policySha256!==gate.policySha256||
 proof.receiptSha256!==gate.receiptSha256||proof.questions!==30)throw Error('FB3_B20_RECEIPT_NOT_VERIFIED');
const rollback=r.rollback('toan_b20','ISOLATED_TEST_STOP');
if(!rollback.ok||rollback.lessonId!=='toan_b20'||rollback.featureFlag!==false)throw Error('FB3_ROLLBACK_FAILED');
const receipt={
 schemaVersion:'p0.6.fb3.independent-lesson-receipt.v1',lessonId:'toan_b20',
 lessonVersion:'p0.6-fb-test-b20-v1',origin:'H1_IMMUTABLE_B20',
 sourceGitBlobSha:BLOB.source,pedagogyOwnerRecordGitBlobSha:BLOB.h2,
 sourceRef:evidence.sourceRef,rendererRef:evidence.rendererRef,
 policyReviewRef:evidence.policyReviewRef,qaEvidenceRef:evidence.qaEvidenceRef,
 rendererGitBlobs:{r41:BLOB.r41,a42:BLOB.a42,g26:BLOB.g26},
 contentSha256:proof.contentSha256,policySha256:proof.policySha256,
 receiptSha256:proof.receiptSha256,questionCount:30,sessionCount:6,
 browserRunId:evidence.qaRunId,browserTestCommit:evidence.qaCommit,
 status:'INDEPENDENT_ISOLATED_TEST_ONLY',rollback,
 noStudentData:true,noWrites:true,noStars:true,deploymentAuthorized:false,releaseReady:false};
const dir=path.join(__dirname,'fb3-b20-browser-evidence');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'b20-independent-qa-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:'FB3_B20_INDEPENDENT_RECEIPT_PASS',lessonId:receipt.lessonId,
 sourceGitBlobSha:receipt.sourceGitBlobSha,questions:30,rollbackStatus:rollback.status,
 releaseReady:false}));
