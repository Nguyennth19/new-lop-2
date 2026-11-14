'use strict';
/**
 * QA-B.1 SERVER/CI ONLY: word-problem trusted boundary prototype.
 * DO NOT include this module or its record store in browser HTML or GAS client.
 * No actual GAS server connection, no student data writes, no rewards.
 *
 * The frozen 10-form demo is an instructional sample, not an authenticated grading service.
 * This isolates the new D10 scaffold without modifying G6's existing renderer/adapter.
 */
const Word=require('../g7-4-word-problem-unification-v11/word-unification-v11-core.js');
const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const fail=(code)=>({ok:false,status:'BLOCKED',code});
const int=x=>Number.isSafeInteger(x)&&x>=0&&x<=999;
const numeric=x=>typeof x==='string'&&/^(0|[1-9][0-9]{0,3})$/.test(x);
const FIELDS=['n1','op','n2','sum','answer'];
function validateTrustedRecord(r) {
 if(!r||!id(r.questionId)||!id(r.lessonId)||!text(r.prompt)||
    !['PRACTICE','ASSESSMENT'].includes(r.purpose)||!['GUIDED','SELECT_STATEMENT'].includes(r.mode)||
    r.calculationSteps!==1)return fail('INVALID_TRUSTED_META');
 if(r.mode==='GUIDED'&&r.purpose==='ASSESSMENT')return fail('GUIDED_NOT_ALLOWED_IN_ASSESSMENT');
 if(!['ADD','SUBTRACT'].includes(r.operation)||!int(r.a)||!int(r.b)||
    r.operation==='SUBTRACT'&&r.a<r.b)return fail('INVALID_TRUSTED_OPERANDS');
 const expected=r.operation==='ADD'?r.a+r.b:r.a-r.b;
 if(expected>999||!int(r.expectedAnswer)||r.expectedAnswer!==expected)
   return fail('ANSWER_PROOF_MISMATCH');
 if(!r.pedagogyApproval||r.pedagogyApproval.status!=='APPROVED_BY_TEACHER'||
    !text(r.pedagogyApproval.evidenceRef))return fail('PEDAGOGY_NOT_APPROVED');
 if(!['G6_WORD_V11','DEMO_TEST_REFERENCE'].includes(r.sourceRole))return fail('UNTRUSTED_SOURCE_ROLE');
 if(r.mode==='SELECT_STATEMENT'){
  if(!Array.isArray(r.statementOptions)||r.statementOptions.length<2||r.statementOptions.length>5||
     !id(r.correctStatementId)||!r.statementOptions.some(x=>x.id===r.correctStatementId))
    return fail('PRIVATE_STATEMENT_KEY_INVALID');
 }else if(own(r,'correctStatementId')||own(r,'statementOptions'))
    return fail('GUIDED_HAS_SELECTION_KEY');
 const publicRaw={questionId:r.questionId,mode:r.mode,calculationSteps:1,
   prompt:r.prompt,summary:r.summary||'',unit:r.unit||'',readAloud:r.readAloud===true,
   ...(r.mode==='SELECT_STATEMENT'?{statementOptions:r.statementOptions.map(o=>({id:o.id,text:o.text}))}:{})};
 const compiled=Word.compile(publicRaw);
 if(!compiled.ok)return fail('PUBLIC_PLAN_COMPILE_'+compiled.reason);
 return {ok:true,status:'TRUSTED_RECORD_VALID',computedResult:expected,publicPlan:compiled.plan};
}
function createTrustedService(input,options={}) {
 if(options.scope!=='OFFLINE_TEST_QA_B1'||!Array.isArray(input)||input.length===0||
    input.length>50)throw Error('QA_B1_OFFLINE_TRUSTED_RECORDS_REQUIRED');
 const records=new Map(),publicPlans=new Map();
 for(const raw of input) {
  const validated=validateTrustedRecord(raw);
  if(!validated.ok)throw Error(validated.code+' '+String(raw?.questionId));
  if(records.has(raw.questionId))throw Error('DUPLICATE_TRUSTED_QUESTION');
  // Private records are copied: mutations to caller's objects cannot change the key.
  const saved=JSON.parse(JSON.stringify(raw));
  records.set(raw.questionId,saved);
  publicPlans.set(raw.questionId,validated.publicPlan);
 }
 function publicQuestion(questionId){
  if(!id(questionId)||!publicPlans.has(questionId))return fail('UNKNOWN_QUESTION');
  // Public plans are generated from allowlisted fields, not by spreading trusted secrets.
  const p=publicPlans.get(questionId);
  return {ok:true,scope:'PUBLIC_RENDERER_ONLY',plan:JSON.parse(JSON.stringify(p))};
 }
 function gradeTrusted(request){
  if(!request||!id(request.questionId)||!records.has(request.questionId))
    return fail('UNKNOWN_QUESTION');
  const r=records.get(request.questionId);
  if(request.lessonId!==r.lessonId||request.mode!==r.mode)
    return fail('LESSON_QUESTION_OR_MODE_MISMATCH');
  if(r.purpose==='ASSESSMENT'&&r.mode!=='SELECT_STATEMENT')
    return fail('ASSESSMENT_GUIDED_FORBIDDEN');
  if(request.selectedStatementId!==null&&request.selectedStatementId!==undefined&&
     !id(request.selectedStatementId))return fail('INVALID_SELECTION_FORMAT');
  if(r.mode==='SELECT_STATEMENT'&&
    (!id(request.selectedStatementId)||
     !r.statementOptions.some(o=>o.id===request.selectedStatementId)))
    return fail('INVALID_OR_MISSING_SELECTION');
  if(r.mode==='GUIDED'&&request.selectedStatementId!=null)return fail('GUIDED_SELECTION_FORBIDDEN');
  if(!request.fields||typeof request.fields!=='object'||Array.isArray(request.fields)||
     Object.keys(request.fields).length!==FIELDS.length||
     !FIELDS.every(k=>own(request.fields,k)))return fail('INVALID_SUBMISSION_FIELDS');
  const a=r.a,b=r.b,expected=r.expectedAnswer,op=r.operation==='ADD'?'+':'-';
  const checks={
   n1:numeric(request.fields.n1)&&Number(request.fields.n1)===a,
   op:request.fields.op===op,
   n2:numeric(request.fields.n2)&&Number(request.fields.n2)===b,
   sum:numeric(request.fields.sum)&&Number(request.fields.sum)===expected,
   answer:numeric(request.fields.answer)&&Number(request.fields.answer)===expected,
   statement:r.mode==='GUIDED'||request.selectedStatementId===r.correctStatementId
  };
  return {ok:true,status:Object.values(checks).every(Boolean)?'CORRECT':'INCORRECT',
    correct:Object.values(checks).every(Boolean),checks,questionId:r.questionId,
    serverOnlyReferenceUsed:true,source:'TEST_OFFLINE_NO_GAS',
    noExpectedAnswerOrCorrectStatementDisclosed:true};
 }
 return Object.freeze({publicQuestion,gradeTrusted});
}
module.exports=Object.freeze({validateTrustedRecord,createTrustedService});
