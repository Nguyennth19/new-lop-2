#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
const mapping=JSON.parse(read('du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json'));
const runtime=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const context={module:{exports:{}},Date,console,setTimeout,clearTimeout,AbortController};
context.globalThis=context;
function loadHtml(p){context.module={exports:{}};vm.runInNewContext(read(p),context,{filename:p});return context.module.exports;}
const loaderApi=loadHtml('44_TaiAnhTheoAssetID.html');
const bridge=loadHtml('43_CauNoiAssetBienThe.html');
const pilot=loadHtml('45_AnhMinhHoaB20Pilot.html');
vm.runInNewContext(read('42_AdapterBienTheB20.html'),context);
const tests=[];
function t(name,fn){
 try{fn();tests.push({name,status:'PASS'});console.log('PASS',name);}
 catch(e){tests.push({name,status:'FAIL',message:String(e)});console.error('FAIL',name,e.message);}
}
function getServer(failSidecar=false,sidecar=mapping){
 const ctx={console:{warn(){}},CacheService:{getScriptCache(){return {get(){return null},put(){}}}},
 UrlFetchApp:{fetch(url){
   if(url.includes('asset-scenes')){if(failSidecar)return {getResponseCode(){return 404}};
     return {getResponseCode(){return 200},getContentText(){return JSON.stringify(sidecar)}};}
   if(url.includes('runtime.json'))return {getResponseCode(){return 200},getContentText(){return JSON.stringify(runtime)}};
   throw Error('unexpected url '+url);
 }}};
 vm.runInNewContext(read('B20_AssetSceneMayChu.gs')+'\n'+read('B20_BienTheMayChu.gs'),ctx);
 return ctx;
}
const server=getServer();
const pack=server.b20DocPackThu_();
const projected=context.chuyenB20BienTheSangRenderer(pack);
const originalIds=runtime.sessions.flatMap(s=>s.question_ids);
t('JSON schema v1 and pinned binary commit',()=>{
 assert.equal(mapping.schema_version,'kidlearn-variant-asset-scene-v1');
 assert.equal(mapping.catalog_release_commit,'653bfbc73002a188dcea0b714247b84cc28a4fed');
});
t('No WebP URLs or HTML embedded in scene JSON',()=>{
 const s=JSON.stringify(mapping);
 assert.equal(s.includes('https://'),false);assert.equal(s.includes('<img'),false);
});
t('Validated sidecar delivered by mock Apps Script read-only server',()=>{
 assert.equal(Object.keys(pack.assetScenes.question_scenes).length,2);
 assert.equal(pack.questions.length,30);assert.equal(pack.sessions.length,6);
});
t('All 30 original IDs, order and answers unchanged',()=>{
 assert.deepEqual(Array.from(projected.questions,q=>q.id),originalIds);
 for(const q of projected.questions)assert.equal(Number(q.answer),runtime.questions.find(x=>x.question_id===q.id).answer);
});
t('Exactly two scene mappings and no mutations to raw runtime',()=>{
 assert.deepEqual(Array.from(projected.questions.filter(q=>q.visualScene),q=>q.id),
 ['VAR_B20_20261112_016','VAR_B20_20261112_021']);
 assert.equal(runtime.questions.some(q=>q.visualScene),false);
});
t('Only approved candy automatically suitable outside pilot',()=>{
 const candy=pack.assetScenes.question_scenes.VAR_B20_20261112_016;
 assert.equal(candy.label_approval_status,'LABEL_APPROVED');
 assert.equal(candy.scene.groups[0].items[0].assetId,'KL_SH02_010');
});
t('Pending book explicitly pilot-only',()=>{
 const book=pack.assetScenes.question_scenes.VAR_B20_20261112_021;
 assert.equal(book.label_approval_status,'OWNER_SIGNOFF_PENDING');
 assert.equal(book.pilot_only,true);
 assert.equal(book.scene.groups[0].items[0].assetId,'KL_SH03_006');
});
t('Pending label without pilot_only is blocked by server',()=>{
 const copy=JSON.parse(JSON.stringify(mapping));
 delete copy.question_scenes.VAR_B20_20261112_021.pilot_only;
 assert.throws(()=>getServer(false,copy).b20DocAssetScenes_(),/chờ duyệt/);
});
t('Offline/missing JSON preserves full 30-question lesson',()=>{
 const p=getServer(true).b20DocPackThu_();
 assert.equal(p.questions.length,30);assert.equal(p.assetScenes,undefined);
 const r=context.chuyenB20BienTheSangRenderer(p);
 assert.equal(r.questions.filter(q=>q.visualScene).length,0);
});
t('Reject unsafe traversal / invalid scene Asset IDs',()=>{
 const bad=JSON.parse(JSON.stringify(mapping));
 bad.question_scenes.VAR_B20_20261112_016.scene.groups[0].items[0].assetId='../etc';
 assert.throws(()=>getServer(false,bad).b20DocAssetScenes_(),/Asset ID/);
});
t('Reject too many repeated image instances',()=>{
 const bad=JSON.parse(JSON.stringify(mapping));
 bad.question_scenes.VAR_B20_20261112_016.scene.groups[0].items=Array.from({length:3},()=>({assetId:'KL_SH02_010',count:24}));
 assert.throws(()=>getServer(false,bad).b20DocAssetScenes_(),/48/);
});
t('Bridge composes 3+5 objects from same icon without new HTML',()=>{
 const s={groups:[{label:'Nhóm 1',items:[{assetId:'KL_SH02_010',count:3}]},{label:'Nhóm 2',items:[{assetId:'KL_SH02_010',count:5}]}]};
 assert.equal(bridge.validateScene(s).totalObjects,8);
});
t('Decorative icons do not masquerade as 47/34/39 quantities',()=>{
 for(const q of projected.questions.filter(q=>q.visualScene))
  assert.equal(q.visualScene.groups[0].items[0].count,1);
});
t('Unapproved mapping rejected by client without explicit staging opt-in',()=>{
 const bad=JSON.parse(JSON.stringify(pack.assetScenes));
 delete bad.question_scenes.VAR_B20_20261112_021.pilot_only;
 const q=runtime.questions.find(x=>x.question_id==='VAR_B20_20261112_021');
 assert.equal(pilot.sceneFor(q,bad),null);
});
t('Loader remains inert on creation (no mass mounts)',()=>{
 assert.equal(loaderApi.create({}).status().state,'IDLE');
});
t('GAS script is read-only and no CSS/renderer changed by this QA',()=>{
 const src=read('B20_AssetSceneMayChu.gs');
 assert.equal(src.includes('SpreadsheetApp'),false);
 assert.equal(src.includes('setValue('),false);
});
const failed=tests.filter(x=>x.status==='FAIL').length;
console.log(JSON.stringify({stage:'G7.4-B.3',total:tests.length,passed:tests.length-failed,failed,results:tests},null,2));
process.exitCode=failed?1:0;
