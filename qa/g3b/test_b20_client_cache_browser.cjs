/* B20 browser regression: real Chromium + public-only synthetic GAS response.
 * This guards the exact client cache / lessonId mismatch observed on live GAS.
 * NOT a GAS deployment test, NOT a source-answer verification.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..');
const {call}=require('../g3a/test_g3a_isolated.cjs');
async function main(){
 const client=fs.readFileSync(path.join(root,'19_KhongGianHocToan.html'),'utf8');
 const cache=fs.readFileSync(path.join(root,'27_BoNhoBaiHoc.html'),'utf8');
 const keyMatch=client.match(/BO_NHO_BAI_HOC\.fetch\('([^']+)',load\)/);
 assert(keyMatch,'B20 client must call common lesson cache');
 const publicData=call('g3aLayBaiToan20Test');
 assert.equal(publicData.securityContract,'G3A_PUBLIC_ALLOWLIST_V1');
 assert.equal(publicData.lesson.id,'toan_b20');
 assert.equal(publicData.questions.length,51);
 assert.equal(keyMatch[1],publicData.lesson.id,
   'cache key MUST match the lesson.id of GAS public projection');
 assert(cache.includes("const VERSION='g3a_public_b20_test_20261118'"),
   'old private/legacy version must not be reused');
 const rendered='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
   '<div id="out"></div><script>'+cache+'<\/script></body></html>';
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let checks=0,errors=[];
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://local-b20-p0.test/',route=>route.fulfill({
   status:200,contentType:'text/html; charset=UTF-8',body:rendered
  }));
  await page.goto('https://local-b20-p0.test/');
  const stats=await page.evaluate(async ({key,data})=>{
   // Browser can receive exactly the G3A public contract and store it.
   const obtained=await BO_NHO_BAI_HOC.fetch(key,()=>Promise.resolve(data));
   const cached=BO_NHO_BAI_HOC.read(key);
   const first={id:obtained.lesson.id,questions:obtained.questions.length,
    cached:cached===obtained};
   // Browser cold-load must also work with the cached public payload.
   const cold=await BO_NHO_BAI_HOC.fetch(key,()=>{
    throw Error('unexpected extra call');
   });
   const namespaceIsolated=sessionStorage.getItem(
    'lop2_lesson_cache_g6_v1_b20_20261111_'+key)===null;
   // The old (incorrect) QA namespace is intentionally invalid.
   let rejectsIncorrect=false;
   try{BO_NHO_BAI_HOC.save('g3a_public_toan_b20_v1',data);}
   catch(e){rejectsIncorrect=e&&e.message==='Dữ liệu bài học không hợp lệ';}
   return {first,reused:cold===obtained,namespaceIsolated,rejectsIncorrect};
  },{key:keyMatch[1],data:publicData});
  assert.equal(stats.first.id,'toan_b20');checks++;
  assert.equal(stats.first.questions,51);checks++;
  assert.equal(stats.first.cached,true);checks++;
  assert.equal(stats.reused,true);checks++;
  assert.equal(stats.namespaceIsolated,true);checks++;
  assert.equal(stats.rejectsIncorrect,true);checks++;
  assert.deepEqual(errors,[]);checks++;
  console.log('B20 actual Chromium public-client cache regression:',checks+'/7 PASS');
  fs.writeFileSync(path.join(__dirname,'B20_CLIENT_CACHE_BROWSER_RESULTS.json'),
   JSON.stringify({scope:'B20_PUBLIC_CLIENT_CACHE_CHROMIUM_SYNTHETIC',
    checks,passed:checks,failed:0,publicQuestions:51,canonicalLessonId:'toan_b20',
    oldWrongKeyRejected:true,newCacheVersion:true,jsErrors:0,
    liveGasDeploymentVerified:false,studentRelease:'NO_GO'},null,2)+'\n');
  await ctx.close();
 }finally{await browser.close();}
}
main().catch(e=>{console.error('B20 client browser regression FAILED:',e.stack||String(e));process.exitCode=1;});
