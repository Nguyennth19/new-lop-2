/** P0.5-I — TEST-only content receipt. No Student, Sheet, Stars, progress writes.
 * File: P05_XacMinhNoiDungDaDuyet.gs
 * Function: kiemTraNoiDungP05DaDuyet
 * This checks the actively loaded B20 JSON and protects the approved H.1 copy.
 * Run in the isolated TEST Apps Script project only.
 */
function kiemTraNoiDungP05DaDuyet(){
  const expected={
    '004':'Tính: 15 + 78 = ?',
    '007':'Tính: 47 + 34 = ?',
    '010':'Tính: 57 + 36 = ?',
    '022':'Tính: 57 + 14 + 15 = ?',
    '024':'Tính: 28 + 39 + 16 = ?',
    '026':'Tính: 14 + 67 + 10 = ?',
    '030':'Tính: 26 + 49 + 16 = ?'
  };
  const prop=PropertiesService.getScriptProperties();
  const p03=prop.getProperty('P03_QA_TEST_APPROVED');
  const errors=[];
  if(p03==='YES')errors.push('P03_APPROVAL_FLAG_OPEN');
  const loaded=b20DocPackThu_();
  const sessions=loaded&&loaded.questions?loaded.sessions:[];
  if(!loaded||!loaded.questions||loaded.questions.length!==30||!Array.isArray(sessions)||sessions.length!==6)
    errors.push('B20_PACK_WRONG_SIZE');
  const matches=[];
  Object.keys(expected).forEach(function(suffix){
    const id='VAR_B20_20261112_'+suffix;
    const q=loaded&&loaded.questions&&loaded.questions.find(function(x){return x.question_id===id;});
    if(!q||q.prompt!==expected[suffix])errors.push('PROMPT_MISMATCH_'+suffix);
    else matches.push(suffix);
  });
  const pinnedSource=typeof B20_PILOT_URL==='string'&&B20_PILOT_URL.indexOf('/1e9c700f1fd85427b30e9f1f42c8c49669011e33/')!==-1;
  if(!pinnedSource)errors.push('B20_SOURCE_NOT_H1_PINNED');
  const report={version:'P0.5-I-approved-b20-receipt-v1',lessonId:'toan_b20',
    status:errors.length?'BLOCKED':'PASS',errors,
    questionCount:loaded&&loaded.questions?loaded.questions.length:null,
    sessionCount:sessions&&sessions.length,
    approvedPromptsMatched:matches.length,matchedSuffixes:matches,
    sourceCommitPinned:pinnedSource,p03Locked:p03!=='YES',noWrites:true,noStars:true,
    readOnly:true};
  console.log(JSON.stringify(report));
  return report;
}
