/**
 * G7.4-B.5.1 — generic, pure, reusable Asset ID semantic selector.
 * No Apps Script services, HTTP, DOM, Sheet writes, or per-lesson Question ID assumptions.
 * v1 is decorative-only; quantity/counting intent fails closed until separately verified.
 *
 * Public contract:
 * KL_BoChonAssetChungV1.compileRules(raw,{releaseCommit,registryCommit})
 * KL_BoChonAssetChungV1.select(request,compiled)
 * KL_BoChonAssetChungV1.mergeQuestions(questions,explicitSidecar,compiled)
 */
var KL_BoChonAssetChungV1=(function(){
'use strict';
const ASSET=/^KL_(?:SH|M)(?:0[1-9]|1[0-2])_\d{3}$/;
const CONCEPT=/^[a-z][a-z0-9_]{2,40}$/;
function normalize(value){
 return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()
  .replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function compileRules(parsed,opts){
 opts=opts||{};
 if(!parsed||parsed.schema_version!=='kidlearn-asset-semantic-rules-v1'||
    parsed.mode!=='STAGING_ONLY'||parsed.release_commit!==opts.releaseCommit||
    parsed.registry_commit!==opts.registryCommit||
    !Array.isArray(parsed.rules)||parsed.rules.length>24)
   throw Error('SMART_RULES_INVALID_HEADER');
 const ids=new Set(),concepts=new Set(),rules=[];
 for(const rule of parsed.rules){
  if(!rule||typeof rule.concept!=='string'||!CONCEPT.test(rule.concept)||
     concepts.has(rule.concept)||typeof rule.asset_id!=='string'||!ASSET.test(rule.asset_id)||
     ids.has(rule.asset_id)||rule.label_status!=='LABEL_APPROVED'||
     rule.review_tier!=='STAGING_CURATED'||rule.count!==1||
     typeof rule.fallback_emoji!=='string'||
     !Array.isArray(rule.match_phrases)||!rule.match_phrases.length||rule.match_phrases.length>12)
    throw Error('SMART_RULE_INVALID');
  const seen=new Set(),phrases=[];
  for(const raw of rule.match_phrases){
   if(typeof raw!=='string'||raw.length>60)throw Error('SMART_RULE_PHRASE_INVALID');
   const phrase=normalize(raw);
   if(!phrase||seen.has(phrase))throw Error('SMART_RULE_PHRASE_DUPLICATE');
   seen.add(phrase);phrases.push(phrase);
  }
  ids.add(rule.asset_id);concepts.add(rule.concept);
  rules.push({concept:rule.concept,assetId:rule.asset_id,phrases,
    emoji:rule.fallback_emoji,labelStatus:'LABEL_APPROVED'});
 }
 if(!rules.length)throw Error('SMART_RULES_EMPTY');
 return {schema_version:parsed.schema_version,release_commit:parsed.release_commit,rules};
}
/**
 * For legacy B20, {type:'word',prompt,unit} works unchanged.
 * For a future lesson, pass {visualIntent:'decorative',quantityMode:'symbolic',
 *  subject:'...',semanticTags:[...],prompt:'...'}.
 *
 * Explicit numerical representations remain prohibited until a separate,
 * approved quantitative visual renderer exists.
 */
function select(request,registry){
 if(!request||!registry||!Array.isArray(registry.rules))
   return {ok:false,code:'NOT_APPLICABLE'};
 const intent=request.visualIntent;
 const legacy=intent==null&&request.type==='word';
 if(!legacy&&intent!=='decorative')
   return {ok:false,code:intent==='quantity'||intent==='counting'||
     request.quantityMode==='exact'?'REQUIRES_QUANTITY_VERIFICATION':'NOT_APPLICABLE'};
 if(request.quantityMode==='exact'||request.quantityMode==='counting'||
    request.quantityMode==='literal')
   return {ok:false,code:'REQUIRES_QUANTITY_VERIFICATION'};
 const content=' '+normalize([request.prompt,request.unit,request.subject,
   ...(Array.isArray(request.semanticTags)?request.semanticTags:[])].join(' '))+' ';
 const matches=[];
 for(const rule of registry.rules){
  if(rule.labelStatus!=='LABEL_APPROVED')continue;
  if(rule.phrases.some(phrase=>content.includes(' '+phrase+' ')))matches.push(rule);
 }
 if(!matches.length)return {ok:false,code:'NO_SAFE_MATCH'};
 if(matches.length>1)return {ok:false,code:'AMBIGUOUS_SEMANTICS',concepts:matches.map(x=>x.concept)};
 const chosen=matches[0];
 return {ok:true,concept:chosen.concept,entry:{
  usage:'decorative',semantic:chosen.concept,label_approval_status:'LABEL_APPROVED',
  pilot_only:false,fallback_emoji:chosen.emoji,
  scene:{groups:[{label:'Hình minh họa, không thể hiện số lượng',
   items:[{assetId:chosen.assetId,count:1}]}]}
 }};
}
/** Merge is immutable and lesson-agnostic; manual sidecar has highest priority. */
function mergeQuestions(questions,explicitSidecar,registry){
 if(!Array.isArray(questions)||!explicitSidecar||!explicitSidecar.question_scenes||
    explicitSidecar.mode!=='STAGING_ONLY'||!registry||!Array.isArray(registry.rules))
   throw Error('SMART_MERGE_INVALID_INPUT');
 const merged=Object.assign({},explicitSidecar.question_scenes),diagnostics=[];
 for(const q of questions){
  const id=q&&(q.question_id||q.id);
  if(typeof id!=='string'||!id)throw Error('SMART_QUESTION_ID_INVALID');
  if(Object.prototype.hasOwnProperty.call(merged,id)){
   diagnostics.push({questionId:id,result:'EXPLICIT_OVERRIDE'});continue;
  }
  const selected=select(q,registry);
  if(selected.ok){merged[id]=selected.entry;diagnostics.push({questionId:id,result:'CURATED_AUTO',concept:selected.concept});}
  else diagnostics.push({questionId:id,result:selected.code});
 }
 return {schema_version:explicitSidecar.schema_version,mode:'STAGING_ONLY',
  question_scenes:merged,selectionDiagnostics:diagnostics};
}
return Object.freeze({normalize,compileRules,select,mergeQuestions});
})();
