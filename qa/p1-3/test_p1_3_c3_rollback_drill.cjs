'use strict';
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const server=fs.readFileSync('P13_C2_CauHinhTEST.gs','utf8');
const template=fs.readFileSync('GiaoDien.html','utf8');
const bridgeTag="napThanhPhan('90_C2_Test_Integration_Bridge')";
const unifiedTag="napThanhPhan('89_Asset_Unified_Resolver_TEST')";
const flags={};
const ctx={PropertiesService:{getScriptProperties:()=>({getProperty:k=>flags[k]??null})}};
vm.createContext(ctx);vm.runInContext(server,ctx);
const marker='<'+ '? if (p13C2GASTestEnabled_()) { ?>';
const close='<'+ '? } ?>';
assert(template.includes(marker));assert(template.includes(close));
function compile(){
 const on=ctx.p13C2GASTestEnabled_();
 const html=template.replace(marker, '\u0000C3_GATE_START\u0000').replace(close,'\u0000C3_GATE_END\u0000');
 const start=html.indexOf('\u0000C3_GATE_START\u0000'),end=html.indexOf('\u0000C3_GATE_END\u0000');
 assert(start>=0&&end>start);
 const head=html.slice(0,start),part=html.slice(start+'\u0000C3_GATE_START\u0000'.length,end),tail=html.slice(end+'\u0000C3_GATE_END\u0000'.length);
 return head+(on?part:'')+tail;
}
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const offBaseline=compile(),baselineHash=digest(offBaseline);
assert(!offBaseline.includes(bridgeTag)&&!offBaseline.includes(unifiedTag));
assert.equal(ctx.p13C2Status_().enabled,false);
flags.LOP2_ENVIRONMENT='GAS_TEST';
flags.P13_C2_OWNER_TEST_APPROVAL='APPROVED_FOR_GAS_TEST';
assert.equal(ctx.p13C2GASTestEnabled_(),false,'owner approval alone never enables');
flags.P13_C2_UNIFIED_RESOLVER='ENABLED';
const on=compile();
assert.notEqual(digest(on),baselineHash);
assert(on.includes(bridgeTag)&&on.includes(unifiedTag));
assert.equal(ctx.p13C2Status_().enabled,true);
flags.P13_C2_UNIFIED_RESOLVER='DISABLED'; // kill-switch
const rolled=compile();
assert.equal(digest(rolled),baselineHash,'OFF rollback must restore byte-identical template');
assert.equal(ctx.p13C2Status_().enabled,false);
flags.P13_C2_UNIFIED_RESOLVER='ENABLED';
flags.LOP2_ENVIRONMENT='PRODUCTION';
assert.equal(ctx.p13C2GASTestEnabled_(),false,'production environment override must deny');
assert.equal(digest(compile()),baselineHash);
delete flags.P13_C2_UNIFIED_RESOLVER;
assert.equal(digest(compile()),baselineHash);
console.log('P1_3_C3_OFF_ON_OFF_ROLLBACK_SIMULATION_PASS',JSON.stringify({
 initialOff:true,onlyExplicitTestOn:true,disabledRestoresIdenticalTemplate:true,productionFailClosed:true,
 baselineSha256:baselineHash,mode:'SIMULATED_SCRIPT_PROPERTIES_NOT_LIVE_DEPLOYMENT'}));
