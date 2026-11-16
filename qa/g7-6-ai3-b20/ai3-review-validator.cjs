'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const cross=require('./resource-reuse-crosswalk.v1.json'),evidence=require('./evaluation-evidence.v1.json'),packet=require('./gemini-evaluation-packet.pending.v1.json');
const source=require('../g7-6-ai2-controlled-multi-ai-b20/source-ledger.v1.json');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p));
function gitBlob(x){let b=Buffer.isBuffer(x)?x:Buffer.from(x);return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');}
function validate({sourceRoot=null,mutated=null}={}){
 const fail=(code)=>({ok:false,code,mayRelease:false,actualMultiAi:false});
 const m=JSON.parse(read(cross.sourceFiles.manifest)),a=JSON.parse(read(cross.sourceFiles.adapter));
 const asset=JSON.parse(read(cross.sourceFiles.assets)),voice=JSON.parse(read(cross.sourceFiles.tts));
 const h1=sourceRoot?JSON.parse(fs.readFileSync(path.join(sourceRoot,'thu-nghiem/bai-20-bien-the/runtime.json'))):null;
 if(!h1)return fail('MISSING_PINNED_P06_CHECKOUT');
 if(gitBlob(fs.readFileSync(path.join(sourceRoot,'thu-nghiem/bai-20-bien-the/runtime.json')))!=='b14d556c5deeb561106e0c81f275387bef538842')return fail('H1_SOURCE_DRIFT');
 if(m.rendererRegistry.length!==12||m.status!=='PINNED_TEST_REGISTRY_NOT_A_RUNTIME_DEPLOYMENT')return fail('RENDERER_REGISTRY_DRIFT');
 if(asset.total!==288||asset.assets.length!==288||voice.speech.profileId!=='vi_math_v2_dynamic')return fail('ASSET_SPEECH_DRIFT');
 if(cross.families.length!==6||new Set(cross.families.map(x=>x.kind)).size!==6)return fail('WRONG_FAMILIES');
 const kinds=h1.questions.reduce((acc,q)=>(acc[q.type]=(acc[q.type]||0)+1,acc),{});
 for(const f of cross.families){if(kinds[f.kind]!==f.count)return fail('B20_KIND_COUNT_WRONG_'+f.kind);
 if(f.newRendererNeeded!==false||f.gradingAuthorized!==false)return fail('UNAUTHORIZED_RENDERER_OR_GRADING');
 if(f.recommended!=='MENTAL_INPUT_TEST_EXTENSION'&&!m.rendererRegistry.some(x=>x.id===f.recommended))return fail('UNREGISTERED_RENDERER_REF');
 const skills=[...new Set(h1.questions.filter(q=>q.type===f.kind).map(q=>q.skill_id))];
 if(JSON.stringify(skills.slice().sort())!==JSON.stringify(f.skillIds.slice().sort()))return fail('SKILL_MAPPING_WRONG_'+f.kind);
 }
 const d2=a.adapters.find(x=>x.typeId==='D2'),d4=a.adapters.find(x=>x.typeId==='D4'),d10=a.adapters.find(x=>x.typeId==='D10');
 if(d2?.sourceKind!=='math.vertical'||d4?.contract!=='SINGLE_CHOICE'||d10?.evidenceStatus!=='P06_G6_READONLY_BLOCKED')return fail('ADAPTER_CONTRACT_DRIFT');
 if((mutated||{}).C08==='APPROVED'||evidence.release.C08!=='PENDING'||evidence.release.C09!=='PENDING_C08')return fail('GATE_ELEVATION');
 if(evidence.realGemini.successfullyExecutedCalls!==0||evidence.subjects.B.actualExecution!=='NOT_EXECUTED'||evidence.efficiency.comparable!==false)return fail('UNSUPPORTED_REAL_AI_OR_SPEED_CLAIM');
 if(packet.modelOutput!==null||packet.sourceAnswerKeysIncluded!==false||packet.studentPIIIncluded!==false)return fail('UNSAFE_GEMINI_PACKET');
 if(evidence.accuracy.factChecklist.length!==12||new Set(evidence.accuracy.factChecklist.map(x=>x.id)).size!==12)return fail('BAD_FACT_RUBRIC');
 if(evidence.resourceReuse.familiesAuthorizedForDirectRuntime!==0||evidence.resourceReuse.newRendererProposals!==0)return fail('AUTOMATIC_ACTIVATION');
 return {ok:true,code:'SOURCE_GROUNDED_RESOURCE_REUSE_AUDIT_PASS',facts:12,families:6,questions:h1.questions.length,mayRelease:false,actualMultiAi:false,efficiencyComparison:'NOT_MEASURED'};
}
module.exports={validate,gitBlob};
