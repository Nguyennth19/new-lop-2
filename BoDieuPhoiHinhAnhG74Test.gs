/**
 * G7.4 B5.8-R: pure, READ-ONLY test visual validator / resolver.
 * - No DOM, GAS APIs, HTTP, user progress, CSS, scoring, or effects.
 * - Curated 9 concepts only for decorative source resolution.
 * - 288 approved labels are metadata, not 288 automatic semantic grants.
 * - Exact counting fails closed unless independent COUNT_SAFE_APPROVED evidence exists.
 * - No Fluent Flat assets have been imported; mathematical SVG is a plan, not markup.
 */
var KL_G74_VisualResolverTestV1=(function(){
'use strict';
const RELEASE='653bfbc73002a188dcea0b714247b84cc28a4fed';
const REGISTRY_BLOB='544377bf3cbc0d7b19a4a6f76efd9ae84845b123';
const RULES_BLOB='313a65789e308ff67a19a197684b7172fab0c3e6';
const ROOT='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/'+RELEASE+'/hinh-anh/webp-g7/v1/';
const SUBJECTS=['TOAN','TIENG_VIET','TIENG_ANH'];
const INTENTS=['DECORATIVE','CHOICE','EXACT_COUNT','GROUPED_COUNT','PICTOGRAPH','COMPARISON','MEASUREMENT','GEOMETRY'];
const MATH_INTENTS=['MEASUREMENT','GEOMETRY'];
const ID=/^KL_(?:SH|M)(?:0[1-9]|1[0-2])_(?:00[1-9]|01[0-2])$/;
const SECRET_KEYS=['src','url','html','svgMarkup','onerrorScript','apiUrl','qaPassed','iconifyUrl'];
const safeText=s=>typeof s==='string'&&s.length>0&&s.length<=128&&/^[\p{L}\p{N}_.\- ]+$/u.test(s);
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().trim().replace(/\s+/g,' ');
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const blocked=(code,reason)=>({contractVersion:'g7-visual-resolution-v1',ok:false,status:'BLOCKED',code,
 rendererId:null,renderMode:'BLOCKED',assets:[],groups:[],answerDisclosure:'NONE',
 fallback:{kind:'SAFE_PLACEHOLDER',preserveExactCount:true,accessibleMessage:reason||'Chưa có hình phù hợp và được kiểm định'},
 audit:{reason:code}});
function validateVisualRequest(r){
 if(!object(r)||SECRET_KEYS.some(k=>Object.prototype.hasOwnProperty.call(r,k)))return blocked('INVALID_REQUEST');
 if(r.contractVersion!=='g7-visual-request-v1'||!safeText(r.questionId)||!safeText(r.lessonId)||
 !safeText(r.sceneId)||!SUBJECTS.includes(r.subject)||!safeText(r.exerciseType))return blocked('INVALID_REQUEST');
 if(!INTENTS.includes(r.visualIntent))return blocked('UNSUPPORTED_INTENT');
 if(!object(r.display)||!['NONE','POST_SUBMIT_ONLY'].includes(r.display.answerVisibility))return blocked('INVALID_REQUEST');
 if(r.visualIntent==='EXACT_COUNT'||r.visualIntent==='GROUPED_COUNT'||r.visualIntent==='PICTOGRAPH'){
  const q=r.quantity;
  if(!object(q)||q.mode!=='EXACT'||!Array.isArray(q.groups)||q.groups.length<1||q.groups.length>10||
   !Number.isSafeInteger(q.expectedTotal)||q.expectedTotal<0||
   !Number.isSafeInteger(q.unitPerSymbol)||q.unitPerSymbol<1)return blocked('INVALID_REQUEST');
  const seen=new Set();let total=0;
  for(const g of q.groups){
   if(!object(g)||!safeText(g.groupId)||seen.has(g.groupId)||!Number.isSafeInteger(g.count)||g.count<0||g.count>200)return blocked('INVALID_REQUEST');
   seen.add(g.groupId);total+=g.count*q.unitPerSymbol;
  }
  if(total!==q.expectedTotal)return blocked('COUNT_MISMATCH');
  if(q.unitPerSymbol!==1&&r.visualIntent!=='PICTOGRAPH')return blocked('UNIT_PER_SYMBOL_UNSUPPORTED');
 }
 return {ok:true,request:r};
}
function compile(sources){
 if(!object(sources)||!object(sources.registry)||!object(sources.rules))throw Error('SOURCES_REQUIRED');
 const a=sources.registry,p=sources.rules;
 if(a.total!==288||a.release_commit!==RELEASE||!Array.isArray(a.assets)||a.assets.length!==288||p.release_commit!==RELEASE||
 !Array.isArray(p.rules)||p.rules.length!==9||p.selection_policy?.allow_quantity_inference!==false||
 p.selection_policy?.require_curated_rule!==true)throw Error('PINNED_BASELINE_MISMATCH');
 const assets=Object.create(null),curated=Object.create(null);
 for(const x of a.assets){
  if(!ID.test(x.asset_id)||assets[x.asset_id]||x.label_status!=='LABEL_APPROVED'||!/^WEBP\/(?:SH|M)(?:0[1-9]|1[0-2])\/KL-(?:SH|M)(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-2])\.webp$/.test(x.relative_path))throw Error('INVALID_REGISTRY_ASSET');
  const chunk=x.asset_id.match(/^KL_(SH|M)(\d\d)_(\d{3})$/),path=x.relative_path.match(/^WEBP\/(SH|M)(\d\d)\/KL-(SH|M)(\d\d)-(\d\d)\.webp$/);
  if(chunk[1]!==path[1]||chunk[2]!==path[2]||chunk[1]!==path[3]||chunk[2]!==path[4]||Number(chunk[3])!==Number(path[5]))throw Error('ID_PATH_MISMATCH');
  assets[x.asset_id]=Object.freeze({...x});
 }
 for(const rule of p.rules){
  if(!safeText(rule.concept)||!assets[rule.asset_id]||curated[rule.concept]||!Array.isArray(rule.match_phrases))throw Error('BAD_CURATED_RULES');
  curated[rule.concept]=Object.freeze({...rule});
 }
 const countEvidence=Object.create(null);
 for(const ev of sources.countEvidence||[]){
  if(!object(ev)||!assets[ev.assetId]||countEvidence[ev.assetId]||ev.sourceKind!=='WEBP'||ev.objectCountPerAsset!==1||
   ev.countQaStatus!=='COUNT_SAFE_APPROVED'||ev.sourceImageReviewed!==true||!safeText(ev.reviewerDecision)||
   ev.reviewerDecision!=='APPROVED'||!safeText(ev.evidenceId)||ev.assetHashOrRelease!==RELEASE)throw Error('INVALID_COUNT_EVIDENCE');
  countEvidence[ev.assetId]=Object.freeze({...ev});
 }
 // Flat manifest deliberately absent until import and per-icon security / semantic QA.
 if(sources.fluentManifest&&sources.fluentManifest.enabled!==false)throw Error('FLUENT_NOT_IMPORTED');
 return Object.freeze({assets:Object.freeze(assets),curated:Object.freeze(curated),
  countEvidence:Object.freeze(countEvidence),fluentImported:false,release:RELEASE});
}
function assetRef(c,a,kind){
 return {sourceKind:kind||'WEBP',assetIdOrIconId:a.asset_id,verifiedPath:a.relative_path,shaOrRelease:RELEASE,
  conceptKey:kind==='COUNT'?null:undefined,objectsPerAsset:kind==='COUNT'?1:null};
}
function resolve(r,sources,opts){
 const checked=validateVisualRequest(r);if(!checked.ok)return checked;
 if(!object(opts)||opts.mode!=='STAGING_ONLY'||opts.enabled!==true)return blocked('TEST_GATE_OFF');
 let db;try{db=compile(sources)}catch(e){return blocked('SOURCE_VALIDATION_FAILED',e.message)}
 const intent=r.visualIntent;
 if(MATH_INTENTS.includes(intent)||intent==='COMPARISON'){
  if(r.subject!=='TOAN')return blocked('SUBJECT_INTENT_MISMATCH');
  if(!object(r.math)||!safeText(r.math.rendererId)||
    !(intent==='GEOMETRY'?r.math.rendererId.startsWith('GEOM_'):r.math.rendererId.startsWith('MEASURE_')||r.math.rendererId.startsWith('COMPARE_')))
    return blocked('MATH_RENDERER_NOT_REGISTERED');
  // Planning only: not supplying SVG strings or third-party icon substitutes.
  return {contractVersion:'g7-visual-resolution-v1',ok:true,status:'PLANNED_TEST',code:'PARAMETRIC_ONLY',
   rendererId:r.math.rendererId,renderMode:'PARAMETRIC_SVG',assets:[],groups:[],answerDisclosure:'NONE',
   audit:{requireMathRendererValidation:true,release:RELEASE}};
 }
 const rule=r.conceptKey?db.curated[r.conceptKey]:null;
 const candidates=rule?[rule]:r.searchPhrase?Object.values(db.curated).filter(x=>x.match_phrases.some(p=>normalize(p)===normalize(r.searchPhrase))):[];
 if(!['EXACT_COUNT','GROUPED_COUNT','PICTOGRAPH'].includes(intent)){
  if(candidates.length>1)return blocked('AMBIGUOUS_CONCEPT');
  if(candidates.length!==1)return blocked('MAPPING_NOT_APPROVED');
  const a=db.assets[candidates[0].asset_id];
  if(r.preferredWebpAssetId&&r.preferredWebpAssetId!==a.asset_id)return blocked('ASSET_OVERRIDE_NOT_CURATED');
  return {contractVersion:'g7-visual-resolution-v1',ok:true,status:'PLANNED_TEST',code:'RESOLVED',
   rendererId:'TEST_SINGLE_WEBP',renderMode:'SINGLE_WEBP',
   assets:[{...assetRef(db,a),conceptKey:candidates[0].concept,url:ROOT+a.relative_path}],
   groups:[],answerDisclosure:'NONE',fallback:{kind:'SAFE_PLACEHOLDER',preserveExactCount:true},
   audit:{registryBlob:REGISTRY_BLOB,rulesBlob:RULES_BLOB,release:RELEASE}};
 }
 // Never elevate the two B5.8 TEST_CANDIDATE records or 288 labels to COUNT_SAFE_APPROVED.
 if(!safeText(r.preferredWebpAssetId)||!db.assets[r.preferredWebpAssetId])return blocked('QUANTITY_EVIDENCE_MISSING');
 const a=db.assets[r.preferredWebpAssetId],ev=db.countEvidence[a.asset_id];
 if(!ev)return blocked('QUANTITY_EVIDENCE_MISSING');
 if(r.conceptKey&&r.conceptKey!==ev.conceptKey)return blocked('MAPPING_NOT_APPROVED');
 const groups=r.quantity.groups.map(g=>({groupId:g.groupId,count:g.count,unitPerSymbol:r.quantity.unitPerSymbol,
  itemCount:g.count}));
 return {contractVersion:'g7-visual-resolution-v1',ok:true,status:'PLANNED_TEST',code:'RESOLVED',
  rendererId:intent==='PICTOGRAPH'?'TEST_PICTOGRAPH':'TEST_REPEAT_SINGLE_WEBP',
  renderMode:intent==='PICTOGRAPH'?'PICTOGRAPH_UNIT':'REPEAT_SINGLE_WEBP',
  assets:[{...assetRef(db,a,'COUNT'),conceptKey:ev.conceptKey,url:ROOT+a.relative_path}],
  groups,answerDisclosure:'NONE',fallback:{kind:'BLOCKED_IF_COUNT_SOURCE_FAILS',preserveExactCount:true},
  audit:{countEvidenceId:ev.evidenceId,release:RELEASE}};
}
return Object.freeze({RELEASE,REGISTRY_BLOB,RULES_BLOB,validateVisualRequest,compile,resolve});
})();
