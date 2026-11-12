/**
 * Thành tích Lớp 2 V1.0 — server là nguồn duy nhất của sao và lần nộp.
 * Cùng một Google Sheet bài 20, tab 90/91 tách biệt và KHÔNG đụng nội dung SGK.
 * Ứng dụng gia đình: chỉ triển khai Web App với quyền truy cập được giới hạn.
 * Các hàm hậu tố _ chỉ chạy trong Apps Script Editor, không callable từ HTML.
 */
// Sử dụng chung Sheet với bài học qua moBangDuAn_().
function achProfile_(){ return CAU_HINH_LOP_2.MA_HOC_SINH; }
const ACH_ATTEMPTS='90_Lan_lam_bai';
const ACH_LEDGER='91_So_sao';
const ACH_HEADERS_ATTEMPTS=['attempt_id','at_utc','profile_id','lesson_id','level','correct','total','answered','active_seconds','subject','title','correct_ids'];
const ACH_HEADERS_LEDGER=['event_key','at_utc','profile_id','event_type','delta','lesson_id','level','attempt_id','note'];
const ACH_POINTS={LV1:15,LV2:25,LV3:35};
function achS_(name,headers){
 const wb=moBangDuAn_();
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
 const record={event_key:key,at_utc:new Date().toISOString(),profile_id:achProfile_(),event_type:type,delta,lesson_id:lesson,level:lv,attempt_id:attempt,note:note||''};
 sheet.appendRow(ACH_HEADERS_LEDGER.map(k=>record[k]));
 events.push(record);return true;
}
/** Nhận đáp án chứ KHÔNG nhận điểm do client tự tính; chỉ chấp nhận id bài/cấp độ đã biết. */
function ghiNhanKetQuaToan20(payload){
  // Bản pilot không được ghi sổ sao hoặc chấm theo các ID gốc.
  if(typeof b20DocPackThu_==='function')throw Error('Bài 20 đang ở chế độ thử nghiệm JSON; không ghi sao.');
 if(!payload||!/^LV[123]$/.test(String(payload.level)))throw Error('Cấp độ không hợp lệ');
 const lv=String(payload.level);
 const raw=payload.answers||{};
 if(typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length>80)throw Error('Dữ liệu đáp án không hợp lệ');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const attemptSheet=achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS);
  const pointsSheet=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
  const old=achRows_(attemptSheet).filter(r=>r.profile_id===achProfile_()&&r.lesson_id==='toan_b20'&&r.level===lv);
  const events=achRows_(pointsSheet).filter(r=>r.profile_id===achProfile_());
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
   attempt_id:id,at_utc:now.toISOString(),profile_id:achProfile_(),lesson_id:'toan_b20',level:lv,
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
