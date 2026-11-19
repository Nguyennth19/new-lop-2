'use strict';
/* Contract QA for the independent universal LAB against existing unchanged cores.
 * Browser QA separately mounts views on real DOM.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),{makePack}=require('./fixture-packs.cjs'),server=require('./trusted-grade-lab.cjs');
const ctx={console,Set,Map};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
const files=['47_D2V12_Core','53_Geometry_Core','55_Pictograph_Core','65_D1_Type1',
 '66_D3_Core','68_D4_Core','71_D6_Core','73_D7_Core','75_D8_Core','77_D8A_Core','80_D10_Core'];
for(const name of files)vm.runInContext(fs.readFileSync(path.join(root,name+'.html'),'utf8'),ctx,{filename:name+'.html'});
const map={D1:'G74Type1C2',D2:'KLColumnV12',D3:'KLMatchingV11',D4:'KLChoiceV11',
 D5:'KLGeometryTangramV11',D6:'KLDragSortV11',D7:'KLComparisonV11',
 D8:'KLMeasurementV11',D8A:'KLCapacityWeightV11',D8B:'KLCapacityWeightV11',
 D9:'KLPictographV11',D10:'KLWordUnificationV11'};
const forbidden=new Set(['answer','answerKey','answers','correct','correctAnswer','correctOptionId',
 'expectedResult','solution','gradingKey','isCorrect','studentId','score','stars']);
function noKeys(obj){if(!obj||typeof obj!=='object')return true;
 for(const [k,v] of Object.entries(obj)){assert(!forbidden.has(k),'Public key leaked: '+k);noKeys(v)}
 return true;
}
let checked=0;const packs=[makePack('A'),makePack('B')];
for(const p of packs){
 assert.equal(p.questions.length,12);
 assert.equal(new Set(p.questions.map(x=>x.rendererId)).size,12);
 assert.equal(p.lesson.studentRelease,false);noKeys(p);
 for(const q of p.questions){
  const api=ctx[map[q.rendererId]];
  assert(api,'missing original core '+q.rendererId);
  let x;
  if(q.rendererId==='D1')x={ok:api.validPublic(q.publicVariant)};
  else if(q.rendererId==='D2')x=api.publicPlan(q.publicVariant);
  else x=api.compile(q.publicVariant);
  assert.equal(x.ok,true,q.rendererId+' '+p.packId+' '+x.reason);
  checked++;
 }
}
const pa=packs[0],pb=packs[1];
assert.notDeepEqual(pa.questions.map(q=>q.publicVariant),pb.questions.map(q=>q.publicVariant),
 'A/B must be materially different public data');
const d2=pa.questions.find(x=>x.rendererId==='D2'),d4=pa.questions.find(x=>x.rendererId==='D4');
function grade(packId,questionId,submission){return server.evaluateSubmission({packId,questionId,submission})}
assert.equal(grade(pa.packId,d2.questionId,{result_ones:'3',result_tens:'5'}).pass,true);
assert.equal(grade(pa.packId,d2.questionId,{result_ones:'4',result_tens:'5'}).pass,false);
assert.equal(grade(pa.packId,d4.questionId,{selectedOptionIds:['opt2']}).pass,true);
assert.equal(grade(pa.packId,d4.questionId,{selectedOptionIds:['opt1']}).pass,false);
assert.equal(grade(pa.packId,pa.questions.find(x=>x.rendererId==='D5').questionId,{}).status,'NOT_AUTHORIZED');
assert.equal(grade('MATH_LAB_C',d2.questionId,{}).status,'REJECTED');
const contents=fs.readFileSync(path.join(__dirname,'dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'),'utf8');
assert(!contents.includes('trusted-grade-lab.cjs'),'private grader must not be bundled');
assert(!contents.includes('evaluateSubmission(body)'),'server grading function leaked to browser');
console.log('ULT_V1_CORE_CONTRACTS_PASS',checked,'core compiles in 2 valid replaceable packs, private Node grader fail-closed');
