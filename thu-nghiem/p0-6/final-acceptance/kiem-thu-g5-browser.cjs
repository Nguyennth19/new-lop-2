'use strict';
/* Browser-level evidence for isolated G5 preview; 8/8 on desktop and mobile Chromium.
 * Each input test interacts with real DOM and grading, not just offline receipts.
 */
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium,devices}=require('playwright');
const {pathToFileURL}=require('node:url');
const outDir=path.join(__dirname,'g5-browser-evidence');fs.mkdirSync(outDir,{recursive:true});
const target=pathToFileURL(path.join(__dirname,'g5-b21-preview.generated.html')).href;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const results=[];
 try {
  for(const profile of [
   {name:'desktop',viewport:{width:1366,height:768},isMobile:false,deviceScaleFactor:1},
   {name:'mobile',...devices['iPhone 13'],defaultBrowserType:undefined}
  ]){
   const ctx=await browser.newContext({...profile,name:undefined,defaultBrowserType:undefined});
   const page=await ctx.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(target,{waitUntil:'load'});
   assert.equal(await page.locator('.question').count(),8);
   assert.equal(await page.evaluate(()=>window.__G5_TEST__?.ready),true);
   assert.equal(await page.evaluate(()=>window.__G5_TEST__?.releaseReady),false);
   const records=await page.evaluate(()=>window.__G5_TEST__.records);
   const totals={LV1:0,LV2:0,LV3:0};
   for(const q of records){
    totals[q.level]++;
    const section=page.locator('[data-question-id="'+q.id+'"]');
    const fields=q.level==='LV1'?['answer']:q.level==='LV2'?['carry','tens','ones']:['bridge','answer'];
    const answers=q.level==='LV1'?{answer:String(q.answer)}:q.level==='LV2'?
      {carry:'1',tens:String(q.answer).padStart(2,'0')[0],ones:String(q.answer).padStart(2,'0')[1]}:
      {bridge:String(q.bridge),answer:String(q.answer)};
    const button=section.locator('[data-check]');
    await button.click();
    assert.equal(await section.locator('output').getAttribute('data-state'),'incomplete');
    for(const k of fields)await section.locator('[data-ml-input="'+q.id+':'+k+'"]').fill(answers[k]);
    await button.click();assert.equal(await section.locator('output').getAttribute('data-state'),'correct');
    const first=fields[0],input=section.locator('[data-ml-input="'+q.id+':'+first+'"]');
    await input.fill(String(Number(answers[first])+1));await button.click();
    assert.equal(await section.locator('output').getAttribute('data-state'),'incorrect');
    await input.fill(answers[first]);await button.click();
    assert.equal(await section.locator('output').getAttribute('data-state'),'correct');
   }
   assert.deepEqual(totals,{LV1:4,LV2:2,LV3:2});
   assert.deepEqual(errors,[]);
   const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,viewport:window.innerWidth}));
   assert(metrics.scrollWidth<=metrics.clientWidth+1,'Unexpected horizontal overflow '+JSON.stringify(metrics));
   await page.screenshot({path:path.join(outDir,profile.name+'.png'),fullPage:true});
   results.push({profile:profile.name,questions:records.length,byLevel:totals,correctWrongBlankChecked:true,
    pageErrors:errors,metrics,conclusion:'PASS'});
   await ctx.close();
  }
 } finally {await browser.close()}
 const summary={suite:'F-A-G5-CHROMIUM-DESKTOP-MOBILE',scope:'ISOLATED_PREVIEW_NOT_DEPLOYED_WEB_APP',
   releaseReady:false,results};
 fs.writeFileSync(path.join(outDir,'results.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify(summary));
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
