'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {catalog,policyRegistry,manifest,skeleton,createDemo}=require('./composer-fixtures-v1.cjs');
const {composeLesson,validateManifest}=require('./math-lesson-composer-v1.cjs');
const {hash,createVariantPolicyRegistry}=require('./variant-policy-registry-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const {auditVariant}=require('./math-variant-validator-v1.cjs');
const copy=structuredClone;let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
const registryPolicy=()=>policyRegistry.resolve('toan_b21');
const call=(m=manifest)=>composeLesson(m,policyRegistry,skeleton);
test('Policy is pinned and remains unsigned draft',()=>{
 const r=registryPolicy();
 assert.equal(r.ok,true);assert.equal(r.policySha256,catalog.toan_b21.expectedSha256);
 assert.equal(r.policy.status,'DRAFT_OWNER_SIGNOFF_PENDING');assert.equal(r.canActivate,false);
});
test('Exactly two B21 subskills and three distinct families configured',()=>{
 assert.deepEqual(manifest.requiredSkills,['ADD_CARRY_2D_1D','ADD_CARRY_2D_2D']);
 assert.equal(manifest.families.length,3);assert.equal(new Set(manifest.families.map(f=>f.id)).size,3);
 assert.equal(validateManifest(manifest,registryPolicy().policy).ok,true);
});
test('Composer generates eight questions over LV1 LV2 LV3',()=>{
 const r=createDemo();assert.equal(r.ok,true);assert.equal(r.status,'COMPOSED_TECHNICAL_PASS_REVIEW_PENDING');
 assert.equal(r.lesson.questions.length,8);
 assert.deepEqual(r.lesson.levels.map(x=>x.id),['LV1','LV2','LV3']);
 assert.deepEqual(r.coverage.byLevel,{LV1:4,LV2:2,LV3:2});
});
test('Four sessions preserve exact quota, order and membership',()=>{
 const r=createDemo();
 assert.deepEqual(r.coverage.sessions.map(x=>x.id),['LV1-A','LV1-B','LV2-A','LV3-A']);
 assert.deepEqual(r.coverage.sessions.map(x=>x.count),[2,2,2,2]);
 assert.deepEqual(r.lesson.sessions.map(x=>x.questionIds.length),[2,2,2,2]);
 assert.equal(new Set(r.lesson.sessions.flatMap(x=>x.questionIds)).size,8);
});
test('All three family quotas and two skill coverages satisfied',()=>{
 const r=createDemo();
 assert.deepEqual(r.coverage.byFamily,{F_2D_1D:4,F_2D_2D:2,F_2D_2D_CHALLENGE:2});
 assert.deepEqual(r.coverage.bySkill,{ADD_CARRY_2D_1D:4,ADD_CARRY_2D_2D:4});
});
test('Different question renderer kinds coexist within one valid lesson',()=>{
 const r=createDemo();
 assert.deepEqual([...new Set(r.lesson.questions.map(q=>q.kind))].sort(),['math.mental','math.vertical']);
 assert.equal(validateLesson(r.lesson).ok,true);
});
test('Every generated operation carries, <=100, with exact answer and source proof',()=>{
 const r=createDemo();
 for(const q of r.lesson.questions){
  const {a,b}=q.parameters;
  assert(a>=10&&a<=99&&b>=1&&b<=99);
  assert(a+b<=100&&(a%10+b%10)>=10);
  assert.equal(q.answerSpec.value,a+b);
  assert.deepEqual(q.answerSpec.proof,{operation:'add',operands:[a,b]});
  assert.equal(q.answerSpec.origin,'PROJECT_DERIVED');
 }
});
test('Digit widths match each configured family',()=>{
 const r=createDemo(),fMap=new Map(manifest.families.map(f=>[f.id,f]));
 for(const record of r.report.qa.records){
  const f=fMap.get(record.familyId),q=r.lesson.questions.find(q=>q.id===record.questionId);
  assert(q.parameters.a>=f.ranges.a[0]&&q.parameters.a<=f.ranges.a[1]);
  assert(q.parameters.b>=f.ranges.b[0]&&q.parameters.b<=f.ranges.b[1]);
 }
});
test('Questions are pairwise unique across all sessions, not just individual family',()=>{
 const r=createDemo();
 assert.equal(new Set(r.lesson.questions.map(q=>q.id)).size,8);
 assert.equal(new Set(r.lesson.questions.map(q=>q.parameters.a+','+q.parameters.b)).size,8);
});
test('Result and receipt are deterministic for same manifest and source',()=>{
 const a=createDemo(),b=createDemo();
 assert.deepEqual(a.lesson,b.lesson);assert.equal(a.report.receiptSha256,b.report.receiptSha256);
});
test('Seed changes output and receipt without changing policy',()=>{
 const m=copy(manifest);m.seed='B21_MULTIFAMILY_DIFFERENT';
 const a=createDemo(),b=call(m);
 assert.equal(b.ok,true);assert.notDeepEqual(a.lesson.questions.map(q=>q.id),b.lesson.questions.map(q=>q.id));
 assert.notEqual(a.report.receiptSha256,b.report.receiptSha256);
});
test('All G0-G8 are rechecked after composition',()=>{
 const r=createDemo();
 for(const row of r.report.qa.records){
  assert.deepEqual(Object.keys(row.gateStatus),Array.from({length:9},(_,i)=>'G'+i));
  for(const id of ['G0','G1','G2','G4','G6'])assert.equal(row.gateStatus[id],'PASS');
  assert.equal(row.gateStatus.G3,'NOT_APPLICABLE');
  assert.equal(row.gateStatus.G5,'BLOCKED');
  assert.equal(row.gateStatus.G7,'PENDING');
  assert.equal(row.gateStatus.G8,'PENDING');
  assert.equal(row.status,'BLOCKED');
 }
});
test('No question or whole lesson is auto signed off',()=>{
 const r=createDemo();
 assert.equal(r.report.approval,'PENDING');
 assert(r.lesson.questions.every(q=>q.answerSpec.pedagogyApproval.status==='PENDING'));
 assert(r.lesson.levels.every(level=>manifest.levels.find(x=>x.id===level.id).pedagogyStatus==='PENDING'));
});
test('Missing entire skill fails coverage contract',()=>{
 const m=copy(manifest);m.requiredSkills.push('UNKNOWN_SKILL');
 assert.equal(call(m).code,'REQUIRED_SKILL_NOT_COVERABLE');
});
test('Quota mismatch fails before generation',()=>{
 const m=copy(manifest);m.familyQuotas.F_2D_1D=5;
 assert.equal(call(m).code,'COMPOSITION_FAMILY_QUOTA_MISMATCH');
});
test('Session count mismatch fails',()=>{
 const m=copy(manifest);m.totalQuestions=9;
 assert.equal(call(m).code,'COMPOSITION_TOTAL_MISMATCH');
});
test('Duplicate session IDs fail',()=>{
 const m=copy(manifest);m.sessions[1].id=m.sessions[0].id;
 assert.equal(call(m).code,'SESSION_DEFINITION_INVALID');
});
test('Unknown family reference fails',()=>{
 const m=copy(manifest);m.sessions[0].allocations[0].familyId='NO_SUCH_FAMILY';
 assert.equal(call(m).code,'SESSION_ALLOCATION_INVALID');
});
test('Unapproved LV3 or fake approval metadata cannot bypass pending',()=>{
 const m=copy(manifest);m.levels[2].pedagogyStatus='APPROVED';
 assert.equal(call(m).code,'LEVEL_PEDAGOGY_OR_DUPLICATE');
});
test('Changing math kind outside allowed family fails',()=>{
 const m=copy(manifest);m.families[0].mathKind='SUBTRACT';
 assert.equal(call(m).code,'FAMILY_UNSUPPORTED_OR_OUT_OF_SCOPE');
});
test('Unsupported image-bearing family fails closed until G7.4',()=>{
 const m=copy(manifest);m.families[0].requiredAssetRole='COUNTABLE';
 assert.equal(call(m).code,'FAMILY_UNSUPPORTED_OR_OUT_OF_SCOPE');
});
test('Tainted new policy or cross-lesson ref is refused',()=>{
 const p=copy(registryPolicy().policy);p.allowedMathKinds=['ADD','SUBTRACT'];
 const fake=createVariantPolicyRegistry(catalog,()=>p);
 assert.equal(call.bind(null,manifest) instanceof Function,true);
 assert.equal(composeLesson(manifest,fake,skeleton).code,'POLICY_DIGEST_MISMATCH');
});
test('Changing manifest to another lesson is refused by policy registry',()=>{
 const m=copy(manifest);m.lessonId='toan_b24';
 assert.equal(call(m).code,'POLICY_NOT_REGISTERED');
});
test('Invalid candidate LV family width cannot silently pass',()=>{
 const m=copy(manifest);m.families[0].ranges.a=[0,89];
 assert.equal(call(m).code,'FAMILY_RANGES_INVALID');
});
test('Payload is read only and contains no student data, stars or deploy access',()=>{
 const r=createDemo();assert.equal(r.noWrites,true);assert.equal(r.noStars,true);
 assert.equal(r.report.studentDataIncluded,false);
 assert.equal(r.scope,'OFFLINE_ONLY');
 assert.doesNotMatch(JSON.stringify(r.report),/studentId|studentName|userAnswer|token|password/);
});
test('Source B21 fixture and H1 B20 source remain byte-for-byte intact',()=>{
 const a=fs.readFileSync(path.join(__dirname,'pilot/toan_b21.candidate.json'));
 const b=fs.readFileSync(path.resolve(__dirname,'../bai-20-bien-the/runtime.json'));
 createDemo();
 assert.deepEqual(fs.readFileSync(path.join(__dirname,'pilot/toan_b21.candidate.json')),a);
 const sha=crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
 assert.equal(sha,'b14d556c5deeb561106e0c81f275387bef538842');
});
test('No Sheets Apps Script or network calls in composer',()=>{
 const s=fs.readFileSync(path.join(__dirname,'math-lesson-composer-v1.cjs'),'utf8');
 assert.doesNotMatch(s,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|localStorage\s*\.|fetch\s*\(/);
});
console.log(JSON.stringify({suite:'p0.6-e03-multi-family-composer',passed,failed:0,scope:'OFFLINE_ONLY',noWrites:true,noStars:true}));
