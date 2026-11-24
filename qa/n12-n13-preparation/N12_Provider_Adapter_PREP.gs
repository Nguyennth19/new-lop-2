/**
 * N12.1 preparation ONLY. Reviewable source, never deployed or provisioned.
 * Reuse N7 writer / M4 ledger + N8/N9 checks, no public handler, no grant issuance.
 * Production settings intentionally absent. Every provider call is allowlisted.
 */
const N12_PROVIDER_SETTINGS_ = null; // Must remain absent until separately reviewed disposable scope.
const N12_FORBIDDEN_IDS_ = Object.freeze([
 '1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs','1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8',
 '1zA7ab0tpcgn68BJd8bizNR8LfuFG57yzsm1YM-SEF9I','1iomsoeXTLEmpRjqzf5v6WiU1ea4CE5EbipTenfPSyw8',
 '1Q3X8sYSNdWmO2p88ZlaEnMneYtKO52sT06FhfHXjjuw','10fN1hTCJg1Ruwr0tHafi_rmkkeZAUw-5umiGhNcqrgwPx2rYu1fOZl3M'
]);
function n12Scope_(s){
 const id=/^[A-Za-z0-9_-]{20,120}$/,hex=/^[a-f0-9]{64}$/,grant=/^N12_GRANT_[A-Z0-9_]{3,55}$/;
 if(!s||typeof s.writesEnabled!=='boolean'||s.environment!=='N12_DISPOSABLE_SYNTHETIC_ONLY'||
  ![s.projectId,s.isolatedSpreadsheetId,s.backupId].every(v=>typeof v==='string'&&id.test(v)&&!N12_FORBIDDEN_IDS_.includes(v))||
  new Set([s.projectId,s.isolatedSpreadsheetId,s.backupId]).size!==3||
  !Array.isArray(s.forbiddenSheetIds)||!N12_FORBIDDEN_IDS_.every(v=>s.forbiddenSheetIds.includes(v))||
  [s.projectId,s.isolatedSpreadsheetId,s.backupId].some(v=>s.forbiddenSheetIds.includes(v))||
  typeof s.allowedOwnerEmail!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(s.allowedOwnerEmail)||
  typeof s.approvedGrantId!=='string'||!grant.test(s.approvedGrantId)||
  s.journalTab!=='15_NhatKy_HanhDong'||!['P2','P3','P4'].includes(s.proofCase)||
  ![s.approvedIntentDigest,s.approvedJournalSnapshotDigest].every(v=>typeof v==='string'&&hex.test(v))||
  !Number.isSafeInteger(s.approvedBaselineRows)||s.approvedBaselineRows<0||s.approvedBaselineRows>=150||
  typeof s.grantIssuedAt!=='string'||typeof s.grantExpiresAt!=='string')
  throw Error('N12_SCOPE_INVALID');
 const issued=Date.parse(s.grantIssuedAt),expires=Date.parse(s.grantExpiresAt);
 if(!Number.isFinite(issued)||!Number.isFinite(expires)||expires<=issued||expires-issued>900000)
  throw Error('N12_TTL_INVALID');
 return {contract:'N12_PROVIDER_SCOPE_V1',project:s.projectId,target:s.isolatedSpreadsheetId,backup:s.backupId,
  tab:s.journalTab,owner:s.allowedOwnerEmail,grantId:s.approvedGrantId,intentDigest:s.approvedIntentDigest,
  baselineDigest:s.approvedJournalSnapshotDigest,baselineRows:s.approvedBaselineRows,
  issuedAt:s.grantIssuedAt,expiresAt:s.grantExpiresAt,proofCase:s.proofCase};
}
function n12BoundSheets_(app,c){
 return {openById:function(id){
  if(id!==c.scope.target&&id!==c.scope.backup)throw Error('N12_TARGET_DENIED');
  const book=app.openById(id);
  if(book.getId()!==id)throw Error('N12_PROVIDER_ID_MISMATCH');
  return {getSheetByName:function(name){
   if(name!==c.scope.tab)throw Error('N12_TAB_DENIED');
   const tab=book.getSheetByName(name);
   if(!tab)return null;
   return {getLastRow:()=>tab.getLastRow(),getRange:function(row,col,count,cols){
    if(row!==1||col!==1||cols!==8||!Number.isSafeInteger(count)||count<1||count>151||tab.getLastColumn()!==8)
      throw Error('N12_RANGE_DENIED');
    const range=tab.getRange(row,col,count,cols);
    return {getDisplayValues:function(){
      const f=range.getFormulas(),v=range.getValues(),d=range.getDisplayValues();
      if(f.length!==count||v.length!==count||d.length!==count||
       !d.every((r,i)=>r.length===8&&f[i].length===8&&v[i].length===8&&
        r.every((x,j)=>typeof x==='string'&&f[i][j]===''&&typeof v[i][j]==='string'&&v[i][j]===x)))
        throw Error('N12_TEXT_OR_FORMULA_DRIFT');
      return d;
    }};
   },appendRow:function(row){
    if(id!==c.scope.target||c.scope.proofCase==='P4'||!Array.isArray(row)||row.length!==8||
       !row.every(v=>typeof v==='string'&&!/^[=+@-]/.test(v)))throw Error('N12_APPEND_DENIED');
    // Preformatted destination must preserve the exact display digest, especially ISO timestamp.
    const next=tab.getLastRow()+1;
    if(next>tab.getMaxRows()||!tab.getRange(next,1,1,8).getNumberFormats()[0].every(v=>v==='@'))
      throw Error('N12_DESTINATION_TEXT_FORMAT_REQUIRED');
    const result=tab.appendRow(row);
    if(c.scope.proofCase==='P3'){
      app.flush(); // Controlled loss AFTER actual provider append/flush; not a real outage.
      throw Error('N12_P3_INJECTED_ACK_LOSS');
    }
    return result;
   }};
  }};
 },flush:()=>app.flush()};
}
function n12Context_(raw,s){
 const scope=n12Scope_(s),u=raw.utilities,sha=n11M4ScopeDigest_(scope,u);
 if(s.approvedScopeSha256!==sha||raw.scriptApp.getScriptId()!==scope.project||
  raw.session.getEffectiveUser().getEmail()!==scope.owner)throw Error('N12_SCOPE_OR_ACTOR_DENIED');
 const props=raw.propertiesService.getScriptProperties();
 const attemptKey='N12_ATTEMPT_'+sha,grantKey='N12_GRANT_'+sha;
 const store={getProperty:function(k){
  if(k!==N11_M4_STORE_KEY_)throw Error('N12_PROPERTY_KEY_DENIED');
  const v=props.getProperty(attemptKey);
  if(v!==null&&(typeof v!=='string'||v.length>8192||!/^[\x20-\x7e]+$/.test(v)))throw Error('N12_PROPERTY_READ_DENIED');
  return v;
 },setProperty:function(k,v){
  if(k!==N11_M4_STORE_KEY_||s.writesEnabled!==true||typeof v!=='string'||v.length>8192||
    !/^[\x20-\x7e]+$/.test(v))throw Error('N12_PROPERTY_WRITE_DENIED');
  props.setProperty(attemptKey,v);
 }};
 const c={scope,sha,store,u};
 c.deps={utilities:u,session:raw.session,lockService:raw.lockService,now:raw.now,
  spreadsheetApp:n12BoundSheets_(raw.spreadsheetApp,c),attemptStore:store,
  readGrant:function(){
   const text=props.getProperty(grantKey);
   if(typeof text!=='string'||text.length>1024||!/^[\x20-\x7e]+$/.test(text))throw Error('N12_GRANT_PROPERTY_BOUNDS');
   const g=JSON.parse(text),now=raw.now();
   if(!n11M4Exact_(g,['scopeSha256','issuedAt','expiresAt','revoked'])||
    g.scopeSha256!==sha||g.issuedAt!==scope.issuedAt||g.expiresAt!==scope.expiresAt||
    g.revoked!==false||!Number.isFinite(now)||now<Date.parse(scope.issuedAt)||now>=Date.parse(scope.expiresAt))
      return {scopeSha256:sha,revoked:true};
   return {scopeSha256:sha,revoked:false};
  }};
 return c;
}
function n12Execute_(intent,raw,s){
 if(!s||s.writesEnabled!==true)return n7TestDeny_('N12_WRITE_DISABLED');
 let c;
 try{
  c=n12Context_(raw,s);
  const v=n7TestValidate_(intent,s);if(!v.ok)return v;
  if(!n11M4GrantCurrent_(c.deps,c))return n7TestDeny_('N12_GRANT_NOT_CURRENT');
 }catch(e){return n7TestDeny_('N12_SCOPE_OR_AUTHORITY_DENIED');}
 // P4 intentionally reserves then stops before append through the guarded sheet facade.
 // P3 deliberately throws after provider append+flush, only for the pinned P3 scope.
 return n7TestExecute_(intent,Object.assign({},c.deps,{attemptLedger:n11M4Ledger_(c.deps,s,c,intent)}),s);
}
function n12Reconcile_(intent,deps,s){
  // Historical scope is evidence, NOT an active grant. Reconcile stays read-only
  // even after expiry/revocation; no readGrant or store.setProperty call.
  if(!s||s.writesEnabled!==false)return n7TestDeny_('M4_READ_ONLY_REQUIRED');
  let c,lock,acquired=false;
  try{
    c=n12Context_(deps,s); deps=c.deps;
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

/** GAS bindings remain unreachable with the frozen null configuration. No doGet/doPost. */
function n12ProviderDeps_(){
 return {propertiesService:PropertiesService,scriptApp:ScriptApp,spreadsheetApp:SpreadsheetApp,
  session:Session,lockService:LockService,utilities:Utilities,now:()=>Date.now()};
}
function n12ProviderAppend_(intent){
 if(!N12_PROVIDER_SETTINGS_||N12_PROVIDER_SETTINGS_.writesEnabled!==true)return n7TestDeny_('N12_WRITE_DISABLED');
 return n12Execute_(intent,n12ProviderDeps_(),N12_PROVIDER_SETTINGS_);
}
function n12ProviderReconcile_(intent){
 if(!N12_PROVIDER_SETTINGS_||N12_PROVIDER_SETTINGS_.writesEnabled!==false)return n7TestDeny_('N12_READ_ONLY_SCOPE_MISSING');
 return n12Reconcile_(intent,n12ProviderDeps_(),N12_PROVIDER_SETTINGS_);
}
