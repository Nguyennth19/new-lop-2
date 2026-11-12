/* P0.2 Validator V1 — pure/read-only. No GAS calls, DOM, storage or writes.
 * Source -> adapter -> renderer -> grading contract. Not a replacement grader.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.Lop2ValidatorV1=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const VERSION='p0.2-validator-v1';
 const TYPES=new Set(['vertical','mental','word_problem','missing_digit']);
 const B20_TYPES=new Set(['vertical','mental','word','three','reverse','carry']);
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const str=x=>typeof x==='string'&&x.trim().length>0;
 const id=x=>str(x)&&/^[a-zA-Z0-9_-]{3,96}$/.test(x);
 function report(stage,lessonId){
  const errors=[];
  return {version:VERSION,stage,lessonId:lessonId||null,ok:false,errors,
   add(code,questionId,field,reason){errors.push({code,questionId:questionId||null,field:field||null,reason});},
   finish(){this.ok=errors.length===0;delete this.add;delete this.finish;return this;}};
 }
 function checkList(r,items,key){
  const seen=new Set();
  items.forEach((item,i)=>{
   const qid=item&&item[key];
   if(!id(qid))r.add('INVALID_ID',String(qid||'@'+i),key,'ID thiếu hoặc sai định dạng');
   else if(seen.has(qid))r.add('DUPLICATE_ID',qid,key,'ID xuất hiện nhiều lần');
   seen.add(qid);
  });
 }
 function validateSource(raw,opts){
  opts=opts||{};const r=report('source',raw&&raw.lesson_id);
  if(!obj(raw)){r.add('SOURCE_OBJECT_REQUIRED',null,null,'JSON nguồn phải là object');return r.finish();}
  if(!str(raw.schema_version))r.add('SCHEMA_VERSION_REQUIRED',null,'schema_version','Thiếu phiên bản schema');
  if(!id(raw.lesson_id))r.add('LESSON_ID_INVALID',null,'lesson_id','Mã bài không hợp lệ');
  if(!Array.isArray(raw.questions)||!raw.questions.length){
   r.add('QUESTIONS_REQUIRED',null,'questions','Cần mảng câu hỏi không rỗng');return r.finish();
  }
  checkList(r,raw.questions,'question_id');
  const b20=raw.lesson_id==='toan_b20'&&Array.isArray(raw.sessions);
  const sessions=Array.isArray(raw.sessions)?raw.sessions:[];
  const sm=new Map();
  sessions.forEach((s,i)=>{
   if(!obj(s)||!id(s.session_id)){r.add('SESSION_ID_INVALID',null,'sessions['+i+']','Mã lượt không hợp lệ');return;}
   if(sm.has(s.session_id))r.add('DUPLICATE_SESSION',null,s.session_id,'Lượt trùng');
   sm.set(s.session_id,s);
   if(!Array.isArray(s.question_ids)||!s.question_ids.length)r.add('SESSION_QUESTIONS_REQUIRED',null,s.session_id,'Lượt không có câu');
   if(s.target_count!==undefined&&s.target_count!==s.question_ids.length)
    r.add('SESSION_COUNT_MISMATCH',null,s.session_id,'target_count khác số Question ID');
  });
  const referenced=new Map();
  sessions.forEach(s=>(s.question_ids||[]).forEach(qid=>{
   if(referenced.has(qid))r.add('SESSION_DUPLICATE_REF',qid,'session_id','Một câu thuộc nhiều lượt');
   referenced.set(qid,s.session_id);
  }));
  const qm=new Map();
  raw.questions.forEach((q,i)=>{
   const qid=q&&q.question_id||'@'+i;
   if(!obj(q)){r.add('QUESTION_OBJECT_REQUIRED',qid,null,'Câu hỏi phải là object');return;}
   qm.set(qid,q);
   if(q.lesson_id!==undefined&&q.lesson_id!==raw.lesson_id)r.add('QUESTION_LESSON_MISMATCH',qid,'lesson_id','Sai bài');
   if(!str(q.prompt))r.add('PROMPT_REQUIRED',qid,'prompt','Thiếu nội dung câu hỏi');
   if(!str(q.type))r.add('TYPE_REQUIRED',qid,'type','Thiếu loại câu');
   if(q.answer===undefined||q.answer===null||q.answer==='')r.add('ANSWER_REQUIRED',qid,'answer','Thiếu đáp án nguồn');
   if(q.session_id!==undefined&&sessions.length){
    if(!sm.has(q.session_id)||referenced.get(qid)!==q.session_id)
     r.add('QUESTION_SESSION_MISMATCH',qid,'session_id','Sai lượt hoặc không có tham chiếu');
   }
   if(b20){
    if(!B20_TYPES.has(q.type))r.add('TYPE_UNSUPPORTED',qid,'type','Renderer B20 chưa hỗ trợ loại này');
    const p=q.parameters||{},a=p.a,b=p.b,c=p.c;
    if(!Number.isInteger(a)||!Number.isInteger(b)||a<10||b<10||a+b>100||a%10+b%10<10)
     r.add('ARITHMETIC_PARAMETERS_INVALID',qid,'parameters','Phép cộng có nhớ cần a,b hợp lệ');
    else{
     const expected=q.type==='carry'?1:q.type==='reverse'?a:q.type==='three'?a+b+c:a+b;
     if(!Number.isInteger(expected)||expected!==q.answer||expected>100)
      r.add('ANSWER_MISMATCH',qid,'answer','Đáp án không khớp tham số phép tính');
    }
    if(!id(q.skill_id))r.add('SKILL_ID_INVALID',qid,'skill_id','Thiếu mã kỹ năng');
   } else if(opts.allowedTypes&& !opts.allowedTypes.includes(q.type))
    r.add('TYPE_UNSUPPORTED',qid,'type','Loại câu không thuộc tập được cấu hình');
  });
  referenced.forEach((sid,qid)=>{if(!qm.has(qid))r.add('DANGLING_QUESTION_REF',qid,sid,'Lượt tham chiếu Question ID không tồn tại');});
  if(sessions.length)raw.questions.forEach(q=>{
   if(q&& !referenced.has(q.question_id))r.add('UNASSIGNED_QUESTION',q.question_id,'session_id','Câu không thuộc lượt nào');
  });
  if(b20&&opts.b20Baseline===true){
   if(raw.questions.length!==30||sessions.length!==6)
    r.add('B20_BASELINE_COUNT',null,'questions/sessions','B20 baseline yêu cầu chính xác 30 câu và 6 lượt');
  }
  return r.finish();
 }
 function validateAdapter(data){
  const r=report('adapter',data&&data.lesson&&data.lesson.id);
  if(!obj(data)||!obj(data.lesson)||!id(data.lesson.id)){
   r.add('ADAPTER_LESSON_REQUIRED',null,'lesson','Thiếu lesson.id');return r.finish();
  }
  for(const k of ['levels','sections','questions']){
   if(!Array.isArray(data[k]))r.add('ADAPTER_COLLECTION_REQUIRED',null,k,'Thiếu mảng '+k);
  }
  if(r.errors.length)return r.finish();
  checkList(r,data.questions,'id');
  const levels=new Set(data.levels.map(x=>x.id));
  const sections=new Map(data.sections.map(x=>[x.id,x]));
  if(sections.size!==data.sections.length)r.add('DUPLICATE_SECTION',null,'sections','Trùng mã nhóm');
  data.sections.forEach(s=>{
   if(!levels.has(s.levelId))r.add('DANGLING_LEVEL_REF',null,s.id,'Nhóm tham chiếu LV không có');
  });
  data.questions.forEach((q,i)=>{
   const qid=q&&q.id||'@'+i;
   if(!obj(q)){r.add('QUESTION_OBJECT_REQUIRED',qid,null,'Câu không phải object');return;}
   if(!sections.has(q.sectionId))r.add('DANGLING_SECTION_REF',qid,'sectionId','Không tìm thấy nhóm');
   else if(sections.get(q.sectionId).levelId!==q.level)r.add('QUESTION_LEVEL_MISMATCH',qid,'level','Mã LV không khớp nhóm');
   if(!TYPES.has(q.type))r.add('RENDER_TYPE_UNSUPPORTED',qid,'type','Không có renderer cho loại này');
   if(!str(q.prompt)&&q.type==='word_problem')r.add('PROMPT_REQUIRED',qid,'prompt','Bài lời văn thiếu đề');
   if(q.answer===undefined||q.answer===null||q.answer==='')r.add('ANSWER_REQUIRED',qid,'answer','Thiếu đáp án dùng cho chấm');
   if(q.valid===false)r.add('QUESTION_INVALID',qid,'valid',q.issue||'Adapter đánh dấu không hợp lệ');
   if(q.type==='vertical'&&(!Number.isFinite(Number(q.n1))||!Number.isFinite(Number(q.n2))))
    r.add('RENDER_OPERANDS_INVALID',qid,'n1/n2','Thiếu toán hạng');
   if(q.type==='missing_digit'&&(!Array.isArray(q.puzzle)||!q.puzzle.length))
    r.add('PUZZLE_REQUIRED',qid,'puzzle','Thiếu ma trận puzzle');
  });
  return r.finish();
 }
 function validateRenderer(data){
  const r=report('renderer',data&&data.lesson&&data.lesson.id);
  const upstream=validateAdapter(data);
  upstream.errors.forEach(e=>r.add(e.code,e.questionId,e.field,e.reason));
  if(!upstream.ok)return r.finish();
  data.questions.forEach(q=>{
   const qid=q.id;
   const fields=q.type==='vertical'?['ones','tens','carry']:
    q.type==='word_problem'?['n1','op','n2','sum','answer']:
    q.type==='mental'?['answer']:null;
   if(fields===null){
    if(!Array.isArray(q.puzzle))r.add('RENDER_PUZZLE_INVALID',qid,'puzzle','Puzzle không có cấu trúc để render');
   }else if(fields.some(f=>!str(f)))r.add('RENDER_FIELD_INVALID',qid,'fields','Trường nhập không hợp lệ');
   if(q.assetId!==undefined&&q.assetId!==null&&!str(q.assetId))
    r.add('ASSET_ID_INVALID',qid,'assetId','Asset ID rỗng; cho phép fallback khi không có asset');
  });
  return r.finish();
 }
 function validateGrading(request,result,question){
  const qid=question&& (question.id||question.question_id)||request&&request.questionId;
  const r=report('grading',question&&question.lesson_id);
  if(!obj(request))r.add('GRADE_REQUEST_INVALID',qid,'request','Yêu cầu chấm không phải object');
  if(!obj(question)||!id(qid))r.add('GRADE_QUESTION_INVALID',qid,'question','Thiếu câu hỏi có ID');
  if(obj(request)&&request.questionId!==undefined&&request.questionId!==qid)
   r.add('GRADE_QUESTION_MISMATCH',qid,'questionId','Request không khớp câu');
  if(!obj(result))r.add('GRADE_RESULT_INVALID',qid,'result','Kết quả chấm không phải object');
  else{
   if(result.ok!==true)r.add('GRADE_NOT_OK',qid,'ok','Bộ chấm báo lỗi');
   if(result.questionId!==undefined&&result.questionId!==qid)
    r.add('GRADE_RESULT_QUESTION_MISMATCH',qid,'questionId','Result trả sai câu');
   if(result.correct!==undefined&&typeof result.correct!=='boolean')
    r.add('GRADE_CORRECT_TYPE',qid,'correct','correct phải là boolean');
   if(result.recorded!==undefined&&result.recorded!==false)
    r.add('GRADE_WRITE_FORBIDDEN',qid,'recorded','QA staging không cho ghi kết quả');
   if(result.starsAwarded!==undefined&&result.starsAwarded!==0)
    r.add('GRADE_STARS_FORBIDDEN',qid,'starsAwarded','QA staging không cho cấp sao');
  }
  return r.finish();
 }
 function validateSessionGrade(request,result,pack){
  const r=report('grading_session',pack&&pack.lesson&&pack.lesson.id);
  const sid=request&&request.sessionId;
  const session=pack&&Array.isArray(pack.sessions)&&pack.sessions.find(s=>s.session_id===sid);
  if(!session){r.add('GRADE_SESSION_INVALID',null,'sessionId','Không tìm thấy lượt');return r.finish();}
  const ids=session.question_ids||[],answers=request&&request.answers;
  if(!obj(answers)||Object.keys(answers).length!==ids.length||Object.keys(answers).some(k=>!ids.includes(k)))
   r.add('GRADE_ANSWERS_MISMATCH',null,'answers','Đáp án gửi lên thiếu/dư/sai ID');
  if(!obj(result)||result.ok!==true||result.sessionId!==sid||!Number.isInteger(result.correct)||
    result.correct<0||result.correct>ids.length||result.total!==ids.length)
   r.add('GRADE_RESULT_INVALID',null,'result','Kết quả chấm lượt không nhất quán');
  if(!obj(result)||result.recorded!==false||result.starsAwarded!==0)
   r.add('GRADE_WRITE_FORBIDDEN',null,'recorded/starsAwarded','Staging bắt buộc recorded=false, starsAwarded=0');
  return r.finish();
 }
 return Object.freeze({VERSION,validateSource,validateAdapter,validateRenderer,validateGrading,validateSessionGrade});
});