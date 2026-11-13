/* G7.4 Measurement V1.1 TEST view. SVG ruler drag + clock; no grading or writes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLMeasurementViewV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 function mount(host,plan,opts={}){
  if(!host||!host.ownerDocument||!plan||plan.schemaVersion!=='g74-measurement-v11'||
     typeof KLMeasurementV11==='undefined')return {ok:false,reason:'INVALID_HOST_OR_CORE'};
  const doc=host.ownerDocument,engine=KLMeasurementV11.session(plan);
  const root=doc.createElement('section');root.className='g74-measurement-v11';root.dataset.g74MeasurementV11=plan.exerciseId;
  const title=doc.createElement('h3');title.textContent=plan.prompt;const stage=doc.createElement('div');
  const status=doc.createElement('p');status.className='g74-measure-status';status.setAttribute('aria-live','polite');
  root.append(title,status,stage);host.append(root);
  let destroyed=false,cleanup=()=>{};
  const el=(name,attrs={},text)=>{
   const n=doc.createElementNS(NS,name);
   for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));
   if(text!==undefined)n.textContent=String(text);return n;
  };
  const button=(name,fn)=>{const b=doc.createElement('button');b.type='button';b.className='g74-measure-btn';b.textContent=name;b.addEventListener('click',fn);return b;};
  function notify(){if(destroyed)return;render();if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());}
  function ruler(){
   const m=plan.model,s=engine.snapshot(),frame=doc.createElement('div');frame.className='g74-ruler-panel';
   const svg=el('svg',{viewBox:'0 0 420 155',role:'img','aria-label':'Thước kẻ ảo và đoạn thẳng AB'});
   svg.classList.add('g74-ruler-svg');
   const a=m.segmentStart,b=m.segmentEnd;
   svg.append(el('line',{x1:a,y1:22,x2:a,y2:138,stroke:'#f3a32c','stroke-width':2,'stroke-dasharray':'5 5'}));
   svg.append(el('line',{x1:a,y1:50,x2:b,y2:50,stroke:'#2474d8','stroke-width':6,'stroke-linecap':'round'}));
   for(const [x,label] of [[a,'A'],[b,'B']]){
    svg.append(el('circle',{cx:x,cy:50,r:5,fill:'#1d60bb'}));
    svg.append(el('text',{x,y:34,'text-anchor':'middle',fill:'#1b447f','font-size':17,'font-weight':700},label));
   }
   const ruler=el('g',{transform:'translate('+s.rulerZero+' 72)'});
   ruler.classList.add('g74-ruler-grab');
   ruler.append(el('rect',{x:0,y:0,width:m.rulerUnits*m.pixelsPerUnit+20,height:56,rx:8,fill:'#fde266',stroke:'#c9971a','stroke-width':3}));
   for(let i=0;i<=m.rulerUnits;i++){
    let x=i*m.pixelsPerUnit;
    ruler.append(el('line',{x1:x,y1:0,x2:x,y2:19,stroke:'#554818','stroke-width':2}));
    ruler.append(el('text',{x,y:38,'text-anchor':'middle',fill:'#584819','font-size':12},i));
    if(i<m.rulerUnits)ruler.append(el('line',{x1:x+m.pixelsPerUnit/2,y1:0,x2:x+m.pixelsPerUnit/2,y2:10,stroke:'#7b6520'}));
   }
   svg.append(ruler);frame.append(svg);
   const controls=doc.createElement('div');controls.className='g74-measure-controls';
   controls.append(button('🎯 Căn vạch 0 tại A',()=>{engine.setRulerZero(a);notify();}));
   const line=doc.createElement('label');line.textContent='Đoạn AB dài: ';
   const input=doc.createElement('input');input.type='text';input.inputMode='decimal';input.maxLength=8;
   input.value=s.enteredLength;input.setAttribute('aria-label','Độ dài đoạn AB');
   input.addEventListener('input',()=>{const previous=engine.snapshot().enteredLength;const res=engine.setLength(input.value);
     if(!res.ok)input.value=previous;else{status.textContent='Đã nhập '+input.value+' '+m.unit+' (chưa chấm)';if(typeof opts.onChange==='function')opts.onChange(engine.snapshot());}
   });
   line.append(input,doc.createTextNode(' '+m.unit));controls.append(line);frame.append(controls);stage.append(frame);
   // Pointer capture remains on the stable svg throughout movement; do not rerender on pointermove.
   let drag=null;
   const pos=e=>{
    const ctm=svg.getScreenCTM();
    if(!ctm||!ctm.inverse)return null;
    const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;
    const v=p.matrixTransform(ctm.inverse());return v.x;
   };
   const onDown=e=>{
    if(e.button!==0)return;const x=pos(e);if(x===null)return;
    drag={id:e.pointerId,offset:x-engine.snapshot().rulerZero};
    try{svg.setPointerCapture(e.pointerId)}catch(_){}
    e.preventDefault();
   };
   const onMove=e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const x=pos(e);if(x===null)return;
    let z=Math.max(0,Math.min(300,x-drag.offset));
    if(Math.abs(z-a)<12)z=a;
    engine.setRulerZero(Math.round(z*100)/100);
    ruler.setAttribute('transform','translate('+engine.snapshot().rulerZero+' 72)');
    status.textContent='Đang di chuyển thước – chưa chấm đúng/sai';
   };
   const onEnd=e=>{
    if(drag&&drag.id===e.pointerId){drag=null;
     try{svg.releasePointerCapture(e.pointerId)}catch(_){}
     notify();
    }
   };
   ruler.addEventListener('pointerdown',onDown);svg.addEventListener('pointermove',onMove);
   svg.addEventListener('pointerup',onEnd);svg.addEventListener('pointercancel',onEnd);
   cleanup=()=>{ruler.removeEventListener('pointerdown',onDown);svg.removeEventListener('pointermove',onMove);
    svg.removeEventListener('pointerup',onEnd);svg.removeEventListener('pointercancel',onEnd);};
   status.textContent='Vạch 0 hiện ở tọa độ '+s.rulerZero+'. Chưa chấm đúng/sai.';
  }
  function clock(){
   const s=engine.snapshot(),frame=doc.createElement('div');frame.className='g74-clock-panel';
   const svg=el('svg',{viewBox:'0 0 220 220',role:'img','aria-label':'Đồng hồ đang chỉ '+s.hour+' giờ '+s.minute+' phút'});
   svg.classList.add('g74-clock-svg');
   svg.append(el('circle',{cx:110,cy:110,r:99,fill:'#fff',stroke:'#e7a93b','stroke-width':7}));
   for(let n=1;n<=12;n++){
    const a=(n*30-90)*Math.PI/180;
    svg.append(el('text',{x:110+78*Math.cos(a),y:115+78*Math.sin(a),'text-anchor':'middle',
     'font-size':17,'font-weight':700,fill:'#25354a'},n));
   }
   function hand(degrees,radius,color,width){
    const a=(degrees-90)*Math.PI/180;
    svg.append(el('line',{x1:110,y1:110,x2:110+radius*Math.cos(a),
     y2:110+radius*Math.sin(a),stroke:color,'stroke-width':width,'stroke-linecap':'round'}));
   }
   hand((s.hour%12)*30+s.minute/2,49,'#e65353',7);
   hand(s.minute*6,69,'#2769d6',5);
   svg.append(el('circle',{cx:110,cy:110,r:6,fill:'#29374f'}));frame.append(svg);
   const controls=doc.createElement('div');controls.className='g74-measure-controls';
   const display=doc.createElement('strong');display.textContent='Đồng hồ đang chỉ: '+s.hour+' giờ '+String(s.minute).padStart(2,'0')+' phút';
   controls.append(display);
   for(const [label,run] of [
    ['🔵 +'+plan.model.minuteStep+' phút',()=>engine.incrementMinute(plan.model.minuteStep)],
    ['🔵 −'+plan.model.minuteStep+' phút',()=>engine.incrementMinute(-plan.model.minuteStep)],
    ['🔴 +1 giờ',()=>engine.incrementHour(1)],
    ['🔴 −1 giờ',()=>engine.incrementHour(-1)]
   ])controls.append(button(label,()=>{const result=run();if(result.ok)notify();}));
   frame.append(controls);stage.append(frame);
   status.textContent='Đồng hồ đã điều chỉnh – chưa chấm đúng/sai.';
  }
  function render(){if(destroyed)return;cleanup();cleanup=()=>{};stage.replaceChildren();
   if(plan.mode==='RULER')ruler();else clock();}
  render();
  return Object.freeze({ok:true,snapshot:()=>engine.snapshot(),
   restore(d){const res=engine.restore(d);if(res.ok)notify();return res;},
   clear(){const res=engine.clear();notify();return res;},
   destroy(){if(destroyed)return;destroyed=true;cleanup();root.remove();}
  });
 }
 return Object.freeze({mount});
});
