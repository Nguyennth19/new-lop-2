#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const registry=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const policy=JSON.parse(read('du-lieu/asset-selector/count-composition-b58-test.v1.json'));
const ctx={};vm.runInNewContext(read('BoDungHinhDinhLuongB58Test.gs')+'\nthis.engine=KL_B58_NguNghiaDinhLuongTestV1',ctx);const engine=ctx.engine;
const norm=x=>JSON.parse(JSON.stringify(x));
const catalog=engine.compile(registry,policy);
let pass=0,fail=0;function check(name,f){try{f();pass++;console.log('PASS '+name)}catch(e){fail++;console.error('FAIL '+name,e.stack)}}
const exact=(assetId,groups,expectedTotal)=>({mode:'STAGING_ONLY',visualIntent:'quantity',quantityMode:'exact',assetId,groups:groups.map((n,i)=>({label:'Nhóm '+(i+1),count:n})),expectedTotal});
check('288/288 registered labels are searchable, 24 groups retained',()=>{assert.equal(catalog.total,288);assert.equal(Object.keys(catalog.byId).length,288);assert.equal(registry.assets.length,288)});
check('No remaining pending labels',()=>assert(registry.assets.every(a=>a.label_status==='LABEL_APPROVED')));
check('Semantic label index includes Vietnamese book and chicken',()=>{assert(engine.search(catalog,'sách').some(x=>x.assetId==='KL_SH03_006'));assert(engine.search(catalog,'gà').some(x=>x.assetId==='KL_SH05_004'))});
check('Alias search handles English book and chicken for TEST candidates',()=>{assert(engine.search(catalog,'books').some(x=>x.assetId==='KL_SH03_006'));assert(engine.search(catalog,'chickens').some(x=>x.assetId==='KL_SH05_004'))});
check('Normalizer tolerates Vietnamese accents',()=>assert.equal(engine.normalize('QUYỂN   SÁCH'),'quyen sach'));
check('Multiple matching labels do not imply automatic unsafe selection',()=>assert(engine.search(catalog,'giày').length>=2));
check('Candidate allowlist contains only 2 explicitly staged assets, globally OFF',()=>{assert.equal(policy.enabled,false);assert.equal(Object.keys(catalog.candidates).length,2)});
check('Five books render 5 instances, not 1 composite',()=>{const r=engine.plan(catalog,exact('KL_SH03_006',[5],5));assert.equal(r.ok,true);assert.equal(r.total,5);assert.equal(r.groups[0].items.length,5)});
check('Eight chickens render 8 instances in group',()=>{const r=engine.plan(catalog,exact('KL_SH05_004',[8],8));assert.equal(r.ok,true);assert.equal(r.groups[0].items.length,8)});
check('Four books plus three compose two groups, keep answer hidden',()=>{const r=engine.plan(catalog,exact('KL_SH03_006',[4,3],7));assert.equal(r.ok,true);assert.deepEqual(norm(r.groups.map(g=>g.count)),[4,3]);assert.equal(r.discloseAnswer,false)});
check('Four plus three cannot silently draw eight',()=>{const r=engine.plan(catalog,exact('KL_SH03_006',[4,3],8));assert.equal(r.code,'COUNT_MISMATCH');assert.equal(r.details.actual,7)});
check('Composite six-apple asset is denied for arbitrary repeat',()=>assert.equal(engine.plan(catalog,exact('KL_M03_006',[6],6)).code,'QUANTITY_ASSET_NOT_VERIFIED'));
check('Unverified newly label approved toy also denied for repeat',()=>assert.equal(engine.plan(catalog,exact('KL_SH04_001',[4],4)).code,'QUANTITY_ASSET_NOT_VERIFIED'));
check('Invalid IDs denied and fail closed',()=>assert.equal(engine.plan(catalog,exact('KL_SH99_999',[5],5)).code,'UNKNOWN_ASSET_ID'));
check('No quantity inference for decorative or symbolic intent',()=>assert.equal(engine.plan(catalog,{...exact('KL_SH03_006',[5],5),visualIntent:'decorative'}).code,'EXACT_REQUEST_REQUIRED'));
check('Staging-only: production mode cannot invoke planner',()=>assert.equal(engine.plan(catalog,{...exact('KL_SH03_006',[5],5),mode:'RELEASED'}).code,'EXACT_REQUEST_REQUIRED'));
check('Negative, zero, fractional and out-of-range quantities rejected',()=>{for(const n of [-1,0,1.5,13])assert.equal(engine.plan(catalog,exact('KL_SH03_006',[n],n)).code,'GROUP_COUNT_INVALID')});
check('Max total 12 enforced',()=>assert.equal(engine.plan(catalog,exact('KL_SH05_004',[8,8],16)).code,'TOTAL_LIMIT_EXCEEDED'));
check('Malformed policy, duplicate candidate and release drift rejected',()=>{assert.throws(()=>engine.compile(registry,{...policy,enabled:true}));assert.throws(()=>engine.compile(registry,{...policy,releaseCommit:'0'.repeat(40)}));assert.throws(()=>engine.compile(registry,{...policy,candidates:[policy.candidates[0],policy.candidates[0]]}))});
check('Approved labels alone cannot grant object counting permission',()=>{const p={...policy,candidates:[]};const c=engine.compile(registry,p);assert.equal(engine.plan(c,exact('KL_SH03_006',[5],5)).code,'QUANTITY_ASSET_NOT_VERIFIED')});
check('Original WebP release and paths remain unchanged',()=>{assert.equal(engine.RELEASE,registry.release_commit);assert(engine.plan(catalog,exact('KL_SH03_006',[5],5)).url.endsWith('/WEBP/SH03/KL-SH03-06.webp'))});
check('Original nine semantic rules and OFF multi lesson gates unchanged',()=>{assert.equal(JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json')).rules.length,9);const gate=JSON.parse(read('du-lieu/bien-the/chuan/visual-intent-multi-lesson-gate.v1.json'));assert.equal(gate.enabled,false);assert(gate.lessons.every(l=>l.enabled===false))});
check('Six-scenario browser QA HTML has no remote scripts or student writes',()=>{const s=read('qa/g7-4-b5-8/G7_B58_Count_Composition_Standalone.html');for(const x of ['BOOK_5','CHICKEN_8','BOOK_4_PLUS_3','COUNT_MISMATCH','MULTI_ASSET_UNVERIFIED','IMAGE_FAILURE','application/json'])assert(s.includes(x),x);for(const x of ['SpreadsheetApp','google.script.run','script.google.com'])assert(!s.includes(x))});
check('B20 original renderer, CSS and 30/6 runtime are hash-locked',()=>{
 for(const [p,hash]of Object.entries({'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483','41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9','20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073','43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65'}))assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),hash,p);
});
console.log(JSON.stringify({stage:'G7.4-B.5.8',pass,fail,total:pass+fail}));process.exitCode=fail?1:0;
