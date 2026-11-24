'use strict';
// Private QA only. Not imported by a public view, never an authorization to grade.
function expected(plan){const {kind,model:m}=plan,out={};for(const f of plan.fields){
 if(kind==='PLACE_VALUE'||kind==='NEIGHBOR_TABLE'){
  const [,i,k]=f.id.match(/^r(\d+)_(\w+)$/),r=m.rows[Number(i)];
  if(kind==='PLACE_VALUE'){const n=r.number??r.tens*10+r.ones;out[f.id]=k==='number'?n:k==='tens'?Math.floor(n/10):n%10;}
  else{const n=r.given??(r.previous!==null?r.previous+1:r.next-1);out[f.id]=k==='given'?n:k==='previous'?n-1:n+1;}
 }else if(kind==='NUMBER_LINE')out[f.id]=m.start+Number(f.id.slice(4))*m.step;
 else if(kind==='NUMBER_LINE_POSITION')out[f.id]=(m.target-m.start)/m.step;
 else out[f.id]=Array.from({length:m.upper-m.lower-1},(_,i)=>m.lower+i+1);
 }return out;}
function grade(plan,answers){const e=expected(plan);return Object.keys(answers).length===Object.keys(e).length&&Object.entries(e).every(([k,v])=>typeof answers[k]==='string'&&/^(0|[1-9][0-9]{0,2})$/.test(answers[k])&&(Array.isArray(v)?v.includes(Number(answers[k])):v===Number(answers[k])));}
module.exports={expected,grade};
