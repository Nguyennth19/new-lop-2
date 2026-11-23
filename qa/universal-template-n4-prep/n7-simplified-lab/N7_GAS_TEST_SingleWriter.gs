/**
 * N7 LAB ONLY — isolated GAS TEST journal adapter. NOT deployed / NOT authorized.
 * Paste into a separately approved GAS TEST project only after Owner scope/grant.
 * One tab append only; Sheets/Drive atomicity, CAS and rollback belong to N8/N9.
 * No doGet/doPost; learner Apps Script and governed original Sheet remain untouched.
 */
const N7_TEST_SETTINGS_ = Object.freeze({
  writesEnabled: false,                // compile-time hard deny until reviewed change
  isolatedSpreadsheetId: '',           // new copy ID, NEVER original TEST or learner Sheet
  allowedOwnerEmail: '',                // Owner-operated manual allowlist
  approvedGrantId: '',                  // separately issued for a particular TEST copy
  forbiddenSheetIds: [
    '1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs',
    '1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8'
  ],
  journalTab: '15_NhatKy_HanhDong'
});
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
  return {ok:false,reason:reason,writes:0,release:false};
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
      !id.test(i.requestId)||!id.test(i.idempotencyKey)||!id.test(i.executionId)||
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
function n7TestExecute_(intent,deps,settings) {
  const valid=n7TestValidate_(intent,settings);
  if (!valid.ok)return valid;
  if (!settings.writesEnabled)return n7TestDeny_('WRITE_DISABLED_IN_SOURCE');
  const email=deps.session.getEffectiveUser().getEmail();
  if (!settings.allowedOwnerEmail||email!==settings.allowedOwnerEmail) {
    return n7TestDeny_('OWNER_IDENTITY_DENIED');
  }
  const lock=deps.lockService.getScriptLock();
  if (!lock.tryLock(10000))return n7TestDeny_('LOCK_BUSY');
  try {
    const wb=deps.spreadsheetApp.openById(settings.isolatedSpreadsheetId);
    const tab=wb.getSheetByName(settings.journalTab);
    if (!tab)return n7TestDeny_('JOURNAL_TAB_MISSING');
    const head=tab.getRange(1,1,1,N7_TEST_HEADERS_.length).getValues()[0];
    if (head.join('|')!==N7_TEST_HEADERS_.join('|'))return n7TestDeny_('HEADER_DRIFT');
    const eventId='N7_'+intent.idempotencyKey;
    const digest=n7TestDigest_(intent,deps.utilities);
    const last=tab.getLastRow();
    const rows=last>1?tab.getRange(2,1,last-1,8).getValues():[];
    const duplicates=rows.filter(function(row){return row[0]===eventId;});
    if (duplicates.length>1)return n7TestDeny_('DUPLICATE_JOURNAL_EVENTS');
    if (duplicates.length===1) {
      if (duplicates[0][6]!==digest)return n7TestDeny_('IDEMPOTENCY_CONFLICT');
      return {ok:true,duplicate:true,writes:0,release:false,eventId:eventId};
    }
    if (last-1!==intent.expectedJournalRows)return n7TestDeny_('STALE_JOURNAL_READ');
    const stamp=deps.utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh',"yyyy-MM-dd'T'HH:mm:ssXXX");
    try {
      tab.appendRow([eventId,intent.requestId,email,'N7_TEST_METADATA_ONLY',
        'PREPARED','PROJECTED_PENDING',digest,stamp]);
    }catch(e) {
      return n7TestDeny_('RECONCILE_REQUIRED');
    }
    // A timeout after append may have committed. NEVER retry automatically.
    try {
      const after=tab.getLastRow();
      const check=tab.getRange(2,1,after-1,8).getValues().filter(function(row){return row[0]===eventId;});
      if (check.length!==1||check[0][6]!==digest)return n7TestDeny_('RECONCILE_REQUIRED');
    }catch(e){return n7TestDeny_('RECONCILE_REQUIRED');}
    return {ok:true,eventId:eventId,writes:1,release:false,
      note:'N7_SINGLE_TAB_READBACK_ONLY_NOT_ATOMIC_CAS'};
  }finally{lock.releaseLock();}
}
/** Editor-only call. Default is permanently disabled until separate Owner TEST grant. */
function n7TestAppendJournal_(intent) {
  return n7TestExecute_(intent,{
    spreadsheetApp:SpreadsheetApp,lockService:LockService,
    session:Session,utilities:Utilities
  },N7_TEST_SETTINGS_);
}
/** Read-only safe check, without opening any spreadsheet. */
function n7TestStatus_() {
  return {writesEnabled:N7_TEST_SETTINGS_.writesEnabled,
    isolatedCopyConfigured:!!N7_TEST_SETTINGS_.isolatedSpreadsheetId,
    grantConfigured:!!N7_TEST_SETTINGS_.approvedGrantId,
    releaseAllowed:false};
}
