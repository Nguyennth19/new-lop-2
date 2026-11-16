/* G7.4 8-A proportional liter SVG V1.2 TEST view; 8-B unchanged. SVG is mathematical visualization.
 * Scaled measurements, not real physical liters/kg. Uses trusted engine-only state.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLCapacityWeightViewV12=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
  function literGeometry(capacity,current,largestCapacity){
   if(!Number.isInteger(capacity)||capacity<1||capacity>100||
      !Number.isInteger(current)||current<0||current>capacity||
      !Number.isInteger(largestCapacity)||largestCapacity<capacity||largestCapacity>100)
     throw Error('INVALID_LITER_GEOMETRY');
   const step=Math.min(19,158/largestCapacity),bottom=204;
   const vesselTop=bottom-capacity*step,waterTop=bottom-current*step;
   return Object.freeze({capacity,current,bottom,step,vesselTop,waterTop,
     vesselHeight:capacity*step,waterHeight:current*step,
     labelEvery:largestCapacity<=12?1:Math.ceil(largestCapacity/10)});
  }
 function mount(host,plan,opts={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-capacity-weight-v11'||
     typeof KLCapacityWeightV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,engine=KLCapacityWeightV11.session(plan);
  const root=doc.createElement('section');root.className='g74-cw-v11';root.dataset.g74CwV11=plan.exerciseId;
  const heading=doc.createElement('h3');heading.textContent=plan.prompt;const status=doc.createElement('p');
  status.className='g74-cw-status';status.setAttribute('aria-live','polite');
  const board=doc.createElement('div');board.className='g74-cw-board';root.append(heading,status,board);host.append(root);
  let disposed=false;
  const svg=(tag,attrs={},text)=>{
   const e=doc.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
   if(text!==undefined)e.textContent=String(text);return e;
  };
  const button=(label,fn)=>{const b=doc.createElement('button');b.type='button';b.className='g74-cw-btn';b.textContent=label;
   b.addEventListener('click',()=>{const r=fn();if(r.ok)notify();});return b;};
  const notify=()=>{render();if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());};
  function asset(parent,item){
   if(!item.assetId)return;
   let a=null;try{a=typeof opts.resolveAsset==='function'?opts.resolveAsset(item.assetId):null}catch(_){}
   if(a&&typeof a.url==='string'&&/^https:\/\//.test(a.url)){
    const image=doc.createElement('img');image.className='g74-cw-asset';image.src=a.url;
    image.alt=item.alt||item.label;parent.append(image);
   }else{
    const f=doc.createElement('small');f.className='g74-cw-asset-fallback';
    f.textContent=item.alt||'Hình tham chiếu chưa được duyệt';parent.append(f);
   }
  }
  // One consistent visual liter unit across both containers. No changes to engine quantities.
  // For large generated capacities, all unit marks remain; alternate labels are thinned.
  function renderLiter(){
   const state=engine.snapshot(),grid=doc.createElement('div');
   grid.className='g74-cw-two';
   const maxCapacity=Math.max(...plan.items.map(item=>item.capacityLiters));
   for(const item of plan.items){
    const now=state.quantities[item.id],g=literGeometry(item.capacityLiters,now,maxCapacity);
    const panel=doc.createElement('div');panel.className='g74-cw-panel g74-cw-v12-liter-panel';
    const label=doc.createElement('strong');label.textContent=item.label;panel.append(label);
    const picture=svg('svg',{viewBox:'0 0 160 226',class:'g74-cw-v12-vessel',
      role:'img','aria-label':item.label+': đang có '+now+' lít, sức chứa '+item.capacityLiters+' lít, thang chia mỗi vạch 1 lít',
      'data-capacity-liters':item.capacityLiters,'data-current-liters':now,
      'data-liter-step':g.step.toFixed(8)});
    // Constant width and common bottom line model equal cross-sections; only capacity changes physical height.
    const vessel=svg('rect',{x:33,y:g.vesselTop,width:94,height:g.vesselHeight,
      fill:'#e4f4ff',stroke:'#4a81ac','stroke-width':3,
      'data-part':'vessel','data-height':g.vesselHeight.toFixed(4)});
    picture.append(vessel);
    if(now>0){
     const water=svg('rect',{x:35,y:g.waterTop,width:90,height:g.waterHeight,fill:'#5ab5e9',
       'data-part':'water','data-height':g.waterHeight.toFixed(4)});
     picture.append(water);
     picture.append(svg('line',{x1:35,y1:g.waterTop,x2:125,y2:g.waterTop,stroke:'#1879bc','stroke-width':2,
       'data-part':'waterline'}));
    }
    // 1 liter equals exactly one common step in both vessels; never infer volume from static PNG art.
    for(let i=0;i<=item.capacityLiters;i++){
     const y=g.bottom-i*g.step;
     picture.append(svg('line',{x1:36,y1:y,x2:i%5===0?56:49,y2:y,stroke:'#255f88',
       'stroke-width':i===0||i===item.capacityLiters?2:1.25,'data-part':'liter-tick','data-liter':i}));
     if(i===0||i===item.capacityLiters||i%g.labelEvery===0){
      picture.append(svg('text',{x:61,y:y+3.5,'font-size':maxCapacity>20?8:10,
       'font-weight':700,fill:'#143e62','data-part':'liter-label','data-liter':i},String(i)));
     }
    }
    picture.append(svg('text',{x:80,y:219,'text-anchor':'middle','font-size':10,
      'font-weight':700,fill:'#27577a'},item.capacityLiters+' L tối đa'));
    panel.append(picture);
    const detail=doc.createElement('p');detail.textContent='Đang có '+now+' L · Sức chứa '+item.capacityLiters+' L';panel.append(detail);
    const controls=doc.createElement('div');controls.className='g74-cw-controls';
    const minus=button('− 1 L',()=>engine.adjust(item.id,-1));
    const plus=button('+ 1 L',()=>engine.adjust(item.id,1));
    minus.disabled=now===0;plus.disabled=now===item.capacityLiters;
    controls.append(minus,plus);panel.append(controls);asset(panel,item);grid.append(panel);
   }
   board.append(grid);
   const transfer=doc.createElement('div');transfer.className='g74-cw-controls';
   for(const [from,to] of [[plan.items[0],plan.items[1]],[plan.items[1],plan.items[0]]]){
    const b=button('Rót 1 L: '+from.label+' → '+to.label,()=>engine.transfer(from.id,to.id,1));
    b.disabled=state.quantities[from.id]===0||state.quantities[to.id]>=to.capacityLiters;
    transfer.append(b);
   }
   board.append(transfer);
   status.textContent='Thao tác dung tích mô phỏng; không chấm đúng/sai.';
  }
  function renderWeight(){
   const s=engine.snapshot(),left=plan.items[0],right=plan.items[1];
   const l=s.quantities[left.id],r=s.quantities[right.id],tilt=KLCapacityWeightV11.balanceTilt(l,r);
   const frame=doc.createElement('div');frame.className='g74-cw-scale';
   const picture=svg('svg',{viewBox:'0 0 360 210',role:'img','aria-label':'Cân đĩa: bên trái '+l+' kg, bên phải '+r+' kg'});
   picture.append(svg('path',{d:'M152 196 H208 L218 205 H142 Z',fill:'#9db0c4'}));
   picture.append(svg('rect',{x:174,y:50,width:12,height:147,rx:5,fill:'#8eabc6'}));
   const rad=tilt.degrees*Math.PI/180;
   // The beam slopes, but the pans themselves remain horizontal and their payloads upright.
   const xleft=180-105*Math.cos(rad),xright=180+105*Math.cos(rad);
   const yl=tilt.leftY,yr=tilt.rightY;
   picture.append(svg('line',{x1:xleft,y1:yl,x2:xright,y2:yr,stroke:'#678ba9','stroke-width':8,'stroke-linecap':'round'}));
   picture.append(svg('circle',{cx:180,cy:58,r:9,fill:'#395f84'}));
   for(const pan of [{x:xleft,y:yl,value:l,label:'Trái'},{x:xright,y:yr,value:r,label:'Phải'}]){
    const py=pan.y+72;
    picture.append(svg('line',{x1:pan.x,y1:pan.y,x2:pan.x-36,y2:py,stroke:'#8299b2','stroke-width':2}));
    picture.append(svg('line',{x1:pan.x,y1:pan.y,x2:pan.x+36,y2:py,stroke:'#8299b2','stroke-width':2}));
    picture.append(svg('path',{d:'M'+(pan.x-40)+' '+py+' Q'+pan.x+' '+(py+24)+' '+(pan.x+40)+' '+py,fill:'none',stroke:'#468bb7','stroke-width':5,'stroke-linecap':'round'}));
    picture.append(svg('rect',{x:pan.x-25,y:py-26,width:50,height:25,rx:6,fill:'#e8bf6c',stroke:'#a47c31'}));
    picture.append(svg('text',{x:pan.x,y:py-9,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#4b3519'},pan.value+' kg'));
   }
   frame.append(picture);
   const sentence=doc.createElement('p');sentence.className='g74-cw-balance';
   sentence.textContent=tilt.relation==='BALANCED'?'Hai bên cân bằng':tilt.relation==='LEFT_LIGHTER'?'Đĩa trái nhẹ hơn, nằm cao hơn':'Đĩa phải nhẹ hơn, nằm cao hơn';
   frame.append(sentence);
   const grid=doc.createElement('div');grid.className='g74-cw-two';
   for(const item of plan.items){
    const amount=s.quantities[item.id],panel=doc.createElement('div');panel.className='g74-cw-panel';
    const name=doc.createElement('strong');name.textContent=item.label+' · '+amount+' kg';panel.append(name);
    const controls=doc.createElement('div');controls.className='g74-cw-controls';
    const minus=button('− 1 kg',()=>engine.adjust(item.id,-1)),plus=button('+ 1 kg',()=>engine.adjust(item.id,1));
    minus.disabled=amount===0;plus.disabled=amount===100;
    controls.append(minus,plus);panel.append(controls);asset(panel,item);grid.append(panel);
   }
   frame.append(grid);board.append(frame);
   status.textContent='Độ chênh: '+Math.abs(l-r)+' kg. Đây là mô phỏng cân đĩa – chưa chấm.';
  }
  function render(){if(disposed)return;board.replaceChildren();if(plan.mode==='LITER')renderLiter();else renderWeight();}
  render();
  return Object.freeze({ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const r=engine.restore(d);if(r.ok)notify();return r;},
   clear(){const r=engine.clear();notify();return r;},
   destroy(){if(disposed)return;disposed=true;root.remove();}
  });
 }
 return Object.freeze({mount,literGeometry});
});
