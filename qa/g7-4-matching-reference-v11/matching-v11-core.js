/* G7.4 MATCHING_REFERENCE_V1.1: pure data/state, no grading, no student writes.
 * Derived from the interaction contract of the frozen 10-form HTML; original untouched.
 * This is a TEST-only standalone reference, not an Apps Script deployment.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.KLMatchingV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TYPES=new Set(['TEXT','MATH','ASSET','MIXED']);
  const MODES=new Set(['SINGLE_RELATION','MIXED_RELATION']);
  function fail(reason){return {ok:false,reason};}
  function validId(x){return typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);}
  function normalizeContent(x){
    if(!x||typeof x!=='object'||!TYPES.has(x.type))return null;
    const text=typeof x.text==='string'?x.text.trim():'';
    const assetId=typeof x.assetId==='string'?x.assetId.trim():'';
    if(text.length>240||assetId.length>100)return null;
    if(['TEXT','MATH'].includes(x.type)&&!text)return null;
    if(x.type==='ASSET'&&!assetId)return null;
    if(x.type==='MIXED'&&(!text||!assetId))return null;
    if(assetId&&!/^[A-Za-z0-9_.:-]+$/.test(assetId))return null;
    return Object.freeze({type:x.type,text,assetId,alt:typeof x.alt==='string'?x.alt.slice(0,160):''});
  }
  function compile(payload){
    if(!payload||typeof payload!=='object'||!validId(payload.exerciseId))return fail('INVALID_EXERCISE_ID');
    if(!MODES.has(payload.relationMode))return fail('INVALID_RELATION_MODE');
    const left=payload.leftItems,right=payload.rightItems;
    if(!Array.isArray(left)||!Array.isArray(right)||left.length<2||left.length>8||left.length!==right.length)return fail('INVALID_PAIR_COUNT');
    const all=new Set();
    const normalize=(items)=>{
      const out=[];
      for(const item of items){
        if(!item||!validId(item.id)||all.has(item.id))return null;
        const content=normalizeContent(item.content);
        if(!content)return null;
        all.add(item.id);
        out.push(Object.freeze({id:item.id,content}));
      }
      return Object.freeze(out);
    };
    const L=normalize(left),R=normalize(right);
    if(!L||!R)return fail('INVALID_ITEMS_OR_DUPLICATE_IDS');
    // Client renderer accepts NO answer map. Answers belong only in trusted grading payload.
    if(Object.prototype.hasOwnProperty.call(payload,'answer')||
       Object.prototype.hasOwnProperty.call(payload,'answerKey')||
       Object.prototype.hasOwnProperty.call(payload,'matchId')||
       [...left,...right].some(x=>x&&('matchId' in x||'answer' in x||'correctId' in x)))
      return fail('ANSWER_KEY_FORBIDDEN_IN_RENDERER_PAYLOAD');
    return {ok:true,plan:Object.freeze({schemaVersion:'g74-matching-v11',
      exerciseId:payload.exerciseId,relationMode:payload.relationMode,
      leftItems:L,rightItems:R,pairCount:L.length})};
  }
  function session(plan){
    if(!plan||plan.schemaVersion!=='g74-matching-v11')throw Error('INVALID_PLAN');
    let pairs=Object.create(null), selected=null;
    const lIds=new Set(plan.leftItems.map(i=>i.id)),rIds=new Set(plan.rightItems.map(i=>i.id));
    const snapshot=()=>({exerciseId:plan.exerciseId,pairs:{...pairs},selectedLeft:selected,
      completed:Object.keys(pairs).length,total:plan.pairCount});
    const api={
      snapshot,
      selectLeft(id){if(!lIds.has(id))return fail('UNKNOWN_LEFT');selected=(selected===id?null:id);return {ok:true,state:snapshot()};},
      connect(leftId,rightId){
        if(!lIds.has(leftId)||!rIds.has(rightId))return fail('UNKNOWN_ENDPOINT');
        // Enforce one-to-one: changing a matching pair replaces an earlier use of either endpoint.
        for(const k of Object.keys(pairs))if(k===leftId||pairs[k]===rightId)delete pairs[k];
        pairs[leftId]=rightId;selected=null;
        return {ok:true,state:snapshot()};
      },
      connectSelected(rightId){return selected?api.connect(selected,rightId):fail('NO_LEFT_SELECTED');},
      disconnect(leftId){if(!lIds.has(leftId))return fail('UNKNOWN_LEFT');delete pairs[leftId];return {ok:true,state:snapshot()};},
      clear(){pairs=Object.create(null);selected=null;return {ok:true,state:snapshot()};},
      restore(saved){
        if(!saved||saved.exerciseId!==plan.exerciseId||!saved.pairs||typeof saved.pairs!=='object'||Array.isArray(saved.pairs))return fail('INVALID_DRAFT');
        const next=Object.create(null),used=new Set();
        for(const [l,r] of Object.entries(saved.pairs)){
          if(!lIds.has(l)||!rIds.has(r)||used.has(r))return fail('INVALID_DRAFT_PAIR');
          next[l]=r;used.add(r);
        }
        pairs=next;selected=null;return {ok:true,state:snapshot()};
      }
    };
    return Object.freeze(api);
  }
  return Object.freeze({compile,session});
});
