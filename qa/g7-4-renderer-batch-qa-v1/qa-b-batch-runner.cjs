'use strict';
/**
 * G7.4 RENDERER_BATCH_QA_V1 — QA-B TEST-only regression.
 * Invokes the existing 12 pure contract suites and adds cross-renderer negative gates.
 * No HTML changes, GAS deploy, student writes or grading award.
 *
 * A green workflow means unit/contract evidence only. It does NOT release QA-C/D/E/F.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const ROOT = path.resolve(__dirname, '../..');
const DIR = path.resolve(__dirname, 'artifacts');
const stamp = new Date().toISOString();
const checks = [];
const suites = [
  ['D1', 'structured-diagrams-v2', 'qa/g7-4-structured-diagrams-v2/structured-diagram-core.test.cjs'],
  ['D2', 'column-calc-v1', 'qa/g7-4-column-calc-reference-v1/column-calc-contract.test.cjs'],
  ['D2', 'column-calc-v12', 'qa/g7-4-column-calc-reference-v12/column-v12.test.cjs'],
  ['D3', 'matching', 'qa/g7-4-matching-reference-v11/matching-v11.test.cjs'],
  ['D4', 'choice-tts-mock', 'qa/g7-4-choice-reference-v11/choice-v11.test.cjs'],
  ['D5', 'geometry-tangram', 'qa/g7-4-geometry-tangram-reference-v11/geometry-v11.test.cjs'],
  ['D6', 'ordering-and-sorting', 'qa/g7-4-drag-sort-reference-v11/drag-sort-v11.test.cjs'],
  ['D7', 'comparison', 'qa/g7-4-comparison-reference-v11/comparison-v11.test.cjs'],
  ['D8', 'ruler-clock', 'qa/g7-4-measurement-reference-v11/measurement-v11.test.cjs'],
  ['D8A/D8B', 'liter-weight', 'qa/g7-4-capacity-weight-reference-v11/capacity-weight-v11.test.cjs'],
  ['D9', 'pictograph', 'qa/g7-4-pictograph-reference-v11/pictograph-v11.test.cjs'],
  ['D10', 'word-problem-scaffold', 'qa/g7-4-word-problem-unification-v11/word-unification-v11.test.cjs']
];
const requireFromRepo = p => require(path.join(ROOT,p));
function record(id, kind, f) {
  try {
    const result = f();
    checks.push({id,kind,status:'PASS',detail:typeof result==='string'?result:'completed'});
    console.log('[PASS] '+id+' — '+(typeof result==='string'?result:kind));
  } catch(err) {
    const message=String(err.stack||err).slice(0,1200);
    checks.push({id,kind,status:'FAIL',detail:message});
    console.error('[FAIL] '+id+' '+message);
  }
}
const sourceFile = path.join(ROOT,'qa/g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
const EXPECTED_SHA = '78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced';
record('QAB-00','SOURCE_LOCK',()=>{
  const bytes=fs.readFileSync(sourceFile),actual=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(bytes.length,131767);
  assert.equal(actual,EXPECTED_SHA);
  return 'SHA256 '+actual+'; bytes '+bytes.length;
});
for(const [id,alias,p] of suites) {
  record('SUITE_'+id+'_'+alias,'LEGACY_UNIT',()=>{
    const run=spawnSync(process.execPath,[p],{cwd:ROOT,encoding:'utf8',timeout:120000,maxBuffer:3*1024*1024});
    if(run.error)throw run.error;
    assert.equal(run.status,0,(run.stdout||'')+'\n'+(run.stderr||''));
    return (run.stdout||'').trim().split('\n').slice(-1)[0].slice(0,250);
  });
}
// D1: Type 1 original + structured V2 are not yet one integrated renderer.
record('QAB-D1-01','NUMBER_BOND_AND_UNIT_CONVERSION',()=>{
  const C=requireFromRepo('qa/g7-4-structured-diagrams-v2/structured-diagram-core.cjs');
  const base={diagramFamily:'MAKE_TEN_NUMBER_BOND',variantId:'BOND_QAB_0001',
    skill:'ADD_THROUGH_TEN',visualMode:'REPRESENTATIVE',assetId:null,usesImageLibrary:false,
    hiddenFields:['splitToTen','remainder','tenStep','total'],parameters:{a:8,b:5}};
  let count=0;
  for(let a=1;a<=9;a++)for(let b=1;b<=9;b++) {
    const s={...base,variantId:'BOND_QAB_'+a+'_'+b,parameters:{a,b}};
    const p=C.compilePublic(s),ok=a+b>10;
    assert.equal(p.ok,ok);
    if(ok) {
      const key=C.answerKey(s);
      assert.equal(key.answers.splitToTen,10-a);
      assert.equal(key.answers.remainder,b-(10-a));
      assert.equal(p.fields.filter(x=>x.role==='INPUT').every(x=>x.value===null),true);
      assert.equal(p.gradable,false);
      count++;
    }
  }
  const unit={diagramFamily:'UNIT_CONVERSION_LENGTH',variantId:'UNIT_QAB_0001',
    skill:'CONVERT_LENGTH_UNITS',visualMode:'REPRESENTATIVE',assetId:null,usesImageLibrary:false,
    hiddenFields:['convertedAmount'],parameters:{amount:1,fromUnit:'m',toUnit:'cm'}};
  assert.equal(C.answerKey(unit).answers.convertedAmount,100);
  assert.equal(C.compilePublic(unit).fields.find(x=>x.id==='convertedAmount').value,null);
  const fallback={diagramFamily:'PLACE_VALUE_ADDITION',variantId:'COL_QAB_FALLBACK',
    skill:'COLUMN_ADDITION',visualMode:'REPRESENTATIVE',assetId:null,usesImageLibrary:false,
    hiddenFields:['carry','tens','ones','total'],parameters:{a:67,b:16}};
  assert.equal(C.compilePublic(fallback).rendererRole,'FALLBACK_ONLY');
  const source=fs.readFileSync(sourceFile,'utf8');
  assert.ok(source.includes('function renderType1_NumberBond(stage)'));
  return count+' valid make-ten variants + unit conversion; Type1 original fixed demo -> mapping PENDING';
});
record('QAB-D2-01','COLUMN_CALC_PV1000_AND_CARRY_POLICY',()=>{
  const core=requireFromRepo('qa/g7-4-column-calc-reference-v12/column-v12-core.js');
  const ref=requireFromRepo('qa/g7-4-column-calc-reference-v1/column-calc-contract.cjs');
  const grader=requireFromRepo('qa/g7-4-column-calc-reference-v12/column-v12-server-grader.cjs');
  const cases=[
    ['ADD','PV100',47,25],['SUBTRACT','PV100',73,28],
    ['ADD','PV1000',356,128],['SUBTRACT','PV1000',402,187],
    ['ADD','PV1000',599,399],['SUBTRACT','PV1000',100,99],
    ['SUBTRACT','PV1000',800,701],['ADD','PV1000',0,0]];
  let tested=0;
  for(const [op,profile,a,b] of cases){
    for(const policy of ['OPTIONAL_HINT','REQUIRED_ASSESSED']){
      const q={variantId:'COL_QAB_'+(tested+10000),operation:op,profile,a,b,level:'LV2',
        carryPolicy:policy,assetId:null,...(policy==='REQUIRED_ASSESSED'?{assessmentAuthority:'LESSON_POLICY_APPROVED'}:{})};
      const plan=core.publicPlan(q),key=ref.computeServerOnly(q);
      assert.equal(plan.ok,true);assert.equal(key.ok,true);
      assert.equal(plan.answerSlots.every(x=>x.value===null),true);
      assert.equal(plan.transitionSlots.every(x=>x.value===null),true);
      assert.equal(plan.inputOrder[0],'ones');
      assert.equal(plan.columns,profile==='PV100'?2:3);
      assert.equal(plan.gradingEnabled,false);
      const p=core.PLACES.slice(0,plan.columns),used=Math.max(1,String(key.result).length),sub={};
      for(let i=0;i<p.length;i++)sub['result_'+p[i]]=i<used?String(key.digits[i]):'';
      const transitions=op==='ADD'?key.carry:key.borrow,prefix=op==='ADD'?'carry_':'borrow_';
      for(let i=1;i<p.length;i++)sub[prefix+p[i]]=Boolean(transitions[i].incoming);
      assert.equal(grader.grade(q,sub).pass,true);
      const trans=plan.transitionSlots[0]?.id;
      if(trans){
        const tampered={...sub,[trans]:!sub[trans]};
        assert.equal(grader.grade(q,tampered).pass,policy==='OPTIONAL_HINT');
      }
      assert.equal(grader.grade(q,{...sub,result_ones:'X'}).pass,false);
      tested++;
    }
  }
  const base={variantId:'COL_QAB_BOUNDARY',profile:'PV1000',operation:'ADD',level:'LV2',
    carryPolicy:'OPTIONAL_HINT',assetId:null,a:900,b:100};
  assert.equal(core.validateSpec(base).reason,'RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN');
  assert.equal(core.validateSpec({...base,a:1000,b:0}).reason,'OPERAND_OUT_OF_SCOPE');
  assert.equal(core.validateSpec({...base,a:400,b:100,carryPolicy:'REQUIRED_ASSESSED'}).reason,'CARRY_ASSESSMENT_NOT_APPROVED');
  assert.equal(ref.chooseRenderer({...base,a:400,b:100},{explicitDegradedConsent:true,fallbackQaApproved:true}).ok,false);
  return tested+' graded/negative PV100/PV1000 cases; exact 1000/four-column explicitly BLOCKED';
});
record('QAB-D3-01','MATCHING_DRAFT_AND_NO_KEY',()=>{
  const C=requireFromRepo('qa/g7-4-matching-reference-v11/matching-v11-core.js');
  const items=(prefix)=>['A','B'].map((text,i)=>({id:prefix+(i+1),content:{type:'TEXT',text}}));
  const spec={exerciseId:'MATCH_QAB_01',relationMode:'SINGLE_RELATION',leftItems:items('L'),rightItems:items('R')};
  const p=C.compile(spec);assert.equal(p.ok,true);
  assert.equal(C.compile({...spec,answerKey:{L1:'R1'}}).ok,false);
  const s=C.session(p.plan);assert.equal(s.connect('L1','R1').ok,true);
  const before=s.snapshot();assert.equal(s.restore({...before,pairs:{L1:'R1',L2:'R1'}}).ok,false);
  assert.deepEqual(s.snapshot(),before);
  return 'one-to-one matching, atomic draft, answer-key rejection';
});
record('QAB-D4-01','CHOICE_SELECTION_AND_NO_KEY',()=>{
  const C=requireFromRepo('qa/g7-4-choice-reference-v11/choice-v11-core.js');
  const raw={questionId:'CHOICE_QAB_01',selectionMode:'MULTIPLE',
    prompt:{type:'TEXT',text:'Chọn hai hình'} ,
    options:[{id:'A',content:{type:'TEXT',text:'a'}},{id:'B',content:{type:'TEXT',text:'b'}}]};
  const p=C.compile(raw);assert.equal(p.ok,true);
  assert.equal(C.compile({...raw,answerKey:['A']}).ok,false);
  const s=C.session(p.plan);assert.equal(s.select('A').ok,true);
  const before=s.snapshot();assert.equal(s.restore({questionId:raw.questionId,selectedOptionIds:['A','X']}).ok,false);
  assert.deepEqual(s.snapshot(),before);
  return 'multi-choice draft + answer-key guard; real voice QA-D PENDING';
});
record('QAB-D5-01','GEOMETRY_TANGRAM_BOTH_MODES',()=>{
  const C=requireFromRepo('qa/g7-4-geometry-tangram-reference-v11/geometry-v11-core.js');
  const F=requireFromRepo('qa/g7-4-geometry-tangram-reference-v11/geometry-v11-fixtures.js');
  const s=C.compile(F.shape),t=C.compile(F.tangram);
  assert.equal(s.ok,true);assert.equal(t.ok,true);
  const a=C.session(s.plan),b=C.session(t.plan);
  assert.equal(a.toggleShape(s.plan.items[0].id).ok,true);
  assert.equal(b.selectPiece(t.plan.items[0].id).ok,true);
  assert.equal(b.rotatePiece(t.plan.items[0].id,90).ok,true);
  assert.equal(C.compile({...F.tangram,answerKey:{x:1}}).ok,false);
  return 'SHAPE_SELECT/TANGRAM, no client target key; drag implementation QA-C PENDING';
});
record('QAB-D6-01','ORDER_SORT_BOTH_MODES',()=>{
  const C=requireFromRepo('qa/g7-4-drag-sort-reference-v11/drag-sort-v11-core.js');
  const F=requireFromRepo('qa/g7-4-drag-sort-reference-v11/drag-sort-v11-fixtures.js');
  const a=C.compile(F.ordering),b=C.compile(F.baskets);
  assert.equal(a.ok,true);assert.equal(b.ok,true);
  assert.equal(C.session(a.plan).place(a.plan.items[0].id,a.plan.targets[0].id).ok,true);
  assert.equal(C.session(b.plan).place(b.plan.items[0].id,b.plan.targets[0].id).ok,true);
  assert.equal(C.compile({...F.ordering,correctOrder:[]}).ok,false);
  return 'ORDER and SORT state, no client ordering key';
});
record('QAB-D7-01','COMPARISON_HINT_POLICY',()=>{
  const C=requireFromRepo('qa/g7-4-comparison-reference-v11/comparison-v11-core.js');
  const F=requireFromRepo('qa/g7-4-comparison-reference-v11/comparison-v11-fixtures.js');
  const practice=C.compile(F.practice),assessment=C.compile(F.assessment);
  assert.equal(practice.ok,true);assert.equal(assessment.ok,true);
  assert.equal(C.session(practice.plan).toggleHints().ok,true);
  assert.equal(C.session(assessment.plan).toggleHints().ok,false);
  assert.equal(C.compile({...F.assessment,answerKey:{c1:'>'}}).ok,false);
  return 'OPTIONAL versus HIDDEN hints; keys denied';
});
record('QAB-D8-01','RULER_CLOCK_MODE_AND_BOUNDARY',()=>{
  const C=requireFromRepo('qa/g7-4-measurement-reference-v11/measurement-v11-core.js');
  const F=requireFromRepo('qa/g7-4-measurement-reference-v11/measurement-v11-fixtures.js');
  const ruler=C.compile(F.ruler),clock=C.compile(F.clock);
  assert.equal(ruler.ok,true);assert.equal(clock.ok,true);
  const session=C.session(clock.plan);assert.equal(session.setTime(11,59).ok,true);
  assert.equal(session.incrementMinute(1).ok,clock.plan.model.minuteStep===1);
  assert.equal(C.compile({...F.clock,answerKey:'12:00'}).ok,false);
  return 'RULER/CLOCK contracts; clock minute increment subject to approved step';
});
record('QAB-D8A-D8B-01','LITER_WEIGHT_VALIDATION_TILT',()=>{
  const C=requireFromRepo('qa/g7-4-capacity-weight-reference-v11/capacity-weight-v11-core.js');
  const F=requireFromRepo('qa/g7-4-capacity-weight-reference-v11/capacity-weight-v11-fixtures.js');
  const l=C.compile(F.liter),w=C.compile(F.weight);
  assert.equal(l.ok,true);assert.equal(w.ok,true);
  assert.equal(C.session(l.plan).transfer(l.plan.items[0].id,l.plan.items[1].id,1).ok,true);
  assert.equal(C.balanceTilt(3,5).leftY<C.balanceTilt(3,5).rightY,true);
  assert.equal(C.balanceTilt(5,3).leftY>C.balanceTilt(5,3).rightY,true);
  assert.equal(C.compile({...F.weight,answerKey:5}).ok,false);
  return 'two modes; opposite weight tilts, no-key, asset mapping still PENDING';
});
record('QAB-D9-01','PICTOGRAPH_PRACTICE_ASSESSMENT',()=>{
  const C=requireFromRepo('qa/g7-4-pictograph-reference-v11/pictograph-v11-core.js');
  const F=requireFromRepo('qa/g7-4-pictograph-reference-v11/pictograph-v11-fixtures.js');
  const p=C.compile(F.practice),a=C.compile(F.assessment);
  assert.equal(p.ok,true);assert.equal(a.ok,true);
  const row=p.plan.rows[0].id,session=C.session(p.plan);
  const tap=session.tap(row,0);assert.equal(tap.ordinal,1);
  assert.equal(session.tap(row,0).countedNow,false);
  assert.equal(C.session(a.plan).demoCount(row).ok,false);
  assert.equal(C.compile({...F.assessment,answerKey:{x:1}}).ok,false);
  return 'touch count state and forbidden assessment demo; real touch QA-C PENDING';
});
record('QAB-D10-01','WORD_G6_SCAFFOLD_AND_LEGACY_LEAK_DETECTION',()=>{
  const C=requireFromRepo('qa/g7-4-word-problem-unification-v11/word-unification-v11-core.js');
  const F=requireFromRepo('qa/g7-4-word-problem-unification-v11/word-unification-v11-fixtures.js');
  const p=C.compile(F.rice);assert.equal(p.ok,true);
  assert.equal(C.compile({...F.rice,calculationSteps:2}).reason,'G6_SINGLE_CALC_ONLY');
  const pub=C.publicPayloadFromG6(F.g6Compatible,F.g6Compatible.options);
  assert.equal(pub.ok,true);
  for(const field of ['answer','n1','n2','op','solutionPrompt','correctStatementId']){
    assert.equal(Object.hasOwn(pub.plan,field),false,'scaffold accidentally contains '+field);
  }
  const legacy=fs.readFileSync(path.join(ROOT,'42_AdapterBienTheB20.html'),'utf8');
  assert.match(legacy,/answer:String\(q\.answer\)/);
  assert.match(legacy,/n1:p\.a,n2:p\.b/);
  // This detection passes, but the unresolved legacy leak is a P0 integration BLOCKER.
  return 'new scaffold strips key; legacy B20 answer is still client-visible -> P0 BLOCKED, NOT FIXED';
});
const failing=checks.filter(x=>x.status==='FAIL');
const report={
  schemaVersion:'g74-renderer-batch-qa-b-evidence-v1',
  runTimestampUtc:stamp,
  gitHubRef:process.env.GITHUB_REF||null,
  commitSha:process.env.GITHUB_SHA||null,
  scope:'PURE_NODE_CI_NO_GAS_NO_BROWSER_NO_STUDENT_WRITES',
  sourceSha256:EXPECTED_SHA,
  existingSuiteCount:suites.length,
  crossCheckCount:checks.length-(suites.length+1),
  overallUnitExecution:failing.length?'FAIL':'PASS_UNIT_ONLY',
  findingsUnchanged:['QA-A-001','QA-A-002','QA-A-003','QA-A-004','QA-A-005','QA-A-006','QA-A-007','QA-A-008'],
  alwaysBlocked:['QA-A-003','QA-A-004'],
  notProven:['Type1 renderer mapping to the existing original UI','full PV1000 inclusive 1000 result and four columns','12-family Lesson Composer','actual trusted statement-choice grading','legacy client answer-key removal','browser/touch/TTS devices','GAS TEST E2E and rollback'],
  checks,
  failures:failing.length
};
fs.mkdirSync(DIR,{recursive:true});
fs.writeFileSync(path.join(DIR,'qa-b-execution.json'),JSON.stringify(report,null,2)+'\n');
console.log('QA-B pure execution: '+(failing.length?'FAIL':'PASS_UNIT_ONLY')+
            '; legacy suites='+suites.length+'; cross-checks='+report.crossCheckCount+
            '; failed='+failing.length);
process.exitCode=failing.length?1:0;
