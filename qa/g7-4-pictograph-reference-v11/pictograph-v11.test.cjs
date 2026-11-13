'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const P=require('./pictograph-v11-core.js'),F=require('./pictograph-v11-fixtures.js');
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++};const ok=(x,m)=>{assert.ok(x,m);n++};
const practice=P.compile(F.practice),assessment=P.compile(F.assessment);
ok(practice.ok);ok(assessment.ok);eq(practice.plan.rows.length,3);
eq(practice.plan.rows.map(r=>r.itemCount),[6,4,7]);eq(practice.plan.questions.length,2);
eq(assessment.plan.demoRowId,null);ok(Object.isFrozen(practice.plan));
const s=P.session(practice.plan);eq(s.snapshot().countedIndices.apple,[]);
let e=s.tap('apple',3);ok(e.ok);eq(e.ordinal,1);eq(e.countedNow,true);
e=s.tap('apple',0);eq(e.ordinal,2);eq(s.snapshot().countedIndices.apple,[3,0]);
e=s.tap('apple',3);eq(e.countedNow,false);eq(e.ordinal,null);
eq(s.snapshot().countedIndices.apple,[0]);
e=s.tap('apple',5);eq(e.ordinal,2);
eq(s.tap('apple',6).reason,'INVALID_INDEX');eq(s.tap('bad',0).reason,'UNKNOWN_ROW');
ok(s.setAnswer('apple_total','6').ok);
ok(s.setAnswer('orange_more','3').ok);
eq(s.snapshot().enteredAnswers,{apple_total:'6',orange_more:'3'});
eq(s.setAnswer('apple_total','-5').reason,'INVALID_ANSWER_INPUT');
eq(s.setAnswer('not_a_question','3').reason,'UNKNOWN_QUESTION');
ok(s.demoCount('apple').ok);eq(s.snapshot().countedIndices.apple,[0,1,2,3,4,5]);
eq(s.demoCount('mango').reason,'DEMO_NOT_ALLOWED');
const before=s.snapshot();
eq(s.restore({...before,countedIndices:{...before.countedIndices,apple:[0,0]}}).reason,'INVALID_DRAFT_INDICES');
eq(s.snapshot(),before,'invalid restore must not modify existing draft');
eq(s.restore({...before,enteredAnswers:{apple_total:'x'}}).reason,'INVALID_DRAFT_ANSWER');
eq(s.snapshot(),before);
ok(s.restore({exerciseId:practice.plan.exerciseId,mode:'PRACTICE',
 countedIndices:{apple:[1],mango:[2],orange:[6,0]},enteredAnswers:{orange_more:'3'}}).ok);
eq(s.snapshot().countedIndices.orange,[6,0]);ok(s.clear().ok);
eq(s.snapshot().countedIndices.apple,[]);eq(s.snapshot().enteredAnswers,{});
const a=P.session(assessment.plan);eq(a.demoCount('apple').reason,'DEMO_NOT_ALLOWED');
eq(P.compile({...F.assessment,demoRowId:'apple'}).reason,'DEMO_FORBIDDEN_ASSESSMENT');
for(const key of ['answer','answerKey','correct','correctCount','correctDifference','gradingKey','expectedValue'])
 eq(P.compile({...F.practice,[key]:1}).reason,'INVALID_META');
eq(P.compile({...F.practice,rows:[{...F.practice.rows[0],answer:6},...F.practice.rows.slice(1)]}).reason,'INVALID_ROW');
eq(P.compile({...F.practice,questions:[{...F.practice.questions[0],correct:6},F.practice.questions[1]]}).reason,'INVALID_QUESTION');
eq(P.compile({...F.practice,rows:[F.practice.rows[0],{...F.practice.rows[1],id:'apple'},F.practice.rows[2]]}).reason,'INVALID_ROW');
eq(P.compile({...F.practice,questions:[{...F.practice.questions[1],rowId:'orange',otherRowId:'orange'}]}).reason,'INVALID_QUESTION_ROW');
eq(P.compile({...F.practice,rows:[{...F.practice.rows[0],itemCount:0},...F.practice.rows.slice(1)]}).reason,'INVALID_ITEM_COUNT');
for(let i=0;i<180;i++){
 const size=i%40+1;
 const data={exerciseId:'PIC_VAR_'+i,mode:i%2?'ASSESSMENT':'PRACTICE',
  prompt:'Đếm các hình',rows:[
   {id:'rA',label:'Nhóm A',contentType:'EMOJI',symbol:'🍎',itemCount:size},
   {id:'rB',label:'Nhóm B',contentType:'TEXT',symbol:'●',itemCount:3}],
  questions:[{id:'q1',type:'COUNT',rowId:'rA',prompt:'Có bao nhiêu hình?'},
   {id:'q2',type:'COMPARE_DIFFERENCE',rowId:'rA',otherRowId:'rB',relation:'MORE_THAN',prompt:'Chênh lệch?'}]};
 const c=P.compile(data);ok(c.ok);
 const d=P.session(c.plan);const tick=d.tap('rA',size-1);ok(tick.ok);eq(tick.ordinal,1);
}
for(const file of ['pictograph-v11-view.js','pictograph-v11-fixtures.js']){
 const code=fs.readFileSync(__dirname+'/'+file,'utf8');new vm.Script(code);
 ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(code));
}
const locked=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(locked).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+n+' assertions, 180 variants, tap order, draft, policy and SHA locked');
