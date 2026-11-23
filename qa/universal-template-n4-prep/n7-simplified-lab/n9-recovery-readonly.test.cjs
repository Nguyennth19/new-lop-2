'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const id='1zA7ab0tpcgn68BJd8bizNR8LfuFG57yzsm1YM-SEF9I';
const backupId='1iomsoeXTLEmpRjqzf5v6WiU1ea4CE5EbipTenfPSyw8';
const headers=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
const sha='b1e999e4afaedd5d566940bbb3e9e74e75e7cdcd3ea30e7a37915352fc03d40b';
function liveRows(){return [
 headers,
 ['ULT13B_LAB_PILOT_A_20261120','LAB_PILOT_A','CI_TEST_HARNESS','TEST_CANDIDATE_VALIDATED','REQUESTED','PENDING_INDEPENDENT_REVIEW','943d502b4de648636009e0b1f357a805463890f338b62fe514a3df318335c2b6','2026-11-20T07:53:10Z'],
 ['ULT13B_LAB_PILOT_B_20261120','LAB_PILOT_B','CI_TEST_HARNESS','TEST_CANDIDATE_VALIDATED','REQUESTED','PENDING_INDEPENDENT_REVIEW','f8fe930a6ea63f95a948d31024ec868eea2474f77e9b49a50ea34c3d5b26afce','2026-11-20T07:53:10Z'],
 ['N7_LAB_N7_KEY_001','LAB_N7_REQ_001','OWNER_FIXTURE_ONLY','N7_TEST_METADATA_ONLY','PREPARED','PROJECTED_PENDING',sha,'2026-11-24T00:59:03+07:00']
];}
const stringifySnapshot=rows=>JSON.stringify({
 schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',sheet:id,tab:'15_NhatKy_HanhDong',
 columns:rows[0],rows:rows.slice(1)
});
const localDigest=crypto.createHash('sha256').update(stringifySnapshot(liveRows())).digest('hex');
let source=['N7_GAS_TEST_SingleWriter.gs','N8_CAS_ReadOnly.gs','N9_Recovery_ReadOnly.gs']
 .map(n=>fs.readFileSync(path.join(__dirname,n),'utf8')).join('\n');
const expectedLiveSha='b2c3b85fcf882fb5f8d84f4da89f8eb889fe8fdefce1757900eb48be85cbc6d8';
assert.ok(source.includes(expectedLiveSha));
source=source.replace(expectedLiveSha,localDigest); // VM-specific fixture, never modify GAS source file
const ctx={};
vm.runInNewContext(source+'\n;globalThis.N9={drill:n9RecoveryDrill_,uncertain:n9ClassifyUncertain_,rollback:n9RollbackDecision_,assess:n9AssessRecovery_,restore:n9SimulateNonDestructiveRestore_,controlled:n9ControlledRestoreDrill_};',ctx);
const api=ctx.N9;
const settings=()=>({writesEnabled:false,approvedGrantId:'',approvedIntentDigest:'',approvedJournalSnapshotDigest:'',
 isolatedSpreadsheetId:id,forbiddenSheetIds:['GOVERNED_SHEET','LEARNER_SHEET'],journalTab:'15_NhatKy_HanhDong'});
