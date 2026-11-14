'use strict';
/* G7.6 pure TEST resolver. NO GAS, network, browser execution or grading.
 * Only builds a reference descriptor for an already server-projected answer-free packet.
 * It is not an authentication boundary; a trusted backend must validate independently.
 */
const fs=require('node:fs');
const path=require('node:path');
const DEFAULT_MANIFEST=path.resolve(__dirname,'../../du-lieu/g7-6/resource-renderer-manifest.v1.json');
const ID=/^[A-Za-z0-9_.:-]{1,100}$/;
const ID_TYPES=new Set(['D1','D2','D3','D4','D5','D6','D7','D8','D8A','D8B','D9','D10']);
const MODES=new Set(['PRACTICE','ASSESSMENT']);
const VMODES=new Set(['EXACT_COUNT','REPRESENTATIVE','DECORATIVE']);
const STRATEGIES=new Set(['STRUCTURED_DIAGRAM','PARAMETRIC_SVG','REPEAT_APPROVED_ASSET','STATIC_APPROVED_ASSET','HTML_FIELDS','NO_VISUAL']);
const FORBIDDEN=new Set(['answer','answerkey','correctanswer','expectedanswer','expectedvalue','expectedresult','solution','teachersolution',
 'prefilledsolution','result','gradingkey','iscorrect','correctstatementid','correctchoiceid','correctoption','secret','markscheme',
 'gradingrubric','gradingscript','privatepayload','privatemetadata','auth','token','authorization','password','__proto__',
 'constructor','prototype']);
