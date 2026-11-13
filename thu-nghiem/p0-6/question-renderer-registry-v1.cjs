'use strict';
/** P0.6-D — pure presentation dispatcher. TEST/OFFLINE only.
 * Handlers are injected by the caller. No DOM, GAS, fetching, grading, saving, or stars.
 * Errors fail closed. Unknown kinds NEVER reuse a different renderer.
 */
const KIND=/^[a-z_]+\.[a-z_]+$/;
const isObj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fallback=(code,id)=>Object.freeze({ok:false,status:'UNSUPPORTED',code,
  questionId:typeof id==='string'?id:null,
  html:'<article class="ml-card ml-render-unavailable" role="status" aria-live="polite"><p>⚠ Dạng câu hỏi này chưa được hỗ trợ. Vui lòng chọn bài khác.</p></article>',
  interactive:false,graded:false});
function createRendererRegistry(entries){
 if(!isObj(entries))throw Error('RENDERER_ENTRIES_REQUIRED');
 const table=new Map();
 for(const [kind,fn] of Object.entries(entries)){
  if(!KIND.test(kind)||typeof fn!=='function')throw Error('RENDERER_INVALID_ENTRY');
  table.set(kind,fn);
 }
 function resolve(kind){
  return table.has(kind)?{ok:true,kind}:{ok:false,code:'RENDERER_NOT_REGISTERED',kind};
 }
 function render(question,context={}){
  const id=question&&question.id;
  if(!isObj(question)||typeof id!=='string'||!id||!KIND.test(question.kind||'')||
     !isObj(question.renderer)||question.renderer.component!==question.kind||
     typeof question.prompt!=='string'||!question.prompt.trim())
    return fallback('QUESTION_RENDER_CONTRACT_INVALID',id);
  const fn=table.get(question.kind);
  if(!fn)return fallback('RENDERER_NOT_REGISTERED',id);
  try{
   const value=fn(question,context);
   if(!isObj(value)||value.ok!==true||typeof value.html!=='string'||!value.html.trim()||
      typeof value.interactive!=='boolean')
    return fallback('RENDERER_RESULT_INVALID',id);
   // No implicit grading or interaction. Only explicitly injected and vetted handlers.
   return Object.freeze({ok:true,status:'RENDERED',code:'OK',kind:question.kind,questionId:id,
     html:value.html,interactive:value.interactive,graded:false});
  }catch(_){return fallback('RENDERER_EXCEPTION',id);}
 }
 return Object.freeze({list:()=>Array.from(table.keys()),resolve,render});
}
/** Read-only informational preview: NOT a substitute for an interactive school exercise. */
function renderReadonlyPreview(question){
 return {ok:true,interactive:false,html:'<article class="ml-card ml-preview-readonly"><p>'+
  esc(question.prompt)+'</p><small>Chỉ xem trước – chưa hỗ trợ nhập đáp án hoặc chấm bài.</small></article>'};
}
module.exports={createRendererRegistry,renderReadonlyPreview,escapeHtml:esc};
