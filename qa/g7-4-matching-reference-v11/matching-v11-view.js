/* G7.4 Matching V1.1 TEST view. No server calls, scoring, stars, progress or mutations.
 * Reuses two-column visual language + SVG line overlay of frozen Type-3 reference.
 * Requires KLMatchingV11 core. Caller owns draft persistence and grading policy.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLMatchingViewV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function mount(host,plan,options={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-matching-v11'||
     typeof KLMatchingV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,win=doc.defaultView,engine=KLMatchingV11.session(plan),opts=options;
  const ns='http://www.w3.org/2000/svg';
  let disposed=false,drag=null,suppressClick=false,resizeObserver=null;
  const root=doc.createElement('section');root.className='g74-match-v11';root.dataset.g74MatchingV11=plan.exerciseId;
  const status=doc.createElement('p');status.className='g74-match-status';status.setAttribute('aria-live','polite');
  const board=doc.createElement('div');board.className='g74-match-board';
  const svg=doc.createElementNS(ns,'svg');svg.classList.add('g74-match-lines');svg.setAttribute('aria-hidden','true');
  const cols=[doc.createElement('div'),doc.createElement('div')];cols.forEach((c,i)=>{c.className='g74-match-column '+(i?'right':'left');board.append(c)});
  board.append(svg);root.append(status,board);host.append(root);
  const nodeMap=new Map();
  function itemNode(item,side){
   const b=doc.createElement('button');b.type='button';b.className='g74-match-card '+side;
   b.dataset.matchId=item.id;b.setAttribute('aria-label',(side==='left'?'Vế trái: ':'Vế phải: ')+(item.content.text||item.content.alt||item.id));
   const text=doc.createElement('span');text.className='g74-match-text';text.textContent=item.content.text;
   const anchor=doc.createElement('span');anchor.className='g74-match-anchor';anchor.setAttribute('aria-hidden','true');
   if(side==='right')b.append(anchor);
   const body=doc.createElement('span');body.className='g74-match-content';body.append(text);
   if(item.content.assetId){
    const asset=typeof opts.resolveAsset==='function'?opts.resolveAsset(item.content.assetId):null;
    if(asset && typeof asset.url==='string'&&/^https:\/\//.test(asset.url)){
     const img=doc.createElement('img');img.src=asset.url;img.alt=item.content.alt||item.content.text||'Hình minh họa';
     img.loading='lazy';img.className='g74-match-asset';body.append(img);
    } else {
     const fallback=doc.createElement('span');fallback.className='g74-match-asset-fallback';
     fallback.textContent=item.content.alt||'[Hình minh họa]';body.append(fallback);
    }
   }
   b.append(body);if(side==='left')b.append(anchor);
   cols[side==='left'?0:1].append(b);nodeMap.set(item.id,{button:b,anchor});
   b.addEventListener('click',()=>{
    if(disposed||suppressClick)return;
    const result=side==='left'?engine.selectLeft(item.id):engine.connectSelected(item.id);
    if(result.ok)changed();else update();
   });
   if(side==='left')b.addEventListener('pointerdown',e=>{
    if(disposed||e.button!==0)return;
    const box=board.getBoundingClientRect(),a=anchor.getBoundingClientRect();
    drag={pointerId:e.pointerId,leftId:item.id,startX:a.left+a.width/2-box.left,
     startY:a.top+a.height/2-box.top,x:e.clientX-box.left,y:e.clientY-box.top,
     initialX:e.clientX,initialY:e.clientY,moved:false};
    // Capture on origin so pointerup occurs even if released outside board.
    if(typeof b.setPointerCapture==='function')try{b.setPointerCapture(e.pointerId)}catch(_){}
   });
   return b;
  }
  plan.leftItems.forEach(i=>itemNode(i,'left'));plan.rightItems.forEach(i=>itemNode(i,'right'));
  function appendLine(x1,y1,x2,y2,cls){
   const l=doc.createElementNS(ns,'line');
   for(const [k,v] of Object.entries({x1,y1,x2,y2}))l.setAttribute(k,String(v));
   l.setAttribute('class',cls);svg.append(l);
  }
  function center(id,rect){
   const a=nodeMap.get(id)?.anchor;if(!a)return null;
   const r=a.getBoundingClientRect();return {x:r.left+r.width/2-rect.left,y:r.top+r.height/2-rect.top};
  }
  function draw(){
   if(disposed)return;
   const rect=board.getBoundingClientRect();
   svg.setAttribute('width',String(board.clientWidth));svg.setAttribute('height',String(board.clientHeight));
   svg.setAttribute('viewBox','0 0 '+Math.max(1,board.clientWidth)+' '+Math.max(1,board.clientHeight));
   svg.replaceChildren();
   for(const [l,r] of Object.entries(engine.snapshot().pairs)){
    const a=center(l,rect),b=center(r,rect);
    if(a&&b)appendLine(a.x,a.y,b.x,b.y,'g74-match-line');
   }
   if(drag&&drag.moved)appendLine(drag.startX,drag.startY,drag.x,drag.y,'g74-match-line temporary');
  }
  function update(){
   const state=engine.snapshot();
   status.textContent='Đã nối: '+state.completed+' / '+state.total+' cặp';
   for(const [id,n] of nodeMap){
    const isRight=plan.rightItems.some(x=>x.id===id);
    const paired=isRight?Object.values(state.pairs).includes(id):Boolean(state.pairs[id]);
    n.button.classList.toggle('paired',paired);
    n.button.classList.toggle('selected',state.selectedLeft===id);
    n.button.setAttribute('aria-pressed',String(paired||state.selectedLeft===id));
   }
   draw();
  }
  function changed(){
   update();
   if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());
  }
  const onMove=e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   const rect=board.getBoundingClientRect();
   drag.x=e.clientX-rect.left;drag.y=e.clientY-rect.top;
   if(Math.hypot(e.clientX-drag.initialX,e.clientY-drag.initialY)>7)drag.moved=true;
   draw();
  };
  const onUp=e=>{
   if(!drag||e.pointerId!==drag.pointerId)return;
   const d=drag;drag=null;
   if(d.moved){
    suppressClick=true;
    // A pointer-captured hit-test must use elementFromPoint, not event.target.
    const el=doc.elementFromPoint(e.clientX,e.clientY);
    const target=el&&el.closest('[data-match-id]');
    const targetId=target?.dataset.matchId;
    if(targetId&&plan.rightItems.some(x=>x.id===targetId)){
     const v=engine.connect(d.leftId,targetId);if(v.ok)changed();
    }
    // Cancel pending click only for pointer-derived click. Reset in a microtask
    // after browser click dispatch; next user action should not be suppressed.
    Promise.resolve().then(()=>{suppressClick=false});
   }
   update();
  };
  const onCancel=e=>{if(drag&&drag.pointerId===e.pointerId){drag=null;update()}};
  const onResize=()=>draw();
  win?.addEventListener('pointermove',onMove);win?.addEventListener('pointerup',onUp);
  win?.addEventListener('pointercancel',onCancel);win?.addEventListener('resize',onResize);
  win?.addEventListener('scroll',onResize,true);
  if(typeof ResizeObserver!=='undefined'){
   resizeObserver=new ResizeObserver(onResize);resizeObserver.observe(board);
   for(const v of nodeMap.values())resizeObserver.observe(v.button);
  }
  const controller={
   ok:true,
   snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok)changed();return r;},
   clear(){const r=engine.clear();changed();return r;},
   disconnect(id){const r=engine.disconnect(id);if(r.ok)changed();return r;},
   destroy(){
    if(disposed)return;disposed=true;drag=null;resizeObserver?.disconnect();
    win?.removeEventListener('pointermove',onMove);win?.removeEventListener('pointerup',onUp);
    win?.removeEventListener('pointercancel',onCancel);win?.removeEventListener('resize',onResize);
    win?.removeEventListener('scroll',onResize,true);root.remove();
   }
  };
  update();return Object.freeze(controller);
 }
 return Object.freeze({mount});
});
