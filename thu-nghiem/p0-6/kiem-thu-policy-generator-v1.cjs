'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {createVariantPolicyRegistry,hash}=require('./variant-policy-registry-v1.cjs');
const {createVariantGenerator}=require('./math-variant-generator-v1.cjs');
const {policyRegistry,catalog,templates,generator}=require('./policy-generator-fixtures-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const {auditVariant}=require('./math-variant-validator-v1.cjs');
const lessonPath=path.join(__dirname,'pilot/toan_b21.candidate.json');
const policyPath=path.join(__dirname,'pilot/toan_b21.variant-policy.candidate.json');
const rawLesson=fs.readFileSync(lessonPath,'utf8'),rawPolicy=fs.readFileSync(policyPath,'utf8');
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name);};
const req={lessonId:'toan_b21',templateId:'B21_CARRY_ADD_V1',
 seed:'regression-fixed',count:2,candidates:[[67,3],[48,7]]};
const fresh=()=>generator.generate(req);
test('B21 policy is SHA256-pinned to versioned file',()=>{
 const p=JSON.parse(rawPolicy);assert.equal(hash(p),catalog.toan_b21.expectedSha256);
 const r=policyRegistry.resolve('toan_b21');assert.equal(r.ok,true);assert.equal(r.canActivate,false);
});
test('Unknown lesson rejected fail-closed',()=>assert.equal(policyRegistry.resolve('toan_b24').code,'POLICY_NOT_REGISTERED'));
test('Wrong lesson policy cannot load',()=>{
 const r=createVariantPolicyRegistry(catalog,()=>({...JSON.parse(rawPolicy),lessonId:'toan_b24'}));
 assert.equal(r.resolve('toan_b21').code,'POLICY_LESSON_MISMATCH');
});
test('Policy mutation detected independently from saved checksum',()=>{
 const r=createVariantPolicyRegistry(catalog,()=>({...JSON.parse(rawPolicy),status:'APPROVED_FOR_TEST_POLICY',ownerApprovalRef:'fake'}));
 assert.equal(r.resolve('toan_b21').code,'POLICY_DIGEST_MISMATCH');
});
test('Loaded policies are immutable',()=>{
 const r=policyRegistry.resolve('toan_b21');assert(Object.isFrozen(r.policy));assert(Object.isFrozen(r.policy.mathConstraints));
});
test('Two B21 candidates generated with stable original-source boundary',()=>{
 const out=fresh();assert.equal(out.ok,true);assert.equal(out.status,'CANDIDATES_PENDING_APPROVAL');
 assert.equal(out.count,2);assert.deepEqual(out.results.map(x=>x.question.answerSpec.value),[70,55]);
 assert(out.results.every(x=>x.question.answerSpec.origin==='PROJECT_DERIVED'));
});
test('Generated IDs deterministic and collision-resistant on this fixture',()=>{
 const a=fresh(),b=fresh();assert.deepEqual(a.results.map(x=>x.question.id),b.results.map(x=>x.question.id));
 assert.notEqual(a.results[0].question.id,a.results[1].question.id);
});
test('Every output has G0-G8 and is never auto-approved',()=>{
 for(const out of fresh().results){
  assert.deepEqual(Object.keys(out.receipt.gates),Array.from({length:9},(_,i)=>'G'+i));
  assert.equal(out.receipt.gates.G0.status,'PASS');assert.equal(out.receipt.gates.G1.status,'PASS');
  assert.equal(out.receipt.gates.G4.status,'PASS');
  assert.equal(out.receipt.gates.G5.status,'BLOCKED');
  assert.equal(out.receipt.gates.G7.status,'PENDING');
  assert.equal(out.receipt.gates.G8.status,'PENDING');
  assert.notEqual(out.receipt.status,'PASS_FOR_TEST');
 }
});
test('Generated question can be independently reconstructed and validated',()=>{
 const out=fresh().results[0],base=JSON.parse(rawLesson);const q=out.question;
 base.questions=[q];base.sessions=[{id:q.sessionId,levelId:q.levelId,questionIds:[q.id]}];
 assert.equal(validateLesson(base).ok,true);
 assert.equal(auditVariant(base,policyRegistry.resolve('toan_b21').policy,out.variant).gates.G1.status,'PASS');
});
test('Choice transformation records simplified difficulty and credible options',()=>{
 const out=generator.generate({...req,count:1,interaction:'CHOICE'});
 assert.equal(out.ok,true);const v=out.results[0].variant;
 assert.equal(v.variantLevel,'V2_INTERACTION');assert.equal(v.interaction.difficultyDelta,'SIMPLIFIED');
 assert.deepEqual(v.interaction.optionValues,[69,70,71]);assert.equal(out.results[0].receipt.gates.G4.status,'PASS');
});
test('No carry in B21 rejected',()=>{
 const out=generator.generate({...req,count:1,candidates:[[64,3]]});
 assert.equal(out.ok,false);assert.equal(out.code,'VARIANT_SCOPE_OR_MATH_REJECTED');
});
test('Sum above 100 rejected',()=>{
 const out=generator.generate({...req,count:1,candidates:[[98,7]]});
 assert.equal(out.ok,false);assert.equal(out.code,'VARIANT_SCOPE_OR_MATH_REJECTED');
});
test('Unregistered skill and wrong template lesson are rejected',()=>{
 const modified={...templates.B21_CARRY_ADD_V1,skillId:'SUBTRACTION'};
 const g=createVariantGenerator(policyRegistry,{INVALID:modified});
 assert.equal(g.generate({...req,templateId:'INVALID',count:1}).code,'TEMPLATE_UNSUPPORTED_OR_NOT_SCOPED');
});
test('V3 template cannot be synthesized without expert review',()=>{
 const g=createVariantGenerator(policyRegistry,{V3:{...templates.B21_CARRY_ADD_V1,variantLevel:'V3_STRUCTURAL'}});
 assert.equal(g.generate({...req,templateId:'V3',count:1}).code,'TEMPLATE_UNSUPPORTED_OR_NOT_SCOPED');
});
test('No geometry/subtraction template can bypass B21 policy',()=>{
 const g=createVariantGenerator(policyRegistry,{OTHER:{...templates.B21_CARRY_ADD_V1,mathKind:'SUBTRACT'}});
 assert.equal(g.generate({...req,templateId:'OTHER',count:1}).code,'TEMPLATE_UNSUPPORTED_OR_NOT_SCOPED');
});
test('Unknown interaction fails closed',()=>{
 assert.equal(generator.generate({...req,interaction:'SVG_DRAW'}).code,'TEMPLATE_UNSUPPORTED_OR_NOT_SCOPED');
});
test('Invalid counts zero, negative and over 12 rejected',()=>{
 for(const n of [0,-1,13,1.5])assert.equal(generator.generate({...req,count:n}).code,'GENERATION_COUNT_OUT_OF_LIMIT');
});
test('Repeated candidate parameters rejected',()=>{
 assert.equal(generator.generate({...req,candidates:[[67,3],[67,3]]}).code,'CANDIDATE_DUPLICATED');
});
test('Candidate source pool must be bounded and sufficient',()=>{
 assert.equal(generator.generate({...req,candidates:[[67,3]]}).code,'CANDIDATE_POOL_INVALID');
});
test('Invalid numeric candidate never evaluated as JS or coerced',()=>{
 assert.equal(generator.generate({...req,count:1,candidates:[['67','3']]}).code,'CANDIDATE_OPERANDS_INVALID');
});
test('Generated question data never mutates template or source JSON files',()=>{
 const before=JSON.stringify(templates.B21_CARRY_ADD_V1.lessonSkeleton);
 fresh();assert.equal(JSON.stringify(templates.B21_CARRY_ADD_V1.lessonSkeleton),before);
 assert.equal(fs.readFileSync(lessonPath,'utf8'),rawLesson);
 assert.equal(fs.readFileSync(policyPath,'utf8'),rawPolicy);
});
test('QA receipt IDs and hashes deterministic without student data',()=>{
 const a=fresh().results[0].receipt,b=fresh().results[0].receipt;
 assert.equal(a.receiptSha256,b.receiptSha256);assert.match(a.receiptSha256,/^[a-f0-9]{64}$/);
 assert.equal(a.noWrites,true);assert.equal(a.noStars,true);
 assert.equal(a.studentDataIncluded,false);
});
test('Seeded AUTO generation uses permitted B21 scope without manual pair entry',()=>{
 const {candidates:ignored,...autoReq}=req;
 const out=generator.generate({...autoReq,seed:'AUTO_TEST'});
 assert.equal(out.ok,true);assert.equal(out.generationMode,'SEEDED_AUTO');assert.equal(out.count,2);
 for(const x of out.results){
  const a=x.question.parameters.a,b=x.question.parameters.b;
  assert(a>=10&&a<=99&&b>=1&&b<=99&&a+b<=100&&(a%10+b%10)>=10);
  assert.equal(x.receipt.gates.G1.status,'PASS');
 }
 const again=generator.generate({...autoReq,seed:'AUTO_TEST'});
 assert.deepEqual(out.results.map(x=>x.question.id),again.results.map(x=>x.question.id));
});
test('Different seed changes deterministic candidate selection',()=>{
 const {candidates:ignored,...autoReq}=req;
 const a=generator.generate({...autoReq,seed:'AUTO_ALPHA'});
 const b=generator.generate({...autoReq,seed:'AUTO_BETA'});
 assert.equal(a.ok,true);assert.equal(b.ok,true);
 assert.notDeepEqual(a.results.map(x=>x.question.id),b.results.map(x=>x.question.id));
});
test('Countable template cannot bypass missing image/Count-Safe QA',()=>{
 const g=createVariantGenerator(policyRegistry,{COUNT:{...templates.B21_CARRY_ADD_V1,requiredAssetRole:'COUNTABLE'}});
 assert.equal(g.generate({...req,templateId:'COUNT',count:1}).code,'VISUAL_ASSET_PLAN_REQUIRES_QA');
});
test('No hidden direct Sheets/AppScript/user persistence functions in new modules',()=>{
 for(const name of ['variant-policy-registry-v1.cjs','math-variant-generator-v1.cjs']){
  const s=fs.readFileSync(path.join(__dirname,name),'utf8');
  assert.doesNotMatch(s,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|localStorage\s*\.|fetch\s*\(/);
 }
});
console.log(JSON.stringify({suite:'p0.6-e02-policy-registry-generator',passed:count,failed:0,scope:'OFFLINE_ONLY',noWrites:true,noStars:true}));
