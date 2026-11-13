'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const M=require('./measurement-v11-core.js'),F=require('./measurement-v11-fixtures.js');
let n=0;const eq=(a,b,msg)=>{assert.deepEqual(a,b,msg);n++;};const ok=(x,msg)=>{assert.ok(x,msg);n++;};
const a=M.compile(F.ruler),b=M.compile(F.clock);ok(a.ok);ok(b.ok);
eq(a.plan.mode,'RULER');eq(b.plan.mode,'CLOCK');ok(Object.isFrozen(a.plan));ok(Object.isFrozen(b.plan.model));
eq(a.plan.model.segmentStart,60);eq(a.plan.model.segmentEnd,284);eq(a.plan.model.pixelsPerUnit,32);
const r=M.session(a.plan);eq(r.snapshot().rulerZero,115);eq(r.snapshot().enteredLength,'');
ok(r.setRulerZero(60).ok);ok(r.setLength('7').ok);eq(r.snapshot().enteredLength,'7');
eq(r.setLength('invalid').reason,'INVALID_LENGTH_INPUT');
eq(r.setRulerZero(Infinity).reason,'INVALID_RULER_ZERO');
eq(r.setRulerZero(-5).reason,'INVALID_RULER_ZERO');eq(r.snapshot().rulerZero,60);
eq(r.setTime(7,15).reason,'WRONG_MODE');
const saved=r.snapshot();eq(r.restore({...saved,enteredLength:'--'}).reason,'INVALID_DRAFT_RULER');eq(r.snapshot(),saved);
ok(r.restore({exerciseId:a.plan.exerciseId,mode:'RULER',rulerZero:74,enteredLength:'5.5'}).ok);
eq(r.snapshot().rulerZero,74);eq(r.snapshot().enteredLength,'5.5');
ok(r.clear().ok);eq(r.snapshot().rulerZero,115);eq(r.snapshot().enteredLength,'');
const clock=M.session(b.plan);eq(clock.snapshot().hour,7);eq(clock.snapshot().minute,0);
ok(clock.incrementMinute().ok);eq(clock.snapshot().minute,15);
ok(clock.incrementMinute(30).ok);eq(clock.snapshot().minute,45);
ok(clock.incrementMinute(15).ok);eq([clock.snapshot().hour,clock.snapshot().minute],[8,0]);
ok(clock.incrementMinute(-15).ok);eq([clock.snapshot().hour,clock.snapshot().minute],[7,45]);
ok(clock.incrementHour(-1).ok);eq(clock.snapshot().hour,6);
ok(clock.setTime(11,45).ok);ok(clock.incrementMinute(15).ok);eq([clock.snapshot().hour,clock.snapshot().minute],[12,0]);
ok(clock.setTime(12,45).ok);ok(clock.incrementMinute(15).ok);eq([clock.snapshot().hour,clock.snapshot().minute],[1,0]);
ok(clock.setTime(1,0).ok);ok(clock.incrementMinute(-15).ok);eq([clock.snapshot().hour,clock.snapshot().minute],[12,45]);
eq(clock.incrementMinute(7).reason,'INVALID_INCREMENT');
eq(clock.setTime(0,50).reason,'INVALID_TIME');
const draft=clock.snapshot();
eq(clock.restore({...draft,minute:65}).reason,'INVALID_DRAFT_CLOCK');eq(clock.snapshot(),draft);
ok(clock.restore({exerciseId:b.plan.exerciseId,mode:'CLOCK',hour:9,minute:30}).ok);
eq([clock.snapshot().hour,clock.snapshot().minute],[9,30]);
ok(clock.clear().ok);eq([clock.snapshot().hour,clock.snapshot().minute],[7,0]);
for(let i=0;i<120;i++){
 const ruler={...F.ruler,exerciseId:'RULER_V'+i,model:{...F.ruler.model,segmentEnd:180+i}};
 ok(M.compile(ruler).ok);
 const c={...F.clock,exerciseId:'CLOCK_V'+i,model:{initialHour:i%12+1,initialMinute:i%4*15,minuteStep:15}};
 ok(M.compile(c).ok);
}
for(const key of ['answer','answerKey','correctLength','correctTime','targetLength','targetMinute','gradingKey']){
 eq(M.compile({...F.ruler,[key]:7}).reason,'INVALID_META');
}
eq(M.compile({...F.ruler,model:{...F.ruler.model,targetLength:7}}).reason,'INVALID_RULER_MODEL');
eq(M.compile({...F.clock,model:{...F.clock.model,minuteStep:0}}).reason,'INVALID_CLOCK_MODEL');
eq(M.compile({...F.ruler,model:{...F.ruler.model,pixelsPerUnit:0}}).reason,'INVALID_RULER_MODEL');
for(const file of ['measurement-v11-view.js','measurement-v11-fixtures.js']){
 const code=fs.readFileSync(__dirname+'/'+file,'utf8');new vm.Script(code);
 ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(code));
}
const origin=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(origin).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+n+' assertions, 240 variants, 12h/60m wrap, frozen original SHA');
