'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});let total=0;
for(const [name,device] of [['desktop',{viewport:{width:1366,height:768}}],['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await browser.newContext(device),page=await ctx.newPage();
 await page.setContent('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><div id="mathFullScreen" style="width:100%;box-sizing:border-box;padding:8px"><div id="mlContent"><article data-ml-q-card="THREE_QA_001" class="ml-mental-row"><span>18 + 27 + 39 =</span><input data-ml-field="THREE_QA_001:answer"></article><article data-ml-q-card="VERT_QA_001" class="ml-card"><span>36 + 17</span><input data-ml-field="VERT_QA_001:ones"></article></div></div></body></html>');
 for(const p of ['50_CSS_D2V12.html'])await page.addStyleTag({content:fs.readFileSync(p,'utf8')});
 for(const p of ['47_D2V12_Core.html','48_D2V12_View.html','51_D2_AutoCarry.html','49_D2V12_BaiHoc.html'])await page.addScriptTag({content:fs.readFileSync(p,'utf8')});
 const out=await page.evaluate(()=>window.BE_HOC_D2_V12.mountB20({lesson:{id:'toan_b20'},questions:[
  {id:'THREE_QA_001',type:'mental',variantType:'three',valid:true,level:'LV1',n1:18,n2:27,n3:39,answer:84},
  {id:'VERT_QA_001',type:'vertical',op:'+',valid:true,level:'LV1',n1:36,n2:17,answer:53}
 ]},document.getElementById('mathFullScreen'),'LV1'));
 assert.equal(out.practiceCards,2);total++;
 const details=page.locator('.kl-d2-practice');await details.nth(0).locator('summary').click();
 await page.locator('.kl-d2-practice').nth(0).locator('.kl-col-v12-answer').first().waitFor();
 assert.equal(await details.nth(0).locator('.kl-d2-multi-row.kl-col-v12-sign').count(),1);total++;
 assert.equal((await details.nth(0).locator('.kl-d2-multi-row.kl-col-v12-digit').allTextContents()).join(''),'39');total++;
 const carry=details.nth(0).locator('.kl-col-v12-transition');
 assert.equal(await carry.count(),1);total++;assert.equal(await carry.first().textContent(),'+2');total++;assert.equal(await carry.first().isDisabled(),true);total++;
 await details.nth(0).locator('[data-answer="result_ones"]').fill('4');
 await details.nth(0).locator('[data-answer="result_tens"]').fill('8');total+=2;
 await details.nth(0).locator('.kl-col-v12-reset').click();
 assert.equal(await carry.first().textContent(),'+2');total++;assert.equal(await carry.first().isDisabled(),true);total++;
 await details.nth(1).locator('summary').click();await details.nth(1).locator('.kl-col-v12-transition').waitFor();
 assert.equal(await details.nth(1).locator('.kl-col-v12-transition').textContent(),'+1');total++;
 assert.equal(await page.locator('[data-ml-field="THREE_QA_001:answer"]').inputValue(),'');total++;
 let overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);assert.equal(overflow,false,name+' overflow');total++;
 if(name==='mobile'){let h=await carry.first().evaluate(x=>x.getBoundingClientRect().height);assert(h>=44);total++;}
 await ctx.close();
}
await browser.close();console.log('BE_HOC_D2_AUTO_CARRY_MULTI_ROW_CHROMIUM_PASS',total,'checks; GAS not deployed');
})().catch(e=>{console.error(e);process.exit(1)});
