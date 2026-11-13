'use strict';
/* G7.4-B.5.14-A — PURE visual-mode policy validation; no DOM, GAS, runtime activation. */
const MODES=Object.freeze(['EXACT_COUNT','REPRESENTATIVE','DECORATIVE']);
const blocked=(reason)=>({ok:false,status:'BLOCKED',reason});
function classifyQuestion(question){
 if(!question||typeof question!=='object')return blocked('INVALID_QUESTION');
 const type=question.type;
 if(type==='word')return {ok:true,visualMode:'REPRESENTATIVE',renderRequired:true,quantitySemantics:'NONE'};
 if(['carry','mental','vertical','three','reverse'].includes(type))
  return {ok:true,visualMode:'DECORATIVE',renderRequired:false,quantitySemantics:'NONE'};
 return blocked('UNSUPPORTED_QUESTION_TYPE');
}
function validateRequest(request,contracts){
 if(!request||!MODES.includes(request.visualMode))return blocked('INVALID_MODE');
 const mode=request.visualMode,asset=request.asset||null;
 if(mode==='DECORATIVE'){
  if(request.expectedVisualCount!=null || request.countedUnit!=null)return blocked('DECORATIVE_MUST_NOT_COUNT');
  return {ok:true,visualMode:mode,renderRequired:false,maxSymbols:1,quantitySemantics:'NONE'};
 }
 if(!asset||asset.semanticApproval!=='OWNER_SEMANTIC_APPROVED')return blocked('ASSET_SEMANTIC_NOT_APPROVED');
 if(mode==='REPRESENTATIVE'){
  if(request.expectedVisualCount!=null||request.countedUnit!=null||request.inferCountFromImage===true)
   return blocked('REPRESENTATIVE_MUST_NOT_COUNT');
  return {ok:true,visualMode:mode,renderRequired:true,maxSymbols:1,quantitySemantics:'NONE',assetId:asset.assetId};
 }
 if(request.visualIntent!=='DIRECT_VISUAL_COUNT')return blocked('EXPLICIT_COUNT_LEARNING_INTENT_REQUIRED');
 if(!Number.isSafeInteger(request.expectedVisualCount)||request.expectedVisualCount<1||request.expectedVisualCount>50)
  return blocked('INVALID_EXACT_COUNT_RANGE');
 if(!contracts||!Array.isArray(contracts.assets))return blocked('COUNT_CONTRACT_REQUIRED');
 const source=contracts.assets.find(x=>x.assetId===asset.assetId);
 if(!source||source.status!=='COUNT_SAFE_APPROVED'||source.objectsPerAsset!==1||
  source.sourceSha256!==asset.sourceSha256)return blocked('COUNT_SAFE_ASSET_REQUIRED');
 if(typeof request.countedUnit!=='string'||!source.countUnitAliases.includes(request.countedUnit))
  return blocked('COUNT_UNIT_MISMATCH');
 return {ok:true,visualMode:mode,renderRequired:true,quantitySemantics:'EXACT',expectedVisualCount:request.expectedVisualCount,assetId:asset.assetId,canonicalUnit:source.canonicalUnit};
}
function verifyB20Policy(policy,pack){
 if(!policy||policy.schemaVersion!=='g7-4-b5-14a-visual-mode-policy-v1'||!pack||pack.lesson_id!=='toan_b20')
  return blocked('INVALID_POLICY_OR_LESSON');
 const rows=policy.currentB20?.questionModes;
 if(!Array.isArray(rows)||rows.length!==pack.questions?.length)return blocked('COVERAGE_MISMATCH');
 const seen=new Set(),counts={EXACT_COUNT:0,REPRESENTATIVE:0,DECORATIVE:0};
 for(let i=0;i<pack.questions.length;i++){
  const q=pack.questions[i],mapped=rows[i],inferred=classifyQuestion(q);
  if(seen.has(q.question_id)||!inferred.ok||mapped.questionId!==q.question_id||
   mapped.sourceType!==q.type||mapped.visualMode!==inferred.visualMode||
   mapped.sessionId!==q.session_id||mapped.skillId!==q.skill_id||
   mapped.quantitySemantics!=='NONE'||mapped.countSafeRequired!==false||
   mapped.existingPromptPreserved!==true||mapped.existingAnswerPreserved!==true)
   return blocked('B20_POLICY_MISMATCH');
  seen.add(q.question_id);counts[mapped.visualMode]++;
 }
 if(counts.EXACT_COUNT!==0||counts.REPRESENTATIVE!==2||counts.DECORATIVE!==28)
  return blocked('B20_UNEXPECTED_MODE_COUNTS');
 if(policy.featureActivation!==false||policy.lessonMutation!==false||policy.invariants?.noRendererEdits!==true)
  return blocked('SIDE_EFFECT_NOT_ALLOWED');
 return {ok:true,status:'POLICY_CLASSIFIED_ONLY',counts,lessonId:'toan_b20'};
}
module.exports={MODES,classifyQuestion,validateRequest,verifyB20Policy};
