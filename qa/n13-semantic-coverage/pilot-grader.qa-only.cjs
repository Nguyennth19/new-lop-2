'use strict';
// QA-only server-side module, never import into browser. No real student authority or storage.
const {createHash}=require('node:crypto'),{compile}=require('./b1-composite-core.cjs'),oracle=require('./trusted-oracle.qa-only.cjs'),pack=require('./pilot-lessons.review.json');
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===keys.slice().sort().join('|');
const choiceRubrics=Object.freeze({PV_B001_PLACE_VALUE_S1031:{a:['c3']},N13B1_SYNTH_5:{b:['y','z']},N13B1_SYNTH_6:{a:['x']}});
const matchingRubrics=Object.freeze({N13B1_SYNTH_4:{a:{l1:'tick_3',l2:'tick_0',l3:'tick_2',l4:'tick_1'}}});
function get(lessonId,variantId){return pack.lessons.find(x=>x.lessonId===lessonId)?.questions.find(x=>x.variantId===variantId);}
function dtoDigest(q){return hash([q.lessonId,q.variantId,q.level,q.reviewDto]);}
function numberMatch(s,v){return typeof s==='string'&&/^(0|[1-9][0-9]{0,2})$/.test(s)&&(Array.isArray(v)?v.includes(Number(s)):Number(s)===v);}
function partCorrect(q,p,a){
 if(p.kind==='SEMANTIC')return !!a&&oracle.grade(p.plan,a);
 if(p.kind==='EXPANDED'){const slots=p.plan.slots.filter(v=>v.value===null);return exact(a,slots.map(v=>v.id))&&slots.every(v=>numberMatch(a[v.id],v.role.endsWith('TENS')?Math.floor(p.plan.number/10)*10:p.plan.number%10));}
 if(p.kind==='D4'){const ids=choiceRubrics[q.variantId]?.[p.id];return !!ids&&exact(a,['questionId','selectedOptionIds'])&&a.questionId===p.plan.questionId&&Array.isArray(a.selectedOptionIds)&&a.selectedOptionIds.length===ids.length&&new Set(a.selectedOptionIds).size===ids.length&&ids.every(v=>a.selectedOptionIds.includes(v));}
 if(p.kind==='COORD_MATCH'){const pairs=matchingRubrics[q.variantId]?.[p.id];return !!pairs&&exact(a,['exerciseId','pairs','selectedLeft','completed','total'])&&a.exerciseId===p.plan.exerciseId&&a.selectedLeft===null&&a.completed===p.plan.pairCount&&a.total===p.plan.pairCount&&exact(a.pairs,Object.keys(pairs))&&Object.entries(pairs).every(([k,v])=>a.pairs[k]===v);}
 return false;
}
function grade(req){const deny=()=>({ok:false,reason:'QA_REQUEST_DENIED',studentRelease:false,writes:0});if(!exact(req,['mode','lessonId','variantId','dtoSha256','submission'])||req.mode!=='OFFLINE_QA_ONLY')return deny();const q=get(req.lessonId,req.variantId);if(!q||dtoDigest(q)!==req.dtoSha256)return deny();const parts=compile(q.reviewDto.parts);if(!exact(req.submission,parts.map(x=>x.id)))return deny();return {ok:true,allCorrect:parts.every(p=>partCorrect(q,p,req.submission[p.id])),studentRelease:false,writes:0,scope:'OFFLINE_QA_ONLY'};}
module.exports={grade,dtoDigest};
