'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const gate=require('./readiness-gate-evaluator.cjs');
const d=require('./integration-go-no-go.matrix.v1.json');
const b=require('../g7-6-b5b/checkpoint.g76b5b.v1.json');
const p=require('../g7-6-b5b/policy.resource-tts-e2e.v1.json');
const a=require('../g7-6-b5a/auxiliary-renderer-overlay.v1.json');
const e=require('../g7-6-b5a/e04-curriculum-policy.draft.v1.json');
const m=require('../../du-lieu/g7-6/resource-renderer-manifest.v1.json');
const r=require('./evidence/G76B5A_Manual_Device_Review_NOT_APPROVED.original.json');
const local=path.resolve(__dirname,'evidence/G76B5A_Manual_Device_Review_NOT_APPROVED.original.json');
let count=0;
function eq(x,y,t){assert.deepStrictEqual(x,y,t);count++}
function ok(x,t){assert.ok(x,t);count++}
function deny(x,code){eq(x.ok,false);eq(x.code,code)}
eq(d.schemaVersion,'g76b5c.integration-readiness-gate-matrix.v1');
eq(d.date,'2026-11-16');
eq(d.baseline.sha,'98e4fe63cbfe1ab42dc4b16e8b8666ffc5b73fae');
eq(b.status,'PASS_TECHNICAL_14_CASE_PINNED_PRODUCER_RESOURCE_TTS_V2_E2E_OWNER_AUDIO_AND_CURRICULUM_PENDING');
eq(d.baseline.inheritedNodeAssertions,b.qa.totalNodeAssertions);
eq(b.qa.totalNodeAssertions,1602);
eq(d.baseline.ciConclusion,'success');
eq(d.baseline.ciRun,43734323444);
eq(d.baseline.sourceChecks[0],b.baseline.p06Sha);
eq(d.baseline.sourceChecks[1],b.baseline.g75V2Sha);
eq(d.bundledArchitecture.baseRendererCount,12);
eq(m.schemaVersion,'g76-resource-renderer-manifest.v1');
eq(m.renderers.length,12);
eq(d.bundledArchitecture.assets.registryMetadataCount,288);
eq(d.bundledArchitecture.assets.fluentStagingCount,46);
eq(a.doNotRewriteBase,true);
eq(a.auxiliaryRenderer.id,d.bundledArchitecture.mental.rendererId);
eq(a.auxiliaryRenderer.releaseReady,false);
eq(d.bundledArchitecture.mental.officialManifestRegistered,false);
eq(e.curriculumRef,null);
eq(e.skillId,null);
eq(e.lessonId,'toan_b999');
eq(e.releaseReady,false);
eq(d.bundledArchitecture.e04.approvedCurriculumRef,null);
eq(d.bundledArchitecture.e04.realCurriculumLessonId,null);
eq(d.bundledArchitecture.e04.releaseAllowed,false);
eq(p.coverage.total,14);
eq(p.coverage.all10FormTypes,false);
eq(b.qa.chrome.physicalDeviceAudio,false);
eq(b.speech.ownerAudibleSignoff,'PENDING');
eq(d.ownerEvidence.tts.status,'OWNER_CHAT_AUDIBLE_ACCEPTANCE_RECORDED');
eq(d.ownerEvidence.tts.formalSignedRecording,false);
eq(d.ownerEvidence.tts.deviceModel,'NOT_STATED');
eq(d.ownerEvidence.tangram.status,'USER_CONFIRMED_FUNCTIONAL_OK');
eq(d.ownerEvidence.tangram.sourceReviewerApproved,false);
eq(d.ownerEvidence.tangram.sourcePedagogicalApproval,false);
const bytes=fs.readFileSync(local);
eq(bytes.length,2017);
eq(crypto.createHash('sha256').update(bytes).digest('hex'),'91b1fb439db708e0d909e59bec5a311341618631e0ce61a664f476bd3fdf1fb0');
eq(r.schemaVersion,'g76b5a.physical-device-manual-checklist.v1');
eq(r.checkedCount,15);
eq(r.totalChecks,15);
eq(r.checks.length,15);
eq(new Set(r.checks.map(x=>x.key)).size,15);
ok(r.checks.every(x=>x.performedAndObservedPass===true));
ok(['tangram_exact_snap','tangram_drag_unplace'].every(key=>r.checks.find(x=>x.key===key)?.performedAndObservedPass));
eq(r.viewport.cssWidth,1536);
eq(r.viewport.cssHeight,791);
eq(r.deviceDescription,'NOT_PROVIDED');
ok(r.browserSummary.includes('Windows NT 10.0'));
ok(r.browserSummary.includes('Chrome/157'));
eq(r.reviewerApproved,false);
eq(r.reviewerSignature,null);
eq(r.pedagogicalApproval,false);
eq(r.gasDeployed,false);
eq(r.trustedGradingOpened,false);
eq(r.studentDataCollected,false);
eq(d.gates.length,19);
eq(new Set(d.gates.map(x=>x.id)).size,19);
const byId=Object.fromEntries(d.gates.map(x=>[x.id,x]));
for(const [id,status] of Object.entries({C07:'BLOCKED_OWNER_MANIFEST_DECISION',C08:'BLOCKED_SOURCE_AND_OWNER',
 C09:'NOT_READY_SIDECAR_ONLY',C10:'BLOCKED_PER_ASSET_QA',C11:'NOT_EVIDENCED_BY_14_CASE_B5B',
 C12:'NOT_STARTED_BY_DESIGN',C13:'BLOCKED_NO_TRUSTED_GRADER_SIGNOFF',
 C14:'DENIED_USER_SCOPE',C16:'PROHIBITED_THIS_STAGE',
 C17:'PROHIBITED_THIS_STAGE',C18:'PROHIBITED_THIS_STAGE'}))eq(byId[id].status,status,'must not elevate '+id);
