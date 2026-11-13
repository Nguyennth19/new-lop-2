'use strict';
/** P0.6-B.1 — pure lesson registry; injection only. No network/GAS/Sheets/write. */
const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function createLessonRegistry(catalog,loaders){
 if(!catalog||typeof catalog!=='object'||Array.isArray(catalog))throw Error('REGISTRY_CATALOG_REQUIRED');
 if(!loaders||typeof loaders!=='object')throw Error('REGISTRY_LOADERS_REQUIRED');
 const entries=new Map();
 for(const [id,record] of Object.entries(catalog)){
  if(!/^[a-z0-9][a-z0-9_-]{2,95}$/.test(id)||!record||record.lessonId!==id||!['toan','tieng_viet','tieng_anh'].includes(record.subject)||!['legacy_b20','contract_v1'].includes(record.format)||!record.sourceRef||typeof record.sourceRef!=='string')throw Error('REGISTRY_INVALID_ENTRY:'+id);
  if(entries.has(id))throw Error('REGISTRY_DUPLICATE:'+id);
  entries.set(id,Object.freeze({...record}));
 }
 function resolve(lessonId){
  if(typeof lessonId!=='string'||!entries.has(lessonId))return {ok:false,code:'LESSON_NOT_REGISTERED',lessonId};
  return {ok:true,entry:entries.get(lessonId)};
 }
 function load(lessonId){
  const resolved=resolve(lessonId);if(!resolved.ok)return resolved;
  const e=resolved.entry;
  if(!has(loaders,e.format)||typeof loaders[e.format]!=='function')return {ok:false,code:'LOADER_NOT_CONFIGURED',lessonId};
  try{
   const raw=loaders[e.format](e.sourceRef,e);
   if(raw&&typeof raw.then==='function')return {ok:false,code:'ASYNC_LOADER_UNSUPPORTED',lessonId};
   if(!raw||typeof raw!=='object'||Array.isArray(raw))return {ok:false,code:'INVALID_LOADER_RESULT',lessonId};
   const returnedId=raw.lessonId||raw.lesson_id;
   if(returnedId!==lessonId)return {ok:false,code:'LESSON_ID_MISMATCH',lessonId};
   return {ok:true,lessonId,format:e.format,entry:e,data:raw};
  }catch(_){return {ok:false,code:'LOAD_FAILED',lessonId};}
 }
 return Object.freeze({resolve,load,list:()=>Array.from(entries.values()).map(e=>({...e}))});
}
module.exports={createLessonRegistry};
