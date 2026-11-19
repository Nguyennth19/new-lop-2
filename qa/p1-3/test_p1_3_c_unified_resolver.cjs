'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},console,Map,Set};ctx.globalThis=ctx.window;
for(const x of ['59_Visual_Public_Assets','85_Fluent_Asset_46','87_Characters_Drive_30','88_Visual_Semantic_Router','83_Visual_Orchestrator','89_Asset_Unified_Resolver_TEST']){
 vm.runInNewContext(fs.readFileSync(x+'.html','utf8'),ctx,{filename:x+'.html'});
}
const uni=ctx.window.BE_HOC_ASSET_UNIFIED_TEST,sem=ctx.window.BE_HOC_VISUAL_SEMANTIC;
assert.equal(uni.release,'TEST_ONLY');assert.equal(uni.studentWrites,false);assert.equal(uni.autoGrade,false);
const assets=ctx.window.BE_HOC_ASSETS_288,fluent=ctx.window.BE_HOC_FLUENT_46,ch=ctx.window.BE_HOC_CHARACTERS_30;
let pass=0,deny=0;
for(const a of assets.search('',288)){
 const r=uni.resolve({assetId:a.id,visualIntent:'DECORATIVE'});
 assert.equal(r.ok,true,a.id);assert.equal(r.primary.kind,'WEBP');pass++;
 const d=uni.resolve({assetId:a.id,visualIntent:'EXACT_COUNT',exactQuantity:3,countUnit:'con'});
 assert.equal(d.ok,false);deny++;
}
for(const a of ch.list()){
 const r=uni.resolve({assetId:a.id,visualIntent:'DECORATIVE'});
 assert.equal(r.ok,true,a.id);assert.equal(r.primary.kind,'CHARACTER_WEBP');pass++;
 for(const role of ['CHOICE','EXACT_COUNT']){
  assert.equal(uni.resolve({assetId:a.id,visualIntent:role}).ok,false);deny++;
 }
}
for(const a of fluent.list()){
 const r=uni.resolve({assetId:'FLUENT:'+a.id,visualIntent:'DECORATIVE'});
 assert.equal(r.ok,true,a.id);assert.equal(r.primary.kind,'FLUENT_SVG');pass++;
 const bad=uni.resolve({assetId:'FLUENT:'+a.id,visualIntent:'EXACT_COUNT',countUnit:'wrong',exactQuantity:3});
 assert.equal(bad.ok,false);deny++;
}
const count=uni.resolve({assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT',countUnit:'con',exactQuantity:3});
assert.equal(count.ok,true);assert.equal(count.primary.exactQuantity,3);
for(const n of [0,-1,51,1.5,'3']){assert.equal(uni.resolve({assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT',countUnit:'con',exactQuantity:n}).ok,false);deny++;}
assert.equal(uni.resolve({assetId:'FLUENT:books',visualIntent:'EXACT_COUNT',countUnit:'cuốn',exactQuantity:3}).ok,false);deny++;
assert.equal(uni.resolve({canonicalObject:'quả táo',visualIntent:'DECORATIVE'}).reason,'AMBIGUOUS_SEMANTIC_MATCH');deny++;
const primary={assetId:'KL2_ROBOT_01_STAND',visualIntent:'DECORATIVE'};
assert.equal(uni.resolve({...primary,fallback:{assetId:'KL2_ROBOT_02_WAVE'}}).ok,true);
assert.equal(uni.resolve({...primary,fallback:{assetId:'KL2_ROBOT_02_WAVE',visualIntent:'CHOICE'}}).ok,false);deny++;
assert.equal(uni.resolve({...primary,fallback:{assetId:'KL2_ROBOT_01_STAND'}}).reason,'FALLBACK_CYCLE');deny++;
assert.equal(uni.resolve({...primary,fallback:{assetId:'KL_UNKNOWN'}}).ok,false);deny++;
assert.equal(uni.resolve({assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT',countUnit:'con',exactQuantity:3,fallback:{assetId:'FLUENT:rooster'}}).ok,false);deny++;
assert.equal(uni.resolve({assetId:'KL_SH01_001',visualIntent:'CHOICE',fallback:{assetId:'KL_SH01_002'}}).ok,false);deny++;
assert.equal(uni.resolve({assetId:'KL2_UNKNOWN',visualIntent:'DECORATIVE',fallback:{assetId:'KL2_ROBOT_01_STAND'}}).ok,false);deny++;
assert.equal(uni.planQuestion({lesson:{id:'toan_b20'}},{id:'q1',type:'vertical',skillId:'ADD_WITH_CARRY_2DIGIT',visualContract:{rendererId:'D5',assetId:'KL2_ROBOT_01_STAND',visualIntent:'DECORATIVE',publicVariant:{}}}).ok,false);
let callbacks=[],imgs=[];
ctx.window.document={createElement:()=>{const image={dataset:{},remove(){this.removed=true;},addEventListener(type,fn){if(type==='error')this.error=fn;}};imgs.push(image);return image;}};
const host={appendChild(){}};
const mounted=uni.mount(host,{...primary,fallback:{assetId:'KL2_ROBOT_02_WAVE'},onFallback:r=>callbacks.push(r)});
assert.equal(mounted.ok,true);assert.equal(mounted.fallbackSupportedOnLoadError,true);
imgs[0].error();assert.equal(imgs.length,2);assert.equal(imgs[0].removed,true);assert.equal(callbacks.length,1);
assert.equal(callbacks[0].reason,'EXPLICIT_FALLBACK_ATTEMPTED');
imgs[0].error();assert.equal(imgs.length,2); // at most one fallback
const noFallback=uni.mount(host,{...primary,onFallback:r=>callbacks.push(r)});
assert.equal(noFallback.ok,true);imgs[2].error();assert.equal(callbacks.at(-1).reason,'PRESERVE_EXISTING_CONTENT');
assert.equal(uni.mount(host,{assetId:'KL2_ROBOT_01_STAND',visualIntent:'EXACT_COUNT'}).ok,false);
console.log('P1_3_C_UNIFIED_RESOLVER_QA_PASS',JSON.stringify({catalogApprovedDecorative:pass,denied:deny,exactCountFluent:true,explicitFallbackOnce:true,unknownFailClosed:true,release:'TEST_ONLY'}));
