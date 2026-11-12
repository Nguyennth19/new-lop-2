#!/usr/bin/env node
'use strict';
// Offline test: mocks GAS services, never opens Google Sheets or student records.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const script=fs.readFileSync(path.join(__dirname,'QA_Snapshot_NoWrite.gs'),'utf8');
const server=fs.readFileSync(path.join(root,'B20_BienTheMayChu.gs'),'utf8');
const pack=JSON.parse(fs.readFileSync(path.join(root,'thu-nghiem/bai-20-bien-the/runtime.json'),'utf8'));
const tests=[];
function make(options={}){
 let grid={ '90_Lan_lam_bai':[['id','event'],['','']], '91_So_sao':[['id','balance'],['','']]},snapshotReads=0,writes=0;
 const sheet=name=>({
   getMaxRows:()=>2,getMaxColumns:()=>2,getLastRow:()=>2,getLastColumn:()=>2,
   getRange:()=>({getDisplayValues:()=>{
     snapshotReads++;
     if(options.mutate&&snapshotReads===5)grid['90_Lan_lam_bai'][1][0]='external-edit';
     return grid[name].map(row=>row.slice());
   },getFormulas:()=>[['',''],['','']]}),
   setValue:()=>{writes++;throw Error('WRITE_FORBIDDEN')},appendRow:()=>{writes++;throw Error('WRITE_FORBIDDEN')}
 });
 const ctx={console:{log:()=>{}},
   PropertiesService:{getScriptProperties:()=>({getProperty:key=>key==='P03_QA_TEST_APPROVED'?(options.approved===false?'NO':'YES'):null})},
   CacheService:{getScriptCache:()=>({get:()=>null,put:()=>{}})},
   UrlFetchApp:{fetch:()=>({getResponseCode:()=>200,getContentText:()=>JSON.stringify(pack)})},
   Utilities:{DigestAlgorithm:{SHA_256:'SHA_256'},Charset:{UTF_8:'UTF_8'},
    computeDigest:(_,text)=>Array.from(Buffer.from(require('node:crypto').createHash('sha256').update(text).digest()))},
   moBangDuAn_:()=>({getSheetByName:name=>options.missingTab===name?null:sheet(name)})
 };
 vm.createContext(ctx);vm.runInContext(server+'\n'+script,ctx);
 return {exec:()=>ctx.kiemTraP03KhongGhiDuLieu(),writes:()=>writes};
}
function test(name,fn){try{fn();tests.push({name,status:'PASS'});console.log('PASS',name)}catch(e){tests.push({name,status:'FAIL',reason:e.message});console.error('FAIL',name,e.message);process.exitCode=1}}
test('6 sessions, correct/wrong answers, snapshots unchanged',()=>{
 const x=make(),r=x.exec();assert.equal(r.status,'PASS');assert.equal(r.sessions.length,6);
 assert.ok(r.sessions.every(c=>c.status==='PASS'&&c.noWrites&&c.noStars));
 assert.ok(r.tableSnapshots.every(s=>s.status==='PASS'));assert.equal(x.writes(),0);
});
test('unexpected sheet mutation fails closed',()=>{const x=make({mutate:true});assert.throws(()=>x.exec(),/P03_QA_FAIL/);assert.equal(x.writes(),0)});
test('missing sheet fails closed',()=>{const x=make({missingTab:'91_So_sao'});assert.throws(()=>x.exec(),/P03_SHEET_MISSING/);assert.equal(x.writes(),0)});
test('approval gate fails closed',()=>{const x=make({approved:false});assert.throws(()=>x.exec(),/P03_TEST_NOT_APPROVED/);assert.equal(x.writes(),0)});
console.log(JSON.stringify({suite:'P0.3-offline-no-write',passed:tests.filter(t=>t.status==='PASS').length,failed:tests.filter(t=>t.status==='FAIL').length}));
if(process.exitCode)process.exit(process.exitCode);
