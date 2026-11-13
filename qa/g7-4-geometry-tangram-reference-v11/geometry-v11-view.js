/* G7.4 Geometry+Tangram V1.1 TEST only. No checking/awards/backend. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLGeometryTangramViewV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 function draw(doc,g){
  let type=g.type==='triangle'?'polygon':g.type==='square'?'rect':g.type;
  const el=doc.createElementNS(NS,type);
  if(type==='polygon'||type==='polyline')el.setAttribute('points',g.points.map(p=>p.join(',')).join(' '));
  else if(type==='rect')for(const k of ['x','y','width','height'])el.setAttribute(k,String(g[k]));
  else if(type==='circle')for(const k of ['cx','cy','r'])el.setAttribute(k,String(g[k]));
  return el;
 }
 function center(g){
  if(g.type==='circle')return {x:g.cx,y:g.cy};
  if(g.type==='rect'||g.type==='square')return {x:g.x+g.width/2,y:g.y+g.height/2};
  const xs=g.points.map(p=>p[0]),ys=g.points.map(p=>p[1]);
  return {x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2};
 }
 function mount(host,plan,options={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-geometry-tangram-v11'||
     typeof KLGeometryTangramV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,engine=KLGeometryTangramV11.session(plan);
  let destroyed=false;
  const root=doc.createElement('section');root.className='g74-geo-v11';root.dataset.g74GeometryV11=plan.exerciseId;
  const heading=doc.createElement('p');heading.className='g74-geo-prompt';heading.textContent=plan.prompt;
  const status=doc.createElement('p');status.className='g74-geo-status';status.setAttribute('aria-live','polite');
  const area=doc.createElement('div');root.append(heading,status,area);host.append(root);
  const make=(tag,cls,label)=>{
   const b=doc.createElement(tag);if(cls)b.className=cls;
   if(tag==='button'){b.type='button';if(label)b.setAttribute('aria-label',label);}
   return b;
  };
  const notify=()=>{render();if(typeof options.onChange==='function')options.onChange(engine.snapshot());};
  const shapeSVG=(shape,view='0 0 150 125')=>{
   const svg=doc.createElementNS(NS,'svg');svg.setAttribute('viewBox',view);svg.setAttribute('aria-hidden','true');svg.classList.add('g74-geo-svg');svg.append(draw(doc,shape));return svg;
  };
  function renderShapes(){
   const s=engine.snapshot(),set=new Set(s.selectedShapeIds),grid=make('div','g74-geo-shape-grid');
   status.textContent='Đã chọn '+set.size+' hình';
   for(const item of plan.items){
    const b=make('button','g74-geo-shape',item.label);const chosen=set.has(item.id);
    b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));
    b.append(shapeSVG(item.geometry));
    const label=make('span','g74-geo-label');label.textContent=item.label;b.append(label);
    if(chosen){const count=make('span','g74-geo-order');count.textContent='#'+(s.selectedShapeIds.indexOf(item.id)+1);b.append(count);}
    b.addEventListener('click',()=>{engine.toggleShape(item.id);notify();});grid.append(b);
   }
   area.append(grid);
  }
  function renderTangram(){
   const s=engine.snapshot(),layout=make('div','g74-tangram-layout');
   const toolbar=make('div','g74-tangram-tools');
   const pieceList=make('div','g74-tangram-pieces');
   const board=make('div','g74-tangram-board');
   status.textContent=Object.values(s.pieces).filter(p=>p.placedTargetId!==null).length+' / '+plan.items.length+' mảnh đã đặt (chưa chấm đúng/sai)';
   const active=s.activePieceId;
   for(const p of plan.items){
    const b=make('button','g74-tangram-piece',p.label);b.textContent=p.label+
      ' • '+s.pieces[p.id].rotation+'°'+(s.pieces[p.id].placedTargetId?' • đã đặt':'');
    b.classList.toggle('selected',active===p.id);b.setAttribute('aria-pressed',String(active===p.id));
    b.addEventListener('click',()=>{engine.selectPiece(p.id);notify();});pieceList.append(b);
   }
   for(const [label,fn] of [
    ['↻ Xoay +90°',()=>engine.rotatePiece(active,90)],
    ['↺ Xoay −90°',()=>engine.rotatePiece(active,-90)],
    ['Bỏ vị trí đã đặt',()=>engine.unplacePiece(active)]
   ]){
    const b=make('button','g74-tangram-tool',label);b.textContent=label;b.disabled=!active;
    b.addEventListener('click',()=>{const result=fn();if(result.ok)notify();});toolbar.append(b);
   }
   const svg=doc.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 420 300');svg.classList.add('g74-tangram-svg');
   for(const target of plan.targets){
    const group=doc.createElementNS(NS,'g');group.classList.add('g74-tangram-target');
    group.append(draw(doc,target.geometry));
    // SVG pointer is an optional convenience. Accessible native target buttons follow.
    group.addEventListener('click',()=>{if(active&&engine.placePiece(active,target.id).ok)notify();});
    svg.append(group);
   }
   for(const item of plan.items){
    const p=s.pieces[item.id],g=doc.createElementNS(NS,'g');
    // Explicit placedTargetId remains a candidate, not an inferred correct answer.
    // A ghost at the target is rendered only after placement; geometry stays at user's rotation.
    const target=plan.targets.find(t=>t.id===p.placedTargetId);
    const c=target?center(target.geometry):null;
    const x=c?c.x:p.x,y=c?c.y:p.y;
    g.setAttribute('transform','translate('+x+' '+y+') rotate('+p.rotation+')');
    g.classList.add('g74-tangram-active-piece');g.append(draw(doc,item.geometry));
    svg.append(g);
   }
   board.append(svg);
   const targets=make('div','g74-tangram-target-buttons');
   for(const target of plan.targets){
    const b=make('button','g74-tangram-target-button','Đặt mảnh đang chọn vào khung '+target.id);
    b.textContent='Khung '+target.id;b.disabled=!active;
    b.addEventListener('click',()=>{const r=engine.placePiece(active,target.id);if(r.ok)notify();});targets.append(b);
   }
   board.append(targets);layout.append(pieceList,board);area.append(toolbar,layout);
  }
  function render(){if(destroyed)return;area.replaceChildren();if(plan.mode==='SHAPE_SELECT')renderShapes();else renderTangram();}
  render();
  return Object.freeze({
   ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok)notify();return r;},
   clear(){const r=engine.clear();notify();return r;},
   destroy(){if(destroyed)return;destroyed=true;root.remove();}
  });
 }
 return Object.freeze({mount});
});
