/* Optional speech adapter. Browser TTS is best effort; no fabricated audio fallback. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.KLChoiceSpeechV11=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(win,opts={}){
  const synth=win&&win.speechSynthesis;
  const Utterance=win&&win.SpeechSynthesisUtterance;
  let disposed=false,current=null;
  return Object.freeze({
   supported:!!(synth&&Utterance),
   speak(text,locale='vi-VN'){
    if(disposed)return {ok:false,reason:'DISPOSED'};
    if(!synth||!Utterance)return {ok:false,reason:'TTS_UNAVAILABLE'};
    if(typeof text!=='string'||!text.trim()||text.length>1000)return {ok:false,reason:'INVALID_TEXT'};
    try{
     synth.cancel();const u=new Utterance(text.trim());u.lang=locale;
     u.rate=typeof opts.rate==='number'&&opts.rate>=0.7&&opts.rate<=1.1?opts.rate:0.9;
     current=u;synth.speak(u);return {ok:true,status:'REQUESTED_NOT_PLAYBACK_CONFIRMED'};
    }catch(_){return {ok:false,reason:'TTS_FAILED'};}
   },
   stop(){if(synth)try{synth.cancel()}catch(_){}current=null;return {ok:true};},
   dispose(){disposed=true;if(synth)try{synth.cancel()}catch(_){}current=null;}
  });
 }
 return Object.freeze({create});
});
