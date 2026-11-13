'use strict';
/** F-B.3 read-only B20 independent QA from frozen H1 source + legacy 42/41 renderer and 26 grader.
 * Generates ephemeral standalone HTML, never touches Web App, student records or B21.
 */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=fs.readFileSync(path.join(root,'thu-nghiem/bai-20-bien-the/runtime.json'));
const blob=crypto.createHash('sha1').update('blob '+source.length+'\0').update(source).digest('hex');
if(blob!=='b14d556c5deeb561106e0c81f275387bef538842')throw Error('FB3_B20_H1_SOURCE_DRIFT');
const pack=JSON.parse(source);
if(pack.lesson_id!=='toan_b20'||pack.questions.length!==30||pack.sessions.length!==6)throw Error('FB3_B20_SCOPE_CHANGED');
const {adaptB20}=require('../adapter-b20-v1.cjs'),{validateLesson}=require('../validator-lesson-v1.cjs');
const contract=adaptB20(pack);
if(!validateLesson(contract).ok)throw Error('FB3_B20_CONTRACT_INVALID');
const context=vm.createContext({});
for(const f of ['42_AdapterBienTheB20.html','41_HienThiCauHoiToan.html','26_ChamCauHoiToan.html'])
 vm.runInContext(read(f),context,{timeout:2000});
const legacy=context.chuyenB20BienTheSangRenderer({variantPilot:true,lesson:{id:'toan_b20'},sessions:pack.sessions,questions:pack.questions});
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=(q,key,width,attrs='')=>'<input autocomplete="off" inputmode="numeric" type="text" maxlength="'+Math.max(1,Math.min(3,width))+'" data-ml-input="'+escape(key)+'" '+attrs+'>';
const baseCard=(q,inside,cls='')=>'<article class="ml-card '+escape(cls)+'" data-ml-q-card="'+escape(q.id)+'">'+inside+'</article>';
const renderer=context.taoHienThiCauToan({E:escape,input,baseCard});
const cards=[];
for(const [i,q] of legacy.questions.entries()){
 if(q.valid!==true)throw Error('FB3_INVALID_LEGACY_QUESTION');
 const method=q.type==='vertical'?'vertical':q.type==='word_problem'?'word':'mental';
 const html=renderer[method](q);
 const slots=q.type==='vertical'?['carry','tens','ones']:
  q.type==='word_problem'?['n1','op','n2','sum','answer']:['answer'];
 if(!slots.every(k=>html.includes('data-ml-input="'+q.id+':'+k+'"')))throw Error('FB3_MISSING_INPUT');
 cards.push('<section class="question" data-question-id="'+escape(q.id)+'" data-type="'+escape(q.type)+'">'+
  '<h2>'+escape(q.level)+' · Câu '+(i+1)+'</h2>'+html+
  '<div class="controls"><button type="button" data-check="'+escape(q.id)+'">Kiểm tra</button>'+
  '<output role="status" data-result="'+escape(q.id)+'">Chưa chấm</output></div></section>');
}
const info=legacy.questions.map(q=>({id:q.id,level:q.level,type:q.type,variantType:q.variantType,
 n1:q.n1,n2:q.n2,n3:q.n3??null,answer:q.answer,op:q.op,valid:true}));
const checkSrc='const questions='+JSON.stringify(info).replace(/</g,'\\u003c')+';'+
 'const byId=new Map(questions.map(q=>[q.id,q]));'+
 'function fields(q){return q.type==="vertical"?["carry","tens","ones"]:q.type==="word_problem"?["n1","op","n2","sum","answer"]:["answer"];}'+
 'function grade(id,v){const q=byId.get(id);if(!q)return {complete:false,correct:false};'+
 'const k=fields(q);if(k.some(x=>!/^([0-9]{1,3}|\\+)$/.test(String(v[x]??"").trim())))return {complete:false,correct:false};'+
 'return {complete:true,correct:danhGiaCauToan(q,x=>v[x])};}'+
 'for(const b of document.querySelectorAll("[data-check]"))b.addEventListener("click",()=>{const id=b.dataset.check,q=byId.get(id),v={};'+
 'for(const k of fields(q))v[k]=document.querySelector("[data-ml-input=\\""+id+":"+k+"\\"]")?.value??"";'+
 'const r=grade(id,v),out=document.querySelector("[data-result=\\""+id+"\\"]");'+
 'out.dataset.state=!r.complete?"incomplete":r.correct?"correct":"incorrect";'+
 'out.textContent=!r.complete?"Điền đủ các ô":r.correct?"Chính xác!":"Em thử lại nhé."});'+
 'window.__FB3_TEST__={ready:true,questions,fields,grade,releaseReady:false};';
const css='*{box-sizing:border-box}:root{font-family:system-ui,sans-serif;color:#172943;background:#f4f8fe}body{margin:0}main{max-width:1040px;margin:auto;padding:16px 12px 48px}'+
 'header{background:white;padding:16px;border:1px solid #d2dff2;border-radius:16px;margin-bottom:16px}h1{font-size:1.6rem}h2{font-size:1.05rem}'+
 '.items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.question{min-width:0;overflow-wrap:anywhere;background:white;border:1px solid #d2dff2;border-radius:16px;padding:16px}'+
 '.ml-mental-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:1.18rem}.ml-vertical-matrix{max-width:280px;margin:auto}'+
 '.ml-vert-row{display:grid;grid-template-columns:55px repeat(2,60px);justify-content:center;gap:10px;align-items:center;text-align:center}.ml-vert-row.rule{border-bottom:2px solid}.ml-vert-row.numbers{font-size:1.4rem}'+
 '.ml-word-head p{line-height:1.5}.ml-word-calc{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.ml-word-result,.ml-word-calc-line{margin-top:12px}'+
 '.controls{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:16px}input[data-ml-input]{height:46px;width:58px;max-width:100%;border:2px solid #96a7bf;border-radius:10px;font-size:1.12rem;text-align:center}'+
 'button{border:0;border-radius:10px;padding:12px 16px;background:#205ab0;color:white;font-weight:700}output[data-state=correct]{color:green}output[data-state=incorrect]{color:#b13035}'+
 '@media(max-width:650px){.items{grid-template-columns:minmax(0,1fr)}main{padding:10px 8px 28px}.question{padding:12px}}';
const result='<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>F-B.3 · Bài 20 · TEST</title><style>'+css+'</style></head><body><main>'+
 '<header><h1>Toán lớp 2 – Bài 20</h1><p>F-B.3 TEST độc lập 30 câu, 6 lượt; không ghi điểm/sao, không kết nối Web App Version 6.</p></header>'+
 '<div class="items">'+cards.join('')+'</div><p>RELEASE_READY=false</p></main><script>'+read('26_ChamCauHoiToan.html')+'\n'+checkSrc+'</script></body></html>';
const dest=path.join(__dirname,'fb3-b20-preview.generated.html');fs.writeFileSync(dest,result);
const contractSha256=crypto.createHash('sha256').update(JSON.stringify(contract)).digest('hex');
console.log(JSON.stringify({status:'FB3_B20_PREVIEW_BUILT',sourceBlobSha:blob,contractSha256,questions:cards.length,sessions:6,
 releaseReady:false,noWrites:true}));
module.exports={dest,contractSha256,sourceBlobSha:blob};
