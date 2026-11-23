'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const dir=__dirname;
const source=['N7_GAS_TEST_SingleWriter.gs','N8_CAS_ReadOnly.gs'].map(n=>fs.readFileSync(path.join(dir,n),'utf8')).join('\n');
const context={};
vm.runInNewContext(source+'\n;globalThis.api={read:n8ReadSnapshot_,compare:n8CompareSnapshots_};',context);
const api=context.api;
const header=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
const id='1zA7ab0tpcgn68BJd8bizNR8LfuFG57yzsm1YM-SEF9I';
const rows=()=>[header,
 ['ULT13B_LAB_PILOT_A_20261120','LAB_PILOT_A','CI_TEST_HARNESS','TEST_CANDIDATE_VALIDATED','REQUESTED','PENDING_INDEPENDENT_REVIEW','943d502b4de648636009e0b1f357a805463890f338b62fe514a3df318335c2b6','2026-11-20T07:53:10Z'],
 ['ULT13B_LAB_PILOT_B_20261120','LAB_PILOT_B','CI_TEST_HARNESS','TEST_CANDIDATE_VALIDATED','REQUESTED','PENDING_INDEPENDENT_REVIEW','f8fe930a6ea63f95a948d31024ec868eea2474f77e9b49a50ea34c3d5b26afce','2026-11-20T07:53:10Z'],
 ['N7_LAB_N7_KEY_001','LAB_N7_REQ_001','OWNER_TEST','N7_TEST_METADATA_ONLY','PREPARED','PROJECTED_PENDING','b1e999e4afaedd5d566940bbb3e9e74e75e7cdcd3ea30e7a37915352fc03d40b','2026-11-24T00:59:03+07:00']];
const cfg=()=>({writesEnabled:false,approvedGrantId:'',isolatedSpreadsheetId:id,forbiddenSheetIds:['ORIGINAL_TEST','LEARNER'],journalTab:'15_NhatKy_HanhDong'});
function fixture(){
 const cells=rows(),state={openCount:0,reads:0,moveOnRead:false};
 const tab={getLastRow:()=>cells.length,getRange:()=>({getDisplayValues:()=>{state.reads++;const snapshot=cells.map(r=>[...r]);if(state.moveOnRead)cells.push(['D','E','F','G','H','I','J','K']);return snapshot;}})};
 const deps={spreadsheetApp:{openById:sheet=>{assert.equal(sheet,id);state.openCount++;return{getSheetByName:name=>name==='15_NhatKy_HanhDong'?tab:null};}},
 utilities:{DigestAlgorithm:{SHA_256:'SHA_256'},computeDigest:(_,str)=>[...crypto.createHash('sha256').update(str).digest()].map(x=>x>127?x-256:x)}};
 return {deps,cells,state};
}
test('N8 read-only snapshot verifies existing N7 event, header and counts',()=>{
 const f=fixture(),r=api.read(f.deps,cfg());
 assert.equal(r.ok,true);assert.equal(r.dataRows,3);assert.equal(r.observedEventCount,1);
 assert.equal(r.observedEventDigest,rows()[3][6]);assert.equal(r.digest.length,64);
 assert.equal(r.writes,0);assert.equal(r.release,false);
});
test('N8 repeated identical snapshot compares as unchanged',()=>{
 const f=fixture(),a=api.read(f.deps,cfg()),b=api.read(f.deps,cfg());
 assert.equal(api.compare(a,b).unchanged,true);assert.equal(f.cells.length,4);
});
test('N8 direct-editor mutation of journal row is detected',()=>{
 const f=fixture(),a=api.read(f.deps,cfg());f.cells[3][5]='TAMPERED';
 const b=api.read(f.deps,cfg());
 assert.equal(api.compare(a,b).reason,'JOURNAL_DRIFT_RECONCILE_REQUIRED');
});
test('N8 change to existing digest or event actor is detected',()=>{
 const f=fixture(),a=api.read(f.deps,cfg());
 f.cells[2][6]='f'.repeat(64);assert.equal(api.compare(a,api.read(f.deps,cfg())).ok,false);
 f.cells[2][6]=rows()[2][6];f.cells[3][2]='DIFFERENT_ACTOR';
 assert.equal(api.compare(a,api.read(f.deps,cfg())).ok,false);
});
test('N8 appended outside event invalidates prior snapshot',()=>{
 const f=fixture(),a=api.read(f.deps,cfg());
 f.cells.push(['OUTSIDE_EVENT','LAB_X','EDITOR','TEST','PREPARED','PENDING','0'.repeat(64),'NOW']);
 assert.equal(api.compare(a,api.read(f.deps,cfg())).reason,'JOURNAL_DRIFT_RECONCILE_REQUIRED');
});
test('N8 duplicate event IDs fail closed without overwriting',()=>{
 const f=fixture();f.cells.push([...f.cells[3]]);
 const r=api.read(f.deps,cfg());assert.equal(r.reason,'DUPLICATE_EVENT_IDS');
 assert.equal(f.cells.length,5);
});
test('N8 header drift and incomplete row are rejected',()=>{
 const f=fixture();f.cells[0][0]='modified';
 assert.equal(api.read(f.deps,cfg()).reason,'HEADER_DRIFT');
 f.cells[0][0]='event_id';f.cells[3].pop();
 assert.equal(api.read(f.deps,cfg()).reason,'MALFORMED_ROWS');
});
test('N8 refuses write-enabled, active grant, original Sheet',()=>{
 const f=fixture(),base=cfg();
 for(const invalid of [{...base,writesEnabled:true},{...base,approvedGrantId:'GRANT'}, {...base,isolatedSpreadsheetId:'LEARNER',forbiddenSheetIds:['LEARNER']}]){
  assert.equal(api.read(f.deps,invalid).reason,'READ_ONLY_GUARD');
 }
 assert.equal(f.state.openCount,0);
});
test('N8 snapshot detects row count movement during a read',()=>{
 const f=fixture();f.state.moveOnRead=true;
 assert.equal(api.read(f.deps,cfg()).reason,'SNAPSHOT_MOVED');
});
test('N8 rejects invalid baseline/failed snapshot comparison',()=>{
 const f=fixture(),v=api.read(f.deps,cfg());
 assert.equal(api.compare(null,v).reason,'INVALID_SNAPSHOT');
 assert.equal(api.compare(v,{ok:false}).reason,'INVALID_SNAPSHOT');
});
test('N8 rejects blank event IDs',()=>{
 const f=fixture();f.cells[2][0]='';
 assert.equal(api.read(f.deps,cfg()).reason,'BLANK_EVENT_ID');
});
