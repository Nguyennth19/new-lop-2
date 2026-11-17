'use strict';
/* Contract lock: the formal V1 schema, generated 24 files, deterministic
 * builder, and 102 current checks must remain synchronized on one TEST HEAD.
 * CI on this commit is a source-index QA receipt, never a release approval.
 */
/* CI must fail closed: a valid source index is NOT a playable lesson.
 * 24 JSON files + manifest, 536 C1 source, 96 G2 review, 25 decisions.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const manifest=require(path.join(root,'du-lieu/bai-hoc/toan/v1/manifest.B001-B024.json'));
const decisions=require(path.join(root,'qa/p0-g2b-adaptation/25-case-decisions.v1.json'));
const directory=path.join(root,'du-lieu/bai-hoc/toan/v1');
let count=0,sourceRows=0,g2Rows=0,kept=0,dropped=0,checks=0,publicCount=0;
const cases=new Map(),globalC1=new Set(),globalG2=new Set(),testPool=new Set();
for(const rule of decisions.caseRules){
 if(!cases.has(rule.exerciseId))cases.set(rule.exerciseId,[]);
 cases.get(rule.exerciseId).push(rule);
}
const errors=[],pass=(label,fn)=>{try{fn();count++;}catch(e){errors.push(label+': '+String(e.message||e));}};
pass('index header',()=>{
 assert.equal(manifest.schemaVersion,'LOP2_LESSON_PACKAGE_INDEX_V1');
 assert.equal(manifest.files.length,24);
 assert.deepEqual(manifest.counts,{lessons:24,c1SourceCandidates:536,g2TechnicalCandidates:96,
  adaptationChecks:25,adaptationUniqueSources:24,keptUniqueSources:17,
  droppedUniqueSources:7,publicVariantReady:0,playable:0,independentSignatures:0});
});
for(let n=1;n<=24;n++){
 const id='B'+String(n).padStart(3,'0'),p=path.join(directory,id+'.lesson.json');
 let lesson;
 pass('package file '+id,()=>{
  assert(fs.existsSync(p),'missing '+id);
  lesson=JSON.parse(fs.readFileSync(p,'utf8'));
  assert.equal(lesson.lessonId,'MATH_'+id);
  assert.equal(lesson.schemaVersion,'LOP2_LESSON_PACKAGE_V1');
  assert.equal(lesson.summary.studentRelease,'NO_GO');
  assert.equal(lesson.summary.playable,0);
  assert.equal(lesson.variantPool.playableCount,0);
  assert.equal(lesson.reviewGates.sourceIndependent,'NOT_SIGNED');
  assert.equal(lesson.reviewGates.rendererPolicy,'DENY');
  assert.equal(lesson.reviewGates.trustedGrading,'NOT_VERIFIED');
 });
 if(!lesson)continue;
 pass('source provenance '+id,()=>{
  for(const q of lesson.questions){
   assert(!globalC1.has(q.questionId),'duplicate C1 ID '+q.questionId);
   globalC1.add(q.questionId);
   assert.equal(q.lessonId,lesson.lessonId);
   assert(['SGK','VBT'].includes(q.source.track));
   assert(q.source.sourceSHA256Recorded);
   assert(q.source.evidenceURL.startsWith('https://drive.google.com/'));
   assert(Number.isSafeInteger(q.seed)&&q.seed>=0);
   assert.equal(q.skillId,null,'C1 question skill cannot be invented');
   assert(q.lessonSkillCandidate);
   assert.equal(q.questionType,null);
   assert.equal(q.publicVariant,null);
   assert.equal(q.rendererCandidate,null);
   assert.equal(q.grading.ready,false);
   assert.equal(q.crosswalk.autoJoin,false);
   assert.equal(q.approval.studentRelease,'NO_GO');
   assert.equal(q.generatorAdmission,'EXCLUDED_NO_VERIFIED_QUESTION_CONTENT');
  }
  assert.equal(lesson.questions.length,lesson.summary.c1SourceCandidates);
 });
 pass('G2 sources and 25 decisions '+id,()=>{
  for(const q of lesson.technicalReviewCandidates){
   assert(!globalG2.has(q.questionId),'duplicate G2 ID '+q.questionId);
   globalG2.add(q.questionId);
   assert.equal(q.lessonId,lesson.lessonId);
   assert(/^[a-f0-9]{64}$/.test(q.source.primaryPDFSHA256));
   assert(q.skillId);
   assert(Number.isSafeInteger(q.seed));
   assert.equal(q.crosswalk.autoJoin,false);
   assert.equal(q.approval.studentRelease,'NO_GO');
   assert.equal(q.publicVariant,null);
   assert.equal(q.grading.ready,false);
   const decision=cases.get(q.questionId)||[];
   if(decision.length){
    assert(q.variant,'missing decision '+q.questionId);
    assert.equal(q.variant.caseIds.length,decision.length);
    if(q.variant.mode==='DROP'){
     assert.equal(q.rendererCandidate,null);
     assert.equal(q.generatorAdmission,'DROP_EXCLUDED');dropped++;
    }else{
     assert.equal(q.generatorAdmission,'TEMPLATE_CANDIDATE_NONPLAYABLE');
     assert(q.rendererCandidate);kept++;
    }
    checks+=decision.length;
   }else{
    assert.equal(q.variant,null);
    assert.equal(q.generatorAdmission,'EXCLUDED_NO_APPROVED_ADAPTATION');
   }
  }
  assert.equal(lesson.technicalReviewCandidates.length,lesson.summary.g2ReviewCandidates);
 });
 pass('pool excludes DROPs and duplicate ids '+id,()=>{
  const pool=lesson.variantPool.candidates;
  assert.equal(pool.length,lesson.summary.keptUnique);
  assert.equal(new Set(pool.map(q=>q.originExerciseId)).size,pool.length);
  for(const q of pool){
   assert(!lesson.variantPool.droppedSourceIds.includes(q.originExerciseId));
   assert(!testPool.has(q.originExerciseId),'duplicate pool exercise globally');
   testPool.add(q.originExerciseId);
   assert(q.rendererCandidate&&q.skillId&&q.seed!==undefined);
   assert.equal(q.publicVariant,null);
   assert.equal(q.playable,false);
   assert.equal(q.studentRelease,'DENY');
  }
  publicCount+=lesson.summary.publicVariantReady;
  sourceRows+=lesson.questions.length;g2Rows+=lesson.technicalReviewCandidates.length;
 });
}
pass('full source coverage without fabricated crosswalk',()=>{
 assert.equal(sourceRows,536);
 assert.equal(g2Rows,96);
 assert.equal(globalC1.size,536);
 assert.equal(globalG2.size,96);
 assert.equal([...globalC1].filter(x=>globalG2.has(x)).length,0);
 assert.equal(checks,25);
 assert.equal(kept,17);
 assert.equal(dropped,7);
 assert.equal(testPool.size,17);
 assert.equal(publicCount,0);
 assert.equal(new Set(decisions.caseRules.map(x=>x.exerciseId)).size,24);
});
pass('three owner examples present and unsafe ids excluded',()=>{
 const t=JSON.parse(fs.readFileSync(path.join(directory,'B019.lesson.json'),'utf8'));
 const a=t.technicalReviewCandidates.find(x=>x.questionId==='SGK_B019_LT01_E03');
 const b=t.technicalReviewCandidates.find(x=>x.questionId==='SGK_B019_LT01_E04');
 assert.equal(a.variant.familyId,'TWO_GROUP_COUNT_ADD');
 assert.equal(b.variant.familyId,'ADDITION_PYRAMID');
 const u=JSON.parse(fs.readFileSync(path.join(directory,'B020.lesson.json'),'utf8'));
 assert.equal(u.technicalReviewCandidates.find(x=>x.questionId==='SGK_B020_LT01_E05').variant.familyId,'POLYLINE_LENGTH');
 const v=JSON.parse(fs.readFileSync(path.join(directory,'B010.lesson.json'),'utf8'));
 assert(v.variantPool.droppedSourceIds.includes('SGK_B010_LT01_E04'));
 assert(!v.variantPool.candidates.some(x=>x.originExerciseId==='SGK_B010_LT01_E04'));
});
pass('B017 title discrepancy preserved, not silently edited',()=>{
 const b=JSON.parse(fs.readFileSync(path.join(directory,'B017.lesson.json'),'utf8'));
 assert.equal(b.provenance.titleNote,'PRIMARY_SGK_TITLE_DIFFERS_FROM_MASTER_VERIFY_BEFORE_APPROVAL');
});
pass('no student answer keys or executable private grading in package schema',()=>{
 for(const file of manifest.files){
  const t=fs.readFileSync(path.join(root,file.file),'utf8');
  for(const secret of ['"answerKey"','"correctAnswer"','"solutionPrompt"','"gradingKey"','"studentId"'])
   assert(!t.includes(secret),file.lessonId+' leaks '+secret);
 }
});
pass('formal LessonPackage v1 schema required contract matches 24 generated files',()=>{
 const schema=JSON.parse(fs.readFileSync(path.join(directory,'lessonpackage.schema.v1.json'),'utf8'));
 assert.equal(schema.$schema,'https://json-schema.org/draft/2020-12/schema');
 assert.equal(schema.properties.packageStatus.const,'INDEXED_NOT_PLAYABLE');
 assert.equal(schema.properties.reviewGates.properties.studentRelease.const,'NO_GO');
 assert.equal(schema.$defs.sourceQuestion.properties.skillId.type,'null');
 assert.equal(schema.$defs.sourceQuestion.properties.publicVariant.type,'null');
 for(const row of manifest.files){
  const obj=JSON.parse(fs.readFileSync(path.join(root,row.file),'utf8'));
  for(const k of schema.required)assert(Object.hasOwn(obj,k),row.lessonId+' missing '+k);
  for(const q of obj.questions)for(const k of schema.$defs.sourceQuestion.required)
   assert(Object.hasOwn(q,k),q.questionId+' missing '+k);
  for(const q of obj.technicalReviewCandidates)for(const k of schema.$defs.g2Candidate.required)
   assert(Object.hasOwn(q,k),q.questionId+' missing '+k);
  for(const q of obj.variantPool.candidates)for(const k of schema.$defs.previewCandidate.required)
   assert(Object.hasOwn(q,k),q.originExerciseId+' missing '+k);
 }
});
const report={tests:count+errors.length,passed:count,failed:errors.length,lessons:24,
 c1SourceCandidates:sourceRows,g2TechnicalCandidates:g2Rows,
 ownerCaseChecks:checks,keptUnique:kept,droppedUnique:dropped,
 templatePool:17,studentPlayable:0,status:errors.length?'FAIL':'PASS_TECHNICAL_INDEX_ONLY',
 studentRelease:'NO_GO',errors};
console.log(JSON.stringify(report,null,2));
if(process.argv.includes('--write-report')){
 fs.writeFileSync(path.join(root,'qa/p0-b01-b24/TEST_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
}
if(errors.length)process.exitCode=1;
