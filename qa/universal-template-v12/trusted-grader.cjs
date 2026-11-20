'use strict';
/*
 * ULT V1.2 – trusted grading contract demonstration, only for synthetic LAB
 * fixture A/B. Server-only code, no student identity or writes.
 * This repo may be public: synthetic-private-bank.cjs is NOT a secret store.
 * Production AUTH, private storage, rate limits, teacher approval are NO-GO.
 */
const {makePack}=require('../universal-template-v1/fixture-packs.cjs');
const BANK=require('./synthetic-private-bank.cjs');
const PACKS=Object.freeze({MATH_LAB_A:makePack('A'),MATH_LAB_B:makePack('B')});
const POLICY=Object.freeze({
 D1:{status:'NO_GRANT',reason:'D1_SIX_SLOT_PEDAGOGY_NOT_APPROVED'},
 D2:{status:'LAB_CHECKED',rule:'COLUMN_NUMBER_OPTIONAL_CARRY'},
 D3:{status:'LAB_CHECKED',rule:'ONE_TO_ONE_MATCHING'},
 D4:{status:'LAB_CHECKED',rule:'SINGLE_SELECTION'},
 D5:{status:'NO_GRANT',reason:'TANGRAM_EDUCATIONAL_ORACLE_E04_PENDING'},
 D6:{status:'LAB_CHECKED',rule:'ORDER_ALL_ITEMS'},
 D7:{status:'LAB_CHECKED',rule:'COMPARE_ALL_ROWS'},
 D8:{status:'LAB_CHECKED',rule:'RULER_MEASUREMENT_WITH_ZERO_ALIGNED'},
 D8A:{status:'NO_GRANT',reason:'CAPACITY_SIMULATION_NOT_ASSESSED'},
 D8B:{status:'NO_GRANT',reason:'MASS_SIMULATION_NOT_ASSESSED'},
 D9:{status:'LAB_CHECKED',rule:'PICTOGRAPH_ANSWER_FIELDS_ONLY'},
 D10:{status:'NO_GRANT',reason:'G6_NUMERIC_AND_STATEMENT_COMPOSITE_UNAPPROVED'}
});
const badKeys=new Set(['__proto__','constructor','prototype','answer','answers','answerKey',
 'correct','correctAnswer','correctOptionId','expected','expectedValue','gradingKey',
 'solution','studentId','score','stars','privateVariant','result','pass','grade']);
function isObject(x){return x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 (Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);}
function safeTree(x,depth=0){
 if(depth>12)return false;
 if(x===null||typeof x==='boolean')return true;
 if(typeof x==='string')return x.length<=1000;
 if(typeof x==='number')return Number.isFinite(x);
 if(Array.isArray(x))return x.length<=150&&x.every(v=>safeTree(v,depth+1));
 if(!isObject(x)||Object.keys(x).length>80)return false;
 return Object.entries(x).every(([k,v])=>k.length<=80&&!badKeys.has(k)&&safeTree(v,depth+1));
}
function fields(x,allowed){return isObject(x)&&Object.keys(x).every(k=>allowed.includes(k));}
const error=reason=>({status:'REJECTED',reason,contract:'ULT_TRUSTED_LAB_V12'});
const noGrant=reason=>({status:'NOT_AUTHORIZED',reason,contract:'ULT_TRUSTED_LAB_V12'});
const incomplete=()=>({status:'INCOMPLETE',reason:'SUBMISSION_INCOMPLETE',contract:'ULT_TRUSTED_LAB_V12'});
const checked=pass=>({status:'CHECKED',pass:pass===true,scope:'SYNTHETIC_LAB_SERVER_ONLY',
 contract:'ULT_TRUSTED_LAB_V12'});
function same(a,b){return Object.keys(b).length===Object.keys(a).length&&
 Object.keys(b).every(k=>a[k]===b[k]);}
