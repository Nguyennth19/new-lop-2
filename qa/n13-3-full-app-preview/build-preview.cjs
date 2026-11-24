'use strict';
// Source-only assembly: no deploy, no GAS calls, no real data, no writes to Sheets.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
function compile(on=false){
 let html=read('GiaoDien.html');
 html=html.replace(/<\? if \(p13C2GASTestEnabled_\(\)\) \{ \?>([\s\S]*?)<\? \} \?>/g,(_,s)=>on?s:'');
 html=html.replace(/<\?!= napThanhPhan\('([^']+)'\) \?>/g,(_,n)=>n==='38_KhoiTaoDuAn'?'/* Preview: do not clear browser storage. */':read(n+'.html'));
 assert(!html.includes('<?'),'leftover GAS template');
 // All browser RPC checks and calls explicitly use an isolated, synthetic bridge.
 html=html.replace(/\b(?:window|root|globalThis)\.google\b/g,'window.LOP2_PREVIEW_GOOGLE').replace(/(?<![.\w$])google\b(?=\s*(?:\?\.|\.)\s*script\b)/g,'window.LOP2_PREVIEW_GOOGLE');
 assert(!/\bgoogle\s*(?:\?\.|\.)\s*script\b|\b(?:window|root|globalThis)\.google\b/.test(html),'real RPC escaped isolation');
 const old=read('qa/p1-2-b/P12B_ORIGINAL_VARIANT_PREVIEWS_32.review.v1.json');
 const variants=JSON.parse(old).variants.filter(x=>['MATH_B001','MATH_B002'].includes(x.lessonId)).map(x=>({lessonId:x.lessonId,id:x.variantId,prompt:x.previewEnvelope.display.prompt,choices:x.previewEnvelope.display.visibleChoices}));
 assert.equal(variants.length,16);
 const fixtureScript=read('qa/n13-3-full-app-preview/preview-rpc.js');
 html=html.replace('<body>','<body><div id="lop2PreviewNotice" role="status" style="padding:9px 12px;margin:0 0 12px;background:#fff3cd;color:#503b00;border-radius:8px;text-align:center;font:600 13px system-ui;position:relative;scroll-margin-top:110px">FULL APP TEST · Dữ liệu giả lập · Không lưu điểm/sao thật · Không cấp quyền học sinh <button type="button" id="lop2ReviewOpen">B001/B002 – xem ứng viên</button></div><dialog id="lop2ReviewDialog" style="max-width:min(90vw,680px);max-height:85vh;overflow:auto;border:1px solid #ccc;border-radius:12px;padding:16px"><button type="button" id="lop2ReviewClose">Đóng</button><h2>B001/B002 – 16 ứng viên DEV</h2><p>Chỉ xem trước; không phải dữ liệu SGK đã duyệt, không chấm điểm.</p><div id="lop2ReviewList"></div></dialog><script>window.LOP2_REVIEW_VARIANTS='+JSON.stringify(variants).replace(/</g,'\\u003c')+';\n'+fixtureScript.replace(/<\/script/gi,'<\\/script')+'</script>');
 assert(html.includes('id="lop2PreviewNotice"'));
 // Avoid falsely identifying mock data as real data in the preview copy only.
 html=html.replaceAll('Dữ liệu thực từ Google Sheet','Dữ liệu giả lập FULL APP TEST').replaceAll('Dữ liệu từ Google Sheets','Dữ liệu giả lập FULL APP TEST').replaceAll('Đang nạp bài học từ Google Sheets','Đang nạp bài học giả lập').replaceAll('Số liệu học tập sẽ được tải từ kết quả thực tế','Số liệu học tập giả lập sẽ được tải').replaceAll('Đang tải số liệu thực...','Đang tải số liệu giả lập...');
 return html;
}
if(require.main===module){const out=path.join(ROOT,'qa/n13-3-full-app-preview/output');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'FullApp-TEST.html'),compile(true));fs.writeFileSync(path.join(out,'FullApp-TEST-OFF.html'),compile(false));console.log('FULL_APP_PREVIEW_BUILT: isolated mock only; no deployment');}
module.exports={compile};
