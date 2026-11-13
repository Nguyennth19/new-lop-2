'use strict';
const assert=require('node:assert/strict');
const {VietnameseSpeechService}=require('./G75_VietnameseSpeechService.js');
function fixture(voices){
 const events=[],calls=[];
 const synth={voices:voices||[],last:null,
 getVoices(){return this.voices;},cancel(){calls.push('cancel');},
 speak(utter){this.last=utter;calls.push('speak');},
 addEventListener(event,fn){this.listener=fn;},
 removeEventListener(event,fn){assert.equal(fn,this.listener);}};
 function Utterance(t){this.text=t;}
 const env={speechSynthesis:synth,SpeechSynthesisUtterance:Utterance};
 return {synth,events,calls,env,service:new VietnameseSpeechService(env,e=>events.push(e))};
}
const absent=new VietnameseSpeechService({},()=>{});
assert.equal(absent.speak('Xin chào'),'UNSUPPORTED');
const a=fixture([{name:'English',lang:'en-US'}]);
assert.equal(a.service.speak('Xin chào'),'NO_VI_VOICE');
assert.equal(a.calls.includes('speak'),false);
a.synth.voices=[{name:'Vietnamese 1',lang:'vi-VN'},{name:'Vietnamese 2',lang:'vi'}];
a.synth.listener();
assert.equal(a.service.getCapabilities().selectedVoice,'Vietnamese 1');
assert.equal(a.service.speak('  Tám cộng năm  ','PROMPT'),'REQUESTED');
assert.equal(a.synth.last.lang,'vi-VN');
assert.equal(a.synth.last.voice.name,'Vietnamese 1');
assert.equal(a.synth.last.text,'Tám cộng năm');
a.synth.last.onstart();a.synth.last.onend();
assert.deepEqual(a.events.slice(-3).map(e=>e.status),['REQUESTED','STARTED','ENDED']);
a.service.speak('Một','OPTION');
const obsolete=a.synth.last;
a.service.speak('Hai','OPTION');
obsolete.onstart();
assert.equal(a.events.at(-1).status,'REQUESTED');
assert.equal(a.events.some(e=>e.status==='CANCELLED'),true);
a.synth.last.onerror({error:'language-unavailable'});
assert.equal(a.events.at(-1).errorCode,'language-unavailable');
a.service.destroy();
const empty=fixture([]);
assert.equal(empty.service.speak('Xin chào'),'VOICE_LOADING_OR_UNAVAILABLE');
assert.equal(empty.calls.includes('speak'),false);
console.log('G7.5 MOCK_UNIT_TEST=PASS; real audible/device/GAS deployment=NOT_TESTED');
