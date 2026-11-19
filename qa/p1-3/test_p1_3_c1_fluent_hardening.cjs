'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},console,Map,Set};ctx.globalThis=ctx.window;
for(const name of ['59_Visual_Public_Assets','85_Fluent_Asset_46','87_Characters_Drive_30','88_Visual_Semantic_Router','83_Visual_Orchestrator','89_Asset_Unified_Resolver_TEST']){
 vm.runInNewContext(fs.readFileSync(name+'.html','utf8'),ctx,{filename:name+'.html'});
}
const unified=ctx.window.BE_HOC_ASSET_UNIFIED_TEST;
const images=[];
function element(tag){
 return {tag,dataset:{},children:[],removed:false,appendChild(x){this.children.push(x);},remove(){this.removed=true;},
  querySelectorAll(selector){return selector==='img'?this.children.filter(x=>x.tag==='img'):[];},
  addEventListener(event,fn){(this.listeners||=( {} ))[event]=fn;}};
}
ctx.window.document={createElement(tag){const x=element(tag);if(tag==='img'){images.push(x);}return x;}};
const existing=element('p'),host=element('div');host.appendChild(existing);
let events=[];
const valid=unified.mount(host,{assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT',countUnit:'con',exactQuantity:3,onFallback:x=>events.push(x)});
assert.equal(valid.ok,true);assert.equal(valid.fallbackSupportedOnLoadError,true);assert.equal(images.length,3);
const scene=host.children[1];assert.equal(scene.children.length,3);
assert.equal(typeof images[0].listeners.error,'function');
images[1].listeners.error();
assert.equal(scene.removed,true,'entire incomplete scene removed');assert.equal(existing.removed,false);
assert.equal(events.length,1);assert.equal(events[0].reason,'PRESERVE_EXISTING_CONTENT');
images[2].listeners.error();assert.equal(events.length,1,'all errors collapsed into one');
const noAlt=unified.resolve({assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT',countUnit:'con',exactQuantity:3,fallback:{assetId:'FLUENT:rooster'}});
assert.equal(noAlt.ok,false);
const decor=unified.mount(host,{assetId:'FLUENT:books',visualIntent:'DECORATIVE',onFallback:x=>events.push(x)});
assert.equal(decor.ok,true);images[3].listeners.error();assert.equal(events.length,2);assert.equal(host.children[2].removed,true);
assert.equal(existing.removed,false);
assert.equal(unified.planQuestion({lesson:{id:'toan_b20'}},{id:'q1',type:'vertical',skillId:'ADD_WITH_CARRY_2DIGIT',visualContract:{rendererId:'D5',assetId:'KL2_ROBOT_01_STAND',visualIntent:'DECORATIVE',publicVariant:{}}}).ok,false);
console.log('P1_3_C1_FLUENT_HARDENING_PASS',JSON.stringify({exactCountSceneRemoved:true,allThreeImagesCollapsed:true,originalContentIntact:true,singleCallback:true,fluentDecorativeRemoved:true,rendererDenied:true,productionUntouched:true}));
