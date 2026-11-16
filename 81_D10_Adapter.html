/* G7.4 Word Problem V1.1 – progressive enhancement of already rendered G6 card.
 * Does not create/replace another word problem renderer; no server calls or grade.
 * The adapter operates only within the provided card, preserving G6 input elements.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLWordUnificationAdapterV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function mount(card,plan,options={}){
  if(!card||!card.ownerDocument||!plan||plan.schemaVersion!=='g74-word-unification-v11'||
    typeof KLWordUnificationV11==='undefined')return {ok:false,reason:'INVALID_CARD_OR_CORE'};
  if(card.getAttribute('data-ml-q-card')!==plan.questionId||
     !card.classList.contains('ml-word-card')||!card.classList.contains('ml-word-structured'))
   return {ok:false,reason:'NOT_G6_WORD_CARD'};
  const g6Body=card.querySelector('.ml-graph-paper');
  const solutionLine=g6Body&&g6Body.querySelector('p');
  if(!g6Body||!solutionLine||!KLWordUnificationV11.G6_FIELDS.every(key=>
    card.querySelector('[data-ml-field="'+plan.questionId+':'+key+'"]')))
   return {ok:false,reason:'G6_FIELDS_MISSING'};
  if(card.querySelector('[data-g74-word-unification]'))return {ok:false,reason:'ALREADY_MOUNTED'};
  const doc=card.ownerDocument,session=KLWordUnificationV11.session(plan);
  const panel=doc.createElement('section');panel.className='g74-word-scaffold';
  panel.setAttribute('data-g74-word-unification',plan.questionId);
  const heading=doc.createElement('h5');heading.className='g74-word-scaffold-title';
  heading.textContent=plan.mode==='SELECT_STATEMENT'?'Bước 1 – Em chọn câu lời giải thích hợp':'Bước 1 – Em đọc câu lời giải';
  const choices=doc.createElement('div');choices.className='g74-word-choices';
  const state=doc.createElement('p');state.className='g74-word-status';
  state.setAttribute('aria-live','polite');panel.append(heading,choices,state);
  let destroyed=false;
  const originalText=solutionLine.textContent;
  const voice=options.speechAdapter;
  function speak(text){
   if(!plan.readAloud||!voice||typeof voice.speak!=='function')return;
   try{voice.speak(text,'vi-VN')}catch(_){}
  }
  // Hide G6's prefilled solution sentence in selection mode to preserve learning activity.
  // Restore precisely on destroy; do not remove or reconstruct existing inputs.
  if(plan.mode==='SELECT_STATEMENT')solutionLine.textContent='Bước 2 – Em điền phép tính vào các ô bên dưới.';
  const buttons=new Map();
  if(plan.mode==='SELECT_STATEMENT'){
   for(const statement of plan.statementOptions){
    const wrapper=doc.createElement('div');wrapper.className='g74-word-option';
    const btn=doc.createElement('button');btn.type='button';btn.className='g74-word-option-select';
    btn.textContent=statement.text;btn.setAttribute('aria-pressed','false');
    btn.addEventListener('click',()=>{if(destroyed)return;const r=session.selectStatement(statement.id);
     if(r.ok){refresh();if(typeof options.onChange==='function')options.onChange(session.snapshot());}});
    wrapper.append(btn);buttons.set(statement.id,btn);
    if(plan.readAloud&&voice){
     const sound=doc.createElement('button');sound.type='button';sound.className='g74-word-speak';
     sound.textContent='🔊';sound.setAttribute('aria-label','Đọc câu lời giải: '+statement.text);
     sound.addEventListener('click',()=>speak(statement.text));wrapper.append(sound);
    }
    choices.append(wrapper);
   }
  }else{
   const text=doc.createElement('p');text.className='g74-word-guided-note';
   text.textContent='Em xem câu lời giải ở bên dưới, rồi điền phép tính và đáp số.';
   choices.append(text);
  }
  g6Body.insertBefore(panel,solutionLine);
  function refresh(){
   if(destroyed)return;
   const s=session.snapshot();
   for(const [key,b] of buttons){
    b.setAttribute('aria-pressed',String(s.selectedStatementId===key));
    b.classList.toggle('selected',s.selectedStatementId===key);
   }
   state.textContent=plan.mode==='SELECT_STATEMENT'?
    (s.selectedStatementId?'Đã chọn câu lời giải. Bước 2: điền phép tính. Bước 3: điền đáp số.':'Chưa chọn câu lời giải.'):
    'Bước 2: điền phép tính. Bước 3: điền đáp số.';
  }
  refresh();
  // Only the scaffold state is managed here. All G6 inputs remain under their existing
  // data-ml-field names and the app's current handlers continue to own them.
  return Object.freeze({ok:true,snapshot:()=>session.snapshot(),
   restore(d){const r=session.restore(d);if(r.ok){refresh();if(typeof options.onChange==='function')options.onChange(session.snapshot());}return r;},
   clear(){const r=session.clear();refresh();if(typeof options.onChange==='function')options.onChange(session.snapshot());return r;},
   destroy(){if(destroyed)return;destroyed=true;
    if(voice&&typeof voice.stop==='function')try{voice.stop()}catch(_){}
    solutionLine.textContent=originalText;panel.remove();}
  });
 }
 return Object.freeze({mount});
});
