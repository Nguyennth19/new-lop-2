'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const get=x=>JSON.parse(fs.readFileSync(path.join(__dirname,x),'utf8'));
const w=get('working-source-overlay.v1.json'),v=get('vbt-lv2-evidence.v1.json'),p=get('pedagogic-review.pending.v1.json'),c=get('c07-contract-review.v1.json'),k=get('checkpoint.c081.v1.json');
const registry=require('../../du-lieu/g7-6/resource-renderer-manifest.v1.json');
const mental=require('../g7-6-b3/mental-number-input.cjs');
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++},yes=x=>{assert.ok(x);n++};
eq(w.appliedToWorkingCopy,true);eq(w.originalSheetModified,false);eq(w.ownerSignature,null);
eq(w.sourceSessions.length,8);eq(w.quarantinedOriginalExerciseRows.length,13);eq(w.disabledOriginalRules.length,2);
for(const x of w.sourceSessions){eq(x.status,'PATCHED_IN_ISOLATED_WORKING_COPY_ONLY');eq(x.approved,false);yes(x.before.length>=15);yes(x.after.length>=15);eq(x.after[14],'C081_WORKING_PAGE_VERIFIED_NOT_OWNER_APPROVED');}
for(const x of w.quarantinedOriginalExerciseRows){eq(x.status,'QUARANTINED_SOURCE_MISMATCH');eq(x.runtimeAllowed,false);}
for(const x of w.disabledOriginalRules)eq(x.runtimeAllowed,false);
eq(v.exercises.length,13);eq(v.sources[0].printedPages,[100,101,102,103]);eq(v.sources[1].printedPages,[93,94,95]);
yes(v.exercises.some(x=>x.compatibility==='D9_UNIT_SCALE_NOT_SUPPORTED'));
yes(v.exercises.some(x=>x.compatibility==='D5_VARIANT_REVIEW'));
for(const x of v.exercises)eq(x.approvedForRuntime,false);
eq(p.families.length,2);eq(p.p06RegistryHasB27B65,false);eq(p.forbidB21,true);
for(const x of p.families){eq(x.runtimeSkillId,null);eq(x.signoff,null);eq(x.activation,false);}
eq(c.independentOfC08,true);eq(c.registerTest,false);eq(c.ownerSignature,null);
eq(registry.rendererRegistry.length,12);yes(!registry.rendererRegistry.some(x=>x.id===c.rendererId));
const policy={lessonId:'toan_b21',status:'DRAFT_OWNER_SIGNOFF_PENDING',mathConstraints:{minOperand:1,maxOperand:99,minResult:0,maxResult:100,requireCarry:true}};
const q={id:'VAR_TOAN_B21_G_abcdefabcdef',kind:'math.mental',renderer:{component:'math.mental'},levelId:'LV1',parameters:{a:67,b:3},prompt:'Tính: 67 + 3 = ?',assets:{sceneId:null},answerSpec:{mode:'exact',value:70,pedagogyApproval:{status:'PENDING'}}};
const projected=mental.projectMental(q,{lessonId:'toan_b21',policy});
eq(projected.ok,true);eq(projected.publicPlan.input.maxLength,3);eq(projected.publicPlan.answerKeyIncluded,false);
yes(!JSON.stringify(projected.publicPlan).includes('answerSpec'));eq(mental.projectMental(q,{lessonId:'toan_b65',policy}).ok,false);
eq(k.sourceSheetsEdited,false);eq(k.manifestEdited,false);eq(k.p06Edited,false);eq(k.old1710TestsRerun,false);
console.log('G76_C081_WORKING_PATCH_AND_C07_CONTRACT_PASS',n,'new checks; C08 NO-GO C07 owner pending');