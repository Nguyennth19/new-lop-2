/** P2 SOURCE REVIEW ONLY — NOT part of the accepted eight-file GAS package.
 * Public issue/revoke wrappers remain HARD OFF with null reviewed case/receipt pin.
 * Proposed disposable-only authority: human-verified dual signoff pinned in reviewed source.
 * NOT a cryptographic signature verifier or protection against a source-editing Owner.
 */
function n12P2Binding_(c,a,u){
 return n7TestSha256_(JSON.stringify(['N12_P2_PROVISION_V1',a.epoch,a.sourceSha256,c]),u);
}
function n12P2Provision_(action,c,a,raw){
 const deny=n7TestDeny_;
 if(!raw||typeof raw.verifyP2Authority!=='function')return deny('P2_PROVISION_HARD_OFF');
 let lock,held=false,attempted=false,emergencyRevoke=null;
 const unknown=()=>{
  // An ISSUE acknowledgement may be lost after the grant actually persisted.
  // Try the separately authorized revocation under the same lock, never reissue/reset.
  let revocationState=action==='REVOKE'?'UNCONFIRMED':'NOT_REQUIRED_BEFORE_GRANT_WRITE';
  if(emergencyRevoke){try{revocationState=emergencyRevoke();}catch(e){revocationState='UNCONFIRMED';}}
  return {ok:false,reason:'P2_PROPERTY_ACK_UNKNOWN',commitState:'NOT_ATTEMPTED',writes:0,propertyWrites:null,retryAllowed:false,executionAllowed:false,revocationState,release:false};
 };
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
  const exactGrant=g=>n11M4Exact_(g,Object.keys(grant))&&g.scopeSha256===sha&&g.issuedAt===grant.issuedAt&&
   g.expiresAt===grant.expiresAt&&typeof g.revoked==='boolean';
  lock=raw.lockService.getScriptLock();held=lock.tryLock(10000);
  if(!held||!authorized())return deny('P2_LOCK_OR_AUTHORITY_DENIED');
  if(action==='REVOKE'){
   // Revocation is independent of ledger integrity or expiry. Preserve epoch and attempt.
   const g=JSON.parse(p.getProperty(grantKey));
   if(!exactGrant(g))return deny('P2_GRANT_IDENTITY_DENIED');
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
  emergencyRevoke=()=>{
   if(!held||!pinned()||raw.verifyP2Authority('REVOKE',a.bindingSha256,a.sourceSha256)!==true)return 'UNCONFIRMED';
   const value=p.getProperty(grantKey);
   if(value===null)return 'NO_GRANT_OBSERVED';
   const g=JSON.parse(value);if(!exactGrant(g))return 'UNCONFIRMED';
   if(!g.revoked){g.revoked=true;write(grantKey,JSON.stringify(g));}
   return 'REVOKED';
  };
  write(grantKey,JSON.stringify(grant)); // grant last; on uncertainty attempt authorized fail-safe revoke
  if(!current())return unknown();
  return {ok:true,provisionState:'PROVISIONED',propertyWrites:3,writes:0,release:false};
 }catch(e){return attempted?unknown():deny('P2_PREWRITE_DENIED');}
 finally{if(held)lock.releaseLock();}
}

/** Only called from final dispatcher for P2. A stored grant is insufficient authority. */
function n12P2ExecutionAllowed_(phase,c,raw){
 try{
  if(!['INITIAL','REPLAY'].includes(phase)||!raw||typeof raw.verifyP2Authority!=='function')return false;
  const a=raw.p2Binding,s=c.settings;
  if(!n11M4Exact_(a,['epoch','sourceSha256','bindingSha256'])||!/^N12_P2_EPOCH_[A-Z0-9_]{3,40}$/.test(a.epoch)||
    ![a.sourceSha256,a.bindingSha256].every(x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x))||
    s.proofCase!=='P2'||!n12EditorPinned_(s,c.intent,raw)||n12P2Binding_(c,a,raw.utilities)!==a.bindingSha256)return false;
  // Only this invocation's successful ISSUE can authorize INITIAL; persisted grant alone is insufficient.
  // The marker is never persisted or accepted as a public argument.
  if(phase==='INITIAL'&&raw.p2IssueConfirmed!==a.bindingSha256)return false;
  const epoch=raw.propertiesService.getScriptProperties().getProperty('N12_P2_EPOCH');
  return epoch===JSON.stringify({epoch:a.epoch,scopeSha256:s.approvedScopeSha256,bindingSha256:a.bindingSha256})&&
    raw.verifyP2Authority(phase,a.bindingSha256,a.sourceSha256)===true;
 }catch(e){return false;}
}

