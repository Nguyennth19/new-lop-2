'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {cases,fixture,publicView}=require('./qa-c1-type1-public-fixtures.cjs');
let assertions=0;
function yes(x,m){assert.ok(x,m);assertions++;}
function eq(a,b,m){assert.deepStrictEqual(a,b,m);assertions++;}
const frozen=fs.readFileSync(path.join(__dirname,'../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html'),'utf8');
eq(crypto.createHash('sha256').update(frozen).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced','FROZEN_DEMO_SHA');
for(const one of cases){
 const r=publicView(one);
 yes(r.ok,one.id+' accepted');
 eq(r.slots.length,6,one.id+' slot count');
 eq(new Set(r.slots.map(s=>s.id)).size,6,one.id+' unique slots');
 yes(r.slots.every(s=>s.value===null&&s.role==='ANSWER_INPUT'),one.id+' all hidden');
 eq(r.originalGraderUntrusted,true,one.id+' unsafe check never enabled');
 eq(r.ownerVisualReview,'PENDING',one.id+' no auto owner signoff');
 yes(!JSON.stringify(r).includes('expectedAnswer'),one.id+' no secret expectedAnswer');
 yes(r.data.a+r.data.b>10,one.id+' bonds cross ten');
}
const first=publicView(cases[0]),second=publicView(cases[1]),third=publicView(cases[2]);
eq(first.data,{a:8,b:5,dm:1,m:1});eq(second.data,{a:7,b:6,dm:2,m:2});eq(third.data,{a:9,b:4,dm:3,m:3});
yes(publicView({id:'invalid',spec:fixture('BAD',8,5,99,100)}).ok===false,'out of range blocked');
console.log('QA-C1_TYPE1_PUBLIC_SOURCE_TEST_PASS '+assertions+' assertions (browser DOM and original client grader parity not certified)');
