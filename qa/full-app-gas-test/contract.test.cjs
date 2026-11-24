'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const read=f=>fs.readFileSync(f,'utf8');let opens=0,mode='good',props={LOP2_ENVIRONMENT:'GAS_TEST'};
const ctx={console,Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,s)=>Array.from(crypto.createHash('sha256').update(s).digest()),formatDate:()=> '2026-11-24'},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]})},Sheets:{Spreadsheets:{get:(id,options)=>{opens++;assert.equal(id,props.FULL_APP_TEST_SHEET_ID);return response(id,options)}}}};
vm.createContext(ctx);for(const f of ['CauHinh.gs','KhoBaiHoc.gs','FullAppTestMayChu.gs','MayChu.gs','P13_C2_CauHinhTEST.gs'])vm.runInContext(read(f),ctx,{filename:f});
const baseline=vm.runInContext('FULL_APP_TEST_EXPECTED_',ctx),names=Object.keys(baseline);
const response=(id,options)=>{
 const propsFor=name=>({title:name,sheetType:'GRID',gridProperties:{rowCount:mode==='grid'?51:50,columnCount:baseline[name][0].length}});
 const sheets=(mode==='tabs'?names.slice(1):names).map(name=>{
  const s={properties:propsFor(name)};
  if(options.ranges){assert.deepEqual(Array.from(options.ranges),names.map(n=>"'"+n+"'!A1:"+(baseline[n][0].length===27?'AA':String.fromCharCode(64+baseline[n][0].length))+'50'));
   s.data=[{rowData:Array.from({length:50},(_,i)=>({values:Array.from({length:baseline[name][0].length},(_,j)=>{
    const v=baseline[name][i]?.[j]??'',cell={userEnteredFormat:{numberFormat:{type:'TEXT',pattern:'@'}}};
    if(v!==''){cell.userEnteredValue={stringValue:v};cell.formattedValue=v;}
    if(name==='04_Cau_hoi'&&i===1&&j===7){
     if(mode==='drift')cell.formattedValue='tampered';
     if(mode==='formula')cell.userEnteredValue={formulaValue:'=1'};
     if(mode==='format')cell.userEnteredFormat.numberFormat={type:'NUMBER',pattern:'0'};
     if(mode==='numeric')cell.userEnteredValue={numberValue:1};
    }
    return cell;
   })}))}];if(mode==='truncated')s.data[0].rowData.pop();
  }
  return s;
 });
 return {spreadsheetId:mode==='id'?'different':id,sheets};
};
let n=0;function check(f){f();n++}
check(()=>assert.throws(()=>ctx.layBaiToan20(),/CONFIG_DENIED/));check(()=>assert.equal(opens,0));
props.FULL_APP_TEST_SHEET_ID='wrong-id';check(()=>assert.throws(()=>ctx.layBaiToan20(),/CONFIG_DENIED/));check(()=>assert.equal(opens,0));
check(()=>assert.equal(ctx.fullAppHash_('abc'),crypto.createHash('sha256').update('abc').digest('hex')));
// Mock the correct digest for a synthetic ID; actual provider identity remains unverified.
ctx.Utilities.computeDigest=()=>Array.from(Buffer.from(vm.runInContext('FULL_APP_TEST_PIN_',ctx),'hex'));props.FULL_APP_TEST_SHEET_ID='synthetic-fixture-id';
props.LOP2_ENVIRONMENT='PRODUCTION';check(()=>assert.throws(()=>ctx.layBaiToan20(),/CONFIG_DENIED/));check(()=>assert.equal(opens,0));props.LOP2_ENVIRONMENT='GAS_TEST';
const pack=ctx.layBaiToan20();check(()=>assert.equal(pack.questions.length,9));check(()=>assert(pack.questions.every(q=>q.valid&&q.id.startsWith('toan_b20_TEST_'))));check(()=>assert.equal(pack.levels.length,3));check(()=>assert.equal(pack.sections.length,9));check(()=>assert(pack.questions.every(q=>Number(q.answer)===Number(q.n1)+Number(q.n2))));check(()=>assert.equal(pack.lesson.rendererPolicies.length,0));
for(const m of ['drift','formula','format','numeric']){mode=m;check(()=>assert.throws(()=>ctx.layBaiToan20(),/BASELINE_DENIED/));}mode='tabs';check(()=>assert.throws(()=>ctx.layBaiToan20(),/TAB_DENIED/));mode='grid';check(()=>assert.throws(()=>ctx.layBaiToan20(),/GRID_DENIED/));mode='id';check(()=>assert.throws(()=>ctx.layBaiToan20(),/ID_DENIED/));mode='truncated';check(()=>assert.throws(()=>ctx.layBaiToan20(),/GRID_DATA_DENIED/));mode='good';check(()=>assert.equal(ctx.kiemTraFullAppTest().questions,9));check(()=>assert.equal(ctx.kiemTraFullAppTest().writes,'DENY'));
for(const f of ['ghiNhanKetQuaToan20','d2ChamTinCayTest','phuHuynhTrangThai'])check(()=>assert.throws(()=>ctx[f](),/FULL APP TEST/));
check(()=>assert.equal(ctx.layTongQuanThanhTich().earned,0));check(()=>assert.equal(ctx.layTienDoHocTap().attemptCount,0));
check(()=>assert.throws(()=>ctx.napThanhPhan_('CauHinh'),/INCLUDE_DENIED/));
check(()=>assert.deepEqual(JSON.parse(read('appsscript.json')).oauthScopes,['https://www.googleapis.com/auth/spreadsheets.readonly']));
check(()=>assert.deepEqual(JSON.parse(read('appsscript.json')).dependencies.enabledAdvancedServices,[{userSymbol:'Sheets',serviceId:'sheets',version:'v4'}]));
check(()=>assert(!read('CauHinh.gs').includes('SpreadsheetApp.openById')));
const gs=fs.readdirSync('.').filter(f=>f.endsWith('.gs')).sort();check(()=>assert.deepEqual(gs,['CauHinh.gs','FullAppTestMayChu.gs','KhoBaiHoc.gs','MayChu.gs','P13_C2_CauHinhTEST.gs'].sort()));
check(()=>assert(!gs.some(f=>/\b(?:appendRow|setValues|setValue|insertSheet|deleteRow|DriveApp|UrlFetchApp)\s*\(/.test(read(f)))));
check(()=>assert(!['27_BoNhoBaiHoc.html','33_KetNoiThanhTich.html','38_KhoiTaoDuAn.html'].some(f=>/\b(?:localStorage|sessionStorage)\s*\./.test(read(f)))));
const gui=read('GiaoDien.html');for(const m of gui.matchAll(/napThanhPhan_\('([^']+)'\)/g))check(()=>assert(fs.existsSync(m[1]+'.html')));
check(()=>assert(gui.includes('lop2ReviewOpen')));
console.log('FULL_APP_GAS_TEST_CONTRACT_PASS',n,'checks; VM not live GAS');
