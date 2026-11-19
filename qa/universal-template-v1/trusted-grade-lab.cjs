'use strict';
/* PRIVATE LAB GRADER: executes only in Node, never imported in client HTML.
 * Exact policy: currently D2 and D4 TEST samples only. All other routes: NO_GRANT.
 * No student account, no persisted result, no medals or stars.
 */
const {makePack}=require('./fixture-packs.cjs');
const packs=Object.freeze({MATH_LAB_A:makePack('A'),MATH_LAB_B:makePack('B')});
function evaluateSubmission(body){
 if(!body||typeof body!=='object'||Array.isArray(body)||typeof body.packId!=='string'||
    typeof body.questionId!=='string'||!body.submission||typeof body.submission!=='object'||
    Array.isArray(body.submission))return {status:'REJECTED',reason:'BAD_SUBMISSION'};
 const pack=packs[body.packId];
 const q=pack?.questions.find(x=>x.questionId===body.questionId);
 if(!q)return {status:'REJECTED',reason:'UNKNOWN_QUESTION'};
 const sub=body.submission;
 if(q.rendererId==='D2'){
  const p=q.publicVariant;
  const expected=p.operation==='ADD'?p.a+p.b:p.a-p.b;
  const places=p.profile==='PV100'?['ones','tens']:['ones','tens','hundreds'];
  const actual=places.map((k,i)=>String(sub['result_'+k]??''));
  if(actual.some(x=>!/^[0-9]?$/.test(x)))return {status:'REJECTED',reason:'BAD_DIGIT'};
  const number=places.map((_,i)=>actual[i]).reverse().join('');
  return {status:'CHECKED',pass:Number(number)===expected&&number.length===places.length,
   scope:'SYNTHETIC_LAB_SERVER_ONLY'};
 }
 if(q.rendererId==='D4'){
  const selected=sub.selectedOptionIds;
  if(!Array.isArray(selected)||selected.length!==1||typeof selected[0]!=='string')
   return {status:'REJECTED',reason:'BAD_SELECTION'};
  // Correct label is intentionally a TEST-only server rule, not a client correctness flag.
  const privateKey=q.questionId.endsWith('_CHOICE')?'opt2':null;
  if(!privateKey)return {status:'REJECTED',reason:'NO_PRIVATE_POLICY'};
  return {status:'CHECKED',pass:selected[0]===privateKey,scope:'SYNTHETIC_LAB_SERVER_ONLY'};
 }
 return {status:'NOT_AUTHORIZED',reason:'RENDERER_GRADING_CONTRACT_PENDING'};
}
module.exports=Object.freeze({evaluateSubmission});
