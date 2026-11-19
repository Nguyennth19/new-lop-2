#!/usr/bin/env node
'use strict';
// This is an isolated P1.2-B QA preview recipe utility, NOT a deployed generator or grader.
// No published lesson, publicVariant, source-exact admission, renderer grant, or student score write.
const fs=require('node:fs');
const assert=require('node:assert/strict');

function num(seed,salt,mod){return ((Math.imul(seed+salt,1664525)+1013904223)>>>0)%mod}
function make(family,seed){
 const id=family.familyId,rule=family.mathRuleId;let prompt="",right="",wrong=[],context={};
 if(rule==="two_digit_place_value"||rule==="expanded_tens_ones"){
  let t=2+num(seed,1,7),u=1+num(seed,2,8);if(t===u)u=(u%8)+1;const n=t*10+u;context={t,u,n};
  if(rule==="two_digit_place_value"){prompt=`Số gồm ${t} chục và ${u} đơn vị là số nào?`;right=String(n);wrong=[String(n+1),String(n-1),String(u*10+t),String(n+10)];}
  else{prompt=`Số ${n} được viết thành tổng nào?`;right=`${10*t} + ${u}`;wrong=[`${10*t} + ${u+1}`,`${10*(t-1)} + ${u}`,`${10*u} + ${t}`,`${10*(t+1)} + ${u}`];}
 } else if(rule==="predecessor"||rule==="successor"){
  let n=11+num(seed,3,78);context={n};prompt=`Số liền ${rule==="predecessor"?"trước":"sau"} của ${n} là số nào?`;right=String(rule==="predecessor"?n-1:n+1);wrong=[String(n),String(n+2),String(n-2),String(rule==="predecessor"?n+1:n-1)];
 } else if(rule==="addition_terms"){
  let a=12+num(seed,4,28),b=10+num(seed,5,20);if(a===b)b++;let sum=a+b;const role=num(seed,6,3),v=[a,b,sum][role];context={a,b,sum,role,v};prompt=`Trong phép tính ${a} + ${b} = ${sum}, số ${v} được gọi là gì?`;right=role===2?"Tổng":"Số hạng";wrong=["Số hạng","Tổng","Số bị trừ","Hiệu"].filter(x=>x!==right);
 } else if(rule==="subtraction_terms"){
  let a=50+num(seed,7,35),b=11+num(seed,8,18);if(a-b===b)b++;const difference=a-b,role=num(seed,9,3),v=[a,b,difference][role];context={a,b,difference,role,v};prompt=`Trong phép tính ${a} − ${b} = ${difference}, số ${v} được gọi là gì?`;right=["Số bị trừ","Số trừ","Hiệu"][role];wrong=["Số bị trừ","Số trừ","Hiệu","Số hạng"].filter(x=>x!==right);
 } else if(rule==="comparison_more"||rule==="comparison_less"){
  let low=11+num(seed,10,28),difference=3+num(seed,11,19),high=low+difference;context={low,high,difference};
  prompt=rule==="comparison_more"?`Tổ A có ${high} điểm, tổ B có ${low} điểm. Tổ A nhiều hơn tổ B bao nhiêu điểm?`:`Giỏ thứ nhất có ${low} quả cam, giỏ thứ hai có ${high} quả cam. Giỏ thứ nhất ít hơn giỏ thứ hai bao nhiêu quả?`;
  right=String(difference);wrong=[String(difference+1),String(difference-1),String(low+high),String(difference+2)];
 }else throw Error("Unrecognized family rule "+rule);
 const opts=[right,...wrong.filter(x=>x!==right)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,4);
 if(opts.length!==4||!opts.includes(right)||!prompt)throw Error("bad candidate "+family.familyId+" seed "+seed);
 const shift=num(seed,12,4);const arranged=[...opts.slice(shift),...opts.slice(0,shift)];
 const variantId=`PV_${id}_S${seed}`;
 const publicPreview={
  schemaVersion:"g76.public-envelope.v1",
  lessonId:family.lessonId,
  questionId:`P12B_${id}`,
  variantId,
  typeId:family.rendererReferenceCandidate,
  mode:"PRACTICE",
  display:{prompt,publicParameters:{originalMathRule:true,seed,reviewOnly:true,concept:rule},visibleChoices:arranged.map((t,i)=>({id:`c${i+1}`,text:t}))},
  visualIntent:{visualMode:"REPRESENTATIVE",renderStrategy:"NO_VISUAL"},
  speech:{enabled:false,visiblePromptOnly:true}
 };
 const previewRecord={familyId:id,lessonId:family.lessonId,variantId,sourceOrigin:"ORIGINAL_SYNTHETIC_NOT_SGK_VBT",sourceExerciseId:null,difficultyCandidate:family.difficultyCandidate,previewState:"DEV_REVIEW_ONLY_NOT_PUBLIC_VARIANT",rendererRouteCandidate:family.rendererReferenceCandidate,rendererGrant:"DENY",publicVariant:null,previewEnvelope:publicPreview,gradingRoute:"TRUSTED_GAS_NOT_CONNECTED"};
 return {previewRecord,privateCheck:{right,context,rule}};
}
const ROOT='qa/p1-2-b/';
const read=n=>JSON.parse(fs.readFileSync(ROOT+n,'utf8'));
function build(){
 const c=read('P12B_ORIGINAL_VARIANT_RECIPES_8.review.v1.json');
 const items=c.families.flatMap(f=>c.templateSeeds.map(seed=>make(f,seed)));
 return items;
}
function validate(){
 const cat=read('P12B_ORIGINAL_VARIANT_RECIPES_8.review.v1.json');
 const snapshot=read('P12B_ORIGINAL_VARIANT_PREVIEWS_32.review.v1.json');
 const items=build();
 assert.equal(cat.families.length,8);
 assert.equal(items.length,32);
 assert.equal(snapshot.total,32);
 assert.deepEqual(items.map(x=>x.previewRecord),snapshot.variants);
 assert.ok(new Set(items.map(x=>x.previewRecord.variantId)).size===32);
 for(const {previewRecord:p,privateCheck:c} of items){
  const e=p.previewEnvelope;
  assert.equal(e.schemaVersion,'g76.public-envelope.v1');
  assert.equal(e.typeId,'D4');
  assert.equal(e.mode,'PRACTICE');
  assert.equal(e.visualIntent.renderStrategy,'NO_VISUAL');
  assert.equal(e.speech.enabled,false);
  assert.equal(e.display.visibleChoices.length,4);
  const choices=e.display.visibleChoices.map(x=>x.text);
  assert.equal(new Set(choices).size,4);
  assert.equal(choices.filter(x=>x===c.right).length,1);
  assert.ok(e.display.prompt.trim().length>0);
  assert.equal(p.publicVariant,null);
  assert.equal(p.rendererGrant,'DENY');
  assert.equal(p.previewState,'DEV_REVIEW_ONLY_NOT_PUBLIC_VARIANT');
  assert.equal(p.sourceExerciseId,null);
  if(c.rule==='two_digit_place_value')assert.equal(+c.right,c.context.t*10+c.context.u);
  if(c.rule==='expanded_tens_ones')assert.equal(c.right,c.context.t*10+' + '+c.context.u);
  if(c.rule==='predecessor')assert.equal(+c.right,c.context.n-1);
  if(c.rule==='successor')assert.equal(+c.right,c.context.n+1);
  if(c.rule==='addition_terms')assert.equal(c.context.a+c.context.b,c.context.sum);
  if(c.rule==='subtraction_terms')assert.equal(c.context.a-c.context.b,c.context.difference);
  if(c.rule.startsWith('comparison'))assert.equal(c.context.high-c.context.low,c.context.difference);
 }
 const json=JSON.stringify(snapshot);
 assert.ok(!/"(?:answer|answerKey|correctAnswer|expected|solution|rubric|privateCheck)"\s*:/i.test(json));
 assert.ok(!json.includes('C4_REAL_JSON'));
 assert.equal(snapshot.answersAndRubricsIncluded,false);
 assert.equal(snapshot.candidatePublicVariantGrants,0);
 assert.equal(snapshot.difficultyLevelSignoffs,0);
 console.log(JSON.stringify({test:'P12B_ORIGINAL_PREVIEWS',status:'PASS',families:8,previewCount:32,publicVariantApproved:0,answerKeysInSnapshot:0}));
}
if(require.main===module)validate();
module.exports={make,num,build,validate};
