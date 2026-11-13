/**
 * G7.4-B.5.4 — opt-in visualIntent gate for variant pack generation.
 * No Sheet/DOM/UrlFetch, scoring, styles, renderer or original source writes.
 * Default disabled. A single allowed TEST lesson; fail-open to unchanged pack.
 * Shared selector and B5.3 projection module are injected, not duplicated.
 */
var KLBoSinhBienTheVisualIntentTestV1=(function(){
'use strict';
const API='kidlearn-variant-visual-intent-generator-gate-v1';
const PILOT_LESSON='tv_b03_visual_demo';
const RELEASE='653bfbc73002a188dcea0b714247b84cc28a4fed';
function copy(x){return JSON.parse(JSON.stringify(x));}
function baseline(pack,code,detail){
 return {ok:true,active:false,code,pack:copy(pack),diagnostics:{
  visualIntentEnabled:false,lessonId:pack&&pack.lesson_id||null,
  imageCount:0,rejectedCount:0,reason:detail||null}};
}
function run(pack,config,dependencies){
 if(!pack||typeof pack!=='object'||Array.isArray(pack)||!Array.isArray(pack.questions))
  return {ok:false,active:false,code:'INVALID_PACK'};
 // Explicit opt-in and exact lesson ID are both required. Never change a non-target pack.
 if(!config||config.enabled!==true)return baseline(pack,'FLAG_OFF');
 if(pack.lesson_id!==PILOT_LESSON)return baseline(pack,'LESSON_NOT_ALLOWLISTED');
 if(config.mode!=='STAGING_ONLY'||config.allowedLessonId!==PILOT_LESSON||
    config.registryReleaseCommit!==RELEASE||config.rulesVersion!=='kidlearn-asset-semantic-rules-v1')
   return baseline(pack,'GATE_CONFIGURATION_REJECTED');
 // Source status must remain demo-only; never bypass release gates.
 if(pack.mode!=='STAGING_DEMO_ONLY')return baseline(pack,'PACK_MODE_NOT_STAGING');
 if(!dependencies||!dependencies.projector||!dependencies.selector||!dependencies.compiledRules)
  return baseline(pack,'DEPENDENCIES_MISSING');
 if(typeof dependencies.projector.projectAndSelect!=='function'||
    typeof dependencies.selector.mergeQuestions!=='function')
  return baseline(pack,'DEPENDENCIES_INVALID');
 const compiled=dependencies.compiledRules;
 if(compiled.schema_version!=='kidlearn-asset-semantic-rules-v1'||
    compiled.release_commit!==RELEASE||!Array.isArray(compiled.rules)||compiled.rules.length!==9)
   return baseline(pack,'RULESET_INVALID');
 try{
  const selected=dependencies.projector.projectAndSelect(
    pack,dependencies.manualSidecar||null,compiled,dependencies.selector);
  if(!selected||!selected.assetScenes||!Array.isArray(selected.assetScenes.selectionDiagnostics)||
     selected.questions.length!==pack.questions.length)
    throw Error('OUTPUT_INVALID');
  const scenes=selected.assetScenes.question_scenes||{};
  const ids=new Set(pack.questions.map(q=>q.question_id||q.id));
  if(ids.size!==pack.questions.length||Object.keys(scenes).some(id=>!ids.has(id)))
    throw Error('OUTPUT_ID_MISMATCH');
  // Strong invariant: every original field on each question must remain intact;
  // selected output may only add visual intent metadata and sidecar scenes.
  pack.questions.forEach((q,i)=>{
   const next=selected.questions[i];
   for(const key of Object.keys(q))
    if(JSON.stringify(next[key])!==JSON.stringify(q[key]))throw Error('SOURCE_FIELD_CHANGED');
  });
  const counts=selected.assetScenes.selectionDiagnostics.reduce((a,row)=>{
   a[row.result==='CURATED_AUTO'?'accepted':'rejected']++;return a;
  },{accepted:0,rejected:0});
  return {ok:true,active:true,code:'VISUAL_INTENT_TEST_ACTIVE',pack:selected,
    diagnostics:{visualIntentEnabled:true,lessonId:pack.lesson_id,
      imageCount:counts.accepted,rejectedCount:counts.rejected,
      rulesCount:compiled.rules.length}};
 }catch(e){
  return baseline(pack,'SAFE_FALLBACK',String(e&&e.message||e).slice(0,150));
 }
}
return Object.freeze({API,PILOT_LESSON,run});
})();
