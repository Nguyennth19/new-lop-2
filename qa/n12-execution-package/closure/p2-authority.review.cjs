'use strict';
// Review-only protocol. No GAS bindings, no actual grants, no provider or network calls.
// Accepts only explicitly synthetic scopes. A real authority verifier and provisioner
// require separate approval; mock verification is NOT a signature.
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join('|')===keys.slice().sort().join('|');
const hex=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const mockId=x=>typeof x==='string'&&/^MOCK_[A-Z0-9_]{8,70}$/.test(x);
const fail=reason=>({ok:false,reason,mutations:[],grantIssued:false,release:false});
function planIssue(b,state,now,hash,verifyMockApproval){
 const keys=['contract','environment','proofCase','project','target','backup','owner','grantId','epoch','scopeSha256','intentSha256','candidateSha256','sourceSha256','initialExecutionId','secondExecutionId','issuedAt','expiresAt'];
 if(!exact(b,keys)||b.contract!=='N12_P2_BINDING_REVIEW_V1'||b.environment!=='MOCK_ONLY'||b.proofCase!=='P2'||
 ![b.project,b.target,b.backup,b.grantId,b.epoch,b.initialExecutionId,b.secondExecutionId].every(mockId)||
 new Set([b.project,b.target,b.backup,b.grantId,b.epoch,b.initialExecutionId,b.secondExecutionId]).size!==7||
 b.owner!=='owner@example.invalid'||![b.scopeSha256,b.intentSha256,b.candidateSha256,b.sourceSha256].every(hex))return fail('BINDING');
 const issued=Date.parse(b.issuedAt),expires=Date.parse(b.expiresAt);
 if(!Number.isFinite(now)||!Number.isFinite(issued)||!Number.isFinite(expires)||now<issued||now>=expires||expires-issued>900000||expires<=issued)return fail('TTL');
 if(!exact(state,['grant','attempt','epochSeen','sourceMatches','baselineMatches','ownerMatches','locked'])||
 state.grant!==null||state.attempt!==null||state.epochSeen!==false||state.sourceMatches!==true||
 state.baselineMatches!==true||state.ownerMatches!==true||state.locked!==true)return fail('PRECONDITION');
 const bindingDigest=hash(JSON.stringify(b));
 if(!hex(bindingDigest)||typeof verifyMockApproval!=='function'||verifyMockApproval(bindingDigest)!==true)return fail('AUTHORITY');
 const ready={contract:'N11_M4_ATTEMPT_V1',scopeSha256:b.scopeSha256,state:'READY',attempt:null};
 const grant={scopeSha256:b.scopeSha256,issuedAt:b.issuedAt,expiresAt:b.expiresAt,revoked:false};
 return {ok:true,mode:'MOCK_PLAN_ONLY',bindingDigest,mutations:[{key:'epoch',value:b.epoch},{key:'attempt',value:{body:ready,sha256:hash(JSON.stringify(ready))}},{key:'grant',value:grant}],grantIssued:false,release:false};
}
function planRevoke(b,state,hash,verifyMockApproval){
 if(!b||b.environment!=='MOCK_ONLY'||b.proofCase!=='P2'||!mockId(b.epoch)||!hex(b.scopeSha256)||
 !state||state.locked!==true||state.ownerMatches!==true||state.epochSeen!==true||!state.attempt||
 !exact(state.attempt,['body','sha256'])||state.attempt.sha256!==hash(JSON.stringify(state.attempt.body))||
 state.attempt.body.scopeSha256!==b.scopeSha256||!['READY','RESERVED','VERIFIED'].includes(state.attempt.body.state)||
 !exact(state.grant,['scopeSha256','issuedAt','expiresAt','revoked'])||state.grant.scopeSha256!==b.scopeSha256||
 state.grant.issuedAt!==b.issuedAt||state.grant.expiresAt!==b.expiresAt||typeof state.grant.revoked!=='boolean')return fail('REVOKE_PRECONDITION');
 if(typeof verifyMockApproval!=='function'||verifyMockApproval(hash(JSON.stringify(b)))!==true)return fail('AUTHORITY');
 return {ok:true,mode:'MOCK_PLAN_ONLY',mutations:state.grant.revoked?[]:[{key:'grant',value:{...state.grant,revoked:true}}],grantIssued:false,release:false};
}
// A real implementation must reserve epoch -> READY/readback -> grant/readback last;
// on any uncertain write stop, never reissue/reset. Revoke first, preserve ledger.
// The plan never applies mutations; no real authority or durable store is implemented.
module.exports={planIssue,planRevoke};
