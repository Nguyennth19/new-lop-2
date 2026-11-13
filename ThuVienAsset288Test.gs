/**
 * G7.4-B.5.7 — READ-ONLY common TEST Asset 288 library adapter.
 * No Apps Script API / DOM / spreadsheet writes / changes to existing loaders.
 * Input registry is versioned 288 JSON; no hardcoded image labels or Question IDs.
 * Returns an immutable result; image network/onerror belongs to consumer.
 */
var KLThuVien288TestV1=(function(){
'use strict';
const RELEASE='653bfbc73002a188dcea0b714247b84cc28a4fed';
const ROOT='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/'+RELEASE+'/hinh-anh/webp-g7/v1/';
const ID=/^KL_(SH|M)(0[1-9]|1[0-2])_(0[0-9]{2})$/;
const PATH=/^WEBP\/(SH|M)(0[1-9]|1[0-2])\/KL-(SH|M)(0[1-9]|1[0-2])-(0[0-9]|1[0-2])\.webp$/;
const fail=(code,extra)=>Object.freeze(Object.assign({ok:false,code},extra||{}));
function verify(registry){
 if(!registry||registry.release_commit!==RELEASE||registry.total!==288||
 !Array.isArray(registry.assets)||registry.assets.length!==288)return fail('INVALID_288_REGISTRY');
 const ids=new Set(),paths=new Set(),groups=new Map(),items=Object.create(null);
 for(const a of registry.assets){
  if(!a||typeof a.asset_id!=='string'||!ID.test(a.asset_id)||
    typeof a.relative_path!=='string'||!PATH.test(a.relative_path)||
    ids.has(a.asset_id)||paths.has(a.relative_path))return fail('INVALID_OR_DUPLICATE_ASSET');
  const m=a.asset_id.match(ID),p=a.relative_path.match(PATH);
  if(m[1]!==p[1]||m[2]!==p[2]||m[1]!==p[3]||m[2]!==p[4]||
    Number(m[3])!==Number(p[5]))return fail('ID_PATH_MISMATCH',{assetId:a.asset_id});
  if(!['LABEL_APPROVED','OWNER_SIGNOFF_PENDING'].includes(a.label_status)||
    typeof a.label_vi!=='string'||!a.label_vi.trim())return fail('INVALID_ASSET_LABEL');
  ids.add(a.asset_id);paths.add(a.relative_path);
  const group=m[1]+m[2];groups.set(group,(groups.get(group)||0)+1);
  items[a.asset_id]=Object.freeze({assetId:a.asset_id,label:a.label_vi,
   status:a.label_status,group,scope:a.scope,category:a.category,
   relativePath:a.relative_path,url:ROOT+a.relative_path,
   fallback:'🖼️',renderPolicy:a.render_policy});
 }
 if(groups.size!==24||[...groups.values()].some(n=>n!==12))return fail('UNEXPECTED_GROUP_DISTRIBUTION');
 return Object.freeze({ok:true,total:288,releaseCommit:RELEASE,
   approved:registry.assets.filter(x=>x.label_status==='LABEL_APPROVED').length,
   pending:registry.assets.filter(x=>x.label_status==='OWNER_SIGNOFF_PENDING').length,
   items:Object.freeze(items),groups:[...groups.keys()]});
}
function lookup(index,assetId){
 if(!index||index.ok!==true)return fail('LIBRARY_NOT_READY');
 if(!ID.test(String(assetId||'')))return fail('INVALID_ASSET_ID');
 return index.items[assetId]||fail('ASSET_NOT_FOUND',{assetId});
}
function resolve(index,assetId){
 const value=lookup(index,assetId);
 return value.ok===false?value:Object.freeze({ok:true,...value});
}
function fallback(code,assetId){
 return Object.freeze({ok:false,code:String(code||'IMAGE_UNAVAILABLE'),
   assetId:String(assetId||''),emoji:'🖼️',label:'Không tải được hình; giữ nội dung bài học'});
}
return Object.freeze({RELEASE,ROOT,verify,lookup,resolve,fallback});
})();
