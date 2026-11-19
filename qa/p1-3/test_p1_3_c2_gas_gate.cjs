'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
const page=read('GiaoDien.html'),server=read('P13_C2_CauHinhTEST.gs');
const bridge=read('90_C2_Test_Integration_Bridge.html');
const flagContext={PropertiesService:{getScriptProperties:()=>({getProperty:name=>flagContext.props[name]||null})}};
vm.createContext(flagContext);
vm.runInContext(server,flagContext);
const cases=[
 [{},false],
 [{LOP2_ENVIRONMENT:'GAS_TEST'},false],
 [{P13_C2_UNIFIED_RESOLVER:'ENABLED'},false],
 [{LOP2_ENVIRONMENT:'PRODUCTION',P13_C2_UNIFIED_RESOLVER:'ENABLED',P13_C2_OWNER_TEST_APPROVAL:'APPROVED_FOR_GAS_TEST'},false],
 [{LOP2_ENVIRONMENT:'GAS_TEST',P13_C2_UNIFIED_RESOLVER:'DISABLED',P13_C2_OWNER_TEST_APPROVAL:'APPROVED_FOR_GAS_TEST'},false],
 [{LOP2_ENVIRONMENT:'GAS_TEST',P13_C2_UNIFIED_RESOLVER:'ENABLED',P13_C2_OWNER_TEST_APPROVAL:'APPROVED_FOR_GAS_TEST'},true]
];
for(const [props,expected] of cases){
 flagContext.props=props;
 assert.equal(flagContext.p13C2GASTestEnabled_(),expected);
 assert.equal(flagContext.p13C2Status_().productionAuthorized,false);
}
const marker="<? if (p13C2GASTestEnabled_()) { ?>";
const close="<? } ?>";
assert.equal(page.split(marker).length-1,1);assert.equal(page.split(close).length-1,1);
const before=page.indexOf("napThanhPhan('83_Visual_Orchestrator')");
const start=page.indexOf(marker),newAsset=page.indexOf("napThanhPhan('89_Asset_Unified_Resolver_TEST')"),newBridge=page.indexOf("napThanhPhan('90_C2_Test_Integration_Bridge')"),after=page.indexOf("napThanhPhan('19_KhongGianHocToan')");
assert(before<start&&start<newAsset&&newAsset<newBridge&&newBridge<after);
assert(bridge.includes('originalOrchestrator:legacy'));
assert(!bridge.includes('legacy.mountLesson='));
assert(!bridge.includes('legacy.chooseAsset='));
assert.equal(page.split("napThanhPhan('83_Visual_Orchestrator')").length-1,1);
for(const [props,expected] of cases){
 let html=page.replace(/<\? if \(p13C2GASTestEnabled_\(\)\) \{ \?>[\s\S]*?<\? \} \?>/,block=>expected?block.replace(marker,'').replace(close,''):'');
 assert.equal(html.includes("napThanhPhan('89_Asset_Unified_Resolver_TEST')"),expected);
 assert.equal(html.includes("napThanhPhan('90_C2_Test_Integration_Bridge')"),expected);
}
const modules=['59_Visual_Public_Assets','85_Fluent_Asset_46','87_Characters_Drive_30','88_Visual_Semantic_Router','83_Visual_Orchestrator'];
const ctx={window:{},console,Map,Set};ctx.globalThis=ctx.window;vm.createContext(ctx);
for(const m of modules)vm.runInContext(read(m+'.html'),ctx,{filename:m});
const baseline=ctx.window.BE_HOC_VISUAL_ORCHESTRATOR;
const baselineChoose=baseline.chooseAsset,baselineMount=baseline.mountLesson;
vm.runInContext(read('89_Asset_Unified_Resolver_TEST.html'),ctx);
vm.runInContext(bridge,ctx);
const b=ctx.window.BE_HOC_C2_TEST_BRIDGE;
assert(b.ready&&b.release==='GAS_TEST_ONLY');
assert.equal(b.originalOrchestrator,baseline);
assert.equal(ctx.window.BE_HOC_VISUAL_ORCHESTRATOR.chooseAsset,baselineChoose);
assert.equal(ctx.window.BE_HOC_VISUAL_ORCHESTRATOR.mountLesson,baselineMount);
assert.equal(b.mountDecorative({}, {assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT'}).reason,'C2_DECORATIVE_ONLY');
assert.equal(b.planQuestion({lesson:{id:'toan_b20'}},{id:'q1',type:'vertical',skillId:'ADD_WITH_CARRY_2DIGIT',visualContract:{rendererId:'D5',assetId:'KL2_ROBOT_01_STAND',visualIntent:'DECORATIVE',publicVariant:{}}}).ok,false);
assert.equal(b.mountDecorative({appendChild(){}},{assetId:'KL2_ROBOT_01_STAND',visualIntent:'CHOICE'}).ok,false);
console.log('P1_3_C2_GAS_TEST_GATE_PASS',JSON.stringify({serverFlagCases:cases.length,defaultOff:true,productionOff:true,loadOrder:true,orchestratorIdentityPreserved:true,authorizationDenied:true,release:'GAS_TEST_ONLY'}));
