/* G7.4 PICTOGRAPH_REFERENCE_V1.1 — pure data + draft state, TEST only.
 * Type 9 extracted from frozen Original_10Forms_Grade2_20261113.html.
 * No client answer key, grading, scores, progress or server communication.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLPictographV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODES=Object.freeze({PRACTICE:'PRACTICE',ASSESSMENT:'ASSESSMENT'});
 const Q_TYPES=Object.freeze({COUNT:'COUNT',COMPARE_DIFFERENCE:'COMPARE_DIFFERENCE'});
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
 const forbid=new Set(['answer','answers','answerKey','correct','correctCount','correctDifference','isCorrect','gradingKey','solution','expectedValue']);
 const noAnswers=x=>x&&typeof x==='object'&&!Object.keys(x).some(k=>forbid.has(k));
 const fail=reason=>({ok:false,reason});
 const contentTypes=new Set(['EMOJI','ASSET','TEXT']);
 function compile(raw){
  if(!noAnswers(raw)||!id(raw.exerciseId)||!Object.values(MODES).includes(raw.mode))return fail('INVALID_META');
  if(!Array.isArray(raw.rows)||raw.rows.length<1||raw.rows.length>12)return fail('INVALID_ROW_COUNT');
  const seen=new Set(),rows=[],ids=new Set();
  for(const row of raw.rows){
   if(!noAnswers(row)||!id(row.id)||seen.has(row.id)||typeof row.label!=='string'||!row.label.trim()||row.label.length>120)
    return fail('INVALID_ROW');
   if(!contentTypes.has(row.contentType))return fail('INVALID_CONTENT_TYPE');
   const symbol=typeof row.symbol==='string'?row.symbol.trim():'';
   const assetId=typeof row.assetId==='string'?row.assetId.trim():'';
   if(row.contentType==='ASSET'&&!/^[A-Za-z0-9_.:-]{1,120}$/.test(assetId)||
      (row.contentType!=='ASSET'&&(!symbol||symbol.length>25)))return fail('INVALID_SYMBOL');
   const count=row.itemCount;
   if(!Number.isInteger(count)||count<1||count>40)return fail('INVALID_ITEM_COUNT');
   seen.add(row.id);
   rows.push(Object.freeze({id:row.id,label:row.label.trim(),contentType:row.contentType,
     symbol,assetId,itemCount:count,alt:typeof row.alt==='string'?row.alt.slice(0,160):''}));
   ids.add(row.id);
  }
  const questions=[];
  if(!Array.isArray(raw.questions)||raw.questions.length<1||raw.questions.length>12)return fail('INVALID_QUESTIONS');
  const qids=new Set();
  for(const q of raw.questions){
   if(!noAnswers(q)||!id(q.id)||qids.has(q.id)||!Object.values(Q_TYPES).includes(q.type)||
      typeof q.prompt!=='string'||!q.prompt.trim()||q.prompt.length>350)return fail('INVALID_QUESTION');
   if(!ids.has(q.rowId)||q.type===Q_TYPES.COMPARE_DIFFERENCE&&(!ids.has(q.otherRowId)||q.otherRowId===q.rowId))
    return fail('INVALID_QUESTION_ROW');
   if(q.type===Q_TYPES.COUNT&&q.otherRowId!==undefined)return fail('INVALID_QUESTION_ROW');
   if(q.type===Q_TYPES.COMPARE_DIFFERENCE&&!['MORE_THAN','LESS_THAN'].includes(q.relation))
    return fail('INVALID_RELATION');
   qids.add(q.id);questions.push(Object.freeze({id:q.id,type:q.type,prompt:q.prompt.trim(),
    rowId:q.rowId,otherRowId:q.type===Q_TYPES.COMPARE_DIFFERENCE?q.otherRowId:null,
    relation:q.type===Q_TYPES.COMPARE_DIFFERENCE?q.relation:null}));
  }
  const demoRowId=raw.mode===MODES.PRACTICE&&raw.demoRowId!==undefined?raw.demoRowId:null;
  if(demoRowId!==null&&!ids.has(demoRowId))return fail('INVALID_DEMO_ROW');
  if(raw.mode===MODES.ASSESSMENT&&raw.demoRowId!==undefined)return fail('DEMO_FORBIDDEN_ASSESSMENT');
  return {ok:true,plan:Object.freeze({
    schemaVersion:'g74-pictograph-v11',exerciseId:raw.exerciseId,mode:raw.mode,
    prompt:typeof raw.prompt==='string'?raw.prompt.slice(0,500):'',
    rows:Object.freeze(rows),questions:Object.freeze(questions),demoRowId
  })};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-pictograph-v11')throw Error('INVALID_PLAN');
  const rowMap=new Map(plan.rows.map(r=>[r.id,r]));
  const qids=new Set(plan.questions.map(q=>q.id));
  const fresh=()=>Object.fromEntries(plan.rows.map(r=>[r.id,[]]));
  let counted=fresh(),entries=Object.create(null);
  function snapshot(){return {exerciseId:plan.exerciseId,mode:plan.mode,
    countedIndices:Object.fromEntries(plan.rows.map(r=>[r.id,[...counted[r.id]]])),
    enteredAnswers:{...entries}};}
  const api={
   snapshot,
   tap(rowId,index){
    const row=rowMap.get(rowId);
    if(!row)return fail('UNKNOWN_ROW');
    if(!Number.isInteger(index)||index<0||index>=row.itemCount)return fail('INVALID_INDEX');
    const i=counted[rowId].indexOf(index);
    if(i>=0)counted[rowId].splice(i,1);
    else counted[rowId].push(index);
    return {ok:true,countedNow:i<0,ordinal:i<0?counted[rowId].length:null,state:snapshot()};
   },
   demoCount(rowId){
    if(plan.mode!==MODES.PRACTICE||plan.demoRowId!==rowId)return fail('DEMO_NOT_ALLOWED');
    const row=rowMap.get(rowId);
    counted[rowId]=Array.from({length:row.itemCount},(_,i)=>i);
    return {ok:true,state:snapshot()};
   },
   setAnswer(questionId,value){
    if(!qids.has(questionId))return fail('UNKNOWN_QUESTION');
    if(typeof value!=='string'||!/^\d{0,3}$/.test(value))return fail('INVALID_ANSWER_INPUT');
    entries[questionId]=value;return {ok:true,state:snapshot()};
   },
   clear(){counted=fresh();entries=Object.create(null);return {ok:true,state:snapshot()};},
   restore(draft){
    if(!draft||draft.exerciseId!==plan.exerciseId||draft.mode!==plan.mode||
       !draft.countedIndices||typeof draft.countedIndices!=='object'||Array.isArray(draft.countedIndices)||
       !draft.enteredAnswers||typeof draft.enteredAnswers!=='object'||Array.isArray(draft.enteredAnswers)||
       Object.keys(draft.countedIndices).length!==rowMap.size)return fail('INVALID_DRAFT');
    const next=Object.create(null),ans=Object.create(null);
    for(const r of plan.rows){
     const indices=draft.countedIndices[r.id];
     if(!Array.isArray(indices)||indices.length>r.itemCount||new Set(indices).size!==indices.length||
        indices.some(i=>!Number.isInteger(i)||i<0||i>=r.itemCount))return fail('INVALID_DRAFT_INDICES');
     next[r.id]=[...indices];
    }
    for(const [key,value] of Object.entries(draft.enteredAnswers)){
     if(!qids.has(key)||typeof value!=='string'||!/^\d{0,3}$/.test(value))return fail('INVALID_DRAFT_ANSWER');
     ans[key]=value;
    }
    counted=next;entries=ans;return {ok:true,state:snapshot()};
   }
  };
  return Object.freeze(api);
 }
 return Object.freeze({MODES,Q_TYPES,compile,session});
});
