'use strict';
/* F-A G5: B21 compatibility adapter, injected existing 41 renderer + 26 grader.
 * TEST-only, no GAS, DOM, storage, progress or student scores. Fail closed.
 */
const {build}=require('./b21-lv3-reasoning-overlay.cjs');
const {createDemo}=require('../composer-fixtures-v1.cjs');
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function buildB21Bridge({renderers,grade,input,baseCard}={}){
 if(!renderers||typeof renderers.mental!=='function'||typeof renderers.vertical!=='function'||
  typeof grade!=='function'||typeof input!=='function'||typeof baseCard!=='function')
  throw Error('G5_DEPENDENCIES_REQUIRED');
 const lesson=createDemo(),overlay=build();
 if(!lesson.ok||lesson.lesson.questions.length!==8||overlay.sourceLessonSha256!==lesson.report.lessonSha256)
  throw Error('G5_SOURCE_NOT_VERIFIED');
 const evidence=new Map(overlay.tasks.map(x=>[x.questionId,x.pedagogyTask]));
 const recs=new Map(lesson.report.qa.records.map(x=>[x.questionId,x]));
 const records=new Map();
 for(const q of lesson.lesson.questions){
  const record=recs.get(q.id),p=q.parameters,task=evidence.get(q.id);
  if(!record||!['LV1','LV2','LV3'].includes(record.levelId)||!Number.isSafeInteger(p.a)||
   !Number.isSafeInteger(p.b)||q.answerSpec.value!==p.a+p.b||p.a%10+p.b%10<10||
   !['math.mental','math.vertical'].includes(q.kind)||records.has(q.id)||
   (record.levelId==='LV3'&&!task))throw Error('G5_QUESTION_INVALID');
  const isVertical=record.levelId==='LV2';
  const old={id:q.id,valid:true,type:isVertical?'vertical':'mental',
   variantType:'mental',n1:p.a,n2:p.b,answer:String(q.answerSpec.value),
   pilotPrompt:null,theme:'blue',label:'Câu luyện tập',prompt:q.prompt};
  records.set(q.id,{source:q,legacy:old,levelId:record.levelId,task:task||null});
 }
 function lookup(id){const x=records.get(id);if(!x)throw Error('G5_UNKNOWN_ID');return x}
 function render(id){
  const x=lookup(id),q=x.legacy;
  if(x.levelId==='LV1')return {html:renderers.mental(q),interactive:true,fields:['answer']};
  if(x.levelId==='LV2')return {html:renderers.vertical(q),interactive:true,fields:['carry','tens','ones']};
  const t=x.task;
  const bridgeInput=input(q,q.id+':bridge',2,'data-ml-bridge="1" aria-label="Số cần tách để làm tròn chục"');
  const math=renderers.mental(q);
  const inside='<div class="ml-reasoning" data-ml-reasoning="1"><p>'+
   esc('Tính '+q.n1+' + '+q.n2+'. Viết số cần tách từ '+q.n2+
    ' để '+q.n1+' tròn chục, rồi tính tổng.')+'</p>'+
   '<label>Số cần tách '+bridgeInput+'</label>'+
   '<label>Kết quả '+math+'</label></div>';
  return {html:baseCard(q,inside,'ml-reasoning-card'),interactive:true,fields:['bridge','answer']};
 }
 function evaluate(id,answers){
  const x=lookup(id);
  if(!answers||typeof answers!=='object'||Array.isArray(answers))return {correct:false,complete:false};
  const fields=x.levelId==='LV1'?['answer']:x.levelId==='LV2'?['carry','tens','ones']:['bridge','answer'];
  const values={};
  for(const key of fields){
   const v=answers[key];
   if(typeof v!=='string'&&typeof v!=='number')return {correct:false,complete:false};
   const raw=String(v).trim();
   if(!/^[0-9]{1,3}$/.test(raw))return {correct:false,complete:false};
   values[key]=raw;
  }
  const read=key=>values[key]??'';
  const base=grade(x.legacy,read);
  const reasoning=x.levelId!=='LV3'||Number(values.bridge)===x.task.expectedBridge;
  return {correct:base&&reasoning,complete:true};
 }
 return Object.freeze({lessonId:'toan_b21',count:records.size,questionIds:[...records.keys()],
  render,evaluate,approval:'OWNER_APPROVED_TEST_SCOPE_ONLY',offlineOnly:true,noWrites:true,noStars:true});
}
module.exports={buildB21Bridge};
