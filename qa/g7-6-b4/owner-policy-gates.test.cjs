'use strict';
/* B4 review policy is a governance recommendation, NEVER a signature or live registration. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {labels}=require('./tangram-review-wrapper.js');
const {policy}=require('../g7-6-b3/p06-e04-experimental-producer.cjs');
const candidate=require('./owner-decisions.candidate.json');
const data=require('../g7-6-b3/generated/public-samples.json');
let checks=0;
function eq(a,b,msg){assert.deepStrictEqual(a,b,msg);checks++}
function yes(x,msg){assert.ok(x,msg);checks++}
eq(candidate.schemaVersion,'g76b4.owner-policy-decision-pack.v1');
eq(candidate.status,'PREPARED_FOR_OWNER_SIGNOFF_NOT_APPROVED');
eq(candidate.sourcePins.g76b3Commit,'c3757227856f50e0e122407e0121c3e40e024728');
eq(candidate.sourcePins.p06Commit,'c0c5620f30edd92ab45d4ec87a8a07ffa38948e2');
eq(candidate.accountability.approvedAt,null);
eq(candidate.accountability.signoffDocumentRef,null);
eq(candidate.accountability.reviewer,null);
eq(candidate.accountability.physicalDeviceEvidenceRef,null);
eq(candidate.accountability.visualApproval,'PENDING');
eq(candidate.accountability.p06CurriculumApproval,'PENDING');
for(const value of Object.values(candidate.guardrails))eq(value,false,'strict write/release lock');
const mental=candidate.recommendations.mentalInput;
eq(mental.decision,'RECOMMEND_REGISTER_AS_AUXILIARY_MATH_MENTAL_INPUT_RENDERER');
eq(mental.registrationStatus,'PENDING_OWNER_AND_CONTRACT_REVIEW');
eq(mental.manifestMutationAllowed,false);
eq(mental.scope,'TEST_OPTIONAL_COMPONENT_NOT_D1_NOT_D4_NOT_NEW_13TH_FORM');
eq(mental.nativeTypeId,'MENTAL_INPUT_TEST_EXTENSION');
eq(mental.policyMapping,'P06_E03_math.mental_+_NUMBER_INPUT');
eq(mental.releaseReady,false);
const e04=candidate.recommendations.e04;
eq(e04.registrationStatus,'PEDAGOGY_PENDING_CURRICULUM_MAP');
eq(e04.actualCurriculumLessonId,null);
eq(e04.technicalLabLessonId,'toan_b999');
eq(e04.doNotAttachTo,'toan_b21');
eq(e04.families.length,2);
eq(e04.families[0].typeId,'D5');
eq(e04.families[1].typeId,'D9');
for(const family of e04.families){
 eq(family.grading,'DISABLED');
 eq(family.lv3,'NOT_SUPPORTED_BY_CURRENT_GENERATOR');
 eq(family.sourceEvidenceStatus,'MISSING_VERIFIED_SGK_BAI_TRANG');
 yes(family.sourceRequired.length>=3);
}
eq(e04.allowAutomaticLessonMigration,false);
eq(e04.allowStudentUse,false);
eq(e04.allowTrustedGrading,false);
eq(policy.lessonId,'toan_b999');
eq(policy.curriculumRef,null);
eq(policy.release.allowed,false);
eq(data.cases.length,14);
eq(data.coverage.p06ComposerCount,8);
eq(data.coverage.p06MentalNewTechnicalRenderer,6);
const sources=data.cases.filter(x=>x.typeId==='D5');
eq(sources.length,2);
for(const x of sources){
 const plan=x.nativePlan,copy=JSON.stringify(plan);
 const names=labels(plan);
 yes(names.ok,'native Tangram plan target enumerate');
 eq(names.items.length,3);
 eq(names.items.map(x=>x.caption),['Khung số 1','Khung số 2','Khung số 3']);
 eq(names.items.map(x=>x.aria),[
  'Đặt mảnh đang chọn vào khung số 1',
  'Đặt mảnh đang chọn vào khung số 2',
  'Đặt mảnh đang chọn vào khung số 3'
 ]);
 yes(names.items.every(x=>!x.caption.includes('target_')),'no internal key in child-facing UI');
 eq(JSON.stringify(plan),copy,'native geometry not mutated by labels projection');
}
const bad=labels({schemaVersion:'g74-geometry-tangram-v11',mode:'TANGRAM',
 targets:[{id:'target_roof'},{id:'target_roof'}]});
eq(bad.ok,false);
eq(bad.code,'INVALID_TANGRAM_TARGET_PLAN');
const bad2=labels({schemaVersion:'g74-geometry-tangram-v11',mode:'TANGRAM',
 targets:[{id:'<script>'}]});
eq(bad2.ok,false);
const bad3=labels({...sources[0].nativePlan,mode:'SHAPE_SELECT'});
eq(bad3.ok,false);
const tree=require('../g7-6-b3/mental-number-input.cjs');
yes(typeof tree.projectMental==='function');
for(const m of data.cases.filter(x=>x.typeId==='MENTAL_INPUT_TEST_EXTENSION')){
 eq(m.nativePlan.rendererRegistration,'PENDING_G76_MANIFEST_OWNER_APPROVAL');
 eq(m.nativePlan.gradingEnabled,false);
 eq(m.nativePlan.answerKeyIncluded,false);
 eq(m.nativePlan.releaseReady,false);
}
for(const field of ['ownerVisual','realPhysicalDevice','mentalRendererRegistration',
 'e04CurriculumMapping','p06E04Policy','appIntegration','gas','d10'])
 yes(!/^PASS|APPROVED/.test(candidate.gates[field]),'missing human approval remains blocked '+field);
const sourceJSON=JSON.stringify(data);
for(const forbidden of ['"answerSpec"','"correctOptionValue"','"teacherSolution"','"gradingKey"','"studentId"'])
 yes(!sourceJSON.includes(forbidden),'no private browser keys '+forbidden);
console.log('G76B4_POLICY_REVIEW_GATES_PASS',checks,'assertions',
 '2 Tangram plans labeled with non-answer numeric targets;',
 'mental registration recommended only; E04 curriculum and physical device blocked');
