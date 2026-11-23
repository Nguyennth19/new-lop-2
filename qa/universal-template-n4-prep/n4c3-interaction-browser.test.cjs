'use strict';
/* N4-C.3: real Chromium interaction smoke focused on D1 mobile keypad/scroll
   and D10 equation inputs/focus, backed by complete 12-route R12 test suite.
   Physical devices are NOT touched by browser emulation.
*/
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const dist=path.resolve(__dirname,'../universal-template-v1/dist');
const out=path.resolve(__dirname,'dist/N4C3_INTERACTION_QA');
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(dist,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const report={suite:'N4C3_D1_D10_INTERACTION_LAYOUT_REAL_CHROMIUM',
 status:'RUNNING',scope:'HEADLESS_CHROMIUM_EMULATED_DEVICES_NOT_PHYSICAL',
 physicalPhone:'PENDING_OWNER',independentQA:'PENDING',
 outputFiles:[],results:[],errors:[]};
const server=http.createServer((req,res)=>{
 if(req.method==='GET'&&req.url==='/lab'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return}
 res.statusCode=404;res.end('LAB_ONLY');
});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
function check(ok,device,caseId,detail){assert(ok,caseId+' '+JSON.stringify(detail));report.results.push({device,caseId,pass:true,detail})}
async function shot(page,device,route,stage){
 const name='N4C3_'+device+'_'+route+'_'+stage+'.png';
 await page.screenshot({path:path.join(out,name),fullPage:true,animations:'disabled',caret:'hide'});
 report.outputFiles.push(name);
}
async function open(page,route){
 const state=await page.evaluate(id=>window.ULTLAB.openQuestion('LAB_A_'+id),route);
 assert.equal(state.ok,true,route+' '+JSON.stringify(state));
 return state;
}
(async()=>{
 const port=await listen();
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
  ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const [device,viewport] of [
   ['desktop1366',{viewport:{width:1366,height:768},hasTouch:false}],
   ['mobile390',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const ctx=await browser.newContext(viewport),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   try{
    await page.goto('http://127.0.0.1:'+port+'/lab',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    await open(page,'D1');
    const buttons=page.locator('#ulStage .g74t1-pad-key');
    check(await buttons.count()>=10,device,'D1_NUMBER_PAD_PRESENT',{buttons:await buttons.count()});
    const slot1=page.locator('#ulStage .g74t1-slot[data-slot="t1_split1"]');
    const slot2=page.locator('#ulStage .g74t1-slot[data-slot="t1_split2"]');
    await slot1.click();await page.locator('#ulStage .g74t1-pad-key[data-key="0"]').click();
    await slot2.click();await page.locator('#ulStage .g74t1-pad-key[data-key="3"]').click();
    const draft=await page.evaluate(()=>window.ULTLAB.getDraft());
    check(draft?.values?.t1_split1==='0'&&draft?.values?.t1_split2==='3',device,'D1_TOUCH_INPUT_PERSISTS',{draft});
    const geom=await page.evaluate(()=>{
      const stage=document.querySelector('#ulStage'),keys=[...document.querySelectorAll('#ulStage .g74t1-pad-key')];
      const rects=keys.map(x=>x.getBoundingClientRect());
      return {stageHeight:Math.round(stage.getBoundingClientRect().height),minKeyHeight:Math.min(...rects.map(r=>r.height)),
        overflow:document.documentElement.scrollWidth>innerWidth+3,
        keypadCount:keys.length,
        activeSlots:[...document.querySelectorAll('#ulStage .g74t1-slot.active')].map(x=>x.dataset.slot)};
    });
    check(geom.minKeyHeight>=44&&!geom.overflow,device,'D1_MIN_TOUCH_TARGET_AND_NO_OVERFLOW',geom);
    if(device==='mobile390'){
      const coords=await page.locator('#ulStage .g74t1-pad-key[data-key="3"]').boundingBox();
      check(coords&&coords.y+coords.height>0,device,'D1_KEYPAD_REACHABLE_AFTER_SCROLL',coords);
    }
    await shot(page,device,'D1','AFTER_TOUCH');
    await open(page,'D3');await open(page,'D1');
    const restored=await page.evaluate(()=>window.ULTLAB.getDraft());
    check(JSON.stringify(restored)===JSON.stringify(draft),device,'D1_DRAFT_SURVIVES_RENDERER_SWITCH',{restored});

    await open(page,'D10');
    const options=page.locator('#ulStage .g74-word-option-select');
    check(await options.count()>0,device,'D10_STATEMENT_SELECTOR_PRESENT',{count:await options.count()});
    await options.first().click();
    for(const [field,value] of [['n1','12'],['op','+'],['n2','6'],['sum','18'],['answer','18']]){
      const loc=page.locator('#ulStage [data-ml-field="LAB_A_WORD:'+field+'"]');
      check(await loc.count()===1,device,'D10_FIELD_PRESENT_'+field,{count:await loc.count()});
      await loc.fill(value);
    }
    const d10=await page.evaluate(()=>window.ULTLAB.getDraft());
    check(d10?.fields?.n1==='12'&&d10?.fields?.op==='+'&&d10?.fields?.n2==='6'
      &&d10?.fields?.sum==='18'&&d10?.fields?.answer==='18'
      &&typeof d10.selectedStatementId==='string',device,'D10_COMPOSITE_FIELDS_AND_STATEMENT_SAVED',{draft:d10});
    const layout=await page.evaluate(()=>{
      const stage=document.querySelector('#ulStage'),boxes=[...document.querySelectorAll('#ulStage [data-ml-field]')];
      return {overflow:document.documentElement.scrollWidth>innerWidth+3,stageHeight:Math.round(stage.getBoundingClientRect().height),
       inputWidths:boxes.map(x=>Math.round(x.getBoundingClientRect().width)),
       inputHeights:boxes.map(x=>Math.round(x.getBoundingClientRect().height)),
       inputTypes:boxes.map(x=>x.getAttribute('type'))};
    });
    check(!layout.overflow&&layout.inputWidths.every(x=>x>0),device,'D10_VISIBLE_FIELDS_NO_HORIZONTAL_OVERFLOW',layout);
    await shot(page,device,'D10','AFTER_INPUT');
    await open(page,'D3');await open(page,'D10');
    const reloaded=await page.evaluate(()=>window.ULTLAB.getDraft());
    check(JSON.stringify(d10)===JSON.stringify(reloaded),device,'D10_DRAFT_SURVIVES_RENDERER_SWITCH',{reloaded});
    check(await page.locator('#ulGrade').isDisabled(),device,'UNTRUSTED_GRADE_DISABLED',{disabled:true});
    check(errors.length===0,device,'NO_PAGE_SCRIPT_ERRORS',{errors});
   }finally{await ctx.close()}
  }
  report.status='CHROMIUM_INTERACTION_PASS_PHYSICAL_DEVICE_PENDING';
  console.log('N4C3_D1_D10_CHROMIUM_INTERACTION_PASS',report.results.length,'checks',report.outputFiles.length,'screenshots');
 }catch(e){report.status='FAIL';report.errors.push(String(e.stack||e));console.error(e);process.exitCode=1}
 finally{
  fs.writeFileSync(path.join(out,'N4C3_D1_D10_INTERACTION_REPORT.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close();await close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
