/* G7.4 CAPACITY_WEIGHT_REFERENCE_V1.1 – pure independent TEST engines.
 * No model answers, server calls, scores, awards or progress writes.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLCapacityWeightV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODES=Object.freeze({LITER:'LITER',WEIGHT:'WEIGHT'});
 const fail=reason=>({ok:false,reason});
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
 const value=x=>Number.isInteger(x)&&x>=0&&x<=100;
 const deny=['answer','answerKey','correct','isCorrect','correctAnswer','gradingKey','solution','expectedValue'];
 function safe(x){return x&&typeof x==='object'&&!deny.some(k=>Object.prototype.hasOwnProperty.call(x,k));}
 function compile(raw){
  if(!safe(raw)||!id(raw.exerciseId)||!Object.values(MODES).includes(raw.mode))return fail('INVALID_META');
  const isL=raw.mode===MODES.LITER,entries=isL?raw.containers:raw.pans;
  if(!Array.isArray(entries)||entries.length!==2)return fail('TWO_ENTRIES_REQUIRED');
  const seen=new Set(),items=[];
  for(const item of entries){
   if(!safe(item)||!id(item.id)||seen.has(item.id))return fail('INVALID_ENTRY_ID');
   const label=typeof item.label==='string'?item.label.trim():'';
   const assetId=typeof item.assetId==='string'?item.assetId.trim():'';
   if(!label||label.length>120||(assetId&&!/^[A-Za-z0-9_.:-]{1,120}$/.test(assetId)))return fail('INVALID_LABEL_ASSET');
   const cur=isL?item.currentLiters:item.massKg;
   if(!value(cur))return fail('INVALID_QUANTITY');
   const v={id:item.id,label,assetId,alt:typeof item.alt==='string'?item.alt.slice(0,160):''};
   if(isL){
    if(!value(item.capacityLiters)||item.capacityLiters===0||cur>item.capacityLiters)return fail('INVALID_CAPACITY');
    v.capacityLiters=item.capacityLiters;v.initialLiters=cur;
   }else v.initialKg=cur;
   seen.add(item.id);items.push(Object.freeze(v));
  }
  return {ok:true,plan:Object.freeze({schemaVersion:'g74-capacity-weight-v11',exerciseId:raw.exerciseId,
   mode:raw.mode,prompt:typeof raw.prompt==='string'?raw.prompt.slice(0,500):'',
   items:Object.freeze(items),step:1})};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-capacity-weight-v11')throw Error('INVALID_PLAN');
  const liter=plan.mode===MODES.LITER;
  const start=()=>Object.fromEntries(plan.items.map(i=>[i.id,liter?i.initialLiters:i.initialKg]));
  let amounts=start();
  const snapshot=()=>({exerciseId:plan.exerciseId,mode:plan.mode,quantities:{...amounts}});
  function adjust(key,delta){
   const item=plan.items.find(x=>x.id===key);
   if(!item)return fail('UNKNOWN_ENTRY');
   if(!Number.isInteger(delta)||Math.abs(delta)>100)return fail('INVALID_DELTA');
   const next=amounts[key]+delta,cap=liter?item.capacityLiters:100;
   if(next<0||next>cap)return fail('OUT_OF_BOUNDS');
   amounts[key]=next;return {ok:true,state:snapshot()};
  }
  return Object.freeze({
   snapshot,adjust,
   transfer(from,to,liters){
    if(!liter)return fail('WRONG_MODE');
    if(from===to||!Object.prototype.hasOwnProperty.call(amounts,from)||
      !Object.prototype.hasOwnProperty.call(amounts,to))return fail('UNKNOWN_ENTRY');
    if(!Number.isInteger(liters)||liters<=0)return fail('INVALID_TRANSFER');
    const target=plan.items.find(x=>x.id===to);
    if(amounts[from]<liters||amounts[to]+liters>target.capacityLiters)return fail('OUT_OF_BOUNDS');
    amounts[from]-=liters;amounts[to]+=liters;return {ok:true,state:snapshot()};
   },
   clear(){amounts=start();return {ok:true,state:snapshot()};},
   restore(d){
    if(!d||d.exerciseId!==plan.exerciseId||d.mode!==plan.mode||
      !d.quantities||typeof d.quantities!=='object'||Array.isArray(d.quantities)||
      Object.keys(d.quantities).length!==plan.items.length)return fail('INVALID_DRAFT');
    const copy={};
    for(const item of plan.items){
     const v=d.quantities[item.id];
     if(!value(v)||(liter&&v>item.capacityLiters))return fail('INVALID_DRAFT_QUANTITY');
     copy[item.id]=v;
    }
    amounts=copy;return {ok:true,state:snapshot()};
   }
  });
 }
 function balanceTilt(leftKg,rightKg){
  if(!value(leftKg)||!value(rightKg))throw Error('INVALID_MASS');
  // SVG screen Y increases downward. +angle clockwise => left arm rises, right lowers.
  // left lighter => positive angle; left heavier => negative angle.
  const angle=Math.max(-15,Math.min(15,(rightKg-leftKg)*3));
  const rad=angle*Math.PI/180;
  return Object.freeze({degrees:angle,leftY:58-105*Math.sin(rad),rightY:58+105*Math.sin(rad),
   relation:leftKg===rightKg?'BALANCED':leftKg<rightKg?'LEFT_LIGHTER':'RIGHT_LIGHTER'});
 }
 return Object.freeze({MODES,compile,session,balanceTilt});
});
