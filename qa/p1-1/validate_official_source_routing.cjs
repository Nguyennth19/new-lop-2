#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const a=require('node:assert/strict');
const prefix='qa/p1-1/';
const o=JSON.parse(fs.readFileSync(prefix+'P1_1_OFFICIAL_SOURCE_ROUTING_19.json','utf8'));
const m=JSON.parse(fs.readFileSync(prefix+'P1_1_DEEP_SOURCE_DECISIONS_19.review.v2.json','utf8'));
a.equal(o.registryId,'P1_1_OFFICIAL_SOURCE_ROUTING_19');
a.equal(o.state,'OWNER_APPROVED_SOURCE_SELECTION_SCOPE_ONLY');
a.equal(o.isStudentReleaseAuthority,false);
a.equal(o.records.length,19);
a.equal(new Set(o.records.map(r=>r.domain)).size,19);
a.equal(o.selectionSummary.keep,15);
a.equal(o.selectionSummary.replaceScopeSpecific,4);
a.equal(o.selectionSummary.ownerApprovedSelections,19);
a.equal(o.sourcePins.ratifiedMatrixBlobSha,'e361b934b32bb42a0e0f8075a8df3d2ee09b562a');
a.equal(o.records.filter(r=>r.sourceSelectionDecision==='REPLACE_SCOPE_SPECIFIC').length,4);
a.equal(o.P13Handoff.individualPngMirroredToGithubHistorical + o.P13Handoff.individualPngStillToMirror,o.P13Handoff.sourcePngRecordsHistorical);
a.equal(o.P12Handoff.publicVariantApprovedFromExistingPackages,0);
a.equal(o.P12Handoff.studentPlayableFromExistingLessonPackages,0);
a.equal(o.exceptions.G2BIndependentSignature,'0_OF_96');
a.equal(o.exceptions.G76OwnerPackets,'0_OF_6');
a.equal(o.exceptions.studentRelease,'NO_GO');
const ma=new Map(m.records.map(x=>[x.domain,x]));
for(const r of o.records){
 const x=ma.get(r.domain);a.ok(x);
 a.equal(r.sourceSelectionDecision,x.decision);
 a.equal(r.selected.url,x.sourceForScope.url);
 a.equal(r.originalPreserved.url,x.priorSource.url);
 a.equal(r.studentReleasePermission,false);
 a.equal(r.routingOwnerApproval,'OWNER_APPROVED_SELECTION_SCOPE_ONLY_2026_11_18');
 a.equal(r.sourceExactIndependentApproval,'NOT_GRANTED_BY_P1_1');
 a.equal(r.realGASApproval,'NOT_GRANTED_BY_P1_1');
 a.equal(r.rendererAssetPublicVariantGrant,'NOT_GRANTED_BY_P1_1');
 a.ok(r.rollback);
}
console.log('P1.1 official routing structural checks PASS 19/19; owner routing 15 KEEP / 4 scoped replacement; release NO-GO');
