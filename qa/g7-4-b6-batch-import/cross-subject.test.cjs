'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {countDecision,expansionDecision}=require('../g7-4-gates/count-expansion-gates.cjs');
const root=path.resolve(__dirname,'../..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const examples=load('qa/g7-4-b6-real-lesson-scenarios.v1.json');
const rules=load('du-lieu/asset-selector/semantic-rules.v1.json').rules;
const count=load('qa/g7-4-b5-10-count-safe-matrix.v1.json');
const manifest=load('hinh-anh/svg-fallback/fluent-emoji-flat/v1/manifest.v1.json');
const byConcept=new Map(rules.map(r=>[r.concept,r]));
let n=0;function pass(v){assert.ok(v);n++}
pass(examples.cases.length===5);
for(const c of examples.cases){
 const rule=byConcept.get(c.conceptKey);
 pass(!!rule&&rule.asset_id===c.existingAssetId);
 pass(c.expectedDecision===(c.usage==='COUNT_OBJECT'?'COUNT_GATE_BLOCKED':'REUSE_EXISTING_WEBP'));
 pass(c.quantityInference===false);
}
pass(examples.cases.filter(x=>x.subject==='TOAN').length===2);
pass(examples.cases.filter(x=>x.subject==='TIENG_VIET').length===1);
pass(examples.cases.filter(x=>x.subject==='TIENG_ANH').length===2);
pass(count.records.length===46&&manifest.icons.length===46);
for(const item of count.records){
 const icon=manifest.icons.find(x=>x.id===item.assetId);
 pass(!!icon&&item.sourceSha256===icon.sha256);
 pass(item.countQaStatus==='NOT_APPROVED'&&item.evidence.render44px===null);
 pass(countDecision(item,null).ok===false);
}
pass(new Set(count.records.map(x=>x.assetId)).size===46);
pass(count.records.filter(x=>x.countCategory==='SINGLE_OBJECT_CANDIDATE').length===35);
pass(count.records.filter(x=>x.countCategory==='CONTEXT_REVIEW').length===8);
pass(count.records.filter(x=>x.countCategory==='COMPOSITE_BLOCKED').length===3);
pass(manifest.enabled===false&&manifest.productionActivation===false);
const request={conceptKey:'kids_bicycle',subject:'TIENG_ANH',lessonId:'en_vocabulary_demo_visual',usage:'VOCABULARY',
proposedAssetId:'bicycle',sourceRepository:'microsoft/fluentui-emoji',sourceCommit:manifest.source.ref,
license:'MIT',licenseEvidence:'LICENSE',sha256:manifest.icons.find(x=>x.id==='bicycle').sha256,
securityQa:'PASS',visualQa:'OWNER_APPROVED',semanticQa:'OWNER_APPROVED'};
pass(expansionDecision(request,manifest.icons.map(x=>x.id)).reasons.includes('DUPLICATE_ID_USE_EXISTING'));
console.log(n+'/'+n+' data-backed cross-subject assertions PASS (dry-run only)');
