/** G6: Báo cáo thống kê, huy hiệu và lịch sử học từ dữ liệu thật. */
function achBadgeWindows_(days){
 const nums=[...new Set(days)].sort().map(d=>new Date(d+'T12:00:00+07:00').getTime());
 let max7=0;
 nums.forEach(end=>{const n=nums.filter(x=>x>=end-6*86400000&&x<=end).length;max7=Math.max(max7,n);});
 const weekCounts={};
 days.forEach(day=>{
  const d=new Date(day+'T12:00:00+07:00');
  const monday=new Date(d);monday.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
  const key=monday.getUTCFullYear()+'-'+String(monday.getUTCMonth()+1).padStart(2,'0')+'-'+String(monday.getUTCDate()).padStart(2,'0');
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
 const scored=attempts.filter(a=>Number(a.correct)>0);
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
 const present=new Set(days);
 const day=achDay_(new Date()),d=new Date(day+'T12:00:00+07:00');let count=0;
 if(!present.has(achDay_(d)))d.setUTCDate(d.getUTCDate()-1);
 while(present.has(achDay_(d))&&count<366){count++;d.setDate(d.getDate()-1)}return count;
}
function achAnalyses_(attempts){
 const now=new Date(),week4=[],subjects=[
  {name:'Toán',percent:null,attempts:0},{name:'Tiếng Việt',percent:null,attempts:0},{name:'Tiếng Anh',percent:null,attempts:0}];
 for(let i=3;i>=0;i--){
  const base=new Date(achDay_(now)+'T12:00:00+07:00');
  base.setUTCDate(base.getUTCDate()-i*7);
  const end=base.getTime()+86400000;
  const start=end-7*86400000,items=attempts.filter(a=>{const t=achDate_(a.at_utc).getTime();return t>=start&&t<end});
  const total=items.reduce((n,a)=>n+Number(a.total||0),0);
  week4.push({label:i===0?'Tuần này':'Trước '+i+' tuần',attempts:items.length,
   accuracy:total?Math.round(100*items.reduce((n,a)=>n+Number(a.correct||0),0)/total):null});
 }
 subjects.forEach(obj=>{
  const own=attempts.filter(a=>a.subject===obj.name);
  const total=own.reduce((n,a)=>n+Number(a.total||0),0);
  obj.attempts=own.length;
  if(total)obj.percent=Math.round(100*own.reduce((n,a)=>n+Number(a.correct||0),0)/total);
 });
 const skills=[];
 try{
  const source=layBaiToan20(),latest={};
  attempts.filter(a=>a.lesson_id==='toan_b20').forEach(a=>{
   if(!latest[a.level]||achDate_(a.at_utc)>achDate_(latest[a.level].at_utc))latest[a.level]=a;
  });
  const groups={};
  Object.entries(latest).forEach(([lv,a])=>{
   let correct=[];try{correct=JSON.parse(String(a.correct_ids||'[]'))}catch(e){}
   achSelect_(source,lv).forEach(q=>{
    const kind=q.type==='mental'?'Tính nhẩm':q.type==='vertical'?'Đặt tính':q.type==='word_problem'?'Toán lời văn':'Tìm chữ số';
    const key=lv+' / '+kind,group=groups[key]||(groups[key]={name:key,correct:0,total:0});
    group.total++;if(correct.includes(q.id))group.correct++;
   });
  });
  skills.push(...Object.values(groups).map(g=>({name:g.name,correct:g.correct,total:g.total,
   percent:g.total?Math.round(100*g.correct/g.total):0,status:g.total&&g.correct/g.total>=.8?'Đã vững':g.total&&g.correct/g.total>=.5?'Tiến bộ':'Đang luyện'})));
 }catch(e){/* Dashboard thành tích vẫn hoạt động nếu tạm thời lỗi dữ liệu bài học. */}
 return {week4,subjects,skills};
}
function achSummary_(attemptSheet,pointsSheet){
 const attempts=achRows_(attemptSheet).filter(x=>x.profile_id===ACH_PROFILE);
 const events=achRows_(pointsSheet).filter(x=>x.profile_id===ACH_PROFILE);
 const studyTypes=new Set(['level_done','perfect','improved','retry_success','daily']);
 const earned=events.filter(e=>studyTypes.has(String(e.event_type))).reduce((n,e)=>n+Number(e.delta||0),0);
 const bonus=events.filter(e=>e.event_type==='parent_bonus').reduce((n,e)=>n+Number(e.delta||0),0);
 const redeemed=-events.filter(e=>Number(e.delta)<0).reduce((n,e)=>n+Number(e.delta||0),0);
 const balance=events.reduce((n,e)=>n+Number(e.delta||0),0);
 const completed=new Set(events.filter(e=>e.event_type==='level_done').map(e=>e.lesson_id+':'+e.level));
 const days=[...new Set(attempts.filter(a=>Number(a.correct)>0).map(a=>achDay_(achDate_(a.at_utc))))];
 const now=new Date(),today=achDay_(now),bars=[];
 for(let i=6;i>=0;i--){const date=new Date(today+'T12:00:00+07:00');date.setUTCDate(date.getUTCDate()-i);
  const day=achDay_(date);
  const mins=attempts.filter(a=>Number(a.answered)>0&&achDay_(achDate_(a.at_utc))===day).reduce((n,a)=>n+Number(a.active_seconds||0),0);
  bars.push({day,label:['CN','T2','T3','T4','T5','T6','T7'][date.getUTCDay()],minutes:Math.round(mins/60),
   attempts:attempts.filter(a=>achDay_(achDate_(a.at_utc))===day).length,
   active:attempts.some(a=>Number(a.correct)>0&&achDay_(achDate_(a.at_utc))===day)});
 }
 const accuracy=attempts.reduce((n,a)=>n+Number(a.correct||0),0),total=attempts.reduce((n,a)=>n+Number(a.total||0),0);
 const badges=achBadges_(attempts,events),analysis=achAnalyses_(attempts);
 const recent=attempts.slice(-25).reverse().map(a=>({id:a.attempt_id,at:String(a.at_utc),title:a.title,subject:a.subject,level:a.level,correct:Number(a.correct),total:Number(a.total)}));
 return {earned,balance,bonus,spent:redeemed,attempts:attempts.length,completed:completed.size,
  lectures:0, tests:0, activeSeconds:attempts.reduce((n,a)=>n+Number(a.active_seconds||0),0),
  accuracy:total?Math.round(accuracy/total*100):0,days:days.length,streak:achStreak_(days),badges,
  badgeCount:badges.filter(b=>b.achieved).length,week:bars,week4:analysis.week4,subjects:analysis.subjects,skills:analysis.skills,recent,asOf:new Date().toISOString(),isDemo:false};
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
