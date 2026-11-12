/** G7.4-B.4: conservative read-only semantic Asset ID selector (TEST only).
 * Rules are versioned JSON, NOT hand-coded per Question ID. Returns no image on ambiguity.
 * The existing per-question sidecar remains the highest-priority override.
 */
const B20_SMART_RULES_URL_='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/6cbc477ad43e44b457eb168b5204f3b52425a677/du-lieu/asset-selector/semantic-rules.v1.json';
const B20_SMART_RULES_CACHE_='b20_smart_rules_v1_6cbc47';
const B20_SMART_RELEASE_='653bfbc73002a188dcea0b714247b84cc28a4fed';
function b20ChuanHoaTu_(value){
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D')
    .toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function b20DocLuatAnhThongMinh_(){
  const cache=CacheService.getScriptCache();
  const cached=cache.get(B20_SMART_RULES_CACHE_);
  if(cached)return JSON.parse(cached);
  const response=UrlFetchApp.fetch(B20_SMART_RULES_URL_,{muteHttpExceptions:true,followRedirects:true});
  if(response.getResponseCode()!==200)throw Error('SMART_RULES_HTTP_'+response.getResponseCode());
  const parsed=JSON.parse(response.getContentText('UTF-8'));
  if(!parsed||parsed.schema_version!=='kidlearn-asset-semantic-rules-v1'||
     parsed.mode!=='STAGING_ONLY'||parsed.release_commit!==B20_SMART_RELEASE_||
     parsed.registry_commit!=='ae38ad4edcb5962fa3dc4761f7e67363b4c08050'||
     !Array.isArray(parsed.rules)||parsed.rules.length>24)
    throw Error('SMART_RULES_INVALID_HEADER');
  const ids=new Set(),concepts=new Set(),rules=[];
  for(const rule of parsed.rules){
    if(!rule||typeof rule.concept!=='string'||!(/^[a-z][a-z0-9_]{2,40}$/).test(rule.concept)||
       concepts.has(rule.concept)||typeof rule.asset_id!=='string'||
       !/^KL_(?:SH|M)(?:0[1-9]|1[0-2])_\d{3}$/.test(rule.asset_id)||ids.has(rule.asset_id)||
       rule.label_status!=='LABEL_APPROVED'||rule.review_tier!=='STAGING_CURATED'||
       rule.count!==1||typeof rule.fallback_emoji!=='string'||
       !Array.isArray(rule.match_phrases)||!rule.match_phrases.length||rule.match_phrases.length>12)
      throw Error('SMART_RULE_INVALID');
    const seen=new Set(),phrases=[];
    for(const raw of rule.match_phrases){
      if(typeof raw!=='string'||raw.length>60)throw Error('SMART_RULE_PHRASE_INVALID');
      const normalized=b20ChuanHoaTu_(raw);
      if(!normalized||seen.has(normalized))throw Error('SMART_RULE_PHRASE_DUPLICATE');
      seen.add(normalized);phrases.push(normalized);
    }
    ids.add(rule.asset_id);concepts.add(rule.concept);
    rules.push({concept:rule.concept,assetId:rule.asset_id,phrases,emoji:rule.fallback_emoji,
      labelStatus:'LABEL_APPROVED'});
  }
  if(!rules.length)throw Error('SMART_RULES_EMPTY');
  const result={schema_version:parsed.schema_version,release_commit:parsed.release_commit,rules};
  const text=JSON.stringify(result);
  if(text.length<95000)cache.put(B20_SMART_RULES_CACHE_,text,300);
  return result;
}
/** Pure deterministic candidate selection. Only word exercises, decorative use. */
function b20ChonHinhNguNghia_(question,registry){
  if(!question||question.type!=='word'||!registry||!Array.isArray(registry.rules))
    return {ok:false,code:'NOT_APPLICABLE'};
  const content=' '+b20ChuanHoaTu_([question.prompt,question.unit].join(' '))+' ';
  const matches=[];
  for(const rule of registry.rules){
    if(rule.labelStatus!=='LABEL_APPROVED')continue;
    if(rule.phrases.some(phrase=>content.includes(' '+phrase+' ')))matches.push(rule);
  }
  if(!matches.length)return {ok:false,code:'NO_SAFE_MATCH'};
  if(matches.length>1)return {ok:false,code:'AMBIGUOUS_SEMANTICS',concepts:matches.map(x=>x.concept)};
  const match=matches[0];
  return {ok:true,concept:match.concept,entry:{
    usage:'decorative',semantic:match.concept,label_approval_status:'LABEL_APPROVED',
    pilot_only:false,fallback_emoji:match.emoji,
    scene:{groups:[{label:'Hình minh họa, không thể hiện số lượng',
      items:[{assetId:match.assetId,count:1}]}]}
  }};
}
/** Pure merge into a NEW copy. Explicit JSON mappings always win. */
function b20GhepHinhThongMinh_(pack,explicitSidecar,ruleRegistry){
  if(!pack||!Array.isArray(pack.questions)||!explicitSidecar||!explicitSidecar.question_scenes)
    throw Error('SMART_MERGE_INVALID_INPUT');
  const merged=Object.assign({},explicitSidecar.question_scenes),diagnostics=[];
  for(const q of pack.questions){
    const id=q.question_id;
    if(Object.prototype.hasOwnProperty.call(merged,id)){
      diagnostics.push({questionId:id,result:'EXPLICIT_OVERRIDE'});continue;
    }
    const selected=b20ChonHinhNguNghia_(q,ruleRegistry);
    if(selected.ok){merged[id]=selected.entry;diagnostics.push({questionId:id,result:'CURATED_AUTO',concept:selected.concept});}
    else diagnostics.push({questionId:id,result:selected.code});
  }
  return {schema_version:explicitSidecar.schema_version,mode:'STAGING_ONLY',
    question_scenes:merged,selectionDiagnostics:diagnostics};
}
function kiemTraBoChonHinhThongMinh(){
  const rules=b20DocLuatAnhThongMinh_();
  const pack=b20DocPackThu_();
  return {ok:true,ruleCount:rules.rules.length,questionCount:pack.questions.length,
    mappedQuestions:pack.assetScenes?Object.keys(pack.assetScenes.question_scenes):[],
    stagingOnly:true,noWrites:true,noStars:true};
}
