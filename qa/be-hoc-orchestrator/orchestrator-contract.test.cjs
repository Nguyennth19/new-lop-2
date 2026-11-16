'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let count=0;const ok=(x,m)=>{assert.ok(x,m);count++},eq=(a,b)=>{assert.deepEqual(a,b);count++};
const gui=fs.readFileSync('GiaoDien.html','utf8'),math=fs.readFileSync('19_KhongGianHocToan.html','utf8');
const modules=['65_D1_Type1','66_D3_Core','67_D3_View','68_D4_Core','69_D4_View','70_D5_View','71_D6_Core','72_D6_View','73_D7_Core','74_D7_View','75_D8_Core','76_D8_View','77_D8A_Core','78_D8A_View','79_D8B_View','80_D10_Core','81_D10_Adapter','83_Visual_Orchestrator'];
for(const m of modules)eq(gui.split("napThanhPhan('"+m+"')").length-1,1);
eq(gui.split("napThanhPhan('82_CSS_OrchestratorModules')").length-1,1);
ok(math.includes('BE_HOC_VISUAL_ORCHESTRATOR.mountLesson(fullData,root,view)'));
const ctx={console,window:{},Map,Set};ctx.globalThis=ctx.window;
const run=f=>vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
for(const f of ['47_D2V12_Core.html','48_D2V12_View.html','53_Geometry_Core.html','55_Pictograph_Core.html','56_Pictograph_View.html','59_Visual_Public_Assets.html',...modules.map(m=>m+'.html')])run(f);
const api=ctx.window.BE_HOC_VISUAL_ORCHESTRATOR;
ok(api);eq(api.allRendererIds.length,12);eq(Object.keys(api.registry).length,12);
for(const [id,c] of Object.entries(api.registry)){
 ok(ctx.window[c.core]!=null,'core not loaded '+id);
 if(c.kind==='COMPILE_VIEW')ok(ctx.window[c.view]!=null,'view not loaded '+id);
}
ok(ctx.window.BE_HOC_ASSETS_288.count===288);
const p=ctx.window.BE_HOC_ASSETS_288.resolve('KL_SH01_001');ok(p.ok);
const seen=vm.runInNewContext("window.BE_HOC_VISUAL_ORCHESTRATOR.safePublic({items:[{prompt:'Táo',units:4}]})",ctx);eq(seen.ok,true);
for(const key of ['answer','answerKey','expectedCarry','correctAnswer','solution','gradingKey','studentId']){
 const denied=vm.runInNewContext("window.BE_HOC_VISUAL_ORCHESTRATOR.safePublic({"+key+":42})",ctx);
 eq(denied.reason,'PRIVATE_FIELD');
}
const forbidden=vm.runInNewContext("window.BE_HOC_VISUAL_ORCHESTRATOR.safePublic({a:{correctAnswer:'53'}})",ctx);eq(forbidden.reason,'PRIVATE_FIELD');
const unknown=vm.runInNewContext("window.BE_HOC_VISUAL_ORCHESTRATOR.resolve({rendererId:'D5',lessonId:'toan_b20',questionId:'q1',questionType:'vertical',skillId:'ADD_WITH_CARRY_2DIGIT',publicVariant:{}})",ctx);eq(unknown.reason,'LESSON_POLICY_NOT_APPROVED');
const d2=vm.runInNewContext("window.BE_HOC_VISUAL_ORCHESTRATOR.resolve({rendererId:'D2',lessonId:'toan_b20',questionId:'q1',questionType:'vertical',skillId:'ADD_WITH_CARRY_2DIGIT',publicVariant:{}})",ctx);eq(d2.ok,true);
const d2dup=vm.runInNewContext("window.BE_HOC_VISUAL_ORCHESTRATOR.mountEnvelope({ownerDocument:{}},{rendererId:'D2',lessonId:'toan_b20',questionId:'q1',questionType:'vertical',skillId:'ADD_WITH_CARRY_2DIGIT',publicVariant:{}})",ctx);eq(d2dup.reason,'D2_DELEGATED_TO_MANUAL_CARRY_HOST');
eq(api.release,'SOURCE_TEST_ONLY');
console.log('VISUAL_ORCHESTRATOR_V1_CORE_PASS',count,'assertions');
