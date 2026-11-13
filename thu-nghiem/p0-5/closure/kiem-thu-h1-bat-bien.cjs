#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const pack=JSON.parse(fs.readFileSync(path.join(__dirname,'../../bai-20-bien-the/runtime.json'),'utf8'));
const BASELINE=[{"id":"VAR_B20_20261112_001","session":"LV1-A","level":"LV1","type":"carry","params":{"a":39,"b":22},"answer":1,"unit":"chục","skill":"B20-K01"},{"id":"VAR_B20_20261112_002","session":"LV1-A","level":"LV1","type":"vertical","params":{"a":67,"b":16},"answer":83,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_003","session":"LV1-A","level":"LV1","type":"vertical","params":{"a":37,"b":18},"answer":55,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_004","session":"LV1-A","level":"LV1","type":"mental","params":{"a":15,"b":78},"answer":93,"unit":"","skill":"B20-K03"},{"id":"VAR_B20_20261112_005","session":"LV1-A","level":"LV1","type":"vertical","params":{"a":17,"b":14},"answer":31,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_006","session":"LV1-A","level":"LV1","type":"vertical","params":{"a":17,"b":34},"answer":51,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_007","session":"LV1-B","level":"LV1","type":"mental","params":{"a":47,"b":34},"answer":81,"unit":"","skill":"B20-K03"},{"id":"VAR_B20_20261112_008","session":"LV1-B","level":"LV1","type":"vertical","params":{"a":37,"b":24},"answer":61,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_009","session":"LV1-B","level":"LV1","type":"vertical","params":{"a":69,"b":26},"answer":95,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_010","session":"LV1-B","level":"LV1","type":"mental","params":{"a":57,"b":36},"answer":93,"unit":"","skill":"B20-K03"},{"id":"VAR_B20_20261112_011","session":"LV1-B","level":"LV1","type":"vertical","params":{"a":15,"b":38},"answer":53,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_012","session":"LV1-B","level":"LV1","type":"vertical","params":{"a":39,"b":44},"answer":83,"unit":"","skill":"B20-K02"},{"id":"VAR_B20_20261112_013","session":"LV2-A","level":"LV2","type":"mental","params":{"a":59,"b":34},"answer":93,"unit":"","skill":"B20-K04"},{"id":"VAR_B20_20261112_014","session":"LV2-A","level":"LV2","type":"mental","params":{"a":15,"b":56},"answer":71,"unit":"","skill":"B20-K03"},{"id":"VAR_B20_20261112_015","session":"LV2-A","level":"LV2","type":"mental","params":{"a":19,"b":14},"answer":33,"unit":"","skill":"B20-K04"},{"id":"VAR_B20_20261112_016","session":"LV2-A","level":"LV2","type":"word","params":{"a":47,"b":34},"answer":81,"unit":"chiếc kẹo","skill":"B20-K06"},{"id":"VAR_B20_20261112_017","session":"LV2-A","level":"LV2","type":"three","params":{"a":49,"b":24,"c":11},"answer":84,"unit":"","skill":"B20-K05"},{"id":"VAR_B20_20261112_018","session":"LV2-B","level":"LV2","type":"mental","params":{"a":46,"b":45},"answer":91,"unit":"","skill":"B20-K04"},{"id":"VAR_B20_20261112_019","session":"LV2-B","level":"LV2","type":"mental","params":{"a":16,"b":15},"answer":31,"unit":"","skill":"B20-K03"},{"id":"VAR_B20_20261112_020","session":"LV2-B","level":"LV2","type":"mental","params":{"a":36,"b":55},"answer":91,"unit":"","skill":"B20-K04"},{"id":"VAR_B20_20261112_021","session":"LV2-B","level":"LV2","type":"word","params":{"a":34,"b":39},"answer":73,"unit":"quyển truyện","skill":"B20-K06"},{"id":"VAR_B20_20261112_022","session":"LV2-B","level":"LV2","type":"three","params":{"a":57,"b":14,"c":15},"answer":86,"unit":"","skill":"B20-K05"},{"id":"VAR_B20_20261112_023","session":"LV3-A","level":"LV3","type":"reverse","params":{"a":28,"b":25},"answer":28,"unit":"","skill":"B20-K08"},{"id":"VAR_B20_20261112_024","session":"LV3-A","level":"LV3","type":"three","params":{"a":28,"b":39,"c":16},"answer":83,"unit":"","skill":"B20-K05"},{"id":"VAR_B20_20261112_025","session":"LV3-A","level":"LV3","type":"reverse","params":{"a":59,"b":38},"answer":59,"unit":"","skill":"B20-K08"},{"id":"VAR_B20_20261112_026","session":"LV3-A","level":"LV3","type":"three","params":{"a":14,"b":67,"c":10},"answer":91,"unit":"","skill":"B20-K05"},{"id":"VAR_B20_20261112_027","session":"LV3-B","level":"LV3","type":"reverse","params":{"a":17,"b":68},"answer":17,"unit":"","skill":"B20-K08"},{"id":"VAR_B20_20261112_028","session":"LV3-B","level":"LV3","type":"three","params":{"a":27,"b":58,"c":13},"answer":98,"unit":"","skill":"B20-K05"},{"id":"VAR_B20_20261112_029","session":"LV3-B","level":"LV3","type":"reverse","params":{"a":18,"b":47},"answer":18,"unit":"","skill":"B20-K08"},{"id":"VAR_B20_20261112_030","session":"LV3-B","level":"LV3","type":"three","params":{"a":26,"b":49,"c":16},"answer":91,"unit":"","skill":"B20-K05"}];
const EXPECTED={
'004':{prompt:'Tính: 15 + 78 = ?',numbers:[15,78],answer:93},
'007':{prompt:'Tính: 47 + 34 = ?',numbers:[47,34],answer:81},
'010':{prompt:'Tính: 57 + 36 = ?',numbers:[57,36],answer:93},
'022':{prompt:'Tính: 57 + 14 + 15 = ?',numbers:[57,14,15],answer:86},
'024':{prompt:'Tính: 28 + 39 + 16 = ?',numbers:[28,39,16],answer:83},
'026':{prompt:'Tính: 14 + 67 + 10 = ?',numbers:[14,67,10],answer:91},
'030':{prompt:'Tính: 26 + 49 + 16 = ?',numbers:[26,49,16],answer:91}
};
let passed=0,failed=0;
function test(label,fn){try{fn();passed++;console.log('PASS '+label)}catch(e){failed++;console.error('FAIL '+label+': '+e.message)}}
test('original B20 count and session layout frozen',()=>{
 assert.equal(pack.questions.length,30);
 assert.deepEqual(pack.sessions.map(s=>[s.session_id,s.target_count,s.question_ids.length]),[['LV1-A',6,6],['LV1-B',6,6],['LV2-A',5,5],['LV2-B',5,5],['LV3-A',4,4],['LV3-B',4,4]]);
 assert.equal(pack.release_status,'STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF');
});
test('immutable question ID, level, type, unit, answer, numeric params, skill and sequence',()=>{
 const actual=pack.questions.map(q=>({id:q.question_id,session:q.session_id,level:q.level,type:q.type,params:q.parameters,answer:q.answer,unit:q.unit,skill:q.skill_id}));
 assert.deepEqual(actual,BASELINE);
});
test('exactly seven IDs have approved candidate prompts',()=>{
 assert.deepEqual(pack.questions.filter(q=>Object.hasOwn(EXPECTED,q.question_id.slice(-3))).map(q=>q.question_id.slice(-3)),Object.keys(EXPECTED));
 for(const q of pack.questions){const spec=EXPECTED[q.question_id.slice(-3)];if(spec)assert.equal(q.prompt,spec.prompt);}
});
test('LV1 carry guidance teaches ones and tens explicitly',()=>{
 for(const id of ['004','007','010']){
  const q=pack.questions.find(q=>q.question_id.endsWith('_'+id));
  assert(q.solution_prompt.includes('Đơn vị:'));
  assert(q.solution_prompt.includes('nhớ 1 chục'));
  assert(q.solution_prompt.includes('Chục:'));
  assert(q.solution_prompt.includes('Vậy '));
 }
});
test('LV2/LV3 three-addend guidance correct, no misleading convenience command',()=>{
 for(const id of ['022','024','026','030']){
  const q=pack.questions.find(q=>q.question_id.endsWith('_'+id));
  assert(!q.prompt.includes('thuận tiện'));
  assert(q.solution_prompt.startsWith('Tính lần lượt:'));
  const p=q.parameters,intermediate=p.a+p.b;
  assert(q.solution_prompt.includes(p.a+' + '+p.b+' = '+intermediate));
  assert(q.solution_prompt.includes(intermediate+' + '+p.c+' = '+q.answer));
 }
});
test('all 30 arithmetic answers independently rederived',()=>{
 for(const q of pack.questions){
  const p=q.parameters,n=q.type==='carry'?Math.floor(((p.a%10)+(p.b%10))/10):q.type==='reverse'?p.a:p.a+p.b+(q.type==='three'?p.c:0);
  assert.equal(q.answer,n,q.question_id);
 }
});
test('unchanged source role and explicit pending pedagogy signoff',()=>{
 for(const q of pack.questions)assert.equal(q.source_role,'PROJECT_ORIGINAL_VARIANT');
 assert.equal(pack.release_status,'STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF');
});
console.log(JSON.stringify({suite:'P0.5-H1-frozen-content',passed,failed}));
if(failed)process.exitCode=1;
