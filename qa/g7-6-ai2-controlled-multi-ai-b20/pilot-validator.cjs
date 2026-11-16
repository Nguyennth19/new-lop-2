'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ledger=require('./source-ledger.v1.json'),task=require('./b20-ai-handoff.v1.json'),result=require('./technical-pilot-result.pending.v1.json');
function deny(code){return {ok:false,code,ownerApproved:false,mayRegister:false,mayDeploy:false,mayWriteStudentData:false};}
function gitBlob(b){const bytes=Buffer.isBuffer(b)?b:Buffer.from(b);return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');}
function verify(readByCommit){if(typeof readByCommit!=='function')return deny('NEED_PINNED_COMMIT_FILE_READER');
 if(ledger.pinnedFiles.length!==11||task.sourceCommit!==ledger.referenceCommit||task.baselineCommit!==ledger.auditBaselineCommit)return deny('SOURCE_PIN_SET_INVALID');
 for(const a of ledger.pinnedFiles){if(!/^[0-9a-f]{40}$/.test(a.gitBlobSha)||a.bytesNotEmbedded!==true)return deny('BAD_SOURCE_SHA_OR_EMBEDDED_BYTES');
 let b;try{b=readByCommit(a.commit,a.path);}catch{return deny('FILE_MISSING_'+a.id);}
 if(!b||gitBlob(b)!==a.gitBlobSha)return deny('SOURCE_MISMATCH_'+a.id);}
 return {ok:true,code:'ALL_11_PINNED_FILES_VERIFIED',permission:'READ_ONLY',mayRegister:false,mayDeploy:false,mayWriteStudentData:false};
}
function inspectH1(raw){let h;try{h=JSON.parse(raw);}catch{return deny('INVALID_SOURCE_JSON');}
 if(h.lesson_id!=='toan_b20'||h.schema_version!=='b20-variant-pilot-1.0'||h.release_status!==ledger.pilot.runtimeReleaseStatus)return deny('B20_SOURCE_ID_STATUS_MISMATCH');
 if(!Array.isArray(h.questions)||h.questions.length!==30||!Array.isArray(h.sessions)||h.sessions.length!==6)return deny('B20_NOT_30_6');
 const ids=h.questions.map(q=>q.question_id);if(new Set(ids).size!==30||ids.some(x=>typeof x!=='string'||!x.startsWith('VAR_B20_')))return deny('B20_QUESTION_IDS_INVALID');
 const kinds=new Set(h.questions.map(q=>q.type));if(kinds.size!==6||ledger.pilot.questionTypes.some(x=>!kinds.has(x)))return deny('B20_TYPES_DIFFER');
 if(h.questions.some(q=>q.lesson_id!=='toan_b20'||q.source_question_id!==null||q.source_reference_kind!=='CURRICULUM_SCOPE_ONLY'||q.qa_status!=='TECH_VALIDATED_DEMO_ONLY'))return deny('UNSUPPORTED_EXACT_SOURCE_OR_LESSON');
 const ss=[];for(let i=0;i<h.sessions.length;i++){const s=h.sessions[i];if(s.target_count!==ledger.pilot.sessionQuestionCounts[i]||s.question_ids.length!==s.target_count)return deny('SESSION_COUNT_WRONG');
 if(s.question_ids.some(id=>!ids.includes(id)))return deny('UNKNOWN_SESSION_QUESTION');
 for(const id of s.question_ids){const q=h.questions.find(z=>z.question_id===id);if(q.session_id!==s.session_id||q.level!==s.level)return deny('SESSION_SCOPE_MISMATCH');ss.push(id);}
 }
 if(new Set(ss).size!==30)return deny('DUPLICATE_OR_MISSING_SESSION_QUESTION');
 return {ok:true,code:'B20_SOURCE_STRUCTURALLY_VERIFIED_EXISTING_STAGING_ONLY',lessons:1,questions:30,sessions:6,kinds:kinds.size,approvedForRelease:false};
}
function inspectPacket(p=task){if(p.lessonId!=='toan_b20'||p.sourceCommit!==ledger.referenceCommit||p.status!=='PILOT_PACKET_TECHNICALLY_REVIEWABLE_NOT_SENT_TO_GEMINI')return deny('PACKET_SOURCE_OR_RUN_STATUS');
 if(!Array.isArray(p.sourceRefs)||p.sourceRefs.length!==7||p.sourceRefs.some(ref=>!ledger.pinnedFiles.some(a=>a.id===ref.id&&a.gitBlobSha===ref.gitBlobSha)))return deny('PACKET_UNPINNED_SOURCES');
 if(p.producerRole.actor!=='ROLE_SPECIFICATION_ONLY_NOT_ACTUALLY_INVOKED'||p.reviewerRole.actor!=='LOCAL_DETERMINISTIC_VALIDATOR_PLUS_TECHNICAL_REVIEW_NOT_A_LIVE_SECOND_MODEL')return deny('FORGED_LIVE_AI_HANDOFF');
 if(p.ownerStatus!=='PENDING_NO_AI2_APPROVAL'||p.containsAnswerKey!==false||p.containsStudentPII!==false||p.metadataOnly!==true||p.rollbackCommit!==ledger.auditBaselineCommit)return deny('HANDOFF_AUTHORITY_OR_PRIVACY');
 if(!Array.isArray(p.blockers)||p.blockers.length!==4||!Array.isArray(p.expectedQA)||p.expectedQA.length<5)return deny('MISSING_BLOCKERS_OR_QA');
 if(!p.permissions||Object.keys(p.permissions).length!==8||Object.values(p.permissions).some(x=>x!==false))return deny('FORBIDDEN_PERMISSION');
 for(const value of [p,p.producerRole,p.reviewerRole]){const s=JSON.stringify(value);if(/"(answer|answerSpec|correctAnswer|solution_prompt|studentName|token|apiKey)"\s*:/i.test(s)||/-----BEGIN PRIVATE KEY-----/.test(s))return deny('SENSITIVE_DATA_IN_PACKET');}
 if(result.metrics.generatedQuestions!==0||result.metrics.externalGeminiCalls!==0||result.releaseReady!==false)return deny('RESULT_EXCEEDS_EVIDENCE');
 return {ok:true,code:'METADATA_ONLY_HANDOFF_VALID',canCreateNewQuestion:false,mayDeploy:false,mayRegister:false};
}
function compareP06Catalog(bytes){let cat;try{cat=JSON.parse(bytes);}catch{return deny('BAD_P06_CATALOG');}
 const b20=cat.lessons?.find(l=>l.lessonId==='toan_b20');
 if(!b20||b20.state!=='INDEPENDENT_ACCEPTED_TEST_ONLY'||b20.lessonVersion!=='p0.6-fb-test-b20-v1'||b20.allowStudentUse!==false||b20.deploy!==false||b20.releaseReady!==false||cat.defaultFeatureFlag!==false)return deny('P06_B20_GATE_CHANGED');
 const extra=cat.lessons.filter(x=>x.lessonId==='toan_b27'||x.lessonId==='toan_b65');
 if(extra.length)return deny('E04_FAMILIES_WRONGLY_REGISTERED');
 return {ok:true,code:'P06_B20_ONLY_ISOLATED_TEST',deploy:false};
}
module.exports={verify,inspectH1,inspectPacket,compareP06Catalog,gitBlob};
