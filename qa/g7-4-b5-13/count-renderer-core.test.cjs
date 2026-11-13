'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {plan,planComparison,planGrouping,planArithmetic}=require('./count-renderer-core.cjs');
const registry=JSON.parse(fs.readFileSync('qa/g7-4-b5-13-count-renderer-contract.v1.json','utf8'));
const m=JSON.parse(fs.readFileSync('hinh-anh/svg-fallback/fluent-emoji-flat/v1/manifest.v1.json','utf8'));
let checks=0;function eq(a,b,msg){assert.deepEqual(a,b,msg);checks++}
eq(registry.assetCount,46);eq(registry.approvedCount,45);eq(registry.illustrationOnlyCount,1);
eq(new Set(registry.assets.map(x=>x.assetId)).size,46);
const byId=new Map(m.icons.map(x=>[x.id,x]));
for(const a of registry.assets){
 eq(byId.get(a.assetId)?.sha256,a.sourceSha256,'SHA '+a.assetId);
 eq(byId.get(a.assetId)?.visualQaStatus,'OWNER_VISUAL_APPROVED','visual '+a.assetId);
 if(a.status==='COUNT_SAFE_APPROVED'){
  eq(a.objectsPerAsset,1,a.assetId);
  for(const viewport of [320,360,390,600,768,1024]){
   for(const count of [1,3,12,25,50]){
    const p=plan({registry,assetId:a.assetId,requestedCount:count,requestedUnit:a.canonicalUnit,viewportWidth:viewport});
    eq(p.ok,true,a.assetId+' '+viewport+' '+count+': '+p.code);
    eq(p.totalObjects,count);
    eq(p.rows,Math.ceil(count/p.columns));
    eq(p.renderCount,count);
    eq(p.overflowY,'auto');
   }
  }
  eq(plan({registry,assetId:a.assetId,requestedCount:3,requestedUnit:'sai đơn vị',viewportWidth:360}).code,'UNIT_MISMATCH');
 }else{
  eq(a.assetId,'books');
  eq(plan({registry,assetId:a.assetId,requestedCount:3,requestedUnit:'bộ'}).code,'COUNT_NOT_APPROVED');
  eq(plan({registry,assetId:a.assetId,mode:'illustration'}).ok,true);
 }
}
const expected={banana:'quả',grapes:'chùm',watermelon:'miếng',bread:'ổ',cherries:'chùm'};
for(const [id,unit] of Object.entries(expected)){
 eq(registry.assets.find(x=>x.assetId===id).canonicalUnit,unit);
 eq(plan({registry,assetId:id,requestedCount:3,requestedUnit:unit}).totalObjects,3);
}
for(const input of [-1,0,1.5,51,'3',NaN,null])eq(plan({registry,assetId:'rabbit',requestedCount:input,requestedUnit:'con'}).ok,false);
for(const n of [0,200,3841,'360',100.2])eq(plan({registry,assetId:'rabbit',requestedCount:3,requestedUnit:'con',viewportWidth:n}).ok,false);
const grouped=planGrouping({registry,assetId:'pencil',requestedCount:12,requestedUnit:'chiếc',viewportWidth:360,groupSize:3});
eq(grouped.ok,true);eq(grouped.groups.length,4);eq(grouped.groups.reduce((s,x)=>s+x.quantity,0),12);
eq(planGrouping({registry,assetId:'pencil',requestedCount:12,requestedUnit:'chiếc',groupSize:0}).ok,false);
const compare=planComparison([{registry,assetId:'red_apple',requestedCount:8,requestedUnit:'quả'},{registry,assetId:'red_apple',requestedCount:5,requestedUnit:'quả'}]);
eq(compare.ok,true);eq(compare.totals,[8,5]);
eq(planComparison([{registry,assetId:'books',requestedCount:8,requestedUnit:'bộ'},{registry,assetId:'red_apple',requestedCount:5,requestedUnit:'quả'}]).ok,false);
const tamper=structuredClone(registry);tamper.runtimeEnabled=true;
eq(plan({registry:tamper,assetId:'red_apple',requestedCount:3,requestedUnit:'quả'}).ok,false);
const tamper2=structuredClone(registry);tamper2.assets.find(x=>x.assetId==='red_apple').objectsPerAsset=2;
eq(plan({registry:tamper2,assetId:'red_apple',requestedCount:3,requestedUnit:'quả'}).ok,false);
eq(registry.runtimeEnabled,false);eq(registry.productionActivation,false);eq(registry.countInference,false);
eq(plan({registry,assetId:'red_apple',requestedCount:3,requestedUnit:'trái'}).ok,true);
eq(plan({registry,assetId:'watermelon',requestedCount:3,requestedUnit:'lát'}).ok,true);
eq(plan({registry,assetId:'watermelon',requestedCount:3,requestedUnit:'quả'}).code,'UNIT_MISMATCH');
eq(plan({registry,assetId:'bread',requestedCount:3,requestedUnit:'miếng'}).code,'UNIT_MISMATCH');
eq(plan({registry,assetId:'grapes',requestedCount:3,requestedUnit:'quả'}).code,'UNIT_MISMATCH');
eq(plan({registry,assetId:'cherries',requestedCount:3,requestedUnit:'quả'}).code,'UNIT_MISMATCH');
eq(plan({registry,assetId:'banana',requestedCount:3,requestedUnit:'nải'}).code,'UNIT_MISMATCH');
eq(plan({registry,assetId:'books',mode:'illustration',decorativePhrase:'chồng sách'}).label,'chồng sách');
eq(plan({registry,assetId:'cherries',mode:'illustration',decorativePhrase:'quả anh đào (chỉ minh họa)'}).ok,true);
eq(plan({registry,assetId:'cherries',mode:'illustration',decorativePhrase:'3 quả anh đào'}).code,'INVALID_DECORATIVE_PHRASE');
const plus=planArithmetic({registry,assetId:'rabbit',requestedUnit:'con',operator:'+',left:7,right:5,viewportWidth:320});
eq(plus.ok,true);eq(plus.total,12);eq(plus.initial.totalObjects,7);eq(plus.second.totalObjects,5);
const minus=planArithmetic({registry,assetId:'red_apple',requestedUnit:'quả',operator:'-',left:9,right:4,viewportWidth:360});
eq(minus.ok,true);eq(minus.total,5);eq(minus.removedCount,4);
eq(planArithmetic({registry,assetId:'rabbit',requestedUnit:'con',operator:'-',left:3,right:5}).ok,false);
eq(planArithmetic({registry,assetId:'books',requestedUnit:'bộ',operator:'+',left:3,right:5}).ok,false);
eq(planArithmetic({registry,assetId:'rabbit',requestedUnit:'con',operator:'+',left:45,right:9}).ok,false);
eq(planArithmetic({registry,assetId:'rabbit',requestedUnit:'quả',operator:'+',left:4,right:2}).ok,false);
console.log('PASS '+checks+'/'+checks+' assertions; count grid 45 assets × 6 viewports × 5 counts; special units and fail-closed');
