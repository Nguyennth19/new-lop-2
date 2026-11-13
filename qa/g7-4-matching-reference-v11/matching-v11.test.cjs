'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const Matching=require('./matching-v11-core.js');
let n=0;
function ok(x,msg){assert.ok(x,msg);n++}
function eq(x,y,msg){assert.deepEqual(x,y,msg);n++}
const L=[{id:'L1',content:{type:'MATH',text:'2 + 2 + 2'}},
 {id:'L2',content:{type:'TEXT',text:'Lon sữa bò'}},
 {id:'L3',content:{type:'ASSET',assetId:'MATH.BALL',alt:'Quả bóng'}},
 {id:'L4',content:{type:'MIXED',text:'5 × 4',assetId:'MATH.HANDS'}}];
const R=[{id:'R1',content:{type:'TEXT',text:'Khối trụ'}},
 {id:'R2',content:{type:'MATH',text:'2 × 3 = 6'}},
 {id:'R3',content:{type:'MATH',text:'20'}},
 {id:'R4',content:{type:'TEXT',text:'Khối cầu'}}];
const source={exerciseId:'MATCH_B20_TEST',relationMode:'MIXED_RELATION',leftItems:L,rightItems:R};
const p=Matching.compile(source);
ok(p.ok);eq(p.plan.pairCount,4);eq(p.plan.leftItems[2].content.assetId,'MATH.BALL');
ok(Object.isFrozen(p.plan));ok(Object.isFrozen(p.plan.leftItems));
eq(Matching.compile({...source,answerKey:{L1:'R2'}}).reason,'ANSWER_KEY_FORBIDDEN_IN_RENDERER_PAYLOAD');
eq(Matching.compile({...source,leftItems:[{...L[0],matchId:'R2'},...L.slice(1)]}).reason,'ANSWER_KEY_FORBIDDEN_IN_RENDERER_PAYLOAD');
eq(Matching.compile({...source,rightItems:[...R.slice(0,3),{...R[3],id:'L1'}]}).reason,'INVALID_ITEMS_OR_DUPLICATE_IDS');
eq(Matching.compile({...source,leftItems:L.slice(0,1),rightItems:R.slice(0,1)}).reason,'INVALID_PAIR_COUNT');
eq(Matching.compile({...source,relationMode:'UNKNOWN'}).reason,'INVALID_RELATION_MODE');
eq(Matching.compile({...source,leftItems:[{...L[0],content:{type:'TEXT',text:'   '}},...L.slice(1)]}).reason,'INVALID_ITEMS_OR_DUPLICATE_IDS');
eq(Matching.compile({...source,leftItems:[{...L[0],content:{type:'ASSET',assetId:'../bad'}},...L.slice(1)]}).reason,'INVALID_ITEMS_OR_DUPLICATE_IDS');
const s=Matching.session(p.plan);
eq(s.snapshot().completed,0);
eq(s.connectSelected('R1').reason,'NO_LEFT_SELECTED');
ok(s.selectLeft('L1').ok);eq(s.snapshot().selectedLeft,'L1');
ok(s.connectSelected('R2').ok);eq(s.snapshot().pairs,{L1:'R2'});
ok(s.connect('L2','R1').ok);eq(s.snapshot().completed,2);
ok(s.connect('L3','R2').ok);eq(s.snapshot().pairs,{L2:'R1',L3:'R2'});
eq(s.snapshot().completed,2);
ok(s.disconnect('L3').ok);eq(s.snapshot().completed,1);
eq(s.connect('L9','R1').reason,'UNKNOWN_ENDPOINT');
const before=s.snapshot();
eq(s.restore({exerciseId:source.exerciseId,pairs:{L1:'R1',L2:'R1'}}).reason,'INVALID_DRAFT_PAIR');
eq(s.snapshot().pairs,before.pairs,'invalid drafts must be atomic');
ok(s.restore({exerciseId:source.exerciseId,pairs:{L4:'R3'}}).ok);
eq(s.snapshot().pairs,{L4:'R3'});
eq(s.restore({exerciseId:'OTHER',pairs:{}}).reason,'INVALID_DRAFT');
ok(s.clear().ok);eq(s.snapshot().completed,0);
const variants=[
 ...Array.from({length:24},(_,j)=>({exerciseId:'VAR_'+j,relationMode:j%2?'SINGLE_RELATION':'MIXED_RELATION',
 leftItems:[{id:'A'+j,content:{type:'MATH',text:String(j)+' + 2'}},{id:'B'+j,content:{type:'TEXT',text:'Hình '+j}}],
 rightItems:[{id:'X'+j,content:{type:'MATH',text:String(j+2)}},{id:'Y'+j,content:{type:'TEXT',text:'Kết quả'}}]}))
];
for(const v of variants){const c=Matching.compile(v);ok(c.ok,'variant '+v.exerciseId);
 const st=Matching.session(c.plan);ok(st.connect(v.leftItems[0].id,v.rightItems[1].id).ok);
 eq(st.snapshot().completed,1);}
const view=fs.readFileSync(__dirname+'/matching-v11-view.js','utf8');
new (require('node:vm').Script)(view);
ok(!/\bgoogle\.script\.run\b/.test(view));
ok(!/\blocalStorage\b/.test(view));
ok(!/\bshowFeedback\b/.test(view));
const src=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
const sha=crypto.createHash('sha256').update(src).digest('hex');
eq(sha,'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced',
 'frozen original changed');
console.log('PASS '+n+' deterministic assertions, 24 variant contracts, frozen original SHA intact');
