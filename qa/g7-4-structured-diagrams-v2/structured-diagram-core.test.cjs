'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {compilePublic,answerKey,verify,validateStudentAnswers,families}=require('./structured-diagram-core.cjs');
const ex=JSON.parse(fs.readFileSync('qa/g7-4-structured-diagrams-v2/examples.v2.json','utf8')).examples;
let n=0;const eq=(x,y)=>{assert.deepEqual(x,y);n++};const ok=x=>{assert.ok(x);n++};
eq(Object.keys(families).length,4);eq(ex.length,5);
for(const spec of ex){
 const plan=compilePublic(spec),key=answerKey(spec);eq(plan.ok,true);eq(key.ok,true);
 eq(plan.visualMode,'REPRESENTATIVE');eq(plan.assetId,null);eq(plan.usesImageLibrary,false);
 eq(plan.gradable,false);eq(plan.runtimeEnabled,false);
 eq(plan.fields.filter(x=>x.role==='INPUT').map(x=>x.id).sort(),spec.hiddenFields.slice().sort());
 for(const hidden of spec.hiddenFields){
  const field=plan.fields.find(x=>x.id===hidden);ok(field);eq(field.value,null);
  ok(!JSON.stringify(plan).includes('"'+hidden+'":'+JSON.stringify(key.answers[hidden])));
 }
 eq(plan.fields.every(x=>typeof x.ariaLabel==='string'&&!/đáp án.*[0-9]/i.test(x.ariaLabel)),true);
 eq(key.serverOnly,true);
 const validInputs=Object.fromEntries(Object.entries(key.answers).map(([k,v])=>[k,String(v)]));
 eq(validateStudentAnswers(spec,validInputs).allCorrect,true);
 const invalid={...validInputs,[spec.hiddenFields[0]]:'9999'};
 eq(validateStudentAnswers(spec,invalid).allCorrect,false);
}
const bond=ex[0],conversion=ex[1],meter=ex[2],column=ex[3],segments=ex[4];
eq(answerKey(bond).answers,{splitToTen:2,remainder:3,tenStep:10,total:13});
eq(answerKey(conversion).answers.convertedAmount,10);
eq(answerKey(meter).answers.convertedAmount,100);
eq(answerKey(column).answers,{carry:1,tens:8,ones:3,total:83});
eq(answerKey(segments).answers.totalLength,7);
const mutate=(spec,changes)=>({...spec,...changes,parameters:{...spec.parameters,...(changes.parameters||{})}});
eq(verify(mutate(bond,{parameters:{a:9,b:1}})).ok,false);
eq(verify(mutate(bond,{parameters:{a:8,b:4,total:12}})).ok,false);
eq(verify(mutate(bond,{hiddenFields:['total','total']})).ok,false);
eq(verify(mutate(bond,{hiddenFields:['a']})).ok,false);
eq(verify(mutate(bond,{assetId:'some_webp'})).ok,false);
eq(verify(mutate(bond,{visualMode:'EXACT_COUNT'})).ok,false);
eq(verify(mutate(conversion,{parameters:{fromUnit:'mm'}})).ok,false);
eq(verify(mutate(conversion,{parameters:{amount:2,fromUnit:'cm',toUnit:'dm'}})).ok,false);
eq(verify(mutate(conversion,{parameters:{amount:100,fromUnit:'m',toUnit:'cm'}})).ok,false);
eq(verify(mutate(column,{parameters:{a:99,b:99}})).ok,false);
eq(verify(mutate(segments,{parameters:{originalSkill:'BROKEN_LINE_LENGTH'}})).ok,false);
eq(verify(mutate(segments,{rewriteOriginal:true,sourceVariantId:'LENGTH_AB_CD_LV2'})).ok,false);
eq(verify(mutate(segments,{rewriteOriginal:true,sourceVariantId:'ORIGINAL_BROKEN_1',signedSkillEquivalence:true,answerRecomputed:true})).ok,true);
eq(verify(mutate(segments,{rewriteOriginal:true,sourceVariantId:'ORIGINAL_BROKEN_1',signedSkillEquivalence:false,answerRecomputed:true})).ok,false);
eq(validateStudentAnswers(bond,{splitToTen:2,remainder:3,tenStep:10,total:13}).allCorrect,false);
eq(validateStudentAnswers(bond,{splitToTen:'2',remainder:'3',tenStep:'10',total:'13'}).allCorrect,true);
for(let a=1;a<=9;a++)for(let b=1;b<=9;b++){
 const v=mutate(bond,{parameters:{a,b}}),valid=a+b>10&&a+b<=18;
 eq(verify(v).ok,valid);
 if(valid){const ans=answerKey(v).answers;eq(ans.splitToTen+ans.remainder,b);eq(a+ans.splitToTen,10);eq(10+ans.remainder,a+b);}
}
eq(Object.keys(ex.reduce((acc,x)=>(acc[x.diagramFamily]=1,acc),{})).length,4);
console.log('PASS '+n+'/'+n+' assertions — 4 diagram families, answer isolation, 81 make-ten variants and negative gates');
