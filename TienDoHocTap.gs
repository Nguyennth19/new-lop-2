/**
 * G5/G6 – Tiến độ học từ máy chủ (đọc duy nhất sổ nộp và sổ sao).
 * Không tin localStorage của học sinh, không ghi Sheet khi mở trang.
 * Chỉ một học sinh: ACH_PROFILE cấu hình tập trung ở CauHinh.gs.
 */
function layTienDoHocTap(){
 const attempts=achRows_(achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS))
  .filter(x=>x.profile_id===ACH_PROFILE&&x.lesson_id==='toan_b20');
 const events=achRows_(achS_(ACH_LEDGER,ACH_HEADERS_LEDGER))
  .filter(x=>x.profile_id===ACH_PROFILE);
 const completedLevels={LV1:false,LV2:false,LV3:false};
 const correctQuestions={};
 events.forEach(x=>{
  if(x.event_type==='level_done'&&x.lesson_id==='toan_b20'&&Object.prototype.hasOwnProperty.call(completedLevels,x.level)){
   completedLevels[x.level]=true;
  }
 });
 attempts.forEach(x=>{
  let ids=[];try{ids=JSON.parse(String(x.correct_ids||'[]'))}catch(e){}
  if(Array.isArray(ids))ids.forEach(id=>{if(/^toan_b20_/.test(String(id)))correctQuestions[id]=true;});
 });
 return {lessonId:'toan_b20',completedLevels,correctQuestions,attemptCount:attempts.length,
  serverTime:new Date().toISOString(),source:'server'};
}
