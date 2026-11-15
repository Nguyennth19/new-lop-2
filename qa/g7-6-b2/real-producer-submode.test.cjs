'use strict';
/* Actual pinned P0 source + isolated submodes. Generates ONLY public browser evidence. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {run,PINNED_P06}=require('./real-producer-bridge.cjs');
const {adaptSubmode,geometryJSON}=require('./submode-bridge.cjs');
const {adapt}=require('../g7-6/variant-adapter-bridge.cjs');
let assertions=0;
const eq=(a,b,m)=>{assert.deepStrictEqual(a,b,m);assertions++};
const yes=(v,m)=>{assert.ok(v,m);assertions++};
const denied=(r,c)=>{eq(r.ok,false,c);eq(r.code,c)};
const p0Root=process.argv[2];
if(!p0Root)throw Error('PINNED_P06_CHECKOUT_PATH_REQUIRED');
const real=run(p0Root);
yes(real.ok,'real P0.6 pipeline must pass, received '+JSON.stringify(real).slice(0,250));
eq(real.provenance.sha,PINNED_P06);
eq(real.provenance.execution,'NATIVE_SOURCE_LOADED_FROM_SEPARATE_PINNED_CHECKOUT_NOT_COPIED');
eq(real.composed.generated,8);
yes(real.composed.routed.length>=1,'real E03 vertical');
yes(real.composed.denied.length>=1,'do not silently map P06 math.mental NUMBER_INPUT');
eq(real.composed.routed.length+real.composed.denied.length,real.composed.generated);
eq(real.choice.generated,2);
eq(real.choice.routed.length,2);
eq(real.scope,'ISOLATED_TEST_ONLY');
eq(real.releaseReady,false);
eq(real.trustedGraderConnected,false);
for(const x of [...real.composed.routed,...real.choice.routed]){
 yes(x.ok,'native P0.6 projection');
 yes(x.nativeRenderer.plan,'native renderer from real P06');
 eq(x.releaseReady,false);
 eq(x.nativeRenderer.gradingEnabled,false);
 eq(x.nativeRenderer.assetBindingAllowed,false);
 eq(x.nativeRenderer.ttsExecuted,false);
 yes(!x.envelope.display.publicParameters.answerSpec,'private key not in public parameters');
 const text=JSON.stringify(x);
 for(const k of ['answerSpec','correctOptionValue','gradingKey','isCorrect','teacherSolution','correctAnswer'])
  yes(!text.includes('"'+k+'"'),'no private key serialized '+k);
}
const poly=points=>JSON.stringify({type:'polygon',points});
const rect=(x,y,width,height)=>JSON.stringify({type:'rect',x,y,width,height});
function fixture(typeId,parameters,mode='PRACTICE'){
 const kind=typeId==='D5'?'g76.fixture.d5':'g76.fixture.d9';
 return {lessonId:'toan_b21',variantId:'B2_'+typeId,scope:'G76_TYPED_TEST_FIXTURE',
  typeId,mode,question:{id:'Q_B2_'+typeId,kind,renderer:{component:kind},
    prompt:typeId==='D5'?'Chọn mảnh, xoay và đặt vào khung.':'Hàng thứ nhất nhiều hơn hàng thứ hai bao nhiêu?',publicParameters:parameters}};
}
const geoParams={
 submode:'TANGRAM',
 pieceIds:['roof','wall','tree'],pieceLabels:['Mái nhà','Thân nhà','Tán cây'],
 pieceGeometryJson:[poly([[0,-45],[60,25],[-60,25]]),rect(-45,-70,90,90),poly([[0,-50],[45,20],[-45,20]])],
 pieceStartX:[65,65,65],pieceStartY:[55,135,215],pieceRotations:[90,0,180],
 targetIds:['target_roof','target_wall','target_tree'],
 targetGeometryJson:[poly([[190,25],[250,95],[130,95]]),rect(145,95,90,90),poly([[330,95],[375,165],[285,165]])]
};
const geo=adaptSubmode(fixture('D5',geoParams));
yes(geo.ok,'Tangram compiled from flat public envelope: '+geo.code+' '+geo.detail);
eq(geo.nativeRenderer.plan.mode,'TANGRAM');
eq(geo.nativeRenderer.plan.items.length,3);
eq(geo.nativeRenderer.plan.targets.length,3);
eq(geo.nativeRenderer.gradingEnabled,false);
const gCore=require('../g7-4-geometry-tangram-reference-v11/geometry-v11-core.js');
const gSession=gCore.session(geo.nativeRenderer.plan);
yes(gSession.selectPiece('roof').ok);
yes(gSession.rotatePiece('roof',90).ok);
yes(gSession.placePiece('roof','target_roof').ok);
eq(gSession.snapshot().pieces.roof.placedTargetId,'target_roof');
eq(gSession.snapshot().pieces.roof.rotation,180);
yes(gSession.clear().ok);
const pParams={rowIds:['r1','r2'],rowLabels:['Táo','Chuối'],
 rowSymbols:['🍎','🍌'],itemCounts:[7,4],questionRowId:'r1',
 questionType:'COMPARE_DIFFERENCE',otherRowId:'r2',relation:'MORE_THAN'};
const pic=adaptSubmode(fixture('D9',pParams));
yes(pic.ok,'pictograph difference native compilation: '+pic.code+' '+pic.detail);
eq(pic.nativeRenderer.plan.questions[0].type,'COMPARE_DIFFERENCE');
eq(pic.nativeRenderer.plan.questions[0].otherRowId,'r2');
eq(pic.nativeRenderer.countRuntimeApproved,false);
const pCore=require('../g7-4-pictograph-reference-v11/pictograph-v11-core.js');
const pSession=pCore.session(pic.nativeRenderer.plan);
yes(pSession.tap('r1',0).ok);
yes(pSession.tap('r2',0).ok);
eq(pSession.snapshot().countedIndices.r1,[0]);
yes(pSession.setAnswer('q_1','3').ok); // student draft, NOT a grading assertion
eq(pSession.snapshot().enteredAnswers.q_1,'3');
const assessment=adaptSubmode(fixture('D9',pParams,'ASSESSMENT'));
yes(assessment.ok,'assessment mode does not carry example row');
eq(assessment.nativeRenderer.plan.demoRowId,null);
const invalidGeometry={...geoParams,pieceGeometryJson:[JSON.stringify({...JSON.parse(geoParams.pieceGeometryJson[0]),solution:'hidden'}),...geoParams.pieceGeometryJson.slice(1)]};
denied(adaptSubmode(fixture('D5',invalidGeometry)),'D5_TANGRAM_INVALID_GEOMETRY');
denied(adaptSubmode(fixture('D5',{...geoParams,pieceStartX:[3000,65,65]})),'D5_TANGRAM_INVALID_GEOMETRY');
denied(adaptSubmode(fixture('D5',{...geoParams,pieceIds:['roof','roof','tree']})),'D5_TANGRAM_CARDINALITY_OR_ID');
denied(adaptSubmode(fixture('D9',{...pParams,otherRowId:'r1'})),'D9_COMPARE_RELATION_OR_ROWS');
denied(adaptSubmode(fixture('D9',{...pParams,relation:'UNLISTED'})),'D9_COMPARE_RELATION_OR_ROWS');
denied(adaptSubmode(fixture('D9',{...pParams,itemCounts:[41,4]})),'D9_COUNT_SAFE_SYMBOL_OR_QUANTITY_DENIED');
denied(adaptSubmode({...fixture('D9',pParams),scope:'P06_GENERATOR_CANDIDATE_OFFLINE'}),'P06_SUBMODE_PRODUCER_NOT_SUPPORTED');
denied(adaptSubmode({...fixture('D5',geoParams),question:{...fixture('D5',geoParams).question,publicParameters:{...geoParams,answerKey:'private'}}}),'PUBLIC_PARAMETER_NOT_ALLOWLISTED');
denied(adaptSubmode({...fixture('D5',geoParams),question:{...fixture('D5',geoParams).question,assets:{sceneId:'unverified'}}}),'ASSET_BINDING_NOT_APPROVED');
denied(adaptSubmode({...fixture('D9',pParams),speech:{enabled:true,profileId:'not_approved'}}),'VOICE_PROFILE_NOT_APPROVED');
const tamper=JSON.parse(JSON.stringify(real.composed.routed[0].envelope));
tamper.display.publicParameters.correctAnswer=999;
const {nativeFromPublic}=require('../g7-6/variant-adapter-bridge.cjs');
denied(nativeFromPublic(tamper),'FORBIDDEN_OR_CYCLIC_PUBLIC_FIELD');
eq(geometryJSON(JSON.stringify({type:'rect',x:0,y:0,width:10,height:20})).type,'rect');
eq(geometryJSON('{"type":"text","html":"<svg onload=alert(1)>"}'),null);
// Ensure browser only receives the already projected native reference plans and public strings.
const browser={schemaVersion:'g76b2.chrome-public-fixtures.v1',
 sourceSha:PINNED_P06,source:'ACTUAL_P06_E02_E03_GENERATOR_OUTPUT_FOR_D2_D4',
 scope:'STANDALONE_BROWSER_ONLY_NOT_APP_E2E',releaseReady:false,
 cases:[
  ...real.composed.routed.slice(0,2).map((r,i)=>({id:'p06_column_'+i,typeId:'D2',origin:'P06_E03_REAL',
    envelope:r.envelope,nativePlan:r.nativeRenderer.plan})),
  ...real.choice.routed.map((r,i)=>({id:'p06_choice_'+i,typeId:'D4',origin:'P06_E02_REAL',
    envelope:r.envelope,nativePlan:r.nativeRenderer.plan})),
  {id:'tangram_fixture',typeId:'D5',origin:'B2_TYPED_FIXTURE_NOT_PRODUCER',
    envelope:geo.envelope,nativePlan:geo.nativeRenderer.plan},
  {id:'pictograph_compare_fixture',typeId:'D9',origin:'B2_TYPED_FIXTURE_NOT_PRODUCER',
    envelope:pic.envelope,nativePlan:pic.nativeRenderer.plan}
 ]};
eq(browser.cases.length,6);
for(const x of browser.cases){
 yes(!/answerSpec|correctOptionValue|gradingKey|correctStatementId|isCorrect|teacherSolution/.test(JSON.stringify(x)),
    'no answer key in browser pack '+x.id);
 eq(x.envelope.speech.visiblePromptOnly,true);
}
const evidenceDir=process.env.G76B2_EVIDENCE_DIR;
if(evidenceDir){
 fs.mkdirSync(evidenceDir,{recursive:true});
 const publicText=JSON.stringify(browser,null,2)+'\n';
 fs.writeFileSync(path.join(evidenceDir,'public-samples.json'),publicText);
 fs.writeFileSync(path.join(evidenceDir,'producer-receipt.json'),JSON.stringify({
  schemaVersion:'g76b2.real-producer-qa-receipt.v1',p06Sha:real.provenance.sha,
  composerTotal:real.composed.generated,composerMapped:real.composed.routed.length,
  composerUnmapped:real.composed.denied.length,choiceGenerated:real.choice.generated,
  browserCases:browser.cases.map(x=>({id:x.id,typeId:x.typeId,origin:x.origin})),
  rendererSourcesCopied:false,d10GradingEnabled:false,gasDeploy:false,releaseReady:false,
  assertions,scope:'STANDALONE_TEST'
 },null,2)+'\n');
}
console.log('G76B2_REAL_PRODUCER_SUBMODE_PASS',assertions,
 'assertions; P06 composer',real.composed.generated,'real questions',
 real.composed.routed.length,'native D2; P06 choice',real.choice.routed.length,
 'native D4; Tangram and pictograph comparison fixture-native; no GAS');
