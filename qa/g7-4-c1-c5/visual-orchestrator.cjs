'use strict';
/* G7.4 C2 — pure, fail-closed orchestration, never touches DOM, grading or source questions. */
const MODES=new Set(['EXACT_COUNT','REPRESENTATIVE','DECORATIVE']);
const MEASURE=new Set(['GEOMETRY_TANGRAM','RULER_CLOCK']);
const blocked=(reason)=>({ok:false,status:'BLOCKED',reason,sourceKind:null,assetId:null});
function resolve(request,env){
 if(!request||!env||!env.policy||env.policy.schemaVersion!=='g7-4-c1-10-exercise-visual-policy-v1')return blocked('INVALID_CONTEXT');
 const type=env.policy.exerciseTypes.find(x=>x.id===request.exerciseType);
 if(!type)return blocked('UNKNOWN_EXERCISE_TYPE');
 const mode=request.visualMode||type.defaultMode;
 if(!MODES.has(mode))return blocked('INVALID_MODE');
 const base={ok:true,status:'RESOLVED',mode,exerciseType:type.id,questionId:request.questionId||null,quantitySemantics:'NONE',answerDisclosure:'NONE',runtimeEnabled:false};
 if(mode==='DECORATIVE')return {...base,sourceKind:'NONE',assetId:null,renderRequired:false};
 if(MEASURE.has(type.id)){
  const scene=request.mathScene,approved=env.mathScenes?.find(x=>x.id===scene?.sceneId);
  if(!scene||!approved||approved.qaStatus!=='APPROVED_TEST'||approved.geometryType!==scene.geometryType||
    approved.exerciseType!==type.id)return blocked('APPROVED_MATH_SCENE_REQUIRED');
  if(scene.geometryType==='CLOCK'&&(!Number.isInteger(scene.hour)||scene.hour<1||scene.hour>12||
      !Number.isInteger(scene.minute)||scene.minute<0||scene.minute>59))
    return blocked('INVALID_CLOCK_PARAMETERS');
  if(scene.geometryType==='TRIANGLE'&&(!Array.isArray(scene.points)||scene.points.length!==3||
      scene.points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>1000))))
    return blocked('INVALID_GEOMETRY_PARAMETERS');
  return {...base,sourceKind:'PARAMETRIC_SVG',renderMode:'PARAMETRIC_SVG',assetId:null,
   mathScene:scene,quantitySemantics:'GEOMETRIC_EXACT',renderRequired:true};
 }
 if(mode==='EXACT_COUNT'){
  if(request.directCountIntent!==true)return blocked('DIRECT_COUNT_INTENT_REQUIRED');
  if(!Number.isSafeInteger(request.quantity)||request.quantity<1||request.quantity>50)return blocked('QUANTITY_OUT_OF_TEST_RANGE');
  if(typeof request.unit!=='string'||!request.unit)return blocked('COUNT_UNIT_REQUIRED');
  const record=env.countRegistry?.assets?.find(x=>x.assetId===request.assetId);
  if(!record||record.status!=='COUNT_SAFE_APPROVED'||record.objectsPerAsset!==1||
   record.sourceSha256!==request.assetSha256||!record.countUnitAliases.includes(request.unit))
   return blocked('COUNT_EVIDENCE_OR_UNIT_MISSING');
  return {...base,sourceKind:'FLUENT_FLAT_PINNED',renderMode:'REPEAT_SINGLE_FLAT',assetId:record.assetId,
   sourceSha256:record.sourceSha256,unit:record.canonicalUnit,quantity:request.quantity,
   quantitySemantics:'EXACT',renderRequired:true};
 }
 if(request.quantity!==undefined||request.unit!==undefined||request.directCountIntent===true)return blocked('REPRESENTATIVE_CANNOT_IMPLY_QUANTITY');
 if(request.contextImageOptional===true&&request.preferNoImage===true)return {...base,sourceKind:'NONE',renderRequired:false};
 const rules=env.semanticRules?.rules||[];
 const matching=rules.filter(x=>x.concept===request.conceptKey&&x.label_status==='LABEL_APPROVED');
 if(matching.length>1)return blocked('AMBIGUOUS_CONCEPT');
 if(matching.length===1)return {...base,sourceKind:'WEBP_APPROVED',renderMode:'SINGLE_WEBP',
   conceptKey:request.conceptKey,assetId:matching[0].asset_id,renderRequired:true};
 const flat=env.countRegistry?.assets?.filter(x=>x.assetId===request.preferredFlatId)||[];
 if(flat.length===1&&flat[0].sourceSha256===request.assetSha256)
  return {...base,sourceKind:'FLUENT_FLAT_PINNED',renderMode:'SINGLE_FLUENT_FLAT',
   assetId:flat[0].assetId,sourceSha256:flat[0].sourceSha256,renderRequired:true};
 return {...base,sourceKind:'NONE',renderMode:'NO_IMAGE',assetId:null,renderRequired:false,reason:'NO_CURATED_MATCH'};
}
function resolveVariant(before,change){
 if(!before||!change||typeof change!=='object')return blocked('INVALID_VARIANT');
 if(change.type==='SIMPLIFY_VISUAL'){
  if(change.sameSkill!==true||change.sameMathRelationship!==true||change.measurementAssessed===true&&change.changesGeometry===true)
   return blocked('PEDAGOGIC_EQUIVALENCE_NOT_PROVEN');
  return {ok:true,status:'VARIANT_ELIGIBLE',type:change.type,requiresNewVariantId:false};
 }
 if(change.type==='REWRITE_VARIANT'){
  if(change.newVariantId===before.questionId||!change.newVariantId||change.sameSkill!==true||
   change.levelEquivalent!==true||change.answerRecomputed!==true||change.validatorPassed!==true)
   return blocked('REWRITE_NOT_VALIDATED');
  if(change.breaksTargetGeometry===true)return blocked('TARGET_GEOMETRY_CHANGED');
  return {ok:true,status:'VARIANT_ELIGIBLE',type:change.type,newVariantId:change.newVariantId};
 }
 return blocked('UNKNOWN_TRANSFORMATION');
}
module.exports={resolve,resolveVariant,blocked};
