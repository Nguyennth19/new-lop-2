'use strict';
/**
 * Independent QA-B replay of column-calc V1 arithmetic.
 * The original V1 unit file is intentionally NOT edited.
 * Its line-6 expectation ("originalAdvancedHTMLLocated=false") is stale;
 * this separate test validates CURRENT source-lock metadata and original V1 logic.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../..');
const resolve=p=>path.join(ROOT,p);
const C=require(resolve('qa/g7-4-column-calc-reference-v1/column-calc-contract.cjs'));
const lock=JSON.parse(fs.readFileSync(resolve('qa/g7-4-column-calc-reference-v1/source-lock.v1.json'),'utf8'));
const original=fs.readFileSync(resolve('qa/g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html'));
const EXPECTED='78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced';
const report={schemaVersion:'g74-qab-v1-legacy-independent-recheck',time:new Date().toISOString(),
  legacyTestStatus:'FAIL_STALE_EXPECTATION_LINE_6_UNCHANGED',
  sourceLockCurrentAdvancedHtmlLocated:lock.visualReference.originalAdvancedHTMLLocated,
  sourceHash:null,sourceByteCount:original.length,snapshotCount:lock.sourceFiles.length,
  variations:0,correctValidations:0,status:'PENDING'};
try{
  assert.equal(lock.visualReference.originalAdvancedHTMLLocated,true);
  assert.equal(original.length,131767);
  report.sourceHash=crypto.createHash('sha256').update(original).digest('hex');
  assert.equal(report.sourceHash,EXPECTED);
  assert.equal(lock.visualReference.advancedSourceSha256,EXPECTED);
  assert.equal(lock.sourceFiles.length,6);
  for(const f of lock.sourceFiles){
    const a=fs.readFileSync(resolve(f.path)),b=fs.readFileSync(resolve(f.snapshot));
    assert.ok(a.equals(b),'snapshot mismatch '+f.path);
    const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
    assert.equal(blob,f.blobSha,'blob mismatch '+f.path);
  }
  for(const operation of ['ADD','SUBTRACT'])for(const profile of ['PV100','PV1000']){
    const max=profile==='PV100'?99:999;
    const aStep=max===99?1:13,bStep=max===99?1:17;
    for(let a=0;a<=max;a+=aStep)for(let b=0;b<=max;b+=bStep){
      const q={variantId:'COL_QAB_V1_RECHECK',level:'LV3',operation,profile,a,b,assetId:null};
      const expected=operation==='ADD'?a+b:a-b;
      const valid=expected>=0&&expected<=max;
      const v=C.validate(q);assert.equal(v.ok,valid);
      if(valid){
        report.correctValidations++;
        const key=C.computeServerOnly(q),pub=C.publicPlan(q);
        assert.equal(key.ok,true);assert.equal(key.result,expected);
        assert.equal(key.digits.reduce((z,d,i)=>z+d*10**i,0),expected);
        assert.equal(pub.ok,true);
        assert.equal(pub.resultInputs.every(x=>x.value===null),true);
        assert.equal(pub.answerIncluded,false);
      }
      report.variations++;
    }
  }
  const boundary={variantId:'COL_QAB_BOUNDARY',level:'LV2',operation:'ADD',profile:'PV1000_BOUNDARY',a:999,b:1,assetId:null};
  assert.equal(C.validate(boundary).reason,'FOUR_COLUMN_NOT_VERIFIED');
  const primary={variantId:'COL_QAB_PRIMARY',level:'LV2',operation:'ADD',profile:'PV100',a:47,b:25,assetId:null};
  assert.equal(C.chooseRenderer(primary,{}).ok,false);
  assert.equal(C.chooseRenderer(primary,{explicitDegradedConsent:true,fallbackQaApproved:true}).fallback,true);
  report.status='PASS_INDEPENDENT_V1_ARITHMETIC_AND_SOURCE_INTEGRITY';
  console.log('PASS V1 independent recheck '+report.variations+' candidate pairs, '+report.correctValidations+' valid cases, 6 exact G6 snapshots, immutable HTML. Original V1 test remains FAIL due stale expected metadata.');
}catch(e){report.status='FAIL';report.error=String(e.stack||e);console.error(report.error);process.exitCode=1;}
fs.mkdirSync(resolve('qa/g7-4-renderer-batch-qa-v1/artifacts'),{recursive:true});
fs.writeFileSync(resolve('qa/g7-4-renderer-batch-qa-v1/artifacts/qa-b-v1-recheck.json'),JSON.stringify(report,null,2)+'\n');
