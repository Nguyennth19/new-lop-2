/**
 * N11-M4 LAB ONLY. No PropertiesService, DriveApp or GAS entrypoint wiring.
 * One pre-provisioned synthetic grant epoch, one immutable attempt, same ScriptLock.
 * Injected store models property-like persistence. SHA-256 is integrity, NOT auth/CAS.
 * No auto-initialize, reset, retry, delete, provider restore or real grant.
 */
const N11_M4_STORE_KEY_='N11_M4_SYNTHETIC_ATTEMPT_V1';
function n11M4Exact_(v,keys){
  return !!v&&Object.prototype.toString.call(v)==='[object Object]'&&
    Object.keys(v).sort().join('|')===keys.slice().sort().join('|');
}
function n11M4Scope_(s){
  const hex=/^[a-f0-9]{64}$/;
  if(!s||typeof s.isolatedSpreadsheetId!=='string'||!/^M4_LAB_COPY_[A-Z0-9_]+$/.test(s.isolatedSpreadsheetId)||
    typeof s.backupId!=='string'||!/^M4_LAB_BACKUP_[A-Z0-9_]+$/.test(s.backupId)||
    s.isolatedSpreadsheetId===s.backupId||s.journalTab!=='15_NhatKy_HanhDong'||
    !Array.isArray(s.forbiddenSheetIds)||s.forbiddenSheetIds.includes(s.isolatedSpreadsheetId)||
    s.forbiddenSheetIds.includes(s.backupId)||typeof s.allowedOwnerEmail!=='string'||
    !/^[a-z0-9._-]+@example\.invalid$/.test(s.allowedOwnerEmail)||
    typeof s.approvedGrantId!=='string'||!/^M4_GRANT_[A-Z0-9_]+$/.test(s.approvedGrantId)||
    ![s.approvedIntentDigest,s.approvedJournalSnapshotDigest].every(function(v){
      return typeof v==='string'&&hex.test(v);
    })||
    !Number.isSafeInteger(s.approvedBaselineRows)||s.approvedBaselineRows<0||s.approvedBaselineRows>=150||
    typeof s.grantExpiresAt!=='string'||!Number.isFinite(Date.parse(s.grantExpiresAt)))
    throw Error('M4_SYNTHETIC_SCOPE_REQUIRED');
  return {contract:'N11_M4_SCOPE_V1',target:s.isolatedSpreadsheetId,backup:s.backupId,
    tab:s.journalTab,owner:s.allowedOwnerEmail,grantId:s.approvedGrantId,
    intentDigest:s.approvedIntentDigest,baselineDigest:s.approvedJournalSnapshotDigest,
    baselineRows:s.approvedBaselineRows,expiresAt:s.grantExpiresAt};
}
function n11M4ScopeDigest_(scope,u){
  return n7TestSha256_(JSON.stringify(scope),u);
}
function n11M4Seal_(body,u){
  return JSON.stringify({body:body,sha256:n7TestSha256_(JSON.stringify(body),u)});
}
function n11M4ReadEnvelope_(store,scopeSha,u){
  const raw=store.getProperty(N11_M4_STORE_KEY_);
  if(typeof raw!=='string'||raw.length>8192)throw Error('M4_LEDGER_MISSING_OR_BOUNDS');
  const envelope=JSON.parse(raw),b=envelope.body;
  if(!n11M4Exact_(envelope,['body','sha256'])||
    envelope.sha256!==n7TestSha256_(JSON.stringify(b),u)||
    !n11M4Exact_(b,['contract','scopeSha256','state','attempt'])||
    b.contract!=='N11_M4_ATTEMPT_V1'||b.scopeSha256!==scopeSha||
    !['READY','RESERVED','VERIFIED'].includes(b.state))
    throw Error('M4_LEDGER_INTEGRITY_OR_SCOPE');
  const a=b.attempt,hex=/^[a-f0-9]{64}$/,id=/^[A-Z0-9_]{6,70}$/;
  if(b.state==='READY'){
    if(a!==null)throw Error('M4_LEDGER_STATE_INVALID');
  }else if(!n11M4Exact_(a,['key','record'])||typeof a.key!=='string'||
    !n11M4Exact_(a.record,['requestId','idempotencyKey','batch_id','intentDigest','journalDigest'])||
    ![a.record.requestId,a.record.idempotencyKey,a.record.batch_id].every(function(v){
      return typeof v==='string'&&id.test(v);
    })||![a.record.intentDigest,a.record.journalDigest].every(function(v){
      return typeof v==='string'&&hex.test(v);
    }))throw Error('M4_LEDGER_RECORD_INVALID');
  return b;
}
function n11M4Context_(deps,s){
  const scope=n11M4Scope_(s),u=deps.utilities;
  const scopeSha=n11M4ScopeDigest_(scope,u),store=deps.attemptStore;
  if(deps.mode!=='M4_SYNTHETIC_ONLY'||scopeSha!==s.approvedScopeSha256||
    !store||typeof store.getProperty!=='function'||typeof store.setProperty!=='function'||
    deps.session.getEffectiveUser().getEmail()!==scope.owner)
    throw Error('M4_SCOPE_OR_ACTOR_DENIED');
  return {scope:scope,sha:scopeSha,store:store,u:u};
}
function n11M4GrantCurrent_(deps,c){
  const g=deps.readGrant(),now=deps.now(),expiry=Date.parse(c.scope.expiresAt);
  return n11M4Exact_(g,['scopeSha256','revoked'])&&g.scopeSha256===c.sha&&g.revoked===false&&
    Number.isFinite(now)&&now<expiry&&expiry-now<=15*60*1000&&
    deps.session.getEffectiveUser().getEmail()===c.scope.owner;
}
function n11M4Backup_(deps,s,c){
  const b=n9ReadJournal_(deps.spreadsheetApp,c.scope.backup,c.scope.tab);
  if(!b.ok)throw Error('M4_BACKUP_READ_FAILED');
  const observed={ok:true,dataRows:b.rows.length-1,digest:n8SnapshotDigest_(b.rows,s,c.u)};
  const expected={ok:true,dataRows:c.scope.baselineRows,digest:c.scope.baselineDigest};
  if(!n8CompareSnapshots_(expected,observed).ok)throw Error('M4_BACKUP_BASELINE_MISMATCH');
  return b.rows;
}
function n11M4Ledger_(deps,s,c,intent){
  const key=c.scope.target+'|N7_'+intent.idempotencyKey;
  const read=function(){
    const b=n11M4ReadEnvelope_(c.store,c.sha,c.u);
    if(b.attempt&&(b.attempt.key!==key||b.attempt.record.intentDigest!==c.scope.intentDigest))
      throw Error('M4_GRANT_ALREADY_BOUND');
    return b;
  };
  const persist=function(b){
    const raw=n11M4Seal_(b,c.u);
    c.store.setProperty(N11_M4_STORE_KEY_,raw);
    if(c.store.getProperty(N11_M4_STORE_KEY_)!==raw)throw Error('M4_LEDGER_READBACK_FAILED');
  };
  return {
    // N7 calls these only under its ScriptLock.
    get:function(k){
      if(k!==key||!n11M4GrantCurrent_(deps,c))throw Error('M4_GRANT_NOT_CURRENT');
      const b=read();
      n11M4Backup_(deps,s,c);
      return b.attempt?b.attempt.record:undefined;
    },
    putIfAbsent:function(k,record){
      if(k!==key||!n11M4GrantCurrent_(deps,c)||read().state!=='READY')return false;
      n11M4Backup_(deps,s,c);
      persist({contract:'N11_M4_ATTEMPT_V1',scopeSha256:c.sha,state:'RESERVED',
        attempt:{key:k,record:record}});
      // Detect observed drift/expiry after reservation. This is still cooperative
      // readback, not an atomic condition on the subsequent provider write.
      const tab=deps.spreadsheetApp.openById(c.scope.target).getSheetByName(c.scope.tab);
      if(!tab)return false;
      const fresh=n7TestJournalSnapshot_(tab,s,c.u);
      return fresh.ok&&fresh.dataRows===c.scope.baselineRows&&
        fresh.digest===c.scope.baselineDigest&&n11M4GrantCurrent_(deps,c);
    },
    markVerified:function(k,record){
      const b=read();
      if(k!==key||!b.attempt||JSON.stringify(b.attempt.record)!==JSON.stringify(record))return false;
      if(b.state==='VERIFIED')return true;
      persist({contract:b.contract,scopeSha256:c.sha,state:'VERIFIED',attempt:b.attempt});
      return true;
    }
  };
}
function n11M4Execute_(intent,deps,s){
  if(!s||s.writesEnabled!==true)return n7TestDeny_('M4_WRITE_DISABLED');
  let c;
  try{
    c=n11M4Context_(deps,s);
    if(!n11M4GrantCurrent_(deps,c))return n7TestDeny_('M4_GRANT_NOT_CURRENT');
    const validated=n7TestValidate_(intent,s);
    if(!validated.ok)return validated;
  }catch(e){return n7TestDeny_('M4_SCOPE_OR_AUTHORITY_DENIED');}
  // Never auto-provision an empty ledger. N7 owns the physical mock append.
  return n7TestExecute_(intent,Object.assign({},deps,{attemptLedger:n11M4Ledger_(deps,s,c,intent)}),s);
}
function n11M4Reconcile_(intent,deps,s){
  // Historical scope is evidence, NOT an active grant. Reconcile stays read-only
  // even after expiry/revocation; no readGrant or store.setProperty call.
  if(!s||s.writesEnabled!==false)return n7TestDeny_('M4_READ_ONLY_REQUIRED');
  let c,lock,acquired=false;
  try{
    c=n11M4Context_(deps,s);
    if(!n7TestValidate_(intent,s).ok||n7TestDigest_(intent,c.u)!==c.scope.intentDigest||
      intent.expectedJournalRows!==c.scope.baselineRows)
      return n7TestDeny_('M4_RECONCILE_INTENT_MISMATCH');
    lock=deps.lockService.getScriptLock();
    if(!lock.tryLock(10000))return n7TestDeny_('LOCK_BUSY');
    acquired=true;
    const b=n11M4ReadEnvelope_(c.store,c.sha,c.u),eventId='N7_'+intent.idempotencyKey;
    if(!b.attempt||b.attempt.key!==c.scope.target+'|'+eventId)
      return n7TestUnknown_('M4_NO_ATTEMPT_EVIDENCE',null);
    const a=b.attempt.record;
    if(a.intentDigest!==c.scope.intentDigest||a.requestId!==intent.requestId||
      a.idempotencyKey!==intent.idempotencyKey)
      return n7TestUnknown_('M4_ATTEMPT_MISMATCH',null);
    const prefix=n11M4Backup_(deps,s,c);
    const tab=deps.spreadsheetApp.openById(c.scope.target).getSheetByName(c.scope.tab);
    if(!tab)return n7TestUnknown_('RECONCILE_REQUIRED',null);
    const snap=n7TestJournalSnapshot_(tab,s,c.u);
    if(!snap.ok)return n7TestUnknown_('RECONCILE_REQUIRED',null);
    const found=n9ClassifyUncertain_(snap.rows,eventId,a.intentDigest);
    const row=snap.rows.find(function(r){return r[0]===eventId;});
    if(!found.ok||!row||row[1]!==a.batch_id||snap.digest!==a.journalDigest||
      snap.rows.length!==c.scope.baselineRows+1||
      JSON.stringify(snap.rows.slice(0,-1))!==JSON.stringify(prefix.slice(1)))
      return n7TestUnknown_('RECONCILE_REQUIRED',null);
    const reconstructed=prefix.concat([row]);
    if(n8SnapshotDigest_(reconstructed,s,c.u)!==snap.digest)
      return n7TestUnknown_('M4_RECONSTRUCTION_MISMATCH',null);
    const final=n7TestJournalSnapshot_(tab,s,c.u);
    if(!final.ok||!n8CompareSnapshots_(snap,final).ok)
      return n7TestUnknown_('RECONCILE_REQUIRED',null);
    const decision=n9RollbackDecision_({ok:true},false,false);
    return Object.assign({},n7TestVerified_(intent,eventId,a.intentDigest,a,true),{
      ledgerState:b.state,backupPrefixMatches:true,ramReconstructionDigest:snap.digest,
      destructiveRestoreDenied:true,rollbackDisposition:decision.reason,
      rollbackExecuted:false,restores:0,ledgerWrites:0,atomicCasProven:false});
  }catch(e){return n7TestUnknown_('RECONCILE_REQUIRED',null);}
  finally{if(acquired)lock.releaseLock();}
}
