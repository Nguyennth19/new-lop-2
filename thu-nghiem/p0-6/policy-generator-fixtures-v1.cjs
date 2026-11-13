'use strict';
/** P0.6-E02 static TEST fixture wiring. No user-provided filesystem paths. */
const fs=require('node:fs'),path=require('node:path');
const {createVariantPolicyRegistry}=require('./variant-policy-registry-v1.cjs');
const {createVariantGenerator}=require('./math-variant-generator-v1.cjs');
const base=__dirname;
const policyPath=path.join(base,'pilot/toan_b21.variant-policy.candidate.json');
const lessonPath=path.join(base,'pilot/toan_b21.candidate.json');
const catalog=Object.freeze({
 toan_b21:Object.freeze({
  lessonId:'toan_b21',subject:'toan',policyRef:'B21_POLICY_DRAFT_PINNED',
  expectedSha256:'fc0af7c369cc60761e2e6b3fba94128e327823fd00f6c99583473a02db43f64d'
 })
});
const policyRegistry=createVariantPolicyRegistry(catalog,(ref)=>{
 if(ref!=='B21_POLICY_DRAFT_PINNED')throw Error('REF_NOT_ALLOWED');
 return JSON.parse(fs.readFileSync(policyPath,'utf8'));
});
const skeleton=JSON.parse(fs.readFileSync(lessonPath,'utf8'));
const templates=Object.freeze({
 B21_CARRY_ADD_V1:Object.freeze({
  lessonId:'toan_b21',curriculumRef:'MATH_B021',
  skillId:'ADD_CARRY_REVIEW',mathKind:'ADD',variantLevel:'V1_SURFACE',
  sourceInteraction:'NUMBER_INPUT',rendererKind:'math.mental',lessonSkeleton:skeleton
 })
});
const generator=createVariantGenerator(policyRegistry,templates);
module.exports={catalog,policyRegistry,templates,generator};
