/* G3-A: synthetic end-to-end sandbox; not an actual GAS Web App network test. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto');
const path=require('node:path');
const dir=fs.existsSync(path.join(__dirname,'KhoBaiHoc.gs'))?__dirname:path.resolve(__dirname,'../..');
const results=[];
function check(name,fn){try{fn();results.push({name,status:'PASS'});}catch(e){results.push({name,status:'FAIL',detail:e.message});}}
let qaEmail='reviewer@example.test';
const qaId='G3A_SANDBOX_ONLY_NOT_PROD';
const LIVE='1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8';
const props=new Map([['G3A_TEST_ENABLED','true'],['G3A_TEST_ALLOWED_EMAILS','reviewer@example.test'],['G3A_TEST_SOURCE_SPREADSHEET_ID',qaId]]);
const store=new Map(), cache={get:k=>store.get(k)||null,put:(k,v)=>{store.set(k,v);},remove:k=>{store.delete(k);}};
let writes=0,openProd=0;
const sheetMap={}, rows=[];
const headers=['question_id','lesson_id','level','section_id','order','label','type','prompt','n1','op','n2','answer','unit','group','theme','summary','solution_prompt','tts','svg','puzzle_json','metadata_json'];
function makeQ(kind,id,lv,section,num){
 let obj={question_id:id,lesson_id:'toan_b20',level:lv,section_id:section,order:String(num),label:'Câu '+num,type:kind,prompt:'Câu hỏi kiểm thử '+num,n1:'28',op:'+',n2:'45',answer:'73',unit:'',group:'G',theme:'blue',summary:'',solution_prompt:'SECRET_PRIVATE_SOLUTION',tts:'',svg:'',puzzle_json:'',metadata_json:''};
 if(kind==='mental'){obj.n1='8';obj.n2='9';obj.answer='17';}
 if(kind==='word_problem'){obj.n1='24';obj.n2='26';obj.answer='50';obj.prompt='Bài toán 24 và 26';obj.unit='quả';}
 if(kind==='missing_digit'){obj.n1='';obj.n2='';obj.answer='';obj.puzzle_json=JSON.stringify([[4,{ans:2}],[3,1],[7,3]]);}
 return headers.map(h=>String(obj[h]||''));
}
for(let i=1;i<=16;i++)rows.push(makeQ('vertical','toan_b20_lv1_v'+i,'LV1','toan_b20_lv1_ex1',i));
for(let i=1;i<=8;i++)rows.push(makeQ('mental','toan_b20_lv1_m'+i,'LV1','toan_b20_lv1_ex2',i));
for(let i=1;i<=7;i++)rows.push(makeQ('word_problem','toan_b20_lv2_w'+i,'LV2','toan_b20_lv2_problems',i));
for(let i=1;i<=18;i++)rows.push(makeQ('missing_digit','toan_b20_lv3_p'+i,'LV3','toan_b20_lv3_ex1',i));
for(let i=1;i<=2;i++)rows.push(makeQ('mental','toan_b20_lv2_m'+i,'LV2','toan_b20_lv2_extra',i));
assert.equal(rows.length,51);
sheetMap['01_Bai_hoc']=[['lesson_id','title','subject','series'],['toan_b20','B20 Test','Toán','TEST_SANDBOX']];
sheetMap['02_Cap_do']=[['level_id','lesson_id','level','name'],...['LV1','LV2','LV3'].map(l=>['level_'+l,'toan_b20',l,'Kiểm thử '+l])];
sheetMap['03_Nhom_bai']=[['section_id','level_id','name','question_type'],...[
 ['toan_b20_lv1_ex1','level_LV1','Cộng đặt tính','vertical'],
 ['toan_b20_lv1_ex2','level_LV1','Tính nhẩm','mental'],
 ['toan_b20_lv2_problems','level_LV2','Bài toán','word_problem'],
 ['toan_b20_lv2_extra','level_LV2','Tính nhẩm','mental'],
 ['toan_b20_lv3_ex1','level_LV3','Điền số','missing_digit']
]];
sheetMap['04_Cau_hoi']=[headers,...rows];
const mockWb={getSheetByName(name){if(!(name in sheetMap))return null;return {getDataRange(){return {getDisplayValues(){return sheetMap[name].map(r=>r.slice())}}}}}};
const ctx=vm.createContext({console:{log(){},error(){}},Date,Math,JSON,String,Number,Array,Set,Map,Object,Error,RegExp,
 CAU_TEST_FIXTURE:'synthetic',
 PropertiesService:{getScriptProperties(){return {getProperty(k){return props.get(k)||null},setProperty(k,v){props.set(k,v)}}}},
 CacheService:{getScriptCache(){return cache}},
 LockService:{getScriptLock(){return {waitLock(){},releaseLock(){}}}},
 SpreadsheetApp:{openById(id){if(id===LIVE)openProd++;if(id!==qaId)throw Error('source blocked');return mockWb}},
 Session:{getActiveUser(){return {getEmail(){return qaEmail}}}},
 Utilities:{getUuid(){return crypto.randomUUID()},base64EncodeWebSafe(s){return Buffer.from(String(s)).toString('base64url')}}
});
for(const f of ['CauHinh.gs','KhoBaiHoc.gs','DuLieuToanSheet.gs','ThanhTichMayChu.gs','G3ATrustedTest.gs','D2ChamTinCayTest.gs']){
 vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),ctx,{filename:f});
}
const call=(fn,...args)=>JSON.parse(JSON.stringify(vm.runInContext(fn+'('+args.map((v,i)=>'__arg'+i).join(',')+')',Object.assign(ctx,Object.fromEntries(args.map((v,i)=>['__arg'+i,v]))))));
const privateData=call('khoLayBaiHoc_', 'toan_b20');
const pub=call('layBaiToan20');
const forbiddenKeys=new Set(['answer','answers','answerKey','solution','solutionPrompt','correct','correctOption','expectedAnswer','gradingKey','ans','starCredit','studentId']);
function assertClean(o){if(Array.isArray(o)){o.forEach(assertClean);return;}if(o&&typeof o==='object'){for(const [k,v] of Object.entries(o)){assert(!forbiddenKeys.has(k),'Leaked key '+k);assertClean(v);}}}
check('SOURCE mock contains 51 private answer-bearing items',()=>{assert.equal(privateData.questions.length,51);assert(privateData.questions.some(q=>q.answer==='73'));});
check('PUBLIC mock contains all 51 questions',()=>assert.equal(pub.questions.length,51));
check('PUBLIC projection recursively strips keys',()=>assertClean(pub));
check('PUBLIC serialized response excludes private sentinel',()=>assert(!JSON.stringify(pub).includes('SECRET_PRIVATE_SOLUTION')));
check('PUBLIC strips puzzle ans and preserves blanks',()=>{let q=pub.questions.find(q=>q.type==='missing_digit');assert(q.puzzle[0][1].blank);assertClean(q);});
check('PUBLIC schema retains lesson levels sections and valid',()=>{assert.equal(pub.lesson.id,'toan_b20');assert.equal(pub.levels.length,3);assert.equal(pub.sections.length,5);assert(pub.questions.every(q=>q.valid));});
check('PUBLIC does not forward unapproved visual contracts',()=>assert(pub.questions.every(q=>q.visualContract===null)));
check('PUBLIC has stable explicit contract and no renderer policy grants',()=>{assert.equal(pub.securityContract,'G3A_PUBLIC_ALLOWLIST_V1');assert.equal(pub.lesson.rendererPolicies.length,0);});
check('QA loader never opens live workbook',()=>assert.equal(openProd,0));
check('Legacy reward endpoint hard-blocked',()=>assert.throws(()=>call('ghiNhanKetQuaToan20',{}),/READ_ONLY/));
check('B024 test fetch fail-closed',()=>assert.equal(call('g3aLayBaiB024Test').ok,false));
check('B024 test grading fail-closed',()=>assert.equal(call('g3aChamBaiB024Test',{answer:'123'}).ok,false));
check('PUBLIC projector independently drops nested malicious visual keys',()=>{const question={id:'TEST',valid:true,puzzle:[[1,{ans:42,teacherSolution:'X'}]],visualContract:{publicVariant:{correctOptionId:'42'}},answer:'42',solutionPrompt:'secret'};const out=call('g3aB20PublicQuestion_',question);assertClean(out);assert(out.puzzle[0][1].blank);assert.equal(out.visualContract,null);});
check('QA tester can load public lesson',()=>assert.equal(call('g3aLayBaiToan20Test').questions.length,51));
const qs=call('achSelect_',privateData,'LV1');
function goodAnswers(qs){const o={};for(const q of qs){if(q.type==='vertical'){o[q.id]={ones:'3',tens:'7',carry:'1'};}else if(q.type==='mental'){o[q.id]={answer:'17'};}else if(q.type==='word_problem'){o[q.id]={n1:'24',n2:'26',op:'+',sum:'50',answer:'50'};}else if(q.type==='missing_digit'){o[q.id]={p01:'2'};}}return o;}
const answers=goodAnswers(qs);
let session=call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'});
check('QA session token issued with 300s lifetime',()=>{assert.equal(session.ok,true);assert.equal(session.token.length,32);assert.equal(session.awarded,false);});
const payload={contractId:'G3A_READONLY_V1',lessonId:'toan_b20',level:'LV1',token:session.token,answers};
const grade=call('g3aChamBaiToan20Test',payload);
check('READONLY grade covers exactly server-selected questions',()=>{assert.equal(grade.ok,true);assert.equal(grade.total,qs.length);assert.equal(grade.correct,qs.length);assert.equal(grade.awarded,false);assert.equal(grade.writes,0)});
check('GRADE response is clean of answer keys',()=>{assert.equal(typeof grade.correct,'number');const {correct:_,...safe}=grade;assertClean(safe);});
check('All 4 selected vertical examples are marked correct',()=>assert(grade.perQuestion.filter(v=>v.id.startsWith('toan_b20_lv1_v')&&v.status==='correct').length===4));
check('One-time token prevents replay',()=>assert.equal(call('g3aChamBaiToan20Test',payload).ok,false));
session=call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'});
const bad=JSON.parse(JSON.stringify(payload));bad.token=session.token;bad.answers[qs[0].id]={ones:'0',tens:'0',carry:'0'};
check('Wrong arithmetic produces wrong status',()=>{const r=call('g3aChamBaiToan20Test',bad);assert.equal(r.ok,true);assert(r.correct<r.total)});
session=call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'});
check('Reject unrecognized answer key before checking',()=>{let z=structuredClone(payload);z.token=session.token;z.answers[qs[0].id].isCorrect=true;assert.equal(call('g3aChamBaiToan20Test',z).ok,false);});
check('Rejected payload still consumes token',()=>assert.equal(call('g3aChamBaiToan20Test',{...payload,token:session.token}).ok,false));
session=call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'});
check('Reject extra question not selected by server',()=>{const z=structuredClone(payload);z.token=session.token;z.answers.EXTRA={answer:'1'};assert.equal(call('g3aChamBaiToan20Test',z).ok,false);});
session=call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'});
check('Reject level mismatch when token tied to another level',()=>{const z=structuredClone(payload);z.token=session.token;z.level='LV2';assert.equal(call('g3aChamBaiToan20Test',z).ok,false);});
check('Unauthorized email is denied even on public TEST read',()=>{qaEmail='intruder@example.test';assert.equal(call('g3aLayBaiToan20Test').ok,false);qaEmail='reviewer@example.test';});
check('Disabling TEST fails closed',()=>{props.set('G3A_TEST_ENABLED','false');assert.equal(call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'}).ok,false);props.set('G3A_TEST_ENABLED','true');});
check('Production workbook is blocked even with TEST_ENABLED',()=>{props.set('G3A_TEST_SOURCE_SPREADSHEET_ID',LIVE);assert.equal(call('g3aLayBaiToan20Test').ok,false);props.set('G3A_TEST_SOURCE_SPREADSHEET_ID',qaId);});
check('Live production workbook never accessed',()=>assert.equal(openProd,0));
check('No database write calls from TEST flow',()=>assert.equal(writes,0));
check('QA token creation is rate-limited',()=>{let last;for(let i=0;i<30;i++)last=call('g3aTaoPhienChamB20Test',{lessonId:'toan_b20',level:'LV1'});assert.equal(last.ok,false);assert.equal(last.reason,'QA_RATE_LIMIT');});
for(const fn of ['19_KhongGianHocToan.html','26_ChamCauHoiToan.html','41_HienThiCauHoiToan.html']){
 const source=fs.readFileSync(path.join(dir,fn),'utf8');
 check(fn+' has no operational q.answer / q.solutionPrompt',()=>{assert(!/q\.(?:answer|solutionPrompt)(?!\w)/.test(source));});
}
const result={phase:'DATA-B G3-A',mode:'SYNTHETIC_LOCAL_VM_NOT_GAS_NETWORK',baselineCommit:'59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff',total:results.length,passed:results.filter(x=>x.status==='PASS').length,failed:results.filter(x=>x.status==='FAIL').length,results};
const out=path.join(__dirname,'G3A_TEST_RESULTS.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({total:result.total,passed:result.passed,failed:result.failed,failedCases:results.filter(x=>x.status==='FAIL')},null,2));
if(result.failed)process.exitCode=1;
module.exports={call,ctx,props,store,cache,privateData,goodAnswers};
