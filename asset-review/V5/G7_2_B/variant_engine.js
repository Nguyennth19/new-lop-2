/* G7.2-B pilot only. No DOM, no fetch, no modification of source image assets. */

function stableIndex(ids,seed) {
 let h=2166136261;
 for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0)%ids.length;
}

function validateInput(q) {
 if(!q||typeof q!=="object")return "INVALID_INPUT";
 const roles=["DECORATIVE","ILLUSTRATIVE","DATA_BEARING","SOURCE_LOCKED"];
 if(!roles.includes(q.role))return "INVALID_ROLE";
 if(q.role!=="SOURCE_LOCKED" && typeof q.object!=="string")return "INVALID_OBJECT";
 if(q.count!==undefined&&typeof q.count==="number"&&(!Number.isSafeInteger(q.count)||q.count<1||q.count>100))return "INVALID_COUNT";
 if(q.groups!==undefined&&(!Array.isArray(q.groups)||q.groups.length===0||q.groups.length>10||q.groups.some(g=>!Number.isSafeInteger(g.count)||g.count<1||g.count>100)||q.groups.reduce((s,g)=>s+g.count,0)>100))return "INVALID_GROUPS";
 if(q.value!==undefined&&(!Number.isSafeInteger(q.value)||q.value<0||q.value>1000))return "INVALID_VALUE";
 return "";
}

function eligibleAssets(q,catalog,profiles){
 const input=q||{}, catalogIds=new Set(catalog.assets.map(a=>a.id));
 return profiles.profiles.filter(p=>{
  if(!catalogIds.has(p.asset_id)||p.object!==input.object)return false;
  if(input.color&&!p.colors.includes(input.color))return false;
  if(input.closure&&p.features.closure!==input.closure)return false;
  if(input.shape&&p.features.shape!==input.shape&&p.features.kind!==input.shape)return false;
  if(input.style&&p.features.style!==input.style)return false;
  if(input.form&&input.form!==p.form)return false;
  if(input.role==="DATA_BEARING" && p.form==="stack")return false;
  if(typeof input.count==="number" && input.role==="DATA_BEARING" && p.form==="pair" && input.count!==2 && !input.countPairs)return false;
  if(input.object==="gift_box"&&input.count==="plural_unspecified")return p.form==="stack";
  return true;
 }).sort((a,b)=>a.asset_id.localeCompare(b.asset_id));
}

