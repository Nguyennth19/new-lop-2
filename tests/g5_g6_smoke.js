#!/usr/bin/env node
/* G5/G6 smoke tests – chạy: node tests/g5_g6_smoke.js (không cần npm). */
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const evaluate=(name,expression,globals={})=>vm.runInNewContext(read(name)+'\n;('+expression+')',globals,{timeout:1500});
let count=0;const test=(name,fn)=>{fn();count++;process.stdout.write('PASS '+name+'\n')};

test('hai môn chưa phát hành không có bài demo',()=>{
 const map=evaluate('12_DuLieuLoTrinh.html','subjectRoadmaps');
 assert.equal(map['Toán 2'][0].lessons.length,1);
 assert.deepEqual(Array.from(map['Tiếng Việt 2']),[]);
 assert.deepEqual(Array.from(map['Tiếng Anh 2']),[]);
 assert.deepEqual(Array.from(map['Toán 2'][0].lessons[0].levels),['new','new','new']);
});
test('các dạng chấm Toán ở client và server khớp nhau',()=>{
 const c=evaluate('26_ChamCauHoiToan.html','danhGiaCauToan');
 const s=evaluate('QuyTacChamToanMayChu.gs','achCheck_');
 const examples=[
  [{valid:true,type:'vertical',n1:28,n2:45,answer:'73'},{tens:'7',ones:'3',carry:'1'}],
  [{valid:true,type:'mental',answer:'63'},{answer:'63'}],
  [{valid:true,type:'word_problem',n1:28,n2:17,op:'+',answer:'45'},{n1:'17',n2:'28',op:'+',sum:'45',answer:'45'}],
  [{valid:true,type:'missing_digit',puzzle:[[{ans:3},null],['2','7'],['6','5']]},{p00:'3'}]
 ];
 for(const [q,answer]of examples){
  assert.equal(c(q,k=>answer[k]),true);
  assert.equal(s(q,answer),true);
  const wrong={...answer,[Object.keys(answer)[0]]:'0'};
  assert.equal(c(q,k=>wrong[k]),false);
  assert.equal(s(q,wrong),false);
 }
});
test('quy tắc chọn câu phía máy chủ và trình duyệt cùng 1 tập',()=>{
 const c=evaluate('23_ChonCauHoiToan.html','chonCauHoiTheoNhom');
 const s=evaluate('QuyTacChamToanMayChu.gs','achSelect_');
 const sections=[
  {id:'toan_b20_lv1_ex1',levelId:'l1'},
  {id:'toan_b20_lv1_ex3',levelId:'l1'},
  {id:'toan_b20_lv2_problems',levelId:'l2'}
 ];
 const qs=[];
 sections.forEach((section,i)=>{
  for(let j=1;j<=8;j++)qs.push({
   id:section.id+'_0'+j,level:i===2?'LV2':'LV1',sectionId:section.id,
   order:j,group:'Chung',valid:true,type:'vertical'
  });
 });
 const data={lesson:{id:'toan_b20'},levels:[{id:'l1',level:'LV1'},{id:'l2',level:'LV2'}],sections,questions:qs};
 const selected=Array.from(c(data));
 for(const lv of ['LV1','LV2']){
  const browser=selected.filter(q=>q.level===lv).map(x=>x.id).join('|');
  const server=Array.from(s(data,lv)).map(x=>x.id).join('|');
  assert.equal(browser,server);
 }
});
test('HTML bài Toán được render từ module riêng',()=>{
 const esc=s=>String(s??'').replaceAll('<','&lt;');
 const render=evaluate('42_CauHoiToanHienThi.html','G6_HIEN_THI_TOAN',{thoatHtmlToan:esc});
 const cases=[
  [{type:'vertical',name:'Đặt tính',id:'a'},[{id:'x',type:'vertical',n1:'28',n2:'45',answer:'73',valid:true,label:'a)',theme:'blue'}],'ml-vertical-matrix'],
  [{type:'mental',name:'Tính nhẩm',id:'b'},[{id:'y',type:'mental',n1:'20',n2:'30',valid:true}],'ml-mental-row'],
  [{type:'word_problem',name:'Lời văn',id:'c'},[{id:'z',type:'word_problem',prompt:'Đàn gà',unit:'con',valid:true}],'ml-word-calc'],
  [{type:'missing_digit',name:'Ô số',id:'d'},[{id:'m',type:'missing_digit',puzzle:[['1',{ans:2}],['3','4']],valid:true}],'ml-puzzle']
 ];
 for(const [section,qs,marker]of cases)assert.match(render.section(section,0,qs,{}),new RegExp(marker));
});
test('migrate localStorage xóa dấu tích cũ đúng một lần',()=>{
 const make=entries=>{
  const map=new Map(Object.entries(entries));
  return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),key:i=>Array.from(map.keys())[i]||null,
   get length(){return map.size}};
 };
 const local=make({lop2_b20_ketqua_v1:'{"q":true}',lop2_v19_topic_progress:'{}',other:'ok'});
 const session=make({lop2_lesson_cache_old:'data'});
 const r=evaluate('38_ResetTrangThaiCu.html','G5_KHOI_TAO',{localStorage:local,sessionStorage:session,console});
 assert.equal(r.ran,true);
 assert.equal(local.getItem('lop2_b20_ketqua_v1'),null);
 assert.equal(session.getItem('lop2_lesson_cache_old'),null);
 assert.equal(local.getItem('other'),'ok');
 assert.equal(local.getItem('lop2_g5_reset_v1_done'),'1');
 const again=evaluate('38_ResetTrangThaiCu.html','G5_KHOI_TAO',{localStorage:local,sessionStorage:session,console});
 assert.equal(again.ran,false);
});
test('không lưu dấu tích hoặc lịch demo vào localStorage',()=>{
 for(const f of ['12_DuLieuLoTrinh.html','16_LichHocChuyenCan.html','17_HocToanTuSheet.html','19_KhongGianHocToan.html']){
  assert.doesNotMatch(read(f),/localStorage\.(getItem|setItem)/);
 }
});
test('cấu hình Sheet chỉ nằm ở CauHinh.gs',()=>{
 assert.match(read('CauHinh.gs'),/SHEET_MAC_DINH/);
 for(const f of ['DocDuLieuSheet.gs','DuLieuToanSheet.gs','ThanhTichMayChu.gs']){
  assert.doesNotMatch(read(f),/1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8/);
 }
});
test('GiaoDien nạp module đúng thứ tự, không thiếu hoặc trùng',()=>{
 const text=read('GiaoDien.html');
 const arr=[...text.matchAll(/napThanhPhan\('([^']+)'\)/g)].map(x=>x[1]);
 for(const x of arr)assert.ok(fs.existsSync(path.join(root,x+'.html')),x);
 assert.equal(new Set(arr).size,arr.length);
 assert.equal((text.match(/<script>/g)||[]).length,(text.match(/<\/script>/g)||[]).length);
 const index=n=>arr.indexOf(n);
 assert.ok(index('38_ResetTrangThaiCu')<index('12_DuLieuLoTrinh'));
 assert.ok(index('40_BoMayBaiHoc')<index('19_KhongGianHocToan'));
 assert.ok(index('42_CauHoiToanHienThi')<index('19_KhongGianHocToan'));
 assert.ok(index('41_ThoiGianTuongTac')<index('19_KhongGianHocToan'));
 assert.ok(index('39_DongBoTienDo')>index('16_LichHocChuyenCan'));
});
console.log('TỔNG KẾT: '+count+' nhóm kiểm thử đạt.');
