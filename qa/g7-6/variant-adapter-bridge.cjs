'use strict';
/* G7.6-B pure TEST projection + native reference-plan adapter.
 * No DOM, GAS, student IO, scoring, token handling or grading.
 * The source P0.6 question may contain answerSpec; it is NEVER copied into public data.
 * This is not a trusted server implementation and cannot authorize D10/grading/assets.
 */
const fs=require('node:fs');
const path=require('node:path');
const {loadManifest,validateEnvelope,resolvePublicEnvelope}=require('./resource-renderer-resolver.cjs');
const matrixPath=path.resolve(__dirname,'../../du-lieu/g7-6/variant-adapter-matrix.v1.json');
const coreRoot=path.resolve(__dirname,'..');
const NATIVE=Object.freeze({
 D1:'g7-4-renderer-batch-qa-v1/type1-demo-source-map.qa-b1.cjs',
 D2:'g7-4-column-calc-reference-v12/column-v12-core.js',
 D3:'g7-4-matching-reference-v11/matching-v11-core.js',
 D4:'g7-4-choice-reference-v11/choice-v11-core.js',
 D5:'g7-4-geometry-tangram-reference-v11/geometry-v11-core.js',
 D6:'g7-4-drag-sort-reference-v11/drag-sort-v11-core.js',
 D7:'g7-4-comparison-reference-v11/comparison-v11-core.js',
 D8:'g7-4-measurement-reference-v11/measurement-v11-core.js',
 D8A:'g7-4-capacity-weight-reference-v11/capacity-weight-v11-core.js',
 D8B:'g7-4-capacity-weight-reference-v11/capacity-weight-v11-core.js',
 D9:'g7-4-pictograph-reference-v11/pictograph-v11-core.js'
});
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9_.:-]{1,100}$/.test(x);
const nativeId=x=>String(x).replace(/[^A-Za-z0-9_-]/g,'_').slice(0,62);
const bad=(code,detail)=>({ok:false,code,detail:detail||null,scope:'ISOLATED_TEST_ONLY',releaseReady:false});
function readMatrix(){return JSON.parse(fs.readFileSync(matrixPath,'utf8'))}
function checkMatrix(matrix,manifest){
 if(!isObj(matrix)||matrix.schemaVersion!=='g76.variant-adapter-matrix.v1'||
    matrix.base?.commit!=='ee20a8b7394e22e6028d6760c49b77c54a2814cc'||
    matrix.release?.gasDeployAllowed!==false||!Array.isArray(matrix.adapters)||
    matrix.adapters.length!==12||new Set(matrix.adapters.map(x=>x.typeId)).size!==12)
  return bad('MATRIX_INVALID');
 const known=new Set(manifest.rendererRegistry.map(x=>x.id));
 for(const a of matrix.adapters){
  const ref=manifest.rendererRegistry.find(r=>r.id===a.typeId);
  if(!ref||!known.has(a.typeId)||a.sourceCopy!==false||!Array.isArray(a.allowedPublicParameters)||
     !a.sourceKind||!a.visualStrategy||!a.visualMode||a.rendererSource!=='du-lieu/g7-6/resource-renderer-manifest.v1.json')
   return bad('MATRIX_REFERENCE_DRIFT',a.typeId);
 }
 return {ok:true};
}
function sourceParams(source,entry){
 const q=source.question;
 if(entry.typeId==='D2'){
  const p=q.parameters,kind=source.mathKind||source.variant?.mathKind;
  if(!isObj(p)||!Number.isSafeInteger(p.a)||!Number.isSafeInteger(p.b)||
     !['ADD','SUBTRACT'].includes(kind)||p.a<0||p.b<0)
   return bad('P06_COLUMN_OPERANDS_INVALID');
  const total=kind==='ADD'?p.a+p.b:p.a-p.b;
  if(total<0||total>999||p.a>999||p.b>999)return bad('COLUMN_1000_BOUNDARY_PENDING');
  const profile=Math.max(p.a,p.b,total)<=99?'PV100':'PV1000';
  return {ok:true,value:{a:p.a,b:p.b,operation:kind,profile,
   level:['LV1','LV2','LV3'].includes(q.levelId)?q.levelId:'LV1',carryPolicy:'OPTIONAL_HINT'}};
 }
 if(entry.typeId==='D4'){
  const v=source.variant;
  if(!isObj(v)||v.interaction?.to!=='CHOICE'||!Array.isArray(v.interaction.optionValues))
   return bad('P06_CHOICE_INTERACTION_REQUIRED');
  const values=v.interaction.optionValues;
  if(values.length<2||values.length>8||new Set(values).size!==values.length||
     values.some(x=>!Number.isSafeInteger(x)))return bad('P06_VISIBLE_OPTIONS_INVALID');
  return {ok:true,value:{selectionMode:'SINGLE'},choices:values.map((v,i)=>({id:'opt_'+(i+1),text:String(v)}))};
 }
 if(!isObj(q.publicParameters))return bad('TYPED_PUBLIC_PARAMETERS_REQUIRED');
 if(Object.keys(q.publicParameters).some(k=>!entry.allowedPublicParameters.includes(k)))
  return bad('PUBLIC_PARAMETER_NOT_ALLOWLISTED');
 if(q.publicChoices!==undefined&&entry.typeId!=='D4')return bad('UNEXPECTED_VISIBLE_CHOICES');
 return {ok:true,value:{...q.publicParameters}};
}
function projectPublic(source,{matrix=readMatrix(),manifest=loadManifest()}={}){
 const valid=checkMatrix(matrix,manifest);if(!valid.ok)return valid;
 if(!isObj(source)||!isObj(source.question)||!id(source.lessonId)||!id(source.variantId)||
    !id(source.question.id)||typeof source.question.prompt!=='string'||!source.question.prompt.trim()||
    !['PRACTICE','ASSESSMENT'].includes(source.mode||'PRACTICE'))
  return bad('P06_SOURCE_CONTRACT_INVALID');
 const a=matrix.adapters.find(x=>x.typeId===source.typeId);
 if(!a)return bad('UNKNOWN_TYPE_ID');
 const q=source.question;
 if(q.kind!==a.sourceKind||!isObj(q.renderer)||q.renderer.component!==q.kind)
  return bad('SOURCE_KIND_RENDERER_MISMATCH');
 if(a.typeId==='D10')return bad('D10_EXISTING_G6_ONLY_NEW_VARIANT_ROUTE_DENIED');
 if(a.evidenceStatus==='FIXTURE_ONLY'||a.evidenceStatus.startsWith('FIXTURE_ONLY_')){
  if(source.scope!=='G76_TYPED_TEST_FIXTURE')return bad('P06_GENERATOR_MAPPING_NOT_VERIFIED');
 }else if(source.scope!=='P06_GENERATOR_CANDIDATE_OFFLINE')
  return bad('P06_CANDIDATE_SCOPE_REQUIRED');
 if(q.lessonId!==undefined&&q.lessonId!==source.lessonId)return bad('LESSON_ID_MISMATCH');
 if(q.assetId!==undefined||q.assets?.sceneId!=null||source.assetId!==undefined||
    source.visualIntent?.assetId!==undefined||source.visualIntent?.countEvidenceRef!==undefined)
  return bad('ASSET_BINDING_NOT_APPROVED');
 if(source.speechText!==undefined||source.speech?.text!==undefined)return bad('UNTRUSTED_SPEECH_TEXT');
 const params=sourceParams(source,a);if(!params.ok)return params;
 const choices=params.choices;
 const envelope={
  schemaVersion:'g76.public-envelope.v1',
  lessonId:source.lessonId,questionId:q.id,variantId:source.variantId,
  typeId:a.typeId,mode:source.mode||'PRACTICE',
  display:{prompt:q.prompt,publicParameters:params.value,...(choices?{visibleChoices:choices}:{})},
  visualIntent:{visualMode:a.visualMode,renderStrategy:a.visualStrategy},
  speech:{enabled:source.speech?.enabled!==false,
   profileId:source.speech?.profileId||matrix.speech.default,visiblePromptOnly:true}
 };
 const check=validateEnvelope(envelope);if(!check.ok)return bad(check.code);
 const resolve=resolvePublicEnvelope(manifest,envelope);if(!resolve.ok)return bad(resolve.code);
 return {ok:true,scope:'ISOLATED_TEST_ONLY',releaseReady:false,envelope,
  sourceEvidence:a.evidenceStatus,selection:resolve,grading:{enabled:false,serverRoute:'NOT_CONNECTED'}};
}
function nativeFromPublic(envelope){
 const check=validateEnvelope(envelope);if(!check.ok)return bad(check.code);
 if(envelope.typeId==='D10')return bad('D10_EXISTING_G6_ONLY_NEW_VARIANT_ROUTE_DENIED');
 const p=envelope.display.publicParameters,questionId=nativeId(envelope.questionId);
 const exerciseId='G76_'+questionId,variantId='COL_'+nativeId(envelope.variantId);
 const arr=(key,n)=>Array.isArray(p[key])&&p[key].length===n;
 let raw,engine,fn='compile';
 switch(envelope.typeId){
  case 'D1': {
   const {compileComposite}=require(path.join(coreRoot,NATIVE.D1));
   const build=(suffix,family,skill,parameters,hiddenFields)=>({
    variantId:exerciseId+suffix,diagramFamily:family,skill,visualMode:'REPRESENTATIVE',
    assetId:null,usesImageLibrary:false,parameters,hiddenFields
   });
   const result=compileComposite({
    bond:build('_bond','MAKE_TEN_NUMBER_BOND','ADD_THROUGH_TEN',{a:p.a,b:p.b},['splitToTen','remainder','tenStep','total']),
    dm:build('_dm','UNIT_CONVERSION_LENGTH','CONVERT_LENGTH_UNITS',{amount:p.dm,fromUnit:'dm',toUnit:'cm'},['convertedAmount']),
    m:build('_m','UNIT_CONVERSION_LENGTH','CONVERT_LENGTH_UNITS',{amount:p.m,fromUnit:'m',toUnit:'cm'},['convertedAmount'])
   });
   return result.ok?{ok:true,nativeSchema:result.schemaVersion,plan:result,gradingEnabled:false}:bad('NATIVE_D1_REJECTED',result.reason);
  }
  case 'D2':{
   engine=require(path.join(coreRoot,NATIVE.D2));fn='publicPlan';
   raw={variantId,profile:p.profile,operation:p.operation,level:p.level,carryPolicy:p.carryPolicy,
    a:p.a,b:p.b,assetId:null};break;
  }
  case 'D3':{
   if(!arr('leftIds',p.leftTexts?.length)||!arr('rightIds',p.rightTexts?.length)||
      !arr('rightTexts',p.leftIds.length))return bad('D3_ARRAY_SHAPE');
   raw={exerciseId,relationMode:p.relationMode,
    leftItems:p.leftIds.map((id,i)=>({id,content:{type:'TEXT',text:p.leftTexts[i]}})),
    rightItems:p.rightIds.map((id,i)=>({id,content:{type:'TEXT',text:p.rightTexts[i]}}))};break;
  }
  case 'D4':{
   const choices=envelope.display.visibleChoices;
   if(!Array.isArray(choices))return bad('D4_CHOICES_REQUIRED');
   raw={questionId,selectionMode:p.selectionMode,prompt:{type:'TEXT',text:envelope.display.prompt},
    options:choices.map(x=>({id:x.id,content:{type:'TEXT',text:x.text}})),
    speechEnabled:envelope.speech.enabled,speechText:envelope.display.prompt};break;
  }
  case 'D5':{
   const n=p.shapeIds?.length;
   if(!Number.isInteger(n)||n<2||!['shapeLabels','shapeTypes','shapeX','shapeY','shapeW','shapeH'].every(k=>arr(k,n)))
    return bad('D5_ARRAY_SHAPE');
   raw={exerciseId,mode:'SHAPE_SELECT',prompt:envelope.display.prompt,
    shapes:p.shapeIds.map((id,i)=>({id,label:p.shapeLabels[i],geometry:{
     type:p.shapeTypes[i],x:p.shapeX[i],y:p.shapeY[i],width:p.shapeW[i],height:p.shapeH[i]}}))};break;
  }
  case 'D6':{
   const n=p.itemIds?.length;
   if(!Number.isInteger(n)||n<2||!arr('itemLabels',n))return bad('D6_ARRAY_SHAPE');
   raw={exerciseId,mode:p.sortMode,prompt:envelope.display.prompt,
    items:p.itemIds.map((id,i)=>({id,label:p.itemLabels[i]}))};
   if(p.sortMode==='SORT'){
    if(!arr('groupIds',p.groupLabels?.length))return bad('D6_GROUP_SHAPE');
    raw.groups=p.groupIds.map((id,i)=>({id,label:p.groupLabels[i]}));
   }break;
  }
  case 'D7':{
   const n=p.rowIds?.length;
   if(!Number.isInteger(n)||n<1||!arr('leftTexts',n)||!arr('rightTexts',n))return bad('D7_ARRAY_SHAPE');
   raw={exerciseId,hintPolicy:p.hintPolicy||'HIDDEN',prompt:envelope.display.prompt,
    rows:p.rowIds.map((id,i)=>({id,left:{type:'MATH',text:p.leftTexts[i]},right:{type:'MATH',text:p.rightTexts[i]}}))};break;
  }
  case 'D8':{
   raw={exerciseId,mode:p.measureMode,prompt:envelope.display.prompt,
    model:p.measureMode==='RULER'?{
     segmentStart:p.segmentStart,segmentEnd:p.segmentEnd,pixelsPerUnit:p.pixelsPerUnit,
     rulerUnits:p.rulerUnits,initialZero:p.initialZero,unit:p.unit
    }:{initialHour:p.initialHour,initialMinute:p.initialMinute,minuteStep:p.minuteStep}};break;
  }
  case 'D8A':
  case 'D8B':{
   const n=p.itemIds?.length;
   if(n!==2||!arr('itemLabels',2))return bad('D8AB_ARRAY_SHAPE');
   const liter=envelope.typeId==='D8A';
   if(!arr(liter?'capacityLiters':'massKg',2)||(liter&&!arr('currentLiters',2)))
    return bad('D8AB_QUANTITIES_REQUIRED');
   raw={exerciseId,mode:liter?'LITER':'WEIGHT',prompt:envelope.display.prompt};
   raw[liter?'containers':'pans']=p.itemIds.map((id,i)=>liter?
    {id,label:p.itemLabels[i],capacityLiters:p.capacityLiters[i],currentLiters:p.currentLiters[i]}:
    {id,label:p.itemLabels[i],massKg:p.massKg[i]});break;
  }
  case 'D9':{
   const n=p.rowIds?.length;
   if(!Number.isInteger(n)||n<1||!arr('rowLabels',n)||!arr('rowSymbols',n)||!arr('itemCounts',n))
    return bad('D9_ARRAY_SHAPE');
   if(p.rowSymbols.some(x=>!['🍎','🍌','⭐','🐟','●'].includes(x))||
      p.itemCounts.some(x=>!Number.isInteger(x)||x<1||x>40))
    return bad('D9_COUNT_SAFE_SYMBOL_OR_QUANTITY_DENIED');
   raw={exerciseId,mode:envelope.mode,prompt:envelope.display.prompt,
    rows:p.rowIds.map((id,i)=>({id,label:p.rowLabels[i],contentType:'EMOJI',
     symbol:p.rowSymbols[i],itemCount:p.itemCounts[i]})),
    questions:[{id:'q_1',type:'COUNT',prompt:envelope.display.prompt,rowId:p.questionRowId}]};
   break;
  }
  default:return bad('UNSUPPORTED_TYPE');
 }
 engine=engine||require(path.join(coreRoot,NATIVE[envelope.typeId]));
 const result=engine[fn](raw);
 if(!result.ok)return bad('NATIVE_'+envelope.typeId+'_REJECTED',result.reason);
 return {ok:true,nativeSchema:result.plan?.schemaVersion||result.schemaVersion,
  plan:result.plan||result,gradingEnabled:false,countRuntimeApproved:false};
}
function adapt(source,opts={}){
 const result=projectPublic(source,opts);if(!result.ok)return result;
 const native=nativeFromPublic(result.envelope);if(!native.ok)return native;
 return {...result,nativeRenderer:{typeId:result.envelope.typeId,
  schemaVersion:native.nativeSchema,plan:native.plan,sourceFile:NATIVE[result.envelope.typeId],
  originalRendererModified:false,gradingEnabled:false,assetBindingAllowed:false,
  countRuntimeApproved:false,ttsExecuted:false}};
}
module.exports={readMatrix,checkMatrix,projectPublic,nativeFromPublic,adapt,NATIVE};
