'use strict';
/* G7.6-B isolated cross-type contract/renderer regression. No GAS/no scoring. */
const assert=require('node:assert/strict');
const {readMatrix,checkMatrix,projectPublic,nativeFromPublic,adapt}=require('./variant-adapter-bridge.cjs');
const {loadManifest}=require('./resource-renderer-resolver.cjs');
const matrix=readMatrix(),manifest=loadManifest();
let assertions=0;
function same(a,b,m){assert.deepStrictEqual(a,b,m);assertions++}
function yes(a,m){assert.ok(a,m);assertions++}
function code(result,expected){same(result.ok,false,expected);same(result.code,expected)}
function fixture(typeId,values,options={}){
 const row=matrix.adapters.find(x=>x.typeId===typeId);
 const source={lessonId:'toan_b21',typeId,variantId:'V_'+typeId,mode:'PRACTICE',
  scope:'G76_TYPED_TEST_FIXTURE',question:{id:'Q_'+typeId,prompt:'Quan sát rồi thực hiện.',
   kind:row.sourceKind,renderer:{component:row.sourceKind},publicParameters:values},
  ...options};
 return source;
}
same(checkMatrix(matrix,manifest).ok,true);
same(matrix.adapters.length,12);
same(new Set(matrix.adapters.map(x=>x.sourceKind)).size,12);
same(matrix.release.ready,false);
same(matrix.release.gasDeployAllowed,false);
same(matrix.p06.copiedIntoG76,false);
same(matrix.visualPolicy.fluentAutoFallback,false);
const cases={
 D1:{a:8,b:5,dm:1,m:1},
 D3:{leftIds:['L1','L2'],leftTexts:['1+1','3+1'],rightIds:['R1','R2'],rightTexts:['2','4'],relationMode:'SINGLE_RELATION'},
 D5:{shapeIds:['s1','s2'],shapeLabels:['Hình vuông','Hình chữ nhật'],
  shapeTypes:['square','rect'],shapeX:[10,110],shapeY:[10,20],shapeW:[50,80],shapeH:[50,40]},
 D6:{sortMode:'SORT',itemIds:['a','b'],itemLabels:['Táo','Chuối'],
  groupIds:['g1','g2'],groupLabels:['Nhóm A','Nhóm B']},
 D7:{rowIds:['r1','r2'],leftTexts:['3','4'],rightTexts:['5','2'],hintPolicy:'HIDDEN'},
 D8:{measureMode:'RULER',segmentStart:40,segmentEnd:160,pixelsPerUnit:20,
  rulerUnits:10,initialZero:40,unit:'cm'},
 D8A:{itemIds:['jug1','jug2'],itemLabels:['Bình A','Bình B'],
  capacityLiters:[5,4],currentLiters:[3,2]},
 D8B:{itemIds:['left','right'],itemLabels:['Bên trái','Bên phải'],massKg:[3,5]},
 D9:{rowIds:['r1','r2'],rowLabels:['Táo','Chuối'],rowSymbols:['🍎','🍌'],
  itemCounts:[3,5],questionRowId:'r1'}
};
for(const [id,p] of Object.entries(cases)){
 const res=adapt(fixture(id,p));
 yes(res.ok,id+' source accepted: '+res.code+' '+res.detail);
 same(res.envelope.typeId,id);
 same(res.selection.renderer.id,id);
 yes(res.nativeRenderer.plan,'native reference plan '+id);
 same(res.selection.releaseReady,false);
 same(res.nativeRenderer.originalRendererModified,false);
 same(res.nativeRenderer.gradingEnabled,false);
 same(res.nativeRenderer.assetBindingAllowed,false);
 same(res.nativeRenderer.ttsExecuted,false);
 same(res.sourceEvidence.startsWith('FIXTURE_ONLY'),true);
 const serial=JSON.stringify(res);
 for(const forbidden of ['answerSpec','answerKey','correctOptionValue','correctStatementId','gradingKey','prefilledSolution','isCorrect'])
  same(serial.includes('"'+forbidden+'"'),false,'public leak '+id+' '+forbidden);
}
const d8clock=adapt(fixture('D8',{measureMode:'CLOCK',initialHour:10,initialMinute:45,minuteStep:5}));
yes(d8clock.ok,'D8 clock public contract');
same(d8clock.nativeRenderer.plan.model.initialHour,10);
const d6order=adapt(fixture('D6',{sortMode:'ORDER',itemIds:['a','b'],itemLabels:['1','2']}));
yes(d6order.ok,'D6 ORDER branch');
const d2=(a,b,kind='ADD',more={})=>({
 lessonId:'toan_b21',variantId:'COL_B21_001',typeId:'D2',scope:'P06_GENERATOR_CANDIDATE_OFFLINE',
 mathKind:kind,question:{id:'VAR_B21_E_001',kind:'math.vertical',renderer:{component:'math.vertical'},
  levelId:'LV2',prompt:'Tính: '+a+(kind==='ADD'?' + ':' - ')+b+' = ?',
  parameters:{a,b},assets:{sceneId:null,usage:'decorative'},
  answerSpec:{mode:'exact',value:kind==='ADD'?a+b:a-b,proof:{operation:'add',operands:[a,b]}}},...more
});
const p06=adapt(d2(67,3));
yes(p06.ok,'native P0.6 column project');
same(p06.envelope.display.publicParameters.a,67);
same(p06.envelope.display.publicParameters.profile,'PV100');
same(p06.nativeRenderer.plan.profile,'PV100');
same(JSON.stringify(p06).includes('answerSpec'),false);
same(JSON.stringify(p06).includes('"value":70'),false);
yes(adapt(d2(268,37)).ok,'PV1000 3-column supported');
code(adapt(d2(999,1)),'COLUMN_1000_BOUNDARY_PENDING');
code(adapt(d2(2,9,'SUBTRACT')),'COLUMN_1000_BOUNDARY_PENDING');
const choice={lessonId:'toan_b21',variantId:'V_CHOICE_001',typeId:'D4',
 scope:'P06_GENERATOR_CANDIDATE_OFFLINE',
 question:{id:'VAR_B21_CHOICE_001',kind:'math.mental',
  renderer:{component:'math.mental'},prompt:'67 + 3 bằng bao nhiêu?',
  parameters:{a:67,b:3},answerSpec:{value:70,proof:{operands:[67,3]}}},
 variant:{interaction:{to:'CHOICE',optionValues:[69,70,71],correctOptionValue:70}},
 speech:{enabled:true,profileId:'vi_math_v12_stable'}};
