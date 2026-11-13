/**
 * P0.5 TEST preflight (manual read-only GAS helper).
 * Isolated file: DO NOT merge into MAIN / production.
 * Run only inside a separate TEST Apps Script project.
 * Requires Script Property P05_EXPECTED_TEST_SHEET_ID = approved QA workbook ID.
 * Does NOT enable QA or modify ScriptProperties, Sheets, progress or stars.
 */
function kiemTraMoiTruongP05KhongGhi() {
  const props=PropertiesService.getScriptProperties();
  const approved=String(props.getProperty('P05_EXPECTED_TEST_SHEET_ID')||'').trim();
  const effective=String(props.getProperty(CAU_HINH_LOP_2.MA_SHEET_THUOC_TINH)||
     CAU_HINH_LOP_2.SHEET_MAC_DINH||'').trim();
  const defaultId=String(CAU_HINH_LOP_2.SHEET_MAC_DINH||'').trim();
  const p03=props.getProperty('P03_QA_TEST_APPROVED');
  const failures=[];
  if(!approved)failures.push('P05_TEST_SHEET_ALLOWLIST_MISSING');
  if(!effective)failures.push('P05_EFFECTIVE_SHEET_MISSING');
  if(effective===defaultId)failures.push('P05_EFFECTIVE_SHEET_IS_DEFAULT');
  if(approved&&effective!==approved)failures.push('P05_TEST_SHEET_MISMATCH');
  // A missing approval property is also safe; only YES is dangerous after P0.3.
  if(p03==='YES')failures.push('P05_P03_GATE_STILL_OPEN');
  // Refuse to open any spreadsheet until the TEST sheet check has passed.
  if(failures.length) {
    const blocked={version:'P0.5-env-preflight-v1',status:'BLOCKED',codes:failures,
      testWorkbookVerified:false,p03Locked:p03!=='YES',noWrites:true};
    console.log(JSON.stringify(blocked));
    return blocked;
  }
  const wb=SpreadsheetApp.openById(effective);
  const required=['90_Lan_lam_bai','91_So_sao'];
  const tabs=required.map(name=>{
    const sh=wb.getSheetByName(name);
    return {tab:name,exists:!!sh,lastRow:sh?sh.getLastRow():null,
      lastColumn:sh?sh.getLastColumn():null};
  });
  if(tabs.some(t=>!t.exists))failures.push('P05_LEDGER_TAB_MISSING');
  const out={version:'P0.5-env-preflight-v1',status:failures.length?'BLOCKED':'PASS',
    codes:failures,environment:'TEST_EXPECTED_SHEET',testWorkbookVerified:!failures.length,
    p03Locked:true,noWrites:true,tabs};
  // Neither spreadsheet ID nor individual cell contents are logged.
  console.log(JSON.stringify(out));
  return out;
}
