'use strict';
/* B5-C release gates are a read-only decision procedure, NOT a deployment command.
 * A passing test MUST NOT convert an unsigned E04 lab lesson into school curriculum.
 */
const known=new Set(['PASS','PASS_LIMITED_14_CASES','PASS_CI_AND_USER_ACCEPTED',
 'PASS_USER_ATTESTED','PASS_SAFE_FALLBACK_ONLY','PASS_CANDIDATE_AFTER_CI']);
const hardReleaseBlock=new Set(['C07','C08','C09','C10','C11','C12','C13','C14','C16','C17','C18']);
const appBlock=new Set(['C07','C08','C09','C12','C16','C17']);
const d10Block=new Set(['C13','C14']);
function evaluate(matrix,{readOnly=true}={}){
 if(!matrix||matrix.schemaVersion!=='g76b5c.integration-readiness-gate-matrix.v1'||
  !Array.isArray(matrix.gates)||matrix.gates.length!==19||
  new Set(matrix.gates.map(x=>x.id)).size!==19||
  matrix.gates.some(g=>!/^C\d\d$/.test(g.id)||typeof g.status!=='string'))
  return {ok:false,code:'INVALID_GATE_MATRIX',go:false};
 const byId=new Map(matrix.gates.map(x=>[x.id,x]));
 const required=[...hardReleaseBlock,...appBlock,...d10Block,'C01','C02','C03','C04','C05','C06','C15','C19'];
 if(required.some(id=>!byId.has(id)))return {ok:false,code:'MISSING_REQUIRED_GATE',go:false};
 const protectedFields=Object.entries(matrix.executionRules||{});
 if(protectedFields.length!==15||
   protectedFields.some(([key,v])=>key.startsWith('allow')?v!==true:v!==true)||
   matrix.rollback?.protectedRuntimeChanged!==false||
   matrix.rollback?.requiresGASRollback!==false)
  return {ok:false,code:'POLICY_LOCK_DRIFT',go:false};
 const technical=['C01','C02','C03','C04','C05','C06','C19']
  .every(id=>known.has(byId.get(id).status));
 const blocks=ids=>[...ids].filter(id=>!known.has(byId.get(id).status));
 const runtimeBlocks=blocks(appBlock),releaseBlocks=blocks(hardReleaseBlock),
  trustedBlocks=blocks(d10Block);
 const scope={
  technicalPrep:{go:readOnly&&technical,blockers:technical?[]:['TECHNICAL_READINESS_OR_READ_ONLY_POLICY']},
  appIntegration:{go:false,blockers:runtimeBlocks}, // explicit USER PROHIBITION, even if gates become PASS
  liveRelease:{go:false,blockers:releaseBlocks}, // explicit USER PROHIBITION, even if gates become PASS
  trustedD10:{go:false,blockers:trustedBlocks}
 };
 return {ok:true,status:scope.technicalPrep.go?'GO_FOR_READ_ONLY_AUDIT_ONLY':'NO_GO',
  scope,releaseAuthorized:false,runtimeMutationAllowed:false,
  physicalDeviceReceiptSigned:false,e04PedagogyApproved:false,
  ownerMentalManifestApproved:false,
  sourceBaseline:matrix.baseline.sha};
}
module.exports={evaluate,known};
