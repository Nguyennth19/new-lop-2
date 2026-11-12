/**
 * P0.3 — opt-in GAS QA, READ-ONLY.
 * Keep under thu-nghiem/p0-3/; do not deploy until TEST script binding is confirmed.
 * Never log Sheet cell values, student identifiers or individual answers.
 * No appendRow/setValue/clear/update on any Sheet.
 */
const P03_QA_TABS_ = Object.freeze(['90_Lan_lam_bai','91_So_sao']);
function p03QaDigest_(values) {
  const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(values),Utilities.Charset.UTF_8);
  return bytes.map(b=>('0'+(b<0?b+256:b).toString(16)).slice(-2)).join('');
}
function p03QaSnapshot_(wb) {
  return P03_QA_TABS_.map(name=>{
    const sh=wb.getSheetByName(name);
    if(!sh)throw Error('P03_SHEET_MISSING:'+name);
    const rows=sh.getMaxRows(),cols=sh.getMaxColumns();
    if(rows*cols>250000)throw Error('P03_SHEET_TOO_LARGE:'+name+'; use bounded pagination before QA');
    const range=sh.getRange(1,1,rows,cols);
    // Capture both displayed content and original formulas, including trailing grid cells.
    // No student data or plaintext values leave this function.
    const content=[range.getDisplayValues(),range.getFormulas()];
    return {tab:name,gridRows:rows,gridCols:cols,lastRow:sh.getLastRow(),
      lastColumn:sh.getLastColumn(),digest:p03QaDigest_(content)};
  });
}
function p03QaCompare_(before,after) {
  const comparisons=before.map((b,i)=>{
    const a=after[i],match=!!a&&b.tab===a.tab&&b.gridRows===a.gridRows&&
      b.gridCols===a.gridCols&&b.lastRow===a.lastRow&&
      b.lastColumn===a.lastColumn&&b.digest===a.digest;
    return {tab:b.tab,status:match?'PASS':'FAIL',before:{rows:b.lastRow,columns:b.lastColumn,digest:b.digest},
      after:a?{rows:a.lastRow,columns:a.lastColumn,digest:a.digest}:null};
  });
  return {ok:comparisons.every(x=>x.status==='PASS'),comparisons};
}
function p03QaAnswers_(q) {
  const a=q.parameters.a,b=q.parameters.b,ans=String(q.answer).padStart(2,'0');
  if(q.type==='vertical')return {carry:String((a%10+b%10)>=10?1:0),tens:ans[0],ones:ans[1]};
  if(q.type==='word')return {n1:String(a),op:'+',n2:String(b),sum:String(q.answer),answer:String(q.answer)};
  return {answer:String(q.answer)};
}
/**
 * Run manually ONLY from a bound TEST Apps Script project (not MAIN or production).
 * Optional extra gate is ScriptProperties P03_QA_TEST_APPROVED exactly 'YES'.
 * Property is read only — this function cannot enable itself.
 */
function kiemTraP03KhongGhiDuLieu() {
  const props=PropertiesService.getScriptProperties();
  if(props.getProperty('P03_QA_TEST_APPROVED')!=='YES')
    throw Error('P03_TEST_NOT_APPROVED: chi chay trong Apps Script TEST da duoc xac nhan');
  const wb=moBangDuAn_();
  const before=p03QaSnapshot_(wb),cases=[];
  let failure=null,pack=null;
  try {
    pack=b20DocPackThu_();
    if(!pack||!Array.isArray(pack.sessions)||pack.sessions.length!==6||
       !Array.isArray(pack.questions)||pack.questions.length!==30)
      throw Error('P03_BASELINE_INVALID: expected 30 questions in 6 sessions');
    pack.sessions.forEach(s=>{
      const correctAnswers={},wrongAnswers={};
      s.question_ids.forEach(id=>{
        const q=pack.questions.find(q=>q.question_id===id);
        if(!q)throw Error('P03_MISSING_QUESTION:'+id);
        correctAnswers[id]=p03QaAnswers_(q);
        wrongAnswers[id]={answer:'-999'};
      });
      const good=chamLuotToan20BienThe({sessionId:s.session_id,answers:correctAnswers});
      const bad=chamLuotToan20BienThe({sessionId:s.session_id,answers:wrongAnswers});
      const passed=good.correct===s.question_ids.length&&bad.correct===0&&
        good.recorded===false&&bad.recorded===false&&good.starsAwarded===0&&bad.starsAwarded===0;
      cases.push({sessionId:s.session_id,status:passed?'PASS':'FAIL',
        expected:s.question_ids.length,correct:good.correct,wrongCorrect:bad.correct,
        noWrites:good.recorded===false&&bad.recorded===false,
        noStars:good.starsAwarded===0&&bad.starsAwarded===0});
      if(!passed)throw Error('P03_GRADE_FAIL:'+s.session_id);
    });
  } catch(err){failure=String(err&&err.message||err);}
  // Always take the post-snapshot even if an internal check failed.
  const after=p03QaSnapshot_(wb),audit=p03QaCompare_(before,after);
  const report={version:'P0.3-no-write-v1',lessonId:pack&&pack.lesson&&pack.lesson.id||'toan_b20',
    status:!failure&&audit.ok&&cases.length===6?'PASS':'FAIL',
    sessions:cases,tableSnapshots:audit.comparisons,
    failure:failure||(!audit.ok?'P03_SNAPSHOT_CHANGED':null),
    note:'Sheet changes from concurrent external actors also result in FAIL; attribution requires investigation.'};
  console.log(JSON.stringify(report)); // metadata and SHA-256 only
  if(report.status!=='PASS')throw Error('P03_QA_FAIL: see redacted metadata report');
  return report;
}
