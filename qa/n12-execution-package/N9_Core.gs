/** N12 scoped extraction; upstream 2341531e80797c7fb22edea163981c0f4ebff185. No historical entrypoints. */
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
