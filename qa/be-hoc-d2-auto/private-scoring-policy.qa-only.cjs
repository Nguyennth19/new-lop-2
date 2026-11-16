'use strict';
/* INTERNAL QA-ONLY scoring policy. NEVER import into student HTML.
 * No answer keys are serialized into browser-facing plans.
 * A trusted server should resolve pinned lesson/question IDs before using this evaluator.
 */
const maxes=Object.freeze({PV100:99,PV1000:999});
function gradeLocalFixture({operands,profile,digits,carryUi}={}){
 const max=maxes[profile];
 if(!max||!Array.isArray(operands)||operands.length<2||operands.length>4||
  operands.some(x=>!Number.isSafeInteger(x)||x<0||x>max))return Object.freeze({ok:false,reason:'INVALID_PRIVATE_SOURCE'});
 const expected=operands.reduce((a,b)=>a+b,0);
 if(expected>max)return Object.freeze({ok:false,reason:'RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN'});
 const columns=profile==='PV100'?2:3;
 if(!Array.isArray(digits)||digits.length!==columns)return Object.freeze({ok:false,reason:'INVALID_DIGIT_VECTOR'});
 const normalized=digits.map(x=>x==null?'':String(x));
 if(normalized.some(x=>x!==''&&!/^[0-9]$/.test(x)))return Object.freeze({ok:false,reason:'INVALID_DIGIT'});
 // Optional blank leading zero(s) only, never blank interior/result-one digit.
 const wanted=Array.from({length:columns},(_,i)=>Math.floor(expected/10**i)%10);
 const highest=Math.max(0,...wanted.map((d,i)=>d!==0?i:0));
 for(let i=0;i<columns;i++){
  const v=normalized[i];
  if(v===''&&i>highest&&wanted[i]===0)continue;
  if(v!==String(wanted[i]))return Object.freeze({ok:true,correct:false,questionCredit:0,starCredit:0,partialCredit:0,autoCarryCredit:0});
 }
 // Carry display is not evaluated, and its tampering cannot increase credit.
 return Object.freeze({ok:true,correct:true,questionCredit:1,starCredit:0,partialCredit:0,autoCarryCredit:0});
}
module.exports={gradeLocalFixture};
