/**
 * N9 LAB recovery inspection: two existing Sheets, READ ONLY.
 * Never restores, overwrites, appends, activates or releases.
 * The PREWRITE backup legitimately excludes the accepted N7 event;
 * restoring it over the live sheet would destroy evidence.
 */
const N9_PREWRITE_BACKUP_ID_='1iomsoeXTLEmpRjqzf5v6WiU1ea4CE5EbipTenfPSyw8';
const N9_ACCEPTED_EVENT_ID_='N7_LAB_N7_KEY_001';
const N9_ACCEPTED_EVENT_SHA_='b1e999e4afaedd5d566940bbb3e9e74e75e7cdcd3ea30e7a37915352fc03d40b';
const N9_ACCEPTED_SNAPSHOT_SHA_='b2c3b85fcf882fb5f8d84f4da89f8eb889fe8fdefce1757900eb48be85cbc6d8';
function n9Deny_(reason){
  return {ok:false,reason:reason,writes:0,restores:0,release:false};
}
function n9ReadJournal_(app,id,tabName){
  const sheet=app.openById(id).getSheetByName(tabName);
  if(!sheet)return n9Deny_('JOURNAL_TAB_MISSING');
  const before=sheet.getLastRow();
  if(before<1||before>151)return n9Deny_('JOURNAL_BOUNDS');
  const rows=sheet.getRange(1,1,before,8).getDisplayValues();
  if(sheet.getLastRow()!==before||rows.length!==before)
    return n9Deny_('SNAPSHOT_MOVED');
  if(!rows.every(function(r){return r.length===8&&r.every(function(v){return typeof v==='string';});}))
    return n9Deny_('MALFORMED_ROWS');
  if(rows[0].join('|')!==N7_TEST_HEADERS_.join('|'))
    return n9Deny_('HEADER_DRIFT');
  const seen={};
  for(const row of rows.slice(1)){
    if(!row[0])return n9Deny_('BLANK_EVENT_ID');
    if(seen[row[0]])return n9Deny_('DUPLICATE_EVENT_IDS');
    seen[row[0]]=true;
  }
  return {ok:true,rows:rows};
}
function n9AssessRecovery_(live,backup,settings,utilities){
  if(!live||!backup||!live.ok||!backup.ok)return n9Deny_('INVALID_SOURCE');
  const a=live.rows,b=backup.rows;
  if(a.length!==4||b.length!==3)
    return n9Deny_('UNEXPECTED_ROW_COUNT_RECONCILE_REQUIRED');
  for(let row=0;row<b.length;row++){
    if(JSON.stringify(a[row])!==JSON.stringify(b[row]))
      return n9Deny_('BACKUP_PREFIX_MISMATCH_RECONCILE_REQUIRED');
  }
  const eventRows=a.slice(1).filter(function(r){return r[0]===N9_ACCEPTED_EVENT_ID_;});
  if(eventRows.length!==1||a[3][0]!==N9_ACCEPTED_EVENT_ID_)
    return n9Deny_('N7_EVENT_INTEGRITY_RECONCILE_REQUIRED');
  if(eventRows[0][6]!==N9_ACCEPTED_EVENT_SHA_||
     eventRows[0][4]!=='PREPARED'||eventRows[0][5]!=='PROJECTED_PENDING'||
     eventRows[0][3]!=='N7_TEST_METADATA_ONLY')
    return n9Deny_('N7_EVENT_INTEGRITY_RECONCILE_REQUIRED');
  const digest=n8SnapshotDigest_(a,settings,utilities);
  if(digest!==N9_ACCEPTED_SNAPSHOT_SHA_)
    return n9Deny_('N9_LIVE_SNAPSHOT_DRIFT_RECONCILE_REQUIRED');
  return {ok:true,mode:'N9_READ_ONLY_RECONCILIATION',
    liveDataRows:3,backupDataRows:2,n7EventCount:1,
    journalDigest:digest,backupPrefixMatches:true,
    disposition:'PRESERVE_N7_EVENT_NO_DESTRUCTIVE_RESTORE',
    writes:0,restores:0,release:false};
}
/** Pure recovery decision tree: simulation only, never retries or repairs. */
function n9ClassifyUncertain_(rows,eventId,expectedSha){
  if(!Array.isArray(rows)||!eventId||!expectedSha)return n9Deny_('INVALID_INPUT');
  const matched=rows.filter(function(row){return row[0]===eventId;});
  if(matched.length>1)return n9Deny_('DUPLICATE_EVENT_IDS');
  if(matched.length===1){
    if(matched[0][6]!==expectedSha)return n9Deny_('IDEMPOTENCY_CONFLICT');
    return {ok:true,disposition:'ALREADY_PRESENT_NO_RETRY',
      writes:0,restores:0,release:false};
  }
  return n9Deny_('ABSENT_REQUIRES_NEW_OWNER_GRANT_NO_AUTO_RETRY');
}
function n9RollbackDecision_(assessment,ownerApproval,qaApproval){
  if(!assessment||!assessment.ok)return n9Deny_('RECONCILE_BEFORE_ROLLBACK');
  if(!ownerApproval||!qaApproval)return n9Deny_('OWNER_AND_QA_APPROVAL_REQUIRED');
  return {ok:true,disposition:'PLAN_COMPENSATING_EVENT_ONLY',
    writes:0,restores:0,release:false,executed:false};
}
function n9RecoveryDrill_(deps,settings,backupId){
  if(settings.writesEnabled||settings.approvedGrantId||
     settings.approvedIntentDigest||settings.approvedJournalSnapshotDigest||
     !settings.isolatedSpreadsheetId||
     settings.forbiddenSheetIds.includes(settings.isolatedSpreadsheetId)||
     !backupId||backupId===settings.isolatedSpreadsheetId||
     settings.forbiddenSheetIds.includes(backupId))
    return n9Deny_('READ_ONLY_GUARD');
  const before=n8ReadSnapshot_(deps,settings);
  if(!before.ok)return before;
  const live=n9ReadJournal_(deps.spreadsheetApp,
    settings.isolatedSpreadsheetId,settings.journalTab);
  if(!live.ok)return live;
  const backup=n9ReadJournal_(deps.spreadsheetApp,backupId,settings.journalTab);
  if(!backup.ok)return backup;
  const result=n9AssessRecovery_(live,backup,settings,deps.utilities);
  if(!result.ok)return result;
  const uncertain=n9ClassifyUncertain_(live.rows.slice(1),
    N9_ACCEPTED_EVENT_ID_,N9_ACCEPTED_EVENT_SHA_);
  if(!uncertain.ok)return uncertain;
  const withoutGrant=n9RollbackDecision_(result,false,false);
  if(withoutGrant.reason!=='OWNER_AND_QA_APPROVAL_REQUIRED')
    return n9Deny_('ROLLBACK_POLICY_BYPASS');
  const finalRead=n8ReadSnapshot_(deps,settings);
  if(!finalRead.ok||before.digest!==finalRead.digest||
     before.digest!==result.journalDigest)
    return n9Deny_('LIVE_CHANGED_DURING_INSPECTION');
  return Object.assign({},result,{
    uncertaintyDisposition:uncertain.disposition,
    rollbackWithoutApprovalsDenied:true,
    unchangedAfterDrill:true,
    qaSigned:false,rollbackExecuted:false,
    note:'READ_ONLY_RECONCILIATION_NOT_RESTORE_ACCEPTANCE'});
}
function N9_KiemTraPhucHoiChiDoc(){
  const result=n9RecoveryDrill_({
    spreadsheetApp:SpreadsheetApp,utilities:Utilities
  },N7_TEST_SETTINGS_,N9_PREWRITE_BACKUP_ID_);
  console.log(JSON.stringify(result,null,2));
}

