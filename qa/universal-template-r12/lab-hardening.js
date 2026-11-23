/* ULT-R2: independent LAB-only state, mode and semantic-image adapters.
 * Source renderer files stay byte-identical to frozen be-hoc; no student data.
 */
(function(global){
 'use strict';
 const FIELDS=Object.freeze(['n1','op','n2','sum','answer']);
 const safe=o=>JSON.parse(JSON.stringify(o));
 const ok=()=>({ok:true});
 const fail=reason=>({ok:false,reason});
 const CAPABILITIES=Object.freeze({
  D1:[{skill:'NUMBER_BOND',type:'bond'}],
  D2:[{skill:'COLUMN_ADD',type:'vertical',mode:'ADD',profiles:['PV100','PV1000']},
      {skill:'COLUMN_SUBTRACT',type:'vertical',mode:'SUBTRACT',profiles:['PV100']}],
  D3:[{skill:'MATCH_PAIRS',type:'matching'}],
  D4:[{skill:'SELECT_CHOICE',type:'choice'}],
  D5:[{skill:'SHAPE_TANGRAM',type:'geometry',mode:'TANGRAM'},
      {skill:'SHAPE_SELECT',type:'geometry',mode:'SHAPE_SELECT'}],
  D6:[{skill:'ORDER_NUMBERS',type:'ordering',mode:'ORDER'},
      {skill:'SORT_GROUPS',type:'ordering',mode:'SORT'}],
  D7:[{skill:'COMPARE_NUMBER',type:'comparison'}],
  D8:[{skill:'MEASURE_RULER',type:'measurement',mode:'RULER'},
      {skill:'READ_CLOCK',type:'measurement',mode:'CLOCK'}],
  D8A:[{skill:'LITER_CAPACITY',type:'capacity',mode:'LITER'}],
  D8B:[{skill:'MASS_BALANCE',type:'mass',mode:'WEIGHT'}],
  D9:[{skill:'PICTOGRAPH',type:'pictograph'}],
  D10:[{skill:'WORD_PROBLEM',type:'word_problem'}]
 });
 function grant(q){
  const list=CAPABILITIES[q?.rendererId]||[];
  return list.some(g=>q.skillId===g.skill&&q.questionType===g.type&&
   (!g.mode||q.publicVariant?.mode===g.mode||q.publicVariant?.operation===g.mode)&&
   (!g.profiles||g.profiles.includes(q.publicVariant?.profile)));
 }
 function wrapD1(core,host,plan,onChange){
  const allowed=new Set(plan.slots.map(x=>x.id));
  let raw=null,isRestoring=false;
  function snapshot(){
   const fields=raw?.collect?.().fields||{};
   const active=host.querySelector('.g74t1-slot.active[data-slot]')?.dataset.slot||
     plan.slots[0].id;
   return {variantId:plan.caseId,values:{...fields},active};
  }
  const notify=()=>{if(!isRestoring&&raw)onChange(snapshot());};
  const handle=core.mount(host,plan,{onChange:notify});
  if(!handle?.ok)return handle;
  raw=handle;
  return {ok:true,snapshot,
   restore(d){
    if(!d||d.variantId!==plan.caseId||!d.values||typeof d.values!=='object'||
      Array.isArray(d.values)||!allowed.has(d.active)||
      Object.keys(d.values).some(k=>!allowed.has(k)||typeof d.values[k]!=='string'||
      !/^\d{0,4}$/.test(d.values[k])||
      d.values[k].length>Number(raw.slots.get(k).dataset.maxlength)))
      return fail('INVALID_D1_DRAFT');
    // Suppress renderer-originated intermediate callbacks while replaying digits.
    // The public D1 renderer remains frozen and unmodified.
    isRestoring=true;
    try{
     raw.reset();
     for(const [id,value] of Object.entries(d.values)){
      raw.select(id);
      if(value===''){raw.input('CLR');continue}
      for(const digit of value)raw.input(digit);
     }
     raw.select(d.active);
    }finally{isRestoring=false;}
    notify();return ok();
   },
   clear(){
    isRestoring=true;try{raw.reset()}finally{isRestoring=false;}
    notify();return ok();
   },
   destroy(){host.replaceChildren()}
  };
 }
 function wrapD2(view,host,plan,onChange,onSpeak){
  let isRestoring=false;
  const handle=view.mount(host,[plan],{
   onChange:(_i,s)=>{if(!isRestoring)onChange(s)},onSpeak
  });
  if(!handle?.ok)return handle;
  const slots=plan.answerSlots.map(s=>s.id);
  const transitions=plan.transitionSlots.map(s=>s.id);
  function snapshot(){return handle.collect(0)}
  function restore(d,activeInput){
   if(!d||d.variantId!==plan.variantId||
     Object.keys(d).some(k=>k!=='variantId'&&!slots.includes(k)&&!transitions.includes(k))||
     slots.some(k=>typeof d[k]!=='string'||!/^[0-9]?$/.test(d[k]))||
     transitions.some(k=>typeof d[k]!=='boolean')||
     (activeInput!==undefined&&activeInput!==null&&!slots.includes(activeInput)))
    return fail('INVALID_D2_DRAFT');
   // Verify all targets before modifying any state.
   const inputs=new Map(slots.map(id=>[id,host.querySelector('[data-answer="'+id+'"]')]));
   if([...inputs.values()].some(input=>!input))return fail('D2_MISSING_INPUT');
   const buttons=new Map(transitions.map(id=>[id,host.querySelector('[data-transition="'+id+'"]')]));
   if(transitions.some(id=>d[id]&&!buttons.get(id)))return fail('D2_MISSING_TRANSITION');
   // Native D2 dispatches input and auto-advances focus; only one final callback
   // may escape the adapter when restoring a stored draft.
   isRestoring=true;
   try{
    handle.reset();
    const EventClass=host.ownerDocument.defaultView.Event;
    for(const id of slots){
     const input=inputs.get(id);
     input.value=d[id];input.dispatchEvent(new EventClass('input',{bubbles:true}));
    }
    for(const id of transitions)if(d[id])buttons.get(id).click();
    const target=activeInput||'result_ones';
    handle.focus(0,target.slice('result_'.length));
   }finally{isRestoring=false;}
   onChange(snapshot());return ok();
  }
  return {ok:true,snapshot,restore,
   clear(){
    isRestoring=true;try{handle.reset()}finally{isRestoring=false;}
    onChange(snapshot());return ok();
   },
   destroy(){host.replaceChildren()}
  };
 }
 function wrapD10(view,card,plan,onChange,speechAdapter){
  let handle=null;
  const inputs=new Map();
  for(const name of FIELDS){
   const n=card.querySelector('[data-ml-field="'+plan.questionId+':'+name+'"]');
   if(!n)return fail('D10_G6_FIELD_MISSING');
   inputs.set(name,n);
  }
  const snapshot=()=>({
   questionId:plan.questionId,mode:plan.mode,
   selectedStatementId:handle?.snapshot?.().selectedStatementId??null,
   fields:Object.fromEntries(FIELDS.map(name=>[name,inputs.get(name).value]))
  });
  const notify=()=>onChange(snapshot());
  handle=view.mount(card,plan,{onChange:notify,speechAdapter});
  if(!handle?.ok)return handle;
  for(const input of inputs.values()){
   input.addEventListener('input',notify);
   input.addEventListener('change',notify);
  }
  return {ok:true,snapshot,
   restore(d){
    if(!d||d.questionId!==plan.questionId||d.mode!==plan.mode||
      !d.fields||typeof d.fields!=='object'||Array.isArray(d.fields)||
      Object.keys(d.fields).sort().join('|')!==FIELDS.slice().sort().join('|')||
      FIELDS.some(k=>typeof d.fields[k]!=='string'||d.fields[k].length>100))
     return fail('INVALID_D10_COMPOSITE_DRAFT');
    const result=handle.restore({questionId:plan.questionId,mode:plan.mode,
      selectedStatementId:d.selectedStatementId});
    if(!result.ok)return result;
    for(const name of FIELDS)inputs.get(name).value=d.fields[name];
    notify();return ok();
   },
   clear(){
    handle.clear();
    for(const input of inputs.values())input.value='';
    notify();return ok();
   },
   destroy(){
    for(const input of inputs.values()){input.removeEventListener('input',notify);input.removeEventListener('change',notify)}
    handle.destroy();
   }
  };
 }
 function assetIntent(q,assetId,quantity){
  if(!assetId)return fail('ASSET_ID_REQUIRED');
  const role=q.visualIntent||'DECORATIVE';
  const intent={assetId,visualIntent:role};
  if(role==='EXACT_COUNT'){
   intent.countUnit=q.countUnit;
   intent.exactQuantity=quantity;
  }
  return global.BE_HOC_VISUAL_SEMANTIC?.plan(intent)||fail('SEMANTIC_RESOLVER_MISSING');
 }
 function validateAssets(q){
  const pv=q.publicVariant||{};
  const test=(assetId,scope,quantity)=>{
   if(!assetId)return ok();
   const result=assetIntent(q,assetId,quantity);
   return result.ok?ok():fail(scope+'_ASSET_POLICY_'+result.reason);
  };
  let r=test(q.assetId,'QUESTION',q.exactQuantity);if(!r.ok)return r;
  const nodes=[];
  if(q.rendererId==='D3'){
   for(const item of [...(pv.leftItems||[]),...(pv.rightItems||[])])
    nodes.push(item.content?.assetId);
  }
  if(q.rendererId==='D4'){
   nodes.push(pv.prompt?.assetId);
   for(const option of pv.options||[])nodes.push(option.content?.assetId);
  }
  if(q.rendererId==='D6'||q.rendererId==='D8A'||q.rendererId==='D8B'){
   for(const item of [...(pv.items||[]),...(pv.containers||[]),...(pv.pans||[])])
    nodes.push(item.assetId);
  }
  if(q.rendererId==='D7'){
   for(const row of pv.rows||[])nodes.push(row.left?.assetId,row.right?.assetId);
  }
  for(const asset of nodes){r=test(asset,'NESTED',q.exactQuantity);if(!r.ok)return r;}
  if(q.rendererId==='D9'){
   for(const row of pv.rows||[]){
    if(row.contentType!=='ASSET')continue;
    if(q.visualIntent!=='EXACT_COUNT'||!q.countUnit||row.symbolValue!==undefined&&row.symbolValue!==1)
      return fail('D9_EXACT_SYMBOL_UNIT_REQUIRED');
    // Each pictograph IMG represents one counted unit; itemCount controls
    // the total symbol instances. Never guess total quantity from one icon.
    r=test(row.assetId,'D9',1);if(!r.ok)return r;
   }
  }
  return ok();
 }
 function resolveAsset(q,assetId){
  const intent=q.visualIntent||'DECORATIVE';
  // D9 view invokes this once per icon; each icon represents one counted unit.
  const count=intent==='EXACT_COUNT'&&q.rendererId==='D9'?1:q.exactQuantity;
  const result=assetIntent(q,assetId,count);
  return result.ok?result:null;
 }
 function watchImageErrors(host,onError){
  for(const img of host.querySelectorAll('img')){
   const mark=()=>{if(!host.contains(img))return;
     img.dataset.ultAssetLoadFailed='true';
     if(typeof onError==='function')onError('ASSET_BINARY_LOAD_FAILED')};
   img.addEventListener('error',mark,{once:true});
   if(img.complete&&img.naturalWidth===0)mark();
  }
 }
 global.ULTLAB_HARDENING=Object.freeze({
  VERSION:'ULT_R2_ADAPTER_V1',CAPABILITIES,grant,
  wrapD1,wrapD2,wrapD10,validateAssets,resolveAsset,watchImageErrors
 });
})(window);
