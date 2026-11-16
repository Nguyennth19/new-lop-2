'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});let checks=0;
for(const [name,params] of [['desktop',{viewport:{width:1366,height:768}}],['mobile-390',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await browser.newContext(params),page=await ctx.newPage();
 await page.setContent('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="mathFullScreen" style="padding:10px;box-sizing:border-box;width:100%"><div id="mlContent"></div><div id="mlResults"></div><div id="mlDock"></div><button id="mlShowKeyboard"></button></div></body></html>');
 for(const f of ['58_CSS_Visual_Lab.html','62_CSS_Geometry.html','63_CSS_Pictograph.html'])
  await page.addStyleTag({content:fs.readFileSync(f,'utf8')});
 for(const f of ['53_Geometry_Core.html','54_Tangram_V12.html','55_Pictograph_Core.html','56_Pictograph_View.html','60_Geometry_Fixtures.html','61_Pictograph_Fixtures.html','59_Visual_Public_Assets.html','64_SVG_Math_Public.html','57_Visual_Lab_Host.html'])
  await page.addScriptTag({content:fs.readFileSync(f,'utf8')});
 await page.evaluate(()=>window.moBaiToanQuayLaiVisual=()=>window.__didBack=true);
 const d5=await page.evaluate(()=>window.BE_HOC_VISUAL_LAB.open('D5',document.getElementById('mathFullScreen')));
 assert.equal(d5.ok,true);checks++;
 assert.equal(d5.gradeEnabled,false);checks++;
 assert.equal(await page.locator('.g76b5a-tangram').count(),1);checks++;
 assert(await page.locator('.g74-tangram-piece').count()>=3);checks++;
 await page.locator('.g74-tangram-piece').first().click();checks++;
 assert(await page.locator('.g74-tangram-tool').count()>=2);checks++;
 const d9=await page.evaluate(()=>window.BE_HOC_VISUAL_LAB.open('D9',document.getElementById('mathFullScreen')));
 assert.equal(d9.ok,true);checks++;
 assert.equal(await page.locator('.g74-picto-v11').count(),1);checks++;
 assert.equal(await page.locator('.g74-picto-item').count(),17);checks++;
 await page.locator('.g74-picto-item').first().click();checks++;
 assert.match(await page.locator('.g74-picto-count').first().textContent(),/1/);checks++;
 await page.locator('.g74-picto-question input').first().fill('6');checks++;
 assert.equal(await page.evaluate(()=>window.BE_HOC_VISUAL_LAB.active()),'D9');checks++;
 const assets=await page.evaluate(()=>window.BE_HOC_VISUAL_LAB.open('ASSETS',document.getElementById('mathFullScreen')));
 assert.equal(assets.ok,true);checks++;
 assert.equal(await page.locator('.kl-visual-asset-row img').count(),12);checks++;
 assert.equal(await page.locator('.kl-visual-asset-row').count(),12);checks++;
 await page.locator('.kl-visual-page button').last().click();checks++;
 assert.equal(await page.locator('.kl-visual-asset-row img').count(),12);checks++;
 await page.locator('.kl-visual-lab input[type=search]').fill('KL_SH01_001');checks++;
 assert.equal(await page.locator('.kl-visual-asset-row').count(),1);checks++;
 assert.match(await page.locator('.kl-visual-asset-row').textContent(),/NHÃN ĐÃ DUYỆT/);checks++;
 await page.locator('.kl-visual-back').click();
 assert.equal(await page.evaluate(()=>window.__didBack),true);checks++;
 const sv=await page.evaluate(()=>{
  const screen=document.getElementById('mathFullScreen');
  screen.querySelector('#mlContent').innerHTML='<article data-ml-q-card="B20_A"></article>';
  const result=window.BE_HOC_STRUCTURED_PUBLIC_V2.mountB20({lesson:{id:'toan_b20'},questions:[{id:'B20_A',type:'vertical',valid:true,op:'+',level:'LV1',n1:36,n2:17}]},screen,'LV1');
  return result;
 });
 assert.equal(sv.count,1);checks++;
 const summary=page.locator('.kl-svg-b20-support summary');
 await summary.click();checks++;
 assert.equal(await page.locator('.kl-svg-b20-support svg').count(),1);checks++;
 assert.equal(await page.locator('.kl-svg-b20-support text').count(),2);checks++;
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1),false,name+' overflow');checks++;
 await ctx.close();
}
await browser.close();
console.log('BE_HOC_VISUAL_LAB_CHROMIUM_PASS',checks,'assertions; no GAS deployment, no curriculum binding');
})().catch(e=>{console.error(e);process.exit(1)});
