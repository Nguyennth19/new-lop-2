'use strict';
/* Offline universal LAB builder. Pinned source modules unchanged, no GAS. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {makePack}=require('./fixture-packs.cjs');
const root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'dist');
const base='1b69e277f8de6cb156f46a1d85af33bdad70c0ef';
const modules=[
 '44_G75_NormalizerToanV2','47_D2V12_Core','48_D2V12_View','53_Geometry_Core',
 '54_Tangram_V12','55_Pictograph_Core','56_Pictograph_View','59_Visual_Public_Assets',
 '65_D1_Type1','66_D3_Core','67_D3_View','68_D4_Core','69_D4_View','70_D5_View',
 '71_D6_Core','72_D6_View','73_D7_Core','74_D7_View','75_D8_Core','76_D8_View',
 '77_D8A_Core','78_D8A_View','79_D8B_View','80_D10_Core','81_D10_Adapter',
 '85_Fluent_Asset_46','87_Characters_Drive_30','88_Visual_Semantic_Router'
];
const styles=['50_CSS_D2V12','58_CSS_Visual_Lab','62_CSS_Geometry','63_CSS_Pictograph',
 '82_CSS_OrchestratorModules','84_CSS_Orchestrator','86_CSS_Fluent','43_CSS_ThanhPhanBaiToan'];
function contents(file){
 const code=fs.readFileSync(path.join(root,file),'utf8');
 const original=cp.execFileSync('git',['show',base+':'+file],{encoding:'utf8',maxBuffer:30000000});
 if(code!==original)throw Error('Source integrity drift vs frozen be-hoc: '+file);
 return code;
}
const escapeScript=t=>t.replace(/<\/script/gi,'<\\/script');
const provenance={status:'OFFLINE_LAB_NO_GAS',base,modules:{},styles:{}};
let scripts='';
for(const name of modules){
 const file=name+'.html',code=contents(file);
 provenance.modules[file]=crypto.createHash('sha256').update(code).digest('hex');
 scripts+='<script>\n'+escapeScript(code)+'\n</script>\n';
}
let css='';
for(const name of styles){
 const file=name+'.html',code=contents(file);
 provenance.styles[file]=crypto.createHash('sha256').update(code).digest('hex');
 css+='\n/* '+file+' */\n'+code;
}
const packA=makePack('A'),packB=makePack('B');
const ownCSS=[
':root{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#173354;background:#f5f8fc}',
'*{box-sizing:border-box}body{margin:0}button,select,input{font:inherit}button{cursor:pointer}',
'.ul-app{min-height:100vh;max-width:1480px;margin:auto;padding:20px}',
'.ul-head{background:#fff;border:1px solid #dbe5f5;border-radius:20px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 5px 25px #1733540a}',
'.ul-head h1{font-size:1.28rem;margin:0 0 5px}.ul-head p{margin:0;color:#5a6d85;font-size:.89rem}',
'.ul-tag{font-size:.75rem;background:#f9eacd;color:#744f13;border-radius:20px;padding:7px 12px;font-weight:800}',
'.ul-main{display:grid;grid-template-columns:245px minmax(0,1fr);gap:16px;margin-top:16px}',
'.ul-side,.ul-work{background:#fff;border:1px solid #dbe5f5;border-radius:18px;padding:16px;min-width:0}',
'.ul-side h2{font-size:.97rem;margin:4px 0 12px}',
'.ul-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
'.ul-controls label{display:grid;gap:4px;font-size:.81rem;color:#465f7b;font-weight:650}',
'.ul-controls select,.ul-controls input{padding:9px;border:1px solid #cad9ea;border-radius:9px;min-width:0;width:100%;background:white}',
'.ul-questions{display:grid;gap:6px;margin:14px 0}',
'.ul-question{border:1px solid #e0e9f6;background:#f8fafd;color:#18446d;padding:10px;text-align:left;border-radius:9px;font-size:.84rem}',
'.ul-question:hover,.ul-question.active{border-color:#407fda;background:#e8f3ff;color:#134e91;font-weight:750}',
'.ul-work h2{margin:0 0 8px;font-size:1.15rem}',
'.ul-status{background:#eef7ff;border:1px solid #d5eaff;color:#28547d;border-radius:9px;padding:10px 12px;font-size:.83rem;margin-bottom:14px}',
'.ul-status[data-kind=error]{background:#fff0ef;border-color:#ffd3d0;color:#a72e24}',
'#ulStage{min-height:260px;max-width:100%;overflow:hidden}#ulStage img,#ulStage svg{max-width:100%}',
'.ul-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:14px 0}',
'.ul-actions button{background:#155cab;border:0;border-radius:9px;color:#fff;padding:10px 14px;font-weight:700}',
'.ul-actions button:disabled{background:#a9b8c9;cursor:not-allowed}',
'.ul-muted{color:#65778f;font-size:.8rem}.ul-foot{margin:15px 0;color:#647894;font-size:.79rem}',
'.ul-word-field{display:inline-flex;gap:6px;align-items:center;padding:8px;flex-wrap:wrap}',
'.ul-word-field input{border:1px solid #b2c9e8;border-radius:6px;padding:7px;width:90px}',
'.ml-word-card.ml-word-structured{padding:18px;border:1px solid #d5e4f7;border-radius:12px}',
'@media(max-width:750px){.ul-app{padding:10px}.ul-main{grid-template-columns:1fr}.ul-controls{grid-template-columns:repeat(2,minmax(0,1fr))}.ul-side{padding:12px}.ul-questions{grid-template-columns:repeat(2,minmax(0,1fr))}.ul-question{font-size:.78rem}.ul-head{padding:14px}}'
].join('\n');
const boot='window.__ULTLAB_PACKS__='+JSON.stringify({A:packA,B:packB}).replace(/</g,'\\u003c')+';\n'+
 'window.__ULTLAB_TRUSTED_ENDPOINT__=location.protocol==="http:"&&location.hostname==="127.0.0.1"?"/api/lab-grade":null;';
