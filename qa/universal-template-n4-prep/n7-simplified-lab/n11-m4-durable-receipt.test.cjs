'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const src=['N7_GAS_TEST_SingleWriter.gs','N8_CAS_ReadOnly.gs','N9_Recovery_ReadOnly.gs','N11_M4_DurableReceipt_LAB.gs']
 .map(n=>fs.readFileSync(path.join(__dirname,n),'utf8')).join('\n');
function api(){
 const ctx={};vm.runInNewContext(src+'\n;globalThis.m4={execute:n11M4Execute_,reconcile:n11M4Reconcile_,scope:n11M4Scope_,scopeDigest:n11M4ScopeDigest_,seal:n11M4Seal_,digest:n7TestDigest_,snapshot:n8SnapshotDigest_,status:n7TestStatus_};',ctx);
 return ctx.m4;
}
const headers=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
const baseRows=()=>[headers.slice(),...['A','B','C'].map(k=>['LEGACY_'+k,'LEGACY_BATCH_'+k,'SYNTHETIC','TEST','REQUESTED','PENDING','a'.repeat(64),'2026-11-24T00:00:00Z'])];
const u={DigestAlgorithm:{SHA_256:'SHA_256'},computeDigest:(_,s)=>[...crypto.createHash('sha256').update(s).digest()].map(b=>b>127?b-256:b),formatDate:()=> '2026-11-24T11:00:00+07:00'};
const now=Date.parse('2026-11-24T04:00:00Z');
const intent=()=>({contract:'N7_GAS_TEST_INTENT_V1',environment:'TEST',requestId:'M4_REQUEST_001',idempotencyKey:'M4_KEY_001',executionId:'M4_EXEC_001',
 lessonId:'LAB_MATH_M4_A',candidateSha256:'b'.repeat(64),sourceReceiptSha256:'c'.repeat(64),sourceRevision:'REV_M4_001',
 targetSpreadsheetId:'M4_LAB_COPY_A',action:'APPEND_TEST_METADATA',tab:'15_NhatKy_HanhDong',rowsDigest:'d'.repeat(64),
 grantId:'M4_GRANT_001',expectedJournalRows:3});
