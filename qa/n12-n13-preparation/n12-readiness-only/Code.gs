/** N12.2 setup-only, standalone editor, read-only. Never combine with Full App or N7. */
const N12_SETUP_RESOURCE_PINS_={
 "P2_TARGET": "8d474c67db9f11041737ab02a29c111bdd1cba52d38973c238b6609a43c9e909",
 "P2_BACKUP": "b9e21293309781732974b663d10c67a1eebf8b06a246007db471c5b1f3caac09",
 "P3_TARGET": "5de7cde03d125eacac04d3e8d7c2de807e8f7ccd85d1baee25d6605db896d6be",
 "P3_BACKUP": "d02f2fec9b6b2cb91daf775c53b0f6b5aa88096dea28ebe589e241677aec7296",
 "P4_TARGET": "e523ab0b2d5e853a2c79433f7387c5341169293e9dac3f3def27547ed6ac467d",
 "P4_BACKUP": "f5226ee3f1b74dabb2cdd445eaaca929f80e477c111263e19b6398373f36605a",
 "P5_RECOVERY": "14ad36225cc1e0022b843b0380c5ce781b6553e74401f2d692747d6a95127483"
};
const N12_SETUP_BASELINE_PINS_={
 "P2": "d39b1f632d93644ffa68b392fb3eb498af1fee2f6172b21bb2978b049f2b08b1",
 "P3": "3feeb901a0bebb40b54efc1270249ce805c06b791cf27997a72f82b001ef6481",
 "P4": "cba5e8bb426e7367febc86f88497991284050496f1d407fd49a4c2948f8c4079",
 "P5": "b8a8f99c4f9cc1183a39c8d6f316f7475f5b999cb4061cd69b959333fe75f934"
};
const N12_SETUP_FORBIDDEN_PROJECT_HASHES_=['a6456fd18718551c76017a478966de7b93539825b114e236580fc3b4240b4e27','ab2997d4e9cd46f5d9dd19c6e0ae70e86ae445db9a933806aa19377c6412595d'];
const N12_SETUP_HEADER_=['event_id','batch_id','actor_ref','action','previous_state','next_state','evidence_sha256','occurred_at'];
function n12SetupHash_(text){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');}
function n12SetupExact_(obj,keys){return obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).sort().join('|')===keys.slice().sort().join('|');}
function n12SetupCheckShape_(book,id){
 const tabs=book?.sheets,p=tabs?.[0]?.properties;
 if(book?.spreadsheetId!==id||tabs?.length!==1||p?.title!=='15_NhatKy_HanhDong'||p.sheetType!=='GRID'||p.gridProperties?.rowCount!==151||p.gridProperties?.columnCount!==8||p.gridProperties?.frozenRowCount!==1)throw Error('N12_SETUP_GRID_DENIED');
 return tabs[0];
}
function n12SetupReadOne_(id){
 const shape='spreadsheetId,sheets(properties(title,sheetType,gridProperties(rowCount,columnCount,frozenRowCount)))';
 n12SetupCheckShape_(Sheets.Spreadsheets.get(id,{fields:shape}),id);
 const fields='spreadsheetId,sheets(properties(title,sheetType,gridProperties(rowCount,columnCount,frozenRowCount)),data(startRow,startColumn,rowData(values(userEnteredValue,formattedValue,userEnteredFormat(numberFormat)))))';
 const tab=n12SetupCheckShape_(Sheets.Spreadsheets.get(id,{ranges:["'15_NhatKy_HanhDong'!A1:H151"],fields}),id);
 const d=tab.data;
 if(d?.length!==1||(d[0].startRow||0)!==0||(d[0].startColumn||0)!==0||d[0].rowData?.length!==151)throw Error('N12_SETUP_GRID_DATA_DENIED');
 for(let i=0;i<151;i++){
  const row=d[0].rowData[i]?.values;if(row?.length!==8)throw Error('N12_SETUP_ROW_DENIED');
  for(let j=0;j<8;j++){
   const c=row[j],want=i===0?N12_SETUP_HEADER_[j]:'',raw=c?.userEnteredValue,fmt=c?.userEnteredFormat?.numberFormat;
   if((raw&&(Object.keys(raw).length!==1||typeof raw.stringValue!=='string'))||(raw?.stringValue??'')!==want||(c?.formattedValue??'')!==want||fmt?.type!=='TEXT'||fmt?.pattern!=='@')throw Error('N12_SETUP_CELL_DRIFT_R'+(i+1)+'C'+(j+1));
  }
 }
 return true;
}
function kiemTraN12Setup(){
 const props=PropertiesService.getScriptProperties().getProperties();
 if(!n12SetupExact_(props,['N12_SETUP_CONFIG'])||typeof props.N12_SETUP_CONFIG!=='string'||props.N12_SETUP_CONFIG.length>4096||!/^[\x20-\x7e]+$/.test(props.N12_SETUP_CONFIG))throw Error('N12_SETUP_PROPERTIES_DENIED');
 const c=JSON.parse(props.N12_SETUP_CONFIG),roles=Object.keys(N12_SETUP_RESOURCE_PINS_);
 if(!n12SetupExact_(c,['environment','projectId','ownerEmail','resources'])||c.environment!=='N12_DISPOSABLE_SYNTHETIC_ONLY'||!/^[A-Za-z0-9_-]{20,120}$/.test(c.projectId||'')||!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(c.ownerEmail||'')||!n12SetupExact_(c.resources,roles))throw Error('N12_SETUP_CONFIG_DENIED');
 if(ScriptApp.getScriptId()!==c.projectId||N12_SETUP_FORBIDDEN_PROJECT_HASHES_.includes(n12SetupHash_(c.projectId))||Session.getEffectiveUser().getEmail()!==c.ownerEmail)throw Error('N12_SETUP_PROJECT_OR_ACTOR_DENIED');
 if(new Set([c.projectId,...Object.values(c.resources)]).size!==8||roles.some(k=>typeof c.resources[k]!=='string'||!/^[A-Za-z0-9_-]{20,120}$/.test(c.resources[k])||n12SetupHash_(c.resources[k])!==N12_SETUP_RESOURCE_PINS_[k]))throw Error('N12_SETUP_RESOURCE_DENIED');
 const digests={};
 for(const key of ['P2','P3','P4','P5']){
  const id=c.resources[key==='P5'?'P5_RECOVERY':key+'_TARGET'];
  const digest=n12SetupHash_(JSON.stringify({schema:'N8_JOURNAL_DISPLAY_SNAPSHOT_V1',sheet:id,tab:'15_NhatKy_HanhDong',columns:N12_SETUP_HEADER_,rows:[]}));
  if(digest!==N12_SETUP_BASELINE_PINS_[key])throw Error('N12_SETUP_DIGEST_DENIED');digests[key]=digest;
 }
 if(typeof Sheets==='undefined')throw Error('N12_SETUP_SHEETS_SERVICE_DISABLED');
 for(const k of roles)n12SetupReadOne_(c.resources[k]);
 // Re-read property inventory to detect concurrent config drift; no property mutation.
 const after=PropertiesService.getScriptProperties().getProperties();
 if(!n12SetupExact_(after,['N12_SETUP_CONFIG'])||after.N12_SETUP_CONFIG!==props.N12_SETUP_CONFIG)throw Error('N12_SETUP_PROPERTY_DRIFT');
 const out={environment:c.environment,projectIdSha256:n12SetupHash_(c.projectId),effectiveOwnerMatches:true,propertyCount:1,grantKeys:0,attemptKeys:0,sheets:7,cells:8456,eventRows:0,baseline:'MATCH',digests,writes:'DENY',grantIssued:false};
 console.log(JSON.stringify(out));return out;
}
