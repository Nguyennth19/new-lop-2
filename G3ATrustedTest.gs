/**
 * DATA-B / G3-A — GAS TEST read-only trusted grading boundary.
 * Tested only with a separate QA workbook. NEVER deploy from this branch to MAIN.
 * All public API methods require explicit Script Properties and authenticated email.
 * Do not return private answer, solutionPrompt, puzzle.ans or grading rubric.
 */
const G3A_TEST_CONTRACT='G3A_READONLY_V1';
const G3A_TEST_TOKEN_PREFIX='g3a_readonly_token_v1_';

function g3aDeny_(reason){return {ok:false,reason:reason||'DENIED',awarded:false};}
function g3aQaContext_(){
 const props=PropertiesService.getScriptProperties();
 if(props.getProperty('G3A_TEST_ENABLED')!=='true')throw Error('G3A_TEST_DISABLED');
 const id=String(props.getProperty('G3A_TEST_SOURCE_SPREADSHEET_ID')||'').trim();
 if(!id||id===CAU_HINH_LOP_2.SHEET_MAC_DINH)throw Error('G3A_TEST_SHEET_NOT_ISOLATED');
 const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
 const allow=String(props.getProperty('G3A_TEST_ALLOWED_EMAILS')||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!email||!allow.includes(email))throw Error('G3A_TEST_UNAUTHORIZED');
 return {email,qaSourceId:id};
}
function g3aPlain_(v){return !!v&&typeof v==='object'&&!Array.isArray(v);}
function g3aOnly_(obj,allowed){
 return g3aPlain_(obj)&&Object.keys(obj).every(function(k){return allowed.includes(k);});
}
/** A narrow hour-long QA budget; blocks using repeated read-only checks as an answer oracle. */
function g3aBudget_(ctx){
 const cache=CacheService.getScriptCache();
 const suffix=Utilities.base64EncodeWebSafe(ctx.email).replace(/=+$/,'').slice(0,120);
 const key='g3a_hour_quota_'+suffix;
 const lock=LockService.getScriptLock();lock.waitLock(5000);
 try{
  const count=Number(cache.get(key)||0);
  if(!Number.isSafeInteger(count)||count>=24)return false;
  cache.put(key,String(count+1),3600);
  return true;
 }finally{lock.releaseLock();}
}
function g3aTry_(fn){
 try{return fn();}catch(e){
  // Never include answers or exception stack/text in browser response.
  return g3aDeny_('TEST_DENIED');
 }
}
/** Public textbook B20 has no scoring secrets; test access is still restricted. */
function g3aLayBaiToan20Test(){
 return g3aTry_(function(){g3aQaContext_();return khoLayBaiHocPublic_('toan_b20');});
}
function g3aTaoPhienChamB20Test(req){
 return g3aTry_(function(){
  const ctx=g3aQaContext_();
  if(!g3aOnly_(req,['lessonId','level'])||req.lessonId!=='toan_b20'||!/^LV[123]$/.test(String(req.level)))return g3aDeny_('INVALID_SCOPE');
  // A session can be generated only for questions selected by server policy.
  const source=khoLayBaiHoc_('toan_b20');
  if(!source||source.lesson.id!=='toan_b20'||!achSelect_(source,String(req.level)).length)return g3aDeny_('NO_QUESTIONS');
  if(!g3aBudget_(ctx))return g3aDeny_('QA_RATE_LIMIT');
  const cache=CacheService.getScriptCache();
  const token=String(Utilities.getUuid()).replace(/-/g,'');
  if(!/^[0-9a-fA-F]{32}$/.test(token))throw Error('BAD_TOKEN_GENERATOR');
  cache.put(G3A_TEST_TOKEN_PREFIX+token,JSON.stringify({email:ctx.email,level:String(req.level),issued:Date.now()}),300);
  return {ok:true,contractId:G3A_TEST_CONTRACT,level:String(req.level),token,expiresInSeconds:300,awarded:false};
 });
}
function g3aAllowedAnswerFields_(q){
 if(q.type==='vertical')return ['ones','tens','carry'];
 if(q.type==='mental')return ['answer'];
 if(q.type==='word_problem')return ['n1','n2','op','sum','answer'];
 if(q.type==='missing_digit'){
  if(!Array.isArray(q.puzzle)||q.puzzle.length>8)return null;
  const keys=[];
  for(let i=0;i<q.puzzle.length;i++){
   if(!Array.isArray(q.puzzle[i])||q.puzzle[i].length>8)return null;
   for(let j=0;j<q.puzzle[i].length;j++)if(q.puzzle[i][j]&&typeof q.puzzle[i][j]==='object')keys.push('p'+i+j);
  }
  return keys.length?keys:null;
 }
 return null;
}
function g3aValidateAnswers_(raw,questions){
 if(!g3aPlain_(raw)||Object.keys(raw).length!==questions.length||questions.length>80)return false;
 const qids=new Set(questions.map(q=>q.id));
 if(Object.keys(raw).some(id=>!qids.has(id)))return false;
 for(const q of questions){
  if(!Object.prototype.hasOwnProperty.call(raw,q.id))return false;
  const fields=raw[q.id],allowed=g3aAllowedAnswerFields_(q);
  if(!allowed||!g3aOnly_(fields,allowed))return false;
  if(Object.entries(fields).some(function(pair){
   const k=pair[0],v=pair[1];
   if(typeof v!=='string'||v.length>10)return true;
   return k==='op'?!/^[+\-*/=]?$/.test(v):!/^[0-9]{0,3}$/.test(v);
  }))return false;
 }
 return true;
}
function g3aChamBaiToan20Test(payload){
 return g3aTry_(function(){
  const ctx=g3aQaContext_();
  if(!g3aOnly_(payload,['contractId','lessonId','level','token','answers'])||
    payload.contractId!==G3A_TEST_CONTRACT||payload.lessonId!=='toan_b20'||
    !/^LV[123]$/.test(String(payload.level))||!(/^[0-9a-fA-F]{32}$/.test(String(payload.token))))return g3aDeny_('INVALID_SCOPE');
  const raw=JSON.stringify(payload);
  if(!raw||raw.length>38000)return g3aDeny_('PAYLOAD_TOO_LARGE');
  const lock=LockService.getScriptLock();lock.waitLock(5000);
  try{
   const cache=CacheService.getScriptCache(),key=G3A_TEST_TOKEN_PREFIX+payload.token;
   const json=cache.get(key);
   if(!json)return g3aDeny_('SESSION_EXPIRED_OR_REPLAYED');
   cache.remove(key); // Token consumed even if answer validation fails.
   const session=JSON.parse(json);
   if(session.email!==ctx.email||session.level!==payload.level||
      Date.now()-Number(session.issued)>300000)return g3aDeny_('SESSION_MISMATCH');
  }finally{lock.releaseLock();}
  // No attempt-sheet writes and no points ledger writes anywhere in this handler.
  const data=khoLayBaiHoc_('toan_b20');
  if(!data||data.lesson.id!=='toan_b20')return g3aDeny_('SOURCE_LESSON_MISMATCH');
  const questions=achSelect_(data,payload.level);
  if(!questions.length||!g3aValidateAnswers_(payload.answers,questions))return g3aDeny_('INVALID_ANSWERS');
  let correct=0,answered=0;
  // Field-level color feedback is computed only on this trusted TEST server,
  // after one-use submission; never return expected digits or a grading key.
  // No partial feedback for incomplete vertical questions (limits probing).
  const cellFeedback={};
  const perQuestion=questions.map(function(q){
   const fields=payload.answers[q.id],filled=Object.values(fields).some(v=>!!v.trim());
   const isCorrect=filled&&achCheck_(q,fields);
   if(filled)answered++;
   if(isCorrect)correct++;
   if(q.type==='vertical'&&['ones','tens','carry'].every(function(k){
      return typeof fields[k]==='string'&&fields[k].trim()!=='';})){
     const digits=String(q.answer||'');
     // B20 uses two-digit result slots; unsupported totals get no field hints.
     if(/^\\d{2}$/.test(digits)){
       const expectedCarry=(Number(q.n1)%10+Number(q.n2)%10)>=10?'1':'0';
       cellFeedback[q.id]={
         ones:fields.ones===digits[1]?'correct':'wrong',
         tens:fields.tens===digits[0]?'correct':'wrong',
         carry:fields.carry===expectedCarry?'correct':'wrong'
       };
     }
   }
   return {id:q.id,status:isCorrect?'correct':filled?'wrong':'empty'};
  });
  return {ok:true,contractId:G3A_TEST_CONTRACT,lessonId:'toan_b20',level:payload.level,
   correct,total:questions.length,answered,perQuestion,cellFeedback,awarded:false,
   writes:0,mode:'GAS_TEST_READ_ONLY'};
 });
}
/** B024 is alpha, G2-B human source-exact 0/96; refuse grading and asset grants. */
function g3aLayBaiB024Test(){return g3aDeny_('B024_SOURCE_NOT_APPROVED');}
function g3aChamBaiB024Test(_payload){return g3aDeny_('B024_SOURCE_NOT_APPROVED');}


