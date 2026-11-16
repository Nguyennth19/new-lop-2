'use strict';
/* G7.4 V1.2: original Type 2-inspired layout adapted to variable operands.
 * Browser-only rendering, NOT a grader. Original archive left immutable.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KLColumnViewV12=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const PLACES={ones:'Đơn vị',tens:'Chục',hundreds:'Trăm',thousands:'Nghìn'};
 const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e};
 function mount(container,plans,callbacks={}){
  if(!container||!Array.isArray(plans)||plans.length<1||plans.some(p=>!p?.ok||p.schemaVersion!=='column-calc-reference-v12-public'))return {ok:false,reason:'INVALID_PUBLIC_PLANS'};
  const state=plans.map(()=>({digits:{},transitions:{},active:'result_ones'}));
  container.replaceChildren();const cards=el('div','kl-col-v12-grid');container.append(cards);
  function collect(i){
    const s=state[i],plan=plans[i],out={variantId:plan.variantId};
    for(const v of plan.answerSlots)out[v.id]=s.digits[v.id]??'';
    for(const v of plan.transitionSlots)out[v.id]=Boolean(s.transitions[v.id]);
    return out;
  }
  function makeCard(plan,index){
   const s=state[index],n=plan.columns,order=plan.displayOrder,accent=index%2===0?'sky':'indigo';
   const outer=el('article','kl-col-v12-card '+accent);
   outer.dataset.variantId=plan.variantId;outer.dataset.columns=String(n);outer.dataset.operation=plan.operation;
   const head=el('div','kl-col-v12-head');
   head.append(el('span','kl-col-v12-cap','Câu '+(index+1)+' • '+(plan.profile==='PV100'?'Phạm vi 100':'Phạm vi 1000')));
   const read=el('button','kl-col-v12-read','🔊 Nghe');read.type='button';read.setAttribute('aria-label','Nghe hướng dẫn phép tính');
   read.onclick=()=>{if(typeof callbacks.onSpeak==='function')callbacks.onSpeak(plan);else if(typeof speechSynthesis!=='undefined'){
     const content=plan.a.slice().reverse().map(x=>x.digit).join('')+' '+(plan.operation==='ADD'?'cộng':'trừ')+' '+plan.b.slice().reverse().map(x=>x.digit).join('');
     const u=new SpeechSynthesisUtterance(content);u.lang='vi-VN';speechSynthesis.speak(u);
   }};
   head.append(read);outer.append(head);
   const grid=el('div','kl-col-v12-number-grid');grid.style.setProperty('--math-cols',String(n+1));
   grid.setAttribute('role','group');grid.setAttribute('aria-label',plan.operation==='ADD'?'Đặt tính cộng':'Đặt tính trừ');
   grid.append(el('span',''));for(const p of order)grid.append(el('span','kl-col-v12-col-title',PLACES[p]));
   grid.append(el('span','kl-col-v12-carry-title',plan.operation==='ADD'?'Nhớ:':'Mượn:'));
   for(const place of order){
     const slot=plan.transitionSlots.find(x=>x.place===place);
     if(!slot){grid.append(el('span','kl-col-v12-transition-blank',''));continue}
     const btn=el('button','kl-col-v12-transition',plan.operation==='ADD'?'nhớ':'mượn');
     btn.type='button';btn.dataset.transition=slot.id;btn.dataset.place=place;
     btn.setAttribute('aria-pressed','false');btn.setAttribute('aria-label',(plan.operation==='ADD'?'Bật hoặc tắt ô nhớ hàng ':'Bật hoặc tắt ô mượn hàng ')+PLACES[place].toLowerCase());
     const show=()=>{const yes=Boolean(s.transitions[slot.id]);btn.textContent=yes?'+1':(plan.operation==='ADD'?'nhớ':'mượn');btn.setAttribute('aria-pressed',String(yes));btn.classList.toggle('selected',yes)};
     btn.onclick=()=>{s.transitions[slot.id]=!s.transitions[slot.id];show();if(typeof callbacks.onChange==='function')callbacks.onChange(index,collect(index))};
     show();grid.append(btn);
   }
   for(const [marker,key] of [['','a'],[plan.operation==='ADD'?'+':'−','b']]){
     grid.append(el('span','kl-col-v12-sign',marker));
     const high=Math.max(0,...plan[key].filter(x=>x.digit!==0).map(x=>plan.inputOrder.indexOf(x.place)));
     for(const place of order){const item=plan[key].find(x=>x.place===place);const index=plan.inputOrder.indexOf(place);
       grid.append(el('span','kl-col-v12-digit',index>high?'':item.digit));}
   }
   grid.append(el('div','kl-col-v12-rule'),el('span',''));
   const activate=field=>{s.active=field.dataset.answer;grid.querySelectorAll('.kl-col-v12-answer').forEach(x=>x.classList.toggle('active',x===field))};
   for(const place of order){
     const id='result_'+place,inp=el('input','kl-col-v12-answer');
     inp.type='text';inp.inputMode='numeric';inp.autocomplete='off';inp.maxLength=1;
     inp.dataset.answer=id;inp.dataset.place=place;inp.placeholder=place==='hundreds'?'Trăm':place==='tens'?'Chục':'ĐV';
     inp.setAttribute('aria-label','Chữ số hàng '+PLACES[place].toLowerCase());
     inp.value=s.digits[id]??'';
     inp.onfocus=()=>activate(inp);
     inp.oninput=()=>{
       const raw=inp.value.replace(/[^0-9]/g,'').slice(-1);inp.value=raw;s.digits[id]=raw;
       if(raw){const idx=plan.inputOrder.indexOf(place),next=plan.inputOrder[idx+1];if(next){const target=grid.querySelector('[data-answer="result_'+next+'"]');if(target){target.focus();activate(target)}}}
       if(typeof callbacks.onChange==='function')callbacks.onChange(index,collect(index));
     };
     inp.onkeydown=e=>{if(e.key==='ArrowLeft'){e.preventDefault();const idx=plan.inputOrder.indexOf(place);const next=plan.inputOrder[idx+1];if(next)grid.querySelector('[data-answer="result_'+next+'"]')?.focus();}
       if(e.key==='ArrowRight'){e.preventDefault();const idx=plan.inputOrder.indexOf(place);const prev=plan.inputOrder[idx-1];if(prev){const target=grid.querySelector('[data-answer="result_'+prev+'"]');if(target){target.focus();activate(target)}}}};
     grid.append(inp);
   }
   outer.append(grid);
   outer.append(el('div','kl-col-v12-note',plan.carryPolicy==='REQUIRED_ASSESSED'?'Ô nhớ/mượn tham gia đánh giá theo chính sách bài học.':'Ô nhớ/mượn chỉ là gợi ý thao tác, không bắt buộc khi chấm.'));
   const controls=el('div','kl-col-v12-controls');
   const reset=el('button','kl-col-v12-reset','↺ Làm lại');reset.type='button';reset.onclick=()=>{
     s.digits={};s.transitions={};outer.querySelectorAll('.kl-col-v12-answer').forEach(x=>x.value='');
     outer.querySelectorAll('.kl-col-v12-transition').forEach(x=>{x.classList.remove('selected');x.textContent=plan.operation==='ADD'?'nhớ':'mượn';x.setAttribute('aria-pressed','false')});
     outer.querySelector('[data-answer="result_ones"]')?.focus();if(typeof callbacks.onChange==='function')callbacks.onChange(index,collect(index));
   };controls.append(reset);
   const send=el('button','kl-col-v12-send','Ghi nhận câu trả lời');send.type='button';send.onclick=()=>{
     if(typeof callbacks.onSubmit==='function')callbacks.onSubmit(index,collect(index));
     else outer.querySelector('.kl-col-v12-status').textContent='Đã ghi nhận trên TEST (không chấm hoặc gửi dữ liệu).';
   };controls.append(send);outer.append(controls);
   const status=el('div','kl-col-v12-status');status.setAttribute('role','status');outer.append(status);
   cards.append(outer);
  }
  for(let i=0;i<plans.length;i++)makeCard(plans[i],i);
  cards.querySelector('[data-answer="result_ones"]')?.focus();
  return {ok:true,collect,cards,states:state,
    focus:(i,place)=>cards.children[i]?.querySelector('[data-answer="result_'+place+'"]')?.focus(),
    reset:()=>{for(let i=0;i<plans.length;i++)cards.children[i].querySelector('.kl-col-v12-reset').click();}};
 }
 return Object.freeze({mount});
});
