/* Reference sample from frozen Type 10, plus G6-like B20 specimen.
 * The two answer-free public plans are TEST samples, not a grading authority.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLWordUnificationFixturesV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 return Object.freeze({
  rice:{
   questionId:'G74_RICE_WORD_REF',mode:'SELECT_STATEMENT',calculationSteps:1,readAloud:true,
   prompt:'Bao gạo tẻ cân nặng 36 kg, bao gạo nếp nhẹ hơn bao gạo tẻ 12 kg. Hỏi bao gạo nếp cân nặng bao nhiêu ki-lô-gam?',
   summary:'Bao gạo tẻ: 36 kg | Bao gạo nếp nhẹ hơn: 12 kg | Bao gạo nếp: ... kg?',
   unit:'kg',
   statementOptions:[
    {id:'st1',text:'Số ki-lô-gam bao gạo nếp cân nặng là:'},
    {id:'st2',text:'Số ki-lô-gam cả hai bao gạo cân nặng là:'},
    {id:'st3',text:'Số ki-lô-gam bao gạo tẻ nặng hơn là:'}
   ]},
  g6Compatible:{
   id:'B20_WORD_REFERENCE',type:'word_problem',valid:true,
   prompt:'Lan có 28 quyển truyện, được tặng thêm 15 quyển. Hỏi Lan có tất cả bao nhiêu quyển truyện?',
   summary:'Có: 28 quyển truyện | Thêm: 15 quyển truyện | Tất cả: ... quyển truyện?',
   solutionPrompt:'Lan có tất cả số quyển truyện là:',
   unit:'quyển truyện',n1:28,n2:15,op:'+',answer:'43',
   // The PRIVATE/LEGACY fields above must never be copied into publicPayloadFromG6.
   options:[
    {id:'a',text:'Lan có tất cả số quyển truyện là:'},
    {id:'b',text:'Số quyển truyện Lan còn lại là:'},
    {id:'c',text:'Số quyển truyện Lan đã cho đi là:'}
   ]}
 });
});
