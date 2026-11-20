'use strict';
/* ULT V1.3 – browser proof of 20 + 20 dry-run D2 variants imported via
 * file picker into unchanged Template LAB; no student scoring, no Google/GAS.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const base=path.resolve(__dirname,'../universal-template-v1/dist');
const testOut=path.join(__dirname,'dist');
const html=fs.readFileSync(path.join(base,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'),'utf8');
const server=http.createServer((req,res)=>{
 if(req.method==='GET'&&req.url==='/lab'){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;
 }
 res.statusCode=404;res.end('NO_EXTERNAL_RESOURCE');
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server.address().port)));
const close=()=>new Promise(resolve=>server.close(resolve));
const result={contract:'ULT_V13_2X20_D2_BROWSER_SWAPPABILITY',
screenshots:[],runs:[],errors:[],externalWrites:0,gradeDisabled:true};
(async()=>{
 const port=await listen(),uri='http://127.0.0.1:'+port+'/lab';
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
  ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const [viewport,opts] of [['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const ctx=await browser.newContext(opts),page=await ctx.newPage();
   const errors=[];let requests=0;page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'+port))requests++});
   try{
    await page.route(/^https?:/,route=>{
     const u=route.request().url();
     if(u.startsWith('http://127.0.0.1:'+port))return route.continue();
     return route.abort();
    });
    await page.goto(uri,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    for(const tag of ['A','B']){
     const name='LAB_PILOT_'+tag+'_PUBLIC_CANDIDATE.json';
     const candidate=JSON.parse(fs.readFileSync(path.join(testOut,name),'utf8'));
     await page.locator('#ulJson').setInputFiles({name,mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify(candidate))});
     await page.waitForFunction(id=>window.ULTLAB.getState().packId===id,'LAB_PILOT_'+tag);
     assert.equal(await page.locator('#ulQuestions button').count(),20);
     assert.equal(await page.evaluate(()=>window.ULTLAB.getState().trustedData),false);
     assert.equal(await page.locator('#ulGrade').isDisabled(),true);
     for(const [i,q] of candidate.questions.entries()){
      const route=await page.evaluate(id=>window.ULTLAB.openQuestion(id),q.questionId);
      assert.equal(route.ok,true,viewport+'/'+tag+'/'+i+' source mount');
      assert.equal(route.rendererId,'D2');
      const field=page.locator('#ulStage [data-answer="result_ones"]');
      assert(await field.count()>0,'missing real D2 input');
      await field.fill(String((q.publicVariant.a+q.publicVariant.b)%10));
      const state=await page.evaluate(()=>window.ULTLAB.getState());
      assert.equal(state.questionId,q.questionId);
      assert.equal(state.trustedData,false);
      assert.equal(await page.locator('#ulGrade').isDisabled(),true);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
      assert.equal(overflow,false,'horizontal overflow on '+tag+'/'+i);
      if(i===0||i===19){
       const name='ULT_V13_'+viewport+'_'+tag+'_D2_'+String(i+1).padStart(2,'0')+'.png';
       await page.screenshot({path:path.join(testOut,name),fullPage:false,animations:'disabled'});
       result.screenshots.push(name);
      }
     }
     const invalid=JSON.parse(JSON.stringify(candidate));
     invalid.questions[0].skillId='WORD_PROBLEM';
     const denied=await page.evaluate(pack=>window.ULTLAB.setData(pack),invalid);
     assert.equal(denied.ok,false);
     assert.equal(denied.reason,'SKILL_TYPE_POLICY_MISMATCH');
     assert.equal(await page.evaluate(()=>window.ULTLAB.getState().packId),candidate.packId,
      'rejected pack must not replace last validated data');
     result.runs.push({viewport,pack:candidate.packId,questions:20,mounted:20,
      filledInput:20,gradeDenied:true,unapprovedDataRejected:true});
    }
    assert.deepEqual(errors,[],'JS browser errors '+viewport+': '+errors.join(' | '));
    result.errors.push({viewport,errors:[],blockedThirdPartyRequests:requests});
   }finally{await ctx.close()}
  }
  fs.writeFileSync(path.join(testOut,'BROWSER_SWAPPABILITY_EVIDENCE.json'),
   JSON.stringify(result,null,2)+'\n');
  console.log('ULT_V13_BROWSER_REPLACEMENT_PASS',result.runs.length,
   'device-pack cycles,',result.runs.reduce((s,x)=>s+x.mounted,0),
   'D2 mounts and inputs,',result.screenshots.length,
   'screenshots, 0 trusted grade grants, 0 external writes');
 }finally{await browser.close();await close()}
})().catch(async e=>{console.error(e);try{await close()}catch(_){}process.exitCode=1});
