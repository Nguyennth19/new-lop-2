'use strict';
/** Local-only LAB preview/server. Synthetic grading for approved LAB routes ONLY. NOT GAS/PROD. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {handleGradeRequest}=require('../universal-template-v12/http-grade-boundary.cjs');
const dist=path.resolve(__dirname,'dist');
const names=Object.freeze({
 '/':'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html',
 '/lab':'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html',
 '/LAB_MATH_A.json':'LAB_MATH_A.json',
 '/LAB_MATH_B.json':'LAB_MATH_B.json'
});
const port=Number(process.env.ULT_LAB_PORT||8765);
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('PORT_BAD');
const srv=http.createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Content-Security-Policy',"default-src 'none'; img-src data: https://raw.githubusercontent.com; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self';");
 if(handleGradeRequest(req,res))return;
 const file=names[req.url];
 if(!file||req.method!=='GET'){res.statusCode=404;res.end('NOT_FOUND');return}
 const p=path.join(dist,file);
 if(!fs.existsSync(p)){res.statusCode=503;res.end('Build first: node qa/universal-template-v1/build.cjs');return}
 res.setHeader('Content-Type',file.endsWith('.json')?'application/json; charset=utf-8':'text/html; charset=utf-8');
 fs.createReadStream(p).pipe(res);
});
srv.listen(port,'127.0.0.1',()=>{
 console.log('ULT LAB ONLY http://127.0.0.1:'+port+'/lab');
 console.log('No student data, no GAS, no cloud deploy. Seven synthetic grader routes; five routes explicitly NO_GRANT.');
});
