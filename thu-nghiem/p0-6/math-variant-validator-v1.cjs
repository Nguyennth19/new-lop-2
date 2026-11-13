'use strict';
/* P0.6-E.0.1 PURE Math Variant Policy Validator — TEST-only.
   No production release, no IO, no student data. Structural/symbolic checks
   cannot substitute for owner signoff, geometry review or browser QA. */
const crypto=require('node:crypto');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const {validateProof}=require('./grading-contract-v1.cjs');
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const nonempty=x=>typeof x==='string'&&!!x.trim();
const safe=Number.isSafeInteger;
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const STATES=new Set(['PASS','FAIL','BLOCKED','PENDING','NOT_APPLICABLE']);
const gate=(status,code)=>Object.freeze({status,code});
const interactions=Object.freeze({
 'NUMBER_INPUT>NUMBER_INPUT':'SAME',
 'MATCH_PAIRS>MATCH_PAIRS':'SAME',
 'MATCH_PAIRS>TRUE_FALSE':'CONDITIONAL',
 'MATCH_PAIRS>CHOICE':'CONDITIONAL',
 'NUMBER_INPUT>CHOICE':'SIMPLIFIED',
 'COUNT_INPUT>CHOICE':'CONDITIONAL',
 'COUNT_INPUT>TRUE_FALSE':'CONDITIONAL',
 'WORD_PROBLEM>NUMBER_INPUT':'LOSS_OF_MODELING',
 'MEASURE_READ>CHOICE':'LOSS_OF_MEASUREMENT',
 'SVG_DRAW>TRUE_FALSE':'LOSS_OF_DRAWING',
 'VISUAL_IDENTIFY>CHOICE':'CONDITIONAL',
 'VISUAL_IDENTIFY>TRUE_FALSE':'CONDITIONAL'
});
function mathAudit(q,policy,variant){
 const a=q.parameters?.a,b=q.parameters?.b,c=q.parameters?.c;
 const answer=q.answerSpec;
 const k=variant.mathKind;
 if(k==='GEOMETRY')return gate('PENDING','GEOMETRY_REQUIRES_TOPOLOGY_EXPERT_REVIEW');
 if(!['ADD','SUBTRACT','ADD_SUB_CHAIN'].includes(k))return gate('BLOCKED','MATH_OPERATION_UNSUPPORTED');
 if(!safe(a)||!safe(b)||!isObj(answer)||!safe(answer.value))
   return gate('BLOCKED','MATH_PARAMETERS_OR_ANSWER_MISSING');
 const params=[a,b,...(k==='ADD_SUB_CHAIN'?[c]:[])];
 if(params.some(v=>!safe(v)))return gate('BLOCKED','MATH_PARAMETERS_INVALID');
 let calc;
 if(k==='ADD')calc=a+b;
 if(k==='SUBTRACT')calc=a-b;
 if(k==='ADD_SUB_CHAIN')calc=a+b-c;
 if(!safe(calc)||calc!==answer.value)return gate('FAIL','MATH_ANSWER_MISMATCH');
 const constraints=policy.mathConstraints||{};
 if(params.some(v=>v<constraints.minOperand||v>constraints.maxOperand))return gate('FAIL','MATH_OPERAND_OUT_OF_SCOPE');
 if(safe(constraints.minResult)&&calc<constraints.minResult||safe(constraints.maxResult)&&calc>constraints.maxResult)
   return gate('FAIL','MATH_RESULT_OUT_OF_SCOPE');
 if(k==='ADD'&&constraints.requireCarry===true&&a%10+b%10<10)return gate('FAIL','MATH_CARRY_REQUIRED');
 if(k==='ADD'&&constraints.requireCarry===false&&a%10+b%10>=10)return gate('FAIL','MATH_CARRY_FORBIDDEN');
 if(k==='SUBTRACT'&&constraints.requireBorrow===true&&a%10>=b%10)return gate('FAIL','MATH_BORROW_REQUIRED');
 if(!Array.isArray(policy.allowedMathKinds)||!policy.allowedMathKinds.includes(k))return gate('FAIL','MATH_KIND_OUT_OF_SCOPE');
 if(k==='ADD_SUB_CHAIN'){
  const step=a+b;if(!safe(step)||step>constraints.maxResult||step<constraints.minResult)return gate('FAIL','MATH_INTERMEDIATE_OUT_OF_SCOPE');
  const p=answer.proof;
  if(!isObj(p)||p.operation!=='add_sub_chain'||JSON.stringify(p.operands)!==JSON.stringify([a,b,c]))
    return gate('BLOCKED','MATH_CHAIN_PROOF_NOT_BOUND');
 }else{
  if(!nonempty(q.kind)||!q.kind.startsWith('math.'))return gate('BLOCKED','MATH_RENDER_KIND_INVALID');
  const bound=validateProof(answer);
  if(bound.status!=='PASS')return gate(bound.status==='FAIL'?'FAIL':'BLOCKED',bound.code);
  const p=answer.proof;
  if(k==='ADD'&&(p.operation!=='add'||JSON.stringify(p.operands)!==JSON.stringify([a,b])))
    return gate('FAIL','MATH_PROOF_NOT_BOUND');
  if(k==='SUBTRACT'&&(p.operation!=='subtract'||JSON.stringify(p.operands)!==JSON.stringify([a,b])))
    return gate('FAIL','MATH_PROOF_NOT_BOUND');
 }
 return gate('PASS','ARITHMETIC_VERIFIED');
}
function visualAudit(variant,question){
 const v=variant.visual;
 if(!isObj(v)||!nonempty(v.role))return gate('BLOCKED','VISUAL_PLAN_MISSING');
 if(v.role==='NONE')return gate('NOT_APPLICABLE','NO_VISUAL_REQUIRED');
 if(v.role==='DECORATIVE')return v.semanticSafe===true?gate('PASS','DECORATIVE_SAFE'):gate('PENDING','DECORATIVE_SEMANTIC_PENDING');
 if(v.role==='COUNTABLE'){
  if(!Array.isArray(v.expectedGroups)||!Array.isArray(v.actualGroups)||
    v.expectedGroups.length===0||v.expectedGroups.length!==v.actualGroups.length)
    return gate('BLOCKED','COUNT_GROUPS_MISSING');
  if(!v.expectedGroups.every(safe)||!v.actualGroups.every(safe)||v.expectedGroups.some(x=>x<0)||v.actualGroups.some(x=>x<0))
    return gate('FAIL','COUNT_VALUES_INVALID');
  if(JSON.stringify(v.expectedGroups)!==JSON.stringify(v.actualGroups))
    return gate('FAIL','COUNT_GROUPS_MISMATCH');
  if(!question||!Array.isArray(question.parameters?.visualGroups)||
     JSON.stringify(question.parameters.visualGroups)!==JSON.stringify(v.expectedGroups))
    return gate('BLOCKED','COUNT_NOT_BOUND_TO_QUESTION');
  if(!nonempty(v.renderQaEvidenceRef))
    return gate('BLOCKED','COUNT_RENDER_EVIDENCE_MISSING');
  if(v.assetCountSafe!==true||v.labelsVerified!==true)return gate('BLOCKED','COUNT_ASSET_NOT_VERIFIED');
  if(!nonempty(v.assetEvidenceRef))return gate('BLOCKED','COUNT_ASSET_EVIDENCE_MISSING');
  return gate('PASS','COUNT_SAFE_VERIFIED');
 }
 if(['COMPARISON','MEASUREMENT','GEOMETRY'].includes(v.role)){
  if(v.role==='GEOMETRY')return gate('PENDING','GEOMETRY_EXPERT_REVIEW_REQUIRED');
  return v.measurementEvidenceRef&&v.relationshipVerified===true?
    gate('PASS','VISUAL_RELATION_VERIFIED'):gate('BLOCKED','VISUAL_RELATION_UNVERIFIED');
 }
 return gate('BLOCKED','VISUAL_ROLE_UNSUPPORTED');
}
function interactionAudit(v){
 const i=v.interaction||{},key=i.from+'>'+i.to,rule=interactions[key];
 if(!rule)return gate('BLOCKED','INTERACTION_TRANSFORM_NOT_REGISTERED');
 if(rule==='LOSS_OF_MODELING'||rule==='LOSS_OF_MEASUREMENT'||rule==='LOSS_OF_DRAWING')
   return gate('FAIL','INTERACTION_LOSES_REQUIRED_SKILL');
 if(!Array.isArray(i.skillsBefore)||!Array.isArray(i.skillsAfter)||i.skillsBefore.length===0||
    i.skillsBefore.some(s=>!i.skillsAfter.includes(s)))return gate('FAIL','INTERACTION_SKILL_COVERAGE_LOST');
 if(rule==='SIMPLIFIED'&&i.difficultyDelta!=='SIMPLIFIED')return gate('FAIL','INTERACTION_DIFFICULTY_MISLABELED');
 if(rule==='CONDITIONAL'){
  if(i.difficultyDelta==='DIFFERENT_SKILL')return gate('FAIL','INTERACTION_DIFFERENT_SKILL');
  if(!nonempty(i.transformationEvidenceRef)||!Number.isInteger(i.assessedRelationCount)||
     !Number.isInteger(i.requiredRelationCount)||i.assessedRelationCount<i.requiredRelationCount)
     return gate('PENDING','INTERACTION_EQUIVALENCE_UNPROVEN');
 }
 if(i.to==='CHOICE'){
  if(!Array.isArray(i.optionValues)||i.optionValues.length<3||
     new Set(i.optionValues.map(x=>JSON.stringify(x))).size!==i.optionValues.length||
     !Object.hasOwn(i,'correctOptionValue')||
     i.optionValues.filter(x=>JSON.stringify(x)===JSON.stringify(i.correctOptionValue)).length!==1)
   return gate('BLOCKED','CHOICE_OPTIONS_NOT_VERIFIED');
 }
 return gate('PASS','INTERACTION_COVERAGE_VERIFIED');
}
function decision(gates){
 const statuses=Object.values(gates).map(x=>x.status);
 return statuses.includes('FAIL')?'FAIL':statuses.includes('BLOCKED')?'BLOCKED':
  statuses.includes('PENDING')?'PENDING_REVIEW':'PASS_FOR_TEST';
}
function auditVariant(lesson,policy,variant,context={}){
 const gates={};
 const missing=gate('BLOCKED','CONTRACT_MISSING');
 if(!isObj(lesson)||!isObj(policy)||!isObj(variant)){
  for(let n=0;n<=8;n++)gates['G'+n]=missing;
  return {version:'p0.6-e01-variant-validator-v1',status:'BLOCKED',gates,noWrites:true,noStars:true};
 }
 const shape=validateLesson(lesson);
 const q=Array.isArray(lesson.questions)?lesson.questions.find(x=>x.id===variant.questionId):null;
 gates.G0=!shape.ok||lesson.subject!=='toan'||policy.lessonId!==lesson.lessonId||!q||!nonempty(variant.skillId)||
   !Array.isArray(policy.allowedSkills)?gate('BLOCKED','LESSON_SCOPE_INCOMPLETE'):
   !policy.allowedSkills.includes(variant.skillId)?gate('FAIL','SKILL_OUT_OF_SCOPE'):
   policy.sourceScopeStatus==='PENDING'?gate('PENDING','SOURCE_SCOPE_PENDING'):
   !['INDEX_VERIFIED','PRIMARY_VERIFIED'].includes(policy.sourceScopeStatus)?gate('BLOCKED','SOURCE_SCOPE_INVALID'):
   gate('PASS','CURRICULUM_SCOPE_CONFIRMED');
 gates.G1=!q||!isObj(policy.mathConstraints)?gate('BLOCKED','MATH_CONSTRAINTS_MISSING'):mathAudit(q,policy,variant);
 gates.G2=!['V1_SURFACE','V2_INTERACTION','V3_STRUCTURAL'].includes(variant.variantLevel)?
  gate('BLOCKED','VARIANT_LEVEL_INVALID'):
  variant.variantLevel==='V3_STRUCTURAL'?gate('PENDING','V3_EXPERT_REVIEW_REQUIRED'):
  variant.variantLevel==='V2_INTERACTION'&&!isObj(variant.interaction)?
   gate('BLOCKED','V2_INTERACTION_MAP_REQUIRED'):gate('PASS','VARIANT_LEVEL_CLASSIFIED');
 gates.G3=visualAudit(variant,q);
 gates.G4=interactionAudit(variant);
 const r=variant.renderer||{};
 gates.G5=!q||r.kind!==q.kind||q.renderer?.component!==q.kind?
  gate('BLOCKED','RENDERER_BINDING_INVALID'):r.status==='QA_INTERACTIVE_PASS'&&nonempty(r.qaEvidenceRef)?
  gate('PASS','RENDERER_QA_VERIFIED'):
  r.status==='READONLY_PREVIEW_PASS'?gate('BLOCKED','RENDERER_READONLY_ONLY'):
  gate('BLOCKED','RENDERER_NOT_VERIFIED');
 gates.G6=!q||!isObj(q.answerSpec)?gate('BLOCKED','ANSWER_MISSING'):
  q.answerSpec.origin!=='PROJECT_DERIVED'&&q.answerSpec.origin!=='SOURCE_PROVIDED'?gate('BLOCKED','ANSWER_ORIGIN_INVALID'):
  gates.G1.status==='PASS'?gate('PASS','ANSWER_PROOF_VALID'):
  gates.G1.status==='FAIL'?gate('FAIL','ANSWER_OR_MATH_INVALID'):gate('PENDING','ANSWER_PROOF_PENDING');
 const approval=variant.pedagogyApproval||{};
 gates.G7=approval.status==='REJECTED'?gate('FAIL','PEDAGOGY_REJECTED'):
  variant.variantLevel==='V3_STRUCTURAL'?gate('PENDING','V3_EXPERT_REVIEW_REQUIRED'):
  approval.status==='APPROVED'&&nonempty(approval.evidenceRef)&&nonempty(approval.reviewerRef)?
  gate('PASS','PEDAGOGY_REVIEW_EVIDENCED'):gate('PENDING','PEDAGOGY_SIGNOFF_PENDING');
 gates.G8=policy.status!=='APPROVED_FOR_TEST_POLICY'||!nonempty(policy.ownerApprovalRef)?
  gate('PENDING','POLICY_OWNER_SIGNOFF_PENDING'):
  context.offlineOnly!==true||context.noWrites!==true||context.noStars!==true||
  !nonempty(context.ciEvidenceRef)||!nonempty(context.rollbackRef)?
  gate('BLOCKED','TEST_RELEASE_EVIDENCE_MISSING'):gate('PASS','TEST_GOVERNANCE_COMPLETE');
 for(const x of Object.values(gates))if(!STATES.has(x.status))throw Error('INVALID_GATE_STATE');
 const status=decision(gates);
 const receipt={version:'p0.6-e01-variant-validator-v1',scope:'OFFLINE_ONLY',policyId:policy.policyId||null,
  policyStatus:policy.status,lessonId:lesson.lessonId,questionId:variant.questionId,
  sourceSha256:sha({lesson,policy,variant}),gates,status,
  noWrites:true,noStars:true,studentDataIncluded:false};
 receipt.receiptSha256=sha(receipt);
 return receipt;
}
module.exports={auditVariant,decision,visualAudit,interactionAudit,mathAudit};
