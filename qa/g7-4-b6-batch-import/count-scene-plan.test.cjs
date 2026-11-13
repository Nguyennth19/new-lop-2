'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {resolveCountScene}=require('./count-scene-plan.test-only.cjs');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=read('hinh-anh/svg-fallback/fluent-emoji-flat/v1/manifest.v1.json');
const decisions=read('qa/g7-4-b5-12-count-safe-delegated.v1.json');
const approved=decisions.records.filter(x=>x.decision==='COUNT_SAFE_APPROVED');
const blocked=decisions.records.filter(x=>x.decision!=='COUNT_SAFE_APPROVED');
assert.equal(approved.length,40);assert.equal(blocked.length,6);
assert.equal(manifest.icons.length,46);assert.equal(new Set(decisions.records.map(x=>x.assetId)).size,46);
for(const d of decisions.records){
 const icon=manifest.icons.find(x=>x.id===d.assetId);assert.ok(icon);
 assert.equal(icon.sha256,d.sourceSha256);
 assert.equal(icon.countQaStatus,d.decision);
 assert.equal(icon.objectsPerAsset,d.objectsPerAsset);
 assert.ok(d.canonicalPhrase&&d.unit&&Array.isArray(d.aliasesVi));
 if(d.decision==='COUNT_SAFE_APPROVED'){
  const p=resolveCountScene(manifest,decisions,d.assetId,4);
  assert.equal(p.ok,true,d.assetId+': '+JSON.stringify(p.reasons));
  assert.equal(p.totalObjects,4);assert.equal(p.repeat,4);assert.equal(p.runtimeEnabled,false);
 }else{
  assert.equal(resolveCountScene(manifest,decisions,d.assetId,4).ok,false);
 }
}
assert.equal(resolveCountScene(manifest,decisions,'red_apple',4).totalObjects,4);
assert.equal(resolveCountScene(manifest,decisions,'rabbit',3).totalObjects,3);
for(const id of ['books','grapes','cherries','banana','watermelon','bread'])
 assert.equal(resolveCountScene(manifest,decisions,id,5).ok,false,id);
for(const n of [-1,0,1.5,51,'3',null,NaN])assert.equal(resolveCountScene(manifest,decisions,'red_apple',n).ok,false);
const tamper=structuredClone(decisions);tamper.records.find(x=>x.assetId==='red_apple').sourceSha256='0'.repeat(64);
assert.equal(resolveCountScene(manifest,tamper,'red_apple',3).ok,false);
const tamper2=structuredClone(decisions);tamper2.records.find(x=>x.assetId==='red_apple').evidence.reviewPage='';
assert.equal(resolveCountScene(manifest,tamper2,'red_apple',3).ok,false);
const tamper3=structuredClone(manifest);tamper3.enabled=true;
assert.equal(resolveCountScene(tamper3,decisions,'red_apple',3).ok,false);
assert.equal(manifest.enabled,false);assert.equal(manifest.productionActivation,false);assert.equal(manifest.renderPolicy.allowCountInference,false);
console.log('PASS: 46 record reconciliation; 40 eligible explicit count scenes; 6 blocked; tamper, range and runtime safety checks');
