/* G7.6-B.4 – TEST-only Tangram target localization adapter.
 * The pinned G7.4 reference renderer and its core remain byte-identical.
 * Public ID-to-label enumeration conveys NO correct-piece placement semantics.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root)root.G76B4TangramReview=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const fail=code=>({ok:false,code});
 function labels(plan){
  if(!plan||plan.schemaVersion!=='g74-geometry-tangram-v11'||plan.mode!=='TANGRAM'||
     !Array.isArray(plan.targets)||plan.targets.length<1||plan.targets.length>12||
     new Set(plan.targets.map(x=>x.id)).size!==plan.targets.length||
     plan.targets.some(t=>typeof t?.id!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(t.id)))
   return fail('INVALID_TANGRAM_TARGET_PLAN');
  return {ok:true,items:plan.targets.map((target,i)=>({
   id:target.id,index:i+1,
   caption:'Khung số '+(i+1),
   aria:'Đặt mảnh đang chọn vào khung số '+(i+1)
  }))};
 }
 function decorate(host,plan){
  const proposed=labels(plan);if(!proposed.ok)return proposed;
  if(!host||typeof host.querySelectorAll!=='function')return fail('INVALID_HOST');
  const buttons=[...host.querySelectorAll('.g74-tangram-target-button')];
  if(buttons.length!==proposed.items.length)return fail('TANGRAM_BUTTON_CARDINALITY_DRIFT');
  for(let i=0;i<buttons.length;i++){
   const button=buttons[i],source=proposed.items[i];
   if(button.tagName?.toLowerCase()!=='button')return fail('TANGRAM_TARGET_NOT_NATIVE_BUTTON');
   // G7.4 wires events via target.id before this decoration; we never change
   // IDs, closures, geometry, order, target mapping or any grading rule.
   if(button.textContent!==source.caption)button.textContent=source.caption;
   if(button.getAttribute('aria-label')!==source.aria)button.setAttribute('aria-label',source.aria);
   button.dataset.g76B4TargetNumber=String(source.index);
  }
  return {ok:true,changed:buttons.length,localized:true,noCorrectnessMapping:true};
 }
 function mount(host,plan,options={}){
  if(typeof KLGeometryTangramViewV11==='undefined')return fail('NATIVE_G74_VIEW_MISSING');
  const declared=labels(plan);if(!declared.ok)return declared;
  let last;
  const native=KLGeometryTangramViewV11.mount(host,plan,{
   onChange(snapshot){
    const result=decorate(host,plan);
    if(!result.ok)throw Error('G76B4_TARGET_LOCALIZATION_LOST_'+result.code);
    last=result;
    if(typeof options.onChange==='function')options.onChange(snapshot);
   }
  });
  if(!native.ok)return fail('NATIVE_G74_VIEW_REJECTED');
  last=decorate(host,plan);
  if(!last.ok){native.destroy();return last}
  return Object.freeze({
   ok:true,reviewOnly:true,localization:()=>last,
   snapshot:()=>native.snapshot(),
   clear(){const result=native.clear();last=decorate(host,plan);return last.ok?result:last;},
   restore(draft){const result=native.restore(draft);last=decorate(host,plan);return last.ok?result:last;},
   destroy(){return native.destroy()}
  });
 }
 return Object.freeze({labels,decorate,mount});
});
