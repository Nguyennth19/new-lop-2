#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const raw=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const projected=JSON.parse(read('du-lieu/bien-the/chuan/toan_b20.visual-intent.v1.json'));
const secondary=JSON.parse(read('du-lieu/bien-the/chuan/tieng-viet-demo.visual-intent.v1.json'));
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const registry=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const manual=JSON.parse(read('du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json'));
const ctx={};vm.runInNewContext(read('BienTheVisualIntentChung.gs')+'\n'+read('BoChonAssetNguNghiaChung.gs')+
 '\nthis.PROJECTION=KLVisualIntentBienTheV1;this.SELECTOR=KL_BoChonAssetChungV1;',ctx);
const adapter=ctx.PROJECTION,selector=ctx.SELECTOR;
const compiled=selector.compileRules(rules,{releaseCommit:registry.release_commit,registryCommit:rules.registry_commit});
let passed=0,failed=0;
const check=(name,fn)=>{try{fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+' '+e.stack)}};
check('Original source 30 questions, six sessions',()=>{
 assert.equal(raw.questions.length,30);assert.equal(raw.sessions.length,6);
 assert.equal(raw.questions.filter(x=>x.type==='word').length,2);
});
check('Projected JSON is complete and versioned',()=>{
 assert.equal(projected.questions.length,30);assert.equal(projected.sessions.length,6);
 assert.equal(projected.visualIntentSchema,adapter.VERSION);
 assert.equal(projected.visualIntentProjection.source_blob_sha,'1225884c82ec1cc6812f747e6b75b2c1aece2483');
});
check('Source B20 file contains no visualIntent and was not rewritten',()=>{
 assert(raw.questions.every(x=>x.visualIntent===undefined));
 assert.equal(cp.execFileSync('git',['hash-object','thu-nghiem/bai-20-bien-the/runtime.json'],{encoding:'utf8'}).trim(),'1225884c82ec1cc6812f747e6b75b2c1aece2483');
});
check('Every original question field and answer remains bitwise JSON-identical',()=>{
 for(let i=0;i<30;i++){
  const q=projected.questions[i],original=raw.questions[i];
  for(const [k,v] of Object.entries(original))assert.deepEqual(q[k],v,original.question_id+' / '+k);
  assert.equal(q.question_id,original.question_id);
 }
});
check('All six session IDs/order stay identical',()=>{
 assert.equal(JSON.stringify(projected.sessions),JSON.stringify(raw.sessions));
});
check('Only two word questions are decorated by default',()=>{
 const enriched=projected.questions.filter(q=>q.visualIntent);
 assert.equal(enriched.length,2);
 for(const q of enriched){
  assert.equal(q.type,'word');assert.equal(q.visualIntent,'decorative');
  assert.equal(q.quantityMode,'symbolic');assert.deepEqual(q.semanticTags,[q.unit]);
  assert(!('requestedCount' in q));
 }
});
check('Generated projection JSON equals pure enrichment of original pack',()=>{
 const p=adapter.projectPack(raw);
 assert.equal(p.visualIntentSchema,projected.visualIntentSchema);
 assert.equal(JSON.stringify(p.questions),JSON.stringify(projected.questions));
});
check('No mutation on source pack or individual questions',()=>{
 const q=raw.questions[15],before=JSON.stringify(q);
 const x=adapter.enrichQuestion(q);
 assert.notEqual(x,q);assert.equal(JSON.stringify(q),before);
 assert.notEqual(x.semanticTags,raw.questions[15].semanticTags);
});
check('Existing non-word variant remains identical after normalization',()=>{
 const q=raw.questions.find(x=>x.type!=='word'),project=adapter.enrichQuestion(q);
 assert.equal(JSON.stringify(q),JSON.stringify(project));assert.notEqual(q,project);
});
check('B20 manual candy and book mappings take priority after visualIntent normalization',()=>{
 const m=selector.mergeQuestions(projected.questions,{schema_version:manual.schema_version,mode:'STAGING_ONLY',question_scenes:manual.question_scenes},compiled);
 assert.equal(m.selectionDiagnostics.filter(x=>x.result==='EXPLICIT_OVERRIDE').length,2);
 assert.equal(m.question_scenes.VAR_B20_20261112_016.scene.groups[0].items[0].assetId,'KL_SH02_010');
 assert.equal(m.question_scenes.VAR_B20_20261112_021.scene.groups[0].items[0].assetId,'KL_SH03_006');
 assert.equal(m.question_scenes.VAR_B20_20261112_021.pilot_only,true);
 assert.equal(Object.keys(m.question_scenes).length,2);
});
check('Nine curated rules and 288 registry IDs remain unchanged',()=>{
 assert.equal(rules.rules.length,9);assert.equal(registry.assets.length,288);
 assert.equal(new Set(registry.assets.map(a=>a.asset_id)).size,288);
});
check('Cross-lesson vocabulary bicycle selected using visualIntent',()=>{
 const q=secondary.questions[0],request=adapter.toSelectionRequest(q,{subjectArea:'tieng_viet'});
 const r=selector.select(request,compiled);
 assert.equal(request.visualIntent,'decorative');assert.equal(r.entry.scene.groups[0].items[0].assetId,'KL_SH11_012');
});
check('Cross-lesson backpack selected using visualIntent',()=>{
 const r=selector.select(adapter.toSelectionRequest(secondary.questions[1]),compiled);
 assert.equal(r.entry.scene.groups[0].items[0].assetId,'KL_SH09_007');
});
check('Cross-lesson quantity exact is refused, not rendered symbolically',()=>{
 const r=selector.select(adapter.toSelectionRequest(secondary.questions[2]),compiled);
 assert.equal(r.code,'REQUIRES_QUANTITY_VERIFICATION');
});
check('Cross-lesson ambiguous bicycle + backpack is refused',()=>{
 const r=selector.select(adapter.toSelectionRequest(secondary.questions[3]),compiled);
 assert.equal(r.code,'AMBIGUOUS_SEMANTICS');
});
check('Cross-lesson complete scene merge includes 2 images and 2 safe rejections',()=>{
 const side={schema_version:manual.schema_version,mode:'STAGING_ONLY',question_scenes:{}};
 const merged=selector.mergeQuestions(secondary.questions,side,compiled);
 assert.equal(Object.keys(merged.question_scenes).length,2);
 assert.equal(merged.selectionDiagnostics.filter(x=>x.result==='CURATED_AUTO').length,2);
 assert.equal(merged.selectionDiagnostics.some(x=>x.result==='REQUIRES_QUANTITY_VERIFICATION'),true);
 assert.equal(merged.selectionDiagnostics.some(x=>x.result==='AMBIGUOUS_SEMANTICS'),true);
});
check('Word prompt with previously unseen Question ID chooses candy without hardcoded map',()=>{
 const q=adapter.enrichQuestion({question_id:'B99_NEW_001',lesson_id:'toan_b99',type:'word',prompt:'Bé có 7 chiếc kẹo',unit:'chiếc kẹo'});
 const r=selector.select(adapter.toSelectionRequest(q),compiled);
 assert.equal(r.concept,'wrapped_candy');assert.equal(r.entry.scene.groups[0].items[0].count,1);
});
check('Decorative with requestedCount refuses contradictory metadata',()=>{
 assert.throws(()=>adapter.enrichQuestion({type:'word',visualIntent:'decorative',quantityMode:'symbolic',requestedCount:3}),/VISUAL_COUNT_FOR_DECORATIVE/);
});
check('Counting with no count refuses implicit inference',()=>{
 assert.throws(()=>adapter.enrichQuestion({type:'count',visualIntent:'counting',quantityMode:'exact'}),/VISUAL_COUNT_REQUIRED/);
});
check('Conflicting quantities and decorative refuse validation',()=>{
 assert.throws(()=>adapter.enrichQuestion({type:'word',visualIntent:'decorative',quantityMode:'exact'}),/VISUAL_DECORATIVE_EXACT_CONFLICT/);
});
check('Malformed or duplicate semantic tags rejected',()=>{
 assert.throws(()=>adapter.enrichQuestion({type:'word',semanticTags:['kẹo','kẹo']}),/VISUAL_TAGS_DUPLICATED/);
});
check('Nonword explicit visualIntent is supported on a future subject',()=>{
 const q=adapter.enrichQuestion({question_id:'TV_NEW_001',type:'vocabulary',visualIntent:'decorative',quantityMode:'symbolic',semanticTags:['xe đạp']});
 assert.equal(selector.select(adapter.toSelectionRequest(q),compiled).concept,'kids_bicycle');
});
check('Unknown semantic meaning is left without image',()=>{
 const q=adapter.enrichQuestion({question_id:'TV_NEW_002',type:'vocabulary',visualIntent:'decorative',quantityMode:'symbolic',semanticTags:['tàu vũ trụ']});
 assert.equal(selector.select(adapter.toSelectionRequest(q),compiled).code,'NO_SAFE_MATCH');
});
check('Output scenes are separate from answer/score source and have no writes',()=>{
 const s=read('BienTheVisualIntentChung.gs');
 for(const token of ['SpreadsheetApp','UrlFetchApp','setValue(','starsAwarded','document.','window.'])assert(!s.includes(token),token);
});
check('All previously approved B20 layout/renderer CSS bytes remain untouched',()=>{
 for(const [p,sha] of Object.entries({
 'GiaoDien.html':'7126b84512c992da6a2d45483b9edd7ab7931358',
 '41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
 '20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073',
 '43_CSS_ThanhPhanBaiToan.html':'ce7f279fc9185901d8f638bc87628b9c20bfda65'
 })) assert.equal(cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,p);
});
check('Demo 13/13 approved baseline is inherited not re-certified from screenshots',()=>{
 assert.equal(secondary.questions.length,4);
 assert.equal(read('du-lieu/bien-the/chuan/tieng-viet-demo.visual-intent.v1.json').includes('"visualIntent"'),true);
});
check('End-to-end B20 pipeline projects 30 questions and preserves explicit image precedence',()=>{
 const before=JSON.stringify(raw);
 const normalizedSidecar={schema_version:manual.schema_version,mode:'STAGING_ONLY',question_scenes:manual.question_scenes};
 const result=adapter.projectAndSelect(raw,normalizedSidecar,compiled,selector);
 assert.equal(result.questions.length,30);assert.equal(result.sessions.length,6);
 assert.equal(result.assetScenes.selectionDiagnostics.length,30);
 assert.equal(Object.keys(result.assetScenes.question_scenes).length,2);
 assert.equal(result.assetScenes.question_scenes.VAR_B20_20261112_021.scene.groups[0].items[0].assetId,'KL_SH03_006');
 assert.equal(JSON.stringify(raw),before);
});
check('End-to-end second lesson creates scenes without HTML changes or question-specific rules',()=>{
 const before=JSON.stringify(secondary);
 const output=adapter.projectAndSelect(secondary,null,compiled,selector);
 assert.equal(output.questions.length,4);
 assert.equal(output.assetScenes.selectionDiagnostics.length,4);
 assert.equal(Object.keys(output.assetScenes.question_scenes).length,2);
 assert.equal(output.assetScenes.selectionDiagnostics.filter(x=>x.result==='CURATED_AUTO').length,2);
 assert.equal(JSON.stringify(secondary),before);
});
console.log(JSON.stringify({stage:'G7.4-B.5.3',passed,failed,total:passed+failed}));
process.exitCode=failed?1:0;
