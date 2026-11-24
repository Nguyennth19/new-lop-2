'use strict';
// Review-only public model validation and answer-free input session. No grading, no runtime registration.
const int=(n,a=0,b=100)=>Number.isInteger(n)&&n>=a&&n<=b;
const exact=(o,k)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===k.slice().sort().join('|');
function compile(p){
 if(!exact(p,['kind','model']))throw Error('SCHEMA');const {kind,model:m}=p,fields=[];
 const add=(id,max=100)=>fields.push({id,max});
 if(kind==='PLACE_VALUE'||kind==='NEIGHBOR_TABLE'){
  if(!exact(m,['rows'])||!Array.isArray(m.rows)||m.rows.length<1||m.rows.length>6)throw Error('ROWS');
  const keys=kind==='PLACE_VALUE'?['number','tens','ones']:['previous','given','next'];
  m.rows.forEach((r,i)=>{
   if(!exact(r,keys)||!keys.every(k=>r[k]===null||int(r[k],0,kind==='PLACE_VALUE'&&k!=='number'?9:100)))throw Error('CELL');
   if(kind==='PLACE_VALUE'){
    if(r.number===100||r.number===null&&(r.tens===null||r.ones===null)||r.number!==null&&r.tens!==null&&Math.floor(r.number/10)!==r.tens||r.number!==null&&r.ones!==null&&r.number%10!==r.ones)throw Error('PLACE_VALUE');
   }else{
    const n=r.given!==null?r.given:r.previous!==null?r.previous+1:r.next!==null?r.next-1:null;
    if(!int(n,1,99)||r.previous!==null&&r.previous!==n-1||r.next!==null&&r.next!==n+1)throw Error('NEIGHBOR');
   }
   if(!keys.some(k=>r[k]===null))throw Error('NO_BLANK');
   keys.filter(k=>r[k]===null).forEach(k=>add('r'+i+'_'+k,kind==='PLACE_VALUE'&&k!=='number'?9:100));
  });
 }else if(kind==='NUMBER_LINE'||kind==='NUMBER_LINE_POSITION'){
  const pos=kind==='NUMBER_LINE_POSITION';
  if(!exact(m,pos?['start','step','ticks','target']:['start','step','ticks'])||!int(m.start)||!int(m.step,1,10)||!Array.isArray(m.ticks)||m.ticks.length<3||m.ticks.length>11||!int(m.start+(m.ticks.length-1)*m.step)||m.ticks[0]!==m.start||!m.ticks.every((v,i)=>v===null||v===m.start+i*m.step))throw Error('TICKS');
  if(pos){if(m.ticks.includes(null)||!int(m.target)||!m.ticks.includes(m.target))throw Error('POSITION');add('tickIndex',m.ticks.length-1);}
  else {m.ticks.forEach((v,i)=>{if(v===null)add('tick'+i);});if(!fields.length)throw Error('NO_BLANK');}
 }else if(kind==='INEQUALITY_INPUT'){
  if(!exact(m,['lower','upper'])||!int(m.lower)||!int(m.upper)||m.upper-m.lower<2)throw Error('INTERVAL');add('number');
 }else throw Error('KIND');
 return {kind,model:JSON.parse(JSON.stringify(m)),fields};
}
function session(plan){
 const values=Object.create(null);
 return {set(id,v){const f=plan.fields.find(x=>x.id===id);if(!f||typeof v!=='string'||!(/^(?:0|[1-9][0-9]{0,2})?$/.test(v))||v!==''&&!int(Number(v),0,f.max))return false;values[id]=v;return true;},clear(){for(const k of Object.keys(values))delete values[k];},snapshot(){return {...values};}};
}
module.exports={compile,session};
