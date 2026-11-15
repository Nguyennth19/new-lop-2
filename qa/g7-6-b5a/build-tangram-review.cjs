'use strict';
/* G7.6-B.5-A: corrected Tangram single-file OFFLINE phone QA from B3 public actual P0.6+E04 samples.
 * Inline the pinned reference JS/CSS. Never fetch or deploy anything.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),sourceDir=path.join(root,'qa/g7-6-b3');
const original=path.join(sourceDir,'Chrome_B3_Producer_Visual_Acceptance_TEST.html');
const source=path.join(sourceDir,'generated/public-samples.json');
const samples=JSON.parse(fs.readFileSync(source,'utf8'));
assert.equal(samples.schemaVersion,'g76b3.chrome-producer-visual-test-public.v1');
assert.equal(samples.cases.length,14);
assert.equal(samples.coverage.p06ComposerCount,8);
assert.equal(samples.releaseReady,false);
assert.equal(samples.gradingEnabled,false);
assert.equal(samples.d10TrustedGrading,false);
const json=JSON.stringify(samples);
for(const key of ['"answerSpec"','"correctOptionValue"','"answerKey"','"gradingKey"','"teacherSolution"','"studentId"'])
 assert.ok(!json.includes(key),'PUBLIC_BROWSER_KEY_FORBIDDEN_'+key);
let html=fs.readFileSync(original,'utf8');
function replaceOnce(from,to,reason){
 const count=html.split(from).length-1;
 if(count!==1)throw Error('B5A_SOURCE_MATCH_DRIFT_'+reason+'_'+count);
 html=html.replace(from,to);
}
replaceOnce(
 '<title>G7.6-B.3 – Actual P0.6 E03 Coverage and Experimental E04 Visual Chrome TEST</title>',
 '<title>G7.6-B.5-A – Tangram chính xác: thử trên thiết bị · TEST</title>',
 'TITLE');
replaceOnce(
 '<h1>G7.6-B.3 – Producer &amp; Visual Acceptance · TEST</h1>',
 '<h1>G7.6-B.5-A – Thử Tangram căn khớp hình · TEST</h1>',
 'HEADING');
replaceOnce(
 'KLGeometryTangramViewV11.mount(slot,tangram[j].nativePlan)',
 'G76B5ATangramPlacement.mount(slot,tangram[j].nativePlan)',
 'TARGET_LABEL_WRAPPER');
replaceOnce(
 'Dữ liệu tạo bằng mã generator mới, native renderer G7.4 V1.1. Chưa phải producer P0.6 E02/E03 và chưa có duyệt SGK.',
 'Nguồn E04 sidecar tạo theo seed; Tangram dùng renderer TEST B5-A đã sửa căn khung. Chưa phải producer P0.6 E02/E03 và chưa có duyệt SGK.',
 'E04_SOURCE_SCOPE');
replaceOnce(
 "const r=await fetch('./generated/public-samples.json',{cache:'no-store'});",
 "const r={ok:true,json:async()=>JSON.parse(document.getElementById('b4-public-data').textContent)};",
 'EXTERNAL_DATA_FETCH');
const sanitize=x=>x.replace(/<\/script/gi,'<\\/script');
function local(relative){
 if(/^(https?:|\/\/|data:)/i.test(relative)||relative.includes('\0'))throw Error('EXTERNAL_RESOURCE_DENIED');
 const file=path.resolve(sourceDir,relative);
 if(!file.startsWith(path.join(root,'qa')+path.sep))throw Error('RESOURCE_PATH_ESCAPE');
 return fs.readFileSync(file,'utf8');
}
let cssCount=0,jsCount=0;
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,href)=>{
 cssCount++;return '<style data-b4-source="'+path.basename(href)+'">\n'+local(href)+'\n</style>';
});
html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,relative)=>{
 jsCount++;return '<script data-b4-module="'+path.basename(relative)+'">\n'+sanitize(local(relative))+'\n</script>';
});
assert.equal(cssCount,4);
assert.equal(jsCount,9);
const labelModule=sanitize(fs.readFileSync(path.join(__dirname,'tangram-placement-v12.js'),'utf8'));
const b5Css=fs.readFileSync(path.join(__dirname,'tangram-placement-v12.css'),'utf8');
const manualModule=sanitize(fs.readFileSync(path.join(root,'qa/g7-6-b4/manual-device-qa.js'),'utf8')
 .replace('g76b4.physical-device-manual-checklist.v1','g76b5a.physical-device-manual-checklist.v1')
 .replace("component:'G7.6-B.4'","component:'G7.6-B.5-A'")
 .replace('G76B4_Manual_Device_Review_NOT_APPROVED.json','G76B5A_Manual_Device_Review_NOT_APPROVED.json'));
const form=fs.readFileSync(path.join(root,'qa/g7-6-b4/manual-device-checklist.fragment.html'),'utf8')
 .replace('</div>\n<label>Ghi chú kiểm tra',[
 '<label><input type="checkbox" data-qa="tangram_exact_snap"> Ghép vào mẫu: đủ 3/3 mảnh trùng đường viền, không bị lệch</label>',
 '<label><input type="checkbox" data-qa="tangram_drag_unplace"> Kéo mảnh bằng ngón tay/chuột rồi thả; trạng thái đang đặt được cập nhật đúng</label>',
 '</div>\n<label>Ghi chú kiểm tra'
 ].join('\n'))
 .replace('Phiếu kiểm thử thực tế · Chưa phê duyệt phát hành','Phiếu kiểm thử Tangram B5-A · Chưa phê duyệt phát hành');
const publicScript='<script type="application/json" id="b4-public-data">'+json.replace(/</g,'\\u003c')+'</script>';
const labelScript='<script data-b5a-geometry-placement="true">\n'+labelModule+'\n</script>';
const manualScript='<script data-b4-manual-device-qa="true">\n'+manualModule+'\n</script>';
replaceOnce('<script>\n(async function(){',
 publicScript+'\n'+labelScript+'\n<script>\n(async function(){','INLINE_BOOTSTRAP');
replaceOnce('</head>','<style data-b5a-geometry-styles="true">\n'+b5Css+'\n</style>\n</head>','B5A_CSS');
replaceOnce('</main>','</main>\n'+form+'\n','MANUAL_DEVICE_FORM');
replaceOnce('</script></body></html>','</script>\n'+manualScript+'\n</body></html>','MANUAL_SCRIPT');
const dir=path.join(__dirname,'generated');
fs.mkdirSync(dir,{recursive:true});
const output=path.join(dir,'G76B5A_Tangram_Geometry_Fix_Standalone_TEST.html');
fs.writeFileSync(output,html,'utf8');
assert.ok(!/<script src=|<link rel="stylesheet"/.test(html),'EXTERNAL_MODULES_REMAIN');
assert.ok(!html.includes("fetch('./generated/public-samples.json'"),'DATA_FETCH_REMAINS');
assert.ok(html.includes("G76B5ATangramPlacement.mount("),'PLACEMENT_GEOMETRY_MODULE_MISSING');
assert.ok(html.includes('id="b4-export"'),'MANUAL_DEVICE_EXPORT_MISSING');
console.log('G76B5A_TANGRAM_OFFLINE_HTML_BUILT',html.length,'bytes,',
 cssCount,'pinned styles,',jsCount,'pinned JS,',
 samples.cases.length,'public producer cases, no fetch/GAS/student writes');
