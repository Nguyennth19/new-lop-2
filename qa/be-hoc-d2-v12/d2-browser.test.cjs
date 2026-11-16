'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let total=0;
 for(const [label,options] of [['desktop',{viewport:{width:1366,height:768}}],['mobile-emulation',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const ctx=await browser.newContext(options),page=await ctx.newPage();
  await page.setContent('<!DOCTYPE html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><div id="mathFullScreen" style="box-sizing:border-box;padding:10px;width:100%;"><div id="mlContent"><article data-ml-q-card="VAR_20_X" class="ml-card"><div class="ml-card-top">Câu 1</div><div class="ml-vertical-matrix"><input data-ml-field="VAR_20_X:ones" value=""></div></article></div></div></body></html>');
  await page.addStyleTag({content:fs.readFileSync('50_CSS_D2V12.html','utf8')});
  await page.addScriptTag({content:fs.readFileSync('47_D2V12_Core.html','utf8')});
  await page.addScriptTag({content:fs.readFileSync('48_D2V12_View.html','utf8')});
  await page.addScriptTag({content:fs.readFileSync('49_D2V12_BaiHoc.html','utf8')});
  let outcome=await page.evaluate(()=>window.BE_HOC_D2_V12.mountB20({lesson:{id:'toan_b20'},questions:[{id:'VAR_20_X',type:'vertical',valid:true,op:'+',level:'LV1',n1:36,n2:17,answer:53}]},document.getElementById('mathFullScreen'),'LV1'));
  assert.equal(outcome.practiceCards,1);total++;
  await page.locator('.kl-d2-practice summary').click();
  await page.locator('.kl-col-v12-answer').first().waitFor();
  assert.equal(await page.locator('.kl-col-v12-answer').count(),2);total++;
  const ones=page.locator('[data-answer="result_ones"]');await ones.fill('3');total++;
  const tens=page.locator('[data-answer="result_tens"]');await tens.fill('5');total++;
  await page.locator('.kl-col-v12-transition').click();
  assert.equal(await page.locator('.kl-col-v12-transition').getAttribute('aria-pressed'),'true');total++;
  await page.locator('.kl-col-v12-send').click();
  const msg=await page.locator('.kl-col-v12-status').textContent();assert.match(msg,/chưa|bài chính|phiên luyện/i);total++;
  assert.equal(await page.locator('[data-ml-field="VAR_20_X:ones"]').inputValue(),'');total++;
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);assert.equal(overflow,false,label+' overflows');total++;
  if(label==='mobile-emulation'){let h=await page.locator('.kl-col-v12-transition').evaluate(x=>x.getBoundingClientRect().height);assert(h>=44);total++;}
  await ctx.close();
 }
 await browser.close();console.log('BE_HOC_D2_V12_CHROMIUM_DESKTOP_MOBILE_PASS',total,'assertions; standalone UI integration harness not GAS deployment');
})().catch(err=>{console.error(err);process.exit(1)});
