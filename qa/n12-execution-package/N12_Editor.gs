/** SOURCE REVIEW ONLY. Do not import into live GAS or consent until separately approved. */
const N12_EDITOR_REVIEWED_CASE_ = null; // sealed source config is a future separately reviewed delta
const N12_PROJECT_SHA_='086d4594aed0c10276abb1e28b69a1b33be4dce2934b52223d85118311a29879';
const N12_SETUP_RESOURCE_PINS_={
 "P2_TARGET": "8d474c67db9f11041737ab02a29c111bdd1cba52d38973c238b6609a43c9e909",
 "P2_BACKUP": "b9e21293309781732974b663d10c67a1eebf8b06a246007db471c5b1f3caac09",
 "P3_TARGET": "5de7cde03d125eacac04d3e8d7c2de807e8f7ccd85d1baee25d6605db896d6be",
 "P3_BACKUP": "d02f2fec9b6b2cb91daf775c53b0f6b5aa88096dea28ebe589e241677aec7296",
 "P4_TARGET": "e523ab0b2d5e853a2c79433f7387c5341169293e9dac3f3def27547ed6ac467d",
 "P4_BACKUP": "f5226ee3f1b74dabb2cdd445eaaca929f80e477c111263e19b6398373f36605a",
 "P5_RECOVERY": "14ad36225cc1e0022b843b0380c5ce781b6553e74401f2d692747d6a95127483"
};
const N12_SETUP_BASELINE_PINS_={
 "P2": "d39b1f632d93644ffa68b392fb3eb498af1fee2f6172b21bb2978b049f2b08b1",
 "P3": "3feeb901a0bebb40b54efc1270249ce805c06b791cf27997a72f82b001ef6481",
 "P4": "cba5e8bb426e7367febc86f88497991284050496f1d407fd49a4c2948f8c4079",
 "P5": "b8a8f99c4f9cc1183a39c8d6f316f7475f5b999cb4061cd69b959333fe75f934"
};
function n12EditorPinned_(s, intent, raw) {
 if(!s || !intent || !['P2','P3','P4'].includes(s.proofCase))return false;
 const hash=v=>n7TestSha256_(v,raw.utilities);
 try {
  const c=JSON.parse(raw.propertiesService.getScriptProperties().getProperty('N12_SETUP_CONFIG'));
  const roles=Object.keys(N12_SETUP_RESOURCE_PINS_);
  if(!c || c.environment!=='N12_DISPOSABLE_SYNTHETIC_ONLY'||hash(c.projectId)!==N12_PROJECT_SHA_||
   raw.scriptApp.getScriptId()!==c.projectId||s.projectId!==c.projectId||
   c.ownerEmail!==s.allowedOwnerEmail||raw.session.getEffectiveUser().getEmail()!==c.ownerEmail||
   !n11M4Exact_(c.resources,roles)||new Set([c.projectId,...Object.values(c.resources)]).size!==8||
   roles.some(k=>hash(c.resources[k])!==N12_SETUP_RESOURCE_PINS_[k])||
   s.isolatedSpreadsheetId!==c.resources[s.proofCase+'_TARGET']||s.backupId!==c.resources[s.proofCase+'_BACKUP']||
   s.approvedBaselineRows!==0||s.approvedJournalSnapshotDigest!==N12_SETUP_BASELINE_PINS_[s.proofCase]||
   intent.expectedJournalRows!==0||!n7TestValidate_(intent,s).ok||
   n7TestDigest_(intent,raw.utilities)!==s.approvedIntentDigest)return false;
  return n11M4ScopeDigest_(n12Scope_(s),raw.utilities)===s.approvedScopeSha256;
 }catch(e){return false;}
}
function n12EditorDispatch_(mode, reviewed, raw) {
 if(!reviewed || !['EXECUTE','RECONCILE'].includes(mode))return n7TestDeny_('N12_EDITOR_HARD_OFF');
 const s=reviewed.settings, intent=reviewed.intent;
 if(!s||s.writesEnabled!==(mode==='EXECUTE')||!n12EditorPinned_(s,intent,raw))return n7TestDeny_('N12_EDITOR_PIN_OR_MODE_DENIED');
 return mode==='EXECUTE'?n12Execute_(intent,raw,s):n12Reconcile_(intent,raw,s);
}
function N12_ExecuteReviewedProof() {
 if(!N12_EDITOR_REVIEWED_CASE_)return n7TestDeny_('N12_EDITOR_HARD_OFF');
 return n12EditorDispatch_('EXECUTE',N12_EDITOR_REVIEWED_CASE_,n12ProviderDeps_());
}
function N12_ReconcileReviewedProof() {
 if(!N12_EDITOR_REVIEWED_CASE_)return n7TestDeny_('N12_EDITOR_HARD_OFF');
 return n12EditorDispatch_('RECONCILE',N12_EDITOR_REVIEWED_CASE_,n12ProviderDeps_());
}
