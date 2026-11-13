'use strict';
/** P0.6-C: immutable, privacy-minimal QA receipt; deterministic and offline.
 * Records fixture and source digests, not student input, names or answer text.
 */
const crypto=require('node:crypto');
const {auditAnswerSpec}=require('./grading-contract-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
function auditLesson(lesson,context={}){
 const shape=validateLesson(lesson);
 const report={version:'p0.6-qa-engine-v1',scope:'OFFLINE_ONLY',lessonId:lesson&&lesson.lessonId||null,
  sourceSha256:hash(lesson),sourceCommit:/^[a-f0-9]{40}$/.test(context.sourceCommit||'')?context.sourceCommit:null,
  schemaValid:shape.ok,questions:0,verified:0,needsReview:0,blocked:0,failed:0,
  records:[],noWrites:true,noStars:true,studentDataIncluded:false,status:'BLOCKED'};
 if(!shape.ok){report.validationErrors=shape.errors.map(x=>x.code);return report;}
 for(const q of lesson.questions){
  const a=auditAnswerSpec(q);
  report.questions++;
  if(a.status==='PASS')report.verified++;
  else if(a.status==='REVIEW_REQUIRED')report.needsReview++;
  else if(a.status==='FAIL')report.failed++;
  else report.blocked++;
  report.records.push({questionId:q.id,status:a.status,code:a.code});
 }
 report.status=report.failed||report.blocked?'BLOCKED':report.needsReview?'REVIEW_REQUIRED':'PASS';
 report.receiptSha256=hash({lessonId:report.lessonId,sourceSha256:report.sourceSha256,records:report.records,status:report.status});
 return report;
}
module.exports={auditLesson,hash};
