'use strict';
const a=require('node:assert/strict'),f=require('node:fs'),p=require('node:path');
const g=x=>JSON.parse(f.readFileSync(p.join(__dirname,x),'utf8'));const source=g('source-item-review.v1.json'),lv=g('e04-lv1-lv2-review.v1.json'),ids=g('p06-lesson-skill-registration.candidate.v1.json'),cp=g('checkpoint.c082.v1.json');
const d5=g('approvals/D5.pedagogy.pending.v1.json'),d9=g('approvals/D9.pedagogy.pending.v1.json');
const c07=require('../g7-6-b6/mental-renderer-registration.candidate.v1.json');
const manifest=require('../../du-lieu/g7-6/resource-renderer-manifest.v1.json');
let n=0;const eq=(x,y)=>{a.deepEqual(x,y);n++},yes=x=>{a.ok(x);n++};
eq(source.legacyItems.length,13);eq(source.counts.legacySourceApproved,0);eq(source.legacyItems.filter(x=>x.legacyId.startsWith('SGK_B027')).length,6);eq(source.legacyItems.filter(x=>x.legacyId.startsWith('SGK_B065')).length,7);
eq(new Set(source.legacyItems.map(x=>x.legacyId)).size,13);
for(const x of source.legacyItems){eq(x.editorialDisposition,'REJECT_EXISTING_CONTENT_KEEP_QUARANTINED');eq(x.mappingStatus,'NO_SAFE_ONE_TO_ONE_MAPPING_LEGACY_ID_MUST_NOT_BE_REUSED');eq(x.ownerDecision,null);eq(x.approvedForE04,false);}
eq(source.independentSourceItems.length,13);eq(new Set(source.independentSourceItems.map(x=>x.sourceCandidateId)).size,13);
for(const x of source.independentSourceItems){eq(x.ownerApproved,false);eq(x.runtimeEnabled,false);eq(x.pdfPage,x.printedPage+1);}
eq(lv.lv1.length,13);eq(lv.lv2.length,13);eq(lv.ownerApproved,false);eq(lv.readyForRegistration,false);
yes(lv.lv1.some(x=>x.sourceCandidateId.endsWith('T02_A03')&&x.lessonId==='MATH_B065'&&x.decision==='EXCLUDED_AS_IS'));
yes(lv.lv2.some(x=>x.sourceCompatibility==='D9_UNIT_SCALE_NOT_SUPPORTED'&&x.usableAsIs===false));
for(const x of lv.lv2){eq(x.usableAsIs,false);eq(x.signedPedagogyApproval,null);eq(x.runtimeAllowed,false);}
for(const entry of ids.proposals){eq(entry.runtimeLessonIdVerifiedExisting,false);eq(entry.runtimeSkillIdVerifiedExisting,false);eq(entry.testPermission,false);eq(entry.ownerApprovalRef,null);eq(entry.policyE04ApprovalRef,null);yes(/^toan_b(27|65)$/.test(entry.proposedLessonId));yes(/^[A-Z][A-Z0-9_]+$/.test(entry.proposedSkillId));}
eq(ids.proposals.length,2);eq(ids.noAutoRegistration,true);eq(ids.existingToanB21MustNotBeModified,true);eq(ids.labLessonId,'toan_b999');
for(const x of [d5,d9]){eq(x.signature,null);eq(x.signedDecision,null);eq(x.grantedForTestRegistration,false);eq(x.grantedForApp,false);}
eq(c07.registrationContract.ownerDecision,null);eq(c07.registrationContract.approvalRecorded,false);eq(c07.officialManifestMustRemainUnchanged,true);eq(manifest.rendererRegistry.length,12);
yes(!manifest.rendererRegistry.some(x=>x.id==='MATH_MENTAL_NUMBER_INPUT_V1'));
eq(cp.c08.sourceRowsApproved,0);eq(cp.immutable.originalSheetEdited,false);eq(cp.immutable.p06CatalogEdited,false);eq(cp.immutable.manifestEdited,false);
eq(cp.immutable.studentData,false);eq(cp.immutable.scoring,false);eq(cp.immutable.stars,false);
console.log('G76B6_C082_SOURCE_E04_SKILL_REVIEW_PASS',n,'assertions; review only; C07/C08/C09 unsigned');
