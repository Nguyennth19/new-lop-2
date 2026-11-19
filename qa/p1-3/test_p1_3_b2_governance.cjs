'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const m=read('qa/p1-3/P1_3_B2_CHARACTERS_MANIFEST.v2.json');
const old=read('qa/p1-3/P1_3_CHARACTERS_30_SOURCE_MANIFEST.review.v1.json');
const pins=read('qa/p1-3/drive-character-source-pins.v1.json');
assert.equal(m.schemaVersion,'LOP2_P1_3_B2_CHARACTER_MANIFEST_V2');
assert.equal(m.generatedFrom.b1Checkpoint,'c17be322960f01ab7417d1e1ecc685eb7de141ac');
assert.deepEqual(m.counts,{webp:30,sourceSheets:5,robot:6,boyHome:6,boySchool:6,girlHome:6,girlSchool:6});
assert.equal(m.poses.length,30);assert.equal(m.sourceSheets.length,5);
assert.equal(new Set(m.poses.map(x=>x.assetId)).size,30);
assert.equal(new Set([...m.poses,...m.sourceSheets].map(x=>x.driveFileId)).size,35);
assert.equal(m.provenance.sourceRootSha256,pins.sourceRootSha256);
assert.equal(m.provenance.sourceTotalBytes,pins.sourceTotalBytes);
assert.deepEqual(m.runtimeContract.allowedVisualIntents,['DECORATIVE']);
assert.deepEqual(m.runtimeContract.deniedVisualIntents,['CHOICE','EXACT_COUNT']);
assert.equal(m.runtimeContract.countSafe,false);
assert.equal(m.runtimeContract.denyAutomaticLegacyAlias,true);
assert.equal(m.runtimeContract.sourceSheetsRuntimeEligible,false);
assert.equal(m.qa.binaryProvenance,'PASS_35_OF_35');
assert.equal(m.qa.studentRelease,'NO_GO');
assert.equal(m.qa.ownerVisualApproval,'NOT_INFERRED');
assert.equal(m.qa.publicRoutingApproval,'NOT_GRANTED_BY_THIS_AUDIT');
const original=new Map([...old.poses,...old.sourceSheets].map(x=>[x.path,x]));
const pinned=new Map(pins.records.map(x=>[x.path,x]));
const shaBlob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
let checked=0;
for(const entry of [...m.poses,...m.sourceSheets]){
 const o=original.get(entry.path),p=pinned.get(entry.path);
 assert.ok(o&&p,'must exist in both historical manifests');
 assert.equal(entry.gitBlobSha1,o.blob);assert.equal(entry.gitBlobSha1,p.gitBlobSha1);
 assert.equal(entry.driveFileId,p.driveFileId);assert.equal(entry.driveFilename,p.driveFilename);
 assert.equal(entry.bytes,o.bytes);assert.equal(entry.bytes,p.bytes);
 const b=fs.readFileSync(entry.path);
 assert.equal(b.length,entry.bytes);assert.equal(shaBlob(b),entry.gitBlobSha1);
 checked++;
}
for(const p of m.poses){
 assert.equal(p.assetId,p.path.split('/').pop().replace(/_v1\.webp$/,''));
 assert.equal(p.role,'DECORATIVE');assert.equal(p.countSafe,false);
 assert.equal(p.quantityApproved,false);assert.equal(p.choiceEligible,false);
 assert.equal(p.renderEligibility,'EXISTING_REFERENCE_ONLY');
 assert.equal(p.ownerApproval,'NOT_GRANTED_BY_THIS_AUDIT');
 assert.ok(['BOY','GIRL','ROBOT'].includes(p.actor));
 assert.ok(['home','school','mascot'].includes(p.context));
}
for(const p of m.sourceSheets){assert.equal(p.role,'SOURCE_ONLY');assert.equal(p.runtimeEligible,false);}
const sandbox={window:{},console,Map,Set};sandbox.globalThis=sandbox.window;
for(const path of ['59_Visual_Public_Assets.html','85_Fluent_Asset_46.html','87_Characters_Drive_30.html','88_Visual_Semantic_Router.html']){
 vm.runInNewContext(fs.readFileSync(path,'utf8'),sandbox,{filename:path});
}
const registry=sandbox.window.BE_HOC_CHARACTERS_30, router=sandbox.window.BE_HOC_VISUAL_SEMANTIC;
assert.equal(registry.count,30);
assert.equal(registry.list().length,30);
const live=new Map(registry.list().map(x=>[x.id,x]));
for(const p of m.poses){
 const entry=live.get(p.assetId);
 assert.ok(entry,'missing runtime asset: '+p.assetId);
 assert.equal(entry.role,'DECORATIVE');assert.equal(entry.countSafe,false);
 assert.ok(router.plan({assetId:p.assetId,visualIntent:'DECORATIVE'}).ok);
 for(const visualIntent of ['CHOICE','EXACT_COUNT']){
  const denied=router.plan({assetId:p.assetId,visualIntent,exactQuantity:2,countUnit:'bạn'});
  assert.equal(denied.ok,false,p.assetId+' must deny '+visualIntent);
  assert.equal(denied.reason,'CHARACTER_DECORATION_ONLY');
 }
}
for(const id of ['KL_ROBOT_MASCOT_01_standing_front_v1.0.0','KL_GIRL_SCHOOL_05_point_book_v1.0.1','KL2_ROBOT_NOT_IN_MANIFEST']){
 assert.equal(router.plan({assetId:id,visualIntent:'DECORATIVE'}).ok,false);
}
assert.deepEqual(m.legacyVersions.map(x=>x.status),['ARCHIVE_SEPARATE_BINARY_SERIES','CORRECTIONS_NOT_AUTOMATIC_REPLACEMENT']);
console.log('P1_3_B2_MANIFEST_GOVERNANCE_PASS',JSON.stringify({binaryChecked:checked,manifestPoses:30,sourceSheets:5,decorativeAllow:30,choiceDenied:30,exactCountDenied:30,legacyDenied:3,studentRelease:'NO_GO'}));
