'use strict';
/** F-B candidate lesson-version governance. Pure TEST gate, fails closed.
 * Compose from inherited E03; never enables Web App/students by itself.
 */
const {createDemo}=require('../composer-fixtures-v1.cjs');
const {hash}=require('../variant-policy-registry-v1.cjs');
const clone=structuredClone;
const deny=(code,more={})=>({ok:false,status:'BLOCKED',code,...more});
const SAFE_VERSION=/^p0\.6-fb-test-b21-v[1-9][0-9]*$/;
const SAFE_REF=/^[a-zA-Z0-9_.:-]{6,128}$/;
function buildCandidate(version='p0.6-fb-test-b21-v1'){
 const composed=createDemo();
 if(!composed.ok)throw Error('FB_INHERITED_COMPOSER_BLOCKED');
 const record={
  schemaVersion:'p0.6.fb.lesson-release-candidate.v1',
  lessonId:'toan_b21',lessonVersion:version,environment:'ISOLATED_TEST',
  contentSha256:composed.report.lessonSha256,
  policySha256:composed.report.policySha256,
  receiptSha256:composed.report.receiptSha256,
  sourceScopeStatus:'INDEX_VERIFIED',scope:'F_A_ACCEPTED_ISOLATED_TEST',
  g5:'PASS_FOR_ISOLATED_TEST_PREVIEW',g7:'OWNER_APPROVED_TEST_SCOPE',g8:'OWNER_APPROVED_TEST_SCOPE',
  qaRunId:43454026078,qaSourceCommit:'612bcf54c5c67247c97be1c2c6a931c367ddeb5b',
  previewOnly:true,allowStudentUse:false,noWrites:true,noStars:true,
  deploymentAuthorized:false,releaseReady:false,
  rollbackTarget:'BLOCKED_DEFAULT'
 };
 if(!SAFE_VERSION.test(version))throw Error('FB_VERSION_INVALID');
 return Object.freeze(record);
}
function createGovernance(dependencies={}){
 const {candidate,compose=createDemo}=dependencies;
 if(!candidate||typeof candidate!=='object'||Array.isArray(candidate))throw Error('FB_CANDIDATE_REQUIRED');
 if(typeof compose!=='function')throw Error('FB_COMPOSER_REQUIRED');
 const frozen=clone(candidate);
 if(frozen.schemaVersion!=='p0.6.fb.lesson-release-candidate.v1'||frozen.lessonId!=='toan_b21'||
  !SAFE_VERSION.test(frozen.lessonVersion)||frozen.environment!=='ISOLATED_TEST'||
  !SAFE_REF.test(frozen.scope)||frozen.scope!=='F_A_ACCEPTED_ISOLATED_TEST'||
  frozen.sourceScopeStatus!=='INDEX_VERIFIED'||frozen.g5!=='PASS_FOR_ISOLATED_TEST_PREVIEW'||
  frozen.g7!=='OWNER_APPROVED_TEST_SCOPE'||frozen.g8!=='OWNER_APPROVED_TEST_SCOPE'||
  frozen.previewOnly!==true||frozen.allowStudentUse!==false||frozen.noWrites!==true||
  frozen.noStars!==true||frozen.deploymentAuthorized!==false||frozen.releaseReady!==false||
  frozen.rollbackTarget!=='BLOCKED_DEFAULT'||frozen.qaRunId!==43454026078||
  frozen.qaSourceCommit!=='612bcf54c5c67247c97be1c2c6a931c367ddeb5b')
  throw Error('FB_CANDIDATE_NOT_SAFE');
 function check(request={}){
  if(!request||typeof request!=='object'||Array.isArray(request))return deny('FB_REQUEST_INVALID');
  if(request.featureFlag!==true)return deny('FB_FEATURE_FLAG_OFF');
  if(request.environment!=='ISOLATED_TEST')return deny('FB_ENVIRONMENT_DENIED');
  if(request.lessonId!==frozen.lessonId)return deny('FB_LESSON_NOT_ALLOWED');
  if(request.lessonVersion!==frozen.lessonVersion)return deny('FB_VERSION_MISMATCH');
  if(request.allowStudentUse!==false||request.deploy===true||request.persist===true||
   request.awardStars===true||request.releaseReady===true)return deny('FB_FORBIDDEN_CAPABILITY');
  const generated=compose();
  if(!generated||generated.ok!==true||generated.lesson?.lessonId!==frozen.lessonId||
    generated.report?.lessonSha256!==frozen.contentSha256||
    generated.report?.policySha256!==frozen.policySha256||
    generated.report?.receiptSha256!==frozen.receiptSha256||
    generated.coverage?.total!==8||
    !generated.noWrites||!generated.noStars)return deny('FB_SOURCE_DRIFT');
  return Object.freeze({ok:true,status:'ISOLATED_TEST_PREVIEW_ONLY',
   lessonId:frozen.lessonId,lessonVersion:frozen.lessonVersion,
   contentSha256:frozen.contentSha256,policySha256:frozen.policySha256,
   receiptSha256:frozen.receiptSha256,candidateSha256:hash(frozen),
   qaEvidenceRef:'FA_G5_BROWSER_QA_20261113.md',
   questions:generated.coverage.total,byLevel:clone(generated.coverage.byLevel),
   noWrites:true,noStars:true,deploymentAuthorized:false,releaseReady:false});
 }
 function rollback(reason='OPERATOR_REQUEST'){
  return Object.freeze({ok:true,status:'ROLLED_BACK_TO_BLOCKED_DEFAULT',
   lessonId:frozen.lessonId,lessonVersion:frozen.lessonVersion,
   reason:String(reason).slice(0,96),featureFlag:false,
   noWrites:true,noStars:true,deploymentAuthorized:false,releaseReady:false});
 }
 return Object.freeze({check,rollback,candidate:()=>clone(frozen)});
}
module.exports={buildCandidate,createGovernance};