function fixture(){
 const live=liveRows(),backup=live.slice(0,3).map(r=>r.slice());
 const state={reads:0,opens:0,writes:0,restore:0,changedDuringRead:false};
 const tab=rows=>({getLastRow:()=>rows.length,getRange:()=>({getDisplayValues:()=>{
  state.reads++;
  const result=rows.map(r=>r.slice());
  if(state.changedDuringRead&&state.reads===1)rows.push(['Z','R','A','T','P','N','0'.repeat(64),'NOW']);
  return result;
 }})});
 const deps={spreadsheetApp:{openById:target=>{
  state.opens++;assert.ok(target===id||target===backupId);
  return{getSheetByName:name=>name==='15_NhatKy_HanhDong'?tab(target===id?live:backup):null};
 }},utilities:{DigestAlgorithm:{SHA_256:'SHA_256'},
 computeDigest:(_,s)=>[...crypto.createHash('sha256').update(s).digest()].map(x=>x>127?x-256:x)}};
 return {live,backup,state,deps};
}
test('N9 reads live and prewrite backup without ever mutating either',()=>{
 const f=fixture(),r=api.drill(f.deps,settings(),backupId);
 assert.equal(r.ok,true);assert.equal(r.liveDataRows,3);assert.equal(r.backupDataRows,2);
 assert.equal(r.n7EventCount,1);assert.equal(r.backupPrefixMatches,true);
 assert.equal(r.writes,0);assert.equal(r.restores,0);assert.equal(r.release,false);
 assert.equal(f.live.length,4);assert.equal(f.backup.length,3);
});
test('N9 confirms uncertain acknowledged event is already present, no retry',()=>{
 const f=fixture(),r=api.drill(f.deps,settings(),backupId);
 assert.equal(r.uncertaintyDisposition,'ALREADY_PRESENT_NO_RETRY');
 assert.equal(r.rollbackWithoutApprovalsDenied,true);assert.equal(r.rollbackExecuted,false);
});
test('N9 recognizes previous prewrite backup cannot erase accepted N7 row',()=>{
 const f=fixture(),r=api.drill(f.deps,settings(),backupId);
 assert.equal(r.disposition,'PRESERVE_N7_EVENT_NO_DESTRUCTIVE_RESTORE');
 assert.equal(r.unchangedAfterDrill,true);assert.equal(f.state.writes,0);
});
test('N9 rejects altered backup prefix before offering recovery plan',()=>{
 const f=fixture();f.backup[2][6]='f'.repeat(64);
 assert.equal(api.drill(f.deps,settings(),backupId).reason,'BACKUP_PREFIX_MISMATCH_RECONCILE_REQUIRED');
});
test('N9 rejects accepted-event SHA or state drift',()=>{
 const f=fixture();f.live[3][6]='f'.repeat(64);
 assert.equal(api.drill(f.deps,settings(),backupId).reason,'N7_EVENT_INTEGRITY_RECONCILE_REQUIRED');
 f.live[3][6]=sha;f.live[3][5]='ACTIVE';
 assert.equal(api.drill(f.deps,settings(),backupId).reason,'N7_EVENT_INTEGRITY_RECONCILE_REQUIRED');
});
test('N9 never treats a missing event as permission to append',()=>{
 const f=fixture();
 const r=api.uncertain(f.live.slice(1),'NO_SUCH_EVENT',sha);
 assert.equal(r.reason,'ABSENT_REQUIRES_NEW_OWNER_GRANT_NO_AUTO_RETRY');
 assert.equal(r.writes,0);
});
test('N9 unknown or duplicate event means reconciliation, no blind retry',()=>{
 const f=fixture(),rows=f.live.slice(1);
 assert.equal(api.uncertain([...rows,rows[2]],'N7_LAB_N7_KEY_001',sha).reason,'DUPLICATE_EVENT_IDS');
 assert.equal(api.uncertain(rows,'N7_LAB_N7_KEY_001','a'.repeat(64)).reason,'IDEMPOTENCY_CONFLICT');
});
test('N9 forces independent Owner and QA approval for rollback plan',()=>{
 const accepted={ok:true};
 assert.equal(api.rollback(accepted,true,false).reason,'OWNER_AND_QA_APPROVAL_REQUIRED');
 assert.equal(api.rollback(accepted,false,true).reason,'OWNER_AND_QA_APPROVAL_REQUIRED');
 const plan=api.rollback(accepted,true,true);
 assert.equal(plan.disposition,'PLAN_COMPENSATING_EVENT_ONLY');
 assert.equal(plan.executed,false);assert.equal(plan.restores,0);assert.equal(plan.release,false);
});
test('N9 refuses rollback decision on corrupted assessment even if approvals present',()=>{
 assert.equal(api.rollback({ok:false},true,true).reason,'RECONCILE_BEFORE_ROLLBACK');
});
test('N9 refuses any grant / write enabled / disallowed source ID',()=>{
 const f=fixture(),s=settings();
 for(const invalid of [{...s,writesEnabled:true},{...s,approvedGrantId:'GRANT'},
  {...s,approvedIntentDigest:'a'.repeat(64)},
  {...s,approvedJournalSnapshotDigest:'b'.repeat(64)}]){
  assert.equal(api.drill(f.deps,invalid,backupId).reason,'READ_ONLY_GUARD');
 }
 assert.equal(api.drill(f.deps,s,id).reason,'READ_ONLY_GUARD');
 assert.equal(f.state.opens,0);
});
test('N9 detects live sheet changing during snapshot',()=>{
 const f=fixture();f.state.changedDuringRead=true;
 assert.equal(api.drill(f.deps,settings(),backupId).reason,'SNAPSHOT_MOVED');
});
test('N9 detects extra rows, missing legacy rows, and duplicate events',()=>{
 const f=fixture();f.live.push(['EXTRA','R','A','T','P','N','0'.repeat(64),'NOW']);
 assert.equal(api.drill(f.deps,settings(),backupId).reason,'UNEXPECTED_ROW_COUNT_RECONCILE_REQUIRED');
 const g=fixture();g.backup.pop();
 assert.equal(api.drill(g.deps,settings(),backupId).reason,'UNEXPECTED_ROW_COUNT_RECONCILE_REQUIRED');
 const h=fixture();h.live[2][0]=h.live[1][0];
 assert.equal(api.drill(h.deps,settings(),backupId).reason,'DUPLICATE_EVENT_IDS');
});
test('N9 refuses otherwise plausible unexpected edit that changes full snapshot',()=>{
 const f=fixture();f.live[3][2]='OTHER_OWNER_ACTOR';
 assert.equal(api.drill(f.deps,settings(),backupId).reason,'N9_LIVE_SNAPSHOT_DRIFT_RECONCILE_REQUIRED');
});

