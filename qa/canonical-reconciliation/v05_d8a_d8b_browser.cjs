'use strict';
/* V05 read-only true Chromium proof of native D8A/D8B be-hoc renderer views.
   Uses frozen independent PUBLIC TEST specs 8L/5L and 3kg/5kg; no grade/GAS.
*/
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const dest=path.resolve('qa/canonical-reconciliation/output');fs.mkdirSync(dest,{recursive:true});
const specs={
 D8A:{exerciseId:'CAPACITY_LITER_DEMO',mode:'LITER',prompt:'QA: Bình A 8L, bình B 5L',containers:[
  {id:'bottleA',label:'Bình A',capacityLiters:8,currentLiters:3},
  {id:'bottleB',label:'Bình B',capacityLiters:5,currentLiters:1}]},
 D8B:{exerciseId:'WEIGHT_BALANCE_DEMO',mode:'WEIGHT',prompt:'QA: Cân 3 kg và 5 kg',pans:[
  {id:'left',label:'Trái',massKg:3},{id:'right',label:'Phải',massKg:5}]}
};
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const details=[];let n=0;
 try{
 for(const [viewport,opts] of [['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const ctx=await browser.newContext(opts),page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.setContent('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:12px"><main id="qa-d8" style="max-width:940px;margin:0 auto"></main></body></html>');
   await page.addStyleTag({content:fs.readFileSync('82_CSS_OrchestratorModules.html','utf8')});
   for(const p of ['77_D8A_Core.html','78_D8A_View.html','79_D8B_View.html'])
    await page.addScriptTag({content:fs.readFileSync(p,'utf8')});
   for(const [type,spec] of Object.entries(specs)){
    const status=await page.evaluate(({type,spec})=>{
      const host=document.getElementById('qa-d8');host.replaceChildren();
      const core=window.KLCapacityWeightV11.compile(spec);
      if(!core.ok)return {ok:false,compile:core};
      const view=type==='D8A'?window.KLCapacityWeightViewV12:window.KLCapacityWeightViewV11;
      const ret=view.mount(host,core.plan);
      return {ok:ret.ok||false,reason:ret.reason||null};
     },{type,spec});
    assert.equal(status.ok,true,type+' mount fail '+JSON.stringify(status));
    if(type==='D8A'){
     const proof=await page.evaluate(()=>{
       const svg=[...document.querySelectorAll('.g74-cw-v12-vessel')];
       const a=window.KLCapacityWeightViewV12.literGeometry(8,3,8);
       const b=window.KLCapacityWeightViewV12.literGeometry(5,1,8);
       return {svg:svg.length,capacities:svg.map(x=>x.getAttribute('data-capacity-liters')),
        currents:svg.map(x=>x.getAttribute('data-current-liters')),ratio:a.vesselHeight/b.vesselHeight,
        bottom:a.bottom===b.bottom,ratioWater:a.waterHeight/b.waterHeight,
        overflow:document.documentElement.scrollWidth>window.innerWidth+2};
     });
     assert.equal(proof.svg,2);n++;
     assert.deepEqual(proof.capacities,['8','5']);n++;
     assert.deepEqual(proof.currents,['3','1']);n++;
     assert(Math.abs(proof.ratio-8/5)<1e-9);n++;
     assert.equal(proof.bottom,true);n++;
     assert.equal(proof.overflow,false);n++;
     details.push({viewport,type,proof});
    }else{
     const proof=await page.evaluate(()=>{
       const p=window.KLCapacityWeightV11.balanceTilt(3,5);
       const svg=document.querySelector('.g74-cw-scale svg');
       const beam=svg?.querySelector('line[stroke-width="8"]');
       return {relation:p.relation,leftY:p.leftY,rightY:p.rightY,
        beam:beam?{y1:Number(beam.getAttribute('y1')),y2:Number(beam.getAttribute('y2'))}:null,
        overflow:document.documentElement.scrollWidth>window.innerWidth+2};
     });
     assert.equal(proof.relation,'LEFT_LIGHTER');n++;
     assert(proof.leftY<proof.rightY);n++;
     assert(proof.beam&&proof.beam.y1<proof.beam.y2,'3kg left must sit higher than 5kg');n++;
     assert.equal(proof.overflow,false);n++;
     details.push({viewport,type,proof});
    }
    await page.screenshot({path:path.join(dest,'v05-'+type+'-'+viewport+'.png'),fullPage:false});
   }
   assert.deepEqual(errors,[],'browser errors '+errors.join(' | '));
  }finally{await ctx.close()}
 }
 const output={status:'V05_D8A_D8B_BROWSER_PUBLIC_VISUAL_PASS',checks:n,details,
  testScope:'synthetic public fixtures and Chromium desktop/mobile, no approval for real lesson binding or device owner'};
 fs.writeFileSync(path.join(dest,'v05-d8a-d8b-browser.json'),JSON.stringify(output,null,2)+'\n');
 console.log(output.status,n,'assertions; 4 screenshots; actual deployed lesson not tested');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
