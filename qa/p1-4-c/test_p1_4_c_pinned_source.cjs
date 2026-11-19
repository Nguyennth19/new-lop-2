'use strict';
// P1.4-C preflight: protects a pinned historical be-hoc source, never deploys.
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const pinned='1b69e277f8de6cb156f46a1d85af33bdad70c0ef';
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim();
assert.equal(git('rev-parse',pinned),pinned,'pinned base commit must exist');
assert.equal(git('merge-base',pinned,'HEAD'),pinned,'CI source must descend from pinned source');
const tested=[
 'GiaoDien.html','19_KhongGianHocToan.html','41_HienThiCauHoiToan.html',
 '43_CSS_ThanhPhanBaiToan.html','KhoBaiHoc.gs','P13_C2_CauHinhTEST.gs',
 '83_Visual_Orchestrator.html','89_Asset_Unified_Resolver_TEST.html',
 '90_C2_Test_Integration_Bridge.html',
 '26_ChamCauHoiToan.html','MayChu.gs','ThanhTichMayChu.gs','appsscript.json'
];
for(const p of tested) {
 const original=git('rev-parse',pinned+':'+p),now=git('hash-object',p);
 assert.equal(now,original,'locked runtime/source drift '+p);
}
const js=fs.readFileSync('P13_C2_CauHinhTEST.gs','utf8');
for(const needle of ["'LOP2_ENVIRONMENT'","'GAS_TEST'","'P13_C2_UNIFIED_RESOLVER'","'ENABLED'","'P13_C2_OWNER_TEST_APPROVAL'","'APPROVED_FOR_GAS_TEST'"])assert(js.includes(needle));
assert(!/setPropert(?:y|ies)\s*\(/.test(js));
const lesson=fs.readFileSync('19_KhongGianHocToan.html','utf8');
assert(!lesson.includes('window.BE_HOC_D2_V12.mountB20(fullData,root,view)'));
assert(!lesson.includes('window.BE_HOC_STRUCTURED_PUBLIC_V2.mountB20(fullData,root,view)'));
const renderer=fs.readFileSync('41_HienThiCauHoiToan.html','utf8');
assert(!renderer.includes('data-ml-speak-question'));
assert(renderer.includes('ml-word-summary-line'));
const lock=JSON.parse(fs.readFileSync('qa/p1-4/P1_4_B_BE_HOC_TECHNICAL_SOURCE_LOCK_20261119.json','utf8'));
assert.equal(lock.liveAcceptance,'PENDING');
assert.equal(lock.productionRelease,'NO_GO');
const manifest=JSON.parse(fs.readFileSync('du-lieu/bai-hoc/toan/v2/manifest.B001-B024.layered.v2.json','utf8'));
assert.equal(manifest.totals.studentPlayable,0);
assert.equal(manifest.totals.publicVariantReady,0);
console.log('P1_4_C_PINNED_SOURCE_AND_FAIL_CLOSED_PASS',JSON.stringify({commit:pinned,sourceFiles:tested.length,live:'NOT_EXECUTED',production:'NO_GO'}));
