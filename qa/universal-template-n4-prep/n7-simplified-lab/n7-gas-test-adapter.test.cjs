'use strict';
// Executes the actual GAS adapter with in-memory Apps Script stand-ins.
// NO Google API, no network, no credentials, no real Sheet and NO deployment.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const file=path.join(__dirname,'N7_GAS_TEST_SingleWriter.gs');
const source=fs.readFileSync(file,'utf8');
const sandbox={};
vm.runInNewContext(source+'\n;globalThis.__N7={validate:n7TestValidate_,execute:n7TestExecute_,status:n7TestStatus_};',sandbox,{filename:file});
const n7=sandbox.__N7;
const COPY='N7_LAB_COPY_NOT_REAL';
const FIELDS=['contract','environment','requestId','idempotencyKey','executionId',
 'lessonId','candidateSha256','sourceReceiptSha256','sourceRevision',
 'targetSpreadsheetId','action','tab','rowsDigest','grantId','expectedJournalRows'];
const digestOf=i=>crypto.createHash('sha256').update(JSON.stringify(FIELDS
 .filter(k=>k!=='executionId'&&k!=='expectedJournalRows').map(k=>[k,i[k]]))).digest('hex');
const snapshotDigest=(cells,target=COPY)=>crypto.createHash('sha256').update(JSON.stringify({
 schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',sheet:target,tab:'15_NhatKy_HanhDong',
 columns:cells[0],rows:cells.slice(1)
})).digest('hex');
const HEADERS=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
const settings=()=>({writesEnabled:false,isolatedSpreadsheetId:COPY,
 approvedJournalSnapshotDigest:snapshotDigest([HEADERS]),
 allowedOwnerEmail:'lab-owner@example.invalid',approvedGrantId:'GRANT_001',
 approvedIntentDigest:digestOf(intent()),grantExpiresAt:'2026-11-23T16:10:00Z',
 approvedBaselineRows:0,
 forbiddenSheetIds:['1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs',
 '1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8'],journalTab:'15_NhatKy_HanhDong'});
const intent=()=>({contract:'N7_GAS_TEST_INTENT_V1',environment:'TEST',requestId:'LAB_REQ_001',
 idempotencyKey:'LAB_KEY_001',executionId:'LAB_EXEC_001',lessonId:'LAB_MATH_PILOT_A',
 candidateSha256:'a'.repeat(64),sourceReceiptSha256:'b'.repeat(64),sourceRevision:'REV_SYNTH_001',
 targetSpreadsheetId:COPY,action:'APPEND_TEST_METADATA',tab:'15_NhatKy_HanhDong',
 rowsDigest:'c'.repeat(64),grantId:'GRANT_001',expectedJournalRows:0});
