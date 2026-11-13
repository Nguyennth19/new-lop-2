'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {stage,rollback,checkSvg}=require('./stage-batch.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'g74b6-'));
const src=path.join(root,'source'),out=path.join(root,'out');fs.mkdirSync(src);
fs.writeFileSync(path.join(src,'LICENSE'),'MIT License\nCopyright (c) Microsoft Corporation\n');
const svg='<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L2 2" fill="#f00"/></svg>';
fs.writeFileSync(path.join(src,'apple.svg'),svg);
const existing=path.join(root,'existing.json'),batchfile=path.join(root,'batch.json');
const base={schemaVersion:'g7-4-b6-batch-v1',batchId:'batch_01',sourceRepository:'microsoft/fluentui-emoji',
 sourceCommit:'a'.repeat(40),license:'MIT',licenseFile:'LICENSE',items:[{
 id:'test_apple',conceptKey:'fruit.apple',subject:'TIENG_ANH',sourcePath:'assets/Test apple/Flat/test_apple_flat.svg',
 sourceFile:'apple.svg',sha256:sha(svg),labelVi:'táo thử nghiệm'}]};
fs.writeFileSync(existing,JSON.stringify({icons:[]}));
const put=b=>fs.writeFileSync(batchfile,JSON.stringify(b));
const run=(b,apply=false)=>{put(b);return stage({batchFile:batchfile,sourceDir:src,existingFile:existing,outDir:out,apply})};
let n=0;function t(name,fn){fn();n++;console.log('PASS',name)}
try {
t('no-write dry run',()=>{assert.equal(run(base).status,'DRY_RUN_PASS');assert.equal(fs.existsSync(out),false)});
t('atomic quarantine apply',()=>{assert.equal(run(base,true).status,'QUARANTINED');assert.equal(fs.existsSync(path.join(out,'batch_01','FLAT','test_apple.svg')),true)});
t('stage metadata always blocked from runtime',()=>{const m=JSON.parse(fs.readFileSync(path.join(out,'batch_01','staging-manifest.json')));assert.equal(m.runtimeEnabled,false);assert.equal(m.items[0].countQa,'NOT_APPROVED')});
t('cannot overwrite existing batch',()=>assert.throws(()=>run(base,true),/BATCH_ALREADY_EXISTS/));
t('rollback quarantine',()=>{assert.equal(rollback(out,'batch_01').status,'ROLLED_BACK');assert.equal(fs.existsSync(path.join(out,'batch_01')),false)});
t('duplicate existing id blocked',()=>{fs.writeFileSync(existing,JSON.stringify({icons:[{id:'test_apple'}]}));assert.throws(()=>run(base),/DUPLICATE_ASSET_ID/);fs.writeFileSync(existing,JSON.stringify({icons:[]}))});
t('duplicate source bytes blocked',()=>{fs.writeFileSync(existing,JSON.stringify({icons:[{id:'other',sha256:sha(svg)}]}));assert.throws(()=>run(base),/DUPLICATE_CONTENT/);fs.writeFileSync(existing,JSON.stringify({icons:[]}))});
t('checksum tamper blocked',()=>assert.throws(()=>run({...base,items:[{...base.items[0],sha256:'0'.repeat(64)}]}),/CHECKSUM_MISMATCH/));
t('floating commit blocked',()=>assert.throws(()=>run({...base,sourceCommit:'main'}),/UNPINNED_SOURCE/));
t('path traversal blocked',()=>assert.throws(()=>run({...base,items:[{...base.items[0],sourceFile:'../source/apple.svg'}]}),/UNSAFE_PATH/));
t('invalid license blocked',()=>assert.throws(()=>run({...base,license:'UNKNOWN'}),/MISSING_LICENSE/));
t('script SVG blocked',()=>assert.throws(()=>checkSvg(svg.replace('</svg>','<script>alert(1)</script></svg>')),/BANNED_SVG_ELEMENT/));
t('external link SVG blocked',()=>assert.throws(()=>checkSvg(svg.replace('<path','<path href="https://external.invalid"')),/BANNED_SVG_ATTRIBUTE/));
t('unknown SVG element blocked',()=>assert.throws(()=>checkSvg(svg.replace('</svg>','<text>bad</text></svg>')),/UNKNOWN_SVG_TAG/));
t('no arbitrary rollback',()=>assert.throws(()=>rollback(out,'../../outside'),/INVALID_ROLLBACK_ID/));
t('unknown rollback blocked',()=>assert.throws(()=>rollback(out,'nonexistent'),/UNKNOWN_BATCH/));
console.log(n+'/'+n+' PASS');
}finally{fs.rmSync(root,{recursive:true,force:true})}
