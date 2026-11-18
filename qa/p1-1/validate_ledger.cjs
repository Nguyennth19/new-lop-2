#!/usr/bin/env node
const fs=require("node:fs"), assert=require("node:assert/strict");
const p="qa/p1-1/SOURCE_OF_TRUTH_LEDGER_19.review.v1.json";
const b="qa/p1-1/BRANCH_HEADS_129.prebranch.v1.json";
const d=JSON.parse(fs.readFileSync(p,"utf8")), inv=JSON.parse(fs.readFileSync(b,"utf8"));
assert.equal(d.records.length,19);assert.equal(new Set(d.records.map(x=>x.domain)).size,19);
assert.equal(d.ledgerStatus,"REVIEW_CANDIDATE_RECONCILED_NOT_OWNER_LOCKED");
assert.equal(inv.branches.length,inv.branchCount);assert.equal(new Set(inv.branches.map(x=>x.branch)).size,inv.branchCount);
const heads=new Map(inv.branches.map(x=>[x.branch,x.sha]));
for(const x of d.records){assert.ok(x.domain && x.selectedSource.url && x.passScope && x.owner.decisionStatus && x.owner.scope && x.rollback && Array.isArray(x.evidenceRefs));
assert.equal(x.owner.officialLedgerLock,"PENDING_OWNER_REVIEW");assert.equal(x.releaseState,"STUDENT_RELEASE_NOT_AUTHORIZED_BY_THIS_LEDGER");
if(x.selectedSource.branch){assert.equal(x.selectedSource.sha,heads.get(x.selectedSource.branch));assert.equal(x.selectedSource.headMatchesPinned,true);}
else assert.ok(x.selectedSource.driveId);
}
assert.equal(d.reconciliation.remainingOfficialOwnerLedgerLocks,19);
assert.equal(d.reconciliation.deepContentFullyReverified,0);
assert.ok(d.supplementaryScopeNotPartOf19.some(x=>x.id==="A05_TEST_NEW_UX"));
assert.ok(d.supplementaryScopeNotPartOf19.some(x=>x.id==="A06_DRIVE_PNG_MASTER"));
console.log("P1.1 ledger scope check: 19/19 structural records PASS; NO owner canonical/release approval inferred.");
