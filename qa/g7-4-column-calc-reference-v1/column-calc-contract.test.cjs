'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {validate,publicPlan,computeServerOnly,checkAnswers,chooseRenderer}=require('./column-calc-contract.cjs');
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};const ok=(a,m)=>{assert.ok(a,m);checks++};
const manifest=JSON.parse(fs.readFileSync('qa/g7-4-column-calc-reference-v1/source-lock.v1.json','utf8'));
eq(manifest.sourceFiles.length,6);eq(manifest.visualReference.originalAdvancedHTMLLocated,false);
for(const f of manifest.sourceFiles){
 const src=fs.readFileSync(f.path),snap=fs.readFileSync(f.snapshot);
 eq(src.equals(snap),true,'byte exact '+f.path);
 const gitBlobSha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+snap.length+'\0'),snap])).digest('hex');
 eq(gitBlobSha,f.blobSha,'SHA '+f.path);
}
const cases=[
['ADD','PV100',47,25,72,[2,7],1],
['ADD','PV100',39,22,61,[1,6],1],
['ADD','PV100',24,13,37,[7,3],0],
['ADD','PV1000',356,128,484,[4,8,4],1],
['ADD','PV1000',402,187,589,[9,8,5],0],
['ADD','PV1000',475,428,903,[3,0,9],1],
['SUBTRACT','PV100',73,28,45,[5,4],1],
['SUBTRACT','PV100',83,21,62,[2,6],0],
['SUBTRACT','PV1000',402,187,215,[5,1,2],2],
['SUBTRACT','PV1000',536,128,408,[8,0,4],1],
['SUBTRACT','PV100',12,11,1,[1,0],0],
['SUBTRACT','PV1000',100,99,1,[1,0,0],2]
];
const places=['ones','tens','hundreds','thousands'];
for(let i=0;i<cases.length;i++){
 const [operation,profile,a,b,answer,expectedDigits,expectedEvents]=cases[i];
 const spec={variantId:'COL_CASE_'+String(i).padStart(3,'0'),level:'LV2',operation,profile,a,b,assetId:null};
 const p=publicPlan(spec),grade=computeServerOnly(spec);
 eq(p.ok,true);eq(grade.ok,true);eq(grade.result,answer);eq(grade.digits,expectedDigits);
 eq(p.answerIncluded,false);eq(p.layout.inputOrder[0],'ones');
 eq(p.layout.displayOrder[0],profile==='PV100'?'tens':'hundreds');
 eq(p.resultInputs.every(x=>x.value===null),true);
 const counts=(operation==='ADD'?grade.carry:grade.borrow).filter(x=>x.outgoing===1).length;
 eq(counts,expectedEvents,'carry/borrow '+i);
 const values=Object.fromEntries(grade.digits.map((x,j)=>['result_'+places[j],j>=String(answer).length?'':String(x)]));
 eq(checkAnswers(spec,values).allCorrect,true,'answers '+i);
 eq(checkAnswers(spec,{...values,result_ones:'9'}).allCorrect,expectedDigits[0]===9,'wrong units '+i);
 const kind=operation==='ADD'?'carry':'borrow';
 const expectedTransition=operation==='ADD'?grade.carry:grade.borrow;
 for(let k=1;k<expectedTransition.length;k++)values[kind+'_'+places[k]]=String(expectedTransition[k].incoming);
 eq(checkAnswers(spec,values,{gradeTransitions:true}).allCorrect,true);
 if(expectedTransition.length>1){
  const corrupted={...values,[kind+'_'+places[1]]:String(1-expectedTransition[1].incoming)};
  eq(checkAnswers(spec,corrupted,{gradeTransitions:true}).allCorrect,false);
 }
}
const negatives=[
{operation:'ADD',profile:'PV100',a:70,b:45},
{operation:'ADD',profile:'PV1000',a:999,b:1},
{operation:'SUBTRACT',profile:'PV100',a:21,b:37},
{operation:'SUBTRACT',profile:'PV1000',a:110,b:470},
{operation:'ADD',profile:'PV1000_BOUNDARY',a:999,b:1},
{operation:'DIV',profile:'PV100',a:21,b:3},
{operation:'ADD',profile:'PV100',a:1.5,b:2},
{operation:'ADD',profile:'PV100',a:12,b:2,assetId:'Mango'},
{operation:'SUBTRACT',profile:'PV100',a:21,b:2,answer:19},
{operation:'ADD',profile:'PV1000',a:356,b:128,level:'LV9'}
];
for(let i=0;i<negatives.length;i++){
 const spec={variantId:'COL_BAD_'+String(i).padStart(3,'0'),level:'LV1',assetId:null,...negatives[i]};
 eq(validate(spec).ok,false,'reject '+i);
}
const primary={variantId:'COL_ROUTING_01',level:'LV2',operation:'ADD',profile:'PV100',a:47,b:25,assetId:null};
eq(chooseRenderer(primary,{primaryAvailable:true,primaryQaApproved:true}).renderer,'REFERENCE_PRIMARY');
eq(chooseRenderer(primary,{}).ok,false);
eq(chooseRenderer(primary,{explicitDegradedConsent:true,fallbackQaApproved:true}).renderer,'V2_PLACE_VALUE_GRID');
eq(chooseRenderer({...primary,operation:'SUBTRACT'},{explicitDegradedConsent:true,fallbackQaApproved:true}).ok,false);
eq(chooseRenderer({...primary,profile:'PV1000'},{explicitDegradedConsent:true,fallbackQaApproved:true}).ok,false);
eq(chooseRenderer({...primary,variantId:'COL_REF_2',a:3},{explicitDegradedConsent:true,fallbackQaApproved:true}).ok,false);
// Deterministic grid covers carry and borrow transitions without touching browser/user data.
let arithmeticCases=0;
for(const op of ['ADD','SUBTRACT'])for(const [profile,max] of [['PV100',99],['PV1000',999]]){
 for(let a=0;a<=max;a+=max===99?1:13)for(let b=0;b<=max;b+=max===99?1:17){
  const spec={variantId:'COL_MATRIX_1',level:'LV3',operation:op,profile,a,b,assetId:null};
  const valid=(op==='ADD'?a+b<=max:a>=b);
  const result=validate(spec);eq(result.ok,valid);
  if(valid){
   arithmeticCases++;
   const grade=computeServerOnly(spec);
   eq(grade.result,op==='ADD'?a+b:a-b);
   eq(grade.digits.reduce((sum,d,i)=>sum+d*10**i,0),grade.result);
   const p=publicPlan(spec);eq(p.resultInputs.every(x=>x.value===null),true);
  }
 }
}
const oldV2=fs.readFileSync('qa/g7-4-structured-diagrams-v2/structured-diagram-core.cjs','utf8');
ok(oldV2.includes('PLACE_VALUE_ADDITION'),'fallback source available');
console.log('PASS '+checks+'/'+checks+' assertions, '+arithmeticCases+' valid arithmetic pairs; 6 exact Git blob snapshots, RTL, carry/borrow and fallback guards');
