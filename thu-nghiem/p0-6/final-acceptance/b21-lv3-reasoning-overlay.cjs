'use strict';
/** F-A.1 B21 offline LV3 reasoning overlay; no student runtime integration.
 * Does not modify immutable E03 composer, lesson JSON, approved B20 or G5.
 * Explicit 2-field pedagogy target: value + regrouping-to-ten intermediate.
 */
const assert=require('node:assert/strict');
const {createDemo}=require('../composer-fixtures-v1.cjs');
const {hash}=require('../variant-policy-registry-v1.cjs');
const nextTen=n=>10*Math.ceil((n+1)/10);
function makeEvidence(q){
 const {a,b}=q.parameters;
 const bridge=nextTen(a)-a,rounded=a+bridge,rest=b-bridge;
 if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||bridge<1||bridge>9||
    rest<0||a%10+b%10<10||a+b>100)throw Error('LV3_BRIDGING_UNSUPPORTED');
 return {questionId:q.id,sourcePair:[a,b],pedagogyTask:{
  prompt:'Tính '+a+' + '+b+'. Em hãy viết số cần tách từ '+b+' để '+a+' tròn chục, rồi tính kết quả.',
  expectedBridge:bridge,expectedRoundedTen:rounded,expectedRemainder:rest,
  expectedTotal:a+b,
  proof:[a+' + '+bridge+' = '+rounded,b+' - '+bridge+' = '+rest,rounded+' + '+rest+' = '+(a+b)],
  answerFields:['bridge','total'],
  strategy:'BRIDGE_TO_NEXT_TEN_AND_EXPLAIN',
  visualRole:'NONE',interaction:'TWO_FIELD_REASONING',
  semanticSkill:'ADD_CARRY_2D_2D',mathKind:'ADD',
  level:'LV3',approval:'PENDING',renderer:'NOT_SUPPORTED_INTERACTIVE'
 }};
}
function build(){
 const r=createDemo();if(!r.ok)throw Error('COMPOSER_SOURCE_BLOCKED');
 const qid=new Map(r.lesson.questions.map(q=>[q.id,q]));
 const records=r.report.qa.records.filter(x=>x.levelId==='LV3');
 assert.equal(records.length,2);
 const tasks=records.map(row=>makeEvidence(qid.get(row.questionId)));
 return {artifact:'FA_B21_LV3_REASONING_OVERLAY_V1',scope:'OFFLINE_TEST_ONLY',
   sourceLessonSha256:r.report.lessonSha256,sourceReceiptSha256:r.report.receiptSha256,
   sourceApproval:'PENDING',policyApproval:'PENDING_APPROVAL',questionCount:2,
   tasks,visualQA:'NOT_APPLICABLE',g5:'BLOCKED',g7:'PENDING',g8:'PENDING',
   allowStudentUse:false,noWrites:true,noStars:true};
}
function audit(){
 const data=build();for(const x of data.tasks){
  const [a,b]=x.sourcePair,t=x.pedagogyTask;
  assert.equal(t.expectedBridge,10-(a%10));
  assert.equal(a+t.expectedBridge,t.expectedRoundedTen);
  assert.equal(b-t.expectedBridge,t.expectedRemainder);
  assert.equal(t.expectedRoundedTen+t.expectedRemainder,t.expectedTotal);
  assert.equal(t.expectedTotal,a+b);
  assert.deepEqual(t.answerFields,['bridge','total']);
  assert.equal(t.approval,'PENDING');assert.equal(t.renderer,'NOT_SUPPORTED_INTERACTIVE');
 }
 assert.equal(new Set(data.tasks.map(x=>x.questionId)).size,2);
 assert.equal(data.g5,'BLOCKED');assert.equal(data.allowStudentUse,false);
 return {result:'TECHNICAL_REASONING_PROOF_PASS_PEDAGOGY_PENDING',
   count:data.tasks.length,sourceLessonSha256:data.sourceLessonSha256,
   overlaySha256:hash(data),tasks:data.tasks};
}
if(require.main===module)console.log(JSON.stringify(audit(),null,2));
module.exports={build,audit,makeEvidence};
