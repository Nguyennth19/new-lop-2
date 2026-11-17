/* DATA-B P0 G2B — 25-case decision + reusable variant admission QA.
 * No real GAS, independent source signature or student renderer grant in this harness.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {join}=require('node:path');
const project=join(__dirname,'../..');
const manifest=require('./25-case-decisions.v1.json');
const router=require(join(project,'89_P0_VariantRouter.html'));
const vector=require(join(project,'90_P0_VectorStructural.html'));
const D3=require(join(project,'66_D3_Core.html'));
const D4=require(join(project,'68_D4_Core.html'));
const D7=require(join(project,'73_D7_Core.html'));
const D9=require(join(project,'55_Pictograph_Core.html'));
const D10=require(join(project,'80_D10_Core.html'));
const D2=require(join(project,'47_D2V12_Core.html'));
let pass=0;const checks=[];
function test(label,fn){try{fn();pass++;checks.push({label,status:'PASS'});}catch(e){checks.push({label,status:'FAIL',detail:String(e.message||e)});}}
const fixture={
 GRID_100_2X2:{patches:[{id:'A',topLeft:65},{id:'B',topLeft:47},{id:'C',topLeft:25},{id:'D',topLeft:43}]},
 TWO_GROUP_COUNT_ADD:{groups:[{id:'a',label:'Cá',quantity:18},{id:'b',label:'Ngôi sao',quantity:5}],task:'TOTAL',unit:'con',seed:1121},
 ADDITION_PYRAMID:{base:[4,5,7,2],visible:[{row:1,index:0,value:9},{row:1,index:1,value:12}]},
 POLYLINE_LENGTH:{segments:[37,54],unit:'cm'},
 WORD_LESS_THAN:{first:34,second:7,unit:'quả',relation:'LESS_THAN',calculationSteps:1,prompt:'Ngày đầu có 34 quả, ngày sau ít hơn 7 quả. Hỏi ngày sau có mấy quả?'},
 WORD_COMPLEMENT:{first:35,second:9,unit:'bông',relation:'TOTAL_MINUS_KNOWN',calculationSteps:1,prompt:'Có 35 bông hoa, nhìn thấy 9 bông. Còn bao nhiêu bông bị che?'},
 WORD_PART_WHOLE:{first:32,second:26,unit:'con',relation:'TOTAL_MINUS_PART',calculationSteps:1,prompt:'Có 32 con gà, trong đó 26 con gà mái. Hỏi có bao nhiêu con gà trống?'},
 ONE_TO_ONE_ARITH_MATCH:{left:[{id:'fish1',expression:'72-27'},{id:'fish2',expression:'81-16'},{id:'fish3',expression:'90-35'}],right:[{id:'bucket1',label:'45'},{id:'bucket2',label:'65'},{id:'bucket3',label:'55'}]},
 SYNTHETIC_EXACT_COUNT_TENS:{count:32,countUnit:'viên bi',estimateTens:true,seed:20261117},
 MANY_TO_ONE_OPTIONS:{expressions:[{id:'fan1',expression:'9+5'},{id:'fan2',expression:'7+5'},{id:'fan3',expression:'4+9'},{id:'fan4',expression:'6+6'},{id:'fan5',expression:'8+3'}],options:[14,11,12,13]},
 POLYLINE_COMPARE:{unit:'cm',paths:[{id:'red',label:'Đỏ',segments:[48,32]},{id:'green',label:'Xanh',segments:[34,34]},{id:'black',label:'Đen',segments:[32,48]}]},
 NUMBER_LINE_STEP:{start:64,end:100,step:3,expressions:['60+10','67+14','58+19','49+48']},
 SUBTRACTION_COMPARE:{rows:[{id:'hedgehog1',left:'41-17',right:'35-17'},{id:'hedgehog2',left:'30-5',right:'30-9'}]},
 COLUMN_MISSING_DIGITS:{operation:'SUBTRACT',rows:[{minuend:'4?',subtrahend:'17',result:'24'},{minuend:'83',subtrahend:'?9',result:'2?'},{minuend:'?1',subtrahend:'25',result:'4?'}]}
};
const qtypes={
 GRID_100_2X2:'grid',TWO_GROUP_COUNT_ADD:'counting',ADDITION_PYRAMID:'number_input',
 POLYLINE_LENGTH:'measurement',WORD_LESS_THAN:'word_problem',WORD_COMPLEMENT:'word_problem',
 WORD_PART_WHOLE:'word_problem',ONE_TO_ONE_ARITH_MATCH:'matching',
 SYNTHETIC_EXACT_COUNT_TENS:'counting',MANY_TO_ONE_OPTIONS:'choice',
 POLYLINE_COMPARE:'measurement',NUMBER_LINE_STEP:'number_input',
 SUBTRACTION_COMPARE:'comparison',COLUMN_MISSING_DIGITS:'missing_digit'
};
function contract(c){
 return {lessonId:c.lessonId,originExerciseId:c.exerciseId,
  skillId:c.skillId,questionType:qtypes[c.familyId]||'interactive',
  semanticKind:c.familyId,visualIntent:['TWO_GROUP_COUNT_ADD','SYNTHETIC_EXACT_COUNT_TENS'].includes(c.familyId)?'EXACT_COUNT':'STRUCTURAL_MATH',
  semantic:fixture[c.familyId]||{},publicVariant:{}};
}
function clone(x){return JSON.parse(JSON.stringify(x));}
test('manifest has 25 cases, 24 unique exercises, no hidden duplicate',()=>{
 assert.equal(manifest.caseRules.length,25);
 assert.equal(new Set(manifest.caseRules.map(c=>c.caseId)).size,25);
 assert.equal(new Set(manifest.caseRules.map(c=>c.exerciseId)).size,24);
 assert.equal(manifest.caseRules.filter(c=>c.caseId==='C01'||c.caseId==='V03').length,2);
});
test('11 variable, 7 vector, 7 intentionally excluded',()=>{
 const tally=Object.fromEntries(['KEEP_VARIANT','KEEP_STRUCTURAL','DROP'].map(d=>[d,manifest.caseRules.filter(c=>c.decision===d).length]));
 assert.deepEqual(tally,{KEEP_VARIANT:11,KEEP_STRUCTURAL:7,DROP:7});
 assert.deepEqual([manifest.counts.KEEP_VARIANT,manifest.counts.KEEP_STRUCTURAL,manifest.counts.DROP],[11,7,7]);
});
test('each source case is pinned to exactly the same router family',()=>{
 assert.equal(manifest.caseRules.every(c=>c.rendererGrant==='DENY'&&c.publicVariantGrant==='DENY'&&c.independentApproval==='NOT_SIGNED'),true);
 for(const c of manifest.caseRules){
  const v=router.classify(contract(c));
  assert(v.ok,c.caseId+' '+v.reason);
  assert.equal(v.decision,c.decision,c.caseId+' decision');
  if(c.decision!=='DROP'){
   assert.equal(v.rendererCandidate,c.rendererCandidate,c.caseId+' renderer candidate');
   assert.equal(v.familyContractPass,true,c.caseId);
   assert.equal(v.autoReuseForSimilar,true,c.caseId);
  }
  assert.equal(v.publishable,false,c.caseId);
  assert.equal(v.awarded,false,c.caseId);
  assert.equal(v.playable,false,c.caseId);
 }
});
test('full candidate pool keeps 17 unique variants/structural and excludes 7 drops + 1 repeated ID',()=>{
 const batch=manifest.caseRules.map(contract),out=router.buildCandidatePool(batch);
 assert(out.ok);assert.deepEqual(out.counts,{input:25,kept:17,excluded:8});
 assert.equal(out.excluded.filter(x=>x.reason==='DROPPED_UNSAFE_SOURCE_TOPOLOGY').length,7);
 assert.equal(out.excluded.filter(x=>x.reason==='DUPLICATE_SOURCE_EXERCISE').length,1);
 assert.equal(out.publishable,false);assert.equal(out.grading,'NONE');
});
test('future pool excludes invalid contracts and never invents replacements',()=>{
 const first=contract(manifest.caseRules.find(x=>x.caseId==='C03'));
 const bad={...first,skillId:'NOT_REGISTERED'};
 const x=router.buildCandidatePool([first,bad]);
 assert.equal(x.ok,true);assert.equal(x.counts.kept,1);assert.equal(x.excluded.length,1);
 assert.equal(x.replacementPolicy,'REQUIRES_APPROVED_SAME_LESSON_SKILL_POOL_NO_INVENTION');
});
test('E04 D9 contracts never grant E04 automatically',()=>{
 for(const c of manifest.caseRules.filter(x=>x.rendererCandidate.startsWith('D9_'))){
  const q=router.classify(contract(c));assert(q.ok);assert.equal(q.requiresE04,true);assert.equal(q.rendererGrant,'DENY');
 }
});
test('critical SGK 32 total/26 hens and Mai 23 kg/5 lighter are correct in source records',()=>{
 const p=manifest.caseRules.find(x=>x.caseId==='C10');
 const q=manifest.caseRules.find(x=>x.caseId==='C06');
 assert(/32/.test(p.sourceEvidence)&&/26/.test(p.sourceEvidence));
 assert(/Mai/.test(q.sourceEvidence)&&/Mi/.test(q.sourceEvidence)&&/23/.test(q.sourceEvidence));
});
test('future similar case passes template admission but not release',()=>{
 const c={...contract(manifest.caseRules.find(x=>x.caseId==='C02')),
  lessonId:'MATH_B035',originExerciseId:'SGK_B035_LT01_E01'};
 const x=router.classify(c);assert(x.ok);assert.equal(x.admission,'TEMPLATE_QA_PASS_ONLY');assert.equal(x.publishable,false);
});
test('wrong lessonId, fake dropped origin and retagging fail closed',()=>{
 const base=contract(manifest.caseRules.find(x=>x.caseId==='C01'));
 assert.equal(router.classify({...base,lessonId:'MATH_B002'}).ok,false);
 const drop=manifest.caseRules.find(x=>x.caseId==='V05');
 assert.equal(router.classify({...base,lessonId:drop.lessonId,originExerciseId:drop.exerciseId}).ok,false);
});
test('nested answer, uppercase Answer, prototype pollution and bogus rubric fail closed',()=>{
 const base=contract(manifest.caseRules.find(x=>x.caseId==='C02'));
 for(const bad of [
  {...base,publicVariant:{display:{solutionPrompt:'secret'}}},
  {...base,publicVariant:{Answer:'secret'}},
  {...base,publicVariant:{display:{rubric:'value'}}},
  {...base,publicVariant:JSON.parse('{"__proto__":{"polluted":true}}')}
 ])assert.equal(router.classify(bad).ok,false);
});
test('counted WebP cannot masquerade as exact count',()=>{
 const c=contract(manifest.caseRules.find(x=>x.caseId==='V01'));
 c.publicVariant={assetId:'KL_SH01_001'};assert.equal(router.classify(c).ok,false);
});
test('hundred 2x2 patch never wraps to the next row',()=>{
 const c=contract(manifest.caseRules.find(x=>x.caseId==='C01'));
 c.semantic={patches:[{id:'bad',topLeft:70}]};assert.equal(router.classify(c).ok,false);
});
test('wrong question type and skill never infer renderer from similar words',()=>{
 const c=contract(manifest.caseRules.find(x=>x.caseId==='C02'));
 assert.equal(router.classify({...c,skillId:'SUBTRACTION'}).ok,false);
 assert.equal(router.classify({...c,questionType:'geometry'}).ok,false);
});
test('D9 count limit 40; exact count source b unverified is never inherited',()=>{
 const c=contract(manifest.caseRules.find(x=>x.caseId==='V02'));
 c.semantic.count=50;assert.equal(router.classify(c).ok,false);
 assert.equal(manifest.caseRules.find(x=>x.caseId==='V02').rendererGrant,'DENY');
});
test('public source word-problem numbers and relation must agree with prompt',()=>{
 const c=contract(manifest.caseRules.find(x=>x.caseId==='C06'));
 c.semantic={...fixture.WORD_LESS_THAN,first:23,second:5,unit:'kg',prompt:'Mai nặng 23 kg, Mi nhẹ hơn Mai 5 kg'};
 assert(router.classify(c).ok);
 c.semantic.prompt='Mai nặng 23 kg, Mi nhẹ hơn Mai 7 kg';
 assert.equal(router.classify(c).ok,false);
});
test('seed-driven two-group generator is deterministic, key-free, bounded',()=>{
 const a=router.makeSeededTwoGroup(123456,['Cá','Ngôi sao']);
 const b=router.makeSeededTwoGroup(123456,['Cá','Ngôi sao']);
 assert.deepEqual(a,b);assert(a.ok);assert(a.semantic.groups.every(x=>x.quantity>=2&&x.quantity<=40));
 assert(!JSON.stringify(a).includes('"answer"'));
});
test('D3 1:1 accepts C09; D3 must NOT accept V04 five-to-four',()=>{
 const s=fixture.ONE_TO_ONE_ARITH_MATCH;
 const payload={exerciseId:'C09_MATCH',relationMode:'SINGLE_RELATION',
  leftItems:s.left.map(i=>({id:i.id,content:{type:'MATH',text:i.expression}})),
  rightItems:s.right.map(i=>({id:i.id,content:{type:'TEXT',text:i.label}}))};
 assert(D3.compile(payload).ok);
 assert.equal(D3.compile({...payload,exerciseId:'V04_BAD',leftItems:payload.leftItems.concat([payload.leftItems[0]]),rightItems:payload.rightItems}).ok,false);
});
test('V04 routes to FIVE independent D4 questions with repeated option reuse',()=>{
 const x=router.composeD4Choices(fixture.MANY_TO_ONE_OPTIONS);
 assert(x.ok);assert.equal(x.payloads.length,5);
 for(const p of x.payloads)assert(D4.compile(p).ok,'D4 compile '+p.questionId);
 assert.equal(x.grading,'SERVER_ONLY');
 assert(!x.payloads.some(p=>Object.keys(p).some(k=>k.toLowerCase().includes('answer'))));
});
test('C05–C10 D10 guided scaffold compiles without answers',()=>{
 const s=fixture.WORD_LESS_THAN;
 const payload={questionId:'WORD_C05',mode:'GUIDED',prompt:s.prompt,summary:'',unit:s.unit,calculationSteps:1};
 assert(D10.compile(payload).ok);
});
test('V13 D7 arithmetic comparison compiles, independent of unverified route graph',()=>{
 const s=fixture.SUBTRACTION_COMPARE;
 const v={exerciseId:'HEDGEHOG_VARIANT',rows:s.rows.map(r=>({id:r.id,left:{type:'MATH',text:r.left},right:{type:'MATH',text:r.right}}))};
 assert(D7.compile(v).ok);
});
test('D9 supports count/difference, but TOTAL requires E04 sidecar review',()=>{
 const s=fixture.TWO_GROUP_COUNT_ADD;
 const v={exerciseId:'C02_PICTO',mode:'ASSESSMENT',rows:s.groups.map(g=>({id:g.id,label:g.label,contentType:'EMOJI',symbol:'🐟',itemCount:g.quantity})),
  questions:[{id:'compare',type:'COMPARE_DIFFERENCE',rowId:'a',otherRowId:'b',relation:'MORE_THAN',prompt:'So sánh hai nhóm'}]};
 assert(D9.compile(v).ok);
 assert.equal(router.classify(contract(manifest.caseRules.find(c=>c.caseId==='C02'))).requiresE04,true);
});
test('D2 core supports SUBTRACT but legacy B20 manual-carry cannot implement operand blanks',()=>{
 const x=D2.publicPlan({variantId:'COL_SUB_2026',profile:'PV100',operation:'SUBTRACT',level:'LV2',
  a:41,b:25,carryPolicy:'OPTIONAL_HINT',assetId:null});
 assert(x.ok);assert.equal(x.operation,'SUBTRACT');assert(!x.answerSlots.some(s=>s.id.includes('operand')));
});
test('six vector/structural profiles render safe, legible numeric SVG previews',()=>{
 const used=new Set();
 for(const c of manifest.caseRules.filter(c=>c.decision==='KEEP_STRUCTURAL')){
  const p=contract(c);const x=vector.renderSvg(p,router);
  assert(x.ok,c.caseId+' '+x.reason);
  assert(x.svg.startsWith('<svg'));assert(!/<script|onerror=|onload=|<foreignObject/i.test(x.svg));
  assert.equal(x.gradingEnabled,false);assert.equal(x.publishable,false);used.add(c.familyId);
 }
 assert.equal(used.size,6);
});
test('review vector preview is opt-in and never becomes a learner route',()=>{
 const c=contract(manifest.caseRules.find(c=>c.caseId==='C04'));
 const no=vector.mountReviewPreview({getAttribute(){return null;}},c,router);
 assert.equal(no.ok,false);
 const host={innerHTML:'',getAttribute(){return 'true';}};
 const yes=vector.mountReviewPreview(host,c,router);
 assert(yes.ok);assert(host.innerHTML.includes('<svg'));assert.equal(yes.gradingEnabled,false);
});
test('existing app includes are loaded before orchestrator in isolated TEST',()=>{
 const s=fs.readFileSync(join(project,'GiaoDien.html'),'utf8');
 const i=s.indexOf("napThanhPhan('89_P0_VariantRouter')"),j=s.indexOf("napThanhPhan('90_P0_VectorStructural')"),k=s.indexOf("napThanhPhan('83_Visual_Orchestrator')");
 assert(i>0&&j>i&&k>j);
});
test('real orchestrator denies all unsiged P0 variants even after template PASS',()=>{
 const s=fs.readFileSync(join(project,'83_Visual_Orchestrator.html'),'utf8');
 const root={BE_HOC_P0_VARIANT_ROUTER:router,BE_HOC_P0_VECTOR_PREVIEW:vector};
 const ctx=vm.createContext({window:root});
 vm.runInContext(s,ctx,{filename:'83_Visual_Orchestrator.html'});
 const o=root.BE_HOC_VISUAL_ORCHESTRATOR;
 const p=contract(manifest.caseRules.find(c=>c.caseId==='C04'));
 assert(o.p0Candidate(p).ok);
 const r=o.planQuestion({lesson:{id:'toan_b20'}},{id:p.originExerciseId,p0Adaptation:p});
 assert.equal(r.ok,false);assert.equal(r.reason,'P0_PENDING_INDEPENDENT_SOURCE_REVIEW_AND_RENDERER_GATE');
 const drop=contract(manifest.caseRules.find(c=>c.caseId==='V05'));
 const d=o.planQuestion({lesson:{id:'toan_b10'}},{id:drop.originExerciseId,p0Adaptation:drop});
 assert.equal(d.ok,false);assert.equal(d.reason,'P0_UNSAFE_OR_UNVERIFIED_ADAPTATION');
});
const fails=checks.filter(x=>x.status==='FAIL');
const report={phase:'P0 G2B adaptation',scope:'STRUCTURED_TEMPLATE_AND_READONLY_VECTOR_PREVIEW_NOT_GAS_OR_STUDENT_RELEASE',
 checks:checks.length,passed:pass,failed:fails.length,caseCount:25,uniqueExerciseIds:24,
 decisions:{KEEP_VARIANT:11,KEEP_STRUCTURAL:7,DROP:7},sourceHumanSignatures:0,
 e04Approved:false,studentRelease:'NO_GO',failures:fails};
fs.writeFileSync(join(__dirname,'TEST_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(fails.length)process.exitCode=1;
