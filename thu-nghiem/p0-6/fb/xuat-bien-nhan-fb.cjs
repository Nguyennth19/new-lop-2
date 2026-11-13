'use strict';
/** F-B controlled export: JSON-first lesson-version candidate + blocked rollback snapshot.
 * Writes ephemeral GitHub Actions artifact only, never writes to source/store/Apps Script.
 */
const fs=require('node:fs'),path=require('node:path');
const {buildCandidate,createGovernance}=require('./fb-lesson-release-gate.cjs');
const {hash}=require('../variant-policy-registry-v1.cjs');
const candidate=buildCandidate();
const gate=createGovernance({candidate});
const request={featureFlag:true,environment:'ISOLATED_TEST',lessonId:'toan_b21',
 lessonVersion:candidate.lessonVersion,allowStudentUse:false,deploy:false,
 persist:false,awardStars:false,releaseReady:false};
const inspected=gate.check(request);
if(!inspected.ok||inspected.status!=='ISOLATED_TEST_PREVIEW_ONLY')throw Error('FB_EXPORT_NOT_ALLOWED');
const receipt={schemaVersion:'p0.6.fb.qa-receipt.v1',lessonId:candidate.lessonId,
 lessonVersion:candidate.lessonVersion,decision:'TEST_PREVIEW_ONLY',candidateHash:hash(candidate),
 contentSha256:inspected.contentSha256,policySha256:inspected.policySha256,
 receiptSha256:inspected.receiptSha256,questions:inspected.questions,
 byLevel:inspected.byLevel,rollback:gate.rollback('TEST_END'),
 inheritedRunId:43454026078,
 noStudentData:true,noWrites:true,noStars:true,
 deploymentAuthorized:false,releaseReady:false};
const folder=path.join(__dirname,'generated-fb-evidence');
fs.mkdirSync(folder,{recursive:true});
fs.writeFileSync(path.join(folder,'lesson-version.candidate.json'),JSON.stringify(candidate,null,2)+'\n');
fs.writeFileSync(path.join(folder,'fb-qa-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:'FB_TEST_PACKAGE_GENERATED',candidateHash:receipt.candidateHash,
 lessonId:receipt.lessonId,lessonVersion:receipt.lessonVersion,questions:receipt.questions,
 noWrites:true,releaseReady:false,files:2}));
