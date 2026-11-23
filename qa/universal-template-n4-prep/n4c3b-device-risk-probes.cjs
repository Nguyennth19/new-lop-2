'use strict';
/* N4-C.3-B risk observations, NOT physical-device attestation.
   No edit to frozen be-hoc renderer, CSS, student data or GAS. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const out=path.resolve(__dirname,'dist/N4C3B_DEVICE_PACKAGE');
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.resolve(__dirname,'../universal-template-v1/dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const report={suite:'N4C3B_TARGETED_RISK_OBSERVATION',status:'RUNNING',physicalPhone:'NOT_TESTED',
 iosSafari:'NOT_TESTED',ownerApproval:'PENDING',independentQA:'PENDING',
 checks:[],knownRisks:[],screenshots:[],errors:[]};
const server=http.createServer((req,res)=>{if(req.url?.split('?')[0]==='/lab'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)}else{res.writeHead(404);res.end('LAB_ONLY')}});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
const record=(device,name,data)=>report.checks.push({device,name,...data});
(async()=>{
 const port=await listen();
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const v of [{name:'mobile390',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2},
    {name:'desktop1366',viewport:{width:1366,height:768},isMobile:false,hasTouch:false,deviceScaleFactor:1}]){
   const ctx=await browser.newContext({viewport:v.viewport,isMobile:v.isMobile,hasTouch:v.hasTouch,deviceScaleFactor:v.deviceScaleFactor});
   const page=await ctx.newPage();
   page.on('pageerror',e=>report.errors.push({device:v.name,error:String(e)}));
   try{
    await page.goto('http://127.0.0.1:'+port+'/lab',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    assert.equal((await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D1'))).ok,true);
    const d1=await page.evaluate(()=>{
      const stage=document.querySelector('#ulStage'),slot=document.querySelector('.g74t1-slot[data-slot="t1_split1"]'),pad=document.querySelector('.g74t1-pad-key[data-key="3"]');
      const r1=slot.getBoundingClientRect(),r2=pad.getBoundingClientRect();
      return {stageHeight:Math.round(stage.getBoundingClientRect().height),viewportHeight:innerHeight,
        slotKeyVerticalSeparation:Math.round(Math.abs((r2.top+r2.height/2)-(r1.top+r1.height/2))),
        keyHeight:Math.round(r2.height),horizontalOverflow:document.documentElement.scrollWidth>innerWidth+3,
        showsInternalSlotId:/t1_split\d|t1_ans|t1_dm|t1_m/.test(stage.innerText),
        showsTestInstruction:/TEST:|chỉ thu ô nhập/i.test(stage.innerText),textExcerpt:stage.innerText.slice(-500)};
    });
    assert(d1.keyHeight>=44&&!d1.horizontalOverflow);
    record(v.name,'D1_GEOMETRY_INTERNAL_LABEL_OBSERVATION',d1);
    if(d1.stageHeight>d1.viewportHeight)report.knownRisks.push({device:v.name,route:'D1',risk:'STAGE_TALLER_THAN_VIEWPORT',detail:d1});
    if(d1.showsInternalSlotId||d1.showsTestInstruction)report.knownRisks.push({device:v.name,route:'D1',risk:'FROZEN_CORE_DEBUG_TEXT_VISIBLE',detail:{showsInternalSlotId:d1.showsInternalSlotId,showsTestInstruction:d1.showsTestInstruction}});
    await page.locator('#ulStage .g74t1-slot[data-slot="t1_split1"]').click();
    await page.locator('#ulStage .g74t1-pad-key[data-key="3"]').click();
    const s=await page.evaluate(()=>window.ULTLAB.getDraft());
    assert.equal(s.values.t1_split1,'3');
    const d1shot='RISK_'+v.name+'_D1_AFTER_KEYPAD.png';
    await page.screenshot({path:path.join(out,d1shot),fullPage:true,animations:'disabled'});
    report.screenshots.push(d1shot);
    record(v.name,'D1_SELECT_AND_KEYPRESS',{pass:true,draftValue:s.values.t1_split1});
    assert.equal((await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D10'))).ok,true);
    const d10=await page.evaluate(()=>{
      const inputs=[...document.querySelectorAll('#ulStage [data-ml-field]')];
      return {fields:inputs.map(i=>({field:i.dataset.mlField.split(':').at(-1),inputMode:i.inputMode,
         fontSize:getComputedStyle(i).fontSize,width:Math.round(i.getBoundingClientRect().width),
         height:Math.round(i.getBoundingClientRect().height)})),overflow:document.documentElement.scrollWidth>innerWidth+3};
    });
    assert(d10.fields.length===5&&!d10.overflow);
    assert(d10.fields.every(f=>f.fontSize==='16px'),'Unexpected D10 font mitigation drift');
    record(v.name,'D10_INPUT_MODES_AND_TOUCH_SIZES',d10);
    if(d10.fields.find(x=>x.field==='op')?.inputMode==='text')report.knownRisks.push({device:v.name,route:'D10',risk:'OPERATOR_REQUIRES_TEXT_KEYBOARD_ON_REAL_PHONE'});
    await page.locator('#ulStage .g74-word-option-select').first().click();
    for(const [f,val] of [['n1','12'],['op','−'],['n2','6'],['sum','6'],['answer','6']])
      await page.locator('#ulStage [data-ml-field="LAB_A_WORD:'+f+'"]').fill(val);
    const value=await page.evaluate(()=>window.ULTLAB.getDraft());
    record(v.name,'D10_UNICODE_MINUS_STORAGE',{value:value.fields?.op,pass:value.fields?.op==='−'});
    report.knownRisks.push({device:v.name,route:'D10',risk:'MINUS_HYPHEN_NORMALIZATION_REQUIRES_POLICY_TEST'});
    const d10shot='RISK_'+v.name+'_D10_UNICODE_MINUS.png';
    await page.screenshot({path:path.join(out,d10shot),fullPage:true,animations:'disabled'});
    report.screenshots.push(d10shot);
   }finally{await ctx.close()}
  }
  assert.equal(report.errors.length,0);
  report.status='CHROME_PROBES_PASS_REAL_PHONE_AND_UX_DECISIONS_PENDING';
  console.log('N4C3B_BROWSER_PROBES_PASS',report.checks.length,'observations',report.knownRisks.length,'risk-notes; REAL_PHONE_NOT_TESTED');
 }catch(e){report.status='FAIL';report.errors.push({error:String(e.stack||e)});console.error(e);process.exitCode=1}
 finally{fs.writeFileSync(path.join(out,'N4C3B_TARGETED_RISK_LEDGER.json'),JSON.stringify(report,null,2)+'\n');await browser.close();await close()}
})().catch(e=>{console.error(e);process.exitCode=1});
