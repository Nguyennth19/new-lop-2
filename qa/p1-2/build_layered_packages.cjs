#!/usr/bin/env node
'use strict';
/* P1.2 reproducible transformation: no Google Drive, no GAS, no learner data.
 * --check: verify all 24 committed output JSON objects are reproducible;
 * --write: regenerate only V2 files locally (not their source V1 files).
 * Neither mode upgrades source/renderer/public grants.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const ROOT='du-lieu/bai-hoc/toan/v2/';
const INDEX=JSON.parse(fs.readFileSync(ROOT+'manifest.B001-B024.layered.v2.json','utf8'));
const R=JSON.parse(fs.readFileSync('qa/p1-2/P1_2_RENDERER_REFERENCE_12.v1.json','utf8'));
const routes=R.referenceRoutes.map(x=>x.id);
const names=new Set(routes);
function gitBlob(bytes){return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');}
function project(base,info,sourceBlob){
 const lid=base.lessonId;
 const q=[...base.technicalReviewCandidates.map(x=>({
   originExerciseId:x.originExerciseId,sourceLayer:'G2_PRIMARY_PAGE_TECHNICAL_CANDIDATE',
   skillIdCandidate:x.skillId||null,skillIdApproved:null,questionTypeCandidate:x.questionType||null,
   visualIntentCandidate:x.visualIntent||null,assetIdCandidate:x.assetId||null,
   semanticCandidate:x.semanticMapping||null,rendererCandidate:x.rendererCandidate||null,
   rendererRegistryRouteCandidate:names.has(x.rendererCandidate)?x.rendererCandidate:null,
   rendererCandidateResolution:names.has(x.rendererCandidate)?'EXACT_TEST_REFERENCE_NOT_APPROVED':'NO_EXACT_REGISTRY_ROUTE',
   rendererGrant:'DENY',countUnitApproved:null,publicVariant:null
 })),
 ...base.variantPool.candidates.map(x=>({
   originExerciseId:x.originExerciseId,sourceLayer:'RULE_BASED_TEMPLATE_CANDIDATE',
   skillIdCandidate:x.skillId||null,skillIdApproved:null,questionTypeCandidate:x.questionType||null,
   visualIntentCandidate:null,assetIdCandidate:null,semanticCandidate:null,
   rendererCandidate:x.rendererCandidate||null,rendererRegistryRouteCandidate:names.has(x.rendererCandidate)?x.rendererCandidate:null,
   rendererCandidateResolution:names.has(x.rendererCandidate)?'EXACT_TEST_REFERENCE_NOT_APPROVED':'NO_EXACT_REGISTRY_ROUTE',
   rendererGrant:'DENY',countUnitApproved:null,publicVariant:null
 }))];
 return {
  schemaVersion:'LOP2_P1_2_LAYERED_LESSON_V2',phase:'P1.2',lessonId:lid,title:base.title,
  grade:base.grade,subject:base.subject,volume:base.volume,ownerBatch:base.ownerBatch,
  legacyLessonIds:base.legacyLessonIds,status:'STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE',
  sourceOfTruth:{
   routingName:'P1_1_OFFICIAL_SOURCE_ROUTING_19',
   routingCommit:INDEX.governance.routingCommit,routingBlobSha:INDEX.governance.routingBlobSha,
   sourceV1Branch:'test/p0-b01-b24-lessonpackage-v1-20261117',
   sourceV1Commit:INDEX.governance.sourceBaseSha,sourceV1BlobSha:sourceBlob,
   sourceV1Path:info.sourceV1File,rendererManifestCommit:'ee20a8b7394e22e6028d6760c49b77c54a2814cc',
   rendererManifestBlobSha:R.sourceManifestBlobSha
  },
  learningPolicy:{levelPolicy:base.levelPolicy||{},skillIdsCandidate:base.skills.lessonCandidate,
   skillIdsApproved:[],perQuestionApproval:'NOT_SIGNED'},
  sourceLayer:{recordRole:'C1_SOURCE_CANDIDATE_ONLY',provenance:base.provenance,
   items:base.questions,independentSignoffs:0,canonicalSourceExactGranted:false},
  technicalReviewLayer:{recordRole:'G2_PRIMARY_PAGE_TECHNICAL_CANDIDATE_ONLY',
   items:base.technicalReviewCandidates,autoJoinToC1:false,independentSignoffs:0},
  variantCandidateLayer:{recordRole:'RULE_BASED_TEMPLATE_CANDIDATE_ONLY',
   templates:base.variantPool.candidates,droppedSourceIds:base.variantPool.droppedSourceIds||[],
   rejectedAsStudentData:true,sourceOriginalExact:false},
  semanticRoutingLayer:{registryRoutes:routes,candidates:q,
   bindingPolicy:'REQUIRE_INDEPENDENT_SOURCE_SKILL_VISUAL_COUNT_AND_RENDERER_POLICY_APPROVAL',
   exactRegistryRouteMeansRuntimeGrant:false},
  approvedRuntimeLayer:{publicVariants:[],rendererGrants:[],assetGrants:[],
   trustedServerAnswerRefs:[],clientAnswerKeys:[],activeStudentQuestions:[],studentRelease:'DENY'},
  gates:{...base.reviewGates,sourceExact:'PENDING_INDEPENDENT_REVIEW',
   rendererId:'DENY',skillId:'INDEX_ONLY',assetId:'DENY',publicVariant:'DENY',
   realGasTest:'NOT_ATTESTED',studentRelease:'NO_GO'},
  counts:{c1Candidates:base.questions.length,g2TechnicalCandidates:base.technicalReviewCandidates.length,
   templateCandidates:base.variantPool.candidates.length,
   rendererRouteCandidates:q.filter(x=>x.rendererRegistryRouteCandidate).length,
   unmatchedRendererCandidates:q.filter(x=>x.rendererCandidate&&!x.rendererRegistryRouteCandidate).length,
   sourceSigned:0,publicVariantReady:0,studentPlayable:0},
  rollback:{sourceV1Commit:INDEX.governance.sourceBaseSha,sourceV1BlobSha:sourceBlob,
   productionChanged:false,returnToV1OnFailure:true}
 };
}
function execute(mode){
 if(!['--check','--write'].includes(mode))throw Error('Use --check or --write. No implicit writes.');
 let count=0;
 for(const row of INDEX.files){
  const input=fs.readFileSync(row.sourceV1File);
  const blob=gitBlob(input);
  assert.equal(blob,row.sourceV1BlobSha,'source V1 pin '+row.lessonId);
  const v1=JSON.parse(input);
  assert.equal(v1.lessonId,row.lessonId);
  const output=project(v1,row,blob);
  assert.equal(output.counts.sourceSigned,0);
  assert.equal(output.approvedRuntimeLayer.publicVariants.length,0);
  const bytes=JSON.stringify(output,null,2)+'\n';
  if(mode==='--check'){
   const actual=fs.readFileSync(row.layeredFile,'utf8');
   assert.equal(actual,bytes,'V2 reproducibility drift '+row.lessonId);
   assert.equal(gitBlob(Buffer.from(actual)),row.layeredBlobSha,'V2 manifest blob '+row.lessonId);
  }else{
   fs.writeFileSync(row.layeredFile,bytes);
  }
  count++;
 }
 assert.equal(count,24);
 console.log('P1.2 '+mode+' PASS, 24/24 generated losslessly, no source/data release rights.');
}
if(require.main===module)execute(process.argv[2]);
module.exports={project,execute};
