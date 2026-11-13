'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {buildB21Bridge}=require('./b21-g5-compatibility-bridge.cjs');
const {createDemo}=require('../composer-fixtures-v1.cjs');
function load(file,name){const code=fs.readFileSync(path.join(__dirname,'../../..',file),'utf8');const ctx=vm.createContext({});vm.runInContext(code,ctx,{timeout:2000});return ctx[name]}
const makeRenderer=load('41_HienThiCauHoiToan.html','taoHienThiCauToan');
const grade=load('26_ChamCauHoiToan.html','danhGiaCauToan');
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=(q,key,width,attrs='')=>'<input data-ml-input="'+E(key)+'" inputmode="numeric" maxlength="'+width+'" '+attrs+'>';
const baseCard=(q,inside,cls='')=>'<article class="ml-card '+E(cls)+'" data-ml-q-card="'+E(q.id)+'">'+inside+'</article>';
const adapter=buildB21Bridge({renderers:makeRenderer({E,input,baseCard}),grade,input,baseCard});
assert.equal(adapter.count,8);assert.equal(adapter.offlineOnly,true);assert.equal(adapter.noWrites,true);
const demo=createDemo(),qa=new Map(demo.report.qa.records.map(x=>[x.questionId,x]));
let checks=0;
for(const q of demo.lesson.questions){
 const level=qa.get(q.id).levelId,rendered=adapter.render(q.id);
 assert.equal(rendered.interactive,true);assert.match(rendered.html,/data-ml-input/);
 assert(!/Chỉ xem trước/.test(rendered.html));assert(!/<script|onerror=|onclick=/i.test(rendered.html));
 const total=String(q.answerSpec.value);
 let valid,invalid;
 if(level==='LV1'){assert.deepEqual(rendered.fields,['answer']);valid={answer:total};invalid={answer:String(Number(total)+1)}}
 else if(level==='LV2'){assert.deepEqual(rendered.fields,['carry','tens','ones']);const a=total.padStart(2,'0');valid={carry:'1',tens:a[0],ones:a[1]};invalid={...valid,carry:'0'}}
 else {assert.deepEqual(rendered.fields,['bridge','answer']);const expected=10-q.parameters.a%10;valid={bridge:String(expected),answer:total};invalid={bridge:String(expected+1),answer:total};assert.match(rendered.html,/data-ml-bridge/)}
 assert.deepEqual(adapter.evaluate(q.id,valid),{correct:true,complete:true});
 assert.deepEqual(adapter.evaluate(q.id,invalid),{correct:false,complete:true});
 assert.deepEqual(adapter.evaluate(q.id,{}),{correct:false,complete:false});
 assert.deepEqual(adapter.evaluate(q.id,{...valid,[rendered.fields[0]]:'<svg/onload=alert(1)>'}),{correct:false,complete:false});
 checks++;
}
assert.throws(()=>adapter.render('UNKNOWN'),/G5_UNKNOWN_ID/);
assert.throws(()=>buildB21Bridge({renderers:{},grade,input,baseCard}),/G5_DEPENDENCIES_REQUIRED/);
console.log('PASS G5 legacy renderer + grader reuse '+checks+'/8; LV3 bridge+total, wrong/blank/malicious cases; OFFLINE_TEST_ONLY');
