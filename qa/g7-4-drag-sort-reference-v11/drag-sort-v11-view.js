/* TEST-only order / basket classification renderer. No answer evaluation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLDragSortViewV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function mount(host,plan,opts={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-drag-sort-v11'||typeof KLDragSortV11==='undefined')
   return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,engine=KLDragSortV11.session(plan);
  const root=doc.createElement('section');root.className='g74-ds-v11';root.dataset.g74DragSortV11=plan.exerciseId;
  const heading=doc.createElement('h3');heading.textContent=plan.prompt||'Sắp xếp hoặc phân loại';
  const note=doc.createElement('p');note.className='g74-ds-status';note.setAttribute('aria-live','polite');
  const source=doc.createElement('div');source.className='g74-ds-source';
  const targets=doc.createElement('div');targets.className='g74-ds-targets';
  root.append(heading,note,source,targets);host.append(root);
  let destroyed=false,dragging=null;
  const notify=()=>{render();if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());};
  function make(tag,cls,text){
   const el=doc.createElement(tag);el.className=cls;if(text!==undefined)el.textContent=text;
   if(tag==='button')el.type='button';return el;
  }
  function card(item,assigned){
   const b=make('button','g74-ds-card',item.label);
   b.dataset.dsItem=item.id;b.classList.toggle('assigned',assigned);
   b.setAttribute('aria-pressed',String(engine.snapshot().selectedItemId===item.id));
   b.setAttribute('aria-label',(item.label||item.alt||item.id)+(assigned?' – đã đặt':''));
   if(item.assetId){
    let asset=null;try{asset=typeof opts.resolveAsset==='function'?opts.resolveAsset(item.assetId):null}catch(_){}
    if(asset&&typeof asset.url==='string'&&/^https:\/\//.test(asset.url)){
     const img=doc.createElement('img');img.src=asset.url;img.alt=item.alt||item.label||'Hình minh họa';img.className='g74-ds-asset';b.append(img);
    }else{const f=make('span','g74-ds-fallback',item.alt||'[Hình minh họa]');b.append(f);}
   }
   b.addEventListener('click',()=>{if(!dragging){engine.select(item.id);notify();}});
   b.draggable=true;
   b.addEventListener('dragstart',e=>{dragging=item.id;
    if(e.dataTransfer){e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',item.id);}
   });
   b.addEventListener('dragend',()=>{dragging=null;});
   return b;
  }
  function targetButton(t,items){
   const button=make('button','g74-ds-target');
   button.dataset.dsTarget=t.id;button.setAttribute('aria-label',t.label+' – chạm để đặt thẻ đã chọn');
   const title=make('strong','g74-ds-target-name',t.label);button.append(title);
   if(items.length)for(const item of items){button.append(make('span','g74-ds-placed',item.label));}
   else button.append(make('span','g74-ds-placeholder','Chạm để đặt'));
   button.addEventListener('click',()=>{if(engine.snapshot().selectedItemId){const r=engine.placeSelected(t.id);if(r.ok)notify();}});
   button.addEventListener('dragover',e=>{e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='move';});
   button.addEventListener('drop',e=>{
    e.preventDefault();
    // DataTransfer is a hint only, validated by engine against whitelisted item IDs.
    const picked=e.dataTransfer?.getData('text/plain')||dragging;
    dragging=null;const r=engine.place(picked,t.id);if(r.ok)notify();
   });
   return button;
  }
  function render(){
   if(destroyed)return;source.replaceChildren();targets.replaceChildren();
   const state=engine.snapshot();
   const assigned=state.placements;
   const remaining=plan.items.filter(it=>!assigned[it.id]);
   for(const it of plan.items)source.append(card(it,!!assigned[it.id]));
   for(const t of plan.targets){
    const inTarget=plan.items.filter(it=>assigned[it.id]===t.id);
    targets.append(targetButton(t,inTarget));
   }
   const count=Object.keys(assigned).length;
   note.textContent='Đã đặt '+count+' / '+plan.items.length+' thẻ. Chọn thẻ rồi chọn ô/giỏ, hoặc kéo thả trên máy tính. Chưa chấm đúng/sai.';
   // Keep assigned cards selectable so learners can revise without scoring.
  }
  render();
  return Object.freeze({
   ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok)notify();return r;},
   clear(){const r=engine.clear();notify();return r;},
   remove(id){const r=engine.remove(id);if(r.ok)notify();return r;},
   destroy(){if(destroyed)return;destroyed=true;root.remove();}
  });
 }
 return Object.freeze({mount});
});
