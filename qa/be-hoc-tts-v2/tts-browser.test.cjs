'use strict';
// Chromium test uses real Chrome rendering, audio synthesis is a stub (not proof of audible output).
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium,devices}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let checks=0;
 for(const [label,contextOpt] of [['chrome-desktop',{viewport:{width:1366,height:768}}],['mobile-chromium',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const context=await browser.newContext(contextOpt),page=await context.newPage();
  await page.setContent(`<!DOCTYPE html><html lang="vi"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="mathFullScreen" style="width:100%;box-sizing:border-box;padding:10px"><div id="mlContent">
    <div class="ml-mental-row" data-ml-q-card="mental-1"><span>36</span><b>+</b><span>17</span><b>=</b><input type="text" value="53"><button type="button" data-ml-speak-question="mental-1" class="ml-speak-btn">🔊 Nghe</button></div>
    <article class="ml-word-card" data-ml-q-card="word-1"><div class="ml-word-head"><p>Có 12 quả táo, thêm 5 quả táo. Hỏi có tất cả bao nhiêu quả?</p></div><div class="ml-graph-paper">Bài giải: 17</div><button type="button" data-ml-speak-question="word-1" class="ml-speak-btn">🔊 Nghe</button></article>
    <div class="ml-speak-theory-actions"><button type="button" data-ml-speak-theory class="ml-speak-btn">🔊 Nghe hướng dẫn</button></div>
    <div class="ml-theory-page"><div class="ml-theory-head"><h1>Bài 20: Phép cộng</h1></div><section class="ml-theory-block"><ol><li>Đặt tính thẳng cột.</li></ol></section></div>
  </div></div></body></html>`);
  await page.addStyleTag({content:fs.readFileSync('46_CSS_GiongDocToan.html','utf8')});
  await page.evaluate(()=>{
    window.__spoken=[];
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speak(u){window.__spoken.push({text:u.text,lang:u.lang})},cancel(){window.__cancelled=(window.__cancelled||0)+1}}});
    window.SpeechSynthesisUtterance=function(t){this.text=t};
  });
  await page.addScriptTag({content:fs.readFileSync('44_G75_NormalizerToanV2.html','utf8')});
  await page.addScriptTag({content:fs.readFileSync('45_DieuKhienGiongDocToan.html','utf8')});
  await page.locator('[data-ml-speak-question="word-1"]').click();
  const one=await page.evaluate(()=>window.__spoken.at(-1));assert(one.text.includes('12 quả táo'));assert(!one.text.includes('17'));checks+=2;
  await page.locator('[data-ml-speak-question="mental-1"]').click();
  const two=await page.evaluate(()=>window.__spoken.at(-1));assert(two.text.includes('36'));assert(two.text.includes('17'));assert(!two.text.includes('53'));checks+=3;
  await page.locator('[data-ml-speak-theory]').click();
  const three=await page.evaluate(()=>window.__spoken.at(-1));assert(three.text.includes('Đặt tính thẳng cột'));checks++;
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  assert.equal(overflow,false,label+' viewport overflow');checks++;
  const target=page.locator('[data-ml-speak-question="mental-1"]');
  assert.equal(await target.isVisible(),true);checks++;
  if(label==='mobile-chromium'){const height=await target.evaluate(el=>el.getBoundingClientRect().height);assert(height>=44);checks++;}
  await context.close();
 }
 await browser.close();
 console.log('BE_HOC_TTS_V2_CHROMIUM_DESKTOP_MOBILE_EMULATION_PASS',checks,'checks, audible playback not tested');
})().catch(e=>{console.error(e);process.exit(1)});
