'use strict';
/* N1 strict W1-01/02/03 browser acceptance; LAB only, no GAS or student data. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const dir=path.resolve(__dirname,'../universal-template-v1/dist');
const output=path.join(__dirname,'dist');fs.mkdirSync(output,{recursive:true});
const html=fs.readFileSync(path.join(dir,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const server=http.createServer((req,res)=>{if(req.method==='GET'&&req.url==='/lab'){
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;}
 res.statusCode=404;res.end('N1_LAB_ONLY');
});
const listen=()=>new Promise(ok=>server.listen(0,'127.0.0.1',()=>ok(server.address().port)));
const close=()=>new Promise(ok=>server.close(ok));
const report={suite:'ULT_N1_STRICT_W1_01_02_03',base:'fe15c79b21b9f056694f8127330934d997affd45',
  status:'NOT_RELEASE_AUTHORIZED',results:[],failures:[],devices:['desktop','mobile390']};
async function check(page,device,code,run){
 try{const detail=await run();report.results.push({device,code,pass:true,detail});}
 catch(e){const message=String(e?.stack||e);report.results.push({device,code,pass:false,error:message});
  report.failures.push({device,code,error:message});}
}
async function d1Restore(page){
 const result=await page.evaluate(()=>{
  const q=window.__ULTLAB_PACKS__.A.questions.find(x=>x.rendererId==='D1');
  const host=document.createElement('div');host.dataset.n1Probe='D1';document.body.append(host);
  try{
   let calls=0;
   const handle=window.ULTLAB_HARDENING.wrapD1(window.G74Type1C2,host,q.publicVariant,()=>{calls++});
   if(!handle?.ok)return {error:'MOUNT_D1_'+handle?.reason};
   const draft={variantId:q.publicVariant.caseId,
    values:{t1_split1:'0',t1_split2:'3',t1_ten:'',t1_ans:'',t1_dm:'',t1_m:''},
    active:'t1_split2'};
   calls=0;const ret=handle.restore(draft);
   return {ret,calls,restored:handle.snapshot(),active:host.querySelector('.g74t1-slot.active')?.dataset.slot};
  }finally{host.remove();}
 });
 assert.equal(result.error,undefined,JSON.stringify(result));
 assert.equal(result.ret?.ok,true,JSON.stringify(result));
 assert.equal(result.calls,1,'W1-01 D1 restore must issue exactly ONE final onChange');
 assert.equal(result.restored.values.t1_split1,'0');
 assert.equal(result.restored.values.t1_split2,'3');
 assert.equal(result.restored.values.t1_dm,'');
 assert.equal(result.active,'t1_split2');
 return result;
}
async function d2Restore(page){
 const result=await page.evaluate(()=>{
  const q=window.__ULTLAB_PACKS__.A.questions.find(x=>x.rendererId==='D2');
  const plan=window.KLColumnV12.publicPlan(q.publicVariant);
  const host=document.createElement('div');host.dataset.n1Probe='D2';document.body.append(host);
  try{
   let calls=0;
   const handle=window.ULTLAB_HARDENING.wrapD2(window.KLColumnViewV12,host,plan,()=>{calls++},()=>{});
   if(!handle?.ok)return {error:'MOUNT_D2_'+handle?.reason};
   const draft={...handle.snapshot(),result_ones:'3',result_tens:'5',carry_tens:true};
   calls=0;const ret=handle.restore(draft,'result_tens');
   return {ret,calls,restored:handle.snapshot(),focused:document.activeElement?.dataset.answer};
  }finally{host.remove();}
 });
 assert.equal(result.error,undefined,JSON.stringify(result));
 assert.equal(result.ret?.ok,true,JSON.stringify(result));
 assert.equal(result.calls,1,'W1-01 D2 restore must issue exactly ONE final onChange');
 assert.equal(result.restored.result_ones,'3');
 assert.equal(result.restored.result_tens,'5');
 assert.equal(result.restored.carry_tens,true);
 assert.equal(result.focused,'result_tens','W1-01 restore must preserve chosen D2 focus');
 return result;
}
async function draftContract(page){
 const result=await page.evaluate(()=>{
  const api=window.ULTLAB;
  const q=window.__ULTLAB_PACKS__.A.questions.find(x=>x.rendererId==='D2');
  api.setData(window.__ULTLAB_PACKS__.A);api.openQuestion(q.questionId);
  const identity=api.getDraftIdentity?.();
  const handle=api.getHandleContract?.();
  const keys=['packId','contentVersion','lessonId','questionId','rendererVersion'];
  const pack=JSON.parse(JSON.stringify(window.__ULTLAB_PACKS__.A));
  pack.contentVersion='QA_N1_V2';
  const accepted=api.setData(pack);
  const identityV2=api.getDraftIdentity?.();
  const blocked=JSON.parse(JSON.stringify(pack));
  blocked.questions.find(x=>x.rendererId==='D10').publicVariant.calculationSteps=2;
  const multistep=api.validate(blocked);
  return {identity,handle,identityV2,accepted,multistep,keys,
   originalPackId:window.__ULTLAB_PACKS__.A.packId};
 });
 assert.equal(result.accepted.ok,true,JSON.stringify(result));
 assert(result.identity&&result.identityV2,'W1-02 draft identity not exposed');
 for(const key of result.keys){
  assert.equal(typeof result.identity[key],'string','missing '+key);
  assert(result.identity[key].length>1,'empty '+key);
 }
 assert.equal(result.identity.packId,result.originalPackId);
 assert.equal(result.identityV2.contentVersion,'QA_N1_V2');
 assert.notEqual(result.identity.key,result.identityV2.key,'W1-02 changed contentVersion must change draft key');
 assert.equal(result.handle?.ok,true,'W1-02 unified LabRenderHandle required');
 for(const f of ['snapshot','restore','clear','destroy'])assert.equal(result.handle[f],true,'missing '+f);
 assert.equal(result.multistep.reason,'D10_ONE_STEP_ONLY','Do not imply multi-step D10 support');
 return result;
}
async function allHandles(page){
 await page.evaluate(()=>window.ULTLAB.setData(window.__ULTLAB_PACKS__.A));
 const found=await page.evaluate(()=>{
  const ids=window.__ULTLAB_PACKS__.A.questions.map(q=>({id:q.questionId,route:q.rendererId}));
  return ids.map(x=>{
   const ret=window.ULTLAB.openQuestion(x.id);
   return {...x,mounted:ret.ok,contract:window.ULTLAB.getHandleContract?.()};
  });
 });
 assert.equal(found.length,12);
 for(const h of found){
  assert.equal(h.mounted,true,'mount '+h.route);
  assert.equal(h.contract?.ok,true,'W1-02 handle '+h.route);
  for(const f of ['snapshot','restore','clear','destroy'])assert.equal(h.contract[f],true,h.route+':'+f);
 }
 return {routeCount:found.length,routes:found.map(x=>x.route)};
}
async function d10UI(page,device){
 await page.evaluate(()=>window.ULTLAB.setData(window.__ULTLAB_PACKS__.A));
 const ret=await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D10'));
 assert.equal(ret.ok,true,JSON.stringify(ret));
 const result=await page.evaluate(()=>{
  const host=document.querySelector('#ulStage .ml-graph-paper');
  const equation=host.querySelector('.ul-word-equation');
  const answer=host.querySelector('.ul-word-answer');
  const names=['n1','op','n2','sum','answer'];
  return {labels:host.textContent,hasEquation:!!equation,hasEquals:!!equation?.querySelector('.ul-word-equals'),
   equationFields:equation?.querySelectorAll('input[data-ml-field]').length||0,
   answerFields:answer?.querySelectorAll('input[data-ml-field]').length||0,
   selectors:names.map(n=>host.querySelector('[data-ml-field="LAB_A_WORD:'+n+'"]')!==null),
   unit:answer?.textContent||''};
 });
 assert.equal(result.hasEquation,true,'W1-03 one-operation math equation absent');
 assert.equal(result.hasEquals,true,'W1-03 equals sign absent');
 assert.equal(result.equationFields,4,'W1-03 equation must contain 4 original fields');
 assert.equal(result.answerFields,1,'W1-03 answer must contain one original field');
 assert(result.selectors.every(Boolean),'W1-03 data-ml-field contract drift');
 assert(!/(?:^|[\s])(?:n1|n2|op|sum|answer):\s/.test(result.labels),'W1-03 technical labels leaked');
 assert(result.unit.includes('Đáp số'),'W1-03 missing answer label');
 const shot='N1_'+device+'_D10_EQUATION.png';
 await page.screenshot({path:path.join(output,shot),animations:'disabled',fullPage:false});
 return {...result,screenshot:shot};
}
async function draftRoundTrip(page){
 await page.evaluate(()=>window.ULTLAB.setData(window.__ULTLAB_PACKS__.A));
 await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D2'));
 await page.locator('#ulStage [data-answer="result_ones"]').fill('3');
 await page.locator('#ulStage [data-answer="result_tens"]').fill('5');
 await page.locator('#ulStage [data-answer="result_tens"]').focus();
 const original=await page.evaluate(()=>window.ULTLAB.getDraft());
 await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D3'));
 await page.evaluate(()=>window.ULTLAB.openQuestion('LAB_A_D2'));
 const restored=await page.evaluate(()=>({
  draft:window.ULTLAB.getDraft(),active:document.activeElement?.dataset.answer
 }));
 assert.deepEqual(restored.draft,original,'W1-01/02 D2 round-trip payload changed');
 assert.equal(restored.active,'result_tens','W1-01/02 D2 focus lost across remount');
 return {restored:true,active:restored.active};
}
(async()=>{
 let browser=null;
 try{
  const port=await listen(),base='http://127.0.0.1:'+port;
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
   ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
  for(const [device,opts] of [['desktop',{viewport:{width:1366,height:768}}],
    ['mobile390',{viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2}]]){
   const context=await browser.newContext(opts),page=await context.newPage();
   try{
    await page.goto(base+'/lab',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    await check(page,device,'W1-01-D1-RESTORE-GUARD',()=>d1Restore(page));
    await check(page,device,'W1-01-D2-RESTORE-GUARD-FOCUS',()=>d2Restore(page));
    await check(page,device,'W1-02-IDENTITY-AND-SCHEMA',()=>draftContract(page));
    await check(page,device,'W1-02-TWELVE-HANDLE-CONTRACTS',()=>allHandles(page));
    await check(page,device,'W1-03-D10-EQUATION',()=>d10UI(page,device));
    await check(page,device,'W1-01-D2-FOCUS-ROUNDTRIP',()=>draftRoundTrip(page));
   }finally{await context.close();}
  }
 }catch(e){report.failures.push({device:'RUNNER',code:'FATAL',error:String(e?.stack||e)});}
 finally{
  if(browser)await browser.close();
  if(server.listening)await close();
  fs.writeFileSync(path.join(output,'ULT_N1_BROWSER_RTM_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
  console.log('ULT_N1_STRICT_W1_01_02_03',report.results.length,'checks',
   report.failures.length,'failures; NO RELEASE');
  for(const f of report.failures)console.error('N1_FAIL',f.device,f.code,f.error.slice(0,350));
  if(report.failures.length)process.exitCode=1;
 }
})().catch(e=>{console.error(e);process.exitCode=1});
