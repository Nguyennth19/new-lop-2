'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const C=require('./comparison-v11-core.js'),fixtures=require('./comparison-v11-fixtures.js');let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++},ok=x=>{assert.ok(x);n++};
const p=C.compile(fixtures.practice),e=C.compile(fixtures.assessment);
ok(p.ok);ok(e.ok);eq(p.plan.hintPolicy,'OPTIONAL');eq(e.plan.hintPolicy,'HIDDEN');
eq(p.plan.rows.length,3);ok(Object.isFrozen(p.plan));ok(Object.isFrozen(p.plan.rows));
const s=C.session(p.plan);eq(s.snapshot().activeRowId,'c1');eq(s.snapshot().selectedSigns,{});
ok(s.choose('=').ok);eq(s.snapshot().activeRowId,'c2');eq(s.snapshot().selectedSigns,{c1:'='});
ok(s.choose('>').ok);eq(s.snapshot().activeRowId,'c3');
ok(s.choose('<').ok);eq(s.snapshot().selectedSigns,{c1:'=',c2:'>',c3:'<'});
ok(s.activate('c1').ok);ok(s.choose('>').ok);eq(s.snapshot().selectedSigns.c1,'>');
ok(s.toggleHints().ok);eq(s.snapshot().hintsVisible,true);
const snap=s.snapshot();
eq(s.choose('≤').reason,'INVALID_SIGN');eq(s.activate('bad').reason,'UNKNOWN_ROW');
eq(s.snapshot(),snap);
eq(s.restore({...snap,selectedSigns:{c1:'!'}}).reason,'INVALID_DRAFT_SIGN');
eq(s.snapshot(),snap,'invalid restore must be atomic');
ok(s.remove('c2').ok);eq(s.snapshot().activeRowId,'c2');
ok(s.restore(snap).ok);eq(s.snapshot(),snap);
ok(s.clear().ok);eq(s.snapshot().selectedSigns,{});
const t=C.session(e.plan);eq(t.toggleHints().reason,'HINTS_DISABLED');
eq(t.restore({...t.snapshot(),hintsVisible:true}).reason,'INVALID_DRAFT');
eq(C.compile({...fixtures.practice,answerKey:{c1:'='}}).reason,'INVALID_META_OR_ANSWER_KEY');
eq(C.compile({...fixtures.practice,rows:[{...fixtures.practice.rows[0],correctSign:'='},...fixtures.practice.rows.slice(1)]}).reason,'INVALID_ROW_OR_ANSWER_KEY');
eq(C.compile({...fixtures.practice,rows:[{...fixtures.practice.rows[0],left:{...fixtures.practice.rows[0].left,leftValue:10}},...fixtures.practice.rows.slice(1)]}).reason,'INVALID_SIDE');
eq(C.compile({...fixtures.practice,rows:[fixtures.practice.rows[0],{...fixtures.practice.rows[1],id:'c1'},fixtures.practice.rows[2]]}).reason,'INVALID_ROW_OR_ANSWER_KEY');
eq(C.compile({...fixtures.practice,hintPolicy:'NEVER'}).reason,'INVALID_HINT_POLICY');
eq(C.compile({...fixtures.practice,rows:[]}).reason,'INVALID_ROW_COUNT');
for(let i=0;i<150;i++){
 const data={...fixtures.assessment,exerciseId:'CROC_V'+i,
 rows:[{id:'row_'+i,left:{type:'MATH',text:String(i)+' + 1'},right:{type:'MATH',text:String(i+1)}}]};
 const compiled=C.compile(data);ok(compiled.ok);const st=C.session(compiled.plan);
 ok(st.choose(i%3===0?'<':i%3===1?'>':'=').ok);eq(Object.keys(st.snapshot().selectedSigns).length,1);
}
for(const f of ['comparison-v11-view.js','comparison-v11-fixtures.js']){
 const code=fs.readFileSync(__dirname+'/'+f,'utf8');new vm.Script(code);
 ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(code));
}
const origin=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(origin).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+n+' assertions including 150 variations, draft isolation, frozen SHA');
