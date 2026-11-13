'use strict';
/** P0.6-E: two real-source-scoped lesson candidates, offline ONLY.
 * Registry loader injection, independent proof, readonly rendering and QA receipt.
 * Does not activate/grade students, no Sheets/GAS/network or production.
 */
const fs=require('node:fs');
const path=require('node:path');
const {createLessonRegistry}=require('./lesson-registry-v1.cjs');
const {selectLesson}=require('./lesson-selector-v1.cjs');
const {createRendererRegistry,renderReadonlyPreview}=require('./question-renderer-registry-v1.cjs');
const {validateProof,auditAnswerSpec}=require('./grading-contract-v1.cjs');
const {auditLesson}=require('./qa-engine-v1.cjs');
const ALLOWED=Object.freeze({
 toan_b21:{lessonId:'toan_b21',subject:'toan',format:'contract_v1',sourceRef:'toan_b21'},
 tieng_viet_doc_hieu_pilot:{lessonId:'tieng_viet_doc_hieu_pilot',subject:'tieng_viet',format:'contract_v1',sourceRef:'tieng_viet_doc_hieu_pilot'}
});
const PATHS=Object.freeze({toan_b21:'toan_b21.candidate.json',tieng_viet_doc_hieu_pilot:'tieng_viet_doc_hieu.candidate.json'});
function loadCandidate(ref){
 if(!Object.prototype.hasOwnProperty.call(PATHS,ref))throw Error('CANDIDATE_NOT_ALLOWLISTED');
 const file=path.join(__dirname,'pilot',PATHS[ref]);
 return JSON.parse(fs.readFileSync(file,'utf8'));
}
const registry=createLessonRegistry(ALLOWED,{contract_v1:loadCandidate});
const renderers=createRendererRegistry({
 'math.mental':renderReadonlyPreview,
 'language.reading':renderReadonlyPreview
});
function runPilot(lessonId){
 const selected=selectLesson(lessonId,registry,{}, {featureFlag:true});
 if(!selected.ok)return {ok:false,status:'BLOCKED',code:selected.code||'SELECTION_FAILED',lessonId};
 const lesson=selected.data;
 const audit=auditLesson(lesson);
 const previews=[];
 const independentChecks=[];
 for(const q of lesson.questions){
  const out=renderers.render(q,{lessonId:lesson.lessonId});
  previews.push({id:q.id,status:out.status,code:out.code,html:out.html,interactive:out.interactive,graded:out.graded});
  if(q.kind.startsWith('math.'))independentChecks.push({id:q.id,proof:validateProof(q.answerSpec).status,approval:auditAnswerSpec(q).status});
  else independentChecks.push({id:q.id,proof:'NOT_DETERMINISTIC',approval:auditAnswerSpec(q).status});
 }
 const safe=previews.length===lesson.questions.length&&previews.every(p=>p.status==='RENDERED'&&!p.interactive&&!p.graded);
 return {ok:safe,lessonId,status:safe&&audit.status==='REVIEW_REQUIRED'?'TECHNICAL_PASS_PEDAGOGY_PENDING':'BLOCKED',
  load:'PASS',contract:audit.schemaValid?'PASS':'FAIL',renderer:safe?'READONLY_PREVIEW_PASS':'FAIL',
  grading:audit.status,proofChecks:independentChecks,qaReceipt:{sourceSha256:audit.sourceSha256,receiptSha256:audit.receiptSha256,records:audit.records},
  previews,noWrites:true,noStars:true,scope:'OFFLINE_ONLY'};
}
module.exports={runPilot,registry,renderers,loadCandidate};
