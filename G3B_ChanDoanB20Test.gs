/**
 * P0 TEST NEW — safe editor-only B20 diagnosis.
 * Pull branch test-new into the isolated TEST project; DO NOT deploy or publish
 * to diagnose the cause. Run g3bChanDoanB20Test_() in Apps Script Editor.
 * No email, spreadsheet IDs, answer fields, tokens, contents or exception text logged.
 */
function g3bChanDoanB20Test_(){
  const report={scope:'P0_B20_GAS_EDITOR_DIAGNOSTIC_ONLY',
    timestamp:new Date().toISOString(),status:'NOT_RUN',checks:[],
    answerKeysLogged:false,emailLogged:false,studentWrites:0,deploymentVerified:false};
  function pass(code,ok){report.checks.push({code:code,status:ok?'PASS':'FAIL'});}
  function stop(code){
    report.status=code;
    console.log('P0_B20_SAFE_DIAGNOSTIC '+JSON.stringify(report));
    return report;
  }
  let ctx;
  try{ctx=g3aQaContext_();pass('TEST_IDENTITY_AND_PROPERTIES',true);}
  catch(_){pass('TEST_IDENTITY_AND_PROPERTIES',false);return stop('AUTH_OR_PROPERTIES_FAIL');}
  let book;
  try{book=SpreadsheetApp.openById(ctx.qaSourceId);pass('SOURCE_SPREADSHEET_OPEN',true);}
  catch(_){pass('SOURCE_SPREADSHEET_OPEN',false);return stop('SOURCE_OPEN_FAIL');}
  const names=['01_Bai_hoc','02_Cap_do','03_Nhom_bai','04_Cau_hoi'];
  const expected=[1,3,8,51];
  try{
    const sourceTabs=names.map(function(name){return book.getSheetByName(name);});
    if(sourceTabs.some(function(tab){return !tab;})){
      pass('FOUR_REQUIRED_TABS_EXIST',false);return stop('SOURCE_TABS_MISSING');
    }
    pass('FOUR_REQUIRED_TABS_EXIST',true);
    const counts=sourceTabs.map(function(sh){
      const data=sh.getDataRange().getDisplayValues();
      return data.slice(1).filter(function(row){return row.some(function(x){return String(x).trim();});}).length;
    });
    const matches=counts.every(function(n,i){return n===expected[i];});
    pass('SOURCE_COUNTS_1_3_8_51',matches);
    if(!matches)return stop('SOURCE_ROW_COUNTS_MISMATCH');
    // Reviewer/acceptance tabs beyond the four mandatory source tabs are valid.
    pass('EXTRA_QA_REVIEW_TABS_ALLOWED',true);
  }catch(_){pass('FOUR_TAB_READ',false);return stop('SOURCE_READ_FAIL');}
  let source;
  try{
    source=khoLayBaiHoc_('toan_b20');
    const valid=!!source&&!!source.lesson&&source.lesson.id==='toan_b20'&&
      Array.isArray(source.questions)&&source.questions.length===51;
    pass('PRIVATE_B20_LOADER',valid);
    if(!valid)return stop('PRIVATE_LOADER_MISMATCH');
  }catch(_){pass('PRIVATE_B20_LOADER',false);return stop('PRIVATE_LOADER_FAIL');}
  try{
    const pub=khoLayBaiHocPublic_('toan_b20');
    const valid=!!pub&&pub.securityContract==='G3A_PUBLIC_ALLOWLIST_V1'&&
      Array.isArray(pub.questions)&&pub.questions.length===51;
    pass('PUBLIC_B20_PROJECTION',valid);
    if(!valid)return stop('PUBLIC_PROJECTION_MISMATCH');
    const forbidden=/^(?:answer|answers|ans|answerKey|correctAnswer|solution|solutionPrompt|gradingKey|teacherSolution|studentId)$/i;
    function clean(v){
      if(Array.isArray(v))return v.every(clean);
      if(v&&typeof v==='object')return Object.keys(v).every(function(k){
        return !forbidden.test(k)&&clean(v[k]);
      });
      return true;
    }
    const safe=clean(pub);
    pass('NO_SECRET_KEYS_IN_PUBLIC_PAYLOAD',safe);
    if(!safe)return stop('PUBLIC_PAYLOAD_SECRET_GATE_FAIL');
  }catch(_){pass('PUBLIC_B20_PROJECTION',false);return stop('PUBLIC_PROJECTION_FAIL');}
  try{
    const response=g3aLayBaiToan20Test();
    const ok=!!response&&response.securityContract==='G3A_PUBLIC_ALLOWLIST_V1'&&
      Array.isArray(response.questions)&&response.questions.length===51;
    pass('BROWSER_RPC_PUBLIC_HANDLER',ok);
    if(!ok)return stop('PUBLIC_RPC_TEST_DENIED');
  }catch(_){pass('BROWSER_RPC_PUBLIC_HANDLER',false);return stop('PUBLIC_RPC_FAIL');}
  return stop('SERVER_SOURCE_AND_PUBLIC_HANDLER_PASS');
}
