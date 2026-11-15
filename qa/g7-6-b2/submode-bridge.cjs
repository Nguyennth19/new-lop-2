'use strict';
/* B.2-only typed extension; original B adapters/matrix and renderer sources unchanged.
 * Tangram and pictograph comparison remain TYPED TEST FIXTURE, never P0.6 live producer.
 */
const path=require('node:path');
const {readMatrix,projectPublic,nativeFromPublic}=require('../g7-6/variant-adapter-bridge.cjs');
const {loadManifest}=require('../g7-6/resource-renderer-resolver.cjs');
const geo=require('../g7-4-geometry-tangram-reference-v11/geometry-v11-core.js');
const picto=require('../g7-4-pictograph-reference-v11/pictograph-v11-core.js');
const fail=(code,detail)=>({ok:false,code,detail:detail||null,releaseReady:false});
const arrays=[
 'pieceIds','pieceLabels','pieceGeometryJson','pieceStartX','pieceStartY','pieceRotations',
 'targetIds','targetGeometryJson'
];
const additional={
 D5:['submode',...arrays],
 D9:['questionType','otherRowId','relation']
};
const safeId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
const unique=x=>new Set(x).size===x.length;
function overlayMatrix(){
 const m=readMatrix();
 return {...m,adapters:m.adapters.map(a=>({...a,
  allowedPublicParameters:[...a.allowedPublicParameters,...(additional[a.typeId]||[])]}))};
}
function geometryJSON(text){
 if(typeof text!=='string'||text.length>250)return null;
 let g;try{g=JSON.parse(text)}catch(_){return null}
 if(!g||typeof g!=='object'||Array.isArray(g))return null;
 const type=g.type;
 if(['polygon','polyline','triangle'].includes(type)){
  if(Object.keys(g).some(k=>!['type','points'].includes(k))||
     !Array.isArray(g.points)||g.points.length<3||g.points.length>24||
     g.points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v)||v< -1000||v>1000)))return null;
  return g;
 }
 if(['rect','square'].includes(type)){
  if(Object.keys(g).some(k=>!['type','x','y','width','height'].includes(k))||
     ![g.x,g.y,g.width,g.height].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=-1000&&v<=1000)||
     g.width<=0||g.height<=0)return null;return g;
 }
 if(type==='circle'){
  if(Object.keys(g).some(k=>!['type','cx','cy','r'].includes(k))||
     ![g.cx,g.cy,g.r].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=-1000&&v<=1000)||
     g.r<=0)return null;return g;
 }
 return null;
}
function nativeSubmode(envelope){
 const p=envelope.display.publicParameters,base='G76_'+envelope.questionId.replace(/[^A-Za-z0-9_-]/g,'_').slice(0,62);
 if(envelope.typeId==='D5'){
  if(p.submode!=='TANGRAM')return nativeFromPublic(envelope);
  if(!arrays.every(k=>Array.isArray(p[k]))||p.pieceIds.length<2||p.pieceIds.length>12||
     p.targetIds.length<1||p.targetIds.length>12||
     ['pieceIds','pieceLabels','pieceGeometryJson','pieceStartX','pieceStartY','pieceRotations'].some(k=>p[k].length!==p.pieceIds.length)||
     ['targetIds','targetGeometryJson'].some(k=>p[k].length!==p.targetIds.length)||
     !unique([...p.pieceIds,...p.targetIds])||[...p.pieceIds,...p.targetIds].some(x=>!safeId(x)))
   return fail('D5_TANGRAM_CARDINALITY_OR_ID');
  const raw={exerciseId:base,mode:'TANGRAM',prompt:envelope.display.prompt,pieces:[],targets:[]};
  for(let i=0;i<p.pieceIds.length;i++){
   const geometry=geometryJSON(p.pieceGeometryJson[i]),start=[p.pieceStartX[i],p.pieceStartY[i]];
   if(!geometry||typeof p.pieceLabels[i]!=='string'||p.pieceLabels[i].length>140||
      !start.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=-1000&&v<=1000)||
      ![0,90,180,270].includes(p.pieceRotations[i]))return fail('D5_TANGRAM_INVALID_GEOMETRY');
   raw.pieces.push({id:p.pieceIds[i],label:p.pieceLabels[i],geometry,start,startRotation:p.pieceRotations[i]});
  }
  for(let i=0;i<p.targetIds.length;i++){
   const geometry=geometryJSON(p.targetGeometryJson[i]);if(!geometry)return fail('D5_TANGRAM_INVALID_TARGET');
   raw.targets.push({id:p.targetIds[i],geometry});
  }
  const result=geo.compile(raw);
  return result.ok?{ok:true,nativeSchema:result.plan.schemaVersion,plan:result.plan,gradingEnabled:false}:fail('D5_NATIVE_TANGRAM_DENIED',result.reason);
 }
 if(envelope.typeId==='D9'){
  if(p.questionType!=='COMPARE_DIFFERENCE')return nativeFromPublic(envelope);
  const n=p.rowIds?.length;
  if(!Number.isInteger(n)||n<2||n>12||!['rowLabels','rowSymbols','itemCounts'].every(k=>Array.isArray(p[k])&&p[k].length===n)||
     !unique(p.rowIds)||p.rowIds.some(x=>!safeId(x))||
     !['MORE_THAN','LESS_THAN'].includes(p.relation)||
     p.questionRowId===p.otherRowId||!p.rowIds.includes(p.questionRowId)||!p.rowIds.includes(p.otherRowId))
   return fail('D9_COMPARE_RELATION_OR_ROWS');
  const symbols=new Set(['🍎','🍌','⭐','🐟','●']);
  if(p.rowSymbols.some(x=>!symbols.has(x))||p.itemCounts.some(x=>!Number.isInteger(x)||x<1||x>40))
   return fail('D9_COUNT_SAFE_SYMBOL_OR_QUANTITY_DENIED');
  const raw={exerciseId:base,mode:envelope.mode,prompt:envelope.display.prompt,
   rows:p.rowIds.map((id,i)=>({id,label:p.rowLabels[i],contentType:'EMOJI',symbol:p.rowSymbols[i],itemCount:p.itemCounts[i]})),
   questions:[{id:'q_1',type:'COMPARE_DIFFERENCE',prompt:envelope.display.prompt,
    rowId:p.questionRowId,otherRowId:p.otherRowId,relation:p.relation}]};
  const result=picto.compile(raw);
  return result.ok?{ok:true,nativeSchema:result.plan.schemaVersion,plan:result.plan,gradingEnabled:false}:fail('D9_NATIVE_COMPARE_DENIED',result.reason);
 }
 return nativeFromPublic(envelope);
}
function adaptSubmode(source){
 if(!source||!['D5','D9'].includes(source.typeId))return fail('B2_SUBMODE_ONLY');
 if(source.scope!=='G76_TYPED_TEST_FIXTURE')return fail('P06_SUBMODE_PRODUCER_NOT_SUPPORTED');
 const projected=projectPublic(source,{matrix:overlayMatrix(),manifest:loadManifest()});
 if(!projected.ok)return projected;
 const native=nativeSubmode(projected.envelope);if(!native.ok)return native;
 return {...projected,sourceEvidence:'B2_TYPED_FIXTURE_NOT_P06_PRODUCER',
  nativeRenderer:{typeId:source.typeId,plan:native.plan,schemaVersion:native.nativeSchema,
   originalRendererModified:false,gradingEnabled:false,countRuntimeApproved:false,
   assetBindingAllowed:false,ttsExecuted:false,verifiedSubmode:source.typeId==='D5'?'TANGRAM':'COMPARE_DIFFERENCE'}};
}
module.exports={overlayMatrix,geometryJSON,nativeSubmode,adaptSubmode};
