'use strict';
/** P0.6-A PURE contract validator. No Sheets, GAS, DOM, network, student data or writes. */
const OBJ=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const STR=x=>typeof x==='string'&&x.trim().length>0;
const subjects=new Set(['toan','tieng_viet','tieng_anh']);
const origins=new Set(['SOURCE_PROVIDED','PROJECT_DERIVED']);
const modes=new Set(['exact','normalized_text','set_of_answers','rubric','manual_review']);
const statuses=new Set(['PASS','PENDING','FAIL']);
const approvals=new Set(['APPROVED_BY_PROJECT_OWNER','APPROVED_BY_TEACHER','PENDING','REJECTED']);
const sources=new Set(['TEXTBOOK_DERIVED','WORKBOOK_DERIVED','PROJECT_ORIGINAL_VARIANT','REFERENCE_DERIVED']);
function validateLesson(d){
 const errors=[];const add=(code,at)=>errors.push({code,at});
 if(!OBJ(d))return {ok:false,errors:[{code:'LESSON_OBJECT_REQUIRED',at:'$'}]};
 if(d.schemaVersion!=='lop2.lesson.v1')add('SCHEMA_VERSION','schemaVersion');
 if(!/^[a-z0-9][a-z0-9_-]{2,95}$/.test(d.lessonId||''))add('LESSON_ID','lessonId');
 if(!subjects.has(d.subject))add('SUBJECT','subject');
 if(!OBJ(d.curriculum)||d.curriculum.grade!==2||!STR(d.curriculum.lessonRef))add('CURRICULUM','curriculum');
 if(!STR(d.contentVersion))add('CONTENT_VERSION','contentVersion');
 if(!OBJ(d.source)||!sources.has(d.source.questionOrigin)||!Array.isArray(d.source.references))add('SOURCE','source');
 if(!Array.isArray(d.levels)||!d.levels.length)add('LEVELS','levels');
 if(!Array.isArray(d.sessions)||!d.sessions.length)add('SESSIONS','sessions');
 if(!Array.isArray(d.questions)||!d.questions.length)add('QUESTIONS','questions');
 if(errors.length)return {ok:false,errors};
 const levelIds=new Set(),sessionIds=new Set(),qids=new Set(),membership=new Map();
 for(const l of d.levels){
  if(!OBJ(l)||!STR(l.id)||!STR(l.intent)||levelIds.has(l.id))add('LEVEL_INVALID_OR_DUPLICATE',l&&l.id||'levels');
  else levelIds.add(l.id);
 }
 for(const s of d.sessions){
  if(!OBJ(s)||!STR(s.id)||sessionIds.has(s.id)) {add('SESSION_INVALID_OR_DUPLICATE',s&&s.id||'sessions');continue;}
  sessionIds.add(s.id);
  if(!levelIds.has(s.levelId))add('SESSION_LEVEL_UNKNOWN',s.id);
  if(!Array.isArray(s.questionIds)||!s.questionIds.length){add('SESSION_EMPTY',s.id);continue;}
  for(const qid of s.questionIds){
   if(!STR(qid)||membership.has(qid))add('QUESTION_REF_DUPLICATE',s.id);
   else membership.set(qid,s.id);
  }
 }
 for(const q of d.questions){
  if(!OBJ(q)||!STR(q.id)||qids.has(q.id)){add('QUESTION_INVALID_OR_DUPLICATE',q&&q.id||'questions');continue;}
  qids.add(q.id);
  if(!STR(q.prompt)||!STR(q.kind)||!/^[a-z_]+\.[a-z_]+$/.test(q.kind))add('PROMPT_OR_KIND',q.id);
  if(!levelIds.has(q.levelId))add('QUESTION_LEVEL_UNKNOWN',q.id);
  if(!sessionIds.has(q.sessionId)||membership.get(q.id)!==q.sessionId)add('QUESTION_SESSION_MISMATCH',q.id);
  if(!OBJ(q.renderer)||!STR(q.renderer.component))add('RENDERER_REQUIRED',q.id);
  const a=q.answerSpec;
  if(!OBJ(a)||!modes.has(a.mode)||!origins.has(a.origin)||!OBJ(a.verification)||!statuses.has(a.verification.status)||!OBJ(a.pedagogyApproval)||!approvals.has(a.pedagogyApproval.status)){add('ANSWER_CONTRACT',q.id);continue;}
  if(a.mode==='exact'&&!Object.hasOwn(a,'value'))add('EXACT_ANSWER_REQUIRED',q.id);
  if(a.mode==='set_of_answers'&&(!Array.isArray(a.acceptedValues)||!a.acceptedValues.length))add('ANSWER_SET_REQUIRED',q.id);
  if(a.mode==='rubric'&&!STR(a.rubricRef))add('RUBRIC_REQUIRED',q.id);
  if(q.assets&&q.assets.usage==='countable'&&q.assets.countVerified!==true)add('ASSET_COUNT_NOT_VERIFIED',q.id);
 }
 for(const qid of membership.keys())if(!qids.has(qid))add('DANGLING_QUESTION_REF',qid);
 for(const qid of qids)if(!membership.has(qid))add('UNASSIGNED_QUESTION',qid);
 return {version:'p0.6-contract-validator-v1',lessonId:d.lessonId,ok:errors.length===0,errors,questionCount:qids.size,sessionCount:sessionIds.size};
}
module.exports={validateLesson};
