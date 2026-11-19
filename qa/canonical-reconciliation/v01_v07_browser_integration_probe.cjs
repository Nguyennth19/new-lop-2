'use strict';
/*
 * V01-V07 READ-ONLY compiled Apps Script template probe.
 * Uses exact Git source for owner reference and current be-hoc, public-shape
 * synthetic B20 data (51 simulated rows only) and explicit offline GAS mocks.
 * NOT actual Sheet runtime, NOT deployed GAS, NOT a student grading certificate.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const cp=require('node:child_process');
const {chromium}=require('playwright');
const BASE='1b69e277f8de6cb156f46a1d85af33bdad70c0ef';
const OWNER_REFERENCE='f51a12cc07b44f0f893c2e0de40e387cc17b5c3b';
const out=path.resolve('qa/canonical-reconciliation/output');
fs.mkdirSync(out,{recursive:true});
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lop2-v01v07-'));
const readGit=(rev,filename)=>cp.execFileSync('git',['show',rev+':'+filename],{encoding:'utf8',maxBuffer:30_000_000});
const gitHash=(rev,p)=>cp.execFileSync('git',['rev-parse',rev+':'+p],{encoding:'utf8'}).trim();
const css=['01_CSS_NenTang','02_CSS_TrangChu','03_CSS_ThanhTich','04_CSS_LoTrinh'];
for(const file of css)assert.equal(gitHash(BASE,file+'.html'),gitHash(OWNER_REFERENCE,file+'.html'),'Owner baseline CSS blob drift '+file);
const compile=(ref)=>{
 let html=readGit(ref,'GiaoDien.html');
 // All TEST-only Script Properties are simulated OFF. Never invoke a real GAS endpoint.
 html=html.replace(/<\? if \(p13C2GASTestEnabled_\(\)\) \{ \?>([\s\S]*?)<\? \} \?>/g,'');
 html=html.replace(/<\?!= napThanhPhan\('([^']+)'\) \?>/g,(_whole,name)=>{
   const x=readGit(ref,name+'.html');
   return x.replace(/<\/script/gi,'<\\/script');
 });
 assert(!html.includes('<?'),'unresolved GAS scriptlet '+ref);
 const target=path.join(temp,ref===OWNER_REFERENCE?'owner-reference.html':'be-hoc.html');
 fs.writeFileSync(target,html,'utf8');return target;
};
const files={reference:compile(OWNER_REFERENCE),current:compile(BASE)};
const sections=[
 ['toan_b20_lv1_ex1','LV1','vertical',6],
 ['toan_b20_lv1_ex2','LV1','mental',9],
 ['toan_b20_lv1_ex3','LV1','word_problem',2],
 ['toan_b20_lv2_problems','LV2','word_problem',6],
 ['toan_b20_lv3_ex1','LV3','vertical',10],
 ['toan_b20_lv3_ex2','LV3','missing_digit',6],
 ['toan_b20_lv3_ex3','LV3','missing_digit',6],
 ['toan_b20_lv3_ex4','LV3','missing_digit',6]
];
function makeFixture(){
 let idx=0;
 const list=sections.map(([sectionId,level,type,count])=>({
  id:sectionId,levelId:'toan_b20_'+level.toLowerCase(),name:'QA '+type,type,
  generated:count
 }));
 const questions=[];
 for(const x of list)for(let i=0;i<x.generated;i++){
  idx++;
  const q={
   id:'QA_ONLY_'+String(idx).padStart(3,'0'),sectionId:x.id,level:x.levelId.replace('toan_b20_','').toUpperCase(),
   order:i+1,label:'QA '+(i+1),type:x.type,valid:true,theme:'blue',n1:36,n2:17,op:'+',answer:'53',
   prompt:'QA ONLY: có 36 đồ vật, thêm 17 đồ vật; có tất cả bao nhiêu?',unit:'đồ vật',
   summary:'Đã có: 36 đồ vật | Thêm: 17 đồ vật | Có tất cả: ... đồ vật?',
   solutionPrompt:'Số đồ vật có tất cả là:',group:'QA nhóm '+(Math.floor(i/3)+1),
   puzzle:[[3,6],[1,{ans:7}],[5,3]]
  };
  questions.push(q);
 }
 return {lesson:{id:'toan_b20',title:'Bài 20 — QA synthetic',rendererPolicies:[]},
  levels:['LV1','LV2','LV3'].map(level=>({id:'toan_b20_'+level.toLowerCase(),level,name:'QA '+level})),
  sections:list.map(({generated,...x})=>x),questions};
}
const fixture=makeFixture();
assert.equal(fixture.questions.length,51);
const errors=[],screens=[],checks=[],results={};
async function open(page,file){
 await page.addInitScript(payload=>{
  window.__qaGASCalls=[];
  window.__qaBlockedWrites=0;
  // Mock implements the read-only data fetch shape, and never connects to Apps Script.
  function chain(success,failure){
   return new Proxy({}, {get(_obj,key){
    if(key==='withSuccessHandler')return f=>chain(f,failure);
    if(key==='withFailureHandler')return f=>chain(success,f);
    if(key==='layBaiToan20')return ()=>{
     window.__qaGASCalls.push(key);
     Promise.resolve().then(()=>success&&success(payload));
    };
    return (..._args)=>{
     window.__qaGASCalls.push(key);
     if(/^(?:ghi|luu|capNhat|save|append|award|submit|submitAnswer)/i.test(String(key)))
      window.__qaBlockedWrites++;
     // Unknown GAS calls intentionally remain unresolved in this offline fixture.
     // Returning null as a "successful" statistics response would violate the
     // production response contract and create false browser page errors.
     // The only mocked resolved GAS method is layBaiToan20 above.
     return undefined;
    };
   }});
  }
  window.google={script:{run:chain()}};
  // No test action should send real data, even if a test unexpectedly triggers a submit.
  window.__qaNoNetwork=true;
 },fixture);
 await page.route(/^https?:/,route=>route.abort());
 page.on('pageerror',e=>{if(errors.length<30)errors.push(String(e).slice(0,500))});
 await page.goto('file://'+file,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForTimeout(150);
 assert.equal(await page.evaluate(()=>typeof window.moBaiToanSheet),'function','lesson entry missing');
}
async function lesson(page,index){
 await page.evaluate(i=>window.moBaiToanSheet(i),index);
 await page.locator('#mlContent .ml-section').first().waitFor({timeout:12000});
 return page.evaluate(()=>({
  cards:document.querySelectorAll('#mlContent [data-ml-q-card]').length,
  lab:document.querySelectorAll('#mlMenu [data-ml-visual-lab]').length,
  labLabel:document.querySelector('#mlMenu')?.innerText.includes('PHÒNG HÌNH')||false,
  nav:document.querySelectorAll('#mlMenu [data-ml-view]').length,
  listenMental:document.querySelectorAll('#mlContent .ml-mental-row [data-ml-speak-question]').length,
  d2Accordion:document.querySelectorAll('#mlContent .kl-d2-practice').length,
  svgAccordion:document.querySelectorAll('#mlContent .kl-svg-b20-support').length,
  summaryLines:document.querySelectorAll('#mlContent .ml-word-summary-line').length,
  horizOverflow:document.documentElement.scrollWidth>window.innerWidth+3,
  viewport:innerWidth,screen:!!document.querySelector('#mathFullScreen:not([hidden])')
 }));
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const [viewport,opt] of [
   ['desktop',{viewport:{width:1366,height:768},deviceScaleFactor:1}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]
  ]){
   for(const [variant,filename] of Object.entries(files)){
    const ctx=await browser.newContext(opt),page=await ctx.newPage();
    try{
     await open(page,filename);
     const snapshots=[];
     for(let lv=0;lv<3;lv++){
      const state=await lesson(page,lv);
      snapshots.push(state);
      assert(state.screen&&state.nav===4,variant+' '+viewport+' LV'+(lv+1)+' navigation');
      assert(!state.horizOverflow,variant+' '+viewport+' LV'+(lv+1)+' horizontal overflow');
      const screenshot=path.join(out,'v01-v07-'+variant+'-'+viewport+'-lv'+(lv+1)+'.png');
      await page.screenshot({path:screenshot,fullPage:true,timeout:20000});
      screens.push(path.basename(screenshot));
     }
     results[variant+'_'+viewport]=snapshots;
     if(variant==='current'){
      assert.equal(snapshots[0].cards,12,'LV1 synthetic selection 4 vertical+6 mental+2 word');
      assert.equal(snapshots[1].cards,4,'LV2 synthetic selection 4 word');
      assert.equal(snapshots[2].cards,22,'LV3 synthetic selection 6 vertical+6+6+4 missing digits');
      assert(snapshots[0].summaryLines>=6,'word summary lines in current B20 synthetic');
      assert(snapshots.every(x=>x.listenMental===0&&x.d2Accordion===0&&x.svgAccordion===0),
       'owner P1.4 no unsolicited mental listen / D2 / SVG mini panels');
      const submit=page.locator('#mathFullScreen [data-ml-submit]').first();
      const input=page.locator('#mlContent [data-ml-field]').first();
      assert(await input.count()>0,'missing B20 input');
      await input.fill('3');assert.equal(await input.inputValue(),'3');
      // Never execute save/award on fake client: only check UI controls exist.
      assert(await submit.count()>0,'missing graded-flow submit action');
      checks.push('V02_SYNTHETIC_51_3LEVEL_NAV_AND_KEYPAD_PASS');
     }
     await page.locator('#mlMenu [data-ml-view="THEORY"]').click();
     const theory=await page.evaluate(()=>({mode:document.querySelector('#mathFullScreen')?.classList.contains('ml-theory-mode'),
       speak:!!document.querySelector('[data-ml-speak-theory]')}));
     assert(theory.mode,'theory view missing');
     checks.push('V07_THEORY_NAV_'+variant+'_'+viewport+'_PASS');
    }finally{await ctx.close();}
   }
  }
  const ref=results.reference_desktop,cur=results.current_desktop;
  assert.equal(ref[0].lab,0,'baseline unexpected LAB');
  assert.equal(cur[0].lab,3,'be-hoc has three LAB buttons; source probe assumption no longer true');
  const v01=cur[0].lab>ref[0].lab?'OWNER_APPROVAL_NOT_FOUND_FOR_TEST_LAB_MENU':'NO_DETECTED_NEW_LAB_MENU';
  for(const viewport of ['desktop','mobile']){
    const b=results['reference_'+viewport],c=results['current_'+viewport];
    for(let lv=0;lv<3;lv++){
      assert.equal(b[lv].cards,c[lv].cards,'reference/current visible question count drift');
      assert.equal(c[lv].nav,b[lv].nav,'reference/current LV navigation drift');
    }
  }
  const final={
   schema:'LOP2_V01_V07_BROWSER_OFFLINE_PROBE_V1',
   targets:{reference:OWNER_REFERENCE,current:BASE},fixture:'SYNTHETIC_PUBLIC_51_SHAPE__NOT_ACTUAL_SHEET',sourceSectionCounts:sections,
   scope:'Compiled actual repository template, offline mock GAS and Chromium desktop/mobile. No actual GAS/owner/device auth.',
   gates:{V01:v01,V02:'SYNTHETIC_NAV_RENDER_PASS_NO_REAL_DATA_GAS',
    V03:'PARTIAL_ONLY_EXTERNAL_RENDERER_HARNESSES_REQUIRED',V04:'STANDALONE_SOURCE_EXISTS_B20_WIRE_GAP_REVIEW',
    V05:'REQUIRES_D8A_D8B_INDEPENDENT_BROWSER_BEHAVIOR',
    V06:'REQUIRES_PER_ASSET_BROWSER_LOAD_AND_FALLBACK',
    V07:'NO_MENTAL_SPEAK_SYNTHETIC_PASS_AUDIO_REAL_DEVICE_PENDING'},
   screens,checks,results,errors:errors.slice(0,20)
  };
  fs.writeFileSync(path.join(out,'v01-v07-probe.json'),JSON.stringify(final,null,2)+'\n');
  assert.deepEqual(errors,[],'Offline browser JS errors: '+errors.join(' | '));
  console.log(JSON.stringify({summary:'V01_V07_OFFLINE_BROWSER_DIAGNOSTIC_COMPLETE',gates:final.gates,checks:checks.length,
   screens:screens.length,errors:errors.length,firstError:errors[0]||null}));
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1;});
