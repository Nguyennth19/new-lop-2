'use strict';
/* End-to-end simulated lesson with actual GAS source VM as a callable test server.
 * NOT deployed Google Apps Script or real student data.
 */
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const {chromium}=require('playwright');
const sourceCode=fs.readFileSync('D2ChamTinCayTest.gs','utf8');
(async()=>{
 const chrome=await chromium.launch({headless:true,args:['--no-sandbox']});let count=0;
 for(const [label,options] of [['chrome-desktop',{viewport:{width:1366,height:768}}],['chrome-mobile-emulated',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const q={id:'toan_b20_lv1_ex1_q01',type:'vertical',valid:true,level:'LV1',op:'+',n1:'36',n2:'17',answer:'53'};
  const fakeSheetRead=()=>({lesson:{id:'toan_b20'},questions:[q]});
  const context={layBaiToan20:fakeSheetRead,achSelect_:()=>[q]};
  vm.runInNewContext(sourceCode,context);
  let requests=0,writes=0;
  const browserContext=await chrome.newContext(options),page=await browserContext.newPage();
  await page.exposeFunction('__testTrustedGAS',async payload=>{requests++;return JSON.parse(JSON.stringify(context.d2ChamTinCayTest(payload)));});
  await page.setContent('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><div id="mathFullScreen" style="width:100%;box-sizing:border-box;padding:8px"><div id="mlContent"><article class="ml-card" data-ml-q-card="toan_b20_lv1_ex1_q01"><input data-ml-field="toan_b20_lv1_ex1_q01:ones" value=""></article></div></div></body></html>');
  await page.addStyleTag({content:fs.readFileSync('50_CSS_D2V12.html','utf8')});
  await page.evaluate(()=>{
    window.google={script:{run:{
      withSuccessHandler(handler){this.success=handler;return this;},
      withFailureHandler(handler){this.failure=handler;return this;},
      d2ChamTinCayTest(payload){window.__testTrustedGAS(payload).then(this.success).catch(this.failure);}
    }}};
    window.__testStars=0;
  });
  for(const file of ['47_D2V12_Core.html','48_D2V12_View.html','52_D2_ManualCarry.html','49_D2V12_BaiHoc.html'])
    await page.addScriptTag({content:fs.readFileSync(file,'utf8')});
  const mounted=await page.evaluate(()=>window.BE_HOC_D2_V12.mountB20({lesson:{id:'toan_b20'},questions:[{id:'toan_b20_lv1_ex1_q01',level:'LV1',type:'vertical',valid:true,op:'+',n1:36,n2:17}]},document.getElementById('mathFullScreen'),'LV1'));
  assert.equal(mounted.practiceCards,1);count++;
  await page.locator('.kl-d2-practice summary').click();
  const carry=page.locator('.kl-d2-manual-carry'),ones=page.locator('[data-answer="result_ones"]'),tens=page.locator('[data-answer="result_tens"]'),send=page.locator('.kl-col-v12-send'),status=page.locator('.kl-col-v12-status');
  assert.equal(await carry.inputValue(),'');count++;
  await ones.fill('3');await tens.fill('5');await carry.fill('1');await send.click();
  await assert.doesNotReject(async()=>{await status.getByText(/Đúng cả đáp số và ô nhớ/).waitFor()});count++;
  assert.equal(requests,1);count++;
  await carry.fill('0');await send.click();await status.getByText(/Chưa đúng đáp số hoặc ô nhớ/).waitFor();count++;
  await carry.fill('');await send.click();await status.getByText(/Chưa đúng đáp số hoặc ô nhớ/).waitFor();count++;
  await carry.fill('1');await ones.fill('2');await send.click();await status.getByText(/Chưa đúng đáp số hoặc ô nhớ/).waitFor();count++;
  assert.equal(requests,4);count++;
  assert.equal(await page.evaluate(()=>window.__testStars),0);count++;
  assert.equal(writes,0);count++;
  assert.equal(await page.locator('[data-ml-field="toan_b20_lv1_ex1_q01:ones"]').inputValue(),'');count++;
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1),false,label+' overflow');count++;
  if(label==='chrome-mobile-emulated'){assert((await carry.evaluate(x=>x.getBoundingClientRect().height))>=44);count++;}
  await browserContext.close();
 }
 await chrome.close();console.log('BE_HOC_D2_CHROME_SIMULATED_GAS_LESSON_PASS',count,'assertions; NO GAS deployment');
})().catch(e=>{console.error(e);process.exit(1)});
