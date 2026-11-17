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
check('Client local grading still disabled',()=>{
 const x=fs.readFileSync(path.join(root,'26_ChamCauHoiToan.html'),'utf8');
 assert(!/q\.(?:answer|solutionPrompt)\b/.test(x));
});
const report={phase:'G3-B',scope:'SYNTHETIC_VM_ONLY_NOT_REAL_GAS',total:cases.length,
 passed:cases.filter(x=>x.status==='PASS').length,failed:cases.filter(x=>x.status==='FAIL').length,cases};
fs.writeFileSync(path.join(__dirname,'G3B_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log('G3B isolated legacy-bypass and no-write checks:',report.passed+'/'+report.total);
if(report.failed){console.error(JSON.stringify(cases.filter(x=>x.status==='FAIL')));process.exitCode=1;}
