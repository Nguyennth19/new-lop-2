'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{once}=require('node:events'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'../../..');
const files=new Map([
 ['/synth5-preview.html',[path.join(__dirname,'synth5-preview.html'),'text/html']],
 ['/synth5-prompt-delta.review.json',[path.join(__dirname,'synth5-prompt-delta.review.json'),'application/json']],
 ['/44_G75_NormalizerToanV2.html',[path.join(root,'44_G75_NormalizerToanV2.html'),'text/javascript']],
 ['/66_D3_Core.html',[path.join(root,'66_D3_Core.html'),'text/javascript']],
 ['/68_D4_Core.html',[path.join(root,'68_D4_Core.html'),'text/javascript']],
 ['/69_D4_View.html',[path.join(root,'69_D4_View.html'),'text/javascript']],
 ['/n13/semantic-core.cjs',[path.join(__dirname,'..','semantic-core.cjs'),'text/javascript']],
 ['/n13/semantic-view.js',[path.join(__dirname,'..','semantic-view.js'),'text/javascript']],
 ['/n13/b1-composite-core.cjs',[path.join(__dirname,'..','b1-composite-core.cjs'),'text/javascript']],
 ['/n13/b1-composite-view.js',[path.join(__dirname,'..','b1-composite-view.js'),'text/javascript']],
 ['/n13/semantic-view.css',[path.join(__dirname,'..','semantic-view.css'),'text/css']],
 ['/n13/b1-composite.css',[path.join(__dirname,'..','b1-composite.css'),'text/css']
]]);
function start(port=0){return http.createServer((req,res)=>{const item=files.get(req.url);if(req.method!=='GET'||!item){res.writeHead(404,{'X-Content-Type-Options':'nosniff'});return res.end('NOT_FOUND');}const [file,type]=item;res.writeHead(200,{'Content-Type':type+'; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'"});res.end(fs.readFileSync(file));}).listen(port,'127.0.0.1');}
(async()=>{const server=start(0);await once(server,'listening');const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true});try{
 for(const p of ['/pilot-grader.qa-only.cjs','/trusted-oracle.qa-only.cjs','/N12_Final.gs'])assert.equal((await fetch(origin+p)).status,404);
 const response=await fetch(origin+'/synth5-prompt-delta.review.json');assert.equal(response.status,200);assert.equal((await response.json()).variantId,'N13B1_SYNTH_5');
 for(const width of [360,768,1280]){const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.__ttsCalls=[];function TestUtterance(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;}Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:TestUtterance});Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(u){window.__ttsCalls.push({text:u.text,lang:u.lang,rate:u.rate,pitch:u.pitch});}}});});
 const response=await page.goto(origin+'/synth5-preview.html');assert.equal(response.status(),200);await page.waitForFunction(()=>window.__N13ready===true||window.__N13error);assert.equal(await page.evaluate(()=>window.__N13error||null),null);
 assert.equal(await page.locator('[data-part="b"] .g74-choice-prompt').textContent(),'Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.');
 assert.deepEqual(await page.locator('[data-part="b"] [data-choice-id]').evaluateAll(ns=>ns.map(n=>[n.dataset.choiceId,n.textContent.trim()])),[['x','30'],['y','31'],['z','33'],['w','34']]);
 await page.locator('[data-part="b"] [aria-label="Đọc câu hỏi"]').click();await page.waitForFunction(()=>window.__ttsCalls.length>0);const calls=await page.evaluate(()=>window.__ttsCalls);
 assert.deepEqual(calls.map(x=>x.text),['Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.']);assert.equal(calls[0].lang,'vi-VN');assert.equal(calls[0].rate,.92);assert.equal(calls[0].pitch,1.1);
 for(const id of ['y','z'])await page.locator('[data-part="b"] [data-choice-id="'+id+'"]').click();
 for(const [id,value] of [['y','true'],['z','true'],['x','false'],['w','false']])assert.equal(await page.locator('[data-part="b"] [data-choice-id="'+id+'"]').getAttribute('aria-pressed'),value);
 assert.equal(await page.locator('[data-part="a"] .n13-preview h2').textContent(),'Điền số còn thiếu trên tia số.');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'horizontal overflow '+width);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('N13_SYNTH5_PROMPT_HTTP_TTS_PASS 3 viewports; MULTIPLE options; vi-VN TTS API contract; private QA files 404; no audible-device claim');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}})().catch(e=>{console.error(e);process.exitCode=1;});
