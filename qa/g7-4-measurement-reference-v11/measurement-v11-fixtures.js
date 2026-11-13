/* Type-8 source fidelity fixtures – initial controls only, no grading answer data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLMeasurementFixturesV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 return Object.freeze({
  ruler:{exerciseId:'RULER_AB_REFERENCE',mode:'RULER',
   prompt:'Dùng thước kẻ ảo đo độ dài đoạn thẳng AB.',
   model:{segmentStart:60,segmentEnd:284,pixelsPerUnit:32,rulerUnits:10,initialZero:115,unit:'cm'}},
  clock:{exerciseId:'CLOCK_REFERENCE',mode:'CLOCK',
   prompt:'Xoay các kim đồng hồ để chỉ thời gian theo yêu cầu bài học.',
   model:{initialHour:7,initialMinute:0,minuteStep:15}}
 });
});
