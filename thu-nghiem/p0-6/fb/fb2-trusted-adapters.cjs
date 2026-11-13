'use strict';
/** Trusted bindings for F-B.2 ONLY for F-A accepted B21 preview.
 * No other lesson is implicitly trusted, regardless of JSON status.
 */
const {verify:verifyB20,evidence:b20Evidence}=require('./fb3-b20-independent-verifier.cjs');
const catalog=require('./fb2-lesson-catalog.candidate.json');
const {createGovernance,buildCandidate}=require('./fb-lesson-release-gate.cjs');
const {createMultiLessonRegistry}=require('./fb2-multi-lesson-registry.cjs');
const b21=catalog.lessons.find(x=>x.lessonId==='toan_b21');
if(!b21||b21.state!=='INHERITED_ACCEPTED_TEST_ONLY')throw Error('FB2_B21_SOURCE_UNAVAILABLE');
const gate=createGovernance({candidate:buildCandidate()});
const trusted=Object.freeze({INDEPENDENT_B20_F_B_3:Object.freeze({
 lessonId:'toan_b20',lessonVersion:'p0.6-fb-test-b20-v1',
 sourceRef:b20Evidence.sourceRef,rendererRef:b20Evidence.rendererRef,
 policyReviewRef:b20Evidence.policyReviewRef,qaEvidenceRef:b20Evidence.qaEvidenceRef,
 verify:verifyB20
}),INHERITED_B21_F_B_1:Object.freeze({
 lessonId:'toan_b21',lessonVersion:'p0.6-fb-test-b21-v1',
 sourceRef:'E03_COMPOSER_B21',rendererRef:'FA_G5_B21_ISOLATED_PREVIEW',
 policyReviewRef:'FA_OWNER_APPROVAL_G7_G8_20261113.md',
 qaEvidenceRef:'FA_G5_BROWSER_QA_20261113.md',
 verify:request=>gate.check(request)
})});
function createB21OnlyMultiLessonRegistry(){return createMultiLessonRegistry(catalog,trusted)}
module.exports={createB21OnlyMultiLessonRegistry,catalog,trusted};
