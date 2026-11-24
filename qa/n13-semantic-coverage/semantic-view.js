/* Isolated N13 DEV preview. No score, network, official route, or private oracle. */
(function(root){
'use strict';
const labels={number:'Số',tens:'Chục',ones:'Đơn vị',previous:'Số liền trước',given:'Số đã cho',next:'Số liền sau'};
const prompts={PLACE_VALUE:'Điền số vào ô trống: số, chục và đơn vị.',NUMBER_LINE:'Điền số còn thiếu trên tia số.',NUMBER_LINE_POSITION:'Chọn vị trí của số trên tia số.',NEIGHBOR_TABLE:'Điền số liền trước và số liền sau.',INEQUALITY_INPUT:'Điền một số nằm giữa hai số đã cho.'};
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
function mount(host,preview,{fallback=false,onSpeak=()=>{}}={}){
 const plan=root.N13SemanticCore.compile(preview),session=root.N13SemanticCore.session(plan),m=plan.model,kind=plan.kind;host.replaceChildren();host.className='n13-preview';
 const visible=[prompts[kind]],title=el('h2',prompts[kind]);host.append(title);
 const controls=[],body=el('div',undefined,'n13-body');host.append(body);
 function input(id,label){const e=el('input');e.type='text';e.inputMode='numeric';e.maxLength=3;e.autocomplete='off';e.setAttribute('aria-label',label);e.dataset.field=id;e.addEventListener('input',()=>{if(!session.set(id,e.value))e.value=session.snapshot()[id]||'';});controls.push(e);return e;}
 function table(keys){const t=el('table'),thead=el('thead'),hr=el('tr');keys.forEach(k=>{const h=el('th',labels[k]);h.scope='col';hr.append(h);});thead.append(hr);t.append(thead);const b=el('tbody');m.rows.forEach((row,i)=>{const tr=el('tr');keys.forEach(k=>{const td=el('td');if(row[k]===null){td.append(input('r'+i+'_'+k,'Hàng '+(i+1)+', '+labels[k]));visible.push('Hàng '+(i+1)+', '+labels[k]+', ô trống.');}else{td.textContent=String(row[k]);visible.push('Hàng '+(i+1)+', '+labels[k]+': '+row[k]+'.');}tr.append(td);});b.append(tr);});t.append(b);body.append(t);}
 if(kind==='PLACE_VALUE')table(['number','tens','ones']);
 else if(kind==='NEIGHBOR_TABLE')table(['previous','given','next']);
 else if(kind==='NUMBER_LINE'||kind==='NUMBER_LINE_POSITION'){
  const pos=kind==='NUMBER_LINE_POSITION';if(pos){body.append(el('p','Số cần tìm: '+m.target));visible.push('Số cần tìm: '+m.target+'.');}
  if(m.start!==0){body.append(el('p','Đoạn hiển thị của tia số bắt đầu từ '+m.start+'.'));visible.push('Đoạn hiển thị bắt đầu từ '+m.start+'.');}
  const wrap=el('div',undefined,'n13-line-wrap'),line=el('div',undefined,fallback?'n13-line-fallback':'n13-line');line.setAttribute('aria-label','Các vạch cách đều theo chiều tăng');line.style.setProperty('--tick-count',String(m.ticks.length));wrap.append(line);body.append(wrap);
  m.ticks.forEach((v,i)=>{const tick=el('div',undefined,'n13-tick');tick.dataset.tick=String(i);if(fallback)tick.append(el('span','Vạch '+(i+1)+': '));if(pos){const b=el('button',String(v));b.type='button';b.dataset.field='tickIndex';b.setAttribute('aria-label','Vạch '+(i+1)+', số '+v);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{session.set('tickIndex',String(i));controls.forEach(c=>c.setAttribute('aria-pressed',String(c===b)));});controls.push(b);tick.append(b);}else if(v===null)tick.append(input('tick'+i,'Vạch '+(i+1)+', ô trống'));else tick.append(el('span',String(v)));
   visible.push('Vạch '+(i+1)+': '+(v===null?'ô trống':v)+'.');line.append(tick);});
 }else{const p=el('p',undefined,'n13-equation');p.append(el('span',String(m.lower)+' < '),input('number','Số nằm giữa'),el('span',' < '+String(m.upper)));body.append(p);visible.push(m.lower+' < ô trống < '+m.upper+'.');}
 const actions=el('div',undefined,'n13-actions'),clear=el('button','Xóa câu trả lời'),speak=el('button','Đọc đề');clear.type=speak.type='button';clear.addEventListener('click',()=>{session.clear();controls.forEach(c=>{if(c.tagName==='INPUT')c.value='';else c.setAttribute('aria-pressed','false');});});speak.addEventListener('click',()=>{const text=visible.join('\n');onSpeak(root.G75V2?root.G75V2.segments(text):[{text}]);});actions.append(clear,speak);host.append(actions);
 return {snapshot:session.snapshot,visibleText:()=>visible.join('\n')};
}
root.N13SemanticView={mount};
})(window);
