'use strict';
/** E03 deterministic, sanitized multi-family QA report. */
const {createDemo,manifest}=require('./composer-fixtures-v1.cjs');
const result=createDemo();
if(!result.ok||result.status!=='COMPOSED_TECHNICAL_PASS_REVIEW_PENDING'||
 result.report.qa.records.some(r=>r.status==='PASS_FOR_TEST'))
 throw Error('E03_CANDIDATE_NOT_SAFE');
console.log(JSON.stringify({version:'p0.6-e03-receipt-v1',lessonId:manifest.lessonId,
 status:result.status,manifestSha256:result.report.manifestSha256,
 policySha256:result.report.policySha256,lessonSha256:result.report.lessonSha256,
 receiptSha256:result.report.receiptSha256,coverage:result.coverage,
 review:'PENDING',noWrites:true,noStars:true,
 gateMatrix:result.report.qa.records.map(r=>({questionId:r.questionId,
 levelId:r.levelId,sessionId:r.sessionId,familyId:r.familyId,skillId:r.skillId,
 status:r.status,gates:r.gateStatus,sha:r.receiptSha256}))}));
