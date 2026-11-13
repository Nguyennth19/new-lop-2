'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {runPilot,loadCandidate,registry}=require('./multi-lesson-pilot-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const {auditAnswerSpec,gradeResponse,validateProof}=require('./grading-contract-v1.cjs');
const {createRendererRegistry,renderReadonlyPreview}=require('./question-renderer-registry-v1.cjs');
const clone=x=>structuredClone(x);
const math=loadCandidate('toan_b21');
const vi=loadCandidate('tieng_viet_doc_hieu_pilot');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('B21 source scope is the independently indexed curriculum lesson',()=>{
 assert.equal(math.lessonId,'toan_b21');assert.equal(math.curriculum.lessonRef,'MATH_B021');
 assert.match(math.source.references[0].ref,/MATH_B021/);
 assert.match(math.source.references[0].ref,/QA_B021_VALID/);
 assert.equal(math.source.questionOrigin,'PROJECT_ORIGINAL_VARIANT');
});
test('B21 first case preserves surveyed 67+3=70 reference',()=>{
 const q=math.questions[0];assert.deepEqual(q.parameters,{a:67,b:3});
 assert.equal(q.answerSpec.value,70);assert.equal(validateProof(q.answerSpec).status,'PASS');
});
test('B21 second case derived independently 48+7=55',()=>{
 const q=math.questions[1];assert.deepEqual(q.parameters,{a:48,b:7});
 assert.equal(q.answerSpec.value,55);assert.equal(validateProof(q.answerSpec).status,'PASS');
});
test('B21 pilot arithmetic remains within known carry-addition scope',()=>{
 for(const q of math.questions){
  const {a,b}=q.parameters;
  assert.equal(Number.isInteger(a)&&Number.isInteger(b),true);
  assert(a>=10&&a<100&&b>0&&b<100&&a+b<=100);
  assert((a%10)+(b%10)>=10);
  assert.equal(q.answerSpec.proof.operation,'add');
 }
});
test('B21 contract is valid without requiring six sessions',()=>{
 assert.equal(validateLesson(math).ok,true);assert.equal(math.sessions.length,1);assert.equal(math.questions.length,2);
});
test('Vietnamese candidate is original and source page not falsely verified',()=>{
 assert.equal(vi.subject,'tieng_viet');
 assert.equal(vi.source.questionOrigin,'PROJECT_ORIGINAL_VARIANT');
 assert.match(vi.source.references[1].ref,/not verified/);
 assert.equal(validateLesson(vi).ok,true);
});
test('Vietnamese unreviewed alternatives cannot auto grade',()=>{
 const q=vi.questions[0];
 assert.equal(auditAnswerSpec(q).status,'REVIEW_REQUIRED');
 assert.equal(gradeResponse(q,'đến lớp').status,'REVIEW_REQUIRED');
});
test('Math candidate is mathematically proven but pedagogically pending',()=>{
 for(const q of math.questions){
  assert.equal(validateProof(q.answerSpec).status,'PASS');
  assert.equal(auditAnswerSpec(q).status,'REVIEW_REQUIRED');
  assert.equal(gradeResponse(q,String(q.answerSpec.value)).status,'REVIEW_REQUIRED');
 }
});
test('Registry distinguishes two subjects and does not route to B20',()=>{
 assert.equal(registry.resolve('toan_b21').entry.subject,'toan');
 assert.equal(registry.resolve('tieng_viet_doc_hieu_pilot').entry.subject,'tieng_viet');
 assert.equal(registry.resolve('toan_b20').code,'LESSON_NOT_REGISTERED');
});
test('B21 full technical pipeline renders both questions as readonly',()=>{
 const r=runPilot('toan_b21');
 assert.equal(r.status,'TECHNICAL_PASS_PEDAGOGY_PENDING');
 assert.equal(r.load,'PASS');assert.equal(r.contract,'PASS');assert.equal(r.renderer,'READONLY_PREVIEW_PASS');
 assert.equal(r.grading,'REVIEW_REQUIRED');assert.equal(r.previews.length,2);
 assert(r.proofChecks.every(c=>c.proof==='PASS'&&c.approval==='REVIEW_REQUIRED'));
 assert(r.previews.every(p=>!p.interactive&&!p.graded&&!/<input|<button/i.test(p.html)));
});
test('Vietnamese full technical pipeline has no semantic auto scoring',()=>{
 const r=runPilot('tieng_viet_doc_hieu_pilot');
 assert.equal(r.status,'TECHNICAL_PASS_PEDAGOGY_PENDING');
 assert.equal(r.proofChecks[0].proof,'NOT_DETERMINISTIC');
 assert.equal(r.grading,'REVIEW_REQUIRED');assert.equal(r.previews[0].interactive,false);
});
test('Unknown lesson safely blocked',()=>{
 const r=runPilot('not_registered');
 assert.equal(r.status,'BLOCKED');assert.equal(r.ok,false);
});
test('QA receipts stable, have hashes, and contain no student answers',()=>{
 const a=runPilot('toan_b21'),b=runPilot('toan_b21');
 assert.equal(a.qaReceipt.receiptSha256,b.qaReceipt.receiptSha256);
 assert.match(a.qaReceipt.receiptSha256,/^[a-f0-9]{64}$/);
 assert.equal(a.noWrites,true);assert.equal(a.noStars,true);
 assert(!Object.hasOwn(a,'studentId'));
});
test('QA receipt changes when answer data changes',()=>{
 const {auditLesson}=require('./qa-engine-v1.cjs');
 const altered=clone(math);altered.questions[1].answerSpec.value=56;
 assert.notEqual(auditLesson(altered).receiptSha256,auditLesson(math).receiptSha256);
 assert.equal(validateProof(altered.questions[1].answerSpec).status,'FAIL');
});
test('No mutation of immutable candidate files during pipeline',()=>{
 for(const ref of ['toan_b21','tieng_viet_doc_hieu_pilot']){
  const a=JSON.stringify(loadCandidate(ref));runPilot(ref);assert.equal(JSON.stringify(loadCandidate(ref)),a);
 }
});
test('Preview sanitizes HTML injections',()=>{
 const registry=createRendererRegistry({'language.reading':renderReadonlyPreview});
 const q={id:'X',kind:'language.reading',renderer:{component:'language.reading'},prompt:'<script>alert(1)</script>'};
 const r=registry.render(q);assert.equal(r.status,'RENDERED');
 assert.doesNotMatch(r.html,/<script/);assert.match(r.html,/&lt;script/);
});
test('Pilot has NO external writes, HTML app integration or student persistence',()=>{
 const s=fs.readFileSync(path.join(__dirname,'multi-lesson-pilot-v1.cjs'),'utf8');
 assert.doesNotMatch(s,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|localStorage\s*\.|fetch\s*\(/);
});
test('B20 immutable source blob still matches H1',()=>{
 const bytes=fs.readFileSync(path.resolve(__dirname,'../bai-20-bien-the/runtime.json'));
 const sha=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(sha,'b14d556c5deeb561106e0c81f275387bef538842');
});
console.log(JSON.stringify({suite:'p0.6-e-multi-lesson',passed,failed:0,lessons:2,scope:'OFFLINE_ONLY',noWrites:true}));
