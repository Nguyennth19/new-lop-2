'use strict';
/* N4-A.2 independent network-origin smoke. Runs outside deterministic local CI.
   Does not modify any sources, Drive, GAS, Sheets, student data or manifest. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),output=path.join(__dirname,'dist');
fs.mkdirSync(output,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'N4A_BINARY_TEST_CONTRACT.json'),'utf8'));
const report={suite:'N4A_LIVE_ORIGIN_PINNED_BINARY_SMOKE',status:'PENDING',scope:'NETWORK_ORIGIN_ONLY',checks:[],errors:[],browser:'Chromium',
  sourceMode:'IMMUTABLE_GITHUB_RAW_COMMIT',notIncluded:['physical real device','W1-05 visual parity','owner signoff','production readiness']};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();
 try{
  await page.goto('about:blank');
  for(const asset of manifest.assets.filter(a=>a.expected==='ALLOW'||a.expected==='ALLOW_BINARY_DECODE')){
   const url='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/'+asset.sourceCommit+'/'+asset.path;
   const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(30000),headers:{'User-Agent':'ult-n4a-pinned-origin-smoke/1.0','Cache-Control':'no-cache'}});
   const body=Buffer.from(await response.arrayBuffer()),digest=sha(body);
   assert.equal(response.status,200,'ORIGIN_STATUS '+asset.id+' '+response.status);
   const type=response.headers.get('content-type')||'';
   assert(type.startsWith(asset.contentType),'ORIGIN_MIME '+asset.id+' '+type);
   assert(body.length>0,'EMPTY_BINARY '+asset.id);
   if(asset.expectedSha256)assert.equal(digest,asset.expectedSha256,'ORIGIN_SHA '+asset.id);
   if(asset.bytes)assert.equal(body.length,asset.bytes,'ORIGIN_SIZE '+asset.id);
   const local=fs.readFileSync(path.join(root,asset.path));
   assert.equal(digest,sha(local),'ORIGIN_DIFFERS_FROM_FROZEN_LOCAL '+asset.id);
   const image=await page.evaluate(async src=>{
    const i=new Image();i.src=src;
    try{await Promise.race([i.decode(),new Promise((_,rej)=>setTimeout(()=>rej(new Error('image decode timeout')),30000))]);return {ok:true,complete:i.complete,width:i.naturalWidth,height:i.naturalHeight}}
    catch(e){return {ok:false,error:String(e),complete:i.complete,width:i.naturalWidth,height:i.naturalHeight}}
   },url);
   assert(image.ok&&image.complete&&image.width>0&&image.height>0,'CHROME_ORIGIN_IMAGE_DECODE '+asset.id+' '+JSON.stringify(image));
   report.checks.push({id:asset.id,url,originStatus:response.status,contentType:type,bytes:body.length,sha256:digest,naturalWidth:image.width,naturalHeight:image.height,pass:true});
  }
  report.status='LIVE_ORIGIN_SMOKE_PASS';
  console.log('N4A_LIVE_ORIGIN_SMOKE_PASS',report.checks.length,'binary assets; not W1 release acceptance');
 }finally{await context.close();await browser.close()}
})().catch(e=>{report.status='FAIL';report.errors.push(String(e.stack||e));console.error(e);process.exitCode=1}).finally(()=>{
 fs.writeFileSync(path.join(output,'N4A_LIVE_ORIGIN_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
});
