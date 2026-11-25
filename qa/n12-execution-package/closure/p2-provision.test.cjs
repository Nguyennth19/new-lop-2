'use strict';
// Delta tests only. No live GAS, real resource IDs, authority or provider calls.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const d=require('../grant-drafts/P2.review.json');
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');
const files=['N7_Core.gs','N8_Core.gs','N9_Core.gs','N11_Receipt.gs','N12_Adapter.gs','N12_Editor.gs','N12_Final.gs'];
const src=files.map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n');
const api=new Function(src+'\nreturn {scope:n12Scope_,digest:n7TestDigest_,scopeDigest:n11M4ScopeDigest_,pins:N12_SETUP_RESOURCE_PINS_,projectPin:N12_PROJECT_SHA_,baseline:N12_SETUP_BASELINE_PINS_,forbidden:N12_FORBIDDEN_IDS_};')();
const roles=Object.keys(api.pins),project='MOCK_PROJECT_IDENTIFIER_00001',resources=Object.fromEntries(roles.map((r,i)=>[r,'MOCK_RESOURCE_IDENTIFIER_'+String(i).padStart(4,'0')]));
// Synthetic ID and exact empty-snapshot pin substitutions; real SHA-256 otherwise.
// Production raw IDs are never included in this test. Grid verification remains actual source.
const pins=new Map([[project,api.projectPin],...roles.map(r=>[resources[r],api.pins[r]])]);
pins.set(JSON.stringify({schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',sheet:resources.P2_TARGET,tab:'15_NhatKy_HanhDong',columns:['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'],rows:[]}),api.baseline.P2);
const u={formatDate:()=> '2026-11-25T07:00:00+07:00',DigestAlgorithm:{SHA_256:'SHA_256'},computeDigest:(_,s)=>(pins.get(s)||sha(s)).match(/../g).map(h=>parseInt(h,16))};
const n=Date.parse('2026-11-25T00:00:00Z'),owner='owner@example.invalid',i={contract:'N7_GAS_TEST_INTENT_V1',environment:'TEST',requestId:'MOCK_REQUEST_001',idempotencyKey:'MOCK_KEY_001',executionId:'MOCK_EXECUTION_001',lessonId:'LAB_MATH_N12_P2',candidateSha256:d.payloadCandidate.candidateSha256,sourceReceiptSha256:d.payloadCandidate.sourceReceiptSha256,sourceRevision:'REV_MOCK_001',targetSpreadsheetId:resources.P2_TARGET,action:'APPEND_TEST_METADATA',tab:'15_NhatKy_HanhDong',rowsDigest:d.payloadCandidate.rowsDigest,grantId:'N12_GRANT_MOCK_001',expectedJournalRows:0};
const s={environment:'N12_DISPOSABLE_SYNTHETIC_ONLY',writesEnabled:true,projectId:project,isolatedSpreadsheetId:resources.P2_TARGET,backupId:resources.P2_BACKUP,allowedOwnerEmail:owner,approvedGrantId:i.grantId,grantIssuedAt:'2026-11-25T00:00:00Z',grantExpiresAt:'2026-11-25T00:10:00Z',approvedBaselineRows:0,journalTab:i.tab,forbiddenSheetIds:[...api.forbidden],proofCase:'P2',approvedIntentDigest:api.digest(i,u),approvedJournalSnapshotDigest:api.baseline.P2};
s.approvedScopeSha256=api.scopeDigest(api.scope(s),u);const c={settings:s,intent:i,secondExecutionId:'MOCK_EXECUTION_002'};
// Source-only provisioner, exact GAS property keys and envelope; never import into live GAS.
const reviewSource=fs.readFileSync(path.join(__dirname,'N12_P2_Provision.review.gs'),'utf8');
const q=new Function(src+'\n'+reviewSource+'\nreturn {binding:n12P2Binding_,provision:n12P2Provision_,context:n12Context_,read:n11M4ReadEnvelope_,current:n11M4GrantCurrent_,dispatch:n12FinalDispatch_,phase:n12FinalPhase_,pinnedDeps:n12P2PinnedDeps_,reviewedDeps:n12P2ReviewedDeps_,issueEntry:N12_P2_Issue,revokeEntry:N12_P2_Revoke};')();
const auth={epoch:'N12_P2_EPOCH_MOCK_001',sourceSha256:sha('review-source'),bindingSha256:''};
auth.bindingSha256=q.binding(c,auth,u);
function fixture({failAfter=0,failEmergencyRevoke=false,drift=false,denied=false,busy=false,clock=n,actor=owner}={}){
 let map=new Map([['N12_SETUP_CONFIG',JSON.stringify({environment:s.environment,projectId:project,ownerEmail:owner,resources})]]),writes=[],opens=[],releases=0;
 const hdr=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
 const grids=Object.fromEntries([resources.P2_TARGET,resources.P2_BACKUP].map(id=>[id,[hdr.slice(),...Array.from({length:150},()=>Array(8).fill(''))]]));if(drift)grids[resources.P2_TARGET][1][0]='DRIFT';
 let appends=0,held=false;
 const sheet=id=>{const grid=grids[id];const last=()=>grid.reduce((n,r,i)=>r.some(x=>x!=='')?i+1:n,0);return {getMaxRows:()=>151,getMaxColumns:()=>8,getFrozenRows:()=>1,getName:()=>s.journalTab,getLastRow:last,getLastColumn:()=>8,getRange:(row,col,count)=>{const cells=()=>grid.slice(row-1,row-1+count).map(r=>r.slice());return {getValues:cells,getDisplayValues:cells,getFormulas:()=>cells().map(r=>r.map(()=>'')),getNumberFormats:()=>cells().map(r=>r.map(()=> '@'))};},appendRow:r=>{assert.equal(id,resources.P2_TARGET);assert.equal(held,true);grid[last()]=[...r];appends++;}};};
 const raw={utilities:u,now:()=>clock,scriptApp:{getScriptId:()=>project},session:{getEffectiveUser:()=>({getEmail:()=>actor})},propertiesService:{getScriptProperties:()=>({getProperty:k=>map.has(k)?map.get(k):null,setProperty:(k,v)=>{assert.equal(held,true);writes.push(k);if(failEmergencyRevoke&&k.startsWith('N12_GRANT_')&&JSON.parse(v).revoked)throw Error('revoke unavailable');map.set(k,v);if(failAfter&&writes.length===failAfter)throw Error('ack lost');}})},lockService:{getScriptLock:()=>({tryLock:()=>{held=!busy;return held;},releaseLock:()=>{held=false;releases++;}})},spreadsheetApp:{openById:id=>{opens.push(id);return {getId:()=>id,getSheets:()=>[sheet(id)],getSheetByName:()=>sheet(id)};},flush:()=>{}},p2Binding:auth,verifyP2Authority:(action,digest,source)=>!denied&&['ISSUE','REVOKE','INITIAL','REPLAY'].includes(action)&&digest===auth.bindingSha256&&source===auth.sourceSha256};
 return {raw,map,writes,opens,releases:()=>releases,appends:()=>appends,grids};
}
const keys=['N12_P2_EPOCH','N12_ATTEMPT_'+s.approvedScopeSha256,'N12_GRANT_'+s.approvedScopeSha256];
const issue=(f,v=c,a=auth)=>q.provision('ISSUE',v,a,f.raw);
const revoke=f=>q.provision('REVOKE',c,auth,f.raw);
test('unbound actual GAS dependencies deny before any property or sheet call',()=>{const f=fixture();delete f.raw.verifyP2Authority;assert.equal(issue(f).reason,'P2_PROVISION_HARD_OFF');assert.deepEqual(f.writes,[]);assert.deepEqual(f.opens,[]);});
test('exact READY envelope and grant read by existing N12/M4, grant last',()=>{const f=fixture(),r=issue(f);assert.equal(r.ok,true);assert.equal(r.writes,0);assert.deepEqual(f.writes,keys);assert.deepEqual(f.opens,[resources.P2_TARGET,resources.P2_BACKUP]);const ctx=q.context(f.raw,s);assert.equal(q.read(ctx.store,ctx.sha,u).state,'READY');assert.equal(q.current(ctx.deps,ctx),true);assert.equal(f.releases(),1);const before=f.writes.length;assert.equal(issue(f).ok,false);assert.equal(f.writes.length,before);});
test('changed binding, authority, actor, lock, clock, drift and existing epoch refuse all mutations',()=>{for(const opts of [{denied:true},{actor:'other@example.invalid'},{busy:true},{clock:n+600000},{drift:true}]){const f=fixture(opts);assert.equal(issue(f).ok,false);assert.deepEqual(f.writes,[]);}let f=fixture();assert.equal(issue(f,{...c,secondExecutionId:'MOCK_EXECUTION_003'}).ok,false);assert.deepEqual(f.writes,[]);for(const key of keys){f=fixture();f.map.set(key,'existing');assert.equal(issue(f).ok,false);assert.deepEqual(f.writes,[]);}});
test('lost ack after each property write stops, grant last, emergency revoke blocks initial',()=>{
 for(const j of [1,2,3]){
  let f=fixture({failAfter:j}),r=issue(f);
  assert.equal(r.reason,'P2_PROPERTY_ACK_UNKNOWN');assert.equal(r.retryAllowed,false);assert.equal(r.executionAllowed,false);
  assert.deepEqual(f.writes,j===3?keys.concat(keys[2]):keys.slice(0,j));
  assert.equal(f.map.has(keys[2]),j===3);assert.equal(r.revocationState,j===3?'REVOKED':'NOT_REQUIRED_BEFORE_GRANT_WRITE');
  const before=f.writes.length;assert.equal(issue(f).ok,false);assert.equal(f.writes.length,before);
  assert.equal(q.dispatch('INITIAL',c,f.raw).ok,false);assert.equal(f.appends(),0);
  if(j===3){assert.equal(JSON.parse(f.map.get(keys[2])).revoked,true);assert.equal(revoke(f).propertyWrites,0);}
 }
});
test('uncertain grant and unavailable emergency revoke are explicitly blocked for operator; preserve evidence',()=>{
 const f=fixture({failAfter:3,failEmergencyRevoke:true}),r=issue(f);
 assert.equal(r.reason,'P2_PROPERTY_ACK_UNKNOWN');assert.equal(r.revocationState,'UNCONFIRMED');assert.equal(r.executionAllowed,false);assert.equal(r.retryAllowed,false);
 assert.equal(f.appends(),0);assert.equal(JSON.parse(f.map.get(keys[1])).body.state,'READY');
 assert.equal(JSON.parse(f.map.get(keys[2])).revoked,false); // Provider remains uncertain; operator MUST NOT execute.
 assert.equal(issue(f).ok,false);assert.equal(f.appends(),0);
});

test('revoke even with corrupted/missing attempt and expiry; repeat zero writes',()=>{for(const bad of [null,'corrupt']){let f=fixture();assert.equal(issue(f).ok,true);if(bad===null)f.map.delete(keys[1]);else f.map.set(keys[1],bad);f.raw.now=()=>n+700000;const epoch=f.map.get(keys[0]);assert.equal(revoke(f).ok,true);assert.equal(f.map.get(keys[0]),epoch);assert.equal(f.map.has(keys[1])?f.map.get(keys[1]):null,bad);assert.equal(JSON.parse(f.map.get(keys[2])).revoked,true);assert.equal(revoke(f).propertyWrites,0);assert.deepEqual(f.writes,keys.concat(keys[2]));assert.equal(q.current(q.context(f.raw,s).deps,q.context(f.raw,s)),false);}});

test('actual P2 final dispatcher denies grant without exact authority and epoch before sheet or property mutation',()=>{
 for(const mode of ['missing-verifier','wrong-second-id','missing-epoch','changed-epoch','wrong-source','wrong-action']){
  const f=fixture();assert.equal(issue(f).ok,true);
  const before=[f.writes.length,f.opens.length];let v=c;
  if(mode==='missing-verifier')delete f.raw.verifyP2Authority;
  if(mode==='wrong-second-id')v={...c,secondExecutionId:'MOCK_EXECUTION_003'};
  if(mode==='missing-epoch')f.map.delete(keys[0]);
  if(mode==='changed-epoch')f.map.set(keys[0],'{}');
  if(mode==='wrong-source')f.raw.p2Binding={...auth,sourceSha256:sha('wrong')};
  if(mode==='wrong-action')f.raw.verifyP2Authority=action=>action==='ISSUE';
  const r=q.dispatch('INITIAL',v,f.raw);assert.equal(r.reason,'P2_EXECUTION_BINDING_DENIED',mode);assert.equal(r.writes,0);assert.deepEqual([f.writes.length,f.opens.length],before);assert.equal(f.appends(),0);
 }
});
test('provision to actual dispatcher INITIAL and REPLAY same original batch, no second append, revoke stops',()=>{
 const f=fixture();assert.equal(issue(f).ok,true);
 const first=q.dispatch('INITIAL',c,f.raw);assert.equal(first.commitState,'COMMITTED_VERIFIED');assert.equal(first.writes,1);assert.equal(first.receipt.batch_id,i.executionId);
 const before=f.writes.length;const second=q.dispatch('REPLAY',c,f.raw);assert.equal(second.commitState,'COMMITTED_VERIFIED');assert.equal(second.writes,0);assert.equal(second.receipt.batch_id,i.executionId);assert.equal(second.receipt.executionId,c.secondExecutionId);assert.equal(f.appends(),1);assert.equal(f.writes.length,before);assert.equal(before,5);
 assert.equal(q.dispatch('INITIAL',c,f.raw).ok,false);assert.equal(revoke(f).ok,true);assert.equal(q.dispatch('REPLAY',c,f.raw).ok,false);assert.equal(f.appends(),1);assert.equal(f.writes.length,before+1);
});
test('authority lost after reservation: no append, no retry, preserve RESERVED',()=>{
 const f=fixture();assert.equal(issue(f).ok,true);
 const verify=f.raw.verifyP2Authority;
 f.raw.verifyP2Authority=(action,...args)=>!(action==='INITIAL'&&JSON.parse(f.map.get(keys[1])).body.state==='RESERVED')&&verify(action,...args);
 const r=q.dispatch('INITIAL',c,f.raw);assert.equal(r.commitState,'COMMIT_UNKNOWN');assert.equal(f.appends(),0);assert.equal(JSON.parse(f.map.get(keys[1])).body.state,'RESERVED');assert.equal(q.dispatch('INITIAL',c,f.raw).ok,false);assert.equal(f.appends(),0);
});

test('private phase cannot bypass reviewed dispatcher binding; default live wrappers hard OFF',()=>{
 const f=fixture();assert.equal(issue(f).ok,true);assert.equal(q.phase('INITIAL',s,i,f.raw).reason,'P2_EXECUTION_BINDING_DENIED');assert.equal(f.appends(),0);
 assert.equal(q.issueEntry().reason,'P2_PROVISION_HARD_OFF');assert.equal(q.revokeEntry().reason,'P2_PROVISION_HARD_OFF');
 const raw={utilities:u};assert.equal(q.reviewedDeps(raw,c),raw);
});
test('source pin binds explicit dual receipt references and exact actions; no signature claim',()=>{
 const f=fixture(),raw={...f.raw};delete raw.verifyP2Authority;delete raw.p2Binding;
 const pin={binding:auth,ownerReceiptSha256:sha('mock owner receipt'),qaReceiptSha256:sha('mock independent qa receipt'),actions:['ISSUE','INITIAL','REPLAY','REVOKE']};
 for(const bad of [null,{...pin,qaReceiptSha256:pin.ownerReceiptSha256},{...pin,actions:['ISSUE']},{...pin,binding:{...auth,bindingSha256:sha('bad')}}])assert.equal(q.pinnedDeps(raw,c,bad),raw);
 const bound=q.pinnedDeps(raw,c,pin);assert.equal(bound.verifyP2Authority('INITIAL',auth.bindingSha256,auth.sourceSha256),true);assert.equal(bound.verifyP2Authority('REPLAY',sha('bad'),auth.sourceSha256),false);assert.equal(bound.verifyP2Authority('RELEASE',auth.bindingSha256,auth.sourceSha256),false);
 assert.equal(q.provision('ISSUE',c,auth,bound).ok,true);assert.equal(q.dispatch('INITIAL',c,bound).writes,1);assert.equal(q.dispatch('REPLAY',c,bound).writes,0);assert.equal(q.provision('REVOKE',c,auth,bound).ok,true);assert.equal(f.appends(),1);
});
