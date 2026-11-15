'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const geo=require('../g7-4-geometry-tangram-reference-v11/geometry-v11-core.js');
const {loadProducer}=require('../g7-6-b2/real-producer-bridge.cjs');
const {createExperimentalProducer}=require('../g7-6-b3/p06-e04-experimental-producer.cjs');
const fix=require('./tangram-placement-v12.js');
const {resolvePublic,eligibleForActivation,policy,overlay}=require('./e04-producer-contract.cjs');
const manifest=require('../g7-6/resource-renderer-resolver.cjs');
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++},yes=(x,m)=>{assert.ok(x,m);count++};
const p0=process.argv[2];if(!p0)throw Error('PINNED_P06_SOURCE_REQUIRED');
const real=loadProducer(p0);yes(real.ok);const producer=createExperimentalProducer(real);
yes(producer.ok);
const registry=manifest.loadManifest();
eq(manifest.checkManifest(registry).count,12);
eq(overlay.baseRegistryCount,12);
eq(overlay.auxiliaryRenderer.id,'MATH_MENTAL_NUMBER_INPUT_V1');
eq(overlay.auxiliaryRenderer.notAThirteenthMathForm,true);
eq(overlay.auxiliaryRenderer.grading,false);
eq(overlay.auxiliaryRenderer.releaseReady,false);
eq(overlay.doNotRewriteBase,true);
eq(overlay.tangramPlacement.nativeCore,'qa/g7-4-geometry-tangram-reference-v11/geometry-v11-core.js');
eq(policy.lessonId,'toan_b999');
eq(policy.curriculumRef,null);
eq(policy.skillId,null);
eq(policy.releaseReady,false);
eq(policy.families.length,2);
eq(policy.families[0].levels.LV3,'NOT_SUPPORTED');
eq(policy.families[1].levels.LV3,'NOT_SUPPORTED');
eq(policy.materialRules.teacherGuide,'PEDAGOGY_REFERENCE_NOT_PRIMARY_QUESTION_SOURCE');
eq(policy.activation.requiresOwnerPedagogyApproval,true);
eq(policy.activation.forbidsAutomaticAttachToB21,true);
eq(policy.boundary.noLiveStudentUse,true);
eq(policy.boundary.noGrading,true);
eq(policy.boundary.noGAS,true);
eq(eligibleForActivation().ok,false);
eq(eligibleForActivation({sourceEvidence:'mock',ownerSignature:'mock',lessonId:'toan_b21',skillId:'mock'}).code,'E04_APPROVED_CURRICULUM_REGISTRY_NOT_CONNECTED');
const variants=[];
for(const mode of ['D5_TANGRAM','D9_COMPARE_DIFFERENCE']){
 for(const [index,seed] of [[0,'b5a_first'],[1,'b5a_second'],[2,'b5a_third']]){
  const candidate=producer.generate({mode,seed,index});
  yes(candidate.ok,mode+' generated');
  const out=resolvePublic(candidate,producer);
  yes(out.ok,mode+' projected '+out.code);
  eq(out.releaseReady,false);
  eq(out.gradingEnabled,false);
  eq(out.studentWritesAllowed,false);
  eq(out.receipt.curriculumMapped,false);
  eq(out.receipt.ownerPedagogySigned,false);
  eq(out.receipt.nativeP06E02,false);
  eq(out.receipt.nativeP06E03,false);
  yes(!JSON.stringify(out.publicPlan).includes('"answerSpec"'));
  variants.push(out);
 }
}
for(const plan of variants.filter(v=>v.typeId==='D5').map(x=>x.publicPlan)){
 eq(plan.mode,'TANGRAM');
 eq(plan.items.length,3);
 eq(plan.targets.length,3);
 const core=geo.session(plan);
 const sourceJSON=JSON.stringify(plan);
 for(const piece of plan.items){
  const mapping=fix.resolveTarget(plan,piece.id);
  yes(mapping.ok,'unique public outline');
  eq(mapping.from,'PUBLIC_OUTLINE_CONGRUENCE_NO_ANSWER_MAP');
  eq(mapping.rotation,0,'source shapes should match target angle 0');
  const target=plan.targets.find(x=>x.id===mapping.id);
  const cP=fix.center(piece.geometry),cT=fix.center(target.geometry);
  const t=fix.positionTransform(piece.geometry,cT,0);
  yes(t.includes('translate('+cT.x+' '+cT.y+')'));
  yes(t.includes('translate('+(-cP.x)+' '+(-cP.y)+')'),'inverse local pivot');
  yes(fix.congruentAngle(piece.geometry,target.geometry)===0);
  const sampled=fix.positionTransform(piece.geometry,{x:piece.start[0],y:piece.start[1]},piece.startRotation);
  yes(typeof sampled==='string'&&sampled.includes('rotate('));
  eq(fix.positionTransform(piece.geometry,{x:Infinity,y:3},0),null);
 }
 eq(JSON.stringify(plan),sourceJSON,'native plan must remain unchanged');
 core.selectPiece(plan.items[0].id);
 const a=fix.resolveTarget(plan,plan.items[0].id);
 eq(core.placePiece(plan.items[0].id,a.id).ok,true);
 eq(core.snapshot().pieces[plan.items[0].id].placedTargetId,a.id);
 eq(core.clear().ok,true);
 eq(Object.values(core.snapshot().pieces).filter(x=>x.placedTargetId!==null).length,0);
 const bad=structuredClone(plan);bad.targets[1].geometry=structuredClone(bad.targets[0].geometry);
 eq(fix.resolveTarget(bad,plan.items[0].id).code,'AMBIGUOUS_MATCHING_VISIBLE_OUTLINES');
 eq(fix.resolveTarget(plan,'unknown').code,'UNKNOWN_PIECE');
}
for(const v of variants.filter(v=>v.typeId==='D9')){
 const plan=v.publicPlan;
 eq(plan.rows.length,2);
 eq(plan.questions[0].type,'COMPARE_DIFFERENCE');
 const [a,b]=plan.rows;
 const relation=plan.questions[0].relation;
 yes((relation==='MORE_THAN'&&a.itemCount>b.itemCount)||(relation==='LESS_THAN'&&a.itemCount<b.itemCount));
 yes(a.itemCount>0&&b.itemCount>0);
}
const candidate=producer.generate({mode:'D5_TANGRAM',seed:'b5_tamper',index:0});
yes(!resolvePublic({...candidate,source:{...candidate.source,lessonId:'toan_b21'}},producer).ok);
yes(!resolvePublic({...candidate,receipt:{...candidate.receipt,gasAllowed:true}},producer).ok);
yes(!resolvePublic({...candidate,receipt:{...candidate.receipt,gradingAllowed:true}},producer).ok);
yes(!resolvePublic({...candidate,receipt:{...candidate.receipt,nativeP06E02:true}},producer).ok);
console.log('G76B5A_POLICY_PRODUCER_TANGRAM_GEOMETRY_PASS',count,'assertions; 6 seeded E04 cases from true sidecar; 12-base manifest unchanged; owner pedagogical registry denied');