test('N9 controlled restore dry-run rebuilds exact approved live journal in RAM',()=>{
 const f=fixture(),r=api.controlled(f.deps,settings(),backupId);
 assert.equal(r.ok,true);assert.equal(r.mode,'N9_RAM_RESTORE_REPLAY_ONLY');
 assert.equal(r.backupDataRows,2);assert.equal(r.replayedAcceptedEvents,1);
 assert.equal(r.reconstructedDataRows,3);assert.equal(r.matchesLive,true);
 assert.equal(r.liveUnchanged,true);assert.equal(r.writes,0);assert.equal(r.restores,0);
 assert.equal(f.live.length,4);assert.equal(f.backup.length,3);
});
test('N9 controlled dry-run refuses destructive backup-only restore',()=>{
 const f=fixture(),r=api.controlled(f.deps,settings(),backupId);
 assert.equal(r.destructiveRestoreDenied,true);
 assert.equal(r.independentApprovalsRequired,true);
 assert.equal(r.qaSigned,false);assert.equal(r.rollbackExecuted,false);
});
test('N9 controlled restore refuses wrong approved event SHA',()=>{
 const f=fixture();f.live[3][6]='a'.repeat(64);
 assert.equal(api.controlled(f.deps,settings(),backupId).reason,'N7_EVENT_INTEGRITY_RECONCILE_REQUIRED');
});
test('N9 controlled restore refuses backup corruption and missing suffix',()=>{
 const f=fixture();f.backup[2][7]='DIFFERENT';
 assert.equal(api.controlled(f.deps,settings(),backupId).reason,'BACKUP_PREFIX_MISMATCH_RECONCILE_REQUIRED');
 const g=fixture();g.live.pop();
 assert.equal(api.controlled(g.deps,settings(),backupId).reason,'UNEXPECTED_ROW_COUNT_RECONCILE_REQUIRED');
});
test('N9 controlled restore refuses active, partial, expired-but-nonempty grant',()=>{
 const f=fixture(),s=settings();
 for(const bad of [{...s,writesEnabled:true},{...s,approvedGrantId:'GRANT'},
  {...s,approvedIntentDigest:'a'.repeat(64)},
  {...s,approvedJournalSnapshotDigest:'a'.repeat(64)},
  {...s,grantExpiresAt:'2026-11-23T00:00:00Z'},
  {...s,approvedBaselineRows:2}]){
  assert.equal(api.controlled(f.deps,bad,backupId).reason,'READ_ONLY_GUARD');
 }
 assert.equal(f.state.opens,0);
});
test('N9 rollback remains plan-only even with simulated approvals',()=>{
 const p=api.rollback({ok:true},true,true);
 assert.equal(p.executed,false);assert.equal(p.restores,0);assert.equal(p.release,false);
});
test('N9 refuses different actor in accepted event even if event ID/SHA unchanged',()=>{
 const f=fixture();f.live[3][2]='DIFFERENT';
 assert.equal(api.controlled(f.deps,settings(),backupId).reason,'N9_LIVE_SNAPSHOT_DRIFT_RECONCILE_REQUIRED');
});