function buildPlan(query,catalog,profiles,seed="demo:question:attempt-1"){
 const error=validateInput(query);
 if(error)return {status:"INVALID_REQUEST",reason:error,placements:[]};
 if(query.role==="SOURCE_LOCKED"){
  const existing=catalog.assets.find(x=>x.id===query.asset_id);
  if(!existing)return {status:"ASSET_REQUIRED_REVIEW",reason:"MISSING_PINNED_SOURCE_FIGURE",placements:[]};
  return {status:"OK",mode:"PINNED",asset_ids:[existing.id],placements:[{asset_id:existing.id,group:"source",position:0}],randomized:false,qa:"SOURCE_IMAGE_PINNED"};
 }
 const pool=eligibleAssets(query,catalog,profiles);
 if(query.object==="hundred_grid"){if(query.cells!==100)return {status:"INVALID_REQUEST",reason:"HUNDRED_GRID_REQUIRES_100_CELLS",placements:[]};return {status:"OK",mode:"UI_GRID",asset_ids:[],cells:100,rows:10,columns:10,placements:[],randomized:false,qa:"STRUCTURE_FROM_VARIANT_DATA"}};
 if(query.object==="ten_strip"){if(query.represented_units!==10)return {status:"INVALID_REQUEST",reason:"TEN_STRIP_REQUIRES_10_UNITS",placements:[]};return {status:"OK",mode:"UI_TEN_STRIP",asset_ids:[],cells:10,rows:1,columns:10,placements:[],randomized:false,qa:"STRUCTURE_FROM_VARIANT_DATA"}};
 if(query.object==="rain"&&query.role==="DECORATIVE"){if(!pool.length)return {status:"ASSET_REQUIRED_REVIEW",reason:"NO_RAIN_ASSET",placements:[]};return {status:"OK",mode:"DECORATIVE_PATTERN",asset_ids:pool.map(p=>p.asset_id),placements:[{asset_id:pool[0].asset_id,group:"decoration",position:0}],randomized:false,qa:"NOT_COUNT_DATA"}};
 if(!pool.length)return {status:"ASSET_REQUIRED_REVIEW",reason:"NO_SEMANTICALLY_ELIGIBLE_ASSET",placements:[]};
 const chosen=pool[stableIndex(pool,seed)];
 const meta={status:"OK",mode:"REPEAT_ASSET",asset_ids:pool.map(x=>x.asset_id),selected_asset_id:chosen.asset_id,randomized:pool.length>1,seed:String(seed),placements:[],qa:chosen.evidence};
 if(query.object==="mass"||query.object==="capacity"){
  if(!Number.isSafeInteger(query.value)||!["kg","l"].includes(query.unit)||(query.object==="mass"&&query.unit!=="kg")||(query.object==="capacity"&&query.unit!=="l"))return {status:"INVALID_REQUEST",reason:"MEASUREMENT_REQUIRES_EXACT_VALUE_AND_UNIT",placements:[]};
  meta.mode="MEASUREMENT_SCHEMATIC";meta.label={value:query.value,unit:query.unit,text:`${query.value} ${query.unit}`,source:"VARIANT_INPUT_NOT_SOURCE_BITMAP"};
  meta.calibration=query.object==="capacity"?"GENERATED_SCHEMATIC_NOT_BITMAP_SCALE":"GENERATED_TEXT_NOT_BITMAP_WEIGHT";
  meta.placements=[{asset_id:chosen.asset_id,group:"measurement",position:0}];
  return meta;
 }
 if(query.object==="gift_box"&&query.count==="plural_unspecified"){
  meta.mode="ILLUSTRATIVE_STACK";meta.placements=[{asset_id:chosen.asset_id,group:"decoration",position:0}];meta.numeric_claim=false;return meta;
 }
 if((query.role==="DECORATIVE"||query.role==="ILLUSTRATIVE")&&(query.count===undefined||typeof query.count==="string")){
  meta.mode="DECORATIVE_SINGLE";meta.placements=[{asset_id:chosen.asset_id,group:"decoration",position:0}];meta.numeric_claim=false;return meta;
 }
 if(query.object==="shoes"){
  if(chosen.form!=="pair")return {status:"ASSET_REQUIRED_REVIEW",reason:"PAIR_REQUIRED",placements:[]};
  meta.mode="SINGLE_PAIR";meta.placements=[{asset_id:chosen.asset_id,group:"pair",position:0,represented_items:2}];meta.represented_items=2;meta.represented_pairs=1;return meta;
 }
 const n=query.groups?query.groups.reduce((s,g)=>s+g.count,0):query.count;
 if(!Number.isSafeInteger(n)||n<1||n>100)return {status:"INVALID_REQUEST",reason:"COUNT_OR_GROUPS_REQUIRED",placements:[]};
 if(chosen.form!=="single"||chosen.objects_per_image!==1)return {status:"ASSET_REQUIRED_REVIEW",reason:"SINGLE_OBJECT_PILOT_PROFILE_REQUIRED",placements:[]};
 meta.count=n;
 if(query.groups){let i=0;for(const g of query.groups){for(let j=0;j<g.count;j++)meta.placements.push({asset_id:chosen.asset_id,group:String(g.pen||g.name||i),position:j});i++}meta.mode="GROUPED_REPEAT";meta.group_totals=query.groups.map(g=>g.count)}
 else for(let i=0;i<n;i++)meta.placements.push({asset_id:chosen.asset_id,group:"main",position:i});
 if(query.layout==="stack")meta.mode="STACKED_REPEAT";
 meta.numeric_claim=true;meta.count_profile_evidence=chosen.evidence;meta.content_signoff_required=true;
 return meta;
}

if(typeof module!=="undefined"&&module.exports)module.exports={stableIndex,validateInput,eligibleAssets,buildPlan};

if(typeof globalThis!=="undefined")globalThis.G72B={stableIndex,validateInput,eligibleAssets,buildPlan};
