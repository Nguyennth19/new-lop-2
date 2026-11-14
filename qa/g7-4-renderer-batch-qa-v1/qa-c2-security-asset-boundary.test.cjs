'use strict';
/* QA-C2: no silent Asset ID, TTS/answer exposure or actual grading route. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const BASE=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(BASE,p),'utf8');
const cw=require('../g7-4-capacity-weight-reference-v11/capacity-weight-v11-core.js');
const {createOfflineHandoff}=require('./qa-e-d10-offline-handoff.cjs');
const fixture=require('../g7-4-word-problem-unification-v11/word-unification-v11-fixtures.js');
let n=0;const eq=(a,b,msg)=>{assert.deepStrictEqual(a,b,msg);n++},ok=(v,msg)=>{assert.ok(v,msg);n++};
const inv=JSON.parse(read('qa/g7-4-capacity-weight-reference-v11/asset-inventory.v11.json'));
ok(inv.entries.length>0,'asset inventory exists');
eq(inv.entries.filter(x=>x.approvedAssetId).length,0,'no approved IDs; do not fake mappings');
for(const entry of inv.entries)eq(entry.status,'FOUND_SOURCE_PNG_UNMAPPED','not semantically approved yet');
const tilt=cw.balanceTilt(3,5);eq(tilt.relation,'LEFT_LIGHTER');ok(tilt.leftY<tilt.rightY,'3kg pan higher on SVG Y axis');
eq(cw.balanceTilt(5,3).relation,'RIGHT_LIGHTER');eq(cw.balanceTilt(5,5).relation,'BALANCED');
const liter=cw.compile({exerciseId:'C2LITER',mode:'LITER',prompt:'Kiểm tra dung tích',
 containers:[{id:'L',label:'Bình trái',currentLiters:3,capacityLiters:10,assetId:null},{id:'R',label:'Bình phải',currentLiters:5,capacityLiters:10,assetId:null}]});
ok(liter.ok,'render liter plan without approved asset');
ok(liter.plan.items.every(x=>!x.assetId),'no unauthorized image injected');
const weight=cw.compile({exerciseId:'C2WEIGHT',mode:'WEIGHT',prompt:'So sánh hai bên cân',
 pans:[{id:'L',label:'3 kg',massKg:3,assetId:null},{id:'R',label:'5 kg',massKg:5,assetId:null}]});
ok(weight.ok,'weight plan');ok(weight.plan.items.every(x=>!x.assetId),'no invented asset mapping');
const legacyAdapter=read('42_AdapterBienTheB20.html'),legacyGrader=read('26_ChamCauHoiToan.html');
ok(legacyAdapter.includes('answer:String(q.answer)'), 'legacy B20 leak still exists, cannot sign off');
ok(legacyGrader.includes('Number(q.answer)'), 'legacy G6 client-side grader still uses answer');
const priv={lessonId:'QA_C2_LESSON',questionId:'QA_C2_WORD_001',mode:'SELECT_STATEMENT',
 purpose:'ASSESSMENT',sourceRole:'DEMO_TEST_REFERENCE',calculationSteps:1,prompt:fixture.rice.prompt,summary:fixture.rice.summary,unit:'kg',
 statementOptions:fixture.rice.statementOptions,correctStatementId:'st1',operation:'SUBTRACT',a:36,b:12,expectedAnswer:24,
 pedagogyApproval:{status:'APPROVED_BY_TEACHER',evidenceRef:'QA_TEST_FIXTURE_ONLY_NOT_REAL_SIGNOFF'}};
const service=createOfflineHandoff([priv]),r=service.publish(priv.questionId);
ok(r.ok,'private service compiles public question');eq(service.validateProjection(r).ok,true,'projection clean');
const raw=JSON.stringify(r.publicQuestion);for(const key of ['answer','expectedAnswer','correctStatementId','n1','n2','op','solution'])ok(!Object.hasOwn(r.publicQuestion,key),'no public key '+key);
eq(service.validateProjection({...r,publicQuestion:{...r.publicQuestion,answer:'24'}}).code,'CLIENT_ANSWER_FIELD_LEAK');
const request={lessonId:priv.lessonId,questionId:priv.questionId,mode:'SELECT_STATEMENT',selectedStatementId:'st1',fields:{n1:'36',op:'-',n2:'12',sum:'24',answer:'24'}};
eq(service.gradeOffline(request).correct,true);eq(service.gradeOffline({...request,fields:{...request.fields,answer:'25'}}).correct,false);
eq(service.gasIntegrated,false);eq(service.studentDataWrites,false);
console.log('QA-C2 ASSET D8A/D8B + D10 OFFLINE BOUNDARY PASS',n,'assertions; ASSET IDs UNMAPPED; G6 LEGACY CLIENT LEAK BLOCKED; NO GAS');
