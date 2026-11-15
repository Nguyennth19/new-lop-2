'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const qa=require('./e2e-resource-tts-pipeline.cjs');
const {create}=require('../g7-4-choice-reference-v11/choice-v11-speech.js');
const {run,loadProducer}=require('../g7-6-b2/real-producer-bridge.cjs');
const {createExperimentalProducer}=require('../g7-6-b3/p06-e04-experimental-producer.cjs');
const {resolvePublic}=require('../g7-6-b5a/e04-producer-contract.cjs');
let checks=0;const eq=(x,y,m)=>{assert.deepStrictEqual(x,y,m);checks++};
const yes=(x,m)=>{assert.ok(x,m);checks++};
function denied(x,code){eq(x.ok,false);eq(x.code,code)}
const root=process.argv[2];if(!root)throw Error('PINNED_P06_ROOT_REQUIRED');
const real=loadProducer(root);yes(real.ok);
const dataPath=path.resolve(__dirname,'../g7-6-b3/generated/public-samples.json');
const sample=JSON.parse(fs.readFileSync(dataPath,'utf8'));
const baseline=run(root);yes(baseline.ok);
eq(baseline.composed.generated,8);eq(baseline.choice.generated,2);
const result=qa.integratePublicData(sample);
if(!result.ok)console.error('B5B_PRODUCER_CASE_DIAGNOSTIC',sample.cases.map(x=>({id:x.id,typeId:x.typeId,prompt:x.nativePlan?.prompt,code:qa.assembleCase(x).code})));yes(result.ok,'real public samples assembled: '+result.code);
eq(result.cases.length,14);
eq(result.resources.registryCount,12);
eq(result.resources.assetMetadataCount,288);
eq(result.resources.fluentStagingCount,46);
eq(result.resources.runtimeEnabled,false);
eq(result.resources.approvedFullRuntimeAssets,0);
eq(result.gasDeployed,false);eq(result.trustedGraderConnected,false);
eq(result.audibleTtsTested,false);eq(result.studentDataWritten,false);
eq(result.releaseReady,false);
eq(result.counts,{total:14,p06E03:8,p06E02:2,e04Lab:4});
const tally={};for(const x of result.cases){tally[x.typeId]=(tally[x.typeId]||0)+1;
 eq(x.ok,true);eq(x.asset.imageAutoLoaded,false);eq(x.asset.fluentFallback,false);
 eq(x.speech.enabledByDefault,false);eq(x.speech.audioPlayed,false);
 const source=sample.cases.find(v=>v.id===x.id);
 const extracted=qa.visibleSpeechText(x.typeId,source.nativePlan);
 yes(extracted.ok,'source visible-only prompt: '+x.id);
 eq(x.speech.requestedText,extracted.text);
 eq(x.speech.source,'VISIBLE_PROMPT_ONLY');eq(x.releaseReady,false);
 eq(x.studentWritesAllowed,false);eq(x.gradingEnabled,false);
 yes(!JSON.stringify(x).includes('answerSpec'),'no answer in receipt');
}
eq(tally,{D2:2,D4:2,MENTAL_INPUT_TEST_EXTENSION:6,D5:2,D9:2});
eq(result.cases.filter(x=>x.typeId==='D9').every(x=>x.asset.exactQuantity.length===2),true);
eq(result.cases.filter(x=>x.typeId==='D5').every(x=>x.visual==='PARAMETRIC_SVG_FROM_PUBLIC_GEOMETRY'),true);
denied(qa.validateAssetRequest({assetId:'KL_SH01_001',quantity:4,role:'EXACT_COUNT'}),'STUDENT_ASSET_ROLE_NOT_APPROVED');
denied(qa.validateAssetRequest({assetId:'KL_SH01_001',quantity:0,role:'DECORATIVE'}),'ASSET_REGISTERED_METADATA_ONLY_RUNTIME_BINDING_PENDING');
denied(qa.validateAssetRequest({assetId:'NOT_PRESENT',quantity:0,role:'DECORATIVE'}),'UNREGISTERED_ASSET_ID');
denied(qa.validateAssetRequest({assetId:'../../unsafe',quantity:0,role:'DECORATIVE'}),'INVALID_ASSET_ID');
denied(qa.speechForPublicPrompt(''),'INVALID_VISIBLE_SPEECH_TEXT');
denied(qa.speechForPublicPrompt('Đọc <script>alert(1)</script>'),'INVALID_VISIBLE_SPEECH_TEXT');
denied(qa.speechForPublicPrompt('Câu hỏi',{profileId:'FAKE_LANGUAGE'}),'VOICE_PROFILE_NOT_IN_PINNED_MANIFEST');
const clone=structuredClone(sample);
clone.cases[0].nativePlan.answerSpec={value:5};
denied(qa.integratePublicData(clone),'PRIVATE_FIELD_IN_PUBLIC_PLAN');
const badCount=structuredClone(sample);
const d9=badCount.cases.find(x=>x.typeId==='D9');
d9.nativePlan.rows[0].itemCount=1000;
denied(qa.integratePublicData(badCount),'PICTOGRAPH_COUNT_INVALID');
const forged=structuredClone(sample);
forged.cases.find(x=>x.typeId==='D5').origin='P06_E03_REAL';
denied(qa.integratePublicData(forged),'SOURCE_TYPE_PROVENANCE_DRIFT');
const bypass=structuredClone(sample);
bypass.assetRuntimeEnabled=true;
denied(qa.integratePublicData(bypass),'PUBLIC_PRODUCER_RECEIPT_INVALID');
const repeated=structuredClone(sample);
repeated.cases[1].id=repeated.cases[0].id;
denied(qa.integratePublicData(repeated),'TYPE_COVERAGE_OR_ID_DRIFT');
// Check real sidecar output through B5-A policy contract, not just fixture JSON.
const seeded=createExperimentalProducer({sha:real.sha,registry:real.generator.policyRegistry});
yes(seeded.ok);
for(const [mode,seed] of [['D5_TANGRAM','B5B_QA_D5'],['D9_COMPARE_DIFFERENCE','B5B_QA_D9']]){
 const q=seeded.generate({mode,seed});
 yes(q.ok);
 const projection=resolvePublic(q,seeded);
 yes(projection.ok,'B5A validated real seed '+mode+': '+projection.code);
 eq(projection.releaseReady,false);
 eq(projection.receipt.curriculumMapped,false);
 const projected=qa.assembleCase({id:'generated_b5b_'+mode,origin:'B3_E04_SEPARATE_SEEDED_GENERATOR_PENDING_POLICY',
  typeId:projection.typeId,nativePlan:projection.publicPlan});
 yes(projected.ok,'render/asset/speech on new E04 seed '+mode+': '+projected.code);
}
// Browser TTS mock proves requesting != actual sound.
// It must not speak automatically when the adapter is created.
let spoken=[],cancelled=0;
function Utterance(text){this.text=text}
const audio=create({speechSynthesis:{speak:u=>spoken.push(u),cancel:()=>cancelled++},
 SpeechSynthesisUtterance:Utterance});
