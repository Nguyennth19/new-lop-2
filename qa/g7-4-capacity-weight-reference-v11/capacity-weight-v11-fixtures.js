/* G7.4 8-A / 8-B fixture defaults. Assets are candidate IDs, not approved mappings. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLCapacityWeightFixturesV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 return Object.freeze({
  liter:{exerciseId:'CAPACITY_LITER_DEMO',mode:'LITER',
   prompt:'Quan sát, thêm/bớt và rót nước giữa hai bình.',
   containers:[
    {id:'bottleA',label:'Bình A',capacityLiters:8,currentLiters:3},
    {id:'bottleB',label:'Bình B',capacityLiters:5,currentLiters:1}
   ]},
  weight:{exerciseId:'WEIGHT_BALANCE_DEMO',mode:'WEIGHT',
   prompt:'Thêm/bớt quả cân; quan sát bên nặng hạ xuống, bên nhẹ nâng lên.',
   pans:[
    {id:'left',label:'Đĩa trái',massKg:3},
    {id:'right',label:'Đĩa phải',massKg:5}
   ]}
 });
});
