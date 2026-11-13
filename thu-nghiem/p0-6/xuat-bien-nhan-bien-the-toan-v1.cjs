'use strict';
/** Sanitized deterministic policy receipts. This is NOT an owner signature. */
const fs=require('node:fs'),path=require('node:path');
const {auditVariant}=require('./math-variant-validator-v1.cjs');
const lesson=JSON.parse(fs.readFileSync(path.join(__dirname,'pilot/toan_b21.candidate.json'),'utf8'));
const policy=JSON.parse(fs.readFileSync(path.join(__dirname,'pilot/toan_b21.variant-policy.candidate.json'),'utf8'));
const results=lesson.questions.map(q=>{
 const variant={questionId:q.id,skillId:'ADD_CARRY_REVIEW',variantLevel:'V1_SURFACE',mathKind:'ADD',
  visual:{role:'NONE'},interaction:{from:'NUMBER_INPUT',to:'NUMBER_INPUT',
  skillsBefore:['ADD_CARRY_REVIEW'],skillsAfter:['ADD_CARRY_REVIEW'],difficultyDelta:'EQUIVALENT'},
  renderer:{kind:q.kind,status:'READONLY_PREVIEW_PASS'},
  pedagogyApproval:{status:'PENDING'}};
 const r=auditVariant(lesson,policy,variant,{offlineOnly:true,noWrites:true,noStars:true});
 if(r.status==='PASS_FOR_TEST')throw Error('DRAFT_POLICY_MUST_NOT_PASS');
 return {questionId:r.questionId,status:r.status,sourceSha256:r.sourceSha256,
  receiptSha256:r.receiptSha256,gates:r.gates};
});
console.log(JSON.stringify({version:'p0.6-e01-qa-receipt-v1',policyId:policy.policyId,
 policyStatus:policy.status,scope:'OFFLINE_ONLY',lessonId:lesson.lessonId,
 noWrites:true,noStars:true,results}));
