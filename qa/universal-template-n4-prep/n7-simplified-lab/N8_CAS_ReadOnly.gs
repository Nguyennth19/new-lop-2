/**
 * N8 read-only snapshot/compare for isolated GAS TEST.
 * No write, no deployment, no grant. This is drift detection, NOT atomic CAS.
 * Canonical representation: displayed A:H strings with row count and headers.
 */
function n8Deny_(reason) {
  return {ok:false,reason:reason,writes:0,release:false};
}
function n8ReadSnapshot_(deps,config) {
  if (config.writesEnabled || config.approvedGrantId ||
      !config.isolatedSpreadsheetId ||
      config.forbiddenSheetIds.includes(config.isolatedSpreadsheetId)) {
    return n8Deny_('READ_ONLY_GUARD');
  }
  const wb=deps.spreadsheetApp.openById(config.isolatedSpreadsheetId);
  const tab=wb.getSheetByName(config.journalTab);
  if (!tab)return n8Deny_('JOURNAL_TAB_MISSING');
  const before=tab.getLastRow();
  if (before<1||before>151)return n8Deny_('JOURNAL_BOUNDS');
  const cells=tab.getRange(1,1,before,8).getDisplayValues();
  const after=tab.getLastRow();
  if (before!==after||cells.length!==before)return n8Deny_('SNAPSHOT_MOVED');
  const header=cells[0];
  if (header.join('|')!==N7_TEST_HEADERS_.join('|'))return n8Deny_('HEADER_DRIFT');
  if (!cells.every(function(row){return row.length===8 && row.every(function(v){return typeof v==='string';});}))
    return n8Deny_('MALFORMED_ROWS');
  const events=cells.slice(1);
  const countById={};
  for (const row of events){
    if (!row[0])return n8Deny_('BLANK_EVENT_ID');
    countById[row[0]]=(countById[row[0]]||0)+1;
  }
  const duplicates=Object.keys(countById).filter(function(k){return countById[k]>1;});
  if (duplicates.length)return n8Deny_('DUPLICATE_EVENT_IDS');
  const digest=n7TestSha256_(JSON.stringify({
    schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',
    sheet:config.isolatedSpreadsheetId,tab:config.journalTab,
    columns:header,rows:events
  }),deps.utilities);
  return {ok:true,scope:'DISPLAY_SNAPSHOT_ONLY',dataRows:events.length,
    digest:digest,writes:0,release:false,
    observedEventId:'N7_LAB_N7_KEY_001',
    observedEventCount:countById['N7_LAB_N7_KEY_001']||0,
    observedEventDigest:events.filter(function(r){return r[0]==='N7_LAB_N7_KEY_001';})
      .map(function(r){return r[6];})[0]||null};
}
function n8CompareSnapshots_(expected,current){
  if (!expected||!current||!expected.ok||!current.ok)return n8Deny_('INVALID_SNAPSHOT');
  if (expected.digest!==current.digest||expected.dataRows!==current.dataRows)
    return n8Deny_('JOURNAL_DRIFT_RECONCILE_REQUIRED');
  return {ok:true,unchanged:true,writes:0,release:false,
    note:'READ_ONLY_COMPARE_NOT_REMOTE_ATOMIC_CAS'};
}
/** Run this in isolated GAS project only when N7 write/grant remain OFF. */
function N8_KiemTraCASChiDoc(){
  const before=n8ReadSnapshot_({
    spreadsheetApp:SpreadsheetApp,utilities:Utilities
  },N7_TEST_SETTINGS_);
  if (!before.ok){console.log(JSON.stringify(before));return;}
  const after=n8ReadSnapshot_({
    spreadsheetApp:SpreadsheetApp,utilities:Utilities
  },N7_TEST_SETTINGS_);
  const comparison=n8CompareSnapshots_(before,after);
  console.log(JSON.stringify({before:before,after:after,comparison:comparison},null,2));
}

/**
 * N8 controlled drill: classify a hypothetical retry from a live snapshot.
 * No append, mutation, grant, doPost or real CAS. Test mutations stay in RAM.
 */
