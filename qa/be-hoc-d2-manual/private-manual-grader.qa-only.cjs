'use strict';
/* PRIVATE QA REFERENCE ONLY. NEVER import into student HTML.
 * Trusted server must resolve lessonId/questionId and ignore any client operands.
 */
const profiles={PV100:{max:99,cols:2},PV1000:{max:999,cols:3}};
const names=['ones','tens','hundreds'];
const no=reason=>Object.freeze({ok:false,reason});
function gradePrivateFixture(source,submission){
 const profile=profiles[source?.profile];
 if(source?.operation!=='ADD'||!Array.isArray(source?.operands)||source.operands.length<2||source.operands.length>4||!profile||
  source.operands.some(x=>!Number.isSafeInteger(x)||x<0||x>profile.max))return no('INVALID_TRUSTED_SOURCE');
 const expected=source.operands.reduce((a,b)=>a+b,0);
 if(expected>profile.max)return no('RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN');
 if(!submission||!Array.isArray(submission.digits)||submission.digits.length!==profile.cols||
  !submission.carries||typeof submission.carries!=='object'||Array.isArray(submission.carries))return no('INVALID_SUBMISSION_SHAPE');
 const namesExpected=names.slice(1,profile.cols).map(x=>'carry_'+x);
 if(Object.keys(submission.carries).some(x=>!namesExpected.includes(x)))return no('UNKNOWN_CARRY_SLOT');
 const wantedDigits=Array.from({length:profile.cols},(_,i)=>Math.floor(expected/10**i)%10);
 const highest=Math.max(0,...wantedDigits.map((n,i)=>n>0?i:0));
 const digits=submission.digits.map((n,i)=>{
  const s=n==null?'':String(n);
  return s===''&&i>highest&&wantedDigits[i]===0?'0':s;
 });
 if(digits.some(n=>!/^[0-9]$/.test(n)))return no('INVALID_RESULT_DIGIT');
 let incoming=0;
 const expectedCarry={};
 for(let i=0;i<profile.cols-1;i++){
  const total=incoming+source.operands.reduce((a,n)=>a+(Math.floor(n/10**i)%10),0);
  incoming=Math.floor(total/10);
  expectedCarry[namesExpected[i]]=incoming;
 }
 for(const place of namesExpected){
  const raw=submission.carries[place];
  const typed=raw==null?'':String(raw);
  if(typed!==''&&!/^(0|[1-9][0-9]*)$/.test(typed))return no('INVALID_CARRY_INPUT');
 }
 const resultCorrect=digits.every((x,i)=>x===String(wantedDigits[i]));
 const carryCorrect=namesExpected.every(place=>{
  const actual=submission.carries[place]==null?'':String(submission.carries[place]);
  return expectedCarry[place]===0?actual==='':actual===String(expectedCarry[place]);
 });
 const correct=resultCorrect&&carryCorrect;
 return Object.freeze({ok:true,correct,resultCorrect,carryCorrect,questionCredit:correct?1:0,partialCredit:0,starCredit:0,contractId:'D2_MANUAL_CARRY_REQUIRED_V1'});
}
module.exports={gradePrivateFixture};
