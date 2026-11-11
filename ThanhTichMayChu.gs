/**
 * Thành tích Lớp 2 V1.0 — server là nguồn duy nhất của sao và lần nộp.
 * Cùng một Google Sheet bài 20, tab 90/91 tách biệt và KHÔNG đụng nội dung SGK.
 * Ứng dụng gia đình: chỉ triển khai Web App với quyền truy cập được giới hạn.
 * Các hàm hậu tố _ chỉ chạy trong Apps Script Editor, không callable từ HTML.
 */
const ACH_SHEET_ID='1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8';
const ACH_PROFILE='gia_dinh_01';
const ACH_ATTEMPTS='90_Lan_lam_bai';
const ACH_LEDGER='91_So_sao';
const ACH_HEADERS_ATTEMPTS=['attempt_id','at_utc','profile_id','lesson_id','level','correct','total','answered','active_seconds','subject','title','correct_ids'];
const ACH_HEADERS_LEDGER=['event_key','at_utc','profile_id','event_type','delta','lesson_id','level','attempt_id','note'];
const ACH_POINTS={LV1:15,LV2:25,LV3:35};
function achS_(name,headers){
 const wb=SpreadsheetApp.openById(ACH_SHEET_ID);
 let sheet=wb.getSheetByName(name);
 if(!sheet){sheet=wb.insertSheet(name);sheet.getRange(1,1,1,headers.length).setValues([headers]);sheet.setFrozenRows(1);}
 return sheet;
}
function achRows_(sheet){
 const values=sheet.getDataRange().getValues();
 if(values.length<2)return[];
 const keys=values.shift().map(String);
 return values.filter(row=>row[0]!=='').map(row=>Object.fromEntries(keys.map((k,i)=>[k,row[i]])));
}
function achDate_(value){
 const d=new Date(value);return isNaN(d.getTime())?new Date(0):d;
}
function achDay_(date){return Utilities.formatDate(date,'Asia/Ho_Chi_Minh','yyyy-MM-dd');}
function achCut_(s,n){return String(s||'').slice(0,n);}
function achSelect_(data,lv){
 // Sao chép quy tắc lựa chọn V2.5 để máy chủ KHÔNG tin danh sách câu từ trình duyệt.
 const limits={toan_b20_lv1_ex1:{max:4},toan_b20_lv1_ex2:{perGroup:2},toan_b20_lv1_ex3:{max:2},
  toan_b20_lv2_problems:{max:4},toan_b20_lv3_ex1:{max:6},toan_b20_lv3_ex2:{max:6},toan_b20_lv3_ex3:{max:6},toan_b20_lv3_ex4:{max:4}};
 const sections=data.sections.filter(s=>data.levels.some(l=>l.level===lv&&l.id===s.levelId));
 const out=[];
 sections.forEach(section=>{
  const all=data.questions.filter(q=>q.valid&&q.sectionId===section.id).sort((a,b)=>a.order-b.order);
  const rule=limits[section.id]||{};
  if(rule.perGroup){
   const groups={};
   all.forEach(q=>{const name=q.group||'Chung';(groups[name]||(groups[name]=[])).push(q);});
   Object.values(groups).forEach(arr=>out.push(...arr.slice(0,rule.perGroup)));
  }else out.push(...all.slice(0,rule.max||all.length));
 });
 return out;
}
function achCheck_(q,fields){
 const v=k=>String(fields[k]===undefined?'':fields[k]).trim();
 if(q.type==='vertical'){
  const ans=String(q.answer).padStart(2,'0');
  const carry=(Number(q.n1)%10+Number(q.n2)%10)>=10?'1':'0';
  return v('ones')===ans[1]&&v('tens')===ans[0]&&v('carry')===carry;
 }
 if(q.type==='mental')return v('answer')!==''&&Number(v('answer'))===Number(q.answer);
 if(q.type==='missing_digit')return Array.isArray(q.puzzle)&&q.puzzle.every((row,i)=>row.every((cell,j)=>!cell||typeof cell!=='object'||v('p'+i+j)===String(cell.ans)));
 if(q.type==='word_problem'){
  return v('n1')!==''&&v('n2')!==''&&
   ((Number(v('n1'))===Number(q.n1)&&Number(v('n2'))===Number(q.n2))||(Number(v('n1'))===Number(q.n2)&&Number(v('n2'))===Number(q.n1)))&&
   v('op')===q.op&&v('sum')!==''&&Number(v('sum'))===Number(q.answer)&&v('answer')!==''&&Number(v('answer'))===Number(q.answer);
 }
 return false;
}
function achFirst_(events,key){return events.some(e=>String(e.event_key)===key);}
function achAdd_(sheet,events,key,type,delta,lesson,lv,attempt,note){
 if(achFirst_(events,key))return false;
 const record={event_key:key,at_utc:new Date().toISOString(),profile_id:ACH_PROFILE,event_type:type,delta,lesson_id:lesson,level:lv,attempt_id:attempt,note:note||''};
 sheet.appendRow(ACH_HEADERS_LEDGER.map(k=>record[k]));
 events.push(record);return true;
}
/** Nhận đáp án chứ KHÔNG nhận điểm do client tự tính; chỉ chấp nhận id bài/cấp độ đã biết. */
function ghiNhanKetQuaToan20(payload){
 if(!payload||!/^LV[123]$/.test(String(payload.level)))throw Error('Cấp độ không hợp lệ');
 const lv=String(payload.level);
 const raw=payload.answers||{};
 if(typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length>80)throw Error('Dữ liệu đáp án không hợp lệ');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const attemptSheet=achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS);
  const pointsSheet=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
  const old=achRows_(attemptSheet).filter(r=>r.profile_id===ACH_PROFILE&&r.lesson_id==='toan_b20'&&r.level===lv);
  const events=achRows_(pointsSheet).filter(r=>r.profile_id===ACH_PROFILE);
  const id=String(payload.attemptId||'');
  if(!/^[a-zA-Z0-9_-]{12,90}$/.test(id))throw Error('Mã lượt làm không hợp lệ');
  // Retry có cùng attemptId được trả về nhưng không chấm/cộng lần nữa.
  const prior=old.find(x=>String(x.attempt_id)===id);
  if(prior)return {ok:true,duplicate:true,score:Number(prior.correct),total:Number(prior.total),summary:achSummary_(attemptSheet,pointsSheet)};
  const data=layBaiToan20(),questions=achSelect_(data,lv);
  if(!questions.length)throw Error('Không tìm thấy câu hỏi hợp lệ');
  if(questions.some(q=>!Object.prototype.hasOwnProperty.call(raw,q.id)))throw Error('Thiếu dữ liệu câu hỏi');
  let correct=0,answered=0;const correctIds=[];
  questions.forEach(q=>{
   const a=raw[q.id];
   if(!a||typeof a!=='object'||Array.isArray(a))throw Error('Đáp án không hợp lệ');
   if(Object.keys(a).length>15)throw Error('Quá nhiều trường đáp án');
   if(Object.values(a).some(v=>String(v).length>10))throw Error('Độ dài đáp án không hợp lệ');
   const filled=Object.values(a).some(v=>String(v||'').trim()!=='');
   if(filled)answered++;
   if(achCheck_(q,a)){correct++;correctIds.push(q.id);}
  });
  const now=new Date(),entry={
   attempt_id:id,at_utc:now.toISOString(),profile_id:ACH_PROFILE,lesson_id:'toan_b20',level:lv,
   correct,total:questions.length,answered,active_seconds:Math.max(0,Math.min(1800,Math.floor(Number(payload.activeSeconds)||0))),
   subject:'Toán',title:'Bài 20: Phép cộng (có nhớ)',correct_ids:JSON.stringify(correctIds)
  };
  attemptSheet.appendRow(ACH_HEADERS_ATTEMPTS.map(k=>entry[k]));
  const pct=correct/questions.length*100,oldPct=old.length?100*Number(old[0].correct)/Number(old[0].total):null;
  if(pct>=70)achAdd_(pointsSheet,events,'DONE:toan_b20:'+lv,'level_done',ACH_POINTS[lv],'toan_b20',lv,id,'Đạt ít nhất 70%');
  if(correct===questions.length)achAdd_(pointsSheet,events,'PERFECT:toan_b20:'+lv,'perfect',5,'toan_b20',lv,id,'Đạt 100%');
  if(oldPct!==null&&pct-oldPct>=20)achAdd_(pointsSheet,events,'IMPROVED:toan_b20:'+lv,'improved',5,'toan_b20',lv,id,'Tiến bộ >=20 điểm phần trăm so với lần đầu');
  if(old.length){
   let firstCorrect=[];try{firstCorrect=JSON.parse(String(old[0].correct_ids||'[]'))}catch(e){}
   if(correctIds.some(qid=>!firstCorrect.includes(qid)))
    achAdd_(pointsSheet,events,'RETRY:toan_b20:'+lv,'retry_success',5,'toan_b20',lv,id,'Sửa đúng câu từng làm sai');
  }
  if(correct>0)achAdd_(pointsSheet,events,'DAILY:'+achDay_(now),'daily',5,'toan_b20',lv,id,'Hoạt động học có câu đúng trong ngày');
  return {ok:true,duplicate:false,score:correct,total:questions.length,summary:achSummary_(attemptSheet,pointsSheet)};
 }finally{lock.releaseLock();}
}
function achBadgeWindows_(days){
 const nums=[...new Set(days)].sort().map(d=>new Date(d+'T12:00:00').getTime());
 let max7=0;
 nums.forEach(end=>{const n=nums.filter(x=>x>=end-6*86400000&&x<=end).length;max7=Math.max(max7,n);});
 const weekCounts={};
 days.forEach(day=>{
  const d=new Date(day+'T12:00:00');
  const monday=new Date(d);monday.setDate(d.getDate()-(d.getDay()+6)%7);
  const key=monday.getFullYear()+'-'+String(monday.getMonth()+1).padStart(2,'0')+'-'+String(monday.getDate()).padStart(2,'0');
  (weekCounts[key]||(weekCounts[key]=new Set())).add(day);
 });
 const months={};
 Object.keys(weekCounts).forEach(start=>{
  const month=start.slice(0,7);
  if(weekCounts[start].size>=3)months[month]=(months[month]||0)+1;
 });
 return {max7,monthMax:Math.max(0,...Object.values(months))};
}
function achBadges_(attempts,events){
 const scored=attempts.filter(a=>Number(a.total)>0);
 const days=[...new Set(scored.map(a=>achDay_(achDate_(a.at_utc))))];
 const completed=new Set(events.filter(e=>e.event_type==='level_done').map(e=>e.lesson_id+':'+e.level));
 const lessonCount=new Set(events.filter(e=>e.event_type==='level_done').map(e=>e.lesson_id)).size;
 const doneMath=new Set(events.filter(e=>e.event_type==='level_done'&&e.lesson_id==='toan_b20').map(e=>e.lesson_id)).size;
 const keys=events.map(e=>e.event_type), windows=achBadgeWindows_(days);
 const defs=[
  ['FIRST_STEP','Ngôi sao đầu tiên','Hoàn thành cấp độ đầu tiên',completed.size,1],
  ['TRY_AGAIN','Em không bỏ cuộc','Sửa đúng câu đã từng sai',keys.includes('retry_success')?1:0,1],
  ['WEEK_3','Chăm học','3 ngày có bài nộp trong 7 ngày',windows.max7,3],
  ['WEEK_5','Bền bỉ','5 ngày có bài nộp trong 7 ngày',windows.max7,5],
  ['TEN_LESSONS','Nhà khám phá','Hoàn thành 10 bài học',lessonCount,10],
  ['MATH_10','Nhà toán học nhí','Hoàn thành 10 bài Toán',doneMath,10],
  ['VIET_10','Bạn yêu tiếng Việt','Hoàn thành 10 bài Tiếng Việt',0,10],
  ['EN_10','English Explorer','Hoàn thành 10 bài Tiếng Anh',0,10],
  ['FULL_MASTERY','Thám hiểm ba cấp độ','Hoàn thành cả LV1, LV2, LV3 của một bài', ['LV1','LV2','LV3'].every(l=>completed.has('toan_b20:'+l))?1:0,1],
  ['IMPROVE_20','Tiến bộ vượt bậc','Tăng kết quả so với lần đầu',keys.includes('improved')?1:0,1],
  ['THIRTY','Siêu khám phá','Hoàn thành 30 bài học',lessonCount,30],
  ['MONTH_GOAL','Chiến binh tháng','3 tuần có ít nhất 3 ngày học trong cùng tháng',windows.monthMax,3]
 ];
 return defs.map(([id,name,description,n,target])=>({id,name,description,progress:Math.min(n,target),target,achieved:n>=target}));
}
function achStreak_(days){
 const present=new Set(days);const today=new Date();
 let d=new Date(today.getFullYear(),today.getMonth(),today.getDate()),count=0;
 if(!present.has(achDay_(d)))d.setDate(d.getDate()-1);
 while(present.has(achDay_(d))&&count<366){count++;d.setDate(d.getDate()-1)}return count;
}
function achSummary_(attemptSheet,pointsSheet){
 const attempts=achRows_(attemptSheet).filter(x=>x.profile_id===ACH_PROFILE);
 const events=achRows_(pointsSheet).filter(x=>x.profile_id===ACH_PROFILE);
 const earned=events.filter(e=>Number(e.delta)>0).reduce((n,e)=>n+Number(e.delta),0);
 const balance=events.reduce((n,e)=>n+Number(e.delta),0);
 const completed=new Set(events.filter(e=>e.event_type==='level_done').map(e=>e.lesson_id+':'+e.level));
 const days=[...new Set(attempts.filter(a=>Number(a.total)>0).map(a=>achDay_(achDate_(a.at_utc))))];
 const now=new Date(),today=achDay_(now),bars=[];
 for(let i=6;i>=0;i--){const date=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i),day=achDay_(date);
  const mins=attempts.filter(a=>achDay_(achDate_(a.at_utc))===day).reduce((n,a)=>n+Number(a.active_seconds||0),0);
  bars.push({day,label:['CN','T2','T3','T4','T5','T6','T7'][date.getDay()],minutes:Math.round(mins/60),attempts:attempts.filter(a=>achDay_(achDate_(a.at_utc))===day).length});
 }
 const accuracy=attempts.reduce((n,a)=>n+Number(a.correct||0),0),total=attempts.reduce((n,a)=>n+Number(a.total||0),0);
 const badges=achBadges_(attempts,events);
 const recent=attempts.slice(-25).reverse().map(a=>({id:a.attempt_id,at:String(a.at_utc),title:a.title,subject:a.subject,level:a.level,correct:Number(a.correct),total:Number(a.total)}));
 return {earned,balance,spent:earned-balance,attempts:attempts.length,completed:completed.size,
  lectures:0, tests:0, activeSeconds:attempts.reduce((n,a)=>n+Number(a.active_seconds||0),0),
  accuracy:total?Math.round(accuracy/total*100):0,days:days.length,streak:achStreak_(days),badges,
  badgeCount:badges.filter(b=>b.achieved).length,week:bars,recent,asOf:new Date().toISOString(),isDemo:false};
}
function layTongQuanThanhTich(){
 // Các tab được tạo trống khi truy cập lần đầu: toàn bộ dashboard mặc định bằng 0.
 return achSummary_(achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS),achS_(ACH_LEDGER,ACH_HEADERS_LEDGER));
}
/**
 * QUẢN TRỊ TƯƠNG LAI: chạy trong Apps Script Editor, không xuất nút cho bé.
 * Delta dương = thưởng, delta âm = đổi thưởng/điều chỉnh; KHÔNG cho số dư âm.
 * Hàm hậu tố _ không callable qua google.script.run. Lưu vĩnh viễn vào sổ sao.
 */
function dieuChinhSaoPhuHuynh_(delta,lyDo){
 const value=Number(delta);if(!Number.isSafeInteger(value)||value===0||Math.abs(value)>100000)throw Error('Số sao điều chỉnh không hợp lệ');
 if(String(lyDo||'').trim().length<6)throw Error('Cần lý do điều chỉnh tối thiểu 6 ký tự');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const as=achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS),ps=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
  const current=achSummary_(as,ps);if(current.balance+value<0)throw Error('Ví sao không đủ để trừ');
  const id=Utilities.getUuid(),entry={event_key:'ADMIN:'+id,at_utc:new Date().toISOString(),
    profile_id:ACH_PROFILE,event_type:value<0?'parent_redeem':'parent_bonus',delta:value,
    lesson_id:'',level:'',attempt_id:'',note:achCut_(lyDo,220)};
  ps.appendRow(ACH_HEADERS_LEDGER.map(k=>entry[k]));return achSummary_(as,ps);
 }finally{lock.releaseLock()}
}
