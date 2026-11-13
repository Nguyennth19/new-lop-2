/**
 * G7.4-B.5.8 TEST-only semantic catalog + safe quantity composition planner.
 * All 288 labels are searchable. "LABEL_APPROVED" does NOT imply permission to count.
 * An explicit, narrow candidate allowlist is required for exact compositions.
 * Pure JS, no browser, HTTP, Spreadsheet or score writes. Existing B5.1 remains intact.
 */
var KL_B58_NguNghiaDinhLuongTestV1=(function(){
'use strict';
const RELEASE='653bfbc73002a188dcea0b714247b84cc28a4fed';
const ID=/^KL_(?:SH|M)(?:0[1-9]|1[0-2])_(?:00[1-9]|01[0-2])$/;
const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=(code,details)=>({ok:false,code,details:details||null,groups:[]});
function compile(registry,policy){
 if(!registry||registry.total!==288||registry.release_commit!==RELEASE||!Array.isArray(registry.assets)||registry.assets.length!==288)throw Error('REGISTRY_INVALID');
 if(!policy||policy.mode!=='STAGING_ONLY'||policy.enabled!==false||policy.releaseCommit!==RELEASE||!Array.isArray(policy.candidates))throw Error('POLICY_INVALID');
 const byId=Object.create(null),byLabel=Object.create(null),candidates=Object.create(null);
 for(const a of registry.assets){
  if(!ID.test(a.asset_id)||byId[a.asset_id]||a.label_status!=='LABEL_APPROVED'||!a.label_vi||!a.relative_path)throw Error('ASSET_NOT_APPROVED_OR_DUPLICATE');
  byId[a.asset_id]=clone(a);
  const key=normalize(a.label_vi);(byLabel[key]||(byLabel[key]=[])).push(a.asset_id);
 }
 for(const item of policy.candidates){
  if(!byId[item.assetId]||candidates[item.assetId]||item.mode!=='REPEAT_SINGLE_ASSET'||item.objectsPerAsset!==1||item.qaStatus!=='TEST_CANDIDATE'||
    !Array.isArray(item.aliases)||!item.aliases.length)throw Error('BAD_COUNT_CANDIDATE');
  candidates[item.assetId]={...item,aliases:item.aliases.map(normalize)};
 }
 return {releaseCommit:RELEASE,total:288,byId,byLabel,candidates};
}
function search(catalog,query){
 if(!catalog||catalog.total!==288)return [];
 const q=normalize(query);if(!q)return [];
 return Object.values(catalog.byId).filter(a=>normalize(a.label_vi).includes(q)||normalize(a.asset_id).includes(q)).map(a=>({assetId:a.asset_id,label:a.label_vi,countCandidate:!!catalog.candidates[a.asset_id]})).slice(0,30);
}
function plan(catalog,request){
 if(!catalog||catalog.total!==288)return fail('CATALOG_NOT_READY');
 if(!request||request.mode!=='STAGING_ONLY'||request.visualIntent!=='quantity'||request.quantityMode!=='exact')return fail('EXACT_REQUEST_REQUIRED');
 const assetId=request.assetId;
 if(!ID.test(String(assetId||''))||!catalog.byId[assetId])return fail('UNKNOWN_ASSET_ID');
 const permit=catalog.candidates[assetId];
 if(!permit)return fail('QUANTITY_ASSET_NOT_VERIFIED');
 if(!Array.isArray(request.groups)||request.groups.length<1||request.groups.length>4)return fail('GROUPS_INVALID');
 const groups=[];let total=0;
 for(const group of request.groups){
  if(!group||!Number.isInteger(group.count)||group.count<1||group.count>12||typeof group.label!=='string'||group.label.length>80)return fail('GROUP_COUNT_INVALID');
  total+=group.count;
  groups.push({label:group.label,count:group.count,assetId,items:Array.from({length:group.count},()=>({assetId,objects:1}))});
 }
 if(total>12)return fail('TOTAL_LIMIT_EXCEEDED');
 if(!Number.isInteger(request.expectedTotal)||request.expectedTotal!==total)return fail('COUNT_MISMATCH',{expected:request.expectedTotal,actual:total});
 const a=catalog.byId[assetId];
 return {ok:true,code:'TEST_COMPOSITION_CANDIDATE',source:'EXPLICIT_GROUP_COUNTS',total,assetId,label:a.label_vi,
  url:'https://raw.githubusercontent.com/Nguyennth19/new-lop-2/'+RELEASE+'/hinh-anh/webp-g7/v1/'+a.relative_path,
  groups,requiresManualVisualQA:true,discloseAnswer:false};
}
return Object.freeze({RELEASE,normalize,compile,search,plan});
})();
