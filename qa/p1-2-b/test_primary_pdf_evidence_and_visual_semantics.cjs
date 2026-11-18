#!/usr/bin/env node
'use strict';
// Structural QA of the PRIMARY PDFs' already hashed analysis receipt.
// CI does not contain private SGK/VBT PDF bytes and MUST NOT claim to re-hash them.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='qa/p1-2-b/';
const read=p=>JSON.parse(fs.readFileSync(root+p,'utf8'));
const evidence=read('P12B_PRIMARY_PDF_HASH_AND_PAGE_79.review.v1.json');
const sem=read('P12B_52_SOURCE_SEMANTIC_REVIEW_CANDIDATES.review.v1.json');
const queue=read('P12B_B001_B004_79_SOURCE_ADMISSION_QUEUE.review.v1.json');
const layers=['B001','B002','B003','B004'].map(n=>JSON.parse(fs.readFileSync('du-lieu/bai-hoc/toan/v2/'+n+'.layered.json','utf8')));
const source=new Map(layers.flatMap(x=>x.sourceLayer.items.map(y=>[y.originExerciseId,y])));
const routes=new Set(JSON.parse(fs.readFileSync('qa/p1-2/P1_2_RENDERER_REFERENCE_12.v1.json','utf8')).referenceRoutes.map(x=>x.id));
function inspect(){
 assert.equal(evidence.checks.sourceRecords,79);
 assert.equal(evidence.checks.matchingOriginalPdfByteSha256,79);
 assert.equal(evidence.checks.sourceExactIndependentSignatures,0);
 assert.equal(evidence.checks.fullExerciseTextCopiesPublished,0);
 assert.equal(evidence.records.length,79);
 assert.equal(queue.items.length,79);
 assert.equal(sem.items.length,52);
 assert.equal(sem.counts.sourceSigned,0);
 assert.equal(sem.counts.publicVariants,0);
 assert.equal(new Set(evidence.records.map(x=>x.originExerciseId)).size,79);
 assert.equal(new Set(sem.items.map(x=>x.originExerciseId)).size,52);
 const eMap=new Map(evidence.records.map(x=>[x.originExerciseId,x]));
 const qMap=new Map(queue.items.map(x=>[x.originExerciseId,x]));
 const sgk=evidence.sources.SGK,vbt=evidence.sources.VBT;
 assert.equal(sgk.sha256,'cb8cb303294edc0be2f36a9507965b59345c0d53c296d610858e7454dfa8321e');
 assert.equal(vbt.sha256,'7c77820bb52a9f59b790180a16adc8231993768f59a16bb86084bb2f65f171cf');
 let validated=0;
 for(const [id,q] of source){
  const e=eMap.get(id),r=qMap.get(id);
  assert.ok(e&&r,'missing source pdf index '+id);
  const file=evidence.sources[q.source.track];
  assert.ok(file,'unrecognized source file '+id);
  assert.equal(e.driveFileId,file.fileId);
  assert.equal(e.sourcePdfSha256,file.sha256);
  assert.equal(q.source.sourceFileIdRecorded,file.fileId);
  assert.equal(q.source.sourceSHA256Recorded,file.sha256);
  assert.equal(e.pdfPage1Based,Number(q.source.pdfPageCandidate));
  assert.equal(e.printedPageFromVisualPageOffset,e.pdfPage1Based+file.printedPageOffset);
  assert.equal(e.recordedPdfHashMatchesActualBytes,true);
  assert.equal(e.pdfPageRenderedAndVisuallyInspected,true);
  assert.equal(e.textAndPartIndependentApproved,false);
  assert.equal(e.rendererGrant,false);
  assert.equal(e.studentRelease,false);
  assert.equal(r.sourceIndependentSignoff,'PENDING');
  validated++;
 }
 assert.equal(validated,79);
 const pending=new Set(queue.items.filter(x=>!x.c4PrivateContentLocator).map(x=>x.originExerciseId));
 assert.equal(pending.size,52);
 let suggestions=0,missing=0;
 for(const a of sem.items){
  assert.ok(pending.has(a.originExerciseId),'semantic candidate not pending source '+a.originExerciseId);
  const q=qMap.get(a.originExerciseId),e=eMap.get(a.originExerciseId);
  assert.equal(a.lessonId,q.lessonId);
  assert.equal(a.sourceTrack,q.sourceTrack);
  assert.equal(a.pdfPage1Based,e.pdfPage1Based);
  assert.equal(a.sourceTextExact,'NOT_CHECKED');
  assert.equal(a.sourcePartStructure,'NOT_CHECKED');
  assert.equal(a.sourceIndependentSignoff,'PENDING');
  assert.equal(a.rendererGrant,'DENY');
  assert.equal(a.publicVariant,null);
  assert.equal(a.studentRelease,'NO_GO');
  assert.equal(a.visualReviewer,'AI_VISUAL_PAGE_SCOPE_NOT_INDEPENDENT_SIGNOFF');
  if(a.rendererRouteCandidate){
   suggestions++;assert.ok(routes.has(a.rendererRouteCandidate));
   assert.equal(a.rendererRouteExistsOnly,true);
  }else{missing++;assert.equal(a.rendererRouteExistsOnly,false);}
 }
 assert.equal(suggestions,31);assert.equal(missing,21);
 assert.equal(sem.counts.rendererRouteSuggested,31);
 assert.equal(sem.counts.unresolvedRendererNull,21);
 console.log(JSON.stringify({test:'P12B_PRIMARY_PDF_AND_52_VISUAL_SEMANTICS',status:'PASS',
  sourcePdfFileIDAndRecordedShaVerified:79,uniqueSourceIds:79,semanticCandidates:52,
  rendererSuggestionsNotGrants:31,rendererUnresolved:21,sourceItemSigned:0,studentRelease:'NO_GO'}));
}
if(require.main===module)inspect();
module.exports={inspect};
