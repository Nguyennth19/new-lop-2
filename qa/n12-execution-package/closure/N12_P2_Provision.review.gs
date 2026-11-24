/** P2 SOURCE REVIEW ONLY — NOT part of the accepted eight-file GAS package.
 * No public entrypoint; n12ProviderDeps_ has no authority verifier, so default is HARD OFF.
 * An independently reviewed verifier and live parity must be authorized separately.
 */
function n12P2Binding_(c,a,u){
 return n7TestSha256_(JSON.stringify(['N12_P2_PROVISION_V1',a.epoch,a.sourceSha256,c]),u);
}
function n12P2Provision_(action,c,a,raw){
 const deny=n7TestDeny_;
 if(!raw||typeof raw.verifyP2Authority!=='function')return deny('P2_PROVISION_HARD_OFF');
 let lock,held=false,attempted=false;
 const unknown=()=>({ok:false,reason:'P2_PROPERTY_ACK_UNKNOWN',commitState:'NOT_ATTEMPTED',writes:0,propertyWrites:null,retryAllowed:false,release:false});
 try{
  if(!['ISSUE','REVOKE'].includes(action)||!n11M4Exact_(c,['settings','intent','secondExecutionId'])||
   !n11M4Exact_(a,['epoch','sourceSha256','bindingSha256'])||!/^N12_P2_EPOCH_[A-Z0-9_]{3,40}$/.test(a.epoch)||
   ![a.sourceSha256,a.bindingSha256].every(x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x)))return deny('P2_BINDING_SCHEMA');
  const s=c.settings,i=c.intent,u=raw.utilities;
  const pinned=()=>s&&i&&s.proofCase==='P2'&&s.writesEnabled===true&&
   typeof c.secondExecutionId==='string'&&/^[A-Z0-9_]{6,70}$/.test(c.secondExecutionId)&&
   c.secondExecutionId!==i.executionId&&n12EditorPinned_(s,i,raw)&&n12P2Binding_(c,a,u)===a.bindingSha256;
  const authorized=()=>pinned()&&raw.verifyP2Authority(action,a.bindingSha256,a.sourceSha256)===true;
  if(!authorized())return deny('P2_BINDING_OR_AUTHORITY_DENIED');
  const ctx=n12Context_(raw,s),p=raw.propertiesService.getScriptProperties(),sha=ctx.sha;
  const epochKey='N12_P2_EPOCH',attemptKey='N12_ATTEMPT_'+sha,grantKey='N12_GRANT_'+sha;
  const write=(key,value)=>{attempted=true;p.setProperty(key,value);if(p.getProperty(key)!==value)throw Error('P2_PROPERTY_READBACK');};
  const issued=Date.parse(ctx.scope.issuedAt),expires=Date.parse(ctx.scope.expiresAt);
  const current=()=>Number.isFinite(raw.now())&&raw.now()>=issued&&raw.now()<expires&&authorized();
  const grant={scopeSha256:sha,issuedAt:ctx.scope.issuedAt,expiresAt:ctx.scope.expiresAt,revoked:false};
  lock=raw.lockService.getScriptLock();held=lock.tryLock(10000);
  if(!held||!authorized())return deny('P2_LOCK_OR_AUTHORITY_DENIED');
  if(action==='REVOKE'){
   // Revocation is independent of ledger integrity or expiry. Preserve epoch and attempt.
   const g=JSON.parse(p.getProperty(grantKey));
   if(!n11M4Exact_(g,Object.keys(grant))||g.scopeSha256!==sha||g.issuedAt!==grant.issuedAt||
    g.expiresAt!==grant.expiresAt||typeof g.revoked!=='boolean')return deny('P2_GRANT_IDENTITY_DENIED');
   if(g.revoked)return {ok:true,provisionState:'REVOKED',propertyWrites:0,writes:0,release:false};
   g.revoked=true;write(grantKey,JSON.stringify(g));
   return {ok:true,provisionState:'REVOKED',propertyWrites:1,writes:0,release:false};
  }
  if(!current()||[epochKey,attemptKey,grantKey].some(k=>p.getProperty(k)!==null))return deny('P2_EPOCH_OR_TTL_DENIED');
  // Exact existing grid verifier; read only, no call to P5 restore or any journal writer.
  const expected=[N7_TEST_HEADERS_.slice(),...Array.from({length:150},()=>Array(8).fill(''))];
  for(const id of [ctx.scope.target,ctx.scope.backup]){
   const wb=raw.spreadsheetApp.openById(id),tabs=wb.getSheets();
   if(wb.getId()!==id||tabs.length!==1||tabs[0].getName()!==ctx.scope.tab||
    JSON.stringify(n12P5Grid_(tabs[0]))!==JSON.stringify(expected))return deny('P2_BASELINE_DENIED');
  }
  if(n7TestSnapshotDigest_([],s,u)!==ctx.scope.baselineDigest||!current())return deny('P2_BASELINE_OR_TTL_DENIED');
  // One P2 epoch for this proof project: never overwrite, reset or reissue after uncertainty.
  write(epochKey,JSON.stringify({epoch:a.epoch,scopeSha256:sha,bindingSha256:a.bindingSha256}));
  if(!current())return unknown();
  write(attemptKey,n11M4Seal_({contract:'N11_M4_ATTEMPT_V1',scopeSha256:sha,state:'READY',attempt:null},u));
  if(!current()||p.getProperty(grantKey)!==null)return unknown();
  write(grantKey,JSON.stringify(grant)); // grant last; any unknown acknowledgement requires revoke/reconcile
  if(!current())return unknown();
  return {ok:true,provisionState:'PROVISIONED',propertyWrites:3,writes:0,release:false};
 }catch(e){return attempted?unknown():deny('P2_PREWRITE_DENIED');}
 finally{if(held)lock.releaseLock();}
}
