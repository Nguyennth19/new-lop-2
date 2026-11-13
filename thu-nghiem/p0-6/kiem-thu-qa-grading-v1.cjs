'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {adaptB20}=require('./adapter-b20-v1.cjs');
const {auditAnswerSpec,gradeResponse}=require('./grading-contract-v1.cjs');
const {auditLesson}=require('./qa-engine-v1.cjs');
const raw=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../bai-20-bien-the/runtime.json'),'utf8'));
const clone=x=>structuredClone(x);
const lesson=adaptB20(raw);
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function proof(q){
 const t=q.legacy.type,p=q.parameters,a=q.answerSpec;
 if(t==='carry')a.proof={operation:'carry_tens',operands:[p.a,p.b]};
 else if(t==='reverse')a.proof={operation:'missing_addend',operands:[p.a+p.b,p.b]};
 else if(t==='three')a.proof={operation:'sum',operands:[p.a,p.b,p.c]};
 else a.proof={operation:'add',operands:[p.a,p.b]};
}
const verified=clone(lesson);verified.questions.forEach(proof);
test('All 30 B20 answers independently verified, no hardcoded answer list',()=>{
 for(const q of verified.questions)assert.equal(auditAnswerSpec(q).status,'PASS',q.id);
});
test('All B20 correct answers grade correctly',()=>{
 for(const q of verified.questions)assert.equal(gradeResponse(q,String(q.answerSpec.value)).status,'CORRECT',q.id);
});
test('All B20 wrong answers are marked wrong',()=>{
 for(const q of verified.questions)assert.equal(gradeResponse(q,String(q.answerSpec.value+1)).status,'INCORRECT',q.id);
});
test('All B20 blank answers are marked incorrect',()=>{
 for(const q of verified.questions)assert.equal(gradeResponse(q,'').code,'EMPTY_RESPONSE',q.id);
});
test('B20 pre-approved data without independent proof cannot auto-pass',()=>{
 assert.equal(auditAnswerSpec(lesson.questions[0]).status,'BLOCKED');
});
test('Arithmetic falsification detected independently',()=>{
 const q=clone(verified.questions[3]);q.answerSpec.value=100;assert.equal(auditAnswerSpec(q).code,'ANSWER_PROOF_MISMATCH');
});
test('Arithmetic parameter tampering detected',()=>{
 const q=clone(verified.questions[2]);q.answerSpec.proof.operands[0]+=1;assert.equal(auditAnswerSpec(q).status,'FAIL');
});
test('Reject missing or dangerous proof operation',()=>{
 const q=clone(verified.questions[2]);q.answerSpec.proof.operation='eval';assert.notEqual(auditAnswerSpec(q).status,'PASS');
});
test('Unapproved mathematical answer requires human review',()=>{
 const q=clone(verified.questions[2]);q.answerSpec.pedagogyApproval.status='PENDING';assert.equal(gradeResponse(q,'55').status,'REVIEW_REQUIRED');
});
test('Numeric grader does not coerce unsupported decimals',()=>{
 assert.equal(gradeResponse(verified.questions[2],'55.0').status,'INCORRECT');
});
function textQ(mode='set_of_answers'){
 const q=clone(verified.questions[1]);
 q.kind='language.spelling';q.renderer={component:'language.spelling'};
 q.answerSpec={mode,origin:'PROJECT_DERIVED',value:'quả táo',acceptedValues:['quả táo','trái táo'],
  normalization:{ignoreCase:false,trimWhitespace:true},
  verification:{type:'reviewed_reference',status:'PASS',evidence:{ref:'teacher-fixture-v1'}},
  pedagogyApproval:{status:'APPROVED_BY_TEACHER'}};
 return q;
}
test('Reviewed Vietnamese multiple valid answers accepted',()=>{
 const q=textQ();assert.equal(gradeResponse(q,'  trái   táo ').status,'CORRECT');
});
test('Unlisted Vietnamese synonym cannot be assumed correct',()=>{
 const q=textQ();assert.equal(gradeResponse(q,'táo').status,'INCORRECT');
});
test('Case sensitivity preserved unless explicitly authorized',()=>{
 const q=textQ();assert.equal(gradeResponse(q,'Quả táo').status,'INCORRECT');
 q.answerSpec.normalization.ignoreCase=true;assert.equal(gradeResponse(q,'Quả táo').status,'CORRECT');
});
test('Missing normalized text policy blocks grading',()=>{
 const q=textQ('normalized_text');delete q.answerSpec.normalization;assert.equal(gradeResponse(q,'quả táo').status,'BLOCKED');
});
test('Unreviewed English key does not auto-grade',()=>{
 const q=textQ('normalized_text');q.answerSpec.value='apple';q.answerSpec.verification.status='PENDING';
 assert.equal(gradeResponse(q,'apple').status,'REVIEW_REQUIRED');
});
test('Open response with rubric remains human review despite approval',()=>{
 const q=textQ('rubric');q.answerSpec.rubricRef='rubric-tiengviet-v1';
 assert.equal(gradeResponse(q,'Viết một đoạn văn hay.').status,'REVIEW_REQUIRED');
});
test('Manual review never auto-scores',()=>{
 const q=textQ('manual_review');assert.equal(gradeResponse(q,'Any response').status,'REVIEW_REQUIRED');
});
test('Invalid reviewed reference cannot bypass evidence',()=>{
 const q=textQ();q.answerSpec.verification.type='manual_review';delete q.answerSpec.verification.evidence;
 assert.equal(gradeResponse(q,'quả táo').status,'BLOCKED');
});
test('Self-consistent but forged math proof rejected against source parameters',()=>{
 const q=clone(verified.questions[2]);q.answerSpec.value=100;q.answerSpec.proof.operands=[70,30];
 assert.equal(auditAnswerSpec(q).code,'MATH_PROOF_SOURCE_MISMATCH');
});
test('Text review must include evidence ref',()=>{
 const q=textQ();q.answerSpec.verification.evidence={};
 assert.equal(gradeResponse(q,'trái táo').status,'BLOCKED');
 q.answerSpec.verification.evidence={ref:'fixture'};
 q.answerSpec.verification.type='deterministic_rule';
 assert.equal(gradeResponse(q,'trái táo').status,'BLOCKED');
});
test('Receipt for approved B20 is PASS with 30 records',()=>{
 const r=auditLesson(verified,{sourceCommit:'1dfa16c6dbde8045ab3f9145bc9f18bad08bd008'});
 assert.equal(r.status,'PASS');assert.equal(r.verified,30);assert.equal(r.records.length,30);
 assert.equal(r.noWrites,true);assert.equal(r.noStars,true);assert.equal(r.studentDataIncluded,false);
 assert.match(r.receiptSha256,/^[a-f0-9]{64}$/);
});
test('Receipt stable for same data; changes with altered answer',()=>{
 const a=auditLesson(verified);
 const b=auditLesson(clone(verified));assert.equal(a.receiptSha256,b.receiptSha256);
 const bad=clone(verified);bad.questions[0].answerSpec.value=40;
 const c=auditLesson(bad);assert.notEqual(c.receiptSha256,a.receiptSha256);assert.equal(c.status,'BLOCKED');
});
test('Receipt of open response is REVIEW_REQUIRED not PASS',()=>{
 const d=clone(verified);d.questions[0]=textQ('rubric');d.questions[0].id=verified.questions[0].id;
 d.questions[0].levelId=verified.questions[0].levelId;d.questions[0].sessionId=verified.questions[0].sessionId;
 d.questions[0].answerSpec.rubricRef='reviewed-rubric-v1';
 const receipt=auditLesson(d);assert.equal(receipt.status,'REVIEW_REQUIRED');assert.equal(receipt.needsReview,1);
});
test('Receipt rejects invalid lesson references',()=>{
 const d=clone(verified);d.sessions[0].questionIds.push('MISSING');
 assert.equal(auditLesson(d).status,'BLOCKED');
});
test('Receipt never contains raw response or student identity',()=>{
 const receipt=JSON.stringify(auditLesson(verified));
 assert.doesNotMatch(receipt,/profile_id|student_id|studentName|userAnswer|studentResponse/);
});
test('Audit is read-only and does not mutate source',()=>{
 const before=JSON.stringify(verified);auditLesson(verified);assert.equal(JSON.stringify(verified),before);
});
test('No external IO or student writes in engine',()=>{
 for(const name of ['grading-contract-v1.cjs','qa-engine-v1.cjs']){
  const s=fs.readFileSync(path.resolve(__dirname,name),'utf8');
  assert.doesNotMatch(s,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|fetch\s*\(/);
 }
});
console.log(JSON.stringify({suite:'p0.6-c-qa-grade-v1',passed:count,failed:0,
 questions:30,scope:'OFFLINE_ONLY',noWrites:true,noStars:true}));