/**
 * QA tab allowlist: the original isolated B20 workbook has only 4 source tabs.
 * TEST NEW adds exactly 4 review/acceptance tabs; never allow arbitrary tabs.
 * This does not approve G2B source content or relax private grading rules.
 */
function g3bApprovedQaTabSet_(actual){
 const source=['01_Bai_hoc','02_Cap_do','03_Nhom_bai','04_Cau_hoi'];
 const review=['00_HUONG_DAN','05_G2B_25_CASE','06_NGHIEM_THU_B20','07_NGHIEM_THU_HINH'];
 if(!Array.isArray(actual)||!(actual.length===4||actual.length===8))return false;
 const wanted=actual.length===4?source:source.concat(review);
 const set=new Set(actual);
 return set.size===wanted.length&&wanted.every(function(name){return set.has(name);});
}

/**
 * G3-B one-run REAL Apps Script server acceptance (Editor-only, suffix '_').
 * Must run in the isolated authorized GAS TEST project AFTER code synchronization.
 * This audits the actual QA workbook and GAS runtime, not a simulated VM.
 * It DOES NOT prove the deployed Web App code SHA, OAuth browser identity or
 * Chrome Network payload; these still require independent E2E evidence.
 * No answers, tokens, secret values, email or sheet data are returned.
 */
