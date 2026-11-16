'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let n=0;const ok=(x,msg)=>{assert.ok(x,msg);n++;},eq=(a,b,msg)=>{assert.deepEqual(a,b,msg);n++;};
const html=fs.readFileSync('GiaoDien.html','utf8'),math=fs.readFileSync('19_KhongGianHocToan.html','utf8');
for(const name of ['53_Geometry_Core','54_Tangram_V12','55_Pictograph_Core','56_Pictograph_View','57_Visual_Lab_Host','58_CSS_Visual_Lab','59_Visual_Public_Assets','60_Geometry_Fixtures','61_Pictograph_Fixtures','62_CSS_Geometry','63_CSS_Pictograph','64_SVG_Math_Public'])
 eq(html.split("napThanhPhan('"+name+"')").length-1,1,'missing or duplicate '+name);
ok(math.includes("data-ml-visual-lab=\"D5\""));ok(math.includes("data-ml-visual-lab=\"D9\""));ok(math.includes("data-ml-visual-lab=\"ASSETS\""));
ok(math.includes("BE_HOC_STRUCTURED_PUBLIC_V2.mountB20(fullData,root,view)"));
const root={};root.window=root;const ctx={window:root,globalThis:root,console,Map,Set};
for(const p of ['53_Geometry_Core.html','54_Tangram_V12.html','55_Pictograph_Core.html','56_Pictograph_View.html','60_Geometry_Fixtures.html','61_Pictograph_Fixtures.html','59_Visual_Public_Assets.html']){
 vm.runInNewContext(fs.readFileSync(p,'utf8'),ctx);
}
eq(root.BE_HOC_ASSETS_288.count,288);
eq(root.BE_HOC_ASSETS_288.search('KL_SH01_001',5).length,1);
eq(root.BE_HOC_ASSETS_288.resolve('KL_SH01_001').ok,true);
eq(root.BE_HOC_ASSETS_288.resolve('KL_SH01_001').binarySourceCommit,'653bfbc73002a188dcea0b714247b84cc28a4fed');
eq(root.BE_HOC_ASSETS_288.resolve('KL_SH01_001').quantityApproved,false);
eq(root.BE_HOC_ASSETS_288.releaseReady,true);
eq(root.BE_HOC_ASSETS_288.verifiedPaths.length,13);
eq(root.BE_HOC_ASSETS_288.verifiedRepoImage('hinh-anh/webp-g5/math_apple_160.webp').ok,true);
eq(root.BE_HOC_ASSETS_288.verifiedRepoImage('hinh-anh/unapproved.webp').ok,false);
const d5=root.KLGeometryTangramV11.compile(root.KLGeometryFixturesV11.tangram);
eq(d5.ok,true);eq(d5.plan.mode,'TANGRAM');
const state=root.KLGeometryTangramV11.session(d5.plan);
eq(state.selectPiece('roof').ok,true);eq(state.rotatePiece('roof',90).ok,true);
eq(state.placePiece('roof','target_roof').ok,true);
const d9=root.KLPictographV11.compile(root.KLPictographFixturesV11.practice);
eq(d9.ok,true);eq(d9.plan.rows.length,3);
const pic=root.KLPictographV11.session(d9.plan);
eq(pic.tap('apple',0).ok,true);eq(pic.snapshot().countedIndices.apple.length,1);
eq(pic.setAnswer('apple_total','6').ok,true);eq(Object.keys(pic.snapshot()).includes('correctAnswer'),false);
const exposed=fs.readFileSync('64_SVG_Math_Public.html','utf8');
ok(!/answerKey|correctAnswer|expectedCarry|expectedAnswer|gradingKey|secretAnswer/.test(exposed));
ok(!/\.appendRow\(|google\.script\.run|localStorage|sessionStorage/.test(fs.readFileSync('57_Visual_Lab_Host.html','utf8')));
ok(fs.readFileSync('54_Tangram_V12.html','utf8').includes('G76B5ATangramPlacement'));
const cg=JSON.parse(fs.readFileSync('qa/be-hoc-visual/manifest.v1.json','utf8'));
eq(cg.gates.C08,'PENDING_PEDAGOGY');eq(cg.gates.C09,'PENDING_E04');eq(cg.assetRuntime.autoEnable288,false);
console.log('BE_HOC_VISUAL_LAB_CORE_CONTRACT_PASS',n,'assertions');
