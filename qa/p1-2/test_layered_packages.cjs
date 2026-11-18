#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const path=require('node:path');

const P='du-lieu/bai-hoc/toan/v2/';
const manifest=JSON.parse(fs.readFileSync(P+'manifest.B001-B024.layered.v2.json','utf8'));
const renderer=JSON.parse(fs.readFileSync('qa/p1-2/P1_2_RENDERER_REFERENCE_12.v1.json','utf8'));
const schema=JSON.parse(fs.readFileSync(P+'lessonpackage.layered.schema.v2.json','utf8'));
const routes=renderer.referenceRoutes.map(x=>x.id);
const routeSet=new Set(routes);
const gitBlob=(bytes)=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function uniq(a){return new Set(a).size===a.length;}
function nonempty(v){return typeof v==='string'&&v.trim()!=='';}
function inspect(p,v,i){
 const pref=p.lessonId+': ';
 assert.equal(v.schemaVersion,'LOP2_P1_2_LAYERED_LESSON_V2',pref+'schemaVersion');
 assert.equal(v.lessonId,p.lessonId,pref+'lessonId');
 assert.equal(v.title,p.title,pref+'title');
 assert.equal(v.grade,2,pref+'grade');
 assert.equal(v.subject,'MATH',pref+'subject');
 assert.equal(v.ownerBatch,p.ownerBatch,pref+'owner batch');
 for(const key of schema.required)assert.ok(Object.hasOwn(v,key),pref+'required: '+key);
 assert.equal(v.status,'STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE');
 assert.equal(v.sourceOfTruth.routingName,'P1_1_OFFICIAL_SOURCE_ROUTING_19');
 assert.equal(v.sourceOfTruth.routingCommit,manifest.governance.routingCommit);
 assert.equal(v.sourceOfTruth.routingBlobSha,manifest.governance.routingBlobSha);
 assert.equal(v.sourceOfTruth.sourceV1BlobSha,i.sourceV1Blob);
 assert.equal(v.sourceOfTruth.rendererManifestBlobSha,renderer.sourceManifestBlobSha);
 assert.deepEqual(v.learningPolicy.skillIdsCandidate,i.v1.skills.lessonCandidate);
 assert.deepEqual(v.learningPolicy.skillIdsApproved,[]);
 assert.equal(v.learningPolicy.perQuestionApproval,'NOT_SIGNED');
 assert.equal(v.sourceLayer.recordRole,'C1_SOURCE_CANDIDATE_ONLY');
 assert.deepEqual(v.sourceLayer.items,i.v1.questions,pref+'C1 lossless');
 assert.equal(v.sourceLayer.independentSignoffs,0);
 assert.equal(v.sourceLayer.canonicalSourceExactGranted,false);
 assert.equal(v.technicalReviewLayer.recordRole,'G2_PRIMARY_PAGE_TECHNICAL_CANDIDATE_ONLY');
 assert.deepEqual(v.technicalReviewLayer.items,i.v1.technicalReviewCandidates,pref+'G2 lossless');
 assert.equal(v.technicalReviewLayer.autoJoinToC1,false);
 assert.equal(v.technicalReviewLayer.independentSignoffs,0);
 assert.equal(v.variantCandidateLayer.recordRole,'RULE_BASED_TEMPLATE_CANDIDATE_ONLY');
 assert.deepEqual(v.variantCandidateLayer.templates,i.v1.variantPool.candidates,pref+'templates lossless');
 assert.deepEqual(v.variantCandidateLayer.droppedSourceIds,i.v1.variantPool.droppedSourceIds||[]);
 assert.equal(v.variantCandidateLayer.rejectedAsStudentData,true);
 assert.equal(v.variantCandidateLayer.sourceOriginalExact,false);
 assert.ok(uniq(v.sourceLayer.items.map(x=>x.originExerciseId)),pref+'C1 duplicates');
 assert.ok(uniq(v.technicalReviewLayer.items.map(x=>x.originExerciseId)),pref+'G2 duplicates');
 assert.ok(v.sourceLayer.items.every(x=>x.lessonId===v.lessonId));
 assert.ok(v.technicalReviewLayer.items.every(x=>x.lessonId===v.lessonId));
 assert.deepEqual(v.semanticRoutingLayer.registryRoutes,routes,pref+'route pin');
 assert.equal(v.semanticRoutingLayer.exactRegistryRouteMeansRuntimeGrant,false);
 assert.equal(v.semanticRoutingLayer.bindingPolicy,'REQUIRE_INDEPENDENT_SOURCE_SKILL_VISUAL_COUNT_AND_RENDERER_POLICY_APPROVAL');
 const expected=[...i.v1.technicalReviewCandidates.map(x=>[x.originExerciseId,x.rendererCandidate||null,'G2_PRIMARY_PAGE_TECHNICAL_CANDIDATE']),
 ...i.v1.variantPool.candidates.map(x=>[x.originExerciseId,x.rendererCandidate||null,'RULE_BASED_TEMPLATE_CANDIDATE'])];
 assert.equal(v.semanticRoutingLayer.candidates.length,expected.length,pref+'routing rows');
 let matched=0,unmatched=0,none=0;
 v.semanticRoutingLayer.candidates.forEach((r,ix)=>{
  const [id,candidate,layer]=expected[ix];
  assert.equal(r.originExerciseId,id,pref+'mapping id');
  assert.equal(r.sourceLayer,layer,pref+'mapping layer');
  assert.equal(r.rendererCandidate,candidate,pref+'candidate exact preservation');
  const exact=routeSet.has(candidate)?candidate:null;
  assert.equal(r.rendererRegistryRouteCandidate,exact,pref+'no alias guess');
  assert.equal(r.rendererCandidateResolution,exact?'EXACT_TEST_REFERENCE_NOT_APPROVED':'NO_EXACT_REGISTRY_ROUTE');
  assert.equal(r.rendererGrant,'DENY',pref+'not authorized renderer');
  assert.equal(r.skillIdApproved,null,pref+'not authorized skillId');
  assert.equal(r.countUnitApproved,null,pref+'not authorized countUnit');
  assert.equal(r.publicVariant,null,pref+'no publicVariant');
  assert.equal(r.assetIdCandidate===undefined||r.assetIdCandidate===null||typeof r.assetIdCandidate==='string',true);
  if(exact)matched++;else if(candidate)unmatched++;else none++;
 });
 for(const k of ['publicVariants','rendererGrants','assetGrants','trustedServerAnswerRefs','clientAnswerKeys','activeStudentQuestions'])
  assert.deepEqual(v.approvedRuntimeLayer[k],[],pref+'protected runtime layer '+k);
 assert.equal(v.approvedRuntimeLayer.studentRelease,'DENY');
 assert.equal(v.gates.sourceExact,'PENDING_INDEPENDENT_REVIEW');
 assert.equal(v.gates.rendererId,'DENY');
 assert.equal(v.gates.skillId,'INDEX_ONLY');
 assert.equal(v.gates.assetId,'DENY');
 assert.equal(v.gates.publicVariant,'DENY');
 assert.equal(v.gates.realGasTest,'NOT_ATTESTED');
 assert.equal(v.gates.studentRelease,'NO_GO');
 assert.equal(v.counts.sourceSigned,0);
 assert.equal(v.counts.publicVariantReady,0);
 assert.equal(v.counts.studentPlayable,0);
 assert.equal(v.counts.c1Candidates,i.v1.questions.length);
 assert.equal(v.counts.g2TechnicalCandidates,i.v1.technicalReviewCandidates.length);
 assert.equal(v.counts.templateCandidates,i.v1.variantPool.candidates.length);
 assert.equal(v.counts.rendererRouteCandidates,matched);
 assert.equal(v.counts.unmatchedRendererCandidates,unmatched);
 assert.equal(v.rollback.productionChanged,false);
 assert.equal(v.rollback.returnToV1OnFailure,true);
 return {c1:v.counts.c1Candidates,g2:v.counts.g2TechnicalCandidates,templates:v.counts.templateCandidates,matched,unmatched,none};
}
function assertFails(fn,name){assert.throws(fn,undefined,'negative fixture: '+name);}
function run(){
 assert.equal(manifest.files.length,24);
 assert.ok(uniq(manifest.files.map(x=>x.lessonId)));
 assert.equal(renderer.referenceRoutes.length,12);
 assert.ok(uniq(routes));
 assert.equal(manifest.governance.rendererManifestBlobSha,renderer.sourceManifestBlobSha);
 let total={c1:0,g2:0,templates:0,matched:0,unmatched:0,none:0};
 let fixture;
 for(const f of manifest.files){
  const rawV1=fs.readFileSync(f.sourceV1File),rawV2=fs.readFileSync(f.layeredFile);
  assert.equal(gitBlob(rawV1),f.sourceV1BlobSha,'source git blob drift '+f.lessonId);
  assert.equal(gitBlob(rawV2),f.layeredBlobSha,'layered git blob drift '+f.lessonId);
  const v1=JSON.parse(rawV1),v2=JSON.parse(rawV2);
  const x=inspect(f,v2,{v1,sourceV1Blob:f.sourceV1BlobSha});
  if(!fixture)fixture={f,sourceV1Blob:f.sourceV1BlobSha,v1,v2};
  assert.equal(x.c1,f.expected.c1);assert.equal(x.g2,f.expected.g2);
  assert.equal(x.templates,f.expected.template);
  for(const k of Object.keys(total))total[k]+=x[k];
 }
 assert.equal(total.c1,536);
 assert.equal(total.g2,96);
 assert.equal(total.templates,17);
 assert.equal(total.matched,72);
 assert.equal(total.unmatched,34);
 assert.equal(total.none,7);
 assert.equal(manifest.totals.publicVariantReady,0);
 assert.equal(manifest.totals.studentPlayable,0);
 assert.equal(manifest.runGates.studentRelease,'NO_GO');
 const base=fixture.v2;
 function bad(edit){const v=structuredClone(base);edit(v);return ()=>inspect(fixture.f,v,{v1:fixture.v1,sourceV1Blob:fixture.sourceV1Blob});}
 assertFails(bad(v=>v.approvedRuntimeLayer.publicVariants.push({answer:73})),'public variant leak');
 assertFails(bad(v=>v.approvedRuntimeLayer.clientAnswerKeys.push(73)),'answer leak');
 assertFails(bad(v=>v.gates.studentRelease='GO'),'student release');
 assertFails(bad(v=>v.technicalReviewLayer.autoJoinToC1=true),'false join');
 assertFails(bad(v=>v.sourceLayer.items.pop()),'missing source candidate');
 assertFails(bad(v=>v.semanticRoutingLayer.candidates[0].rendererGrant='ALLOW'),'renderer grant');
 assertFails(bad(v=>v.semanticRoutingLayer.candidates[0].publicVariant={a:1}),'public candidate grant');
 assertFails(bad(v=>v.semanticRoutingLayer.candidates[0].rendererRegistryRouteCandidate='D9'),'route without exact match');
 assertFails(bad(v=>v.counts.sourceSigned=1),'false source signoff');
 console.log(JSON.stringify({test:'P1_2_LAYERED_ALL24',status:'PASS',lessons:24,...total,negativeFixtures:9,studentRelease:'NO_GO'}));
}
if(require.main===module)run();
module.exports={inspect,run,gitBlob};
