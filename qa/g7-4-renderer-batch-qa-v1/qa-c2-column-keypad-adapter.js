'use strict';
/* QA-C2 native-input compatibility keypad: use existing V1.2 inputs, never replace arithmetic view.
   Key events trigger the original renderer's input/focus transitions; no grader. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else if(root)root.G74ColumnKeypadC2=api;})(typeof window!=='undefined'?window:null,function(){
 function mount(container,root,callbacks={}){
  if(!container?.ownerDocument||!root?.querySelectorAll)return {ok:false,reason:'INVALID_MOUNT'};
  const d=container.ownerDocument,keys=['1','2','3','4','5','6','7','8','9','BACK','0','CLEAR'];
  const pad=d.createElement('section');pad.className='g74-c2-keypad';pad.setAttribute('aria-label','Bàn phím Toán cho phép đặt tính');
  const label=d.createElement('div');label.className='g74-c2-pad-label';label.textContent='Bàn phím Toán: chọn ô, rồi bấm số';pad.append(label);
  const grid=d.createElement('div');grid.className='g74-c2-keys';pad.append(grid);
  let last=null;
  const select=(e)=>{if(e.target.matches?.('.kl-col-v12-answer')&&root.contains(e.target))last=e.target};
  root.addEventListener('focusin',select);
  function type(value){
   let input=d.activeElement;
   if(!input?.matches?.('.kl-col-v12-answer')||!root.contains(input))input=last&&root.contains(last)?last:root.querySelector('.kl-col-v12-answer.active')||root.querySelector('.kl-col-v12-answer');
   if(!input)return {ok:false,reason:'NO_ACTIVE_COLUMN_FIELD'};
   input.focus();last=input;
   const before=input.value||'';
   input.value=value==='CLEAR'?'':value==='BACK'?before.slice(0,-1):String(value);
   input.dispatchEvent(new (d.defaultView?.Event||Event)('input',{bubbles:true}));
   callbacks.onKey?.({key:value,previous:before,current:input.value});
   return {ok:true};
  }
  keys.forEach(k=>{const b=d.createElement('button');b.type='button';b.className='g74-c2-key';b.dataset.key=k;
   b.textContent=k==='BACK'?'⌫':k==='CLEAR'?'Xóa':k;
   b.setAttribute('aria-label',k==='BACK'?'Xóa chữ số cuối':k==='CLEAR'?'Xóa ô':k);
   b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>type(k));grid.append(b);
  });
  container.replaceChildren(pad);
  return {ok:true,type,destroy:()=>{root.removeEventListener('focusin',select);pad.remove()}};
 }
 return Object.freeze({mount});
});
