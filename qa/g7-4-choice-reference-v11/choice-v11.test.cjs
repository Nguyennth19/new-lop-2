'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const Choice=require('./choice-v11-core.js');
let checks=0;function eq(a,b){assert.deepEqual(a,b);checks++}function ok(a){assert.ok(a);checks++}
const base={questionId:'CHOICE_TEST_01',selectionMode:'SINGLE',speechEnabled:true,speechText:'Chọn đáp án đúng.',
 prompt:{type:'TEXT',text:'Trong hộp chỉ có bóng đỏ. Lấy được bóng xanh là?'},options:[
 {id:'A',content:{type:'TEXT',text:'Chắc chắn'},speechText:'Chắc chắn'},
 {id:'B',content:{type:'TEXT',text:'Có thể'}},
 {id:'C',content:{type:'TEXT',text:'Không thể'}}]};
const p=Choice.compile(base);ok(p.ok);eq(p.plan.options.length,3);ok(Object.isFrozen(p.plan));
const single=Choice.session(p.plan);eq(single.snapshot().selectedOptionIds,[]);
ok(single.select('B').ok);eq(single.snapshot().selectedOptionIds,['B']);
ok(single.select('C').ok);eq(single.snapshot().selectedOptionIds,['C']);
eq(single.select('Z').reason,'UNKNOWN_OPTION');eq(single.snapshot().selectedOptionIds,['C']);
eq(single.restore({questionId:'CHOICE_TEST_01',selectedOptionIds:['A','B']}).reason,'INVALID_DRAFT_SELECTION');
eq(single.snapshot().selectedOptionIds,['C']);ok(single.clear().ok);eq(single.snapshot().selectedOptionIds,[]);
ok(single.restore({questionId:'CHOICE_TEST_01',selectedOptionIds:['A']}).ok);
eq(single.snapshot().selectedOptionIds,['A']);
for(const key of ['answer','answers','answerKey','correctOptionId','correctOptionIds','gradingKey','isCorrect']){
 eq(Choice.compile({...base,[key]:'A'}).reason,'ANSWER_KEY_FORBIDDEN');
}
eq(Choice.compile({...base,options:[{...base.options[0],isCorrect:true},...base.options.slice(1)]}).reason,'ANSWER_KEY_FORBIDDEN');
eq(Choice.compile({...base,options:[base.options[0],{...base.options[1],id:'A'},base.options[2]]}).reason,'INVALID_OPTION_ID');
eq(Choice.compile({...base,prompt:{type:'TEXT',text:''}}).reason,'INVALID_PROMPT');
eq(Choice.compile({...base,options:base.options.slice(0,1)}).reason,'INVALID_OPTION_COUNT');
eq(Choice.compile({...base,selectionMode:'WRONG'}).reason,'INVALID_SELECTION_MODE');
const multi=Choice.compile({...base,questionId:'CHOICE_TEST_MULTI',selectionMode:'MULTIPLE'});
ok(multi.ok);const s=Choice.session(multi.plan);s.select('A');s.select('C');eq(s.snapshot().selectedOptionIds,['A','C']);
s.select('A');eq(s.snapshot().selectedOptionIds,['C']);
eq(s.restore({questionId:'CHOICE_TEST_MULTI',selectedOptionIds:['B','B']}).reason,'INVALID_DRAFT_SELECTION');
eq(s.snapshot().selectedOptionIds,['C']);ok(s.restore({questionId:'CHOICE_TEST_MULTI',selectedOptionIds:['C','B']}).ok);
eq(s.snapshot().selectedOptionIds,['B','C']);
for(let i=0;i<120;i++){
 const next={...base,questionId:'VAR_'+i,selectionMode:i%2?'MULTIPLE':'SINGLE',
 options:[{id:'X',content:{type:'MATH',text:i+' + 2'}},
 {id:'Y',content:{type:'ASSET',assetId:'MATH.BALL',alt:'Quả bóng'}}]};
 ok(Choice.compile(next).ok);
}
const view=fs.readFileSync(__dirname+'/choice-v11-view.js','utf8');
const tts=fs.readFileSync(__dirname+'/choice-v11-speech.js','utf8');
new vm.Script(view);new vm.Script(tts);
ok(!/google\.script\.run|localStorage|showFeedback|awardStars/.test(view+tts));
let cancellations=0, spoken=[];
class Utterance{constructor(text){this.text=text}}
const synth={cancel(){cancellations++},speak(v){spoken.push(v)}};
const context={module:{exports:{}},globalThis:{},SpeechSynthesisUtterance:Utterance};vm.runInNewContext(tts,context);
const adapter=context.module.exports.create({speechSynthesis:synth,SpeechSynthesisUtterance:Utterance});
ok(adapter.supported);ok(adapter.speak('Xin chào').ok);eq(spoken[0].lang,'vi-VN');
ok(adapter.speak('Câu tiếp theo').ok);ok(cancellations>=2);
adapter.stop();adapter.dispose();eq(adapter.speak('Sau khi hủy').reason,'DISPOSED');
const orig=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(orig).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+checks+' assertions; 120 variations; frozen original SHA unchanged');
