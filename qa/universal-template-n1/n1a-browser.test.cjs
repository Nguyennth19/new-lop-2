'use strict';
/* N1-A addendum: independently verifies W1-01/02/03 behavioral closure.
 * Browser-synthetic LAB only. Original 36 renderer/CSS source blobs unchanged.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const {makeC}=require('../universal-template-r12/fixture-modes.cjs');
const dist=path.resolve(__dirname,'../universal-template-v1/dist');
const out=path.join(__dirname,'dist');fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(dist,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const server=http.createServer((req,res)=>{
 if(req.method==='GET'&&req.url==='/lab'){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;
 }
 res.statusCode=404;res.end('N1A_LAB_ONLY');
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server.address().port)));
const close=()=>new Promise(resolve=>server.close(resolve));
const report={suite:'ULT_N1A_INDEPENDENT_BEHAVIORAL_QA',schemaVersion:1,
 baseSha:'f7231b0818df2d3a714cf6f05e922deff7fd64b7',
 status:'NO_RELEASE_NO_MERGE',results:[],failures:[]};
async function check(page,device,id,fn){
 try{const detail=await fn(page);report.results.push({device,id,pass:true,detail});}
 catch(e){const error=String(e?.stack||e);report.failures.push({device,id,error});
  report.results.push({device,id,pass:false,error});}
}
async function columnVariants(page){
 const probes=await page.evaluate(pack=>{
  const spec=[
   {id:'PV100_ADD_ZERO_EMPTY_CARRY',variant:pack.questions.find(q=>q.rendererId==='D2').publicVariant,
    values:{result_ones:'0',result_tens:'',carry_tens:true},focus:'result_ones'},
   {id:'PV1000_ADD_3_COLUMNS',variant:pack.questions.find(q=>q.questionId==='R2_C_D2_PV1000').publicVariant,
    values:{result_ones:'0',result_tens:'8',result_hundreds:'7',carry_tens:true},focus:'result_hundreds'},
   {id:'PV100_SUBTRACT_BORROW',variant:pack.questions.find(q=>q.questionId==='R2_C_D2_SUBTRACT').publicVariant,
    values:{result_ones:'7',result_tens:'3'},focus:'result_tens'}
  ];
  return spec.map(s=>{
   const host=document.createElement('div');document.body.append(host);
   let calls=0;
   try{
    const p=window.KLColumnV12.publicPlan(s.variant);
    if(!p.ok)return {id:s.id,error:'INVALID_PLAN',detail:p};
    const handle=window.ULTLAB_HARDENING.wrapD2(window.KLColumnViewV12,host,p,()=>{calls++},()=>{});
    if(!handle.ok)return {id:s.id,error:'INVALID_HANDLE',detail:handle};
    const init=handle.snapshot();
    const transitions=p.transitionSlots.map(t=>t.id);
    // Borrow names must be discovered from public plan, not guessed.
    for(const id of transitions)if(id.startsWith('borrow_'))s.values[id]=true;
    const draft={...init,...s.values};
    calls=0;const r=handle.restore(draft,s.focus);
    const after=handle.snapshot();
    const focus=document.activeElement?.dataset.answer;
    const clearBefore=calls;
    const cleared=handle.clear();
    const blank=handle.snapshot();
    const clearCallbacks=calls-clearBefore;
    handle.destroy();
    return {id:s.id,profile:p.profile,operation:p.operation,columns:p.columns,
     transitionIds:transitions,expected:draft,after,restore:r,callbacks:clearBefore,
     focus,clear:cleared,clearCallbacks,blank,hostEmpty:host.children.length===0};
   }finally{host.remove()}
  });
 },makeC());
 assert.equal(probes.length,3);
 for(const r of probes){
  assert.equal(r.error,undefined,JSON.stringify(r));
  assert.equal(r.restore?.ok,true,r.id+' restore');
  assert.equal(r.callbacks,1,r.id+' emits intermediate callbacks');
  assert.equal(r.clearCallbacks,1,r.id+' clear emits intermediate callbacks');
  assert.equal(r.focus,r.id==='PV100_ADD_ZERO_EMPTY_CARRY'?'result_ones':
   r.id==='PV1000_ADD_3_COLUMNS'?'result_hundreds':'result_tens',r.id+' focus');
  for(const [key,value] of Object.entries(r.expected))
   assert.deepEqual(r.after[key],value,r.id+' '+key);
  assert.equal(r.clear?.ok,true,r.id+' clear');
  for(const [key,value] of Object.entries(r.blank))
   if(key!=='variantId')assert.equal(value,typeof value==='boolean'?false:'',r.id+' clear '+key);
  assert.equal(r.hostEmpty,true,r.id+' destroy leaves DOM');
 }
 const thousand=probes.find(p=>p.id==='PV1000_ADD_3_COLUMNS');
 assert.equal(thousand.columns,3,'PV1000 must render three answer columns');
 const subtraction=probes.find(p=>p.id==='PV100_SUBTRACT_BORROW');
 assert(subtraction.transitionIds.some(x=>x.startsWith('borrow_')),
  'SUBTRACT borrow transitions missing in actual public plan');
 return probes.map(({id,profile,operation,columns,transitionIds,callbacks,clearCallbacks,focus})=>
  ({id,profile,operation,columns,transitionIds,callbacks,clearCallbacks,focus}));
}
async function identityAndIsolation(page){
 const result=await page.evaluate(()=>{
  const api=window.ULTLAB,clone=x=>JSON.parse(JSON.stringify(x));
  const base=clone(window.__ULTLAB_PACKS__.A);
  const variants=[
   ['base',base],
   ['packId',{...clone(base),packId:'MATH_LAB_NEW'}],
   ['contentVersion',{...clone(base),contentVersion:'N1A_VERSION_2'}],
   ['lessonId',(()=>{const v=clone(base);v.lesson.id='LAB_NEW_LESSON';v.questions.forEach(q=>q.lessonId='LAB_NEW_LESSON');return v})()],
   ['questionId',(()=>{const v=clone(base);v.questions[0].questionId='LAB_A_D1_ALT';return v})()]
  ];
  const ids=[];
  for(const [label,pack] of variants){
   const ret=api.setData(pack);
   ids.push({label,ok:ret.ok,reason:ret.reason,id:ret.ok?api.getDraftIdentity():null});
  }
  api.setData(base);api.openQuestion('LAB_A_D2');
  const d2=api.getDraftIdentity();
  api.openQuestion('LAB_A_D3');
  const d3=api.getDraftIdentity();
  // Same questionId string in a different pack must not import old draft.
  api.setData(window.__ULTLAB_PACKS__.A);api.openQuestion('LAB_A_D2');
  const input=document.querySelector('#ulStage [data-answer="result_ones"]');
  input.value='7';input.dispatchEvent(new Event('input',{bubbles:true}));
  const previous=api.getDraft();
  const different=clone(window.__ULTLAB_PACKS__.A);different.packId='MATH_LAB_SAME_ID';
  const newPack=api.setData(different);api.openQuestion('LAB_A_D2');
  const after=api.getDraft();
  return {ids,d2,d3,newPack,previous,after,
   internalVersionIsStable:d2.contentVersion?.startsWith('LAB_FNV64_')};
 });
 for(const entry of result.ids)assert.equal(entry.ok,true,entry.label+':'+entry.reason);
 const first=result.ids[0].id;
 for(const entry of result.ids.slice(1)){
  const key=entry.label;
  assert.notEqual(entry.id.key,first.key,'key unchanged: '+key);
  assert.notEqual(entry.id[key],first[key],'component unchanged: '+key);
 }
 assert.notEqual(result.d2.rendererVersion,result.d3.rendererVersion,'rendererVersion not isolated');
 assert.notEqual(result.d2.key,result.d3.key);
 assert.equal(result.newPack.ok,true);
 assert.equal(result.previous.result_ones,'7');
 assert.equal(result.after,null,'same questionId in new pack leaked a draft');
 return {components:['packId','contentVersion','lessonId','questionId','rendererVersion'],
  isolation:true,contentVersionFallback:result.internalVersionIsStable};
}
async function fullLifecycle(page){
 const result=await page.evaluate(()=>{
  const api=window.ULTLAB,pack=window.__ULTLAB_PACKS__.A;
  api.setData(pack);
  const ids=pack.questions.map(q=>({route:q.rendererId,id:q.questionId}));
  const list=[];
  for(const item of ids){
   const a=api.openQuestion(item.id);
   const before=api.getHandleContract();
   // A fresh route must have a valid snapshot even before student input.
   const clear=api.clearCurrentDraft();
   const removed=api.getDraft();
   const countAfterClear=api.getState().changeCount;
   const b=api.openQuestion(item.id);
   const remounted=api.getHandleContract();
   // Route navigation must destroy previous route's DOM and replace it.
   const other=ids.find(x=>x.id!==item.id);
   const changed=api.openQuestion(other.id);
   const stale=Array.from(document.querySelectorAll('#ulStage [data-variant-id]'))
    .some(node=>node.dataset.variantId===item.id);
   const again=api.openQuestion(item.id);
   list.push({route:item.route,mount:a.ok,hasSnapshot:!!before?.snapshot,
    handle:before,clear:clear.ok,removed:removed===null,countAfterClear,
    remount:b.ok,remounted,other:changed.ok,again:again.ok,stale});
  }
  return list;
 });
 assert.equal(result.length,12);
 for(const r of result){
  for(const key of ['mount','hasSnapshot','clear','removed','remount','other','again'])
   assert.equal(r[key],true,r.route+' '+key);
  assert.equal(r.stale,false,r.route+' stale DOM');
  for(const method of ['snapshot','restore','clear','destroy']){
   assert.equal(r.handle[method],true,r.route+':'+method);
   assert.equal(r.remounted[method],true,r.route+' remounted:'+method);
  }
 }
 return {routes:result.map(r=>r.route),count:result.length,
  note:'LAB facade lifecycle plus clear/destroy through UI navigation; underlying callback spies tested separately'};
}
async function d10Scope(page){
 const r=await page.evaluate(()=>{
  const api=window.ULTLAB,clone=x=>JSON.parse(JSON.stringify(x));
  const good=clone(window.__ULTLAB_PACKS__.A);
  const bad=clone(good);bad.questions.find(q=>q.rendererId==='D10').publicVariant.calculationSteps=2;
  const reject=api.validate(bad);
  const accepted=api.setData(good);
  const mount=api.openQuestion('LAB_A_D10');
  const inputNames=['n1','op','n2','sum','answer'];
  const fields=inputNames.map(n=>document.querySelector('#ulStage [data-ml-field="LAB_A_WORD:'+n+'"]'));
  return {reject,accepted,mount,fields:fields.map(x=>!!x),
   equation:document.querySelector('#ulStage .ul-word-equation')!==null,
   answer:document.querySelector('#ulStage .ul-word-answer')?.textContent};
 });
 assert.equal(r.reject.reason,'D10_ONE_STEP_ONLY');
 assert.equal(r.accepted.ok,true);assert.equal(r.mount.ok,true);
 assert(r.fields.every(Boolean));assert.equal(r.equation,true);
 assert(r.answer.includes('Đáp số'));
 return {oneOperationOnly:true,fields:5,answer:r.answer};
}
(async()=>{
 let browser=null;
 try{
  const port=await listen(),url='http://127.0.0.1:'+port+'/lab';
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
   ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
  for(const [device,opts] of [
   ['desktop',{viewport:{width:1366,height:768}}],
   ['mobile390',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]
  ]){
   const context=await browser.newContext(opts),page=await context.newPage();
   try{
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    await check(page,device,'W1-T02-D2-PV100-PV1000-BORROW',columnVariants);
    await check(page,device,'W1-T03-DRAFT-KEY-FIVE-COMPONENTS',identityAndIsolation);
    await check(page,device,'W1-T04-ALL-12-LIFECYCLE',fullLifecycle);
    await check(page,device,'W1-T05-D10-ONE-OPERATION',d10Scope);
   }finally{await context.close()}
  }
 }catch(e){report.failures.push({device:'RUNNER',id:'RUNNER_FATAL',error:String(e.stack||e)})}
 finally{
  if(browser)await browser.close();
  if(server.listening)await close();
  fs.writeFileSync(path.join(out,'ULT_N1A_ADDENDUM_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
  console.log('N1A_ADDENDUM',report.results.length,'cases',report.failures.length,'failures; NO RELEASE');
  for(const err of report.failures)console.error('N1A_FAILURE',err.device,err.id,err.error.slice(0,800));
  if(report.failures.length)process.exitCode=1;
 }
})().catch(e=>{console.error(e);process.exitCode=1});
