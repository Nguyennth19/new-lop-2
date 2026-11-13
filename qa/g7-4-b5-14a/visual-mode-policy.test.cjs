'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {verifyB20Policy,classifyQuestion,validateRequest}=require('./visual-mode-policy.cjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const policy=read('qa/g7-4-b5-14a/visual-mode-policy.v1.json');
const pack=read('du-lieu/bien-the/chuan/toan_b20.visual-intent.v1.json');
const contract=read('qa/g7-4-b5-13-count-renderer-contract.v1.json');
const m=read('hinh-anh/svg-fallback/fluent-emoji-flat/v1/manifest.v1.json');
let n=0;const eq=(x,y)=>{assert.deepEqual(x,y);n++};const ok=x=>{assert.ok(x);n++};
const result=verifyB20Policy(policy,pack);eq(result.ok,true);eq(result.counts,{EXACT_COUNT:0,REPRESENTATIVE:2,DECORATIVE:28});
eq(policy.currentB20.questionModes.length,30);eq(pack.questions.length,30);eq(policy.featureActivation,false);
eq(policy.lessonMutation,false);eq(policy.invariants.noRendererEdits,true);eq(policy.invariants.mainUnchanged,true);
eq(contract.approvedCount,45);eq(m.enabled,false);eq(m.productionActivation,false);
for(const q of pack.questions){
 const assigned=policy.currentB20.questionModes.find(x=>x.questionId===q.question_id);
 ok(assigned);eq(classifyQuestion(q).visualMode,assigned.visualMode);
 if(q.type==='word'){eq(assigned.visualMode,'REPRESENTATIVE');eq(assigned.assetResolution,'REUSE_EXISTING_APPROVED_ASSET');}
 else{eq(assigned.visualMode,'DECORATIVE');eq(assigned.renderRequired,false);eq(assigned.assetResolution,'NONE_BY_DEFAULT');}
}
const word=pack.questions.filter(x=>x.type==='word');eq(word.length,2);
eq(word[0].parameters.a+word[0].parameters.b,81);
eq(word[1].parameters.a+word[1].parameters.b,73);
const candy={assetId:'candy',semanticApproval:'OWNER_SEMANTIC_APPROVED',sourceSha256:'x'};
const apple=contract.assets.find(x=>x.assetId==='red_apple');
const a={assetId:apple.assetId,semanticApproval:'OWNER_SEMANTIC_APPROVED',sourceSha256:apple.sourceSha256};
eq(validateRequest({visualMode:'REPRESENTATIVE',asset:candy},contract).ok,true);
eq(validateRequest({visualMode:'REPRESENTATIVE',asset:candy,expectedVisualCount:81},contract).ok,false);
eq(validateRequest({visualMode:'REPRESENTATIVE',asset:candy,inferCountFromImage:true},contract).ok,false);
eq(validateRequest({visualMode:'DECORATIVE'},contract).ok,true);
eq(validateRequest({visualMode:'DECORATIVE',expectedVisualCount:3},contract).ok,false);
eq(validateRequest({visualMode:'EXACT_COUNT',asset:a,visualIntent:'DIRECT_VISUAL_COUNT',expectedVisualCount:5,countedUnit:'quả'},contract).ok,true);
eq(validateRequest({visualMode:'EXACT_COUNT',asset:a,visualIntent:'DIRECT_VISUAL_COUNT',expectedVisualCount:81,countedUnit:'quả'},contract).ok,false);
eq(validateRequest({visualMode:'EXACT_COUNT',asset:a,expectedVisualCount:5,countedUnit:'quả'},contract).ok,false);
eq(validateRequest({visualMode:'EXACT_COUNT',asset:a,visualIntent:'DIRECT_VISUAL_COUNT',expectedVisualCount:5,countedUnit:'con'},contract).ok,false);
const book=contract.assets.find(x=>x.assetId==='books');
eq(validateRequest({visualMode:'EXACT_COUNT',asset:{assetId:'books',semanticApproval:'OWNER_SEMANTIC_APPROVED',sourceSha256:book.sourceSha256},visualIntent:'DIRECT_VISUAL_COUNT',expectedVisualCount:3,countedUnit:'bộ'},contract).ok,false);
const tamper=structuredClone(policy);tamper.currentB20.questionModes[15].visualMode='EXACT_COUNT';
eq(verifyB20Policy(tamper,pack).ok,false);
const tamper2=structuredClone(policy);tamper2.featureActivation=true;
eq(verifyB20Policy(tamper2,pack).ok,false);
const absent=policy.futureLessons;eq(absent.map(x=>x.lessonId),['toan_b21','toan_b24']);
ok(absent.every(x=>x.status==='NOT_CLASSIFIED_SOURCE_PACK_NOT_VERIFIED'&&x.runtime===false));
console.log('PASS '+n+'/'+n+' assertions; 30 B20 questions classified without modifications; representative-count isolation and B21/B24 protected');
