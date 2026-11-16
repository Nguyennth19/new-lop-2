'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('./checkpoint.v1.json');
const matrix=require('./consolidation-decisions.v1.json'),approval=require('./owner-review.pending.v1.json');
let n=0;const eq=(x,y)=>{assert.deepEqual(x,y);n++;},ok=x=>{assert.ok(x);n++;};
eq(matrix.rules.length,10);eq(new Set(matrix.rules.map(r=>r.id)).size,10);
eq(matrix.rules.map(r=>r.id),Array.from({length:10},(_,i)=>'R'+String(i+1).padStart(2,'0')));
eq(matrix.counts.technicalDecisionCounts,{MERGE_EDIT:5,REFERENCE_EXISTING:5});
eq(matrix.counts.ownerVerified,0);eq(matrix.counts.adoptedRules,0);
eq(approval.perRuleDecisions.length,10);eq(approval.ownerApprovedCount,0);eq(approval.projectRulesWritten,false);
for(const r of matrix.rules){ok(r.sourceRefs.length>=2);ok(r.crosswalkIds.length>=1);eq(r.ownerApproved,false);eq(r.adopted,false);eq(r.ownerDecision,'PENDING');}
for(const d of approval.perRuleDecisions){eq(d.ownerDecision,null);eq(d.ownerEvidenceRef,null);eq(d.ownerIdentityVerified,false);eq(d.ownerScopeVerified,false);eq(d.ownerSignature,null);eq(d.approved,false);}
eq(matrix.officialProjectRulesExistsInPinnedTrees,false);eq(matrix.reviewGuard.officialFileMayBeWritten,false);
eq(matrix.reviewGuard.C08,'PENDING');eq(matrix.reviewGuard.C09,'PENDING_C08');eq(matrix.reviewGuard.p06Test,'DENIED');
const candidate=fs.readFileSync(path.join(__dirname,'PROJECT_RULES.review-candidate.v0.1.md'),'utf8');
for(const heading of ['C01 – Task provenance','C02 – Small context index','C03 – Model-neutral handoff','C04 – Reuse-first','C05 – Evidence retention'])ok(candidate.includes(heading));
for(const rule of ['R04','R05','R06','R07','R09'])ok(candidate.includes(rule+' –'));
ok(candidate.includes('NOT THE OFFICIAL PROJECT_RULES.md'));
const original=fs.readFileSync(path.join(__dirname,'../../docs/kiem-dinh/G7.6_EXTERNAL_WORKFLOW_RULES_DELTA_PROPOSAL_20261116.md'),'utf8');
for(const raw of ['taskId','PROJECT_STATE_INDEX','Handoff','read-only CI','Append-only','C07/C08/C09','model-generated','Reuse-first','answerSpec','Restore/rollback'])ok(original.includes(raw));
const pending=require('../g7-6-b6-c086/resolution.pending.v1.json');
eq(pending.tally.PENDING,6);eq(pending.gates.C08,'PENDING');eq(pending.gates.C09,'PENDING_C08');
const renderers=require('../../du-lieu/g7-6/resource-renderer-manifest.v1.json');
eq(renderers.rendererRegistry.length,12);eq(renderers.status,'PINNED_TEST_REGISTRY_NOT_A_RUNTIME_DEPLOYMENT');
const csv=fs.readFileSync(path.join(__dirname,'consolidation-decisions.v1.csv'),'utf8');eq(csv.trim().split(/\r?\n/).length,11);
eq(cp.counts.reviewed,10);eq(cp.counts.officialProjectRulesCreated,0);eq(cp.guard.officialRulesWrite,false);
for(const s of ['mainWrite','testTheoMainWrite','gasWrite','studentDataWrite','sourceSheetsWrite','officialManifestWrite'])eq(cp.guard[s],false);
console.log('G76_WORKFLOW_RULES_CONSOLIDATION_REVIEW_PASS',n,'auditable checks; owner decisions pending; no canonical rules emitted');