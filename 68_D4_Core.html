/* G7.4 Choice Reference V1.1 – TEST-only, pure contracts and draft state.
 * Based on frozen 10-form Type 4; no client answer key, grading, awards or progress.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.KLChoiceV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TYPES=new Set(['TEXT','MATH','ASSET','MIXED']);
 const MODES=new Set(['SINGLE','MULTIPLE']);
 const validId=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(id);
 const fail=reason=>({ok:false,reason});
 function content(x){
  if(!x||!TYPES.has(x.type))return null;
  const text=typeof x.text==='string'?x.text.trim():'';
  const assetId=typeof x.assetId==='string'?x.assetId.trim():'';
  if(text.length>600||assetId.length>120||!['ASSET','MIXED'].includes(x.type)&&!text||
    ['ASSET','MIXED'].includes(x.type)&&!assetId||
    x.type==='MIXED'&&!text||
    assetId&&!/^[A-Za-z0-9_.:-]+$/.test(assetId))return null;
  const alt=typeof x.alt==='string'?x.alt.trim().slice(0,160):'';
  return Object.freeze({type:x.type,text,assetId,alt});
 }
 function compile(data){
  if(!data||!validId(data.questionId))return fail('INVALID_QUESTION_ID');
  if(!MODES.has(data.selectionMode))return fail('INVALID_SELECTION_MODE');
  if(!data.prompt||!content(data.prompt))return fail('INVALID_PROMPT');
  if(!Array.isArray(data.options)||data.options.length<2||data.options.length>8)return fail('INVALID_OPTION_COUNT');
  if(['answer','answers','answerKey','correctOptionId','correctOptionIds','gradingKey','isCorrect'].some(k=>k in data))return fail('ANSWER_KEY_FORBIDDEN');
  const ids=new Set(),opts=[];
  for(const option of data.options){
   if(!option||!validId(option.id)||ids.has(option.id))return fail('INVALID_OPTION_ID');
   if(['answer','correct','isCorrect','matchId','correctOptionId'].some(k=>k in option))return fail('ANSWER_KEY_FORBIDDEN');
   const c=content(option.content);if(!c)return fail('INVALID_OPTION_CONTENT');
   const speechText=typeof option.speechText==='string'?option.speechText.trim():'';
   if(speechText.length>600)return fail('INVALID_SPEECH_TEXT');
   ids.add(option.id);opts.push(Object.freeze({id:option.id,content:c,speechText}));
  }
  const speechText=typeof data.speechText==='string'?data.speechText.trim():'';
  if(speechText.length>1000)return fail('INVALID_SPEECH_TEXT');
  return {ok:true,plan:Object.freeze({schemaVersion:'g74-choice-v11',questionId:data.questionId,
   selectionMode:data.selectionMode,prompt:content(data.prompt),
   speechEnabled:data.speechEnabled===true,speechText,
   options:Object.freeze(opts)})};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-choice-v11')throw Error('INVALID_PLAN');
  const ids=new Set(plan.options.map(x=>x.id));let selected=new Set();
  const snapshot=()=>({questionId:plan.questionId,selectedOptionIds:plan.options.filter(o=>selected.has(o.id)).map(o=>o.id)});
  return Object.freeze({
   snapshot,
   select(id){if(!ids.has(id))return fail('UNKNOWN_OPTION');
    if(plan.selectionMode==='SINGLE')selected=new Set([id]);
    else if(selected.has(id))selected.delete(id);else selected.add(id);
    return {ok:true,state:snapshot()};
   },
   clear(){selected.clear();return {ok:true,state:snapshot()};},
   restore(draft){
    if(!draft||draft.questionId!==plan.questionId||!Array.isArray(draft.selectedOptionIds))return fail('INVALID_DRAFT');
    const a=draft.selectedOptionIds;
    if(a.length>plan.options.length||(plan.selectionMode==='SINGLE'&&a.length>1)||
      new Set(a).size!==a.length||a.some(id=>!ids.has(id)))return fail('INVALID_DRAFT_SELECTION');
    selected=new Set(a);return {ok:true,state:snapshot()};
   }
  });
 }
 return Object.freeze({compile,session});
});
