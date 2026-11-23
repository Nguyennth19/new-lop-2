'use strict';
/* R1/R2 acceptance browser: all twelve original routes draft round-trip,
 * D1/D2/D10 full composite save/restore, mode C, exact-count positive/negative,
 * mobile+desktop. No real pupils, no GAS, no production release.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const {makeC}=require('./fixture-modes.cjs');
const root=path.resolve(__dirname,'../universal-template-v1/dist');
const output=path.resolve(__dirname,'dist');fs.mkdirSync(output,{recursive:true});
const html=fs.readFileSync(path.join(root,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const server=http.createServer((req,res)=>{if(req.method==='GET'&&req.url==='/lab'){
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return}
 res.statusCode=404;res.end('LAB_ONLY')});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
const report={suite:'ULT_R12_STATE_MODE_ASSET_BROWSER',baseline:'V13B_OWNER_ACCEPTED',
 checks:[],screenshots:[],errors:[],noOriginalRendererChanges:true};
const scope=s=>'#ulStage '+s;
const clone=x=>JSON.parse(JSON.stringify(x));
async function choose(page,questionId){
 const r=await page.evaluate(id=>window.ULTLAB.openQuestion(id),questionId);
 assert.equal(r.ok,true,'mount '+questionId+': '+JSON.stringify(r));return r;
}
async function interact(page,id){
 const loc=selector=>page.locator(scope(selector)).first();
 switch(id){
 case 'D1':
  await loc('.g74t1-slot[data-slot="t1_split1"]').click();
  await loc('.g74t1-pad-key[data-key="0"]').click();
  await loc('.g74t1-slot[data-slot="t1_split2"]').click();
  await loc('.g74t1-pad-key[data-key="3"]').click();
  return;
 case 'D2':
  await loc('[data-answer="result_ones"]').fill('3');
  await loc('[data-answer="result_tens"]').fill('5');
  await loc('[data-transition="carry_tens"]').click();
  return;
 case 'D3':await loc('.g74-match-card.left').click();await loc('.g74-match-card.right').click();return;
 case 'D4':await loc('.g74-choice-answer').click();return;
 case 'D5':await loc('.g74-tangram-piece').click();return;
 case 'D6':await loc('.g74-ds-card').click();await loc('.g74-ds-target').click();return;
 case 'D7':await loc('.g74-cmp-sign').click();return;
 case 'D8':await loc('.g74-ruler-panel input').fill('7');return;
 case 'D8A':case 'D8B':await loc('.g74-cw-btn').click();return;
 case 'D9':await loc('.g74-picto-item').click();return;
 case 'D10':
  await loc('.g74-word-option-select').click();
  for(const [field,value] of [['n1','12'],['op','+'],['n2','6'],['sum','18'],['answer','18']]){
   await loc('[data-ml-field="LAB_A_WORD:'+field+'"]').fill(value);
  }
  return;
 }
 throw Error('UNTESTED_ROUTE '+id);
}
async function testOriginalDraftRoundTrips(page,viewport){
 await page.evaluate(()=>window.ULTLAB.setData(window.__ULTLAB_PACKS__.A));
 const routes=['D1','D2','D3','D4','D5','D6','D7','D8','D8A','D8B','D9','D10'];
 for(const route of routes){
  const id='LAB_A_'+route;
  await choose(page,id);
  await interact(page,route);
  const before=await page.evaluate(()=>window.ULTLAB.getDraft());
  assert(before&&typeof before==='object','no snapshot from '+route);
  if(route==='D1'){
   assert.equal(before.values.t1_split1,'0');
   assert.equal(before.values.t1_split2,'3');
  }
  if(route==='D2'){
   assert.equal(before.result_ones,'3');
   assert.equal(before.result_tens,'5');
   assert.equal(before.carry_tens,true);
  }
  if(route==='D10'){
   assert.deepEqual(before.fields,{n1:'12',op:'+',n2:'6',sum:'18',answer:'18'});
   assert.equal(typeof before.selectedStatementId,'string');
  }
  const next=route==='D3'?'LAB_A_D4':'LAB_A_D3';
  await choose(page,next);
  await choose(page,id);
  const after=await page.evaluate(()=>window.ULTLAB.getDraft());
  assert.deepEqual(after,before,route+' draft mismatch after independent renderer remount');
  report.checks.push({viewport,route,kind:'STATE_ROUND_TRIP',pass:true});
  if(['D1','D2','D10'].includes(route)){
   const png='R2_'+viewport+'_'+route+'_DRAFT.png';
   await page.screenshot({path:path.join(output,png),fullPage:false,animations:'disabled'});
   report.screenshots.push(png);
  }
 }
 await choose(page,'LAB_A_D1');
 const cleared=await page.evaluate(()=>window.ULTLAB.clearCurrentDraft());
 assert.equal(cleared.ok,true);
 await choose(page,'LAB_A_D3');await choose(page,'LAB_A_D1');
 const clean=await page.evaluate(()=>window.ULTLAB.getDraft());
 assert.equal(clean,null,'clear must erase active D1 draft');
 report.checks.push({viewport,kind:'D1_CLEAR_AND_REMOVE',pass:true});
}
async function testModePack(page,viewport){
 const pack=makeC();const set=await page.evaluate(d=>window.ULTLAB.setData(d),pack);
 assert.equal(set.ok,true,'mode C rejected '+JSON.stringify(set));
 assert.equal(set.count,18);
 assert.equal(await page.locator('#ulGrade').isDisabled(),true);
 assert.equal(await page.evaluate(()=>window.ULTLAB.getState().trustedData),false);
 for(const [id,selector] of [
  ['R2_C_D2_SUBTRACT','[data-answer="result_ones"]'],
  ['R2_C_D2_PV1000','[data-answer="result_hundreds"]'],
  ['R2_C_D5_SHAPES','.g74-geo-shape-grid button'],
  ['R2_C_D6_SORT','.g74-ds-card'],
  ['R2_C_D8_CLOCK','.g74-measure-btn'],
  ['R2_C_D9_COUNT_ASSET','.g74-picto-item']]){
  await choose(page,id);
  assert(await page.locator(scope(selector)).count()>0,'mode missing control '+id);
  if(id==='R2_C_D2_PV1000')assert.equal(await page.locator(scope('.kl-col-v12-card')).first().getAttribute('data-columns'),'3');
  if(id==='R2_C_D5_SHAPES')assert(await page.locator(scope('.g74-geo-v11')).count()>0);
  if(id==='R2_C_D9_COUNT_ASSET'){
   const imgs=page.locator(scope('.g74-picto-art img'));
   assert.equal(await imgs.count(),14,'must have 6 apples and 8 tangerines, one img per symbol');
   assert((await imgs.first().getAttribute('src')).includes('FLAT/red_apple.svg'));
  }
  const png='R2_'+viewport+'_'+id+'.png';
  await page.screenshot({path:path.join(output,png),fullPage:false,animations:'disabled'});
  report.screenshots.push(png);
  assert.equal(await page.locator('#ulGrade').isDisabled(),true);
  report.checks.push({viewport,id,kind:'EXPLICIT_TEST_ONLY_MODE',pass:true});
 }
 const neg=await page.evaluate(()=>{
  const sample=JSON.parse(JSON.stringify(window.__ULTLAB_PACKS__.A));
  sample.packId='LAB_R2_C_NEG';sample.lesson.id='LAB_MATH_C';
  for(const q of sample.questions)q.lessonId=sample.lesson.id;
  const d=JSON.parse(JSON.stringify(sample));
  const results={};
  d.questions.find(q=>q.rendererId==='D5').publicVariant.mode='UNKNOWN';
  results.invalidD5=window.ULTLAB.validate(d).reason;
  const p=JSON.parse(JSON.stringify(sample));p.questions.find(q=>q.rendererId==='D2').skillId='COLUMN_SUBTRACT';
  results.mismatch=window.ULTLAB.validate(p).reason;
  const c=JSON.parse(JSON.stringify(sample));c.questions[0].publicVariant.ownerApproved=true;
  results.forged=window.ULTLAB.validate(c).reason;
  return results;
 });
 assert.equal(neg.invalidD5,'SKILL_TYPE_POLICY_MISMATCH');
 assert.equal(neg.mismatch,'SKILL_TYPE_POLICY_MISMATCH');
 assert.equal(neg.forged,'PRIVATE_FIELD_OR_UNSAFE_NESTED_STRUCTURE');
 const base=makeC();
 const variants=[
  ['books',p=>{p.questions.find(q=>q.questionId==='R2_C_D9_COUNT_ASSET').publicVariant.rows[0].assetId='FLUENT:books'},'D9_ASSET_POLICY_FLUENT_UNIT_NOT_APPROVED'],
  ['wrongUnit',p=>{p.questions.find(q=>q.questionId==='R2_C_D9_COUNT_ASSET').countUnit='con'},'D9_ASSET_POLICY_FLUENT_UNIT_NOT_APPROVED'],
  ['wrongSymbolValue',p=>{p.questions.find(q=>q.questionId==='R2_C_D9_COUNT_ASSET').publicVariant.rows[0].symbolValue=2},'D9_EXACT_SYMBOL_UNIT_REQUIRED']
 ];
 for(const [name,mutate,reason] of variants){
  const p=clone(base);mutate(p);
  const v=await page.evaluate(d=>window.ULTLAB.setData(d),p);
  assert.equal(v.ok,false,name);assert.equal(v.reason,reason,name+' reject reason');
  assert.equal(await page.evaluate(()=>window.ULTLAB.getState().packId),'LAB_R2_C');
  report.checks.push({viewport,kind:'SEMANTIC_NEGATIVE',name,reason,pass:true});
 }
 const r=await page.evaluate(()=>window.ULTLAB.grade());
 assert.equal(r.status,'NOT_AUTHORIZED','untrusted C must never borrow A/B grade grant');
}
(async()=>{
 const port=await listen(),base='http://127.0.0.1:'+port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],
  ...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const [device,opts] of [['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const ctx=await browser.newContext(opts),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   try{
    await page.goto(base+'/lab',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    await testOriginalDraftRoundTrips(page,device);
    await testModePack(page,device);
    assert.deepEqual(errors,[],'JS errors on '+device+': '+errors.join(' | '));
    report.errors.push({device,errors});
   }finally{await ctx.close()}
  }
  fs.writeFileSync(path.join(output,'R1_R2_BROWSER_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
  console.log('ULT_R1_R2_BROWSER_STATE_AND_MODES_PASS',report.checks.length,
   'checks',report.screenshots.length,'screenshots; real pupils/GAS/auth NO-GO');
 }finally{await browser.close();await close()}
})().catch(async e=>{console.error(e);try{await close()}catch(_){}process.exitCode=1});
