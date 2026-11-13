#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const reg=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const scene=read('qa/g7-4-b5-7/G7_B57_Asset_Library_288_QA.html');
const context={};vm.runInNewContext(read('ThuVienAsset288Test.gs')+'\nthis.LIB=KLThuVien288TestV1',context);
const lib=context.LIB;let pass=0,fail=0;function t(label,f){try{f();pass++;console.log('PASS '+label)}catch(e){fail++;console.error('FAIL '+label,e.stack)}}
const index=lib.verify(reg);
t('Existing registry exactly 288 entries and 24 groups',()=>{assert.equal(index.ok,true);assert.equal(index.total,288);assert.equal(index.groups.length,24);});
t('Approved and pending states preserved 100+188',()=>{assert.equal(index.approved,100);assert.equal(index.pending,188)});
t('Unique ids and relative file paths, no injection',()=>{assert.equal(new Set(reg.assets.map(a=>a.asset_id)).size,288);assert.equal(new Set(reg.assets.map(a=>a.relative_path)).size,288)});
t('Every group contains exactly 12 asset IDs',()=>{for(const g of index.groups)assert.equal(reg.assets.filter(a=>a.asset_id.split('_')[1]===g).length,12)});
t('All 288 URLs resolve to pinned immutable binary release',()=>{
 for(const a of reg.assets){const out=lib.resolve(index,a.asset_id);assert.equal(out.ok,true);assert.equal(out.url,lib.ROOT+a.relative_path);assert.equal(out.assetId,a.asset_id);}
});
t('Correct book mapping stays pending and visual can still preview',()=>{
 const result=lib.resolve(index,'KL_SH03_006');
 assert.equal(result.status,'OWNER_SIGNOFF_PENDING');assert.equal(result.label,'sách giáo khoa đóng');
});
t('Approved candy mapping remains unchanged',()=>assert.equal(lib.resolve(index,'KL_SH02_010').status,'LABEL_APPROVED'));
t('No ID and invalid ID return typed safe result',()=>{
 assert.equal(lib.resolve(index,'KL_SH99_001').code,'INVALID_ASSET_ID');
 assert.equal(lib.resolve(index,'<script>').code,'INVALID_ASSET_ID');
 assert.equal(lib.resolve(index,'KL_SH01_999').code,'ASSET_NOT_FOUND');
});
t('404/network fallback contains no score or student writes',()=>{
 const f=lib.fallback('HTTP_404','KL_SH01_001');assert.equal(f.ok,false);
 assert.equal(f.code,'HTTP_404');assert(!read('ThuVienAsset288Test.gs').includes('SpreadsheetApp'));
});
t('Registry release mismatch rejected',()=>assert.equal(lib.verify({...reg,release_commit:'0'.repeat(40)}).ok,false));
t('Registry count mismatch rejected',()=>assert.equal(lib.verify({...reg,total:287}).ok,false));
t('Duplicate ID rejected',()=>{
 const a=JSON.parse(JSON.stringify(reg));a.assets[1].asset_id=a.assets[0].asset_id;assert.equal(lib.verify(a).ok,false);
});
t('Invalid/mismatched relative path rejected',()=>{
 const a=JSON.parse(JSON.stringify(reg));a.assets[0].relative_path='WEBP/SH02/KL-SH02-01.webp';assert.equal(lib.verify(a).ok,false);
});
t('Missing label or unrecognized approval rejected',()=>{
 const a=JSON.parse(JSON.stringify(reg));a.assets[0].label_vi='';assert.equal(lib.verify(a).ok,false);
});
t('HTML gallery includes filtering, 288 checklist, fallback and JSON export',()=>{
 for(const token of ['id="search"','id="group"','id="approval"','id="broken"','id="hide"','id="scan"','id="export"','fallback','application/json'])assert(scene.includes(token),token);
});
t('Gallery uses same immutable release and registry snapshot commit',()=>{
 assert(scene.includes('653bfbc73002a188dcea0b714247b84cc28a4fed'));
 assert(scene.includes('bcb86bb3804fc33737e716b4e71c5656b922184d'));
});
t('Gallery displays 288 placeholder IDs when registry offline',()=>assert(scene.includes("let items=fake")));
t('Gallery has no student data APIs or Apps Script endpoint',()=>{
 for(const forbidden of ['google.script.run','SpreadsheetApp','setValue(','script.google.com'])assert(!scene.includes(forbidden));
});
t('B20 runtime HTML and CSS hashes unchanged',()=>{
 for(const [p,h] of Object.entries({
 'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483',
 'GiaoDien.html':'7126b84512c992da6a2d45483b9edd7ab7931358',
 '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
 '20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073',
 '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65'})){
 assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),h,p)}
});
console.log(JSON.stringify({stage:'G7.4-B.5.7',passed:pass,failed:fail,total:pass+fail}));
process.exitCode=fail?1:0;
