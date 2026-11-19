'use strict';
// P1.3-C.3 LIVE GAS TEST read-only browser acceptance.
// Requires explicit externally supplied URL and authorization to access TEST.
// No Apps Script deployment/property changes, no grading writes and no student data.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright-core');
const {URL}=require('node:url');
const raw=process.env.P13_C3_GAS_TEST_URL||'';
const expected=process.env.P13_C3_EXPECT_FLAG||'OFF';
const accepted=new Set(['OFF','ON']);
if(!raw){console.error('BLOCKED: P13_C3_GAS_TEST_URL not supplied; live test has NOT been run');process.exit(2);}
if(!accepted.has(expected))throw Error('P13_C3_EXPECT_FLAG must be OFF or ON');
const url=new URL(raw);
const pathOk=/^\/macros\/s\/[a-zA-Z0-9_-]+\/(exec|dev)$/.test(url.pathname);
if(url.protocol!=='https:'||url.hostname!=='script.google.com'||!pathOk||url.search||url.hash)
 throw Error('Only exact HTTPS script.google.com/macros/s/<deployment-id>/exec or /dev URLs allowed, no query/fragment');
const out=process.env.P13_C3_EVIDENCE_DIR||'qa/p1-3/output/c3-live';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const evidence={gate:'P1.3-C.3',dateUtc:new Date().toISOString(),mode:expected,
  targetOrigin:url.origin,targetPathTemplate:'/macros/s/[REDACTED]/exec',checks:[],failures:[],
  deviceResults:[],approval:'NOT_INFERRED'};
 const check=(ok,label)=>{(ok?evidence.checks:evidence.failures).push(label);};
 try{
  for(const [name,options] of [
   ['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]
  ]){
   const ctx=await browser.newContext(options),page=await ctx.newPage();
   const errs=[];
   page.on('pageerror',e=>errs.push(String(e.message).slice(0,150)));
   let response=null;
   try{response=await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(1200);}
   catch(err){evidence.failures.push(name+': navigation failed '+String(err.message).slice(0,120));await ctx.close();continue;}
   const state=await page.evaluate(()=>{
    const b=window.BE_HOC_C2_TEST_BRIDGE,old=window.BE_HOC_VISUAL_ORCHESTRATOR;
    return {title:document.title,nav:!!document.getElementById('sidenav'),
     hero:!!document.querySelector('.hero'),rendererCount:old?.allRendererIds?.length??null,
     oldRelease:old?.release??null,bridgeLoaded:!!b,bridgeReady:b?.ready===true,
     unifiedLoaded:!!window.BE_HOC_ASSET_UNIFIED_TEST,
     width:document.documentElement.scrollWidth,inner:innerWidth,
     studentWrites:old?.studentWrites??null};
   });
   check(response?.status()===200,name+': HTTP 200');
   check(state.nav&&state.hero,name+': main visual layout');
   check(state.rendererCount===12&&state.oldRelease==='SOURCE_TEST_ONLY',name+': inherited renderer registry');
   check(state.bridgeLoaded===(expected==='ON')&&state.unifiedLoaded===(expected==='ON'),
    name+': feature state matches expected');
   if(expected==='ON')check(state.bridgeReady,name+': opt-in bridge ready');
   check(errs.length===0,name+': no uncaught JavaScript errors');
   const screenshot=out+'/'+name+'-'+expected.toLowerCase()+'.png';
   await page.screenshot({path:screenshot,fullPage:true});
   evidence.deviceResults.push({name,httpStatus:response?.status(),state,pageErrors:errs,screenshot});
   await ctx.close();
  }
 }finally{await browser.close();}
 evidence.result=evidence.failures.length?'FAIL':'PASS';
 fs.writeFileSync(out+'/c3-live-'+expected.toLowerCase()+'.json',JSON.stringify(evidence,null,2)+'\n');
 console.log('P1_3_C3_LIVE_READ_ONLY_'+evidence.result,JSON.stringify({mode:expected,checks:evidence.checks.length,failures:evidence.failures.length,devices:evidence.deviceResults.length}));
 if(evidence.failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
