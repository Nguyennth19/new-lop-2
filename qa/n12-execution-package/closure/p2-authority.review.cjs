'use strict';
// Review-only protocol. No GAS bindings, no actual grants, no provider or network calls.
// Accepts only explicitly synthetic scopes. A real authority verifier and provisioner
// require separate approval; mock verification is NOT a signature.
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join('|')===keys.slice().sort().join('|');
const hex=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const mockId=x=>typeof x==='string'&&/^MOCK_[A-Z0-9_]{8,70}$/.test(x);
const fail=reason=>({ok:false,reason,mutations:[],grantIssued:false,release:false});
const approved=(verify,action,digest)=>{try{return typeof verify==='function'&&verify(action,digest)===true;}catch(e){return false;}};
function planIssue(b,state,now,hash,verifyMockApproval){
 const keys=['contract','environment','proofCase','project','target','backup','owner','grantId','epoch','scopeSha256','intentSha256','candidateSha256','sourceSha256','initialExecutionId','secondExecutionId','issuedAt','expiresAt'];
 if(!exact(b,keys)||b.contract!=='N12_P2_BINDING_REVIEW_V1'||b.environment!=='MOCK_ONLY'||b.proofCase!=='P2'||
 ![b.project,b.target,b.backup,b.grantId,b.epoch,b.initialExecutionId,b.secondExecutionId].every(mockId)||
 new Set([b.project,b.target,b.backup,b.grantId,b.epoch,b.initialExecutionId,b.secondExecutionId]).size!==7||
 b.owner!=='owner@example.invalid'||![b.scopeSha256,b.intentSha256,b.candidateSha256,b.sourceSha256].every(hex))return fail('BINDING');
 const issued=Date.parse(b.issuedAt),expires=Date.parse(b.expiresAt);
 if(!Number.isFinite(now)||!Number.isFinite(issued)||!Number.isFinite(expires)||now<issued||now>=expires||expires-issued>900000||expires<=issued)return fail('TTL');
 if(!exact(state,['grant','attempt','epoch','sourceMatches','baselineMatches','ownerMatches','locked'])||
 state.grant!==null||state.attempt!==null||state.epoch!==null||state.sourceMatches!==true||
 state.baselineMatches!==true||state.ownerMatches!==true||state.locked!==true)return fail('PRECONDITION');
 const bindingDigest=hash(JSON.stringify(b));
 if(!hex(bindingDigest)||!approved(verifyMockApproval,'ISSUE',bindingDigest))return fail('AUTHORITY');
 const ready={contract:'N11_M4_ATTEMPT_V1',scopeSha256:b.scopeSha256,state:'READY',attempt:null};
 const grant={scopeSha256:b.scopeSha256,issuedAt:b.issuedAt,expiresAt:b.expiresAt,revoked:false};
 return {ok:true,mode:'MOCK_PLAN_ONLY',bindingDigest,mutations:[{key:'epoch',value:b.epoch},{key:'attempt',value:{body:ready,sha256:hash(JSON.stringify(ready))}},{key:'grant',value:grant}],grantIssued:false,release:false};
}
function planRevoke(b,state,hash,verifyMockApproval){
 if(!b||b.environment!=='MOCK_ONLY'||b.proofCase!=='P2'||!mockId(b.epoch)||!hex(b.scopeSha256)||
 !state||state.locked!==true||state.ownerMatches!==true||state.epoch!==b.epoch||
 !exact(state.grant,['scopeSha256','issuedAt','expiresAt','revoked'])||state.grant.scopeSha256!==b.scopeSha256||
 state.grant.issuedAt!==b.issuedAt||state.grant.expiresAt!==b.expiresAt||typeof state.grant.revoked!=='boolean')return fail('REVOKE_PRECONDITION');
 if(!approved(verifyMockApproval,'REVOKE',hash(JSON.stringify(b))))return fail('AUTHORITY');
 // Revocation must not be blocked by missing/corrupt ledger evidence.
 // Preserve the attempt unchanged and flag reconciliation; never repair/reset it here.
 let evidence='MISSING_OR_CORRUPT';
 try{if(exact(state.attempt,['body','sha256'])&&state.attempt.sha256===hash(JSON.stringify(state.attempt.body))&&
 state.attempt.body.scopeSha256===b.scopeSha256&&['READY','RESERVED','VERIFIED'].includes(state.attempt.body.state))evidence='HASH_MATCH_ONLY';}catch(e){}
 return {ok:true,mode:'MOCK_PLAN_ONLY',attemptEvidence:evidence,mutations:state.grant.revoked?[]:[{key:'grant',value:{...state.grant,revoked:true}}],grantIssued:false,release:false};
}
// In-memory fault drill, not a provider provisioner. Never accepts a live store.
// Each simulated mutation is read back. If ack is uncertain stop; retain partial state.
function simulateIssue(plan,failAfter=-1){
 if(!plan||!plan.ok||plan.mode!=='MOCK_PLAN_ONLY'||plan.mutations.map(m=>m.key).join('|')!=='epoch|attempt|grant')return {ok:false,state:null};
 const state={epoch:null,attempt:null,grant:null};let applied=0;
 for(const m of plan.mutations){state[m.key]=JSON.parse(JSON.stringify(m.value));applied++;
  if(applied===failAfter||JSON.stringify(state[m.key])!==JSON.stringify(m.value))return {ok:false,reason:'ACK_UNKNOWN_NO_RETRY',state,applied};
 }
 return {ok:true,state,applied};
}
// A real implementation must reserve epoch -> READY/readback -> grant/readback last;
// on any uncertain write stop, never reissue/reset. Revoke first, preserve ledger.
// The plan never applies mutations; no real authority or durable store is implemented.
module.exports={planIssue,planRevoke,simulateIssue};
