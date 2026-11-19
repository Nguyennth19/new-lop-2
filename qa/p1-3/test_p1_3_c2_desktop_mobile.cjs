'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const root=process.cwd(),template=fs.readFileSync('GiaoDien.html','utf8');
function compile(on){
 let html=template.replace(/<\? if \(p13C2GASTestEnabled_\(\)\) \{ \?>([\s\S]*?)<\? \} \?>/g,(_m,body)=>on?body:'');
 html=html.replace(/<\?!= napThanhPhan\('([^']+)'\) \?>/g,(_m,name)=>fs.readFileSync(path.join(root,name+'.html'),'utf8'));
 assert(!html.includes('<?'),'no leftover template tags');
 return html;
}
const work=fs.mkdtempSync(path.join(os.tmpdir(),'lop2-c2-'));
const a=path.join(work,'off.html'),b=path.join(work,'on.html');fs.writeFileSync(a,compile(false));fs.writeFileSync(b,compile(true));
const screenshots=path.join(root,'qa/p1-3/output/c2-device');fs.mkdirSync(screenshots,{recursive:true});
const bin=process.env.CHROME_BIN||'/usr/bin/google-chrome';
(async()=>{
 const browser=await chromium.launch({executablePath:bin,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 let checks=0;
 try{
  for(const [device,opts] of [['desktop',{viewport:{width:1366,height:768},deviceScaleFactor:1}],['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   let snapshots={};
   for(const [label,file] of [['off',a],['on',b]]){
    const ctx=await browser.newContext(opts);
    const page=await ctx.newPage();
    // No external account/network dependency; server calls return no data.
    await page.addInitScript(()=>{
      const chain=new Proxy({}, {get(target,prop){
        if(prop==='withSuccessHandler'||prop==='withFailureHandler')return ()=>chain;
        return ()=>chain;
      }});
      window.google={script:{run:chain}};
    });
    await page.route(/^https?:/,route=>route.abort());
    await page.goto('file://'+file,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(200);
    const state=await page.evaluate(()=>{
      const nav=document.getElementById('sidenav'),main=document.querySelector('main.content'),hero=document.querySelector('.hero');
      const orch=window.BE_HOC_VISUAL_ORCHESTRATOR,bridge=window.BE_HOC_C2_TEST_BRIDGE;
      return {nav:!!nav,main:!!main,hero:!!hero,sidebarDisplay:nav?getComputedStyle(nav).display:null,
       heroDisplay:hero?getComputedStyle(hero).display:null,bridgeReady:bridge?.ready===true,
       resolver:!!window.BE_HOC_ASSET_UNIFIED_TEST,registered:orch?.allRendererIds?.length,
       oldAsset:orch?.chooseAsset({assetId:'KL_SH01_001',visualIntent:'DECORATIVE'})?.ok===true,
       legacyRelease:orch?.release,width:document.documentElement.scrollWidth,inner:innerWidth,
       bodyBg:document.body?getComputedStyle(document.body).backgroundColor:null,
       heroBounds:hero?{width:Math.round(hero.getBoundingClientRect().width),height:Math.round(hero.getBoundingClientRect().height)}:null};
    });
    assert(state.nav&&state.main&&state.hero,device+' missing app DOM');
    assert.equal(state.registered,12);assert.equal(state.oldAsset,true);
    assert.equal(state.legacyRelease,'SOURCE_TEST_ONLY');
    assert.equal(state.bridgeReady,label==='on');
    assert.equal(state.resolver,label==='on');
    if(label==='on'){
     const r=await page.evaluate(()=>{
       const b=window.BE_HOC_C2_TEST_BRIDGE;
       return {ok:b.mountDecorative(document.getElementById('home'),{assetId:'KL2_ROBOT_01_STAND',visualIntent:'DECORATIVE'}).ok,
        denied:b.mountDecorative(document.getElementById('home'),{assetId:'FLUENT:chicken',visualIntent:'EXACT_COUNT'}).ok,
        override:b.originalOrchestrator===window.BE_HOC_VISUAL_ORCHESTRATOR};
     });
     assert.equal(r.ok,true);assert.equal(r.denied,false);assert.equal(r.override,true);
     checks+=3;
    }
    const fileName='p13-c2-'+device+'-'+label+'.png';
    await page.screenshot({path:path.join(screenshots,fileName),fullPage:true,timeout:15000});
    snapshots[label]=state;checks+=6;
    await ctx.close();
   }
   for(const field of ['sidebarDisplay','heroDisplay','bodyBg','registered','legacyRelease','oldAsset']){
    assert.deepEqual(snapshots.off[field],snapshots.on[field],device+' changed '+field);checks++;
   }
   assert(Math.abs(snapshots.off.heroBounds.width-snapshots.on.heroBounds.width)<=1);
   assert(Math.abs(snapshots.off.heroBounds.height-snapshots.on.heroBounds.height)<=1);
   assert(Math.abs(snapshots.off.width-snapshots.on.width)<=1);
   checks+=3;
  }
  console.log('P1_3_C2_DESKTOP_MOBILE_CHROME_PASS',JSON.stringify({checks,desktop:[1366,768],mobile:[390,844],modes:['OFF','ON'],screenshots:4,gasLiveDeployment:false}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
