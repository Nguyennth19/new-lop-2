'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,devices}=require('playwright'),{pathToFileURL}=require('node:url');
const dir=path.join(__dirname,'fb3-b20-browser-evidence');fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true}),results=[];
 try{
  for(const profile of [
   {name:'desktop',options:{viewport:{width:1366,height:768},deviceScaleFactor:1}},
   {name:'mobile',options:{...devices['iPhone 13'],defaultBrowserType:undefined}}
  ]){
   const context=await browser.newContext(profile.options),page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.join(__dirname,'fb3-b20-preview.generated.html')).href);
   assert.equal(await page.locator('.question').count(),30);
   assert.equal(await page.evaluate(()=>window.__FB3_TEST__?.ready),true);
   const questions=await page.evaluate(()=>window.__FB3_TEST__.questions);
   let checked=0;const kinds={};
   for(const q of questions){
    const section=page.locator('[data-question-id="'+q.id+'"]');
    const fields=q.type==='vertical'?['carry','tens','ones']:
      q.type==='word_problem'?['n1','op','n2','sum','answer']:['answer'];
    const expected=q.type==='vertical'?
      {carry:String((Number(q.n1)%10+Number(q.n2)%10)>=10?1:0),
       tens:String(q.answer).padStart(2,'0')[0],ones:String(q.answer).padStart(2,'0')[1]}:
      q.type==='word_problem'?{n1:String(q.n1),op:'+',n2:String(q.n2),sum:String(q.answer),answer:String(q.answer)}:
      {answer:String(q.answer)};
    const button=section.locator('[data-check]');
    await button.click();assert.equal(await section.locator('output').getAttribute('data-state'),'incomplete',q.id);
    for(const field of fields)await section.locator('[data-ml-input="'+q.id+':'+field+'"]').fill(expected[field]);
    await button.click();assert.equal(await section.locator('output').getAttribute('data-state'),'correct',q.id);
    const first=fields[0],inp=section.locator('[data-ml-input="'+q.id+':'+first+'"]');
    await inp.fill(first==='op'?'x':String(Number(expected[first])+1));
    await button.click();assert.equal(await section.locator('output').getAttribute('data-state'),'incorrect',q.id);
    await inp.fill(expected[first]);
    checked++;kinds[q.variantType]=(kinds[q.variantType]||0)+1;
   }
   const metrics=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));
   assert(metrics.scrollWidth<=metrics.width+1,'horizontal overflow '+JSON.stringify(metrics));
   assert.deepEqual(errors,[]);
   await page.screenshot({path:path.join(dir,profile.name+'.png'),fullPage:true});
   results.push({profile:profile.name,questionsChecked:checked,allCorrectWrongBlank:true,
     errors,metrics,kinds,conclusion:'PASS'});
   await context.close();
  }
 }finally{await browser.close()}
 const output={suite:'F-B.3-INDEPENDENT-B20-CHROMIUM-QA',scope:'ISOLATED_TEST_PREVIEW_ONLY',
 sourceLesson:'toan_b20',sourceQuestionCount:30,results,releaseReady:false,
 qaGates:{G5_BROWSER:'PASS_ISOLATED_ONLY',G7_OWNER:'H2_EXISTING_B20_APPROVAL',
 G8_POLICY:'B20_INDEPENDENT_H1_SOURCE_PINNED',PRODUCTION:'BLOCKED'}};
 fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify(output));
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
