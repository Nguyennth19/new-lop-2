/* G7.4 Choice V1.1 – scoped TEST reference, no server grading or student writes. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLChoiceViewV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function mount(host,plan,options={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-choice-v11'||
     typeof KLChoiceV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,win=doc.defaultView,engine=KLChoiceV11.session(plan);
  const speech=options.speechAdapter||null;
  let destroyed=false;
  const shell=doc.createElement('section');shell.className='g74-choice-v11';
  shell.dataset.g74ChoiceV11=plan.questionId;
  const head=doc.createElement('div');head.className='g74-choice-head';
  const prompt=doc.createElement('div');prompt.className='g74-choice-prompt';
  const choices=doc.createElement('div');choices.className='g74-choice-options';
  const state=doc.createElement('p');state.className='g74-choice-state';state.setAttribute('aria-live','polite');
  function content(target,content){
   const title=doc.createElement('span');title.textContent=content.text;title.className='g74-choice-text';target.append(title);
   if(content.assetId){
    let asset=null;
    try{asset=typeof options.resolveAsset==='function'?options.resolveAsset(content.assetId):null}catch(_){}
    if(asset&&typeof asset.url==='string'&&/^https:\/\//.test(asset.url)){
     const img=doc.createElement('img');img.src=asset.url;img.alt=content.alt||content.text||'Hình minh họa';img.loading='lazy';img.className='g74-choice-asset';target.append(img);
    }else{
     const fallback=doc.createElement('span');fallback.className='g74-choice-fallback';
     fallback.textContent=content.alt||'[Hình minh họa]';target.append(fallback);
    }
   }
  }
  function speak(text){
   if(!plan.speechEnabled||!speech||typeof speech.speak!=='function')return;
   speech.speak(text||'','vi-VN');
  }
  content(prompt,plan.prompt);
  head.append(prompt);
  if(plan.speechEnabled&&speech){
   const btn=doc.createElement('button');btn.type='button';btn.className='g74-choice-speak';
   btn.textContent='🔊 Đọc câu hỏi';btn.setAttribute('aria-label','Đọc câu hỏi');
   btn.addEventListener('click',()=>speak(plan.speechText||plan.prompt.text));head.append(btn);
  }
  shell.append(head,choices,state);host.append(shell);
  const buttons=new Map();
  function refresh(){
   const chosen=new Set(engine.snapshot().selectedOptionIds);
   for(const [id,b] of buttons){const selected=chosen.has(id);
    b.classList.toggle('selected',selected);
    b.setAttribute('aria-pressed',String(selected));
   }
   state.textContent='Đã chọn '+chosen.size+' đáp án';
  }
  for(const option of plan.options){
   const wrap=doc.createElement('div');wrap.className='g74-choice-option';
   const btn=doc.createElement('button');btn.type='button';btn.className='g74-choice-answer';
   btn.dataset.choiceId=option.id;btn.setAttribute('aria-label',option.content.text||option.content.alt||option.id);
   content(btn,option.content);
   btn.addEventListener('click',()=>{
    if(destroyed)return;
    const result=engine.select(option.id);
    if(result.ok){refresh();if(typeof options.onChange==='function')options.onChange(engine.snapshot());}
   });
   wrap.append(btn);buttons.set(option.id,btn);
   if(plan.speechEnabled&&speech){
    const sound=doc.createElement('button');sound.type='button';sound.className='g74-choice-speak small';
    sound.textContent='🔊';sound.setAttribute('aria-label','Đọc đáp án '+(option.content.text||option.content.alt||option.id));
    sound.addEventListener('click',()=>speak(option.speechText||option.content.text||option.content.alt));
    wrap.append(sound);
   }
   choices.append(wrap);
  }
  refresh();
  return Object.freeze({
   ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok){refresh();if(typeof options.onChange==='function')options.onChange(engine.snapshot());}return r;},
   clear(){const r=engine.clear();refresh();if(typeof options.onChange==='function')options.onChange(engine.snapshot());return r;},
   destroy(){if(destroyed)return;destroyed=true;if(speech&&typeof speech.stop==='function')speech.stop();shell.remove();}
  });
 }
 return Object.freeze({mount});
});
