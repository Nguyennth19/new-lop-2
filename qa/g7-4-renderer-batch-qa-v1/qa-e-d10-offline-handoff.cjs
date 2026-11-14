'use strict';
/** G7.4 QA-C parallel QA-E PREPARATION. OFFLINE-only bridge proposal, NOT GAS.
 * Do not import in a client bundle: this file calls the server-side test service.
 * No modifications to G6 code, no real teacher signoff or grading authority.
 */
const {createTrustedService}=require('./d10-trusted-boundary.qa-b1.cjs');
const deny=['answer','answers','answerKey','expectedAnswer','correctStatementId','n1','n2','n3','op','gradingKey','solution','answerExplanation','variantParameters'];
function createOfflineHandoff(records){
 const service=createTrustedService(records,{scope:'OFFLINE_TEST_QA_B1'});
 const validIds=new Set(records.map(x=>x.questionId));
 function publish(questionId){
  if(!validIds.has(questionId))return {ok:false,status:'BLOCKED',code:'QUESTION_NOT_IN_TRUSTED_LESSON'};
  const publicResult=service.publicQuestion(questionId);
  if(!publicResult.ok)return publicResult;
  const p=publicResult.plan;
  // G6 word(q) depends only on the textual fields here; it builds input slots
  // from the questionId. No answer, n1, n2, operator, or calculation key.
  const legacyPublic=Object.freeze({
   id:p.questionId,type:'word_problem',valid:true,
   prompt:p.prompt,summary:p.summary,unit:p.unit,
   solutionPrompt:'', // never prefill a solution in assessment
   label:'Giải toán có lời văn'
  });
  return Object.freeze({
   ok:true,deliveryMode:'SERVER_GRADED_REQUIRED_NO_CLIENT_GRADER',
   renderer:'G6_WORD_EXISTING_UNMODIFIED',
   trustedQuestionId:questionId,
   publicQuestion:legacyPublic,
   scaffoldPlan:p,
   riskNotice:'G6 26_ChamCauHoiToan client grader still references q.answer and must be bypassed by an approved new runtime route'
  });
 }
 function validateProjection(projected){
  if(!projected||projected.ok!==true||!projected.publicQuestion||!projected.scaffoldPlan)
    return {ok:false,code:'PUBLIC_PROJECTION_INVALID'};
  const serialized=JSON.stringify({question:projected.publicQuestion,scaffold:projected.scaffoldPlan});
  const nested=(o)=>o&&typeof o==='object'&&Object.keys(o).some(k=>deny.includes(k)||nested(o[k]));
  if(nested(projected.publicQuestion)||nested(projected.scaffoldPlan))
    return {ok:false,code:'CLIENT_ANSWER_FIELD_LEAK'};
  if(!projected.deliveryMode.startsWith('SERVER_GRADED_REQUIRED'))
    return {ok:false,code:'CLIENT_GRADING_MODE_NOT_ALLOWED'};
  return {ok:true,status:'PUBLIC_ALLOWLIST_ONLY',payloadBytes:Buffer.byteLength(serialized)};
 }
 function gradeOffline(request){return service.gradeTrusted(request)}
 return Object.freeze({publish,validateProjection,gradeOffline,
   gasIntegrated:false,studentDataWrites:false,g6SourceModified:false});
}
module.exports=Object.freeze({createOfflineHandoff});
