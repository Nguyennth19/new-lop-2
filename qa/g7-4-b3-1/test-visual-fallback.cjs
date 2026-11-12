#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const doc=JSON.parse(read('du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json'));
function load(path){const ctx={module:{exports:{}}};ctx.globalThis=ctx;vm.runInNewContext(read(path),ctx);return ctx.module.exports;}
const bridge=load('43_CauNoiAssetBienThe.html'),pilot=load('45_AnhMinhHoaB20Pilot.html');
const cases=[];
const test=(label,fn)=>{try{fn();cases.push({label,status:'PASS'});console.log('PASS',label)}catch(e){cases.push({label,status:'FAIL',error:e.message});console.error('FAIL',label,e.message)}};
const createNode=(name)=>({name,children:[],hidden:false,attributes:{},
 setAttribute(k,v){this.attributes[k]=v;},
 appendChild(child){this.children.push(child);child.parentNode=this;},
 querySelector(selector){if(selector==='[data-kl-scene]')return this.children.find(x=>x.attributes&&x.attributes['data-kl-scene']==='1')||null;return null;},
 querySelectorAll(selector){return selector==='img,[data-kl-pilot-fallback]'?this.children.filter(x=>x.name==='img'||x.attributes?.['data-kl-pilot-fallback']):[];}
});
const make=(id,kind='img')=>{const target=createNode('slot'),old=createNode(kind);if(kind==='img')target.appendChild(old);
 else if(kind==='fallback'){old.setAttribute('data-kl-pilot-fallback','1');target.appendChild(old);}
 const root={querySelector(selector){return selector==='[data-ml-svg="'+id+'"]'?target:null}};
 const mockDocument={createElement:createNode};return {root,target,old,mockDocument}};
function loaderMock(){let callbacks=[];
 return {callbacks,
 lookup(){return {ok:true}},
 resolve(id){return {ok:true,url:'https://example.com/'+id+'.webp'}},
 mount(container,id,opts){let img=createNode('img');container.appendChild(img);callbacks.push(opts);return {ok:true,img};}};
}
for(const id of ['VAR_B20_20261112_016','VAR_B20_20261112_021']){
 const raw={id,type:'word_problem',variantType:'word',prompt:'test'},mapped=pilot.decorate(raw,bridge,{schema_version:doc.schema_version,mode:doc.mode,question_scenes:doc.question_scenes});
 test(id+' scene is JSON-driven and valid',()=>{assert(mapped.attached);assert(bridge.validateScene(mapped.question.visualScene).ok);});
 test(id+' keeps legacy illustration until new WebP has loaded',()=>{
  const d=make(id),loader=loaderMock();const r=pilot.mountVisible(d.root,[mapped.question],bridge,loader,{document:d.mockDocument});
  assert.equal(r.mounted,1);assert.equal(d.old.hidden,false);
  loader.callbacks[0].onReady();
  assert.equal(d.old.hidden,true);
 });
 test(id+' restores legacy illustration on image error after readiness',()=>{
  const d=make(id),loader=loaderMock();pilot.mountVisible(d.root,[mapped.question],bridge,loader,{document:d.mockDocument});
  loader.callbacks[0].onReady();assert.equal(d.old.hidden,true);
  loader.callbacks[0].onFallback('IMAGE_LOAD_FAILED');assert.equal(d.old.hidden,false);
 });
 test(id+' keeps emoji fallback when G5 image absent',()=>{
  const d=make(id,'fallback'),loader=loaderMock();const r=pilot.mountVisible(d.root,[mapped.question],bridge,loader,{document:d.mockDocument});
  assert.equal(r.mounted,1);assert.equal(d.old.hidden,false);loader.callbacks[0].onFallback('IMAGE_LOAD_FAILED');
  assert.equal(d.old.hidden,false);
 });
}
const bad=cases.filter(x=>x.status==='FAIL');console.log(JSON.stringify({stage:'G7.4-B.3.1 visual-state simulation',pass:cases.length-bad.length,fail:bad.length},null,2));process.exitCode=bad.length?1:0;
