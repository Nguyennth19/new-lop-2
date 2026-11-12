#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8');
const blob=p=>cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
const tests=[];
function check(label,fn){
 try{fn();tests.push({name:label,status:'PASS'});console.log('PASS',label);}
 catch(e){tests.push({name:label,status:'FAIL',error:String(e)});console.error('FAIL',label,e.message);}
}
check('Exact accepted hotfix word renderer kept (no layout regression)',()=>assert.equal(blob('41_HienThiCauHoiToan.html'),'50501ccc3cb5e7801fd563807e21b76d2a51c8f9'));
check('Exact accepted hotfix math styling and responsive rules kept',()=>assert.equal(blob('43_CSS_ThanhPhanBaiToan.html'),'ce7f279fc9185901d8f638bc87628b9c20bfda65'));
check('Global math CSS stays byte-identical to approved baseline',()=>assert.equal(blob('20_CSS_KhongGianHocToan.html'),'3933b7f1812e08831bb7de90c1bf0f39ab87b073'));
check('Legacy shared image asset hotfix kept exactly',()=>assert.equal(blob('34_HinhAnhDungChung.html'),'f107facad1d2aa5b3020a7b0d033f2084ecc314d'));
check('Approved keyboard, graph paper and input routing remain',()=>{
 const ui=read('19_KhongGianHocToan.html');
 for(const keyword of ['following={ones:\'carry\',carry:\'tens\'}','if(suffix===\'tens\')','advanceMathInput','installSvg();','HINH_ANH_APP.word(q,el)','KLB20AssetPilotV1.mountVisible'])
  assert(ui.includes(keyword),'Missing '+keyword);
});
check('No inline CSS or old pilot render introduced',()=>{
 const ui=read('19_KhongGianHocToan.html');
 assert(!ui.includes('pilotRender('));assert(!ui.includes('style='));
});
check('Desktop/mobile baseline CSS is included before script processing',()=>{
 const shell=read('GiaoDien.html');
 for(const part of ['43_CSS_ThanhPhanBaiToan','20_CSS_KhongGianHocToan','41_HienThiCauHoiToan',
 '44_TaiAnhTheoAssetID','43_CauNoiAssetBienThe','45_AnhMinhHoaB20Pilot','42_AdapterBienTheB20'])
  assert(shell.includes("napThanhPhan('"+part+"')"),'Missing include '+part);
 const css=read('43_CSS_ThanhPhanBaiToan.html');
 assert(css.includes('ml-word-structured'));assert(css.includes('background-size:28px 28px,28px 28px,7px 7px,7px 7px'));
});
check('JSON scene binding from sidecar, not keyword mapping',()=>{
 const adapter=read('42_AdapterBienTheB20.html');
 const client=read('45_AnhMinhHoaB20Pilot.html');
 const backend=read('B20_BienTheMayChu.gs');
 assert(adapter.includes('pack.assetScenes'));assert(client.includes('sidecar.question_scenes'));
 assert(backend.includes('b20DocAssetScenes_()'));
 assert(!client.includes('KL_SH02_010'));assert(!client.includes('KL_SH03_006'));
});
check('Fail-open when JSON loader missing on legacy regression',()=>{
 const b=read('B20_BienTheMayChu.gs');
 assert(b.includes("typeof b20DocAssetScenes_==='function'"));
 assert(b.includes("typeof console.warn==='function'"));
});
check('No grading, no progress or stars written by asset scene reader',()=>{
 const b=read('B20_AssetSceneMayChu.gs');
 assert(!b.includes('SpreadsheetApp'));assert(!b.includes('setValue('));
});
check('Original 30 B20 question data unchanged',()=>{
 const pack=JSON.parse(read('thu-nghiem/bai-20-bien-the/runtime.json'));
 assert.equal(pack.questions.length,30);assert.equal(pack.sessions.length,6);
 assert.equal(new Set(pack.questions.map(q=>q.question_id)).size,30);
});
const fails=tests.filter(x=>x.status==='FAIL');
console.log(JSON.stringify({stage:'G7.4-B.3.1',pass:tests.length-fails.length,fail:fails.length,results:tests},null,2));
process.exitCode=fails.length?1:0;
