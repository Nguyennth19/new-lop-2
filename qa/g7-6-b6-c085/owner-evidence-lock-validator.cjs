'use strict';
const crypto=require('node:crypto');
const lock=require('./approval-evidence-lock.v1.json');
const base=require('./owner-decision-intake.pending.v1.json');
const prior=require('../g7-6-b6-c084/conditional-signoff-validator.cjs');
const original=require('../g7-6-b6-c084/owner-signoff-gate.pending.v1.json');
function deny(code,extras={}){return {ok:false,code,C08:'BLOCKED',C09:'BLOCKED',p06Test:'NOT_AUTHORIZED',testRegistrationAllowed:false,mayDeploy:false,...extras};}
function checkLock({readFile,blobSha}={}){
 if(typeof readFile!=='function'||typeof blobSha!=='function')return deny('READ_ONLY_FILE_VERIFICATION_CALLBACKS_REQUIRED');
 for(const row of lock.evidenceFiles){
  let bytes,sha;
  try{bytes=readFile(row.path);sha=blobSha(bytes);}catch{return deny('EVIDENCE_FILE_UNREADABLE_'+row.path);}
  if(sha!==row.gitBlobSha)return deny('LOCKED_GIT_BLOB_CHANGED_'+row.path);
  if(row.status==null||row.ownerApprovalRef!==null)return deny('LOCK_NOT_UNSIGNED_'+row.path);
 }
 return {ok:true,code:'SOURCE_BYTES_LOCK_MATCHED_ONLY',ownerApproved:false,C08:'BLOCKED',C09:'BLOCKED',p06Test:'NOT_AUTHORIZED',testRegistrationAllowed:false};
}
function gitBlobSha(bytes){return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');}
function assess(submissions=base.records,anchors=[]){
 if(!Array.isArray(submissions)||submissions.length!==6||new Set(submissions.map(x=>x.packetId)).size!==6)return deny('SIX_UNIQUE_PACKETS_REQUIRED');
 const expected=new Map(original.requiredPackets.map(x=>[x.id,x]));
 const ids=base.records.map(x=>x.packetId);
 for(const r of submissions){
  const p=expected.get(r.packetId);
  if(!p||!ids.includes(r.packetId))return deny('UNEXPECTED_OWNER_PACKET');
  if(r.requiredRole!==p.role||r.expectedScope!==p.scope)return deny('ROLE_SCOPE_EXPECTATION_MISMATCH_'+r.packetId);
  if(r.currentStatus==='VERIFIED'&&!r.validCryptoProof)return deny('UNVERIFIED_MARKED_VERIFIED_'+r.packetId);
  if(r.ownerDecisionRecorded||r.approvedScope?.length)return deny('OWNER_DECISION_NOT_CONFIRMED_BY_AUTHORITY_'+r.packetId);
  if(r.evidenceSourceCommit&&r.evidenceSourceCommit!==lock.sourceCommit)return deny('EVIDENCE_BASE_COMMIT_MISMATCH_'+r.packetId);
  if(r.evidenceDocumentSha256&&!/^sha256:[a-f0-9]{64}$/.test(r.evidenceDocumentSha256))return deny('BAD_EVIDENCE_HASH_'+r.packetId);
  if(r.currentStatus==='RECEIVED_UNVERIFIED'&&!r.evidenceUri)return deny('EVIDENCE_LINK_REQUIRED_'+r.packetId);
 }
 if(!Array.isArray(anchors)||anchors.length===0)return deny('AUTHORIZED_TRUST_ANCHORS_ABSENT');
 if(submissions.some(x=>!x.validCryptoProof||!x.independentlyAuthorized||!x.submittedSignature||!x.selectedOption))return deny('SIGNATURE_OR_AUTHORITY_UNVERIFIED');
 // Never convert arbitrary intake fields directly to real authorized packet records.
 return deny('OWNER_DECISION_BUNDLE_REQUIRES_SEPARATE_C084_VALIDATOR_AND_C08_C09_SIGNOFF');
}
function prospective({packets,trustAnchors,sourceItems,sourceSelections,policyDigest,contractProof}={}){
 // Cross-check the C08.4 validator in a deliberately non-authorizing dry-run.
 const r=prior.review({records:packets,trustAnchors,sourceItems,sourceSelections,policyDigest,contractProof,onlyDryRun:true});
 if(!r.ok)return deny('PREVIOUS_GATE_DENIED_'+r.code);
 return deny('DRY_RUN_SIMULATION_IS_NOT_ACTUAL_OWNER_APPROVAL',{simulationValid:true});
}
module.exports={checkLock,assess,prospective,gitBlobSha};
