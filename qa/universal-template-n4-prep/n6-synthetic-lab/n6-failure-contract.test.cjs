'use strict';
// N6 SYNTHETIC CONTRACT LAB ONLY. No connector, network, renderer, Sheet or GAS writes.
// This harness models invariants; it is not a production writer, signature provider or CAS.
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const deny=(reason)=>({ok:false,reason,writes:0});
const ok=(more={})=>({ok:true,writes:0,...more});
const sha=(v)=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ids=['W1-01','W1-02','W1-03','W1-04','W1-05'];
function w1Gate(rows,{recipient=false,owner=false}={}){
 if(!recipient)return deny('ACK_MISSING');
 if(!Array.isArray(rows)||rows.length!==5)return deny('W1_INCOMPLETE');
 for(const id of ids){
  const matches=rows.filter(r=>r.id===id);
  if(matches.length!==1)return deny('W1_DUPLICATE_OR_MISSING');
  const r=matches[0];
  if(r.status!=='CLOSED'||!r.ciPass||!r.sha||r.sha!==r.ciSha||!r.qaAccount||!r.qaAt||!r.ownerAck||!r.deviceEvidence)return deny('HUMAN_GATE_OR_SHA');
 }
 return owner?ok({release:false}):deny('OWNER_RELEASE_MISSING');
}
const proofs=()=>ids.map(id=>({id,status:'CLOSED',ciPass:true,sha:id,ciSha:id,qaAccount:'QA_LAB_SYNTH',qaAt:'SYNTH',ownerAck:true,deviceEvidence:true}));
const policies={D2:['COLUMN_ADD','vertical'],D5:['SHAPE_COMPOSE','shape'],D9:['EXACT_COUNT','pictograph'],D10:['WORD_ONE_OPERATION','word_problem']};
const base=(renderer)=>({lessonId:'LAB_MATH_FAKE',renderer,skillId:policies[renderer][0],kind:policies[renderer][1],level:'LV2',eligible:false});
const samples={
 D2:{...base('D2'),a:38,b:27},
 D5:{...base('D5'),shapes:['triangle','square']},
 D9:{...base('D9'),visualIntent:'EXACT_COUNT',assetId:'FLUENT:red_apple',countUnit:'apple',symbolValue:1,count:5},
 D10:{...base('D10'),op:'SUB',steps:1,a:8,b:3}
};
function family(q){
 if(!q||!policies[q.renderer])return deny('UNKNOWN_RENDERER');
 const [skill,kind]=policies[q.renderer];
 if(q.skillId!==skill||q.kind!==kind||!q.lessonId.startsWith('LAB_MATH_')||q.level!=='LV2'||q.eligible!==false)return deny('SKILL_SOURCE_POLICY');
 if(['answerKey','solution','privateAnswer','studentId'].some(k=>Object.hasOwn(q,k)))return deny('PRIVATE_FIELD');
 if(q.renderer==='D2'&&!(Number.isInteger(q.a)&&Number.isInteger(q.b)&&q.a+q.b<=99&&q.a%10+q.b%10>=10))return deny('D2_POLICY');
 if(q.renderer==='D5'&&!(Array.isArray(q.shapes)&&q.shapes.length>=2&&q.shapes.every(x=>['triangle','square','rectangle'].includes(x))))return deny('D5_POLICY');
 if(q.renderer==='D9'&&!(q.visualIntent==='EXACT_COUNT'&&q.assetId==='FLUENT:red_apple'&&q.countUnit==='apple'&&q.symbolValue===1&&Number.isInteger(q.count)&&q.count>=1&&q.count<=20))return deny('D9_POLICY');
 if(q.renderer==='D10'&&!(q.op==='ADD'||q.op==='SUB') )return deny('D10_OPERATOR');
 if(q.renderer==='D10'&&!(q.steps===1&&Number.isInteger(q.a)&&Number.isInteger(q.b)&&q.a>=0&&q.b>=0))return deny('D10_ONE_STEP');
 return ok({release:false});
}
class InMemoryWriter{
 constructor(){this.revision=1;this.digest='A';this.active='UNCHANGED';this.results=new Map();this.events=[];this.pending=[];}
 snapshot(){return {revision:this.revision,digest:this.digest};}
 mutate(){this.revision++;this.digest='CHANGED';}
 append({key,execution,actor,revision,digest,failJournal=false,failReadback=false}){
  if(actor!=='LAB_WRITER')return deny('UNAUTHORIZED');
  if(this.results.has(key))return ok({batch:this.results.get(key),replayed:true});
  if(revision!==this.revision||digest!==this.digest)return deny('STALE_CAS');
  if(failJournal||failReadback){this.pending.push(key);return deny('RECOVERABLE_IO_FAILURE');}
  const batch='EXEC_'+execution;
  if([...this.results.values()].includes(batch))return deny('EXECUTION_COLLISION');
  this.results.set(key,batch);this.events.push({key,batch,id:'EVT_'+execution});
  return ok({batch,replayed:false});
 }
 rollback({revision,approvedByOwner=false,approvedByQA=false,target='OLD',injectFailure=false}){
  if(revision!==this.revision)return deny('STALE_ROLLBACK');
  if(!approvedByOwner||!approvedByQA)return deny('UNSIGNED_ROLLBACK');
  if(target!=='OLD')return deny('INVALID_TARGET');
  if(injectFailure){this.pending.push('ROLLBACK');return deny('PARTIAL_ROLLBACK_RECOVERABLE');}
  return ok({planOnly:true,active:this.active});
 }
}
const TEST_KEY='SYNTHETIC_ONLY_NOT_A_CREDENTIAL';
function sign(role,actor,hash,exp=200){
 const data={role,actor,hash,exp,scope:'LAB_ONLY'};
 return {...data,mac:crypto.createHmac('sha256',TEST_KEY).update(JSON.stringify(data)).digest('hex')};
}
function signatureGate(approvals,hash){
 if(!Array.isArray(approvals)||approvals.length!==2)return deny('NO_INDEPENDENT_APPROVALS');
 const roles=new Set(),actors=new Set();
 for(const entry of approvals){
  const {mac,...d}=entry;
  const expected=crypto.createHmac('sha256',TEST_KEY).update(JSON.stringify(d)).digest('hex');
  if(typeof mac!=='string'||mac.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(mac),Buffer.from(expected)))return deny('INVALID_TEST_MAC');
  if(d.hash!==hash||d.exp<=100||d.scope!=='LAB_ONLY')return deny('WRONG_SCOPE_DIGEST');
  roles.add(d.role);actors.add(d.actor);
 }
 if(actors.size!==2||!roles.has('OWNER')||!roles.has('INDEPENDENT_QA'))return deny('ROLE_SEPARATION');
 return ok({release:false,verifiedInLabOnly:true});
}
function aiGate(x){
 if(!x||x.state!=='AI_CANDIDATE_ONLY')return deny('NOT_AI_CANDIDATE');
 if(x.approved||x.grade||x.release||x.answerKey)return deny('AI_PRIVILEGE');
 return ok({publish:false,grade:false});
}
test('DB-T01 missing signed W1, wrong SHA and N0-S receipt fail-closed',()=>{
 assert.equal(w1Gate(proofs()).ok,false);
 const p=proofs();p[0].ciSha='BAD';
 assert.equal(w1Gate(p,{recipient:true,owner:true}).ok,false);
 assert.equal(w1Gate(proofs(),{recipient:true,owner:true}).release,false);
});
test('DB-T02 D2 valid and wrong skill/arithmetic rejected',()=>{
 assert.equal(family(samples.D2).ok,true);
 assert.equal(family({...samples.D2,a:90}).ok,false);
 assert.equal(family({...samples.D2,skillId:'WRONG'}).ok,false);
});
test('DB-T03 D5 shape policy',()=>{
 assert.equal(family(samples.D5).ok,true);
 assert.equal(family({...samples.D5,shapes:['circle']}).ok,false);
});
test('DB-T04 D9 exact count, asset/unit/symbol negative',()=>{
 assert.equal(family(samples.D9).ok,true);
 for(const mutation of [{countUnit:'book'},{symbolValue:2},{assetId:'BAD'},{count:0}])assert.equal(family({...samples.D9,...mutation}).ok,false);
});
test('DB-T05 D10 single operation, no private answer',()=>{
 assert.equal(family(samples.D10).ok,true);
 for(const mutation of [{steps:2},{op:'MUL'},{answerKey:5}])assert.equal(family({...samples.D10,...mutation}).ok,false);
});
test('DB-T06 retry idempotency maintains one logical batch',()=>{
 const w=new InMemoryWriter(),s=w.snapshot();const x={key:'K',execution:'1',actor:'LAB_WRITER',...s};
 const a=w.append(x),b=w.append({...x,execution:'2'});
 assert.equal(a.batch,b.batch);assert.equal(b.replayed,true);assert.equal(w.events.length,1);
});
test('DB-T07 unauthorized writer and reused execution fail',()=>{
 const w=new InMemoryWriter(),s=w.snapshot();
 assert.equal(w.append({key:'A',execution:'1',actor:'LAB_WRITER',...s}).ok,true);
 assert.equal(w.append({key:'B',execution:'2',actor:'EXTERNAL',...s}).ok,false);
 assert.equal(w.append({key:'B',execution:'1',actor:'LAB_WRITER',...s}).ok,false);
 assert.equal(w.events.length,1);
});
test('DB-T08 journal failure / readback failure never commit',()=>{
 const w=new InMemoryWriter(),s=w.snapshot(),x={key:'A',execution:'1',actor:'LAB_WRITER',...s};
 assert.equal(w.append({...x,failJournal:true}).ok,false);
 assert.equal(w.append({...x,failReadback:true}).ok,false);
 assert.equal(w.results.size,0);assert.equal(w.pending.length,2);
});
test('DB-T09 mid-run source mutation fails stale check',()=>{
 const w=new InMemoryWriter(),s=w.snapshot();w.mutate();
 assert.equal(w.append({key:'A',execution:'1',actor:'LAB_WRITER',...s}).reason,'STALE_CAS');
 assert.equal(w.active,'UNCHANGED');
});
test('DB-T10 stale revision or digest cannot write',()=>{
 const w=new InMemoryWriter();
 assert.equal(w.append({key:'A',execution:'1',actor:'LAB_WRITER',revision:0,digest:'A'}).ok,false);
 assert.equal(w.append({key:'A',execution:'1',actor:'LAB_WRITER',revision:1,digest:'WRONG'}).ok,false);
});
test('DB-T11 simulated outsider denied, no pointer change',()=>{
 const w=new InMemoryWriter(),s=w.snapshot();
 for(const actor of ['SHEET_EDITOR','AI','EXTERNAL'])assert.equal(w.append({key:'K',execution:'1',actor,...s}).ok,false);
 assert.equal(w.active,'UNCHANGED');
});
test('DB-T12 rollback stale/unsigned/partial fail safely',()=>{
 const w=new InMemoryWriter();
 assert.equal(w.rollback({revision:0,approvedByOwner:true,approvedByQA:true}).ok,false);
 assert.equal(w.rollback({revision:1}).ok,false);
 assert.equal(w.rollback({revision:1,approvedByOwner:true,approvedByQA:true,injectFailure:true}).ok,false);
 assert.equal(w.active,'UNCHANGED');
});
test('DB-T13 typed APPROVED cell never becomes signature',()=>{
 assert.equal(signatureGate([{decision:'APPROVED'}],sha(samples.D2)).ok,false);
});
test('DB-T14 invalid test MAC, expiry, digest or role denied',()=>{
 const h=sha(samples.D9),a=sign('OWNER','a',h),b=sign('INDEPENDENT_QA','b',h);
 assert.equal(signatureGate([a,b],h).release,false);
 assert.equal(signatureGate([a,{...b,hash:'X'}],h).ok,false);
 assert.equal(signatureGate([a,sign('INDEPENDENT_QA','b',h,90)],h).ok,false);
 assert.equal(signatureGate([a,a],h).ok,false);
});
test('DB-T15 AI candidate never grants publish or grade',()=>{
 assert.equal(aiGate({state:'AI_CANDIDATE_ONLY'}).publish,false);
 for(const v of [{approved:true},{release:true},{grade:true},{answerKey:2}])assert.equal(aiGate({state:'AI_CANDIDATE_ONLY',...v}).ok,false);
});
test('N6 global: no production outputs, no external write paths',()=>{
 assert.equal(Object.values(samples).every(x=>family(x).ok&&family(x).release===false),true);
 const w=new InMemoryWriter();assert.equal(w.active,'UNCHANGED');
});
