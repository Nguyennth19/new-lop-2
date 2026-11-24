'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const root='qa/n12-n13-preparation/',p=require('./N13_2A_LESSON_REVIEW_INDEX.review.v1.json'),old=require('./N13_2_LESSON_PILOT_PREPARATION.review.v1.json'),gen=require('../p1-2-b/original_variant_preview_generator.cjs'),publisher=require('../universal-template-v13/publisher-core.cjs');
const D3=require('../../66_D3_Core.html'),D4=require('../../68_D4_Core.html'),D6=require('../../71_D6_Core.html'),tts=require('../../44_G75_NormalizerToanV2.html');
let n=0;function check(f){f();n++;}
const legacy=gen.build().filter(x=>['MATH_B001','MATH_B002'].includes(x.previewRecord.lessonId));
const byId=new Map(legacy.map(x=>[x.previewRecord.variantId,x]));
check(()=>assert.equal(legacy.length,16));check(()=>assert.equal(p.newOriginalReviewCandidates.length,8));check(()=>assert.deepEqual(p.selectedSourceIds,old.pageCrosswalk.filter(x=>x.selectedReview).map(x=>x.originExerciseId)));
const noKeys=x=>publisher.secureTree(x)&&!/"(?:privateCheck|rubric|correctOrder|correctBasket|matchId|isCorrect)"\s*:/i.test(JSON.stringify(x));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const r of p.originalPreviewReferences){
 const a=byId.get(r.variantId);check(()=>assert(a&&a.previewRecord.lessonId===r.lessonId&&r.rendererGrant==='DENY'&&r.publicVariant===null&&!r.studentRelease));
 const e=a.previewRecord.previewEnvelope,d=e.display;const raw={questionId:e.variantId,selectionMode:'SINGLE',prompt:{type:'TEXT',text:d.prompt},options:d.visibleChoices.map(o=>({id:o.id,content:{type:'TEXT',text:o.text}})),speechEnabled:false};
 check(()=>assert(noKeys(raw)));const c=D4.compile(raw);check(()=>assert(c.ok));check(()=>assert(tts.segments(d.prompt).length>0));
 // Reuse private QA-only oracle and independently derive from visible prompt.
 const nums=d.prompt.match(/\d+/g).map(Number),rule=d.publicParameters.concept;
 const expected=rule==='two_digit_place_value'?String(nums[0]*10+nums[1]):rule==='expanded_tens_ones'?Math.floor(nums[0]/10)*10+' + '+nums[0]%10:rule==='predecessor'?String(nums[0]-1):String(nums[0]+1);
 check(()=>assert.equal(expected,a.privateCheck.right));const good=raw.options.filter(o=>o.content.text===expected);check(()=>assert.equal(good.length,1));
 const sess=D4.session(c.plan);check(()=>assert.equal(sess.snapshot().selectedOptionIds.length,0));check(()=>assert(!sess.select('unknown').ok));sess.select(good[0].id);check(()=>assert.deepEqual(sess.snapshot().selectedOptionIds,[good[0].id]));sess.clear();check(()=>assert.deepEqual(sess.snapshot().selectedOptionIds,[]));
}
for(const item of p.newOriginalReviewCandidates){
 const e=item.previewEnvelope,raw=e.display.publicParameters.rendererReviewInput,route=item.rendererRouteCandidate;
 check(()=>assert(item.publicVariant===null&&item.rendererGrant==='DENY'&&!item.studentRelease&&item.sourceExerciseId===null));check(()=>assert(noKeys(raw)));check(()=>assert(tts.segments(e.display.prompt).length>0));
 if(route==='D3'){const c=D3.compile(raw);check(()=>assert(c.ok));const sess=D3.session(c.plan);check(()=>assert.equal(sess.snapshot().completed,0));const right=new Map(raw.rightItems.map(x=>[Number(x.content.text),x.id]));for(const x of raw.leftItems){const [t,u]=x.content.text.match(/\d+/g).map(Number);check(()=>assert(right.has(t*10+u)));check(()=>assert(sess.connect(x.id,right.get(t*10+u)).ok));}check(()=>assert.equal(sess.snapshot().completed,3));check(()=>assert(!sess.connect('unknown','r1').ok));sess.clear();check(()=>assert.equal(sess.snapshot().completed,0));}
 else if(route==='D6'){const c=D6.compile(raw);check(()=>assert(c.ok));const sess=D6.session(c.plan),asc=raw.prompt.includes('bé đến lớn'),ordered=raw.items.slice().sort((a,b)=>(Number(a.label)-Number(b.label))*(asc?1:-1));check(()=>assert.equal(new Set(ordered.map(x=>x.label)).size,4));ordered.forEach((x,i)=>assert(sess.place(x.id,'slot_'+(i+1)).ok));check(()=>assert(ordered.every((x,i)=>sess.snapshot().placements[x.id]==='slot_'+(i+1))));check(()=>assert(!sess.place('unknown','slot_1').ok));sess.clear();check(()=>assert.equal(Object.keys(sess.snapshot().placements).length,0));}
 else if(route==='D4'){const c=D4.compile(raw);check(()=>assert(c.ok));const nums=raw.prompt.text.match(/\d+/g).map(Number);const matches=raw.selectionMode==='MULTIPLE'?raw.options.filter(o=>Number(o.content.text)>nums[0]&&Number(o.content.text)<nums[1]):raw.options.filter(o=>o.content.text===((raw.prompt.text.includes('liền trước')?nums[0]-1:nums[0]+1)===nums[1]?'Đúng':'Sai'));check(()=>assert.equal(matches.length,raw.selectionMode==='MULTIPLE'?3:1));const sess=D4.session(c.plan);for(const o of matches)sess.select(o.id);check(()=>assert.deepEqual(sess.snapshot().selectedOptionIds,matches.map(o=>o.id)));check(()=>assert(!sess.select('unknown').ok));sess.clear();check(()=>assert.equal(sess.snapshot().selectedOptionIds.length,0));}
 else throw Error('unexpected route');
}
check(()=>assert.equal(new Set([...p.originalPreviewReferences,...p.newOriginalReviewCandidates].map(x=>x.variantId)).size,24));check(()=>assert.equal(p.holds.length,7));check(()=>assert.equal(p.estimationHoldIds.length,4));check(()=>assert(p.lessons.every(x=>!x.sourceExactApproved&&!x.skillApproved&&!x.studentRelease&&x.lv3==='NO_APPROVED_REFERENCE')));
console.log('N13_2A_REVIEW_CONTRACT_PASS',n,'checks; 24 original review candidates, no actual grade or runtime grant');
