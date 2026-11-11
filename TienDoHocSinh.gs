/** G5 – Tiến độ chỉ dựa vào bài đã nộp và sao máy chủ xác nhận.
 * Chỉ một hồ sơ gia đình theo chính sách hiện tại, không lấy trạng thái localStorage.
 */
function layTienDoHocSinh(){
 const attemptSheet=achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS);
 const pointsSheet=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
 const attempts=achRows_(attemptSheet).filter(a=>a.profile_id===ACH_PROFILE);
 const ledger=achRows_(pointsSheet).filter(a=>a.profile_id===ACH_PROFILE);
 const done={};
 ledger.filter(e=>e.event_type==='level_done').forEach(e=>{
  if(/^LV[123]$/.test(String(e.level||''))&&e.lesson_id) {
   const id=String(e.lesson_id);(done[id]||(done[id]={}))[String(e.level)]=true;
  }
 });
 const correct={};
 attempts.forEach(a=>{
  const id=String(a.lesson_id||''),set=correct[id]||(correct[id]={});
  try{
   const list=JSON.parse(String(a.correct_ids||'[]'));
   if(Array.isArray(list))list.forEach(x=>{if(typeof x==='string'&&x.length<100)set[x]=true});
  }catch(e){}
 });
 const summary=achSummary_(attemptSheet,pointsSheet);
 return {profile:ACH_PROFILE,lessons:done,correctIds:correct,week:summary.week,
  completed:summary.completed,earned:summary.earned,balance:summary.balance,
  asOf:new Date().toISOString(),source:'google_sheet',isDemo:false};
}