function resultFor(q,s,expected){
 const spec=q.publicVariant;
 switch(q.rendererId){
 case 'D2':{
  const places=spec.profile==='PV100'?['ones','tens']:['ones','tens','hundreds'];
  const allowed=['variantId',...places.map(p=>'result_'+p),...places.slice(1).map(p=>'carry_'+p),...places.slice(1).map(p=>'borrow_'+p)];
  if(!fields(s,allowed)||s.variantId!==spec.variantId)return error('INVALID_D2_SUBMISSION');
  for(const [k,v] of Object.entries(s)){
   if(/^result_/.test(k)&&!(typeof v==='string'&&/^[0-9]?$/.test(v)))
    return error('INVALID_D2_DIGIT');
   if(/^(?:carry|borrow)_/.test(k)&&typeof v!=='boolean')
    return error('INVALID_D2_CARRY');
  }
  if(places.some(p=>!s['result_'+p]))return incomplete();
  const value=Number(places.slice().reverse().map(p=>s['result_'+p]).join(''));
  return checked(value===expected);
 }
 case 'D3':{
  if(!fields(s,['exerciseId','pairs','selectedLeft','completed','total'])||
   s.exerciseId!==spec.exerciseId||!isObject(s.pairs))return error('INVALID_D3_SUBMISSION');
  const left=spec.leftItems.map(x=>x.id),right=spec.rightItems.map(x=>x.id);
  if(!Object.keys(s.pairs).every(k=>left.includes(k))||
   !Object.values(s.pairs).every(v=>typeof v==='string'&&right.includes(v))||
   new Set(Object.values(s.pairs)).size!==Object.values(s.pairs).length)
   return error('INVALID_D3_PAIRS');
  if(s.selectedLeft!==undefined&&s.selectedLeft!==null&&!left.includes(s.selectedLeft))
   return error('INVALID_D3_SELECTION');
  if(s.completed!==undefined&&s.completed!==Object.keys(s.pairs).length||
   s.total!==undefined&&s.total!==left.length)return error('INVALID_D3_COUNTS');
  if(Object.keys(s.pairs).length<left.length)return incomplete();
  return checked(same(s.pairs,expected));
 }
 case 'D4':{
  if(!fields(s,['questionId','selectedOptionIds'])||
   s.questionId!==spec.questionId||!Array.isArray(s.selectedOptionIds)||
   s.selectedOptionIds.length>1||new Set(s.selectedOptionIds).size!==s.selectedOptionIds.length)
   return error('INVALID_D4_SUBMISSION');
  const ids=spec.options.map(o=>o.id);
  if(!s.selectedOptionIds.every(id=>typeof id==='string'&&ids.includes(id)))
   return error('INVALID_D4_CHOICE');
  if(s.selectedOptionIds.length===0)return incomplete();
  return checked(s.selectedOptionIds[0]===expected);
 }
 case 'D6':{
  if(!fields(s,['exerciseId','mode','selectedItemId','placements'])||
   s.exerciseId!==spec.exerciseId||s.mode!==spec.mode||!isObject(s.placements))
   return error('INVALID_D6_SUBMISSION');
  const ids=spec.items.map(x=>x.id),targets=ids.map((_,i)=>'slot_'+(i+1));
  if(s.selectedItemId!==undefined&&s.selectedItemId!==null&&!ids.includes(s.selectedItemId))
   return error('INVALID_D6_SELECTION');
  if(!Object.entries(s.placements).every(([k,v])=>ids.includes(k)&&targets.includes(v))||
   new Set(Object.values(s.placements)).size!==Object.values(s.placements).length)
   return error('INVALID_D6_PLACEMENTS');
  if(Object.keys(s.placements).length<ids.length)return incomplete();
  return checked(same(s.placements,expected));
 }
 case 'D7':{
  if(!fields(s,['exerciseId','activeRowId','selectedSigns','hintsVisible'])||
   s.exerciseId!==spec.exerciseId||!isObject(s.selectedSigns)||
   typeof s.hintsVisible!=='boolean')return error('INVALID_D7_SUBMISSION');
  const ids=spec.rows.map(x=>x.id);
  if(!ids.includes(s.activeRowId)||
   !Object.entries(s.selectedSigns).every(([k,v])=>ids.includes(k)&&['<','>','='].includes(v)))
   return error('INVALID_D7_SIGNS');
  if(s.hintsVisible&&spec.hintPolicy!=='OPTIONAL')return error('INVALID_D7_HINTS');
  if(Object.keys(s.selectedSigns).length<ids.length)return incomplete();
  return checked(same(s.selectedSigns,expected));
 }
 case 'D8':{
  if(!fields(s,['exerciseId','mode','rulerZero','enteredLength'])||
   s.exerciseId!==spec.exerciseId||s.mode!=='RULER'||
   !Number.isFinite(s.rulerZero)||s.rulerZero<0||s.rulerZero>300||
   typeof s.enteredLength!=='string'||!/^\d{0,3}(?:\.\d{0,2})?$/.test(s.enteredLength))
   return error('INVALID_D8_RULER');
  if(!s.enteredLength)return incomplete();
  // Test-only educational requirement: ruler zero must be positioned at A.
  return checked(Number(s.enteredLength)===expected&&Math.abs(s.rulerZero-spec.model.segmentStart)<=2);
 }
 case 'D9':{
  if(!fields(s,['exerciseId','mode','countedIndices','enteredAnswers'])||
   s.exerciseId!==spec.exerciseId||s.mode!==spec.mode||
   !isObject(s.countedIndices)||!isObject(s.enteredAnswers))return error('INVALID_D9_SUBMISSION');
  const rowMap=Object.fromEntries(spec.rows.map(r=>[r.id,r.itemCount]));
  if(Object.keys(s.countedIndices).length!==spec.rows.length||
   !Object.entries(s.countedIndices).every(([k,v])=>
     Object.prototype.hasOwnProperty.call(rowMap,k)&&Array.isArray(v)&&
     v.length<=rowMap[k]&&new Set(v).size===v.length&&
     v.every(i=>Number.isInteger(i)&&i>=0&&i<rowMap[k])))
   return error('INVALID_D9_TAPS');
  const ids=spec.questions.map(q=>q.id);
  if(!Object.entries(s.enteredAnswers).every(([k,v])=>ids.includes(k)&&
   typeof v==='string'&&/^\d{0,3}$/.test(v)))return error('INVALID_D9_ANSWERS');
  if(ids.some(k=>!s.enteredAnswers[k]))return incomplete();
  return checked(same(s.enteredAnswers,expected));
 }
 default:return noGrant('NO_GRADING_RULE_REGISTERED');
 }
}
function evaluateSubmission(body){
 // Enforce canonical trusted request: never accept a submitted "correctness" flag,
 // extra user/role/answer fields or untrusted variant. Source comes from pinned
 // server fixture and explicit grading bank only.
 if(!safeTree(body)||!fields(body,['packId','questionId','submission'])||
  typeof body.packId!=='string'||typeof body.questionId!=='string'||!isObject(body.submission))
  return error('BAD_SUBMISSION');
 const pack=PACKS[body.packId];
 if(!pack)return error('UNKNOWN_PACK_OR_UNAPPROVED_VERSION');
 const q=pack.questions.find(x=>x.questionId===body.questionId);
 if(!q)return error('UNKNOWN_QUESTION');
 const policy=POLICY[q.rendererId];
 if(!policy||policy.status!=='LAB_CHECKED')return noGrant(policy?.reason||'NO_GRADING_CONTRACT');
 const expected=BANK[body.packId]?.[q.rendererId];
 if(expected===undefined)return noGrant('PRIVATE_SYNTHETIC_RUBRIC_MISSING');
 return resultFor(q,body.submission,expected);
}
function capabilities(){
 return Object.fromEntries(Object.entries(POLICY).map(([k,v])=>
  [k,Object.freeze({enabled:v.status==='LAB_CHECKED',status:v.status,
   rule:v.rule||null,reason:v.reason||null})]));
}
module.exports=Object.freeze({evaluateSubmission,capabilities,CONTRACT:'ULT_TRUSTED_LAB_V12'});
