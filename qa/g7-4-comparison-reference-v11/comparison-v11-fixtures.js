/* Exact Type-7 sample prompt expressions/hints from frozen source.
 * No comparison answer key. Hints are OPTIONAL only for pedagogical preview.
 */
(function(root,factory){const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLComparisonFixturesV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 return Object.freeze({
  practice:{
   exerciseId:'CROC_REFERENCE_PRACTICE',hintPolicy:'OPTIONAL',
   prompt:'Chọn dấu thích hợp: >, < hoặc =.',
   rows:[
    {id:'c1',left:{type:'MATH',text:'2 × 5'},right:{type:'MATH',text:'15 − 5'},leftHint:'= 10',rightHint:'= 10'},
    {id:'c2',left:{type:'TEXT',text:'1 m'},right:{type:'TEXT',text:'90 cm'},leftHint:'= 100 cm',rightHint:'90 cm'},
    {id:'c3',left:{type:'MATH',text:'15 l + 20 l'},right:{type:'TEXT',text:'40 l'},leftHint:'= 35 l',rightHint:'40 l'}
   ]},
  assessment:{
   exerciseId:'CROC_REFERENCE_ASSESS',hintPolicy:'HIDDEN',
   prompt:'Điền dấu so sánh phù hợp.',
   rows:[
    {id:'q1',left:{type:'MATH',text:'2 × 5'},right:{type:'MATH',text:'15 − 5'}},
    {id:'q2',left:{type:'TEXT',text:'1 m'},right:{type:'TEXT',text:'90 cm'}},
    {id:'q3',left:{type:'MATH',text:'15 l + 20 l'},right:{type:'TEXT',text:'40 l'}}
   ]}
 });
});
