'use strict';
/* B.2 connects to the *actual* independently checked-out P0.6 producer source.
 * The producer is loaded at its immutable Git commit in GitHub Actions; never copied/changed.
 * TEST_ONLY. P0.6 pedagogical signoff remains unchanged; never grades.
 */
const path=require('node:path');
const cp=require('node:child_process');
const {adapt}=require('../g7-6/variant-adapter-bridge.cjs');
const PINNED_P06='c0c5620f30edd92ab45d4ec87a8a07ffa38948e2';
const fail=(code,details)=>({ok:false,code,details:details||null});
function loadProducer(repoRoot){
 if(typeof repoRoot!=='string'||!repoRoot)return fail('P06_SOURCE_ROOT_REQUIRED');
 const root=path.resolve(repoRoot);
 let sha;try{sha=cp.execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()}catch(_){return fail('P06_PIN_UNVERIFIABLE')}
 if(sha!==PINNED_P06)return fail('P06_PIN_MISMATCH');
 const fixtures=path.join(root,'thu-nghiem','p0-6');
 // These are *real* P0.6 exports: no mock, no locally reimplemented generator.
 const composer=require(path.join(fixtures,'composer-fixtures-v1.cjs'));
 const generator=require(path.join(fixtures,'policy-generator-fixtures-v1.cjs'));
 return {ok:true,sha,composer,generator};
}
function fromComposer(real){
 const result=real.composer.createDemo();
 if(!result.ok)return fail('P06_COMPOSER_REJECTED',result.code);
 if(result.status!=='COMPOSED_TECHNICAL_PASS_REVIEW_PENDING'||result.scope!=='OFFLINE_ONLY'||
    result.noWrites!==true||result.noStars!==true)return fail('P06_COMPOSER_SCOPE_DRIFT');
 const records=result.report.qa.records,manifest=real.composer.manifest;
 const routed=[],denied=[];
 for(const q of result.lesson.questions){
  const receipt=records.find(x=>x.questionId===q.id);
  const family=manifest.families.find(x=>x.id===receipt?.familyId);
  if(!family)return fail('P06_FAMILY_PROVENANCE_MISSING');
  if(q.kind!=='math.vertical'){
   denied.push({questionId:q.id,code:'P06_MENTAL_NUMBER_INPUT_NO_MATCHING_G76_RENDERER'});
   continue;
  }
  const mapped=adapt({lessonId:result.lesson.lessonId,variantId:q.id,typeId:'D2',
   scope:'P06_GENERATOR_CANDIDATE_OFFLINE',mathKind:family.mathKind,question:q});
  if(!mapped.ok)return fail('P06_REAL_D2_ADAPTER_REJECTED',mapped.code);
  routed.push(mapped);
 }
 if(result.coverage.total!==result.lesson.questions.length||!routed.length||!denied.length)
  return fail('P06_COMPOSER_COVERAGE_DRIFT');
 return {ok:true,source:'P06_E03_COMPOSER_ACTUAL_OUTPUT',p06Sha:real.sha,
  generated:result.lesson.questions.length,routed,denied,
  pedagogicalApproval:'PENDING',assetRuntimeAllowed:false,gasDeployed:false};
}
function fromChoiceGenerator(real){
 const r=real.generator.generator.generate({lessonId:'toan_b21',
  templateId:'B21_CARRY_ADD_V1',count:2,seed:'G76B2_REAL',interaction:'CHOICE'});
 if(!r.ok)return fail('P06_REAL_CHOICE_GENERATOR_REJECTED',r.code);
 if(r.status!=='CANDIDATES_PENDING_APPROVAL'||r.noWrites!==true||r.noStars!==true)
  return fail('P06_CHOICE_SCOPE_DRIFT');
 const routed=[];
 for(const item of r.results){
  const mapped=adapt({lessonId:r.lessonId,variantId:item.question.id,typeId:'D4',
   scope:'P06_GENERATOR_CANDIDATE_OFFLINE',
   question:item.question,variant:item.variant});
  if(!mapped.ok)return fail('P06_REAL_CHOICE_ADAPTER_REJECTED',mapped.code);
  routed.push(mapped);
 }
 if(routed.length!==2)return fail('P06_CHOICE_COUNT_DRIFT');
 return {ok:true,source:'P06_E02_GENERATOR_ACTUAL_OUTPUT',p06Sha:real.sha,
  generated:r.results.length,routed,pedagogicalApproval:'PENDING',
  assetRuntimeAllowed:false,gasDeployed:false};
}
function run(repoRoot){
 const real=loadProducer(repoRoot);if(!real.ok)return real;
 const composed=fromComposer(real);if(!composed.ok)return composed;
 const choice=fromChoiceGenerator(real);if(!choice.ok)return choice;
 return {ok:true,provenance:{branch:'test/p0-6-fc-audit-20261114',sha:real.sha,
  execution:'NATIVE_SOURCE_LOADED_FROM_SEPARATE_PINNED_CHECKOUT_NOT_COPIED'},
  composed,choice,scope:'ISOLATED_TEST_ONLY',releaseReady:false,
  trustedGraderConnected:false};
}
module.exports={PINNED_P06,loadProducer,fromComposer,fromChoiceGenerator,run};
