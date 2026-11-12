/** PILOT B20 2026-11-12 – chỉ đọc Runtime JSON công khai bất biến, không sửa dữ liệu SGK/SBT.
 * Không ghi điểm, sao hoặc trạng thái hoàn thành. Không đưa token GitHub vào mã nguồn.
 * URL khóa theo commit, thay phiên bản phải cập nhật commit và QA lại.
 */
const B20_PILOT_URL="https://raw.githubusercontent.com/Nguyennth19/new-lop-2/513e1dcefa0f229305a5d4523dac3cbdd201a908/thu-nghiem/bai-20-bien-the/runtime.json";
const B20_PILOT_CACHE_KEY='b20_pilot_20261112_pack_v1';
function b20DocPackThu_(){
  const cache=CacheService.getScriptCache();
  const cached=cache.get(B20_PILOT_CACHE_KEY);
  if(cached)return JSON.parse(cached);
  const response=UrlFetchApp.fetch(B20_PILOT_URL,{muteHttpExceptions:true,followRedirects:true});
  if(response.getResponseCode()!==200)throw Error('Không lấy được gói Bài 20 thử nghiệm (HTTP '+response.getResponseCode()+')');
  const raw=response.getContentText('UTF-8');
  const pack=JSON.parse(raw);
  if(pack.lesson_id!=='toan_b20'||pack.release_status!=='STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF')
    throw Error('Sai mã bài hoặc trạng thái gói thử nghiệm');
  if(!Array.isArray(pack.sessions)||pack.sessions.length!==6||!Array.isArray(pack.questions)||pack.questions.length!==30)
    throw Error('Sai số lượt/câu Bài 20 thử nghiệm');
  const ids=new Set();
  const types=['vertical','mental','word','three','reverse','carry'];
  pack.questions.forEach(q=>{
    if(!/^VAR_B20_20261112_\d{3}$/.test(q.question_id)||ids.has(q.question_id))
      throw Error('ID câu hỏi trùng/sai');
    ids.add(q.question_id);
    if(!types.includes(q.type)||!/^LV[123]-[AB]$/.test(q.session_id)||!/^B20-K\d{2}$/.test(q.skill_id))
      throw Error('Loại câu hỏi hoặc kỹ năng không hợp lệ');
    if(typeof q.prompt!=='string'||!q.prompt.trim()||typeof q.answer!=='number'||!Number.isInteger(q.answer))
      throw Error('Nội dung/đáp án không hợp lệ');
    const p=q.parameters||{},a=p.a,b=p.b,c=p.c;
    if(!Number.isInteger(a)||!Number.isInteger(b)||a<10||b<10||a+b>100||a%10+b%10<10)
      throw Error('Tham số cộng có nhớ không hợp lệ');
    const actual=q.type==='carry'?1:q.type==='reverse'?a:q.type==='three'?a+b+c:a+b;
    if(!Number.isInteger(actual)||actual!==q.answer||(q.type==='three'&&a+b+c>100))
      throw Error('Đáp án gói thử nghiệm không hợp lệ');
  });
  pack.sessions.forEach(s=>{
    if(!/^LV[123]-[AB]$/.test(s.session_id)||s.level!==s.session_id.slice(0,3)||
       s.question_ids.length!==s.target_count)throw Error('Lượt học không hợp lệ');
    const actual=pack.questions.filter(q=>q.session_id===s.session_id).map(q=>q.question_id);
    if(actual.length!==s.question_ids.length||s.question_ids.some((id,i)=>id!==actual[i]))
      throw Error('Đối chiếu danh sách câu trong lượt không hợp lệ');
  });
  // Trả về dữ liệu bài học, không chứa bất kỳ thông tin học sinh nào.
  const result={variantPilot:true,lesson:{id:'toan_b20',title:'Bài 20 – Phép cộng có nhớ',subject:'Toán'},
    packVersion:pack.schema_version,sessions:pack.sessions,questions:pack.questions};
  if(JSON.stringify(result).length<95000)cache.put(B20_PILOT_CACHE_KEY,JSON.stringify(result),300);
  return result;
}
function b20ChamThu(request){
  if(!request||typeof request!=='object')throw Error('Yêu cầu không hợp lệ');
  const pack=b20DocPackThu_();
  const sid=String(request.sessionId||''),id=String(request.questionId||'');
  const session=pack.sessions.find(s=>s.session_id===sid);
  if(!session||!session.question_ids.includes(id))throw Error('Câu hỏi không nằm trong lượt đã chọn');
  const q=pack.questions.find(x=>x.question_id===id);
  const text=String(request.answer===undefined?'':request.answer).trim();
  if(!/^\d{1,3}$/.test(text))return {ok:true,correct:false,empty:true,questionId:id};
  const correct=Number(text)===q.answer;
  return {ok:true,correct,questionId:id,expected:q.answer,unit:q.unit||'',
    explanation:q.solution_prompt||'',skillId:q.skill_id,stagingOnly:true,starsAwarded:0};
}
function kiemTraB20BienThe_(){
  const p=b20DocPackThu_();
  return {ok:true,lessonId:p.lesson.id,questionCount:p.questions.length,sessionCount:p.sessions.length,
    counts:p.sessions.map(s=>({id:s.session_id,count:s.question_ids.length})),
    stagingOnly:true,noWrites:true,noStars:true};
}
