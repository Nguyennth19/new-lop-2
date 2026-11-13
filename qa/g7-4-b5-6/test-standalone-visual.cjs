#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const src=read('qa/g7-4-b5-6/G7_B56_Visual_Intent_Multi_Lesson_Demo.html');
const tv=JSON.parse(read('du-lieu/bien-the/chuan/tieng-viet-demo.visual-intent.v1.json'));
const en=JSON.parse(read('du-lieu/bien-the/chuan/tieng-anh-demo.visual-intent.v1.json'));
const registry=JSON.parse(read('du-lieu/bien-the/chuan/visual-intent-multi-lesson-gate.v1.json'));
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const assets=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const match=src.match(/const DATA=(\{.*?\});\s*const BASE=/s);
if(!match)throw Error('EMBEDDED_DEMO_DATA_NOT_FOUND');
const demo=JSON.parse(match[1]);
let pass=0,fail=0;function check(name,fn){try{fn();pass++;console.log('PASS '+name)}catch(e){fail++;console.error('FAIL '+name+' '+String(e))}}
check('Standalone HTML has embedded 2 lesson payloads',()=>{assert.equal(demo.lessons.length,2);assert(src.startsWith('<!doctype html>'))});
check('No external scripts or CDN are required',()=>assert(!/<script\s+src=/i.test(src)));
check('No production/student APIs or Apps Script endpoints',()=>{for(const w of ['script.google.com','SpreadsheetApp','google.script.run','setValue('])assert(!src.includes(w),w)});
check('Explicit browser-only feature flag ON/OFF controls',()=>assert(src.includes("id=\"toggle\"")&&src.includes('state.enabled=!state.enabled')));
check('Can simulate image 404/failure to exercise emoji fallback',()=>assert(src.includes("id=\"fail\"")&&src.includes("WEBP_FALLBACK")));
check('Has manual per-question QA checklist and downloadable JSON report',()=>assert(src.includes('data-check=')&&src.includes("application/json")&&src.includes('USER_MARKED_ALL')));
check('Responsive desktop/mobile layout in standalone HTML',()=>assert(src.includes('@media(max-width:690px)')));
check('WEBP URLs are pinned to immutable release, not main branch',()=>assert.equal(demo.release,registry.registryReleaseCommit));
check('Exactly 9 approved semantic rules from B5.5',()=>assert.equal(demo.rules.length,9));
check('Every semantic phrase is copied unchanged from B5.5',()=>{
 for(const a of demo.rules){let r=rules.rules.find(x=>x.asset_id===a.assetId);
 assert(r);assert.equal(JSON.stringify(a.phrases),JSON.stringify(r.match_phrases));assert.equal(a.approval,'LABEL_APPROVED')}
});
check('Each embedded asset matches authoritative manifest path',()=>{
 for(const [id,a]of Object.entries(demo.assets)){
 const original=assets.assets.find(x=>x.asset_id===id);
 assert(original);assert.equal(a.path,original.relative_path);assert.equal(a.status,'LABEL_APPROVED')}
});
check('TV demo has same text, IDs and visual intent as B5.5 fixture',()=>{
 const l=demo.lessons.find(x=>x.id===tv.lesson_id);assert(l);assert.deepEqual(JSON.parse(JSON.stringify(l.questions)),tv.questions);
});
check('English demo has same text, IDs and visual intent as B5.5 fixture',()=>{
 const l=demo.lessons.find(x=>x.id===en.lesson_id);assert(l);assert.deepEqual(JSON.parse(JSON.stringify(l.questions)),en.questions);
});
check('Five visual images, four safe rejections',()=>{
 let good=0,bad=0;
 for(const l of demo.lessons){let g=0,b=0;
  for(const q of l.questions){
   if(q.visualIntent==='decorative'&&q.quantityMode==='symbolic'&&new Set(q.semanticTags||[]).size===1){g++}else b++}
  assert.equal(g,l.expected.selected);assert.equal(b,l.expected.rejected);good+=g;bad+=b}
 assert.equal(good,5);assert.equal(bad,4);
});
check('Two tracked config flags remain OFF and no B20 allowlist entry',()=>{
 assert.equal(registry.enabled,false);
 assert(registry.lessons.every(x=>x.enabled===false&&x.lessonId!=='toan_b20'));
});
check('Original B20 JSON/CSS/renderer hashes stay unchanged',()=>{
 const expected={'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483',
 '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
 '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65'};
 for(const [p,sha]of Object.entries(expected))assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,p);
});
console.log(JSON.stringify({stage:'G7.4-B.5.6',pass,fail,total:pass+fail}));
process.exitCode=fail?1:0;
