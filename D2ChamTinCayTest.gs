/** D2_MANUAL_CARRY_REQUIRED_V1 trusted GAS TEST read-only. NO student writes. */
const D2_TEST_POLICY='D2_MANUAL_CARRY_REQUIRED_V1';
function d2Reject_(reason){return {ok:false,reason:reason};}
function d2GradePure_(operands,submission,profile){
 const max=profile==='PV100'?99:profile==='PV1000'?999:-1;
 const cols=profile==='PV100'?2:profile==='PV1000'?3:0;
 if(!Array.isArray(operands)||operands.length<2||operands.length>4||operands.some(function(n){return !Number.isSafeInteger(n)||n<0||n>max;}))return d2Reject_('INVALID_TRUSTED_SOURCE');
 const sum=operands.reduce(function(a,b){return a+b;},0);
 if(sum>max)return d2Reject_('RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN');
 if(!submission||typeof submission!=='object'||Array.isArray(submission)||!Array.isArray(submission.digits)||submission.digits.length!==cols||
  !submission.carries||typeof submission.carries!=='object'||Array.isArray(submission.carries))return d2Reject_('INVALID_SUBMISSION');
 const keys=cols===2?['carry_tens']:['carry_tens','carry_hundreds'];
 if(Object.keys(submission.carries).some(function(k){return keys.indexOf(k)<0;}))return d2Reject_('UNKNOWN_CARRY_SLOT');
 const expected=Array.from({length:cols},function(_,i){return Math.floor(sum/Math.pow(10,i))%10;});
 const highest=expected.reduce(function(acc,d,i){return d!==0?i:acc;},0);
 const digits=submission.digits.map(function(x,i){const val=x==null?'':String(x);return val===''&&i>highest&&expected[i]===0?'0':val;});
 if(digits.some(function(x){return !/^[0-9]$/.test(x);}))return d2Reject_('INVALID_RESULT_DIGIT');
 let incoming=0;const carries={},places=['ones','tens','hundreds'];
 for(let i=0;i<cols-1;i++){
  const total=incoming+operands.reduce(function(a,n){return a+Math.floor(n/Math.pow(10,i))%10;},0);
  incoming=Math.floor(total/10);carries['carry_'+places[i+1]]=incoming;
 }
 for(const key of keys){
  const typed=submission.carries[key]==null?'':String(submission.carries[key]);
  if(typed!==''&&!/^(0|[1-9][0-9]*)$/.test(typed))return d2Reject_('INVALID_CARRY');
 }
 const correctDigits=digits.every(function(x,i){return x===String(expected[i]);});
 const correctCarry=keys.every(function(key){const x=submission.carries[key]==null?'':String(submission.carries[key]);return carries[key]===0?x==='':x===String(carries[key]);});
 return {ok:true,correct:correctDigits&&correctCarry,policy:D2_TEST_POLICY,awarded:false};
}
/** Only callable in separately restricted GAS TEST. Always read-only. */
function d2ChamTinCayTest(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||payload.contractId!==D2_TEST_POLICY||payload.lessonId!=='toan_b20')return d2Reject_('INVALID_REQUEST');
 if(Object.keys(payload).some(function(k){return ['contractId','lessonId','level','questionId','submission'].indexOf(k)<0;}))return d2Reject_('UNEXPECTED_INPUT');
 const level=String(payload.level||''),qid=String(payload.questionId||'');
 if(!/^LV[123]$/.test(level)||!/^toan_b20_[A-Za-z0-9_-]{1,65}$/.test(qid))return d2Reject_('INVALID_REFERENCE');
 const data=layBaiToan20();
 if(!data||!data.lesson||data.lesson.id!=='toan_b20')return d2Reject_('SOURCE_LESSON_MISMATCH');
 const match=achSelect_(data,level).filter(function(q){return q.id===qid;});
 if(match.length!==1)return d2Reject_('QUESTION_NOT_SELECTED');
 const q=match[0];if(!q.valid||q.type!=='vertical'||q.op!=='+'||q.level!==level)return d2Reject_('QUESTION_NOT_D2');
 const parse=function(x){const s=String(x==null?'':x).trim();return /^\d{1,2}$/.test(s)?Number(s):NaN;};
 const a=parse(q.n1),b=parse(q.n2);
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<10||b<10||a>99||b>99||a+b>99)return d2Reject_('B20_D2_OUT_OF_SCOPE');
 if(!/^\d+$/.test(String(q.answer||''))||Number(q.answer)!==a+b)return d2Reject_('SOURCE_CONFLICT');
 if(!payload.submission||Object.keys(payload.submission).some(function(k){return ['digits','carries'].indexOf(k)<0;}))return d2Reject_('UNEXPECTED_SUBMISSION');
 return d2GradePure_([a,b],payload.submission,'PV100');
}
