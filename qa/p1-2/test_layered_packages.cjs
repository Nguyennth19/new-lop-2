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


function verifyCrosswalk(){
 const files=[
  'qa/p1-2/P1_2_CROSSWALK_B001_B012.review.v1.json',
  'qa/p1-2/P1_2_CROSSWALK_B013_B024.review.v1.json'
 ];
 const seen=new Set(),totals={lessonCount:0,c1:0,g2:0,templates:0,dropped:0};
 for(const file of files){
  const c=readJson(file),lessonIds=new Set();
  assert.equal(c.schemaVersion,'P1_2_SOURCE_CANDIDATE_CROSSWALK_PART_V1');
  assert.equal(c.status,'INDEX_QA_ONLY_NOT_SOURCE_EXACT');
  const collections=[
   ['source','c1'],['technicalReview','g2'],['templateCandidates','templates'],['droppedTemplateOrigins','dropped']
  ];
  for(const [key,tallyKey] of collections){
   const list=c[key];
   assert.equal(list.length,c.tally[tallyKey],file+' '+key+' count');
   totals[tallyKey]+=list.length;
   for(const row of list){
    assert.ok(row.rowKey && !seen.has(row.rowKey),file+' duplicate key '+row.rowKey);
    seen.add(row.rowKey);lessonIds.add(row.lessonId);
    assert.ok(row.packageBlobSha && /^[a-f0-9]{40}$/.test(row.packageBlobSha));
    if(key==='source'){assert.equal(row.sourceStatus,'C1_CANDIDATE_NOT_INDEPENDENTLY_SIGNED');assert.equal(row.skillIdApproved,null);assert.equal(row.publicVariant,null);}
    if(key==='technicalReview'){assert.equal(row.reviewerStatus,'NOT_SIGNED');assert.equal(row.rendererGrant,'DENY');assert.equal(row.publicVariant,null);}
    if(key==='templateCandidates'){assert.equal(row.publicVariant,null);assert.equal(row.studentPlayable,false);}
    if(key==='droppedTemplateOrigins')assert.equal(row.sourceRecordDeletion,false);
   }
  }
  assert.equal(lessonIds.size,c.tally.lessonCount);
  for(const lessonId of lessonIds){
   const n=lessonId.split('_')[1],f=manifest.files.find(x=>x.lessonId===lessonId);
   assert.ok(f);const p=readJson(f.layeredFile);
   const matching=(key)=>c[key].filter(x=>x.lessonId===lessonId);
   const src=matching('source'),g2=matching('technicalReview'),templates=matching('templateCandidates'),drop=matching('droppedTemplateOrigins');
   assert.deepEqual(src.map(x=>x.originExerciseId),p.sourceLayer.items.map(x=>x.originExerciseId));
   assert.deepEqual(g2.map(x=>x.originExerciseId),p.technicalReviewLayer.items.map(x=>x.originExerciseId));
   assert.deepEqual(templates.map(x=>x.variantId),p.variantCandidateLayer.templates.map(x=>x.variantId));
   assert.deepEqual(drop.map(x=>x.originExerciseId),p.variantCandidateLayer.droppedSourceIds);
   for(const list of [src,g2,templates,drop])for(const row of list)assert.equal(row.packageBlobSha,f.layeredBlobSha);
  }
  totals.lessonCount+=c.tally.lessonCount;
 }
 assert.deepEqual(totals,{lessonCount:24,c1:536,g2:96,templates:17,dropped:7});
 console.log(JSON.stringify({test:'P1_2_CROSSWALK_COMPLETE',status:'PASS',...totals,autoJoin:false}));
}
if(require.main===module)verifyCrosswalk();
module.exports.verifyCrosswalk=verifyCrosswalk;


function verifyC4DevReuse(){
 const file='qa/p1-2/P1_2_C4_DEV27_EXACT_ID_REUSE_CROSSWALK.review.v1.json';
 const d=readJson(file);
 assert.equal(d.schemaVersion,'P1_2_C4_DEV_EXACT_ID_REUSE_CROSSWALK_V1');
 assert.equal(d.status,'27_OF_27_EXACT_ID_MATCH_FOR_DEV_REFERENCE_NO_STUDENT_GRANT');
 assert.equal(d.records.length,27);
 assert.equal(d.counts.B001,24);
 assert.equal(d.counts.B002,3);
 assert.equal(d.counts.publicVariantsApproved,0);
 assert.equal(d.sourceWorkbook.privateAnswerKeysCopiedToGithub,false);
 const unique=new Set();
 const lessons=new Map();
 for(const r of d.records){
  assert.ok(!unique.has(r.joinKey),'C4 duplicate '+r.joinKey);unique.add(r.joinKey);
  assert.ok(['MATH_B001','MATH_B002'].includes(r.lessonId));
  assert.equal(r.sourceExactIndependentGrant,'NOT_GRANTED');
  assert.equal(r.reuseScope,'C4_DEV_CONTENT_REFERENCE_ONLY');
  assert.equal(r.rendererGrant,'DENY');
  assert.equal(r.publicVariant,null);
  assert.equal(r.identityMatch,'EXACT_ORIGIN_EXERCISE_ID');
  assert.equal(r.c4Status,'REAL_ITEM_DEV_RENDERED');
  assert.equal(r.c4ScoringQA,'SCORED_CHROME_DESKTOP_MOBILE');
  if(!lessons.has(r.lessonId)){
   const f=manifest.files.find(x=>x.lessonId===r.lessonId);
   lessons.set(r.lessonId,{file:f,source:readJson(f.layeredFile)});
  }
  const src=lessons.get(r.lessonId),q=src.source.sourceLayer.items.find(x=>x.originExerciseId===r.originExerciseId);
  assert.ok(q,'C4 DEV item without C1 ID '+r.originExerciseId);
  assert.equal(r.v2LayerBlobSha,src.file.layeredBlobSha);
  assert.equal(r.c1SourceRow,q.source.c1RegistryRow);
  assert.equal(r.c1EnvelopeRow,q.source.c1EnvelopeRow);
  assert.equal(r.sourceTrack,q.source.track);
  assert.equal(r.level,q.source.level);
 }
 assert.equal(unique.size,27);
 console.log(JSON.stringify({test:'P1_2_C4_DEV_REUSE',status:'PASS',exactIdLinks:27,B001:24,B002:3,answersCopied:false,studentRelease:'NO_GO'}));
}
if(require.main===module)verifyC4DevReuse();
module.exports.verifyC4DevReuse=verifyC4DevReuse;
