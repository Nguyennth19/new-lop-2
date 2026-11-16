/* G7.4 DRAG_SORT_REFERENCE_V1.1 – pure TEST state and contract.
 * Inspired by Type 6 of locked 10-form source; no grade/rewards/writes.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLDragSortV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODES=Object.freeze({ORDER:'ORDER',SORT:'SORT'});
 const validId=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(v);
 const reject=reason=>({ok:false,reason});
 function compile(raw){
  if(!raw||!validId(raw.exerciseId)||!Object.values(MODES).includes(raw.mode))return reject('INVALID_META');
  if(['answer','answers','answerKey','correctOrder','correctBasket','correctGroup','gradingKey','solution'].some(k=>k in raw))return reject('ANSWER_KEY_FORBIDDEN');
  if(!Array.isArray(raw.items)||raw.items.length<2||raw.items.length>12)return reject('INVALID_ITEMS');
  const ids=new Set(),items=[];
  for(const item of raw.items){
   if(!item||!validId(item.id)||ids.has(item.id))return reject('DUPLICATE_OR_BAD_ID');
   if(['answer','correct','correctGroup','correctBasket','value','val','rank','isCorrect'].some(k=>k in item))return reject('ANSWER_KEY_FORBIDDEN');
   const label=typeof item.label==='string'?item.label.trim():'';
   const assetId=typeof item.assetId==='string'?item.assetId.trim():'';
   if(label.length>200||(!label&&!assetId)||(assetId&&!/^[A-Za-z0-9_.:-]{1,120}$/.test(assetId)))return reject('INVALID_ITEM_CONTENT');
   ids.add(item.id);items.push(Object.freeze({id:item.id,label,assetId,alt:typeof item.alt==='string'?item.alt.slice(0,160):''}));
  }
  let targets;
  if(raw.mode===MODES.ORDER){
   const count=raw.slotCount===undefined?items.length:raw.slotCount;
   if(!Number.isInteger(count)||count!==items.length)return reject('INVALID_SLOT_COUNT');
   targets=Object.freeze(Array.from({length:count},(_,i)=>Object.freeze({id:'slot_'+(i+1),label:'Ô '+(i+1)})));
  }else{
   if(!Array.isArray(raw.groups)||raw.groups.length<2||raw.groups.length>6)return reject('INVALID_GROUPS');
   const gids=new Set(),groups=[];
   for(const g of raw.groups){
    if(!g||!validId(g.id)||gids.has(g.id)||typeof g.label!=='string'||!g.label.trim()||g.label.length>140)return reject('INVALID_GROUP');
    gids.add(g.id);groups.push(Object.freeze({id:g.id,label:g.label.trim()}));
   }
   targets=Object.freeze(groups);
  }
  return {ok:true,plan:Object.freeze({schemaVersion:'g74-drag-sort-v11',exerciseId:raw.exerciseId,
   mode:raw.mode,prompt:typeof raw.prompt==='string'?raw.prompt.slice(0,500):'',items:Object.freeze(items),targets})};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-drag-sort-v11')throw Error('INVALID_PLAN');
  const ids=new Set(plan.items.map(x=>x.id)),targetIds=new Set(plan.targets.map(x=>x.id));
  const order=plan.mode===MODES.ORDER;
  let placed=Object.create(null),selected=null;
  const snapshot=()=>({exerciseId:plan.exerciseId,mode:plan.mode,selectedItemId:selected,
   placements:Object.fromEntries(Object.entries(placed))});
  const api={
   snapshot,
   select(itemId){if(!ids.has(itemId))return reject('UNKNOWN_ITEM');selected=selected===itemId?null:itemId;return {ok:true,state:snapshot()};},
   place(itemId,targetId){
    if(!ids.has(itemId)||!targetIds.has(targetId))return reject('UNKNOWN_ENDPOINT');
    // ORDER: moving into an occupied slot swaps the previous item with the source slot.
    const previous=placed[itemId];const occupant=order?Object.keys(placed).find(k=>k!==itemId&&placed[k]===targetId):null;
    if(occupant){if(previous)placed[occupant]=previous;else delete placed[occupant];}
    placed[itemId]=targetId;selected=null;
    return {ok:true,state:snapshot()};
   },
   placeSelected(targetId){return selected?api.place(selected,targetId):reject('NO_SELECTED_ITEM');},
   remove(itemId){if(!ids.has(itemId))return reject('UNKNOWN_ITEM');delete placed[itemId];return {ok:true,state:snapshot()};},
   clear(){placed=Object.create(null);selected=null;return {ok:true,state:snapshot()};},
   restore(draft){
    if(!draft||draft.exerciseId!==plan.exerciseId||draft.mode!==plan.mode||!draft.placements||
      typeof draft.placements!=='object'||Array.isArray(draft.placements))return reject('INVALID_DRAFT');
    const next=Object.create(null),used=new Set();
    for(const [k,t] of Object.entries(draft.placements)){
     if(!ids.has(k)||!targetIds.has(t)||order&&used.has(t))return reject('INVALID_DRAFT_PLACEMENT');
     next[k]=t;used.add(t);
    }
    if(draft.selectedItemId!==null&&draft.selectedItemId!==undefined&&!ids.has(draft.selectedItemId))return reject('INVALID_DRAFT_SELECTION');
    placed=next;selected=draft.selectedItemId||null;return {ok:true,state:snapshot()};
   }
  };
  return Object.freeze(api);
 }
 return Object.freeze({MODES,compile,session});
});
