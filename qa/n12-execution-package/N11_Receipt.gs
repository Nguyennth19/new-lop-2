/** N12 scoped extraction; upstream bfbe61b08da5d2f867835737f169287fcf0f1077. No historical entrypoints. */
const N11_M4_STORE_KEY_='N11_M4_SYNTHETIC_ATTEMPT_V1';

function n11M4Exact_(v,keys){
  return !!v&&Object.prototype.toString.call(v)==='[object Object]'&&
    Object.keys(v).sort().join('|')===keys.slice().sort().join('|');
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
