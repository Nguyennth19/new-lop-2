'use strict';
/* Real Chromium E2E for independent LAB, 12 existing be-hoc renderer paths x 2 public
 * data packs x 2 desktop/mobile contexts. True HTTP localhost server grader D2/D4,
 * no GAS, no actual student accounts. Screenshots as CI artifact.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),privateServer=require('./trusted-grade-lab.cjs');
const dir=path.join(__dirname,'dist'),html=fs.readFileSync(path.join(dir,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const report={suite:'ULT_V1_LAB_BROWSER_NO_GAS',viewportRuns:[],samples:[],screenshots:[],
  scriptErrors:[],serverGrade:{},networkErrors:[]};
const ctype={'/lab':'text/html; charset=utf-8','/LAB_MATH_A.json':'application/json','/LAB_MATH_B.json':'application/json'};
const server=http.createServer((req,res)=>{
 const u=req.url.split('?')[0];
 if(req.method==='POST'&&u==='/api/lab-grade'){
  let raw='';req.on('data',chunk=>{raw+=chunk;if(raw.length>32768)req.destroy()});
  req.on('end',()=>{
   let answer;try{answer=privateServer.evaluateSubmission(JSON.parse(raw))}catch(_){answer={status:'REJECTED',reason:'BAD_JSON'}}
   res.setHeader('Content-Type','application/json');
   res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
   res.end(JSON.stringify(answer));
  });return;
 }
 if(req.method!=='GET'||!ctype[u]){res.statusCode=404;res.end('NO_PUBLIC_RESOURCE');return}
 res.setHeader('Content-Type',ctype[u]);res.setHeader('Cache-Control','no-store');
 res.end(u==='/lab'?html:fs.readFileSync(path.join(dir,u.slice(1)))); 
});
function listen(){return new Promise(ok=>server.listen(0,'127.0.0.1',()=>ok(server.address().port)))}
function close(){return new Promise(ok=>server.close(ok))}
async function renderAll(page,pack){
 const r=await page.evaluate(p=>window.ULTLAB.setData(window.__ULTLAB_PACKS__[p]),pack);
 assert.equal(r.ok,true,'pack should validate '+pack+JSON.stringify(r));
 assert.equal(r.count,12);
 const observed=[];
 const questions=await page.evaluate(()=>window.__ULTLAB_PACKS__[document.querySelector('#ulPack').value]?.questions||[]);
 // Use selected pack's official ordered 12 routes, never assume B20.
 const list=await page.evaluate(p=>window.__ULTLAB_PACKS__[p].questions.map(q=>({questionId:q.questionId,rendererId:q.rendererId})),pack);
 for(const q of list){
  const result=await page.evaluate(id=>window.ULTLAB.openQuestion(id),q.questionId);
  assert.equal(result.ok,true,'failed mount '+q.rendererId+': '+JSON.stringify(result));
  const visual=await page.evaluate(()=>({
   children:document.getElementById('ulStage').children.length,
   htmlLength:document.getElementById('ulStage').innerHTML.length,
   buttons:document.querySelectorAll('#ulStage button').length,
   inputs:document.querySelectorAll('#ulStage input').length,
   status:document.querySelector('#ulStatus').textContent,
   htmlOverflow:document.documentElement.scrollWidth>innerWidth+3,
   route:window.ULTLAB.getState().rendererId
  }));
  assert(visual.children>0&&visual.htmlLength>90,q.rendererId+' empty DOM');
  assert(visual.inputs+visual.buttons>0,q.rendererId+' lacks interaction control');
  assert.equal(visual.htmlOverflow,false,q.rendererId+' viewport overflow');
  assert.equal(visual.route,q.rendererId);
  observed.push({id:q.rendererId,question:q.questionId,htmlLength:visual.htmlLength,buttons:visual.buttons,inputs:visual.inputs});
  if(['D2','D5','D8A','D8B','D9','D10'].includes(q.rendererId)){
   const file=path.join(dir,'ult-v1-'+pack+'-'+page.__viewport+'-'+q.rendererId+'.png');
   await page.screenshot({path:file,fullPage:false,animations:'disabled'});
   report.screenshots.push(path.basename(file));
  }
 }
 return observed;
}
(async()=>{
 const port=await listen(),base='http://127.0.0.1:'+port, browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const [device,opts] of [['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const ctx=await browser.newContext(opts),page=await ctx.newPage();page.__viewport=device;
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   try{
    await page.goto(base+'/lab',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    for(const pack of ['A','B']){
     const result=await renderAll(page,pack);
     report.samples.push({device,pack,rendered:result.length,details:result});
     assert.equal(result.length,12);
    }
    // Enforce strict fail-closed data contract. Forbidden answer keys cannot be inserted.
    const negative=await page.evaluate(()=>{
     const valid=JSON.parse(JSON.stringify(window.__ULTLAB_PACKS__.A));
     valid.questions[0].publicVariant.answerKey='53';
     const reject=window.ULTLAB.setData(valid);
     return {reason:reject.reason,still:window.ULTLAB.getState().packId};
    });
    assert.equal(negative.reason,'PRIVATE_FIELD_OR_UNSAFE_NESTED_STRUCTURE');
    assert.equal(negative.still,'MATH_LAB_B','invalid pack must leave active unchanged');
    // File input uses a third public JSON pack without editing any renderer.
    const custom=JSON.parse(fs.readFileSync(path.join(dir,'LAB_MATH_B.json'),'utf8'));
    custom.packId='MATH_LAB_C';custom.lesson.id='LAB_MATH_C';
    await page.locator('#ulJson').setInputFiles({name:'custom-public.json',mimeType:'application/json',
     buffer:Buffer.from(JSON.stringify(custom))});
    await page.waitForFunction(()=>window.ULTLAB.getState().packId==='MATH_LAB_C');
    assert.equal(await page.locator('#ulQuestions button').count(),12);
    report.viewportRuns.push({device,thirdJSONAccepted:true,forbiddenKeysRejected:true});
    if(device==='desktop'){
     // Server-only grade test A D2. The public HTML cannot import its Node validator.
     await page.evaluate(()=>window.ULTLAB.setData(window.__ULTLAB_PACKS__.A));
     const mount=await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D2'));
     assert.equal(mount.ok,true);
     await page.locator('[data-answer="result_ones"]').fill('3');
     await page.locator('[data-answer="result_tens"]').fill('5');
     let grade=await page.evaluate(()=>window.ULTLAB.grade());
     assert.equal(grade.status,'CHECKED');assert.equal(grade.pass,true);
     report.serverGrade.d2Correct=true;
     await page.locator('[data-answer="result_ones"]').fill('4');
     grade=await page.evaluate(()=>window.ULTLAB.grade());
     assert.equal(grade.status,'CHECKED');assert.equal(grade.pass,false);
     report.serverGrade.d2IncorrectRejected=true;
     await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D4'));
     const select=page.locator('#ulStage .g74-choice-answer');
     assert(await select.count()>=3,'D4 choices not present');
     await select.nth(1).click();
     grade=await page.evaluate(()=>window.ULTLAB.grade());
     assert.equal(grade.status,'CHECKED');assert.equal(grade.pass,true);
     report.serverGrade.d4Correct=true;
     await select.first().click();
     grade=await page.evaluate(()=>window.ULTLAB.grade());
     assert.equal(grade.status,'CHECKED');assert.equal(grade.pass,false);
     report.serverGrade.d4IncorrectRejected=true;
     const q=await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D5'));
     grade=await page.evaluate(()=>window.ULTLAB.grade());
     assert.equal(grade.status,'NOT_AUTHORIZED');
     report.serverGrade.otherRoutesDenied=true;
     assert.equal(q.ok,true);
    }
    assert.deepEqual(errors,[],'JavaScript failures '+device+': '+errors.join(' | '));
   }finally{report.scriptErrors.push({device,errors});await ctx.close()}
  }
  fs.writeFileSync(path.join(dir,'BROWSER_QA_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
  console.log('ULT_V1_BROWSER_12_ROUTES_X_2_PACKS_X_2_DEVICES_PASS',report.samples.length,
   'cycles',report.screenshots.length,'screenshots',
   'D2/D4 trusted Node grade and fail-closed public input PASS; GAS/real students NOT TESTED');
 }finally{await browser.close();await close()}
})().catch(async e=>{console.error(e);try{await close()}catch(_){}process.exitCode=1});
