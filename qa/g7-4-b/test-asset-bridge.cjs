#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const code=fs.readFileSync(path.resolve(__dirname,'../../43_CauNoiAssetBienThe.html'),'utf8');
const sandbox={module:{exports:{}}};sandbox.globalThis=sandbox;
vm.runInNewContext(code,sandbox);
const bridge=sandbox.module.exports;
let passed=0;
const t=(name,fn)=>{fn();passed++;console.log('PASS',name)};
const scene={groups:[{label:'Chuồng 1',items:[{assetId:'KL_SH01_001',count:3}]},{label:'Chuồng 2',items:[{assetId:'KL_SH01_001',count:5}]}]};
const loader={
 lookup(id){return {ok:true}},
 resolve(id){return id==='KL_SH01_001'?{ok:true,url:'https://example.com/'+id+'.webp'}:{ok:false,code:'ASSET_NOT_FOUND'}},
 mount(target,id,opts){const img=opts.document.createElement('img');target.appendChild(img);return {ok:true,img};}
};
function dom(){
 const make=(tag)=>({tag,children:[],attributes:{},setAttribute(n,v){this.attributes[n]=v},appendChild(x){this.children.push(x)}});
 return {document:{createElement:make},container:make('div')};
}
t('Eight objects composed from one reusable image',()=>{const r=bridge.validateScene(scene);assert.equal(r.ok,true);assert.equal(r.totalObjects,8)});
t('No hardcoded URLs in lesson question',()=>{const q={id:'VAR_B20_001',answer:8};const result=bridge.decorate(q,scene);assert.equal(result.ok,true);assert.equal(result.question.answer,8);assert.equal(q.visualScene,undefined);assert.equal(JSON.stringify(result.question).includes('http'),false)});
t('Each group preserves counts',()=>{const r=bridge.resolveScene(scene,loader);assert.equal(r.ok,true);assert.equal(r.groups[0].items[0].count,3);assert.equal(r.groups[1].items[0].count,5)});
t('Reject malformed Asset ID',()=>assert.equal(bridge.validateScene({groups:[{items:[{assetId:'../../x',count:1}]}]}).code,'INVALID_ASSET_ITEM'));
t('Reject zero or non-integer count',()=>assert.equal(bridge.validateScene({groups:[{items:[{assetId:'KL_SH01_001',count:0}]}]}).code,'INVALID_ASSET_ITEM'));
t('Reject huge scenes',()=>assert.equal(bridge.validateScene({groups:[{items:[{assetId:'KL_SH01_001',count:24},{assetId:'KL_SH01_001',count:24},{assetId:'KL_SH01_001',count:1}]}]}).code,'SCENE_TOO_LARGE'));
t('Missing asset blocks scene resolution',()=>assert.equal(bridge.resolveScene({groups:[{items:[{assetId:'KL_M01_001',count:1}]}]},loader).code,'ASSET_UNAVAILABLE'));
t('Invalid target rejected',()=>assert.equal(bridge.mountScene(null,scene,loader).code,'INVALID_TARGET'));
t('Explicit mount creates 8 images, no app rewrites',()=>{const d=dom();d.container.appendChild({tag:'svg'});const r=bridge.mountScene(d.container,scene,loader,{document:d.document});assert.equal(r.ok,true);assert.equal(r.images,8);assert.equal(d.container.children[0].tag,'svg');assert.equal(d.container.children.length,2);assert.equal(r.wrapper.children.length,2)});
console.log(JSON.stringify({stage:'G7.4-B pilot bridge',passed,failed:0}));
