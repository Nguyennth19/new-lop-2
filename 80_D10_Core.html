/* G7.4 WORD_PROBLEM_UNIFICATION_V1.1 – TEST-only scaffolding contract/state.
 * Preserves G6 "word_problem" form; no answer key, grading, student writes or progress.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLWordUnificationV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODES=Object.freeze({SELECT_STATEMENT:'SELECT_STATEMENT',GUIDED:'GUIDED'});
 const badFields=new Set(['answer','answers','answerKey','correct','correctOptionId','correctStatementId','isCorrect','gradingKey','solution','expectedResult','solutionPrompt','n1','n2','op','sum']);
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
 const clean=x=>typeof x==='string'?x.trim():'';
 const fail=reason=>({ok:false,reason});
 const noAnswers=x=>x&&typeof x==='object'&&!Object.keys(x).some(k=>badFields.has(k));
 function compile(source){
  if(!noAnswers(source)||!id(source.questionId)||!Object.values(MODES).includes(source.mode))return fail('INVALID_META');
  const prompt=clean(source.prompt),summary=clean(source.summary),unit=clean(source.unit);
  if(!prompt||prompt.length>1000||summary.length>500||unit.length>40)return fail('INVALID_TEXT');
  // V1.1 augments the one-calculation G6 renderer: do not silently claim multi-step support.
  if(source.calculationSteps!==1)return fail('G6_SINGLE_CALC_ONLY');
  let options=[];
  if(source.mode===MODES.SELECT_STATEMENT){
   if(!Array.isArray(source.statementOptions)||source.statementOptions.length<2||source.statementOptions.length>5)return fail('INVALID_STATEMENT_OPTIONS');
   const ids=new Set();
   for(const opt of source.statementOptions){
    if(!noAnswers(opt)||!id(opt.id)||ids.has(opt.id)||!clean(opt.text)||clean(opt.text).length>260)return fail('INVALID_STATEMENT_OPTION');
    ids.add(opt.id);options.push(Object.freeze({id:opt.id,text:clean(opt.text)}));
   }
  }else if(source.statementOptions!==undefined)return fail('GUIDED_OPTIONS_FORBIDDEN');
  const promptMode=source.mode;
  return {ok:true,plan:Object.freeze({
   schemaVersion:'g74-word-unification-v11',questionId:source.questionId,mode:promptMode,
   prompt,summary,unit,calculationSteps:1,statementOptions:Object.freeze(options),
   readAloud:source.readAloud===true
  })};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-word-unification-v11')throw Error('INVALID_PLAN');
  const ids=new Set(plan.statementOptions.map(o=>o.id));let selected=null;
  const snapshot=()=>({questionId:plan.questionId,mode:plan.mode,selectedStatementId:selected});
  return Object.freeze({
   snapshot,
   selectStatement(statementId){
    if(plan.mode!==MODES.SELECT_STATEMENT)return fail('WRONG_MODE');
    if(!ids.has(statementId))return fail('UNKNOWN_STATEMENT');
    selected=statementId;return {ok:true,state:snapshot()};
   },
   clear(){selected=null;return {ok:true,state:snapshot()};},
   restore(d){
    if(!d||d.questionId!==plan.questionId||d.mode!==plan.mode||
       d.selectedStatementId!==null&&(plan.mode!==MODES.SELECT_STATEMENT||!ids.has(d.selectedStatementId)))
     return fail('INVALID_DRAFT');
    selected=d.selectedStatementId;return {ok:true,state:snapshot()};
   }
  });
 }
 // The adapter contract is deliberately limited to the existing G6 word fields.
 const G6_FIELDS=Object.freeze(['n1','op','n2','sum','answer']);
 function publicPayloadFromG6(q,choiceOptions,options={}){
  if(!q||q.type!=='word_problem'||q.valid!==true||!id(q.id))return fail('INVALID_G6_QUESTION');
  // Never copy answer, solutionPrompt, n1/n2/op into the renderer payload.
  const payload={questionId:q.id,mode:options.mode||MODES.SELECT_STATEMENT,
   calculationSteps:1,prompt:clean(q.prompt),summary:clean(q.summary),unit:clean(q.unit),
   readAloud:options.readAloud===true};
  if(payload.mode===MODES.SELECT_STATEMENT)payload.statementOptions=choiceOptions;
  return compile(payload);
 }
 return Object.freeze({MODES,G6_FIELDS,compile,session,publicPayloadFromG6});
});
