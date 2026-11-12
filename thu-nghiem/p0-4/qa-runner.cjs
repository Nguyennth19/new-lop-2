#!/usr/bin/env node
'use strict';
/**
 * P0.4 offline-only QA orchestrator. Executes inherited tests, does not reimplement them.
 * Node 22+. No network, Apps Script, user spreadsheet, student ID, or score writes.
 *
 * node thu-nghiem/p0-4/qa-runner.cjs FAST
 * node thu-nghiem/p0-4/qa-runner.cjs FULL_SAFE
 * node thu-nghiem/p0-4/qa-runner.cjs UI_REGRESSION
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const cp=require('node:child_process');
const ROOT=path.resolve(__dirname,'../..');
const VERSION='p0.4-runner-v1';
const TESTS=Object.freeze({
  validator:{file:'thu-nghiem/p0-2/kiem-thu-validator-v1.cjs',kind:'node_tests',minimum:23},
  no_write:{file:'thu-nghiem/p0-3/kiem-thu-snapshot.cjs',kind:'node_tests',minimum:4},
  ui_layout:{file:'qa/g7-4-b3-1/test-controlled-merge.cjs',kind:'g7_summary',minimum:9},
  ui_image:{file:'qa/g7-4-b3-1/test-visual-fallback.cjs',kind:'g7_summary',minimum:8}
});
const SUITES=Object.freeze({
  FAST:['validator','no_write'],
  FULL_SAFE:['validator','no_write','ui_layout','ui_image'],
  UI_REGRESSION:['ui_layout','ui_image']
});
const codeError=(code,reason)=>({code,reason:String(reason).slice(0,240)});
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function parseResult(kind,out,min){
  if(kind==='node_tests'){
    const last=out.trim().split(/\r?\n/).filter(s=>s.startsWith('{')).at(-1);
    if(!last)throw Error('MISSING_SUMMARY');
    const data=JSON.parse(last);
    if(!Number.isInteger(data.passed)||data.passed<min||data.failed!==0)
      throw Error('CASE_COUNT_OR_FAILURE: passed='+data.passed+' failed='+data.failed);
    return {passed:data.passed,failed:data.failed,summary:data.suite||null};
  }
  if(kind==='g7_summary'){
    // G7 scripts emit a pretty printed JSON object as their last block.
    const match=out.match(/"pass"\s*:\s*(\d+)[\s\S]*?"fail"\s*:\s*(\d+)/);
    if(!match)throw Error('MISSING_G7_SUMMARY');
    const passed=Number(match[1]),failed=Number(match[2]);
    if(passed<min||failed!==0)throw Error('G7_CASE_COUNT_OR_FAILURE:'+passed+','+failed);
    return {passed,failed,summary:'legacy-G7'};
  }
  throw Error('UNKNOWN_RESULT_KIND');
}
function sourceSha(){
  if(process.env.GITHUB_SHA&&/^[a-f0-9]{40}$/i.test(process.env.GITHUB_SHA))return process.env.GITHUB_SHA;
  const v=cp.spawnSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8',timeout:3000});
  return v.status===0&&/^[a-f0-9]{40}$/i.test(v.stdout.trim())?v.stdout.trim():null;
}
function trackedState(){
 const v=cp.spawnSync('git',['status','--porcelain','--untracked-files=no'],{cwd:ROOT,encoding:'utf8',timeout:3000});
 return v.status===0?v.stdout:null;
}
function runSuite(name,options={}){
  const started=Date.now();
  const lessonId='toan_b20',schemaVersion='b20-variant-pilot-1.0';
  const report={version:VERSION,mode:name,lessonId,schemaVersion,sourceCommit:sourceSha(),
    scope:'OFFLINE_ONLY',noWrites:true,webapp:'NOT_TESTED',browser:'NOT_TESTED',
    status:'FAIL',durationMs:0,passed:0,failed:0,tests:[],errors:[]};
  if(!Object.prototype.hasOwnProperty.call(SUITES,name)){
    report.errors.push(codeError('QA_INVALID_MODE','Use FAST, FULL_SAFE, or UI_REGRESSION'));
    report.durationMs=Date.now()-started;return report;
  }
  const before=trackedState();
  if(before===null||before.trim()){
    report.errors.push(codeError('QA_DIRTY_BASELINE','Require clean tracked worktree for reproducible QA'));
    report.durationMs=Date.now()-started;return report;
  }
  for(const key of SUITES[name]){
    const spec=TESTS[key],target=path.resolve(ROOT,spec.file),one=Date.now();
    if(!target.startsWith(ROOT+path.sep)||!fs.existsSync(target)){
      report.failed++;report.tests.push({id:key,status:'FAIL',durationMs:Date.now()-one});
      report.errors.push(codeError('QA_TEST_MISSING',key));continue;
    }
    const digest=hash(target);
    const child=cp.spawnSync(process.execPath,[target],{
      cwd:ROOT,encoding:'utf8',timeout:options.timeoutMs||60000,
      maxBuffer:1024*1024,env:{...process.env,LOP2_QA_OFFLINE:'1'}
    });
    let summary=null,error=null;
    if(child.error)error=codeError(child.error.code==='ETIMEDOUT'?'QA_TIMEOUT':'QA_SPAWN_ERROR',key+':'+child.error.message);
    else if(child.status!==0){
      const diagnostic=(child.stdout||'').split(/\r?\n/).filter(line=>/^FAIL\s/.test(line)).slice(0,2)
        .map(line=>line.replace(/[\x00-\x1f]/g,'').slice(0,90)).join(' | ');
      error=codeError('QA_CHILD_FAILED',key+':exit='+child.status+(diagnostic?':'+diagnostic:''));
    }
    else try{summary=parseResult(spec.kind,child.stdout||'',spec.minimum);}
      catch(e){error=codeError('QA_BAD_SUMMARY',key+':'+e.message);}
    if(hash(target)!==digest)error=codeError('QA_TEST_MUTATED',key);
    const item={id:key,status:error?'FAIL':'PASS',durationMs:Date.now()-one,
      cases:summary?summary.passed:null,file:spec.file};
    report.tests.push(item);
    if(error){report.failed++;report.errors.push(error);}
    else report.passed++;
  }
  const after=trackedState();
  if(after!==before){
    report.errors.push(codeError('QA_WORKTREE_CHANGED','Tracked project files were modified during QA'));
    report.failed++;
  }
  report.durationMs=Date.now()-started;
  report.status=report.failed===0&&report.tests.length===SUITES[name].length?'PASS':'FAIL';
  return report;
}
if(require.main===module){
  const mode=process.argv[2]||'FAST';
  const result=runSuite(mode);
  // No copied child logs: avoid accidental sensitive output in centralized reports.
  console.log(JSON.stringify(result));
  if(result.status!=='PASS')process.exitCode=1;
}
module.exports={runSuite,parseResult,SUITES,TESTS};
