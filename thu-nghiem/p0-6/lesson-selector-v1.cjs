'use strict';
/** P0.6-B.4: TEST-only fail-closed selection. Feature flag OFF by default.
 * Caller owns old renderer path. Never mutates the old raw data.
 */
const {validateLesson}=require('./validator-lesson-v1.cjs');
function selectLesson(lessonId,registry,adapters,options={}){
 const enabled=options.featureFlag===true;
 const canFallback=lessonId==='toan_b20'&&typeof options.legacyFallback==='function';
 const legacy=(reason)=> {
  if(!canFallback)return {ok:false,code:reason,mode:'BLOCKED'};
  try{
   const value=options.legacyFallback();
   if(!value||value.lesson_id!=='toan_b20')return {ok:false,code:'LEGACY_FALLBACK_INVALID',mode:'BLOCKED'};
   return {ok:true,mode:'LEGACY_B20',reason,data:value};
  }catch(_){return {ok:false,mode:'BLOCKED',code:'LEGACY_FALLBACK_FAILED'};}
 };
 if(!enabled)return canFallback?legacy('FEATURE_FLAG_OFF'):{ok:false,mode:'BLOCKED',code:'FEATURE_FLAG_OFF'};
 if(!registry||typeof registry.load!=='function')return legacy('REGISTRY_UNAVAILABLE');
 const got=registry.load(lessonId);if(!got.ok)return legacy(got.code||'REGISTRY_LOAD_FAILED');
 try{
  const adapted=got.format==='contract_v1'?got.data:
    got.format==='legacy_b20'&&adapters&&typeof adapters.legacy_b20==='function'?adapters.legacy_b20(got.data):null;
  if(!adapted)return legacy('ADAPTER_NOT_CONFIGURED');
  const validation=validateLesson(adapted);
  if(!validation.ok||adapted.lessonId!==lessonId)return legacy('CONTRACT_VALIDATION_FAILED');
  return {ok:true,mode:'CONTRACT_V1',data:adapted,lessonId,validation};
 }catch(_){return legacy('ADAPTER_FAILED');}
}
module.exports={selectLesson};
