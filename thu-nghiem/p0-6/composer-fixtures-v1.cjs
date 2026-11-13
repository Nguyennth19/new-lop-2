'use strict';
/** E03 fixture wiring: static paths and fixed hash; no network or student IO. */
const fs=require('node:fs'),path=require('node:path');
const {createVariantPolicyRegistry}=require('./variant-policy-registry-v1.cjs');
const {composeLesson}=require('./math-lesson-composer-v1.cjs');
const read=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'pilot',name),'utf8'));
const catalog=Object.freeze({
 toan_b21:{lessonId:'toan_b21',subject:'toan',policyRef:'E03_B21_COMPOSITION_POLICY',
  expectedSha256:'1072ac8d9bbf03a3ccdd7ff694fc514e9c1d404ca0a3c1ac26fd8558490b059c'}
});
const policyRegistry=createVariantPolicyRegistry(catalog,ref=>{
 if(ref!=='E03_B21_COMPOSITION_POLICY')throw Error('POLICY_REF_NOT_ALLOWED');
 return read('toan_b21.multi-family-policy.candidate.json');
});
const manifest=read('toan_b21.composition.candidate.json');
const skeleton=read('toan_b21.candidate.json');
module.exports={catalog,policyRegistry,manifest,skeleton,
 createDemo:()=>composeLesson(manifest,policyRegistry,skeleton)};
