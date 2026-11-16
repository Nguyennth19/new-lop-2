'use strict';
const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const idx=require('./PROJECT_STATE_INDEX.v1.json');
const contract=require('./HANDOFF_CONTRACT.v1.json');
const allowed=new Set(contract.allowedTaskKind);
const isSha=s=>typeof s==='string'&&/^[0-9a-f]{40}$/.test(s);
function failed(code){return {ok:false,code,permission:'NONE',mayDeploy:false,mayRegister:false,maySign:false};}
function gitBlob(buf){const b=Buffer.isBuffer(buf)?buf:Buffer.from(buf);return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');}
function verifyIndex(readFile=(p)=>fs.readFileSync(path.resolve(__dirname,'../../',p))){
 if(idx.mode!=='READ_ONLY_DISCOVERY_AND_HANDOFF_TEST_NOT_PRODUCTION'||!isSha(idx.baseline.sha))return failed('INDEX_SCOPE_MISMATCH');
 if(idx.modules.length!==10||new Set(idx.modules.map(x=>x.id)).size!==10)return failed('PIN_SET_NOT_UNIQUE_OR_COMPLETE');
 for(const m of idx.modules){if(m.sourceCommit!==idx.baseline.sha||m.mutable!==false||!isSha(m.gitBlobSha)||m.path.startsWith('/')||m.path.includes('..')||!m.path.startsWith('qa/')&&!m.path.startsWith('du-lieu/'))return failed('UNSAFE_PIN_'+m.id);
 let content;try{content=readFile(m.path);}catch{return failed('MISSING_SOURCE_'+m.id);}
 if(gitBlob(content)!==m.gitBlobSha)return failed('CHANGED_SOURCE_'+m.id);}
 const gate=idx.gateSnapshot;if(gate.C07!=='INDEPENDENT_PENDING'||gate.C08!=='PENDING'||gate.C09!=='PENDING_C08'||gate.p06TestRegistry!=='DENIED')return failed('GATE_TAMPERING');
 if(Object.values(idx.safety).some((v,i)=>{const keys=Object.keys(idx.safety);return keys[i]==='gatesAreSnapshotNotGrant'?v!==true:v!==false;}))return failed('INDEX_SAFETY_FLAGS_INVALID');
 return {ok:true,code:'PINNED_METADATA_MATCH',permission:'READ_ONLY_DISCOVERY',mayDeploy:false,mayRegister:false,maySign:false};
}
function validateHandoff(p){
 if(!p||typeof p!=='object'||Array.isArray(p))return failed('BAD_PACKET');
 for(const f of contract.requiredFields)if(!(f in p))return failed('MISSING_FIELD_'+f);
 if(p.schemaVersion!==contract.schemaVersion||!/^AI[0-9]-[A-Z0-9-]{10,}$/.test(p.taskId)||!allowed.has(p.taskKind)||p.sourceCommit!==idx.baseline.sha)return failed('INVALID_ID_TYPE_OR_SOURCE');
 if(!Array.isArray(p.sourceRefs)||!p.sourceRefs.length||!p.sourceRefs.every(r=>idx.modules.some(m=>m.id===r.id&&m.path===r.path&&m.gitBlobSha===r.gitBlobSha)))return failed('UNPINNED_SOURCE_REF');
 if(!Array.isArray(p.acceptanceChecks)||!p.acceptanceChecks.length||!Array.isArray(p.artifactRefs)||!Array.isArray(p.expectedTouchedPaths))return failed('MISSING_QA_OR_OUTPUT');
 if(p.expectedTouchedPaths.some(x=>!/^(qa\/g7-6-ai-workflow-orchestration-v1\/|docs\/kiem-dinh\/G7\.6_AI_WORKFLOW_ORCHESTRATION_|\.github\/workflows\/g7-6-ai-workflow-orchestration-v1-readonly\.yml)/.test(x)))return failed('PROTECTED_PATH_REQUEST');
 if(!Array.isArray(p.gateRequirements)||p.gateRequirements.length<1||p.ownerStatus!=='PENDING_NOT_REQUESTED_FOR_THIS_QA')return failed('OWNER_GRANT_IMPLIED');
 if(!contract.allowedHandoffStatus.includes(p.handoffStatus)||p.peerReview?.reviewerAuthorized!==false||p.peerReview?.conclusion!=='NOT_REVIEWED')return failed('PEER_REVIEW_NOT_PROVEN');
 if(Object.values(p.permissions||{}).some(v=>v!==false)||Object.keys(p.permissions||{}).length!==5)return failed('UNAUTHORIZED_WRITE_REQUEST');
 if(p.rollbackCommit!==idx.baseline.sha||p.blockers.length<1)return failed('NO_ROLLBACK_OR_BLOCKERS');
 const safe=JSON.stringify(p);if(/-----BEGIN (?:PRIVATE|RSA) KEY-----|api[_-]?key\s*[:=]|correctAnswer\s*[:=]|"studentName"\s*:/i.test(safe))return failed('PRIVATE_DATA_IN_PACKET');
 return {ok:true,code:'HANDOFF_TECHNICALLY_VALID_UNREVIEWED',permission:'REVIEW_ONLY',mayDeploy:false,mayRegister:false,maySign:false};
}
module.exports={verifyIndex,validateHandoff,gitBlob};
