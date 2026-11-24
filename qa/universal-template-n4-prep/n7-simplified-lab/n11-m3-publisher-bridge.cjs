'use strict';
// N11-M3 source-only candidate publisher bridge. No external writes or staging.
// N6 is the candidate schema authority; V1.3 and existing renderer cores are reused.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const publisher=require('../../universal-template-v13/publisher-core.cjs');
const {validateMultiFamilyPack}=require('../n6-synthetic-lab/multi-family-contract.cjs');
const ROOT=path.resolve(__dirname,'../../..');
const fail=reason=>({ok:false,reason,writes:0,release:false});
const id=v=>typeof v==='string'&&/^[A-Z0-9][A-Z0-9_-]{5,79}$/.test(v);
const noAuthority=Object.freeze({allowedToWriteActual:false,studentReleaseAllowed:false,
 trustedGradingAllowed:false,stagingAllowed:false,activePointerMutationAllowed:false});
const cores=new Map();
function loadCore(file,name){
 if(!cores.has(name)){
  const ctx={};ctx.window=ctx;ctx.globalThis=ctx;
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,file),'utf8'),ctx,{filename:file,timeout:2500});
  if(typeof ctx[name]?.compile!=='function')throw Error('ORIGINAL_CORE_UNAVAILABLE');
  cores.set(name,ctx[name]);
 }
 return cores.get(name);
}
function appleEvidence(){
 const dir=path.join(ROOT,'hinh-anh/svg-fallback/fluent-emoji-flat/v1');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.v1.json'),'utf8'));
 const matches=manifest.icons.filter(x=>x.id==='red_apple');
 if(matches.length!==1)return fail('D9_ASSET_NOT_UNIQUE');
 const a=matches[0];
 if(manifest.mode!=='STAGING_ONLY'||manifest.enabled!==false||manifest.productionActivation!==false||
  a.relativePath!=='FLAT/red_apple.svg'||a.semanticStatus!=='OWNER_SEMANTIC_APPROVED'||
  a.countQaStatus!=='COUNT_SAFE_APPROVED'||a.objectsPerAsset!==1||a.countUnit!=='quả'||
  a.countRole!=='REPEAT_SINGLE_ICON'||a.countApprovalScope!=='TEST_ONLY_OWNER_DELEGATED')
  return fail('D9_ASSET_SCOPE_OR_UNIT_MISMATCH');
 const bytes=fs.readFileSync(path.join(dir,a.relativePath));
 if(bytes.length!==a.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==a.sha256)
  return fail('D9_ASSET_DIGEST_MISMATCH');
 return {ok:true,sha256:a.sha256,scope:'TEST_ONLY',activation:false};
}
function prepareMultiFamilyCandidate(pack){
 // Public input only. Validate before adapting; never strip forbidden data silently.
 if(!publisher.secureTree(pack))return fail('PUBLIC_PRIVATE_BOUNDARY');
 const checked=validateMultiFamilyPack(pack);
 if(!checked.ok)return checked;
 if(!id(pack.packId)||!id(pack.lesson.id))return fail('INVALID_PACK_ID');
 const variants=new Set();
 for(const q of pack.questions){
  if(!id(q.questionId)||!id(q.publicVariant.variantId)||variants.has(q.publicVariant.variantId))
   return fail('INVALID_OR_DUPLICATE_VARIANT_ID');
  variants.add(q.publicVariant.variantId);
  // The bounded N6 contract is not a curriculum grant; keep the initial D10 pilot
  // at one calculation within 100 (no four-digit or multi-step extrapolation).
  if(q.rendererId==='D10'){
   const p=q.publicVariant;
   if(!Number.isSafeInteger(p.a)||!Number.isSafeInteger(p.b)||p.a>100||p.b>100||
    (p.operation==='ADD'&&p.a+p.b>100))return fail('D10_LAB_PV100_BOUND');
  }
 }
 const ai=publisher.acceptAICandidateEnvelope({state:'AI_CANDIDATE_ONLY',
  requestId:pack.packId,questions:pack.questions});
 if(!ai.ok||ai.approved!==false)return fail('PUBLISHER_PROPOSAL_DENIED');
 const source=publisher.assessSource({lesson_id:pack.lesson.id,source_status:pack.lesson.sourceStatus},pack);
 if(!source.ok)return source;
 const rendererChecks=[];
 try{
  // V1.3 accepts only D2 with its canonical renderer-specific public variant.
  const d2=pack.questions.filter(q=>q.rendererId==='D2').map(q=>({...q,
   publicVariant:{...q.publicVariant,level:q.level,assetId:null}}));
  if(d2.length){
   const subset={schemaVersion:'LOP2_UNIVERSAL_LAB_PUBLIC_V1',packId:pack.packId,
    status:'LAB_FIXTURE_ONLY_NO_GAS_RELEASE',lesson:{...pack.lesson,title:'N11 synthetic QA'},questions:d2};
   const v=publisher.validatePublicPack(subset);
   if(!v.ok)return fail(v.reason);
   for(const q of d2)rendererChecks.push({questionId:q.questionId,rendererId:'D2',
    status:'ORIGINAL_CORE_COMPILE_PASS',rendererInputSha256:publisher.hash(q.publicVariant)});
  }
  let asset=null;
  for(const q of pack.questions){
   const p=q.publicVariant;
   if(q.rendererId==='D5'){
    // Shape names are NOT tangram pieces/targets and SHAPE_COMPOSE is NOT
    // the approved SHAPE_TANGRAM skill. Preserve candidate; do not synthesize.
    rendererChecks.push({questionId:q.questionId,rendererId:'D5',
     status:'SCHEMA_ONLY_MAPPING_OPEN',reason:'SHAPE_COMPOSE_NOT_TANGRAM_CONTRACT'});
   }else if(q.rendererId==='D9'){
    asset=asset||appleEvidence();
    if(!asset.ok)return asset;
    const input={exerciseId:p.variantId,mode:'PRACTICE',prompt:'Đếm số quả táo.',
     rows:[{id:'apple',label:'Táo',contentType:'ASSET',assetId:q.assetId,itemCount:p.count,alt:'Quả táo'}],
     questions:[{id:'count',type:'COUNT',rowId:'apple',prompt:'Có bao nhiêu quả táo?'}]};
    const compiled=loadCore('55_Pictograph_Core.html','KLPictographV11').compile(input);
    if(!compiled.ok||compiled.plan.rows[0].itemCount!==p.count||
     compiled.plan.rows[0].assetId!==q.assetId)return fail('D9_ORIGINAL_CORE_REJECTS');
    rendererChecks.push({questionId:q.questionId,rendererId:'D9',
     status:'ORIGINAL_CORE_COMPILE_PASS',rendererInputSha256:publisher.hash(input),
     assetSha256:asset.sha256,assetActivation:false});
   }else if(q.rendererId==='D10'){
    const add=p.operation==='ADD';
    const prompt='Lan có '+p.a+' chiếc bút, '+(add?'được tặng thêm ':'cho bạn ')+
     p.b+' chiếc. Lan '+(add?'có tất cả':'còn lại')+' bao nhiêu chiếc bút?';
    const input={questionId:p.variantId,mode:'GUIDED',calculationSteps:1,prompt,
     summary:'Có '+p.a+' chiếc | '+(add?'Thêm ':'Bớt ')+p.b+' chiếc',unit:'chiếc'};
    const compiled=loadCore('80_D10_Core.html','KLWordUnificationV11').compile(input);
    if(!compiled.ok||compiled.plan.calculationSteps!==1)return fail('D10_ORIGINAL_CORE_REJECTS');
    rendererChecks.push({questionId:q.questionId,rendererId:'D10',
     status:'ORIGINAL_CORE_COMPILE_PASS',rendererInputSha256:publisher.hash(input)});
   }
  }
 }catch(e){return fail('RENDERER_OR_ASSET_EVIDENCE_UNAVAILABLE');}
 const publicCandidateJson=publisher.canonical(pack);
 const candidateSha256=publisher.hash(publicCandidateJson);
 return {ok:true,stage:'PROPOSE_ONLY',schemaStatus:'PASS',privacyStatus:'PASS',
  sourceStatus:source.scope,requestId:pack.packId,lessonId:pack.lesson.id,
  families:checked.families,questionCount:checked.count,publicCandidateJson,candidateSha256,
  rendererChecks,sourceSkillMappingApproved:false,rendererIntegrationComplete:false,
  ...noAuthority,proposed:null,writes:0,release:false};
}
module.exports=Object.freeze({prepareMultiFamilyCandidate});
