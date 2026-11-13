/* Exact Type-6 sample values, stripped of grading values and correct answer order. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLDragSortFixturesV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 return Object.freeze({
  ordering:{exerciseId:'ORDER_3DIGIT_TEST',mode:'ORDER',
   prompt:'Sắp xếp các số có ba chữ số theo thứ tự từ bé đến lớn.',
   items:[615,289,804,450].map((n,i)=>({id:'n'+i,label:String(n)}))},
  baskets:{exerciseId:'BASKETS_EXPRESSION_TEST',mode:'SORT',
   prompt:'Phân loại phép tính theo kết quả nhỏ hơn hoặc lớn hơn 50.',
   items:[{id:'b1',label:'28 + 15'},{id:'b2',label:'82 − 19'},
    {id:'b3',label:'5 × 8'},{id:'b4',label:'36 + 27'}],
   groups:[{id:'lt50',label:'Giỏ 1: Bé hơn 50'},{id:'gt50',label:'Giỏ 2: Lớn hơn 50'}]}
 });
});
