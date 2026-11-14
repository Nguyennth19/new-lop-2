'use strict';
/** QA-B.1 — Type1 fixed demo/variant mapping + PV1000 boundary + trusted D10 tests.
 * All tests PURE Node; require original source and G6 unchanged.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(ROOT,'qa/g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html'));
const MapType1=require('./type1-demo-source-map.qa-b1.cjs');
const Diag=require('../g7-4-structured-diagrams-v2/structured-diagram-core.cjs');
const Server=require('./d10-trusted-boundary.qa-b1.cjs');
const F=require('../g7-4-word-problem-unification-v11/word-unification-v11-fixtures.js');
const Column=require('../g7-4-column-calc-reference-v12/column-v12-core.js');
const ColumnV1=require('../g7-4-column-calc-reference-v1/column-calc-contract.cjs');
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++},ok=(v,m)=>{assert.ok(v,m);n++};
eq(crypto.createHash('sha256').update(source).digest('hex'),MapType1.SOURCE_SHA256);
eq(source.length,131767);
const evidence=MapType1.demoSourceEvidence(source.toString('utf8'));
ok(evidence.ok);eq(evidence.expectedSlots,6);eq(evidence.matchingSlots.length,6);
eq(MapType1.demoSourceEvidence(source.toString('utf8').replace(
  "renderInputSlot('t1_dm', '?'", "renderInputSlot('WRONG_ID', '?'")).ok,false);
eq(MapType1.demoSourceEvidence(source.toString('utf8').replace(
  "{ id: 't1_m', ans: '100' }","{ id: 't1_m', ans: '200' }")).ok,false);
const examples=JSON.parse(fs.readFileSync(path.join(ROOT,'qa/g7-4-structured-diagrams-v2/examples.v2.json'),'utf8')).examples;
const srcSpecs={bond:examples[0],dm:examples[1],m:examples[2]};
const mapped=MapType1.compileComposite(srcSpecs);ok(mapped.ok);
eq(mapped.matchedFrozenSample,true);
eq(mapped.bindings.map(x=>x.slotId),['t1_split1','t1_split2','t1_ten','t1_ans','t1_dm','t1_m']);
ok(mapped.bindings.every(x=>x.role==='ANSWER_INPUT'&&x.value===null));
eq(mapped.plans.length,3);eq(mapped.originalHtmlMutated,false);eq(mapped.dynamicDomRendererApproved,false);
const demoExpected=Object.fromEntries([
 ['t1_split1',Diag.answerKey(srcSpecs.bond).answers.splitToTen],
 ['t1_split2',Diag.answerKey(srcSpecs.bond).answers.remainder],
 ['t1_ten',Diag.answerKey(srcSpecs.bond).answers.tenStep],
 ['t1_ans',Diag.answerKey(srcSpecs.bond).answers.total],
 ['t1_dm',Diag.answerKey(srcSpecs.dm).answers.convertedAmount],
 ['t1_m',Diag.answerKey(srcSpecs.m).answers.convertedAmount]
]);
eq(demoExpected,{t1_split1:2,t1_split2:3,t1_ten:10,t1_ans:13,t1_dm:10,t1_m:100});
let variants=0;
for(let a=1;a<=9;a++)for(let b=1;b<=9;b++){
 const current={...srcSpecs.bond,variantId:'BOND_QAB1_'+a+'_'+b,parameters:{a,b}};
 if(a+b<=10)continue;
 const newMap=MapType1.compileComposite({...srcSpecs,bond:current});
 ok(newMap.ok);eq(newMap.bindings.length,6);ok(newMap.bindings.every(x=>x.value===null));
 const expected=Diag.answerKey(current).answers;
 eq(expected.splitToTen,10-a);eq(expected.total,a+b);
 if(a!==8||b!==5){eq(newMap.matchedFrozenSample,false);ok(newMap.bindings.every(x=>x.demoPlaceholder==='?'));}
 variants++;
}
eq(variants,36);
eq(MapType1.compileComposite({...srcSpecs,bond:{...srcSpecs.bond,variantId:'oops',diagramFamily:'INVALID'}}).ok,false);
eq(MapType1.compileComposite({...srcSpecs,m:{...srcSpecs.m,variantId:srcSpecs.dm.variantId}}).ok,false);
// PV1000 means exact three-column max 999. The boundary 1000 stays gated.
const boundary={variantId:'COL_B1_BOUNDARY',profile:'PV1000',operation:'ADD',level:'LV2',
 carryPolicy:'OPTIONAL_HINT',assetId:null,a:900,b:100};
eq(Column.validateSpec(boundary).reason,'RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN');
eq(Column.validateSpec({...boundary,a:999,b:0}).ok,true);
eq(Column.validateSpec({...boundary,a:1000,b:0}).reason,'OPERAND_OUT_OF_SCOPE');
eq(ColumnV1.validate({...boundary,profile:'PV1000_BOUNDARY'}).reason,'FOUR_COLUMN_NOT_VERIFIED');
// Trusted D10. Teacher approval below is test fixture, NOT real signoff.
const rice={
 lessonId:'TOAN_DEMO_QAB1',questionId:F.rice.questionId,purpose:'ASSESSMENT',
 mode:'SELECT_STATEMENT',calculationSteps:1,sourceRole:'DEMO_TEST_REFERENCE',
 prompt:F.rice.prompt,summary:F.rice.summary,unit:F.rice.unit,
 statementOptions:F.rice.statementOptions,correctStatementId:'st1',
 operation:'SUBTRACT',a:36,b:12,expectedAnswer:24,
 pedagogyApproval:{status:'APPROVED_BY_TEACHER',evidenceRef:'QA_TEST_FIXTURE_ONLY_NOT_REAL_SIGNOFF'}
};
const candy={
 lessonId:'TOAN_B20_QAB1',questionId:'B20_WORD_B1',purpose:'ASSESSMENT',
 mode:'SELECT_STATEMENT',calculationSteps:1,sourceRole:'G6_WORD_V11',
 prompt:F.g6Compatible.prompt,summary:F.g6Compatible.summary,unit:F.g6Compatible.unit,
 statementOptions:F.g6Compatible.options,correctStatementId:'a',
 operation:'ADD',a:28,b:15,expectedAnswer:43,
 pedagogyApproval:{status:'APPROVED_BY_TEACHER',evidenceRef:'QA_TEST_FIXTURE_ONLY_NOT_REAL_SIGNOFF'}
};
const guided={...candy,questionId:'B20_GUIDED_B1',purpose:'PRACTICE',
 mode:'GUIDED'};delete guided.statementOptions;delete guided.correctStatementId;
const service=Server.createTrustedService([rice,candy,guided],{scope:'OFFLINE_TEST_QA_B1'});
const good=service.publicQuestion(rice.questionId);
ok(good.ok);eq(good.plan.schemaVersion,'g74-word-unification-v11');
for(const key of ['answer','answerKey','expectedAnswer','correctStatementId','a','b','n1','n2','op','solutionPrompt','gradingKey']) {
 eq(Object.prototype.hasOwnProperty.call(good.plan,key),false,'client should not have '+key);
}
eq(good.plan.statementOptions.length,3);
ok(!JSON.stringify(good.plan).includes('"expectedAnswer"'));
ok(!JSON.stringify(good.plan).includes('"correctStatementId"'));
const answer=(record,values)=>({lessonId:record.lessonId,questionId:record.questionId,mode:record.mode,
 selectedStatementId:record.correctStatementId||null,fields:values});
const g=answer(rice,{n1:'36',op:'-',n2:'12',sum:'24',answer:'24'});
const result=service.gradeTrusted(g);ok(result.ok);eq(result.correct,true);
ok(!Object.prototype.hasOwnProperty.call(result,'expectedAnswer'));
eq(service.gradeTrusted({...g,selectedStatementId:'st2'}).correct,false);
eq(service.gradeTrusted({...g,fields:{...g.fields,answer:'25'}}).correct,false);
eq(service.gradeTrusted({...g,fields:{...g.fields,answerKey:'24'}}).code,'INVALID_SUBMISSION_FIELDS');
eq(service.gradeTrusted({...g,lessonId:'FOREIGN_LESSON'}).code,'LESSON_QUESTION_OR_MODE_MISMATCH');
const g2=answer(candy,{n1:'28',op:'+',n2:'15',sum:'43',answer:'43'});
eq(service.gradeTrusted(g2).correct,true);
eq(service.gradeTrusted({...g2,fields:{...g2.fields,op:'-'}}).correct,false);
const guidedPublic=service.publicQuestion(guided.questionId);ok(guidedPublic.ok);
eq(guidedPublic.plan.mode,'GUIDED');
eq(service.gradeTrusted({...g2,questionId:guided.questionId,mode:'GUIDED',selectedStatementId:null}).correct,true);
eq(Server.validateTrustedRecord({...rice,mode:'GUIDED'}).code,'GUIDED_NOT_ALLOWED_IN_ASSESSMENT');
eq(Server.validateTrustedRecord({...rice,calculationSteps:2}).code,'INVALID_TRUSTED_META');
eq(Server.validateTrustedRecord({...rice,expectedAnswer:25}).code,'ANSWER_PROOF_MISMATCH');
eq(Server.validateTrustedRecord({...rice,pedagogyApproval:{status:'PENDING'}}).code,'PEDAGOGY_NOT_APPROVED');
eq(Server.validateTrustedRecord({...rice,correctStatementId:'bad'}).code,'PRIVATE_STATEMENT_KEY_INVALID');
rice.expectedAnswer=99; // Mutating caller fixture must not alter service private key.
eq(service.gradeTrusted(g).correct,true);
eq(service.publicQuestion('UNKNOWN').code,'UNKNOWN_QUESTION');
const legacy=fs.readFileSync(path.join(ROOT,'42_AdapterBienTheB20.html'),'utf8');
ok(legacy.includes('answer:String(q.answer)'),'Legacy G6 client answer leak still OPEN');
const checks={
 schemaVersion:'g74-qab1-test-result-v1',at:new Date().toISOString(),passed:true,
 assertions:n,makeTenVariants:variants,sourceSha256:MapType1.SOURCE_SHA256,
 demo:{slotMapping:'SIX_OF_SIX',fixedExample:'MATCH',originalHtmlModified:false,
   realBrowserTest:'OWNER_REPORTED_DEMO_OK_NOT_INDEPENDENTLY_EXECUTED',
   variableDomBinding:'PENDING_QA_C'},
 column:{pv1000MaxResult:999,exact1000:'BLOCKED_FOUR_COLUMN_NOT_APPROVED'},
 word:{publicAnswerKeyAbsent:true,serverOnlyReference:'OFFLINE_TEST_ONLY',
   actualGASGraderIntegrated:false,legacyG6AnswerLeak:'QA-A-003_BLOCKED'},
 compatibility:{mainModified:false,g6Modified:false,closedQA_A_IDs:[]}
};
fs.mkdirSync(path.join(__dirname,'artifacts'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'artifacts/qa-b1-execution.json'),JSON.stringify(checks,null,2)+'\n');
console.log('PASS QA-B.1 '+n+' assertions; Type1 6/6 frozen demo slots, '+variants+
 ' number-bond variations, PV1000 boundary gated, D10 trusted separation server-only');
