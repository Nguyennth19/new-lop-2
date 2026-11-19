'use strict';
/**
 * Source-only LAB packages. No answers, private solution maps, scores,
 * server endpoints, student ID, deployment or curriculum approval.
 * A/B must BOTH render with identical adapter code.
 */
const SLOT_IDS=['t1_split1','t1_split2','t1_ten','t1_ans','t1_dm','t1_m'];
const geometry={
 mode:'TANGRAM',
 prompt:'Chọn mảnh, xoay và đặt vào hình tham chiếu (mô phỏng, chưa chấm).',
 pieces:[
  {id:'roof',label:'Mái nhà',geometry:{type:'polygon',points:[[0,-45],[60,25],[-60,25]]},start:[65,55],startRotation:90},
  {id:'wall',label:'Thân nhà',geometry:{type:'rect',x:-45,y:-70,width:90,height:90},start:[65,135],startRotation:0},
  {id:'tree',label:'Tán cây',geometry:{type:'polygon',points:[[0,-50],[45,20],[-45,20]]},start:[65,215],startRotation:180}
 ],
 targets:[
  {id:'target_roof',geometry:{type:'polygon',points:[[190,25],[250,95],[130,95]]}},
  {id:'target_wall',geometry:{type:'rect',x:145,y:95,width:90,height:90}},
  {id:'target_tree',geometry:{type:'polygon',points:[[330,95],[375,165],[285,165]]}}
 ]
};
const opt=(text)=>({type:'TEXT',text});
const clone=o=>JSON.parse(JSON.stringify(o));
function makePack(tag='A'){
 if(!['A','B'].includes(tag))throw Error('Unknown pack');
 const beta=tag==='B',seed=beta?2:1,prefix='LAB_'+tag+'_';
 const a=beta?47:36,b=beta?25:17;
 const entries=[
  ['D1','NUMBER_BOND','bond', {
   ok:true,caseId:'TYPE1_'+tag,data:{a:beta?7:8,b:beta?6:5,dm:beta?3:2,m:beta?1:2},
   slots:SLOT_IDS.map(id=>({id,role:'ANSWER_INPUT',value:null}))
  }],
  ['D2','COLUMN_ADD','vertical',{
   variantId:'COL_LAB_'+tag+'0001',profile:'PV100',operation:'ADD',level:'LV2',a,b,
   carryPolicy:'OPTIONAL_HINT',assetId:null
  }],
  ['D3','MATCH_PAIRS','matching',{
   exerciseId:prefix+'MATCH',relationMode:'SINGLE_RELATION',
   leftItems:[{id:'l1',content:opt(beta?'6 + 4':'7 + 2')},{id:'l2',content:opt(beta?'3 + 5':'6 + 3')}],
   rightItems:[{id:'r1',content:opt(beta?'8':'9')},{id:'r2',content:opt(beta?'10':'9 (cách khác)')}]
  }],
  ['D4','SELECT_CHOICE','choice',{
   questionId:prefix+'CHOICE',selectionMode:'SINGLE',
   prompt:opt(beta?'12 + 7 bằng bao nhiêu?':'8 + 5 bằng bao nhiêu?'),
   options:[{id:'opt1',content:opt(beta?'18':'12')},{id:'opt2',content:opt(beta?'19':'13')},
    {id:'opt3',content:opt(beta?'20':'15')}],
   speechEnabled:true
  }],
  ['D5','SHAPE_TANGRAM','geometry',{exerciseId:prefix+'GEOM',...clone(geometry)}],
  ['D6','ORDER_NUMBERS','ordering',{
   exerciseId:prefix+'SORT',mode:'ORDER',prompt:'Chọn số và đặt vào thứ tự từ bé đến lớn.',
   items:(beta?['15','9','12']:['3','8','5']).map((label,i)=>({id:'n'+(i+1),label}))
  }],
  ['D7','COMPARE_NUMBER','comparison',{
   exerciseId:prefix+'COMPARE',hintPolicy:'OPTIONAL',prompt:'Chọn dấu so sánh đúng.',
   rows:[{id:'row1',left:opt(beta?'15':'8'),right:opt(beta?'12':'13')},
     {id:'row2',left:opt(beta?'9 + 4':'7 + 5'),right:opt(beta?'13':'12')}]
  }],
  ['D8','MEASURE_RULER','measurement',{
   exerciseId:prefix+'RULER',mode:'RULER',prompt:'Kéo thước và đo đoạn thẳng AB.',
   model:{segmentStart:30,segmentEnd:beta?210:170,pixelsPerUnit:20,
    rulerUnits:10,initialZero:30,unit:'cm'}
  }],
  ['D8A','LITER_CAPACITY','capacity',{
   exerciseId:prefix+'LITER',mode:'LITER',prompt:'Mô phỏng rót nước vào hai bình.',
   containers:[{id:'bottleA',label:'Bình A',capacityLiters:beta?10:8,currentLiters:beta?4:3},
     {id:'bottleB',label:'Bình B',capacityLiters:beta?6:5,currentLiters:beta?2:1}]
  }],
  ['D8B','MASS_BALANCE','mass',{
   exerciseId:prefix+'MASS',mode:'WEIGHT',prompt:'Cân: bên nặng hơn phải hạ thấp hơn.',
   pans:[{id:'left',label:'Trái',massKg:beta?7:3},
     {id:'right',label:'Phải',massKg:beta?4:5}]
  }],
  ['D9','PICTOGRAPH','pictograph',{
   exerciseId:prefix+'PICTO',mode:'PRACTICE',
   prompt:'Chạm từng hình để đếm; chọn câu để nhập số.',
   demoRowId:'apple',
   rows:[{id:'apple',label:'Táo',contentType:'EMOJI',symbol:'🍎',itemCount:beta?4:6},
     {id:'orange',label:'Cam',contentType:'EMOJI',symbol:'🍊',itemCount:beta?7:4}],
   questions:[{id:'qa',type:'COUNT',rowId:'apple',prompt:'Có bao nhiêu quả táo?'},
     {id:'qb',type:'COMPARE_DIFFERENCE',rowId:'orange',otherRowId:'apple',
      relation:'MORE_THAN',prompt:'Cam nhiều hơn táo bao nhiêu quả?'}]
  }],
  ['D10','WORD_PROBLEM','word_problem',{
   questionId:prefix+'WORD',mode:'SELECT_STATEMENT',calculationSteps:1,
   prompt:beta?'Lan có 15 quyển vở, mua thêm 7 quyển. Lan có tất cả bao nhiêu quyển?':
    'Hoa có 12 chiếc bút, được tặng thêm 6 chiếc. Hoa có tất cả bao nhiêu chiếc?',
   summary:beta?'Có 15 quyển | Thêm 7 quyển':'Có 12 chiếc | Thêm 6 chiếc',
   unit:beta?'quyển':'chiếc',
   statementOptions:[
    {id:'s1',text:beta?'Số quyển vở Lan có tất cả là:':'Số chiếc bút Hoa có tất cả là:'},
    {id:'s2',text:'Số còn lại là:'}
   ]
  }]
 ];
 const levels=['LV1','LV2','LV3'];
 return {
  schemaVersion:'LOP2_UNIVERSAL_LAB_PUBLIC_V1',
  packId:'MATH_LAB_'+tag,
  lesson:{id:'LAB_MATH_'+tag,subject:'MATH',title:'Toán 2 – Bộ dữ liệu mẫu '+tag,
    grade:2,studentRelease:false,sourceStatus:'SYNTHETIC_QA_ONLY'},
  status:'LAB_FIXTURE_ONLY_NO_GAS_RELEASE',
  questions:entries.map(([rendererId,skillId,questionType,publicVariant],i)=>({
   questionId:prefix+rendererId,rendererId,skillId,questionType,level:levels[i%3],
   visualIntent:rendererId==='D9'?'EXACT_COUNT':'DECORATIVE',
   countUnit:rendererId==='D9'?'quả':null,
   assetId:null,publicVariant
  }))
 };
}
module.exports=Object.freeze({makePack,SLOT_IDS});
