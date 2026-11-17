'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const pins={"M01":["c9c1259003aecfccde0b323de2e0f777a73b3e64","2dd1cb70dee1157a292c32b906a8717180054cac","8bad0a037ce37284368eee827a58b55bbeef770f","73ce7b4157ff4b2f46980467db5a386245623f90","52e2c915fa858983634403ff2e3c328f7d808ac3","4fd82b3078ac1399b8cb527f217a2c71639562e6","e1dbdbddfc265a9e2ab891aae11bb026fdb20e45","eed85efc0fd9a2f91bb6a83284bdbccf81ba5064","d36637dbe56e02ed6e9a8bdd0bed5106351a271c","df8ddd30e74b1619f3f238c82b82dce2fbd18fad","283bbe0b48f707e5eadd330753aaf63932fe02a7","99aecd15c9aa3a9d9e017fcd66ae0ac2d5090877"],"M02":["b7c1ff63a9a3e21124823d602bab324dce65034d","d633b54c29a5d331e7db9dd539edda1b4378f8cd","c118e4a7546b6c666f502d6073c1f00c0413ff3d","8315de811521fdc169efcd4259841bcfac34c889","71f09cb14f084860cb66766b206ee8ffb6171a58","d03a3d0097c24c7940c0427dc6b734268ebd33a9","c2beee32cca41734ce0522114641653dca221eb2","40e4d130e62e308a956f9b54f312b40a54d931cb","ba3df6100f33fa4b06106ff9632a80447ccda12b","4c2912f83411a37f0e8988b99b37e9801bf5b9ce","b7469538d895c5ae65c1d4b77e5fe447475a1b26","94f34a15ce87df987eec71a9090232fb2c5df0c3"]};
const root='hinh-anh/nguon-drive/v1/png-master/';
let checks=0;
for(const [group,shas] of Object.entries(pins)){
 assert.equal(shas.length,12); checks++;
 for(let i=0;i<12;i++){
  const name='KL-'+group+'-'+String(i+1).padStart(2,'0')+'.png';
  const data=fs.readFileSync(root+group+'/'+name);
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name+' must be real PNG'); checks++;
  const gitBlob=crypto.createHash('sha1').update(Buffer.from('blob '+data.length+'\0')).update(data).digest('hex');
  assert.equal(gitBlob,shas[i],name+' exact-byte pin');checks++;
 }
}
const refs=['REF_01_Robot_nguon_CHUA_PHAI_DEMO.webp','REF_02_Tranh_Tieng_Viet_CHUA_PHAI_DEMO.jpg'];
for(const name of refs){assert.ok(fs.statSync('hinh-anh/nguon-drive/v1/style-reference-not-runtime/'+name).size>100);checks++;}
console.log('BE_HOC_DRIVE_MASTER_PNG_PINS_PASS',checks,'checks; direct-byte source copies, no legacy media QA reopened');
