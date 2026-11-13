'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const core=require('./column-v12-core.js'),{grade}=require('./column-v12-server-grader.cjs');
const ref=require('../g7-4-column-calc-reference-v1/column-calc-contract.cjs');
const cases=[
['ADD','PV100',47,25,72],['ADD','PV100',24,13,37],['ADD','PV100',39,22,61],
['ADD','PV1000',356,128,484],['ADD','PV1000',475,428,903],['ADD','PV1000',202,307,509],
['ADD','PV1000',599,399,998],['SUBTRACT','PV100',73,28,45],['SUBTRACT','PV100',83,21,62],
['SUBTRACT','PV1000',402,187,215],['SUBTRACT','PV1000',536,128,408],['SUBTRACT','PV1000',100,99,1],
['SUBTRACT','PV1000',800,701,99]
];
const intSpec=(operation,profile,a,b,policy='OPTIONAL_HINT',name='COL_SAMPLE_0000')=>({
 variantId:name,profile,operation,level:'LV2',a,b,carryPolicy:policy,assetId:null,
 ...(policy==='REQUIRED_ASSESSED'?{assessmentAuthority:'LESSON_POLICY_APPROVED'}:{})
});
let assertions=0,variants=0;
const eq=(a,b,msg)=>{assert.deepEqual(a,b,msg);assertions++};
const ok=(a,msg)=>{assert.ok(a,msg);assertions++};
function answerSubmission(spec){
 const e=ref.computeServerOnly({variantId:spec.variantId,profile:spec.profile,operation:spec.operation,
   level:spec.level,a:spec.a,b:spec.b,assetId:null});
 ok(e.ok);
 const n=Math.max(1,String(e.result).length),places=core.PLACES.slice(0,e.digits.length),input={};
 for(let i=0;i<places.length;i++)input['result_'+places[i]]=i<n?String(e.digits[i]):'';
 const transitions=spec.operation==='ADD'?e.carry:e.borrow;
 const prefix=spec.operation==='ADD'?'carry_':'borrow_';
 for(let i=1;i<places.length;i++)input[prefix+places[i]]=Boolean(transitions[i].incoming);
 return input;
}
eq(core.PLACES.slice(0,3),['ones','tens','hundreds']);
for(let i=0;i<cases.length;i++){
 const [op,p,a,b,sum]=cases[i];for(const policy of ['OPTIONAL_HINT','REQUIRED_ASSESSED']){
   const q=intSpec(op,p,a,b,policy,'COL_CASE_'+i+'_'+policy);
   const c=core.publicPlan(q),v=ref.computeServerOnly({...q,assetId:null});
   eq(c.ok,true);eq(c.a.length,p==='PV100'?2:3);eq(v.result,sum);
   eq(c.inputOrder[0],'ones');eq(c.displayOrder[0],p==='PV100'?'tens':'hundreds');
   eq(c.answerSlots.every(x=>x.value===null),true);
   eq(c.transitionSlots.every(x=>x.value===null),true);
   eq(c.gradingEnabled,false);
   ok(!Object.hasOwn(c,'answer')&&!Object.hasOwn(c,'result')&&!Object.hasOwn(c,'correctDigits'));
   const input=answerSubmission(q);
   eq(grade(q,input).pass,true);
   const w={...input,result_ones:input.result_ones==='9'?'8':'9'};
   eq(grade(q,w).pass,false);
   const trans=c.transitionSlots[0]?.id;
   if(trans){const wrong={...input,[trans]:!input[trans]};
     eq(grade(q,wrong).pass,policy==='OPTIONAL_HINT');
     eq(grade(q,{...input,[trans]:'true'}).pass,policy==='OPTIONAL_HINT');
   }
 }
}
const invalid=[
{operation:'DIV'},{profile:'PV200'},{level:'LV4'},{carryPolicy:'MANDATORY'},
{carryPolicy:'REQUIRED_ASSESSED',assessmentAuthority:undefined},
{a:-1},{b:100},{a:70,b:45},{operation:'SUBTRACT',a:21,b:50},
{answer:72},{expectedDigits:[2,7]},{result:72},{assetId:'APPLE'},
{a:999,profile:'PV1000'},{a:999,profile:'PV1000',b:1},
{variantId:'bad'},{a:1.5},{assessmentAuthority:'UNTRUSTED',carryPolicy:'REQUIRED_ASSESSED'}
];
const base=intSpec('ADD','PV100',47,25);
for(const change of invalid)eq(core.validateSpec({...base,...change}).ok,false,'Reject '+JSON.stringify(change));
eq(core.batch([base,base]).ok,false,'duplicate ids');
eq(core.batch([]).ok,false);eq(core.batch(cases.map((x,i)=>intSpec(x[0],x[1],x[2],x[3],'OPTIONAL_HINT','COL_BATCH_'+i))).ok,false,'limit 10');
const archive=fs.readFileSync('qa/g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(archive.length,131767);
eq(crypto.createHash('sha256').update(archive).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
const frozen=archive.toString('utf8');ok(frozen.includes('function renderType2_VerticalCalc(stage)'));ok(frozen.includes("toggleCarry('c2_tens')"));
const view=fs.readFileSync('qa/g7-4-column-calc-reference-v12/column-v12-view.js','utf8');
new vm.Script(view);ok(view.includes('kl-col-v12-transition'));ok(view.includes('kl-col-v12-answer'));ok(!view.includes('require('));
for(const op of ['ADD','SUBTRACT'])for(const profile of ['PV100','PV1000']){
 const cap=profile==='PV100'?99:999,delta=profile==='PV100'?3:31;
 for(let a=0;a<=cap;a+=delta)for(let b=0;b<=cap;b+=delta){
   const sum=op==='ADD'?a+b:a-b;
   const q=intSpec(op,profile,a,b,'REQUIRED_ASSESSED','COL_MATRIX_00001');
   const valid=sum>=0&&sum<=cap;
   const p=core.publicPlan(q);eq(p.ok,valid);
   if(valid){
     variants++;const values=answerSubmission(q);eq(grade(q,values).pass,true);
     eq(grade(q,{...values,result_ones:'X'}).pass,false);
   }
 }
}
console.log('PASS '+assertions+'/'+assertions+' assertions, '+variants+' valid dynamic ADD/SUB variations, original SHA and carry policy');