function g3bAuditGasServerOnce_(){
 const tests=[];
 function check(name,fn){
  try{if(fn()!==true)throw Error('ASSERTION');tests.push({name:name,pass:true});}
  catch(_){tests.push({name:name,pass:false});}
 }
 let ctx,wb,before,source;
 try{
  ctx=g3aQaContext_(); // fail closed without active, allowlisted TEST identity
  wb=SpreadsheetApp.openById(ctx.qaSourceId);
 }catch(_){
  return {ok:false,scope:'REAL_GAS_SERVER_ONLY',reason:'QA_IDENTITY_OR_SOURCE_DENIED',
   tests:[],writes:0,awarded:false,webDeploymentVerified:false,networkVerified:false};
 }
 const names=['01_Bai_hoc','02_Cap_do','03_Nhom_bai','04_Cau_hoi'];
 const expected=[1,3,8,51];
 function fingerprint(){
  return names.map(function(n){
   const sh=wb.getSheetByName(n);
   if(!sh)throw Error('QA_SOURCE_TAB_MISSING');
   // Values are compared within GAS and NEVER returned.
   const rows=sh.getDataRange().getDisplayValues();
   return {name:n,count:rows.slice(1).filter(function(r){return r.some(function(v){return String(v).trim();});}).length,
    serialized:JSON.stringify(rows)};
  });
 }
 try{before=fingerprint();}catch(_){
  return {ok:false,scope:'REAL_GAS_SERVER_ONLY',reason:'QA_WORKBOOK_MISMATCH',
   tests:[],writes:0,awarded:false,webDeploymentVerified:false,networkVerified:false};
 }
 check('QA_WORKBOOK_4_SOURCE_TABS_1_3_8_51_WITH_APPROVED_REVIEW_TABS',function(){
  const actual=wb.getSheets().map(function(s){return s.getName();});
  return g3bApprovedQaTabSet_(actual)&&
   before.every(function(v,i){return v.count===expected[i];});
 });
 check('LEGACY_04_RAW_EXPORT_DISABLED',function(){
  try{layThongTinDuLieuBaiHoc();return false;}
  catch(e){return /G3B_LEGACY_RAW_SHEET_EXPORT_DISABLED/.test(String(e));}
 });
 check('PUBLIC_B20_NO_PRIVATE_KEY_FIELDS',function(){
  const pub=g3aLayBaiToan20Test();
  if(!pub||!pub.questions||pub.questions.length!==51)return false;
  if(pub.securityContract!=='G3A_PUBLIC_ALLOWLIST_V1')return false;
  const forbidden=/^(?:answer|answers|ans|solution|solutionPrompt|correctAnswer|answerKey|gradingKey|teacherSolution|studentId)$/i;
  function clean(v){
   if(Array.isArray(v))return v.every(clean);
   if(v&&typeof v==='object')return Object.keys(v).every(function(k){return !forbidden.test(k)&&clean(v[k]);});
   return true;
  }
  return clean(pub);
 });
 check('SAFE_SVG_PUBLIC_ALLOWLIST',function(){
  const pub=g3aLayBaiToan20Test();
  return pub.questions.every(function(q){return typeof q.svg!=='string'||
   q.svg===''||g3aSafePublicSvg_(q.svg)===q.svg;});
 });
 try{source=khoLayBaiHoc_('toan_b20');}
 catch(_){source=null;}
 check('SOURCE_51_SERVER_PRIVATE_ONLY',function(){
  return !!source&&source.lesson.id==='toan_b20'&&source.questions.length===51&&
   source.questions.some(function(q){return !!q.answer||q.type==='missing_digit';});
 });
 function answersFor(qs,mode){
  const out={};
  for(const q of qs){
   let fields={};
   if(q.type==='vertical'){
    const ans=String(q.answer||'').padStart(2,'0');
    fields={ones:ans.charAt(ans.length-1),tens:ans.charAt(ans.length-2),
     carry:(Number(q.n1)%10+Number(q.n2)%10)>=10?'1':'0'};
   }else if(q.type==='mental')fields={answer:String(q.answer||'')};
   else if(q.type==='word_problem')fields={n1:String(q.n1),n2:String(q.n2),op:String(q.op),
    sum:String(q.answer),answer:String(q.answer)};
   else if(q.type==='missing_digit'){
    for(let i=0;i<q.puzzle.length;i++)for(let j=0;j<q.puzzle[i].length;j++){
     const c=q.puzzle[i][j];
     if(c&&typeof c==='object')fields['p'+i+j]=String(c.ans);
    }
   }else throw Error('UNSUPPORTED_TEST_QUESTION');
   if(mode==='empty')Object.keys(fields).forEach(function(k){fields[k]='';});
   out[q.id]=fields;
  }
  if(mode==='wrong'){
   const first=qs[0],fields=out[first.id],key=Object.keys(fields)[0];
   if(!key)throw Error('NO_ANSWERS_TO_MUTATE');
   fields[key]=fields[key]==='999'?'998':'999';
  }
  return out;
 }
 for(const level of ['LV1','LV2','LV3']){
  for(const mode of ['correct','wrong','empty']){
   check('GRADE_'+level+'_'+mode+'_SINGLE_USE_READONLY',function(){
    if(!source)return false;
    const selected=achSelect_(source,level);
    if(!selected.length)return false;
    const session=g3aTaoPhienChamB20Test({lessonId:'toan_b20',level:level});
    if(!session.ok||!session.token)return false;
    const req={contractId:'G3A_READONLY_V1',lessonId:'toan_b20',level:level,
     token:session.token,answers:answersFor(selected,mode)};
    const graded=g3aChamBaiToan20Test(req);
    if(!graded.ok||graded.awarded!==false||graded.writes!==0||
       graded.total!==selected.length||graded.perQuestion.length!==selected.length)return false;
    const good=mode==='correct'?graded.correct===selected.length:
     mode==='wrong'?graded.correct<selected.length:graded.answered===0&&graded.correct===0;
    // A replay of the same one-use token must always fail.
    const replay=g3aChamBaiToan20Test(req);
    return good&&replay.ok===false&&replay.reason==='SESSION_EXPIRED_OR_REPLAYED';
   });
  }
 }
 check('BAD_SCOPE_AND_B024_DENIED',function(){
  const bad=g3aTaoPhienChamB20Test({lessonId:'toan_b24',level:'LV1'});
  const b024=g3aChamBaiB024Test({});
  return bad.ok===false&&b024.ok===false;
 });
 check('SOURCE_WORKBOOK_UNCHANGED_AND_STUDENT_TABS_ABSENT',function(){
  const after=fingerprint();
  const noTabs=['90_Lan_lam_bai','91_So_sao','92_Ghi_chu_phu_huynh']
   .every(function(n){return wb.getSheetByName(n)===null;});
  return noTabs&&after.every(function(v,i){return v.name===before[i].name&&
   v.count===before[i].count&&v.serialized===before[i].serialized;});
 });
 const passed=tests.filter(function(t){return t.pass;}).length;
 return {ok:passed===tests.length,scope:'REAL_GAS_SERVER_ONLY',
  passed:passed,failed:tests.length-passed,checks:tests,qaSourceCount:51,
  writes:0,awarded:false,webDeploymentVerified:false,networkVerified:false,
  release: 'NO_GO_UNTIL_AUTHENTICATED_WEB_APP_E2E'};
}
