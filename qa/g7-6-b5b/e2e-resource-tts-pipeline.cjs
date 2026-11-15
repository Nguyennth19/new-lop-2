'use strict';
/* G7.6-B.5-B QA-only composition from already whitelisted P0.6 / E04 public plans.
 * No browser TTS, downloads, GAS, private key, grading, or student IO.
 */
const fs=require('node:fs'),path=require('node:path');
const policy=require('./policy.resource-tts-e2e.v1.json');
const manifest=require('../g7-6/resource-renderer-resolver.cjs');
const overlay=require('../g7-6-b5a/auxiliary-renderer-overlay.v1.json');
const geom=require('../g7-6-b5a/tangram-placement-v12.js');
const repo=path.resolve(__dirname,'../..');
const read=relative=>JSON.parse(fs.readFileSync(path.join(repo,relative),'utf8'));
const defaultManifest=read('du-lieu/g7-6/resource-renderer-manifest.v1.json');
const assetRegistry=read('du-lieu/asset-selector/asset-registry-288.v1.json');
const semanticRules=read('du-lieu/asset-selector/semantic-rules.v1.json');
const fluent=read('hinh-anh/svg-fallback/fluent-emoji-flat/v1/manifest.v1.json');
const STRICT_FORBIDDEN=/\"(?:answerSpec|answerKey|teacherSolution|gradingKey|correctOption|correctTargetId|isCorrect|studentId|password|token)\"\s*:/i;
const validText=x=>typeof x==='string'&&x.trim().length>=3&&x.length<=600&&
 !/[\u0000-\u0008\u000e-\u001f<>]/.test(x)&&!/https?:\/\/|data:|javascript:/i.test(x);
