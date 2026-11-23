'use strict';
// N6 DB-02 public LAB candidate contract only. No generator, trusted grading or external writes.
const FAMILY=Object.freeze({
 D2:{skillId:'COLUMN_ADD',questionType:'vertical',visualIntent:'DECORATIVE'},
 D5:{skillId:'SHAPE_COMPOSE',questionType:'shape',visualIntent:'GEOMETRY'},
 D9:{skillId:'EXACT_COUNT',questionType:'pictograph',visualIntent:'EXACT_COUNT'},
 D10:{skillId:'WORD_ONE_OPERATION',questionType:'word_problem',visualIntent:'NONE'}
});
const privateFields=new Set(['answer','answers','answerKey','correct','correctAnswer','expected','solution','solutionPrompt','privateAnswer','privateKeyRef','gradingKey','studentId','score','stars','teacherSolution']);
const id=/^[A-Z][A-Z0-9_]{5,79}$/;
const requestId=/^[A-Z0-9][A-Z0-9_-]{5,79}$/;
const fail=reason=>({ok:false,reason,release:false,writes:0});
const exact=(v,keys)=>v&&Object.getPrototypeOf(v)===Object.prototype&&Object.keys(v).sort().join('|')===keys.slice().sort().join('|');
function safe(v,depth=0){
 if(depth>12)return false;
 if(v===null||typeof v==='boolean')return true;
 if(typeof v==='string')return v.length<=1200;
 if(typeof v==='number')return Number.isFinite(v);
 if(Array.isArray(v))return v.length<=50&&v.every(x=>safe(x,depth+1));
 return v&&Object.getPrototypeOf(v)===Object.prototype&&Object.keys(v).length<=30&&
  Object.entries(v).every(([k,x])=>!privateFields.has(k)&&k.length<=80&&safe(x,depth+1));
}
function validateQuestion(q,lessonId){
 const f=FAMILY[q?.rendererId];
 if(!f)return fail('UNKNOWN_RENDERER');
 if(!exact(q,['lessonId','questionId','rendererId','skillId','questionType','level','visualIntent','countUnit','assetId','publicVariant'])||
  q.lessonId!==lessonId||!requestId.test(q.questionId||'')||q.level!=='LV2'||
  q.skillId!==f.skillId||q.questionType!==f.questionType||q.visualIntent!==f.visualIntent)
  return fail('QUESTION_RENDERER_POLICY_MISMATCH');
 const p=q.publicVariant;
 if(!p||!safe(p)||typeof p.variantId!=='string'||!requestId.test(p.variantId))return fail('UNSAFE_VARIANT');
 if(q.rendererId==='D2'){
  if(q.assetId!==null||q.countUnit!==null||!exact(p,['variantId','a','b','operation','profile','carryPolicy'])||
   p.operation!=='ADD'||p.profile!=='PV100'||p.carryPolicy!=='OPTIONAL_HINT'||
   !Number.isInteger(p.a)||!Number.isInteger(p.b)||p.a<0||p.b<0||p.a+p.b>99||p.a%10+p.b%10<10)
   return fail('D2_MATH_POLICY');
 }else if(q.rendererId==='D5'){
  if(q.assetId!==null||q.countUnit!==null||!exact(p,['variantId','shapes'])||
   !Array.isArray(p.shapes)||p.shapes.length<2||p.shapes.length>12||
   !p.shapes.every(s=>['triangle','square','rectangle'].includes(s)))return fail('D5_SHAPE_POLICY');
 }else if(q.rendererId==='D9'){
  if(!exact(p,['variantId','count','symbolValue'])||q.assetId!=='FLUENT:red_apple'||
   q.countUnit!=='apple'||p.symbolValue!==1||!Number.isInteger(p.count)||p.count<1||p.count>20)
   return fail('D9_EXACT_COUNT_POLICY');
 }else if(q.rendererId==='D10'){
  if(q.assetId!==null||q.countUnit!==null||!exact(p,['variantId','operation','steps','a','b'])||
   !['ADD','SUB'].includes(p.operation)||p.steps!==1||
   !Number.isInteger(p.a)||!Number.isInteger(p.b)||p.a<0||p.b<0||
   (p.operation==='SUB'&&p.a<p.b))return fail('D10_ONE_STEP_POLICY');
 }
 return {ok:true,release:false,writes:0};
}
function validateMultiFamilyPack(pack){
 if(!safe(pack)||!exact(pack,['schemaVersion','packId','status','lesson','questions'])||
  pack.schemaVersion!=='LOP2_N6_MULTIFAMILY_LAB_V1'||
  !requestId.test(pack.packId||'')||pack.status!=='LAB_CANDIDATE_ONLY'||
  !exact(pack.lesson,['id','subject','grade','sourceStatus','studentRelease'])||
  !id.test(pack.lesson.id||'')||!pack.lesson.id.startsWith('LAB_MATH_')||
  pack.lesson.subject!=='MATH'||pack.lesson.grade!==2||
  pack.lesson.sourceStatus!=='SYNTHETIC_QA_ONLY'||pack.lesson.studentRelease!==false||
  !Array.isArray(pack.questions)||pack.questions.length<1||pack.questions.length>50)
  return fail('PACK_SCHEMA_OR_SOURCE_DENIED');
 const seen=new Set(),families=new Set();
 for(const q of pack.questions){
  if(!safe(q))return fail('PRIVATE_OR_UNSAFE_FIELD');
  const result=validateQuestion(q,pack.lesson.id);
  if(!result.ok)return result;
  if(seen.has(q.questionId))return fail('DUPLICATE_QUESTION_ID');
  seen.add(q.questionId);families.add(q.rendererId);
 }
 return {ok:true,stage:'PROPOSE_ONLY',release:false,writes:0,families:[...families].sort(),count:pack.questions.length};
}
module.exports=Object.freeze({FAMILY,validateMultiFamilyPack});
