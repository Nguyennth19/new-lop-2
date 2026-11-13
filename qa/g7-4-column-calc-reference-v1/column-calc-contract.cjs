'use strict';
/** Pure arithmetic reference QA for G7.4 COLUMN_CALC_REFERENCE_V1.
 * Do NOT put evaluate()/expectedDigits() in a browser payload: server/QA only.
 * No DOM mutation, no Apps Script or image asset dependencies.
 */
const places=['ones','tens','hundreds','thousands'];
const blocked=(reason)=>({ok:false,reason});
const int=(x,lo,hi)=>Number.isSafeInteger(x)&&x>=lo&&x<=hi;
function validate(spec){
 if(!spec||typeof spec!=='object'||!['ADD','SUBTRACT'].includes(spec.operation))return blocked('INVALID_OPERATION');
 if(!['PV100','PV1000','PV1000_BOUNDARY'].includes(spec.profile))return blocked('INVALID_PROFILE');
 if(spec.profile==='PV1000_BOUNDARY')return blocked('FOUR_COLUMN_NOT_VERIFIED');
 const cap=spec.profile==='PV100'?99:999;
 if(!int(spec.a,0,cap)||!int(spec.b,0,cap))return blocked('OPERAND_RANGE');
 const result=spec.operation==='ADD'?spec.a+spec.b:spec.a-spec.b;
 if(result<0||result>cap)return blocked('RESULT_RANGE_OR_NEGATIVE');
 if(typeof spec.variantId!=='string'||!/^COL_[A-Za-z0-9_-]{4,80}$/.test(spec.variantId))
  return blocked('INVALID_VARIANT_ID');
 if(!['LV1','LV2','LV3'].includes(spec.level))return blocked('INVALID_LEVEL');
 if(spec.assetId!==undefined&&spec.assetId!==null)return blocked('IMAGE_ASSET_FORBIDDEN');
 if(spec.answer!==undefined||spec.expectedDigits!==undefined||spec.carryAnswers!==undefined||
  spec.borrowAnswers!==undefined)return blocked('UNTRUSTED_ANSWER_IN_SPEC');
 return {ok:true,cap,columns:spec.profile==='PV100'?2:3,result};
}
function digits(num,n){return Array.from({length:n},(_,i)=>Math.floor(num/10**i)%10);}
function computeServerOnly(spec){
 const v=validate(spec);if(!v.ok)return v;
 const a=digits(spec.a,v.columns),b=digits(spec.b,v.columns),res=digits(v.result,v.columns);
 let incoming=0;const carry=[],borrow=[];
 for(let i=0;i<v.columns;i++){
  if(spec.operation==='ADD'){
   const raw=a[i]+b[i]+incoming;const next=raw>=10?1:0;
   if(raw%10!==res[i])throw Error('INTERNAL_ADDITION_MISMATCH');
   carry.push({place:places[i],incoming,outgoing:next});
   incoming=next;
  }else{
   const raw=a[i]-incoming-b[i],next=raw<0?1:0;
   if(((raw+10)%10)!==res[i])throw Error('INTERNAL_SUBTRACTION_MISMATCH');
   borrow.push({place:places[i],incoming,outgoing:next});
   incoming=next;
  }
 }
 if(incoming!==0)throw Error('UNHANDLED_OVERFLOW');
 return {ok:true,variantId:spec.variantId,operation:spec.operation,profile:spec.profile,
   result:v.result,digits:res,carry,borrow,serverOnly:true};
}
function publicPlan(spec){
 const v=validate(spec);if(!v.ok)return v;
 const placeOrder=places.slice(0,v.columns),a=digits(spec.a,v.columns),b=digits(spec.b,v.columns);
 return {ok:true,schemaVersion:'g7-4-column-calc-public-v1',variantId:spec.variantId,
   level:spec.level,profile:spec.profile,operation:spec.operation,renderStrategy:'COLUMN_CALC_REFERENCE',
   visualMode:'REPRESENTATIVE',source:'MATH_HTML_CSS',assetId:null,usesImageLibrary:false,
   runtimeEnabled:false,gradingEnabled:false,answerIncluded:false,
   layout:{columns:v.columns,displayOrder:placeOrder.slice().reverse(),
     inputOrder:placeOrder,focusFirst:'ones',allowLeftToRightAutoFocus:false,
     needsCarryBoxes:spec.operation==='ADD',needsBorrowBoxes:spec.operation==='SUBTRACT',
     focusHighlight:true,keyboardAccessible:true},
   operandDigits:{a:placeOrder.map((id,i)=>({place:id,value:a[i]})),
     b:placeOrder.map((id,i)=>({place:id,value:b[i]}))},
   resultInputs:placeOrder.map(place=>({id:'result_'+place,place,role:'INPUT',value:null})),
   transitionInputs:placeOrder.slice(1).map(place=>({id:(spec.operation==='ADD'?'carry_':'borrow_')+place,
     place,role:'INPUT_OR_HINT_BY_LESSON_POLICY',value:null})),
   accessibleInstruction:'Tính từ hàng đơn vị sang hàng chục, hàng trăm. Điền kết quả vào ô từng hàng.'};
}
function checkAnswers(spec,values,{gradeTransitions=false}={}){
 const expected=computeServerOnly(spec);if(!expected.ok)return expected;
 if(!values||typeof values!=='object')return blocked('NO_ANSWERS');
 const digitOk=expected.digits.every((n,i)=>typeof values['result_'+places[i]]==='string'&&
   /^[0-9]$/.test(values['result_'+places[i]])&&Number(values['result_'+places[i]])===n);
 let transOk=true;
 if(gradeTransitions){
  const kind=spec.operation==='ADD'?'carry':'borrow',valuesByPlace=kind==='carry'?expected.carry:expected.borrow;
  // The carry/borrow written above column k equals outgoing transition from k-1.
  transOk=valuesByPlace.slice(1).every((record,i)=>{
   const raw=values[kind+'_'+places[i+1]];
   return typeof raw==='string'&&/^[01]$/.test(raw)&&Number(raw)===record.incoming;
  });
 }
 return {ok:true,resultCorrect:digitOk,transitionsCorrect:transOk,
   allCorrect:digitOk&&transOk};
}
function chooseRenderer(spec,{primaryAvailable=false,primaryQaApproved=false,explicitDegradedConsent=false,fallbackQaApproved=false}={}){
 const v=validate(spec);if(!v.ok)return v;
 if(primaryAvailable&&primaryQaApproved)return {ok:true,renderer:'REFERENCE_PRIMARY',fallback:false};
 if(spec.operation!=='ADD'||spec.profile!=='PV100'||spec.a<10||spec.b<10||v.result>99||
  !explicitDegradedConsent||!fallbackQaApproved)
  return blocked('PRIMARY_REQUIRED_FALLBACK_NOT_ELIGIBLE');
 return {ok:true,renderer:'V2_PLACE_VALUE_GRID',fallback:true,requiresUiDisclosure:true,
   note:'Degraded two-digit addition only; cannot assert reference RTL behavior'};
}
module.exports={validate,publicPlan,computeServerOnly,checkAnswers,chooseRenderer};
