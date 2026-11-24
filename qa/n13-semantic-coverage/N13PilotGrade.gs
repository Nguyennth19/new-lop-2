/** Generated from existing QA modules; synthetic Owner review only. No learner/write authority. */
const N13_PILOT_GAS_REVIEW_ = null;
function n13PilotDigest_(text){
 return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
}
function n13PilotExact_(o,keys){return o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===keys.slice().sort().join('|');}
function n13PilotReviewAllowed_(c,env){
 if(!n13PilotExact_(c,['projectIdSha256','ownerEmail','issuedAt','expiresAt','packSha256'])||!(/^[a-f0-9]{64}$/).test(c.projectIdSha256)||typeof c.ownerEmail!=='string'||!c.ownerEmail||c.packSha256!==n13PilotPackSha_())return false;
 const t=env.now(),a=Date.parse(c.issuedAt),b=Date.parse(c.expiresAt);
 return Number.isFinite(t)&&Number.isFinite(a)&&Number.isFinite(b)&&a<=t&&t<b&&b-a<=900000&&n13PilotDigest_(env.project())===c.projectIdSha256&&env.active()===c.ownerEmail&&env.effective()===c.ownerEmail;
}
function n13PilotDeny_(){return {ok:false,reason:'N13_GAS_REVIEW_DENIED',studentRelease:false,writes:0};}
function n13PilotGradeDispatch_(req,c,env){
 try{
  if(!n13PilotReviewAllowed_(c,env)||!n13PilotExact_(req,['mode','lessonId','variantId','dtoSha256','submission'])||req.mode!=='OWNER_SYNTHETIC_REVIEW'||JSON.stringify(req).length>8192)return n13PilotDeny_();
  const result=n13PilotPrivateModule_().grade(Object.assign({},req,{mode:'OFFLINE_QA_ONLY'}));
  return result.ok?{ok:true,allCorrect:result.allCorrect,studentRelease:false,writes:0,scope:'OWNER_SYNTHETIC_REVIEW'}:n13PilotDeny_();
 }catch(e){return n13PilotDeny_();}
}
function n13PilotReviewGrade(req){
 if(!N13_PILOT_GAS_REVIEW_)return n13PilotDeny_();
 return n13PilotGradeDispatch_(req,N13_PILOT_GAS_REVIEW_,{now:()=>Date.now(),project:()=>ScriptApp.getScriptId(),active:()=>Session.getActiveUser().getEmail(),effective:()=>Session.getEffectiveUser().getEmail()});
}
function n13PilotPackSha_(){return n13PilotDigest_("{\"lessons\":[{\"lessonId\":\"MATH_B001\",\"questions\":[{\"lessonId\":\"MATH_B001\",\"variantId\":\"N13B1_SYNTH_1\",\"level\":\"LV1\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"EXPANDED\",\"model\":{\"number\":43,\"slots\":[{\"id\":\"branchT\",\"role\":\"BRANCH_TENS\",\"value\":40},{\"id\":\"b1\",\"role\":\"BRANCH_ONES\",\"value\":null},{\"id\":\"sumT\",\"role\":\"SUM_TENS\",\"value\":40},{\"id\":\"s1\",\"role\":\"SUM_ONES\",\"value\":null}]}},{\"id\":\"b\",\"kind\":\"EXPANDED\",\"model\":{\"number\":76,\"slots\":[{\"id\":\"b2\",\"role\":\"BRANCH_TENS\",\"value\":null},{\"id\":\"branchO\",\"role\":\"BRANCH_ONES\",\"value\":6},{\"id\":\"s2\",\"role\":\"SUM_TENS\",\"value\":null},{\"id\":\"sumO\",\"role\":\"SUM_ONES\",\"value\":6}]}},{\"id\":\"c\",\"kind\":\"EXPANDED\",\"model\":{\"number\":28,\"slots\":[{\"id\":\"b3\",\"role\":\"BRANCH_TENS\",\"value\":null},{\"id\":\"b4\",\"role\":\"BRANCH_ONES\",\"value\":null},{\"id\":\"s3\",\"role\":\"SUM_TENS\",\"value\":null},{\"id\":\"s4\",\"role\":\"SUM_ONES\",\"value\":null}]}}]}},{\"lessonId\":\"MATH_B001\",\"variantId\":\"N13B1_SYNTH_2\",\"level\":\"LV2\",\"reviewDto\":{\"parts\":[{\"id\":\"r0\",\"kind\":\"EXPANDED\",\"model\":{\"number\":32,\"slots\":[{\"id\":\"t\",\"role\":\"SUM_TENS\",\"value\":null},{\"id\":\"o\",\"role\":\"SUM_ONES\",\"value\":null}]}},{\"id\":\"r1\",\"kind\":\"EXPANDED\",\"model\":{\"number\":81,\"slots\":[{\"id\":\"t\",\"role\":\"SUM_TENS\",\"value\":null},{\"id\":\"o\",\"role\":\"SUM_ONES\",\"value\":null}]}},{\"id\":\"r2\",\"kind\":\"EXPANDED\",\"model\":{\"number\":46,\"slots\":[{\"id\":\"t\",\"role\":\"SUM_TENS\",\"value\":null},{\"id\":\"o\",\"role\":\"SUM_ONES\",\"value\":null}]}}]}},{\"lessonId\":\"MATH_B001\",\"variantId\":\"PV_B001_PLACE_VALUE_S1031\",\"level\":\"LV1\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"D4\",\"model\":{\"questionId\":\"PV_B001_PLACE_VALUE_S1031\",\"selectionMode\":\"SINGLE\",\"prompt\":{\"type\":\"TEXT\",\"text\":\"Số gồm 4 chục và 5 đơn vị là số nào?\"},\"options\":[{\"id\":\"c1\",\"content\":{\"type\":\"TEXT\",\"text\":\"44\"}},{\"id\":\"c2\",\"content\":{\"type\":\"TEXT\",\"text\":\"54\"}},{\"id\":\"c3\",\"content\":{\"type\":\"TEXT\",\"text\":\"45\"}},{\"id\":\"c4\",\"content\":{\"type\":\"TEXT\",\"text\":\"46\"}}],\"speechEnabled\":true}}]}},{\"lessonId\":\"MATH_B001\",\"variantId\":\"N13B_SYNTH_1\",\"level\":\"LV1\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"PLACE_VALUE\",\"model\":{\"rows\":[{\"number\":47,\"tens\":null,\"ones\":null},{\"number\":null,\"tens\":6,\"ones\":0}]}}}]}},{\"lessonId\":\"MATH_B001\",\"variantId\":\"N13B_SYNTH_2\",\"level\":\"LV2\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"PLACE_VALUE\",\"model\":{\"rows\":[{\"number\":82,\"tens\":null,\"ones\":2},{\"number\":35,\"tens\":3,\"ones\":null}]}}}]}}]},{\"lessonId\":\"MATH_B002\",\"questions\":[{\"lessonId\":\"MATH_B002\",\"variantId\":\"N13B1_SYNTH_3\",\"level\":\"LV1\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"NUMBER_LINE\",\"model\":{\"start\":0,\"step\":1,\"ticks\":[0,null,null,null,null,null,6]}}},{\"id\":\"b\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"NUMBER_LINE\",\"model\":{\"start\":20,\"step\":2,\"ticks\":[20,null,null,null,null,null,32]}}}]}},{\"lessonId\":\"MATH_B002\",\"variantId\":\"N13B1_SYNTH_4\",\"level\":\"LV1\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"COORD_MATCH\",\"model\":{\"start\":0,\"step\":2,\"tickCount\":4,\"labels\":[{\"id\":\"l1\",\"text\":\"2 + 4\"},{\"id\":\"l2\",\"text\":\"0\"},{\"id\":\"l3\",\"text\":\"6 - 2\"},{\"id\":\"l4\",\"text\":\"2\"}]}}]}},{\"lessonId\":\"MATH_B002\",\"variantId\":\"N13B1_SYNTH_5\",\"level\":\"LV2\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"NUMBER_LINE\",\"model\":{\"start\":30,\"step\":1,\"ticks\":[30,null,32,null,34]}}},{\"id\":\"b\",\"kind\":\"D4\",\"model\":{\"questionId\":\"b\",\"selectionMode\":\"MULTIPLE\",\"prompt\":{\"type\":\"TEXT\",\"text\":\"Chọn các số lớn hơn 30 và bé hơn 34.\"},\"options\":[{\"id\":\"x\",\"content\":{\"type\":\"TEXT\",\"text\":\"30\"}},{\"id\":\"y\",\"content\":{\"type\":\"TEXT\",\"text\":\"31\"}},{\"id\":\"z\",\"content\":{\"type\":\"TEXT\",\"text\":\"33\"}},{\"id\":\"w\",\"content\":{\"type\":\"TEXT\",\"text\":\"34\"}}],\"speechEnabled\":true}}]}},{\"lessonId\":\"MATH_B002\",\"variantId\":\"N13B1_SYNTH_6\",\"level\":\"LV2\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"D4\",\"model\":{\"questionId\":\"a\",\"selectionMode\":\"SINGLE\",\"prompt\":{\"type\":\"TEXT\",\"text\":\"Số liền sau của 38 là 39.\"},\"options\":[{\"id\":\"x\",\"content\":{\"type\":\"TEXT\",\"text\":\"Đúng\"}},{\"id\":\"y\",\"content\":{\"type\":\"TEXT\",\"text\":\"Sai\"}}],\"speechEnabled\":true}},{\"id\":\"b\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"INEQUALITY_INPUT\",\"model\":{\"lower\":35,\"upper\":40}}}]}},{\"lessonId\":\"MATH_B002\",\"variantId\":\"N13B1_SYNTH_7\",\"level\":\"LV2\",\"reviewDto\":{\"parts\":[{\"id\":\"a\",\"kind\":\"SEMANTIC\",\"model\":{\"kind\":\"NEIGHBOR_TABLE\",\"model\":{\"rows\":[{\"previous\":null,\"given\":16,\"next\":null},{\"previous\":68,\"given\":null,\"next\":70}]}}}]}}]}]}");}
function n13PilotPrivateModule_(){
 const cache=Object.create(null),isolated=Object.create(null);
 const factories={
"d3":(function(module,exports,require,globalThis){
/* G7.4 MATCHING_REFERENCE_V1.1: pure data/state, no grading, no student writes.
 * Derived from the interaction contract of the frozen 10-form HTML; original untouched.
 * This is a TEST-only standalone reference, not an Apps Script deployment.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.KLMatchingV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TYPES=new Set(['TEXT','MATH','ASSET','MIXED']);
  const MODES=new Set(['SINGLE_RELATION','MIXED_RELATION']);
  function fail(reason){return {ok:false,reason};}
  function validId(x){return typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);}
  function normalizeContent(x){
    if(!x||typeof x!=='object'||!TYPES.has(x.type))return null;
    const text=typeof x.text==='string'?x.text.trim():'';
    const assetId=typeof x.assetId==='string'?x.assetId.trim():'';
    if(text.length>240||assetId.length>100)return null;
    if(['TEXT','MATH'].includes(x.type)&&!text)return null;
    if(x.type==='ASSET'&&!assetId)return null;
    if(x.type==='MIXED'&&(!text||!assetId))return null;
    if(assetId&&!/^[A-Za-z0-9_.:-]+$/.test(assetId))return null;
    return Object.freeze({type:x.type,text,assetId,alt:typeof x.alt==='string'?x.alt.slice(0,160):''});
  }
  function compile(payload){
    if(!payload||typeof payload!=='object'||!validId(payload.exerciseId))return fail('INVALID_EXERCISE_ID');
    if(!MODES.has(payload.relationMode))return fail('INVALID_RELATION_MODE');
    const left=payload.leftItems,right=payload.rightItems;
    if(!Array.isArray(left)||!Array.isArray(right)||left.length<2||left.length>8||left.length!==right.length)return fail('INVALID_PAIR_COUNT');
    const all=new Set();
    const normalize=(items)=>{
      const out=[];
      for(const item of items){
        if(!item||!validId(item.id)||all.has(item.id))return null;
        const content=normalizeContent(item.content);
        if(!content)return null;
        all.add(item.id);
        out.push(Object.freeze({id:item.id,content}));
      }
      return Object.freeze(out);
    };
    const L=normalize(left),R=normalize(right);
    if(!L||!R)return fail('INVALID_ITEMS_OR_DUPLICATE_IDS');
    // Client renderer accepts NO answer map. Answers belong only in trusted grading payload.
    if(Object.prototype.hasOwnProperty.call(payload,'answer')||
       Object.prototype.hasOwnProperty.call(payload,'answerKey')||
       Object.prototype.hasOwnProperty.call(payload,'matchId')||
       [...left,...right].some(x=>x&&('matchId' in x||'answer' in x||'correctId' in x)))
      return fail('ANSWER_KEY_FORBIDDEN_IN_RENDERER_PAYLOAD');
    return {ok:true,plan:Object.freeze({schemaVersion:'g74-matching-v11',
      exerciseId:payload.exerciseId,relationMode:payload.relationMode,
      leftItems:L,rightItems:R,pairCount:L.length})};
  }
  function session(plan){
    if(!plan||plan.schemaVersion!=='g74-matching-v11')throw Error('INVALID_PLAN');
    let pairs=Object.create(null), selected=null;
    const lIds=new Set(plan.leftItems.map(i=>i.id)),rIds=new Set(plan.rightItems.map(i=>i.id));
    const snapshot=()=>({exerciseId:plan.exerciseId,pairs:{...pairs},selectedLeft:selected,
      completed:Object.keys(pairs).length,total:plan.pairCount});
    const api={
      snapshot,
      selectLeft(id){if(!lIds.has(id))return fail('UNKNOWN_LEFT');selected=(selected===id?null:id);return {ok:true,state:snapshot()};},
      connect(leftId,rightId){
        if(!lIds.has(leftId)||!rIds.has(rightId))return fail('UNKNOWN_ENDPOINT');
        // Enforce one-to-one: changing a matching pair replaces an earlier use of either endpoint.
        for(const k of Object.keys(pairs))if(k===leftId||pairs[k]===rightId)delete pairs[k];
        pairs[leftId]=rightId;selected=null;
        return {ok:true,state:snapshot()};
      },
      connectSelected(rightId){return selected?api.connect(selected,rightId):fail('NO_LEFT_SELECTED');},
      disconnect(leftId){if(!lIds.has(leftId))return fail('UNKNOWN_LEFT');delete pairs[leftId];return {ok:true,state:snapshot()};},
      clear(){pairs=Object.create(null);selected=null;return {ok:true,state:snapshot()};},
      restore(saved){
        if(!saved||saved.exerciseId!==plan.exerciseId||!saved.pairs||typeof saved.pairs!=='object'||Array.isArray(saved.pairs))return fail('INVALID_DRAFT');
        const next=Object.create(null),used=new Set();
        for(const [l,r] of Object.entries(saved.pairs)){
          if(!lIds.has(l)||!rIds.has(r)||used.has(r))return fail('INVALID_DRAFT_PAIR');
          next[l]=r;used.add(r);
        }
        pairs=next;selected=null;return {ok:true,state:snapshot()};
      }
    };
    return Object.freeze(api);
  }
  return Object.freeze({compile,session});
});

}),
"d4":(function(module,exports,require,globalThis){
/* G7.4 Choice Reference V1.1 – TEST-only, pure contracts and draft state.
 * Based on frozen 10-form Type 4; no client answer key, grading, awards or progress.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.KLChoiceV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TYPES=new Set(['TEXT','MATH','ASSET','MIXED']);
 const MODES=new Set(['SINGLE','MULTIPLE']);
 const validId=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(id);
 const fail=reason=>({ok:false,reason});
 function content(x){
  if(!x||!TYPES.has(x.type))return null;
  const text=typeof x.text==='string'?x.text.trim():'';
  const assetId=typeof x.assetId==='string'?x.assetId.trim():'';
  if(text.length>600||assetId.length>120||!['ASSET','MIXED'].includes(x.type)&&!text||
    ['ASSET','MIXED'].includes(x.type)&&!assetId||
    x.type==='MIXED'&&!text||
    assetId&&!/^[A-Za-z0-9_.:-]+$/.test(assetId))return null;
  const alt=typeof x.alt==='string'?x.alt.trim().slice(0,160):'';
  return Object.freeze({type:x.type,text,assetId,alt});
 }
 function compile(data){
  if(!data||!validId(data.questionId))return fail('INVALID_QUESTION_ID');
  if(!MODES.has(data.selectionMode))return fail('INVALID_SELECTION_MODE');
  if(!data.prompt||!content(data.prompt))return fail('INVALID_PROMPT');
  if(!Array.isArray(data.options)||data.options.length<2||data.options.length>8)return fail('INVALID_OPTION_COUNT');
  if(['answer','answers','answerKey','correctOptionId','correctOptionIds','gradingKey','isCorrect'].some(k=>k in data))return fail('ANSWER_KEY_FORBIDDEN');
  const ids=new Set(),opts=[];
  for(const option of data.options){
   if(!option||!validId(option.id)||ids.has(option.id))return fail('INVALID_OPTION_ID');
   if(['answer','correct','isCorrect','matchId','correctOptionId'].some(k=>k in option))return fail('ANSWER_KEY_FORBIDDEN');
   const c=content(option.content);if(!c)return fail('INVALID_OPTION_CONTENT');
   const speechText=typeof option.speechText==='string'?option.speechText.trim():'';
   if(speechText.length>600)return fail('INVALID_SPEECH_TEXT');
   ids.add(option.id);opts.push(Object.freeze({id:option.id,content:c,speechText}));
  }
  const speechText=typeof data.speechText==='string'?data.speechText.trim():'';
  if(speechText.length>1000)return fail('INVALID_SPEECH_TEXT');
  return {ok:true,plan:Object.freeze({schemaVersion:'g74-choice-v11',questionId:data.questionId,
   selectionMode:data.selectionMode,prompt:content(data.prompt),
   speechEnabled:data.speechEnabled===true,speechText,
   options:Object.freeze(opts)})};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-choice-v11')throw Error('INVALID_PLAN');
  const ids=new Set(plan.options.map(x=>x.id));let selected=new Set();
  const snapshot=()=>({questionId:plan.questionId,selectedOptionIds:plan.options.filter(o=>selected.has(o.id)).map(o=>o.id)});
  return Object.freeze({
   snapshot,
   select(id){if(!ids.has(id))return fail('UNKNOWN_OPTION');
    if(plan.selectionMode==='SINGLE')selected=new Set([id]);
    else if(selected.has(id))selected.delete(id);else selected.add(id);
    return {ok:true,state:snapshot()};
   },
   clear(){selected.clear();return {ok:true,state:snapshot()};},
   restore(draft){
    if(!draft||draft.questionId!==plan.questionId||!Array.isArray(draft.selectedOptionIds))return fail('INVALID_DRAFT');
    const a=draft.selectedOptionIds;
    if(a.length>plan.options.length||(plan.selectionMode==='SINGLE'&&a.length>1)||
      new Set(a).size!==a.length||a.some(id=>!ids.has(id)))return fail('INVALID_DRAFT_SELECTION');
    selected=new Set(a);return {ok:true,state:snapshot()};
   }
  });
 }
 return Object.freeze({compile,session});
});

}),
"semantic":(function(module,exports,require,globalThis){
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
if(typeof module==='object'&&module.exports)module.exports={compile,session};else window.N13SemanticCore={compile,session};

}),
"composite":(function(module,exports,require,globalThis){
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./semantic-core.cjs'):root.N13SemanticCore,typeof module==='object'&&module.exports?require('../../66_D3_Core.html'):root.KLMatchingV11,typeof module==='object'&&module.exports?require('../../68_D4_Core.html'):root.KLChoiceV11);if(typeof module==='object'&&module.exports)module.exports=api;else root.N13B1Core=api;})(typeof globalThis!=='undefined'?globalThis:this,function(core,d3,d4){
'use strict';
const exact=(o,k)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===k.slice().sort().join('|');
const id=x=>typeof x==='string'&&/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(x),int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
function compile(parts){if(!Array.isArray(parts)||!parts.length||parts.length>8)throw Error('PARTS');const seen=new Set();return parts.map(p=>{if(!exact(p,['id','kind','model'])||!id(p.id)||seen.has(p.id))throw Error('PART');seen.add(p.id);const m=p.model;let plan;
if(p.kind==='SEMANTIC')plan=core.compile(m);
else if(p.kind==='D4'){if(!exact(m,['questionId','selectionMode','prompt','options','speechEnabled'])||!exact(m.prompt,['type','text'])||m.prompt.type!=='TEXT'||!Array.isArray(m.options)||m.options.some(o=>!exact(o,['id','content'])||!exact(o.content,['type','text'])||o.content.type!=='TEXT'))throw Error('CHOICE_SCHEMA');const q=d4.compile(m);if(!q.ok)throw Error(q.reason);plan=q.plan;}
else if(p.kind==='EXPANDED'){if(!exact(m,['number','slots'])||!int(m.number,0,99)||!Array.isArray(m.slots)||![2,4].includes(m.slots.length))throw Error('EXPANDED');const roles=m.slots.length===2?['SUM_TENS','SUM_ONES']:['BRANCH_TENS','BRANCH_ONES','SUM_TENS','SUM_ONES'];const keys=new Set();if(!m.slots.some(s=>s.value===null)||m.slots.some((s,i)=>{if(!exact(s,['id','role','value'])||!id(s.id)||keys.has(s.id)||s.role!==roles[i])return true;keys.add(s.id);return s.value!==null&&s.value!==(s.role.endsWith('TENS')?Math.floor(m.number/10)*10:m.number%10);}))throw Error('EXPANDED_SLOT');plan=JSON.parse(JSON.stringify(m));}
else if(p.kind==='COORD_MATCH'){if(!exact(m,['start','step','tickCount','labels'])||!int(m.start,0,100)||!int(m.step,1,10)||!int(m.tickCount,2,8)||m.start+(m.tickCount-1)*m.step>100||!Array.isArray(m.labels)||m.labels.length!==m.tickCount||m.labels.some(l=>!exact(l,['id','text'])||!id(l.id)||typeof l.text!=='string'||!/^\d{1,3}(?: [+-] \d{1,3})?$/.test(l.text)))throw Error('COORD');const q=d3.compile({exerciseId:p.id,relationMode:'SINGLE_RELATION',leftItems:m.labels.map(l=>({id:l.id,content:{type:'MATH',text:l.text}})),rightItems:Array.from({length:m.tickCount},(_,i)=>({id:'tick_'+i,content:{type:'TEXT',text:String(m.start+i*m.step)}}))});if(!q.ok)throw Error(q.reason);plan=q.plan;}
else throw Error('KIND');return {id:p.id,kind:p.kind,plan};});}
function expandedSession(plan){const state=Object.create(null),fields=new Map(plan.slots.filter(s=>s.value===null).map(s=>[s.id,s]));return {set(k,v){if(!fields.has(k)||typeof v!=='string'||! /^(?:0|[1-9][0-9]?)?$/.test(v))return false;state[k]=v;return true;},snapshot:()=>({...state}),clear(){for(const k of Object.keys(state))delete state[k];}};}
return {compile,expandedSession};});

}),
"oracle":(function(module,exports,require,globalThis){
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

}),
"grader":(function(module,exports,require,globalThis){
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

})
};
 const pack={"lessons":[{"lessonId":"MATH_B001","questions":[{"lessonId":"MATH_B001","variantId":"N13B1_SYNTH_1","level":"LV1","reviewDto":{"parts":[{"id":"a","kind":"EXPANDED","model":{"number":43,"slots":[{"id":"branchT","role":"BRANCH_TENS","value":40},{"id":"b1","role":"BRANCH_ONES","value":null},{"id":"sumT","role":"SUM_TENS","value":40},{"id":"s1","role":"SUM_ONES","value":null}]}},{"id":"b","kind":"EXPANDED","model":{"number":76,"slots":[{"id":"b2","role":"BRANCH_TENS","value":null},{"id":"branchO","role":"BRANCH_ONES","value":6},{"id":"s2","role":"SUM_TENS","value":null},{"id":"sumO","role":"SUM_ONES","value":6}]}},{"id":"c","kind":"EXPANDED","model":{"number":28,"slots":[{"id":"b3","role":"BRANCH_TENS","value":null},{"id":"b4","role":"BRANCH_ONES","value":null},{"id":"s3","role":"SUM_TENS","value":null},{"id":"s4","role":"SUM_ONES","value":null}]}}]}},{"lessonId":"MATH_B001","variantId":"N13B1_SYNTH_2","level":"LV2","reviewDto":{"parts":[{"id":"r0","kind":"EXPANDED","model":{"number":32,"slots":[{"id":"t","role":"SUM_TENS","value":null},{"id":"o","role":"SUM_ONES","value":null}]}},{"id":"r1","kind":"EXPANDED","model":{"number":81,"slots":[{"id":"t","role":"SUM_TENS","value":null},{"id":"o","role":"SUM_ONES","value":null}]}},{"id":"r2","kind":"EXPANDED","model":{"number":46,"slots":[{"id":"t","role":"SUM_TENS","value":null},{"id":"o","role":"SUM_ONES","value":null}]}}]}},{"lessonId":"MATH_B001","variantId":"PV_B001_PLACE_VALUE_S1031","level":"LV1","reviewDto":{"parts":[{"id":"a","kind":"D4","model":{"questionId":"PV_B001_PLACE_VALUE_S1031","selectionMode":"SINGLE","prompt":{"type":"TEXT","text":"Số gồm 4 chục và 5 đơn vị là số nào?"},"options":[{"id":"c1","content":{"type":"TEXT","text":"44"}},{"id":"c2","content":{"type":"TEXT","text":"54"}},{"id":"c3","content":{"type":"TEXT","text":"45"}},{"id":"c4","content":{"type":"TEXT","text":"46"}}],"speechEnabled":true}}]}},{"lessonId":"MATH_B001","variantId":"N13B_SYNTH_1","level":"LV1","reviewDto":{"parts":[{"id":"a","kind":"SEMANTIC","model":{"kind":"PLACE_VALUE","model":{"rows":[{"number":47,"tens":null,"ones":null},{"number":null,"tens":6,"ones":0}]}}}]}},{"lessonId":"MATH_B001","variantId":"N13B_SYNTH_2","level":"LV2","reviewDto":{"parts":[{"id":"a","kind":"SEMANTIC","model":{"kind":"PLACE_VALUE","model":{"rows":[{"number":82,"tens":null,"ones":2},{"number":35,"tens":3,"ones":null}]}}}]}}]},{"lessonId":"MATH_B002","questions":[{"lessonId":"MATH_B002","variantId":"N13B1_SYNTH_3","level":"LV1","reviewDto":{"parts":[{"id":"a","kind":"SEMANTIC","model":{"kind":"NUMBER_LINE","model":{"start":0,"step":1,"ticks":[0,null,null,null,null,null,6]}}},{"id":"b","kind":"SEMANTIC","model":{"kind":"NUMBER_LINE","model":{"start":20,"step":2,"ticks":[20,null,null,null,null,null,32]}}}]}},{"lessonId":"MATH_B002","variantId":"N13B1_SYNTH_4","level":"LV1","reviewDto":{"parts":[{"id":"a","kind":"COORD_MATCH","model":{"start":0,"step":2,"tickCount":4,"labels":[{"id":"l1","text":"2 + 4"},{"id":"l2","text":"0"},{"id":"l3","text":"6 - 2"},{"id":"l4","text":"2"}]}}]}},{"lessonId":"MATH_B002","variantId":"N13B1_SYNTH_5","level":"LV2","reviewDto":{"parts":[{"id":"a","kind":"SEMANTIC","model":{"kind":"NUMBER_LINE","model":{"start":30,"step":1,"ticks":[30,null,32,null,34]}}},{"id":"b","kind":"D4","model":{"questionId":"b","selectionMode":"MULTIPLE","prompt":{"type":"TEXT","text":"Chọn các số lớn hơn 30 và bé hơn 34."},"options":[{"id":"x","content":{"type":"TEXT","text":"30"}},{"id":"y","content":{"type":"TEXT","text":"31"}},{"id":"z","content":{"type":"TEXT","text":"33"}},{"id":"w","content":{"type":"TEXT","text":"34"}}],"speechEnabled":true}}]}},{"lessonId":"MATH_B002","variantId":"N13B1_SYNTH_6","level":"LV2","reviewDto":{"parts":[{"id":"a","kind":"D4","model":{"questionId":"a","selectionMode":"SINGLE","prompt":{"type":"TEXT","text":"Số liền sau của 38 là 39."},"options":[{"id":"x","content":{"type":"TEXT","text":"Đúng"}},{"id":"y","content":{"type":"TEXT","text":"Sai"}}],"speechEnabled":true}},{"id":"b","kind":"SEMANTIC","model":{"kind":"INEQUALITY_INPUT","model":{"lower":35,"upper":40}}}]}},{"lessonId":"MATH_B002","variantId":"N13B1_SYNTH_7","level":"LV2","reviewDto":{"parts":[{"id":"a","kind":"SEMANTIC","model":{"kind":"NEIGHBOR_TABLE","model":{"rows":[{"previous":null,"given":16,"next":null},{"previous":68,"given":null,"next":70}]}}}]}}]}]};
 const aliases={"../../66_D3_Core.html":"d3","../../68_D4_Core.html":"d4","./semantic-core.cjs":"semantic","./b1-composite-core.cjs":"composite","./trusted-oracle.qa-only.cjs":"oracle"};
 function load(k){if(k==='./pilot-lessons.review.json')return pack;if(k==='node:crypto')return {createHash:function(alg){if(alg!=='sha256')throw Error('HASH');return {update:function(text,encoding){if(encoding!=='utf8')throw Error('ENCODING');return {digest:function(format){if(format!=='hex')throw Error('FORMAT');return n13PilotDigest_(text);}};}};}};k=aliases[k]||k;if(!Object.prototype.hasOwnProperty.call(factories,k))throw Error('MODULE');if(!cache[k]){const module={exports:{}};cache[k]=module;factories[k](module,module.exports,load,isolated);}return cache[k].exports;}
 return load('grader');
}
