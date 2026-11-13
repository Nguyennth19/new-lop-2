'use strict';
/** G7.4-B.5.10 + B.6 TEST-only pure gates. No I/O, mutation or runtime activation. */
const VALID_SUBJECTS = new Set(['TOAN','TIENG_VIET','TIENG_ANH','DUNG_CHUNG']);
const VALID_CATEGORY = new Set(['SINGLE_OBJECT_CANDIDATE','CONTEXT_REVIEW','COMPOSITE_BLOCKED']);
const SHA256 = /^[0-9a-f]{64}$/;
const COMMIT = /^[0-9a-f]{40}$/;
const isText = x => typeof x === 'string' && x.trim().length > 0;
function countDecision(asset, review) {
  if (!asset || !isText(asset.assetId) || !SHA256.test(asset.sourceSha256||''))
    return {ok:false,status:'BLOCKED',reasons:['INVALID_ASSET']};
  const reasons=[];
  if (!review || review.assetId !== asset.assetId) reasons.push('ID_MISMATCH');
  if (asset.visualApproval !== 'OWNER_VISUAL_APPROVED') reasons.push('VISUAL_NOT_APPROVED');
  if (!VALID_CATEGORY.has(asset.countCategory) || asset.countCategory === 'COMPOSITE_BLOCKED') reasons.push('COMPOSITE_OR_INVALID_CATEGORY');
  if (!review || review.sourceSha256 !== asset.sourceSha256) reasons.push('SOURCE_SHA_MISMATCH');
  if (!review || review.decision !== 'COUNT_SAFE_APPROVED' || review.ownerApproved !== true) reasons.push('NO_EXPLICIT_COUNT_SIGNOFF');
  if (!review || review.objectsPerAsset !== 1 || !isText(review.countUnit)) reasons.push('INVALID_UNIT_COUNT');
  if (!review || !isText(review.render44pxEvidence) || !isText(review.reviewer) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewDate||'')) reasons.push('MISSING_COUNT_EVIDENCE');
  return {ok:reasons.length===0,status:reasons.length?'BLOCKED':'COUNT_SAFE_APPROVED',reasons};
}
function composeCount(asset, review, requestedCount) {
  const gate=countDecision(asset,review);
  if (!gate.ok) return {ok:false,status:'BLOCKED',reasons:gate.reasons};
  if (!Number.isSafeInteger(requestedCount) || requestedCount<1 || requestedCount>50)
    return {ok:false,status:'BLOCKED',reasons:['INVALID_REQUESTED_COUNT']};
  return {ok:true,status:'READY_TO_RENDER',assetId:asset.assetId,repeat:requestedCount,totalObjects:requestedCount,unit:review.countUnit};
}
function expansionDecision(request, registryIds=[]) {
  const reasons=[];
  if (!request || !isText(request.conceptKey)) reasons.push('MISSING_CONCEPT');
  if (!request || !VALID_SUBJECTS.has(request.subject)) reasons.push('INVALID_SUBJECT');
  if (!request || !isText(request.lessonId)) reasons.push('MISSING_LESSON_ID');
  if (!request || !['DECORATIVE','COUNT_OBJECT','VOCABULARY','SCENE'].includes(request.usage)) reasons.push('INVALID_USAGE');
  if (!request || !isText(request.proposedAssetId)) reasons.push('MISSING_ID');
  if (request && registryIds.includes(request.proposedAssetId)) reasons.push('DUPLICATE_ID_USE_EXISTING');
  if (!request || request.sourceRepository !== 'microsoft/fluentui-emoji' ||
     !COMMIT.test(request.sourceCommit||'')) reasons.push('UNPINNED_OR_INVALID_SOURCE');
  if (!request || request.license !== 'MIT' || !isText(request.licenseEvidence)) reasons.push('LICENSE_EVIDENCE_REQUIRED');
  if (!request || !SHA256.test(request.sha256||'')) reasons.push('SHA256_REQUIRED');
  if (!request || request.securityQa !== 'PASS') reasons.push('SECURITY_QA_REQUIRED');
  if (!request || request.visualQa !== 'OWNER_APPROVED') reasons.push('VISUAL_QA_REQUIRED');
  if (!request || request.semanticQa !== 'OWNER_APPROVED') reasons.push('SEMANTIC_QA_REQUIRED');
  if (request && request.usage === 'COUNT_OBJECT' && request.countQa !== 'COUNT_SAFE_APPROVED') reasons.push('COUNT_QA_REQUIRED');
  return {ok:reasons.length===0,status:reasons.length?'STAGING_BLOCKED':'ELIGIBLE_FOR_REGISTRY_REVIEW',reasons, runtimeEnabled:false,productionActivation:false};
}
module.exports={countDecision,composeCount,expansionDecision};
