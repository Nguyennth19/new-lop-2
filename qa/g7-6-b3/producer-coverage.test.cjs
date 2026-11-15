'use strict';
/* B.3 actual P0.6 E03 coverage closure + separate E04 seeded producer.
 * Technical QA, never a user/SGK lesson release or grading path.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {loadProducer,run,PINNED_P06}=require('../g7-6-b2/real-producer-bridge.cjs');
const {projectMental}=require('./mental-number-input.cjs');
const {createExperimentalProducer}=require('./p06-e04-experimental-producer.cjs');
const geo=require('../g7-4-geometry-tangram-reference-v11/geometry-v11-core.js');
const picto=require('../g7-4-pictograph-reference-v11/pictograph-v11-core.js');
let assertions=0;
const eq=(a,b,msg)=>{assert.deepStrictEqual(a,b,msg);assertions++};
const yes=(v,msg)=>{assert.ok(v,msg);assertions++};
const denied=(x,code)=>{eq(x.ok,false,code);eq(x.code,code)};
const root=process.argv[2];
if(!root)throw Error('PINNED_P06_PATH_REQUIRED');
const real=loadProducer(root);
yes(real.ok,'actual P0.6 source pin');
eq(real.sha,PINNED_P06);
const prior=run(root);
yes(prior.ok,'inherited B2 real composer and choice regression');
eq(prior.composed.generated,8);
eq(prior.composed.routed.length,2);
eq(prior.composed.denied.length,6);
eq(prior.choice.routed.length,2);
const composed=real.composer.createDemo();
yes(composed.ok,'real P0.6 E03 composer source run');
const state=real.generator.policyRegistry.resolve('toan_b21');
yes(state.ok,'approved registry loader integrity (policy is draft)');
eq(state.canActivate,false);
const mental=composed.lesson.questions.filter(q=>q.kind==='math.mental');
eq(mental.length,6);
const mapped=mental.map(q=>projectMental(q,{lessonId:composed.lesson.lessonId,policy:state.policy}));
for(const x of mapped){
 yes(x.ok,'6 actual math.mental output mapped '+x.code);
 eq(x.publicPlan.typeId,'MENTAL_INPUT_TEST_EXTENSION');
 eq(x.publicPlan.input.kind,'NUMBER_INPUT');
 eq(x.publicPlan.gradingEnabled,false);
 eq(x.publicPlan.serverGradingConnected,false);
 eq(x.publicPlan.answerKeyIncluded,false);
 eq(x.publicPlan.rendererRegistration,'PENDING_G76_MANIFEST_OWNER_APPROVAL');
}
eq(mapped.length+prior.composed.routed.length,8,'all eight E03 questions presented on technical-only surfaces');
eq(new Set([...mapped.map(x=>x.publicPlan.questionId),...prior.composed.routed.map(x=>x.envelope.questionId)]).size,8);
const sample=mental[0];
const tamper=structuredClone(sample);
tamper.answerSpec.value=999;
yes(projectMental(tamper,{lessonId:'toan_b21',policy:state.policy}).ok,'private answer never used to create public plan');
eq(JSON.stringify(projectMental(tamper,{lessonId:'toan_b21',policy:state.policy}).publicPlan).includes('999'),false);
denied(projectMental({...sample,prompt:'Tính: 3 + 3 = ?'}, {lessonId:'toan_b21',policy:state.policy}),'MENTAL_SOURCE_PROMPT_OR_ASSET_INVALID');
denied(projectMental({...sample,kind:'math.vertical'}, {lessonId:'toan_b21',policy:state.policy}),'MENTAL_P06_PROVENANCE_INVALID');
denied(projectMental({...sample,assets:{sceneId:'malicious'}}, {lessonId:'toan_b21',policy:state.policy}),'MENTAL_SOURCE_PROMPT_OR_ASSET_INVALID');
denied(projectMental({...sample,parameters:{a:95,b:19}}, {lessonId:'toan_b21',policy:state.policy}),'MENTAL_OPERANDS_POLICY_DENIED');
denied(projectMental({...sample,parameters:{a:1,b:0}}, {lessonId:'toan_b21',policy:state.policy}),'MENTAL_OPERANDS_POLICY_DENIED');
denied(projectMental(sample,{lessonId:'toan_b999',policy:state.policy}),'MENTAL_P06_PROVENANCE_INVALID');
const anchor={sha:real.sha,registry:real.generator.policyRegistry};
const extension=createExperimentalProducer(anchor);
yes(extension.ok,'E04 extension anchored to real pinned P06 policy source');
eq(extension.policy.status,'DRAFT_TECHNICAL_ONLY_OWNER_SIGNOFF_PENDING');
eq(extension.policy.curriculumRef,null);
eq(extension.policy.release.allowed,false);
eq(extension.policy.lessonId,'toan_b999');
denied(createExperimentalProducer({...anchor,sha:'0'.repeat(40)}),'B3_SOURCE_PIN_OR_POLICY_GATE_DENIED');
const generated=[];
for(const [mode,seed] of [
 ['D5_TANGRAM','B3_TANGRAM_A'],
 ['D5_TANGRAM','B3_TANGRAM_B'],
 ['D9_COMPARE_DIFFERENCE','B3_CHART_A'],
 ['D9_COMPARE_DIFFERENCE','B3_CHART_B']
]){
 const candidate=extension.generate({mode,seed});
 yes(candidate.ok,'E04 actual generate '+mode+' '+seed);
 eq(candidate.receipt.nativeP06E02,false);
 eq(candidate.receipt.curriculumRef,null);
 eq(candidate.receipt.gradingAllowed,false);
 eq(candidate.receipt.status,'GENERATED_TECHNICAL_CANDIDATE_NOT_PEDAGOGY_APPROVED');
 const duplicate=extension.generate({mode,seed});
 eq(candidate,duplicate,'seed determinism');
 const adapter=extension.project(candidate);
 yes(adapter.ok,'native plan from generated source '+mode+' '+adapter.code);
 yes(adapter.nativeRenderer.plan,'no mocked native plan');
 eq(adapter.nativeRenderer.originalRendererModified,false);
 eq(adapter.nativeRenderer.gradingEnabled,false);
 eq(adapter.nativeRenderer.countRuntimeApproved,false);
 eq(adapter.nativeRenderer.producerGenerated,true);
 eq(adapter.nativeRenderer.realP06CoreGenerator,false);
 eq(adapter.sourceEvidence,'B3_SEEDED_SIDECAR_GENERATED_NOT_NATIVE_P06_E02_E03');
 if(mode==='D5_TANGRAM'){
   const positions=candidate.source.question.publicParameters;
   yes(positions.pieceStartY[1]-positions.pieceStartY[0]>=130,
    'unrotated and rotated roof/wall start bounding boxes do not overlap');
   yes(positions.pieceStartX[2]-positions.pieceStartX[1]>=250,
    'tree start separated horizontally from wall/roof bounds');
   eq(adapter.nativeRenderer.plan.mode,'TANGRAM');
   eq(adapter.nativeRenderer.plan.items.length,3);
   eq(adapter.nativeRenderer.plan.targets.length,3);
   const s=geo.session(adapter.nativeRenderer.plan);
   yes(s.selectPiece('roof').ok);
   yes(s.rotatePiece('roof',90).ok);
   yes(s.placePiece('roof','target_roof').ok);
   yes(s.snapshot().pieces.roof.placedTargetId==='target_roof');
 }else{
   eq(adapter.nativeRenderer.plan.questions[0].type,'COMPARE_DIFFERENCE');
   const s=picto.session(adapter.nativeRenderer.plan);
   yes(s.tap('r1',0).ok);
   yes(s.tap('r2',0).ok);
   yes(s.setAnswer('q_1','2').ok);
   eq(s.snapshot().enteredAnswers.q_1,'2');
 }
 generated.push({mode,seed,candidate,adapter});
}
eq(generated.length,4);
yes(generated[0].candidate.source.question.publicParameters.pieceRotations.join(',')!==
    generated[1].candidate.source.question.publicParameters.pieceRotations.join(',')||
    generated[0].candidate.source.question.publicParameters.pieceStartX.join(',')!==
    generated[1].candidate.source.question.publicParameters.pieceStartX.join(','),
   'different Tangram seeds generate variant geometry/rotation');
yes(generated[2].candidate.source.variantId!==generated[3].candidate.source.variantId,
 'different pictograph seeds generated distinct IDs');
denied(extension.generate({mode:'D10_TRUSTED',seed:'NOGO'}),'B3_E04_MODE_SEED_OR_INDEX_DENIED');
denied(extension.generate({mode:'D5_TANGRAM',seed:'../../unsafe'}),'B3_E04_MODE_SEED_OR_INDEX_DENIED');
denied(extension.generate({mode:'D5_TANGRAM',seed:'A',index:-1}),'B3_E04_MODE_SEED_OR_INDEX_DENIED');
const forged=structuredClone(generated[0].candidate);
forged.source.question.publicParameters.targetIds.push('answer_key');
denied(extension.project(forged),'B3_E04_PROVENANCE_OR_DIGEST_DENIED');
const fake=structuredClone(generated[2].candidate);
fake.receipt.producer='P06_E02_APPROVED';
denied(extension.project(fake),'B3_E04_PROVENANCE_OR_DIGEST_DENIED');
const out={
 schemaVersion:'g76b3.chrome-producer-visual-test-public.v1',
 p06ProducerSha:PINNED_P06,p06CoreStatus:'UNCHANGED_E02_E03_REAL',
 extensionStatus:'SEPARATE_E04_DRAFT_TECHNICAL_ONLY',
 curriculumApproval:false,rendererRegistryApproved:false,releaseReady:false,
 gradingEnabled:false,assetRuntimeEnabled:false,d10TrustedGrading:false,
 coverage:{p06ComposerCount:8,p06VerticalNativeD2:2,p06MentalNewTechnicalRenderer:6,
  p06GeneratorChoiceD4:2,e04TangramGenerated:2,e04PictographGenerated:2,
  original12RendererManifestUntouched:true},
 cases:[
  ...prior.composed.routed.map((x,i)=>({id:'column_'+i,typeId:'D2',origin:'P06_E03_REAL',
   nativePlan:x.nativeRenderer.plan})),
  ...prior.choice.routed.map((x,i)=>({id:'choice_'+i,typeId:'D4',origin:'P06_E02_REAL',
   nativePlan:x.nativeRenderer.plan})),
  ...mapped.map((x,i)=>({id:'mental_'+i,typeId:'MENTAL_INPUT_TEST_EXTENSION',
   origin:'P06_E03_REAL_WITH_NEW_TEST_RENDERER',nativePlan:x.publicPlan})),
  ...generated.map((x,i)=>({id:'generated_'+i,typeId:x.adapter.envelope.typeId,
   origin:'B3_E04_SEPARATE_SEEDED_GENERATOR_PENDING_POLICY',
   nativePlan:x.adapter.nativeRenderer.plan}))
 ]
};
eq(out.cases.length,14);
eq(out.cases.filter(x=>x.typeId==='MENTAL_INPUT_TEST_EXTENSION').length,6);
for(const x of out.cases){
 const serialized=JSON.stringify(x);
 for(const secret of ['"answerSpec"','"correctOptionValue"','"answerKey"','"isCorrect"','"gradingKey"','"teacherSolution"'])
  yes(!serialized.includes(secret),'public browser without private fields '+secret);
}
const basedir=process.env.G76B3_OUTPUT_DIR;
if(basedir){
 fs.mkdirSync(basedir,{recursive:true});
 fs.writeFileSync(path.join(basedir,'public-samples.json'),JSON.stringify(out,null,2)+'\n');
 const receipt={schemaVersion:'g76b3.producer-receipt.v1',p06Sha:PINNED_P06,
  realComposerCount:8,realComposerAccepted:8,realE02Choice:2,
  e04Generated:generated.map(x=>({mode:x.mode,seed:x.seed,sourceId:x.candidate.source.variantId,
   contentSha256:x.candidate.receipt.contentSha256,policyStatus:extension.policy.status})),
  releaseReady:false,visualOwnerSignoff:'PENDING',devicePhysicalTouch:'NOT_TESTED',
  d10TrustedGrading:false,gasDeploy:false,studentDataWrites:false,assertions};
 fs.writeFileSync(path.join(basedir,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
}
console.log('G76B3_PRODUCER_COVERAGE_PASS',assertions,
 'assertions; 8/8 real E03 P06 composer surfaced (6 new mental TEST, 2 D2); 2 real E02 D4;',
 '4 E04 separately GENERATED candidate submodes (2 Tangram, 2 D9); no student grading');
