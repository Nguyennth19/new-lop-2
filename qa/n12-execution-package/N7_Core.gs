/** N12 scoped extraction; upstream 129dc79193b4d057c4ccf97730e8420b629f306a. No historical entrypoints. */
const N7_TEST_HEADERS_ = Object.freeze([
  'event_id','batch_id','actor_ref','action','previous_state',
  'next_state','evidence_sha256','occurred_at'
]);

const N7_TEST_DIGEST_FIELDS_ = Object.freeze([
  'contract','environment','requestId','idempotencyKey','executionId',
  'lessonId','candidateSha256','sourceReceiptSha256','sourceRevision',
  'targetSpreadsheetId','action','tab','rowsDigest','grantId','expectedJournalRows'
]);

function n7TestDeny_(reason) {
  return {ok:false,reason:reason,commitState:'NOT_ATTEMPTED',writes:0,release:false};
}

function n7TestUnknown_(reason,receipt) {
  return {ok:false,reason:reason,commitState:'COMMIT_UNKNOWN',writes:null,
    retryAllowed:false,release:false,receipt:receipt||null};
}

function n7TestReceipt_(intent,eventId,digest,record) {
  return {contract:'N11_M1_M2_RECEIPT_V1',requestId:intent.requestId,
    idempotencyKey:intent.idempotencyKey,executionId:intent.executionId,
    batch_id:record?record.batch_id:null,eventId:eventId,intentDigest:digest,
    journalDigest:record?record.journalDigest:null};
}

function n7TestVerified_(intent,eventId,digest,record,duplicate) {
  return {ok:true,eventId:eventId,duplicate:duplicate,
    commitState:'COMMITTED_VERIFIED',writes:duplicate?0:1,release:false,
    receipt:n7TestReceipt_(intent,eventId,digest,record),
    note:'N7_SINGLE_TAB_READBACK_ONLY_NOT_ATOMIC_CAS'};
}

function n7TestValidate_(i,settings) {
  if (!i || Object.prototype.toString.call(i)!=='[object Object]' ||
      Object.keys(i).sort().join('|')!==N7_TEST_DIGEST_FIELDS_.slice().sort().join('|')) {
    return n7TestDeny_('INTENT_SCHEMA');
  }
  const id=/^[A-Z0-9_]{6,70}$/;
  const hex=/^[a-f0-9]{64}$/;
  if (i.contract!=='N7_GAS_TEST_INTENT_V1'||i.environment!=='TEST'||
      i.action!=='APPEND_TEST_METADATA'||i.tab!==settings.journalTab||
      ![i.requestId,i.idempotencyKey,i.executionId].every(function(v){
        return typeof v==='string'&&id.test(v);
      })||
      !/^LAB_MATH_[A-Z0-9_]+$/.test(i.lessonId)||
      !hex.test(i.candidateSha256)||!hex.test(i.sourceReceiptSha256)||
      !hex.test(i.rowsDigest)||!/^REV_[A-Z0-9_]{3,32}$/.test(i.sourceRevision)||
      !Number.isSafeInteger(i.expectedJournalRows)||i.expectedJournalRows<0||
      i.expectedJournalRows>150||!id.test(i.grantId)) {
    return n7TestDeny_('INTENT_POLICY');
  }
  if (!settings.isolatedSpreadsheetId||
      i.targetSpreadsheetId!==settings.isolatedSpreadsheetId||
      settings.forbiddenSheetIds.includes(i.targetSpreadsheetId)) {
    return n7TestDeny_('ISOLATED_TEST_COPY_REQUIRED');
  }
  if (!settings.approvedGrantId||i.grantId!==settings.approvedGrantId) {
    return n7TestDeny_('OWNER_GRANT_MISSING');
  }
  return {ok:true,writes:0,release:false};
}

function n7TestSha256_(s,utilities) {
  return utilities.computeDigest(utilities.DigestAlgorithm.SHA_256,s)
    .map(function(b){return ('0'+(b&255).toString(16)).slice(-2);}).join('');
}

