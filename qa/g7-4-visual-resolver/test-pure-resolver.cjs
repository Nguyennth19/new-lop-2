#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const registry=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const rules=JSON.parse(read('du-lieu/asset-selector/semantic-rules.v1.json'));
const b58=JSON.parse(read('du-lieu/asset-selector/count-composition-b58-test.v1.json'));
const flags=JSON.parse(read('du-lieu/bien-the/chuan/visual-intent-multi-lesson-gate.v1.json'));
const c={};vm.runInNewContext(read('BoDieuPhoiHinhAnhG74Test.gs')+'\nthis.TEST=KL_G74_VisualResolverTestV1',c);
const api=c.TEST,source={registry,rules},on={mode:'STAGING_ONLY',enabled:true},off={mode:'STAGING_ONLY',enabled:false};
const base={contractVersion:'g7-visual-request-v1',questionId:'TEST_B58',lessonId:'TOAN_20',sceneId:'main',
  subject:'TOAN',exerciseType:'VISUAL_MCQ',visualIntent:'DECORATIVE',display:{answerVisibility:'POST_SUBMIT_ONLY'}};
const quantity=(assetId,groups,expectedTotal,unitPerSymbol=1,intent='GROUPED_COUNT')=>({
 ...base,visualIntent:intent,exerciseType:'PICTOGRAPH_TAP_COUNT',conceptKey:undefined,preferredWebpAssetId:assetId,
 quantity:{mode:'EXACT',groups:groups.map((count,i)=>({groupId:'group_'+i,count})),expectedTotal,unitPerSymbol}
});
let pass=0,fail=0;function testCase(name,f){try{f();pass++;console.log('PASS',name)}catch(e){fail++;console.error('FAIL',name,e.stack)}}
testCase('288 labels all approved but no unauthorized semantic grants',()=>{assert.equal(registry.assets.length,288);assert(registry.assets.every(a=>a.label_status==='LABEL_APPROVED'));assert.equal(Object.keys(api.compile(source).curated).length,9)});
testCase('Original nine rules unchanged and disabled quantity policy',()=>{assert.equal(rules.rules.length,9);assert.equal(rules.selection_policy.allow_quantity_inference,false);assert.equal(b58.enabled,false);assert.equal(flags.enabled,false)});
testCase('TEST gate default OFF prevents resolving even known curated concept',()=>{assert.equal(api.resolve({...base,conceptKey:'wrapped_candy'},source,off).code,'TEST_GATE_OFF');assert.equal(api.resolve({...base,conceptKey:'wrapped_candy'},source).code,'TEST_GATE_OFF')});
testCase('Curated candy single WebP resolves pinned immutable URL',()=>{const r=api.resolve({...base,conceptKey:'wrapped_candy'},source,on);assert.equal(r.ok,true);assert.equal(r.assets[0].assetIdOrIconId,'KL_SH02_010');assert(r.assets[0].url.includes(api.RELEASE));assert.equal(r.answerDisclosure,'NONE')});
testCase('All nine source rules resolve decorative by curated concept',()=>{for(const rule of rules.rules){const r=api.resolve({...base,conceptKey:rule.concept},source,on);assert.equal(r.ok,true,rule.concept);assert.equal(r.assets[0].assetIdOrIconId,rule.asset_id)}});
testCase('Unknown concept blocked despite 288 labels',()=>assert.equal(api.resolve({...base,conceptKey:'book_closed'},source,on).code,'MAPPING_NOT_APPROVED'));
testCase('Search exact phrase resolves only curated match',()=>assert.equal(api.resolve({...base,searchPhrase:'viên kẹo'},source,on).ok,true));
testCase('Conflicting asset override blocked',()=>assert.equal(api.resolve({...base,conceptKey:'wrapped_candy',preferredWebpAssetId:'KL_SH03_006'},source,on).code,'ASSET_OVERRIDE_NOT_CURATED'));
testCase('Client URL, HTML and QA bypass requests rejected',()=>{for(const k of ['src','url','html','svgMarkup','onerrorScript','apiUrl','qaPassed','iconifyUrl'])assert.equal(api.resolve({...base,[k]:'hijack'},source,on).code,'INVALID_REQUEST')});
testCase('Unsupported intent and malformed question blocked',()=>{assert.equal(api.resolve({...base,visualIntent:'unrecognized'},source,on).code,'UNSUPPORTED_INTENT');assert.equal(api.resolve({...base,questionId:'<img>'},source,on).code,'INVALID_REQUEST')});
testCase('B58 candidate five books fail closed without count evidence',()=>assert.equal(api.resolve(quantity('KL_SH03_006',[5],5),source,on).code,'QUANTITY_EVIDENCE_MISSING'));
testCase('B58 candidate eight chickens fail closed',()=>assert.equal(api.resolve(quantity('KL_SH05_004',[8],8),source,on).code,'QUANTITY_EVIDENCE_MISSING'));
testCase('Multi-object apple cannot be repeated',()=>assert.equal(api.resolve(quantity('KL_M03_006',[6],6),source,on).code,'QUANTITY_EVIDENCE_MISSING'));
testCase('4+3 cannot present total eight',()=>assert.equal(api.resolve(quantity('KL_SH03_006',[4,3],8),source,on).code,'COUNT_MISMATCH'));
testCase('Duplicate group identifiers blocked',()=>{const r=quantity('KL_SH03_006',[4,3],7);r.quantity.groups[1].groupId=r.quantity.groups[0].groupId;assert.equal(api.resolve(r,source,on).code,'INVALID_REQUEST')});
testCase('Zero objects supported without accidental fake one',()=>{const r=quantity('KL_SH03_006',[0],0);assert.equal(api.validateVisualRequest(r).ok,true);assert.equal(api.resolve(r,source,on).code,'QUANTITY_EVIDENCE_MISSING')});
testCase('Negative/fractional/object-count overflow rejected',()=>{for(const n of [-1,1.5,201])assert.equal(api.resolve(quantity('KL_SH03_006',[n],n),source,on).code,'INVALID_REQUEST')});
testCase('Non-pictograph scaling of two per symbol denied',()=>assert.equal(api.resolve(quantity('KL_SH03_006',[3],6,2),source,on).code,'UNIT_PER_SYMBOL_UNSUPPORTED'));
testCase('Pictograph 1 icon equals 2 remains evidence-gated',()=>assert.equal(api.resolve(quantity('KL_SH03_006',[3],6,2,'PICTOGRAPH'),source,on).code,'QUANTITY_EVIDENCE_MISSING'));
testCase('Fluent manifest cannot secretly be enabled before import',()=>assert.throws(()=>api.compile({...source,fluentManifest:{enabled:true}})));
testCase('Corrupt 288 registry and altered rules denied',()=>{assert.throws(()=>api.compile({...source,registry:{...registry,total:287}}));assert.throws(()=>api.compile({...source,rules:{...rules,rules:rules.rules.slice(1)}}))});
testCase('Geometry plan uses parametric SVG and zero icon sources',()=>{const r=api.resolve({...base,visualIntent:'GEOMETRY',math:{rendererId:'GEOM_TRIANGLE'}},source,on);assert.equal(r.ok,true);assert.equal(r.renderMode,'PARAMETRIC_SVG');assert.equal(r.assets.length,0)});
testCase('Measurement requires named math renderer and TOAN subject',()=>{const r=api.resolve({...base,visualIntent:'MEASUREMENT',math:{rendererId:'MEASURE_LENGTH'}},source,on);assert.equal(r.ok,true);assert.equal(api.resolve({...base,visualIntent:'MEASUREMENT'},source,on).code,'MATH_RENDERER_NOT_REGISTERED');assert.equal(api.resolve({...base,visualIntent:'MEASUREMENT',subject:'TIENG_ANH',math:{rendererId:'MEASURE_LENGTH'}},source,on).code,'SUBJECT_INTENT_MISMATCH')});
testCase('No automatic personal data write or DOM/network usage',()=>{const code=read('BoDieuPhoiHinhAnhG74Test.gs');for(const s of ['SpreadsheetApp','google.script.run','fetch(','document.','localStorage','setValue(','innerHTML'])assert(!code.includes(s),s)});
testCase('B20 runtime and CSS hashes remain as previously approved',()=>{const cp=require('node:child_process');for(const [path,sha] of Object.entries({'thu-nghiem/bai-20-bien-the/runtime.json':'1225884c82ec1cc6812f747e6b75b2c1aece2483','41_HienThiCauHoiToan.html':'50501ccc3cb5e7801fd563807e21b76d2a51c8f9','20_CSS_KhongGianHocToan.html':'3933b7f1812e08831bb7de90c1bf0f39ab87b073'}))assert.equal(cp.execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),sha)});
console.log(JSON.stringify({stage:'G7.4-PURE-RESOLVER',passed:pass,failed:fail,total:pass+fail}));
if(fail)process.exitCode=1;
