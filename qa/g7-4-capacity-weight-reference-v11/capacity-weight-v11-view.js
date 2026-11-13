/* G7.4 8-A / 8-B standalone TEST view. SVG is mathematical visualization.
 * Scaled measurements, not real physical liters/kg. Uses trusted engine-only state.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLCapacityWeightViewV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
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
  function renderLiter(){
   const state=engine.snapshot(),grid=doc.createElement('div');grid.className='g74-cw-two';
   for(const item of plan.items){
    const now=state.quantities[item.id],panel=doc.createElement('div');panel.className='g74-cw-panel';
    const label=doc.createElement('strong');label.textContent=item.label;panel.append(label);
    const picture=svg('svg',{viewBox:'0 0 160 220',role:'img','aria-label':item.label+': '+now+' trong '+item.capacityLiters+' lít'});
    const defs=svg('defs'),clip=svg('clipPath',{id:'g74cw_'+plan.exerciseId+'_'+item.id});
    clip.append(svg('path',{d:'M46 19 H114 V42 C125 53 135 58 135 85 V191 Q135 206 118 206 H42 Q25 206 25 191 V85 C25 58 35 53 46 42 Z'}));
    defs.append(clip);picture.append(defs);
    picture.append(svg('path',{d:'M46 19 H114 V42 C125 53 135 58 135 85 V191 Q135 206 118 206 H42 Q25 206 25 191 V85 C25 58 35 53 46 42 Z',fill:'#e4f4ff',stroke:'#4a81ac','stroke-width':3}));
    const top=205-now/item.capacityLiters*145;
    picture.append(svg('rect',{x:23,y:top,width:114,height:205-top,fill:'#5ab5e9','clip-path':'url(#g74cw_'+plan.exerciseId+'_'+item.id+')'}));
    picture.append(svg('rect',{x:52,y:10,width:56,height:10,rx:3,fill:'#87accc'}));
    picture.append(svg('text',{x:80,y:136,'text-anchor':'middle','font-size':25,'font-weight':800,fill:'#164e78'},now+' L'));
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
 return Object.freeze({mount});
});
