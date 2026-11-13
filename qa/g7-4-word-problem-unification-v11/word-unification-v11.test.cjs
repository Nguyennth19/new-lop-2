'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const C=require('./word-unification-v11-core.js'),F=require('./word-unification-v11-fixtures.js');
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(x,y,m)=>{assert.deepEqual(x,y,m);n++;};
const rice=C.compile(F.rice);ok(rice.ok);eq(rice.plan.calculationSteps,1);
eq(rice.plan.statementOptions.length,3);ok(Object.isFrozen(rice.plan));
const g6=C.publicPayloadFromG6(F.g6Compatible,F.g6Compatible.options);ok(g6.ok);
eq(g6.plan.questionId,F.g6Compatible.id);eq(g6.plan.unit,'quyển truyện');
ok(!Object.hasOwn(g6.plan,'answer'));ok(!Object.hasOwn(g6.plan,'n1'));
ok(!Object.hasOwn(g6.plan,'solutionPrompt'));ok(!Object.hasOwn(g6.plan,'op'));
eq(C.G6_FIELDS,['n1','op','n2','sum','answer']);
const state=C.session(rice.plan);eq(state.snapshot().selectedStatementId,null);
ok(state.selectStatement('st2').ok);eq(state.snapshot().selectedStatementId,'st2');
eq(state.selectStatement('untrusted').reason,'UNKNOWN_STATEMENT');
const original=state.snapshot();eq(state.restore({...original,selectedStatementId:'bad'}).reason,'INVALID_DRAFT');
eq(state.snapshot(),original);ok(state.restore({questionId:rice.plan.questionId,mode:'SELECT_STATEMENT',selectedStatementId:'st1'}).ok);
eq(state.snapshot().selectedStatementId,'st1');ok(state.clear().ok);eq(state.snapshot().selectedStatementId,null);
const guided=C.compile({questionId:'G6_GUIDED_1',mode:'GUIDED',calculationSteps:1,
 prompt:'Em có 12 chiếc kẹo và cho 3 chiếc, còn lại bao nhiêu?',summary:'12 chiếc, bớt 3',unit:'chiếc'});
ok(guided.ok);eq(C.session(guided.plan).selectStatement('st1').reason,'WRONG_MODE');
for(const key of ['answer','answerKey','correctStatementId','correct','solution','n1','op','sum','gradingKey'])
 eq(C.compile({...F.rice,[key]:'st1'}).reason,'INVALID_META');
eq(C.compile({...F.rice,calculationSteps:2}).reason,'G6_SINGLE_CALC_ONLY');
eq(C.compile({...F.rice,statementOptions:[{...F.rice.statementOptions[0],isCorrect:true},...F.rice.statementOptions.slice(1)]}).reason,'INVALID_STATEMENT_OPTION');
eq(C.compile({...F.rice,statementOptions:[F.rice.statementOptions[0],{...F.rice.statementOptions[1],id:'st1'},F.rice.statementOptions[2]]}).reason,'INVALID_STATEMENT_OPTION');
eq(C.compile({...F.rice,statementOptions:[F.rice.statementOptions[0]]}).reason,'INVALID_STATEMENT_OPTIONS');
eq(C.compile({...F.rice,mode:'GUIDED'}).reason,'GUIDED_OPTIONS_FORBIDDEN');
for(let i=0;i<180;i++){
 const data={...F.rice,questionId:'WORD_VAR_'+i,
  prompt:'Một bài toán cộng hoặc trừ với dữ liệu biến thể '+i,
  statementOptions:[{id:'w1',text:'Có tất cả số đồ vật là:'},{id:'w2',text:'Số đồ vật còn lại là:'}]};
 const c=C.compile(data);ok(c.ok);
 const s=C.session(c.plan);ok(s.selectStatement(i%2?'w1':'w2').ok);
 eq(s.snapshot().selectedStatementId,i%2?'w1':'w2');
}
for(const file of ['word-unification-v11-adapter.js','word-unification-v11-fixtures.js']){
 const source=fs.readFileSync(__dirname+'/'+file,'utf8');new vm.Script(source);
 ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(source));
}
const adapter=fs.readFileSync(__dirname+'/word-unification-v11-adapter.js','utf8');
ok(adapter.includes("data-ml-field"));ok(adapter.includes("solutionLine.textContent=originalText"));
ok(!adapter.includes('innerHTML='));ok(!adapter.includes('replaceChildren('));
const g6src=fs.readFileSync(__dirname+'/../../41_HienThiCauHoiToan.html','utf8');
const css=fs.readFileSync(__dirname+'/../../43_CSS_ThanhPhanBaiToan.html','utf8');
ok(g6src.includes("function word(q)"));ok(g6src.includes("ml-word-structured"));
ok(css.includes("#mathFullScreen .ml-word-card.ml-word-structured"));
for(const key of ['n1','op','n2','sum','answer'])ok(g6src.includes("q.id+':"+key+"'"));
const frozen=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(frozen).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+n+' assertions incl 180 variants, G6 compatibility, no-key and locked-source SHA');
