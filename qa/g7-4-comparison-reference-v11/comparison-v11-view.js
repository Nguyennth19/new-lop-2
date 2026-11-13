/* G7.4 Comparison V1.1 TEST-only view; no grading, badges, awards or progress.
 * Semantic buttons for row and sign selection, safe textContent and scoped CSS.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLComparisonViewV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function mount(host,plan,opts={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-comparison-v11'||
     typeof KLComparisonV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,engine=KLComparisonV11.session(plan);
  let destroyed=false;
  const root=doc.createElement('section');root.className='g74-comparison-v11';root.dataset.g74ComparisonV11=plan.exerciseId;
  const prompt=doc.createElement('p');prompt.className='g74-cmp-prompt';
  prompt.textContent=plan.prompt||'Chọn dấu lớn hơn, bé hơn hoặc bằng nhau.';
  const tip=doc.createElement('p');tip.className='g74-cmp-tip';
  tip.textContent='🐊 Cá sấu há miệng về phía lớn hơn. Dấu = nghĩa là hai bên bằng nhau.';
  const header=doc.createElement('div');header.className='g74-cmp-header';header.append(prompt,tip);
  const status=doc.createElement('p');status.className='g74-cmp-status';status.setAttribute('aria-live','polite');
  const rows=doc.createElement('div');rows.className='g74-cmp-rows';
  const controls=doc.createElement('div');controls.className='g74-cmp-controls';
  const hintButton=doc.createElement('button');hintButton.type='button';hintButton.className='g74-cmp-hints';
  if(plan.hintPolicy==='OPTIONAL'){
   hintButton.textContent='💡 Hiện gợi ý';hintButton.addEventListener('click',()=>{const r=engine.toggleHints();if(r.ok)notify();});
   header.append(hintButton);
  }
  root.append(header,status,rows,controls);host.append(root);
  const refs=new Map();
  function sideContent(parent,side){
   const t=doc.createElement('strong');t.className='g74-cmp-value';t.textContent=side.text;parent.append(t);
   if(side.assetId){
    let asset=null;
    try{asset=typeof opts.resolveAsset==='function'?opts.resolveAsset(side.assetId):null}catch(_){}
    if(asset&&typeof asset.url==='string'&&/^https:\/\//.test(asset.url)){
     const img=doc.createElement('img');img.src=asset.url;img.alt=side.alt||side.text||'Hình minh họa';img.className='g74-cmp-asset';img.loading='lazy';parent.append(img);
    }else{
     const fallback=doc.createElement('span');fallback.className='g74-cmp-fallback';
     fallback.textContent=side.alt||'[Hình minh họa]';parent.append(fallback);
    }
   }
  }
  const notify=()=>{refresh();if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());};
  for(const [index,row] of plan.rows.entries()){
   const button=doc.createElement('button');button.type='button';button.className='g74-cmp-row';
   button.dataset.cmpRow=row.id;button.setAttribute('aria-label','Câu '+(index+1)+': chọn dấu so sánh');
   const l=doc.createElement('span'),r=doc.createElement('span');
   l.className='g74-cmp-side';r.className='g74-cmp-side';
   sideContent(l,row.left);sideContent(r,row.right);
   const lHint=doc.createElement('small'),rHint=doc.createElement('small');
   lHint.className='g74-cmp-hint';rHint.className='g74-cmp-hint';
   lHint.textContent=row.leftHint;rHint.textContent=row.rightHint;l.append(lHint);r.append(rHint);
   const symbol=doc.createElement('span');symbol.className='g74-cmp-symbol';symbol.textContent='?';
   button.append(l,symbol,r);button.addEventListener('click',()=>{engine.activate(row.id);notify();});
   refs.set(row.id,{button,symbol,lHint,rHint});rows.append(button);
  }
  const names={'>':'🐊 >  Lớn hơn','=':'⚖️ =  Bằng nhau','<':'< 🐊  Bé hơn'};
  for(const sign of ['>','=','<']){
   const button=doc.createElement('button');button.type='button';button.className='g74-cmp-sign';button.dataset.cmpSign=sign;
   button.textContent=names[sign];button.setAttribute('aria-label',sign==='>'?'Chọn lớn hơn':sign==='<'?'Chọn bé hơn':'Chọn bằng nhau');
   button.addEventListener('click',()=>{const result=engine.choose(sign);if(result.ok)notify();});
   controls.append(button);
  }
  function refresh(){
   if(destroyed)return;
   const state=engine.snapshot(),answers=state.selectedSigns;
   status.textContent='Đã chọn '+Object.keys(answers).length+' / '+plan.rows.length+' dấu. Chưa chấm đúng/sai.';
   for(const [id,o] of refs){
    const value=answers[id]||'?';
    o.symbol.textContent=state.hintsVisible&&value==='>'?'> 🐊':state.hintsVisible&&value==='<'?'🐊 <':value;
    o.button.classList.toggle('active',state.activeRowId===id);
    o.button.classList.toggle('answered',Boolean(answers[id]));
    o.button.setAttribute('aria-pressed',String(state.activeRowId===id));
    o.lHint.hidden=!state.hintsVisible;
    o.rHint.hidden=!state.hintsVisible;
   }
   if(plan.hintPolicy==='OPTIONAL'){
    hintButton.textContent=state.hintsVisible?'🙈 Ẩn gợi ý':'💡 Hiện gợi ý';
    hintButton.setAttribute('aria-pressed',String(state.hintsVisible));
   }
  }
  refresh();
  return Object.freeze({
   ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok)notify();return r;},
   clear(){const r=engine.clear();notify();return r;},
   destroy(){if(destroyed)return;destroyed=true;root.remove();}
  });
 }
 return Object.freeze({mount});
});
