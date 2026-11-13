'use strict';
/** G7.4 structured diagram V2 — pure TEST-only generator.
 * Public plan has no hidden answers. answerKey() is SERVER/QA ONLY.
 * Never transmit answerKey() alongside publicPlan in a student response.
 */
const families=Object.freeze({
  MAKE_TEN_NUMBER_BOND:{skill:'ADD_THROUGH_TEN',strategy:'STRUCTURED_DIAGRAM',hidden:['splitToTen','remainder','tenStep','total']},
  UNIT_CONVERSION_LENGTH:{skill:'CONVERT_LENGTH_UNITS',strategy:'UNIT_CONVERSION_FIELDS',hidden:['convertedAmount']},
  PLACE_VALUE_ADDITION:{skill:'COLUMN_ADDITION',strategy:'PLACE_VALUE_GRID',hidden:['carry','tens','ones','total']},
  SEGMENT_LENGTH_SUM:{skill:'ADD_LENGTHS',strategy:'PARAMETRIC_SEGMENTS',hidden:['totalLength']}
});
const scale=Object.freeze({m:100,dm:10,cm:1});
const allowedField=(k,v)=>({id:k,role:v===null?'INPUT':'GIVEN',value:v});
const fail=reason=>({ok:false,reason});
const inInt=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const validId=x=>typeof x==='string'&&/^[A-Za-z][A-Za-z0-9_-]{2,79}$/.test(x);
function verify(spec){
 if(!spec||!families[spec.diagramFamily]||!validId(spec.variantId))return fail('INVALID_FAMILY_OR_VARIANT');
 if(spec.assetId!==null||spec.usesImageLibrary!==false||spec.visualMode!=='REPRESENTATIVE')return fail('INVALID_VISUAL_CONTRACT');
 if(spec.skill!==families[spec.diagramFamily].skill)return fail('SKILL_MISMATCH');
 if(!Array.isArray(spec.hiddenFields)||new Set(spec.hiddenFields).size!==spec.hiddenFields.length||
  spec.hiddenFields.some(x=>!families[spec.diagramFamily].hidden.includes(x)))return fail('INVALID_HIDDEN_FIELDS');
 if(spec.hiddenFields.length===0)return fail('NO_LEARNING_INPUT');
 if(!spec.parameters||typeof spec.parameters!=='object')return fail('MISSING_PARAMETERS');
 const p=spec.parameters;
 switch(spec.diagramFamily){
 case 'MAKE_TEN_NUMBER_BOND':
  if(!inInt(p.a,1,9)||!inInt(p.b,1,9)||p.a+p.b<=10||p.a+p.b>18||
     p.splitToTen!==undefined||p.remainder!==undefined||p.total!==undefined)return fail('INVALID_MAKE_TEN_PARAMETERS');
  break;
 case 'UNIT_CONVERSION_LENGTH':{
  if(!inInt(p.amount,1,100)||!Object.hasOwn(scale,p.fromUnit)||!Object.hasOwn(scale,p.toUnit)||
   p.fromUnit===p.toUnit||p.convertedAmount!==undefined)return fail('INVALID_CONVERSION_PARAMETERS');
  const out=p.amount*scale[p.fromUnit]/scale[p.toUnit];
  if(!inInt(out,1,1000))return fail('NON_INTEGER_OR_OUT_OF_RANGE_CONVERSION');
  break;}
 case 'PLACE_VALUE_ADDITION':
  if(!inInt(p.a,10,99)||!inInt(p.b,10,99)||p.a+p.b>99||p.total!==undefined||
     p.carry!==undefined)return fail('INVALID_COLUMN_PARAMETERS');
  break;
 case 'SEGMENT_LENGTH_SUM':
  if(!inInt(p.ab,1,100)||!inInt(p.cd,1,100)||p.ab+p.cd>200||!['cm','dm','m'].includes(p.unit)||
    p.originalSkill==='BROKEN_LINE_LENGTH'||p.breaksTargetGeometry===true||
    p.totalLength!==undefined)return fail('INVALID_SEGMENT_TRANSFORMATION');
  if(spec.rewriteOriginal===true&&(!validId(spec.sourceVariantId)||spec.sourceVariantId===spec.variantId||
    spec.signedSkillEquivalence!==true||spec.answerRecomputed!==true))return fail('REWRITE_REQUIRES_VERIFICATION');
  break;
 }
 return {ok:true};
}
function internalValues(spec){
 const p=spec.parameters;
 switch(spec.diagramFamily){
 case 'MAKE_TEN_NUMBER_BOND':return {a:p.a,b:p.b,splitToTen:10-p.a,remainder:p.b-(10-p.a),tenStep:10,total:p.a+p.b};
 case 'UNIT_CONVERSION_LENGTH':return {amount:p.amount,fromUnit:p.fromUnit,toUnit:p.toUnit,convertedAmount:p.amount*scale[p.fromUnit]/scale[p.toUnit]};
 case 'PLACE_VALUE_ADDITION':return {a:p.a,b:p.b,carry:(p.a%10+p.b%10)>=10?1:0,tens:Math.floor((p.a+p.b)/10),ones:(p.a+p.b)%10,total:p.a+p.b};
 case 'SEGMENT_LENGTH_SUM':return {ab:p.ab,cd:p.cd,unit:p.unit,totalLength:p.ab+p.cd};
 }
}
function compilePublic(spec){
 const valid=verify(spec);if(!valid.ok)return valid;
 const v=internalValues(spec),hide=new Set(spec.hiddenFields),field=(name,label)=>({
   ...allowedField(name,hide.has(name)?null:v[name]),label,ariaLabel:label});
 const base={ok:true,schemaVersion:'g7-4-structured-public-v2',variantId:spec.variantId,
   diagramFamily:spec.diagramFamily,skill:spec.skill,visualMode:'REPRESENTATIVE',
   renderStrategy:families[spec.diagramFamily].strategy,assetId:null,usesImageLibrary:false,
   sourceKind:'HTML_CSS_OR_PARAMETRIC_SVG',runtimeEnabled:false,gradable:false,
   noAnswerLeak:true};
 switch(spec.diagramFamily){
 case 'MAKE_TEN_NUMBER_BOND':{
  const fields=[field('a','Số thứ nhất'),field('b','Số thứ hai'),field('splitToTen','Phần gộp đủ 10'),
   field('remainder','Phần còn lại'),field('tenStep','Tổng sau khi gộp chục'),field('total','Kết quả cuối cùng')];
  return {...base,title:'Tách – gộp để cộng qua 10',fields,
   layout:{type:'NUMBER_BOND',parent:'b',children:['splitToTen','remainder'],
     stepOne:['a','splitToTen','tenStep'],stepTwo:['tenStep','remainder','total']},
   accessiblePrompt:'Tách số thứ hai để cộng số thứ nhất cho đủ mười, rồi cộng phần còn lại. Điền các ô còn thiếu.'};
 }
 case 'UNIT_CONVERSION_LENGTH':
  return {...base,title:'Đổi đơn vị độ dài',
   fields:[field('amount','Số đo ban đầu'),field('fromUnit','Đơn vị ban đầu'),
     field('convertedAmount','Số đo đổi ra'),field('toUnit','Đơn vị cần đổi')],
   layout:{type:'UNIT_CONVERSION',expression:['amount','fromUnit','=','convertedAmount','toUnit']},
   accessiblePrompt:'Đổi số đo sang đơn vị đã cho. Điền số còn thiếu.'};
 case 'PLACE_VALUE_ADDITION':
  return {...base,title:'Cộng theo cột',
   fields:[field('a','Số hạng thứ nhất'),field('b','Số hạng thứ hai'),
     field('carry','Số nhớ'),field('tens','Chữ số hàng chục của kết quả'),
     field('ones','Chữ số hàng đơn vị của kết quả'),field('total','Tổng')],
   layout:{type:'PLACE_VALUE',columns:['TENS','ONES'],operation:'ADD'},
   accessiblePrompt:'Cộng theo hàng đơn vị, hàng chục và điền các ô chưa có số.'};
 case 'SEGMENT_LENGTH_SUM':
  return {...base,title:'Cộng độ dài hai đoạn thẳng',
   fields:[field('ab','Độ dài đoạn AB'),field('cd','Độ dài đoạn CD'),field('unit','Đơn vị đo'),
     field('totalLength','Tổng độ dài')],
   layout:{type:'TWO_STRAIGHT_SEGMENTS',segments:['AB','CD'],notOriginalZigzag:true},
   accessiblePrompt:'Quan sát hai đoạn thẳng AB và CD, cộng độ dài và điền kết quả.'};
 }
}
function answerKey(spec){
 const r=verify(spec);if(!r.ok)return r;
 const v=internalValues(spec);
 return {ok:true,variantId:spec.variantId,serverOnly:true,
   answers:Object.fromEntries(spec.hiddenFields.map(key=>[key,v[key]]))};
}
function validateStudentAnswers(spec,studentInput){
 const key=answerKey(spec);if(!key.ok)return key;
 if(!studentInput||typeof studentInput!=='object')return fail('INVALID_ANSWERS');
 const results={};
 for(const [id,correct] of Object.entries(key.answers)){
  const raw=studentInput[id];
  results[id]=typeof correct==='number' && typeof raw==='string' && /^[0-9]{1,4}$/.test(raw.trim())&&
   Number(raw.trim())===correct;
 }
 return {ok:true,allCorrect:Object.values(results).every(Boolean),fields:results};
}
module.exports={verify,compilePublic,answerKey,validateStudentAnswers,families};
