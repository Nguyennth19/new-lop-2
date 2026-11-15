'use strict';
/* B4.1 owner-submitted evidence admission: verify exact uploaded JSON bytes.
 * NEVER turn a checked QA list into an electronic signature or curriculum approval.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const assert=require('node:assert/strict');
const evidencePath=path.join(__dirname,'evidence/owner-submitted-device-review.original.json');
const b=fs.readFileSync(evidencePath),source=JSON.parse(b);
const rec=require('./owner-attestation.record.v1.json');
const baseline=require('../g7-6-b4/checkpoint.g76b4.v1.json');
const policy=require('../g7-6-b4/owner-decisions.candidate.json');
let n=0;
function eq(a,b,m){assert.deepStrictEqual(a,b,m);n++}
function ok(a,m){assert.ok(a,m);n++}
function rejects(fn,m){assert.throws(fn,m);n++}
eq(crypto.createHash('sha256').update(b).digest('hex'),
 'd039fd3b4ef1aac636c4a57ded40e3a6fe11f29cb08169bde830fe8a13426527','uploaded original SHA256 integrity');
eq(b.length,1838,'uploaded source bytes intact');
eq(rec.evidence.sha256,crypto.createHash('sha256').update(b).digest('hex'));
eq(rec.schemaVersion,'g76b4.1.owner-evidence-admission.v1');
eq(rec.stage,'G7.6-B.4.1');
eq(rec.baselineB4.sha,'322015ee50d76fcbc067f9e4ee90ae471f3dd062');
eq(rec.baselineB4.priorQa,'1005_ASSERTIONS_PASS');
eq(source.schemaVersion,'g76b4.physical-device-manual-checklist.v1');
eq(source.project,'lop2');
eq(source.component,'G7.6-B.4');
eq(source.source,'ACTUAL_USER_TEST_ONLY_NOT_CI');
eq(source.evidenceStatus,'MANUAL_OBSERVATION_ONLY_NOT_OWNER_SIGNATURE');
eq(source.createdAt,'2026-11-15T13:43:46.701Z');
eq(rec.evidence.createdAt,source.createdAt);
eq(source.checkedCount,13);
eq(source.totalChecks,13);
eq(source.checks.length,13);
eq(source.notes,'');
const expected=[
'layout_no_overflow','text_clear','mental_keyboard','column_focus','choice_touch',
'tangram_labels','tangram_rotation','tangram_placement','chart_exact_count',
'chart_tap_count','chart_draft','no_answers','return_state'
];
eq(source.checks.map(x=>x.key),expected);
eq(new Set(source.checks.map(x=>x.key)).size,13);
ok(source.checks.every(x=>x.performedAndObservedPass===true),'13 reported observations true');
ok(source.checks.every(x=>Object.keys(x).sort().join(',')==='key,performedAndObservedPass'),'no hidden checklist extras');
eq(source.viewport.cssWidth,1536);
eq(source.viewport.cssHeight,791);
eq(source.deviceDescription,'NOT_PROVIDED');
ok(source.browserSummary.includes('Windows NT 10.0'),'Windows UA observed');
ok(source.browserSummary.includes('Chrome/157'),'Chrome browser observed');
eq(source.reviewerApproved,false);
eq(source.reviewerSignature,null);
eq(source.pedagogicalApproval,false);
eq(source.trustedGradingOpened,false);
eq(source.gasDeployed,false);
eq(source.studentDataCollected,false);
eq(rec.observedDevice.platformFromUserAgent,'Windows 10');
eq(rec.observedDevice.browserFromUserAgent,'Chrome 157');
eq(rec.observedDevice.viewportCss.width,1536);
eq(rec.observedDevice.viewportCss.height,791);
eq(rec.observedDevice.physicalAndroidEvidenceInUploadedJson,false);
eq(rec.observedDevice.physicalIPhoneEvidenceInUploadedJson,false);
eq(rec.observedDevice.explicitDeviceListSupplied,false);
eq(rec.evidence.validator.allObservedTrue,true);
eq(rec.evidence.validator.observedCount,13);
eq(rec.evidence.validator.sourceScope,source.evidenceStatus);
eq(rec.unchangedSourceFields.reviewerApproved,source.reviewerApproved);
eq(rec.unchangedSourceFields.reviewerSignature,source.reviewerSignature);
eq(rec.unchangedSourceFields.pedagogicalApproval,source.pedagogicalApproval);
eq(rec.decisions.humanVisualInteractionAttestation,'RECORDED_OWNER_CONFIRMED_IN_CHAT_NOT_CRYPTOGRAPHIC_SIGNATURE');
eq(rec.decisions.manualChecklist,'PASS_13_OF_13_BY_USER_REPORT');
eq(rec.decisions.androidIOSPhysicalDeviceValidation,'ADDITIONAL_EVIDENCE_NOT_SUBMITTED');
eq(rec.decisions.mentalRendererRegistration,'STILL_PENDING_SEPARATE_OWNER_CONTRACT_APPROVAL');
eq(rec.decisions.e04CurriculumPolicy,'STILL_BLOCKED_MISSING_SGK_LESSON_PAGE_AND_PEDAGOGICAL_SIGNOFF');
eq(rec.decisions.productionUse,'NOT_APPROVED');
eq(rec.userChatConfirmation.evidenceIsFormalSignedDocument,false);
eq(rec.userChatConfirmation.deviceModelOrPerPlatformProof,'NOT_IN_JSON');
eq(rec.releaseLocks.autoSignoff,false);
for(const [key,value] of Object.entries(rec.releaseLocks))eq(value,false,'protected lock '+key);
eq(baseline.gates.B4_6_OWNER_VISUAL,'PENDING_OWNER');
eq(baseline.gates.B4_7_PHYSICAL_DEVICE_TOUCH,'NOT_TESTED');
eq(baseline.gates.B4_9_MENTAL_RENDERER_REGISTRATION,'BLOCKED_OWNER_CONTRACT');
eq(baseline.gates.B4_10_E04_PEDAGOGY,'BLOCKED_SGK_SOURCE_OWNER');
eq(policy.status,'PREPARED_FOR_OWNER_SIGNOFF_NOT_APPROVED');
eq(policy.accountability.reviewer,null);
eq(policy.accountability.approvedAt,null);
eq(policy.accountability.signoffDocumentRef,null);
eq(policy.accountability.p06CurriculumApproval,'PENDING');
eq(policy.recommendations.mentalInput.manifestMutationAllowed,false);
eq(policy.recommendations.e04.actualCurriculumLessonId,null);
eq(policy.recommendations.e04.allowStudentUse,false);
eq(policy.recommendations.e04.allowTrustedGrading,false);
function normalize(source){
 assert.equal(source.checks.length,source.totalChecks);
 assert.ok(source.checks.every(x=>x.performedAndObservedPass===true));
 assert.equal(source.reviewerApproved,false);
 assert.equal(source.reviewerSignature,null);
 assert.equal(source.pedagogicalApproval,false);
 assert.equal(source.gasDeployed,false);
 assert.equal(source.trustedGradingOpened,false);
 return true;
}
eq(normalize(source),true);
rejects(()=>normalize({...source,reviewerApproved:true}),'cannot infer signature');
rejects(()=>normalize({...source,reviewerSignature:'invented'}),'cannot manufacture reviewer identity');
rejects(()=>normalize({...source,pedagogicalApproval:true}),'cannot approve E04');
rejects(()=>normalize({...source,gasDeployed:true}),'cannot deploy');
rejects(()=>normalize({...source,trustedGradingOpened:true}),'cannot enable D10 grading');
rejects(()=>normalize({...source,checks:source.checks.slice(1)}),'cannot drop a check');
rejects(()=>normalize({...source,checks:source.checks.map((c,i)=>i===0?{...c,performedAndObservedPass:false}:c)}),'cannot pretend every item passed');
console.log('G76B4_1_OWNER_CHECKLIST_EVIDENCE_ADMITTED_PASS',n,'assertions;',
 'original SHA256 exact; 13/13 user-reported checks;',
 'Windows Chrome 1536x791 identified; chat attestation recorded;',
 'Android/iOS detailed evidence not in JSON;',
 'owner formal signature + E04 curriculum + renderer registration remain locked');
