'use strict';
/**
 * G7.4 QA-B.1 Type1 evidence-only adapter: frozen visual demo -> Structured Diagram V2.
 * This is NOT a replacement renderer, DOM injection, or client grader.
 *
 * Original Type1 composes three distinct exercises in one card:
 *  1) 8+5 number bond 2) 1 dm to cm 3) 1 m to cm.
 * Map six ORIGINAL input IDs to existing V2 fields. Preserve demo UX and SHA.
 */
const core=require('../g7-4-structured-diagrams-v2/structured-diagram-core.cjs');
const SOURCE_SHA256='78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced';
const SLOTS=Object.freeze([
 Object.freeze({slotId:'t1_split1',family:'MAKE_TEN_NUMBER_BOND',fieldId:'splitToTen',demoPlaceholder:'2'}),
 Object.freeze({slotId:'t1_split2',family:'MAKE_TEN_NUMBER_BOND',fieldId:'remainder',demoPlaceholder:'?'}),
 Object.freeze({slotId:'t1_ten',family:'MAKE_TEN_NUMBER_BOND',fieldId:'tenStep',demoPlaceholder:'?'}),
 Object.freeze({slotId:'t1_ans',family:'MAKE_TEN_NUMBER_BOND',fieldId:'total',demoPlaceholder:'?'}),
 Object.freeze({slotId:'t1_dm',family:'UNIT_CONVERSION_LENGTH',variant:'dm',fieldId:'convertedAmount',demoPlaceholder:'?'}),
 Object.freeze({slotId:'t1_m',family:'UNIT_CONVERSION_LENGTH',variant:'m',fieldId:'convertedAmount',demoPlaceholder:'?'})
]);
const refuse=reason=>({ok:false,reason});
function demoSourceEvidence(source){
 if(typeof source!=='string')return refuse('INVALID_DEMO_SOURCE');
 const a=source.indexOf('function renderType1_NumberBond(stage)');
 const b=source.indexOf('function renderType2_VerticalCalc(stage)',a);
 const v=source.indexOf('if (exId === 1)');
 const w=source.indexOf('} else if (exId === 2)',v);
 if(a<0||b<=a||v<0||w<=v)return refuse('DEMO_TYPE1_BOUNDARY_MISSING');
 const renderer=source.slice(a,b), grader=source.slice(v,w);
 const seen=new Set();
 for(const s of SLOTS){
  const token="renderInputSlot('"+s.slotId+"', '"+s.demoPlaceholder+"'";
  if(!renderer.includes(token))return refuse('DEMO_SLOT_OR_PLACEHOLDER_MISMATCH_'+s.slotId);
  if(seen.has(s.slotId))return refuse('DUPLICATE_SLOT_ID');
  seen.add(s.slotId);
 }
 const ref={
  t1_split1:'2',t1_split2:'3',t1_ten:'10',t1_ans:'13',t1_dm:'10',t1_m:'100'
 };
 for(const [slotId,answer] of Object.entries(ref)){
  if(!grader.includes("{ id: '"+slotId+"', ans: '"+answer+"' }"))return refuse('DEMO_GRADING_SAMPLE_MISMATCH_'+slotId);
 }
 for(const snippet of ['8 + 5','8 + 2 =','10 + 3 =','1 dm =','1 m =']){
  if(!renderer.includes(snippet))return refuse('DEMO_GUIDED_TEXT_CHANGED_'+snippet);
 }
 return {ok:true,sourceSha256:SOURCE_SHA256,sampleType:'FROZEN_HARDCODED_DEMO',
  expectedSlots:SLOTS.length,matchingSlots:[...seen],graderCheckPresent:true,
  limitations:['Type1 original HTML has fixed problem text and client-side demo answer key',
   'There is no variable DOM binder to original HTML in QA-B.1',
   'Original demo UI cannot be promoted to trusted assessment by this mapping']};
}
function compileComposite(data){
 if(!data||!data.bond||!data.dm||!data.m)return refuse('THREE_SPECS_REQUIRED');
 const examples=[data.bond,data.dm,data.m];
 if(data.bond.diagramFamily!=='MAKE_TEN_NUMBER_BOND'||
    data.dm.diagramFamily!=='UNIT_CONVERSION_LENGTH'||data.dm.parameters?.fromUnit!=='dm'||
    data.m.diagramFamily!=='UNIT_CONVERSION_LENGTH'||data.m.parameters?.fromUnit!=='m'||
    data.dm.parameters?.toUnit!=='cm'||data.m.parameters?.toUnit!=='cm')
   return refuse('FAMILY_MAPPING_MISMATCH');
 const ids=new Set(examples.map(x=>x.variantId));
 if(ids.size!==3)return refuse('DUPLICATE_VARIANT_ID');
 const plans=examples.map(s=>core.compilePublic(s));
 const invalid=plans.find(x=>!x.ok);if(invalid)return refuse(invalid.reason);
 const bindings=[];
 for(const s of SLOTS){
  const index=s.family==='MAKE_TEN_NUMBER_BOND'?0:s.variant==='dm'?1:2;
  const field=plans[index].fields.find(f=>f.id===s.fieldId);
  if(!field||field.role!=='INPUT'||field.value!==null)return refuse('SLOT_NOT_HIDDEN_INPUT_'+s.slotId);
  bindings.push({slotId:s.slotId,variantId:plans[index].variantId,fieldId:s.fieldId,
    role:'ANSWER_INPUT',value:null,demoPlaceholder:s.demoPlaceholder});
 }
 return {ok:true,schemaVersion:'g74-qab1-type1-public-binding-plan',
  renderStrategy:'STRUCTURED_DIAGRAM',visualMode:'REPRESENTATIVE',sourceMode:'DEMO_REFERENCE_ONLY',
  demoOriginalHtmlSha256:SOURCE_SHA256,
  plans:plans.map(p=>({schemaVersion:p.schemaVersion,variantId:p.variantId,
     diagramFamily:p.diagramFamily,fields:p.fields,layout:p.layout,
     renderStrategy:p.renderStrategy,rendererRole:p.rendererRole})),
  bindings,originalHtmlMutated:false,dynamicDomRendererApproved:false,serverGradingApproved:false};
}
module.exports=Object.freeze({SLOTS,SOURCE_SHA256,demoSourceEvidence,compileComposite});
