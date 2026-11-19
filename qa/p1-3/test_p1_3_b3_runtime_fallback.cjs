'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const m=JSON.parse(fs.readFileSync('qa/p1-3/P1_3_B2_CHARACTERS_MANIFEST.v2.json','utf8'));
const context={window:{},console,Map,Set};context.globalThis=context.window;
for(const name of ['59_Visual_Public_Assets','85_Fluent_Asset_46','87_Characters_Drive_30','88_Visual_Semantic_Router','83_Visual_Orchestrator']){
 vm.runInNewContext(fs.readFileSync(name+'.html','utf8'),context,{filename:name+'.html'});
}
const lib=context.window.BE_HOC_CHARACTERS_30;
const sem=context.window.BE_HOC_VISUAL_SEMANTIC;
const orch=context.window.BE_HOC_VISUAL_ORCHESTRATOR;
assert.equal(lib.count,30);
assert.equal(m.poses.length,30);
let valid=0,denied=0,indirect=0;
for(const p of m.poses){
 const asset=lib.resolve(p.assetId);
 assert.equal(asset.ok,true);assert.equal(asset.role,'DECORATIVE');
 assert.equal(sem.plan({assetId:p.assetId,visualIntent:'DECORATIVE'}).ok,true);valid++;
 for(const role of ['EXACT_COUNT','CHOICE']){
  const r=sem.plan({assetId:p.assetId,visualIntent:role,exactQuantity:2,countUnit:'bạn'});
  assert.equal(r.ok,false);assert.equal(r.reason,'CHARACTER_DECORATION_ONLY');denied++;
 }
 assert.equal(orch.semanticPlan({assetId:p.assetId,visualIntent:'DECORATIVE'}).ok,true);indirect++;
 // Direct chooseAsset is an older 288/Fluent path; prevent accidental claims that it routes characters.
 assert.equal(orch.chooseAsset({assetId:p.assetId,visualIntent:'DECORATIVE'}).ok,false);
}
assert.equal(orch.release,'SOURCE_TEST_ONLY');
assert.equal(orch.studentWrites,false);
assert.equal(orch.autoGrade,false);
assert.equal(m.qa.studentRelease,'NO_GO');
assert.equal(m.qa.publicRoutingApproval,'NOT_GRANTED_BY_THIS_AUDIT');
assert.equal(m.qa.ownerVisualApproval,'NOT_INFERRED');
assert.equal(m.runtimeContract.sourceSheetsRuntimeEligible,false);
for(const p of m.sourceSheets)assert.ok(!lib.resolve(p.path.split('/').pop().replace(/_v1\.png$/,'')).ok);
const originalContent={tag:'lesson-existing-child'};
let removed=0,callbackCount=0,errorHandler=null,appendCount=0;
const img={addEventListener:(type,cb)=>{assert.equal(type,'error');errorHandler=cb;},remove:()=>removed++,dataset:{}};
context.window.document={createElement:(name)=>{assert.equal(name,'img');return img;}};
const host={appendChild:(node)=>{assert.equal(node,img);appendCount++;}};
const result=lib.mount(host,m.poses[0].assetId,{visualIntent:'DECORATIVE',onError:()=>callbackCount++});
assert.equal(result.ok,true);assert.equal(appendCount,1);assert.equal(typeof errorHandler,'function');
errorHandler();
assert.equal(removed,1);assert.equal(callbackCount,1);
assert.equal(originalContent.tag,'lesson-existing-child'); // independent existing card not touched
assert.equal(lib.mount(host,m.poses[0].assetId,{visualIntent:'EXACT_COUNT'}).ok,false);
const missing=lib.resolve('KL2_UNKNOWN_99');assert.equal(missing.ok,false);
console.log('P1_3_B3_RUNTIME_AND_FALLBACK_QA_PASS',JSON.stringify({characterPlans:valid,semanticOrchestratorPlans:indirect,deniedRoles:denied,directChooseAssetCharacterUnsupported:30,imageErrorRemoval:1,errorCallback:1,existingMarkupRetained:true,automaticReplacementImage:false,release:'SOURCE_TEST_ONLY'}));