function n8ClassifyRetry_(rows,eventId,expectedSha){
  const matches=rows.filter(function(row){return row[0]===eventId;});
  if(matches.length>1)return n8Deny_('DUPLICATE_EVENT_IDS');
  if(matches.length===0)return n8Deny_('UNKNOWN_EVENT_NO_WRITE');
  if(matches[0][6]!==expectedSha)return n8Deny_('IDEMPOTENCY_CONFLICT');
  return {ok:true,idempotent:true,writes:0,release:false,
    note:'EXISTING_EVENT_ONLY_NOT_NEW_WRITE_AUTHORIZATION'};
}
function n8SnapshotDigest_(rows,settings,utilities){
  return n7TestSha256_(JSON.stringify({
    schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',
    sheet:settings.isolatedSpreadsheetId,tab:settings.journalTab,
    columns:rows[0],rows:rows.slice(1)
  }),utilities);
}
/** Real read + local-only simulated conflict cases. Never touches Sheet values. */
function n8ControlledDrill_(deps,settings){
  const before=n8ReadSnapshot_(deps,settings);
  if(!before.ok)return before;
  const sheet=deps.spreadsheetApp.openById(settings.isolatedSpreadsheetId)
    .getSheetByName(settings.journalTab);
  if(!sheet)return n8Deny_('JOURNAL_TAB_MISSING');
  const last=sheet.getLastRow();
  if(last!==before.dataRows+1)return n8Deny_('JOURNAL_DRIFT_RECONCILE_REQUIRED');
  const live=sheet.getRange(1,1,last,8).getDisplayValues();
  if(live.length!==last||sheet.getLastRow()!==last||
     n8SnapshotDigest_(live,settings,deps.utilities)!==before.digest){
    return n8Deny_('JOURNAL_DRIFT_RECONCILE_REQUIRED');
  }
  const eventId='N7_LAB_N7_KEY_001';
  const expectedSha='b1e999e4afaedd5d566940bbb3e9e74e75e7cdcd3ea30e7a37915352fc03d40b';
  const existing=n8ClassifyRetry_(live.slice(1),eventId,expectedSha);
  if(!existing.ok)return existing;
  // Synthetic deviations exist solely in memory, never on the connected Sheet.
  const changedPayload=n8ClassifyRetry_(live.slice(1),eventId,'f'.repeat(64));
  const otherWriter=live.map(function(row){return row.slice();});
  const ix=otherWriter.findIndex(function(row){return row[0]===eventId;});
  if(ix<=0)return n8Deny_('EVENT_NOT_FOUND');
  otherWriter[ix][5]='SIMULATED_CONFLICT_RAM_ONLY';
  const hypothetical={ok:true,digest:n8SnapshotDigest_(otherWriter,settings,deps.utilities),
    dataRows:otherWriter.length-1};
  const drift=n8CompareSnapshots_(before,hypothetical);
  const staleBaseline=before.dataRows!==2;
  const after=n8ReadSnapshot_(deps,settings);
  const unchanged=n8CompareSnapshots_(before,after);
  if(changedPayload.reason!=='IDEMPOTENCY_CONFLICT'||
     drift.reason!=='JOURNAL_DRIFT_RECONCILE_REQUIRED'||
     !staleBaseline||!unchanged.ok)return n8Deny_('DRILL_CHECK_FAILED');
  return {ok:true,mode:'READ_ONLY_AND_RAM_SIMULATION',
    idempotentReplay:existing.idempotent===true,
    alteredPayloadDenied:true,simulatedEditDriftDetected:true,
    stalePreN7BaselineDenied:true,liveSnapshotUnchanged:unchanged.unchanged===true,
    dataRows:after.dataRows,observedEventCount:after.observedEventCount,
    snapshotDigest:after.digest,writes:0,release:false,
    atomicCasProven:false};
}
function N8_DienTapXungDotChiDoc(){
  const result=n8ControlledDrill_({
    spreadsheetApp:SpreadsheetApp,utilities:Utilities
  },N7_TEST_SETTINGS_);
  console.log(JSON.stringify(result,null,2));
}

/**
 * Real-runtime read-only verification that the future N7 append guard and
 * N8 snapshot use the SAME digest encoding. Never performs an append.
 */
function n8VerifyWriterGuardReadOnly_(deps,settings){
  const n8=n8ReadSnapshot_(deps,settings);
  if(!n8.ok)return n8;
  if(typeof n7TestJournalSnapshot_!=='function')
    return n8Deny_('N7_SNAPSHOT_GUARD_NOT_INSTALLED');
  const wb=deps.spreadsheetApp.openById(settings.isolatedSpreadsheetId);
  const tab=wb.getSheetByName(settings.journalTab);
  if(!tab)return n8Deny_('JOURNAL_TAB_MISSING');
  const n7=n7TestJournalSnapshot_(tab,settings,deps.utilities);
  if(!n7.ok)return n7;
  if(n8.digest!==n7.digest||n8.dataRows!==n7.dataRows)
    return n8Deny_('SNAPSHOT_ENCODING_MISMATCH_OR_DRIFT');
  return {ok:true,mode:'N7_N8_GUARD_READ_ONLY_MATCH',
    journalDigest:n7.digest,dataRows:n7.dataRows,
    n7EventCount:n8.observedEventCount,writes:0,release:false,
    atomicCasProven:false};
}
function N8_XacMinhGuardMoiChiDoc(){
  const result=n8VerifyWriterGuardReadOnly_({
    spreadsheetApp:SpreadsheetApp,utilities:Utilities
  },N7_TEST_SETTINGS_);
  console.log(JSON.stringify(result,null,2));
}
