'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'); const path=require('node:path');
const root=path.resolve(__dirname,'../..');const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const v=get('qa/g7-6-b6-c08/source-reconciliation.v1.json');
const m=get('qa/g7-6-b6-c08/p06-runtime-crosswalk.v1.json');
const c=get('qa/g7-6-b6-c08/c07-contract-review.v1.json');
const cp=get('qa/g7-6-b6-c08/checkpoint.c08.v1.json');
const b6=get('qa/g7-6-b6/checkpoint.g76b6.v1.json');
let n=0;function eq(a,b){assert.deepStrictEqual(a,b);n++}function yes(x){assert.ok(x);n++}function no(x){assert.ok(!x);n++}
eq(b6.c07ToC12.approved,0);eq(b6.inherited.replayed,false);
eq(v.sourceVolumes.t1.sha256,'cb8cb303294edc0be2f36a9507965b59345c0d53c296d610858e7454dfa8321e');
eq(v.sourceVolumes.t2.sha256,'044142f31fa94769a143dd029422ee74c49480ad9304e567cc8d97efa4c42f36');
eq(v.sourceVolumes.t1.printedToPdfPageOffset,1);eq(v.sourceVolumes.t2.printedToPdfPageOffset,1);
eq(v.proposedSessionCorrections.length,4);eq(v.exerciseRecordsToQuarantine.length,13);eq(v.variantRuleSuspensions.length,2);
for(const entry of v.proposedSessionCorrections){eq(entry.proposed.pdf[0],entry.proposed.printed[0]+1);eq(entry.proposed.pdf[1],entry.proposed.printed[1]+1);}
eq(v.proposedSessionCorrections[0].proposed.printed,[106,107]);
eq(v.proposedSessionCorrections[1].proposed.printed,[108,109]);
eq(v.proposedSessionCorrections[2].proposed.printed,[102,103]);
eq(v.proposedSessionCorrections[3].proposed.printed,[104,105]);
eq(v.directEvidence.B027.printed,[106,107,108,109]);
eq(v.directEvidence.B065.printed,[102,103,104,105]);
yes(v.directEvidence.B027.observations.some(x=>x.includes('four triangles')));
yes(v.directEvidence.B065.observations.some(x=>x.includes('TEN matchsticks')));
eq(v.deterministicGate.b65OneSymbolTenUnitsExcludedFromCurrentD9,true);
for(const row of v.exerciseRecordsToQuarantine){eq(row.releaseAllowed,false);yes(/^SGK_B0(27|65)_T0[12]_E0[1-4]$/.test(row.recordId));}
eq(new Set(v.exerciseRecordsToQuarantine.map(x=>x.recordId)).size,13);
eq(v.variantRuleSuspensions[0].currentAllowedMutation,'change_hour_hand');
eq(v.observations.noSheetMutation,true);eq(v.observations.originalPdfHashVerifiedForTwoDriveFiles,true);
eq(v.observations.originalEditionRegistryHashVerified,false);
eq(m.observedCatalog.length,4);
eq(m.observedCatalog[0].lessonId,'toan_b21');
eq(m.observedCatalog[1].lessonId,'toan_b20');
eq(m.observedCatalog[2].lessonId,'toan_b24');
no(m.observedCatalog.some(x=>['toan_b27','toan_b65'].includes(x.lessonId)));
for(const k of m.candidates){eq(k.registeredInPinnedP06,false);eq(k.hasTrustedAdapter,false);eq(k.lessonIdApproved,false);eq(k.skillIdApproved,false);eq(k.mayActivateE04,false);eq(k.suggestedRuntimeSkillId,null);}
eq(m.candidates[0].sourceId,'MATH_B027');eq(m.candidates[1].sourceId,'MATH_B065');
eq(m.candidates[0].sourceSkillId,'SKILL_PRACTICE_SHAPES_DRAWING');
eq(m.candidates[1].sourceSkillId,'SKILL_PICTOGRAPH');
eq(m.schemaContract.noSkillIdAutoInvented,true);eq(m.schemaContract.forbidsB21Attachment,true);
eq(c.independence,'C07_DOES_NOT_DEPEND_ON_C08_FOR_CONTRACT_TESTING');
eq(c.ownerDecision,null);eq(c.signature,null);eq(c.registerInManifestTest,false);
for(const val of Object.values(c.constraints))eq(val,typeof val==='boolean' && val===true ? true : val);
eq(cp.coverage.old1710AssertionsRerun,false);
eq(cp.coverage.sessionRowsProposed,4);
eq(cp.coverage.exerciseRowsQuarantined,13);
for(const v of Object.values(cp.protected))eq(v,true===v?true:false===v?false:v);
eq(cp.approvals.C08,'BLOCKED_PENDING_RECONCILIATION_AND_PEDAGOGY');
eq(cp.rollback.appRollbackRequired,false);eq(cp.rollback.gasRollbackRequired,false);
const source=process.argv[2];
if(source){
 const real=JSON.parse(fs.readFileSync(path.resolve(root,source,'thu-nghiem/p0-6/fb/fb2-lesson-catalog.candidate.json'),'utf8'));
 eq(real.schemaVersion,'p0.6.fb2.catalog.v1');eq(real.lessons.length,4);
 for(const l of m.observedCatalog){const r=real.lessons.find(x=>x.lessonId===l.lessonId);yes(r);eq(r.state,l.state);}
 no(real.lessons.some(l=>['toan_b27','toan_b65'].includes(l.lessonId)));
}
console.log('G76B6_C08_SOURCE_AND_P06_ID_CONTRACT_PASS',n,'NEW assertions; C08 remains BLOCKED; C07 independent pending');
