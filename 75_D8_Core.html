/* G7.4 MEASUREMENT_REFERENCE_V1.1 – pure TEST data and draft state.
 * Adapted from frozen Type 8: ruler + clock. No correct answers / grades / rewards.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KLMeasurementV11=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MODES=Object.freeze({RULER:'RULER',CLOCK:'CLOCK'});
 const deny=new Set(['answer','answers','answerKey','correct','correctLength','correctTime','isCorrect','gradingKey','expectedLength','expectedTime','targetHour','targetMinute','targetLength']);
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(x);
 const noKeys=x=>x&&typeof x==='object'&&!Object.keys(x).some(k=>deny.has(k));
 const fail=reason=>({ok:false,reason});
 const finite=x=>typeof x==='number'&&Number.isFinite(x);
 function compile(raw){
  if(!raw||!noKeys(raw)||!id(raw.exerciseId)||!Object.values(MODES).includes(raw.mode))return fail('INVALID_META');
  const plan={schemaVersion:'g74-measurement-v11',exerciseId:raw.exerciseId,mode:raw.mode,
   prompt:typeof raw.prompt==='string'?raw.prompt.slice(0,400):''};
  if(raw.mode===MODES.RULER){
   const m=raw.model;
   if(!m||!noKeys(m)||!finite(m.segmentStart)||!finite(m.segmentEnd)||m.segmentStart<10||
      m.segmentEnd<=m.segmentStart||m.segmentEnd>400||
      !finite(m.pixelsPerUnit)||m.pixelsPerUnit<12||m.pixelsPerUnit>60||
      !Number.isInteger(m.rulerUnits)||m.rulerUnits<2||m.rulerUnits>20||
      !finite(m.initialZero)||m.initialZero<10||m.initialZero>250||
      !['cm','dm','m'].includes(m.unit))return fail('INVALID_RULER_MODEL');
   // The segment length is part of the visible drawing, not an answer field.
   // A trusted server still decides if the entered measurement is correct.
   plan.model=Object.freeze({segmentStart:m.segmentStart,segmentEnd:m.segmentEnd,
    pixelsPerUnit:m.pixelsPerUnit,rulerUnits:m.rulerUnits,initialZero:m.initialZero,unit:m.unit});
  }else{
   const m=raw.model;
   if(!m||!noKeys(m)||!Number.isInteger(m.initialHour)||m.initialHour<1||m.initialHour>12||
      !Number.isInteger(m.initialMinute)||m.initialMinute<0||m.initialMinute>=60||
      ![1,5,15].includes(m.minuteStep))return fail('INVALID_CLOCK_MODEL');
   plan.model=Object.freeze({initialHour:m.initialHour,initialMinute:m.initialMinute,minuteStep:m.minuteStep});
  }
  return {ok:true,plan:Object.freeze(plan)};
 }
 function session(plan){
  if(!plan||plan.schemaVersion!=='g74-measurement-v11')throw Error('INVALID_PLAN');
  const ruler=plan.mode===MODES.RULER;
  let zero=ruler?plan.model.initialZero:null,lengthText='',hour=ruler?null:plan.model.initialHour,minute=ruler?null:plan.model.initialMinute;
  const snapshot=()=>ruler?
   {exerciseId:plan.exerciseId,mode:plan.mode,rulerZero:zero,enteredLength:lengthText}:
   {exerciseId:plan.exerciseId,mode:plan.mode,hour,minute};
  const api={
   snapshot,
   setRulerZero(v){
    if(!ruler)return fail('WRONG_MODE');
    if(!finite(v)||v<0||v>300)return fail('INVALID_RULER_ZERO');
    zero=v;return {ok:true,state:snapshot()};
   },
   setLength(v){
    if(!ruler)return fail('WRONG_MODE');
    if(typeof v!=='string'||v.length>8||!/^\d{0,3}(?:\.\d{0,2})?$/.test(v))return fail('INVALID_LENGTH_INPUT');
    lengthText=v;return {ok:true,state:snapshot()};
   },
   setTime(h,m){
    if(ruler)return fail('WRONG_MODE');
    if(!Number.isInteger(h)||h<1||h>12||!Number.isInteger(m)||m<0||m>=60)return fail('INVALID_TIME');
    hour=h;minute=m;return {ok:true,state:snapshot()};
   },
   incrementMinute(delta=plan.model.minuteStep){
    if(ruler)return fail('WRONG_MODE');
    if(!Number.isInteger(delta)||delta%plan.model.minuteStep!==0||Math.abs(delta)>60)return fail('INVALID_INCREMENT');
    const base=(hour%12)*60+minute;
    const next=((base+delta)%(12*60)+12*60)%(12*60);
    hour=Math.floor(next/60)||12;minute=next%60;
    return {ok:true,state:snapshot()};
   },
   incrementHour(delta=1){
    if(ruler)return fail('WRONG_MODE');
    if(!Number.isInteger(delta)||Math.abs(delta)>12)return fail('INVALID_INCREMENT');
    hour=(((hour-1+delta)%12)+12)%12+1;
    return {ok:true,state:snapshot()};
   },
   clear(){
    if(ruler){zero=plan.model.initialZero;lengthText='';}
    else{hour=plan.model.initialHour;minute=plan.model.initialMinute;}
    return {ok:true,state:snapshot()};
   },
   restore(d){
    if(!d||d.exerciseId!==plan.exerciseId||d.mode!==plan.mode)return fail('INVALID_DRAFT');
    if(ruler){
     if(!finite(d.rulerZero)||d.rulerZero<0||d.rulerZero>300||
       typeof d.enteredLength!=='string'||d.enteredLength.length>8||
       !/^\d{0,3}(?:\.\d{0,2})?$/.test(d.enteredLength))return fail('INVALID_DRAFT_RULER');
     zero=d.rulerZero;lengthText=d.enteredLength;
    }else{
     if(!Number.isInteger(d.hour)||d.hour<1||d.hour>12||
       !Number.isInteger(d.minute)||d.minute<0||d.minute>=60)return fail('INVALID_DRAFT_CLOCK');
     hour=d.hour;minute=d.minute;
    }
    return {ok:true,state:snapshot()};
   }
  };
  return Object.freeze(api);
 }
 return Object.freeze({MODES,compile,session});
});