function runtime(){
 const header=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
 const cells=[header],attempts=new Map();const state={locked:false,busy:false,failAppend:false,failAfterAppend:false,failReadback:false,failFlush:false,flushed:0,appends:0,identity:'lab-owner@example.invalid',released:0};
 const tab={
  getLastRow:()=>cells.length,
  getRange:(row,col,count,cols)=>({
   getDisplayValues:()=>{
    if(state.failReadback&&state.appends)throw Error('SIMULATED_READBACK_FAILURE');
    return cells.slice(row-1,row-1+count).map(r=>r.slice(col-1,col-1+cols).map(String));
   },
   getValues:()=>{
    if(state.failReadback&&row===2)throw Error('SIMULATED_READBACK_FAILURE');
    return cells.slice(row-1,row-1+count).map(r=>r.slice(col-1,col-1+cols));
  }}),
  appendRow:r=>{state.appends++;if(state.failAppend)throw Error('UNCERTAIN_APPEND');cells.push(r);if(state.failAfterAppend)throw Error('UNCERTAIN_AFTER_APPEND');}
 };
 const deps={
  attemptLedger:{get:k=>attempts.get(k),putIfAbsent:(k,v)=>{
   if(attempts.has(k))return false;attempts.set(k,{...v});return true;
  }},
  spreadsheetApp:{
   openById:id=>{assert.equal(id,COPY);return{getSheetByName:n=>n==='15_NhatKy_HanhDong'?tab:null};},
   flush:()=>{state.flushed++;if(state.failFlush)throw Error('UNCERTAIN_FLUSH');}
  },
  lockService:{getScriptLock:()=>({tryLock:()=>!state.busy,releaseLock:()=>state.released++})},
  session:{getEffectiveUser:()=>({getEmail:()=>state.identity})},
  utilities:{DigestAlgorithm:{SHA_256:'SHA_256'},computeDigest:(_,s)=>[...crypto.createHash('sha256').update(s).digest()].map(n=>n>127?n-256:n),formatDate:()=> '2026-11-23T23:00:00+07:00'},now:()=>Date.parse('2026-11-23T16:00:00Z')
 };
 return{deps,cells,state,attempts};
}
const call=(i,env,config)=>n7.execute(i,env.deps,config);
test('N7 adapter defaults to OFF, never writes before authorization',()=>{
 const x=runtime(),s=settings();
 assert.equal(n7.status().writesEnabled,false);
 assert.equal(call(intent(),x,s).reason,'WRITE_DISABLED_IN_SOURCE');
 assert.equal(x.cells.length,1);assert.equal(x.state.released,0);
});
test('N7 adapter denies the existing governed Sheet and original learner Sheet',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 for(const target of s.forbiddenSheetIds){
  assert.equal(call({...intent(),targetSpreadsheetId:target},e,{...s,isolatedSpreadsheetId:target}).reason,'ISOLATED_TEST_COPY_REQUIRED');
 }
 assert.equal(e.cells.length,1);
});
test('N7 adapter rejects unauthorized environment, tab, actor, grant and private field',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 for(const mutate of [i=>i.environment='MAIN',i=>i.tab='13_PheDuyet',
  i=>i.action='ACTIVE',i=>i.grantId='BAD_GRANT',i=>i.answerKey=42]){
  const i=intent();mutate(i);
  assert.equal(call(i,e,s).ok,false);
 }
 e.state.identity='other@example.invalid';
 assert.equal(call(intent(),e,s).reason,'OWNER_IDENTITY_DENIED');
 assert.equal(e.cells.length,1);
});
test('N7 isolated single-tab journal append verifies readback and never grants release',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true},r=call(intent(),e,s);
 assert.equal(r.ok,true);assert.equal(r.release,false);assert.equal(r.writes,1);
 assert.equal(e.cells.length,2);assert.equal(e.cells[1][0],'N7_LAB_KEY_001');
 assert.equal(e.cells[1][1],'LAB_EXEC_001');assert.equal(r.commitState,'COMMITTED_VERIFIED');
 assert.equal(r.receipt.batch_id,'LAB_EXEC_001');assert.equal(r.receipt.requestId,'LAB_REQ_001');
 assert.equal(r.receipt.idempotencyKey,'LAB_KEY_001');assert.equal(r.receipt.executionId,'LAB_EXEC_001');
 assert.equal(r.receipt.journalDigest,snapshotDigest(e.cells));
 assert.equal(e.state.released,1);assert.equal(e.state.flushed,1);
});
test('N7 same key/digest returns same event without another physical append',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 assert.equal(call(intent(),e,s).writes,1);
 const duplicate=call({...intent(),executionId:'LAB_EXEC_002'},e,s);
 assert.equal(duplicate.ok,true);assert.equal(duplicate.duplicate,true);assert.equal(duplicate.writes,0);
 assert.equal(duplicate.commitState,'COMMITTED_VERIFIED');
 assert.equal(duplicate.receipt.batch_id,'LAB_EXEC_001');
 assert.equal(duplicate.receipt.executionId,'LAB_EXEC_002');
 assert.equal(duplicate.receipt.intentDigest,digestOf(intent()));
 assert.equal(e.cells.length,2);
});
test('N7 same idempotency key with altered payload denies conflict',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 call(intent(),e,s);
 const mutated={...intent(),rowsDigest:'d'.repeat(64)};
 assert.equal(call(mutated,e,s).reason,'GRANT_SCOPE_OR_EXPIRY_DENIED');
 assert.equal(call(mutated,e,{...s,approvedIntentDigest:digestOf(mutated)}).reason,'IDEMPOTENCY_CONFLICT');
 assert.equal(e.cells.length,2);
});
test('N7 journal rows check rejects stale parallel input',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 call(intent(),e,s);
 const other={...intent(),requestId:'LAB_REQ_002',idempotencyKey:'LAB_KEY_002',executionId:'LAB_EXEC_002'};
 assert.equal(call(other,e,{...s,approvedIntentDigest:digestOf(other)}).reason,'N8_SNAPSHOT_CONFLICT_RECONCILE_REQUIRED');
 assert.equal(e.cells.length,2);
});
test('N7 lock contention and header drift deny without write',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 e.state.busy=true;assert.equal(call(intent(),e,s).reason,'LOCK_BUSY');
 e.state.busy=false;e.cells[0][0]='WRONG';
 assert.equal(call(intent(),e,s).reason,'HEADER_DRIFT');assert.equal(e.cells.length,1);
});
test('N7 uncertain append or failed readback stops at RECONCILE_REQUIRED',()=>{
 const s={...settings(),writesEnabled:true},x=runtime();x.state.failAppend=true;
 const unknown=call(intent(),x,s);assert.equal(unknown.reason,'RECONCILE_REQUIRED');
 assert.equal(unknown.commitState,'COMMIT_UNKNOWN');assert.equal(unknown.writes,null);
 assert.equal(unknown.retryAllowed,false);assert.equal(x.cells.length,1);
 x.state.failAppend=false;
 const absent=call({...intent(),executionId:'LAB_EXEC_002'},x,s);
 assert.equal(absent.commitState,'COMMIT_UNKNOWN');assert.equal(absent.writes,null);
 assert.equal(x.state.appends,1);assert.equal(x.cells.length,1);
 const y=runtime();y.state.failReadback=true;
 const unread=call(intent(),y,s);assert.equal(unread.reason,'RECONCILE_REQUIRED');
 assert.equal(unread.commitState,'COMMIT_UNKNOWN');assert.equal(unread.writes,null);assert.equal(y.cells.length,2);
 y.state.failReadback=false;
 const recovered=call({...intent(),executionId:'LAB_EXEC_003'},y,s);
 assert.equal(recovered.commitState,'COMMITTED_VERIFIED');assert.equal(recovered.writes,0);
 assert.equal(recovered.receipt.batch_id,'LAB_EXEC_001');assert.equal(y.state.appends,1);
 // No blind second append despite readback uncertainty.
 assert.equal(y.cells[1][4],'PREPARED');
});
test('N7-D4 missing/expired/mismatched grant cannot authorize a write',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 for(const bad of [
  {...s,approvedIntentDigest:''},
  {...s,approvedIntentDigest:'a'.repeat(64)},
  {...s,grantExpiresAt:''},
  {...s,grantExpiresAt:'2025-01-01T00:00:00Z'},
  {...s,grantExpiresAt:'2026-11-23T17:00:00Z'},
  {...s,approvedBaselineRows:-1},
  {...s,approvedBaselineRows:1},
  {...s,approvedGrantId:''}
 ])assert.equal(call(intent(),e,bad).ok,false);
 assert.equal(e.cells.length,1);assert.equal(e.state.flushed,0);
});
test('N7-D4 flush is required under lock before reporting one-write success',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 e.state.failFlush=true;
 assert.equal(call(intent(),e,s).reason,'RECONCILE_REQUIRED');
 assert.equal(e.cells.length,2);
 assert.equal(e.state.flushed,1);assert.equal(e.state.released,1);
 e.state.failFlush=false;
 const duplicate=call(intent(),e,s);
 assert.equal(duplicate.writes,0);assert.equal(e.cells.length,2);
});
test('N7-D4 one bound request cannot authorize a second request',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 assert.equal(call(intent(),e,s).writes,1);
 const second={...intent(),requestId:'LAB_REQ_002',idempotencyKey:'LAB_KEY_002',
  executionId:'LAB_EXEC_002',expectedJournalRows:1};
 assert.equal(call(second,e,s).reason,'GRANT_SCOPE_OR_EXPIRY_DENIED');
 assert.equal(e.cells.length,2);
});
test('N8 locked baseline denies changed content even when row count is unchanged',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 e.cells.push(['EXTERNAL_EVENT','LAB_OUTSIDE','EDITOR','TEST','PREPARED','PENDING','a'.repeat(64),'NOW']);
 const expected=snapshotDigest(e.cells);
 e.cells[1][3]='OTHER_ACTION';
 const before=e.cells.length;
 const intentUpdated={...intent(),expectedJournalRows:1};
 const candidate={...s,approvedIntentDigest:digestOf(intentUpdated),approvedBaselineRows:1,approvedJournalSnapshotDigest:expected};
 assert.equal(call(intentUpdated,e,candidate).reason,'N8_SNAPSHOT_CONFLICT_RECONCILE_REQUIRED');
 assert.equal(e.cells.length,before);assert.equal(e.state.flushed,0);
});
test('N8 missing baseline digest must be denied before acquiring lock',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true,approvedJournalSnapshotDigest:''};
 assert.equal(call(intent(),e,s).reason,'GRANT_SCOPE_OR_EXPIRY_DENIED');
 assert.equal(e.state.released,0);assert.equal(e.cells.length,1);
});
test('N8 changes of header, duplicate IDs and blank IDs always fail closed',()=>{
 const s={...settings(),writesEnabled:true};
 const a=runtime();a.cells[0][0]='WRONG';
 assert.equal(call(intent(),a,s).reason,'HEADER_DRIFT');
 const b=runtime();b.cells.push(['','LAB_X','A','T','P','N','0'.repeat(64),'NOW']);
 assert.equal(call(intent(),b,s).reason,'BLANK_EVENT_ID');
 const c=runtime();c.cells.push(['DUPE','LAB_X','A','T','P','N','0'.repeat(64),'NOW']);
 c.cells.push([...c.cells[1]]);
 assert.equal(call(intent(),c,s).reason,'DUPLICATE_EVENT_IDS');
});
test('N8 existing event can be read idempotently without any second write',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 const original=intent();assert.equal(call(original,e,s).writes,1);
 assert.equal(e.cells.length,2);
 const again=call({...original,executionId:'LAB_EXEC_002'},e,s);
 assert.equal(again.duplicate,true);assert.equal(again.writes,0);
 assert.equal(e.cells.length,2);
});
test('N7 contract requires a strict value digest and safe idempotency identifiers',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 for(const mutate of [i=>i.candidateSha256='bad',i=>i.idempotencyKey='A/B',
  i=>i.sourceRevision='unlocked',i=>i.expectedJournalRows=-1]){
  const i=intent();mutate(i);assert.equal(call(i,e,s).reason,'INTENT_POLICY');
 }
 assert.equal(e.cells.length,1);
});

