#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8'),hash=p=>cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
const source=read('19_KhongGianHocToan.html'),uiA=read('46_CSS_Mobile_B20_UIA.html'),css=read('47_CSS_B20_UIB_CanChinh.html'),shell=read('GiaoDien.html');
let pass=0,fail=0;
function test(label,fn){try{fn();pass++;console.log('PASS '+label)}catch(e){fail++;console.error('FAIL '+label+': '+e.message)}}
function getSlice(start,end){const a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert(a>=0&&b>a,start);return source.slice(a,b)}
function resultMarkup(options={}){
 const panel={innerHTML:''},questions=[{id:'id1',label:'Câu 1',level:'LV1-A'},{id:'id2',label:'Câu 2',level:'LV1-A'}];
 const ctx={shell:()=>({querySelector:x=>x==='#mlResults'?panel:null}),
 fullData:{variantPilot:true},view:'LV1-A',submissions:options.submissions||{},
 activeQuestions:()=>questions,fields:q=>[{value:q.id==='id1'?'12':''}],
 gradingState:options.states||{},E:x=>String(x),muiIcon:()=>''};
 vm.createContext(ctx);
 vm.runInContext(getSlice('function renderResults(){','function restoreDrafts()'),ctx);
 ctx.renderResults();return panel.innerHTML;
}
test('UI-B CSS is loaded after UI-A',()=>{const a=shell.indexOf("napThanhPhan('46_CSS_Mobile_B20_UIA')"),b=shell.indexOf("napThanhPhan('47_CSS_B20_UIB_CanChinh')");assert(a>0&&b>a)});
test('accepted renderer 41 remains byte-identical',()=>assert.equal(hash('41_HienThiCauHoiToan.html'),'50501ccc3cb5e7801fd563807e21b76d2a51c8f9'));
test('B20 server is byte-identical except approved pinned JSON source and cache key',()=>{
 const server=read('B20_BienTheMayChu.gs');
 const restored=server
 .replace('https://raw.githubusercontent.com/Nguyennth19/new-lop-2/1e9c700f1fd85427b30e9f1f42c8c49669011e33/thu-nghiem/bai-20-bien-the/runtime.json','https://raw.githubusercontent.com/Nguyennth19/new-lop-2/513e1dcefa0f229305a5d4523dac3cbdd201a908/thu-nghiem/bai-20-bien-the/runtime.json')
 .replace('b20_pilot_20261113_h1_pedagogy_copy_v1','b20_pilot_20261112_pack_g7_b31_v1');
 assert.equal(cp.execFileSync('git',['hash-object','--stdin'],{input:restored,encoding:'utf8'}).trim(),'2cac0c171aa5c60a01bf5d918f4e2f4b53a1c16c');
});
test('accepted score styles module stays untouched',()=>assert.equal(hash('29_CSS_BangKetQua_V26.html'),'3650f80fb38193f1b703e1f8581f089cfdb0604a'));
test('UI-A mobile nav stays in source',()=>assert(uiA.includes('overflow-x:auto')&&uiA.includes('flex-direction:column')));
test('submission then result then answer reading order',()=>{
 const html=resultMarkup();const a=html.indexOf('class="ml-result-card ml-submit-card"'),b=html.indexOf('class="ml-result-card ml-score-card"'),c=html.indexOf('class="ml-result-card ml-answer-card"');
 assert(a>=0&&b>a&&c>b);
 assert.equal((html.match(/data-ml-submit/g)||[]).length,1);
 assert.equal((html.match(/data-ml-reset-level/g)||[]).length,1);
});
test('unsubmitted state stays blank, no score forged',()=>{const html=resultMarkup();assert(html.includes('Chưa nộp bài'));assert(html.includes('<b>—</b>'));assert(html.includes('1 / 2'))});
test('graded score and marked answers are kept',()=>{const html=resultMarkup({submissions:{'LV1-A':{total:2,correct:1,answered:1,seconds:19,at:'2026-11-13T04:00:00.000Z'}},states:{id1:'correct',id2:'empty'}});assert(html.includes('<b>5</b>'));assert(html.includes('1:✓'));assert(html.includes('2:–'))});
test('compound expression formatting presentation-only',()=>{
 const snippet=getSlice('const {vertical,mental:mentalBase','function keyValue(');
 const ctx={taoHienThiCauToan:()=>({vertical:()=>'',mental:q=>q.variantType==='three'?'<div><span class="ml-mental-first">49+24</span></div>':'<div><span class="ml-mental-first">9+2=11</span></div>',puzzle:()=>'',word:()=>'',invalid:()=>''}),E:x=>x,input:()=>'',baseCard:()=>{}};
 vm.createContext(ctx);vm.runInContext(snippet+'globalThisResult=mental;',ctx);
 assert(ctx.globalThisResult({variantType:'three'}).includes('49 + 24'));
 assert(ctx.globalThisResult({variantType:'carry'}).includes('9 + 2 = 11'));
});
test('score scroll only for smaller screens',()=>{assert(source.includes('if(window.innerWidth<=840)'));assert(source.includes("querySelector('#mlScoreCard')"))});
test('shared CSS centers equations without changing inputs or calculation',()=>{for(const s of ['.ml-mental-row','justify-content:center','column-gap:clamp','white-space:pre','.ml-score-card','.ml-submit-card'])assert(css.includes(s),s);assert(!css.includes('SpreadsheetApp'))});
test('CSS selectors scoped to math screen',()=>{const noComments=css.replace(/\/\*[\s\S]*?\*\//g,'');assert(!/(^|})\s*(?:body|html|:root|\.app)\b/.test(noComments));assert(css.includes('#mathFullScreen'))});
test('release evidence remains blocked pending signoff',()=>assert(read('thu-nghiem/p0-5/evidence-current.json').includes('"signedOff": false')));
console.log(JSON.stringify({suite:'P0.5-UI-B-submit-equations',passed:pass,failed:fail}));
if(fail)process.exitCode=1;
