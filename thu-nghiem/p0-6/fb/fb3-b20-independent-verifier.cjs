'use strict';
/** F-B.3 independent B20 trust verifier: H1 immutable source, H2 approval, B20-specific renderer/grader
 * and independently verified browser QA. Never calls B21 Composer, policy or QA.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {adaptB20}=require('../adapter-b20-v1.cjs');
const {validateLesson}=require('../validator-lesson-v1.cjs');
const root=path.resolve(__dirname,'../../..');
const BLOB=Object.freeze({
 source:'b14d556c5deeb561106e0c81f275387bef538842',
 h2:'7faaf36b5b74f0ae233e8e3060b47b3b3123e74c',
 r41:'50501ccc3cb5e7801fd563807e21b76d2a51c8f9',
 a42:'e14a0c831837a91125a59dd5ce2d65288d056038',
 g26:'d2c9e0dbf745366eabeadfefe0686b60cf5d9a47'
});
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const files={
 source:'thu-nghiem/bai-20-bien-the/runtime.json',
 h2:'thu-nghiem/p0-5/closure/BIEN_BAN_H2_PHE_DUYET_CHU_DU_AN.md',
 r41:'41_HienThiCauHoiToan.html',a42:'42_AdapterBienTheB20.html',g26:'26_ChamCauHoiToan.html'
};
const evidence=Object.freeze({
 sourceRef:'B20_H1_IMMUTABLE_JSON',rendererRef:'B20_41_42_26_RENDERER',
 policyReviewRef:'BIEN_BAN_H2_PHE_DUYET_CHU_DU_AN.md',
 qaEvidenceRef:'FB3_B20_BROWSER_QA_20261113.md',
 qaRunId:43460267147,qaCommit:'4b6650d2a89713161a9881a10066598680ddf596',
 browserScope:'ISOLATED_TEST_PREVIEW_ONLY'
});
function verify(request){
 if(!request||request.lessonId!=='toan_b20'||request.lessonVersion!=='p0.6-fb-test-b20-v1'||
  request.featureFlag!==true||request.environment!=='ISOLATED_TEST'||request.allowStudentUse!==false||
  request.deploy===true||request.persist===true||request.awardStars===true||request.releaseReady===true)
  return {ok:false,code:'FB3_B20_REQUEST_DENIED'};
 const bufs={};
 for(const [k,p] of Object.entries(files)){
  bufs[k]=fs.readFileSync(path.join(root,p));
  if(blob(bufs[k])!==BLOB[k])return {ok:false,code:'FB3_B20_PROVENANCE_DRIFT',field:k};
 }
 const h2=bufs.h2.toString('utf8');
 if(!h2.includes('PEDAGOGY_APPROVED_BY_PROJECT_OWNER_CHAT_ATTESTATION')||
   !h2.includes('b14d556c5deeb561106e0c81f275387bef538842')||
   !h2.includes('RELEASE_READY=false'))return {ok:false,code:'FB3_B20_OWNER_EVIDENCE_INVALID'};
 const raw=JSON.parse(bufs.source.toString('utf8')),adapted=adaptB20(raw);
 if(!validateLesson(adapted).ok||adapted.lessonId!=='toan_b20'||adapted.questions.length!==30||
    adapted.sessions.length!==6||new Set(adapted.questions.map(q=>q.id)).size!==30||
    new Set(adapted.questions.map(q=>q.kind)).size!==6||
    adapted.questions.some(q=>q.answerSpec.pedagogyApproval.status!=='APPROVED_BY_PROJECT_OWNER'))
  return {ok:false,code:'FB3_B20_CONTRACT_DRIFT'};
 // B20 policy proof is bound only to its H2 owner record and frozen H1 source, not B21's E.0 hash.
 const contentSha256=sha(JSON.stringify(adapted));
 const policySha256=sha(JSON.stringify({lessonId:'toan_b20',
  sourceBlob:BLOB.source,ownerApprovalBlob:BLOB.h2,contentVersion:adapted.contentVersion}));
 const receiptSha256=sha(JSON.stringify({lessonId:'toan_b20',lessonVersion:'p0.6-fb-test-b20-v1',
  contentSha256,policySha256,rendererBlobs:[BLOB.r41,BLOB.a42,BLOB.g26],
  qaRunId:evidence.qaRunId,qaCommit:evidence.qaCommit}));
 return Object.freeze({ok:true,status:'ISOLATED_TEST_PREVIEW_ONLY',lessonId:'toan_b20',
  lessonVersion:'p0.6-fb-test-b20-v1',questions:30,
  contentSha256,policySha256,receiptSha256,
  proofRef:'FB3_B20_BROWSER_QA_20261113.md',browserQaRunId:evidence.qaRunId,
  noWrites:true,noStars:true,deploymentAuthorized:false,releaseReady:false});
}
module.exports={verify,evidence,files,BLOB,blob};
