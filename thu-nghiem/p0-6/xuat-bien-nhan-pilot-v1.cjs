'use strict';
/** Only prints public fixture receipt hashes and IDs. No input answers or student data. */
const {runPilot}=require('./multi-lesson-pilot-v1.cjs');
const lessons=['toan_b21','tieng_viet_doc_hieu_pilot'];
const results=lessons.map(id=>{
 const r=runPilot(id);
 if(!r.ok||r.status!=='TECHNICAL_PASS_PEDAGOGY_PENDING'||r.grading!=='REVIEW_REQUIRED')
  throw Error('PILOT_NOT_IN_SAFE_STAGING_STATE:'+id);
 return {lessonId:id,status:r.status,contract:r.contract,render:r.renderer,
  sourceSha256:r.qaReceipt.sourceSha256,receiptSha256:r.qaReceipt.receiptSha256,
  recordStatuses:r.qaReceipt.records.map(x=>({questionId:x.questionId,status:x.status,code:x.code})),
  noWrites:r.noWrites,noStars:r.noStars};
});
console.log(JSON.stringify({version:'p0.6-e-receipt-v1',scope:'OFFLINE_ONLY',lessonCount:results.length,results}));
