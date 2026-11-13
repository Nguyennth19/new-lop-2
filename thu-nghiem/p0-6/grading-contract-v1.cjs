'use strict';
/* P0.6-C – pure QA + grading contract, NOT production runtime.
 * Never grades open semantics automatically. Does not read student data,
 * perform network/Sheets/GAS calls or award stars.
 */
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const approved=new Set(['APPROVED_BY_PROJECT_OWNER','APPROVED_BY_TEACHER']);
const isSafeInt=Number.isSafeInteger;
const result=(status,code,extra={})=>Object.freeze({status,code,...extra});
function validateProof(answerSpec){
 const proof=answerSpec&&answerSpec.proof;
 if(!isObj(proof)||!['add','subtract','sum','carry_tens','missing_addend'].includes(proof.operation)||
    !Array.isArray(proof.operands)||proof.operands.length<2||
    !proof.operands.every(isSafeInt))return result('BLOCKED','PROOF_MISSING_OR_UNSUPPORTED');
 const o=proof.operands;
 let value;
 switch(proof.operation){
  case 'add':if(o.length!==2)return result('BLOCKED','PROOF_ARITY');value=o[0]+o[1];break;
  case 'subtract':if(o.length!==2)return result('BLOCKED','PROOF_ARITY');value=o[0]-o[1];break;
  case 'sum':value=o.reduce((a,b)=>a+b,0);break;
  case 'carry_tens':if(o.length!==2)return result('BLOCKED','PROOF_ARITY');value=Math.floor(((o[0]%10+10)%10+(o[1]%10+10)%10)/10);break;
  case 'missing_addend':if(o.length!==2)return result('BLOCKED','PROOF_ARITY');value=o[0]-o[1];break;
 }
 if(!isSafeInt(value)||typeof answerSpec.value!=='number'||!isSafeInt(answerSpec.value))
  return result('BLOCKED','PROOF_RESULT_INVALID');
 return value===answerSpec.value?result('PASS','INDEPENDENT_PROOF_MATCH'):
   result('FAIL','ANSWER_PROOF_MISMATCH');
}
function auditAnswerSpec(question){
 if(!isObj(question)||!isObj(question.answerSpec))return result('BLOCKED','ANSWER_SPEC_MISSING');
 const a=question.answerSpec,v=a.verification,approval=a.pedagogyApproval;
 if(!isObj(v)||!isObj(approval))return result('BLOCKED','PROVENANCE_MISSING');
 if(v.status==='FAIL'||approval.status==='REJECTED')return result('FAIL','SOURCE_OR_PEDAGOGY_REJECTED');
 if(v.status!=='PASS'||!approved.has(approval.status))return result('REVIEW_REQUIRED','VERIFICATION_OR_APPROVAL_PENDING');
 if(a.mode==='exact')return validateProof(a);
 if(a.mode==='normalized_text'||a.mode==='set_of_answers'){
  if(v.type!=='reviewed_reference'&&!isObj(v.evidence))return result('BLOCKED','TEXT_VERIFICATION_EVIDENCE_MISSING');
  const values=a.mode==='normalized_text'?[a.value]:a.acceptedValues;
  if(!Array.isArray(values)||values.length===0||!values.every(x=>typeof x==='string'&&x.trim().length>0))
   return result('BLOCKED','ACCEPTED_VALUES_INVALID');
  if(!isObj(a.normalization)||typeof a.normalization.ignoreCase!=='boolean'||
      typeof a.normalization.trimWhitespace!=='boolean')
   return result('BLOCKED','NORMALIZATION_POLICY_MISSING');
  return result('PASS','REVIEWED_TEXT_KEY_READY');
 }
 if(a.mode==='rubric'||a.mode==='manual_review')
  return result('REVIEW_REQUIRED','OPEN_RESPONSE_HUMAN_REVIEW_REQUIRED');
 return result('BLOCKED','UNSUPPORTED_MODE');
}
function normalize(x,policy){
 let s=x.normalize('NFC');
 if(policy.trimWhitespace)s=s.trim().replace(/\s+/g,' ');
 if(policy.ignoreCase)s=s.toLocaleLowerCase('vi-VN');
 return s;
}
function gradeResponse(question,response){
 const audit=auditAnswerSpec(question);
 if(audit.status!=='PASS')return result(audit.status,audit.code,{gradable:false});
 const a=question.answerSpec;
 if(response===undefined||response===null||String(response).trim()==='')
  return result('INCORRECT','EMPTY_RESPONSE',{gradable:true,empty:true,correct:false});
 if(a.mode==='exact'){
  const t=String(response).trim();
  // No floating-point, hidden conversion, or partial credit.
  if(!/^-?(?:0|[1-9]\d*)$/.test(t))return result('INCORRECT','INVALID_NUMBER_FORMAT',{gradable:true,correct:false});
  const n=Number(t);
  return result(n===a.value?'CORRECT':'INCORRECT','EXACT_DETERMINISTIC',{gradable:true,correct:n===a.value});
 }
 const vals=a.mode==='set_of_answers'?a.acceptedValues:[a.value];
 const p=a.normalization;
 const normalized=normalize(String(response),p);
 const correct=vals.some(v=>normalize(v,p)===normalized);
 return result(correct?'CORRECT':'INCORRECT','REVIEWED_TEXT_EXACT_MATCH',{gradable:true,correct});
}
module.exports={auditAnswerSpec,gradeResponse,validateProof};
