'use strict';
/* B5-B standalone review composed from B5-A; no renderer rewrite or autoplay. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../..');
const file=path.join(base,'qa/g7-6-b5a/generated/G76B5A_Tangram_Geometry_Fix_Standalone_TEST.html');
const publicData=JSON.parse(fs.readFileSync(path.join(base,'qa/g7-6-b3/generated/public-samples.json'),'utf8'));
assert.equal(publicData.cases.length,14);
let html=fs.readFileSync(file,'utf8');
const adapter=fs.readFileSync(path.join(base,'qa/g7-4-choice-reference-v11/choice-v11-speech.js'),'utf8');
const control='<details id="b5b-speech-kit" style="margin:16px auto;max-width:900px;padding:14px;border:2px solid #b5c5e1;border-radius:14px;background:#fff">'+
 '<summary style="font-weight:800;cursor:pointer">B5-B · Kiểm giọng đọc tiếng Việt · Chỉ phát khi nhấn nút</summary>'+
 '<p>Chỉ đọc câu hỏi công khai. “Đã yêu cầu đọc” không đồng nghĩa âm thanh phát ra đúng. Cần nghe trên thiết bị thật.</p>'+
 '<div id="b5b-speech-buttons" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:8px"></div>'+
 '<p id="b5b-speech-status" aria-live="polite">Chưa yêu cầu đọc. Không phát tự động.</p></details>';
const start='(function(){\n'+
'function start(){\n'+
'const group=document.getElementById("b5b-speech-buttons"),status=document.getElementById("b5b-speech-status");\n'+
'const data=JSON.parse(document.getElementById("b4-public-data").textContent);\n'+
'const adapter=KLChoiceSpeechV11.create(window,{rate:0.9});\n'+
'data.cases.forEach((item,i)=>{const button=document.createElement("button");button.type="button";\n'+
'button.textContent="🔊 Đọc câu "+(i+1)+" · "+item.typeId;button.dataset.b5bSpeechIndex=String(i);\n'+
'button.style.cssText="min-height:44px;padding:10px;border:1px solid #bccbe8;border-radius:9px;background:#f4f7ff;color:#274979;font-weight:700";\n'+
'button.addEventListener("click",()=>{const text=item.nativePlan?.prompt;\n'+
'if(typeof text!=="string"||text.trim().length<3||text.length>600||/[<>]/.test(text)||/answerSpec|answerKey|gradingKey|teacherSolution|studentId/i.test(text)){status.textContent="Không đủ điều kiện để đọc.";return;}\n'+
'const result=adapter.speak(text,"vi-VN");status.dataset.b5bSpeechResult=result.ok?result.status:result.reason;\n'+
'status.textContent=result.ok?"Đã yêu cầu đọc câu "+(i+1)+". Xin nghe và kiểm tra thực tế.":"Không thể phát: "+result.reason;});group.append(button);});\n'+
'const stop=document.createElement("button");stop.type="button";stop.textContent="Dừng đọc";stop.style.cssText="min-height:44px;padding:10px";\n'+
'stop.addEventListener("click",()=>{adapter.stop();status.textContent="Đã yêu cầu dừng đọc."});group.append(stop);\n'+
'}\n'+
'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();\n'+
'})();';
const inline='<script data-b5b-pinned-speech-adapter>\n'+adapter.replace(/<\/script/gi,'<\/script')+'\n</script>\n'+
'<script data-b5b-tts-gesture-controls>\n'+start+'\n</script>';
function once(oldText,newText){assert.equal(html.split(oldText).length-1,1,'source drift '+oldText);html=html.replace(oldText,newText)}
once('</main>','</main>\n'+control);
once('</body>',inline+'\n</body>');
once('<title>G7.6-B.5-A – Tangram chính xác: thử trên thiết bị · TEST</title>',
 '<title>G7.6-B.5-B – Kiểm thử producer, hình và giọng đọc · TEST</title>');
once('<h1>G7.6-B.5-A – Thử Tangram căn khớp hình · TEST</h1>',
 '<h1>G7.6-B.5-B – Tích hợp TEST: producer · hình · giọng đọc</h1>');
assert.ok(!/<script src=|<link rel="stylesheet"/.test(html));
assert.ok(html.includes('data-b5b-tts-gesture-controls'));
const dir=path.join(__dirname,'generated');fs.mkdirSync(dir,{recursive:true});
const out=path.join(dir,'G76B5B_Producer_Resources_TTS_Offline_TEST.html');
fs.writeFileSync(out,html);
console.log('G76B5B_OFFLINE_TTS_GESTURE_REVIEW_PASS',Buffer.byteLength(html),'bytes; 14 public cases; no autoplay/network/GAS');
