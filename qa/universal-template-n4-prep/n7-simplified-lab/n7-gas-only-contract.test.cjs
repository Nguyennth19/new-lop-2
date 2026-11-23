'use strict';
// N7 simplified GAS/Sheets/Drive/Docs/GitHub design-only, offline synthetic test.
// No Apps Script runtime, network, Sheet, Drive, production credentials or release.
const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const TEST_SHEET='1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs';
const grant=()=>({id:'GR_TEST_001',environment:'TEST',sheet:TEST_SHEET,expiresAt:500,revoked:false,actor:'GAS_GATEWAY',tabs:['12_KetQua_Validator','13_PheDuyet','14_PhienBan_JSON','15_NhatKy_HanhDong','16_Rollback'],limit:2});
const intent=()=>({requestId:'LAB0001',idempotencyKey:'KEY0001',lessonId:'LAB_MATH_PILOT_A',environment:'TEST',sheet:TEST_SHEET,tab:'12_KetQua_Validator',action:'APPEND_TEST_METADATA',candidateSha:'a'.repeat(64),sourceSha:'b'.repeat(64),expectedRevision:1,rowsDigest:'c'.repeat(64),grantId:'GR_TEST_001'});
function digest(i){return sha(i)}
const deny=reason=>({ok:false,reason,writeCount:0});
class MockScriptGateway{
 constructor(){this.rev=1;this.active='NONE';this.journal=new Map();this.projection=new Map();this.status=new Map();this.grant=grant();this.lock=false;this.outsideChanged=false;}
 authorize(i,options={}){
  const g=this.grant;
  if(options.humanSigned!==true||options.n5Closed!==true||options.n0Ack!==true)return deny('HUMAN_GATE');
  if(i.sheet!==TEST_SHEET||i.environment!=='TEST'||i.action!=='APPEND_TEST_METADATA'||i.tab==='10_DanhMuc_Bai'||i.tab==='11_YeuCau_Data'||!g.tabs.includes(i.tab))return deny('TARGET_NOT_ALLOWED');
  if(!g||g.id!==i.grantId||g.revoked||g.expiresAt<=(options.now??100)||g.actor!==(options.actor??'GAS_GATEWAY'))return deny('NO_VALID_GRANT');
  if(options.approvalFromCell===true||options.candidateFromAI===true)return deny('UNTRUSTED_APPROVAL');
  if(i.publicAnswerKey||i.studentId)return deny('PRIVATE_FIELD');
  return {ok:true};
 }
 attempt(i,opts={}){
  const auth=this.authorize(i,opts);if(!auth.ok)return auth;
  if(this.lock)return deny('LOCK_TIMEOUT');
  this.lock=true;
  try{
   const d=digest(i),prior=this.journal.get(i.idempotencyKey);
   if(prior){
    if(prior.digest!==d)return deny('IDEMPOTENCY_CONFLICT');
    if(prior.state==='VERIFIED'&&this.projection.get(prior.eventId)===d)return {ok:true,duplicate:true,eventId:prior.eventId,writeCount:0};
    return deny('RECONCILE_REQUIRED');
   }
   if(i.expectedRevision!==this.rev||this.outsideChanged)return deny('STALE_OR_OUTSIDE_EDIT');
   const eventId='LAB_EVENT_'+i.requestId;
   this.journal.set(i.idempotencyKey,{digest:d,eventId,state:'PENDING'});
   if(opts.failAfterIntent)return deny('RECONCILE_REQUIRED');
   this.projection.set(eventId,d);
   if(opts.failAfterProjection)return deny('RECONCILE_REQUIRED');
   if(this.projection.get(eventId)!==d)return deny('READBACK_MISMATCH');
   this.journal.get(i.idempotencyKey).state='VERIFIED';
   this.rev++;
   return {ok:true,eventId,writeCount:1,release:false};
  }finally{this.lock=false;}
 }
 reconcile(key){
  const record=this.journal.get(key);if(!record)return deny('UNKNOWN_INTENT');
  const present=this.projection.get(record.eventId);
  if(present&&present!==record.digest)return deny('JOURNAL_TAMPER');
  if(!present)return deny('RECONCILE_REQUIRED');
  record.state='VERIFIED';this.rev++;
  return {ok:true,eventId:record.eventId,writeCount:0,release:false};
 }
 manualRollback({owner,qa,expectedRevision,target}){
  if(!owner||!qa||owner===qa)return deny('HUMAN_ROLLBACK');
  if(expectedRevision!==this.rev||target!=='SNAPSHOT_TEST_ONLY')return deny('ROLLBACK_STALE_OR_UNKNOWN');
  return {ok:true,mode:'PLAN_ONLY',writeCount:0,active:this.active};
 }
}
const signed={humanSigned:true,n5Closed:true,n0Ack:true};
test('SIM-T01 F01 intent/project partial failure reconciles before commit (mock)',()=>{
 const w=new MockScriptGateway(),i=intent();
 assert.equal(w.attempt(i,{...signed,failAfterIntent:true}).reason,'RECONCILE_REQUIRED');
 assert.equal(w.attempt(i,signed).reason,'RECONCILE_REQUIRED');
 assert.equal(w.active,'NONE');
 const x=new MockScriptGateway();
 assert.equal(x.attempt(i,{...signed,failAfterProjection:true}).reason,'RECONCILE_REQUIRED');
 assert.equal(x.reconcile('KEY0001').writeCount,0);
 assert.equal(x.projection.size,1);
});
test('SIM-T02 F02 outsider changes block future append but cannot be prevented by lock',()=>{
 const w=new MockScriptGateway();w.outsideChanged=true;
 assert.equal(w.attempt(intent(),signed).reason,'STALE_OR_OUTSIDE_EDIT');
 assert.equal(w.journal.size,0);
});
test('SIM-T03 F03 duplicate same digest vs altered payload/target conflict',()=>{
 const w=new MockScriptGateway(),i=intent();
 assert.equal(w.attempt(i,signed).ok,true);
 assert.equal(w.attempt(i,signed).duplicate,true);
 assert.equal(w.attempt({...i,rowsDigest:'d'.repeat(64)},signed).reason,'IDEMPOTENCY_CONFLICT');
 assert.equal(w.projection.size,1);
});
test('SIM-T04 F04 typed APPROVED and fake AI approval refused',()=>{
 const w=new MockScriptGateway();
 assert.equal(w.attempt(intent(),{...signed,approvalFromCell:true}).reason,'UNTRUSTED_APPROVAL');
 assert.equal(w.attempt(intent(),{...signed,candidateFromAI:true}).reason,'UNTRUSTED_APPROVAL');
});
test('SIM-T05 F05 missing N5/N0/real human signature refuses grant',()=>{
 for(const changes of [{n5Closed:false},{n0Ack:false},{humanSigned:false}]){
  const w=new MockScriptGateway();
  assert.equal(w.attempt(intent(),{...signed,...changes}).reason,'HUMAN_GATE');
 }
});
test('SIM-T06 F06 wrong tab/target/operation denied',()=>{
 for(const changes of [{tab:'10_DanhMuc_Bai'},{tab:'11_YeuCau_Data'},{tab:'04_Cau_hoi'},{sheet:'ORIGINAL_SOURCE'},{action:'UPDATE'},{environment:'MAIN'}]){
  const w=new MockScriptGateway();assert.equal(w.attempt({...intent(),...changes},signed).reason,'TARGET_NOT_ALLOWED');
 }
});
test('SIM-T07 F07 stale revision and local lock contention rejected',()=>{
 let w=new MockScriptGateway();assert.equal(w.attempt({...intent(),expectedRevision:0},signed).reason,'STALE_OR_OUTSIDE_EDIT');
 w.lock=true;assert.equal(w.attempt(intent(),signed).reason,'LOCK_TIMEOUT');
});
test('SIM-T08 F08 tampered projected digest fails reconciliation',()=>{
 const w=new MockScriptGateway(),i=intent();
 w.attempt(i,{...signed,failAfterProjection:true});
 w.projection.set('LAB_EVENT_LAB0001','bad');
 assert.equal(w.reconcile('KEY0001').reason,'JOURNAL_TAMPER');
});
test('SIM-T09 F09 unsigned and stale rollback never changes ACTIVE',()=>{
 const w=new MockScriptGateway();
 assert.equal(w.manualRollback({owner:'O',qa:'O',expectedRevision:1,target:'SNAPSHOT_TEST_ONLY'}).ok,false);
 assert.equal(w.manualRollback({owner:'O',qa:'Q',expectedRevision:0,target:'SNAPSHOT_TEST_ONLY'}).ok,false);
 assert.equal(w.manualRollback({owner:'O',qa:'Q',expectedRevision:1,target:'SNAPSHOT_TEST_ONLY'}).active,'NONE');
});
test('SIM-T10 F10 private key/student ID refused',()=>{
 for(const changes of [{publicAnswerKey:'42'},{studentId:'child'}]){
  const w=new MockScriptGateway();assert.equal(w.attempt({...intent(),...changes},signed).reason,'PRIVATE_FIELD');
 }
});
test('SIM-T11 F11 revoked/expired/wrong grant actor refused',()=>{
 const w=new MockScriptGateway();w.grant.revoked=true;
 assert.equal(w.attempt(intent(),signed).reason,'NO_VALID_GRANT');
 w.grant.revoked=false;
 assert.equal(w.attempt(intent(),{...signed,now:501}).reason,'NO_VALID_GRANT');
 assert.equal(w.attempt(intent(),{...signed,actor:'UNTRUSTED'}).reason,'NO_VALID_GRANT');
 assert.equal(w.attempt({...intent(),grantId:'OTHER'},signed).reason,'NO_VALID_GRANT');
});
test('SIM-T12 F12 source mock never implies human/integration/ACTIVE release',()=>{
 const w=new MockScriptGateway();
 const result=w.attempt(intent(),signed);
 assert.equal(result.ok,true);assert.equal(result.release,false);assert.equal(w.active,'NONE');
 assert.equal('GAS_TEST_INTEGRATION_PASS' in result,false);
});
test('GLOBAL: this module models no Apps Script credential, calls or TEST writes',()=>{
 const w=new MockScriptGateway();
 assert.equal(w.projection.size,0);assert.equal(w.active,'NONE');
 assert.equal(w.attempt(intent(),{}).writeCount,0);
});
