'use strict';
/* V1.2: independent LAB-only synthetic scoring matrix + adversarial contract QA.
 * Never uses a browser answer key or real pupil data.
 */
const assert=require('node:assert/strict');
const {makePack}=require('../universal-template-v1/fixture-packs.cjs');
const grader=require('./trusted-grader.cjs');
const bank=require('./synthetic-private-bank.cjs');
const grants=['D2','D3','D4','D6','D7','D8','D9'];
const denied=['D1','D5','D8A','D8B','D10'];
let assertions=0;
const expect=(cond,msg)=>{assert(cond,msg);assertions++};
const eq=(actual,expected,msg)=>{assert.deepEqual(actual,expected,msg);assertions++};
function good(tag,id){
 const prefix='LAB_'+tag+'_';
 const b=tag==='B',spec=makePack(tag).questions.find(x=>x.rendererId===id).publicVariant;
 switch(id){
 case 'D2':return {variantId:spec.variantId,result_ones:b?'2':'3',result_tens:b?'7':'5',carry_tens:false};
 case 'D3':return {exerciseId:spec.exerciseId,
   pairs:b?{l1:'r2',l2:'r1'}:{l1:'r1',l2:'r2'},selectedLeft:null,completed:2,total:2};
 case 'D4':return {questionId:spec.questionId,selectedOptionIds:['opt2']};
 case 'D6':return {exerciseId:spec.exerciseId,mode:'ORDER',selectedItemId:null,
   placements:b?{n1:'slot_3',n2:'slot_1',n3:'slot_2'}:{n1:'slot_1',n2:'slot_3',n3:'slot_2'}};
 case 'D7':return {exerciseId:spec.exerciseId,activeRowId:'row1',
   selectedSigns:{row1:b?'>':'<',row2:'='},hintsVisible:false};
 case 'D8':return {exerciseId:spec.exerciseId,mode:'RULER',rulerZero:30,enteredLength:b?'9':'7'};
 case 'D9':return {exerciseId:spec.exerciseId,mode:'PRACTICE',countedIndices:{apple:[],orange:[]},
   enteredAnswers:b?{qa:'4',qb:'3'}:{qa:'6',qb:'2'}};
 default:throw Error('UNTESTED '+id);
 }
}
function wrong(tag,id){
 const s=good(tag,id);
 switch(id){
 case 'D2':s.result_ones=s.result_ones==='3'?'4':'3';break;
 case 'D3':s.pairs={l1:s.pairs.l2,l2:s.pairs.l1};break;
 case 'D4':s.selectedOptionIds=['opt1'];break;
 case 'D6':s.placements={n1:s.placements.n2,n2:s.placements.n1,n3:s.placements.n3};break;
 case 'D7':s.selectedSigns.row1=s.selectedSigns.row1==='<'?'>':'<';break;
 case 'D8':s.enteredLength=s.enteredLength==='7'?'8':'7';break;
 case 'D9':s.enteredAnswers.qa=String(Number(s.enteredAnswers.qa)+1);break;
 }
 return s;
}
function incomplete(tag,id){
 const s=good(tag,id);
 switch(id){
 case 'D2':delete s.result_tens;break;
 case 'D3':delete s.pairs.l2;s.completed=1;break;
 case 'D4':s.selectedOptionIds=[];break;
 case 'D6':delete s.placements.n3;break;
 case 'D7':delete s.selectedSigns.row2;break;
 case 'D8':s.enteredLength='';break;
 case 'D9':delete s.enteredAnswers.qb;break;
 }
 return s;
}
function malicious(tag,id){
 const s=good(tag,id);
 switch(id){
 case 'D2':s.result_ones='42';break;
 case 'D3':s.pairs.l1='foreign';break;
 case 'D4':s.selectedOptionIds=['opt999'];break;
 case 'D6':s.placements.n1='slot_999';break;
 case 'D7':s.selectedSigns.row1='!';break;
 case 'D8':s.rulerZero=9999;break;
 case 'D9':s.enteredAnswers.qa='1e4';break;
 }
 return s;
}
const checked=grader.evaluateSubmission;
const invoke=(tag,id,s)=>checked({packId:'MATH_LAB_'+tag,questionId:'LAB_'+tag+'_'+id,submission:s});
eq(Object.keys(grader.capabilities()).sort(),[...grants,...denied].sort());
for(const id of grants)eq(grader.capabilities()[id].enabled,true,id+' must be enabled in LAB');
for(const id of denied)eq(grader.capabilities()[id].enabled,false,id+' NO_GRANT');
for(const tag of ['A','B']){
 const pack=makePack(tag);
 expect(pack.questions.length===12);
 for(const id of grants){
  const g=invoke(tag,id,good(tag,id));
  eq(g.status,'CHECKED',tag+id+' good status');eq(g.pass,true,tag+id+' good answer');
  const w=invoke(tag,id,wrong(tag,id));
  eq(w.status,'CHECKED',tag+id+' wrong status');eq(w.pass,false,tag+id+' wrong answer');
  eq(invoke(tag,id,incomplete(tag,id)).status,'INCOMPLETE',tag+id+' incomplete');
  eq(invoke(tag,id,malicious(tag,id)).status,'REJECTED',tag+id+' malformed');
  const injected=good(tag,id);injected.answerKey=999;
  eq(invoke(tag,id,injected).status,'REJECTED',tag+id+' injected key');
 }
 for(const id of denied)eq(invoke(tag,id,{}).status,'NOT_AUTHORIZED',tag+id+' policy deny');
}
eq(checked({packId:'MATH_LAB_C',questionId:'LAB_C_D2',submission:good('A','D2')}).status,'REJECTED');
eq(checked({packId:'MATH_LAB_A',questionId:'LAB_A_FAKE',submission:{}}).status,'REJECTED');
eq(checked({packId:'MATH_LAB_A',questionId:'LAB_A_D2',submission:{answerKey:53}}).status,'REJECTED');
eq(checked({packId:'MATH_LAB_A',questionId:'LAB_A_D2',submission:{"__proto__":"bad"}}).status,'REJECTED');
eq(checked({packId:'MATH_LAB_A',questionId:'LAB_A_D2',submission:{variantId:'COL_LAB_A0001',result_ones:'3',result_tens:'5',score:999}}).status,'REJECTED');
eq(checked({packId:'MATH_LAB_A',questionId:'LAB_A_D2',submission:good('B','D2')}).status,'REJECTED');
eq(checked({packId:'MATH_LAB_A',questionId:'LAB_A_D8',submission:{...good('A','D8'),rulerZero:0}}).pass,false,
 'D8 alignment must be checked independently of numerical answer');
for(const id of grants)expect(bank.MATH_LAB_A[id]!==undefined&&bank.MATH_LAB_B[id]!==undefined,id+' bank exists');
const source=require('fs').readFileSync(require('path').join(__dirname,'../universal-template-v1/dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'),'utf8');
expect(!source.includes('synthetic-private-bank.cjs')&&!source.includes('resultFor(q,s,expected)'),
 'private grading code imported into public LAB browser');
console.log('ULT_V12_SERVER_GRADING_CONTRACT_PASS',assertions,'assertions',grants.length,'routes authorized LAB only',denied.length,'routes denied');
module.exports={good,wrong,incomplete,malicious};
