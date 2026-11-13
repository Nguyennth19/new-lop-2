/**
 * G7.4-B.5.5 multi-lesson, audited TEST-only visualIntent gate.
 * Pure integration wrapper; no HTTP, SpreadsheetApp, DOM, student writes or score logic.
 * Previous B5.4 single-lesson gate stays untouched as a rollback baseline.
 * Every lesson must pass registry eligibility AND an explicit per-lesson opt-in.
 */
var KLVisualIntentNhieuBaiTestV1=(function(){
'use strict';
const VERSION='kidlearn-visual-intent-multilesson-gate-v1';
const RELEASE='653bfbc73002a188dcea0b714247b84cc28a4fed';
const RULES='kidlearn-asset-semantic-rules-v1';
const ID=/^[a-z][a-z0-9_]{3,80}$/;
const SHA=/^[0-9a-f]{40}$/;
const clone=x=>JSON.parse(JSON.stringify(x));
function safe(pack,code,details){
 return {ok:true,active:false,code,pack:clone(pack),qa:{
  lessonId:pack.lesson_id,selected:0,rejected:0,originalPreserved:true,
  reason:details||null}};
}
function validateRegistry(registry){
 if(!registry||registry.schema_version!==VERSION||registry.mode!=='STAGING_ONLY'||
  registry.registryReleaseCommit!==RELEASE||registry.rulesVersion!==RULES||
  registry.enabled!==false||registry.ruleCount!==9||
  !Array.isArray(registry.lessons)||!registry.lessons.length||
  registry.lessons.length>8)return {ok:false,code:'REGISTRY_INVALID'};
 const seen=new Set(),approved=[];
 for(const l of registry.lessons){
  if(!l||typeof l.lessonId!=='string'||!ID.test(l.lessonId)||
    seen.has(l.lessonId)||!SHA.test(String(l.fixtureBlobSha||''))||
    l.enabled!==false||l.qaStatus!=='QA_PASS_CANDIDATE'||
    !Number.isInteger(l.expectedQuestions)||l.expectedQuestions<1||
    !Number.isInteger(l.expectedSelected)||!Number.isInteger(l.expectedRejected)||
    l.expectedSelected+l.expectedRejected!==l.expectedQuestions||
    typeof l.fixture!=='string'||!l.fixture.startsWith('du-lieu/bien-the/chuan/')||
    l.fixture.includes('..'))return {ok:false,code:'REGISTRY_LESSON_INVALID'};
  seen.add(l.lessonId);approved.push(l.lessonId);
 }
 return {ok:true,allowed:approved};
}
/**
 * runtimeSwitch is transient, never written into tracked JSON:
 * {enabled:true,lessonId:'...',fixtureBlobSha:'...',qaPassed:true}
 * fixture blob hash and per-lesson CI status must be independently verified by QA.
 */
function run(pack,registry,runtimeSwitch,deps){
 if(!pack||typeof pack!=='object'||Array.isArray(pack)||
  !Array.isArray(pack.questions)||typeof pack.lesson_id!=='string')
  return {ok:false,active:false,code:'INVALID_PACK'};
 if(!runtimeSwitch||runtimeSwitch.enabled!==true)return safe(pack,'FLAG_OFF');
 const valid=validateRegistry(registry);
 if(!valid.ok)return safe(pack,valid.code);
 const lesson=registry.lessons.find(l=>l.lessonId===pack.lesson_id);
 if(!lesson||runtimeSwitch.lessonId!==pack.lesson_id)return safe(pack,'LESSON_NOT_ALLOWLISTED');
 if(runtimeSwitch.qaPassed!==true)return safe(pack,'QA_NOT_PASSED');
 if(runtimeSwitch.fixtureBlobSha!==lesson.fixtureBlobSha)return safe(pack,'FIXTURE_SHA_MISMATCH');
 if(pack.mode!=='STAGING_DEMO_ONLY')return safe(pack,'PACK_NOT_STAGING');
 if(pack.questions.length!==lesson.expectedQuestions)return safe(pack,'QUESTION_COUNT_MISMATCH');
 if(!deps||!deps.projector||!deps.selector||!deps.compiledRules||
  typeof deps.projector.projectAndSelect!=='function'||
  typeof deps.selector.mergeQuestions!=='function')return safe(pack,'DEPENDENCIES_MISSING');
 const rules=deps.compiledRules;
 if(rules.schema_version!==RULES||rules.release_commit!==RELEASE||
  !Array.isArray(rules.rules)||rules.rules.length!==9)return safe(pack,'RULESET_INVALID');
 try{
  const original=JSON.stringify(pack);
  const enriched=deps.projector.projectAndSelect(pack,deps.manualSidecar||null,rules,deps.selector);
  const events=enriched&&enriched.assetScenes&&enriched.assetScenes.selectionDiagnostics;
  if(!Array.isArray(events)||events.length!==pack.questions.length)throw Error('DIAGNOSTICS_INVALID');
  const selected=events.filter(x=>x.result==='CURATED_AUTO').length;
  const rejected=events.length-selected;
  if(selected!==lesson.expectedSelected||rejected!==lesson.expectedRejected)throw Error('GOLDEN_COUNTS_CHANGED');
  const sceneIds=Object.keys(enriched.assetScenes.question_scenes||{});
  const allowedIds=new Set(pack.questions.map(q=>q.question_id||q.id));
  if(allowedIds.size!==pack.questions.length||sceneIds.some(x=>!allowedIds.has(x)))
    throw Error('SCENE_ID_INVALID');
  for(let i=0;i<pack.questions.length;i++){
   const source=pack.questions[i],result=enriched.questions[i];
   for(const [k,v] of Object.entries(source)){
    if(JSON.stringify(result[k])!==JSON.stringify(v))throw Error('ORIGINAL_FIELD_CHANGED');
   }
  }
  if(JSON.stringify(pack)!==original)throw Error('INPUT_MUTATED');
  return {ok:true,active:true,code:'STAGING_QA_ACTIVE',pack:enriched,qa:{
   lessonId:pack.lesson_id,selected,rejected,originalPreserved:true,
   rulesCount:rules.rules.length}};
 }catch(e){return safe(pack,'SAFE_FALLBACK',String(e&&e.message||e).slice(0,160));}
}
return Object.freeze({VERSION,validateRegistry,run});
})();
