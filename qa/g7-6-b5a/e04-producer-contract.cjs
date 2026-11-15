'use strict';
/* G7.6-B.5-A E04 v1 contract for independent seeded laboratory producer.
 * Does not register a P0.6 E02/E03 generator, school lesson or trusted grade.
 */
const policy=require('./e04-curriculum-policy.draft.v1.json');
const overlay=require('./auxiliary-renderer-overlay.v1.json');
const {congruentAngle}=require('./tangram-placement-v12.js');
const hash=require('node:crypto').createHash;
function fail(code){return {ok:false,code,releaseReady:false}}
function resolvePublic(candidate,producer){
 if(!candidate?.ok||!candidate.receipt||!producer?.ok||
    !['D5_TANGRAM','D9_COMPARE_DIFFERENCE'].includes(candidate.receipt.mode))
  return fail('SOURCE_OR_MODE_REQUIRED');
 if(policy.curriculumRef!==null||policy.lessonId!=='toan_b999'||candidate.source?.lessonId!==policy.lessonId||
    candidate.receipt.curriculumRef!==null||candidate.receipt.gasAllowed!==false||
    candidate.receipt.gradingAllowed!==false||candidate.receipt.assetRuntimeAllowed!==false||
    candidate.receipt.nativeP06E02!==false||candidate.receipt.nativeP06E03!==false)
  return fail('CURRICULUM_RELEASE_BOUNDARY_DENIED');
 const mapped=producer.project(candidate);
 if(!mapped.ok)return fail('NATIVE_MAPPING_DENIED_'+mapped.code);
 const plan=mapped.nativeRenderer?.plan;
 if(candidate.receipt.mode==='D5_TANGRAM'){
  if(plan.mode!=='TANGRAM'||!Array.isArray(plan.items)||!Array.isArray(plan.targets)||
     plan.items.length!==3||plan.targets.length!==3)return fail('D5_GEOMETRY_INVALID');
  const refs=plan.items.map(piece=>plan.targets.map(t=>({
   targetId:t.id,angle:congruentAngle(piece.geometry,t.geometry)
  })).filter(x=>x.angle!==null));
  if(refs.some(x=>x.length!==1)||new Set(refs.map(x=>x[0].targetId)).size!==3)
   return fail('D5_VISIBLE_OUTLINE_NOT_UNIQUE');
  // Do NOT send a match table or canonical correct-state to student client.
 }else{
  if(plan.rows?.length!==2||plan.questions?.length!==1||
     plan.questions[0].type!=='COMPARE_DIFFERENCE')return fail('D9_COMPARE_CONTRACT_INVALID');
  const rows=plan.rows;
  if(rows.some(x=>!Number.isInteger(x.itemCount)||x.itemCount<1||x.itemCount>12)||
     rows[0].itemCount===rows[1].itemCount)return fail('D9_COUNT_CONTRACT_INVALID');
  const question=plan.questions[0];
  if(!['MORE_THAN','LESS_THAN'].includes(question.relation))return fail('D9_RELATION_INVALID');
  const first=rows.find(x=>x.id===question.rowId),second=rows.find(x=>x.id===question.otherRowId);
  if(!first||!second||first.id===second.id||
    (question.relation==='MORE_THAN'&&first.itemCount<=second.itemCount)||
    (question.relation==='LESS_THAN'&&first.itemCount>=second.itemCount))
   return fail('D9_RELATION_COUNT_INCONSISTENT');
 }
 const publicNative=structuredClone(plan);
 if(JSON.stringify(publicNative).match(/"(answerSpec|answerKey|correctTargetId|correctOption|teacherSolution|gradingKey)"/))
  return fail('SECRET_PUBLIC_FIELD_DENIED');
 return {ok:true,stage:'G7.6-B.5-A',typeId:mapped.nativeRenderer?.typeId||candidate.source.typeId,
  rendererId:candidate.receipt.mode==='D5_TANGRAM'?
   overlay.tangramPlacement.rendererId:'G7.4_PICTOGRAPH_V11',
  publicPlan:publicNative,
  receipt:{...candidate.receipt,sourceLabOnly:true,
   curriculumMapped:false,ownerPedagogySigned:false,
   rendererOverlayStatus:overlay.status},
  releaseReady:false,gradingEnabled:false,studentWritesAllowed:false};
}
function eligibleForActivation({sourceEvidence,ownerSignature,lessonId,skillId}={}){
 if(!sourceEvidence||!ownerSignature||!lessonId||!skillId)return fail('E04_LESSON_SOURCE_AND_SIGNATURE_REQUIRED');
 // No signed source registry exists in B5-A. Fail CLOSED even for caller-supplied strings.
 return fail('E04_APPROVED_CURRICULUM_REGISTRY_NOT_CONNECTED');
}
module.exports={policy,overlay,resolvePublic,eligibleForActivation};