const STRATEGY={
 D1:new Set(['STRUCTURED_DIAGRAM','HTML_FIELDS','NO_VISUAL']),D2:new Set(['HTML_FIELDS']),
 D3:new Set(['HTML_FIELDS','NO_VISUAL']),D4:new Set(['HTML_FIELDS','NO_VISUAL']),
 D5:new Set(['PARAMETRIC_SVG']),D6:new Set(['HTML_FIELDS','NO_VISUAL']),
 D7:new Set(['PARAMETRIC_SVG','HTML_FIELDS']),D8:new Set(['PARAMETRIC_SVG']),
 D8A:new Set(['PARAMETRIC_SVG']),D8B:new Set(['PARAMETRIC_SVG']),
 D9:new Set(['PARAMETRIC_SVG','NO_VISUAL']),D10:new Set(['HTML_FIELDS'])
};
const err=code=>({ok:false,code,releaseReady:false});
const validId=v=>typeof v==='string'&&ID.test(v);
const isRecord=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
function hasForbidden(value,seen=new Set(),depth=0){
 if(depth>10)return true;
 if(value===null||typeof value!=='object')return false;
 if(seen.has(value))return true;seen.add(value);
 for(const [k,v] of Object.entries(value)){
  const norm=k.toLowerCase().replace(/[^a-z0-9]/g,'');
  if(FORBIDDEN.has(norm)||hasForbidden(v,seen,depth+1))return true;
 }
 seen.delete(value);return false;
}
function checkManifest(m){
 if(!isRecord(m)||m.schemaVersion!=='lop2.g76.resource-renderer-manifest.v1')throw Error('BAD_MANIFEST_VERSION');
 if(!Array.isArray(m.rendererRegistry)||m.rendererRegistry.length!==12)throw Error('REGISTRY_COUNT_MISMATCH');
 if(new Set(m.rendererRegistry.map(x=>x.id)).size!==12||m.rendererRegistry.some(x=>!ID_TYPES.has(x.id)))throw Error('BAD_IDS');
 if(m.release?.ready!==false||m.release?.gasDeployAllowed!==false||m.release?.mergeAllowed!==false)throw Error('RELEASE_GUARD_FAIL');
 if(m.assets?.registry288?.count!==288||m.assets?.fluentEmojiFlat?.count!==46)throw Error('ASSET_COUNT_CONTRACT_DRIFT');
 if(m.assets.fluentEmojiFlat.enabled!==false||m.assets.fluentEmojiFlat.allowAutoFallback!==false)throw Error('FLUENT_AUTO_ACTIVATION');
 if(m.speechProfiles?.defaultProfileId!=='vi_math_v2_dynamic')throw Error('TTS_DEFAULT_MISMATCH');
 if(!m.dataIntegration?.forbiddenPublicFields?.includes('answerKey'))throw Error('ANSWER_GUARD_MISSING');
 for(const item of m.rendererRegistry){
  if(!Array.isArray(item.source?.files)||!item.source.files.length||item.source.files.some(f=>typeof f.path!=='string'||!/^qa\/[a-zA-Z0-9_./-]+$/.test(f.path)||f.path.includes('..')||!/^([a-f0-9]{40})$/.test(f.gitBlobSha)))throw Error('INVALID_SOURCE_REF_'+item.id);
  if(item.qa?.releaseStatus!=='ISOLATED_TEST_REFERENCE_ONLY'||item.speech.integratedInGas!==false)throw Error('ITEM_DEPLOY_STATE_INVALID_'+item.id);
  if(item.speech.profileId!==m.speechProfiles.defaultProfileId)throw Error('VOICE_PROFILE_MISMATCH_'+item.id);
 }
 const d8a=m.rendererRegistry.find(x=>x.id==='D8A'),d8b=m.rendererRegistry.find(x=>x.id==='D8B'),d10=m.rendererRegistry.find(x=>x.id==='D10');
 if(!d8a.source.files.some(x=>x.path.endsWith('capacity-weight-v12-view.js'))||
    !d8b.source.files.some(x=>x.path.endsWith('capacity-weight-v11-view.js'))||
    d10.data.gradeRoute!=='DENY_NEW_GRADED_VARIANTS_UNTIL_TRUSTED_SERVER')throw Error('CRITICAL_MAPPING_DRIFT');
 return {ok:true,count:m.rendererRegistry.length};
}
function loadManifest(file=DEFAULT_MANIFEST){const m=JSON.parse(fs.readFileSync(file,'utf8'));checkManifest(m);return m;}
function validateEnvelope(packet){
 if(!isRecord(packet)||packet.schemaVersion!=='g76.public-envelope.v1')return err('BAD_PUBLIC_ENVELOPE');
 if(hasForbidden(packet))return err('FORBIDDEN_OR_CYCLIC_PUBLIC_FIELD');
 const allowedRoot=['schemaVersion','lessonId','questionId','variantId','typeId','mode','display','visualIntent','speech'];
 if(Object.keys(packet).some(k=>!allowedRoot.includes(k)))return err('UNEXPECTED_ROOT_FIELD');
 if(![packet.lessonId,packet.questionId,packet.variantId].every(validId))return err('INVALID_IDENTIFIERS');
 if(!ID_TYPES.has(packet.typeId)||!MODES.has(packet.mode))return err('UNKNOWN_TYPE_OR_MODE');
 if(!isRecord(packet.display)||Object.keys(packet.display).some(k=>!['prompt','publicParameters','visibleChoices'].includes(k))||
 typeof packet.display.prompt!=='string'||!packet.display.prompt.trim()||packet.display.prompt.length>2000||
 !isRecord(packet.display.publicParameters)||Object.keys(packet.display.publicParameters).length>40)
  return err('INVALID_DISPLAY');
 for(const value of Object.values(packet.display.publicParameters)){
  if(value!==null&&typeof value!=='string'&&typeof value!=='number'&&typeof value!=='boolean'&&!Array.isArray(value))return err('INVALID_PUBLIC_PARAMETER');
  if(typeof value==='number'&&!Number.isFinite(value))return err('INVALID_PUBLIC_PARAMETER');
  if(typeof value==='string'&&value.length>250)return err('INVALID_PUBLIC_PARAMETER');
  if(Array.isArray(value)&&(value.length>100||value.some(v=>v!==null&&!['string','number','boolean'].includes(typeof v)||typeof v==='number'&&!Number.isFinite(v))))return err('INVALID_PUBLIC_PARAMETER');
 }
 if(packet.display.visibleChoices!==undefined){
  if(!Array.isArray(packet.display.visibleChoices)||packet.display.visibleChoices.length>20||
     packet.display.visibleChoices.some(c=>!isRecord(c)||Object.keys(c).some(k=>!['id','text'].includes(k))||!validId(c.id)||typeof c.text!=='string'||c.text.length>300))return err('INVALID_VISIBLE_CHOICES');
 }
 const v=packet.visualIntent;
 if(!isRecord(v)||Object.keys(v).some(k=>!['visualMode','renderStrategy','assetId','countEvidenceRef','quantity'].includes(k))||
 !VMODES.has(v.visualMode)||!STRATEGIES.has(v.renderStrategy))return err('INVALID_VISUAL_INTENT');
 if(v.assetId!==undefined)return err('STATIC_ASSET_BINDING_NOT_AUTHORIZED');
 if(v.countEvidenceRef!==undefined)return err('UNVERIFIED_CLIENT_COUNT_EVIDENCE');
 if(v.quantity!==undefined&&(!Number.isInteger(v.quantity)||v.quantity<0||v.quantity>1000))return err('INVALID_QUANTITY');
 if(v.visualMode==='EXACT_COUNT'&&v.renderStrategy!=='NO_VISUAL')return err('COUNT_SAFE_RESOLUTION_REQUIRES_TRUSTED_APPROVAL');
 const sp=packet.speech;
 if(!isRecord(sp)||Object.keys(sp).some(k=>!['enabled','profileId','visiblePromptOnly'].includes(k))||
 typeof sp.enabled!=='boolean'||(sp.visiblePromptOnly!==undefined&&sp.visiblePromptOnly!==true))return err('INVALID_SPEECH_POLICY');
 return {ok:true};
}
function resolvePublicEnvelope(manifest,packet){
 try{checkManifest(manifest)}catch(e){return err('MANIFEST_UNTRUSTED_'+e.message)}
 const valid=validateEnvelope(packet);if(!valid.ok)return valid;
 const entry=manifest.rendererRegistry.find(x=>x.id===packet.typeId);
 if(!entry)return err('UNREGISTERED_RENDERER');
 if(entry.id==='D10')return err('D10_EXISTING_G6_ONLY_NEW_VARIANT_ROUTE_DENIED');
 if(!STRATEGY[entry.id].has(packet.visualIntent.renderStrategy))return err('RENDER_STRATEGY_FORBIDDEN_FOR_TYPE');
 if(entry.id==='D2'&&packet.display.publicParameters.fourColumnRequired===true)return err('COLUMN_1000_BOUNDARY_PENDING');
 const profile=packet.speech.profileId||manifest.speechProfiles.defaultProfileId;
 if(!manifest.speechProfiles.profiles.some(x=>x.id===profile))return err('VOICE_PROFILE_NOT_APPROVED');
 return {ok:true,releaseReady:false,scope:'STATIC_TEST_SELECTION_ONLY',
  renderer:{id:entry.id,version:entry.version,mode:packet.mode,files:entry.source.files.map(x=>({...x})),sourceCommit:entry.source.baseCommit},
  visual:{strategy:packet.visualIntent.renderStrategy,visualMode:packet.visualIntent.visualMode,assetId:null,dynamicSvgAuthoritative:entry.visual.dynamicSvgAuthoritative},
  voice:{enabled:packet.speech.enabled,profileId:profile,authorizedTextSource:'display.prompt',gasIntegrated:false},
  data:{lessonId:packet.lessonId,questionId:packet.questionId,variantId:packet.variantId,visiblePrompt:packet.display.prompt},
  grading:{enabled:false,serverRoute:'NOT_CONNECTED'},assetResolver:{enabled:false,reason:'NOT_APPROVED_FOR_RUNTIME'}
 };
}
module.exports={loadManifest,checkManifest,validateEnvelope,resolvePublicEnvelope};
