/* P0 TEST NEW UI/pedagogy contract — synthetic, no private answer keys. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert').strict;
const root=path.resolve(__dirname,'../..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const code={renderer:read('41_HienThiCauHoiToan.html'),controller:read('19_KhongGianHocToan.html'),
  selector:read('23_ChonCauHoiToan.html'),server:read('ThanhTichMayChu.gs'),
  grade:read('G3ATrustedTest.gs'),tangram:read('54_Tangram_V12.html'),
  mentalCss:read('20_CSS_KhongGianHocToan.html'),smoke:read('G3B_BrowserSmoke.html')};
const tests=[];
function check(label,fn){try{fn();tests.push({label,status:'PASS'});}catch(e){tests.push({label,status:'FAIL',detail:e.message.slice(0,230)});}}
const context=vm.createContext({window:{},console,document:{addEventListener(){}},Date,Math,Object,Set,Map});
vm.runInContext(code.renderer,context);
const E=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=(q,key,max)=>'<input data-ml-field="'+E(key)+'" data-ml-q="'+E(q.id)+'" maxlength="'+max+'">';
const baseCard=(q,inside,kind)=>'<article class="'+kind+'" data-ml-q-card="'+E(q.id)+'">'+inside+'</article>';
const view=context.taoHienThiCauToan({E,input,baseCard});
check('Only word problems show question TTS, mental module has none',()=>{
 const m={id:'M',valid:true,n1:23,n2:27,unit:'',n3:5,variantType:'three'};
 assert(!view.mental(m).includes('data-ml-speak-question'));
 const w={id:'W',valid:true,prompt:'Bạn Lan có 28 quả và 17 quả',summary:'28 quả + 17 quả',unit:'quả'};
 assert(view.word(w).includes('data-ml-speak-question="W"'));
 assert(view.word(w).includes('ml-summary-number'));
});
check('Summary emphasizes numbers while escaping HTML from the source',()=>{
 const w={id:'W',valid:true,prompt:'Bài mẫu',summary:'<img src=x onerror=alert(1)> · 28 con + 17 con',unit:'con'};
 const html=view.word(w);
 assert(html.includes('&lt;img'));assert(!html.includes('<img'));
 assert(html.includes('<strong class="ml-summary-number">28</strong>'));
 assert(html.includes('<strong class="ml-summary-number">17</strong>'));
});
check('LV3 sections 2/3/4 carry is a scratch input, never submitted to trusted GAS',()=>{
 for(const section of ['toan_b20_lv3_ex2','toan_b20_lv3_ex3','toan_b20_lv3_ex4']){
  const html=view.puzzle({id:'P',valid:true,level:'LV3',sectionId:section,puzzle:[[1,{blank:true}],[2,3],[4,5]]});
  assert(html.includes('data-ml-scratch="P:carry"'));assert(html.includes('data-ml-field="P:p01"'));
  assert(!/data-ml-q="P"[^>]*data-ml-scratch/.test(html));
 }
 const lv1=view.puzzle({id:'P',valid:true,level:'LV1',sectionId:'toan_b20_lv1_ex1',puzzle:[[1,{blank:true}],[2,3],[4,5]]});
 assert(!lv1.includes('data-ml-scratch'));
});
check('B20 does not mount duplicate D2 practice accordion',()=>{
 assert(!/BE_HOC_D2_V12\.mountB20\s*\(/.test(code.controller));
 assert(!code.controller.includes('g3a_public_toan_b20_v1'));
});
check('Client server smoke all select exactly 3 for LV3 mixed-column section4',()=>{
 for(const t of [code.selector,code.server,code.smoke]){
  assert(t.includes('toan_b20_lv3_ex4:{max:3}'));
  assert(!t.includes('toan_b20_lv3_ex4:{max:4}'));
 }
});
check('Trusted grade has per-cell statuses only on full vertical submission; no answer values returned',()=>{
 assert(code.grade.includes("const cellFeedback={}"));
 assert(code.grade.includes("fields.ones===digits[1]?'correct':'wrong'"));
 assert(code.grade.includes("['ones','tens','carry'].every("));
 assert(code.grade.includes('perQuestion,cellFeedback,awarded:false'));
 assert(!code.controller.includes('q.answer'));
});
check('Client colors fields from response, and whole question only from perQuestion status',()=>{
 assert(code.controller.includes('result.cellFeedback?.[q.id]'));
 assert(code.controller.includes("card.classList.toggle('ml-correct',s==='correct')"));
 assert(code.controller.includes("const partial=q.type==='vertical'&&!allFilled;"));
 assert(code.controller.includes('delete gradingState[el.dataset.mlQ];delete submissions[view];'));
});
check('Scratch fields work with keypad, and are excluded from trusted submission',()=>{
 assert(code.controller.includes("querySelectorAll('#mlContent [data-ml-field],#mlContent [data-ml-scratch]')"));
 assert(code.controller.includes("if(el.dataset.mlField&&el.dataset.mlQ)"));
 assert(code.controller.includes("if(/^(?:ones|tens|carry|answer|n1|n2|op|sum|p[0-7][0-7])$/.test(fieldName))"));
});
check('Responsive 3 mental cards and stronger summary scoped to B20',()=>{
 assert(code.mentalCss.includes('@container (min-width:745px)'));
 assert(code.mentalCss.includes('repeat(3,minmax(0,1fr))'));
 assert(code.mentalCss.includes('#mathFullScreen .ml-summary-number'));
});
check('D5 removes auto-placement and provides always-enabled full reset',()=>{
 assert(!code.tangram.includes('Ghép vào mẫu'));
 assert(!code.tangram.includes('function chooseFit()'));
 assert(code.tangram.includes("['↺ Làm lại',()=>{drag=null;state.clear();change()}]"));
 assert(code.tangram.includes("!b.hasAttribute('data-tangram-reset')"));
});
for(const n of ['41_HienThiCauHoiToan.html','19_KhongGianHocToan.html','54_Tangram_V12.html','G3ATrustedTest.gs'])
 check('JS syntax '+n,()=>new vm.Script(read(n),{filename:n}));
const out={scope:'P0_TEST_NEW_UX_CONTRACT_SYNTHETIC',tests:tests.length,
 passed:tests.filter(x=>x.status==='PASS').length,failed:tests.filter(x=>x.status==='FAIL').length,
 cases:tests,webAppDeployed:false,studentRelease:'NO_GO'};
fs.mkdirSync(__dirname,{recursive:true});fs.writeFileSync(path.join(__dirname,'UX_CONTRACT_RESULTS.json'),JSON.stringify(out,null,2)+'\n');
console.log('P0 UX contract:',out.passed+'/'+out.tests);
if(out.failed){console.error(tests.filter(x=>x.status==='FAIL'));process.exitCode=1;}
