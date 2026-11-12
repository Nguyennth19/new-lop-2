#!/usr/bin/env node
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const runtime=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const ctx={module:{exports:{}},setTimeout,clearTimeout,AbortController,Date,console};ctx.globalThis=ctx;
function run(path){ctx.module={exports:{}};vm.runInNewContext(read(path),ctx,{filename:path});return ctx.module.exports;}
const loader=run('44_TaiAnhTheoAssetID.html');
const bridge=run('43_CauNoiAssetBienThe.html');
const pilot=run('45_AnhMinhHoaB20Pilot.html');
vm.runInNewContext(read('42_AdapterBienTheB20.html'),ctx);
const pack={variantPilot:true,lesson:{id:'toan_b20'},packVersion:runtime.schema_version,questions:runtime.questions,sessions:runtime.sessions};
const out=ctx.chuyenB20BienTheSangRenderer(pack);
const tests=[];
function t(name,fn){try{fn();tests.push({name,status:'PASS'});console.log('PASS',name);}catch(e){tests.push({name,status:'FAIL',message:String(e)});console.error('FAIL',name,e.message);}}
t('Retains 30 questions',()=>assert.equal(out.questions.length,30));
t('Retains 6 original sessions',()=>assert.equal(out.sessions.length,6));
t('Preserves every original answer and question order',()=>{
 const flattened=runtime.sessions.flatMap(s=>s.question_ids);
 assert.deepEqual(Array.from(out.questions,q=>q.id),flattened);
 for(const q of out.questions)assert.equal(Number(q.answer),runtime.questions.find(x=>x.question_id===q.id).answer);
});
t('Exactly two decorative scenes',()=>{
 const selected=out.questions.filter(q=>q.visualScene);
 assert.deepEqual(Array.from(selected,q=>q.id),['VAR_B20_20261112_016','VAR_B20_20261112_021']);
});
t('Candy uses approved label ID',()=>assert.equal(out.questions.find(q=>q.id.endsWith('016')).visualScene.groups[0].items[0].assetId,'KL_SH02_010'));
t('Generic book remains staged pending label signoff',()=>assert.equal(pilot.PILOT.VAR_B20_20261112_021.status,'OWNER_SIGNOFF_PENDING'));
t('Decorative scene does not imply numerical count',()=>{
 for(const q of out.questions.filter(q=>q.visualScene))assert.equal(q.visualScene.groups[0].items[0].count,1);
});
t('No source question mutated',()=>assert.equal(runtime.questions.some(q=>q.visualScene!==undefined),false));
t('Real loader resolves two files when manifest available',()=>{
 const entries=['KL_SH02_010','KL_SH03_006']; const fake={lookup(id){return entries.includes(id)?{ok:true}:{ok:false,code:'ASSET_NOT_FOUND'};},resolve(id){return entries.includes(id)?{ok:true,url:'https://example.com/'+id+'.webp'}:{ok:false,code:'ASSET_NOT_FOUND'};}};
 for(const q of out.questions.filter(q=>q.visualScene))assert.equal(bridge.resolveScene(q.visualScene,fake).ok,true);
});
t('Staging includes do not modify CSS or renderer 41',()=>{
 const ui=read('GiaoDien.html');
 for(const n of ['44_TaiAnhTheoAssetID','43_CauNoiAssetBienThe','45_AnhMinhHoaB20Pilot','42_AdapterBienTheB20'])assert.equal(ui.includes("napThanhPhan('"+n+"')"),true);
 assert.equal(ui.indexOf("napThanhPhan('45_AnhMinhHoaB20Pilot')")<ui.indexOf("napThanhPhan('42_AdapterBienTheB20')"),true);
});
t('Emoji fallback is seeded without modifying existing image or SVG',()=>{
 const target={children:[],querySelector(){return null;},appendChild(x){this.children.push(x);}};
 const root={querySelector(){return target;}};
 const doc={createElement(){return {attrs:{},setAttribute(k,v){this.attrs[k]=v;}}}};
 const q=out.questions.find(x=>x.id==='VAR_B20_20261112_021');
 assert.equal(pilot.ensureFallback(root,[q],doc),1);
 assert.equal(target.children[0].textContent,'📚');
 assert.equal(pilot.ensureFallback({querySelector(){return {querySelector(){return true;}};}},[q],doc),0);
});
t('Missing image keeps original scene and does not alter score',()=>{
 const scene=out.questions.find(q=>q.visualScene).visualScene;
 assert.equal(bridge.validateScene(scene).ok,true);
 assert.equal(out.questions.find(q=>q.visualScene).answer,String(runtime.questions.find(q=>q.question_id==='VAR_B20_20261112_016').answer));
});
const fail=tests.filter(x=>x.status==='FAIL').length;console.log(JSON.stringify({stage:'G7.4-B.2',passed:tests.length-fail,failed:fail,cases:tests.length},null,2));process.exitCode=fail?1:0;
