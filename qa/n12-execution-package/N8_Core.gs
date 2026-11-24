/** N12 scoped extraction; upstream f295334917882a37d638edc0772b1dee85f730b8. No historical entrypoints. */
function n8Deny_(reason) {
  return {ok:false,reason:reason,writes:0,release:false};
}

function n8CompareSnapshots_(expected,current){
  if (!expected||!current||!expected.ok||!current.ok)return n8Deny_('INVALID_SNAPSHOT');
  if (expected.digest!==current.digest||expected.dataRows!==current.dataRows)
    return n8Deny_('JOURNAL_DRIFT_RECONCILE_REQUIRED');
  return {ok:true,unchanged:true,writes:0,release:false,
    note:'READ_ONLY_COMPARE_NOT_REMOTE_ATOMIC_CAS'};
}

function n8SnapshotDigest_(rows,settings,utilities){
  return n7TestSha256_(JSON.stringify({
    schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',
    sheet:settings.isolatedSpreadsheetId,tab:settings.journalTab,
    columns:rows[0],rows:rows.slice(1)
  }),utilities);
}