function config(a){
 const s={writesEnabled:true,isolatedSpreadsheetId:'M4_LAB_COPY_A',backupId:'M4_LAB_BACKUP_A',
 allowedOwnerEmail:'m4-owner@example.invalid',approvedGrantId:'M4_GRANT_001',
 approvedIntentDigest:a.digest(intent(),u),approvedBaselineRows:3,grantExpiresAt:'2026-11-24T04:10:00Z',
 journalTab:'15_NhatKy_HanhDong',forbiddenSheetIds:['ORIGINAL_TEST','LEARNER_SHEET']};
 s.approvedJournalSnapshotDigest=a.snapshot(baseRows(),s,u);
 s.approvedScopeSha256=a.scopeDigest(a.scope(s),u);return s;
}
const file=(dir,name)=>path.join(dir,name+'.json');
const read=(dir,name)=>JSON.parse(fs.readFileSync(file(dir,name),'utf8'));
function write(dir,name,value){
 const f=file(dir,name),tmp=f+'.tmp';fs.writeFileSync(tmp,JSON.stringify(value));fs.renameSync(tmp,f);
}
function seed(dir){
 const a=api(),s=config(a);write(dir,'live',baseRows());write(dir,'backup',baseRows());
 write(dir,'ledger',a.seal({contract:'N11_M4_ATTEMPT_V1',scopeSha256:s.approvedScopeSha256,state:'READY',attempt:null},u));
}
function fixture(dir,opts={}){
 const a=api(),s=config(a),state={appends:0,ledgerWrites:0,opens:0,locked:false,released:0,grantReads:0};
 const store={getProperty:()=>{
  assert.equal(state.locked,true);
  return fs.existsSync(file(dir,'ledger'))?read(dir,'ledger'):null;
 },setProperty:(_,v)=>{
  assert.equal(state.locked,true);state.ledgerWrites++;
  if(opts.failReservation&&state.ledgerWrites===1)throw Error('MOCK_STORE_WRITE_FAIL');
  write(dir,'ledger',v);
  if(opts.driftAfterReserve&&state.ledgerWrites===1){
   const rows=read(dir,'live');rows[1][5]='EXTERNAL_DRIFT';write(dir,'live',rows);
  }
  if(opts.failAfterReserve&&state.ledgerWrites===1)throw Error('MOCK_STORE_ACK_LOST');
  if(opts.failVerified&&state.ledgerWrites===2)throw Error('MOCK_VERIFIED_ACK_LOST');
 }};
 function tab(name){return {getLastRow:()=>read(dir,name).length,getRange:(row,col,count,cols)=>({
  getDisplayValues:()=>{if(opts.failReadback&&state.appends)throw Error('MOCK_READBACK_FAIL');
   return read(dir,name).slice(row-1,row-1+count).map(r=>r.slice(col-1,col-1+cols));}
 }),appendRow:r=>{
  assert.equal(name,'live');assert.equal(state.locked,true);state.appends++;
  if(opts.failBeforeAppend)throw Error('MOCK_APPEND_UNKNOWN');
  const rows=read(dir,'live');rows.push(r);write(dir,'live',rows);
  if(opts.failAfterAppend)throw Error('MOCK_APPEND_ACK_LOST');
 }};}
 const deps={mode:'M4_SYNTHETIC_ONLY',attemptStore:store,utilities:u,
  session:{getEffectiveUser:()=>({getEmail:()=>opts.actor||s.allowedOwnerEmail})},
  now:()=>opts.expired||opts.expireAfterLock&&state.locked||opts.expireAfterReserve&&state.ledgerWrites?now+11*60000:now,
  readGrant:()=>{state.grantReads++;return{scopeSha256:s.approvedScopeSha256,revoked:!!opts.revoked||!!(opts.revokeAfterReserve&&state.ledgerWrites)};},
  lockService:{getScriptLock:()=>({tryLock:()=>{if(opts.busy)return false;state.locked=true;return true;},
   releaseLock:()=>{state.locked=false;state.released++;}})},
  spreadsheetApp:{openById:id=>{state.opens++;assert.ok([s.isolatedSpreadsheetId,s.backupId].includes(id));
   return{getSheetByName:n=>n===s.journalTab?tab(id===s.backupId?'backup':'live'):null};},
   flush:()=>{if(opts.failFlush)throw Error('MOCK_FLUSH_FAIL');}}
 };
 return {a,s,deps,state};
}
function run(dir,opts={},mode='execute',changes={}){
 const f=fixture(dir,opts),i={...intent(),...changes};
 const result=f.a[mode](i,f.deps,{...f.s,writesEnabled:mode==='execute'});
 return {result,state:f.state};
}
function child(dir,opts={},mode='execute',changes={}){
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const r=spawnSync(process.execPath,[__filename,'--m4-worker',dir,JSON.stringify(opts),mode,JSON.stringify(changes)],{encoding:'utf8',env});
 assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);
}
function withDir(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lop2-m4-'));try{seed(dir);fn(dir);}finally{fs.rmSync(dir,{recursive:true,force:true});}}
const ledger=dir=>JSON.parse(read(dir,'ledger')).body;
if(process.argv[2]==='--m4-worker'){
 process.stdout.write(JSON.stringify(run(process.argv[3],JSON.parse(process.argv[4]),process.argv[5],JSON.parse(process.argv[6]))));
}else{
test('M4 verified receipt survives independent Node processes; replay keeps first batch',()=>withDir(dir=>{
 const first=child(dir);assert.equal(first.result.commitState,'COMMITTED_VERIFIED');assert.equal(first.result.writes,1);
 assert.equal(ledger(dir).state,'VERIFIED');assert.equal(first.state.ledgerWrites,2);
 const retry=child(dir,{},'execute',{executionId:'M4_EXEC_002'});
 assert.equal(retry.result.commitState,'COMMITTED_VERIFIED');assert.equal(retry.result.receipt.batch_id,'M4_EXEC_001');
 assert.equal(retry.result.writes,0);assert.equal(retry.state.appends,0);assert.equal(retry.state.ledgerWrites,0);
 assert.deepEqual(read(dir,'live').slice(0,4),baseRows());assert.equal(read(dir,'live').length,5);
}));
test('M4 lost append acknowledgement survives process restart and read-only reconcile after grant expiry/revoke',()=>withDir(dir=>{
 const first=child(dir,{failAfterAppend:true});assert.equal(first.result.commitState,'COMMIT_UNKNOWN');assert.equal(first.result.writes,null);
 assert.equal(ledger(dir).state,'RESERVED');
 const before=read(dir,'ledger'),live=read(dir,'live');
 const r=child(dir,{expired:true,revoked:true},'reconcile',{executionId:'M4_EXEC_002'});
 assert.equal(r.result.commitState,'COMMITTED_VERIFIED');assert.equal(r.result.receipt.batch_id,'M4_EXEC_001');
 assert.equal(r.result.writes,0);assert.equal(r.result.ledgerWrites,0);assert.equal(r.state.grantReads,0);
 assert.equal(r.result.rollbackExecuted,false);assert.equal(r.result.atomicCasProven,false);
 assert.equal(r.result.destructiveRestoreDenied,true);assert.equal(r.result.rollbackDisposition,'OWNER_AND_QA_APPROVAL_REQUIRED');
 assert.deepEqual(read(dir,'live'),live);assert.equal(read(dir,'ledger'),before);
 assert.deepEqual(read(dir,'backup'),baseRows());
}));
test('M4 missing row after uncertain reservation/append never retries across processes',()=>{
 for(const opts of [{failBeforeAppend:true},{failAfterReserve:true},{expireAfterReserve:true},{revokeAfterReserve:true}])withDir(dir=>{
  const x=child(dir,opts);assert.equal(x.result.commitState,'COMMIT_UNKNOWN');assert.equal(x.result.writes,null);
  assert.equal(ledger(dir).state,'RESERVED');assert.equal(read(dir,'live').length,4);
  const r=child(dir,{},'execute',{executionId:'M4_EXEC_002'});
  assert.equal(r.result.commitState,'COMMIT_UNKNOWN');assert.equal(r.state.appends,0);
  assert.equal(child(dir,{},'reconcile').result.commitState,'COMMIT_UNKNOWN');
  assert.deepEqual(read(dir,'live'),baseRows());
 });
});
test('M4 expiry or revocation, lock contention, owner mismatch and disabled source block mock writes',()=>{
 for(const opts of [{expired:true},{revoked:true},{expireAfterLock:true},{busy:true},{actor:'other@example.invalid'}])withDir(dir=>{
  const r=run(dir,opts);assert.equal(r.result.ok,false);assert.equal(r.state.appends,0);assert.equal(r.state.ledgerWrites,0);
  assert.equal(ledger(dir).state,'READY');
 });
 withDir(dir=>{const f=fixture(dir);assert.equal(f.a.status().writesEnabled,false);
  assert.equal(f.a.execute(intent(),f.deps,{...f.s,writesEnabled:false}).reason,'M4_WRITE_DISABLED');
  assert.equal(f.a.reconcile(intent(),f.deps,f.s).reason,'M4_READ_ONLY_REQUIRED');
 });
});
test('M4 missing/corrupt or different scope ledger fails closed; no auto provision',()=>{
 for(const mode of ['missing','corrupt','scope'])withDir(dir=>{
  if(mode==='missing')fs.unlinkSync(file(dir,'ledger'));
  if(mode==='corrupt')write(dir,'ledger','broken');
  if(mode==='scope'){const f=fixture(dir),b=ledger(dir);b.scopeSha256='f'.repeat(64);write(dir,'ledger',f.a.seal(b,u));}
  const r=run(dir);assert.equal(r.result.ok,false);assert.equal(r.state.appends,0);assert.equal(r.state.ledgerWrites,0);
  assert.deepEqual(read(dir,'live'),baseRows());
 });
});
test('M4 changed grant or logical request cannot reuse a reserved epoch',()=>withDir(dir=>{
 assert.equal(run(dir).result.ok,true);
 const f=fixture(dir),i={...intent(),requestId:'M4_REQUEST_002',idempotencyKey:'M4_KEY_002',executionId:'M4_EXEC_002',grantId:'M4_GRANT_002'};
 const s={...f.s,approvedGrantId:i.grantId,approvedIntentDigest:f.a.digest(i,u)};
 s.approvedScopeSha256=f.a.scopeDigest(f.a.scope(s),u);
 f.deps.readGrant=()=>({scopeSha256:s.approvedScopeSha256,revoked:false});
 const r=f.a.execute(i,f.deps,s);assert.equal(r.ok,false);assert.equal(f.state.appends,0);assert.equal(f.state.ledgerWrites,0);
 assert.equal(read(dir,'live').length,5);
}));
test('M4 backup mismatch before append and history drift after append cannot authorize recovery',()=>{
 withDir(dir=>{const b=read(dir,'backup');b[1][5]='TAMPER';write(dir,'backup',b);
  const x=run(dir);assert.equal(x.result.ok,false);assert.equal(x.state.appends,0);assert.equal(x.state.ledgerWrites,0);});
 for(const index of [1,4])withDir(dir=>{assert.equal(run(dir).result.ok,true);
  const rows=read(dir,'live');rows[index][5]='TAMPER';write(dir,'live',rows);
  const r=run(dir,{},'reconcile');assert.equal(r.result.commitState,'COMMIT_UNKNOWN');assert.equal(r.state.ledgerWrites,0);
  assert.deepEqual(read(dir,'live'),rows);assert.deepEqual(read(dir,'backup'),baseRows());
 });
});
test('M4 invalid intent, store failure and post-reservation baseline drift do not append',()=>{
 withDir(dir=>{const f=fixture(dir);assert.equal(f.a.execute(null,f.deps,f.s).reason,'INTENT_SCHEMA');
  assert.equal(f.state.appends,0);assert.equal(f.state.ledgerWrites,0);});
 withDir(dir=>{const r=run(dir,{failReservation:true});assert.equal(r.result.commitState,'COMMIT_UNKNOWN');
  assert.equal(r.state.appends,0);assert.equal(ledger(dir).state,'READY');assert.deepEqual(read(dir,'live'),baseRows());});
 withDir(dir=>{const r=run(dir,{driftAfterReserve:true});assert.equal(r.result.commitState,'COMMIT_UNKNOWN');
  assert.equal(r.state.appends,0);assert.equal(ledger(dir).state,'RESERVED');
  const again=run(dir);assert.equal(again.result.commitState,'COMMIT_UNKNOWN');assert.equal(again.state.appends,0);});
});
test('M4 stale READY envelope with existing event cannot fabricate a receipt or append',()=>withDir(dir=>{
 const old=read(dir,'ledger');assert.equal(run(dir).result.ok,true);
 write(dir,'ledger',old);const r=run(dir);assert.equal(r.result.commitState,'COMMIT_UNKNOWN');
 assert.equal(r.result.reason,'LEGACY_RECEIPT_RECONCILE_REQUIRED');assert.equal(r.state.appends,0);
 assert.equal(read(dir,'live').length,5);
}));
test('M4 flush/readback/verified-receipt acknowledgement failures reconcile without another append',()=>{
 for(const opts of [{failFlush:true},{failReadback:true},{failVerified:true}])withDir(dir=>{
  const x=child(dir,opts);assert.equal(x.result.commitState,'COMMIT_UNKNOWN');assert.equal(x.result.writes,null);
  const r=child(dir,{},'reconcile');assert.equal(r.result.commitState,'COMMITTED_VERIFIED');assert.equal(r.state.appends,0);
  assert.equal(r.result.receipt.batch_id,'M4_EXEC_001');assert.equal(read(dir,'live').length,5);
 });
});
}
