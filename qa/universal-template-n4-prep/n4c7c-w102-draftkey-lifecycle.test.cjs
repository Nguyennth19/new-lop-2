'use strict';
/* W1-02: composite DraftKey and 12-renderer handle lifecycle.
 * Synthetic-only LAB. Compare real five-part identity and ensure drafts
 * do not cross pack/version/lesson/question/renderer boundaries.
 * No persistence-across-refresh or trusted grading claims.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const out=path.resolve(__dirname,'dist/N4C7C_W102');
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.resolve(__dirname,'../universal-template-v1/dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const routes=['D1','D2','D3','D4','D5','D6','D7','D8','D8A','D8B','D9','D10'];
const server=http.createServer((req,res)=>{
 if(req.method==='GET'&&req.url==='/lab'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html);return;}
 res.statusCode=404;res.end('LAB_ONLY');
});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
const report={suite:'W1_02_COMPOSITE_DRAFTKEY_12_RENDERER_LIFECYCLE',status:'RUNNING',
 ciScope:'CHROMIUM_DESKTOP_AND_MOBILE_EMULATION',
 physicalDevice:'NOT_TESTED',serverGrading:'NOT_TESTED',humanQA:'PENDING',
 checks:[],failures:[],pageErrors:[]};
async function check(page,device,id,fn){
 try{const detail=await fn();report.checks.push({device,id,pass:true,detail})}
 catch(e){report.failures.push({device,id,error:String(e.stack||e)});report.checks.push({device,id,pass:false,error:String(e)});}
}
async function mount(page,id){
 const result=await page.evaluate(x=>window.ULTLAB.openQuestion(x),id);
 assert(result.ok,'mount '+id+' '+JSON.stringify(result));
}
async function input(page,route){
 const at=s=>page.locator('#ulStage '+s).first();
 switch(route){
  case 'D1':await at('.g74t1-slot[data-slot="t1_split1"]').click();await at('.g74t1-pad-key[data-key="0"]').click();break;
  case 'D2':await at('[data-answer="result_ones"]').fill('3');break;
  case 'D3':await at('.g74-match-card.left').click();await at('.g74-match-card.right').click();break;
  case 'D4':await at('.g74-choice-answer').click();break;
  case 'D5':await at('.g74-tangram-piece').click();break;
  case 'D6':await at('.g74-ds-card').click();await at('.g74-ds-target').click();break;
  case 'D7':await at('.g74-cmp-sign').click();break;
  case 'D8':await at('.g74-ruler-panel input').fill('7');break;
  case 'D8A':case 'D8B':await at('.g74-cw-btn').click();break;
  case 'D9':await at('.g74-picto-item').click();break;
  case 'D10':await at('.g74-word-option-select').click();await at('[data-ml-field="LAB_A_WORD:n1"]').fill('12');break;
  default:throw Error('UNTESTED_ROUTE '+route);
 }
}
async function identityMatrix(page,route){
 return page.evaluate(route=>{
  const api=window.ULTLAB,copy=x=>JSON.parse(JSON.stringify(x));
  const base=copy(window.__ULTLAB_PACKS__.A);
  const id='LAB_A_'+route, target=base.questions.find(q=>q.questionId===id);
  const index=base.questions.findIndex(q=>q.questionId===id);
  if(index<0)throw Error('missing route '+route);
  const setup=(pack,qid=id)=>{
   const result=api.setData(pack);
   if(!result.ok)throw Error('setData refused '+JSON.stringify(result));
   const mounted=api.openQuestion(qid);
   if(!mounted.ok)throw Error('mount refused '+JSON.stringify(mounted));
   return api.getDraftIdentity();
  };
  const original=setup(base);
  const fields=['packId','contentVersion','lessonId','questionId','rendererVersion'];
  if(fields.some(k=>typeof original[k]!=='string'||!original[k]))throw Error('missing one of 5 components');
  if(original.key!==fields.map(k=>encodeURIComponent(original[k])).join('|'))throw Error('composite key serialization mismatch');
  const results=[];
  const variations=[
   {name:'packId',pack:(()=>{const p=copy(base);p.packId='LAB_N1C_PACK_X';return p})(),which:'packId',qid:id},
   {name:'contentVersion',pack:(()=>{const p=copy(base);p.contentVersion='N1C_CONTENT_V2';return p})(),which:'contentVersion',qid:id},
   {name:'lessonId',pack:(()=>{const p=copy(base);p.lesson.id='LAB_N1C_LESSON';p.questions.forEach(q=>q.lessonId=p.lesson.id);return p})(),which:'lessonId',qid:id},
   {name:'questionId',pack:(()=>{const p=copy(base);p.questions[index].questionId=id+'_ALT';if(route==='D10')p.questions[index].publicVariant.questionId=id+'_ALT';return p})(),which:'questionId',qid:id+'_ALT'},
   {name:'rendererVersion',pack:(()=>{
      const p=copy(base);const alt=p.questions.find(q=>q.rendererId===(route==='D3'?'D4':'D3'));
      p.questions[index]={...copy(alt),questionId:id,lessonId:p.lesson.id};
      return p;
   })(),which:'rendererVersion',qid:id},
   {name:'contentFallbackHash',pack:(()=>{const p=copy(base);p.lesson.title='A different synthetic test lesson title';return p})(),which:'contentVersion',qid:id}
  ];
  for(const variant of variations){
   const result=setup(variant.pack,variant.qid);
   if(!result||result.key===original.key)throw Error(route+' '+variant.name+' key collision');
   if(result[variant.which]===original[variant.which])throw Error(route+' '+variant.name+' component unchanged');
   if(api.getDraft()!==null)throw Error(route+' '+variant.name+' stale draft imported');
   const unrelated=fields.filter(x=>x!==variant.which);
   const drift=unrelated.filter(x=>x!=='contentVersion'&&result[x]!==original[x]);
   // For fallback contentVersion, any fixture mutation may change local hash as intended.
   if(drift.length)throw Error(route+' '+variant.name+' unexpectedly changed '+drift.join(','));
   results.push({dimension:variant.name,oldKey:original.key,newKey:result.key,importedDraft:false});
  }
  // Back to same pack + ID must produce deterministic identity, not timestamp-derived.
  const repeat=setup(base);
  if(repeat.key!==original.key)throw Error(route+' deterministic key changed');
  return {route,fieldNames:fields,variantCount:results.length,deterministic:true,
    distinctKeys:results.every(r=>r.oldKey!==r.newKey),
    testedDimensions:results.map(r=>r.dimension)};
 },route);
}
(async()=>{
 const port=await listen(),browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
  ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const d of [
   {name:'desktop1366',options:{viewport:{width:1366,height:768},hasTouch:false}},
   {name:'mobile390',options:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}}
  ]){
   const context=await browser.newContext(d.options),page=await context.newPage();
   page.on('pageerror',e=>report.pageErrors.push({device:d.name,error:String(e)}));
   try{
    await page.goto('http://127.0.0.1:'+port+'/lab',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    for(const route of routes)await check(page,d.name,'KEY_'+route,()=>identityMatrix(page,route));
    // Full lifecycle: actual DOM interactions, round-trip, clear, destroy, remount.
    for(const route of routes)await check(page,d.name,'LIFECYCLE_'+route,async()=>{
     const packOk=await page.evaluate(()=>window.ULTLAB.setData(window.__ULTLAB_PACKS__.A));
     assert(packOk.ok,'LAB pack not loaded');const id='LAB_A_'+route;
     await mount(page,id);
     const contract=await page.evaluate(()=>window.ULTLAB.getHandleContract());
     assert(['snapshot','restore','clear','destroy'].every(k=>contract?.[k]),'handle incomplete '+route);
     const identity=await page.evaluate(()=>window.ULTLAB.getDraftIdentity());
     assert(identity.questionId===id&&identity.key,'identity not bound to question');
     await input(page,route);
     const before=await page.evaluate(()=>window.ULTLAB.getDraft());
     assert(before&&typeof before==='object','missing actual draft');
     const oldRoot=await page.evaluate(()=>{
      window.__N1C_OLD_ROOT=document.getElementById('ulStage').firstElementChild;
      return !!window.__N1C_OLD_ROOT;
     });
     assert(oldRoot,'renderer root missing');
     const other=route==='D3'?'LAB_A_D4':'LAB_A_D3';
     await mount(page,other);
     assert(await page.evaluate(()=>!window.__N1C_OLD_ROOT.isConnected),'destroy retained old DOM');
     await mount(page,id);
     const restored=await page.evaluate(()=>window.ULTLAB.getDraft());
     assert.deepEqual(restored,before,'saved draft not restored on same five-part key');
     const clear=await page.evaluate(()=>window.ULTLAB.clearCurrentDraft());
     assert(clear.ok,'clear failed');assert.equal(await page.evaluate(()=>window.ULTLAB.getDraft()),null,'clear not null');
     await mount(page,other);await mount(page,id);
     assert.equal(await page.evaluate(()=>window.ULTLAB.getDraft()),null,'cleared draft leaked after remount');
     return {route,handle:contract,initialKey:identity.key,savedAndRestored:true,cleared:true,destroyDetached:true,remountClean:true};
    });
    await check(page,d.name,'NO_SCRIPT_ERRORS',async()=>{const e=report.pageErrors.filter(x=>x.device===d.name);assert.equal(e.length,0);return {pageErrors:0}});
   }finally{await context.close()}
  }
  if(report.failures.length)throw Error(report.failures.length+' failed browser checks: '+report.failures.map(f=>f.id).join(','));
  report.status='TECHNICAL_CHROMIUM_PASS_HUMAN_QA_PENDING';
  console.log('N4C7C_W102_BROWSER_PASS',report.checks.length,'checks',routes.length,'routes',2,'viewports');
 }catch(e){report.status='FAIL';report.failures.push({scope:'suite',error:String(e.stack||e)});console.error(e);process.exitCode=1}
 finally{fs.writeFileSync(path.join(out,'N4C7C_W102_FIVE_COMPONENT_LIFECYCLE_REPORT.json'),JSON.stringify(report,null,2)+'\n');await browser.close();await close()}
})().catch(e=>{console.error(e);process.exitCode=1});
