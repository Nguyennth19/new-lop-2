'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {auditVariant,decision}=require('./math-variant-validator-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const clone=x=>structuredClone(x);
const lesson=JSON.parse(fs.readFileSync(path.join(__dirname,'pilot/toan_b21.candidate.json'),'utf8'));
const policy=JSON.parse(fs.readFileSync(path.join(__dirname,'pilot/toan_b21.variant-policy.candidate.json'),'utf8'));
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
const candidate=(questionId='VAR_B21_E_001')=>({
 questionId,skillId:'ADD_CARRY_REVIEW',variantLevel:'V1_SURFACE',mathKind:'ADD',
 visual:{role:'NONE'},interaction:{from:'NUMBER_INPUT',to:'NUMBER_INPUT',
  skillsBefore:['ADD_CARRY_REVIEW'],skillsAfter:['ADD_CARRY_REVIEW'],difficultyDelta:'EQUIVALENT'},
 renderer:{kind:'math.mental',status:'READONLY_PREVIEW_PASS'},
 pedagogyApproval:{status:'PENDING'}
});
const audit=(v=candidate(),l=lesson,p=policy,context={})=>auditVariant(l,p,v,context);
test('Policy and B21 remain structural valid',()=>assert.equal(validateLesson(lesson).ok,true));
test('B21 source is scoped to B21 index, not primary-verified',()=>assert.equal(policy.sourceScopeStatus,'INDEX_VERIFIED'));
test('DRAFT policy cannot mark overall PASS',()=>{
 const r=audit();assert.equal(r.status,'BLOCKED');assert.equal(r.gates.G8.status,'PENDING');
 assert.equal(r.gates.G1.status,'PASS');assert.equal(r.gates.G5.code,'RENDERER_READONLY_ONLY');
});
test('All 9 gates G0 through G8 reported',()=>{
 const r=audit();assert.deepEqual(Object.keys(r.gates),Array.from({length:9},(_,i)=>'G'+i));
});
test('Both B21 arithmetic examples independently pass G1',()=>{
 for(const q of lesson.questions){const r=audit(candidate(q.id));assert.equal(r.gates.G1.status,'PASS',q.id);}
});
test('Wrong arithmetic answer fails independent math gate',()=>{
 const l=clone(lesson);l.questions[0].answerSpec.value=71;
 const r=audit(candidate(),l);assert.equal(r.gates.G1.status,'FAIL');assert.equal(r.status,'FAIL');
});
test('Tampered bound proof does not create fake pass',()=>{
 const l=clone(lesson);l.questions[0].answerSpec.proof.operands=[68,2];
 assert.equal(audit(candidate(),l).gates.G1.status,'FAIL');
});
test('No carry in B21 is rejected despite correct sum',()=>{
 const l=clone(lesson);const q=l.questions[0];q.parameters={a:64,b:3};q.answerSpec.value=67;q.answerSpec.proof.operands=[64,3];
 assert.equal(audit(candidate(),l).gates.G1.code,'MATH_CARRY_REQUIRED');
});
test('Out-of-range operand is rejected',()=>{
 const l=clone(lesson);const q=l.questions[0];q.parameters={a:97,b:7};q.answerSpec.value=104;q.answerSpec.proof.operands=[97,7];
 assert.equal(audit(candidate(),l).gates.G1.status,'FAIL');
});
test('Unapproved subtraction is out of scope even if arithmetically true',()=>{
 const v=candidate();v.mathKind='SUBTRACT';
 assert.equal(audit(v).gates.G1.status,'FAIL');
});
test('Skill outside lesson scope fails G0',()=>{
 const v=candidate();v.skillId='UNLEARNED_SUBTRACTION';
 assert.equal(audit(v).gates.G0.status,'FAIL');
});
test('Variant V3 always awaits expert review even with forged approved status',()=>{
 const v=candidate();v.variantLevel='V3_STRUCTURAL';v.pedagogyApproval={status:'APPROVED',evidenceRef:'fixture',reviewerRef:'fixture'};
 const r=audit(v);assert.equal(r.gates.G2.status,'PENDING');assert.equal(r.gates.G7.status,'PENDING');
});
test('Countable scene rejects 4 displayed against 3 expected',()=>{
 const v=candidate();v.visual={role:'COUNTABLE',expectedGroups:[3],actualGroups:[4],assetCountSafe:true,labelsVerified:true,assetEvidenceRef:'qa-fixture'};
 assert.equal(audit(v).gates.G3.code,'COUNT_GROUPS_MISMATCH');
});
test('Countable scene rejects unverified asset despite matching counts',()=>{
 const v=candidate();v.visual={role:'COUNTABLE',countOperation:'ADD',expectedGroups:[4,2],actualGroups:[4,2],assetCountSafe:false,labelsVerified:true,assetEvidenceRef:'qa-fixture'};
 assert.equal(audit(v).gates.G3.status,'BLOCKED');
});
test('Verified count scene can pass image gate',()=>{
 const v=candidate();v.visual={role:'COUNTABLE',countOperation:'ADD',expectedGroups:[4,2],actualGroups:[4,2],assetCountSafe:true,labelsVerified:true,assetEvidenceRef:'qa-fixture',renderQaEvidenceRef:'qa-count-verified'};
 const l=clone(lesson);l.questions[0].parameters={a:4,b:2,visualGroups:[4,2]};l.questions[0].answerSpec.value=6;l.questions[0].answerSpec.proof.operands=[4,2];
 assert.equal(audit(v,l).gates.G3.status,'PASS');
});
test('Complex geometry may not self-approve',()=>{
 const v=candidate();v.mathKind='GEOMETRY';v.visual={role:'GEOMETRY',topologyVerified:true};
 const r=audit(v);assert.equal(r.gates.G1.status,'PENDING');assert.equal(r.gates.G3.status,'PENDING');
});
test('A single true-false cannot replace all matching relationships',()=>{
 const v=candidate();v.variantLevel='V2_INTERACTION';v.interaction={from:'MATCH_PAIRS',to:'TRUE_FALSE',
  skillsBefore:['ADD_CARRY_REVIEW'],skillsAfter:['ADD_CARRY_REVIEW'],difficultyDelta:'EQUIVALENT',
  requiredRelationCount:5,assessedRelationCount:1,transformationEvidenceRef:'qa-fixture'};
 assert.equal(audit(v).gates.G4.status,'PENDING');
});
test('Equivalent full matching coverage is permitted by interaction gate',()=>{
 const v=candidate();v.variantLevel='V2_INTERACTION';v.interaction={from:'MATCH_PAIRS',to:'TRUE_FALSE',
  skillsBefore:['ADD_CARRY_REVIEW'],skillsAfter:['ADD_CARRY_REVIEW'],difficultyDelta:'EQUIVALENT',
  requiredRelationCount:5,assessedRelationCount:5,transformationEvidenceRef:'qa-fixture'};
 assert.equal(audit(v).gates.G4.status,'PASS');
});
test('Number-input to choice must be labeled simplified',()=>{
 const v=candidate();v.variantLevel='V2_INTERACTION';v.interaction.to='CHOICE';
 assert.equal(audit(v).gates.G4.status,'FAIL');
 v.interaction.difficultyDelta='SIMPLIFIED';assert.equal(audit(v).gates.G4.status,'BLOCKED');
 v.interaction.optionValues=[69,70,71];v.interaction.correctOptionValue=70;
 assert.equal(audit(v).gates.G4.status,'PASS');
});
test('Changing interaction to remove knowledge fails',()=>{
 const v=candidate();v.interaction.skillsAfter=['OTHER_SKILL'];
 assert.equal(audit(v).gates.G4.status,'FAIL');
});
test('Drawing to true-false cannot pass if drawing is assessed',()=>{
 const v=candidate();v.variantLevel='V2_INTERACTION';
 v.interaction.from='SVG_DRAW';v.interaction.to='TRUE_FALSE';
 assert.equal(audit(v).gates.G4.code,'INTERACTION_LOSES_REQUIRED_SKILL');
});
test('Renderer kind drift blocks G5',()=>{
 const v=candidate();v.renderer.kind='math.word';
 assert.equal(audit(v).gates.G5.status,'BLOCKED');
});
test('Renderer availability requires explicit QA evidence',()=>{
 const v=candidate();v.renderer.status='QA_INTERACTIVE_PASS';
 assert.equal(audit(v).gates.G5.status,'BLOCKED');
 v.renderer.qaEvidenceRef='fixture-renderer-qa';
 assert.equal(audit(v).gates.G5.status,'PASS');
});
test('Pedagogy cannot pass without reviewer reference',()=>{
 const v=candidate();v.pedagogyApproval={status:'APPROVED',evidenceRef:'review-note'};
 assert.equal(audit(v).gates.G7.status,'PENDING');
});
test('Even all candidate gates pass, draft owner policy still blocks full acceptance',()=>{
 const v=candidate();v.renderer={kind:'math.mental',status:'QA_INTERACTIVE_PASS',qaEvidenceRef:'fixture'};
 v.pedagogyApproval={status:'APPROVED',evidenceRef:'fixture',reviewerRef:'fixture'};
 const context={offlineOnly:true,noWrites:true,noStars:true,ciEvidenceRef:'fixture',rollbackRef:'fixture'};
 const r=audit(v,lesson,policy,context);
 assert.equal(r.gates.G7.status,'PASS');assert.equal(r.gates.G8.status,'PENDING');assert.equal(r.status,'PENDING_REVIEW');
});
test('If explicit policy approval and evidence exist, gate calculation can PASS_FOR_TEST',()=>{
 const v=candidate();v.renderer={kind:'math.mental',status:'QA_INTERACTIVE_PASS',qaEvidenceRef:'fixture'};
 v.pedagogyApproval={status:'APPROVED',evidenceRef:'fixture',reviewerRef:'fixture'};
 const p=clone(policy);p.status='APPROVED_FOR_TEST_POLICY';p.ownerApprovalRef='TEST_FIXTURE_ONLY';
 const r=audit(v,lesson,p,{offlineOnly:true,noWrites:true,noStars:true,ciEvidenceRef:'TEST_FIXTURE',rollbackRef:'TEST_FIXTURE'});
 assert.equal(r.status,'PASS_FOR_TEST');assert.equal(r.gates.G8.status,'PASS');
});
test('Countable visual cannot pass without binding to source facts',()=>{
 const v=candidate();v.visual={role:'COUNTABLE',countOperation:'ADD',expectedGroups:[67,3],actualGroups:[67,3],assetCountSafe:true,labelsVerified:true,assetEvidenceRef:'qa',renderQaEvidenceRef:'qa'};
 assert.equal(audit(v).gates.G3.code,'COUNT_NOT_BOUND_TO_QUESTION');
});
test('Countable visual exceeding scene capacity blocks unsafe render',()=>{
 const v=candidate();v.visual={role:'COUNTABLE',countOperation:'ADD',expectedGroups:[67,3],actualGroups:[67,3],assetCountSafe:true,labelsVerified:true,assetEvidenceRef:'qa',renderQaEvidenceRef:'qa'};
 const l=clone(lesson);l.questions[0].parameters.visualGroups=[67,3];
 assert.equal(audit(v,l).gates.G3.code,'COUNT_SCENE_TOO_LARGE');
});
test('Count and answer disagree even when assets appear verified',()=>{
 const v=candidate();v.visual={role:'COUNTABLE',countOperation:'ADD',expectedGroups:[4,2],actualGroups:[4,2],assetCountSafe:true,labelsVerified:true,assetEvidenceRef:'qa',renderQaEvidenceRef:'qa'};
 const l=clone(lesson);l.questions[0].parameters.visualGroups=[4,2];
 assert.equal(audit(v,l).gates.G3.code,'COUNT_MATH_DATA_MISMATCH');
});
test('Duplicate and missing distractors cannot pass choice gate',()=>{
 const v=candidate();v.variantLevel='V2_INTERACTION';v.interaction.to='CHOICE';v.interaction.difficultyDelta='SIMPLIFIED';
 v.interaction.optionValues=[70,70,71];v.interaction.correctOptionValue=70;
 assert.equal(audit(v).gates.G4.status,'BLOCKED');
 v.interaction.optionValues=[69,71,72];assert.equal(audit(v).gates.G4.status,'BLOCKED');
});
test('No absent owner approval can be bypassed by rollout context',()=>{
 const v=candidate();const p=clone(policy);p.status='APPROVED_FOR_TEST_POLICY';
 const r=audit(v,lesson,p,{offlineOnly:true,noWrites:true,noStars:true,ciEvidenceRef:'x',rollbackRef:'x'});
 assert.equal(r.gates.G8.status,'PENDING');
});
test('Fail, block, pending precedence',()=>{
 assert.equal(decision({x:{status:'PASS'},y:{status:'FAIL'}}),'FAIL');
 assert.equal(decision({x:{status:'BLOCKED'},y:{status:'PENDING'}}),'BLOCKED');
 assert.equal(decision({x:{status:'PENDING'}}),'PENDING_REVIEW');
});
test('B24 chain variant arithmetic 25+65-30=60 independently checked',()=>{
 const l=clone(lesson);l.lessonId='toan_b24';l.curriculum.lessonRef='MATH_B024';
 const q=l.questions[0];q.kind='math.chain';q.renderer.component='math.chain';
 q.parameters={a:25,b:65,c:30};q.answerSpec.value=60;
 q.answerSpec.proof={operation:'add_sub_chain',operands:[25,65,30]};
 const p=clone(policy);p.lessonId='toan_b24';p.allowedSkills=['REVIEW_ADD_SUB_CARRY'];
 p.allowedMathKinds=['ADD_SUB_CHAIN'];p.mathConstraints={minOperand:0,maxOperand:99,minResult:0,maxResult:100};
 const v=candidate();v.skillId='REVIEW_ADD_SUB_CARRY';v.mathKind='ADD_SUB_CHAIN';
 v.interaction.skillsBefore=['REVIEW_ADD_SUB_CARRY'];v.interaction.skillsAfter=['REVIEW_ADD_SUB_CARRY'];
 v.renderer={kind:'math.chain',status:'READONLY_PREVIEW_PASS'};
 const receipt=audit(v,l,p);assert.equal(receipt.gates.G1.status,'PASS');
 assert.notEqual(receipt.status,'PASS_FOR_TEST');
 q.answerSpec.value=61;assert.equal(audit(v,l,p).gates.G1.code,'MATH_ANSWER_MISMATCH');
});
test('B26 geometry topology never self-approved without dedicated QA',()=>{
 const l=clone(lesson);l.lessonId='toan_b26';l.curriculum.lessonRef='MATH_B026';
 const q=l.questions[0];q.kind='math.geometry';q.renderer.component='math.geometry';q.prompt='Chọn hình tứ giác';
 q.parameters={vertices:4,closed:true};q.answerSpec.value=4;
 const p=clone(policy);p.lessonId='toan_b26';p.allowedSkills=['GEOMETRY_IDENTIFY'];p.allowedMathKinds=['GEOMETRY'];
 const v=candidate();v.skillId='GEOMETRY_IDENTIFY';v.mathKind='GEOMETRY';v.variantLevel='V3_STRUCTURAL';
 v.visual={role:'GEOMETRY',topologyVerified:true};
 v.interaction.skillsBefore=['GEOMETRY_IDENTIFY'];v.interaction.skillsAfter=['GEOMETRY_IDENTIFY'];
 v.renderer={kind:'math.geometry',status:'READONLY_PREVIEW_PASS'};
 const receipt=audit(v,l,p);
 assert.equal(receipt.gates.G1.status,'PENDING');assert.equal(receipt.gates.G3.status,'PENDING');
 assert.equal(receipt.gates.G7.status,'PENDING');assert.notEqual(receipt.status,'PASS_FOR_TEST');
});
test('Receipts deterministic, source tampering changes hash',()=>{
 const first=audit(),second=audit();assert.equal(first.receiptSha256,second.receiptSha256);
 const l=clone(lesson);l.questions[0].prompt+='!';
 assert.notEqual(audit(candidate(),l).receiptSha256,first.receiptSha256);
});
test('Receipts contain no response or student identity',()=>{
 const r=audit();assert.equal(r.noWrites,true);assert.equal(r.noStars,true);
 assert.equal(r.studentDataIncluded,false);assert(!Object.hasOwn(r,'studentId'));
});
test('E01 validator does not call Apps Script, Sheets, or user APIs',()=>{
 const text=fs.readFileSync(path.join(__dirname,'math-variant-validator-v1.cjs'),'utf8');
 assert.doesNotMatch(text,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|localStorage\s*\.|fetch\s*\(/);
});
console.log(JSON.stringify({suite:'p0.6-e01-math-variant-policy',passed,failed:0,scope:'OFFLINE_ONLY',policyStatus:policy.status,noWrites:true,noStars:true}));
