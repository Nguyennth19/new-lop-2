'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
let checks=0;const ok=(x)=>{assert.ok(x);checks++},eq=(x,y)=>{assert.deepEqual(x,y);checks++};
const source=JSON.parse(fs.readFileSync('hinh-anh/svg-fallback/fluent-emoji-flat/v1/manifest.v1.json','utf8'));
const countContract=JSON.parse(fs.readFileSync('qa/be-hoc-orchestrator/count-contract-pinned.v1.json','utf8'));
const byId=new Map(countContract.assets.map(x=>[x.assetId,x]));
eq(source.total,46);const root={},ctx={window:root,Map,Set};
vm.runInNewContext(fs.readFileSync('85_Fluent_Asset_46.html','utf8'),ctx);
eq(root.BE_HOC_FLUENT_46.count,46);eq(root.BE_HOC_FLUENT_46.countSafe,45);
for(const item of source.icons){
 const path='hinh-anh/svg-fallback/fluent-emoji-flat/v1/'+item.relativePath;
 const data=fs.readFileSync(path);
 eq(data.length,item.bytes);
 eq(crypto.createHash('sha256').update(data).digest('hex'),item.sha256);
 ok(/<svg[\s>]/i.test(String(data)));ok(!/<script\b|<foreignObject\b|\bonload\s*=|javascript:/i.test(String(data)));
 const r=root.BE_HOC_FLUENT_46.resolve(item.id,'DECORATIVE');eq(r.ok,true);
 const contract=byId.get(item.id);
 const count=root.BE_HOC_FLUENT_46.resolve(item.id,'EXACT_COUNT',contract.canonicalUnit||'');
 eq(count.ok,contract.status==='COUNT_SAFE_APPROVED'&&contract.objectsPerAsset===1);
}
eq(root.BE_HOC_FLUENT_46.resolve('books','EXACT_COUNT','cuốn').reason,'FLUENT_UNIT_NOT_APPROVED');
eq(root.BE_HOC_FLUENT_46.resolve('banana','EXACT_COUNT','nải').reason,'FLUENT_UNIT_NOT_APPROVED');
eq(root.BE_HOC_FLUENT_46.resolve('banana','EXACT_COUNT','quả').ok,true);
console.log('VISUAL_ORCHESTRATOR_FLUENT_46_BINARY_SEMANTICS_PASS',checks,'assertions');
