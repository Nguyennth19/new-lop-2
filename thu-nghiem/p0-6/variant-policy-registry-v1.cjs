'use strict';
/** P0.6-E.0.2 — allowlisted, immutable, injected Math policy registry.
 * Pure/offline. No automatic approval, network, persistence or dynamic path loading.
 */
const crypto=require('node:crypto');
const okObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function deepFreeze(x){
 if(x&&typeof x==='object'&&!Object.isFrozen(x)){
  Object.values(x).forEach(deepFreeze);Object.freeze(x);
 }
 return x;
}
function createVariantPolicyRegistry(catalog,loader){
 if(!okObj(catalog)||typeof loader!=='function')throw Error('POLICY_REGISTRY_INVALID');
 const entries=new Map();
 for(const [lessonId,entry] of Object.entries(catalog)){
  if(!/^toan_b[0-9]{2,3}$/.test(lessonId)||!okObj(entry)||
     entry.lessonId!==lessonId||!['toan'].includes(entry.subject)||
     !/^[a-f0-9]{64}$/.test(entry.expectedSha256||'')||
     typeof entry.policyRef!=='string'||!entry.policyRef)
   throw Error('POLICY_CATALOG_ENTRY_INVALID:'+lessonId);
  entries.set(lessonId,deepFreeze(structuredClone(entry)));
 }
 function resolve(lessonId){
  if(typeof lessonId!=='string'||!entries.has(lessonId))return {ok:false,code:'POLICY_NOT_REGISTERED',lessonId};
  const meta=entries.get(lessonId);
  let policy;
  try{policy=loader(meta.policyRef,lessonId);}
  catch(_){return {ok:false,code:'POLICY_LOAD_FAILED',lessonId};}
  if(!okObj(policy)||typeof policy.then==='function'||policy.lessonId!==lessonId)
   return {ok:false,code:'POLICY_LESSON_MISMATCH',lessonId};
  if(hash(policy)!==meta.expectedSha256)return {ok:false,code:'POLICY_DIGEST_MISMATCH',lessonId};
  if(!Array.isArray(policy.allowedSkills)||!Array.isArray(policy.allowedMathKinds)||!okObj(policy.mathConstraints))
   return {ok:false,code:'POLICY_CONTRACT_INVALID',lessonId};
  const snapshot=deepFreeze(structuredClone(policy));
  return {ok:true,lessonId,policy:snapshot,policySha256:meta.expectedSha256,
    canActivate:snapshot.status==='APPROVED_FOR_TEST_POLICY'&&typeof snapshot.ownerApprovalRef==='string'&&!!snapshot.ownerApprovalRef};
 }
 return Object.freeze({resolve,list:()=>[...entries.keys()]});
}
module.exports={createVariantPolicyRegistry,hash};
