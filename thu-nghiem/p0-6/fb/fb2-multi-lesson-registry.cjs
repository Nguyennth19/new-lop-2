'use strict';
/** F-B.2 multi-lesson version registry. Pure TEST-only orchestration.
 * No trusting JSON self-declared approval: independent trusted adapters are injected.
 * Never stores student data, writes grades/stars, or deploys anything.
 */
const ID=/^[a-z][a-z0-9_]{2,63}$/;
const VERSION=/^p0\.6-fb-test-[a-z0-9-]+-v[1-9][0-9]*$/;
const REF=/^[A-Za-z0-9_.:-]{3,128}$/;
const isObj=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const denied=(code,extra={})=>Object.freeze({ok:false,status:'BLOCKED',code,...extra,releaseReady:false});
const clone=x=>structuredClone(x);
function createMultiLessonRegistry(catalog,trustAnchors={}){
 if(!isObj(catalog)||catalog.schemaVersion!=='p0.6.fb2.catalog.v1'||catalog.environment!=='ISOLATED_TEST'||
  catalog.defaultFeatureFlag!==false||catalog.releaseReady!==false||!Array.isArray(catalog.lessons)||
  !catalog.lessons.length||catalog.lessons.length>100||!isObj(trustAnchors))throw Error('FB2_CATALOG_INVALID');
 const registry=new Map();
 for(const raw of catalog.lessons){
  if(!isObj(raw)||!ID.test(raw.lessonId)||!VERSION.test(raw.lessonVersion)||
   !['toan','tieng_viet','tieng_anh'].includes(raw.subject)||registry.has(raw.lessonId)||
   !['INHERITED_ACCEPTED_TEST_ONLY','INDEPENDENT_ACCEPTED_TEST_ONLY','PENDING_INDEPENDENT_QA'].includes(raw.state)||
   raw.allowStudentUse!==false||raw.deploy!==false||raw.releaseReady!==false||
   !['INDEX_VERIFIED','NOT_VERIFIED'].includes(raw.sourceScopeStatus))throw Error('FB2_ENTRY_INVALID');
  for(const field of ['sourceRef','rendererRef','policyReviewRef','qaEvidenceRef','trustedAdapterId'])
   if(raw[field]!==null&&(typeof raw[field]!=='string'||!REF.test(raw[field])))throw Error('FB2_PROVENANCE_INVALID');
  const present=['sourceRef','rendererRef','policyReviewRef','qaEvidenceRef','trustedAdapterId'].every(k=>raw[k]!==null);
  if(['INHERITED_ACCEPTED_TEST_ONLY','INDEPENDENT_ACCEPTED_TEST_ONLY'].includes(raw.state)&&!present)throw Error('FB2_APPROVED_EVIDENCE_INCOMPLETE');
  if(raw.state==='PENDING_INDEPENDENT_QA'&&present)throw Error('FB2_PENDING_CANNOT_SELF_APPROVE');
  registry.set(raw.lessonId,Object.freeze(clone(raw)));
 }
 function select(request={}){
  if(!isObj(request))return denied('FB2_REQUEST_INVALID');
  if(request.featureFlag!==true)return denied('FB2_FLAG_OFF');
  if(request.environment!=='ISOLATED_TEST')return denied('FB2_ENVIRONMENT_DENIED');
  if(typeof request.lessonId!=='string'||!registry.has(request.lessonId))return denied('FB2_LESSON_UNKNOWN');
  const entry=registry.get(request.lessonId);
  if(request.lessonVersion!==entry.lessonVersion)return denied('FB2_VERSION_MISMATCH',{lessonId:entry.lessonId});
  if(request.allowStudentUse!==false||request.deploy===true||request.persist===true||
    request.awardStars===true||request.releaseReady===true)return denied('FB2_CAPABILITY_DENIED');
  if(!['INHERITED_ACCEPTED_TEST_ONLY','INDEPENDENT_ACCEPTED_TEST_ONLY'].includes(entry.state))return denied('FB2_INDEPENDENT_QA_REQUIRED',{lessonId:entry.lessonId});
  const anchor=trustAnchors[entry.trustedAdapterId];
  if(!isObj(anchor)||anchor.lessonId!==entry.lessonId||anchor.lessonVersion!==entry.lessonVersion||
    anchor.sourceRef!==entry.sourceRef||anchor.rendererRef!==entry.rendererRef||
    anchor.policyReviewRef!==entry.policyReviewRef||anchor.qaEvidenceRef!==entry.qaEvidenceRef||
    typeof anchor.verify!=='function')return denied('FB2_TRUST_ANCHOR_MISSING_OR_MISMATCH');
  try{
   const proof=anchor.verify({lessonId:entry.lessonId,lessonVersion:entry.lessonVersion,
    featureFlag:true,environment:'ISOLATED_TEST',allowStudentUse:false,
    deploy:false,persist:false,awardStars:false,releaseReady:false});
   if(!isObj(proof)||proof.ok!==true||proof.status!=='ISOLATED_TEST_PREVIEW_ONLY'||
    proof.lessonId!==entry.lessonId||proof.lessonVersion!==entry.lessonVersion||
    proof.noWrites!==true||proof.noStars!==true||proof.releaseReady!==false||
    proof.deploymentAuthorized!==false||!Number.isSafeInteger(proof.questions)||proof.questions<1||
    typeof proof.contentSha256!=='string'||!/^[a-f0-9]{64}$/.test(proof.contentSha256)||
    typeof proof.policySha256!=='string'||!/^[a-f0-9]{64}$/.test(proof.policySha256)||
    typeof proof.receiptSha256!=='string'||!/^[a-f0-9]{64}$/.test(proof.receiptSha256))
    return denied('FB2_INDEPENDENT_PROOF_FAILED');
   return Object.freeze({ok:true,status:'ISOLATED_TEST_PREVIEW_ONLY',
    lessonId:entry.lessonId,lessonVersion:entry.lessonVersion,questions:proof.questions,
    contentSha256:proof.contentSha256,policySha256:proof.policySha256,
    receiptSha256:proof.receiptSha256,qaEvidenceRef:entry.qaEvidenceRef,
    noWrites:true,noStars:true,deploymentAuthorized:false,releaseReady:false});
  }catch(_){return denied('FB2_PROOF_EXCEPTION')}
 }
 function rollback(lessonId,reason='OPERATOR_REQUEST'){
  if(typeof lessonId!=='string'||!registry.has(lessonId))return denied('FB2_ROLLBACK_LESSON_UNKNOWN');
  const e=registry.get(lessonId);
  return Object.freeze({ok:true,status:'ROLLED_BACK_TO_BLOCKED_DEFAULT',
   lessonId,lessonVersion:e.lessonVersion,reason:String(reason).slice(0,96),
   featureFlag:false,noWrites:true,noStars:true,deploymentAuthorized:false,releaseReady:false});
 }
 return Object.freeze({select,rollback,
  list:()=>[...registry.values()].map(e=>({lessonId:e.lessonId,subject:e.subject,
   lessonVersion:e.lessonVersion,state:e.state,hasIndependentEvidence:['INHERITED_ACCEPTED_TEST_ONLY','INDEPENDENT_ACCEPTED_TEST_ONLY'].includes(e.state)}))});
}
module.exports={createMultiLessonRegistry};
