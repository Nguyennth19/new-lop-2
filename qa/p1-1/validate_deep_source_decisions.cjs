const fs=require('node:fs'),a=require('node:assert/strict'),p='qa/p1-1/';
const x=JSON.parse(fs.readFileSync(p+'P1_1_DEEP_SOURCE_DECISIONS_19.review.v2.json','utf8'));
const y=JSON.parse(fs.readFileSync(p+'P1_1_P1_2_P1_3_HANDOFF.review.v1.json','utf8'));
a.equal(x.records.length,19);a.equal(new Set(x.records.map(z=>z.domain)).size,19);
a.equal(x.counts.kept,15);a.equal(x.counts.replacedScoped,4);
a.equal(x.approval.newOwnerScopeApproval,0);a.equal(x.approval.releaseNoGo,true);
a.equal(x.records.filter(z=>z.decision==='REPLACE_SCOPE_SPECIFIC').length,4);
for(const z of x.records){a.ok(z.priorSource.url&&z.sourceForScope.url&&z.ownerRole&&z.rollback&&z.evidence.length);a.equal(z.priorSourceRetained,true);a.equal(z.ownerP11SelectionSignoff,'PENDING_OWNER_REVIEW');}
a.equal(y.P1_3.sourcePng,y.P1_3.githubMirroredPng+y.P1_3.remainingPng);
a.equal(x.scopeEvidence.newlyChecked.QAWorkbook.gasAcceptance,'NOT_RUN');
console.log('P1.1 19-domain source selection structural QA PASS. Owner lock/release remains blocked.');
