/** G7.4-B.3: read-only JSON asset scene sidecar for B20 staging.
 * Original runtime questions, answers, SGK/SBT and score logic remain unchanged.
 * URL is pinned to the commit containing JSON; no mutable branch URLs.
 */
const B20_ASSET_SCENE_JSON_URL_='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/178594fcd0c311dc6a1a3e7038c59a7dbd10e869/du-lieu/bien-the/asset-scenes/toan_b20.asset-scenes.json';
const B20_ASSET_SCENE_CACHE_KEY_='b20_asset_scene_v1_178594';
function b20DocAssetScenes_(){
  const cached=CacheService.getScriptCache().get(B20_ASSET_SCENE_CACHE_KEY_);
  if(cached)return JSON.parse(cached);
  const response=UrlFetchApp.fetch(B20_ASSET_SCENE_JSON_URL_,{muteHttpExceptions:true,followRedirects:true});
  if(response.getResponseCode()!==200)throw Error('Không lấy được Asset Scene JSON: HTTP '+response.getResponseCode());
  const obj=JSON.parse(response.getContentText('UTF-8'));
  if(!obj||obj.schema_version!=='kidlearn-variant-asset-scene-v1'||
     obj.lesson_id!=='toan_b20'||obj.mode!=='STAGING_ONLY'||
     obj.catalog_release_commit!=='653bfbc73002a188dcea0b714247b84cc28a4fed'||
     !obj.question_scenes||typeof obj.question_scenes!=='object'||Array.isArray(obj.question_scenes))
     throw Error('Asset Scene JSON sai schema hoặc release pin');
  const keys=Object.keys(obj.question_scenes);
  if(keys.length>30)throw Error('Số ánh xạ ảnh bất thường');
  const map={};
  const idPattern=/^KL_(?:SH|M)(?:0[1-9]|1[0-2])_\d{3}$/;
  for(const qid of keys){
    if(!/^VAR_B20_20261112_\d{3}$/.test(qid))throw Error('Asset Scene Question ID không hợp lệ');
    const entry=obj.question_scenes[qid];
    if(!entry||entry.usage!=='decorative'||
       !['LABEL_APPROVED','OWNER_SIGNOFF_PENDING'].includes(entry.label_approval_status)||
       !entry.scene||!Array.isArray(entry.scene.groups)||!entry.scene.groups.length||entry.scene.groups.length>8)
       throw Error('Asset Scene entry không hợp lệ: '+qid);
    if(entry.label_approval_status!=='LABEL_APPROVED'&&entry.pilot_only!==true)
       throw Error('Ảnh chờ duyệt không được tự động kích hoạt: '+qid);
    let count=0;
    const groups=entry.scene.groups.map(group=>{
      if(!group||!Array.isArray(group.items)||!group.items.length||group.items.length>24)
        throw Error('Nhóm Asset Scene không hợp lệ: '+qid);
      const items=group.items.map(item=>{
        if(!item||typeof item.assetId!=='string'||!idPattern.test(item.assetId)||
           !Number.isInteger(item.count)||item.count<1||item.count>24)throw Error('Asset ID/số lượng không hợp lệ: '+qid);
        count+=item.count;
        return {assetId:item.assetId,count:item.count};
      });
      return {label:String(group.label||'').slice(0,100),items:items};
    });
    if(count>48)throw Error('Asset Scene vượt quá 48 vật: '+qid);
    map[qid]={
      usage:'decorative',semantic:String(entry.semantic||'').slice(0,120),
      label_approval_status:entry.label_approval_status,pilot_only:entry.pilot_only===true,
      fallback_emoji:String(entry.fallback_emoji||'').slice(0,6),scene:{groups:groups}
    };
  }
  const result={schema_version:obj.schema_version,mode:obj.mode,question_scenes:map};
  const text=JSON.stringify(result);
  if(text.length<95000)CacheService.getScriptCache().put(B20_ASSET_SCENE_CACHE_KEY_,text,300);
  return result;
}
/** Editor check: returns only metadata, never records any progress. */
function kiemTraB20AssetScenes(){
  const data=b20DocAssetScenes_(),ids=Object.keys(data.question_scenes);
  return {ok:true,schema:data.schema_version,mappedQuestions:ids,stagingOnly:true,noWrites:true};
}
