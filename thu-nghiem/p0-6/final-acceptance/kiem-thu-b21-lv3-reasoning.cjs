'use strict';
const assert=require('node:assert/strict');
const {build,audit,makeEvidence}=require('./b21-lv3-reasoning-overlay.cjs');
const {createDemo}=require('../composer-fixtures-v1.cjs');
const x=build(),y=build();assert.deepEqual(x,y,'Deterministic with source E03 seed');
assert.equal(x.questionCount,2);
assert.equal(audit().count,2);
assert.equal(x.policyApproval,'PENDING_APPROVAL');assert.equal(x.g5,'BLOCKED');
assert(x.tasks.every(z=>z.pedagogyTask.answerFields.length===2&&
  z.pedagogyTask.strategy==='BRIDGE_TO_NEXT_TEN_AND_EXPLAIN'));
const source=createDemo();assert.equal(source.ok,true);
for(const t of x.tasks){
 const q=source.lesson.questions.find(q=>q.id===t.questionId);
 assert(q);assert.equal(q.answerSpec.value,t.pedagogyTask.expectedTotal);
 assert.equal(t.pedagogyTask.expectedBridge+t.sourcePair[0],t.pedagogyTask.expectedRoundedTen);
}
assert.throws(()=>makeEvidence({id:'neg',parameters:{a:40,b:20}}),/LV3_BRIDGING_UNSUPPORTED/);
assert.throws(()=>makeEvidence({id:'neg',parameters:{a:99,b:5}}),/LV3_BRIDGING_UNSUPPORTED/);
console.log('PASS F-A.1 LV3 reasoning overlay deterministic proof 2/2; renderer G5 BLOCKED; pedagogy PENDING');
