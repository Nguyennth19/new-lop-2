#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../../P05_XacMinhNoiDungDaDuyet.gs'),'utf8');
const pack=require('../../bai-20-bien-the/runtime.json');
let passed=0,failed=0;
function run(options={}){
 const logs=[];
 const context={PropertiesService:{getScriptProperties:()=>({getProperty:k=>k==='P03_QA_TEST_APPROVED'?(options.p03||'NO'):null})},
   B20_PILOT_URL:'https://raw.githubusercontent.com/x/y/'+(options.commit||'1e9c700f1fd85427b30e9f1f42c8c49669011e33')+'/thu-nghiem/bai-20-bien-the/runtime.json',
   b20DocPackThu_:()=>options.pack||pack,
   console:{log:x=>logs.push(x)}};
 vm.createContext(context);vm.runInContext(source,context);
 return {report:context.kiemTraNoiDungP05DaDuyet(),logs};
}
function test(name,fn){try{fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name,e.message)}}
test('signed pack 7/7 matched',()=>{const r=run().report;assert.equal(r.status,'PASS');assert.equal(r.approvedPromptsMatched,7);assert.equal(r.noWrites,true)});
test('wrong source commit blocks',()=>assert(run({commit:'0000000000000000000000000000000000000000'}).report.errors.includes('B20_SOURCE_NOT_H1_PINNED')));
test('old copy blocks',()=>{
 const p=JSON.parse(JSON.stringify(pack));
 p.questions.find(q=>q.question_id.endsWith('_022')).prompt='Tính bằng cách thuận tiện: 57 + 14 + 15 = ?';
 assert(run({pack:p}).report.errors.includes('PROMPT_MISMATCH_022'));
});
test('P03 open blocks',()=>assert(run({p03:'YES'}).report.errors.includes('P03_APPROVAL_FLAG_OPEN')));
test('logs do not contain student data or sensitive identifiers',()=>{
 const x=run();
 assert.equal(x.logs.length,1);const j=JSON.parse(x.logs[0]);assert.equal(j.lessonId,'toan_b20');
 assert(!Object.keys(j).some(k=>/student|profile|sheetId|token/i.test(k)));
});
console.log(JSON.stringify({suite:'P0.5-I-approved-copy-receipt',passed,failed}));
if(failed)process.exitCode=1;
