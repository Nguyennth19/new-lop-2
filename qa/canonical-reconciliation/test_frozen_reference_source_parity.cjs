'use strict';
// Source-byte parity only — never claim UI/GAS/owner acceptance from this test.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const BASE='1b69e277f8de6cb156f46a1d85af33bdad70c0ef';
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim();
assert.equal(git('merge-base',BASE,'HEAD'),BASE,'audit branch must descend from frozen be-hoc');
const frozen={
 '01_CSS_NenTang.html':'166bab6ce434ce198c14ce9617ae46a24ab68f56',
 '02_CSS_TrangChu.html':'bc432c3d5157500aead3f662b405fb3d0a8894e6',
 '03_CSS_ThanhTich.html':'585c89599dff529394395287aef0cc6cbef0291f',
 '04_CSS_LoTrinh.html':'56cafa2ed86f3d7bfa850ed7aa80d061159a8caa',
 '44_G75_NormalizerToanV2.html':'605a8ed9b335526af82c8870dca4753bd511b913',
 '47_D2V12_Core.html':'16ae440618bcb3cf90706cdad2ccd11cbadc222a',
 '48_D2V12_View.html':'214b615d0c595dfd76695c75e5443cefc36a921d',
 '54_Tangram_V12.html':'2c768bbe3b1f271cbf7a9dcb799994e5995ceb5e',
 '78_D8A_View.html':'865dcf673fdfea61bd731e3d487b49a2669ccae9',
 '80_D10_Core.html':'0e82f85f608a27dfda4c46a0246e05f707114967',
 '81_D10_Adapter.html':'dcbc9a7981aa75b44c9b2035e59f1bc41651003a'
};
// Independently read the ORIGINAL TEST branch Git commits, not just self-declared
// hashes in this audit. GitHub Actions checkout MUST fetch full history.
const independentReferences=[
 ['95d0ed90b15889ff069a82d24198fbc82d6ffe81','qa/g7-4-column-calc-reference-v12/column-v12-core.js','47_D2V12_Core.html'],
 ['95d0ed90b15889ff069a82d24198fbc82d6ffe81','qa/g7-4-column-calc-reference-v12/column-v12-view.js','48_D2V12_View.html'],
 ['b6678bcdde5672f3ac745d05da18c95d3e322063','qa/g7-4-capacity-weight-reference-v12/capacity-weight-v12-view.js','78_D8A_View.html'],
 ['c81d33fd7deb28238ab670d8909af960ae4e0f80','qa/g7-4-word-problem-unification-v11/word-unification-v11-core.js','80_D10_Core.html'],
 ['c81d33fd7deb28238ab670d8909af960ae4e0f80','qa/g7-4-word-problem-unification-v11/word-unification-v11-adapter.js','81_D10_Adapter.html'],
 ['f3653d850864f75c7e3640585364d68f17f1428c','qa/g7-6-b5a/tangram-placement-v12.js','54_Tangram_V12.html']
];
for(const [refSha,referencePath,currentPath] of independentReferences){
 const original=cp.execFileSync('git',['show',refSha+':'+referencePath]);
 const originalBlob=cp.execFileSync('git',['hash-object','--stdin'],{input:original,encoding:'utf8'}).trim();
 assert.equal(originalBlob,git('hash-object',currentPath),
  'Independent TEST reference differs from current be-hoc byte source: '+currentPath);
}
console.log('INDEPENDENT_TEST_ORIGINAL_BLOB_PARITY_PASS',independentReferences.length);
for(const [path,expected] of Object.entries(frozen)){
 assert.equal(git('hash-object',path),expected,'frozen source/reference drift: '+path);
}
const names=git('diff','--name-only',BASE,'HEAD').split('\n').filter(Boolean);
for(const name of names){
 assert.ok(name.startsWith('qa/canonical-reconciliation/')||name==='.github/workflows/canonical-audit-no-deploy.yml',
   'Audit branch modified non-audit file: '+name);
}
for(const path of ['AGENTS.md','tai-lieu/quy-chuan-ai/universal_ai_coding_guidelines-vn-version.md',
 'tai-lieu/quy-chuan-ai/universal_ai_coding_guidelines-eng-version.md']){
 const txt=fs.readFileSync(path,'utf8');
 assert.ok(/Think Before Coding|Tư Duy Trước Khi Code/.test(txt),'policy source missing '+path);
}
const source=fs.readFileSync('KhoBaiHoc.gs','utf8'),grader=fs.readFileSync('26_ChamCauHoiToan.html','utf8');
const securityLegacyExposure=/answer:String\(x\.answer\|\|''\)/.test(source)&&/q\.answer/.test(grader);
const math=fs.readFileSync('19_KhongGianHocToan.html','utf8');
const orchestrator=fs.readFileSync('83_Visual_Orchestrator.html','utf8');
const missingD2Mount=!math.includes('window.BE_HOC_D2_V12.mountB20(fullData,root,view)');
const delegatedD2=orchestrator.includes('D2_DELEGATED_TO_MANUAL_CARRY_HOST');
const output={
 gate:'CANONICAL_REFERENCE_SOURCE_PARITY_ONLY',
 frozenBeHoc:BASE,acceptedReferenceBlobCount:Object.keys(frozen).length,
 results:{sourceShaLocks:'PASS',auditOnlyDiff:'PASS',
  legacyClientGradingExposure:securityLegacyExposure?'BLOCKED':'REQUIRES_FRESH_SECURITY_QA',
  D2ManualHost:missingD2Mount&&delegatedD2?'WIRE_GAP_REVIEW':'REQUIRES_FRESH_INTEGRATION_QA',
  actualGAS:'NOT_TESTED',ownerVisual:'NOT_TESTED',studentRelease:'NO_GO'},
 note:'This test verifies reference-byte preservation and reports gaps, not approval of UI, curriculum or live grading.'
};
console.log(JSON.stringify(output,null,2));
