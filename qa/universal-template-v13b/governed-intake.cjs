'use strict';
/*
 * ULT-V1.3-B – Governed TEST Sheet Snapshot Intake
 *
 * Strictly handles *captured* read-only values from the newly created native
 * Google Sheet. GitHub Actions does NOT have Google Drive credentials or
 * permission to poll or update a Sheet. The live Google Drive connector must
 * recapture a receipt and record its provenance before this CI can ingest
 * changed rows. Do not represent this as live synchronization.
 */
const fs=require('node:fs'),path=require('node:path');
const core=require('../universal-template-v13/publisher-core.cjs');
const snapshot=require('./SHEET_TEST_READ_RECEIPT_20261120.json');
const expected={
  spreadsheetId:'1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs',
  originalSourceId:'1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8'
};
const reportDir=path.join(__dirname,'dist');
const catalogKeys=core.contract.proposedTabs['10_DanhMuc_Bai'];
const requestKeys=core.contract.proposedTabs['11_YeuCau_Data'];
const fail=code=>({ok:false,reason:code});
const owns=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
function strictHeaders(rows,headers){
 if(!Array.isArray(rows)||!rows.length||!Array.isArray(rows[0])||
   rows[0].length!==headers.length||
   rows[0].some((v,i)=>v!==headers[i]))return false;
 return true;
}
function catalogIndex(data){
 if(!strictHeaders(data,catalogKeys))throw Error('CATALOG_HEADER_DRIFT');
 const byId=new Map();
 for(const row of data.slice(1)){
  const normalized=Object.fromEntries(catalogKeys.map((name,i)=>[name,String(row[i]??'').trim()]));
  if(byId.has(normalized.lesson_id))throw Error('DUPLICATE_CATALOG_LESSON');
  if(!['TRUE','FALSE'].includes(normalized.release_eligible))throw Error('UNTRUSTED_RELEASE_BOOL');
  if(normalized.release_eligible!=='FALSE')throw Error('CANNOT_IMPORT_RELEASE_ELIGIBLE_SOURCE');
  if(normalized.subject!=='MATH'||normalized.grade!=='2')throw Error('UNAPPROVED_SUBJECT_OR_GRADE');
  byId.set(normalized.lesson_id,normalized);
 }
 return byId;
}
function validateReceipt(receipt=snapshot){
 if(!receipt||receipt.contract!=='LOP2_ULT_V13B_GOVERNED_SHEET_TEST_READ_RECEIPT_V1'||
    receipt.mode!=='CAPTURED_LIVE_CONNECTOR_READ_ONLY_NO_AUTOMATED_POLLING'||
    receipt.readOnly!==true||receipt.ownerApprovalGranted!==false||
    receipt.realLessonsEligible!==false||receipt.source?.spreadsheetId!==expected.spreadsheetId||
    receipt.source.spreadsheetId===expected.originalSourceId||
    receipt.source.tab!=='11_YeuCau_Data'||receipt.source.valueRenderOption!=='FORMULA')
  return fail('UNTRUSTED_SHEET_OR_RECEIPT');
 const expectedTabs=Object.keys(core.contract.proposedTabs);
 if(!Array.isArray(receipt.tabNames)||receipt.tabNames.join('|')!==expectedTabs.join('|'))
  return fail('SHEET_TABS_NOT_CONTRACT_PARITY');
 if(!strictHeaders(receipt.controls,requestKeys)||!strictHeaders(receipt.catalog,catalogKeys))
  return fail('SHEET_HEADER_DRIFT');
 let reqs,cat;
 try{
  reqs=core.importSheetRectangle(receipt.controls);
  cat=catalogIndex(receipt.catalog);
 }catch(e){return fail(e.message||'SHEET_READER_ERROR')}
 for(const req of reqs){
  const c=cat.get(req.lesson_id);
  if(!c)return fail('LESSON_NOT_IN_TEST_CATALOG');
  if(c.source_status!==req.source_status)return fail('SOURCE_STATUS_CONFLICT');
  if(c.release_eligible!=='FALSE')return fail('LESSON_RELEASE_ELIGIBLE_IN_TEST');
 }
 if(reqs.length<1||reqs.length>25)return fail('REQUEST_COUNT_UNBOUNDED');
 return {ok:true,requests:reqs,catalog:cat,
  inputHash:core.hash({controls:receipt.controls,catalog:receipt.catalog}),
  sourceSpreadsheetId:expected.spreadsheetId,livePollingEnabled:false};
}
function acceptAIProposal(request,envelope){
 // AI may propose, not decide whether its source has been approved.
 if(request.generator_mode!=='AI_ASSISTED')return fail('AI_MODE_NOT_AUTHORIZED_BY_REQUEST');
 const gate=core.acceptAICandidateEnvelope(envelope);
 if(!gate.ok)return gate;
 if(envelope.requestId!==request.request_id||!Array.isArray(envelope.questions)||
    envelope.questions.length!==Number(request.question_count))
  return fail('AI_CANDIDATE_ID_OR_COUNT_MISMATCH');
 // All candidate bytes are still untrusted. No direct approve/publish route.
 return {ok:true,stage:'PROPOSAL_UNVALIDATED',requiresIndependentValidator:true,
  allowedToGrade:false,allowedToPublish:false};
}
function processReceipt(receipt=snapshot){
 const read=validateReceipt(receipt);
 if(!read.ok)return read;
 const candidates=[],audit=[],denied=[],activePointer='NONE';
 for(const request of read.requests){
  const isSynthetic=request.source_status==='SYNTHETIC_QA_ONLY'&&
    request.lesson_id.startsWith('LAB_MATH_');
  if(!isSynthetic){
   denied.push({requestId:request.request_id,lessonId:request.lesson_id,
    reason:'REAL_OR_UNAPPROVED_LESSON_NOT_IN_TEST_INTAKE'});
   continue;
  }
  const rule=core.validateRequest(request);
  if(!rule.ok){denied.push({requestId:request.request_id,reason:rule.reason});continue}
  const built=core.proposeDeterministic(request);
  if(!built.ok){denied.push({requestId:request.request_id,reason:built.reason});continue}
  const QA=core.validateBatch(request,built.pack);
  if(!QA.ok){denied.push({requestId:request.request_id,reason:QA.reason});continue}
  const source=core.assessSource(request,built.pack);
  if(!source.ok){denied.push({requestId:request.request_id,reason:source.reason});continue}
  const plan=core.makePlan(request,QA,
   {lessonId:request.lesson_id,revision:'REV0001',
    expectedRevision:'REV0001',activePointer});
  if(plan.reviewGate.state!=='PENDING_OWNER_APPROVAL'||
    plan.allowedToWriteActual!==false||plan.writeOperations!==0||
    plan.studentReleaseAllowed!==false||plan.activePointerAfter!==activePointer)
    throw Error('OWNER_APPROVAL_GATE_BYPASS_DETECTED');
  candidates.push({requestId:request.request_id,publicPack:built.pack,
   plan,qa:{schema:QA.checks.schema,math:QA.checks.math,
    privacy:QA.checks.privacy,source:'SYNTHETIC_QA_ONLY',
    renderer:QA.checks.renderer,
    questionCount:QA.checks.questionCount,
    digest:QA.digest,
    decision:'PENDING_INDEPENDENT_REVIEW'}});
  audit.push({eventId:'ULT_V13B_'+request.request_id,
   requestId:request.request_id,action:'READ_ONLY_CANDIDATE_VALIDATED',
   previousState:'REQUESTED',nextState:'PENDING_INDEPENDENT_REVIEW',
   inputDigest:read.inputHash,outputDigest:QA.digest,
   releaseEligible:false,externalWrites:0});
 }
 return {ok:true,sourceSpreadsheetId:read.sourceSpreadsheetId,
  livePollingEnabled:false,sheetInputHash:read.inputHash,
  candidates,audit,denied,externalWrites:0,
  actualReleaseManifestUpdated:false,activePointerBefore:'NONE',
  activePointerAfter:'NONE',ownerSignaturesVerified:false};
}
function emit(result=processReceipt()){
 if(!result.ok)throw Error('GOVERNED_INTAKE_REJECTED_'+result.reason);
 fs.mkdirSync(reportDir,{recursive:true});
 for(const item of result.candidates){
  fs.writeFileSync(path.join(reportDir,item.requestId+'_PUBLIC_CANDIDATE.json'),
   JSON.stringify(item.publicPack,null,2)+'\n');
  fs.writeFileSync(path.join(reportDir,item.requestId+'_PUBLISH_PLAN_TEST_ONLY.json'),
   JSON.stringify(item.plan,null,2)+'\n');
 }
 const proof={
  schema:'LOP2_ULT_V13B_CANDIDATE_INTAKE_RECEIPT',
  capturedDate:'2026-11-20',sourceSpreadsheetId:result.sourceSpreadsheetId,
  snapshotSha256:result.sheetInputHash,readModel:'LIVE_CONNECTOR_SNAPSHOT_NOT_LIVE_POLLING',
  candidates:result.candidates.map(x=>({
   requestId:x.requestId,lessonId:x.publicPack.lesson.id,
   questionCount:x.qa.questionCount,
   publicSha256:x.qa.digest,qa:x.qa,releaseGate:x.plan.reviewGate.state,
   stageUri:x.plan.proposed?.publicJsonUri,
   studentPlayable:false,manifestChanged:false
  })),
  denied:result.denied,
  publishAuthorized:false,externalWrites:result.externalWrites,
  activePointerBefore:result.activePointerBefore,
  activePointerAfter:result.activePointerAfter,
  ownerSignaturesVerified:false
 };
 fs.writeFileSync(path.join(reportDir,'LIVE_TEST_SHEET_INTAKE_EVIDENCE.json'),
  JSON.stringify(proof,null,2)+'\n');
 fs.writeFileSync(path.join(reportDir,'TEST_GOVERNANCE_EVENTS.jsonl'),
  result.audit.map(e=>JSON.stringify(e)).join('\n')+'\n');
 console.log('ULT_V13B_GOVERNED_SHEET_SNAPSHOT_INTAKE_PASS',
  JSON.stringify({records:result.candidates.length,
   generated:proof.candidates.reduce((s,c)=>s+c.questionCount,0),
   externalWrites:0,realApproved:0,origin:result.sourceSpreadsheetId}));
 return proof;
}
if(require.main===module)emit();
module.exports=Object.freeze({validateReceipt,catalogIndex,acceptAIProposal,processReceipt,emit});
