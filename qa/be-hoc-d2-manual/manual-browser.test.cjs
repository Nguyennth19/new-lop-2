'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});let total=0;
 for(const [label,option] of [['desktop',{viewport:{width:1366,height:768}}],['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const ctx=await browser.newContext(option),page=await ctx.newPage();
  await page.setContent('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><div id="mathFullScreen" style="width:100%;box-sizing:border-box;padding:8px"><div id="mlContent"><article data-ml-q-card="THREE_QA_001" class="ml-mental-row"><input data-ml-field="THREE_QA_001:answer"></article><article data-ml-q-card="VERT_QA_001" class="ml-card"><input data-ml-field="VERT_QA_001:ones"></article></div></div></body></html>');
  await page.addStyleTag({content:fs.readFileSync('50_CSS_D2V12.html','utf8')});
  for(const p of ['47_D2V12_Core.html','48_D2V12_View.html','52_D2_ManualCarry.html','49_D2V12_BaiHoc.html'])await page.addScriptTag({content:fs.readFileSync(p,'utf8')});
  const out=await page.evaluate(()=>window.BE_HOC_D2_V12.mountB20({lesson:{id:'toan_b20'},questions:[
    {id:'THREE_QA_001',type:'mental',variantType:'three',valid:true,level:'LV1',n1:18,n2:27,n3:39},
    {id:'VERT_QA_001',type:'vertical',op:'+',valid:true,level:'LV1',n1:36,n2:17}
  ]},document.getElementById('mathFullScreen'),'LV1'));
  assert.equal(out.practiceCards,2);total++;
  const cards=page.locator('.kl-d2-practice');await cards.nth(0).locator('summary').click();
  const carry=cards.nth(0).locator('.kl-d2-manual-carry');await carry.waitFor();
  assert.equal(await carry.inputValue(),'');total++;
  assert.equal(await cards.nth(0).locator('.kl-d2-multi-row.kl-col-v12-sign').count(),1);total++;
  assert.equal((await cards.nth(0).locator('.kl-d2-multi-row.kl-col-v12-digit').allTextContents()).join(''),'39');total++;
  await carry.fill('2');assert.equal(await carry.inputValue(),'2');total++;
  await cards.nth(0).locator('[data-answer="result_ones"]').fill('4');
  await cards.nth(0).locator('[data-answer="result_tens"]').fill('8');
  await cards.nth(0).locator('.kl-col-v12-send').click();
  assert.match(await cards.nth(0).locator('.kl-col-v12-status').textContent(),/chưa|luyện|bài chính/i);total++;
  assert.equal(await page.locator('[data-ml-field="THREE_QA_001:answer"]').inputValue(),'');total++;
  await carry.focus();
  assert.equal(await page.evaluate(()=>window.BE_HOC_D2_V12.handleKey('3')),true);total++;
  assert.equal(await carry.inputValue(),'23');total++;
  await cards.nth(0).locator('.kl-col-v12-reset').click();assert.equal(await carry.inputValue(),'');total++;
  await cards.nth(1).locator('summary').click();
  const two=cards.nth(1).locator('.kl-d2-manual-carry');await two.waitFor();assert.equal(await two.inputValue(),'');total++;
  assert.equal(await page.locator('.kl-d2-practice .kl-col-v12-transition').count(),0);total++;
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1),false,label+' overflow');total++;
  if(label==='mobile'){assert((await carry.evaluate(x=>x.getBoundingClientRect().height))>=44);total++;}
  await ctx.close();
 }
 await browser.close();console.log('BE_HOC_D2_MANUAL_BROWSER_PASS',total,'checks; GAS not deployed');
})().catch(e=>{console.error(e);process.exit(1)});
