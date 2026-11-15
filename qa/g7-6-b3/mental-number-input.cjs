'use strict';
/* G7.6-B.3 TEST surface for real P0.6 math.mental NUMBER_INPUT.
 * This is an ADDITIONAL scoped renderer, not D1/D4 and not part of the pinned 12.
 * Does not grade, expose teacher keys, write progress, or approve its own registration.
 */
const validObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const fail=(code)=>({ok:false,code,releaseReady:false});
const PINNED_KIND='math.mental';
function projectMental(q,{lessonId,policy,source='P06_E03_REAL_COMPOSER'}={}){
 if(!validObj(q)||q.kind!==PINNED_KIND||q.renderer?.component!==PINNED_KIND||
    !/^VAR_TOAN_B21_G_[a-f0-9]{12}$/.test(q.id||'')||
    !['LV1','LV2','LV3'].includes(q.levelId)||
    lessonId!=='toan_b21'||!validObj(policy)||policy.lessonId!==lessonId||
    policy.status!=='DRAFT_OWNER_SIGNOFF_PENDING')return fail('MENTAL_P06_PROVENANCE_INVALID');
 const p=q.parameters;
 if(!validObj(p)||Object.keys(p).sort().join(',')!=='a,b'||!Number.isSafeInteger(p.a)||
    !Number.isSafeInteger(p.b)||p.a<policy.mathConstraints.minOperand||
    p.b<policy.mathConstraints.minOperand||p.a>policy.mathConstraints.maxOperand||
    p.b>policy.mathConstraints.maxOperand||p.a+p.b<policy.mathConstraints.minResult||
    p.a+p.b>policy.mathConstraints.maxResult||
    (policy.mathConstraints.requireCarry===true&&(p.a%10+p.b%10)<10))
  return fail('MENTAL_OPERANDS_POLICY_DENIED');
 const exact='Tính: '+p.a+' + '+p.b+' = ?';
 if(q.prompt!==exact||q.assets?.sceneId!==null||q.assetId!==undefined||
    (q.lessonId!==undefined&&q.lessonId!==lessonId)||
    (q.answerSpec?.mode!=='exact'||q.answerSpec?.pedagogyApproval?.status!=='PENDING'))
  return fail('MENTAL_SOURCE_PROMPT_OR_ASSET_INVALID');
 // Public projection is built FROM WHITELISTED fields; no copying answerSpec, proof, verifier.
 return {ok:true,origin:source,releaseReady:false,sourceScope:'P06_REAL_PRODUCER_OFFLINE_ONLY',
  publicPlan:{schemaVersion:'g76b3.mental-number-input.v1',lessonId,questionId:q.id,
   skillFamily:'ADD_CARRY_REVIEW',typeId:'MENTAL_INPUT_TEST_EXTENSION',
   mode:'PRACTICE',prompt:exact,
   operands:{a:p.a,b:p.b,operator:'+'},
   input:{kind:'NUMBER_INPUT',inputMode:'numeric',maxLength:3,allowNegative:false},
   rendererRegistration:'PENDING_G76_MANIFEST_OWNER_APPROVAL',
   voice:{profileId:'vi_math_v12_stable',enabled:false},
   assetId:null,gradingEnabled:false,serverGradingConnected:false,
   answerKeyIncluded:false,progressWritesAllowed:false,starWritesAllowed:false,
   releaseReady:false}};
}
module.exports={projectMental};