const fail=code=>({ok:false,code,releaseReady:false});
function auditBase(){
 const m=manifest.checkManifest(defaultManifest);
 if(!m.ok||m.count!==12||assetRegistry.total!==288||
  assetRegistry.assets?.length!==288||fluent.total!==46||fluent.enabled!==false||
  fluent.productionActivation!==false||semanticRules.mode!=='STAGING_ONLY'||
  defaultManifest.assets.registry288.count!==288||
  defaultManifest.assets.fluentEmojiFlat.enabled!==false||
  defaultManifest.speechProfiles.defaultProfileId!==policy.speech.profileId||
  defaultManifest.speechProfiles.featureAvailableNow!==false||
  overlay.baseRegistryCount!==12||overlay.doNotRewriteBase!==true)
  return fail('PINNED_RESOURCES_OR_FEATURE_GUARDS_CHANGED');
 if(assetRegistry.assets.some(a=>a.label_status!=='LABEL_APPROVED')||
    assetRegistry.assets.some(a=>a.content_qa==='APPROVED_FOR_ALL_AUTOMATIC_COUNTING'))
  return fail('ASSET_TRUST_DRIFT');
 return {ok:true,registryCount:12,assetMetadataCount:288,fluentStagingCount:46,
  approvedFullRuntimeAssets:0,source:'PINNED_G76_MANIFEST_AND_METADATA',runtimeEnabled:false};
}
function validateAssetRequest({assetId,quantity,role}={}){
 if(assetId===null||assetId===undefined)return fail('NO_ASSET_REQUEST');
 if(typeof assetId!=='string'||!/^[A-Z0-9_]{1,64}$/.test(assetId))return fail('INVALID_ASSET_ID');
 const a=assetRegistry.assets.find(x=>x.asset_id===assetId);
 if(!a)return fail('UNREGISTERED_ASSET_ID');
 if(role!=='DECORATIVE')return fail('STUDENT_ASSET_ROLE_NOT_APPROVED');
 if(!Number.isInteger(quantity)||quantity!==0)return fail('DECORATIVE_ASSET_CANNOT_INFER_QUANTITY');
 // "LABEL_APPROVED" means ONLY label approval. Real image content QA and
 // owner permission must be explicit before any runtime WebP/Fluent fallback.
 return fail('ASSET_REGISTERED_METADATA_ONLY_RUNTIME_BINDING_PENDING');
}
function speechForPublicPrompt(prompt,{profileId=policy.speech.profileId}={}){
 if(!validText(prompt)||STRICT_FORBIDDEN.test(prompt))return fail('INVALID_VISIBLE_SPEECH_TEXT');
 if(!defaultManifest.speechProfiles.profiles.some(p=>p.id===profileId))
  return fail('VOICE_PROFILE_NOT_IN_PINNED_MANIFEST');
 return {ok:true,requestedText:prompt.trim(),locale:policy.speech.locale,profileId,
  source:'VISIBLE_PROMPT_ONLY',requestAllowedInExplicit_USER_GESTURE_ONLY:true,
  enabledByDefault:false,audioPlayed:false,status:'PREPARED_TEXT_NO_TTS_PLAYBACK',
  releaseReady:false};
}
function visibleSpeechText(typeId,plan){
 if(!plan||typeof plan!=='object')return fail('VISIBLE_PLAN_REQUIRED');
 if(typeId==='D2'){
  if(plan.schemaVersion!=='column-calc-reference-v12-public'||
     !['PV100','PV1000'].includes(plan.profile)||
     !['ADD','SUBTRACT'].includes(plan.operation)||
     !Array.isArray(plan.a)||!Array.isArray(plan.b)||plan.a.length!==plan.b.length||
     ![2,3].includes(plan.a.length))return fail('D2_VISIBLE_COLUMN_INVALID');
  const positions=['ones','tens','hundreds'];
  const amount=digits=>{
   if(digits.some((v,i)=>v.place!==positions[i]||!Number.isInteger(v.digit)||
      v.digit<0||v.digit>9))return null;
   return digits.reduce((n,v,i)=>n+v.digit*Math.pow(10,i),0);
  };
  const a=amount(plan.a),b=amount(plan.b);
  if(a===null||b===null||a>=(plan.profile==='PV100'?100:1000)||
     b>=(plan.profile==='PV100'?100:1000))return fail('D2_VISIBLE_DIGITS_INVALID');
  return {ok:true,text:'Đặt tính rồi tính: '+a+(plan.operation==='ADD'?' + ':' − ')+b+' = ?',
   provenance:'EXACT_VISIBLE_COLUMN_OPERANDS_DERIVED_NO_ANSWER'};
 }
 if(typeId==='D4'){
  if(plan.schemaVersion!=='g74-choice-v11'||plan.prompt?.type!=='TEXT'||
     typeof plan.prompt.text!=='string'||plan.prompt.assetId!=='')
    return fail('D4_VISIBLE_TEXT_PROMPT_INVALID');
  return {ok:true,text:plan.prompt.text,provenance:'G74_TEXT_PROMPT'};
 }
 if(typeof plan.prompt==='string')return {ok:true,text:plan.prompt,provenance:'PUBLIC_PROMPT'};
 return fail('VISIBLE_PROMPT_NOT_SUPPORTED');
}
function expectedRenderer(typeId){
 return ({
  D2:'G74_COLUMN_CALC_PINNED',
  D4:'G74_CHOICE_PINNED',
  D5:overlay.tangramPlacement.rendererId,
  D9:'G74_PICTOGRAPH_PINNED',
  MENTAL_INPUT_TEST_EXTENSION:overlay.auxiliaryRenderer.id
 })[typeId]||null;
}
function assembleCase(record){
 if(!record||typeof record!=='object'||Array.isArray(record)||!record.nativePlan||
    !['id','typeId','origin','nativePlan'].every(k=>Object.hasOwn(record,k))||
    Object.keys(record).some(x=>!['id','typeId','origin','nativePlan'].includes(x)))
  return fail('INVALID_PUBLIC_CASE');
 const {id,typeId,origin,nativePlan:plan}=record;
 const renderer=expectedRenderer(typeId);
 if(!renderer||!/^([A-Za-z0-9_]){3,85}$/.test(id))return fail('UNREGISTERED_CASE_TYPE');
 const generated=origin==='B3_E04_SEPARATE_SEEDED_GENERATOR_PENDING_POLICY';
 const real=origin==='P06_E03_REAL'||origin==='P06_E02_REAL'||
  origin==='P06_E03_REAL_WITH_NEW_TEST_RENDERER';
 if(!generated&&!real)return fail('UNTRUSTED_PROVENANCE');
 if((generated&&!['D5','D9'].includes(typeId))||
    (real&&['D5','D9'].includes(typeId)))return fail('SOURCE_TYPE_PROVENANCE_DRIFT');
 if(STRICT_FORBIDDEN.test(JSON.stringify(record)))return fail('PRIVATE_FIELD_IN_PUBLIC_PLAN');
 const extracted=visibleSpeechText(typeId,plan);
 if(!extracted.ok||!validText(extracted.text))return fail('INVALID_VISIBLE_PROMPT');
 if(typeId==='MENTAL_INPUT_TEST_EXTENSION'){
  if(plan.schemaVersion!=='g76b3.mental-number-input.v1'||plan.lessonId!=='toan_b21'||
     plan.input?.kind!=='NUMBER_INPUT'||plan.input.maxLength!==3||
     plan.rendererRegistration!=='PENDING_G76_MANIFEST_OWNER_APPROVAL'||
     plan.gradingEnabled!==false||plan.answerKeyIncluded!==false||plan.assetId!==null||
     plan.releaseReady!==false)return fail('MENTAL_INPUT_CONTRACT_DRIFT');
 }
 if(typeId==='D5'){
  if(plan.mode!=='TANGRAM'||!Array.isArray(plan.items)||plan.items.length!==3||
     !Array.isArray(plan.targets)||plan.targets.length!==3)return fail('TANGRAM_PLAN_DRIFT');
  // Validate only geometry: do not export piece->target lookup into the browser.
  const targets=plan.items.map(p=>geom.resolveTarget(plan,p.id));
  if(targets.some(x=>!x.ok)||new Set(targets.map(x=>x.id)).size!==3)
   return fail('TANGRAM_VISIBLE_GEOMETRY_AMBIGUOUS');
 }
 let exactQuantity=null;
 if(typeId==='D9'){
  if(!Array.isArray(plan.rows)||plan.rows.length!==2||plan.questions?.length!==1)
   return fail('PICTOGRAPH_STRUCTURE_INVALID');
  if(plan.rows.some(r=>r.contentType!=='EMOJI'||typeof r.symbol!=='string'||
   !Number.isInteger(r.itemCount)||r.itemCount<1||r.itemCount>12))
   return fail('PICTOGRAPH_COUNT_INVALID');
  const q=plan.questions[0],a=plan.rows.find(r=>r.id===q.rowId),
   b=plan.rows.find(r=>r.id===q.otherRowId);
  if(!a||!b||a.id===b.id||
     (q.relation==='MORE_THAN'&&a.itemCount<=b.itemCount)||
     (q.relation==='LESS_THAN'&&a.itemCount>=b.itemCount)||
     !['MORE_THAN','LESS_THAN'].includes(q.relation))return fail('PICTOGRAPH_COMPARISON_MISMATCH');
  exactQuantity=plan.rows.map(r=>({rowId:r.id,count:r.itemCount,mode:'PUBLIC_EMOJI_REPETITION'}));
 }
 if(typeId==='D2'||typeId==='D4'){
  if(!real)return fail('D2_D4_MUST_BE_REAL_P06');
 }
 const speech=speechForPublicPrompt(extracted.text);
 if(!speech.ok)return speech;
 const visual=typeId==='D5'?'PARAMETRIC_SVG_FROM_PUBLIC_GEOMETRY':
  typeId==='D9'?'EXACT_COUNT_EMOJI_FROM_ROW_PUBLIC_COUNT':
  'HTML_INPUT_OR_TEXT_NO_ASSET';
 return {ok:true,id,typeId,origin,renderer,visual,
  asset:{imageAutoLoaded:false,registryLookupAllowed:false,fluentFallback:false,
   source:'EXISTING_PUBLIC_GEOMETRY_OR_TEXT',exactQuantity},
  speech:{...speech,provenance:extracted.provenance},gradingEnabled:false,studentWritesAllowed:false,
  curriculumApproved:false,releaseReady:false};
}
function integratePublicData(payload){
 const resources=auditBase();if(!resources.ok)return resources;
 if(!payload||payload.schemaVersion!=='g76b3.chrome-producer-visual-test-public.v1'||
  payload.p06ProducerSha!==policy.source.p06Pinned||
  payload.releaseReady!==false||payload.curriculumApproval!==false||
  payload.assetRuntimeEnabled!==false||payload.gradingEnabled!==false||
  payload.d10TrustedGrading!==false||!Array.isArray(payload.cases)||
  payload.cases.length!==policy.coverage.total)
  return fail('PUBLIC_PRODUCER_RECEIPT_INVALID');
 const cases=payload.cases.map(assembleCase);
 const firstFailure=cases.find(x=>!x.ok);
 if(firstFailure)return firstFailure;
 const count=t=>cases.filter(x=>x.typeId===t).length;
 if(count('D2')!==2||count('D4')!==2||count('D5')!==2||
    count('D9')!==2||count('MENTAL_INPUT_TEST_EXTENSION')!==6||
    new Set(cases.map(x=>x.id)).size!==cases.length)return fail('TYPE_COVERAGE_OR_ID_DRIFT');
 return {ok:true,stage:'G7.6-B.5-B',scope:'OFFLINE_E2E_PREPARED_NO_BROWSER_AUDIO',
  resources,counts:{total:14,p06E03:8,p06E02:2,e04Lab:4},
  cases,releaseReady:false,gasDeployed:false,audibleTtsTested:false,
  physicalDeviceB5AReview:'USER_CHAT_CONFIRMED_TESTED_TANGRAM_NOT_AUDIO',
  trustedGraderConnected:false,studentDataWritten:false};
}
module.exports={policy,auditBase,validateAssetRequest,speechForPublicPrompt,visibleSpeechText,assembleCase,integratePublicData};
