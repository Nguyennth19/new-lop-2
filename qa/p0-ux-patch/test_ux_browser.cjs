/* Actual Chromium UI interactions, synthetic public-only B20 fixture, NOT real GAS. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');const root=path.resolve(__dirname,'../..');
const src=n=>fs.readFileSync(path.join(root,n),'utf8');
const script=n=>'<script>'+src(n).replace(/<\/script/gi,'<\\/script')+'</script>';
const css=src('20_CSS_KhongGianHocToan.html')+'\n'+src('62_CSS_Geometry.html');
const title=(id,type,level,section,extra={})=>Object.assign({
  id,type,valid:true,level,sectionId:section,order:1,label:id,theme:'blue',
  prompt:'28 con gà và 17 con gà. Có tất cả bao nhiêu con?',unit:'con',
  summary:'Gà mái: 28 con | Gà trống: 17 con | Tất cả: ... con?',
  n1:28,n2:45,op:'+',svg:''},extra);
const sections=[
 {id:'toan_b20_lv1_ex1',levelId:'l1',name:'Đặt tính rồi tính',type:'vertical'},
 {id:'toan_b20_lv1_ex2',levelId:'l1',name:'Tính nhẩm',type:'mental'},
 {id:'toan_b20_lv1_ex3',levelId:'l1',name:'Bài toán lời văn',type:'word_problem'},
 {id:'toan_b20_lv2_problems',levelId:'l2',name:'Luyện tập',type:'word_problem'},
 {id:'toan_b20_lv3_ex1',levelId:'l3',name:'Tính theo cột dọc',type:'vertical'},
 {id:'toan_b20_lv3_ex2',levelId:'l3',name:'Tìm số',type:'missing_digit'},
 {id:'toan_b20_lv3_ex3',levelId:'l3',name:'Tìm số ở hàng chục',type:'missing_digit'},
 {id:'toan_b20_lv3_ex4',levelId:'l3',name:'Tìm số hỗn hợp',type:'missing_digit'}];
const questions=[
 title('v1','vertical','LV1','toan_b20_lv1_ex1',{n1:36,n2:27}),
 ...['G1','G2','G3'].flatMap((group,i)=>Array.from({length:2},(_,j)=>title('m'+i+j,'mental','LV1','toan_b20_lv1_ex2',{group,n1:26+i,n2:4+j}))),
 title('w1','word_problem','LV1','toan_b20_lv1_ex3'),
 title('w2','word_problem','LV2','toan_b20_lv2_problems'),
 title('v3','vertical','LV3','toan_b20_lv3_ex1',{n1:28,n2:45}),
 ...[2,3,4].flatMap(n=>Array.from({length:4},(_,j)=>title('p'+n+j,'missing_digit','LV3','toan_b20_lv3_ex'+n,{
  puzzle:[[3,{blank:true}],[2,7],[6,3]],summary:''
 })))
];
const data={lesson:{id:'toan_b20',title:'B20'},securityContract:'G3A_PUBLIC_ALLOWLIST_V1',
 levels:[{id:'l1',level:'LV1'},{id:'l2',level:'LV2'},{id:'l3',level:'LV3'}],sections,questions};
function doc(){
 const injected='const SYNTH='+JSON.stringify(data)+';\n'+
 "function muiIcon(){return ''};function navigate(){};"+
 "const thoatHtmlToan=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));"+
 "const BO_NHO_BAI_HOC={fetch(id){if(id!=='toan_b20')throw Error('bad cache key');return Promise.resolve(SYNTH)}};"+
 "window.google={script:{run:{withSuccessHandler(cb){return {withFailureHandler(){return {g3aTaoPhienChamB20Test(){Promise.resolve().then(()=>cb({ok:true,token:'a'.repeat(32)}))},g3aChamBaiToan20Test(req){"+
 "const qs=chonCauHoiTheoNhom(SYNTH).filter(q=>q.level===req.level);"+
 "const rows=qs.map(q=>({id:q.id,status:q.id==='v1'?'wrong':'empty'}));"+
 "Promise.resolve().then(()=>cb({ok:true,awarded:false,level:req.level,total:qs.length,correct:0,answered:1,perQuestion:rows,"+
 "cellFeedback:{v1:{ones:'correct',tens:'wrong',carry:'correct'}}}))}}}}}}}};";
 return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<style>'+css+'</style></head><body><div id="app"></div><script>'+injected+'</script>'+
 script('23_ChonCauHoiToan.html')+script('41_HienThiCauHoiToan.html')+
 script('19_KhongGianHocToan.html')+'</body></html>';
}
async function run(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});let pass=0;
 const evidence={scope:'P0_TEST_NEW_UX_REAL_CHROMIUM_SYNTHETIC',viewports:[],studentWrites:0,serverKeyExposed:false,
 deployedGASVerified:false,reviewerSigned:false};
 try{
  for(const [label,width,height] of [['desktop',1600,900],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setContent(doc(),{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>window.moBaiToanSheet(0));
   await page.locator('#mathFullScreen .ml-mental-group').first().waitFor();
   assert.equal(await page.locator('#mathFullScreen .ml-mental-group').count(),3);pass++;
   assert.equal(await page.locator('#mathFullScreen .ml-mental-row [data-ml-speak-question]').count(),0);pass++;
   const rects=await page.locator('#mathFullScreen .ml-mental-group').evaluateAll(nodes=>nodes.map(x=>({y:x.getBoundingClientRect().y,width:x.getBoundingClientRect().width})));
   if(label==='desktop')assert(rects.every(r=>Math.abs(r.y-rects[0].y)<3),'3 mental groups must share one desktop row: '+JSON.stringify(rects));
   else assert(rects.every(r=>r.width>150),'mobile groups are too narrow');
   pass++;
   assert.equal(await page.locator('#mathFullScreen .kl-d2-practice').count(),0);pass++;
   assert.equal(await page.locator('#mathFullScreen .ml-word-head [data-ml-speak-question]').count(),1);pass++;
   assert(await page.locator('#mathFullScreen .ml-word-summary .ml-summary-number').count()>=2);pass++;
   const v=page.locator('#mathFullScreen [data-ml-q-card="v1"]');
   await v.locator('[data-ml-field$=":ones"]').fill('3');
   await v.locator('[data-ml-field$=":tens"]').fill('0');
   await v.locator('[data-ml-field$=":carry"]').fill('1');
   await page.locator('[data-ml-submit]').click();
   await v.locator('[data-ml-field$=":ones"].ml-right').waitFor();pass++;
   assert.equal(await v.locator('[data-ml-field$=":tens"].ml-wrong').count(),1);pass++;
   assert.equal(await v.locator('.ml-correct').count(),0);
   assert.equal(await v.evaluate(e=>e.classList.contains('ml-correct')),false);pass++;
   await v.locator('[data-ml-field$=":ones"]').fill('4');
   assert.equal(await v.locator('.ml-right').count(),0);pass++;
   await page.locator('[data-ml-view="LV2"]').click();
   assert.equal(await page.locator('#mathFullScreen .ml-word-head [data-ml-speak-question]').count(),1);pass++;
   await page.locator('[data-ml-view="LV3"]').click();
   assert.equal(await page.locator('#ml-section-toan_b20_lv3_ex4 [data-ml-q-card]').count(),3);pass++;
   for(const n of [2,3,4]){
    const sub=page.locator('#ml-section-toan_b20_lv3_ex'+n);
    assert(await sub.locator('[data-ml-scratch$=":carry"]').count()>=3);
    assert.equal(await sub.locator('[data-ml-q][data-ml-scratch]').count(),0);
   }
   pass++;
   const scratch=page.locator('#ml-section-toan_b20_lv3_ex2 [data-ml-scratch]').first();
   await scratch.focus();
   await page.locator('[data-ml-key="1"]').click();
   assert.equal(await scratch.inputValue(),'1');pass++;
   await page.screenshot({path:path.join(__dirname,'ux-'+label+'.png'),fullPage:false});
   assert.deepEqual(errors,[]);pass++;
   evidence.viewports.push({label,mentalGroups:3,desktopSingleRow:label==='desktop'?true:null,
    removedDuplicatePractice:true,wordTts:true,numberSummary:true,lv3Combined:3,
    scratchInput:true,fieldVerdictsServerMock:true,jsErrors:0});
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:1260,height:760}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>'+css+
   '</style></head><body><div id="tg"></div>'+script('53_Geometry_Core.html')+
   script('60_Geometry_Fixtures.html')+script('54_Tangram_V12.html')+
   '<script>const cp=KLGeometryTangramV11.compile(KLGeometryFixturesV11.tangram);window.tangram=G76B5ATangramPlacement.mount(document.getElementById("tg"),cp.plan);</script>'+
   '</body></html>');
  assert.equal(await page.locator('.g74-tangram-tool').filter({hasText:'Ghép vào mẫu'}).count(),0);pass++;
  const reset=page.locator('[data-tangram-reset]');
  assert.equal(await reset.count(),1);assert(await reset.isEnabled());pass++;
  await page.locator('.g74-tangram-piece').first().click();
  await page.locator('.g74-tangram-target-button').first().click();
  let placed=await page.evaluate(()=>Object.values(window.tangram.snapshot().pieces).filter(x=>x.placedTargetId).length);
  assert.equal(placed,1);pass++;
  await reset.click();
  placed=await page.evaluate(()=>Object.values(window.tangram.snapshot().pieces).filter(x=>x.placedTargetId).length);
  assert.equal(placed,0);assert(await reset.isEnabled());pass++;
  assert.deepEqual(errors,[]);pass++;
  evidence.tangram={autoFitButton:false,resetEnabledWhenNoSelection:true,resetsAllPlaced:true,jsErrors:0};
  await page.screenshot({path:path.join(__dirname,'ux-tangram.png'),fullPage:false});
  await page.close();
 }finally{await browser.close();}
 evidence.checks=pass;evidence.passed=pass;evidence.failed=0;
 fs.writeFileSync(path.join(__dirname,'UX_BROWSER_RESULTS.json'),JSON.stringify(evidence,null,2)+'\n');
 console.log('P0 TEST NEW browser UX:',pass+' checks PASS',JSON.stringify(evidence.viewports));
}
run().catch(e=>{console.error('P0 TEST NEW browser UX FAIL',e.stack||e.message);process.exitCode=1;});
