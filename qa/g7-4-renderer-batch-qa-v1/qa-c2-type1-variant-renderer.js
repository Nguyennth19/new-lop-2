'use strict';
/* G7.4 QA-C.2 TEST-only Type1 variant renderer.
   Renders original-inspired two-panel layout from a public plan; never grades.
   Does not mutate/parse/hijack original demo HTML or bundle answer keys.
*/
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else if(root)root.G74Type1C2=api;})(typeof window!=='undefined'?window:null,function(){
 const ids=['t1_split1','t1_split2','t1_ten','t1_ans','t1_dm','t1_m'];
 const validPublic=(v)=>!!v&&v.ok===true&&v.data&&
   ['a','b','dm','m'].every(k=>Number.isSafeInteger(v.data[k]))&&
   Array.isArray(v.slots)&&v.slots.length===6&&
   ids.every(id=>v.slots.some(s=>s.id===id&&s.value===null&&s.role==='ANSWER_INPUT'))&&
   !['answer','answerKey','correctValue','expectedAnswer','solution'].some(k=>Object.hasOwn(v,k));
 function mount(host,plan,opts={}){
  if(!host||typeof host.replaceChildren!=='function'||!validPublic(plan))return {ok:false,reason:'INVALID_PUBLIC_PLAN'};
  if(!host.ownerDocument)return {ok:false,reason:'INVALID_HOST'};
  const d=host.ownerDocument,values=Object.create(null),a=plan.data.a,b=plan.data.b,dm=plan.data.dm,m=plan.data.m;
  let active='t1_split1';const node=(tag,cls,txt)=>{let e=d.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e};
  const stage=node('section','g74t1-stage');
  stage.dataset.variantId=plan.caseId;
  const title=node('h2','g74t1-title','Điền số: '+a+' + '+b+' và đổi đơn vị độ dài');stage.append(title);
  const columns=node('div','g74t1-columns');stage.append(columns);
  const left=node('section','g74t1-card bond'),right=node('section','g74t1-card units');columns.append(left,right);
  left.append(node('h3','','✨ Phần A: Tách số cho đủ chục ('+a+' + '+b+')'));
  const picture=node('div','g74t1-bond');
  const top=node('div','g74t1-bond-top');top.append(node('span','g74t1-a',a),node('span','', '+'),node('span','g74t1-b',b));picture.append(top);
  const svg=d.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 260 70');svg.setAttribute('aria-hidden','true');
  const path=d.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M180 2L100 65M180 2L230 65');path.setAttribute('fill','none');path.setAttribute('stroke','#16a085');path.setAttribute('stroke-width','4');svg.append(path);picture.append(svg);
  const children=node('div','g74t1-bond-children');picture.append(children);
  const slots=new Map();
  function slot(id,max=3){
    const b=node('button','g74t1-slot','?');b.type='button';b.id='slot_'+id;b.dataset.slot=id;b.dataset.maxlength=String(max);
    b.setAttribute('aria-label','Ô trả lời '+id);b.setAttribute('aria-pressed','false');b.onclick=()=>select(id);slots.set(id,b);return b;
  }
  children.append(slot('t1_split1',1),slot('t1_split2',1));left.append(picture);
  const steps=node('div','g74t1-steps');
  function eq(parts){const row=node('div','g74t1-equation');for(const p of parts)row.append(typeof p==='string'?node('span','',p):slot(p.id,p.max));steps.append(row)}
  eq([a+' + ',{id:'t1_split1',max:1},' = ',{id:'t1_ten',max:2}]);
  eq(['10 + ',{id:'t1_split2',max:1},' = ',{id:'t1_ans',max:2}]);left.append(steps);
  right.append(node('h3','','📏 Phần B: Quy đổi đơn vị đo độ dài'));
  function unit(amount,u,id){const row=node('div','g74t1-unit');row.append(node('strong','',amount+' '+u+' = '),slot(id,4),node('strong','','cm'));right.append(row)}
  unit(dm,'dm','t1_dm');unit(m,'m','t1_m');
  right.append(node('p','g74t1-tip','Chạm vào ô trống, sau đó dùng bàn phím Toán phía dưới.'));
  const pad=node('section','g74t1-numpad');pad.setAttribute('aria-label','Bàn phím số Toán lớp 2');const indicator=node('div','g74t1-status','Ô đang chọn: '+active);pad.append(indicator);
  const grid=node('div','g74t1-pad-grid');pad.append(grid);
  function select(id){if(!slots.has(id))return;active=id;for(const [key,button] of slots){const on=key===id;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on))}indicator.textContent='Ô đang chọn: '+id;}
  function input(c){if(!slots.has(active))return;const button=slots.get(active),max=Number(button.dataset.maxlength);let val=values[active]||'';
    if(c==='BACK')val=val.slice(0,-1);else if(c==='CLR')val='';else if(/^\d$/.test(c))val=val.length>=max?c:val+c;else return;
    values[active]=val;button.textContent=val||'?';button.dataset.empty=String(val==='');
    if(typeof opts.onChange==='function')opts.onChange({variantId:plan.caseId,values:{...values},active});
  }
  for(const c of ['1','2','3','4','5','6','7','8','9','CLR','0','BACK']){
   const label=c==='CLR'?'Xóa':c==='BACK'?'⌫':c;const btn=node('button','g74t1-pad-key',label);btn.type='button';btn.dataset.key=c;
   btn.setAttribute('aria-label',c==='CLR'?'Xóa ô hiện tại':c==='BACK'?'Xóa chữ số cuối':label);
   btn.addEventListener('click',()=>input(c));grid.append(btn);
  }
  const controls=node('div','g74t1-controls');const reset=node('button','','↺ Làm lại');reset.type='button';
  reset.onclick=()=>{for(const [id,b] of slots){delete values[id];b.textContent='?';b.dataset.empty='true';}select(ids[0]);if(typeof opts.onChange==='function')opts.onChange({variantId:plan.caseId,values:{},reset:true})};controls.append(reset);
  const note=node('p','g74t1-warning','TEST: chỉ thu ô nhập, không chấm, không đọc đáp án, không cộng sao.');controls.append(note);
  host.replaceChildren(stage,pad,controls);select(active);
  return {ok:true,collect:()=>({variantId:plan.caseId,fields:{...values}}),reset:()=>reset.click(),select,input,slots};
 }
 return Object.freeze({validPublic,mount});
});
