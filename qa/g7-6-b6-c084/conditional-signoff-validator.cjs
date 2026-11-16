'use strict';
/* Fail-closed signature and delegation review. This module DOES NOT register anything.
 * Owner public keys are NOT embedded in code. No key => no authority.
 * Test-owned keys exercise proof paths only in dry-run, never confer project authority.
 */
const crypto=require('node:crypto');
const DEFAULT=require('./owner-signoff-gate.pending.v1.json');
const CHECKPOINT=require('../g7-6-b6-c082/source-item-review.v1.json');
function fail(code,extra={}){return {ok:false,code,ownerApproved:false,mayWriteTestRegistry:false,mayBuildTrustAdapter:false,mayDeploy:false,...extra};}
function canonical(o){
 if(Array.isArray(o))return '['+o.map(canonical).join(',')+']';
 if(o&&typeof o==='object')return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}';
 return JSON.stringify(o);
}
function unsignedPayload(record){
 return {packetId:record.packetId,chosenOption:record.chosenOption,approverId:record.approverId,role:record.role,
 scope:record.scope,documentHash:record.documentHash,sourceCommit:record.sourceCommit,approvalDate:record.approvalDate};
}
function review({records=DEFAULT.approvalRecords,trustAnchors=DEFAULT.approvedTrustAnchors,sourceItems=[],sourceSelections=[],policyDigest=null,contractProof=null,onlyDryRun=true}={}){
 if(!Array.isArray(records)||records.length!==6||new Set(records.map(x=>x.packetId)).size!==6)return fail('SIX_DISTINCT_OWNER_PACKETS_REQUIRED');
 if(!Array.isArray(trustAnchors)||trustAnchors.length===0)return fail('AUTHORIZED_SIGNER_TRUST_ANCHORS_MISSING');
 let indexed=new Map(records.map(x=>[x.packetId,x]));
 for(const required of DEFAULT.requiredPackets){
  const d=indexed.get(required.id);
  if(!d)return fail('PACKET_MISSING_'+required.id);
  if(d.role!==required.role||d.scope!==required.scope||d.sourceCommit!==DEFAULT.sourceHeadPinned)return fail('ROLE_SCOPE_OR_PIN_MISMATCH_'+required.id);
  if(!required.choices.includes(d.chosenOption))return fail('INVALID_DECISION_OPTION_'+required.id);
  if(!d.approverId||!d.approvalDate||!d.documentHash||!d.signature||!d.keyId||d.ownerAttested!==true)return fail('INCOMPLETE_OWNER_PROOF_'+required.id);
  if(!/^sha256:[a-f0-9]{64}$/.test(d.documentHash))return fail('INVALID_DOCUMENT_HASH_'+required.id);
  const anchor=trustAnchors.find(k=>k.keyId===d.keyId&&k.role===d.role&&k.approverId===d.approverId&&k.authorizedScopes?.includes(d.scope));
  if(!anchor?.publicKeyPem)return fail('UNAUTHORIZED_SIGNER_'+required.id);
  let verified=false;
  try{verified=crypto.verify(null,Buffer.from(canonical(unsignedPayload(d))),anchor.publicKeyPem,Buffer.from(d.signature,'base64'));}catch{}
  if(!verified)return fail('SIGNATURE_INVALID_'+required.id);
 }
 const src=indexed.get('C08-SOURCE-ITEMS');
 if(src.chosenOption!=='CONFIRM_QUARANTINE_13_WITH_INDIVIDUAL_DISPOSITIONS')return fail('SOURCE_ITEM_APPROVAL_REJECTED');
 if(!Array.isArray(sourceItems)||sourceItems.length!==13||new Set(sourceItems.map(x=>x.legacyId)).size!==13)return fail('REVIEW_13_ORIGINAL_SOURCE_ROWS_REQUIRED');
 const baseline=new Set(CHECKPOINT.legacyItems.map(x=>x.legacyId));
 if(sourceItems.some(x=>!baseline.has(x.legacyId)||x.disposition!=='REJECT_OLD_TEXT_RETAIN_ID_QUARANTINED'||x.runtimeAllowed!==false||x.approvedByPacket!=='C08-SOURCE-ITEMS'))return fail('LEGACY_SOURCE_QUARANTINE_INCOMPLETE');
 if(!policyDigest||!/^sha256:[a-f0-9]{64}$/.test(policyDigest))return fail('VERSIONED_E04_POLICY_DIGEST_REQUIRED');
 const d5=indexed.get('C08-D5').chosenOption,d9=indexed.get('C08-D9').chosenOption;
 if(d9==='REVIEW_CASE_BY_CASE_TWO_ROW_SUBSET_ONLY'){
  const selections=sourceSelections.filter(x=>x.family==='D9');
  if(!selections.length)return fail('D9_SOURCE_SELECTION_REQUIRED');
  const allowedSources=new Set(['SRC_C082_SGK_B065_T00_DISCOVERY','SRC_C082_SGK_B065_T01_A01','SRC_C082_SGK_B065_T02_A01','SRC_C082_SGK_B065_T02_A02','C081_VBT_B065_T01_E02','C081_VBT_B065_T02_E01']);
  for(const x of selections){
   if(!allowedSources.has(x.sourceId)||x.rows?.length!==2||x.symbolUnit!==1||!x.preservedObjectiveEvidenceHash||!/^sha256:[a-f0-9]{64}$/.test(x.preservedObjectiveEvidenceHash)||x.approvedByPacket!=='C08-D9')return fail('D9_UNVERIFIED_SUBSET');
   if(x.rows.some(r=>!Number.isInteger(r.count)||r.count<1||r.count>12)||x.rows[0].count===x.rows[1].count||!['MORE_THAN','LESS_THAN'].includes(x.relation))return fail('D9_COUNT_OR_RELATION_INVALID');
   const a=x.rows[0].count,b=x.rows[1].count;
   if(x.relation==='MORE_THAN'&&a<=b||x.relation==='LESS_THAN'&&a>=b)return fail('D9_DIRECTION_INVALID');
  }
 }
 if(d5==='DEVELOP_SEPARATE_FOUR_PIECE_SGK_CONTRACT_AFTER_QA')return fail('D5_FOUR_PIECE_NEW_RENDERER_QA_NOT_COMPLETE');
 if(!contractProof||contractProof.ownerPacketId!=='C09-PRODUCER'||contractProof.c08SourcePacketId!=='C08-SOURCE-ITEMS'||contractProof.c08D5PacketId!=='C08-D5'||contractProof.c08D9PacketId!=='C08-D9'||contractProof.publicEnvelopeSafe!==true||contractProof.sourcePolicyDigest!==policyDigest||contractProof.independentContractQAPassed!==true)return fail('C09_PRODUCER_SOURCE_DEPENDENCY_NOT_PROVEN');
 const eligible={D5:false,D9:d9==='REVIEW_CASE_BY_CASE_TWO_ROW_SUBSET_ONLY'&&indexed.get('P06-SKILL-ID-D9').chosenOption==='RESERVE_CANDIDATE_ONLY'};
 if(!eligible.D9)return fail('NO_FAMILY_ELIGIBLE_WITHIN_CURRENT_RENDERER');
 if(onlyDryRun!==true)return fail('REAL_TEST_REGISTRATION_REQUIRES_SEPARATE_OWNER_ACTION');
 return {ok:true,code:'SIMULATED_FULLY_SIGNED_DRY_RUN_ONLY',ownerApproved:false,simulatedReady:true,eligibleFamilies:eligible,
  mayWriteTestRegistry:false,mayBuildTrustAdapter:false,mayDeploy:false};
}
module.exports={review,unsignedPayload,canonical};
