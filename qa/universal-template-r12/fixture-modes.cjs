'use strict';
/* Extra synthetic mode & asset contract fixtures; only for R2 LAB QA.
 * No real SGK mapping, no teacher signatures, no private answers.
 */
const {makePack}=require('../universal-template-v1/fixture-packs.cjs');
const clone=x=>JSON.parse(JSON.stringify(x));
function makeC(){
 const pack=makePack('A');pack.packId='LAB_R2_C';pack.lesson.id='LAB_MATH_C';
 pack.lesson.title='ULT-R2 thử nghiệm mode phụ – KHÔNG phát hành';
 for(const q of pack.questions){
  q.lessonId=pack.lesson.id;
  q.questionId='R2_C_'+q.rendererId;
 }
 const base=id=>clone(pack.questions.find(q=>q.rendererId===id));
 const extra=[];
 const sub=base('D2');sub.questionId='R2_C_D2_SUBTRACT';
 sub.skillId='COLUMN_SUBTRACT';
 sub.publicVariant={variantId:'COL_R2_C_SUBTRACT',profile:'PV100',
  operation:'SUBTRACT',level:sub.level,a:64,b:27,carryPolicy:'OPTIONAL_HINT',assetId:null};
 extra.push(sub);
 const thousand=base('D2');thousand.questionId='R2_C_D2_PV1000';
 thousand.publicVariant={variantId:'COL_R2_C_ADD1000',profile:'PV1000',
  operation:'ADD',level:thousand.level,a:524,b:278,carryPolicy:'OPTIONAL_HINT',assetId:null};
 extra.push(thousand);
 const shape=base('D5');shape.questionId='R2_C_D5_SHAPES';
 shape.skillId='SHAPE_SELECT';
 shape.publicVariant={exerciseId:'R2_C_SHAPES',mode:'SHAPE_SELECT',
  prompt:'Chạm chọn các hình được yêu cầu (mô phỏng chưa chấm).',
  shapes:[
   {id:'squareA',label:'Hình vuông',geometry:{type:'square',x:10,y:20,width:60,height:60}},
   {id:'circleB',label:'Hình tròn',geometry:{type:'circle',cx:130,cy:50,r:30}},
   {id:'triangleC',label:'Hình tam giác',geometry:{type:'polygon',points:[[205,80],[250,15],[295,80]]}}
  ]};
 extra.push(shape);
 const sort=base('D6');sort.questionId='R2_C_D6_SORT';
 sort.skillId='SORT_GROUPS';sort.publicVariant={exerciseId:'R2_C_SORT',
  mode:'SORT',prompt:'Xếp mỗi đồ vật vào một nhóm, chỉ thử tương tác.',
  items:[{id:'apple',label:'Táo'},{id:'orange',label:'Cam'},{id:'carrot',label:'Cà rốt'}],
  groups:[{id:'fruit',label:'Trái cây'},{id:'vegetable',label:'Rau củ'}]};
 extra.push(sort);
 const clock=base('D8');clock.questionId='R2_C_D8_CLOCK';
 clock.skillId='READ_CLOCK';clock.publicVariant={exerciseId:'R2_C_CLOCK',mode:'CLOCK',
  prompt:'Điều chỉnh kim đồng hồ (LAB chưa chấm).',
  model:{initialHour:8,initialMinute:15,minuteStep:5}};
 extra.push(clock);
 const pict=base('D9');pict.questionId='R2_C_D9_COUNT_ASSET';
 pict.visualIntent='EXACT_COUNT';pict.countUnit='quả';
 pict.publicVariant.rows=[
  {id:'apple',label:'Táo',contentType:'ASSET',assetId:'FLUENT:red_apple',itemCount:6,alt:'Quả táo',symbolValue:1},
  {id:'orange',label:'Quýt',contentType:'ASSET',assetId:'FLUENT:tangerine',itemCount:8,alt:'Quả quýt',symbolValue:1}
 ];extra.push(pict);
 pack.questions.push(...extra);
 return pack;
}
module.exports=Object.freeze({makeC});