for(const v of Object.values(d.executionRules))eq(v,true);
const outcome=gate.evaluate(d);
eq(outcome.ok,true);
eq(outcome.status,'GO_FOR_READ_ONLY_AUDIT_ONLY');
eq(outcome.scope.technicalPrep.go,true);
eq(outcome.scope.appIntegration.go,false);
eq(outcome.scope.liveRelease.go,false);
eq(outcome.scope.trustedD10.go,false);
eq(outcome.releaseAuthorized,false);
eq(outcome.runtimeMutationAllowed,false);
eq(outcome.e04PedagogyApproved,false);
eq(outcome.ownerMentalManifestApproved,false);
eq(outcome.physicalDeviceReceiptSigned,false);
ok(outcome.scope.appIntegration.blockers.includes('C07'));
ok(outcome.scope.liveRelease.blockers.includes('C08'));
ok(outcome.scope.liveRelease.blockers.includes('C13'));
eq(gate.evaluate(d,{readOnly:false}).scope.technicalPrep.go,false);
const forged=structuredClone(d);
forged.gates.find(x=>x.id==='C08').status='PASS';
forged.gates.find(x=>x.id==='C07').status='PASS';
eq(gate.evaluate(forged).scope.appIntegration.go,false);
eq(gate.evaluate(forged).scope.liveRelease.go,false);
const fakeAllowed=structuredClone(d);fakeAllowed.executionRules.disallowGAS=false;
deny(gate.evaluate(fakeAllowed),'POLICY_LOCK_DRIFT');
const missing=structuredClone(d);missing.gates.splice(0,1);
deny(gate.evaluate(missing),'INVALID_GATE_MATRIX');
const duplicate=structuredClone(d);duplicate.gates[0].id=duplicate.gates[1].id;
deny(gate.evaluate(duplicate),'INVALID_GATE_MATRIX');
const badSource=structuredClone(d);badSource.rollback.protectedRuntimeChanged=true;
deny(gate.evaluate(badSource),'POLICY_LOCK_DRIFT');
const dir=process.env.G76B5C_OUTPUT_DIR;
if(dir){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'GO_NO_GO_READ_ONLY_RECEIPT.json'),
 JSON.stringify({schemaVersion:'g76b5c.go-no-go-qa-receipt.v1',status:'PASS_READINESS_AUDIT_GO_READ_ONLY_NO_GO_RUNTIME',
 sourceBaseline:d.baseline.sha,ownerEvidenceHash:d.ownerEvidence.tangram.sha256,
 ownerVoiceUserConfirmed:true,noDeviceModelClaim:true,e04Approval:false,mentalManifestRegistration:false,
 b5cChecks:count,inheritedB5bChecks:1602,totalChecks:1602+count,outcome},null,2)+'\n');}
console.log('G76B5C_RELEASE_GO_NO_GO_GATES_PASS',count,'new assertions;',
 'GO read-only only; NO-GO app/MAIN/GAS/D10/student writes;',
 'B5A exact 15/15 original SHA verified; B5B owner audio accepted from chat, not formal signature');
