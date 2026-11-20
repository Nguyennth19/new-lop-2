'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const impl=require('./governed-intake.cjs');
const core=require('../universal-template-v13/publisher-core.cjs');
const original=require('./SHEET_TEST_READ_RECEIPT_20261120.json');
let checks=0;
const eq=(a,b,label)=>{assert.deepStrictEqual(a,b,label);checks++};
const ok=(x,label)=>{assert(x,label);checks++};
const clone=x=>JSON.parse(JSON.stringify(x));
const baseline=impl.validateReceipt(original);
eq(baseline.ok,true);eq(baseline.requests.length,2);
eq(baseline.catalog.size,3);eq(baseline.livePollingEnabled,false);
eq(baseline.sourceSpreadsheetId,original.source.spreadsheetId);
const run=impl.processReceipt();
eq(run.ok,true);eq(run.candidates.length,2);
eq(run.audit.length,2);eq(run.denied.length,0);
eq(run.externalWrites,0);eq(run.actualReleaseManifestUpdated,false);
eq(run.ownerSignaturesVerified,false);
eq(run.activePointerAfter,run.activePointerBefore);
let total=0;
for(const o of run.candidates){
 total+=o.qa.questionCount;
 eq(o.qa.schema,'PASS');eq(o.qa.math,'PASS');eq(o.qa.privacy,'PASS');
 eq(o.qa.renderer,'PASS');eq(o.qa.source,'SYNTHETIC_QA_ONLY');
 eq(o.qa.decision,'PENDING_INDEPENDENT_REVIEW');
 eq(o.plan.reviewGate.state,'PENDING_OWNER_APPROVAL');
 eq(o.plan.allowedToWriteActual,false);
 eq(o.plan.studentReleaseAllowed,false);
 eq(o.plan.writeOperations,0);
 eq(o.publicPack.lesson.studentRelease,false);
 eq(o.publicPack.questions.length,20);
 ok(o.publicPack.questions.every(q=>q.lessonId===o.publicPack.lesson.id));
 ok(o.publicPack.questions.every(q=>q.rendererId==='D2'&&q.skillId==='COLUMN_ADD'));
 ok(!/\"answerKey\"|\"solution\"|\"correctAnswer\"/.test(JSON.stringify(o.publicPack)));
}
eq(total,40);
const change=(mutator,code)=>{
 const s=clone(original);mutator(s);eq(impl.validateReceipt(s).reason,code,code);
};
change(s=>s.source.spreadsheetId='1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8','UNTRUSTED_SHEET_OR_RECEIPT');
change(s=>s.source.valueRenderOption='FORMATTED_VALUE','UNTRUSTED_SHEET_OR_RECEIPT');
change(s=>s.ownerApprovalGranted=true,'UNTRUSTED_SHEET_OR_RECEIPT');
change(s=>s.tabNames.push('SNEAKY_TAB'),'SHEET_TABS_NOT_CONTRACT_PARITY');
change(s=>s.controls[0][2]='INVALID_LEVEL','SHEET_HEADER_DRIFT');
change(s=>s.catalog[0][0]='FAKE_ID','SHEET_HEADER_DRIFT');
change(s=>s.controls[1][0]=s.controls[2][0],'DUPLICATE_REQUEST_ID');
change(s=>s.controls[1][11]='=IMPORTXML("evil","x")','FORMULA_OR_CELL_VALUE_REJECTED');
change(s=>s.catalog[1][7]='TRUE','CANNOT_IMPORT_RELEASE_ELIGIBLE_SOURCE');
change(s=>s.catalog[1][5]='STUDENT_PLAYABLE','SOURCE_STATUS_CONFLICT');
change(s=>s.controls[1][1]='MATH_NOT_IN_CATALOG','LESSON_NOT_IN_TEST_CATALOG');
let tamper=clone(original);
tamper.controls[1][4]='WORD_PROBLEM';
const denied=impl.processReceipt(tamper);
eq(denied.ok,true);eq(denied.denied.length,1);
eq(denied.candidates.length,1);eq(denied.denied[0].reason,'GENERATOR_OR_RENDERER_NOT_APPROVED_IN_LAB');
tamper=clone(original);
tamper.controls.push(['B020_DRY_BLOCK','MATH_B020','LV2','D2','COLUMN_ADD','20',
 'DETERMINISTIC','D2_PV100_ADD_WITH_CARRY_V1','DECORATIVE','',
 'STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE','QA_TEST_OPERATOR','REQUESTED']);
const sourceDenied=impl.processReceipt(tamper);
eq(sourceDenied.ok,true);eq(sourceDenied.candidates.length,2);
eq(sourceDenied.denied.length,1);
eq(sourceDenied.denied[0].reason,'REAL_OR_UNAPPROVED_LESSON_NOT_IN_TEST_INTAKE');
const artificialAI={requestId:'LAB_PILOT_A',state:'AI_CANDIDATE_ONLY',questions:run.candidates[0].publicPack.questions};
eq(impl.acceptAIProposal(baseline.requests[0],artificialAI).reason,'AI_MODE_NOT_AUTHORIZED_BY_REQUEST');
const aiApproved={...artificialAI,approved:true};
eq(impl.acceptAIProposal(baseline.requests[0],aiApproved).ok,false);
const malicious=clone(original);malicious.controls[1][0]='../../escape';
const out=impl.processReceipt(malicious);
eq(out.denied.length,1);eq(out.candidates.length,1);
const emitted=JSON.parse(fs.readFileSync(path.join(__dirname,'dist/LIVE_TEST_SHEET_INTAKE_EVIDENCE.json'),'utf8'));
eq(emitted.candidates.length,2);eq(emitted.publishAuthorized,false);
eq(emitted.externalWrites,0);eq(emitted.ownerSignaturesVerified,false);
eq(emitted.activePointerBefore,emitted.activePointerAfter);
for(const x of emitted.candidates){
 ok(x.stageUri.startsWith('staging://ULT_V13/'));
 eq(x.releaseGate,'PENDING_OWNER_APPROVAL');
}
console.log('ULT_V13B_GOVERNED_TEST_INTAKE_CONTRACT_PASS',checks,
 'assertions, 2 live-captured requests, 40 questions, all real releases blocked');
