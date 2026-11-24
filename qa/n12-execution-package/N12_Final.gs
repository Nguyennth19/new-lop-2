/** Final sprint source only. Both reviewed configurations remain null. No authority provisioning. */
const N12_FINAL_REVIEWED_CASE_=null;
const N12_FINAL_P5_=null;
function n12FinalPhase_(phase,s,intent,raw,authorityCheck){
 if(!s||!intent||!['INITIAL','REPLAY'].includes(phase)||s.writesEnabled!==true||phase==='REPLAY'&&s.proofCase!=='P2')return n7TestDeny_('N12_PHASE_DENIED');
 let c;
 try{
  c=n12Context_(raw,s);
  if(!n7TestValidate_(intent,s).ok||!n11M4GrantCurrent_(c.deps,c))return n7TestDeny_('N12_GRANT_OR_INTENT_DENIED');
 }catch(e){return n7TestDeny_('N12_SCOPE_OR_AUTHORITY_DENIED');}
 // P2 public dispatch supplies a binding check; recheck on every grant read, including under ScriptLock.
 if(authorityCheck){
  if(!authorityCheck())return n7TestDeny_('P2_EXECUTION_BINDING_DENIED');
  const readGrant=c.deps.readGrant;
  c.deps.readGrant=()=>authorityCheck()?readGrant():{scopeSha256:c.sha,revoked:true};
 }
 const l=n11M4Ledger_(c.deps,s,c,intent);
 const ledger=Object.assign({},l,{get:function(k){
  const record=l.get(k); // under N7 ScriptLock
  const b=n11M4ReadEnvelope_(c.store,c.sha,c.u);
  if(phase==='INITIAL'&&(record||b.state!=='READY'))throw Error('N12_INITIAL_ALREADY_ATTEMPTED');
  if(phase==='REPLAY'&&(!record||b.state!=='VERIFIED'||record.batch_id===intent.executionId))throw Error('N12_REPLAY_REQUIRES_VERIFIED_NEW_INVOCATION');
  return record;
 },putIfAbsent:function(k,v){return phase==='INITIAL'&&l.putIfAbsent(k,v);}});
 return n7TestExecute_(intent,Object.assign({},c.deps,{attemptLedger:ledger}),s);
}
function n12FinalDispatch_(phase,c,raw){
 if(!c||!n11M4Exact_(c,['settings','intent','secondExecutionId'])||!['INITIAL','REPLAY','RECONCILE'].includes(phase))return n7TestDeny_('N12_FINAL_HARD_OFF');
 const s=c.settings,i=c.intent;
 if(!s||s.writesEnabled!==true||!i||!n12EditorPinned_(s,i,raw)||typeof c.secondExecutionId!=='string'||!(/^[A-Z0-9_]{6,70}$/).test(c.secondExecutionId)||c.secondExecutionId===i.executionId)return n7TestDeny_('N12_FINAL_PIN_DENIED');
 const authorityCheck=s.proofCase==='P2'?()=>typeof n12P2ExecutionAllowed_==='function'&&n12P2ExecutionAllowed_(phase,c,raw):null;
 if(phase==='INITIAL')return n12FinalPhase_(phase,s,i,raw,authorityCheck);
 const next=Object.assign({},i,{executionId:c.secondExecutionId});
 if(phase==='REPLAY')return n12FinalPhase_(phase,s,next,raw,authorityCheck);
 if(!['P3','P4'].includes(s.proofCase))return n7TestDeny_('N12_RECONCILE_PHASE_DENIED');
 try{
  const g=JSON.parse(raw.propertiesService.getScriptProperties().getProperty('N12_GRANT_'+s.approvedScopeSha256));
  if(!n11M4Exact_(g,['scopeSha256','issuedAt','expiresAt','revoked'])||g.scopeSha256!==s.approvedScopeSha256||g.issuedAt!==s.grantIssuedAt||g.expiresAt!==s.grantExpiresAt||g.revoked!==true)return n7TestDeny_('N12_EXPLICIT_REVOCATION_REQUIRED');
 }catch(e){return n7TestDeny_('N12_REVOCATION_EVIDENCE_MISSING');}
 return n12Reconcile_(next,raw,Object.assign({},s,{writesEnabled:false}));
}
function N12_FinalInitial(){return N12_FINAL_REVIEWED_CASE_?n12FinalDispatch_('INITIAL',N12_FINAL_REVIEWED_CASE_,n12ProviderDeps_()):n7TestDeny_('N12_FINAL_HARD_OFF');}
function N12_FinalReplay(){return N12_FINAL_REVIEWED_CASE_?n12FinalDispatch_('REPLAY',N12_FINAL_REVIEWED_CASE_,n12ProviderDeps_()):n7TestDeny_('N12_FINAL_HARD_OFF');}
function N12_FinalReconcile(){return N12_FINAL_REVIEWED_CASE_?n12FinalDispatch_('RECONCILE',N12_FINAL_REVIEWED_CASE_,n12ProviderDeps_()):n7TestDeny_('N12_FINAL_HARD_OFF');}
function n12P5Grid_(tab){
 if(tab.getMaxRows()!==151||tab.getMaxColumns()!==8||tab.getFrozenRows()!==1)throw Error('P5_GRID');
 const r=tab.getRange(1,1,151,8),v=r.getValues(),d=r.getDisplayValues(),f=r.getFormulas(),n=r.getNumberFormats();
 if(![v,d,f,n].every(a=>a.length===151&&a.every(x=>x.length===8))||!v.every((row,i)=>row.every((x,j)=>typeof x==='string'&&x===d[i][j]&&f[i][j]===''&&n[i][j]==='@')))throw Error('P5_CELL_DRIFT');
 return v;
}
function n12P5Plan_(observed,u){
 const b=[N7_TEST_HEADERS_.slice(),...Array.from({length:150},()=>Array(8).fill(''))],drift=b.map(x=>x.slice());drift[0][0]='N12_P5_SYNTHETIC_DRIFT';
 if(JSON.stringify(observed)!==JSON.stringify(drift))throw Error('P5_UNAPPROVED_DIFF');
 return {before:n7TestSha256_(JSON.stringify(drift),u),after:n7TestSha256_(JSON.stringify(b),u)};
}
function n12P5Restore_(c,raw){
 const deny=r=>n7TestDeny_(r);if(!c)return deny('P5_HARD_OFF');
 let lock,held=false,attempted=false;
 try{
  if(!n11M4Exact_(c,['projectId','targetId','owner','grantId','issuedAt','expiresAt','before','after','scopeSha256'])||!/^N12_GRANT_[A-Z0-9_]{3,55}$/.test(c.grantId))return deny('P5_SCOPE');
  const u=raw.utilities,hash=v=>n7TestSha256_(v,u),p=raw.propertiesService.getScriptProperties(),setup=JSON.parse(p.getProperty('N12_SETUP_CONFIG'));
  const roles=Object.keys(N12_SETUP_RESOURCE_PINS_);
  if(!n11M4Exact_(setup,['environment','projectId','ownerEmail','resources'])||setup.environment!=='N12_DISPOSABLE_SYNTHETIC_ONLY'||!n11M4Exact_(setup.resources,roles)||new Set([setup.projectId,...Object.values(setup.resources)]).size!==8||roles.some(k=>hash(setup.resources[k])!==N12_SETUP_RESOURCE_PINS_[k])||hash(c.projectId)!==N12_PROJECT_SHA_||c.projectId!==setup.projectId||raw.scriptApp.getScriptId()!==c.projectId||c.owner!==setup.ownerEmail||raw.session.getEffectiveUser().getEmail()!==c.owner||c.targetId!==setup.resources.P5_RECOVERY||N12_FORBIDDEN_IDS_.includes(c.targetId))return deny('P5_IDENTITY');
  const scope={contract:'N12_P5_ONE_CELL_V1',projectId:c.projectId,targetId:c.targetId,owner:c.owner,grantId:c.grantId,issuedAt:c.issuedAt,expiresAt:c.expiresAt,tab:'15_NhatKy_HanhDong',cell:'A1',before:c.before,after:c.after};
  const sha=hash(JSON.stringify(scope)),issued=Date.parse(c.issuedAt),expires=Date.parse(c.expiresAt);
  if(sha!==c.scopeSha256||!Number.isFinite(issued)||!Number.isFinite(expires)||expires<=issued||expires-issued>900000)return deny('P5_DIGEST_OR_TTL');
  const grantKey='N12_GRANT_'+sha,attemptKey='N12_ATTEMPT_'+sha;
  const current=()=>{const g=JSON.parse(p.getProperty(grantKey)),now=raw.now();return n11M4Exact_(g,['scopeSha256','issuedAt','expiresAt','revoked'])&&g.scopeSha256===sha&&g.issuedAt===c.issuedAt&&g.expiresAt===c.expiresAt&&g.revoked===false&&Number.isFinite(now)&&now>=issued&&now<expires;};
  lock=raw.lockService.getScriptLock();held=lock.tryLock(10000);if(!held||!current())return deny('P5_LOCK_OR_GRANT');
  const read=()=>n11M4ReadEnvelope_({getProperty:()=>p.getProperty(attemptKey)},sha,u);
  if(read().state!=='READY')return n7TestUnknown_('P5_ATTEMPT_EXISTS_NO_RETRY',null);
  const wb=raw.spreadsheetApp.openById(c.targetId),tabs=wb.getSheets();
  if(wb.getId()!==c.targetId||tabs.length!==1||tabs[0].getName()!==scope.tab)return deny('P5_TAB');
  const tab=tabs[0],plan=n12P5Plan_(n12P5Grid_(tab),u);
  if(plan.before!==c.before||plan.after!==c.after||n7TestSnapshotDigest_([],{isolatedSpreadsheetId:c.targetId,journalTab:scope.tab},u)!==N12_SETUP_BASELINE_PINS_.P5||!current())return deny('P5_BASELINE');
  const record={requestId:'N12_P5_RESTORE',idempotencyKey:'N12_P5_'+sha.slice(0,24).toUpperCase(),batch_id:'N12_P5_'+sha.slice(24,48).toUpperCase(),intentDigest:sha,journalDigest:c.after};
  const persist=state=>{const value=n11M4Seal_({contract:'N11_M4_ATTEMPT_V1',scopeSha256:sha,state,attempt:{key:c.targetId+'|A1',record}},u);p.setProperty(attemptKey,value);if(p.getProperty(attemptKey)!==value)throw Error('P5_LEDGER_READBACK');};
  attempted=true;persist('RESERVED');
  if(!current()||n12P5Plan_(n12P5Grid_(tab),u).before!==c.before)return n7TestUnknown_('P5_RECONCILE_REQUIRED',null);
  tab.getRange(1,1,1,1).setValue('event_id');raw.spreadsheetApp.flush();
  if(hash(JSON.stringify(n12P5Grid_(tab)))!==c.after||!current())return n7TestUnknown_('P5_RECONCILE_REQUIRED',null);
  persist('VERIFIED');
  return {ok:true,commitState:'COMMITTED_VERIFIED',writes:1,restores:1,cell:'A1',journalAppends:0,before:c.before,after:c.after,scopeSha256:sha,release:false,atomicCasProven:false};
 }catch(e){return attempted?n7TestUnknown_('P5_RECONCILE_REQUIRED',null):deny('P5_PREWRITE_DENIED');}
 finally{if(held)lock.releaseLock();}
}
function N12_FinalRestoreP5(){return N12_FINAL_P5_?n12P5Restore_(N12_FINAL_P5_,n12ProviderDeps_()):n7TestDeny_('P5_HARD_OFF');}
