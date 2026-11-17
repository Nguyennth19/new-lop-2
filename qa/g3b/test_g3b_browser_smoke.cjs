/* G3-B browser QA bridge regression. Fully mocked Google script.run, NOT real GAS.
 * Verifies the opt-in HTML runner can complete its 21 labeled checks without
 * putting answer keys, session tokens, or tester identity into the receipt.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const {call,ctx,props,store}=require('../g3a/test_g3a_isolated.cjs');
vm.runInContext(fs.readFileSync(path.join(root,'DocDuLieuSheet.gs'),'utf8'),ctx);
props.set('G3A_TEST_ENABLED','true');
props.set('G3A_TEST_ALLOWED_EMAILS','reviewer@example.test');
for(const key of [...store.keys()])if(key.startsWith('g3a_hour_quota_'))store.delete(key);
const html=fs.readFileSync(path.join(root,'G3B_BrowserSmoke.html'),'utf8');
const scriptTags=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
assert.equal(scriptTags.length,1,'exactly one browser QA JS script');
const code=scriptTags[0][1];
let click=null;
const rows=[],dom={
 run:{disabled:false,addEventListener(name,fn){assert.equal(name,'click');click=fn;}},
 status:{textContent:''},
 checks:{textContent:'',appendChild(item){rows.push(item.textContent);}},
 receipt:{value:''}
};
const document={
 getElementById(id){assert(id in dom,'unexpected element '+id);return dom[id];},
 createElement(tag){assert.equal(tag,'li');return {className:'',textContent:''};}
};
const gs={withSuccessHandler(onSuccess){
 return {withFailureHandler(onError){
  return new Proxy({}, {get(_obj,name){
   return function(...args){
    try{onSuccess(call(String(name),...args));}
    catch(error){onError(error);}
   };
  }});
 }};
}};
const browser=vm.createContext({document,window:{google:{script:{run:gs}}},
 google:{script:{run:gs}},Date,JSON,Object,Array,Promise,Map,Set,Error,String,Number});
vm.runInContext(code,browser,{filename:'G3B_BrowserSmoke.html'});
assert.equal(typeof click,'function','QA runner must wait for a real click');
async function main(){
 await click();
 const report=JSON.parse(dom.receipt.value);
 assert.equal(report.scope,'GAS_WEBAPP_RPC_SMOKE_ONLY');
 assert.equal(report.tests,21,'21 required public/legacy/level/grading/replay/b024 checks');
 assert.equal(report.passed,21,'no failed browser bridge checks');
 assert.equal(report.failed,0);
 assert.equal(rows.length,21);
 assert.equal(report.studentRelease,'NO_GO');
 assert.equal(report.gasEditorAuditVerified,false);
 assert.equal(report.visualUXVerified,false);
 assert.equal(report.networkTraceVerified,false);
 assert.equal(report.deployedCodeShaVerified,false);
 assert(!/reviewer@example|G3A_SANDBOX_ONLY|g3a_readonly_token_v1_|SECRET_PRIVATE_SOLUTION/i.test(dom.receipt.value),'receipt leaks private data');
 assert.equal(dom.run.disabled,false);
 const result={phase:'G3B_BROWSER_QA_BRIDGE',mode:'VM_MOCK_NOT_REAL_GAS',passed:21,
  failed:0,tests:21,studentRelease:'NO_GO',actualGasDeployment:false,
  reportFields:Object.keys(report).sort()};
 fs.writeFileSync(path.join(__dirname,'G3B_BROWSER_SMOKE_RESULTS.json'),JSON.stringify(result,null,2)+'\n');
 console.log('G3B simulated browser RPC smoke: 21/21 PASS (NOT REAL GAS)');
}
main().catch(error=>{console.error('G3B simulated browser bridge FAILED:',error.message);process.exitCode=1;});