test('N11 M1 historical batch stays unchanged without an authoritative receipt',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 e.cells.push(['N7_LAB_KEY_001','LAB_REQ_001','legacy','N7_TEST_METADATA_ONLY','PREPARED','PROJECTED_PENDING',digestOf(intent()),'NOW']);
 const before=JSON.stringify(e.cells);
 const r=call(intent(),e,s);
 assert.equal(r.reason,'LEGACY_RECEIPT_RECONCILE_REQUIRED');
 assert.equal(r.commitState,'COMMIT_UNKNOWN');assert.equal(r.writes,null);
 assert.equal(r.receipt.batch_id,null);assert.equal(JSON.stringify(e.cells),before);
 assert.equal(e.state.appends,0);
});
test('N11 M2 append may commit then throw; reconcile verifies original batch, never appends',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};e.state.failAfterAppend=true;
 const a=call(intent(),e,s);assert.equal(a.commitState,'COMMIT_UNKNOWN');assert.equal(a.writes,null);
 assert.equal(a.receipt.batch_id,null);assert.equal(e.cells.length,2);
 const b=call({...intent(),executionId:'LAB_EXEC_002'},e,s);
 assert.equal(b.commitState,'COMMITTED_VERIFIED');assert.equal(b.writes,0);
 assert.equal(b.receipt.batch_id,'LAB_EXEC_001');assert.equal(e.state.appends,1);
});
test('N11 M2 digest drift outside event or batch tampering cannot verify replay',()=>{
 const s={...settings(),writesEnabled:true};
 for(const index of [1,2,3,4,5,6,7]){
  const e=runtime();call(intent(),e,s);e.cells[1][index]='TAMPERED';
  const r=call({...intent(),executionId:'LAB_EXEC_002'},e,s);
  assert.equal(r.ok,false);assert.equal(e.state.appends,1);
  if(index!==6){assert.equal(r.commitState,'COMMIT_UNKNOWN');assert.equal(r.writes,null);}
 }
});
test('N11 M2 no ledger wiring or failed reservation cannot authorize append',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};delete e.deps.attemptLedger;
 const denied=call(intent(),e,s);assert.equal(denied.reason,'ATTEMPT_LEDGER_UNAVAILABLE');
 assert.equal(denied.commitState,'NOT_ATTEMPTED');assert.equal(denied.writes,0);
 e.deps.attemptLedger={get:()=>undefined,putIfAbsent:()=>{throw Error('UNCERTAIN_LEDGER');}};
 const unknown=call(intent(),e,s);assert.equal(unknown.commitState,'COMMIT_UNKNOWN');
 assert.equal(unknown.writes,null);assert.equal(e.state.appends,0);
});
test('N11 M1 request identifiers must be strings and a changed request is not a replay',()=>{
 const e=runtime(),s={...settings(),writesEnabled:true};
 assert.equal(call({...intent(),executionId:123456},e,s).reason,'INTENT_POLICY');
 call(intent(),e,s);
 const changed={...intent(),requestId:'LAB_REQ_002',executionId:'LAB_EXEC_002'};
 assert.equal(call(changed,e,{...s,approvedIntentDigest:digestOf(changed)}).reason,'IDEMPOTENCY_CONFLICT');
 assert.equal(e.state.appends,1);
});
