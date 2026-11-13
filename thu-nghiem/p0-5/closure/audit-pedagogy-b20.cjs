#!/usr/bin/env node
'use strict';
/* P0.5-H independent content audit. No mutations, student data, API or Sheet calls.
 * Arithmetic evidence is not a teacher approval.
 */
const fs=require('node:fs'),path=require('node:path');
const pack=JSON.parse(fs.readFileSync(path.join(__dirname,'../../bai-20-bien-the/runtime.json'),'utf8'));
const expected={'LV1-A':6,'LV1-B':6,'LV2-A':5,'LV2-B':5,'LV3-A':4,'LV3-B':4};
const validTypes=new Set(['carry','vertical','mental','word','three','reverse']);
const errors=[],notes=[],rows=[],seen=new Set();
function flag(arr,qid,code,reason){arr.push({questionId:qid,code,reason})}
if(pack.questions.length!==30)flag(errors,'PACK','COUNT_NOT_30','Số câu khác 30');
if(pack.sessions.length!==6)flag(errors,'PACK','SESSIONS_NOT_6','Số lượt khác 6');
for(const s of pack.sessions){
 if(expected[s.session_id]!==s.target_count||s.question_ids.length!==expected[s.session_id])
  flag(errors,s.session_id,'SESSION_COUNT_MISMATCH','Lượt có số câu khác kế hoạch');
}
for(const q of pack.questions){
 const id=q.question_id,p=q.parameters||{},type=q.type,short=id.slice(-3);
 if(seen.has(id))flag(errors,id,'DUPLICATE','Trùng ID');
 seen.add(id);
 const s=pack.sessions.find(x=>x.session_id===q.session_id);
 if(!s||!s.question_ids.includes(id))flag(errors,id,'SESSION_BINDING','Sai lượt tham chiếu');
 if(!validTypes.has(type)||!Number.isInteger(p.a)||!Number.isInteger(p.b)||!Number.isInteger(q.answer))
  flag(errors,id,'BAD_SCHEMA','Sai kiểu hoặc tham số số nguyên');
 const sum=p.a+p.b+(type==='three'?p.c:0);
 const derived=type==='carry'?Math.floor(((p.a%10)+(p.b%10))/10):type==='reverse'?p.a:sum;
 const mathOK=q.answer===derived;
 if(!mathOK)flag(errors,id,'ARITHMETIC_MISMATCH','Đáp án không khớp phép tính');
 if(type==='reverse'&&p.a+p.b>100)flag(errors,id,'REVERSE_OUT_OF_100','Tổng vượt 100');
 if(!['reverse','carry'].includes(type)&&sum>100)
  flag(errors,id,'OVER_100','Phép cộng vượt phạm vi bài');
 if(type==='vertical'&&((p.a%10)+(p.b%10)<10))
  flag(errors,id,'NOT_CARRYING','Đặt tính nhưng không có nhớ');
 if(type==='word'&&(!q.unit||!q.prompt||!q.prompt.includes('?')||!q.solution_prompt||!q.solution_prompt.includes(q.unit)))
   flag(errors,id,'WORD_UNIT','Bài lời văn thiếu đơn vị hoặc cách hỏi/giải');
 const pairs=type==='three'?[[p.a,p.b],[p.a,p.c],[p.b,p.c]].filter(x=>(x[0]+x[1])%10===0):[];
 if(type==='three'&&q.prompt.includes('thuận tiện')&&pairs.length===0)
  flag(notes,id,'REPHRASE_CONVENIENCE','Yêu cầu tính thuận tiện nhưng không có cặp số tròn chục rõ ràng: xem xét câu dẫn/thiết kế');
 if(q.level==='LV1'&&type==='mental'&&p.a>=10&&p.b>=10&&((p.a%10)+(p.b%10)>=10)
    && !(q.prompt.startsWith('Tính:')&&q.solution_prompt.includes('Đơn vị:')&&q.solution_prompt.includes('Chục:')))
  flag(notes,id,'LV1_MENTAL_SCAFFOLD','Tính nhẩm hai số có hai chữ số có nhớ tại LV1; nên có gợi ý tách chục/đơn vị');
 if(q.type==='carry'&&(q.answer!==1||q.level!=='LV1'))
  flag(notes,id,'CARRY_EXPLANATION','Đối chiếu diễn giải số nhớ');
 rows.push({
  id:short,questionId:id,sessionId:q.session_id,level:q.level,type,prompt:q.prompt,
  expression:type==='reverse'?'? + '+p.b+' = '+(p.a+p.b):
    type==='carry'?(p.a%10)+' + '+(p.b%10)+' = '+((p.a%10)+(p.b%10))+' → nhớ ?':
    type==='three'?p.a+' + '+p.b+' + '+p.c:p.a+' + '+p.b,
  expectedAnswer:derived,recordedAnswer:q.answer,mathStatus:mathOK?'PASS':'FAIL',
  pedagogyStatus:notes.some(n=>n.questionId===id)?'REVIEW':'PRELIMINARY_OK',
  reviewCodes:notes.filter(n=>n.questionId===id).map(x=>x.code),
  sourceRole:q.source_role,sourceReferenceKind:q.source_reference_kind
 });
}
for(const s of pack.sessions)if(s.question_ids.some(id=>!seen.has(id)))flag(errors,s.session_id,'MISSING_QUESTION','Lượt tham chiếu ID không có');
const result={version:'P0.5-H-content-audit-v1',lessonId:pack.lesson_id,sourceStatus:pack.release_status,
 questionCount:rows.length,sessionCounts:Object.fromEntries(pack.sessions.map(s=>[s.session_id,s.question_ids.length])),
 arithmeticPassed:rows.filter(x=>x.mathStatus==='PASS').length,arithmeticFailed:errors.filter(x=>x.code==='ARITHMETIC_MISMATCH').length,
 reviewQuestionCount:rows.filter(x=>x.pedagogyStatus==='REVIEW').length,technicalErrors:errors,advisoryFindings:notes,
 pedagogySignoff:'UNSIGNED',status:errors.length?'TECHNICAL_BLOCKED':notes.length?'CONTENT_REVIEW_REQUIRED':'PRELIMINARY_AUDIT_PASS',rows};
if(require.main===module){console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;}
module.exports={result};
