'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm');
const data=JSON.parse(fs.readFileSync('qa/be-hoc-visual/g7-webp-binary-pins.v1.json','utf8'));
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;};const eq=(a,b)=>{assert.equal(a,b);n++;};
eq(data.assets.length,288);eq(data.totalBytes,12350644);
const paths=new Set(),ids=new Set(),groups=new Map();
for(const item of data.assets){
 ok(!paths.has(item.path),'duplicate path');paths.add(item.path);
 ok(!ids.has(item.assetId),'duplicate id');ids.add(item.assetId);
 const content=fs.readFileSync(item.path);eq(content.length,item.bytes);
 const hash=crypto.createHash('sha1').update('blob '+content.length+'\0').update(content).digest('hex');
 eq(hash,item.gitBlobSha);
 eq(content.toString('ascii',0,4),'RIFF');eq(content.toString('ascii',8,12),'WEBP');
 const category=item.assetId.split('_')[1];groups.set(category,(groups.get(category)||0)+1);
}
eq(groups.size,24);for(const [k,c] of groups)eq(c,12);
const root={};const ctx={window:root,console,Map,Set};
vm.runInNewContext(fs.readFileSync('59_Visual_Public_Assets.html','utf8'),ctx);
eq(root.BE_HOC_ASSETS_288.count,288);eq(root.BE_HOC_ASSETS_288.labelApprovedCount,288);
for(const entry of data.assets){
 const r=root.BE_HOC_ASSETS_288.resolve(entry.assetId);
 eq(r.ok,true);
 ok(r.url.includes('/'+data.releaseCommit+'/'),"sha pin drift");
 ok(r.url.endsWith(entry.path.slice('hinh-anh/webp-g7/v1/'.length)),"wrong url");
 eq(r.quantityApproved,false);
}
eq(root.BE_HOC_ASSETS_288.resolve('KL_SH01_999').ok,false);
console.log('BE_HOC_RESTORED_288_WEBP_BINARY_INTEGRITY_PASS',n,'checks');
