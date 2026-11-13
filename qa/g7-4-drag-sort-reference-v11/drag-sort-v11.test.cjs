'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const C=require('./drag-sort-v11-core.js'),f=require('./drag-sort-v11-fixtures.js');
let count=0;const eq=(a,b)=>{assert.deepEqual(a,b);count++;},ok=a=>{assert.ok(a);count++;};
const o=C.compile(f.ordering),s=C.compile(f.baskets);
ok(o.ok);ok(s.ok);eq(o.plan.mode,'ORDER');eq(s.plan.mode,'SORT');
eq(o.plan.items.length,4);eq(s.plan.targets.length,2);ok(Object.isFrozen(o.plan));
const a=C.session(o.plan);eq(a.snapshot().placements,{});
ok(a.select('n0').ok);ok(a.placeSelected('slot_2').ok);eq(a.snapshot().placements,{n0:'slot_2'});
ok(a.place('n1','slot_1').ok);ok(a.place('n0','slot_1').ok);
eq(a.snapshot().placements,{n0:'slot_1',n1:'slot_2'}); // occupied slot swaps with previous
ok(a.place('n2','slot_1').ok);eq(a.snapshot().placements,{n1:'slot_2',n2:'slot_1'});
eq(a.place('bogus','slot_2').reason,'UNKNOWN_ENDPOINT');
eq(a.place('n0','slot_99').reason,'UNKNOWN_ENDPOINT');
const before=a.snapshot();
eq(a.restore({exerciseId:o.plan.exerciseId,mode:'ORDER',selectedItemId:null,placements:{n0:'slot_1',n1:'slot_1'}}).reason,'INVALID_DRAFT_PLACEMENT');
eq(a.snapshot(),before);
ok(a.restore({exerciseId:o.plan.exerciseId,mode:'ORDER',selectedItemId:null,placements:{n3:'slot_4'}}).ok);
eq(a.snapshot().placements,{n3:'slot_4'});ok(a.remove('n3').ok);eq(a.snapshot().placements,{});
const b=C.session(s.plan);ok(b.select('b1').ok);ok(b.placeSelected('lt50').ok);
ok(b.place('b2','lt50').ok);eq(b.snapshot().placements,{b1:'lt50',b2:'lt50'});
ok(b.place('b1','gt50').ok);eq(b.snapshot().placements,{b1:'gt50',b2:'lt50'});
eq(b.restore({exerciseId:s.plan.exerciseId,mode:'SORT',placements:{b4:'unknown'}}).reason,'INVALID_DRAFT_PLACEMENT');
const restored=b.snapshot();ok(b.restore(restored).ok);eq(b.snapshot(),restored);b.clear();eq(b.snapshot().placements,{});
for(let i=0;i<100;i++){
 const data={...f.ordering,exerciseId:'ORDER_VAR_'+i,items:f.ordering.items.map((v,j)=>({...v,id:'v'+j,label:String(100+i+j)}))};
 ok(C.compile(data).ok);
}
for(let i=0;i<100;i++){
 const data={...f.baskets,exerciseId:'SORT_VAR_'+i,groups:[{id:'g1',label:'Nhóm A'},{id:'g2',label:'Nhóm B'},{id:'g3',label:'Nhóm C'}]};
 ok(C.compile(data).ok);
}
for(const key of ['answer','answers','answerKey','correctOrder','correctBasket','correctGroup','gradingKey','solution'])
 eq(C.compile({...f.ordering,[key]:[]}).reason,'ANSWER_KEY_FORBIDDEN');
eq(C.compile({...f.baskets,items:[{...f.baskets.items[0],val:43},...f.baskets.items.slice(1)]}).reason,'ANSWER_KEY_FORBIDDEN');
eq(C.compile({...f.baskets,groups:[{id:'g1',label:'A'},{id:'g1',label:'B'}]}).reason,'INVALID_GROUP');
eq(C.compile({...f.ordering,slotCount:3}).reason,'INVALID_SLOT_COUNT');
for(const file of ['drag-sort-v11-view.js','drag-sort-v11-fixtures.js']){
 const data=fs.readFileSync(__dirname+'/'+file,'utf8');new vm.Script(data);ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(data));
}
const original=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(original).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+count+' assertions, 200 variation contracts; frozen original SHA retained');
