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
  const perQuestion=questions.map(function(q){
   const fields=payload.answers[q.id],filled=Object.values(fields).some(v=>!!v.trim());
   const isCorrect=filled&&achCheck_(q,fields);
   if(filled)answered++;
   if(isCorrect)correct++;
   return {id:q.id,status:isCorrect?'correct':filled?'wrong':'empty'};
  });
  return {ok:true,contractId:G3A_TEST_CONTRACT,lessonId:'toan_b20',level:payload.level,
   correct,total:questions.length,answered,perQuestion,awarded:false,
   writes:0,mode:'GAS_TEST_READ_ONLY'};
 });
}
/** B024 is alpha, G2-B human source-exact 0/96; refuse grading and asset grants. */
function g3aLayBaiB024Test(){return g3aDeny_('B024_SOURCE_NOT_APPROVED');}
function g3aChamBaiB024Test(_payload){return g3aDeny_('B024_SOURCE_NOT_APPROVED');}
