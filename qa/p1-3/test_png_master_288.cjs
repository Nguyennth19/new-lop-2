'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root='hinh-anh/nguon-drive/v1/png-master';
const manifests=['math','shared'].map(n=>JSON.parse(fs.readFileSync('qa/p1-3/drive-png-directory-'+n+'.v1.json','utf8')));
const records=manifests.flatMap(m=>m.records.flatMap(g=>g.files.map(f=>({...f,group:g.group}))));
assert.equal(records.length,288,'expected 288 source directory entries');
assert.equal(new Set(records.map(r=>r.name)).size,288,'duplicate source filenames');
const receipts=fs.readdirSync('qa/p1-3/receipts').filter(f=>f.endsWith('.json')).flatMap(f=>JSON.parse(fs.readFileSync('qa/p1-3/receipts/'+f,'utf8')).rows);
const receiptByName=new Map(receipts.map(r=>[r.name,r]));
assert.equal(receiptByName.size,229,'229 already imported receipt rows');
const inventory=[];let pinsChecked=0;
for(const r of records){
 const filename=path.join(root,r.group,r.name),buf=fs.readFileSync(filename);
 assert.equal(buf.length,r.bytes,'byte size '+r.name);
 assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a','PNG header '+r.name);
 const gitSha=crypto.createHash('sha1').update(Buffer.from('blob '+buf.length+'\0')).update(buf).digest('hex');
 const receipt=receiptByName.get(r.name);
 if(receipt){assert.equal(receipt.fileId,r.fileId,'Drive ID '+r.name);assert.equal(receipt.blobSha,gitSha,'Git blob receipt '+r.name);pinsChecked++;}
 inventory.push({name:r.name,group:r.group,driveFileId:r.fileId,bytes:buf.length,gitBlobSha1:gitSha,sha256:crypto.createHash('sha256').update(buf).digest('hex'),sourceSha256Verified:false});
}
const actual=fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()).flatMap(d=>fs.readdirSync(path.join(root,d.name)).filter(f=>f.endsWith('.png')).map(f=>d.name+'/'+f));
assert.equal(actual.length,288,'no extra PNG files');
assert.equal(pinsChecked,229,'all original 229 receipt pins');
fs.mkdirSync('qa/p1-3/output',{recursive:true});
fs.writeFileSync('qa/p1-3/output/png-master-github-sha256.json',JSON.stringify({schemaVersion:'P1_3_GITHUB_PNG_SHA256_V1',total:288,sourceSha256Verified:false,warning:'These SHA-256 digests were computed from GitHub working-tree bytes, NOT independently from Drive source bytes.',files:inventory},null,2)+'\n');
console.log('P1_3_288_PNG_GIT_BINARY_QA_PASS',JSON.stringify({total:288,pinnedOriginal:229,newAssets:59,sha256Computed:288,driveSha256Matches:'NOT_YET_VERIFIED'}));
