'use strict';
/* G7.4-B.5.13 TEST only — pure, deterministic grid/scene planner. */
const CountRendererG74 = (() => {
  const isInt=n=>Number.isSafeInteger(n);
  const blocked=(code)=>({ok:false,status:'BLOCKED',code});
  function plan({registry,assetId,requestedCount,requestedUnit,viewportWidth=360,mode='count',groupSize=null}={}) {
    if (!registry || registry.schemaVersion!=='g7-4-b5-13-count-renderer-contract-v1' ||
      registry.runtimeEnabled!==false || registry.productionActivation!==false || registry.countInference!==false)
      return blocked('INVALID_STAGING_POLICY');
    const item=(registry.assets||[]).find(a=>a.assetId===assetId);
    if (!item)return blocked('UNKNOWN_ASSET');
    if(mode==='illustration') return {ok:true,status:'ILLUSTRATION',assetId,renderCount:1,
      label:item.canonicalPhrase,unit:null,quantityDisplayed:false};
    if(mode!=='count')return blocked('INVALID_MODE');
    if(item.status!=='COUNT_SAFE_APPROVED'||item.objectsPerAsset!==1) return blocked('COUNT_NOT_APPROVED');
    if(typeof requestedUnit!=='string'||requestedUnit.trim()!==item.canonicalUnit) return blocked('UNIT_MISMATCH');
    if(!isInt(requestedCount)||requestedCount<1||requestedCount>50)return blocked('INVALID_COUNT');
    if(!isInt(viewportWidth)||viewportWidth<240||viewportWidth>3840)return blocked('INVALID_VIEWPORT');
    const columns=viewportWidth<380?4:viewportWidth<600?5:viewportWidth<900?8:10;
    const iconPx=viewportWidth<380?40:viewportWidth<600?44:viewportWidth<900?48:52;
    const gapPx=viewportWidth<600?8:12;
    const rows=Math.ceil(requestedCount/columns);
    let groups=[];
    if(groupSize!==null){
      if(!isInt(groupSize)||groupSize<1||groupSize>requestedCount)return blocked('INVALID_GROUP_SIZE');
      for(let start=0;start<requestedCount;start+=groupSize)
        groups.push({start,end:Math.min(requestedCount,start+groupSize),quantity:Math.min(groupSize,requestedCount-start)});
    }
    return {ok:true,status:'READY_TO_RENDER',assetId,canonicalUnit:item.canonicalUnit,
      label:item.canonicalPhrase,count:requestedCount,renderCount:requestedCount,
      objectsPerAsset:1,totalObjects:requestedCount,columns,rows,iconPx,gapPx,groups,
      overflowY:'auto',containerMaxHeightPx:viewportWidth<600?330:400,
      sourceSha256:item.sourceSha256,quantityDisplayed:true,mode:'TEST_ONLY',
      runtimeEnabled:false,productionActivation:false};
  }
  function planComparison(options){
    if(!Array.isArray(options)||options.length<2||options.length>4)return blocked('INVALID_COMPARISON');
    const scenes=options.map(x=>plan(x));
    if(scenes.some(x=>!x.ok))return blocked('COMPARISON_ITEM_BLOCKED');
    return {ok:true,scenes,totals:scenes.map(x=>x.totalObjects)};
  }
  function planGrouping(options){
    const scene=plan({...options,groupSize:options?.groupSize});
    return scene.ok?{...scene,questionType:'GROUPING'}:scene;
  }
  return {plan,planComparison,planGrouping};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=CountRendererG74;
