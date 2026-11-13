'use strict';
/** G7.4-B.5.12 — explicit count-scene planner; TEST only, no rendering side effects. */
const {countDecision,composeCount}=require('../g7-4-gates/count-expansion-gates.cjs');
const APPROVAL='COUNT_SAFE_APPROVED';
function resolveCountScene(manifest,decisions,assetId,requestedCount){
  if(!manifest||manifest.mode!=='STAGING_ONLY'||manifest.enabled!==false||manifest.productionActivation!==false)
    return {ok:false,status:'BLOCKED',reasons:['NOT_TEST_STAGING']};
  const icon=(manifest.icons||[]).find(x=>x.id===assetId);
  const entry=(decisions.records||[]).find(x=>x.assetId===assetId);
  if(!icon||!entry)return {ok:false,status:'BLOCKED',reasons:['UNKNOWN_ASSET_OR_DECISION']};
  if(icon.sha256!==entry.sourceSha256||icon.countQaStatus!==APPROVAL||entry.decision!==APPROVAL||
      icon.objectsPerAsset!==1||entry.objectsPerAsset!==1)
    return {ok:false,status:'BLOCKED',reasons:['COUNT_APPROVAL_NOT_MATCHED']};
  if(icon.visualQaStatus!=='OWNER_VISUAL_APPROVED'||icon.semanticStatus!=='OWNER_SEMANTIC_APPROVED')
    return {ok:false,status:'BLOCKED',reasons:['VISUAL_SEMANTIC_APPROVAL_REQUIRED']};
  if(!entry.evidence?.delegation||!entry.evidence?.reviewPage||entry.evidence.reviewSizePx!==44||
     entry.approvedByDelegation!==true||entry.reviewer!=='ASSISTANT_DELEGATED_SEMANTIC_REVIEW')
    return {ok:false,status:'BLOCKED',reasons:['DELEGATED_APPROVAL_EVIDENCE_MISSING']};
  const asset={assetId:icon.id,sourceSha256:icon.sha256,visualApproval:'OWNER_VISUAL_APPROVED',countCategory:'SINGLE_OBJECT_CANDIDATE'};
  const review={assetId:icon.id,sourceSha256:icon.sha256,decision:entry.decision,ownerApproved:true,
    objectsPerAsset:1,countUnit:entry.unit,render44pxEvidence:entry.evidence.reviewPage,
    reviewer:entry.reviewer,reviewDate:entry.reviewDate};
  const gate=countDecision(asset,review);
  if(!gate.ok)return gate;
  const plan=composeCount(asset,review,requestedCount);
  if(!plan.ok)return plan;
  return {...plan,mode:'TEST_ONLY',sourceSha256:icon.sha256,
    unitPhrase:entry.canonicalPhrase,aliasesVi:entry.aliasesVi,
    restrictions:entry.restrictions,visualAssetRole:'COUNT_OBJECT',
    runtimeEnabled:false,productionActivation:false};
}
module.exports={resolveCountScene};
