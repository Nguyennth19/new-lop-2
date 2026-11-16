/* G7.4 Pictograph V1.1 TEST view. Stable DOM, accessible tap-to-count.
 * Host can provide speechAdapter.speak(text,locale) and resolveAsset(assetId).
 * Never marks mathematics answers correct or writes student data.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLPictographViewV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function mount(host,plan,opts={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-pictograph-v11'||
     typeof KLPictographV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,engine=KLPictographV11.session(plan);
  const root=doc.createElement('section');root.className='g74-picto-v11';root.dataset.g74PictographV11=plan.exerciseId;
  const title=doc.createElement('h3');title.className='g74-picto-heading';
  title.textContent=plan.prompt||'Chạm vào từng hình để đếm.';
  const tip=doc.createElement('p');tip.className='g74-picto-tip';
  tip.textContent='Chạm hình để đếm, chạm lại để bỏ chọn. Các câu trả lời chưa được chấm.';
  const board=doc.createElement('div');board.className='g74-picto-board';
  const questions=doc.createElement('div');questions.className='g74-picto-questions';
  const status=doc.createElement('p');status.className='g74-picto-status';status.setAttribute('aria-live','polite');
  root.append(title,tip,status,board,questions);host.append(root);
  let disposed=false;
  const buttons=new Map(),counts=new Map(),answers=new Map();
  const key=(row,i)=>row+':'+i;
  function notify(){refresh();if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());}
  function speak(ordinal){
   if(!opts.speechAdapter||typeof opts.speechAdapter.speak!=='function')return;
   // Only a fresh counted tap announces its ordinal; no overlapping audio contract is promised.
   try{opts.speechAdapter.speak(String(ordinal),'vi-VN');}catch(_){}
  }
  for(const row of plan.rows){
   const section=doc.createElement('section');section.className='g74-picto-row';
   const label=doc.createElement('strong');label.className='g74-picto-label';label.textContent=row.label;
   const symbols=doc.createElement('div');symbols.className='g74-picto-items';
   const count=doc.createElement('span');count.className='g74-picto-count';counts.set(row.id,count);
   for(let index=0;index<row.itemCount;index++){
    const btn=doc.createElement('button');btn.type='button';btn.className='g74-picto-item';
    btn.dataset.pictoRow=row.id;btn.dataset.pictoIndex=String(index);
    btn.setAttribute('aria-label',row.label+' hình số '+(index+1));btn.setAttribute('aria-pressed','false');
    const picture=doc.createElement('span');picture.className='g74-picto-art';
    if(row.contentType==='ASSET'){
     let asset=null;
     try{asset=typeof opts.resolveAsset==='function'?opts.resolveAsset(row.assetId):null;}catch(_){}
     if(asset&&typeof asset.url==='string'&&/^https:\/\//.test(asset.url)){
      const img=doc.createElement('img');img.src=asset.url;img.alt='';img.loading='lazy';picture.append(img);
     }else{picture.textContent=row.alt||'○';}
    }else picture.textContent=row.symbol;
    const badge=doc.createElement('span');badge.className='g74-picto-badge';badge.setAttribute('aria-hidden','true');
    btn.append(picture,badge);
    btn.addEventListener('click',()=>{
     if(disposed)return;
     const result=engine.tap(row.id,index);
     if(result.ok){notify();if(result.countedNow)speak(result.ordinal);}
    });
    symbols.append(btn);buttons.set(key(row.id,index),{button:btn,badge});
   }
   section.append(label,symbols,count);
   if(plan.mode==='PRACTICE'&&plan.demoRowId===row.id){
    const demo=doc.createElement('button');demo.type='button';demo.className='g74-picto-demo';demo.textContent='✨ Đếm mẫu hàng này';
    demo.addEventListener('click',()=>{if(disposed)return;const result=engine.demoCount(row.id);if(result.ok)notify();});
    section.append(demo);
   }
   board.append(section);
  }
  for(const q of plan.questions){
   const line=doc.createElement('label');line.className='g74-picto-question';
   const heading=doc.createElement('span');heading.textContent=q.prompt;
   const input=doc.createElement('input');input.type='text';input.inputMode='numeric';
   input.maxLength=3;input.autocomplete='off';input.setAttribute('aria-label',q.prompt);
   input.addEventListener('input',()=>{
    if(disposed)return;
    const prev=engine.snapshot().enteredAnswers[q.id]||'';
    const result=engine.setAnswer(q.id,input.value);
    if(!result.ok)input.value=prev;
    else if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());
   });
   line.append(heading,input);questions.append(line);answers.set(q.id,input);
  }
  function refresh(){
   if(disposed)return;
   const state=engine.snapshot();
   for(const row of plan.rows){
    const selected=state.countedIndices[row.id];
    const ordinal=new Map(selected.map((index,idx)=>[index,idx+1]));
    for(let i=0;i<row.itemCount;i++){
     const n=buttons.get(key(row.id,i));const order=ordinal.get(i);
     n.button.classList.toggle('counted',order!==undefined);
     n.button.setAttribute('aria-pressed',String(order!==undefined));
     n.badge.textContent=order===undefined?'':String(order);
     n.button.setAttribute('aria-label',row.label+' hình số '+(i+1)+(order!==undefined?', đã đếm thứ '+order:''));
    }
    counts.get(row.id).textContent='Đã đếm: '+selected.length;
   }
   for(const [id,input] of answers){
    const next=state.enteredAnswers[id]||'';
    if(input.value!==next)input.value=next;
   }
   status.textContent='Đây là biểu đồ tranh mô phỏng; chưa đánh giá đúng/sai.';
  }
  refresh();
  return Object.freeze({
   ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok)notify();return r;},
   clear(){const r=engine.clear();if(r.ok)notify();return r;},
   destroy(){if(disposed)return;disposed=true;
    if(opts.speechAdapter&&typeof opts.speechAdapter.stop==='function')try{opts.speechAdapter.stop();}catch(_){}
    root.remove();}
  });
 }
 return Object.freeze({mount});
});
