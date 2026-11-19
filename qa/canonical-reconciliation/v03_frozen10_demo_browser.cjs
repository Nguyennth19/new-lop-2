'use strict';
/* V03 original 10-form frozen DEMO renderer DOM proof, not student GAS integration.
 * Playwright uses intentionally offline Tailwind (styles NOT source-pixel-parity).
 * This separately verifies original DEMO source and 10 form mount paths.
 */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const sha='95d0ed90b15889ff069a82d24198fbc82d6ffe81';
const relative='qa/g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html';
const orig=cp.execFileSync('git',['show',sha+':'+relative],{maxBuffer:30000000});
const digest=crypto.createHash('sha256').update(orig).digest('hex');
assert.equal(digest,'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lop2-original10-'));
const name=path.join(dir,'frozen-original-10-forms.html');fs.writeFileSync(name,orig);
const target=path.resolve('qa/canonical-reconciliation/output');fs.mkdirSync(target,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const details=[],faults=[];
 try{
  for(const [label,opts] of [
   ['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]
  ]){
   const ctx=await browser.newContext(opts);const page=await ctx.newPage();
   try{
    page.on('pageerror',e=>faults.push(label+': '+e.message));
    await page.route(/^https?:/,route=>route.abort());
    await page.goto('file://'+name,{waitUntil:'domcontentloaded',timeout:30000});
    for(let type=1;type<=10;type++){
     const r=await page.evaluate(id=>{
      loadExerciseType(id-1);
      const stage=document.getElementById('interactiveStage');
      return {id,stage:!!stage,htmlLength:stage?.innerHTML.length||0,
       tabCount:document.querySelectorAll('#typeTabsContainer button').length,
       badge:document.getElementById('currentTypeBadge')?.innerText,
       childCount:stage?.children.length||0};
     },type);
     assert.equal(r.stage,true);assert(r.htmlLength>100,'rendered stage empty for '+type);
     assert.equal(r.tabCount,10);assert(r.badge.includes(String(type)+'/10'),'wrong active demo type');
     assert(r.childCount>0);
     details.push({viewport:label,...r});
     if(type===2||type===5||type===8||type===9||type===10){
      await page.screenshot({path:path.join(target,'v03-frozen10-'+label+'-type'+type+'.png'),fullPage:false});
     }
    }
   }finally{await ctx.close()}
  }
  const report={gate:'V03_ORIGINAL_FROZEN_10_FORMS_DOM_CHROMIUM_PASS',screenshots:10,
   source:{commit:sha,path:relative,sha256:digest},
   details,errors:faults,
   limitations:'CDN blocked (source not pixel accurate), no current be-hoc 10-form lesson integration or owner device signoff; original demo still has client grading and standalone examples.'};
  fs.writeFileSync(path.join(target,'v03-frozen10-source-dom.json'),JSON.stringify(report,null,2)+'\n');
  assert.deepEqual(faults,[],'Original frozen DEMO script errors: '+faults.join(' | '));
  console.log('V03_ORIGINAL_FROZEN_10_FORMS_CHROMIUM_PASS',details.length,'forms rendered on desktop/mobile; not GAS, not integration parity');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
