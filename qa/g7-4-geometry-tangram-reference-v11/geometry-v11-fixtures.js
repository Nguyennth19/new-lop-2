/* Reference fixtures copied semantically from frozen Type 5; no answer labels or correct placements. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLGeometryFixturesV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const poly=(arr)=>({type:'polygon',points:arr});
 const shape={
 exerciseId:'GEO_SHAPES_REFERENCE',mode:'SHAPE_SELECT',prompt:'Chạm chọn các hình tứ giác. Có thể chạm lại để bỏ chọn.',
 shapes:[
 {id:'s1',label:'Hình 1',geometry:poly([[30,25],[130,20],[115,105],[20,100]])},
 {id:'s2',label:'Hình 2',geometry:poly([[75,18],[135,105],[15,105]])},
 {id:'s3',label:'Hình 3',geometry:poly([[20,25],[130,25],[110,105],[40,105]])},
 {id:'s4',label:'Hình 4',geometry:{type:'circle',cx:75,cy:62,r:45}},
 {id:'s5',label:'Hình 5',geometry:{type:'polyline',points:[[15,95],[55,25],[95,90],[135,30]]}},
 {id:'s6',label:'Hình 6',geometry:poly([[75,15],[135,62],[75,110],[15,62]])}
 ]};
 const tangram={
 exerciseId:'GEO_TANGRAM_REFERENCE',mode:'TANGRAM',
 prompt:'Chọn mảnh, xoay và đặt thử vào khung. Vị trí đặt chưa phải đáp án đã được chấm.',
 pieces:[
 {id:'roof',label:'Mái nhà',geometry:poly([[0,-45],[60,25],[-60,25]]),start:[65,55],startRotation:90},
 {id:'wall',label:'Thân nhà',geometry:{type:'rect',x:-45,y:-70,width:90,height:90},start:[65,135],startRotation:0},
 {id:'tree',label:'Tán cây',geometry:poly([[0,-50],[45,20],[-45,20]]),start:[65,215],startRotation:180}
 ],
 targets:[
 {id:'target_roof',geometry:poly([[190,25],[250,95],[130,95]])},
 {id:'target_wall',geometry:{type:'rect',x:145,y:95,width:90,height:90}},
 {id:'target_tree',geometry:poly([[330,95],[375,165],[285,165]])}
 ]};
 return Object.freeze({shape,tangram});
});
