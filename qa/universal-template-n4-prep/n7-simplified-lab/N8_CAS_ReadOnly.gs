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
