/* G76-B.3 scoped mental input preview, no keys/teacher feedback/grade/stars.
 * Isolated view required because 12 pinned renderer families have NO equivalent mode.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.G76B3MentalInputView=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const fail=(reason)=>({ok:false,reason});
 function mount(host,plans,options={}){
  if(!host||!host.ownerDocument||!Array.isArray(plans)||plans.length<1||plans.length>30||
     plans.some(p=>p?.schemaVersion!=='g76b3.mental-number-input.v1'||
      p.typeId!=='MENTAL_INPUT_TEST_EXTENSION'||p.gradingEnabled!==false||
      p.serverGradingConnected!==false||p.releaseReady!==false||
      p.answerKeyIncluded!==false||p.input?.kind!=='NUMBER_INPUT'||
      !/^[A-Za-z0-9_-]{8,100}$/.test(p.questionId||'')||
      !Number.isInteger(p.operands?.a)||!Number.isInteger(p.operands?.b)||
      p.operands.operator!=='+'||
      p.prompt!=='Tính: '+p.operands.a+' + '+p.operands.b+' = ?'))
    return fail('UNTRUSTED_PUBLIC_MENTAL_PLAN');
  const doc=host.ownerDocument,shell=doc.createElement('section'),inputs=new Map();
  shell.className='g76b3-mental-grid';shell.dataset.mentalTest='true';
  let destroyed=false;
  function snapshot(){return Object.fromEntries([...inputs].map(([id,input])=>[id,input.value]));}
  for(let i=0;i<plans.length;i++){
   const p=plans[i];
   const card=doc.createElement('article');card.className='g76b3-mental-card';
   card.dataset.mentalQuestion=p.questionId;
   const cap=doc.createElement('span');cap.className='g76b3-mental-cap';
   cap.textContent='Câu '+(i+1)+' · Tính nhẩm';
   const heading=doc.createElement('div');heading.className='g76b3-mental-equation';
   const op=doc.createElement('span');op.textContent=p.operands.a+' + '+p.operands.b+' =';
   const input=doc.createElement('input');input.type='text';input.inputMode='numeric';
   input.maxLength=3;input.autocomplete='off';input.setAttribute('aria-label','Kết quả phép tính '+p.operands.a+' cộng '+p.operands.b);
   input.dataset.mentalInput=p.questionId;
   const status=doc.createElement('div');status.className='g76b3-mental-state';
   status.setAttribute('aria-live','polite');
   status.textContent='Em hãy tự nhập kết quả. Chưa chấm bài.';
   input.addEventListener('input',()=>{
    if(destroyed)return;
    const cleaned=input.value.replace(/[^0-9]/g,'').slice(0,3);
    if(input.value!==cleaned)input.value=cleaned;
    status.textContent=cleaned?'Đã ghi câu trả lời (chỉ ở trang TEST, chưa chấm).':'Em hãy tự nhập kết quả. Chưa chấm bài.';
    if(typeof options.onChange==='function')options.onChange(snapshot());
   });
   const clear=doc.createElement('button');clear.type='button';clear.textContent='↺ Làm lại';
   clear.className='g76b3-mental-clear';
   clear.addEventListener('click',()=>{if(destroyed)return;input.value='';
    status.textContent='Em hãy tự nhập kết quả. Chưa chấm bài.';
    if(typeof options.onChange==='function')options.onChange(snapshot());input.focus();});
   heading.append(op,input);card.append(cap,heading,status,clear);
   shell.append(card);inputs.set(p.questionId,input);
  }
  host.append(shell);
  return Object.freeze({ok:true,snapshot,
   clear(){for(const input of inputs.values()){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));}},
   destroy(){destroyed=true;shell.remove();}});
 }
 return Object.freeze({mount});
});
