/* G3-B: QA negative regression. All fixtures are synthetic; no GAS deployment. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {call,ctx,props,privateData}=require('../g3a/test_g3a_isolated.cjs');
const root=path.resolve(__dirname,'../..'),cases=[];
function check(name,fn){
 try{fn();cases.push({name,status:'PASS'});}
 catch(e){cases.push({name,status:'FAIL',detail:String(e.message||e).slice(0,250)});}
}
for(const name of ['DocDuLieuSheet.gs','PhuHuynhMayChu.gs','MayChu.gs']){
 vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),ctx,{filename:name});
}
const forbidden=new Set(['answer','answers','answerKey','correctAnswer','correctOptionId',
 'solution','solutionPrompt','gradingKey','teacherSolution','ans','studentId','starCredit']);
function clean(v){
 if(Array.isArray(v))return v.forEach(clean);
 if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){
  assert(!forbidden.has(k),'secret leaked: '+k);clean(x);
 }
}
const allowed=props.get('G3A_TEST_ALLOWED_EMAILS');
const enabled=props.get('G3A_TEST_ENABLED');
check('51 private questions provide regression sentinels',()=>{
 assert.equal(privateData.questions.length,51);
 assert(privateData.questions.some(q=>q.answer));
});
check('Legacy four-tab extractor cannot be called',()=>{
 assert.throws(()=>call('layThongTinDuLieuBaiHoc'),/G3B_LEGACY_RAW_SHEET_EXPORT_DISABLED/);
});
check('Legacy raw extractor no longer reads whole sheet',()=>{
 const s=fs.readFileSync(path.join(root,'DocDuLieuSheet.gs'),'utf8');
 assert(!/getDataRange\s*\(/.test(s));
 assert(!/getDisplayValues\s*\(/.test(s));
});
check('Legacy named B20 method returns 51 public-only questions',()=>{
 const d=call('layBaiToan20');
 assert.equal(d.securityContract,'G3A_PUBLIC_ALLOWLIST_V1');
 assert.equal(d.questions.length,51);clean(d);
 assert(!JSON.stringify(d).includes('SECRET_PRIVATE_SOLUTION'));
});
check('Legacy B20 method rejects disallowed identity',()=>{
 props.set('G3A_TEST_ALLOWED_EMAILS','intruder@example.test');
 try{assert.throws(()=>call('layBaiToan20'),/G3A_TEST_UNAUTHORIZED/);}
 finally{props.set('G3A_TEST_ALLOWED_EMAILS',allowed);}
});
check('Legacy B20 method rejects disabled TEST',()=>{
 props.set('G3A_TEST_ENABLED','false');
 try{assert.throws(()=>call('layBaiToan20'),/G3A_TEST_DISABLED/);}
 finally{props.set('G3A_TEST_ENABLED',enabled);}
});
check('HTML doGet rejects disallowed identity BEFORE templating',()=>{
 props.set('G3A_TEST_ALLOWED_EMAILS','intruder@example.test');
 try{assert.throws(()=>call('doGet'),/G3A_TEST_UNAUTHORIZED/);}
 finally{props.set('G3A_TEST_ALLOWED_EMAILS',allowed);}
});
check('HTML doGet rejects disabled TEST',()=>{
 props.set('G3A_TEST_ENABLED','false');
 try{assert.throws(()=>call('doGet'),/G3A_TEST_DISABLED/);}
 finally{props.set('G3A_TEST_ENABLED',enabled);}
});
check('TEST attempt/star ledgers are in-memory only with denied writes',()=>{
 for(const name of ['90_Lan_lam_bai','91_So_sao','92_Ghi_chu_phu_huynh']){
  const source=vm.runInContext('achS_(__ledgerName,["id"])',Object.assign(ctx,{__ledgerName:name}));
  assert.equal(source.getDataRange().getValues().length,1);
  assert.throws(()=>source.appendRow(['X']),/G3B_TEST_STUDENT_WRITE_DENIED/);
 }
});
check('Unknown ledger tab name cannot open a real workbook',()=>{
 assert.throws(()=>call('achS_','any_unapproved',['id']),/G3B_TEST_LEDGER_SCOPE_DENIED/);
});
check('Legacy student grading/reward writer remains blocked',()=>{
 assert.throws(()=>call('ghiNhanKetQuaToan20',{}),/G3A_TEST_READ_ONLY_NO_REWARDS/);
});
check('Parent mode not configured in TEST',()=>{
 const p=call('phuHuynhTrangThai');assert.equal(p.configured,false);assert.equal(p.testMode,true);
});
check('Parent login disabled without Script Properties writes',()=>{
 assert.equal(call('phuHuynhDangNhap','0000').ok,false);
});
check('Parent write and private overview API are denied',()=>{
 for(const [fn,args] of [
  ['phuHuynhGhiChu',['token','note']],
  ['phuHuynhDieuChinhSao',['token',{delta:1}]],
  ['phuHuynhDoiPin',['token','0000','1234']],
  ['phuHuynhTongQuan',['token']]
 ])assert.throws(()=>call(fn,...args),/G3B_TEST_PARENT_ACCESS_DISABLED/);
});
check('Parent logout does not alter any cache',()=>{
 const x=call('phuHuynhDangXuat','token');assert.equal(x.ok,true);
});
check('Public B20 adapter cannot use private loader',()=>{
 const x=fs.readFileSync(path.join(root,'DuLieuToanSheet.gs'),'utf8');
 assert(/g3aQaContext_\(\)/.test(x));assert(!/return\s+khoLayBaiHoc_\(/.test(x));
});
check('GAS TEST manifest requests active tester identity scope',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'appsscript.json'),'utf8'));
 assert(manifest.oauthScopes.includes('https://www.googleapis.com/auth/userinfo.email'));
 assert(manifest.oauthScopes.includes('https://www.googleapis.com/auth/spreadsheets'));
});
check('Client local grading still disabled',()=>{
 const x=fs.readFileSync(path.join(root,'26_ChamCauHoiToan.html'),'utf8');
 assert(!/q\.(?:answer|solutionPrompt)\b/.test(x));
});
check('Public SVG preserves safe B20 math picture primitives',()=>{
 const sample='<circle cx="36" cy="44" r="20" fill="#facc15"/><path d="M 3 4 L 6 8" fill="#fff"/><text x="40" y="32">5 quả</text>';
 assert.equal(call('g3aSafePublicSvg_',sample),sample);
 const q=call('g3aB20PublicQuestion_',{id:'safe',type:'word_problem',svg:sample});
 assert.equal(q.svg,sample);clean(q);
});
check('Public SVG does not return script, event handlers or foreign objects',()=>{
 for(const bad of [
  '<script>alert(1)</script>',
  '<circle cx="5" onload="alert(1)"/>',
  '<foreignObject><div>answer:73</div></foreignObject>',
  '<image href="https://external.example/track"/>',
  '<circle fill="url(javascript:alert(1))"/>',
  '<text x="5">OK</text><svg onload="a()"/>'
 ]){
  assert.equal(call('g3aSafePublicSvg_',bad),'');
  const p=call('g3aB20PublicQuestion_',{id:'bad',type:'word_problem',svg:bad});
  assert.equal(p.svg,'');
 }
});
check('B20 SVG cannot escape attributes or smuggle unapproved URL/style',()=>{
 for(const bad of [
  '<circle cx="5" style="display:none" />',
  '<circle cx="5" data-secret="true"/>',
  '<rect width="6" height="7" onclick="alert(1)"/>',
  '<path d="M5 2" fill="url(https://bad.example)"/>',
  '<text x="4">&lt;script&gt;</text><iframe src="x"/>'
 ])assert.equal(call('g3aSafePublicSvg_',bad),'');
});
check('Public projector strips malicious Svg while preserving other public keys',()=>{
 const q=call('g3aB20PublicQuestion_',{
  id:'toan_b20_test_svg',type:'word_problem',prompt:'Tính tổng',
  svg:'<script>42</script>',answer:'42',solutionPrompt:'TOP_SECRET'
 });
 assert.equal(q.svg,'');assert.equal(q.prompt,'Tính tổng');
 assert.equal(q.answer,undefined);assert.equal(q.solutionPrompt,undefined);
 clean(q);
});
check('G3B browser smoke route never bypasses allowlisted active user',()=>{
 const old=props.get('G3A_TEST_ALLOWED_EMAILS');
 props.set('G3A_TEST_ALLOWED_EMAILS','intruder@example.test');
 try{assert.throws(()=>call('doGet',{parameter:{g3bSmoke:'1'}}),/G3A_TEST_UNAUTHORIZED/);}
 finally{props.set('G3A_TEST_ALLOWED_EMAILS',old);}
});
check('G3B browser smoke route returns separate QA HTML only after auth',()=>{
 const prior=ctx.HtmlService;let requested=null;
 ctx.HtmlService={createHtmlOutputFromFile:function(name){
  requested=name;
  return {setTitle:function(){return this;},addMetaTag:function(){return this;}};
 }};
 try{
  const result=call('doGet',{parameter:{g3bSmoke:'1'}});
  assert.equal(requested,'G3B_BrowserSmoke');
  assert.equal(typeof result,'object');
 }finally{ctx.HtmlService=prior;}
});
check('G3B browser smoke source syntax valid and runs only on explicit click',()=>{
 const page=fs.readFileSync(path.join(root,'G3B_BrowserSmoke.html'),'utf8');
 const scripts=[...page.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
 assert.equal(scripts.length,1);
 new vm.Script(scripts[0][1],{filename:'G3B_BrowserSmoke.html'});
 assert(page.includes("btn.addEventListener('click',main)"));
 assert(page.includes('GAS_WEBAPP_RPC_SMOKE_ONLY'));
 assert(!/location\.href\s*=\s*['"]https?:/.test(page));
});
check('G3B browser smoke receipt excludes answer keys and one-time tokens',()=>{
 const page=fs.readFileSync(path.join(root,'G3B_BrowserSmoke.html'),'utf8');
 const suffix=page.slice(page.indexOf('const report={scope:'));
 assert(suffix.includes('studentRelease'));
 assert(!/session\.token|request\.answers|answerKey|studentId/.test(suffix));
 assert(page.includes('const forbidden=new Set('));
 assert(page.includes("case 'legacyExport'"));
 assert(page.includes("case 'grade'"));
 assert(page.includes("case 'b024'"));
});
check('G2B 25-case reviewer route rejects unauthorized identity before templating',()=>{
 const old=props.get('G3A_TEST_ALLOWED_EMAILS');
 props.set('G3A_TEST_ALLOWED_EMAILS','intruder@example.test');
 try{assert.throws(()=>call('doGet',{parameter:{g2bReview:'1'}}),/G3A_TEST_UNAUTHORIZED/);}
 finally{props.set('G3A_TEST_ALLOWED_EMAILS',old);}
});
check('G2B 25-case reviewer route rejects disabled TEST',()=>{
 const old=props.get('G3A_TEST_ENABLED');
 props.set('G3A_TEST_ENABLED','false');
 try{assert.throws(()=>call('doGet',{parameter:{g2bReview:'1'}}),/G3A_TEST_DISABLED/);}
 finally{props.set('G3A_TEST_ENABLED',old);}
});
check('G2B reviewer route uses a separate Apps Script HTML template after authorization',()=>{
 const prior=ctx.HtmlService;let used=null;
 ctx.HtmlService={createTemplateFromFile:function(name){
  used=name;return {evaluate:function(){return {setTitle:function(){return this;},addMetaTag:function(){return this;}};}};
 }};
 try{
  const result=call('doGet',{parameter:{g2bReview:'1'}});
  assert.equal(used,'G2B_ReviewerPreview');
  assert.equal(typeof result,'object');
 }finally{ctx.HtmlService=prior;}
});
check('G2B reviewer fixture registry is 25 safe synthetic descriptors and 14 families',()=>{
 const s=fs.readFileSync(path.join(root,'G2B_ReviewFixtures.html'),'utf8');
 const app={};vm.runInNewContext(s,{window:app},{filename:'G2B_ReviewFixtures.html'});
 assert.equal(app.G2B_QA_REVIEW.cases.length,25);
 assert.equal(Object.keys(app.G2B_QA_REVIEW.fixtures).length,14);
 const seen=new Set();
 for(const q of app.G2B_QA_REVIEW.cases){
  assert(!seen.has(q.caseId));seen.add(q.caseId);clean(q);
  assert(/^(?:KEEP_VARIANT|KEEP_STRUCTURAL|DROP)$/.test(q.decision));
  assert(/^MATH_B\d{3}$/.test(q.lessonId));
 }
 assert.equal(app.G2B_QA_REVIEW.cases.filter(x=>x.decision==='DROP').length,7);
 assert(!/https?:\/\/drive\.google\.com|data:image\/|base64,/.test(s));
});
check('G2B restricted reviewer page loads actual D3 D4 D7 D9 D10 cores and P0 router',()=>{
 const s=fs.readFileSync(path.join(root,'G2B_ReviewerPreview.html'),'utf8');
 for(const file of ['G2B_ReviewFixtures','89_P0_VariantRouter','90_P0_VectorStructural',
  '66_D3_Core','67_D3_View','68_D4_Core','69_D4_View','73_D7_Core','74_D7_View',
  '55_Pictograph_Core','56_Pictograph_View','80_D10_Core','81_D10_Adapter'])
  assert(s.includes("napThanhPhan('"+file+"')"),file+' was not loaded');
 const scripts=[...s.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
 new vm.Script(scripts[scripts.length-1][1],{filename:'G2B_ReviewerPreview.html'});
 assert(s.includes("data-p0-review-preview=\"true\""));
 assert(s.includes("router.compileReviewPayload"));
 assert(s.includes("view.mount(layer,built.plan"));
 assert(s.includes("studentRelease")===false||s.includes("'NO_GO'"));
 assert(s.includes("release:'NO_GO'"));
 assert(!/google\.script\.run|doPost\(|localStorage\.setItem/.test(s));
 assert(!/https?:\/\/drive\.google\.com|data:image\/|base64,/.test(s));
});
check('B20 UI and reviewer QA include order preserve trusted grading and deny student variants',()=>{
 const s=fs.readFileSync(path.join(root,'GiaoDien.html'),'utf8');
 const names=['89_P0_VariantRouter','90_P0_VectorStructural','83_Visual_Orchestrator','19_KhongGianHocToan'];
 const positions=names.map(n=>s.indexOf("napThanhPhan('"+n+"')"));
 assert(positions.every(x=>x>=0));
 assert(positions.every((x,i)=>i===0||x>positions[i-1]));
 const core=fs.readFileSync(path.join(root,'83_Visual_Orchestrator.html'),'utf8');
 assert(core.includes('P0_PENDING_INDEPENDENT_SOURCE_REVIEW_AND_RENDERER_GATE'));
 assert(core.includes('P0_UNSAFE_OR_UNVERIFIED_ADAPTATION'));
 const b20=fs.readFileSync(path.join(root,'19_KhongGianHocToan.html'),'utf8');
 assert(b20.includes('g3aChamBaiToan20Test'));
 assert(b20.includes('g3aLayBaiToan20Test'));
});
const report={phase:'G3-B',scope:'SYNTHETIC_VM_ONLY_NOT_REAL_GAS',total:cases.length,
 passed:cases.filter(x=>x.status==='PASS').length,failed:cases.filter(x=>x.status==='FAIL').length,cases};
fs.writeFileSync(path.join(__dirname,'G3B_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log('G3B isolated legacy-bypass and no-write checks:',report.passed+'/'+report.total);
if(report.failed){console.error(JSON.stringify(cases.filter(x=>x.status==='FAIL')));process.exitCode=1;}
