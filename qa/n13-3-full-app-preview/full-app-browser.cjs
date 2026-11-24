'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {compile}=require('./build-preview.cjs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});let count=0;const ok=(v,m)=>{assert.ok(v,m);count++};
 try{
  for(const [device,opts] of [['desktop',{viewport:{width:1366,height:768}}],['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const ctx=await browser.newContext(opts),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   // Read only the pinned repository asset bytes via local routing; no authenticated/external RPC.
   await page.route(/^https?:/,async r=>{const u=new URL(r.request().url());const m=u.hostname==='raw.githubusercontent.com'&&u.pathname.match(/^\/Nguyennth19\/new-lop-2\/[A-Za-z0-9_-]+\/(hinh-anh\/.*)$/);if(!m)return r.abort();const root=path.resolve(__dirname,'../..'),file=path.resolve(root,decodeURIComponent(m[1]));if(!file.startsWith(path.join(root,'hinh-anh')+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return r.abort();const type={'.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg'}[path.extname(file).toLowerCase()];if(!type)return r.abort();return r.fulfill({path:file,contentType:type});});
   await page.setContent(compile(true),{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.LOP2_PREVIEW_DIAGNOSTICS?.snapshot().calls.includes('layTienDoHocTap'));
   ok(await page.locator('#lop2PreviewNotice').isVisible(),device+' TEST notice');
   ok(await page.locator('#subjectGrid .subject').count()===3,device+' subjects');
   await page.locator('#subjectGrid .subject-art img').first().scrollIntoViewIfNeeded();
   await page.evaluate(()=>document.querySelectorAll('#subjectGrid .subject-art img').forEach(img=>img.loading='eager'));
   await page.waitForFunction(()=>{const a=[...document.querySelectorAll('#subjectGrid .subject-art img')];return a.length===3&&a.every(x=>x.complete&&x.naturalWidth>0)});
   ok(true,device+' three local cover binaries decoded');
   await page.locator('[data-view="subjects"]:visible').first().click();ok(await page.locator('#subjects').isVisible(),device+' subjects nav');
   await page.locator('[data-view="path"]:visible').first().click();ok(await page.locator('#path').isVisible(),device+' roadmap');
   await page.locator('[data-view="achievements"]:visible').first().click();await page.waitForFunction(()=>document.getElementById('achvStatus')?.textContent.includes('giả lập'));
   ok(await page.locator('#achievements').isVisible(),device+' achievements');
   await page.locator('[data-view="home"]:visible').first().click();ok(await page.locator('#schoolweek').locator(':scope > *').count()>=7,device+' attendance');
   ok(await page.evaluate(()=>window.BE_HOC_VISUAL_ORCHESTRATOR.allRendererIds.length===12&&window.BE_HOC_C2_TEST_BRIDGE.ready===true),device+' 12 routes and resolver');
   await page.locator('#lop2ReviewOpen').click();ok(await page.locator('#lop2ReviewDialog[open] [data-lesson="MATH_B001"]').count()===8,device+' B001 review');ok(await page.locator('#lop2ReviewDialog[open] [data-lesson="MATH_B002"]').count()===8,device+' B002 review');await page.locator('#lop2ReviewClose').click();
   await page.locator('#subjectGrid [data-subject="Toán 2"]').click();
   await page.locator('#mathFullScreen [data-ml-field]').first().waitFor();
   ok(await page.locator('#mathFullScreen').isVisible(),device+' lesson');await page.locator('#mathFullScreen [data-ml-field]').first().fill('43');await page.locator('[data-ml-submit]').click();
   await page.waitForFunction(()=>window.LOP2_PREVIEW_DIAGNOSTICS.snapshot().denied.includes('ghiNhanKetQuaToan20'));
   ok(await page.locator('#mlRewardSync').textContent().then(s=>s.includes('Không lưu được')),device+' write denial');
   await page.locator('[data-ml-view="THEORY"]').click();ok(await page.locator('[data-ml-speak-theory]').isVisible(),device+' reader button');
   await page.locator('[data-ml-exit]').click();ok(await page.locator('#path').isVisible(),device+' back');
   ok(await page.evaluate(()=>window.LOP2_PREVIEW_DIAGNOSTICS.snapshot().providerWrites===0),device+' provider writes zero');
   ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),device+' overflow');
   ok(errors.length===0,device+' page errors: '+errors.join('; '));
   const output=path.join(__dirname,'output');fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,device+'.png'),fullPage:true});await ctx.close();
  }
 }finally{await browser.close();}
 console.log('N13_3_FULL_APP_INTEGRATED_PREVIEW_PASS',count,'checks; synthetic/offline browser only');
})().catch(e=>{console.error(e);process.exit(1)});