/** Proposed scoped human authority. Pin only after independent evidence verification and exact source review.
 * The source hash identifies the reviewed package before populating activation slots; activated parity is separate.
 * Never populate from a Sheet cell, arbitrary property, AI recommendation or caller-supplied live request.
 */
const N12_P2_AUTHORITY_PIN_=null;
function n12P2PinnedDeps_(raw,c,pin){
 try{
  if(!c||!c.settings||c.settings.proofCase!=='P2'||!n11M4Exact_(pin,['binding','ownerReceiptSha256','qaReceiptSha256','actions'])||
   !n11M4Exact_(pin.binding,['epoch','sourceSha256','bindingSha256'])||
   ![pin.ownerReceiptSha256,pin.qaReceiptSha256,pin.binding.sourceSha256,pin.binding.bindingSha256].every(x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x))||
   pin.ownerReceiptSha256===pin.qaReceiptSha256||
   JSON.stringify(pin.actions)!==JSON.stringify(['ISSUE','INITIAL','REPLAY','REVOKE'])||
   n12P2Binding_(c,pin.binding,raw.utilities)!==pin.binding.bindingSha256)return raw;
  const b=Object.freeze(Object.assign({},pin.binding)),actions=pin.actions.slice();
  return Object.assign({},raw,{p2Binding:b,verifyP2Authority:(action,digest,source)=>actions.includes(action)&&digest===b.bindingSha256&&source===b.sourceSha256});
 }catch(e){return raw;}
}
function n12P2ReviewedDeps_(raw,c){return n12P2PinnedDeps_(raw,c,N12_P2_AUTHORITY_PIN_);}
function n12P2IssueAndInitial_(c,a,raw){
 const issued=n12P2Provision_('ISSUE',c,a,raw);
 if(!issued.ok||issued.provisionState!=='PROVISIONED')return issued;
 // No standalone INITIAL after ISSUE, even when a previous grant was successfully stored.
 // Normal dispatcher rechecks binding, actor, TTL, grant and ledger, including under its lock.
 const result=n12FinalDispatch_('INITIAL',c,Object.assign({},raw,{p2IssueConfirmed:a.bindingSha256}));
 return Object.assign({},result,{issueState:issued.provisionState,issuePropertyWrites:issued.propertyWrites});
}
function n12P2ReviewedProvision_(action){
 if(!N12_FINAL_REVIEWED_CASE_||!N12_P2_AUTHORITY_PIN_)return n7TestDeny_('P2_PROVISION_HARD_OFF');
 const raw=n12P2ReviewedDeps_(n12ProviderDeps_(),N12_FINAL_REVIEWED_CASE_);
 if(N12_PROVIDER_SETTINGS_!==null||N12_EDITOR_REVIEWED_CASE_!==null)return n7TestDeny_('P2_LEGACY_WRITER_NOT_OFF');
 if(action==='ISSUE_AND_INITIAL')return n12P2IssueAndInitial_(N12_FINAL_REVIEWED_CASE_,raw.p2Binding,raw);
 if(action==='ISSUE')return n7TestDeny_('P2_USE_ISSUE_AND_INITIAL');
 return n12P2Provision_(action,N12_FINAL_REVIEWED_CASE_,raw.p2Binding,raw);
}
function N12_P2_Issue(){return n12P2ReviewedProvision_('ISSUE');}
function N12_P2_IssueAndInitial(){return n12P2ReviewedProvision_('ISSUE_AND_INITIAL');}
function N12_P2_Revoke(){return n12P2ReviewedProvision_('REVOKE');}
