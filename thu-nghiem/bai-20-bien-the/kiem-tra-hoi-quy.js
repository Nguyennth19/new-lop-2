/* Regression B20 – chạy: node thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js
 * Không ghi dữ liệu, không dùng khóa hay kết nối thật.
 */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pack=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
const adapter=vm.runInNewContext(read('42_AdapterBienTheB20.html')+'\nchuyenB20BienTheSangRenderer');
const normalized=adapter({variantPilot:true,lesson:{id:'toan_b20'},packVersion:pack.schema_version,
  sessions:pack.sessions,questions:pack.questions});
assert.equal(normalized.questions.length,30);
assert.equal(normalized.levels.length,6);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const factory=vm.runInNewContext(read('41_HienThiCauHoiToan.html')+'\ntaoHienThiCauToan');
const view=factory({E:esc,input:(q,k)=>'<input data-ml-field="'+k+'">',baseCard:(q,inside,kind)=>'<article class="'+kind+'">'+inside+'</article>'});
const server=vm.runInNewContext(read('B20_BienTheMayChu.gs')+'\n({score:chamLuotToan20BienThe,ping:kiemTraKetNoiB20})',{
  CacheService:{getScriptCache:()=>({get:()=>null,put:()=>{}})},
  UrlFetchApp:{fetch:()=>({getResponseCode:()=>200,getContentText:()=>JSON.stringify(pack)})},
  console:{log:()=>{}}
});
let n=0;
for(const s of pack.sessions){
 const qs=normalized.questions.filter(q=>q.level===s.session_id);
 assert.deepEqual(Array.from(qs,q=>q.id),s.question_ids,'Phải giữ đúng thứ tự câu');
 const groups=normalized.sections.filter(x=>x.levelId===s.session_id&&x.type==='mental');
 for(const sec of groups){
   const items=qs.filter(q=>q.sectionId===sec.id);
   for(const g of new Set(items.map(q=>q.group)))
     assert(items.filter(q=>q.group===g).length<=2,'Một panel luyện tập có quá 2 câu');
 }
 if(s.session_id.startsWith('LV3'))assert.equal(new Set(qs.map(q=>q.group)).size,2,'LV3 phải có 2 panel, mỗi panel 2 câu');
 const ok={},wrong={};
 for(const id of s.question_ids){
  const q=pack.questions.find(x=>x.question_id===id),adapted=qs.find(x=>x.id===id);
  const ans=String(q.answer).padStart(2,'0');
  ok[id]=q.type==='vertical'?{carry:'1',tens:ans[0],ones:ans[1]}:
    q.type==='word'?{n1:String(q.parameters.a),n2:String(q.parameters.b),op:'+',sum:String(q.answer),answer:String(q.answer)}:{answer:String(q.answer)};
  wrong[id]=q.type==='vertical'?{carry:'0',tens:'0',ones:'0'}:
    q.type==='word'?{...ok[id],answer:'0',sum:'0'}:{answer:'0'};
  const html=adapted.type==='vertical'?view.vertical(adapted):adapted.type==='word_problem'?view.word(adapted):view.mental(adapted);
  assert.equal((html.match(/<input /g)||[]).length,adapted.type==='vertical'?3:adapted.type==='word_problem'?5:1,'Số ô nhập của '+id);
  assert(!html.includes('undefined')&&!html.includes('NaN'),'Dữ liệu hiển thị lỗi '+id);
  if(q.type==='word'){
   assert(html.includes('TÓM TẮT:'),'Bài lời văn thiếu tóm tắt');
   assert(html.includes('BÀI GIẢI'),'Thiếu khung lời giải');
   assert(html.includes('('+q.unit+')'),'Thiếu đơn vị ở phép tính');
  }
  if(q.type==='reverse')assert(html.indexOf('<input')<html.indexOf('<b>+</b>'),'Ô số thiếu phải nằm trước dấu cộng');
  if(q.type==='three')assert(html.includes(String(q.parameters.c)),'Thiếu số hạng thứ ba');
  n++;
 }
 assert.equal(server.score({sessionId:s.session_id,answers:ok}).correct,s.question_ids.length,'Chấm đúng '+s.session_id);
 assert.equal(server.score({sessionId:s.session_id,answers:wrong}).correct,0,'Chấm sai '+s.session_id);
}
const ui=read('19_KhongGianHocToan.html'),css=read('20_CSS_KhongGianHocToan.html');
assert(!ui.includes('pilotRender('),'Không được dùng giao diện pilot riêng');
assert(!ui.includes('style='),'Không thêm style nội tuyến vào không gian Toán');
assert(ui.includes('chamLuotToan20BienThe'),'Mất API chấm cả lượt');
assert(read('GiaoDien.html').includes("napThanhPhan('42_AdapterBienTheB20')"),'Thiếu adapter');
assert(css.includes('.ml-mental-row')&&css.includes('.ml-word-grid'),'CSS chuẩn phải còn các class gốc');
assert.equal(server.ping().endpointReady,true,'API chấm lượt không được khai báo');
// UI20-02A: verify migrated presentation contract without importing legacy layout/font.
const ui20=read('43_CSS_ThanhPhanBaiToan.html');
assert(read('GiaoDien.html').includes("napThanhPhan('43_CSS_ThanhPhanBaiToan')"),'CSS module chưa được nạp');
assert(ui20.includes('#mathFullScreen .ml-word-structured .ml-graph-paper'),'Thiếu lưới ô ly 2 cấp độ');
assert(ui20.includes('background-size:28px 28px,28px 28px,7px 7px,7px 7px'),'Thiếu nền ô ly hai cấp');
assert(!/font-family\s*:\s*(?:['"]?Baloo|['"]?Quicksand)/i.test(ui20),'Không thay font bằng font từ repo cũ');
assert(!/(?:^|\n)\s*(?:body\b|:root\b|html\b|\.font-baloo\b)/m.test(ui20),'Không dùng CSS global');
assert(!view.word(normalized.questions.find(q=>q.variantType==='word')).includes('data-ans='),'Không nhúng đáp án chấm trong HTML');
const wordHtml=view.word(normalized.questions.find(q=>q.variantType==='word'));
for(const key of ['ml-word-structured','ml-graph-paper','ml-word-summary','ml-word-calc-line','Phép tính:','Đáp số:','data-ml-svg'])
 assert(wordHtml.includes(key),'Thiếu thành phần lời văn: '+key);
const verticalHtml=view.vertical(normalized.questions.find(q=>q.type==='vertical'));
assert(verticalHtml.includes('ml-vertical-paper'),'Thiếu nền cột ô ly');
const puzzleHtml=view.puzzle({id:'TEST_PUZZLE',valid:true,theme:'blue',
 label:'Câu test',puzzle:[[6,{ans:7}],[2,5],[9,2]]});
assert(puzzleHtml.includes('ml-puzzle-paper'),'Thiếu ô ly cho chữ số ẩn');
assert(ui.includes("following={ones:'carry',carry:'tens'}"),'Thiếu thứ tự ĐV -> Nhớ -> Chục');
assert(ui.includes("if(suffix==='tens')"),'Thiếu thoát thẻ sau hàng chục');
assert(ui.includes('HINH_ANH_APP.word(q,el)'),'Mất fallback ảnh G7');

console.log('PASS UI20-02A: 30/30 renderer + 30/30 chấm đúng/sai, ô ly 2 cấp, lời văn, đặt tính, puzzle, G7, bàn phím, font và baseline CSS.');
