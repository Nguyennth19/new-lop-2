/* G7.4 Geometry/Tangram Reference V1.1. Pure, TEST only.
 * Source: frozen Original_10Forms_Grade2_20261113.html Type 5.
 * No answer key, client correctness, stars, progress, or server writes.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLGeometryTangramV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODES=Object.freeze({SHAPE_SELECT:'SHAPE_SELECT',TANGRAM:'TANGRAM'});
 const SHAPES=new Set(['polygon','rect','circle','polyline','triangle','square']);
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
 const fail=reason=>({ok:false,reason});
 const coordinate=v=>typeof v==='number'&&Number.isFinite(v)&&v>=-1000&&v<=1000;
 function geom(g){
  if(!g||typeof g!=='object'||!SHAPES.has(g.type))return null;
  const out={type:g.type};
  if(['polygon','polyline','triangle'].includes(g.type)){
   if(!Array.isArray(g.points)||g.points.length<3||g.points.length>24||
    g.points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(coordinate)))return null;
   out.points=g.points.map(p=>Object.freeze([...p]));Object.freeze(out.points);
  }else if(g.type==='rect'||g.type==='square'){
   if(![g.x,g.y,g.width,g.height].every(coordinate)||g.width<=0||g.height<=0)return null;
   Object.assign(out,{x:g.x,y:g.y,width:g.width,height:g.height});
  }else if(g.type==='circle'){
   if(![g.cx,g.cy,g.r].every(coordinate)||g.r<=0)return null;
   Object.assign(out,{cx:g.cx,cy:g.cy,r:g.r});
  }
  return Object.freeze(out);
 }
 function compile(data){
  if(!data||!id(data.exerciseId)||!Object.values(MODES).includes(data.mode))return fail('INVALID_EXERCISE_OR_MODE');
  if(['answer','answers','answerKey','correctIds','correctCount','isCorrect','gradingKey','targetRot'].some(k=>k in data))return fail('ANSWER_KEY_FORBIDDEN');
  const items=data.mode===MODES.SHAPE_SELECT?data.shapes:data.pieces;
  if(!Array.isArray(items)||items.length<2||items.length>12)return fail('INVALID_ITEM_COUNT');
  const ids=new Set(),normalized=[];
  for(const item of items){
   if(!item||!id(item.id)||ids.has(item.id))return fail('INVALID_ITEM_ID');
   if(['isQuad','correct','isCorrect','answer','targetRot','targetX','targetY'].some(k=>k in item))return fail('ANSWER_KEY_FORBIDDEN');
   const shape=geom(item.geometry);if(!shape)return fail('INVALID_GEOMETRY');
   const label=typeof item.label==='string'?item.label.trim():'';
   if(!label||label.length>140)return fail('INVALID_LABEL');
   const raw={id:item.id,label,geometry:shape};
   if(data.mode===MODES.TANGRAM){
    if(!Array.isArray(item.start)||item.start.length!==2||!item.start.every(coordinate)||
      ![0,90,180,270].includes(item.startRotation??0))return fail('INVALID_PIECE_START');
    raw.start=Object.freeze([...item.start]);raw.startRotation=item.startRotation??0;
   }
   ids.add(item.id);normalized.push(Object.freeze(raw));
  }
  const p={schemaVersion:'g74-geometry-tangram-v11',exerciseId:data.exerciseId,mode:data.mode,
    prompt:typeof data.prompt==='string'?data.prompt.slice(0,600):'',
    items:Object.freeze(normalized)};
  if(data.mode===MODES.TANGRAM){
   if(!Array.isArray(data.targets)||data.targets.length<1||data.targets.length>12)return fail('INVALID_TARGETS');
   const targets=[],tid=new Set();
   for(const t of data.targets){
    if(!t||!id(t.id)||tid.has(t.id)||!geom(t.geometry))return fail('INVALID_TARGET');
    tid.add(t.id);
    targets.push(Object.freeze({id:t.id,geometry:geom(t.geometry)}));
   }
   p.targets=Object.freeze(targets);
  }
  return {ok:true,plan:Object.freeze(p)};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-geometry-tangram-v11')throw Error('INVALID_PLAN');
  const ids=new Set(plan.items.map(x=>x.id));let selected=[],active=null;
  let pieces=Object.create(null);
  if(plan.mode===MODES.TANGRAM)for(const p of plan.items)pieces[p.id]={x:p.start[0],y:p.start[1],rotation:p.startRotation,placedTargetId:null};
  const snapshot=()=>plan.mode===MODES.SHAPE_SELECT?
   {exerciseId:plan.exerciseId,mode:plan.mode,selectedShapeIds:[...selected]}:
   {exerciseId:plan.exerciseId,mode:plan.mode,activePieceId:active,pieces:Object.fromEntries(Object.entries(pieces).map(([k,v])=>[k,{...v}]))};
  const methods={
   snapshot,
   toggleShape(k){
    if(plan.mode!==MODES.SHAPE_SELECT)return fail('WRONG_MODE');
    if(!ids.has(k))return fail('UNKNOWN_SHAPE');
    selected=selected.includes(k)?selected.filter(x=>x!==k):[...selected,k];
    return {ok:true,state:snapshot()};
   },
   selectPiece(k){
    if(plan.mode!==MODES.TANGRAM)return fail('WRONG_MODE');
    if(!ids.has(k))return fail('UNKNOWN_PIECE');
    active=k;return {ok:true,state:snapshot()};
   },
   rotatePiece(k,step=90){
    if(plan.mode!==MODES.TANGRAM)return fail('WRONG_MODE');
    if(!ids.has(k)||![90,-90].includes(step))return fail('INVALID_ROTATION');
    pieces[k]={...pieces[k],rotation:(pieces[k].rotation+step+360)%360,placedTargetId:null};
    return {ok:true,state:snapshot()};
   },
   movePiece(k,x,y){
    if(plan.mode!==MODES.TANGRAM)return fail('WRONG_MODE');
    if(!ids.has(k)||![x,y].every(coordinate))return fail('INVALID_POSITION');
    pieces[k]={...pieces[k],x,y,placedTargetId:null};return {ok:true,state:snapshot()};
   },
   placePiece(k,targetId){
    if(plan.mode!==MODES.TANGRAM)return fail('WRONG_MODE');
    if(!ids.has(k)||!plan.targets.some(t=>t.id===targetId))return fail('UNKNOWN_TARGET');
    // UI intent only: no auto-correct orientation, no score, no solution validation.
    for(const other of Object.keys(pieces))if(other!==k&&pieces[other].placedTargetId===targetId)return fail('TARGET_OCCUPIED');
    pieces[k]={...pieces[k],placedTargetId:targetId};return {ok:true,state:snapshot()};
   },
   unplacePiece(k){
    if(plan.mode!==MODES.TANGRAM||!ids.has(k))return fail('UNKNOWN_PIECE');
    pieces[k]={...pieces[k],placedTargetId:null};return {ok:true,state:snapshot()};
   },
   clear(){
    selected=[];active=null;pieces=Object.create(null);
    if(plan.mode===MODES.TANGRAM)for(const p of plan.items)pieces[p.id]={x:p.start[0],y:p.start[1],rotation:p.startRotation,placedTargetId:null};
    return {ok:true,state:snapshot()};
   },
   restore(d){
    if(!d||d.exerciseId!==plan.exerciseId||d.mode!==plan.mode)return fail('INVALID_DRAFT');
    if(plan.mode===MODES.SHAPE_SELECT){
     const v=d.selectedShapeIds;
     if(!Array.isArray(v)||v.length>ids.size||new Set(v).size!==v.length||v.some(k=>!ids.has(k)))return fail('INVALID_DRAFT_SHAPES');
     selected=[...v];return {ok:true,state:snapshot()};
    }
    if(!d.pieces||typeof d.pieces!=='object'||Array.isArray(d.pieces)||Object.keys(d.pieces).length!==ids.size||
      d.activePieceId!==null&&!ids.has(d.activePieceId))return fail('INVALID_DRAFT_PIECES');
    const next=Object.create(null),occupied=new Set();
    for(const p of plan.items){
     const z=d.pieces[p.id];
     if(!z||![z.x,z.y].every(coordinate)||![0,90,180,270].includes(z.rotation)||
       z.placedTargetId!==null&&(!plan.targets.some(t=>t.id===z.placedTargetId)||occupied.has(z.placedTargetId)))
       return fail('INVALID_DRAFT_PIECE_STATE');
     if(z.placedTargetId!==null)occupied.add(z.placedTargetId);
     next[p.id]={x:z.x,y:z.y,rotation:z.rotation,placedTargetId:z.placedTargetId};
    }
    pieces=next;active=d.activePieceId;return {ok:true,state:snapshot()};
   }
  };
  return Object.freeze(methods);
 }
 return Object.freeze({MODES,compile,session});
});
