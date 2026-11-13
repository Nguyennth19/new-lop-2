'use strict';
/** P0.6-D B20 presentation bridge. Injects the existing, unchanged 41_* renderer.
 * The caller must supply a matching question from the unchanged 42_* legacy adapter.
 * No implementation of the existing HTML/CSS logic is copied here.
 */
const MAP=Object.freeze({
 'math.vertical':{type:'vertical',method:'vertical',variant:'vertical'},
 'math.mental':{type:'mental',method:'mental',variant:'mental'},
 'math.carry':{type:'mental',method:'mental',variant:'carry'},
 'math.three':{type:'mental',method:'mental',variant:'three'},
 'math.reverse':{type:'mental',method:'mental',variant:'reverse'},
 'math.word':{type:'word_problem',method:'word',variant:'word'}
});
function makeB20Handlers(oldRenderer){
 if(!oldRenderer||typeof oldRenderer!=='object')throw Error('LEGACY_RENDERER_REQUIRED');
 const handlers={};
 for(const [kind,spec] of Object.entries(MAP)){
  if(typeof oldRenderer[spec.method]!=='function')throw Error('LEGACY_RENDER_METHOD_MISSING');
  handlers[kind]=function(q,context){
   const old=context&&context.legacyQuestion,p=q.parameters||{};
   if(!context||context.lessonId!=='toan_b20'||!old||!q.legacy||q.legacy.type!==spec.variant||
      !q.id||old.id!==q.id||old.prompt!==q.prompt||
      old.variantType!==spec.variant||old.type!==spec.type||old.valid!==true||
      !q.answerSpec||String(q.answerSpec.value)!==old.answer||
      !Number.isSafeInteger(p.a)||!Number.isSafeInteger(p.b)||
      old.n1!==p.a||old.n2!==p.b||
      (spec.variant==='three'&&old.n3!==p.c)||
      (String(q.legacy.unit||'')!==String(old.unit||'')))
     throw Error('B20_LEGACY_PRESENTATION_DRIFT');
   return {ok:true,html:oldRenderer[spec.method](old),interactive:true};
  };
 }
 return Object.freeze(handlers);
}
module.exports={makeB20Handlers,MAP};
