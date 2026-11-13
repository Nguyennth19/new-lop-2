'use strict';
/** Read-only QA evidence exporter: no raw student data. */
const {generator}=require('./policy-generator-fixtures-v1.cjs');
const r=generator.generate({lessonId:'toan_b21',templateId:'B21_CARRY_ADD_V1',count:3,seed:'B21_E02_RELEASE_QA'});
if(!r.ok||r.status!=='CANDIDATES_PENDING_APPROVAL'||r.results.some(x=>x.receipt.status==='PASS_FOR_TEST'))
 throw Error('UNSAFE_GENERATION_RESULT');
console.log(JSON.stringify({version:'p0.6-e02-generator-receipts-v1',scope:'OFFLINE_ONLY',status:r.status,
 lessonId:r.lessonId,policySha256:r.policySha256,policyStatus:r.sourcePolicyStatus,
 generationMode:r.generationMode,noWrites:r.noWrites,noStars:r.noStars,
 receipts:r.results.map(x=>({id:x.question.id,value:x.question.answerSpec.value,
  receiptSha256:x.receipt.receiptSha256,sourceSha256:x.receipt.sourceSha256,
  verdict:x.receipt.status,gates:Object.fromEntries(Object.entries(x.receipt.gates).map(([id,g])=>[id,g.status]))}))}));
