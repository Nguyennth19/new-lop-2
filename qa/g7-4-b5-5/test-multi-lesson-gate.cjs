#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const registry=JSON.parse(read('du-lieu/bien-the/chuan/visual-intent-multi-lesson-gate.v1.json'));
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const assets=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const b20=JSON.parse(read('du-lieu/bien-the/chuan/toan_b20.visual-intent.v1.json'));
const ctx={};vm.runInNewContext(read('BienTheVisualIntentChung.gs')+'\n'+read('BoChonAssetNguNghiaChung.gs')+
 '\n'+read('BoKiemDuyetVisualIntentNhieuBai.gs')+
 '\nthis.modules={gate:KLVisualIntentNhieuBaiTestV1,projector:KLVisualIntentBienTheV1,selector:KL_BoChonAssetChungV1}',ctx);
const {gate,projector,selector}=ctx.modules;
const compiled=selector.compileRules(rules,{releaseCommit:assets.release_commit,registryCommit:rules.registry_commit});
const deps={projector,selector,compiledRules:compiled};
let pass=0,fail=0;
function check(name,fn){try{fn();pass++;console.log('PASS',name)}catch(e){fail++;console.error('FAIL',name,e.stack||String(e))}}
function fixture(entry){return JSON.parse(read(entry.fixture));}
function switchOn(entry){return {enabled:true,lessonId:entry.lessonId,qaPassed:true,fixtureBlobSha:entry.fixtureBlobSha};}
function unchanged(pack,result,reason){
 assert.equal(result.active,false);
 if(reason)assert.equal(result.code,reason);
 assert.equal(JSON.stringify(result.pack),JSON.stringify(pack));
 assert.notEqual(result.pack,pack);
}
check('Registry OFF by default, two different staging lessons, nine rules',()=>{
 assert.equal(registry.enabled,false);
 assert.equal(registry.mode,'STAGING_ONLY');
 assert.equal(registry.lessons.length,2);
 assert.equal(registry.ruleCount,9);
 assert.equal(gate.validateRegistry(registry).ok,true);
});
check('All fixture blob hashes are byte-verified against current Git files',()=>{
 for(const entry of registry.lessons){
  const blob=cp.execFileSync('git',['hash-object',entry.fixture],{encoding:'utf8'}).trim();
  assert.equal(blob,entry.fixtureBlobSha,entry.lessonId);
  assert.equal(fixture(entry).lesson_id,entry.lessonId);
 }
});
check('All nine semantic rules and 288 catalog entries unchanged',()=>{
 assert.equal(rules.rules.length,9);assert.equal(assets.assets.length,288);
 assert.equal(new Set(assets.assets.map(x=>x.asset_id)).size,288);
 assert.equal(compiled.rules.length,9);
});
check('Tracked legacy B5.4 feature flag remains OFF',()=>{
 const prior=JSON.parse(read('du-lieu/bien-the/chuan/visual-intent-test-gate.v1.json'));
 assert.equal(prior.enabled,false);
});
for(const entry of registry.lessons){
 const raw=fixture(entry);
 check('OFF case unchanged for '+entry.lessonId,()=>{
  unchanged(raw,gate.run(raw,registry,{enabled:false},deps),'FLAG_OFF');
 });
 check('ON QA-approved result for '+entry.lessonId,()=>{
  const before=JSON.stringify(raw);
  const r=gate.run(raw,registry,switchOn(entry),deps);
  assert.equal(r.ok,true);assert.equal(r.active,true);assert.equal(r.code,'STAGING_QA_ACTIVE');
  assert.equal(r.pack.questions.length,entry.expectedQuestions);
  assert.equal(r.qa.selected,entry.expectedSelected);
  assert.equal(r.qa.rejected,entry.expectedRejected);
  assert.equal(JSON.stringify(raw),before);
 });
 check('ON exactly matches normalized B5.3 JSON pipeline for '+entry.lessonId,()=>{
  const a=gate.run(raw,registry,switchOn(entry),deps).pack;
  const b=projector.projectAndSelect(raw,null,compiled,selector);
  assert.equal(JSON.stringify(a),JSON.stringify(b));
 });
 check('Golden scene IDs preserve per-lesson approved semantic outcomes '+entry.lessonId,()=>{
  const r=gate.run(raw,registry,switchOn(entry),deps);
  const sceneIds=Object.keys(r.pack.assetScenes.question_scenes);
  assert.equal(sceneIds.length,entry.expectedSelected);
  assert.equal(r.pack.assetScenes.selectionDiagnostics.filter(x=>x.result!=='CURATED_AUTO').length,entry.expectedRejected);
  for(const scene of Object.values(r.pack.assetScenes.question_scenes))
   for(const group of scene.scene.groups)
    for(const item of group.items){
     assert.equal(item.count,1);
     assert(assets.assets.some(x=>x.asset_id===item.assetId&&x.label_status==='LABEL_APPROVED'));
    }
 });
 check('Runtime without independent QA PASS is blocked '+entry.lessonId,()=>{
  unchanged(raw,gate.run(raw,registry,{...switchOn(entry),qaPassed:false},deps),'QA_NOT_PASSED');
 });
 check('Fixture hash mismatch blocks activation '+entry.lessonId,()=>{
  unchanged(raw,gate.run(raw,registry,{...switchOn(entry),fixtureBlobSha:'0'.repeat(40)},deps),'FIXTURE_SHA_MISMATCH');
 });
 check('Changed source count blocks activation '+entry.lessonId,()=>{
  const edited={...raw,questions:raw.questions.slice(0,-1)};
  unchanged(edited,gate.run(edited,registry,switchOn(entry),deps),'QUESTION_COUNT_MISMATCH');
 });
 check('Selector failure is safe and source stays unchanged '+entry.lessonId,()=>{
  const corrupt={...deps,selector:{mergeQuestions(){throw Error('INJECTED_FAILURE')}}};
  unchanged(raw,gate.run(raw,registry,switchOn(entry),corrupt),'SAFE_FALLBACK');
 });
}
check('Arbitrary B20 lesson cannot be enabled with QA flag',()=>{
 unchanged(b20,gate.run(b20,registry,{enabled:true,lessonId:'toan_b20',qaPassed:true,fixtureBlobSha:'0'.repeat(40)},deps),'LESSON_NOT_ALLOWLISTED');
});
check('Unknown lesson never activates via untracked runtime switch',()=>{
 const invented={...fixture(registry.lessons[0]),lesson_id:'fake_lesson'};
 unchanged(invented,gate.run(invented,registry,{enabled:true,lessonId:'fake_lesson',qaPassed:true,fixtureBlobSha:registry.lessons[0].fixtureBlobSha},deps),'LESSON_NOT_ALLOWLISTED');
});
check('Duplicate lesson IDs invalidate allowlist',()=>{
 const bad={...registry,lessons:[registry.lessons[0],registry.lessons[0]]};
 assert.equal(gate.validateRegistry(bad).ok,false);
});
check('Tracked enabled:true is forbidden, fail safely',()=>{
 const bad={...registry,enabled:true};
 assert.equal(gate.validateRegistry(bad).ok,false);
 unchanged(fixture(registry.lessons[0]),gate.run(fixture(registry.lessons[0]),bad,switchOn(registry.lessons[0]),deps),'REGISTRY_INVALID');
});
check('Changed release SHA or rule count blocks registry',()=>{
 assert.equal(gate.validateRegistry({...registry,registryReleaseCommit:'0'.repeat(40)}).ok,false);
 assert.equal(gate.validateRegistry({...registry,ruleCount:200}).ok,false);
});
check('Production-mode pack is blocked',()=>{
 const entry=registry.lessons[0],p={...fixture(entry),mode:'RELEASED'};
 unchanged(p,gate.run(p,registry,switchOn(entry),deps),'PACK_NOT_STAGING');
});
check('Golden counts drift fail open',()=>{
 const e=registry.lessons[0],p=fixture(e);
 const cfg={...registry,lessons:registry.lessons.map(x=>x.lessonId===e.lessonId?
 {...x,expectedSelected:1,expectedRejected:x.expectedQuestions-1}:x)};
 unchanged(p,gate.run(p,cfg,switchOn(e),deps),'SAFE_FALLBACK');
});
check('Conflicting manual sidecar cannot introduce scene for a different lesson',()=>{
 const e=registry.lessons[0],p=fixture(e);
 const malicious={schema_version:'kidlearn-variant-asset-scene-v1',mode:'STAGING_ONLY',question_scenes:{
  FAKE_OTHER_LESSON:{usage:'decorative',scene:{groups:[{items:[{assetId:'KL_SH02_010',count:1}]}]}}
 }};
 unchanged(p,gate.run(p,registry,switchOn(e),{...deps,manualSidecar:malicious}),'SAFE_FALLBACK');
});
check('Original B20 JSON and frontend/CSS hashes equal approved baseline',()=>{
 const expected={
  'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483',
  '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
  '20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073',
  '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65'};
 for(const [p,sha] of Object.entries(expected))
 assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,p);
});
check('Gate performs no server requests, sheet writes or DOM edits',()=>{
 const code=read('BoKiemDuyetVisualIntentNhieuBai.gs');
 for(const token of ['SpreadsheetApp','CacheService','UrlFetchApp','setValue(','document.','window.','starsAwarded'])
 assert(!code.includes(token),token);
});
console.log(JSON.stringify({stage:'G7.4-B.5.5',pass,fail,total:pass+fail}));
process.exitCode=fail?1:0;
