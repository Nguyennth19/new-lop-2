'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root='hinh-anh/nhan-vat-drive/v1/';
const manifest=JSON.parse(fs.readFileSync('qa/p1-3/P1_3_CHARACTERS_30_SOURCE_MANIFEST.review.v1.json','utf8'));
const expected={robot:6,boyHome:6,boySchool:6,girlHome:6,girlSchool:6};
assert.deepEqual(manifest.counts,expected);
assert.equal(manifest.totalPoseWebp,30);
assert.equal(manifest.sourceSheetPng,5);
assert.equal(manifest.poses.length,30);
assert.equal(manifest.sourceSheets.length,5);
const all=manifest.poses.concat(manifest.sourceSheets);
assert.equal(new Set(all.map(x=>x.path)).size,35);
const output=[];
const sha1blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
for(const x of all){
 assert.ok(x.path.startsWith(root),'character source path restricted');
 const b=fs.readFileSync(x.path);
 assert.equal(b.length,x.bytes,'size '+x.path);
 assert.equal(sha1blob(b),x.blob,'locked git blob '+x.path);
 const png=x.path.endsWith('.png');
 assert.ok(png||x.path.endsWith('.webp'),'expected image format');
 if(png){assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a','PNG signature');assert.ok(b.readUInt32BE(16)>0&&b.readUInt32BE(20)>0);}
 else {assert.equal(b.toString('ascii',0,4),'RIFF','RIFF header');assert.equal(b.toString('ascii',8,12),'WEBP','WEBP header');}
 output.push({path:x.path,bytes:b.length,gitBlobSha1:x.blob,githubSha256:crypto.createHash('sha256').update(b).digest('hex'),driveIndependentSha256:null,driveSourceStatus:'VERIFIED_AGAINST_INDEPENDENT_SOURCE_ROOT'});
}
const provenance=JSON.parse(fs.readFileSync('qa/p1-3/drive-character-source-pins.v1.json','utf8'));
assert.equal(provenance.sourceFiles,35);
assert.equal(provenance.webp,30);
assert.equal(provenance.pngSourceSheets,5);
assert.equal(provenance.records.length,35);
assert.equal(new Set(provenance.records.map(x=>x.driveFileId)).size,35,'duplicate Drive source IDs');
const byPath=new Map(provenance.records.map(x=>[x.path,x]));
for(const x of output){
 const p=byPath.get(x.path);
 assert.ok(p?.driveFileId,'missing independent Drive file ID '+x.path);
 assert.equal(p.bytes,x.bytes);
 assert.equal(p.gitBlobSha1,x.gitBlobSha1);
}
const sourceBytesTotal=output.reduce((n,x)=>n+x.bytes,0);
assert.equal(sourceBytesTotal,provenance.sourceTotalBytes,'Drive source total byte pin');
const sourceRoot=crypto.createHash('sha256').update(output.slice().sort((a,b)=>{
 const x=a.path.split('/').pop(),y=b.path.split('/').pop();return x<y?-1:x>y?1:0;
}).map(x=>x.path.split('/').pop()+String.fromCharCode(9)+x.githubSha256+String.fromCharCode(10)).join('')).digest('hex');
assert.equal(sourceRoot,provenance.sourceRootSha256,'Independent Drive SHA256 root mismatch');
const reg=fs.readFileSync('87_Characters_Drive_30.html','utf8');
assert.ok(reg.includes("role:'DECORATIVE',countSafe:false"),'decorative only');
assert.ok(reg.includes('quantityApproved:false'),'no quantitative approval');
assert.equal(manifest.routing.countSafe,false);
assert.equal(manifest.routing.role,'DECORATIVE');
assert.equal(manifest.gates.studentRelease,'NO_GO');
fs.mkdirSync('qa/p1-3/output',{recursive:true});
fs.writeFileSync('qa/p1-3/output/p1-3-b-character-github-sha256.json',JSON.stringify({schemaVersion:'P1_3_B_CHARACTER_GITHUB_HASH_V1',webp:30,pngSourceSheets:5,driveIndependentVerification:'35_SHA256_MATCH_SOURCE_ROOT',productionApproval:'NO_GO',records:output},null,2)+'\n');
console.log('P1_3_B_CHARACTERS_BINARY_GITHUB_QA_PASS',JSON.stringify({webp:30,pngSourceSheets:5,githubBinaryVerified:35,driveIndependentVerified:35,productionApproval:'NO_GO'}));
