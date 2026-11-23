'use strict';
/* N4 preparation-only source and test matrix preflight.
 * This does NOT test browser binary decode, live CDN, visual parity or owner QA.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const file=n=>path.join(__dirname,n);
const read=n=>JSON.parse(fs.readFileSync(file(n),'utf8'));
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const gitBlob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const gitShow=(sha,p)=>cp.execFileSync('git',['show',sha+':'+p],{cwd:root,maxBuffer:30_000_000});
const a=read('N4A_BINARY_TEST_CONTRACT.json'),b=read('N4B_VISUAL_PAIR_MATRIX_24.json');
const report={suite:'N4_AB_SOURCE_PREFLIGHT_ONLY',date:'2026-11-23',
 conclusion:'NOT_N4_ACCEPTANCE',n4a:'NOT_EXECUTED',n4b:'NOT_CAPTURED',
 rows:[],failures:[]};
function check(label,fn){
 try{const value=fn();report.rows.push({label,result:'PASS_PREPARATION_ONLY',...value})}
 catch(e){const error=String(e?.stack||e);report.failures.push({label,error});
  report.rows.push({label,result:'FAIL_PREPARATION',error})}
}
check('N4A_CASES_AND_SOURCE_LOCK',()=>{
 assert.equal(a.gate,'W1-04_OPEN');
 assert.equal(a.state,'PREPARED_NOT_EXECUTED');
 assert.equal(a.tests.length,9);
 assert(a.tests.every(t=>t.status==='NOT_EXECUTED'));
 assert(a.assets.some(x=>x.id==='FLUENT:books'&&x.expected==='REJECT'));
 let checked=0;
 for(const asset of a.assets){
  assert(!asset.path.includes('..'));
  const bytes=fs.readFileSync(path.join(root,asset.path));
  const frozen=gitShow(asset.sourceCommit,asset.path);
  assert.deepEqual(bytes,frozen,asset.id+' changed from immutable git source');
  if(asset.expectedSha256)assert.equal(sha256(bytes),asset.expectedSha256,asset.id+' SHA256');
  if(asset.expectedGitBlobSha)assert.equal(gitBlob(bytes),asset.expectedGitBlobSha,asset.id+' Git blob');
  if(asset.bytes)assert.equal(bytes.length,asset.bytes,asset.id+' size');
  checked++;
 }
 return {sourcePinsVerified:checked,assetIds:a.assets.map(x=>x.id),
  note:'Git bytes and SHA only; no image decoded by a browser yet'};
});
check('N4B_PAIR_INVENTORY',()=>{
 assert.equal(b.gate,'W1-05_OPEN');
 assert.equal(b.status,'PLANNED_NOT_CAPTURED');
 assert.equal(b.pairCount,24);
 assert.equal(b.screenshotCountRequired,48);
 assert.equal(b.pairs.length,24);
 const routes=['D1','D2','D3','D4','D5','D6','D7','D8','D8A','D8B','D9','D10'];
 const views=['desktop1366','mobile390'];
 const ids=new Set();
 for(const p of b.pairs){
  assert(routes.includes(p.route)&&views.includes(p.viewport));
  assert(!ids.has(p.pairId),'duplicate visual pair');
  assert.equal(p.questionId,'LAB_A_'+p.route);
  assert.equal(p.status,'NOT_CAPTURED');
  assert.equal(p.reviewerDecision,'PENDING');
  assert.equal(p.beforeSha256,null);assert.equal(p.afterSha256,null);
  assert(p.before.includes('/'+p.viewport+'/')&&p.after.includes('/'+p.viewport+'/'));
  ids.add(p.pairId);
 }
 for(const route of routes)
  for(const viewport of views)
   assert(ids.has('W1-05-'+route+'-'+viewport));
 return {routes:12,viewports:2,pairs:ids.size,screenshotFilesRequired:48,
  note:'No before/after screenshots exist solely because of this plan'};
});
const dist=file('dist');fs.mkdirSync(dist,{recursive:true});
fs.writeFileSync(path.join(dist,'N4_PREP_PREFLIGHT_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');
console.log('N4_PREP_PREFLIGHT',report.rows.length,'steps',report.failures.length,
 'failures. W1-04/W1-05 both OPEN; NOT ACCEPTANCE.');
for(const f of report.failures)console.error(f.label,f.error);
if(report.failures.length)process.exitCode=1;
