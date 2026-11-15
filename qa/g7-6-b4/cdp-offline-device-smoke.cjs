'use strict';
/* B.3 Chrome DevTools visual structural and screenshot evidence.
 * Real CSS widths, untrusted public-only data, no release or physical device claims.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const assert=require('node:assert/strict');
const sleep=ms=>new Promise(ok=>setTimeout(ok,ms));
const w=Number(process.argv[2]||390),panel=process.argv[3]||'all';
const mobile=w<=414,screenHeight=900;
assert.ok([360,390,414,1440].includes(w),'WIDTH_ALLOWLIST');
assert.ok(['all','mental','column','choice','tangram','chart'].includes(panel),'PANEL_ALLOWLIST');
const browser=process.env.BROWSER||'google-chrome';
const out='/tmp/g76b3-evidence/chrome';
fs.mkdirSync(out,{recursive:true});
let proc=null;
async function launchChrome(){
 const logs=[];
 for(let attempt=0;attempt<2;attempt++){
  const profile='/tmp/g76b3-cdp-'+process.pid+'-'+attempt;
  const errPath=path.join(out,'chrome-launch-'+w+'-'+panel+'-'+attempt+'.log');
  fs.mkdirSync(profile,{recursive:true});
  const fd=fs.openSync(errPath,'a');
  proc=cp.spawn(browser,['--headless','--no-sandbox','--disable-gpu',
   '--disable-dev-shm-usage','--disable-background-networking','--no-first-run',
   '--remote-debugging-port=0','--remote-allow-origins=*',
   '--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore',fd]});
  fs.closeSync(fd);
  let port=0;
  for(let n=0;n<250;n++){
   try{
    const lines=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').trim().split('\n');
    port=Number(lines[0]);if(Number.isInteger(port)&&port>0)break;
   }catch(_){}
   if(proc.exitCode!==null)break;
   await sleep(100);
  }
  if(port>0){console.log('G76B4_CHROME_CDP_STARTED',w,panel,'attempt',attempt+1);return port;}
  const excerpt=fs.existsSync(errPath)?fs.readFileSync(errPath,'utf8').slice(-450):'';
  logs.push({attempt:attempt+1,exitCode:proc.exitCode,stderrTail:excerpt});
  console.error('G76B4_CHROME_START_RETRY',JSON.stringify(logs[logs.length-1]));
  try{proc.kill('SIGTERM')}catch(_){}
  await sleep(300);
 }
 throw Error('CDP_PORT_NOT_READY_AFTER_RETRIES '+JSON.stringify(logs));
}
let socket,seq=0;const pending=new Map();
async function send(method,params={}){
 const id=++seq;
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{pending.delete(id);reject(Error('CDP_TIMEOUT_'+method))},15000);
  pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value)},
   reject:e=>{clearTimeout(timeout);reject(e)}});
  socket.send(JSON.stringify({id,method,params}));
 });
}
async function connect(url){
 socket=new WebSocket(url);
 await new Promise((resolve,reject)=>{
  const t=setTimeout(()=>reject(Error('WEBSOCKET_NOT_READY')),10000);
  socket.addEventListener('open',()=>{clearTimeout(t);resolve()},{once:true});
  socket.addEventListener('error',()=>{clearTimeout(t);reject(Error('WEBSOCKET_ERROR'))},{once:true});
 });
 socket.addEventListener('message',e=>{
  const data=JSON.parse(e.data);
  if(Number.isInteger(data.id)&&pending.has(data.id)){
   const task=pending.get(data.id);pending.delete(data.id);
   if(data.error)task.reject(Error(JSON.stringify(data.error)));
   else task.resolve(data.result);
  }
 });
}
async function main(){
 const port=await launchChrome();
 const list=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 const page=list.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
 assert.ok(page,'CDP_PAGE_NOT_FOUND');
 await connect(page.webSocketDebuggerUrl);
 await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:w,height:screenHeight,deviceScaleFactor:1,
  mobile,screenWidth:w,screenHeight,positionX:0,positionY:0});
 const url='file://'+path.join(__dirname,'generated','G76B4_Standalone_RealDevice_Review_TEST.html')+'?panel='+panel;
 await send('Page.navigate',{url});
 let read,complete=false;
 for(let n=0;n<150;n++){
  const r=await send('Runtime.evaluate',{expression:"(() => {const x=document.getElementById('qa-b3-result');return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,done:x?.dataset.done,pass:x?.dataset.pass,body:x?.textContent||''}})()",returnByValue:true});
  read=r.result?.value;
  if(read?.done==='true'){complete=true;break}
  await sleep(150);
 }
 assert.ok(complete,'QA_DOCUMENT_NOT_READY '+JSON.stringify(read).slice(0,280));
 assert.equal(read.width,w,'ACTUAL_CSS_VIEWPORT_MISMATCH');
 assert.ok(read.scrollWidth<=w+3,'HORIZONTAL_OVERFLOW '+read.scrollWidth);
 assert.equal(read.pass,'true','NATIVE_BROWSER_PROBE_FAILED '+read.body.slice(0,650));
 const qa=JSON.parse(read.body);
 assert.equal(qa.status,'PASS_B3_CHROME_PRODUCER_VISUAL_STRUCTURAL');
 assert.ok(qa.checkCount>=40,'MISSING_NATIVE_INTERACTION_CHECKS');
 assert.equal(qa.selected,panel,'REVIEW_PANEL_DRIFT');
 assert.equal(qa.gradingEnabled,false);
 assert.equal(qa.gasDeployed,false);
 const view=await send('Runtime.evaluate',{expression:"(() => {const b=[...document.querySelectorAll('.g74-tangram-target-button')];const entries=b.map(x=>({text:x.textContent,aria:x.getAttribute('aria-label'),index:x.dataset.g76B4TargetNumber}));return {entries,hasOfflineForm:!!document.getElementById('b4-export'),checkedManual:document.querySelectorAll('[data-qa]:checked').length,allInputsEmpty:[...document.querySelectorAll('[data-mental-input]')].every(x=>x.value==='')}})()",returnByValue:true});
 const review=view.result?.value;
 assert.ok(review?.hasOfflineForm,'MANUAL_OWNER_DEVICE_FORM_MISSING');
 assert.equal(review?.checkedManual,0,'BROWSER_MUST_NOT_SIMULATE_HUMAN_CHECKBOX');
 assert.equal(review?.entries?.length,6,'TWO_TANGRAM_EXERCISES_MUST_HAVE_SIX_BUTTONS');
 assert.ok(review?.entries.every((entry,i)=>entry.text==='Khung số '+(i%3+1) &&
  entry.aria==='Đặt mảnh đang chọn vào khung số '+(i%3+1) &&
  entry.index===String(i%3+1)),'TARGET_IDS_EXPOSED_OR_LOCALIZATION_LOST '+JSON.stringify(review.entries));
 assert.ok(review.allInputsEmpty,'PHONE_REVIEW_MUST_START_WITH_CLEAN_INPUTS');
 const screen=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
 const buffer=Buffer.from(screen.data,'base64');
 assert.equal(buffer.toString('hex',0,8),'89504e470d0a1a0a','NOT_PNG_SCREENSHOT');
 const pngWidth=buffer.readUInt32BE(16),pngHeight=buffer.readUInt32BE(20);
 if(mobile)assert.equal(pngWidth,w,'MOBILE_SCREENSHOT_WIDTH_MISMATCH');
 else assert.ok(pngWidth<=w&&pngWidth>=w-20,'DESKTOP_SCROLLBAR_SCREENSHOT_WIDTH_MISMATCH '+pngWidth);
 assert.ok(pngHeight>250&&pngHeight<30000,'SCREENSHOT_HEIGHT_INVALID');
 assert.ok(buffer.length>7000,'VISUAL_SCREENSHOT_EMPTY_OR_TRUNCATED');
 const suffix=w+'-'+panel;
 fs.writeFileSync(path.join(out,'b4-'+suffix+'.png'),buffer);
 if(w===390&&['mental','tangram','chart'].includes(panel)){
  const jpeg=await send('Page.captureScreenshot',{format:'jpeg',quality:58,captureBeyondViewport:false});
  const preview=Buffer.from(jpeg.data,'base64');
  assert.ok(preview.length>3000&&preview[0]===0xff&&preview[1]===0xd8,'JPG_PREVIEW_INVALID');
  fs.writeFileSync(path.join(out,'b4-review-390-'+panel+'.jpg'),preview);
  console.log('G76B4_JPEG_VISUAL_SAMPLE_CREATED',panel,preview.length,'bytes');
 }
 // Chrome-emulated touch is a structural probe only, NOT a physical phone review.
 let emulatedTapPassed=null;
 if(mobile&&panel==='tangram'){
  async function touchFirst(selector){
   const box=await send('Runtime.evaluate',{expression:"(() => {const e=document.querySelector("+JSON.stringify(selector)+");if(!e||e.disabled)return null;e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()",returnByValue:true});
   const p=box.result?.value;
   assert.ok(p,'TOUCH_TARGET_MISSING_OR_DISABLED_'+selector);
   await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});
   await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }
  await touchFirst('#b3-tangram .g74-tangram-piece');
  await touchFirst('#b3-tangram .g74-tangram-target-button');
  const after=await send('Runtime.evaluate',{expression:"(() => ({status:document.querySelector('#b3-tangram .g74-geo-status')?.textContent,labels:[...document.querySelectorAll('.g74-tangram-target-button')].map(x=>x.textContent)}))()",returnByValue:true});
  assert.ok((after.result?.value?.status||'').includes('1 / 3'),'CHROME_EMULATED_TOUCH_PLACE_FAILED');
  assert.ok(after.result.value.labels.every((x,i)=>x==='Khung số '+(i%3+1)),'LABEL_LOST_AFTER_EMULATED_TOUCH');
  emulatedTapPassed=true;
 }
 const receipt={status:'PASS_B4_OFFLINE_CHROME_LAYOUT_AND_LABELS',
  viewportCssWidth:w,documentScrollWidth:read.scrollWidth,
  screenshotWidth:pngWidth,screenshotHeight:pngHeight,
  pngBytes:buffer.length,pngSha256:crypto.createHash('sha256').update(buffer).digest('hex'),
  panel,checkCount:qa.checkCount,localizedTargets:review.entries.length,emulatedTapPassed,realPhysicalDevice:false,
  automaticPixelParity:false,ownerVisualSignoff:'PENDING',gradingEnabled:false,gasDeployed:false};
 fs.writeFileSync(path.join(out,'b4-'+suffix+'.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log('G76B4_CDP_VISUAL_PASS',w,panel,'checks',qa.checkCount,
  'scrollWidth',read.scrollWidth,'screenshot',pngWidth+'x'+pngHeight,buffer.length,'bytes');
}
main().catch(err=>{console.error('G76B4_CDP_VISUAL_FAIL',err.stack||err);process.exitCode=1})
.finally(()=>{try{socket?.close()}catch(_){}proc?.kill('SIGTERM')});
