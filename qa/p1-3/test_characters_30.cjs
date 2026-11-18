'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const manifest=JSON.parse(fs.readFileSync('qa/p1-3/P1_3_CHARACTERS_30_SOURCE_MANIFEST.review.v1.json','utf8'));
const shaBlob=d=>crypto.createHash('sha1').update(Buffer.from('blob '+d.length+'\0')).update(d).digest('hex');
function readWebpDimensions(buf){
 assert.equal(buf.toString('ascii',0,4),'RIFF');assert.equal(buf.toString('ascii',8,12),'WEBP');
 let pos=12;
 while(pos+8<=buf.length){
  const type=buf.toString('ascii',pos,pos+4),n=buf.readUInt32LE(pos+4),q=pos+8;
  assert.ok(n>0&&q+n<=buf.length,'WEBP chunk bounded '+type);
  if(type==='VP8X'&&n>=10){
   const w=buf.readUIntLE(q+4,3)+1,h=buf.readUIntLE(q+7,3)+1;
   return {width:w,height:h,alpha:!!(buf[q]&0x10),format:'VP8X'};
  }
  if(type==='VP8 '&&n>=10&&buf[q+3]===0x9d&&buf[q+4]===0x01&&buf[q+5]===0x2a){
   return {width:buf.readUInt16LE(q+6)&0x3fff,height:buf.readUInt16LE(q+8)&0x3fff,alpha:'NOT_DETERMINED',format:'VP8'};
  }
  if(type==='VP8L'&&n>=5&&buf[q]===0x2f){
   const bits=buf.readUInt32LE(q+1);
   return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1,alpha:!!(bits&0x10000000),format:'VP8L'};
  }
  pos=q+n+(n&1);
 }
 throw new Error('Unknown WebP image header');
}
function check(){
 assert.equal(manifest.totalPoseWebp,30);assert.equal(manifest.sourceSheetPng,5);
 assert.equal(new Set(manifest.poses.map(x=>x.path)).size,30);
 assert.deepEqual(Object.values(manifest.counts).sort((a,b)=>a-b),[6,6,6,6,6]);
 const formats={};let transparencyUnknown=0;
 for(const x of manifest.poses){
  const bytes=fs.readFileSync(x.path),info=readWebpDimensions(bytes);
  assert.equal(bytes.length,x.bytes,x.path+' byte length');
  assert.equal(shaBlob(bytes),x.blob,x.path+' Git blob');
  assert.ok(info.width>=100&&info.width<=4096&&info.height>=100&&info.height<=4096,x.path+' pixel bounds');
  assert.ok(/\/(robot|boy|girl)\//.test(x.path));assert.ok(x.path.endsWith('_v1.webp'));
  formats[info.format]=(formats[info.format]||0)+1;
  if(info.alpha==='NOT_DETERMINED')transparencyUnknown++;
 }
 let sheets=0;
 for(const x of manifest.sourceSheets){
  const bytes=fs.readFileSync(x.path);
  assert.equal(bytes.length,x.bytes,x.path+' bytes');
  assert.equal(shaBlob(bytes),x.blob,x.path+' Git blob');
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',x.path+' PNG');
  assert.ok(bytes.readUInt32BE(16)>0&&bytes.readUInt32BE(20)>0);
  sheets++;
 }
 const text=fs.readFileSync('87_Characters_Drive_30.html','utf8');
 assert.ok(text.includes("role:'DECORATIVE',countSafe:false"));
 assert.ok(text.includes("quantityApproved:false"));
 assert.ok(text.includes("CHARACTER_ILLUSTRATION_ONLY"));
 assert.equal(manifest.routing.countSafe,false);
 assert.equal(manifest.gates.studentRelease,'NO_GO');
 console.log(JSON.stringify({test:'P13_CHARACTER_BINARY_AND_SEMANTICS',status:'PASS',webp:30,sheets,formats,transparencyUnknown,decorativeOnly:true,exactCountDenied:true,driveSourceBytesIndependentlyVerified:false}));
}
check();
