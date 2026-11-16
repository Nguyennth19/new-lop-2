'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const get=x=>JSON.parse(fs.readFileSync(path.resolve(__dirname,x),'utf8'));
const e=get('e04-owner-options.v1.json'),s=get('skill-id-owner-options.v1.json'),m=get('activation-readiness.v1.json'),c=get('owner-signoff-checklist.pending.v1.json'),cp=get('checkpoint.c083.v1.json');
const b=get('../g7-6-b5a/e04-curriculum-policy.draft.v1.json'),p=get('../g7-6-b6-c082/p06-lesson-skill-registration.candidate.v1.json');
const source=get('../g7-6-b6-c082/source-item-review.v1.json');
let n=0;const eq=(x,y)=>{a.deepEqual(x,y);n++;},ok=x=>{a.ok(x);n++;};
eq(e.decisions.length,2);eq(e.sourceItemOwnerDisposition.reviewedItemCount,13);eq(e.sourceItemOwnerDisposition.approvedSourceRows,0);
eq(e.sourceItemOwnerDisposition.nonReusableLegacyIds.length,source.legacyItems.length);
for(const x of e.decisions){eq(x.chosenOption,null);eq(x.signature,null);eq(x.ownerApproved,false);ok(x.options.every(o=>o.wouldAllowRealP06Activation===false));ok(x.options.some(o=>o.id===x.recommendedOption));}
eq(e.rules.d5ThreePieceOnlyLab,true);eq(e.rules.d9MaxRows,b.families[1].maxRows);eq(e.rules.d9MaxCountEachRow,b.families[1].maxItemsPerRow);
eq(e.rules.d9SymbolUnit,1);eq(e.rules.d9CompareDifferenceOnly,true);eq(e.rules.lv3Unsupported,true);eq(e.rules.forbidB21,true);
eq(s.fields.length,2);eq(s.createRegistryFileNow,false);eq(s.allowRegistryMutation,false);
for(let i=0;i<2;i++){let x=s.fields[i],y=p.proposals[i];eq(x.lessonIdCandidate,y.proposedLessonId);eq(x.skillIdCandidate,y.proposedSkillId);eq(x.approvedLessonId,null);eq(x.approvedSkillId,null);eq(x.verifiedExistingInP06,false);eq(x.skillOwnerSignature,null);}
eq(c.packets.length,6);for(const x of c.packets){eq(x.signature,null);eq(x.decision,null);}
eq(m.stages.length,5);eq(m.stages[0].satisfied,true);for(const x of m.stages.slice(1)){eq(x.satisfied,false);eq(x.authorization,'DENIED');}
eq(m.sourceTaskSelectionAllowed,false);eq(m.releaseReady,false);
eq(cp.counts.approvedSkillIds,0);for(const x of Object.values(cp.protected))eq(x,true);
const producer=require('../g7-6-b5a/e04-producer-contract.cjs');
let r=producer.eligibleForActivation({sourceEvidence:{},ownerSignature:'not-a-signed-proof',lessonId:'toan_b27',skillId:'SHAPE_COMPOSE_SELECT'});
eq(r.ok,false);eq(r.code,'E04_APPROVED_CURRICULUM_REGISTRY_NOT_CONNECTED');
if(process.argv[2]){let reg=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../',process.argv[2],'thu-nghiem/p0-6/fb/fb2-lesson-catalog.candidate.json'),'utf8'));eq(reg.schemaVersion,'p0.6.fb2.catalog.v1');for(let x of s.fields)ok(!reg.lessons.some(y=>y.lessonId===x.lessonIdCandidate));}
console.log('C083_OWNER_READINESS_NO_GO_GATES_PASS',n,'new assertions; no owner signoff, no registration');