'use strict';
/* QA-C.1 TEST-only Type1 visual data binder. Public data only; original HTML unchanged.
 * This is a DOM preview binder, NOT a release renderer or client grader.
 */
const {compileComposite,SLOTS}=require('./type1-demo-source-map.qa-b1.cjs');
function spec(id,family,skill,parameters,hiddenFields){
 return {variantId:id,diagramFamily:family,skill,visualMode:'REPRESENTATIVE',
 assetId:null,usesImageLibrary:false,parameters,hiddenFields};
}
function fixture(id,a,b,dm,m){
 return {bond:spec(id+'_BOND','MAKE_TEN_NUMBER_BOND','ADD_THROUGH_TEN',{a,b},['splitToTen','remainder','tenStep','total']),
 dm:spec(id+'_DM','UNIT_CONVERSION_LENGTH','CONVERT_LENGTH_UNITS',{amount:dm,fromUnit:'dm',toUnit:'cm'},['convertedAmount']),
 m:spec(id+'_M','UNIT_CONVERSION_LENGTH','CONVERT_LENGTH_UNITS',{amount:m,fromUnit:'m',toUnit:'cm'},['convertedAmount'])};
}
const cases=Object.freeze([
 {id:'FROZEN_8_5',spec:fixture('QA_C1_A',8,5,1,1)},
 {id:'VARIANT_7_6',spec:fixture('QA_C1_B',7,6,2,2)},
 {id:'VARIANT_9_4',spec:fixture('QA_C1_C',9,4,3,3)}
]);
function publicView(record){
 const x=compileComposite(record.spec);if(!x.ok)return x;
 const [bond,dm,m]=x.plans;
 const given=(plan,id)=>plan.fields.find(f=>f.id===id&&f.role==='GIVEN')?.value;
 const view={ok:true,caseId:record.id,sourceSha256:x.demoOriginalHtmlSha256,
  data:{a:given(bond,'a'),b:given(bond,'b'),dm:given(dm,'amount'),m:given(m,'amount')},
  slots:x.bindings.map(b=>({id:b.slotId,fieldId:b.fieldId,role:b.role,value:null})),
  checksDisabled:true,originalGraderUntrusted:true,ownerVisualReview:'PENDING'};
 if(view.slots.length!==6||view.slots.some(x=>x.value!==null))throw Error('INVALID_PUBLIC_BINDING');
 return view;
}
module.exports={cases,fixture,publicView,SLOTS};
