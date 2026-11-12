/** PILOT B20 2026-11-12 – chỉ đọc Runtime JSON công khai bất biến, không sửa dữ liệu SGK/SBT.
 * Không ghi điểm, sao hoặc trạng thái hoàn thành. Không đưa token GitHub vào mã nguồn.
 * URL khóa theo commit, thay phiên bản phải cập nhật commit và QA lại.
 */
const B20_PILOT_URL="https://raw.githubusercontent.com/Nguyennth19/new-lop-2/513e1dcefa0f229305a5d4523dac3cbdd201a908/thu-nghiem/bai-20-bien-the/runtime.json";
const B20_PILOT_CACHE_KEY='b20_pilot_20261112_pack_g7_b31_v1';
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
  // External visual scene metadata is optional; offline/404 must not break learning.
  // Each scene is attached by question ID only; original questions and answers are untouched.
  if(typeof b20DocAssetScenes_==='function')try{
    const assets=b20DocAssetScenes_();
    const validIds=new Set(pack.questions.map(q=>q.question_id));
    if(Object.keys(assets.question_scenes).some(id=>!validIds.has(id)||
       pack.questions.find(q=>q.question_id===id).type!=='word'))
       throw Error('Asset Scene tham chiếu câu không hợp lệ');
    result.assetScenes=assets;
  }catch(sceneError){
    if(typeof console!=='undefined'&&typeof console.warn==='function')console.warn('G7.4-B.3 fallback: không nạp Asset Scene JSON; giữ nguyên hình cũ: '+String(sceneError.message||sceneError));
  }
  if(JSON.stringify(result).length<95000)cache.put(B20_PILOT_CACHE_KEY,JSON.stringify(result),300);
  return result;
}
/** Chấm điểm thử nghiệm: hàm nội bộ, tuyệt đối không ghi tiến độ hay sao. */
function b20ChamThuNoiBo_(request){
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
/** API công khai cho giao diện Apps Script. */
function chamBaiToan20BienThe(request){
  return b20ChamThuNoiBo_(request);
}
/** Tên gọi cũ được giữ tạm để tương thích bản staging trước. */
function b20ChamThu(request){
  return b20ChamThuNoiBo_(request);
}
/** Hàm có thể chọn trên thanh Run của Apps Script. */
function kiemTraB20BienThe(){
  const p=b20DocPackThu_();
  return {ok:true,lessonId:p.lesson.id,questionCount:p.questions.length,sessionCount:p.sessions.length,
    counts:p.sessions.map(s=>({id:s.session_id,count:s.question_ids.length})),
    stagingOnly:true,noWrites:true,noStars:true};
}

/** Run trong Apps Script Editor: chứng minh API đang trả đúng gói mà UI20 yêu cầu.
 * Không dump prompt/answer và không ghi Google Sheets.
 */
function kiemTraGoiDuLieuUI20(){
  const p=layBaiToan20();
  const info={
    ok:!!p&&p.variantPilot===true&&p.lesson&&p.lesson.id==='toan_b20'&&
       Array.isArray(p.questions)&&Array.isArray(p.sessions)&&p.questions.length===30,
    apiVersion:'ui20-02a-data-check-20261112',
    lessonId:p&&p.lesson&&p.lesson.id||null,
    variantPilot:p&&p.variantPilot===true,
    questionCount:Array.isArray(p&&p.questions)?p.questions.length:null,
    sessionCount:Array.isArray(p&&p.sessions)?p.sessions.length:null,
    lessonKeys:p&&typeof p==='object'?Object.keys(p).sort():[],
    noWrites:true
  };
  console.log(JSON.stringify(info));
  if(!info.ok)throw Error('Web App đang trả dữ liệu khác hợp đồng B20 staging; kiểm tra deployment và layBaiToan20');
  return info;
}

/** Kiểm tra kết nối mà không ghi dữ liệu – dùng để đối chiếu deployment. */
function kiemTraKetNoiB20(){
  const qa=kiemTraB20BienThe();
  const report={ok:qa.ok,apiVersion:'b20-r1-3-1-20261112',lessonId:qa.lessonId,
    gradingEndpoint:'chamLuotToan20BienThe',endpointReady:typeof chamLuotToan20BienThe==='function',
    stagingOnly:true,noWrites:true};
  console.log(JSON.stringify(report));
  return report;
}
/** Chạy trong Apps Script Editor để test CHẤM 30 câu cả 6 lượt, không cần tham số, không ghi Google Sheets. */
function kiemTraChamLuotB20(){
  const p=b20DocPackThu_();
  const details=[];
  p.sessions.forEach(session=>{
    const answers={};
    session.question_ids.forEach(id=>{
      const q=p.questions.find(x=>x.question_id===id);
      const a=q.parameters.a,b=q.parameters.b,answer=String(q.answer).padStart(2,'0');
      answers[id]=q.type==='vertical'?{carry:'1',tens:answer[0],ones:answer[1]}:
        q.type==='word'?{n1:String(a),op:'+',n2:String(b),sum:String(q.answer),answer:String(q.answer)}:
        {answer:String(q.answer)};
    });
    const result=chamLuotToan20BienThe({sessionId:session.session_id,answers});
    if(result.correct!==session.question_ids.length||result.recorded!==false||result.starsAwarded!==0)
      throw Error('Chấm thử B20 không đạt: '+session.session_id);
    details.push({sessionId:session.session_id,passed:result.correct,total:result.total});
  });
  const result={ok:true,apiVersion:'b20-r1-3-1-20261112',total:details.reduce((n,x)=>n+x.passed,0),
    sessions:details,recorded:false,starsAwarded:0};
  console.log(JSON.stringify(result));
  return result;
}

/** R1.3: Chấm cả lượt bằng đáp án gốc trên máy chủ; KHÔNG ghi Sheet hoặc sao. */
function chamLuotToan20BienThe(request){
  if(!request||typeof request!=='object'||Array.isArray(request))throw Error('Yêu cầu không hợp lệ');
  const pack=b20DocPackThu_();
  const session=pack.sessions.find(s=>s.session_id===request.sessionId);
  if(!session)throw Error('Lượt B20 không tồn tại');
  const answers=request.answers;
  if(!answers||typeof answers!=='object'||Array.isArray(answers)||Object.keys(answers).length!==session.question_ids.length)
    throw Error('Thiếu hoặc dư câu trả lời của lượt');
  if(Object.keys(answers).some(id=>!session.question_ids.includes(id)))throw Error('ID câu hỏi không thuộc lượt');
  let correct=0,answered=0;
  const results={};
  for(const id of session.question_ids){
    const q=pack.questions.find(q=>q.question_id===id);
    const a=answers[id];
    if(!a||typeof a!=='object'||Array.isArray(a)||Object.keys(a).length>7||
       Object.values(a).some(v=>String(v).length>8))throw Error('Trường đáp án không hợp lệ');
    const val=k=>String(a[k]===undefined?'':a[k]).trim();
    let ok=false,filled=false;
    if(q.type==='vertical'){
      const ans=String(q.answer).padStart(2,'0');
      const carry=(q.parameters.a%10+q.parameters.b%10)>=10?'1':'0';
      ok=val('ones')===ans[1]&&val('tens')===ans[0]&&val('carry')===carry;
      filled=['ones','tens','carry'].some(k=>val(k)!=='');
    }else if(q.type==='word'){
      const x=val('n1'),y=val('n2'),op=val('op'),sum=val('sum'),answer=val('answer');
      filled=[x,y,op,sum,answer].some(Boolean);
      ok=x!==''&&y!==''&&sum!==''&&answer!==''&&
        ((Number(x)===q.parameters.a&&Number(y)===q.parameters.b)||
         (Number(y)===q.parameters.a&&Number(x)===q.parameters.b))&&
        op==='+'&&Number(sum)===q.answer&&Number(answer)===q.answer;
    }else{
      const x=val('answer');filled=x!=='';ok=x!==''&&/^\d{1,3}$/.test(x)&&Number(x)===q.answer;
    }
    if(filled)answered++;
    if(ok)correct++;
    results[id]={correct:ok,filled,explanation:q.solution_prompt||'',expected:q.answer};
  }
  return {ok:true,sessionId:session.session_id,total:session.question_ids.length,correct,answered,
    results,stagingOnly:true,starsAwarded:0,recorded:false};
}
