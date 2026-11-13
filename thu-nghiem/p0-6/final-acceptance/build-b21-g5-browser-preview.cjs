'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {buildB21Bridge}=require('./b21-g5-compatibility-bridge.cjs');
const {createDemo}=require('../composer-fixtures-v1.cjs');
const root=path.resolve(__dirname,'../../..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const gradeSource=read('26_ChamCauHoiToan.html'),ctx=vm.createContext({});
vm.runInContext(read('41_HienThiCauHoiToan.html'),ctx,{timeout:2000});
vm.runInContext(gradeSource,ctx,{timeout:2000});
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=(q,key,width,attrs='')=>'<input autocomplete="off" inputmode="numeric" type="text" maxlength="'+width+'" data-ml-input="'+E(key)+'" '+attrs+'>';
const baseCard=(q,inside,cls='')=>'<article class="ml-card '+E(cls)+'" data-ml-q-card="'+E(q.id)+'">'+inside+'</article>';
const adapter=buildB21Bridge({renderers:ctx.taoHienThiCauToan({E,input,baseCard}),grade:ctx.danhGiaCauToan,input,baseCard});
const composed=createDemo(),byId=new Map(composed.lesson.questions.map(q=>[q.id,q]));
const byQA=new Map(composed.report.qa.records.map(q=>[q.questionId,q]));
const records=[],cards=[];
for(const [i,id] of adapter.questionIds.entries()){
 const q=byId.get(id),level=byQA.get(id).levelId,rendered=adapter.render(id);
 if(!rendered.interactive)throw Error('G5_CARD_NOT_INTERACTIVE');
 records.push({id,level,a:q.parameters.a,b:q.parameters.b,answer:q.answerSpec.value,bridge:level==='LV3'?10-q.parameters.a%10:null});
 cards.push('<section class="question" data-question-id="'+E(id)+'" data-level="'+level+'"><h2>'+level+' · Câu '+(i+1)+'</h2>'+rendered.html+
 '<div class="controls"><button data-check="'+E(id)+'">Kiểm tra</button><output role="status" aria-live="polite" data-result="'+E(id)+'">Chưa chấm</output></div></section>');
}
const script='const records='+JSON.stringify(records).replace(/</g,'\\u003c')+';'+
'const data=new Map(records.map(x=>[x.id,x]));'+
'function evaluate(id,v){const q=data.get(id);if(!q)return {complete:false,correct:false};'+
'const fields=q.level==="LV1"?["answer"]:q.level==="LV2"?["carry","tens","ones"]:["bridge","answer"];'+
'for(const k of fields)if(!/^[0-9]{1,3}$/.test(String(v[k]??"").trim()))return {complete:false,correct:false};'+
'const old={valid:true,type:q.level==="LV2"?"vertical":"mental",n1:q.a,n2:q.b,answer:String(q.answer)};'+
'return {complete:true,correct:danhGiaCauToan(old,k=>v[k])&&(q.level!=="LV3"||Number(v.bridge)===q.bridge)};}'+
'for(const btn of document.querySelectorAll("[data-check]"))btn.addEventListener("click",()=>{'+
'const id=btn.dataset.check,q=data.get(id),fields=q.level==="LV1"?["answer"]:q.level==="LV2"?["carry","tens","ones"]:["bridge","answer"];'+
'const v={};for(const k of fields)v[k]=document.querySelector("[data-ml-input=\\""+id+":"+k+"\\"]")?.value??"";'+
'const t=evaluate(id,v),out=document.querySelector("[data-result=\\""+id+"\\"]");'+
'out.textContent=!t.complete?"Em hãy điền đủ các ô.":t.correct?"Chính xác!":"Em thử lại nhé.";'+
'out.dataset.state=!t.complete?"incomplete":t.correct?"correct":"incorrect";});'+
'window.__G5_TEST__={records,evaluate,ready:true,releaseReady:false};';
const css='*{box-sizing:border-box}:root{font-family:system-ui,sans-serif;color:#192b43;background:#f5f8ff}body{margin:0}main{max-width:960px;margin:auto;padding:18px 12px 50px}'+
'.banner,.question{background:white;border:1px solid #d8e2f2;border-radius:16px;padding:16px}.banner{margin-bottom:16px}.banner p{line-height:1.55}'+
'.items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.question{min-width:0;overflow-wrap:anywhere}h1{font-size:1.65rem}h2{font-size:1.1rem}'+
'.ml-mental-row{display:flex;align-items:center;flex-wrap:wrap;gap:10px;font-size:1.2rem;margin:15px 0}.ml-vertical-matrix{max-width:280px;margin:auto}'+
'.ml-vert-row{display:grid;grid-template-columns:55px repeat(2,60px);justify-content:center;gap:10px;text-align:center;align-items:center}.ml-vert-row.rule{border-bottom:2px solid}.ml-vert-row.numbers{font-size:1.5rem}'+
'.ml-reasoning p{line-height:1.5}.ml-reasoning label{display:block;margin:12px 0}input[data-ml-input]{height:48px;width:62px;max-width:100%;font-size:1.15rem;text-align:center;border:2px solid #859abb;border-radius:10px}'+
'.controls{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:14px}button{border:0;background:#205ab0;color:white;border-radius:10px;padding:12px 16px;font-weight:700}'+
'output[data-state=correct]{color:green}output[data-state=incorrect]{color:#b32d35}footer{margin-top:20px;color:#46576a;font-size:.85rem}'+
'@media(max-width:650px){.items{grid-template-columns:minmax(0,1fr)}main{padding:10px 8px 35px}.question{padding:12px}}';
const html='<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
'<title>F-A G5 · Bài 21 · TEST</title><style>'+css+'</style></head><body><main><div class="banner"><h1>Toán lớp 2 – Bài 21</h1>'+
'<p>G5 TEST độc lập: 8 câu / 3 mức. Không lưu bài làm, không cấp điểm hay sao, không kết nối Web App Version 6.</p></div>'+
'<div class="items">'+cards.join('')+'</div><footer>TEST-only · RELEASE_READY=false</footer></main><script>'+gradeSource+'\n'+script+'</script></body></html>';
if(records.length!==8||!html.includes('function danhGiaCauToan('))throw Error('G5_PREVIEW_BUILD_INVALID');
const dest=path.join(__dirname,'g5-b21-preview.generated.html');fs.writeFileSync(dest,html);
console.log('G5_PREVIEW_BUILT '+records.length+' items bytes='+Buffer.byteLength(html));
module.exports={dest};
