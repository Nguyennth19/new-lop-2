#!/usr/bin/env node
/* P0 B001–B024: deterministic source-preserving LessonPackage JSON builder.
 * Never derives secret answers, authenticates reviewer or publishes to learners.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'../..');
const input=require(path.join(ROOT,'qa/p0-b01-b24/inputs/source-index.v1.json'));
const decisions=require(path.join(ROOT,'qa/p0-g2b-adaptation/25-case-decisions.v1.json'));
const OUT='du-lieu/bai-hoc/toan/v1/';
const WRITE=process.argv.includes('--write'),CHECK=process.argv.includes('--check');
assert(WRITE!==CHECK,'Pass exactly one of --write or --check');
const eq=(a,b,label)=>assert.equal(a,b,label);
eq(input.schemaVersion,'LOP2_B001_B024_SOURCE_INPUT_SNAPSHOT_V1','input schema');
eq(decisions.schema,'P0_G2B_ADAPTATION_ROUTER_V1','decision schema');
eq(input.lessons.length,24,'lesson count');
eq(input.sourceRows.length,536,'C1 source count');
eq(input.questionRows.length,536,'C1 envelope count');
eq(input.g2Rows.length,96,'G2 page review count');
eq(decisions.caseRules.length,25,'case count');
const src=new Map(input.sourceRows.map(x=>[x.source_id,x]));
const env=new Map(input.questionRows.map(x=>[x.questionId,x]));
const review=new Map(),rules=new Map(),lessonMap=new Map(input.lessonMap.map(x=>[x.lessonId,x]));
for(const x of input.g2Rows){
 assert(!review.has(x.exerciseId),'duplicate G2 '+x.exerciseId);
 review.set(x.exerciseId,x);
}
for(const x of decisions.caseRules){
 assert(review.has(x.exerciseId),'case lacks G2 evidence '+x.caseId);
 const a=rules.get(x.exerciseId)||[];a.push(x);rules.set(x.exerciseId,a);
}
eq(src.size,536,'unique C1 IDs'),eq(env.size,536,'unique C1 envelopes'),eq(review.size,96,'unique G2 IDs');
eq([...src.keys()].filter(x=>review.has(x)).length,0,'C1 and G2 ID crosswalk unverified');
const qType={GRID_100_2X2:'grid',TWO_GROUP_COUNT_ADD:'counting',ADDITION_PYRAMID:'number_input',
 POLYLINE_LENGTH:'measurement',WORD_LESS_THAN:'word_problem',WORD_COMPLEMENT:'word_problem',
 WORD_PART_WHOLE:'word_problem',ONE_TO_ONE_ARITH_MATCH:'matching',
 SYNTHETIC_EXACT_COUNT_TENS:'counting',MANY_TO_ONE_OPTIONS:'choice',
 POLYLINE_COMPARE:'measurement',NUMBER_LINE_STEP:'number_input',
 SUBTRACTION_COMPARE:'comparison',COLUMN_MISSING_DIGITS:'missing_digit'};
function seed(id){let h=2166136261;const s='lop2-v1-20261117|'+id;
 for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;
 return h&0x7fffffff;}
const deny=()=>({sourceExact:'NOT_INDEPENDENTLY_SIGNED',skillId:'INDEX_ONLY',
 renderer:'DENY',asset:'DENY',publicVariant:'DENY',trustedGrading:'NOT_VERIFIED',
 pedagogy:'NOT_SIGNED',studentRelease:'NO_GO'});
function sourceQuestion(id,lesson,skill){
 const s=src.get(id),q=env.get(id);
 assert(s&&q,'missing C1 source or C1 projection '+id);
 eq(s.lesson_id,lesson,'C1 source belongs to wrong lesson '+id);
 eq(q.lessonId,lesson,'C1 JSON belongs to wrong lesson '+id);
 eq(q.sourceTrack,s.track,'C1 track mismatch '+id);
 eq(q.qaPlayability,false,'source unexpectedly playable '+id);
 eq(q.renderEligible,'NO','unexpected C1 renderer grant '+id);
 return {questionId:id,originExerciseId:id,lessonId:'MATH_'+lesson,recordRole:'C1_SOURCE_CANDIDATE',
  source:{track:s.track,level:s.level,session:s.session||null,exerciseLabel:s.exercise_no||null,
   c1Registry:'SOURCE_1406',c1RegistryRow:s._sheetRow,c1EnvelopeRow:q._sheetRow,
   ownerBatch:s.owner_batch,pdfPageCandidate:s.pdf_page||null,printedPageVerified:s.printed_page||null,
   sourceFileIdRecorded:s.source_file_id||null,sourceSHA256Recorded:s.source_sha256||null,
   evidenceURL:s.source_evidence_url||null,sourceOrigin:s.evidence_origin||null,
   sourceIdLock:s.id_lock_state||null},
  prompt:null,sourceTextHint:s.text_excerpt_candidate||null,
  skillId:null,lessonSkillCandidate:skill,skillStatus:'UNRESOLVED_PER_QUESTION',
  questionType:null,typeStatus:'UNKNOWN',visualIntent:null,assetId:null,semanticMapping:null,
  rendererCandidate:null,publicVariant:null,seed:seed(id),
  variant:{variantId:null,mode:'NOT_MATERIALIZED',seed:seed(id),isSourceExact:false,publicVariant:null},
  crosswalk:{g2Id:null,status:'UNRESOLVED_C1_G2_NAMING',autoJoin:false},
  approval:deny(),generatorAdmission:'EXCLUDED_NO_VERIFIED_QUESTION_CONTENT',
  grading:{serverRequired:true,ready:false,publicAnswerKey:false},
  qa:{buildStatus:q.buildStatus,reasonCodes:q.qaReasonCodes,
   sourceMath:s.math_gate,sourceText:s.text_gate,sourceSlots:s.slot_gate,
   sourceReviewer:s.reviewer_gate,sourceRuntime:s.runtime_gate,sourceRelease:s.release_state}};
}
function g2Question(s,lesson,owner,skill){
 const d=rules.get(s.exerciseId)||[],r=d[0]||null;
 if(d.length>1)for(const x of d){eq(x.familyId,r.familyId,'duplicate case family conflict');eq(x.decision,r.decision,'duplicate case decision conflict');}
 const drop=r?.decision==='DROP',id=s.exerciseId;
 const renderer=r?(drop?null:r.rendererCandidate):(s.rendererCandidate||null);
 const variant=r?{variantId:drop?null:'VAR_'+id+'_S'+seed(id),
  familyId:r.familyId,caseIds:d.map(x=>x.caseId),decision:r.decision,
  mode:drop?'DROP':'OWNER_APPROVED_TEMPLATE_REVIEW_ONLY',seed:seed(id),
  sourceExact:false,semanticParameters:null,semanticStatus:'NEEDS_VERIFIED_TYPED_INPUT',
  adaptationRule:r.adaptationRule,rendererCandidate:renderer,
  e04Required:!!r.rendererCandidate?.startsWith('D9_'),publicVariant:null}:null;
 return {questionId:id,originExerciseId:id,lessonId:lesson,recordRole:'G2_PRIMARY_PAGE_TECHNICAL_CANDIDATE',
  source:{track:s.sourceTrack,level:s.sourceTrack==='SGK'?'LV1':'LV2',
   ownerBatch:owner,registry:'10_G2_96_MATRIX',registryRow:s._sheetRow,
   printedPageEvidence:s.printedPages||null,
   primaryPDFSHA256:s.sourceTrack==='SGK'?
    'f3ccd34900f2047afbcf88fa5f9e89dd8908ac09a44b4f266d4282375aeb7ff5':
    '392c43552a4d60480c22496542984ad6add55bab1744898031adc439947aed94'},
  prompt:null,sourceNarrative:s.semanticMapping||null,
  skillId:s.skillId||null,skillStatus:'G2_INDEX_ONLY_NOT_SIGNED',lessonSkillCandidate:skill,
  questionType:r?qType[r.familyId]||null:null,typeStatus:r?'OWNER_VARIANT_FAMILY_ONLY':'UNKNOWN',
  visualIntent:r?(['TWO_GROUP_COUNT_ADD','SYNTHETIC_EXACT_COUNT_TENS'].includes(r.familyId)?'EXACT_COUNT':'STRUCTURAL_MATH'):(s.visualIntent||null),
  assetId:null,semanticMapping:s.semanticMapping||null,rendererCandidate:renderer,
  rendererStatus:'UNAPPROVED_CANDIDATE_ONLY',seed:seed(id),variant,publicVariant:null,
  crosswalk:{c1QuestionId:null,status:'UNRESOLVED_C1_G2_NAMING',autoJoin:false},
  approval:deny(),generatorAdmission:drop?'DROP_EXCLUDED':
   r?'TEMPLATE_CANDIDATE_NONPLAYABLE':'EXCLUDED_NO_APPROVED_ADAPTATION',
  grading:{serverRequired:true,ready:false,publicAnswerKey:false},
  qa:{sourceStatus:s.sourceStatus,partStatus:s.partStatus,figureRisk:s.G1FigureRequirement,
   sourceFactCorrection:s.G1Correction||null,independentReviewer:'NOT_SIGNED',qaGate:s.qaGate}};
}
const packages=[],items=[];let c1Count=0,g2Count=0,caseChecks=0,keep=0,drop=0;
for(let i=1;i<=24;i++){
 const b='B'+String(i).padStart(3,'0'),lid='MATH_'+b;
 const lesson=input.lessons.find(x=>x.lessonId===b),index=lessonMap.get(lid);
 assert(lesson&&index,'missing lesson source mapping '+b);
 const questions=lesson.sourceIds.map(id=>sourceQuestion(id,b,index.skillCandidate));
 const gr=input.g2Rows.filter(x=>x.lessonId===lid).map(x=>g2Question(x,lid,lesson.ownerBatch,index.skillCandidate));
 const adapted=gr.filter(x=>x.variant!==null),kept=adapted.filter(x=>x.variant.mode!=='DROP'),
  dropped=adapted.filter(x=>x.variant.mode==='DROP');
 const checks=adapted.reduce((s,x)=>s+x.variant.caseIds.length,0);
 const pool=kept.map(x=>({originExerciseId:x.originExerciseId,lessonId:lid,skillId:x.skillId,
  questionType:x.questionType,seed:x.seed,familyId:x.variant.familyId,
  rendererCandidate:x.rendererCandidate,variantId:x.variant.variantId,
  publicVariant:null,isSourceExact:false,templateStatus:'PASS_RULE_ONLY',
  playable:false,studentRelease:'DENY'}));
 eq(new Set(pool.map(x=>x.originExerciseId)).size,pool.length,'duplicate candidate in pool '+b);
 eq(questions.length,lesson.sourceCandidates,'lesson candidate count '+b);
 eq(questions.filter(x=>x.source.track==='SGK').length,lesson.sgk,'SGK candidates '+b);
 eq(questions.filter(x=>x.source.track==='VBT').length,lesson.vbt,'VBT candidates '+b);
 const file=OUT+b+'.lesson.json';
 const pkg={schemaVersion:'LOP2_LESSON_PACKAGE_V1',packageId:'LOP2_MATH_'+b+'_LPV1',
  lessonId:lid,legacyLessonIds:[b,'toan_b'+i],title:lesson.title,ownerBatch:lesson.ownerBatch,
  grade:2,subject:'MATH',curriculumId:'KNTT_MATH_G2',volume:lesson.volume,
  packageStatus:'INDEXED_NOT_PLAYABLE',
  provenance:{c1Workbook:input.provenance.c1Workbook,masterWorkbook:input.provenance.masterWorkbook,
   sourceQuestionTab:'SOURCE_1406',technicalReviewTab:'10_G2_96_MATRIX',
   sgkPagesCandidate:index.sgkPages||null,vbtPagesCandidate:index.vbtPages||null,
   lessonSourceGate:index.sourceGate||null,
   titleNote:b==='B017'?'PRIMARY_SGK_TITLE_DIFFERS_FROM_MASTER_VERIFY_BEFORE_APPROVAL':null,
   sourceJoin:'C1_G2_ID_CROSSWALK_UNRESOLVED_NO_AUTO_JOIN'},
  skills:{lessonCandidate:[{skillId:index.skillCandidate,status:'INDEX_ONLY'}],
   perQuestionApproved:[],warning:index.warning||null},
  levelPolicy:{LV1:'SGK_CANDIDATE',LV2:'VBT_CANDIDATE',LV3:'NO_APPROVED_REFERENCE'},
  questions,technicalReviewCandidates:gr,
  variantPool:{mode:'REVIEW_TEMPLATE_CANDIDATES_ONLY',candidates:pool,
   droppedSourceIds:dropped.map(x=>x.originExerciseId),
   missingVerifiedQuestionCount:questions.length,playableCount:0,publicVariantReadyCount:0,
   replacementPolicy:'APPROVED_SAME_LESSON_SKILL_ONLY_DO_NOT_INVENT'},
  reviewGates:{sourceIndependent:'NOT_SIGNED',skillRegistry:'NOT_APPROVED',
   rendererPolicy:'DENY',e04Policy:'NOT_APPROVED_WHEN_REQUIRED',
   trustedGrading:'NOT_VERIFIED',studentRelease:'NO_GO'},
  summary:{c1SourceCandidates:questions.length,g2ReviewCandidates:gr.length,
   adaptationCaseChecks:checks,adaptationUniqueSources:adapted.length,
   keptUnique:kept.length,droppedUnique:dropped.length,
   playable:0,sourceSigned:0,publicVariantReady:0,studentRelease:'NO_GO'},
  rollback:{branchBase:'test/p0-g2b-variant-adaptation-20261117',
   baseSha:'a00a7f348db566bc024ff7ba42d874fe5d6c018a',productionChanged:false}};
 packages.push([file,pkg]);
 items.push({lessonId:lid,title:lesson.title,ownerBatch:lesson.ownerBatch,file,
  c1Candidates:questions.length,g2Candidates:gr.length,adaptationCaseChecks:checks,
  keptUnique:kept.length,droppedUnique:dropped.length,playable:0,release:'NO_GO'});
 c1Count+=questions.length;g2Count+=gr.length;caseChecks+=checks;keep+=kept.length;drop+=dropped.length;
}
eq(c1Count,536,'all C1 imported'),eq(g2Count,96,'all G2 imported'),
eq(caseChecks,25,'all 25 review decisions'),eq(keep,17,'17 unique kept'),
eq(drop,7,'7 dropped');
const manifest={schemaVersion:'LOP2_LESSON_PACKAGE_INDEX_V1',date:'2026-11-17',
 sourceSnapshot:'qa/p0-b01-b24/inputs/source-index.v1.json',
 adaptationManifest:'qa/p0-g2b-adaptation/25-case-decisions.v1.json',
 provenanceCrosswalk:'NO_AUTO_C1_G2_JOIN',
 counts:{lessons:24,c1SourceCandidates:536,g2TechnicalCandidates:96,
  adaptationChecks:25,adaptationUniqueSources:24,keptUniqueSources:17,
  droppedUniqueSources:7,publicVariantReady:0,playable:0,independentSignatures:0},
 stage:'SOURCE_INDEXED_AND_TEMPLATE_CANDIDATES_ONLY_NO_RELEASE',
 files:items};
packages.push([OUT+'manifest.B001-B024.json',manifest]);
for(const [file,obj] of packages){
 const full=path.join(ROOT,file),contents=JSON.stringify(obj,null,2)+'\n';
 if(WRITE){fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,contents);}
 else{assert(fs.existsSync(full),'missing '+file);eq(fs.readFileSync(full,'utf8'),contents,'byte mismatch '+file);}
}
console.log('B001-B024 LESSONPACKAGE '+JSON.stringify({mode:WRITE?'WRITE':'CHECK',
 files:packages.length,lessons:24,sourceCandidates:c1Count,g2Review:g2Count,
 caseChecks,keptUnique:keep,droppedUnique:drop,playable:0,release:'NO_GO'}));