const d4=adapt(choice);
yes(d4.ok,'P06 choice view with separately private answer');
same(d4.envelope.display.visibleChoices.map(x=>x.text),['69','70','71']);
same(d4.selection.voice.profileId,'vi_math_v12_stable');
same(JSON.stringify(d4).includes('correctOptionValue'),false);
same(JSON.stringify(d4).includes('answerSpec'),false);
code(adapt({...choice,variant:{interaction:{to:'NUMBER_INPUT',optionValues:[69,70,71]}}}),'P06_CHOICE_INTERACTION_REQUIRED');
code(adapt({...choice,variant:{interaction:{to:'CHOICE',optionValues:[70,70]}}}),'P06_VISIBLE_OPTIONS_INVALID');
code(adapt({...choice,question:{...choice.question,kind:'math.vertical'}}),'SOURCE_KIND_RENDERER_MISMATCH');
code(adapt({...fixture('D3',cases.D3),scope:'P06_GENERATOR_CANDIDATE_OFFLINE'}),'P06_GENERATOR_MAPPING_NOT_VERIFIED');
code(adapt({...fixture('D3',cases.D3),question:{...fixture('D3',cases.D3).question,
 publicParameters:{...cases.D3,answerKey:['L1','R1']}}}),'PUBLIC_PARAMETER_NOT_ALLOWLISTED');
code(adapt({...fixture('D5',cases.D5),assetId:'ANY_IMAGE'}),'ASSET_BINDING_NOT_APPROVED');
code(adapt({...fixture('D5',cases.D5),visualIntent:{assetId:'ANY_IMAGE'}}),'ASSET_BINDING_NOT_APPROVED');
code(adapt({...fixture('D8A',cases.D8A),question:{...fixture('D8A',cases.D8A).question,
 assets:{sceneId:'CLIENT_ID'}}}),'ASSET_BINDING_NOT_APPROVED');
code(adapt({...fixture('D1',cases.D1),speech:{enabled:true,profileId:'unregistered'}}),'VOICE_PROFILE_NOT_APPROVED');
code(adapt({...fixture('D1',cases.D1),speechText:'Hidden result 13'}),'UNTRUSTED_SPEECH_TEXT');
code(adapt(fixture('D9',{...cases.D9,rowSymbols:['https://untrusted','🍌']})),'D9_COUNT_SAFE_SYMBOL_OR_QUANTITY_DENIED');
code(adapt(fixture('D9',{...cases.D9,itemCounts:[3,41]})),'D9_COUNT_SAFE_SYMBOL_OR_QUANTITY_DENIED');
code(adapt(fixture('D8B',{...cases.D8B,massKg:[3,-5]})),'NATIVE_D8B_REJECTED');
code(adapt(fixture('D1',{...cases.D1,a:2,b:3})),'NATIVE_D1_REJECTED');
code(adapt(fixture('D3',{...cases.D3,leftIds:['L1','L1']})),'NATIVE_D3_REJECTED');
code(adapt({...d2(67,3),mode:'RELEASE'}),'P06_SOURCE_CONTRACT_INVALID');
code(adapt({...d2(67,3),question:{...d2(67,3).question,assets:{sceneId:'S1'}}}),'ASSET_BINDING_NOT_APPROVED');
code(adapt({lessonId:'toan_b21',variantId:'V_WORD_1',typeId:'D10',scope:'P06_GENERATOR_CANDIDATE_OFFLINE',
 question:{id:'Q_WORD_1',kind:'math.word_problem',renderer:{component:'math.word_problem'},
 prompt:'Có 3 quả táo, thêm 2 quả. Có bao nhiêu?'}}),'D10_EXISTING_G6_ONLY_NEW_VARIANT_ROUTE_DENIED');
const mutated=structuredClone(matrix);mutated.release.gasDeployAllowed=true;
code(projectPublic(fixture('D1',cases.D1),{matrix:mutated,manifest}),'MATRIX_INVALID');
const leaked={...p06.envelope,display:{...p06.envelope.display,
 publicParameters:{...p06.envelope.display.publicParameters,solution:'70'}}};
code(nativeFromPublic(leaked),'FORBIDDEN_OR_CYCLIC_PUBLIC_FIELD');
const core=require('../g7-4-capacity-weight-reference-v11/capacity-weight-v11-core.js');
const tilt=core.balanceTilt(3,5);
same(tilt.relation,'LEFT_LIGHTER');yes(tilt.leftY<tilt.rightY,'3kg pan above 5kg pan');
console.log('G76B_VARIANT_ADAPTER_QA_PASS',assertions,'assertions; 11 positive type routes + D10 fail-closed; P06 D2/D4 source projection; no GAS');
