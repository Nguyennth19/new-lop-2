'use strict';
/** P0.6-E.0.3 Multi-Family Lesson Composer. Pure, bounded, TEST-only.
 * Wraps E02 generator + E01 G0-G8; never grades students or approves pedagogy.
 */
const {createVariantGenerator}=require('./math-variant-generator-v1.cjs');
const {auditVariant}=require('./math-variant-validator-v1.cjs');
const {validateLesson}=require('./validator-lesson-v1.cjs');
const {hash}=require('./variant-policy-registry-v1.cjs');
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const str=x=>typeof x==='string'&&!!x.trim();
const fail=(code,extra={})=>({ok:false,status:'BLOCKED',code,...extra});
const clone=x=>structuredClone(x);
function validateManifest(m,policy){
 if(!obj(m)||m.manifestVersion!=='p0.6-e03-composition-v1'||m.status!=='TEST_CANDIDATE_ONLY'||
   !str(m.lessonId)||m.lessonId!==policy.lessonId||!str(m.curriculumRef)||
   !/^[A-Za-z0-9_-]{1,64}$/.test(m.seed||'')||
   !Number.isInteger(m.totalQuestions)||m.totalQuestions<1||m.totalQuestions>120||
   m.allowStudentUse!==false||m.ownerSignoffRef!==null)
  return fail('COMPOSITION_MANIFEST_INVALID');
 if(!Array.isArray(m.levels)||m.levels.length<1||m.levels.length>5||
   !Array.isArray(m.families)||m.families.length<1||m.families.length>12||
   !Array.isArray(m.sessions)||m.sessions.length<1||m.sessions.length>30||
   !Array.isArray(m.requiredSkills)||!m.requiredSkills.length||!obj(m.familyQuotas))
  return fail('COMPOSITION_COLLECTIONS_INVALID');
 const levels=new Map(),families=new Map(),sessions=new Set(),usedFamily=new Map();
 for(const level of m.levels){
  if(!obj(level)||!str(level.id)||!str(level.intent)||levels.has(level.id)||
    level.pedagogyStatus!=='PENDING')return fail('LEVEL_PEDAGOGY_OR_DUPLICATE');
  levels.set(level.id,level);
 }
 for(const f of m.families){
  if(!obj(f)||!str(f.id)||families.has(f.id)||!policy.allowedSkills.includes(f.skillId)||
    !policy.allowedMathKinds.includes(f.mathKind)||f.mathKind!=='ADD'||
    f.variantLevel!=='V1_SURFACE'||f.interaction!=='NUMBER_INPUT'||
    !['math.mental','math.vertical'].includes(f.rendererKind)||
    f.requiredAssetRole!=='NONE'||!obj(f.ranges))
   return fail('FAMILY_UNSUPPORTED_OR_OUT_OF_SCOPE');
  for(const k of ['a','b'])if(!Array.isArray(f.ranges[k])||f.ranges[k].length!==2||
    !f.ranges[k].every(Number.isSafeInteger)||f.ranges[k][0]>f.ranges[k][1]||
    f.ranges[k][0]<policy.mathConstraints.minOperand||
    f.ranges[k][1]>policy.mathConstraints.maxOperand)
   return fail('FAMILY_RANGES_INVALID');
  families.set(f.id,f);usedFamily.set(f.id,0);
 }
 const required=new Set(m.requiredSkills);
 if(required.size!==m.requiredSkills.length||[...required].some(x=>!policy.allowedSkills.includes(x))||
   [...required].some(x=>![...families.values()].some(f=>f.skillId===x)))
  return fail('REQUIRED_SKILL_NOT_COVERABLE');
 let total=0;
 for(const s of m.sessions){
  if(!obj(s)||!str(s.id)||sessions.has(s.id)||!levels.has(s.levelId)||
    !Array.isArray(s.allocations)||!s.allocations.length||s.allocations.length>8)
   return fail('SESSION_DEFINITION_INVALID');
  sessions.add(s.id);
  const familyInSession=new Set();
  let sessionCount=0;
  for(const a of s.allocations){
   if(!obj(a)||!families.has(a.familyId)||familyInSession.has(a.familyId)||
     !Number.isInteger(a.count)||a.count<1||a.count>12)return fail('SESSION_ALLOCATION_INVALID');
   familyInSession.add(a.familyId);sessionCount+=a.count;
   usedFamily.set(a.familyId,usedFamily.get(a.familyId)+a.count);
  }
  if(sessionCount>30)return fail('SESSION_TOO_LARGE');
  total+=sessionCount;
 }
 if(total!==m.totalQuestions)return fail('COMPOSITION_TOTAL_MISMATCH');
 if(Object.keys(m.familyQuotas).length!==families.size||[...families.keys()].some(k=>
   !Number.isInteger(m.familyQuotas[k])||m.familyQuotas[k]<1||
   usedFamily.get(k)!==m.familyQuotas[k]))return fail('COMPOSITION_FAMILY_QUOTA_MISMATCH');
 return {ok:true,levels,families,usedFamily};
}
function pickPairs(f,policy,seed,count,taken){
 const [amin,amax]=f.ranges.a,[bmin,bmax]=f.ranges.b,c=policy.mathConstraints;
 const options=[];
 for(let a=amin;a<=amax;a++)for(let b=bmin;b<=bmax;b++){
  if(c.requireCarry===true&&(a%10+b%10)<10)continue;
  if(c.requireCarry===false&&(a%10+b%10)>=10)continue;
  if(a+b<c.minResult||a+b>c.maxResult||taken.has(a+','+b))continue;
  options.push([a,b]);
 }
 if(options.length<count)return null;
 options.sort((x,y)=>{
  const ax=hash({seed,pair:x}),ay=hash({seed,pair:y});
  return ax<ay?-1:ax>ay?1:0;
 });
 return options.slice(0,count);
}
function composeLesson(manifest,registry,skeleton){
 if(!registry||typeof registry.resolve!=='function')return fail('POLICY_REGISTRY_REQUIRED');
 if(!obj(manifest)||!str(manifest.lessonId))return fail('MANIFEST_REQUIRED');
 const state=registry.resolve(manifest.lessonId);
 if(!state.ok)return fail(state.code);
 const policy=state.policy;
 const check=validateManifest(manifest,policy);if(!check.ok)return check;
 if(!obj(skeleton)||!Array.isArray(skeleton.questions)||!skeleton.questions.length||
    skeleton.lessonId!==manifest.lessonId||skeleton.subject!=='toan')
  return fail('SKELETON_MISMATCH');
 const templates={};
 for(const f of manifest.families)templates[f.id]={
  lessonId:manifest.lessonId,curriculumRef:manifest.curriculumRef,skillId:f.skillId,
  mathKind:f.mathKind,variantLevel:f.variantLevel,sourceInteraction:f.interaction,
  rendererKind:f.rendererKind,requiredAssetRole:f.requiredAssetRole,lessonSkeleton:skeleton};
 const generator=createVariantGenerator(registry,templates);
 const lesson=clone(skeleton);
 lesson.curriculum.lessonRef=manifest.curriculumRef;
 lesson.contentVersion=manifest.contentVersion;
 lesson.levels=clone(manifest.levels).map(({id,intent})=>({id,intent}));
 lesson.sessions=[];lesson.questions=[];
 const variantRecords=[],idSet=new Set(),usedPairs=new Set();
 const skills=new Map(),families=new Map(),levelCounts=new Map();
 for(const session of manifest.sessions){
  const created={id:session.id,levelId:session.levelId,questionIds:[]};
  for(const alloc of session.allocations){
   const f=check.families.get(alloc.familyId);
   const currentSeed=hash({seed:manifest.seed,session:session.id,family:f.id}).slice(0,32);
   const pairs=pickPairs(f,policy,currentSeed,alloc.count,usedPairs);
   if(!pairs)return fail('FAMILY_EXHAUSTED',{familyId:f.id});
   const generated=generator.generate({lessonId:manifest.lessonId,templateId:f.id,
     count:alloc.count,seed:currentSeed,interaction:f.interaction,candidates:pairs});
   if(!generated.ok)return fail('FAMILY_GENERATION_REJECTED',{familyId:f.id,reason:generated.code});
   for(const result of generated.results){
    const q=clone(result.question);
    if(idSet.has(q.id))return fail('GENERATED_ID_COLLISION');
    q.levelId=session.levelId;q.sessionId=session.id;
    lesson.questions.push(q);created.questionIds.push(q.id);idSet.add(q.id);
    usedPairs.add(q.parameters.a+','+q.parameters.b);
    variantRecords.push({id:q.id,skillId:f.skillId,familyId:f.id,levelId:session.levelId,
      sessionId:session.id,variant:{...clone(result.variant),questionId:q.id}});
    skills.set(f.skillId,(skills.get(f.skillId)||0)+1);
    families.set(f.id,(families.get(f.id)||0)+1);
    levelCounts.set(session.levelId,(levelCounts.get(session.levelId)||0)+1);
   }
  }
  lesson.sessions.push(created);
 }
 const structural=validateLesson(lesson);
 if(!structural.ok)return fail('COMPOSED_LESSON_CONTRACT_INVALID',{errors:structural.errors.map(e=>e.code)});
 if(lesson.questions.length!==manifest.totalQuestions||manifest.requiredSkills.some(k=>!skills.has(k))||
   manifest.families.some(f=>families.get(f.id)!==manifest.familyQuotas[f.id])||
   [...check.levels.keys()].some(l=>!levelCounts.has(l)))
  return fail('COMPOSITION_COVERAGE_UNMET');
 const receipts=variantRecords.map(record=>({
  questionId:record.id,levelId:record.levelId,sessionId:record.sessionId,skillId:record.skillId,
  familyId:record.familyId,
  receipt:auditVariant(lesson,policy,record.variant,{offlineOnly:true,noWrites:true,noStars:true})
 }));
 if(receipts.some(x=>!['PASS','NOT_APPLICABLE'].includes(x.receipt.gates.G0.status)||
   x.receipt.gates.G1.status!=='PASS'||x.receipt.gates.G4.status!=='PASS'||
   x.receipt.gates.G6.status!=='PASS'||x.receipt.status==='PASS_FOR_TEST'))
  return fail('COMPOSED_REAUDIT_FAILED');
 const coverage={
  total:lesson.questions.length,
  byLevel:Object.fromEntries([...levelCounts].sort()),
  byFamily:Object.fromEntries([...families].sort()),
  bySkill:Object.fromEntries([...skills].sort()),
  sessions:lesson.sessions.map(x=>({id:x.id,levelId:x.levelId,count:x.questionIds.length}))
 };
 const auditSummary={version:'p0.6-e03-composition-v1',lessonId:lesson.lessonId,
  policySha256:state.policySha256,manifestSha256:hash(manifest),lessonSha256:hash(lesson),
  coverage,qa:{records:receipts.map(x=>({questionId:x.questionId,levelId:x.levelId,
      sessionId:x.sessionId,skillId:x.skillId,familyId:x.familyId,
      gateStatus:Object.fromEntries(Object.entries(x.receipt.gates).map(([g,v])=>[g,v.status])),
      status:x.receipt.status,receiptSha256:x.receipt.receiptSha256}))},
  approval:'PENDING',visualQA:'NOT_APPLICABLE',renderer:'READONLY_ONLY',
  noWrites:true,noStars:true,studentDataIncluded:false,scope:'OFFLINE_ONLY'};
 auditSummary.receiptSha256=hash(auditSummary);
 return {ok:true,status:'COMPOSED_TECHNICAL_PASS_REVIEW_PENDING',
  lesson,coverage,report:auditSummary,
  noWrites:true,noStars:true,scope:'OFFLINE_ONLY'};
}
module.exports={composeLesson,validateManifest,pickPairs};
