'use strict';
/* G7.6-B.3 P0.6-E04 candidate SIDE-CAR producer. Not part of pinned P0.6 E02/E03.
 * Pure seeded generation from constrained, declared geometry/count blueprints.
 * Technical lab lesson only, no SGK assignment, no correct-match map or grading keys.
 */
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const {adaptSubmode}=require('../g7-6-b2/submode-bridge.cjs');
const PIN='c0c5620f30edd92ab45d4ec87a8a07ffa38948e2';
const policy=Object.freeze(JSON.parse(fs.readFileSync(path.join(__dirname,'p06-e04-extension-policy.candidate.json'),'utf8')));
const fail=(code)=>({ok:false,code,releaseReady:false});
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const triangle=points=>({type:'polygon',points});
const rect=(x,y,width,height)=>({type:'rect',x,y,width,height});
const pieces=Object.freeze([
 {id:'roof',label:'Mái nhà',geometry:triangle([[0,-45],[60,25],[-60,25]]),target:triangle([[190,25],[250,95],[130,95]]),start:[65,70]},
 {id:'wall',label:'Thân nhà',geometry:rect(-45,-70,90,90),target:rect(145,95,90,90),start:[70,215]},
 {id:'tree',label:'Tán cây',geometry:triangle([[0,-50],[45,20],[-45,20]]),target:triangle([[330,95],[375,165],[285,165]]),start:[330,235]}
]);
const styles=Object.freeze([
 [{id:'r1',label:'Táo',symbol:'🍎'},{id:'r2',label:'Chuối',symbol:'🍌'}],
 [{id:'r1',label:'Cá',symbol:'🐟'},{id:'r2',label:'Ngôi sao',symbol:'⭐'}]
]);
function translate(g,dx,dy){
 if(g.type==='rect')return {...g,x:g.x+dx,y:g.y+dy};
 return {...g,points:g.points.map(p=>[p[0]+dx,p[1]+dy])};
}
function validatePolicy(anchor){
 return policy.schemaVersion==='g76b3.p06-e04-extension-policy.v1'&&
  policy.status==='DRAFT_TECHNICAL_ONLY_OWNER_SIGNOFF_PENDING'&&
  policy.lessonId==='toan_b999'&&policy.curriculumRef===null&&
  policy.release.allowed===false&&policy.release.gasAllowed===false&&
  policy.sourceP06Commit===PIN&&anchor?.sha===PIN&&
  anchor?.registry?.resolve('toan_b21')?.ok===true&&
  anchor.registry.resolve('toan_b21').policy.status==='DRAFT_OWNER_SIGNOFF_PENDING';
}
function createExperimentalProducer(anchor){
 if(!validatePolicy(anchor))return fail('B3_SOURCE_PIN_OR_POLICY_GATE_DENIED');
 function generate({mode,seed,index=0}={}){
  if(!['D5_TANGRAM','D9_COMPARE_DIFFERENCE'].includes(mode)||typeof seed!=='string'||
     !/^[A-Za-z0-9_-]{1,48}$/.test(seed)||!Number.isInteger(index)||index<0||index>15)
   return fail('B3_E04_MODE_SEED_OR_INDEX_DENIED');
  const digest=hash({producer:'B3_E04',mode,seed,index,anchor:anchor.sha});
  const variantId='B3_'+digest.slice(0,16);
  const questionId='Q_B3_'+digest.slice(0,16);
  const geometryMode=mode==='D5_TANGRAM',shift=(parseInt(digest.slice(0,2),16)%13)-6;
  let params,prompt,typeId;
  if(geometryMode){
   const rotationOffset=parseInt(digest.slice(2,4),16)%4;
   params={
    submode:'TANGRAM',
    pieceIds:pieces.map(x=>x.id),
    pieceLabels:pieces.map(x=>x.label),
    pieceGeometryJson:pieces.map(x=>JSON.stringify(x.geometry)),
    pieceStartX:pieces.map((x,i)=>x.start[0]+shift+i*2),
    pieceStartY:pieces.map((x,i)=>x.start[1]+shift),
    pieceRotations:pieces.map((_,i)=>((i+rotationOffset)%4)*90),
    targetIds:pieces.map(x=>'target_'+x.id),
    targetGeometryJson:pieces.map(x=>JSON.stringify(translate(x.target,shift,0)))
   };
   prompt='Chọn mảnh hình, xoay rồi thử đặt vào khung. Chưa chấm đúng/sai.';
   typeId='D5';
  }else{
   const list=styles[parseInt(digest.slice(2,4),16)%styles.length];
   const first=6+parseInt(digest.slice(4,6),16)%5;
   const second=1+parseInt(digest.slice(6,8),16)%4;
   const relation=parseInt(digest.slice(8,10),16)%2?'MORE_THAN':'LESS_THAN';
   const counts=relation==='MORE_THAN'?[first,second]:[second,first];
   params={rowIds:list.map(x=>x.id),rowLabels:list.map(x=>x.label),
    rowSymbols:list.map(x=>x.symbol),itemCounts:counts,
    questionRowId:'r1',questionType:'COMPARE_DIFFERENCE',
    otherRowId:'r2',relation};
   prompt='Số '+list[0].label.toLowerCase()+
    (relation==='MORE_THAN'?' nhiều hơn ':' ít hơn ')+
    'số '+list[1].label.toLowerCase()+' bao nhiêu?';
   typeId='D9';
  }
  const source={lessonId:policy.lessonId,variantId,typeId,mode:'PRACTICE',
   scope:'B3_E04_EXPERIMENTAL_PRODUCER_OFFLINE',
   question:{id:questionId,kind:'g76.fixture.'+typeId.toLowerCase(),
    renderer:{component:'g76.fixture.'+typeId.toLowerCase()},
    prompt,publicParameters:params,assets:{sceneId:null,usage:'decorative'}}};
  const receipt={status:'GENERATED_TECHNICAL_CANDIDATE_NOT_PEDAGOGY_APPROVED',
   producer:'G76_B3_P06_E04_SEPARATE_EXTENSION',nativeP06E02:false,nativeP06E03:false,
   anchorSha:anchor.sha,policyId:policy.policyId,lessonId:policy.lessonId,
   curriculumRef:null,mode,seed,index,contentSha256:hash(source),noWrites:true,
   gasAllowed:false,gradingAllowed:false,assetRuntimeAllowed:false};
  return {ok:true,source,receipt,releaseReady:false};
 }
 function project(candidate){
  if(!candidate?.ok||candidate.receipt?.producer!=='G76_B3_P06_E04_SEPARATE_EXTENSION'||
     candidate.receipt?.anchorSha!==PIN||candidate.source?.scope!=='B3_E04_EXPERIMENTAL_PRODUCER_OFFLINE'||
     candidate.source.lessonId!==policy.lessonId||
     hash(candidate.source)!==candidate.receipt.contentSha256)
   return fail('B3_E04_PROVENANCE_OR_DIGEST_DENIED');
  // B2 fixture-only projection remains unchanged. Here the only bridging step is an
  // authenticated in-process translation FROM the generated technical candidate.
  const internal={...candidate.source,scope:'G76_TYPED_TEST_FIXTURE'};
  const mapped=adaptSubmode(internal);
  if(!mapped.ok)return fail('B3_E04_NATIVE_SUBMODE_REJECTED_'+mapped.code);
  return {...mapped,sourceEvidence:'B3_SEEDED_SIDECAR_GENERATED_NOT_NATIVE_P06_E02_E03',
   producerReceipt:candidate.receipt,
   nativeRenderer:{...mapped.nativeRenderer,producerGenerated:true,
    realP06CoreGenerator:false,gradingEnabled:false,assetBindingAllowed:false,
    countRuntimeApproved:false,ttsExecuted:false}};
 }
 return Object.freeze({ok:true,policy,generate,project});
}
module.exports={PIN,policy,createExperimentalProducer};