const htmlParts=[
'<!doctype html><html lang="vi"><head><meta charset="utf-8">',
'<meta name="viewport" content="width=device-width, initial-scale=1">',
'<title>LOP2 – Universal Learning Template V1 · Independent LAB</title>',
'<style>',css,'\n',ownCSS,'</style></head><body>',
'<main id="mathFullScreen" class="ul-app">',
'<header class="ul-head"><div><h1>LOP2 – UNIVERSAL LEARNING TEMPLATE V1</h1>',
'<p>Toán 2 · 10 dạng / 12 đường dựng · Thay bộ dữ liệu không sửa renderer</p></div>',
'<strong class="ul-tag">TEST LAB · Không phát hành</strong></header>',
'<div class="ul-main"><aside class="ul-side" aria-label="Bảng điều khiển LAB">',
'<h2>Điều phối dữ liệu</h2><div class="ul-controls">',
'<label>Bộ dữ liệu<select id="ulPack"><option value="A">Bộ A</option><option value="B">Bộ B</option></select></label>',
'<label>Cấp độ<select id="ulLevel"><option value="ALL">Tất cả</option><option value="LV1">LV1</option>',
'<option value="LV2">LV2</option><option value="LV3">LV3</option></select></label>',
'<label style="grid-column:1/-1">Nạp JSON riêng (tối đa 1 MB)',
'<input id="ulJson" type="file" accept=".json,application/json"></label>',
'</div><h2>Danh mục 12 route</h2><div class="ul-questions" id="ulQuestions"></div>',
'<p class="ul-muted" id="ulCurrent" aria-live="polite">Chưa có dữ liệu</p></aside>',
'<section class="ul-work"><h2 id="ulTitle">Chưa chọn dạng bài</h2>',
'<p class="ul-status" id="ulStatus" aria-live="polite">Đang xác minh các module...</p>',
'<div id="ulStage" aria-label="Renderer tương tác"></div>',
'<div class="ul-actions"><button type="button" id="ulSpeak">🔊 Nghe đề</button>',
'<button type="button" id="ulGrade" disabled>Chấm thử qua máy chủ LAB</button></div>',
'<p class="ul-muted">Mọi thao tác ở LAB chỉ là bản nháp. Không ghi điểm, sao hoặc tiến độ học sinh.',
' Renderer chỉ nhận dữ liệu công khai và không có khóa đáp án.</p></section></div>',
'<footer class="ul-foot">Môi trường độc lập – dữ liệu mẫu tổng hợp, không có bài SGK được duyệt.',
' Tái sử dụng nguyên byte mã renderer chuẩn từ be-hoc ',base.slice(0,10),'.</footer>',
'</main>',scripts,'<script>\n',boot,'\n</script>',
'<script>\n',escapeScript(fs.readFileSync(path.join(__dirname,'lab-runtime.js'),'utf8')),
'\n</script></body></html>'
];
fs.mkdirSync(out,{recursive:true});
const html=htmlParts.join('');
fs.writeFileSync(path.join(out,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'),html);
fs.writeFileSync(path.join(out,'LAB_MATH_A.json'),JSON.stringify(packA,null,2)+'\n');
fs.writeFileSync(path.join(out,'LAB_MATH_B.json'),JSON.stringify(packB,null,2)+'\n');
fs.writeFileSync(path.join(out,'SOURCE_PROVENANCE.json'),JSON.stringify(provenance,null,2)+'\n');
console.log('ULT_V1_BUILD_SOURCE_LOCK_PASS',modules.length,'modules',styles.length,'css',packA.questions.length,
 'routes',Buffer.byteLength(html),'bytes');
