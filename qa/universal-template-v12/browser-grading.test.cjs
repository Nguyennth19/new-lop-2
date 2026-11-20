'use strict';
/* ULT V1.2: actual 7-graded-route client→same-origin Node→client browser E2E,
 * A/B × desktop/mobile, both right and wrong learner inputs.
 * Synthetic QA only. Never touches GAS or writes learner scores.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const {handleGradeRequest}=require('./http-grade-boundary.cjs');
const dist=path.resolve(__dirname,'../universal-template-v1/dist');
const html=fs.readFileSync(path.join(dist,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const report={schema:'ULT_V12_BROWSER_GRADE_E2E',routes:[],http:[],errors:[],screenshots:[],scope:'SYNTHETIC_LOOPBACK_ONLY'};
const server=http.createServer((req,res)=>{
 if(handleGradeRequest(req,res))return;
 if(req.method==='GET'&&(req.url==='/lab'||req.url==='/')){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;
 }
 res.statusCode=404;res.end('NOT_FOUND');
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server.address().port)));
const close=()=>new Promise(resolve=>server.close(resolve));
const routes=['D2','D3','D4','D6','D7','D8','D9'];
const id=(tag,route)=>'LAB_'+tag+'_'+route;
const scoped=(selector)=>'#ulStage '+selector;
async function answer(page,tag,route,wrong=false){
 const b=tag==='B';
 switch(route){
  case 'D2':{
   const ones=b?'2':'3',tens=b?'7':'5';
   await page.locator(scoped('[data-answer="result_ones"]')).fill(wrong?(ones==='3'?'4':'3'):ones);
   await page.locator(scoped('[data-answer="result_tens"]')).fill(tens);
   return;
  }
  case 'D3':{
   const map=b?{l1:'r2',l2:'r1'}:{l1:'r1',l2:'r2'};
   if(wrong)map.l1=[...['r1','r2']].find(x=>x!==map.l1),map.l2=[...['r1','r2']].find(x=>x!==map.l2);
   for(const l of ['l1','l2']){
    await page.locator(scoped('.g74-match-card.left[data-match-id="'+l+'"]')).click();
    await page.locator(scoped('.g74-match-card.right[data-match-id="'+map[l]+'"]')).click();
   }
   return;
  }
  case 'D4':
   await page.locator(scoped('.g74-choice-answer[data-choice-id="'+(wrong?'opt1':'opt2')+'"]')).click();
   return;
  case 'D6':{
   const order=b?['n2','n3','n1']:['n1','n3','n2'];
   if(wrong)[order[0],order[1]]=[order[1],order[0]];
   for(let i=0;i<order.length;i++){
    await page.locator(scoped('.g74-ds-card[data-ds-item="'+order[i]+'"]')).click();
    await page.locator(scoped('.g74-ds-target[data-ds-target="slot_'+(i+1)+'"]')).click();
   }
   return;
  }
  case 'D7':{
   const sign=wrong?(b?'<':'>'):(b?'>':'<');
   await page.locator(scoped('.g74-cmp-row[data-cmp-row="row1"]')).click();
   await page.locator(scoped('.g74-cmp-sign[data-cmp-sign="'+sign+'"]')).click();
   await page.locator(scoped('.g74-cmp-row[data-cmp-row="row2"]')).click();
   await page.locator(scoped('.g74-cmp-sign[data-cmp-sign="="]')).click();
   return;
  }
  case 'D8':
   await page.locator(scoped('.g74-ruler-panel input')).fill(wrong?(b?'8':'9'):(b?'9':'7'));
   return;
  case 'D9':{
   const count=b?'4':'6',diff=b?'3':'2';
   await page.locator(scoped('.g74-picto-question input')).nth(0).fill(wrong?'1':count);
   await page.locator(scoped('.g74-picto-question input')).nth(1).fill(diff);
   return;
  }
 }
 throw Error('Unknown grade E2E route '+route);
}
async function auditHttp(base){
 const good={packId:'MATH_LAB_A',questionId:'LAB_A_D2',
  submission:{variantId:'COL_LAB_A0001',result_ones:'3',result_tens:'5'}};
 const post=async(body,headers={})=>fetch(base+'/api/lab-grade',{
  method:'POST',headers:{'Content-Type':'application/json','Origin':base,...headers},
  body:typeof body==='string'?body:JSON.stringify(body)});
 let r=await post(good,{'Origin':'https://malicious.example'});
 assert.equal(r.status,403);report.http.push('FOREIGN_ORIGIN_403');
 r=await post(good,{'Origin':''});assert.equal(r.status,403);report.http.push('MISSING_ORIGIN_403');
 r=await post(good,{'Content-Type':'text/plain'});assert.equal(r.status,415);report.http.push('BAD_CONTENT_TYPE_415');
 r=await post('not-json');assert.equal(r.status,400);report.http.push('MALFORMED_JSON_400');
 r=await post({packId:'MATH_LAB_A',questionId:'LAB_A_D2',submission:good.submission,padding:'x'.repeat(20000)});
 assert.equal(r.status,413);report.http.push('OVER_LIMIT_413');
 r=await post({...good,packId:'MATH_LAB_C'});assert.equal((await r.json()).status,'REJECTED');report.http.push('UNKNOWN_PACK_DENY');
 r=await post({...good,score:999});assert.equal((await r.json()).status,'REJECTED');report.http.push('SCORE_INJECTION_DENY');
 r=await post(good);assert.equal(r.status,200);assert.equal((await r.json()).pass,true);
 report.http.push('SAME_ORIGIN_VALID');
}
(async()=>{
 const port=await listen(),base='http://127.0.0.1:'+port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
  ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  await auditHttp(base);
  for(const [viewport,opts] of [['desktop',{viewport:{width:1366,height:768}}],
    ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const context=await browser.newContext(opts),page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(base+'/lab',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    for(const tag of ['A','B']){
     let set=await page.evaluate(t=>window.ULTLAB.setData(window.__ULTLAB_PACKS__[t]),tag);
     assert.equal(set.ok,true,'Set source pack');
     assert.equal(await page.evaluate(()=>window.ULTLAB.getState().trustedData),true);
     for(const route of routes){
      const qid=id(tag,route);
      let open=await page.evaluate(qid=>window.ULTLAB.openQuestion(qid),qid);
      assert.equal(open.ok,true,tag+route+' mount');
      assert.equal(await page.locator('#ulGrade').isDisabled(),false,tag+route+' score button should be enabled');
      await answer(page,tag,route,false);
      let first=await page.evaluate(()=>window.ULTLAB.grade());
      assert.equal(first.status,'CHECKED',tag+route+' right status '+JSON.stringify(first));
      assert.equal(first.pass,true,tag+route+' right answer');
      const screenshot='ult-v12-'+viewport+'-'+tag+'-'+route+'.png';
      await page.screenshot({path:path.join(dist,screenshot),fullPage:false,animations:'disabled'});
      report.screenshots.push(screenshot);
      open=await page.evaluate(qid=>window.ULTLAB.openQuestion(qid),qid);
      assert.equal(open.ok,true);
      await answer(page,tag,route,true);
      let wrong=await page.evaluate(()=>window.ULTLAB.grade());
      assert.equal(wrong.status,'CHECKED',tag+route+' wrong status '+JSON.stringify(wrong));
      assert.equal(wrong.pass,false,tag+route+' wrong answer');
      report.routes.push({viewport,pack:tag,route,correct:true,incorrectRejected:true});
     }
    }
    // File load of A-identical JSON must not acquire grading permission.
    const external=JSON.parse(fs.readFileSync(path.join(dist,'LAB_MATH_A.json'),'utf8'));
    await page.locator('#ulJson').setInputFiles({
     name:'forged-original-A.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(external))
    });
    await page.waitForFunction(()=>window.ULTLAB.getState().trustedData===false);
    await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D2'));
    assert.equal(await page.locator('#ulGrade').isDisabled(),true,'uploaded pack cannot receive scoring grant');
    const forbidden=await page.evaluate(()=>window.ULTLAB.grade());
    assert.equal(forbidden.status,'NOT_AUTHORIZED');
    for(const route of ['D1','D5','D8A','D8B','D10']){
     await page.evaluate(t=>window.ULTLAB.setData(window.__ULTLAB_PACKS__[t]),'A');
     await page.evaluate(qid=>window.ULTLAB.openQuestion(qid),id('A',route));
     assert.equal(await page.locator('#ulGrade').isDisabled(),true,route+' must not be grade-enabled');
    }
    assert.deepEqual(errors,[],'Browser errors '+viewport+': '+errors.join(' | '));
    report.errors.push({viewport,errors:[]});
   }finally{await context.close()}
  }
  fs.writeFileSync(path.join(dist,'ULT_V12_BROWSER_GRADING_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
  console.log('ULT_V12_BROWSER_TRUSTED_CONTRACT_PASS',report.routes.length,
   'right+wrong GUI cases,',report.http.length,'HTTP barriers,',report.screenshots.length,
   'screenshots; NO GAS/NO STUDENT AUTH');
 }finally{await browser.close();await close()}
})().catch(async e=>{console.error(e);try{await close()}catch(_){}process.exitCode=1});
