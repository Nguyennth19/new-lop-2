#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const baseline=read('qa/g7-4-b5-7/G7_B57_Asset_Library_288_QA.html');
const page=read('qa/g7-4-b5-7-perf-a/G7_B57_PERF_A_Gallery_288.html');
const reg=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
let pass=0,fail=0;function t(name,fn){try{fn();pass++;console.log('PASS '+name)}catch(e){fail++;console.error('FAIL '+name+' '+e.stack)}}
t('288 source assets retained with immutable WebP release',()=>{assert.equal(reg.assets.length,288);assert(page.includes(reg.release_commit));});
t('Performance gallery uses 12 and 24 items per page',()=>{assert(page.includes('value="12"'));assert(page.includes('value="24"'));assert(page.includes('filtered.slice(page*size,(page+1)*size)'));});
t('No eager rendering of all 288 card elements',()=>{assert(page.includes('const items=filtered.slice('));assert(!page.includes('for(const a of filtered)frag.append('));});
t('Loading only near viewport with IntersectionObserver',()=>{assert(page.includes('new IntersectionObserver('));assert(page.includes("rootMargin:'120px'"));});
t('Viewport queue has max 3 active requests',()=>assert(page.includes('while(active<3&&queue.length)')));
t('Bulk scan uses max 3 workers with progress',()=>assert(page.includes('Array.from({length:3},worker)')));
t('Per-image performance metrics recorded',()=>{assert(page.includes('performance.now()'));assert(page.includes('p90Ms'));assert(page.includes('avgMs'));});
t('Image failure still shows fallback',()=>assert(page.includes("fallback(t.node,'Ảnh lỗi, dùng fallback')")));
t('All 288 can be exported as report entries',()=>assert(page.includes('assets:assets.map(a=>')));
t('Only registry metadata request on initial setup',()=>assert(page.includes("fetch(REG,{cache:'force-cache'})")));
t('No Apps Script or student data writes',()=>{for(const x of ['SpreadsheetApp','google.script.run','script.google.com','setValue('])assert(!page.includes(x));});
t('Original B5.7 baseline gallery retained unchanged',()=>assert(baseline.includes('Quét toàn bộ 288')));
t('Existing 288 rule registry and 9 semantic rules unchanged',()=>{assert.equal(reg.assets.length,288);assert.equal(JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json')).rules.length,9)});
t('B20 and approved UI hash unchanged',()=>{
 for(const [p,hash]of Object.entries({'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483','41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9','20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073'})){
 assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),hash,p)}
});
console.log(JSON.stringify({stage:'G7.4-B.5.7-PERF-A',pass,fail,total:pass+fail}));
process.exitCode=fail?1:0;
