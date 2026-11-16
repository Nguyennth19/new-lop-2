'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const chrome=await chromium.launch({headless:true,args:['--no-sandbox']});
 let n=0;
 for(const [label,ctxOpts] of [
  ['desktop',{viewport:{width:1366,height:768}}],
  ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]
 ]){
  const ctx=await chrome.newContext(ctxOpts),page=await ctx.newPage();
  await page.setContent('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="mathFullScreen"><section id="mlContent"></section></main></body></html>');
  const modules=['47_D2V12_Core','48_D2V12_View','53_Geometry_Core','55_Pictograph_Core','56_Pictograph_View','59_Visual_Public_Assets',
   '65_D1_Type1','66_D3_Core','67_D3_View','68_D4_Core','69_D4_View','70_D5_View','71_D6_Core','72_D6_View',
   '73_D7_Core','74_D7_View','75_D8_Core','76_D8_View','77_D8A_Core','78_D8A_View','79_D8B_View','80_D10_Core','81_D10_Adapter','85_Fluent_Asset_46','83_Visual_Orchestrator'];
  for(const m of modules)await page.addScriptTag({content:fs.readFileSync(m+'.html','utf8')});
  const result=await page.evaluate(()=>{
   const api=window.BE_HOC_VISUAL_ORCHESTRATOR;
   const a=api.chooseAsset({assetId:'KL_SH01_001',visualIntent:'DECORATIVE'});
   const b=api.chooseAsset({assetId:'KL_SH01_001',visualIntent:'EXACT_COUNT',exactQuantity:4,
    unitCountEvidence:{approved:true,assetId:'KL_SH01_001',objectsPerAsset:1,unit:'single-object'}});
   const bad=api.resolve({rendererId:'D5',lessonId:'toan_b20',questionId:'fake',questionType:'vertical',
    skillId:'ADD_WITH_CARRY_2DIGIT',publicVariant:{}});
   const good=api.resolve({rendererId:'D2',lessonId:'toan_b20',questionId:'q1',questionType:'vertical',
    skillId:'ADD_WITH_CARRY_2DIGIT',publicVariant:{}});
   return {names:Object.keys(api.registry),images:window.BE_HOC_ASSETS_288.count,
    decorator:a.ok,denied:b.reason,bad:bad.reason,good:good.ok};
  });
  assert.equal(result.names.length,12);n++;
  assert.equal(result.images,288);n++;
  assert.equal(result.decorator,true);n++;
  assert.equal(result.denied,'WEBP_EXACT_COUNT_UNIT_NOT_PINNED');n++;
  assert.equal(result.bad,'LESSON_POLICY_NOT_APPROVED');n++;
  assert.equal(result.good,true);n++;
  const fluent=await page.evaluate(()=>window.BE_HOC_VISUAL_ORCHESTRATOR.chooseAsset({assetId:'FLUENT:banana',visualIntent:'EXACT_COUNT',countUnit:'quả',exactQuantity:4}));
  assert.equal(fluent.ok,true);n++;
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
  assert(widths.scroll<=widths.view+1,label+' overflow');n++;
  await ctx.close();
 }
 await chrome.close();
 console.log('VISUAL_ORCHESTRATOR_V1_CHROMIUM_PASS',n,'assertions');
})().catch(e=>{console.error(e);process.exit(1)});
