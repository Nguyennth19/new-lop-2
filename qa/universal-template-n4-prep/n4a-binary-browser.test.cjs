'use strict';
/* N4-A W1-04: actual Chromium binary decoding on local HTTP, and semantic
   policy fail-closed. No external network needed for deterministic CI.
   Live origin is a separate gated smoke suite, NOT certified by this suite. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const {makeC}=require('../universal-template-r12/fixture-modes.cjs');
const baseDir=path.resolve(__dirname,'../..');
const labFile=path.join(baseDir,'qa/universal-template-v1/dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html');
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'N4A_BINARY_TEST_CONTRACT.json'),'utf8'));
const out=path.join(__dirname,'dist');fs.mkdirSync(out,{recursive:true});
const report={suite:'N4A_LOCAL_HTTP_REAL_BINARY_CHROMIUM',gate:'W1-04',status:'PENDING',
  scopes:['OFFLINE_REAL_BINARY','SEMANTIC_NEGATIVES','404_FAIL_CLOSED'],
  realLiveOriginSmoke:'NOT_EXECUTED_SEPARATE_GATE',checks:[],errors:[],assets:[],screenshots:[]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const fileMap=new Map();
for(const a of plan.assets){
 const b=fs.readFileSync(path.join(baseDir,a.path));
 if(a.expectedSha256)assert.equal(sha(b),a.expectedSha256,'SOURCE_SHA_DRIFT '+a.id);
 if(a.bytes)assert.equal(b.length,a.bytes,'SOURCE_SIZE_DRIFT '+a.id);
 fileMap.set('/asset/'+a.path,{bytes:b,mime:a.contentType,expectedSha256:a.expectedSha256,assetId:a.id});
 report.assets.push({id:a.id,path:a.path,bytes:b.length,sha256:sha(b),status:'REAL_BYTES_VERIFIED'});
}
const html=fs.readFileSync(labFile);
const server=http.createServer((req,res)=>{
 const key=decodeURIComponent((req.url||'').split('?')[0]);
 if(req.method==='GET'&&key==='/lab'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html);return}
 const found=fileMap.get(key);
 if(req.method==='GET'&&found){
  res.writeHead(200,{'Content-Type':found.mime,'Content-Length':found.bytes.length,'Cache-Control':'no-store','X-ULT-LOCAL-BINARY':'sha256:'+sha(found.bytes)});
  res.end(found.bytes);return
 }
 res.writeHead(404,{'Content-Type':'text/plain','Cache-Control':'no-store'});res.end('MISSING_REAL_BINARY');
});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
const clone=o=>JSON.parse(JSON.stringify(o));
const check=(device,name,data={})=>report.checks.push({device,name,pass:true,...data});
const scope=s=>'#ulStage '+s;
async function imgReady(page,selector,expected){
 const imgs=page.locator(scope(selector));
 assert.equal(await imgs.count(),expected,'IMG_COUNT '+selector);
 await page.waitForFunction(({selector,expected})=>{
  const imgs=[...document.querySelectorAll('#ulStage '+selector)];
  return imgs.length===expected&&imgs.every(i=>i.complete);
 },{selector,expected},{timeout:14000});
 const states=await imgs.evaluateAll(nodes=>nodes.map(i=>({src:i.currentSrc||i.src,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,complete:i.complete,failed:i.dataset.ultAssetLoadFailed||null})));
 for(const s of states){assert(s.complete&&s.naturalWidth>0&&s.naturalHeight>0,'BROWSER_BINARY_DECODE_FAILED '+JSON.stringify(s));assert(!s.failed,'SILENT_LOAD_FAILURE')}
 return states;
}
(async()=>{
 const port=await listen(),base='http://127.0.0.1:'+port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const [device,ctxOpts] of [['desktop1366',{viewport:{width:1366,height:768}}],
   ['mobile390',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const context=await browser.newContext(ctxOpts),page=await context.newPage();
   const errors=[],assetResponses=[],unexpected=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('response',r=>{if(r.url().includes('/asset/'))assetResponses.push({url:r.url(),status:r.status(),mime:r.headers()['content-type'],binary:r.headers()['x-ult-local-binary']})});
   await page.route('https://raw.githubusercontent.com/**',async route=>{
    const url=new URL(route.request().url());
    const pathPart=url.pathname;
    const matched=plan.assets.find(a=>pathPart==='/Nguyennth19/new-lop-2/'+a.sourceCommit+'/'+a.path);
    if(!matched){unexpected.push(route.request().url());await route.fulfill({status:404,contentType:'text/plain',body:'UNPINNED_SOURCE_REJECTED'});return}
    await route.fulfill({status:302,headers:{location:base+'/asset/'+matched.path},body:''});
   });
   try{
    await page.goto(base+'/lab',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A');
    const c=makeC();
    let set=await page.evaluate(p=>window.ULTLAB.setData(p),c);
    assert.equal(set.ok,true,'MODE_C_REJECTED '+JSON.stringify(set));
    let open=await page.evaluate(()=>window.ULTLAB.openQuestion('R2_C_D9_COUNT_ASSET'));
    assert.equal(open.ok,true);
    const imgs=await imgReady(page,'.g74-picto-art img',14);
    assert.equal(imgs.filter(x=>x.src.includes('red_apple.svg')).length,6);
    assert.equal(imgs.filter(x=>x.src.includes('tangerine.svg')).length,8);
    assert.equal(await page.locator('#ulStatus').getAttribute('data-kind'),'note');
    const shot='N4A_'+device+'_D9_14_REAL_BINARY.png';
    await page.screenshot({path:path.join(out,shot),animations:'disabled'});
    report.screenshots.push(shot);
    check(device,'D9_FOURTEEN_REAL_SVG_DECODE',{decoded:14,apple:6,tangerine:8});
    for(const [name,mut,reason] of [
      ['FLUENT_BOOKS_REJECT',p=>p.questions.find(q=>q.questionId==='R2_C_D9_COUNT_ASSET').publicVariant.rows[0].assetId='FLUENT:books','D9_ASSET_POLICY_FLUENT_UNIT_NOT_APPROVED'],
      ['WRONG_UNIT_REJECT',p=>p.questions.find(q=>q.questionId==='R2_C_D9_COUNT_ASSET').countUnit='con','D9_ASSET_POLICY_FLUENT_UNIT_NOT_APPROVED'],
      ['SYMBOL_VALUE_REJECT',p=>p.questions.find(q=>q.questionId==='R2_C_D9_COUNT_ASSET').publicVariant.rows[0].symbolValue=2,'D9_EXACT_SYMBOL_UNIT_REQUIRED']]){
      const altered=clone(c);mut(altered);
      const res=await page.evaluate(p=>window.ULTLAB.setData(p),altered);
      assert.equal(res.ok,false,name);assert.equal(res.reason,reason,name);
      check(device,name,{reason});
    }
    const d=clone(c),pick=d.questions.find(q=>q.rendererId==='D4');
    pick.visualIntent='CHOICE';pick.publicVariant.options[0].content={type:'ASSET',assetId:'FLUENT:red_apple',alt:'Quả táo'};
    set=await page.evaluate(p=>window.ULTLAB.setData(p),d);assert.equal(set.ok,true);
    open=await page.evaluate(()=>window.ULTLAB.openQuestion('R2_C_D4'));assert.equal(open.ok,true);
    const choice=await imgReady(page,'.g74-choice-asset',1);
    check(device,'D4_REAL_CHOICE_SVG_DECODE',{decoded:choice.length});
    const dest='N4A_'+device+'_D4_CHOICE_REAL_BINARY.png';
    await page.screenshot({path:path.join(out,dest),animations:'disabled'});report.screenshots.push(dest);
    const testUrl=base+'/asset/'+plan.assets.find(a=>a.id==='KL_SH01_001').path;
    const webpResult=await page.evaluate(async url=>{
      const img=new Image();img.src=url;await img.decode();
      return {complete:img.complete,w:img.naturalWidth,h:img.naturalHeight,src:img.src};
    },testUrl);
    assert(webpResult.complete&&webpResult.w>0&&webpResult.h>0,'WEBP_BINARY_DECODE');
    check(device,'WEBP_REAL_BINARY_DECODE',{width:webpResult.w,height:webpResult.h});
    const response=await page.request.get(testUrl);assert.equal(response.status(),200);assert((response.headers()['content-type']||'').startsWith('image/webp'));assert.equal(sha(await response.body()),sha(fileMap.get('/asset/'+plan.assets.find(a=>a.id==='KL_SH01_001').path).bytes));
    check(device,'WEBP_HTTP_200_MIME_SHA256');
    const svgResponse=await page.request.get(base+'/asset/'+plan.assets.find(a=>a.id==='FLUENT:red_apple').path);
    assert.equal(svgResponse.status(),200);assert((svgResponse.headers()['content-type']||'').startsWith('image/svg+xml'));assert.equal(sha(await svgResponse.body()),plan.assets.find(a=>a.id==='FLUENT:red_apple').expectedSha256);
    check(device,'SVG_HTTP_200_MIME_SHA256');
    // Missing REAL asset: browser network 404, image decode failure, no fake fallback.
    const badPath=base+'/asset/hinh-anh/svg-fallback/fluent-emoji-flat/v1/FLAT/no_such_asset_n4.svg';
    const fail=await page.evaluate(async url=>{
      const i=new Image();i.src=url;
      try{await i.decode();return {decoded:true,width:i.naturalWidth}}catch{return {decoded:false,width:i.naturalWidth,complete:i.complete}}
    },badPath);
    assert.equal(fail.decoded,false);assert.equal(fail.width,0);
    const notFound=await page.request.get(badPath);assert.equal(notFound.status(),404);
    check(device,'MISSING_ASSET_REAL_HTTP_404_NO_BROWSER_DECODE');
    assert.deepEqual(unexpected,[],'unexpected binary origin path '+unexpected.join('|'));
    assert.deepEqual(errors,[],'browser JS errors '+errors.join('|'));
    const successful=assetResponses.filter(r=>r.status===200);
    // Repeated D9 symbols share cached WebP/SVG URLs; 14 decoded IMG elements do not imply 14 HTTP requests.
    assert(successful.length>=3,'too few distinct real binary HTTP successes (2 D9 SVG types + D4 choice): '+successful.length);
    assert(successful.every(r=>/^image\/(svg\+xml|webp)/.test(r.mime||'')&&r.binary?.startsWith('sha256:')));
    check(device,'LIVE_DOM_HTTP_LOCAL_ASSET_RESPONSES',{status200:successful.length});
    report.errors.push({device,pageErrors:errors,unexpectedBinarySources:unexpected});
   }finally{await context.close()}
  }
  report.status='LAB_OFFLINE_BINARY_PASS__LIVE_ORIGIN_PENDING';
  fs.writeFileSync(path.join(out,'N4A_REAL_BINARY_BROWSER_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
  console.log('N4A_OFFLINE_BINARY_PASS',report.checks.length,'checks',report.assets.length,'assets',report.screenshots.length,'screenshots; LIVE_ORIGIN_PENDING');
 }finally{await browser.close();await close()}
})().catch(async e=>{report.status='FAIL';report.errors.push({error:String(e.stack||e)});fs.writeFileSync(path.join(out,'N4A_REAL_BINARY_BROWSER_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');console.error(e);try{await close()}catch(_){}process.exitCode=1});
