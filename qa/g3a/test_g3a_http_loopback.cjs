/* Loopback HTTP regression for JSON serialization only — NOT a GAS deployment test. */
'use strict';
const assert=require('node:assert/strict');const http=require('node:http');const fs=require('node:fs');
const {call,ctx,props,store,privateData,goodAnswers}=require('./test_g3a_isolated.cjs');
for(const key of [...store.keys()])if(key.startsWith('g3a_hour_quota_'))store.delete(key);
props.set('G3A_TEST_ENABLED','true');
const cases=[];async function test(name,fn){try{await fn();cases.push({name,status:'PASS'});}catch(e){cases.push({name,status:'FAIL',detail:e.message});}}
const endpoint=http.createServer((req,res)=>{
 let body='';req.on('data',d=>body+=String(d));req.on('end',()=>{
  let data={};try{data=body?JSON.parse(body):{}}catch(e){data={INVALID_JSON:true}}
  let out;
  if(req.url==='/g3a/lesson')out=call('g3aLayBaiToan20Test');
  else if(req.url==='/g3a/session')out=call('g3aTaoPhienChamB20Test',data);
  else if(req.url==='/g3a/grade')out=call('g3aChamBaiToan20Test',data);
  else if(req.url==='/g3a/b024')out=call('g3aChamBaiB024Test',data);
  else out={ok:false};
  res.writeHead(200,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(out));
 });
});
endpoint.listen(0,'127.0.0.1',async()=>{
 const url='http://127.0.0.1:'+endpoint.address().port;
 const req=async(p,body)=>{const r=await fetch(url+p,{method:body?'POST':'GET',headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined});return {obj:await r.json(),headers:r.headers,status:r.status};};
 await test('HTTP transport: public lesson serialization has 51 questions, no private keys',async()=>{const r=await req('/g3a/lesson');assert.equal(r.obj.questions.length,51);assert.equal(r.obj.securityContract,'G3A_PUBLIC_ALLOWLIST_V1');assert(!JSON.stringify(r.obj).includes('SECRET_PRIVATE_SOLUTION'));assert(!r.obj.questions.some(q=>'answer' in q||'solutionPrompt' in q));assert.equal(r.headers.get('cache-control'),'no-store');});
 let tok;
 await test('HTTP transport: QA session returns token but no answers',async()=>{const r=await req('/g3a/session',{lessonId:'toan_b20',level:'LV1'});assert(r.obj.ok);tok=r.obj.token;assert(!('answer' in r.obj));});
 const selected=call('achSelect_',privateData,'LV1'), answers=goodAnswers(selected);
 const payload={contractId:'G3A_READONLY_V1',lessonId:'toan_b20',level:'LV1',token:tok,answers};
 await test('HTTP transport: private grade returns statuses only',async()=>{const r=await req('/g3a/grade',payload);assert(r.obj.ok);assert.equal(r.obj.writes,0);assert.equal(r.obj.awarded,false);assert.equal(r.obj.perQuestion.length,selected.length);assert(!JSON.stringify(r.obj).includes('SECRET_PRIVATE_SOLUTION'));assert(r.obj.perQuestion.every(x=>Object.keys(x).sort().join(',')==='id,status'));});
 await test('HTTP transport: replay blocked',async()=>{const r=await req('/g3a/grade',payload);assert(!r.obj.ok);assert.equal(r.obj.reason,'SESSION_EXPIRED_OR_REPLAYED');});
 await test('HTTP transport: B024 remains denied',async()=>{const r=await req('/g3a/b024',{lessonId:'MATH_B024',answers:{}});assert(!r.obj.ok);assert.equal(r.obj.reason,'B024_SOURCE_NOT_APPROVED');});
 await test('HTTP transport: untrusted nonnumeric answer cannot change result',async()=>{const st=(await req('/g3a/session',{lessonId:'toan_b20',level:'LV1'})).obj;const malicious={...payload,token:st.token,answers:structuredClone(answers)};malicious.answers[selected[0].id].tens='__proto__';const r=await req('/g3a/grade',malicious);assert(!r.obj.ok);});
 endpoint.close();const output={phase:'G3-A',transport:'LOCAL_LOOPBACK_HTTP_MOCK_NO_GAS_DEPLOYMENT',tests:cases.length,pass:cases.filter(x=>x.status==='PASS').length,fail:cases.filter(x=>x.status==='FAIL').length,cases};fs.writeFileSync(__dirname+'/G3A_HTTP_LOOPBACK_RESULTS.json',JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({HTTP:output.tests,PASS:output.pass,FAIL:output.fail,failures:cases.filter(x=>x.status==='FAIL')},null,2));if(output.fail)process.exitCode=1;
});
