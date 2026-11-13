'use strict';
/** P0.6-E.0.2 deterministic, bounded candidate generation for Math.
 * All output is TEST-only CANDIDATE. Never upgrades pedagogy or renderer gates.
 * V3, geometry, unsupported interactions and unsigned policies fail closed.
 */
const {auditVariant}=require('./math-variant-validator-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const {hash}=require('./variant-policy-registry-v1.cjs');
const clone=x=>structuredClone(x);
const isInt=Number.isSafeInteger;
const fail=(code,extra={})=>({ok:false,status:'BLOCKED',code,...extra});
const APPROVED_KINDS=new Set(['ADD','SUBTRACT','ADD_SUB_CHAIN']);
function createVariantGenerator(registry,templates){
 if(!registry||typeof registry.resolve!=='function'||!templates||typeof templates!=='object')
  throw Error('GENERATOR_DEPENDENCIES_MISSING');
 function generate({lessonId,templateId,count=1,seed='TEST',interaction='NUMBER_INPUT',candidates}={}){
  if(!Number.isInteger(count)||count<1||count>12)return fail('GENERATION_COUNT_OUT_OF_LIMIT');
  if(typeof seed!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(seed))return fail('INVALID_SEED');
  const resolved=registry.resolve(lessonId);if(!resolved.ok)return fail(resolved.code);
  const policy=resolved.policy;
  const t=templates[templateId];
  if(!t||t.lessonId!==lessonId||!APPROVED_KINDS.has(t.mathKind)||t.variantLevel==='V3_STRUCTURAL'||
    t.skillId===undefined||!policy.allowedSkills.includes(t.skillId)||
    !policy.allowedMathKinds.includes(t.mathKind)||
    t.sourceInteraction!=='NUMBER_INPUT'||!['NUMBER_INPUT','CHOICE'].includes(interaction))
    return fail('TEMPLATE_UNSUPPORTED_OR_NOT_SCOPED');
  if(!Array.isArray(candidates)||candidates.length<count||candidates.length>32)return fail('CANDIDATE_POOL_INVALID');
  if(!t.lessonSkeleton||!Array.isArray(t.lessonSkeleton.questions)||!t.lessonSkeleton.questions.length)
    return fail('TEMPLATE_LESSON_INVALID');
  const seen=new Set(),results=[];
  for(const pair of candidates){
   if(results.length>=count)break;
   if(!Array.isArray(pair)||pair.length!==(t.mathKind==='ADD_SUB_CHAIN'?3:2)||!pair.every(isInt))
    return fail('CANDIDATE_OPERANDS_INVALID');
   const key=pair.join(',');
   if(seen.has(key))return fail('CANDIDATE_DUPLICATED');
   seen.add(key);
   const answer=t.mathKind==='ADD'?pair[0]+pair[1]:
     t.mathKind==='SUBTRACT'?pair[0]-pair[1]:pair[0]+pair[1]-pair[2];
   if(!isInt(answer))return fail('ANSWER_OVERFLOW');
   const unique=hash({lessonId,templateId,seed,pair}).slice(0,12);
   const qid='VAR_'+lessonId.toUpperCase()+'_G_'+unique;
   const lesson=clone(t.lessonSkeleton);
   lesson.lessonId=lessonId;
   lesson.curriculum.lessonRef=t.curriculumRef;
   lesson.contentVersion='p0.6-e02-test-candidate';
   const q=clone(lesson.questions[0]);
   q.id=qid;
   q.kind=t.rendererKind;
   q.renderer={component:t.rendererKind};
   q.levelId=lesson.levels[0].id;q.sessionId=lesson.sessions[0].id;
   q.parameters={a:pair[0],b:pair[1],...(pair.length===3?{c:pair[2]}:{})};
   q.prompt=t.mathKind==='ADD'?('Tính: '+pair[0]+' + '+pair[1]+' = ?'):
     t.mathKind==='SUBTRACT'?('Tính: '+pair[0]+' - '+pair[1]+' = ?'):
     ('Tính: '+pair[0]+' + '+pair[1]+' - '+pair[2]+' = ?');
   q.answerSpec={mode:'exact',origin:'PROJECT_DERIVED',value:answer,
     proof:{operation:t.mathKind==='ADD'?'add':t.mathKind==='SUBTRACT'?'subtract':'add_sub_chain',operands:[...pair]},
     verification:{type:'deterministic_rule',status:'PASS'},
     pedagogyApproval:{status:'PENDING'}};
   q.assets={sceneId:null,usage:'decorative'};
   lesson.questions=[q];lesson.sessions=[{id:q.sessionId,levelId:q.levelId,questionIds:[q.id]}];
   const variant={questionId:qid,skillId:t.skillId,variantLevel:interaction==='CHOICE'?'V2_INTERACTION':'V1_SURFACE',
     mathKind:t.mathKind,visual:{role:'NONE'},
     interaction:{from:'NUMBER_INPUT',to:interaction,skillsBefore:[t.skillId],skillsAfter:[t.skillId],
       difficultyDelta:interaction==='CHOICE'?'SIMPLIFIED':'EQUIVALENT',
       ...(interaction==='CHOICE'?{
         optionValues:[answer-1,answer,answer+1],correctOptionValue:answer
       }:{})},
     renderer:{kind:t.rendererKind,status:'READONLY_PREVIEW_PASS'},
     pedagogyApproval:{status:'PENDING'}};
   const contract=validateLesson(lesson);
   if(!contract.ok)return fail('GENERATED_LESSON_CONTRACT_INVALID');
   const receipt=auditVariant(lesson,policy,variant,{offlineOnly:true,noWrites:true,noStars:true});
   // Never emit a candidate with even one policy/math failure.
   if(['FAIL'].includes(receipt.status)||receipt.gates.G0.status!=='PASS'||
      receipt.gates.G1.status!=='PASS'||receipt.gates.G4.status!=='PASS')
     return fail('VARIANT_SCOPE_OR_MATH_REJECTED',{rejectedId:qid,
       rejectionCodes:Object.entries(receipt.gates).filter(([,g])=>g.status==='FAIL').map(([id,g])=>id+':'+g.code)});
   if(receipt.status==='PASS_FOR_TEST')return fail('UNEXPECTED_AUTOMATIC_APPROVAL');
   results.push({question:q,variant,receipt});
  }
  if(results.length!==count)return fail('GENERATION_COUNT_MISMATCH');
  return {ok:true,status:'CANDIDATES_PENDING_APPROVAL',lessonId,templateId,
    policySha256:resolved.policySha256,sourcePolicyStatus:policy.status,
    count:results.length,results,noWrites:true,noStars:true,scope:'OFFLINE_ONLY'};
 }
 return Object.freeze({generate});
}
module.exports={createVariantGenerator};
