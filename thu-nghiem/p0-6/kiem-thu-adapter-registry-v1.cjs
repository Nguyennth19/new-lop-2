'use strict';
/** P0.6-B.3 pure offline compatibility QA. */
const assert=require('node:assert/strict');
const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const {createLessonRegistry}=require('./lesson-registry-v1.cjs');
const {adaptB20,BASELINE,KINDS}=require('./adapter-b20-v1.cjs');
const {selectLesson}=require('./lesson-selector-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const rawFile=path.resolve(__dirname,'../bai-20-bien-the/runtime.json');
const bytes=fs.readFileSync(rawFile),raw=JSON.parse(bytes);
const gitBlob=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
let passed=0;
function run(label,fn){fn();passed++;console.log('PASS '+label);}
const clone=x=>structuredClone(x);
const catalog={
 toan_b20:{lessonId:'toan_b20',subject:'toan',format:'legacy_b20',sourceRef:'immutable-h1-b20'},
 tieng_viet_demo:{lessonId:'tieng_viet_demo',subject:'tieng_viet',format:'contract_v1',sourceRef:'fixture-vietnamese'}
};
const vnFixture={schemaVersion:'lop2.lesson.v1',lessonId:'tieng_viet_demo',subject:'tieng_viet',
 curriculum:{grade:2,lessonRef:'demo'},contentVersion:'fixture-1',
 source:{questionOrigin:'PROJECT_ORIGINAL_VARIANT',references:[]},
 levels:[{id:'A',intent:'Đọc hiểu'}],
 sessions:[{id:'A1',levelId:'A',questionIds:['V1']}],
 questions:[{id:'V1',kind:'language.reading',levelId:'A',sessionId:'A1',prompt:'Câu kiểm thử giả lập',
 answerSpec:{mode:'rubric',origin:'PROJECT_DERIVED',rubricRef:'demo-rubric',verification:{type:'rubric_review',status:'PENDING'},pedagogyApproval:{status:'PENDING'}},
 renderer:{component:'language.reading'}}]};
const registry=createLessonRegistry(catalog,{legacy_b20:ref=>{assert.equal(ref,'immutable-h1-b20');return clone(raw);},
 contract_v1:()=>clone(vnFixture)});
const adapters={legacy_b20:adaptB20};
const fallback=()=>clone(raw);
run('B20 source blob locked',()=>assert.equal(gitBlob,BASELINE.sourceBlobSha));
run('Registry resolves B20 by lessonId',()=>assert.equal(registry.resolve('toan_b20').entry.subject,'toan'));
run('Registry resolves second subject',()=>assert.equal(registry.resolve('tieng_viet_demo').entry.subject,'tieng_viet'));
run('Unknown lesson refused',()=>assert.equal(registry.resolve('toan_b21').code,'LESSON_NOT_REGISTERED'));
run('Registry loader preserves lesson ID',()=>assert.equal(registry.load('toan_b20').data.lesson_id,'toan_b20'));
run('Contract passes validation',()=>assert.equal(validateLesson(adaptB20(raw)).ok,true));
const transformed=adaptB20(raw);
run('Thirty IDs, ordering, prompts, answers and parameters unchanged',()=>{
 assert.equal(transformed.questions.length,30);
 for(let i=0;i<30;i++){
  const before=raw.questions[i],after=transformed.questions[i];
  assert.equal(after.id,before.question_id);assert.equal(after.prompt,before.prompt);
  assert.equal(after.answerSpec.value,before.answer);assert.deepEqual(after.parameters,before.parameters);
  assert.equal(after.kind,KINDS[before.type]);
  assert.equal(after.legacy.solutionPrompt,before.solution_prompt);
  assert.equal(after.legacy.unit,before.unit);
 }
});
run('Six session identifiers, order and count untouched',()=>{
 assert.equal(transformed.sessions.length,6);
 for(let i=0;i<6;i++){
  assert.equal(transformed.sessions[i].id,raw.sessions[i].session_id);
  assert.deepEqual(transformed.sessions[i].questionIds,raw.sessions[i].question_ids);
 }
 assert.deepEqual(transformed.sessions.map(s=>s.questionIds.length),[6,6,5,5,4,4]);
});
run('Three pedagogical levels preserved',()=>assert.deepEqual(transformed.levels.map(x=>x.id),raw.levels));
run('No mutation of legacy JSON',()=>{
 const original=JSON.parse(bytes);const copy=clone(raw);adaptB20(copy);assert.deepEqual(copy,original);
});
run('Malformed B20 rejected',()=>{const wrong=clone(raw);wrong.questions.pop();assert.throws(()=>adaptB20(wrong),/B20_BASELINE_CHANGED/);});
run('Broken answer or duplicate ID rejected',()=>{
 const wrong=clone(raw);wrong.questions[0].answer='bad';assert.throws(()=>adaptB20(wrong));
 const dup=clone(raw);dup.questions[1].question_id=dup.questions[0].question_id;
 assert.throws(()=>adaptB20(dup),/CONTRACT_INVALID/);
});
run('Feature off returns legacy unchanged',()=>{
 let n=0;const result=selectLesson('toan_b20',registry,adapters,{legacyFallback:()=>{n++;return fallback();}});
 assert.equal(result.mode,'LEGACY_B20');assert.equal(result.reason,'FEATURE_FLAG_OFF');assert.equal(n,1);
 assert.deepEqual(result.data,raw);
});
run('Feature on returns verified contract',()=>{
 const r=selectLesson('toan_b20',registry,adapters,{featureFlag:true,legacyFallback:fallback});
 assert.equal(r.mode,'CONTRACT_V1');assert.equal(r.data.questions.length,30);
});
run('Adapter failure safely falls back only B20',()=>{
 const bad={legacy_b20:()=>{throw Error('EXPERIMENTAL_ADAPTER_BROKEN');}};
 const r=selectLesson('toan_b20',registry,bad,{featureFlag:true,legacyFallback:fallback});
 assert.equal(r.mode,'LEGACY_B20');assert.equal(r.reason,'ADAPTER_FAILED');
});
run('Foreign lesson cannot fall back to B20',()=>{
 const r=selectLesson('not_registered',registry,adapters,{featureFlag:true,legacyFallback:fallback});
 assert.equal(r.ok,false);assert.equal(r.mode,'BLOCKED');
});
run('Registered Vietnamese single session loads without B20 assumptions',()=>{
 const r=selectLesson('tieng_viet_demo',registry,adapters,{featureFlag:true});
 assert.equal(r.mode,'CONTRACT_V1');assert.equal(r.data.questions.length,1);
});
run('Registry rejects loader returning wrong lesson',()=>{
 const bad=createLessonRegistry(catalog,{legacy_b20:()=>({lesson_id:'toan_b21'})});
 assert.equal(bad.load('toan_b20').code,'LESSON_ID_MISMATCH');
});
run('Failure cannot create fallback if callback missing',()=>{
 const r=selectLesson('toan_b20',registry,{legacy_b20:()=>null},{featureFlag:true});
 assert.equal(r.ok,false);assert.equal(r.mode,'BLOCKED');
});
run('No grading, Apps Script or Sheet APIs invoked',()=>{
 for(const file of ['lesson-registry-v1.cjs','adapter-b20-v1.cjs','lesson-selector-v1.cjs']){
  const s=fs.readFileSync(path.join(__dirname,file),'utf8');
  assert.doesNotMatch(s,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run/);
 }
});
console.log(JSON.stringify({suite:'p0.6-b-adapter-registry-v1',passed,failed:0,questions:30,sessions:6,sourceBlobSha:gitBlob,noWrites:true,scope:'OFFLINE_ONLY'}));
