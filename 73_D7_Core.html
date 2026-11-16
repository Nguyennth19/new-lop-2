/* G7.4 Comparison Reference V1.1: pure contract/state, TEST-only.
 * Extracted from frozen 10-form Type 7. Never grades, awards, or writes progress.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLComparisonV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const SIGNS=Object.freeze(['>','<','=']);
 const fail=reason=>({ok:false,reason});
 const validId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
 const forbidden=new Set(['answer','answers','answerKey','correct','correctSign','expectedSign','solution','gradingKey','isCorrect','leftValue','rightValue']);
 function noAnswer(x){return x&&typeof x==='object'&&Object.keys(x).every(k=>!forbidden.has(k));}
 function parseSide(side){
  if(!side||!noAnswer(side)||!['TEXT','MATH','ASSET','MIXED'].includes(side.type))return null;
  const text=typeof side.text==='string'?side.text.trim():'';
  const assetId=typeof side.assetId==='string'?side.assetId.trim():'';
  if(text.length>220||assetId.length>120||(['TEXT','MATH'].includes(side.type)&&!text)||
    (['ASSET','MIXED'].includes(side.type)&&!assetId)||
    (side.type==='MIXED'&&!text)||(assetId&&!/^[A-Za-z0-9_.:-]+$/.test(assetId)))return null;
  return Object.freeze({type:side.type,text,assetId,alt:typeof side.alt==='string'?side.alt.trim().slice(0,140):''});
 }
 function compile(data){
  if(!data||!validId(data.exerciseId)||!noAnswer(data))return fail('INVALID_META_OR_ANSWER_KEY');
  if(!Array.isArray(data.rows)||data.rows.length<1||data.rows.length>12)return fail('INVALID_ROW_COUNT');
  if(data.hintPolicy!==undefined&&!['HIDDEN','OPTIONAL'].includes(data.hintPolicy))return fail('INVALID_HINT_POLICY');
  const ids=new Set(),rows=[];
  for(const row of data.rows){
   if(!row||!noAnswer(row)||!validId(row.id)||ids.has(row.id))return fail('INVALID_ROW_OR_ANSWER_KEY');
   const left=parseSide(row.left),right=parseSide(row.right);
   if(!left||!right)return fail('INVALID_SIDE');
   if((row.leftHint!==undefined&&typeof row.leftHint!=='string')||
      (row.rightHint!==undefined&&typeof row.rightHint!=='string'))return fail('INVALID_HINT');
   const leftHint=(row.leftHint||'').trim(),rightHint=(row.rightHint||'').trim();
   if(leftHint.length>120||rightHint.length>120)return fail('INVALID_HINT');
   ids.add(row.id);rows.push(Object.freeze({id:row.id,left,right,leftHint,rightHint}));
  }
  return {ok:true,plan:Object.freeze({schemaVersion:'g74-comparison-v11',exerciseId:data.exerciseId,
   hintPolicy:data.hintPolicy||'HIDDEN',prompt:typeof data.prompt==='string'?data.prompt.slice(0,400):'',
   rows:Object.freeze(rows)})};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-comparison-v11')throw Error('INVALID_PLAN');
  const ids=new Set(plan.rows.map(x=>x.id));
  let active=plan.rows[0].id,choices=Object.create(null),hints=false;
  const snapshot=()=>({exerciseId:plan.exerciseId,activeRowId:active,
   selectedSigns:Object.fromEntries(Object.entries(choices)),hintsVisible:hints});
  const api={
   snapshot,
   activate(id){if(!ids.has(id))return fail('UNKNOWN_ROW');active=id;return {ok:true,state:snapshot()};},
   choose(sign,rowId=active){
    if(!ids.has(rowId))return fail('UNKNOWN_ROW');
    if(!SIGNS.includes(sign))return fail('INVALID_SIGN');
    choices[rowId]=sign;
    // Follow the next unanswered row, rather than assuming exactly c1/c2/c3.
    const current=plan.rows.findIndex(r=>r.id===rowId);
    const next=plan.rows.slice(current+1).find(r=>!choices[r.id]);
    if(next)active=next.id;else active=rowId;
    return {ok:true,state:snapshot()};
   },
   remove(id){if(!ids.has(id))return fail('UNKNOWN_ROW');delete choices[id];active=id;return {ok:true,state:snapshot()};},
   toggleHints(){
    if(plan.hintPolicy!=='OPTIONAL')return fail('HINTS_DISABLED');
    hints=!hints;return {ok:true,state:snapshot()};
   },
   clear(){active=plan.rows[0].id;choices=Object.create(null);hints=false;return {ok:true,state:snapshot()};},
   restore(draft){
    if(!draft||draft.exerciseId!==plan.exerciseId||
       !ids.has(draft.activeRowId)||!draft.selectedSigns||
       typeof draft.selectedSigns!=='object'||Array.isArray(draft.selectedSigns)||
       typeof draft.hintsVisible!=='boolean'||(draft.hintsVisible&&plan.hintPolicy!=='OPTIONAL'))
      return fail('INVALID_DRAFT');
    const next=Object.create(null);
    for(const [id,sign] of Object.entries(draft.selectedSigns)){
     if(!ids.has(id)||!SIGNS.includes(sign))return fail('INVALID_DRAFT_SIGN');
     next[id]=sign;
    }
    active=draft.activeRowId;choices=next;hints=draft.hintsVisible;
    return {ok:true,state:snapshot()};
   }
  };
  return Object.freeze(api);
 }
 return Object.freeze({SIGNS,compile,session});
});
