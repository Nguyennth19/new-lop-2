#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const base=JSON.parse(read('du-lieu/bien-the/chuan/tieng-viet-demo.visual-intent.v1.json'));
const normalizedB20=JSON.parse(read('du-lieu/bien-the/chuan/toan_b20.visual-intent.v1.json'));
const originalB20=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const cfg=JSON.parse(read('du-lieu/bien-the/chuan/visual-intent-test-gate.v1.json'));
const registry=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const env={};vm.runInNewContext(read('BienTheVisualIntentChung.gs')+'\n'+read('BoChonAssetNguNghiaChung.gs')+'\n'+
  read('BoSinhBienTheVisualIntentTest.gs')+'\nthis.mods={projector:KLVisualIntentBienTheV1,selector:KL_BoChonAssetChungV1,gate:KLBoSinhBienTheVisualIntentTestV1}',env);
const {projector,selector,gate}=env.mods;
const compiled=selector.compileRules(rules,{releaseCommit:registry.release_commit,registryCommit:rules.registry_commit});
const deps={projector,selector,compiledRules:compiled};
const on={...cfg,enabled:true};
let pass=0,fail=0;
function check(name,fn){try{fn();pass++;console.log('PASS '+name)}catch(e){fail++;console.error('FAIL '+name,e.stack||String(e))}}
function unchanged(original,result){
 assert.equal(JSON.stringify(result.pack),JSON.stringify(original));
 assert.notEqual(result.pack,original);
}
check('Tracked feature flag defaults to OFF',()=>assert.equal(cfg.enabled,false));
check('Gate only allows the single TV pilot lesson',()=>{
 assert.equal(cfg.allowedLessonId,'tv_b03_visual_demo');
 assert.equal(gate.PILOT_LESSON,cfg.allowedLessonId);
});
check('Flag OFF returns the identical source package without scenes',()=>{
 const r=gate.run(base,cfg,deps);
 assert.equal(r.code,'FLAG_OFF');assert.equal(r.active,false);
 unchanged(base,r);assert.equal(r.pack.assetScenes,undefined);
});
check('Missing config always OFF',()=>{
 const r=gate.run(base,null,deps);assert.equal(r.code,'FLAG_OFF');unchanged(base,r);
});
check('OFF source remains unchanged even if selector missing',()=>{
 const r=gate.run(base,cfg,{});assert.equal(r.code,'FLAG_OFF');unchanged(base,r);
});
check('Wrong lesson does not activate even if explicitly enabled',()=>{
 const r=gate.run(originalB20,on,deps);assert.equal(r.code,'LESSON_NOT_ALLOWLISTED');unchanged(originalB20,r);
});
check('Wrong lesson does not activate already normalized B20 JSON',()=>{
 const r=gate.run(normalizedB20,on,deps);assert.equal(r.code,'LESSON_NOT_ALLOWLISTED');unchanged(normalizedB20,r);
});
check('Invalid staging mode blocks activation',()=>{
 const r=gate.run(base,{...on,mode:'RELEASED'},deps);
 assert.equal(r.code,'GATE_CONFIGURATION_REJECTED');unchanged(base,r);
});
check('Another lesson allowlist cannot be supplied to override guard',()=>{
 const r=gate.run(base,{...on,allowedLessonId:'toan_b20'},deps);
 assert.equal(r.code,'GATE_CONFIGURATION_REJECTED');unchanged(base,r);
});
check('Unexpected catalog release hash blocks activation',()=>{
 const r=gate.run(base,{...on,registryReleaseCommit:'bad'},deps);
 assert.equal(r.code,'GATE_CONFIGURATION_REJECTED');unchanged(base,r);
});
check('Release-mode pack blocks activation',()=>{
 const b={...base,mode:'PRODUCTION'};const r=gate.run(b,on,deps);
 assert.equal(r.code,'PACK_MODE_NOT_STAGING');unchanged(b,r);
});
check('Missing required shared service safe-falls back',()=>{
 const r=gate.run(base,on,{selector,compiledRules:compiled});
 assert.equal(r.code,'DEPENDENCIES_MISSING');unchanged(base,r);
});
check('Rules release mismatch safe-falls back without images',()=>{
 const r=gate.run(base,on,{...deps,compiledRules:{...compiled,release_commit:'bad'}});
 assert.equal(r.code,'RULESET_INVALID');unchanged(base,r);
});
check('Full opt-in variant generation succeeds for one TV demo lesson',()=>{
 const before=JSON.stringify(base),r=gate.run(base,on,deps);
 assert.equal(r.ok,true);assert.equal(r.active,true);
 assert.equal(r.code,'VISUAL_INTENT_TEST_ACTIVE');
 assert.equal(r.pack.questions.length,4);
 assert.equal(r.diagnostics.imageCount,2);
 assert.equal(r.diagnostics.rejectedCount,2);
 assert.equal(r.diagnostics.rulesCount,9);
 assert.equal(JSON.stringify(base),before);
});
check('Generated 4 questions preserve every normalized B5.3 property',()=>{
 const r=gate.run(base,on,deps);
 for(let i=0;i<base.questions.length;i++)
  assert.equal(JSON.stringify(r.pack.questions[i]),JSON.stringify(base.questions[i]));
 assert.equal(r.pack.visualIntentSchema,'kidlearn-variant-visual-intent-v1');
});
check('Generated scenes match approved normalized B5.3 end-to-end output',()=>{
 const expected=projector.projectAndSelect(base,null,compiled,selector);
 const actual=gate.run(base,on,deps).pack;
 assert.equal(JSON.stringify(actual),JSON.stringify(expected));
});
check('TV bicycle and backpack map to expected vetted Asset IDs',()=>{
 const a=gate.run(base,on,deps).pack.assetScenes.question_scenes;
 assert.equal(a.TV_DEMO_001.scene.groups[0].items[0].assetId,'KL_SH11_012');
 assert.equal(a.TV_DEMO_002.scene.groups[0].items[0].assetId,'KL_SH09_007');
 assert.equal(Object.keys(a).length,2);
});
check('Quantity 3 watermelon refuses image without verification',()=>{
 const r=gate.run(base,on,deps);
 const row=r.pack.assetScenes.selectionDiagnostics.find(x=>x.questionId==='TV_DEMO_003');
 assert.equal(row.result,'REQUIRES_QUANTITY_VERIFICATION');
 assert.equal(r.pack.assetScenes.question_scenes.TV_DEMO_003,undefined);
});
check('Ambiguous bicycle and backpack refuses arbitrary image',()=>{
 const r=gate.run(base,on,deps);
 const row=r.pack.assetScenes.selectionDiagnostics.find(x=>x.questionId==='TV_DEMO_004');
 assert.equal(row.result,'AMBIGUOUS_SEMANTICS');
 assert.equal(r.pack.assetScenes.question_scenes.TV_DEMO_004,undefined);
});
check('Malformed question triggers rollback to unchanged original pack',()=>{
 const bad={...base,questions:[...base.questions.slice(0,3),{...base.questions[3],visualIntent:'decorative',quantityMode:'exact'}]};
 const r=gate.run(bad,on,deps);
 assert.equal(r.code,'SAFE_FALLBACK');assert.equal(r.active,false);unchanged(bad,r);
});
check('Selector exception triggers fail-safe unchanged input and no writes',()=>{
 const broken={...deps,selector:{mergeQuestions(){throw Error('ARTIFICIAL_ERROR')}}};
 const r=gate.run(base,on,broken);
 assert.equal(r.code,'SAFE_FALLBACK');unchanged(base,r);
});
check('Manual override wins and count safety remains intact',()=>{
 const m={schema_version:'kidlearn-variant-asset-scene-v1',mode:'STAGING_ONLY',
 question_scenes:{TV_DEMO_001:{usage:'decorative',semantic:'xe đạp',label_approval_status:'LABEL_APPROVED',
 scene:{groups:[{label:'Minh họa',items:[{assetId:'KL_SH11_012',count:1}]}]},fallback_emoji:'🚲'}}};
 const r=gate.run(base,on,{...deps,manualSidecar:m});
 assert.equal(r.active,true);
 assert.equal(r.pack.assetScenes.selectionDiagnostics[0].result,'EXPLICIT_OVERRIDE');
 assert.equal(r.pack.assetScenes.question_scenes.TV_DEMO_001.semantic,'xe đạp');
});
check('No Apps Script API, Sheets writes, score mutation or renderer changes',()=>{
 const s=read('BoSinhBienTheVisualIntentTest.gs');
 for(const word of ['SpreadsheetApp','CacheService','UrlFetchApp','setValue(','starsAwarded','document.','window.'])
  assert(!s.includes(word),word);
});
check('Existing B20 renderer, CSS, source and nine-rule registry byte-identical',()=>{
 const expected={
 'GiaoDien.html':'7126b84512c992da6a2d45483b9edd7ab7931358',
 '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
 '20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073',
 '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65',
 'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483',
 'du-lieu/asset-selector/asset-registry-288.v1.json':'d63d383cefef8252cb6ead6eaf7fa39bd072e92a',
 'du-lieu/asset-selector/semantic-rules.v1.json':'313a65789e308ff67a19a197684b7172fab0c3e6'};
 for(const [path,hash] of Object.entries(expected)){
  const got=cp.execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();
  assert.equal(got,hash,path);
 }
});
check('Golden comparison records four normalized questions, two selected and two rejected',()=>{
 const golden=JSON.parse(read('qa/g7-4-b5-4/expected-tv-demo-result.v1.json'));
 const r=gate.run(base,on,deps),data=r.pack.assetScenes;
 assert.equal(golden.reference_sha,'5bcbc9f38ee80d69f292fd21e58cc22d584e0b4b');
 assert.equal(r.pack.questions.length,golden.expected.questionCount);
 assert.equal(r.active,golden.expected.active);
 assert.equal(r.code,golden.expected.code);
 assert.equal(r.diagnostics.imageCount,golden.expected.autoSelected);
 assert.equal(r.diagnostics.rejectedCount,golden.expected.rejected);
 assert.equal(r.diagnostics.rulesCount,golden.expected.rulesCount);
 for(const expected of golden.expected.selection){
  const row=data.selectionDiagnostics.find(x=>x.questionId===expected.questionId);
  assert(row,expected.questionId);assert.equal(row.result,expected.result);
  const scene=data.question_scenes[expected.questionId];
  if(expected.assetId){
   assert.equal(row.concept,expected.concept);
   assert.equal(scene.scene.groups[0].items[0].assetId,expected.assetId);
   assert.equal(scene.scene.groups[0].items[0].count,expected.count);
  }else assert.equal(scene,undefined);
 }
});
console.log(JSON.stringify({stage:'G7.4-B.5.4',pass,fail,total:pass+fail}));
process.exitCode=fail?1:0;
