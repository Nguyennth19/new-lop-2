/** Full App TEST only. ID digest checked before any provider access. */
const FULL_APP_TEST_PIN_='eeaebd75e715d5e3f44951a337372f4fbdd4054492aa28b69607d7d86718f721';
const FULL_APP_TEST_EXPECTED_={
 "00_TEST_Config": [
  [
   "key",
   "value"
  ],
  [
   "environment",
   "LOP2_FULL_APP_TEST_SYNTHETIC_ONLY"
  ],
  [
   "contract",
   "FULL_APP_TEST_V1"
  ],
  [
   "writes",
   "DENY"
  ],
  [
   "studentRelease",
   "FALSE"
  ],
  [
   "source",
   "SYNTHETIC_NOT_SGK"
  ]
 ],
 "01_Bai_hoc": [
  [
   "lesson_id",
   "title",
   "subject",
   "series",
   "visual_renderer_policy_json"
  ],
  [
   "toan_b20",
   "Bài 20 – dữ liệu mẫu kiểm thử",
   "Toán",
   "SYNTHETIC_TEST",
   ""
  ]
 ],
 "02_Cap_do": [
  [
   "lesson_id",
   "level_id",
   "level",
   "name"
  ],
  [
   "toan_b20",
   "TEST_LV1",
   "LV1",
   "LV1 – mẫu"
  ],
  [
   "toan_b20",
   "TEST_LV2",
   "LV2",
   "LV2 – mẫu"
  ],
  [
   "toan_b20",
   "TEST_LV3",
   "LV3",
   "LV3 – mẫu"
  ]
 ],
 "03_Nhom_bai": [
  [
   "level_id",
   "section_id",
   "name",
   "question_type"
  ],
  [
   "TEST_LV1",
   "TEST_LV1_mental",
   "Tính nhẩm – TEST",
   "mental"
  ],
  [
   "TEST_LV1",
   "TEST_LV1_vertical",
   "Đặt tính – TEST",
   "vertical"
  ],
  [
   "TEST_LV1",
   "TEST_LV1_word_problem",
   "Toán có lời văn – TEST",
   "word_problem"
  ],
  [
   "TEST_LV2",
   "TEST_LV2_mental",
   "Tính nhẩm – TEST",
   "mental"
  ],
  [
   "TEST_LV2",
   "TEST_LV2_vertical",
   "Đặt tính – TEST",
   "vertical"
  ],
  [
   "TEST_LV2",
   "TEST_LV2_word_problem",
   "Toán có lời văn – TEST",
   "word_problem"
  ],
  [
   "TEST_LV3",
   "TEST_LV3_mental",
   "Tính nhẩm – TEST",
   "mental"
  ],
  [
   "TEST_LV3",
   "TEST_LV3_vertical",
   "Đặt tính – TEST",
   "vertical"
  ],
  [
   "TEST_LV3",
   "TEST_LV3_word_problem",
   "Toán có lời văn – TEST",
   "word_problem"
  ]
 ],
 "04_Cau_hoi": [
  [
   "question_id",
   "lesson_id",
   "level",
   "section_id",
   "order",
   "label",
   "type",
   "prompt",
   "n1",
   "op",
   "n2",
   "answer",
   "unit",
   "group",
   "theme",
   "summary",
   "solution_prompt",
   "svg",
   "puzzle_json",
   "renderer_id",
   "skill_id",
   "visual_intent",
   "asset_id",
   "semantic_label",
   "count_unit",
   "exact_quantity",
   "public_variant_json"
  ],
  [
   "toan_b20_TEST_LV1_mental",
   "toan_b20",
   "LV1",
   "TEST_LV1_mental",
   "1",
   "Câu mẫu 1",
   "mental",
   "26 + 17 = ?",
   "26",
   "+",
   "17",
   "43",
   "",
   "Tính nhẩm",
   "blue",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV1_vertical",
   "toan_b20",
   "LV1",
   "TEST_LV1_vertical",
   "2",
   "Câu mẫu 2",
   "vertical",
   "27 + 17 = ?",
   "27",
   "+",
   "17",
   "44",
   "",
   "",
   "blue",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV1_word_problem",
   "toan_b20",
   "LV1",
   "TEST_LV1_word_problem",
   "3",
   "Câu mẫu 3",
   "word_problem",
   "Có 28 quả táo, thêm 17 quả táo. Có tất cả bao nhiêu quả táo?",
   "28",
   "+",
   "17",
   "45",
   "quả táo",
   "",
   "blue",
   "Có: 28 quả | Thêm: 17 quả | Tất cả: ? quả",
   "Số quả táo có tất cả là:",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV2_mental",
   "toan_b20",
   "LV2",
   "TEST_LV2_mental",
   "4",
   "Câu mẫu 1",
   "mental",
   "28 + 18 = ?",
   "28",
   "+",
   "18",
   "46",
   "",
   "Tính nhẩm",
   "blue",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV2_vertical",
   "toan_b20",
   "LV2",
   "TEST_LV2_vertical",
   "5",
   "Câu mẫu 2",
   "vertical",
   "29 + 18 = ?",
   "29",
   "+",
   "18",
   "47",
   "",
   "",
   "blue",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV2_word_problem",
   "toan_b20",
   "LV2",
   "TEST_LV2_word_problem",
   "6",
   "Câu mẫu 3",
   "word_problem",
   "Có 30 quả táo, thêm 18 quả táo. Có tất cả bao nhiêu quả táo?",
   "30",
   "+",
   "18",
   "48",
   "quả táo",
   "",
   "blue",
   "Có: 30 quả | Thêm: 18 quả | Tất cả: ? quả",
   "Số quả táo có tất cả là:",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV3_mental",
   "toan_b20",
   "LV3",
   "TEST_LV3_mental",
   "7",
   "Câu mẫu 1",
   "mental",
   "30 + 19 = ?",
   "30",
   "+",
   "19",
   "49",
   "",
   "Tính nhẩm",
   "blue",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV3_vertical",
   "toan_b20",
   "LV3",
   "TEST_LV3_vertical",
   "8",
   "Câu mẫu 2",
   "vertical",
   "31 + 19 = ?",
   "31",
   "+",
   "19",
   "50",
   "",
   "",
   "blue",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "toan_b20_TEST_LV3_word_problem",
   "toan_b20",
   "LV3",
   "TEST_LV3_word_problem",
   "9",
   "Câu mẫu 3",
   "word_problem",
   "Có 32 quả táo, thêm 19 quả táo. Có tất cả bao nhiêu quả táo?",
   "32",
   "+",
   "19",
   "51",
   "quả táo",
   "",
   "blue",
   "Có: 32 quả | Thêm: 19 quả | Tất cả: ? quả",
   "Số quả táo có tất cả là:",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ]
 ]
};
function fullAppHash_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
/** Advanced Sheets API v4: spreadsheets.get supports spreadsheets.readonly. */
function fullAppTestShape_(book,id,names){
 if(!book||book.spreadsheetId!==id)throw Error('FULL_APP_TEST_ID_DENIED');
 const tabs=book.sheets||[];
 if(tabs.length!==names.length||tabs.some((s,i)=>s.properties?.title!==names[i]))throw Error('FULL_APP_TEST_TAB_DENIED');
 for(const tab of tabs){
  const p=tab.properties,e=FULL_APP_TEST_EXPECTED_[p.title];
  if(p.gridProperties?.rowCount!==50||p.gridProperties?.columnCount!==e[0].length||p.sheetType!=='GRID')throw Error('FULL_APP_TEST_GRID_DENIED: '+p.title);
 }
 return tabs;
}
function fullAppTestRead_(){
 const p=PropertiesService.getScriptProperties(),id=p.getProperty('FULL_APP_TEST_SHEET_ID');
 if(p.getProperty('LOP2_ENVIRONMENT')!=='GAS_TEST'||!id||fullAppHash_(id)!==FULL_APP_TEST_PIN_)throw Error('FULL_APP_TEST_CONFIG_DENIED: cần đúng ID Sheet TEST, không fallback.');
 if(typeof Sheets==='undefined')throw Error('FULL_APP_TEST_SERVICE_DISABLED: bật Google Sheets API v4 trong Dịch vụ.');
 const names=Object.keys(FULL_APP_TEST_EXPECTED_);
 const shape='spreadsheetId,sheets(properties(title,sheetType,gridProperties(rowCount,columnCount)))';
 // Check dimensions before fetching cells; only fixed, bounded synthetic ranges.
 fullAppTestShape_(Sheets.Spreadsheets.get(id,{fields:shape}),id,names);
 const ranges=names.map(n=>"'"+n+"'!A1:"+(FULL_APP_TEST_EXPECTED_[n][0].length===27?'AA':String.fromCharCode(64+FULL_APP_TEST_EXPECTED_[n][0].length))+'50');
 const fields='spreadsheetId,sheets(properties(title,sheetType,gridProperties(rowCount,columnCount)),data(startRow,startColumn,rowData(values(userEnteredValue,formattedValue,userEnteredFormat(numberFormat)))) )'.replace(/ /g,'');
 const tabs=fullAppTestShape_(Sheets.Spreadsheets.get(id,{ranges,fields}),id,names),result={};
 for(const tab of tabs){
  const name=tab.properties.title,expected=FULL_APP_TEST_EXPECTED_[name],cols=expected[0].length,d=tab.data;
  if(!Array.isArray(d)||d.length!==1||(d[0].startRow||0)!==0||(d[0].startColumn||0)!==0||!Array.isArray(d[0].rowData)||d[0].rowData.length!==50)throw Error('FULL_APP_TEST_GRID_DATA_DENIED: '+name);
  const values=[];
  for(let i=0;i<50;i++){
   const row=d[0].rowData[i]?.values;
   if(!Array.isArray(row)||row.length!==cols)throw Error('FULL_APP_TEST_GRID_DATA_DENIED: '+name);
   values.push(row.map((c,j)=>{
    const want=expected[i]?.[j]??'',raw=c?.userEnteredValue,fmt=c?.userEnteredFormat?.numberFormat;
    if((raw&&(Object.keys(raw).length!==1||typeof raw.stringValue!=='string'))||(raw?.stringValue??'')!==want||(c?.formattedValue??'')!==want||fmt?.type!=='TEXT'||fmt?.pattern!=='@')throw Error('FULL_APP_TEST_BASELINE_DENIED: '+name+' R'+(i+1)+'C'+(j+1));
    return want;
   }));
  }
  result[name]=values.slice(1,expected.length).map(row=>Object.fromEntries(expected[0].map((h,i)=>[h,row[i]])));
 }
 return result;
}
