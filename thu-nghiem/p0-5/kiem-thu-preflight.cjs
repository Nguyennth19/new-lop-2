#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const content=fs.readFileSync(path.join(__dirname,'PreflightTestKhongGhi.gs'),'utf8');
let passed=0,failed=0;
const DEFAULT='default-production-sheet-id',TEST='qa-isolated-sheet-id';
function run(options={}){
 const reads=[];let opens=0,writes=0;const logs=[];
 const cfg={MA_SHEET_THUOC_TINH:'ID_GOOGLE_SHEET_DU_LIEU',SHEET_MAC_DINH:DEFAULT};
 const vals={P05_EXPECTED_TEST_SHEET_ID:options.approved??TEST,
  ID_GOOGLE_SHEET_DU_LIEU:options.effective??TEST,P03_QA_TEST_APPROVED:options.p03??'NO'};
 const ctx={CAU_HINH_LOP_2:cfg,PropertiesService:{getScriptProperties:()=>({getProperty:k=>vals[k]??null})},
 SpreadsheetApp:{openById:id=>{opens++;assert.equal(id,TEST);return {getSheetByName:name=>{
   reads.push(name);if(options.missingTab===name)return null;
   return {getLastRow:()=>1,getLastColumn:()=>name==='90_Lan_lam_bai'?12:9};
 }}}},
 console:{log:x=>logs.push(String(x))}};
 vm.createContext(ctx);vm.runInContext(content,ctx);
 const out=ctx.kiemTraMoiTruongP05KhongGhi();
 return {out,opens,writes,reads,logs};
}
function test(n,fn){try{fn();passed++;console.log('PASS '+n)}catch(e){failed++;console.error('FAIL '+n+' '+e.message)}}
test('valid isolated QA workbook and P03 locked',()=>{const r=run();assert.equal(r.out.status,'PASS');assert.equal(r.opens,1);assert.equal(r.out.noWrites,true)});
test('default workbook blocks BEFORE opening',()=>{const r=run({effective:DEFAULT});assert.equal(r.out.status,'BLOCKED');assert.equal(r.opens,0)});
test('mismatched approved ID blocks BEFORE opening',()=>{const r=run({approved:'different'});assert.equal(r.out.status,'BLOCKED');assert.equal(r.opens,0)});
test('no approved TEST sheet blocks BEFORE opening',()=>{const r=run({approved:''});assert.equal(r.out.status,'BLOCKED');assert.equal(r.opens,0)});
test('P03 approval still YES blocks BEFORE opening',()=>{const r=run({p03:'YES'});assert.equal(r.out.status,'BLOCKED');assert.equal(r.opens,0)});
test('missing ledger tab blocks',()=>{const r=run({missingTab:'91_So_sao'});assert.equal(r.out.status,'BLOCKED');assert.equal(r.out.testWorkbookVerified,false)});
test('logs never include spreadsheet IDs',()=>{const r=run();assert(!r.logs.join(' ').includes(TEST));assert(!r.logs.join(' ').includes(DEFAULT))});
console.log(JSON.stringify({suite:'P0.5-environment-preflight',passed,failed}));
if(failed)process.exitCode=1;