/**
 * Controlled restore drill: recreate the already-accepted journal in RAM.
 * Backup prefix + validated append-only suffix; NEVER remove N7 evidence.
 * Rollback decision remains human-gated, not executed by this file.
 */
function n9SimulateNonDestructiveRestore_(live,backup,settings,utilities){
  const accepted=n9AssessRecovery_(live,backup,settings,utilities);
  if(!accepted.ok)return accepted;
  const prefix=backup.rows.map(function(row){return row.slice();});
  const suffix=live.rows.slice(prefix.length).map(function(row){return row.slice();});
  if(suffix.length!==1||suffix[0][0]!==N9_ACCEPTED_EVENT_ID_||
     suffix[0][6]!==N9_ACCEPTED_EVENT_SHA_)
    return n9Deny_('RESTORE_SUFFIX_NOT_APPROVED');
  const reconstructed=prefix.concat(suffix);
  const reconstructedDigest=n8SnapshotDigest_(reconstructed,settings,utilities);
  if(reconstructedDigest!==accepted.journalDigest||
     JSON.stringify(reconstructed)!==JSON.stringify(live.rows))
    return n9Deny_('RESTORE_REPLAY_MISMATCH');
  // Demonstrate that raw prewrite backup cannot replace the accepted journal.
  const destructiveDigest=n8SnapshotDigest_(prefix,settings,utilities);
  if(destructiveDigest===accepted.journalDigest)
    return n9Deny_('DESTRUCTIVE_RESTORE_NOT_DETECTED');
  const noOwner=n9RollbackDecision_(accepted,false,true);
  const noQA=n9RollbackDecision_(accepted,true,false);
  if(noOwner.reason!=='OWNER_AND_QA_APPROVAL_REQUIRED'||
     noQA.reason!=='OWNER_AND_QA_APPROVAL_REQUIRED')
    return n9Deny_('ROLLBACK_APPROVAL_BYPASS');
  return {ok:true,mode:'N9_RAM_RESTORE_REPLAY_ONLY',
    backupDataRows:prefix.length-1,replayedAcceptedEvents:suffix.length,
    reconstructedDataRows:reconstructed.length-1,
    reconstructedDigest:reconstructedDigest,
    matchesLive:true,destructiveRestoreDenied:true,
    independentApprovalsRequired:true,writes:0,restores:0,
    release:false,qaSigned:false,rollbackExecuted:false};
}
function n9ControlledRestoreDrill_(deps,settings,backupId){
  if(settings.writesEnabled||settings.approvedGrantId||
     settings.approvedIntentDigest||settings.approvedJournalSnapshotDigest||
     settings.grantExpiresAt||settings.approvedBaselineRows>=0||
     !settings.isolatedSpreadsheetId||
     settings.forbiddenSheetIds.includes(settings.isolatedSpreadsheetId)||
     !backupId||backupId===settings.isolatedSpreadsheetId||
     settings.forbiddenSheetIds.includes(backupId))
    return n9Deny_('READ_ONLY_GUARD');
  const before=n8ReadSnapshot_(deps,settings);
  if(!before.ok)return before;
  const live=n9ReadJournal_(deps.spreadsheetApp,
    settings.isolatedSpreadsheetId,settings.journalTab);
  if(!live.ok)return live;
  const backup=n9ReadJournal_(deps.spreadsheetApp,backupId,settings.journalTab);
  if(!backup.ok)return backup;
  const result=n9SimulateNonDestructiveRestore_(live,backup,settings,deps.utilities);
  if(!result.ok)return result;
  const after=n8ReadSnapshot_(deps,settings);
  if(!after.ok||before.digest!==after.digest||
     before.digest!==result.reconstructedDigest)
    return n9Deny_('LIVE_CHANGED_DURING_RESTORE_DRILL');
  return Object.assign({},result,{liveUnchanged:true,
    note:'DRY_RUN_ONLY_NO_PROVIDER_RESTORE_OR_QA_SIGNATURE'});
}
/** Safe Owner entrypoint: two real Sheets read, all restore changes RAM only. */
function N9_DienTapKhoiPhucKhongGhi(){
  const result=n9ControlledRestoreDrill_({
    spreadsheetApp:SpreadsheetApp,utilities:Utilities
  },N7_TEST_SETTINGS_,N9_PREWRITE_BACKUP_ID_);
  console.log(JSON.stringify(result,null,2));
}
