'use strict';
/* P1.4 regression gate: approved learner UX, no spreadsheet writes. */
const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const lesson=read('19_KhongGianHocToan.html');
const renderer=read('41_HienThiCauHoiToan.html');
const style=read('43_CSS_ThanhPhanBaiToan.html');
assert.doesNotMatch(lesson,/^\s*if\(window\.BE_HOC_D2_V12\)window\.BE_HOC_D2_V12\.mountB20\(fullData,root,view\);/m,'no auto TEST D2 panel');
assert.doesNotMatch(lesson,/^\s*if\(window\.BE_HOC_STRUCTURED_PUBLIC_V2\)window\.BE_HOC_STRUCTURED_PUBLIC_V2\.mountB20\(fullData,root,view\);/m,'no auto place-value demo');
assert.match(lesson,/BE_HOC_VISUAL_ORCHESTRATOR\.mountLesson/,'approved visual orchestrator preserved');
assert.doesNotMatch(renderer,/data-ml-speak-question|hear\(q\)/,'mental rows do not expose speech buttons');
assert.match(style,/\.ml-word-summary-line\s*\{/,'summary lines styled');
const context={};
vm.runInNewContext(renderer,context,{filename:'41_HienThiCauHoiToan.html'});
const render=context.taoHienThiCauToan({
 E:x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
 input:(_q,key)=>'<input data-test-key="'+key+'">',
 baseCard:(q,inner)=>'<article data-ml-q-card="'+q.id+'">'+inner+'</article>'
});
const q={valid:true,id:'T20_01',n1:28,n2:45,answer:73,theme:'blue',label:'a)',op:'+',unit:'con gà'};
const mental=render.mental(q);
assert.match(mental,/28/);assert.match(mental,/45/);
assert.doesNotMatch(mental,/🔊|data-ml-speak-question/);
const vertical=render.vertical(q);
assert.match(vertical,/ml-vertical-matrix/);
assert.match(vertical,/T20_01:carry/);
const word=render.word({...q,prompt:'Có 28 con gà và 17 con gà.',summary:'Gà mái: 28 con | Gà trống: 17 con | Tất cả: ... con?',solutionPrompt:'Số con gà là:'});
assert.equal((word.match(/class="ml-word-summary-line"/g)||[]).length,3);
assert.match(word,/Gà mái: 28 con/);
assert.match(word,/Gà trống: 17 con/);
assert.match(word,/Tất cả: \.\.\. con\?/);
assert.match(word,/BÀI GIẢI/);
assert.match(word,/Đáp số:/);
const hostile=render.word({...q,prompt:'Đề',summary:'Có: <script>evil<\/script> | Hỏi: bao nhiêu?'});
assert.doesNotMatch(hostile,/<script>/,'summary escaped, not executed');
assert.equal((hostile.match(/class="ml-word-summary-line"/g)||[]).length,2);
console.log('P1_4_BE_HOC_UI_REGRESSION_PASS: legacy vertical inputs, no accidental TEST panels, mental no speech button, 3-line escaped summary');
