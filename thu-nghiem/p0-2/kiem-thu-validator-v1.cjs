#!/usr/bin/env node
/* P0.2 offline contract regression. No network, Apps Script services or student data. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const here=__dirname,root=path.resolve(here,'../..');
const V=require('./validator-v1.js');
const source=JSON.parse(fs.readFileSync(path.join(root,'thu-nghiem/bai-20-bien-the/runtime.json'),'utf8'));
const sandbox={};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'42_AdapterBienTheB20.html'),'utf8'),sandbox);
const converted=sandbox.chuyenB20BienTheSangRenderer({
 variantPilot:true,lesson:{id:source.lesson_id,title:source.lesson_title,subject:'Toán'},
 packVersion:source.schema_version,sessions:source.sessions,questions:source.questions
});
let count=0;
function test(label,cb){try{cb();console.log('PASS '+label);count++;}catch(e){console.error('FAIL '+label+': '+e.message);process.exitCode=1;}}
const clone=x=>JSON.parse(JSON.stringify(x));
function negative(label,mutate,stage,code){
 test(label,()=>{const x=clone(stage==='source'?source:converted);mutate(x);const out=stage==='source'?V.validateSource(x,{b20Baseline:true}):stage==='adapter'?V.validateAdapter(x):V.validateRenderer(x);assert.equal(out.ok,false);assert.ok(out.errors.some(e=>e.code===code));});
}
test('source 30 questions / 6 sessions',()=>assert.equal(V.validateSource(source,{b20Baseline:true}).ok,true));
test('adapter real conversion',()=>assert.equal(V.validateAdapter(converted).ok,true));
test('renderer real conversion',()=>assert.equal(V.validateRenderer(converted).ok,true));
test('IDs and order retained',()=>assert.deepEqual(Array.from(converted.questions,q=>q.id),source.questions.map(q=>q.question_id)));
test('all 6 sessions preserved',()=>assert.equal(converted.levels.length,6));
negative('invalid answer',x=>x.questions[0].answer=999,'source','ANSWER_MISMATCH');
negative('duplicate question ID',x=>x.questions[1].question_id=x.questions[0].question_id,'source','DUPLICATE_ID');
negative('broken session reference',x=>x.sessions[0].question_ids[0]='MISSING_001','source','DANGLING_QUESTION_REF');
negative('wrong session assignment',x=>x.questions[0].session_id='LV3-B','source','QUESTION_SESSION_MISMATCH');
negative('missing prompt',x=>x.questions[0].prompt='','source','PROMPT_REQUIRED');
negative('unsupported question type',x=>x.questions[0].type='essay','source','TYPE_UNSUPPORTED');
negative('missing answer',x=>delete x.questions[0].answer,'source','ANSWER_REQUIRED');
negative('wrong arithmetic parameters',x=>x.questions[0].parameters.a=3,'source','ARITHMETIC_PARAMETERS_INVALID');
negative('wrong baseline count',x=>{x.questions.pop();x.sessions[5].question_ids.pop();x.sessions[5].target_count--},'source','B20_BASELINE_COUNT');
negative('adapter orphan section',x=>x.questions[0].sectionId='missing_section','adapter','DANGLING_SECTION_REF');
negative('adapter bad render type',x=>x.questions[0].type='unsupported','adapter','RENDER_TYPE_UNSUPPORTED');
negative('adapter missing answer',x=>x.questions[0].answer='','adapter','ANSWER_REQUIRED');
negative('renderer bad asset id',x=>x.questions[0].assetId='','renderer','ASSET_ID_INVALID');
const session=source.sessions[0],answers=Object.fromEntries(session.question_ids.map(id=>[id,{answer:'0'}]));
const req={sessionId:session.session_id,answers};
const grade={ok:true,sessionId:session.session_id,total:session.target_count,correct:0,recorded:false,starsAwarded:0};
test('grading session no-write contract',()=>assert.equal(V.validateSessionGrade(req,grade,source).ok,true));
test('grading rejects star award',()=>assert.ok(V.validateSessionGrade(req,{...grade,starsAwarded:1},source).errors.some(e=>e.code==='GRADE_WRITE_FORBIDDEN')));
test('grading rejects incomplete request',()=>assert.ok(V.validateSessionGrade({...req,answers:{}},grade,source).errors.some(e=>e.code==='GRADE_ANSWERS_MISMATCH')));
test('single grade no-write',()=>assert.equal(V.validateGrading({questionId:source.questions[0].question_id},{ok:true,correct:true,questionId:source.questions[0].question_id,recorded:false,starsAwarded:0},source.questions[0]).ok,true));
test('single grade rejects write',()=>assert.ok(V.validateGrading({questionId:source.questions[0].question_id},{ok:true,correct:true,recorded:true},source.questions[0]).errors.some(e=>e.code==='GRADE_WRITE_FORBIDDEN')));
console.log(JSON.stringify({suite:'P0.2-validator-v1',passed:count,failed:process.exitCode?1:0,questions:source.questions.length,sessions:source.sessions.length,noWrites:true}));
if(process.exitCode)process.exit(process.exitCode);
