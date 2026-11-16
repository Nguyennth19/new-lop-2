'use strict';
const crypto=require('node:crypto');
const record=require('./received-owner-evidence.pending.v1.json');
const control=require('../g7-6-b6-c084/owner-signoff-gate.pending.v1.json');
const {canonical,unsignedPayload}=require('../g7-6-b6-c084/conditional-signoff-validator.cjs');
const expected=new Map(control.requiredPackets.map(x=>[x.id,x]));
const isSha=x=>/^sha256:[0-9a-f]{64}$/.test(x||'');
const deny=(code,records=[])=>({ok:false,code,records,hasOwnerSignoff:false,
 gates:{C08:'PENDING',C09:'PENDING_C08',p06Test:'DENIED',testAdapter:'DENIED',release:'DENIED'},
 canCreateTestRegistry:false,canCreateAdapter:false,canDeploy:false});
function verifyOne(receipt,{registry,readEvidence,at,syntheticTest=false}={}){
 const key=receipt?.packetId;
 const required=expected.get(key);
 const p={packetId:key||null,status:'RECEIVED_UNVERIFIED',reason:'UNVERIFIED',cryptographicallyValid:false,authorized:false};
 if(!required)return {...p,reason:'UNKNOWN_PACKET'};
 if(!receipt?.signature||!receipt?.keyId||!receipt?.approverId||!receipt?.evidenceUri||!isSha(receipt.documentHash))return {...p,reason:'MISSING_SIGNED_EVIDENCE'};
 if(receipt.role!==required.role||receipt.scope!==required.scope||receipt.sourceCommit!==control.sourceHeadPinned||!required.choices.includes(receipt.chosenOption))return {...p,reason:'ROLE_SCOPE_OR_CHOICE_INVALID'};
 if(!registry?.verifiedByIndependentAdministrator||!isSha(registry.registrySha256)||!Array.isArray(registry.activeKeys)||!Array.isArray(registry.revocations))return {...p,reason:'INDEPENDENT_AUTHORITY_REGISTRY_MISSING'};
 const a=registry.activeKeys.find(x=>x.keyId===receipt.keyId&&x.approverId===receipt.approverId&&x.role===required.role&&x.authorizedScopes?.includes(required.scope));
 if(!a||!a.publicKeyPem)return {...p,reason:'UNAUTHORIZED_OWNER_KEY'};
 if(typeof at!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(at)||Number.isNaN(Date.parse(at))||Number.isNaN(Date.parse(receipt.approvalDate)))return {...p,reason:'CLOCK_EVIDENCE_MISSING'};
 const now=Date.parse(at),issued=Date.parse(receipt.approvalDate);
 if(issued>now||now>Date.parse(a.expiresAt)||issued<Date.parse(a.activeFrom))return {...p,reason:'KEY_NOT_VALID_AT_DECISION_OR_CHECK'};
 if(registry.revocations.some(x=>x.keyId===a.keyId&&Date.parse(x.effectiveAt)<=now))return {...p,status:'REVOKED_OR_EXPIRED',reason:'KEY_REVOKED'};
 if(typeof readEvidence!=='function')return {...p,reason:'READ_ONLY_EVIDENCE_REQUIRED'};
 let bytes;try{bytes=readEvidence(receipt.evidenceUri);}catch{return {...p,reason:'SIGNED_DOCUMENT_UNREADABLE'};}
 if(!Buffer.isBuffer(bytes)&&typeof bytes!=='string')return {...p,reason:'INVALID_DOCUMENT_BYTES'};
 const observed='sha256:'+crypto.createHash('sha256').update(bytes).digest('hex');
 if(observed!==receipt.documentHash)return {...p,reason:'SIGNED_DOCUMENT_DIGEST_MISMATCH'};
 const signed=unsignedPayload(receipt);
 if(typeof receipt.signature!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(receipt.signature))return {...p,reason:'SIGNATURE_ENCODING'};
 let verified=false;try{verified=crypto.verify(null,Buffer.from(canonical(signed),'utf8'),a.publicKeyPem,Buffer.from(receipt.signature,'base64'));}catch{}
 if(!verified)return {...p,reason:'SIGNATURE_INVALID'};
 const reject=receipt.chosenOption.includes('REJECT')||receipt.chosenOption==='KEEP_FULL_THREE_PLUS_CATEGORY_SOURCES_OUTSIDE_CURRENT_D9'||receipt.chosenOption==='REQUEST_D9_SCALED_OR_MULTIROW_V2'||receipt.chosenOption==='DEVELOP_SEPARATE_FOUR_PIECE_SGK_CONTRACT_AFTER_QA';
 return {...p,status:reject?'VERIFIED_REJECT':'VERIFIED_ACCEPT',reason:reject?'SIGNED_NON_ACTIVATING_DECISION':'SIGNED_SCOPE_DECISION_VERIFIED',cryptographicallyValid:true,authorized:true,
  evidenceHash:observed,sourceCommit:receipt.sourceCommit,simulated:syntheticTest===true};
}
function resolve(receipts=record.signedDecisionReceipts,{registry=record.trustRegistry,readEvidence=null,at=null,syntheticTest=false}={}){
 if(!Array.isArray(receipts))return deny('RECEIPTS_MUST_BE_ARRAY');
 if(new Set(receipts.map(x=>x.packetId)).size!==receipts.length)return deny('DUPLICATE_RECEIPT_REJECTED');
 if(receipts.some(x=>!expected.has(x.packetId)))return deny('UNKNOWN_PACKET_REJECTED');
 const m=new Map(receipts.map(x=>[x.packetId,x]));
 const records=control.requiredPackets.map(x=>m.has(x.id)?verifyOne(m.get(x.id),{registry,readEvidence,at,syntheticTest}):{packetId:x.id,status:'PENDING',reason:'NO_OWNER_DECISION_SUBMITTED',cryptographicallyValid:false,authorized:false});
 const allVerified=records.every(x=>x.status==='VERIFIED_ACCEPT'||x.status==='VERIFIED_REJECT');
 const anyRejected=records.some(x=>x.status==='VERIFIED_REJECT');
 const c08Records=records.filter(x=>['C08-D5','C08-D9','C08-SOURCE-ITEMS'].includes(x.packetId));
 const c08Strong=c08Records.every(x=>x.status==='VERIFIED_ACCEPT');
 const c09=records.find(x=>x.packetId==='C09-PRODUCER');
 const c09Ordered=!!m.get('C09-PRODUCER')&&c08Strong&&c09?.status==='VERIFIED_ACCEPT'&&
  c08Records.every(x=>Date.parse(m.get(x.packetId).approvalDate)<Date.parse(m.get('C09-PRODUCER').approvalDate));
 const sourceScopeValid=false; // individual item receipts and source activity signoff not connected, NO automatic clearance
 const safe=!!registry?.verifiedByIndependentAdministrator&&!syntheticTest;
 return {ok:allVerified,code:receipts.length?'DECISIONS_ASSESSED_NO_ACTIVATION':'NO_SIGNED_DECISIONS',
  records,signaturesVerified:records.filter(x=>x.cryptographicallyValid).length,
  decisionReviewComplete:allVerified,anyRejected,sourceScopeValid,
  gates:{C08:c08Strong&&safe&&sourceScopeValid?'ELIGIBLE_FOR_SEPARATE_GATE_REVIEW':'PENDING',
   C09:c09Ordered&&safe&&sourceScopeValid?'ELIGIBLE_FOR_SEPARATE_GATE_REVIEW':'PENDING_C08',
   p06Test:'DENIED',testAdapter:'DENIED',release:'DENIED'},
  realAuthorityProven:safe&&allVerified,canCreateTestRegistry:false,canCreateAdapter:false,canDeploy:false,
  note:syntheticTest?'SYNTHETIC_CRYPTO_TEST_NO_OWNER_AUTHORITY':'NO_REGISTRY_MUTATION_FROM_THIS_RESOLVER'};
}
module.exports={verifyOne,resolve};
