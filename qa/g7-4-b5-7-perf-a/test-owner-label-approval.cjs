#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const path='du-lieu/asset-selector/asset-registry-288.v1.json';
const base='test/g7-4-b5-7-perf-a-gallery-20261113';
const before=JSON.parse(cp.execFileSync('git',['cat-file','blob','d63d383cefef8252cb6ead6eaf7fa39bd072e92a'],{encoding:'utf8',maxBuffer:4*1024*1024}));
const after=JSON.parse(fs.readFileSync(path,'utf8'));
const audit=JSON.parse(fs.readFileSync('qa/g7-4-b5-7-perf-a/owner-label-approval-188.audit.json','utf8'));
let passed=0,failed=0;function test(name,fn){try{fn();passed++;console.log('PASS',name)}catch(e){failed++;console.error('FAIL',name,e.stack)}}
test('288 labels now all approved',()=>{
 assert.equal(after.assets.length,288);
 assert.equal(after.assets.filter(a=>a.label_status==='LABEL_APPROVED').length,288);
 assert.equal(after.assets.filter(a=>a.label_status==='OWNER_SIGNOFF_PENDING').length,0);
});
test('Exactly 188 transitions from pending to approved, unchanged prior 100',()=>{
 const old=before.assets.reduce((p,a)=>(p[a.label_status]=(p[a.label_status]||0)+1,p),{});
 assert.equal(old.OWNER_SIGNOFF_PENDING,188);assert.equal(old.LABEL_APPROVED,100);
 const converted=after.assets.filter((a,i)=>before.assets[i].label_status!==a.label_status);
 assert.equal(converted.length,188);
 assert(converted.every(a=>a.label_status==='LABEL_APPROVED'));
});
test('No other JSON field, order, ID, label, path, policy or release modified',()=>{
 assert.equal(before.release_commit,after.release_commit);
 assert.equal(before.total,after.total);
 for(let i=0;i<288;i++){
  const original=before.assets[i],current=after.assets[i];
  const normalized={...current,label_status:original.label_status};
  assert.deepEqual(normalized,original,original.asset_id);
 }
});
test('Audit ledger documents every converted asset',()=>{
 assert.equal(audit.changed,188);
 assert.equal(audit.finalApproved,288);
 assert.equal(audit.finalPending,0);
 assert.equal(audit.changes.length,188);
 const expected=before.assets.filter(x=>x.label_status==='OWNER_SIGNOFF_PENDING').map(x=>x.asset_id);
 assert.deepEqual(audit.changes.map(x=>x.assetId),expected);
 assert(audit.changes.every(x=>x.previous==='OWNER_SIGNOFF_PENDING'&&x.current==='LABEL_APPROVED'));
});
test('Pre- and post-approval Git blob SHA anchored to audit',()=>{
 const oldSha='d63d383cefef8252cb6ead6eaf7fa39bd072e92a';
 const newSha=cp.execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();
 assert.equal(oldSha,audit.originalRegistryBlobSha);
 assert.equal(newSha,audit.approvedRegistryBlobSha);
});
test('Semantic selection still restricted to 9 curated rules, not blanket activated',()=>{
 const r=JSON.parse(fs.readFileSync('du-lieu/asset-selector/semantic-rules.v1.json','utf8'));
 assert.equal(r.rules.length,9);
 assert.equal(r.selection_policy.allow_quantity_inference,false);
 assert.equal(r.selection_policy.require_curated_rule,true);
});
test('Quantity/object policy not changed by label approval',()=>{
 for(let i=0;i<288;i++){
  const beforeA=before.assets[i],afterA=after.assets[i];
  assert.equal(afterA.render_policy,beforeA.render_policy);
  assert.equal(afterA.content_qa,beforeA.content_qa);
 }
 assert.equal(after.assets.find(x=>x.asset_id==='KL_SH03_006').render_policy,'OBJECT_ONLY_NO_COUNT_ASSUMPTION');
 assert.equal(after.assets.find(x=>x.asset_id==='KL_SH05_004').render_policy,'OBJECT_ONLY_NO_COUNT_ASSUMPTION');
});
test('Gallery points to newly approved pinned registry, keeps original WebP release',()=>{
 const html=fs.readFileSync('qa/g7-4-b5-7-perf-a/G7_B57_PERF_A_Gallery_288.html','utf8');
 assert(html.includes('b411774211c490c76cc9aaa110d6053e07da3ed3'));
 assert(html.includes('653bfbc73002a188dcea0b714247b84cc28a4fed'));
 assert(!html.includes('bcb86bb3804fc33737e716b4e71c5656b922184d'));
});
test('Visual Intent multi-lesson flags remain OFF',()=>{
 const x=JSON.parse(fs.readFileSync('du-lieu/bien-the/chuan/visual-intent-multi-lesson-gate.v1.json','utf8'));
 assert.equal(x.enabled,false);assert(x.lessons.every(y=>y.enabled===false));
});
console.log(JSON.stringify({stage:'G7.4-B.5.7-PERF-A-OWNER-APPROVAL',pass:passed,fail:failed,total:passed+failed}));
process.exitCode=failed?1:0;
