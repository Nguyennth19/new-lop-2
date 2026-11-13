'use strict';
/** P0.6-A offline fixtures; never reads Sheets or calls a Web App. Node 22+. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {validateLesson}=require('./validator-lesson-v1.cjs');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
const base=(subject,kind,mode)=>({
 schemaVersion:'lop2.lesson.v1',lessonId:subject+'_pilot',subject,
 curriculum:{grade:2,lessonRef:'sample'},contentVersion:'p0.6-a-fixture-v1',
 source:{questionOrigin:'PROJECT_ORIGINAL_VARIANT',references:[]},
 levels:[{id:'L1',intent:'Luyện tập'}],
 sessions:[{id:'S1',levelId:'L1',questionIds:['Q1']}],
 questions:[{id:'Q1',kind,levelId:'L1',sessionId:'S1',prompt:'Câu kiểm thử',
 answerSpec:{mode,origin:'PROJECT_DERIVED',value:3,acceptedValues:['mèo'],rubricRef:'rubric-v1',
 verification:{type:'deterministic_rule',status:'PASS'},pedagogyApproval:{status:'PENDING'}},
 renderer:{component:kind},assets:{sceneId:null}}]
});
const math=base('toan','math.addition','exact');
const vietnamese=base('tieng_viet','language.comprehension','rubric');
const english=base('tieng_anh','language.spelling','normalized_text');
test('Math fixture accepted',()=>assert.equal(validateLesson(math).ok,true));
test('Vietnamese rubric fixture accepted',()=>assert.equal(validateLesson(vietnamese).ok,true));
test('English normalized text fixture accepted',()=>assert.equal(validateLesson(english).ok,true));
test('Not six sessions required',()=>{const d=structuredClone(math);d.sessions.push({id:'S2',levelId:'L1',questionIds:['Q2']});d.questions.push({...structuredClone(d.questions[0]),id:'Q2',sessionId:'S2'});assert.equal(validateLesson(d).ok,true);});
test('Duplicate question rejected',()=>{const d=structuredClone(math);d.questions.push(structuredClone(d.questions[0]));assert.equal(validateLesson(d).ok,false);});
test('Dangling question reference rejected',()=>{const d=structuredClone(math);d.sessions[0].questionIds=['Q2'];assert.equal(validateLesson(d).ok,false);});
test('Math exact requires value',()=>{const d=structuredClone(math);delete d.questions[0].answerSpec.value;assert.equal(validateLesson(d).ok,false);});
test('Open rubric requires rubric reference',()=>{const d=structuredClone(vietnamese);delete d.questions[0].answerSpec.rubricRef;assert.equal(validateLesson(d).ok,false);});
test('Countable asset requires count verification',()=>{const d=structuredClone(math);d.questions[0].assets={usage:'countable',sceneId:'test',countVerified:false};assert.equal(validateLesson(d).ok,false);});
test('Unapproved answer still structurally valid',()=>{const d=structuredClone(english);d.questions[0].answerSpec.verification.status='PENDING';assert.equal(validateLesson(d).ok,true);});
test('B20 untouched regression baseline 30 and six',()=>{
 const file=path.resolve(__dirname,'../bai-20-bien-the/runtime.json');const raw=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(raw.lesson_id,'toan_b20');assert.equal(raw.questions.length,30);assert.equal(raw.sessions.length,6);
 assert.deepEqual(raw.sessions.map(s=>s.question_ids.length),[6,6,5,5,4,4]);
 assert.equal(new Set(raw.questions.map(q=>q.question_id)).size,30);
 const prompts={'004':'Tính: 15 + 78 = ?','007':'Tính: 47 + 34 = ?','010':'Tính: 57 + 36 = ?','022':'Tính: 57 + 14 + 15 = ?','024':'Tính: 28 + 39 + 16 = ?','026':'Tính: 14 + 67 + 10 = ?','030':'Tính: 26 + 49 + 16 = ?'};
 for(const [suffix,prompt] of Object.entries(prompts)){const q=raw.questions.find(q=>q.question_id.endsWith('_'+suffix));assert.equal(q.prompt,prompt);}
});
console.log(JSON.stringify({suite:'p0.6-a-contract-v1',passed,failed:0,scope:'OFFLINE_ONLY',noWrites:true}));
