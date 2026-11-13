#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
let passed=0,failed=0;
const read=f=>fs.readFileSync(f,'utf8'),hash=f=>cp.execFileSync('git',['hash-object',f],{encoding:'utf8'}).trim();
function test(label,fn){try{fn();passed++;console.log('PASS '+label)}catch(e){failed++;console.error('FAIL '+label+': '+e.message)}}
const shell=read('GiaoDien.html'),css=read('46_CSS_Mobile_B20_UIA.html');
test('UI-A CSS loads after approved math CSS',()=>{const x=shell.indexOf("napThanhPhan('20_CSS_KhongGianHocToan')"),y=shell.indexOf("napThanhPhan('43_CSS_ThanhPhanBaiToan')"),z=shell.indexOf("napThanhPhan('46_CSS_Mobile_B20_UIA')");assert(x>=0&&y>x&&z>y)});
test('original baseline 20 CSS unchanged',()=>assert.equal(hash('20_CSS_KhongGianHocToan.html'),'3933b7f1812e08831bb7de90c1bf0f39ab87b073'));
test('UI-A navigation and accepted grading routes preserved after UI-B',()=>{const ui=read('19_KhongGianHocToan.html');for(const token of ['data-ml-view','data-ml-submit','chamLuotToan20BienThe','gradingState[q.id]','KLB20AssetPilotV1.mountVisible'])assert(ui.includes(token),token)});
test('original result/action module unchanged',()=>assert.equal(hash('29_CSS_BangKetQua_V26.html'),'3650f80fb38193f1b703e1f8581f089cfdb0604a'));
test('all style rules inside mobile breakpoint',()=>{const prefix=css.split('@media (max-width:760px)')[0].replace(/\/\*[\s\S]*?\*\//g,'').trim();assert.equal(prefix,'');assert(css.includes('@media (max-width:640px)'));assert(!css.includes('@media (min-width:'))});
test('math screen selector scope only',()=>{assert(css.includes('#mathFullScreen .ml-sidebar'));assert(css.includes('#mathFullScreen .ml-cards'));assert(!/\b(body|html|:root|\.app)\s*\{/.test(css))});
test('horizontal scroll session bar',()=>{assert(css.includes('#mathFullScreen .ml-navigation'));assert(css.includes('overflow-x:auto'));assert(css.includes('flex-wrap:nowrap'))});
test('full width mobile workspace and cards',()=>{assert(css.includes('flex-direction:column'));assert(css.includes('grid-template-columns:minmax(0,1fr)'));assert(css.includes('max-width:none'))});
test('vertical input dimensions and keyboard dock protected',()=>{assert(css.includes('grid-template-columns:22px 37px 37px'));assert(css.includes('.ml-dock {left:0;right:0;width:auto}'))});
test('UI-B action and result positioning untouched',()=>{for(const bad of ['data-ml-submit','ml-result-actions','ml-result-score','ml-answer-grid'])assert(!css.includes(bad),bad)});
test('no sheet/student data/grade logic introduced',()=>assert(!/(SpreadsheetApp|setValue\s*\(|google\.script|localStorage|starsAwarded|chamLuot)/.test(css)));
test('release block evidence retained',()=>assert(read('thu-nghiem/p0-5/evidence-current.json').includes('STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF')));
console.log(JSON.stringify({suite:'P0.5-UI-A-layout',passed,failed}));
if(failed)process.exitCode=1;
