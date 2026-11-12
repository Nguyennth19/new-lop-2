/**
 * G7.4-B.5.1 — B20 compatibility adapter, deliberately thin.
 * Semantic parsing, matching and merging moved to BoChonAssetNguNghiaChung.gs.
 * Public legacy names, pinned rule URL, cache key, return shapes remain stable.
 * No UI/CSS/renderer edits and no student records/stars writes.
 */
const B20_SMART_RULES_URL_='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/6faead9028c1e27d815c4b5de6652923fd1506a0/du-lieu/asset-selector/semantic-rules.v1.json';
const B20_SMART_RULES_CACHE_='b20_smart_rules_v1_b41_6faead';
const B20_SMART_RELEASE_='653bfbc73002a188dcea0b714247b84cc28a4fed';
const B20_SMART_REGISTRY_COMMIT_='ae38ad4edcb5962fa3dc4761f7e67363b4c08050';
function b20ChuanHoaTu_(value){
 return KL_BoChonAssetChungV1.normalize(value);
}
function b20DocLuatAnhThongMinh_(){
 const cache=CacheService.getScriptCache();
 const cached=cache.get(B20_SMART_RULES_CACHE_);
 if(cached)return JSON.parse(cached);
 const response=UrlFetchApp.fetch(B20_SMART_RULES_URL_,{muteHttpExceptions:true,followRedirects:true});
 if(response.getResponseCode()!==200)throw Error('SMART_RULES_HTTP_'+response.getResponseCode());
 const parsed=JSON.parse(response.getContentText('UTF-8'));
 const result=KL_BoChonAssetChungV1.compileRules(parsed,{
  releaseCommit:B20_SMART_RELEASE_,registryCommit:B20_SMART_REGISTRY_COMMIT_
 });
 const text=JSON.stringify(result);
 if(text.length<95000)cache.put(B20_SMART_RULES_CACHE_,text,300);
 return result;
}
function b20ChonHinhNguNghia_(question,registry){
 return KL_BoChonAssetChungV1.select(question,registry);
}
function b20GhepHinhThongMinh_(pack,explicitSidecar,ruleRegistry){
 if(!pack||!Array.isArray(pack.questions))throw Error('SMART_MERGE_INVALID_INPUT');
 return KL_BoChonAssetChungV1.mergeQuestions(pack.questions,explicitSidecar,ruleRegistry);
}
function kiemTraBoChonHinhThongMinh(){
 const rules=b20DocLuatAnhThongMinh_();
 const pack=b20DocPackThu_();
 return {ok:true,ruleCount:rules.rules.length,questionCount:pack.questions.length,
  mappedQuestions:pack.assetScenes?Object.keys(pack.assetScenes.question_scenes):[],
  stagingOnly:true,noWrites:true,noStars:true};
}
