#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const registry=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const examples=JSON.parse(read('du-lieu/asset-selector/shared-visual-intent.examples.json'));
const runtime=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const sidecar=JSON.parse(read('du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json'));
const env={};vm.runInNewContext(read('BoChonAssetNguNghiaChung.gs')+'\nthis.SHARED=KL_BoChonAssetChungV1;',env);
const shared=env.SHARED;
const config={releaseCommit:registry.release_commit,registryCommit:rules.registry_commit};
const compiled=shared.compileRules(rules,config);
let pass=0,fail=0;
function check(name,fn){try{fn();pass++;console.log('PASS '+name)}catch(e){fail++;console.error('FAIL '+name+' '+e.stack)}}
check('Shared module exports four pure functions',()=>{
 for(const k of ['normalize','compileRules','select','mergeQuestions'])assert.equal(typeof shared[k],'function');
});
check('Shared module is independent from B20, Google Apps Script and browser DOM',()=>{
 const src=read('BoChonAssetNguNghiaChung.gs');
 for(const word of ['B20_','b20','SpreadsheetApp','UrlFetchApp','CacheService','document.','window.','fetch('])assert.equal(src.includes(word),false,word);
});
check('288 original Asset IDs and all nine approved rules unchanged',()=>{
 assert.equal(registry.assets.length,288);assert.equal(compiled.rules.length,9);
 assert.equal(new Set(registry.assets.map(x=>x.asset_id)).size,288);
 for(const r of compiled.rules){const a=registry.assets.find(x=>x.asset_id===r.assetId);assert(a);assert.equal(a.label_status,'LABEL_APPROVED');}
});
check('Compiled shape equals legacy B4.1 expected normalized shape',()=>{
 assert.equal(compiled.schema_version,'kidlearn-asset-semantic-rules-v1');
 assert.equal(compiled.release_commit,'653bfbc73002a188dcea0b714247b84cc28a4fed');
 assert.equal(compiled.rules[0].concept,'wrapped_candy');
});
for(const item of examples.examples){
 check('Portable contract: '+item.description,()=>{
  const out=shared.select(item.request,compiled);
  assert.equal(out.ok,item.expected.ok);
  if(out.ok){
   assert.equal(out.concept,item.expected.concept);
   assert.equal(out.entry.scene.groups[0].items[0].assetId,item.expected.assetId);
   assert.equal(out.entry.scene.groups[0].items[0].count,item.expected.count);
  }else assert.equal(out.code,item.expected.code);
 });
}
check('Implicit legacy B20 word prompt preserves candy match',()=>{
 const raw=runtime.questions.find(x=>x.question_id==='VAR_B20_20261112_016');
 const out=shared.select(raw,compiled);assert.equal(out.concept,'wrapped_candy');
});
check('Implicit legacy B20 mental prompt stays non-applicable',()=>{
 assert.equal(shared.select({type:'mental',prompt:'5 chiếc kẹo'},compiled).code,'NOT_APPLICABLE');
});
check('Explicit quantity mode exact always fails closed',()=>{
 for(const vi of ['counting','quantity','decorative']){
  const r=shared.select({visualIntent:vi,quantityMode:'exact',requestedCount:3,subject:'quả ổi'},compiled);
  assert.equal(r.code,'REQUIRES_QUANTITY_VERIFICATION');
 }
});
check('Unspecified intent for non-word does not make an image',()=>{
 assert.equal(shared.select({type:'reading',prompt:'Có 5 chiếc kẹo'},compiled).code,'NOT_APPLICABLE');
});
check('Unknown object is never guessed',()=>{
 assert.equal(shared.select({visualIntent:'decorative',subject:'cây bút'},compiled).code,'NO_SAFE_MATCH');
});
check('Multiple eligible subjects return ambiguous, no image',()=>{
 assert.equal(shared.select({visualIntent:'decorative',semanticTags:['xô nước','ba lô']},compiled).code,'AMBIGUOUS_SEMANTICS');
});
check('Invalid label or release commit fails at rule compilation',()=>{
 const bad=JSON.parse(JSON.stringify(rules));bad.rules[0].label_status='OWNER_SIGNOFF_PENDING';
 assert.throws(()=>shared.compileRules(bad,config),/SMART_RULE_INVALID/);
 assert.throws(()=>shared.compileRules(rules,{releaseCommit:'bad',registryCommit:rules.registry_commit}),/SMART_RULES_INVALID_HEADER/);
});
check('B20 full 30-question sidecar merge exactly preserves manual candy and book',()=>{
 const merged=shared.mergeQuestions(runtime.questions,{schema_version:sidecar.schema_version,mode:'STAGING_ONLY',question_scenes:sidecar.question_scenes},compiled);
 assert.equal(merged.selectionDiagnostics.length,30);
 assert.equal(merged.selectionDiagnostics.filter(x=>x.result==='EXPLICIT_OVERRIDE').length,2);
 for(const id of Object.keys(sidecar.question_scenes)){
  const a=JSON.stringify(merged.question_scenes[id]),b=JSON.stringify(sidecar.question_scenes[id]);
  assert.equal(a,b);
 }
 assert.equal(Object.keys(merged.question_scenes).length,2);
});
check('Generic other-lesson question ID auto-matches without manual mapping',()=>{
 const side={schema_version:'kidlearn-variant-asset-scene-v1',mode:'STAGING_ONLY',question_scenes:{}};
 const merged=shared.mergeQuestions([{id:'TV_2026_01',visualIntent:'decorative',quantityMode:'symbolic',subject:'xe đạp'}],side,compiled);
 assert.equal(merged.question_scenes.TV_2026_01.scene.groups[0].items[0].assetId,'KL_SH11_012');
 assert.equal(merged.selectionDiagnostics[0].result,'CURATED_AUTO');
});
check('Generic merge rejects invalid sidecar without altering original',()=>{
 const base={schema_version:'kidlearn-variant-asset-scene-v1',mode:'STAGING_ONLY',question_scenes:{}};
 assert.throws(()=>shared.mergeQuestions([{prompt:'kẹo'}],base,compiled),/SMART_QUESTION_ID_INVALID/);
 assert.equal(Object.keys(base.question_scenes).length,0);
});
check('Core HTML, CSS and B20 runtime source retained by exact SHA',()=>{
 const files={
 'GiaoDien.html':'7126b84512c992da6a2d45483b9edd7ab7931358',
 '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
 '20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073',
 '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65',
 'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483'};
 for(const [p,hash] of Object.entries(files))assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),hash,p);
});
check('Legacy adapter retains compatibility names and pinned nine-rule source',()=>{
 const s=read('B20_BoChonHinhThongMinh.gs');
 for(const k of ['b20ChuanHoaTu_','b20DocLuatAnhThongMinh_','b20ChonHinhNguNghia_','b20GhepHinhThongMinh_','kiemTraBoChonHinhThongMinh'])assert(s.includes('function '+k));
 assert(s.includes('6faead9028c1e27d815c4b5de6652923fd1506a0'));
});
check('No student progress writes in new module or B20 wrapper',()=>{
 for(const p of ['BoChonAssetNguNghiaChung.gs','B20_BoChonHinhThongMinh.gs']){
  for(const k of ['SpreadsheetApp','setValue(','starsAwarded:1'])assert(!read(p).includes(k),p+' '+k);
 }
});
console.log(JSON.stringify({stage:'G7.4-B.5.1',passed:pass,failed:fail,total:pass+fail}));
process.exitCode=fail?1:0;
