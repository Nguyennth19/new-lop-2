'use strict';
/** Chrome DevTools native mobile emulation: checks real CSS viewport 390px,
 * unlike --window-size=390 which Chromium headless clamps to >=500px.
 * No browser modifications, data writes, grading, external network or GAS.
 */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const assert=require('node:assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const browser=process.env.BROWSER||'google-chrome';
const width=Number(process.argv[2]||390),height=900;
if(![320,360,390,414].includes(width))throw Error('UNSUPPORTED_MOBILE_WIDTH');
const target='http://127.0.0.1:8799/qa/g7-6-b2/Chrome_RealProducer_Submodes_TEST.html';
const profile=path.join('/tmp','g76b2-cdp-'+process.pid);
fs.mkdirSync(profile,{recursive:true});
const proc=cp.spawn(browser,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
 '--no-first-run','--remote-debugging-port=0','--remote-allow-origins=*',
 '--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
let socket,seq=0;
const pending=new Map();
async function send(method,params={}){
 const id=++seq;
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{pending.delete(id);reject(Error('CDP_TIMEOUT_'+method))},10000);
  pending.set(id,{resolve:v=>{clearTimeout(timeout);resolve(v)},reject:v=>{clearTimeout(timeout);reject(v)}});
  socket.send(JSON.stringify({id,method,params}));
 });
}
async function connect(url){
 socket=new WebSocket(url);
 await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(Error('WEBSOCKET_TIMEOUT')),10000);
  socket.addEventListener('open',()=>{clearTimeout(timeout);resolve()},{once:true});
  socket.addEventListener('error',()=>{clearTimeout(timeout);reject(Error('CDP_CONNECT_FAILED'))},{once:true});
 });
 socket.addEventListener('message',event=>{
  const data=JSON.parse(event.data);
  if(typeof data.id==='number'&&pending.has(data.id)){
   const task=pending.get(data.id);pending.delete(data.id);
   if(data.error)task.reject(Error(JSON.stringify(data.error)));
   else task.resolve(data.result);
  }
 });
}
async function main(){
 let port;
 for(let attempt=0;attempt<150;attempt++){
  try{
   const list=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').trim().split('\n');
   port=Number(list[0]);if(Number.isInteger(port)&&port>0)break;
  }catch(_){}await delay(100);
 }
 assert.ok(port,'BROWSER_CDP_PORT_NOT_READY');
 const targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 const page=targets.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);
 assert.ok(page,'CDP_PAGE_TARGET_NOT_FOUND');
 await connect(page.webSocketDebuggerUrl);
 await send('Page.enable');
 await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true,
  screenWidth:width,screenHeight:height,positionX:0,positionY:0});
 await send('Page.navigate',{url:target});
 let last,done=false;
 for(let i=0;i<150;i++){
  const r=await send('Runtime.evaluate',{expression:"(() => {const el=document.getElementById('qa-b2-results');return {innerWidth:window.innerWidth,innerHeight:window.innerHeight,scrollWidth:document.documentElement.scrollWidth,done:el?.dataset.done,pass:el?.dataset.pass,json:el?.textContent||null}})()",returnByValue:true});
  last=r.result?.value;
  if(last?.done==='true'){done=true;break}
  await delay(150);
 }
 assert.ok(done,'MOBILE_BROWSER_AUTOMATION_NOT_COMPLETED '+JSON.stringify(last).slice(0,300));
 assert.equal(last.innerWidth,width,'REAL_CSS_VIEWPORT_WIDTH_MISMATCH');
 assert.ok(last.scrollWidth<=width+4,'MOBILE_HORIZONTAL_OVERFLOW '+last.scrollWidth);
 assert.equal(last.pass,'true','MOBILE_NATIVE_CHECK_FAILED '+String(last.json).slice(0,500));
 const report=JSON.parse(last.json);
 assert.equal(report.status,'PASS_CHROME_NATIVE_RENDERER_INTERACTION');
 assert.ok(report.checked>=25,'MOBILE_CHECK_COVERAGE_UNDER_EXPECTED');
 const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
 const out='/tmp/g76b2-evidence/chrome';fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'cdp-mobile-'+width+'.png'),Buffer.from(screenshot.data,'base64'));
 fs.writeFileSync(path.join(out,'cdp-mobile-'+width+'.json'),JSON.stringify({
  status:'PASS_TRUE_MOBILE_CDP',width,last,checked:report.checked,
  pixelParity:'PENDING_MANUAL_REVIEW',realDeviceTouch:false,
  gasDeployed:false,gradingEnabled:false
 },null,2)+'\n');
 console.log('G76B2_CDP_MOBILE_PASS',width,report.checked,'checks; CSS viewport',last.innerWidth,'scrollWidth',last.scrollWidth);
}
main().catch(e=>{console.error('G76B2_CDP_MOBILE_FAIL',e.stack||String(e));process.exitCode=1})
.finally(()=>{try{socket?.close()}catch(_){};proc.kill('SIGTERM')});
