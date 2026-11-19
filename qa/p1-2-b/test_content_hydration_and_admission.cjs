#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='qa/p1-2-b/';
const read=p=>JSON.parse(fs.readFileSync(root+p,'utf8'));
const hydrate=read('P12B_C4_27_CONTENT_HYDRATION_REFS.review.v1.json');
const queue=read('P12B_B001_B004_79_SOURCE_ADMISSION_QUEUE.review.v1.json');
const originalPreview=read('P12B_ORIGINAL_VARIANT_PREVIEWS_32.review.v1.json');
const p11='6a05a042bd614f22450ec74e99f5e65aecee3399';
const layers=['B001','B002','B003','B004'].map(id=>JSON.parse(fs.readFileSync('du-lieu/bai-hoc/toan/v2/'+id+'.layered.json','utf8')));
const byId=new Map(layers.flatMap(x=>x.sourceLayer.items.map(q=>[q.originExerciseId,{q,layer:x}])));
const byPrivate=new Map(hydrate.records.map(r=>[r.sourceId,r]));
function errorCase(fn,label){assert.throws(fn,undefined,'negative guard '+label);}
function inspect(){
 assert.equal(queue.schemaVersion,'LOP2_P12B_B001_B004_SOURCE_ADMISSION_REVIEW_V1');
 assert.equal(hydrate.schemaVersion,'LOP2_P12B_C4_DEV27_CONTENT_HYDRATION_REF_V1');
 assert.equal(hydrate.referenceSource.privateWorkbookReadOnly,true);
 assert.equal(hydrate.counts.c4Items,27);
 assert.equal(hydrate.counts.parts,121);
 assert.deepEqual(hydrate.counts.partKinds,{
 INTEGER:87,CHOICE_SINGLE:17,MATCHING:5,CHOICE_MULTI:7,ORDERED_SEQUENCE:5
 });
 assert.equal(hydrate.counts.privateAnswerKeysExported,0);
 assert.equal(hydrate.counts.sourceIndependentSignoffs,0);
 assert.equal(hydrate.counts.studentPlayables,0);
 assert.equal(hydrate.records.length,27);
 assert.equal(byPrivate.size,27);
 assert.equal(queue.items.length,79);
 assert.equal(queue.stats.c1,79);
 assert.equal(queue.stats.devC4Matched,27);
 assert.equal(queue.stats.hydrationPending,52);
 assert.equal(queue.stats.g2TechnicalSeparate,12);
 assert.equal(queue.stats.existingTemplatesSeparate,3);
 assert.equal(queue.stats.sourceSigned,0);
 assert.equal(queue.stats.publicVariantApproved,0);
 assert.deepEqual(queue.lessons.map(x=>[x.lessonId,x.c1Candidates,x.c4DevHydrationReferences]),[
  ['MATH_B001',24,24],['MATH_B002',16,3],['MATH_B003',23,0],['MATH_B004',16,0]
 ]);
 assert.equal(new Set(queue.items.map(x=>x.originExerciseId)).size,79);
 assert.equal(new Set(hydrate.records.map(x=>x.sourceId)).size,27);
 let partTotal=0;let reuse=0,pending=0;
 for(const item of queue.items){
  const i=byId.get(item.originExerciseId);
  assert.ok(i,'missing preserved C1 candidate '+item.originExerciseId);
  assert.equal(item.lessonId,i.layer.lessonId);
  assert.equal(item.c1RegistryRow,i.q.source.c1RegistryRow);
  assert.equal(item.sourceCandidatePdfPage,i.q.source.pdfPageCandidate);
  assert.equal(item.sourceFileId,i.q.source.sourceFileIdRecorded);
  assert.equal(item.studentRelease,'NO_GO');
  assert.equal(item.publicVariant,null);
  assert.equal(item.rendererIdApproved,null);
  assert.equal(item.skillIdApproved,null);
  assert.equal(item.sourceIndependentSignoff,'PENDING');
  if(item.c4PrivateContentLocator){
   reuse++;
   const h=byPrivate.get(item.originExerciseId);assert.ok(h);
   assert.equal(item.c4PrivateContentLocator.row,h.c4PrivateRef.row);
   assert.equal(item.c4DevPartCount,h.devContent.partsCount);
   assert.equal(item.hydrationStatus,'C4_DEV_CONTENT_REFERENCE_AVAILABLE');
  } else {
   pending++;
   assert.equal(item.hydrationStatus,'C1_SOURCE_CANDIDATE_PROMPT_NOT_VERIFIED');
   assert.equal(item.c4DevPartCount,0);
   assert.equal(i.q.prompt,null,'no synthetic source prompt invented');
  }
 }
 assert.equal(reuse,27);assert.equal(pending,52);
 const policies=[];
 for(const h of hydrate.records){
  const found=byId.get(h.sourceId);
  assert.ok(found,'C4 record not in C1 '+h.sourceId);
  assert.equal(h.lessonId,found.layer.lessonId);
  assert.equal(h.c1SourceRegistryRow,found.q.source.c1RegistryRow);
  assert.equal(h.c4SourcePageEvidence.pdfPageCandidate,Number(found.q.source.pdfPageCandidate));
  assert.equal(h.c4SourcePageEvidence.sourceFileId,found.q.source.sourceFileIdRecorded);
  assert.equal(h.c4SourcePageEvidence.sourcePageIndependentSigned,false);
  assert.equal(h.sourceStatus,'C4_DEV_SOURCE_REFERENCE_NOT_INDEPENDENT_SGK_SIGNED');
  assert.equal(h.rendererGrant,'DENY');
  assert.equal(h.studentRelease,'NO_GO');
  assert.equal(h.publicVariant,null);
  assert.equal(h.devContent.parts.length,h.devContent.partsCount);
  assert.equal(h.figure.assetIdApproved,null);
  assert.equal(h.figure.sourceCropByteVerifiedInP12,false);
  assert.equal(h.score.answerMaterialOnGithub,false);
  assert.equal(h.score.trustedGASApproved,false);
  assert.ok(h.c4PrivateRef.row>=2&&h.c4PrivateRef.tab==='C4_REAL_JSON');
  for(const p of h.devContent.parts){
   assert.ok(typeof p.partId==='string'&&p.partId.length);
   assert.ok(['INTEGER','CHOICE_SINGLE','MATCHING','CHOICE_MULTI','ORDERED_SEQUENCE'].includes(p.kind));
   assert.equal(p.answerMaterialRemoved,true);
   assert.ok(!Object.hasOwn(p,'expected'));
  }
  partTotal+=h.devContent.partsCount;
  if(h.score.policyForP12==='NO_AUTO_GRADE_REQUIRED_FIX_C4_FLAG')policies.push(h.sourceId);
 }
 assert.equal(partTotal,121);
 assert.deepEqual(policies.sort(),['SGK_B001_L2_E01','SGK_B001_L2_E02']);
 assert.deepEqual(hydrate.knownPolicyConflicts.map(x=>x.id).sort(),policies);
 assert.equal(originalPreview.total,32);
 assert.ok(originalPreview.variants.every(x=>x.sourceExerciseId===null&&x.rendererGrant==='DENY'&&x.publicVariant===null));
 assert.equal(originalPreview.candidatePublicVariantGrants,0);
 const metadata=JSON.stringify(hydrate);
 assert.ok(!/"(?:expected|correctAnswer|answerKey|solution|gradingRubric)"\s*:/i.test(metadata));
 errorCase(()=>{const bad=structuredClone(queue);bad.stats.publicVariantApproved=1;assert.equal(bad.stats.publicVariantApproved,0)},'unauthorized student promotion');
 errorCase(()=>{const bad=structuredClone(hydrate);bad.records[0].score.answerMaterialOnGithub=true;assert.equal(bad.records[0].score.answerMaterialOnGithub,false)},'client answer export');
 errorCase(()=>{const bad=structuredClone(hydrate);bad.records[0].sourceStatus='INDEPENDENT_SIGNED';assert.equal(bad.records[0].sourceStatus,'C4_DEV_SOURCE_REFERENCE_NOT_INDEPENDENT_SGK_SIGNED')},'fake source approval');
 errorCase(()=>{const bad=structuredClone(hydrate);bad.records.find(x=>x.sourceId===policies[0]).score.policyForP12='AUTO_GRADE';assert.equal(bad.records.find(x=>x.sourceId===policies[0]).score.policyForP12,'NO_AUTO_GRADE_REQUIRED_FIX_C4_FLAG')},'estimate auto grade');
 console.log(JSON.stringify({test:'P12B_C4_PRIVATE_CONTENT_AND_ADMISSION',status:'PASS',lessons:4,c1:79,c4Dev:27,partSlots:121,pending:52,estimationConflicts:2,negativeCases:4,publicVariantApproved:0}));
}
if(require.main===module)inspect();
module.exports={inspect};
