'use strict';
/* Localhost-only synthetic LAB grading HTTP boundary.
 * Not an authenticated student endpoint. No cookies/scores/progress are stored.
 */
const grader=require('./trusted-grader.cjs');
const MAX_BYTES=16*1024;
function response(res,status,payload){
 res.statusCode=status;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.end(JSON.stringify(payload));
}
function handleGradeRequest(req,res){
 if(req.method!=='POST'||req.url?.split('?')[0]!=='/api/lab-grade')return false;
 const host=String(req.headers.host||'');
 const origin=String(req.headers.origin||'');
 if(!/^127\.0\.0\.1:\d{2,5}$/.test(host)||origin!=='http://'+host){
  response(res,403,{status:'REJECTED',reason:'LOCAL_ORIGIN_REQUIRED'});return true;
 }
 const type=String(req.headers['content-type']||'').toLowerCase();
 if(!/^application\/json(?:\s*;|$)/.test(type)){
  response(res,415,{status:'REJECTED',reason:'CONTENT_TYPE_REQUIRED'});return true;
 }
 let body='',oversize=false;
 req.setEncoding('utf8');
 req.on('data',chunk=>{if(oversize)return;body+=chunk;if(Buffer.byteLength(body,'utf8')>MAX_BYTES){oversize=true;body='';}});
 req.on('end',()=>{
  if(oversize){response(res,413,{status:'REJECTED',reason:'REQUEST_TOO_LARGE'});return}
  let data;
  try{data=JSON.parse(body)}catch(_){response(res,400,{status:'REJECTED',reason:'INVALID_JSON'});return}
  response(res,200,grader.evaluateSubmission(data));
 });
 req.on('error',()=>{if(!res.writableEnded)response(res,400,{status:'REJECTED',reason:'READ_ERROR'});});
 return true;
}
module.exports=Object.freeze({handleGradeRequest,MAX_BYTES});
