#!/usr/bin/env node
'use strict';
/** G7.4-B.6 TEST-only offline batch stager. No network or runtime activation. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function die(msg){throw new Error(msg)}
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const validId=/^[a-z][a-z0-9_]{1,63}$/,hash64=/^[a-f0-9]{64}$/,sha40=/^[a-f0-9]{40}$/;
function readJson(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
function safeFile(root,rel){
  if(typeof rel!=='string'||!rel||path.isAbsolute(rel)||rel.includes('\\')||rel.split('/').includes('..')||rel.split('/').includes('.'))die('UNSAFE_PATH');
  const resolved=path.resolve(root,rel);
  if(!resolved.startsWith(path.resolve(root)+path.sep))die('PATH_ESCAPE');
  const l=fs.lstatSync(resolved);if(!l.isFile()||l.isSymbolicLink())die('UNSAFE_SOURCE_TYPE');
  return resolved;
}
function checkSvg(s){
  if(!/^<svg\b/.test(s.trim())||!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(s))die('INVALID_SVG_ROOT');
  if(!/viewBox="0 0 32 32"/.test(s))die('INVALID_VIEWBOX');
  if(/<!|<\?|<\/?(?:script|foreignObject|image|iframe|style|animate|set|use|audio|video|filter|mask|pattern)\b/i.test(s))die('BANNED_SVG_ELEMENT');
  if(/\bon[a-z]+\s*=|(?:xlink:)?href\s*=|url\s*\(|data:|javascript:|https?:|@import|<[^>]+\sstyle\s*=/i.test(s))die('BANNED_SVG_ATTRIBUTE');
  const tags=[...s.matchAll(/<\/?\s*([A-Za-z][\w:-]*)\b/g)].map(a=>a[1]);
  if(tags.some(t=>!['svg','path','g','circle','rect','ellipse','line','polyline','polygon','defs','linearGradient','radialGradient','stop'].includes(t)))die('UNKNOWN_SVG_TAG');
}
function plan(batch,sourceDir,existingManifest){
  if(batch.schemaVersion!=='g7-4-b6-batch-v1'||!validId.test(batch.batchId||''))die('BAD_BATCH');
  if(batch.sourceRepository!=='microsoft/fluentui-emoji'||!sha40.test(batch.sourceCommit||''))die('UNPINNED_SOURCE');
  if(batch.license!=='MIT'||!batch.licenseFile)die('MISSING_LICENSE');
  const license=fs.readFileSync(safeFile(sourceDir,batch.licenseFile),'utf8');
  if(!/MIT License/i.test(license)||!/Microsoft Corporation/i.test(license))die('LICENSE_MISMATCH');
  if(!Array.isArray(batch.items)||!batch.items.length||batch.items.length>100)die('BATCH_SIZE_INVALID');
  const occupied=new Set((existingManifest.icons||[]).map(x=>x.id));
  const hashes=new Set((existingManifest.icons||[]).map(x=>x.sha256));
  const seen=new Set(),files=[];
  for(const x of batch.items){
    if(!validId.test(x.id||'')||!validId.test(x.conceptKey?.replaceAll('.','_')||''))die('BAD_ID_OR_CONCEPT');
    if(occupied.has(x.id)||seen.has(x.id))die('DUPLICATE_ASSET_ID');
    seen.add(x.id);
    if(!hash64.test(x.sha256||'')||!x.sourcePath?.startsWith('assets/')||!x.sourcePath.endsWith('/Flat/'+x.id+'_flat.svg'))die('BAD_SOURCE_METADATA');
    const f=safeFile(sourceDir,x.sourceFile);
    const b=fs.readFileSync(f),s=b.toString('utf8');
    if(hash(b)!==x.sha256)die('CHECKSUM_MISMATCH');
    if(hashes.has(x.sha256))die('DUPLICATE_CONTENT_REUSE_EXISTING');
    hashes.add(x.sha256);checkSvg(s);
    if(!['TOAN','TIENG_VIET','TIENG_ANH','DUNG_CHUNG'].includes(x.subject))die('INVALID_SUBJECT');
    files.push({id:x.id,content:b,record:{id:x.id,conceptKey:x.conceptKey,subject:x.subject,labelViCandidate:x.labelVi||null,
       sourcePath:x.sourcePath,sourceCommit:batch.sourceCommit,sha256:x.sha256,
       securityQa:'PRECHECK_ONLY',visualQa:'OWNER_PENDING',semanticQa:'OWNER_PENDING',
       countQa:'NOT_APPROVED',objectsPerAsset:null,enabled:false}});
  }
  return files;
}
function stage({batchFile,sourceDir,existingFile,outDir,apply=false}){
  const batch=readJson(batchFile),existing=readJson(existingFile);
  const files=plan(batch,sourceDir,existing);
  if(!apply)return {status:'DRY_RUN_PASS',batchId:batch.batchId,assets:files.length,outputWritten:false};
  fs.mkdirSync(outDir,{recursive:true});
  const dest=path.join(path.resolve(outDir),batch.batchId);
  if(fs.existsSync(dest))die('BATCH_ALREADY_EXISTS');
  const tmp=fs.mkdtempSync(path.join(path.resolve(outDir),'.tmp-'));
  try{
    fs.mkdirSync(path.join(tmp,'FLAT'));
    for(const f of files)fs.writeFileSync(path.join(tmp,'FLAT',f.id+'.svg'),f.content,{flag:'wx'});
    fs.writeFileSync(path.join(tmp,'staging-manifest.json'),JSON.stringify({
      schemaVersion:'g7-4-b6-staged-batch-v1',mode:'QUARANTINE_ONLY',batchId:batch.batchId,
      sourceCommit:batch.sourceCommit,license:'MIT',licenseFile:'LICENSE',runtimeEnabled:false,
      productionActivation:false,items:files.map(x=>x.record)},null,2));
    fs.copyFileSync(safeFile(sourceDir,batch.licenseFile),path.join(tmp,'LICENSE'));
    fs.writeFileSync(path.join(tmp,'.g74-staging-owner'),batch.batchId+'\n',{flag:'wx'});
    fs.renameSync(tmp,dest);
  }catch(e){fs.rmSync(tmp,{recursive:true,force:true});throw e}
  return {status:'QUARANTINED',batchId:batch.batchId,assets:files.length,outputWritten:true,destination:dest};
}
function rollback(outDir,id){
  if(!validId.test(id||''))die('INVALID_ROLLBACK_ID');
  const root=path.resolve(outDir),target=path.join(root,id);
  if(!fs.existsSync(target)||fs.lstatSync(target).isSymbolicLink())die('UNKNOWN_BATCH');
  if(fs.readFileSync(path.join(target,'.g74-staging-owner'),'utf8').trim()!==id)die('OWNERSHIP_MARKER_MISMATCH');
  const man=readJson(path.join(target,'staging-manifest.json'));
  if(man.batchId!==id||man.mode!=='QUARANTINE_ONLY'||man.runtimeEnabled!==false)die('ROLLBACK_BLOCKED');
  fs.rmSync(target,{recursive:true});return {status:'ROLLED_BACK',batchId:id};
}
if(require.main===module)try{
  const args=process.argv.slice(2);
  const at=k=>{const n=args.indexOf(k);return n<0?null:args[n+1]};
  const out=at('--out');
  if(!out)die('REQUIRED --out');
  const result=at('--rollback')?rollback(out,at('--rollback')):stage({
    batchFile:at('--batch'),sourceDir:at('--source-dir'),existingFile:at('--existing'),
    outDir:out,apply:args.includes('--apply')});
  process.stdout.write(JSON.stringify(result)+'\n');
}catch(e){console.error('BLOCKED:',e.message);process.exitCode=1}
module.exports={plan,stage,rollback,checkSvg};
