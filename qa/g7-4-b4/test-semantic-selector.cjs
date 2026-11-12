#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const inventory=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const sidecar=JSON.parse(read('du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json'));
const pack=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const tests=[];
function test(name,fn){try{fn();tests.push({name,status:'PASS'});console.log('PASS',name)}catch(e){tests.push({name,status:'FAIL',reason:String(e)});console.error('FAIL',name,String(e))}}
function context({noRules=false,badRules=null,noSidecar=false}={}){
 const cache={get:()=>null,put:()=>{}};
 const ctx={console:{warn(){}},CacheService:{getScriptCache(){return cache}},
 UrlFetchApp:{fetch(url){
  const out=source=>({getResponseCode(){return 200},getContentText(){return JSON.stringify(source)}});
  if(url.includes('semantic-rules.v1.json'))return noRules?{getResponseCode(){return 404}}:out(badRules||rules);
  if(url.includes('asset-scenes.json'))return noSidecar?{getResponseCode(){return 404}}:out(sidecar);
  if(url.includes('runtime.json'))return out(pack);
  throw Error('Unexpected network endpoint: '+url);
 }}};
 vm.runInNewContext(read('B20_BoChonHinhThongMinh.gs')+'\n'+read('B20_AssetSceneMayChu.gs')+'\n'+
   read('B20_BienTheMayChu.gs'),ctx);
 return ctx;
}
const ctx=context();
const loadedRules=ctx.b20DocLuatAnhThongMinh_(), output=ctx.b20DocPackThu_();
test('Inventory contains exactly 288 unique source IDs',()=>{
 assert.equal(inventory.assets.length,288);assert.equal(new Set(inventory.assets.map(x=>x.asset_id)).size,288);
 assert.equal(inventory.assets.filter(x=>x.label_status==='LABEL_APPROVED').length,100);
 assert.equal(inventory.assets.filter(x=>x.label_status==='OWNER_SIGNOFF_PENDING').length,188);
});
test('Every auto rule links to approved source asset and immutable release',()=>{
 assert.equal(rules.release_commit,inventory.release_commit);
 assert.equal(rules.selection_policy.allow_quantity_inference,false);
 for(const rule of rules.rules){
  const source=inventory.assets.find(x=>x.asset_id===rule.asset_id);
  assert(source,rule.asset_id+' absent');assert.equal(source.label_status,'LABEL_APPROVED');
  assert.equal(source.label_vi,rule.label_vi);
  assert.equal(rule.review_tier,'STAGING_CURATED');
  assert.equal(rule.count,1);
 }
});
test('Selector rule document strictly validates',()=>assert.equal(loadedRules.rules.length,9));
test('Candy hypothetical new variant selected without hardcoded question ID',()=>{
 const r=ctx.b20ChonHinhNguNghia_({question_id:'VAR_B20_NEW_701',type:'word',prompt:'Bé có thêm 5 chiếc kẹo.',unit:'chiếc kẹo'},loadedRules);
 assert.equal(r.ok,true);assert.equal(r.entry.scene.groups[0].items[0].assetId,'KL_SH02_010');
});
test('Dragon fruit hypothetical future question matches an approved term',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Có 2 quả thanh long và thêm 3 quả thanh long.',unit:'quả thanh long'},loadedRules);
 assert.equal(r.ok,true);assert.equal(r.entry.scene.groups[0].items[0].assetId,'KL_SH01_010');
});
test('Guava matches accent-insensitively without matching unrelated words',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Có 5 quả ổi.',unit:'quả ổi'},loadedRules);
 assert.equal(r.ok,true);assert.equal(r.entry.scene.groups[0].items[0].assetId,'KL_SH01_011');
});
test('No unsafe match for book pending label',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Tủ sách có 34 quyển truyện.',unit:'quyển truyện'},loadedRules);
 assert.equal(r.code,'NO_SAFE_MATCH');
});
test('Ambiguous candy and fruit is never auto assigned',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Có kẹo và quả ổi.',unit:''},loadedRules);
 assert.equal(r.code,'AMBIGUOUS_SEMANTICS');
});
test('Non-word questions do not auto map',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'mental',prompt:'47 chiếc kẹo',unit:'chiếc kẹo'},loadedRules);
 assert.equal(r.code,'NOT_APPLICABLE');
});
test('Random unmatched prompts retain renderer SVG/G5 fallback',()=>{
 assert.equal(ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Có 10 cây bút.',unit:'cây bút'},loadedRules).code,'NO_SAFE_MATCH');
});
test('Manual mappings have absolute precedence, including pending book in TEST',()=>{
 const merged=ctx.b20GhepHinhThongMinh_(pack,{schema_version:sidecar.schema_version,question_scenes:sidecar.question_scenes},loadedRules);
 assert.equal(merged.question_scenes.VAR_B20_20261112_016.scene.groups[0].items[0].assetId,'KL_SH02_010');
 assert.equal(merged.question_scenes.VAR_B20_20261112_021.scene.groups[0].items[0].assetId,'KL_SH03_006');
 assert.equal(merged.question_scenes.VAR_B20_20261112_021.pilot_only,true);
 assert.equal(merged.selectionDiagnostics.filter(x=>x.result==='EXPLICIT_OVERRIDE').length,2);
});
test('Current B20 30-question runtime remains untouched',()=>{
 assert.equal(output.questions.length,30);assert.equal(output.sessions.length,6);
 assert.equal(new Set(output.questions.map(x=>x.question_id)).size,30);
 assert.equal(JSON.stringify(output.questions),JSON.stringify(pack.questions));
});
test('Existing B20 images resolved from JSON sidecar, no new B20 mappings',()=>{
 assert.deepEqual(Object.keys(output.assetScenes.question_scenes).sort(),['VAR_B20_20261112_016','VAR_B20_20261112_021']);
 assert.equal(output.assetScenes.selectionDiagnostics.length,30);
});
test('Rules HTTP 404 preserves explicit B.3.1 mappings and all 30 questions',()=>{
 const p=context({noRules:true}).b20DocPackThu_();
 assert.equal(p.questions.length,30);assert.deepEqual(Object.keys(p.assetScenes.question_scenes).sort(),Object.keys(sidecar.question_scenes).sort());
});
test('Sidecar 404 disables smart selection, preserves full lesson',()=>{
 const p=context({noSidecar:true}).b20DocPackThu_();
 assert.equal(p.questions.length,30);assert.equal(p.assetScenes,undefined);
});
test('Pending status injected into curated rules rejects entire ruleset safely',()=>{
 const wrong=JSON.parse(JSON.stringify(rules));wrong.rules[0].label_status='OWNER_SIGNOFF_PENDING';
 const p=context({badRules:wrong}).b20DocPackThu_();
 assert.equal(p.questions.length,30);assert.equal(Object.keys(p.assetScenes.question_scenes).length,2);
 assert.throws(()=>context({badRules:wrong}).b20DocLuatAnhThongMinh_(),/SMART_RULE_INVALID/);
});
test('No quantity inferred by decorative selector (even for 47+34)',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'47 chiếc kẹo và 34 chiếc kẹo',unit:'chiếc kẹo'},loadedRules);
 assert.equal(r.entry.usage,'decorative');assert.equal(r.entry.scene.groups[0].items[0].count,1);
});
test('Service has no score or student data writes',()=>{
 const script=read('B20_BoChonHinhThongMinh.gs');
 for(const keyword of ['SpreadsheetApp','setValue(', 'starsAwarded:1'])assert.equal(script.includes(keyword),false);
});
const failed=tests.filter(x=>x.status==='FAIL');
console.log(JSON.stringify({stage:'G7.4-B.4',total:tests.length,passed:tests.length-failed.length,failed:failed.length,results:tests},null,2));
process.exitCode=failed.length?1:0;
