'use strict';
/** P0.6-B.2 pure B20 -> lop2.lesson.v1 adapter. No data mutation, writes, network, grading or production connection. */
const {validateLesson}=require('./validator-lesson-v1.cjs');
const KINDS=Object.freeze({carry:'math.carry',vertical:'math.vertical',mental:'math.mental',word:'math.word',three:'math.three',reverse:'math.reverse'});
const BASELINE={lessonId:'toan_b20',sessionSizes:[6,6,5,5,4,4],questionCount:30,
  sourceBlobSha:'b14d556c5deeb561106e0c81f275387bef538842'};
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function adaptB20(raw){
 if(!isObject(raw)||raw.lesson_id!=='toan_b20'||raw.schema_version!=='b20-variant-pilot-1.0'||!Array.isArray(raw.questions)||!Array.isArray(raw.sessions))throw Error('B20_LEGACY_SOURCE_INVALID');
 if(raw.questions.length!==BASELINE.questionCount||raw.sessions.length!==6||raw.sessions.some((s,i)=>s.question_ids.length!==BASELINE.sessionSizes[i]))throw Error('B20_BASELINE_CHANGED');
 const levelIds=new Set(raw.sessions.map(s=>s.level));
 if(!Array.isArray(raw.levels)||raw.levels.length!==levelIds.size||raw.levels.some(l=>!levelIds.has(l)))throw Error('B20_LEVELS_CHANGED');
 const result={
  schemaVersion:'lop2.lesson.v1',lessonId:'toan_b20',subject:'toan',
  curriculum:{grade:2,lessonRef:'b20'},
  contentVersion:'b20-variant-pilot-1.0+h1-approved',
  source:{questionOrigin:'PROJECT_ORIGINAL_VARIANT',references:[{sourceType:'PROJECT',ref:'H.1-approved-b20-20261113'}]},
  levels:raw.levels.map(id=>({id,intent:'Bài 20 – '+id})),
  sessions:raw.sessions.map(s=>({id:s.session_id,levelId:s.level,questionIds:[...s.question_ids]})),
  questions:raw.questions.map(q=>{
   if(!isObject(q)||!Object.hasOwn(KINDS,q.type)||!Number.isInteger(q.answer))throw Error('B20_UNSUPPORTED_QUESTION');
   return {
    id:q.question_id,kind:KINDS[q.type],levelId:q.level,sessionId:q.session_id,
    prompt:q.prompt,parameters:{...q.parameters},
    answerSpec:{mode:'exact',origin:'PROJECT_DERIVED',value:q.answer,
      verification:{type:'deterministic_rule',status:'PASS'},
      pedagogyApproval:{status:'APPROVED_BY_PROJECT_OWNER'}},
    renderer:{component:KINDS[q.type]},
    assets:{sceneId:null,usage:'decorative'},
    // Pilot-specific metadata is passed through without introducing learning side effects.
    legacy:{type:q.type,skillId:q.skill_id,unit:q.unit,solutionPrompt:q.solution_prompt,
      sourceRole:q.source_role,renderMode:q.render_mode,templateId:q.template_id}
   };
  })
 };
 const check=validateLesson(result);if(!check.ok)throw Error('B20_ADAPTER_CONTRACT_INVALID:'+check.errors.map(e=>e.code).join(','));
 return result;
}
module.exports={adaptB20,KINDS,BASELINE};