function n7TestDigest_(i,utilities) {
  // One fixed ordering, no private answer payload, same key excludes execution ID.
  return n7TestSha256_(JSON.stringify(N7_TEST_DIGEST_FIELDS_
    .filter(function(k){return k!=='executionId' && k!=='expectedJournalRows';})
    .map(function(k){return [k,i[k]];})),utilities);
}

function n7TestJournalSnapshot_(tab,settings,utilities) {
  const last=tab.getLastRow();
  if(last<1||last>151)return n7TestDeny_('JOURNAL_BOUNDS');
  const cells=tab.getRange(1,1,last,8).getDisplayValues();
  if(tab.getLastRow()!==last||cells.length!==last)return n7TestDeny_('SNAPSHOT_MOVED');
  if(cells[0].join('|')!==N7_TEST_HEADERS_.join('|'))return n7TestDeny_('HEADER_DRIFT');
  if(!cells.every(function(row){return row.length===8&&
      row.every(function(value){return typeof value==='string';});}))
    return n7TestDeny_('MALFORMED_ROWS');
  const events=cells.slice(1),unique=new Set();
  for(const row of events){
    if(!row[0])return n7TestDeny_('BLANK_EVENT_ID');
    if(unique.has(row[0]))return n7TestDeny_('DUPLICATE_EVENT_IDS');
    unique.add(row[0]);
  }
  return {ok:true,dataRows:events.length,rows:events,
    digest:n7TestSnapshotDigest_(events,settings,utilities)};
}

function n7TestSnapshotDigest_(rows,settings,utilities) {
  return n7TestSha256_(JSON.stringify({
    schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',sheet:settings.isolatedSpreadsheetId,
    tab:settings.journalTab,columns:N7_TEST_HEADERS_,rows:rows
  }),utilities);
}

