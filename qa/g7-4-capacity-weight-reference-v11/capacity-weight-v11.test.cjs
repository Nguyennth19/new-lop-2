'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const C=require('./capacity-weight-v11-core.js'),F=require('./capacity-weight-v11-fixtures.js');
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++},ok=(x,m)=>{assert.ok(x,m);n++};
const a=C.compile(F.liter),b=C.compile(F.weight);ok(a.ok);ok(b.ok);
eq(a.plan.mode,'LITER');eq(b.plan.mode,'WEIGHT');ok(Object.isFrozen(a.plan));ok(Object.isFrozen(b.plan.items));
const l=C.session(a.plan);eq(l.snapshot().quantities,{bottleA:3,bottleB:1});
ok(l.adjust('bottleA',1).ok);eq(l.snapshot().quantities.bottleA,4);
ok(l.transfer('bottleA','bottleB',2).ok);eq(l.snapshot().quantities,{bottleA:2,bottleB:3});
eq(l.transfer('bottleA','bottleB',4).reason,'OUT_OF_BOUNDS');
eq(l.adjust('bottleB',3).reason,'OUT_OF_BOUNDS');
eq(l.adjust('missing',1).reason,'UNKNOWN_ENTRY');
eq(l.adjust('bottleA',-3).reason,'OUT_OF_BOUNDS');
eq(l.transfer('bottleA','bottleA',1).reason,'UNKNOWN_ENTRY');
const saved=l.snapshot();eq(l.restore({exerciseId:a.plan.exerciseId,mode:'LITER',quantities:{bottleA:10,bottleB:1}}).reason,'INVALID_DRAFT_QUANTITY');
eq(l.snapshot(),saved,'restore must be atomic');ok(l.restore({exerciseId:a.plan.exerciseId,mode:'LITER',quantities:{bottleA:0,bottleB:5}}).ok);
ok(l.clear().ok);eq(l.snapshot().quantities,{bottleA:3,bottleB:1});
const w=C.session(b.plan);eq(w.snapshot().quantities,{left:3,right:5});
eq(w.transfer('left','right',1).reason,'WRONG_MODE');
ok(w.adjust('left',2).ok);eq(w.snapshot().quantities,{left:5,right:5});
eq(w.adjust('left',-6).reason,'OUT_OF_BOUNDS');
ok(w.restore({exerciseId:b.plan.exerciseId,mode:'WEIGHT',quantities:{left:0,right:10}}).ok);
eq(w.snapshot().quantities,{left:0,right:10});ok(w.clear().ok);
const light=C.balanceTilt(3,5);
eq(light.relation,'LEFT_LIGHTER');ok(light.degrees>0);
ok(light.leftY<light.rightY,'3 kg left MUST sit higher than 5 kg right');
const heavy=C.balanceTilt(5,3);eq(heavy.relation,'RIGHT_LIGHTER');
ok(heavy.degrees<0);ok(heavy.leftY>heavy.rightY);
const equal=C.balanceTilt(4,4);eq(equal.relation,'BALANCED');eq(equal.degrees,0);eq(equal.leftY,equal.rightY);
const maximum=C.balanceTilt(0,100);eq(maximum.degrees,15);
for(let i=0;i<100;i++){
 const liters={...F.liter,exerciseId:'LITERS_V_'+i,containers:[
 {id:'a',label:'Bình A',capacityLiters:10+(i%3),currentLiters:i%5},
 {id:'b',label:'Bình B',capacityLiters:8,currentLiters:i%6}]};
 ok(C.compile(liters).ok);
 const weight={...F.weight,exerciseId:'WEIGHT_V_'+i,pans:[
 {id:'a',label:'Trái',massKg:i%20},{id:'b',label:'Phải',massKg:(i+1)%20}]};
 ok(C.compile(weight).ok);
}
for(const key of ['answer','answerKey','correctAnswer','correct','gradingKey','expectedValue']){
 eq(C.compile({...F.liter,[key]:1}).reason,'INVALID_META');
}
eq(C.compile({...F.liter,containers:[{...F.liter.containers[0],currentLiters:100},F.liter.containers[1]]}).reason,'INVALID_CAPACITY');
eq(C.compile({...F.weight,pans:[{...F.weight.pans[0],answer:3},F.weight.pans[1]]}).reason,'INVALID_ENTRY_ID');
for(const file of ['capacity-weight-v11-view.js','capacity-weight-v11-fixtures.js']){
 const code=fs.readFileSync(__dirname+'/'+file,'utf8');new vm.Script(code);
 ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(code));
}
const origin=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(origin).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+n+' assertions, 200 variants, weight tilt reversal and immutable source SHA');
