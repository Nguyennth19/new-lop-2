#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const reg=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const sidecar=JSON.parse(read('du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json'));
const runtime=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
function server(){const ctx={console:{warn(){}},CacheService:{getScriptCache:()=>({get:()=>null,put(){}})},UrlFetchApp:{fetch(url){let data=url.includes('semantic-rules.v1.json')?rules:url.includes('asset-scenes.json')?sidecar:runtime;return {getResponseCode:()=>200,getContentText:()=>JSON.stringify(data)};}}};vm.runInNewContext(read('BoChonAssetNguNghiaChung.gs')+'\n'+read('B20_BoChonHinhThongMinh.gs')+'\n'+read('B20_AssetSceneMayChu.gs')+'\n'+read('B20_BienTheMayChu.gs'),ctx);return ctx;}
const ctx=server(),loaded=ctx.b20DocLuatAnhThongMinh_();let pass=0,fail=0;
function t(name,fn){try{fn();pass++;console.log('PASS',name)}catch(e){fail++;console.error('FAIL',name, String(e))}}
const examples=[
 ['school_backpack','Có 4 chiếc ba lô và thêm 2 chiếc ba lô.','KL_SH09_007'],
 ['kids_bicycle','Có 5 xe đạp trẻ em.','KL_SH11_012'],
 ['watermelon','Có 3 quả dưa hấu.','KL_M04_007'],
 ['rice_bag','Có 2 bao gạo.','KL_M04_006'],
 ['water_bucket','Có 8 xô nước.','KL_M05_006'],
 ['baseball_cap','Có 3 mũ lưỡi trai.','KL_SH09_004']
];
t('Three original concepts plus six new = nine unique approved rules',()=>{
 assert.equal(rules.rules.length,9);assert.equal(new Set(rules.rules.map(x=>x.concept)).size,9);assert.equal(new Set(rules.rules.map(x=>x.asset_id)).size,9);
 assert.equal(loaded.rules.length,9);
});
t('All rules reference the pinned 288 registry and keep decorative count one',()=>{
 assert.equal(reg.assets.length,288);assert.equal(rules.release_commit,reg.release_commit);
 for(const x of rules.rules){const a=reg.assets.find(y=>y.asset_id===x.asset_id);assert(a);assert.equal(a.label_status,'LABEL_APPROVED');assert.equal(a.label_vi,x.label_vi);assert.equal(x.count,1);assert.equal(x.review_tier,'STAGING_CURATED');}
});
for(const [concept,prompt,id] of examples){
 t('Select '+concept+' by semantic phrase, no Question ID mapping',()=>{
  const hit=ctx.b20ChonHinhNguNghia_({question_id:'NEW_'+concept,type:'word',prompt},loaded);
  assert.equal(hit.ok,true);assert.equal(hit.concept,concept);assert.equal(hit.entry.scene.groups[0].items[0].assetId,id);
  assert.equal(hit.entry.usage,'decorative');assert.equal(hit.entry.scene.groups[0].items[0].count,1);
 });
}
t('Mixed backpack and bicycle is ambiguous and falls back',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Một chiếc ba lô và một chiếc xe đạp.'},loaded);
 assert.equal(r.code,'AMBIGUOUS_SEMANTICS');
});
t('Composite numbers 47 + 34 never translate to 81 repeated icons',()=>{
 const r=ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Có 47 quả dưa hấu và thêm 34 quả dưa hấu'},loaded);
 assert.equal(r.entry.scene.groups[0].items[0].count,1);
});
t('Pending book still has NO_SAFE_MATCH in automatic rules',()=>{
 assert.equal(ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Có 34 quyển truyện'},loaded).code,'NO_SAFE_MATCH');
});
t('Unrelated phrase avoids substring false-positive',()=>{
 assert.equal(ctx.b20ChonHinhNguNghia_({type:'word',prompt:'Chúng em học bài về cánh buồm'},loaded).code,'NO_SAFE_MATCH');
});
t('Non-word variants must not auto-assign even if text mentions objects',()=>{
 assert.equal(ctx.b20ChonHinhNguNghia_({type:'mental',prompt:'Có xe đạp'},loaded).code,'NOT_APPLICABLE');
});
t('Explicit mappings 016 and 021 remain exactly unchanged',()=>{
 const out=ctx.b20DocPackThu_();
 assert.equal(out.questions.length,30);assert.equal(out.sessions.length,6);
 assert.deepEqual(Object.keys(out.assetScenes.question_scenes).sort(),Object.keys(sidecar.question_scenes).sort());
 for(const id of Object.keys(sidecar.question_scenes)){
   const expected=sidecar.question_scenes[id],actual=out.assetScenes.question_scenes[id];
   assert.equal(actual.usage,expected.usage);
   assert.equal(actual.label_approval_status,expected.label_approval_status);
   assert.equal(actual.fallback_emoji,expected.fallback_emoji);
   assert.equal(actual.pilot_only,expected.pilot_only===true);
   assert.deepEqual(JSON.parse(JSON.stringify(actual.scene)),expected.scene);
 }
});
t('No user data writes or renderer/CSS change',()=>{
 assert(!read('B20_BoChonHinhThongMinh.gs').includes('SpreadsheetApp'));
 assert(!read('B20_BoChonHinhThongMinh.gs').includes('setValue('));
 const expected={
  'GiaoDien.html':'7126b84512c992da6a2d45483b9edd7ab7931358',
  '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
  '20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073',
  '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65',
  'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483'};
 for(const [file,hash] of Object.entries(expected))
  assert.equal(cp.execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim(),hash);
});
t('Pinned rules file must match the current immutable commit URL',()=>{
 assert(read('B20_BoChonHinhThongMinh.gs').includes('6faead9028c1e27d815c4b5de6652923fd1506a0'));
});
console.log(JSON.stringify({stage:'G7.4-B.4.1',pass,fail,total:pass+fail}));
process.exitCode=fail?1:0;
