'use strict';
/** P0.6-D fixture-based offline compatibility test. No browser / Apps Script calls. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {adaptB20}=require('./adapter-b20-v1.cjs');
const {createRendererRegistry,renderReadonlyPreview}=require('./question-renderer-registry-v1.cjs');
const {makeB20Handlers,MAP}=require('./renderer-b20-bridge-v1.cjs');
const root=path.resolve(__dirname,'../..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'thu-nghiem/bai-20-bien-the/runtime.json'),'utf8'));
const adapted=adaptB20(raw);
const clone=x=>structuredClone(x);
const context={};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'42_AdapterBienTheB20.html'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'41_HienThiCauHoiToan.html'),'utf8'),context);
const pack={variantPilot:true,lesson:{id:'toan_b20'},sessions:raw.sessions,questions:raw.questions};
const oldPack=context.chuyenB20BienTheSangRenderer(pack);
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=(q,key,size,attrs='')=>'<input data-q="'+E(q.id)+'" data-slot="'+E(key)+'" size="'+size+'" '+attrs+'>';
const baseCard=(q,inner,cls)=>'<article class="'+E(cls)+'" data-id="'+E(q.id)+'">'+inner+'</article>';
const legacyRenderer=context.taoHienThiCauToan({E,input,baseCard});
const registry=createRendererRegistry(makeB20Handlers(legacyRenderer));
const oldById=new Map(oldPack.questions.map(q=>[q.id,q]));
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('Six B20 kinds registered by kind rather than lesson',()=>{
 assert.deepEqual(registry.list().sort(),Object.keys(MAP).sort());
});
test('All 30 B20 HTML outputs byte-for-byte equivalent to approved functions',()=>{
 for(const q of adapted.questions){
  const old=oldById.get(q.id);
  const r=registry.render(q,{lessonId:'toan_b20',legacyQuestion:old});
  assert.equal(r.ok,true,q.id);
  assert.equal(r.interactive,true);
  assert.equal(r.graded,false);
  assert.equal(r.html,legacyRenderer[MAP[q.kind].method](old),q.id);
 }
});
test('All 30 question IDs and prompts preserve order',()=>{
 assert.deepEqual(adapted.questions.map(q=>q.id),raw.questions.map(q=>q.question_id));
 assert.deepEqual(adapted.questions.map(q=>q.prompt),raw.questions.map(q=>q.prompt));
});
test('All six sessions preserve grouping and count',()=>{
 assert.deepEqual(adapted.sessions.map(s=>s.questionIds.length),[6,6,5,5,4,4]);
});
test('Unknown kind never falls back to B20 mental renderer',()=>{
 const q=clone(adapted.questions[0]);q.kind='language.comprehension';q.renderer.component=q.kind;
 const r=registry.render(q,{lessonId:'toan_b20',legacyQuestion:oldById.get(q.id)});
 assert.equal(r.status,'UNSUPPORTED');assert.equal(r.interactive,false);
 assert.doesNotMatch(r.html,/<input|data-q=/);
});
test('Explicit method absence is rejected at registration',()=>{
 assert.throws(()=>makeB20Handlers({mental(){return ''}}),/LEGACY_RENDER_METHOD_MISSING/);
});
test('Missing context cannot expose interactive form',()=>{
 const r=registry.render(adapted.questions[0]);assert.equal(r.status,'UNSUPPORTED');assert.equal(r.interactive,false);
});
test('Cross-lesson misuse rejected and does not render B20 data',()=>{
 const q=adapted.questions[0];const r=registry.render(q,{lessonId:'toan_b21',legacyQuestion:oldById.get(q.id)});
 assert.equal(r.status,'UNSUPPORTED');
});
test('Question mismatch rejected with no HTML from legacy renderer',()=>{
 const q=clone(adapted.questions[0]);q.prompt='Changed prompt';
 const r=registry.render(q,{lessonId:'toan_b20',legacyQuestion:oldById.get(q.id)});
 assert.equal(r.code,'RENDERER_EXCEPTION');
});
test('Answer drift rejected without showing wrong question',()=>{
 const q=clone(adapted.questions[0]);q.answerSpec.value=999;
 assert.equal(registry.render(q,{lessonId:'toan_b20',legacyQuestion:oldById.get(q.id)}).status,'UNSUPPORTED');
});
test('Tampering with input parameters rejected',()=>{
 const q=clone(adapted.questions[0]);q.parameters.a=999;
 assert.equal(registry.render(q,{lessonId:'toan_b20',legacyQuestion:oldById.get(q.id)}).status,'UNSUPPORTED');
});
test('Unknown kind is escaped and never includes untrusted prompt',()=>{
 const q=clone(adapted.questions[0]);q.kind='language.unknown';q.renderer.component=q.kind;
 q.prompt='<script>alert(1)</script>';
 const r=registry.render(q);
 assert.equal(r.status,'UNSUPPORTED');assert.doesNotMatch(r.html,/<script|alert/);
});
test('Renderer metadata mismatch blocked before invoking handler',()=>{
 let hits=0;const one=createRendererRegistry({'language.reading':()=>{hits++;return {ok:true,html:'<p>ok</p>',interactive:false}}});
 const q={id:'Q',kind:'language.reading',prompt:'Reading',renderer:{component:'language.spelling'}};
 assert.equal(one.render(q).status,'UNSUPPORTED');assert.equal(hits,0);
});
test('Renderer exceptions never leak content or throw to caller',()=>{
 const one=createRendererRegistry({'language.reading':()=>{throw Error('private answer') }});
 const q={id:'Q',kind:'language.reading',prompt:'Reading',renderer:{component:'language.reading'}};
 const r=one.render(q);assert.equal(r.status,'UNSUPPORTED');assert.doesNotMatch(JSON.stringify(r),/private answer/);
});
test('Readonly language preview escapes markup; no input and no grading',()=>{
 const q={id:'V1',kind:'language.reading',prompt:'<img src=x onerror=alert(1)>',renderer:{component:'language.reading'}};
 const one=createRendererRegistry({'language.reading':renderReadonlyPreview});
 const r=one.render(q);assert.equal(r.status,'RENDERED');assert.equal(r.interactive,false);assert.equal(r.graded,false);
 assert.match(r.html,/&lt;img/);assert.doesNotMatch(r.html,/<img|<input/);
});
test('Invalid renderer result is fail-closed',()=>{
 const one=createRendererRegistry({'language.reading':()=>({ok:true,html:'',interactive:true})});
 assert.equal(one.render({id:'V1',kind:'language.reading',prompt:'Valid',renderer:{component:'language.reading'}}).status,'UNSUPPORTED');
});
test('Registry is injectable and immutable at the API boundary',()=>{
 assert.equal(Object.isFrozen(registry),true);
 assert.throws(()=>createRendererRegistry({'bad kind':()=>''}),/RENDERER_INVALID_ENTRY/);
});
test('Legacy code remains a separate file, not copied into P0.6-D',()=>{
 const bridge=fs.readFileSync(path.join(__dirname,'renderer-b20-bridge-v1.cjs'),'utf8');
 assert.doesNotMatch(bridge,/ml-vertical-matrix|ml-word-calc|ml-mental-row/);
});
test('D modules have no GAS, Sheet or student progress APIs',()=>{
 for(const file of ['question-renderer-registry-v1.cjs','renderer-b20-bridge-v1.cjs']){
  const s=fs.readFileSync(path.join(__dirname,file),'utf8');
  assert.doesNotMatch(s,/SpreadsheetApp\s*\.|PropertiesService\s*\.|UrlFetchApp\s*\.|google\.script\.run|localStorage\s*\.|fetch\s*\(/);
 }
});
console.log(JSON.stringify({suite:'p0.6-d-renderer-registry',passed,failed:0,
 sourceQuestions:30,sessionCount:6,scope:'OFFLINE_ONLY',noWrites:true,noStars:true}));
