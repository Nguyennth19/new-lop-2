/* LOP2 Universal Learning Template V1 – strictly offline/no-student-data LAB adapter.
 * Registered reference renderers are loaded unchanged from frozen be-hoc sources.
 * No learner scores, no Script Properties, no course/SGK approval, no answer key.
 */
(function(global){
 'use strict';
 const VERSION='LOP2_UNIVERSAL_LAB_V1_N1';
 const HARDEN=global.ULTLAB_HARDENING;
 const ROUTES=Object.freeze({
  D1:{family:'Tách–gộp và điền số',core:'G74Type1C2',kind:'D1'},
  D2:{family:'Đặt tính',core:'KLColumnV12',view:'KLColumnViewV12',kind:'COLUMN'},
  D3:{family:'Nối cặp',core:'KLMatchingV11',view:'KLMatchingViewV11'},
  D4:{family:'Trắc nghiệm',core:'KLChoiceV11',view:'KLChoiceViewV11'},
  D5:{family:'Hình học/Tangram',core:'KLGeometryTangramV11',view:'G76B5ATangramPlacement',kind:'TANGRAM'},
  D6:{family:'Sắp xếp',core:'KLDragSortV11',view:'KLDragSortViewV11'},
  D7:{family:'So sánh',core:'KLComparisonV11',view:'KLComparisonViewV11'},
  D8:{family:'Thước/đồng hồ',core:'KLMeasurementV11',view:'KLMeasurementViewV11'},
  D8A:{family:'Dung tích lít',core:'KLCapacityWeightV11',view:'KLCapacityWeightViewV12'},
  D8B:{family:'Cân khối lượng',core:'KLCapacityWeightV11',view:'KLCapacityWeightViewV11'},
  D9:{family:'Biểu đồ tranh',core:'KLPictographV11',view:'KLPictographViewV11'},
  D10:{family:'Giải toán lời văn',core:'KLWordUnificationV11',view:'KLWordUnificationAdapterV11',kind:'WORD'}
 });
 // Capability matrix lives in versioned LAB adapter, with explicit mode/skill grants.
 const deniedKeys=new Set([
  '__proto__','prototype','constructor','answer','answers','answerKey','correct','correctAnswer',
  'correctOptionId','correctOptionIds','correctStatementId','isCorrect','expected','expectedResult',
  'expectedDigits','expectedCarry','solution','solutionPrompt','teacherSolution','gradingKey','studentId',
  'score','stars','starCredit','privateVariant','privateAnswer','expectedValue','ownerApproved',
  'approvalState','privateKeyRef','releaseApproved','teacherSigned','ownerSigned'
 ]);
 const idPattern=/^[A-Za-z0-9_-]{3,90}$/;
 const doc=global.document;
 const el=(name,cls,text)=>{const node=doc.createElement(name);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);return node;};
 const ui={
  current:doc.getElementById('ulCurrent'),status:doc.getElementById('ulStatus'),
  title:doc.getElementById('ulTitle'),list:doc.getElementById('ulQuestions'),
  stage:doc.getElementById('ulStage'),select:doc.getElementById('ulPack'),
  file:doc.getElementById('ulJson'),spoken:doc.getElementById('ulSpeak'),
  grade:doc.getElementById('ulGrade'),level:doc.getElementById('ulLevel')
 };
 let pack=null,question=null,controller=null,activeSnapshot=null;
 let memory=Object.create(null),outputVersion=0,packTrusted=false,activeContentVersion=null;
 const FROZEN_RENDERER_SHA='1b69e277f8de6cb156f46a1d85af33bdad70c0ef';
 const N1_HOST_VERSION='N1_LAB_DRAFT_HOST_V1';
 const errors=[];
 // This local FNV64 tag only separates ephemeral draft keys. It is NOT a
 // cryptographic approval digest, server grade authorization or publisher CAS.
 function fallbackLocalVersion(data){
  const text=JSON.stringify(data);
  let h=14695981039346656037n;
  for(let i=0;i<text.length;i++){
   h=BigInt.asUintN(64,(h^BigInt(text.charCodeAt(i)))*1099511628211n);
  }
  return 'LAB_FNV64_'+h.toString(16).padStart(16,'0');
 }
 function draftIdentity(q=question){
  if(!pack||!q)return null;
  const route=ROUTES[q.rendererId];
  if(!route)return null;
  const rendererVersion=[
   FROZEN_RENDERER_SHA,N1_HOST_VERSION,route.core,route.view||'NO_VIEW',
   q.rendererId==='D5'?(q.publicVariant?.mode||'TANGRAM'):''
  ].filter(Boolean).join(':');
  const fields=[pack.packId,activeContentVersion,q.lessonId,q.questionId,rendererVersion];
  return {packId:fields[0],contentVersion:fields[1],
   lessonId:fields[2],questionId:fields[3],rendererVersion:fields[4],
   key:fields.map(x=>encodeURIComponent(String(x))).join('|')};
 }
 function activeFocus(q=question){
  const el=doc.activeElement;
  return q?.rendererId==='D2'&&ui.stage.contains(el)&&
   el?.dataset?.answer?.startsWith('result_')?el.dataset.answer:null;
 }
 function deepPublic(value,depth=0){
  if(depth>15)return false;
  if(value===null||typeof value==='string'||typeof value==='boolean')return true;
  if(typeof value==='number')return Number.isFinite(value);
  if(Array.isArray(value))return value.length<=150&&value.every(x=>deepPublic(x,depth+1));
  if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)return false;
  if(Object.keys(value).length>100)return false;
  return Object.keys(value).every(k=>!deniedKeys.has(k)&&!/(?:^|_)(?:answerKey|gradingKey|privateAnswer)$/i.test(k)&&deepPublic(value[k],depth+1));
 }
 function validate(candidate){
  if(!candidate||candidate.schemaVersion!=='LOP2_UNIVERSAL_LAB_PUBLIC_V1'||
    !idPattern.test(candidate.packId||'')||candidate.status!=='LAB_FIXTURE_ONLY_NO_GAS_RELEASE'||
    !candidate.lesson||candidate.lesson.subject!=='MATH'||candidate.lesson.studentRelease!==false||
    !idPattern.test(candidate.lesson.id||'')||
    !Array.isArray(candidate.questions)||candidate.questions.length<1||candidate.questions.length>50)
   return {ok:false,reason:'INVALID_LAB_PACKAGE'};
  if(!deepPublic(candidate))return {ok:false,reason:'PRIVATE_FIELD_OR_UNSAFE_NESTED_STRUCTURE'};
  if(candidate.contentVersion!==undefined&&!idPattern.test(candidate.contentVersion))
   return {ok:false,reason:'INVALID_CONTENT_VERSION'};
  const seen=new Set();
  for(const q of candidate.questions){
   if(!q||!idPattern.test(q.questionId||'')||seen.has(q.questionId)||
      !ROUTES[q.rendererId]||!idPattern.test(q.skillId||'')||
      !idPattern.test(q.questionType||'')||!['LV1','LV2','LV3'].includes(q.level)||
      !q.publicVariant||!deepPublic(q.publicVariant))return {ok:false,reason:'BAD_QUESTION_META'};
   if(q.lessonId!==candidate.lesson.id)return {ok:false,reason:'LESSON_ID_MISMATCH'};
   if(q.rendererId==='D10'&&q.publicVariant.calculationSteps!==1)
    return {ok:false,reason:'D10_ONE_STEP_ONLY'};
   if(!HARDEN?.grant(q))
     return {ok:false,reason:'SKILL_TYPE_POLICY_MISMATCH'};
   seen.add(q.questionId);
   if(!['DECORATIVE','CHOICE','EXACT_COUNT'].includes(q.visualIntent||'DECORATIVE'))
     return {ok:false,reason:'UNSUPPORTED_VISUAL_INTENT'};
   if(q.visualIntent==='EXACT_COUNT'&&!q.countUnit)return {ok:false,reason:'COUNT_UNIT_REQUIRED'};
   if(q.assetId!==null&&q.assetId!==undefined&&typeof q.assetId!=='string')
     return {ok:false,reason:'INVALID_ASSET_ID'};
   const core=global[ROUTES[q.rendererId].core];
   if(!core)return {ok:false,reason:'RENDERER_CORE_MISSING_'+q.rendererId};
   if(q.rendererId==='D1'){if(!core.validPublic(q.publicVariant))return {ok:false,reason:'INVALID_D1_PUBLIC'};}
   else if(q.rendererId==='D2'){const r=core.publicPlan(q.publicVariant);if(!r.ok)return {ok:false,reason:'INVALID_D2_'+r.reason};}
   else {const r=core.compile(q.publicVariant);if(!r.ok)return {ok:false,reason:'INVALID_'+q.rendererId+'_'+r.reason};}
   const assets=HARDEN.validateAssets(q);
   if(!assets.ok)return {ok:false,reason:assets.reason};
  }
  return {ok:true,count:candidate.questions.length};
 }
 function status(msg,kind='note'){ui.status.textContent=msg;ui.status.dataset.kind=kind;}
 function speechText(s){
  const source=String(s||'').slice(0,520);
  const normalized=global.G75V2?.normalize?.(source)||source;
  if(!('speechSynthesis' in global)||!global.SpeechSynthesisUtterance)
   return {ok:false,reason:'UNSUPPORTED_BROWSER'};
  global.speechSynthesis.cancel();
  const u=new global.SpeechSynthesisUtterance(normalized);u.lang='vi-VN';
  u.rate=0.9;global.speechSynthesis.speak(u);return {ok:true};
 }
 function onChange(s){
  if(!question)return;
  const id=draftIdentity(question);if(!id)return;
  activeSnapshot=JSON.parse(JSON.stringify(s));
  memory[id.key]={draft:activeSnapshot,focusInput:activeFocus(question)};
  ui.current.textContent='Đã thao tác (không phải điểm): '+Object.keys(memory).length+'/'+pack.questions.length;
 }
 function destroy(){
  if(question&&controller&&activeSnapshot&&typeof controller.snapshot==='function'){
   const id=draftIdentity(question);
   if(id)memory[id.key]={
    draft:JSON.parse(JSON.stringify(controller.snapshot())),
    focusInput:activeFocus(question)
   };
  }
  if(controller?.destroy)try{controller.destroy()}catch(e){errors.push(String(e))}
  controller=null;activeSnapshot=null;
  if(global.speechSynthesis?.cancel)global.speechSynthesis.cancel();}
 function wordHost(host,q){
  // D10 adapter is an enhancement of G6, never a replacement or a second card.
  const pv=q.publicVariant;
  const card=el('article','ml-card ml-word-card ml-word-structured');
  card.dataset.mlQCard=pv.questionId;
  const head=el('div','ml-word-head',pv.prompt);
  const summary=el('div','ml-word-summary','Tóm tắt: '+pv.summary);
  const graph=el('div','ml-graph-paper');
  const p=el('p','','Em chọn câu lời giải trước khi điền phép tính.');graph.append(p);
  // One-operation D10 only: keep the exact five G6 data-ml-field names,
  // but display them as the primary-school arithmetic equation and answer.
  const a11y={n1:'Số thứ nhất',op:'Dấu phép tính cộng hoặc trừ',
   n2:'Số thứ hai',sum:'Kết quả phép tính',answer:'Đáp số'};
  const inputs=Object.create(null);
  for(const f of global.KLWordUnificationV11.G6_FIELDS){
   const input=el('input','ul-word-input');
   input.setAttribute('data-ml-field',pv.questionId+':'+f);
   input.setAttribute('aria-label',a11y[f]||'Ô trả lời');
   input.autocomplete='off';input.inputMode=f==='op'?'text':'numeric';
   inputs[f]=input;
  }
  const equation=el('div','ul-word-equation');
  equation.setAttribute('role','group');equation.setAttribute('aria-label','Phép tính một bước');
  equation.append(inputs.n1,inputs.op,inputs.n2,el('span','ul-word-equals','='),inputs.sum);
  const answer=el('label','ul-word-answer');
  answer.append(el('span','ul-word-answer-caption','Đáp số: '),inputs.answer);
  if(pv.unit)answer.append(el('span','ul-word-unit',String(pv.unit)));
  graph.append(equation,answer);
  card.append(head,summary,graph);host.append(card);
  return card;
 }
 function mountRoute(q){
  const route=ROUTES[q.rendererId],core=global[route.core];
  let view=route.view?global[route.view]:null;
  const host=ui.stage;host.replaceChildren();
  let result;
  if(route.kind==='D1'){
   result=HARDEN.wrapD1(core,host,q.publicVariant,onChange);
  }else if(route.kind==='COLUMN'){
   const plan=core.publicPlan(q.publicVariant);
   if(!plan.ok)return plan;
   result=HARDEN.wrapD2(view,host,plan,onChange,
    (_plan)=>speechText('Em hãy đặt tính rồi tính theo thứ tự từ hàng đơn vị.'));
  }else if(route.kind==='WORD'){
   const plan=core.compile(q.publicVariant);if(!plan.ok)return plan;
   const card=wordHost(host,q);
   result=HARDEN.wrapD10(view,card,plan.plan,onChange,
    {speak:speechText,stop:()=>global.speechSynthesis?.cancel()});
  }else{
   const compiled=core.compile(q.publicVariant);if(!compiled.ok)return compiled;
   if(q.rendererId==='D5'&&compiled.plan.mode==='SHAPE_SELECT')
    view=global.KLGeometryTangramViewV11;
   const opts={onChange,resolveAsset:assetId=>HARDEN.resolveAsset(q,assetId),
    speechAdapter:{speak:speechText,stop:()=>global.speechSynthesis?.cancel()}};
   result=view?.mount(host,compiled.plan,opts)||{ok:false,reason:'VIEW_MISSING'};
  }
  if(result?.ok){
   // Normalize all 12 original routes to one LAB facade; never modify or
   // monkeypatch the frozen renderer handles in their own source files.
   const methods=['snapshot','restore','clear','destroy'];
   if(methods.some(fn=>typeof result[fn]!=='function'))
    return {ok:false,reason:'LAB_RENDER_HANDLE_INCOMPLETE'};
   controller=Object.freeze({ok:true,
    snapshot:()=>result.snapshot(),
    restore:(draft,focusInput)=>result.restore(draft,focusInput),
    clear:()=>result.clear(),
    destroy:()=>result.destroy()
   });
   const id=draftIdentity(q);
   const saved=id&&memory[id.key];
   if(saved){
    const restored=controller.restore(saved.draft,saved.focusInput);
    if(!restored?.ok)return {ok:false,reason:'INVALID_SAVED_DRAFT'};
    activeSnapshot=controller.snapshot();
   }
   HARDEN.watchImageErrors(host,reason=>status('Ảnh chưa tải được: '+reason+
     '. Không tự dùng ảnh thay thế sai ngữ nghĩa.','error'));
  }
  return result||{ok:false,reason:'MOUNT_FAILED'};
 }
 function openQuestion(id){
  const q=pack?.questions.find(x=>x.questionId===id);if(!q)return {ok:false,reason:'NO_QUESTION'};
  destroy();question=q;ui.title.textContent=q.rendererId+' · '+ROUTES[q.rendererId].family;
  const ret=mountRoute(q);
  if(!ret.ok){status('Bị chặn: '+(ret.reason||ret.code||'MOUNT_FAILED'),'error');return ret;}
  ui.list.querySelectorAll('[data-question]').forEach(b=>b.classList.toggle('active',b.dataset.question===id));
  status('LAB / '+pack.packId+' / '+q.level+' · renderer '+q.rendererId+
   ' · KHÔNG phát hành và không chấm phía trình duyệt');
  const hasLabGradeGrant=packTrusted&&global.__ULTLAB_GRADE_CAPABILITIES__?.[q.rendererId]?.enabled===true;
  ui.grade.disabled=global.location.protocol==='file:'||!global.__ULTLAB_TRUSTED_ENDPOINT__||!hasLabGradeGrant;
  ui.grade.title=!hasLabGradeGrant?'Dạng này chưa có hợp đồng chấm LAB qua máy chủ':
    ui.grade.disabled?'Chưa nối máy chủ chấm thử riêng của LAB':'Gửi bản nháp tới trusted LAB server';
  return {ok:true,rendererId:q.rendererId,questionId:q.questionId};
 }
 function drawList(){
  ui.list.replaceChildren();let visible=0;
  for(const q of pack.questions){
   if(ui.level.value!=='ALL'&&ui.level.value!==q.level)continue;
   const b=el('button','ul-question',q.rendererId+' · '+ROUTES[q.rendererId].family);
   b.type='button';b.dataset.question=q.questionId;b.setAttribute('aria-label',q.rendererId+' '+ROUTES[q.rendererId].family);
   b.onclick=()=>openQuestion(q.questionId);ui.list.append(b);visible++;
  }
  return visible;
 }
 function setData(data){
  const check=validate(data);if(!check.ok){status('JSON bị từ chối: '+check.reason,'error');return check;}
  destroy();packTrusted=(data===global.__ULTLAB_PACKS__?.A||data===global.__ULTLAB_PACKS__?.B);
  pack=JSON.parse(JSON.stringify(data));question=null;
  activeContentVersion=pack.contentVersion||fallbackLocalVersion(pack);
  memory=Object.create(null);outputVersion++;
  ui.current.textContent='0/'+pack.questions.length+' câu đã thao tác (không phải điểm)';
  ui.level.value='ALL';drawList();
  const r=openQuestion(pack.questions[0].questionId);
  if(r.ok)status('Đã nạp '+pack.packId+' — '+check.count+
    ' câu; bản nháp trước đó đã được xóa theo chính sách khi đổi gói. TEST LAB, không phải bài SGK được duyệt.');
  return r.ok?{ok:true,packId:pack.packId,count:check.count,version:outputVersion}:r;
 }
 async function grade(){
  if(!packTrusted||!question||global.__ULTLAB_GRADE_CAPABILITIES__?.[question.rendererId]?.enabled!==true)
   return {status:'NOT_AUTHORIZED',reason:'PACK_OR_ROUTE_NOT_APPROVED_FOR_LAB_GRADING'};
  if(!global.__ULTLAB_TRUSTED_ENDPOINT__||global.location.protocol==='file:')
   return {ok:false,reason:'TRUSTED_SERVER_UNAVAILABLE'};
  if(!global.__ULTLAB_TRUSTED_ENDPOINT__.startsWith('/api/lab-grade'))
   return {ok:false,reason:'UNTRUSTED_GRADE_ENDPOINT'};
  const submission=activeSnapshot||controller?.snapshot?.()||{};
  const response=await global.fetch(global.__ULTLAB_TRUSTED_ENDPOINT__,{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({packId:pack.packId,questionId:question.questionId,submission})
  });
  if(!response.ok)return {ok:false,reason:'TRUSTED_SERVER_REJECTED'};
  const data=await response.json();
  status(data.status==='CHECKED'?'Kết quả kiểm tra máy chủ LAB: '+(data.pass?'Đạt':'Chưa đạt'):
   data.status==='INCOMPLETE'?'Chưa hoàn thành tất cả ô cần trả lời.':
   'Máy chủ LAB không chấm: '+(data.reason||'CHƯA CẤP QUYỀN'),'note');
  // No score/stars/progress persistence and no answer key in response.
  return data;
 }
 ui.select.addEventListener('change',()=>{
  const chosen=global.__ULTLAB_PACKS__?.[ui.select.value];
  if(chosen)setData(chosen);
 });
 ui.level.addEventListener('change',()=>{
  const count=drawList();if(!count){status('Không có câu hỏi ở cấp độ này');return}
  const first=ui.list.querySelector('[data-question]');
  if(first)openQuestion(first.dataset.question);
 });
 ui.file.addEventListener('change',async()=>{
  const file=ui.file.files?.[0];if(!file)return;
  if(file.size>1000000){status('JSON vượt giới hạn 1 MB','error');return}
  try{const data=JSON.parse(await file.text());setData(data)}
  catch(e){status('Tệp JSON không hợp lệ','error')}
  ui.file.value='';
 });
 ui.grade.addEventListener('click',()=>grade().catch(e=>status('Lỗi máy chủ LAB: '+String(e),'error')));
 ui.spoken.addEventListener('click',()=>speechText(question?.publicVariant?.prompt?.text||
  question?.publicVariant?.prompt||ui.title.textContent));
 global.ULTLAB=Object.freeze({VERSION,ROUTES,validate,setData,openQuestion,grade,
  getState:()=>({packId:pack?.packId||null,questionId:question?.questionId||null,
   rendererId:question?.rendererId||null,trustedData:packTrusted,stageChildren:ui.stage.children.length,
   errors:[...errors],changeCount:Object.keys(memory).length}),
  getDraft:()=>activeSnapshot?JSON.parse(JSON.stringify(activeSnapshot)):null,
  getDraftIdentity:()=>draftIdentity(),
  getHandleContract:()=>controller?{
   ok:true,snapshot:typeof controller.snapshot==='function',
   restore:typeof controller.restore==='function',
   clear:typeof controller.clear==='function',
   destroy:typeof controller.destroy==='function'
  }:null,
  getCapabilityMatrix:()=>HARDEN.CAPABILITIES,
  clearCurrentDraft:()=>{if(!controller)return {ok:false,reason:'NO_ACTIVE_HANDLE'};
   const cleared=controller.clear?.()||{ok:false,reason:'CLEAR_UNSUPPORTED'};
   if(cleared.ok){const id=draftIdentity(question);if(id)delete memory[id.key];activeSnapshot=null;}
   return cleared;}
 });
 if(global.__ULTLAB_PACKS__?.A)setData(global.__ULTLAB_PACKS__.A);
})(window);