function n7TestExecute_(intent,deps,settings) {
  const valid=n7TestValidate_(intent,settings);
  if (!valid.ok)return valid;
  if (!settings.writesEnabled)return n7TestDeny_('WRITE_DISABLED_IN_SOURCE');
  const email=deps.session.getEffectiveUser().getEmail();
  if (!settings.allowedOwnerEmail||email!==settings.allowedOwnerEmail) {
    return n7TestDeny_('OWNER_IDENTITY_DENIED');
  }
  // A grant is valid for exactly one pre-reviewed payload and baseline. A typed
  // APPROVED sheet cell or knowledge of a grant ID never creates authority.
  const digest=n7TestDigest_(intent,deps.utilities);
  const expiry=Date.parse(settings.grantExpiresAt||'');
  const now=deps.now();
  if (!/^[a-f0-9]{64}$/.test(settings.approvedJournalSnapshotDigest||'')||
      !/^[a-f0-9]{64}$/.test(settings.approvedIntentDigest||'')||
      settings.approvedIntentDigest!==digest||
      !Number.isFinite(expiry)||!Number.isFinite(now)||now>=expiry||
      expiry-now>15*60*1000||
      !Number.isSafeInteger(settings.approvedBaselineRows)||
      settings.approvedBaselineRows<0||
      intent.expectedJournalRows!==settings.approvedBaselineRows) {
    return n7TestDeny_('GRANT_SCOPE_OR_EXPIRY_DENIED');
  }
  // LAB contract: an injected write-once attempt ledger is required. The GAS
  // entrypoint deliberately has no ledger wiring; M4 must prove durable authority
  // across executions before a real write can ever be considered.
  const ledger=deps.attemptLedger;
  if(!ledger||typeof ledger.get!=='function'||typeof ledger.putIfAbsent!=='function')
    return n7TestDeny_('ATTEMPT_LEDGER_UNAVAILABLE');
  const lock=deps.lockService.getScriptLock();
  if (!lock.tryLock(10000))return n7TestDeny_('LOCK_BUSY');
  const eventId='N7_'+intent.idempotencyKey;
  const key=settings.isolatedSpreadsheetId+'|'+eventId;
  let record=null,attempted=false;
  const unknown=function(reason){
    return n7TestUnknown_(reason,n7TestReceipt_(intent,eventId,digest,null));
  };
  try {
    try {record=ledger.get(key);}catch(e){return unknown('RECONCILE_REQUIRED');}
    if(record && (record.intentDigest!==digest||record.requestId!==intent.requestId||
        record.idempotencyKey!==intent.idempotencyKey))
      return n7TestDeny_('IDEMPOTENCY_CONFLICT');
    attempted=!!record;
    const wb=deps.spreadsheetApp.openById(settings.isolatedSpreadsheetId);
    const tab=wb.getSheetByName(settings.journalTab);
    if (!tab)return attempted?unknown('RECONCILE_REQUIRED'):n7TestDeny_('JOURNAL_TAB_MISSING');
    // Cooperative lock, not external CAS. Use one snapshot for both data and digest.
    const snapshot=n7TestJournalSnapshot_(tab,settings,deps.utilities);
    if(!snapshot.ok)return attempted?unknown('RECONCILE_REQUIRED'):snapshot;
    const duplicates=snapshot.rows.filter(function(row){return row[0]===eventId;});
    if(duplicates.length===1 && duplicates[0][6]!==digest)
      return attempted?unknown('RECONCILE_REQUIRED'):n7TestDeny_('IDEMPOTENCY_CONFLICT');
    if(attempted) {
      // A missing row is NOT proof of noncommit. Never append again under this key.
      // Verify the entire expected post-append snapshot and original batch identity.
      if(duplicates.length!==1||!record.batch_id||duplicates[0][1]!==record.batch_id||
         snapshot.digest!==record.journalDigest)
        return unknown('RECONCILE_REQUIRED');
      if(typeof ledger.markVerified==='function'&&ledger.markVerified(key,record)!==true)
        return unknown('RECONCILE_REQUIRED');
      return n7TestVerified_(intent,eventId,digest,record,true);
    }
    // Legacy/untracked event: preserve the row; never invent a historical receipt.
    if(duplicates.length===1)return unknown('LEGACY_RECEIPT_RECONCILE_REQUIRED');
    if(snapshot.digest!==settings.approvedJournalSnapshotDigest)
      return n7TestDeny_('N8_SNAPSHOT_CONFLICT_RECONCILE_REQUIRED');
    if(snapshot.dataRows!==settings.approvedBaselineRows||
       snapshot.dataRows!==intent.expectedJournalRows)return n7TestDeny_('STALE_JOURNAL_READ');
    const stamp=deps.utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh',"yyyy-MM-dd'T'HH:mm:ssXXX");
    const row=[eventId,intent.executionId,email,'N7_TEST_METADATA_ONLY',
      'PREPARED','PROJECTED_PENDING',digest,stamp];
    record={requestId:intent.requestId,idempotencyKey:intent.idempotencyKey,
      batch_id:intent.executionId,intentDigest:digest,
      journalDigest:n7TestSnapshotDigest_(snapshot.rows.concat([row]),settings,deps.utilities)};
    // Record the attempt BEFORE append. Never clear on exception or absent readback.
    // A future durable ledger must preserve the same write-once semantics; no Drive
    // or Sheet ledger writes are wired in this LAB patch.
    attempted=true;
    if(ledger.putIfAbsent(key,record)!==true)return unknown('RECONCILE_REQUIRED');
    tab.appendRow(row);
    deps.spreadsheetApp.flush();
    const after=n7TestJournalSnapshot_(tab,settings,deps.utilities);
    if(!after.ok||after.digest!==record.journalDigest)
      return unknown('RECONCILE_REQUIRED');
    if(typeof ledger.markVerified==='function'&&ledger.markVerified(key,record)!==true)
      return unknown('RECONCILE_REQUIRED');
    return n7TestVerified_(intent,eventId,digest,record,false);
  }catch(e){
    return attempted?unknown('RECONCILE_REQUIRED'):n7TestDeny_('PREWRITE_READ_FAILED');
  }finally{lock.releaseLock();}
}