eq(audio.supported,true);eq(spoken.length,0);
const speak=qa.speechForPublicPrompt(result.cases[0].speech.requestedText);
yes(speak.ok);
const cmd=audio.speak(speak.requestedText,speak.locale);
eq(cmd.ok,true);eq(cmd.status,'REQUESTED_NOT_PLAYBACK_CONFIRMED');
eq(spoken.length,1);eq(spoken[0].lang,'vi-VN');
eq(spoken[0].text,speak.requestedText);
eq(audio.stop().ok,true);
audio.dispose();
eq(audio.speak('Tính: 1 + 1 = ?').reason,'DISPOSED');
const unavailable=create({});
eq(unavailable.supported,false);
eq(unavailable.speak('Xin chào').reason,'TTS_UNAVAILABLE');
// Load the ACTUAL pinned V2 normalizer from the separately checked-out source.
const speechRoot=process.argv[3];
if(!speechRoot)throw Error('PINNED_G75_V2_SOURCE_CHECKOUT_REQUIRED');
const externalSpeech=require(path.resolve(speechRoot,'thu-nghiem/g7-5-vietnamese-tts/compat-v2/G75_MathSpeechNormalizer_V2.js'));
eq(typeof externalSpeech.normalize,'function');
eq(typeof externalSpeech.segments,'function');
eq(qa.policy.speech.sourceCommit,'c9880bfc56aec0cfc4ea7f788983bcc3761d7b48');
for(const item of result.cases){
 const normalized=externalSpeech.normalize(item.speech.requestedText,{lang:'vi-VN',context:'math'});
 yes(typeof normalized==='string'&&normalized.length>0,'G75 V2 normalized public '+item.id);
 yes(!/answerSpec|answerKey|gradingKey|teacherSolution/i.test(normalized),'no speech of hidden fields');
 if(item.typeId==='MENTAL_INPUT_TEST_EXTENSION'){
  yes(normalized.includes(' cộng '),'V2 must speak math plus word');
  yes(normalized.includes('bằng mấy'),'V2 must articulate result question without answer');
 }
 const segments=externalSpeech.segments(item.speech.requestedText,{lang:'vi-VN',context:'math'});
 yes(segments.length>=1,'V2 segments of real prompt');
 yes(segments.every(x=>x.text&&x.profile&&typeof x.rate==='number'),'V2 prosody planned');
}
eq(externalSpeech.normalize('10 + 25 = ?',{lang:'vi-VN',context:'math'}),'10 cộng 25 bằng mấy?');
eq(externalSpeech.normalize('10 + 25 = ?',{lang:'en-US',context:'math'}),'10 + 25 = ?');
const dir=process.env.G76B5B_OUTPUT_DIR;
if(dir){
 fs.mkdirSync(dir,{recursive:true});
 const receipt={schemaVersion:'g76b5b.offline-e2e-qa-receipt.v1',status:'PASS_TECHNICAL_PUBLIC_SOURCE_NO_SPEECH_AUDIO',
  sourceP06Sha:real.sha,counts:result.counts,assetMetadataCount:288,fluentSVGStaging:46,
  caseSummaries:result.cases.map(x=>({id:x.id,origin:x.origin,typeId:x.typeId,rendererId:x.renderer,
   visual:x.visual,voiceProfileId:x.speech.profileId,ttsTextPrepared:true,ttsAudioPlayed:false,
   countEvidence:x.asset.exactQuantity,assetAutoLoaded:false,gradingEnabled:false})),
  assertions:checks,releaseReady:false,ownerVoiceSignoff:'PENDING',curriculumE04:'BLOCKED',
  gasDeploy:false,studentWrites:false};
 fs.writeFileSync(path.join(dir,'e2e-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
}
console.log('G76B5B_PUBLIC_PRODUCER_ASSET_TTS_E2E_PASS',checks,
 'assertions; 14 actual producer cases; 288 metadata only; 46 Fluent staged;',
 'safe visible-prompt voice request tested with mock, AUDIO_NOT_HEARD; no app deploy');
