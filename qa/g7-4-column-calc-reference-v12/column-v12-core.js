'use strict';
/* G7.4 COLUMN_CALC_REFERENCE_V1.2 — parameterized adapter for the ORIGINAL 10-form Type 2.
 * Pure plan compiler. Never serializes answer/carry solution. No DOM, no write to GAS.
 * Deliberately retains the original left-to-right columns and right-to-left input UX.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.KLColumnV12=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const PLACES=['ones','tens','hundreds','thousands'];
 const PROFILES={PV100:{max:99,columns:2},PV1000:{max:999,columns:3}};
 const fail=(reason)=>({ok:false,reason});
 const isInt=(v,a,b)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
 function validateSpec(q){
   if(!q||typeof q!=='object'||typeof q.variantId!=='string'||!/^COL_[A-Za-z0-9_-]{4,70}$/.test(q.variantId))return fail('INVALID_ID');
   if(!Object.hasOwn(PROFILES,q.profile))return fail('UNSUPPORTED_PROFILE');
   if(!['ADD','SUBTRACT'].includes(q.operation))return fail('UNSUPPORTED_OPERATION');
   if(!['LV1','LV2','LV3'].includes(q.level))return fail('INVALID_LEVEL');
   if(!['OPTIONAL_HINT','REQUIRED_ASSESSED'].includes(q.carryPolicy))return fail('CARRY_POLICY_MISSING');
   if(q.carryPolicy==='REQUIRED_ASSESSED'&&q.assessmentAuthority!=='LESSON_POLICY_APPROVED')return fail('CARRY_ASSESSMENT_NOT_APPROVED');
   const p=PROFILES[q.profile];
   if(!isInt(q.a,0,p.max)||!isInt(q.b,0,p.max))return fail('OPERAND_OUT_OF_SCOPE');
   const result=q.operation==='ADD'?q.a+q.b:q.a-q.b;
   if(result<0||result>p.max)return fail('RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN');
   if(q.answer!==undefined||q.result!==undefined||q.expectedDigits!==undefined||
      q.carryAnswers!==undefined||q.borrowAnswers!==undefined||q.correctValue!==undefined)return fail('ANSWER_IN_UNTRUSTED_SPEC');
   if(q.assetId!==undefined&&q.assetId!==null)return fail('COLUMN_ASSET_NOT_ALLOWED');
   return {ok:true,columns:p.columns};
 }
 function split(n,c){return Array.from({length:c},(_,i)=>Math.floor(n/Math.pow(10,i))%10)}
 function publicPlan(q){
   const v=validateSpec(q);if(!v.ok)return v;
   const places=PLACES.slice(0,v.columns),a=split(q.a,v.columns),b=split(q.b,v.columns);
   return {ok:true,schemaVersion:'column-calc-reference-v12-public',variantId:q.variantId,
     family:'COLUMN_CALC',profile:q.profile,operation:q.operation,level:q.level,
     carryPolicy:q.carryPolicy,renderStrategy:'COLUMN_CALC_REFERENCE',visualMode:'REPRESENTATIVE',
     assetId:null,usesImageLibrary:false,gradingEnabled:false,runtimeEnabled:false,
     columns:v.columns,displayOrder:places.slice().reverse(),inputOrder:places.slice(),
     a:places.map((place,i)=>({place,digit:a[i]})),b:places.map((place,i)=>({place,digit:b[i]})),
     answerSlots:places.map(place=>({id:'result_'+place,place,role:'ANSWER_INPUT',value:null})),
     transitionSlots:places.slice(1).map(place=>({id:(q.operation==='ADD'?'carry_':'borrow_')+place,
       place,role:'LEARNER_TOGGLE',value:null})),
     accessibility:{defaultFocus:'result_ones',nativeKeyboard:true,focusOutline:true,
       guidance:q.operation==='ADD'?'Điền từ đơn vị sang chục, trăm.':'Trừ từ đơn vị sang chục, trăm. Các ô mượn nằm phía trên.'}};
 }
 function batch(qs){
   if(!Array.isArray(qs)||qs.length<1||qs.length>10)return fail('INVALID_BATCH_SIZE');
   const ids=new Set(),plans=[];
   for(const q of qs){
     const p=publicPlan(q);if(!p.ok)return {ok:false,reason:p.reason,variantId:q?.variantId||null};
     if(ids.has(p.variantId))return fail('DUPLICATE_VARIANT_ID');
     ids.add(p.variantId);plans.push(p);
   }
   return {ok:true,plans,renderer:'COLUMN_CALC_REFERENCE_V12',sourceKind:'HTML_CSS_STRUCTURED',
     noAssetImport:true,serverGradingRequired:true};
 }
 return Object.freeze({validateSpec,publicPlan,batch,PLACES});
});
