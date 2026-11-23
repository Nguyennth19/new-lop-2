'use strict';
/*
 N4-B / W1-05: 12 real LAB routes × desktop1366/mobile390 × frozen baseline/candidate.
 Two independent worktree builds; synthetic immutable pack A; real Chromium;
 48 before/after screenshots + 24 visual-difference images + parity ledger.
 Screenshots are evidence of render comparison, NOT pedagogical or human device approval.
*/
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),cp=require('node:child_process'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const {PNG}=require('pngjs');
const repo=path.resolve(__dirname,'../..'),out=path.join(__dirname,'dist/N4B_VISUAL_24_PAIRS');
fs.mkdirSync(out,{recursive:true});
const matrix=JSON.parse(fs.readFileSync(path.join(__dirname,'N4B_VISUAL_PAIR_MATRIX_24.json'),'utf8'));
const baseline=matrix.before.sha,candidate=process.env.GITHUB_SHA||cp.execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
assert.equal(matrix.pairs.length,24);
assert.equal(baseline,'af02456fcc2b3be856091edc899c699890d74da0');
assert(/^[0-9a-f]{40}$/.test(candidate),'candidate sha must be 40 hex chars');
const routes=['D1','D2','D3','D4','D5','D6','D7','D8','D8A','D8B','D9','D10'];
const viewports=[{id:'desktop1366',width:1366,height:768,isMobile:false,hasTouch:false,deviceScaleFactor:1},{id:'mobile390',width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2}];
const report={suite:'N4B_W1_05_VISUAL_PARITY_24_PAIRS',status:'RUNNING',baseline,candidate,
 routes:routes.length,viewports:viewports.map(x=>({id:x.id,width:x.width,height:x.height})),expectedPairs:24,
 expectedBeforeAfterFiles:48,actualBeforeAfterFiles:0,actualDiffFiles:0,ownerAcceptance:'PENDING',independentQA:'PENDING',
 realDevice:'NOT_TESTED',automationScope:'Chromium headless, synthetic pack A, initial render only',pairs:[],errors:[],
 notes:['Visual differences may be deliberate. Pixel equality is not pedagogical acceptance.',
 'Screenshots are full-page to avoid cutting content on mobile when the 12-route navigation moves above the stage.',
 'Each before and after is independently built from its pinned Git SHA.',
 'A route can be fully rendered but visually changed; its classification requires human review.',
 'No GAS, no Sheet writes, no merges, no pupil data.']};
const SHA=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args,opts={})=>cp.execFileSync('git',args,{cwd:repo,encoding:'utf8',maxBuffer:100_000_000,...opts}).trim();
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ult-n4b-baseline-'));
let baselineWorktree=false;
const files={},servers={};
const fileNames={};
function writeJSON(){fs.writeFileSync(path.join(out,'VISUAL_PARITY_LEDGER.json'),JSON.stringify(report,null,2)+'\n')}
function serve(content){
 return new Promise(resolve=>{
  const server=http.createServer((req,res)=>{
   if(req.method==='GET'&&req.url?.split('?')[0]==='/lab'){
    res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
    res.end(content);
   }else{res.writeHead(404,{'content-type':'text/plain'});res.end('LAB_ONLY_NO_ASSET_FALLBACK')}
  });
  server.listen(0,'127.0.0.1',()=>resolve({server,url:'http://127.0.0.1:'+server.address().port+'/lab'}));
 });
}
function closeServer(s){return new Promise(r=>s.close(r))}
function comparePNG(beforePath,afterPath,diffPath){
 const a=PNG.sync.read(fs.readFileSync(beforePath)),b=PNG.sync.read(fs.readFileSync(afterPath));
 const w=Math.max(a.width,b.width),h=Math.max(a.height,b.height),d=new PNG({width:w,height:h});
 let changed=0,absSum=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const idx=(y*w+x)*4,ia=(y*a.width+x)*4,ib=(y*b.width+x)*4;
  const inA=x<a.width&&y<a.height,inB=x<b.width&&y<b.height;
  const va=inA?[a.data[ia],a.data[ia+1],a.data[ia+2],a.data[ia+3]]:[255,255,255,255];
  const vb=inB?[b.data[ib],b.data[ib+1],b.data[ib+2],b.data[ib+3]]:[255,255,255,255];
  const delta=Math.max(...va.map((v,i)=>Math.abs(v-vb[i])));
  if(delta>12)changed++;
  absSum+=va.reduce((sum,v,i)=>sum+Math.abs(v-vb[i]),0);
  if(delta>12){
   d.data[idx]=225;d.data[idx+1]=50;d.data[idx+2]=70;d.data[idx+3]=255;
  }else{
   const g=Math.round((vb[0]*.2126+vb[1]*.7152+vb[2]*.0722)*.6+100);
   d.data[idx]=g;d.data[idx+1]=g;d.data[idx+2]=g;d.data[idx+3]=255;
  }
 }
 fs.mkdirSync(path.dirname(diffPath),{recursive:true});
 fs.writeFileSync(diffPath,PNG.sync.write(d));
 return {beforeDimensions:[a.width,a.height],afterDimensions:[b.width,b.height],
   diffDimensions:[w,h],changedPixels:changed,totalPixels:w*h,changedRatio:Number((changed/(w*h)).toFixed(6)),channelAbsMean:Number((absSum/(w*h*4)).toFixed(3))};
}
async function capture(browser,label,url,v,route){
 const ctx=await browser.newContext({viewport:{width:v.width,height:v.height},isMobile:v.isMobile,hasTouch:v.hasTouch,deviceScaleFactor:v.deviceScaleFactor,locale:'vi-VN',colorScheme:'light',reducedMotion:'reduce'});
 const page=await ctx.newPage(),errs=[],untrusted=[];
 page.on('pageerror',e=>errs.push(String(e)));
 page.on('requestfailed',request=>errs.push('REQUEST_FAILED '+request.url()+' '+request.failure()?.errorText));
 await page.route('**/*',async rt=>{
  const u=new URL(rt.request().url());
  if(u.hostname!=='127.0.0.1'){untrusted.push(rt.request().url());await rt.abort('blockedbyclient');return}
  await rt.continue();
 });
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.ULTLAB?.getState?.().packId==='MATH_LAB_A',{timeout:15000});
  const opened=await page.evaluate(id=>window.ULTLAB.openQuestion('LAB_A_'+id),route);
  assert.equal(opened?.ok,true,label+' open '+route+' '+JSON.stringify(opened));
  await page.evaluate(async()=>{
   await document.fonts.ready;
   for(const img of document.querySelectorAll('#ulStage img')) {
    if(!img.complete)await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true})})
   }
  });
  const sample=await page.evaluate(()=>({
   packId:window.ULTLAB.getState().packId,questionId:window.ULTLAB.getState().questionId,
   rendererId:window.ULTLAB.getState().rendererId,
   stageChildren:document.querySelector('#ulStage')?.children.length,
   stageHeight:Math.round(document.querySelector('#ulStage')?.getBoundingClientRect().height||0),
   viewportWidth:innerWidth,docScrollWidth:document.documentElement.scrollWidth,
   assetErrors:[...document.querySelectorAll('#ulStage img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
   stageText:document.querySelector('#ulStage')?.innerText?.replace(/\s+/g,' ').trim().slice(0,220),
   statusKind:document.querySelector('#ulStatus')?.dataset.kind
  }));
  assert.equal(sample.packId,'MATH_LAB_A');
  assert.equal(sample.questionId,'LAB_A_'+route);
  assert.equal(sample.rendererId,route);
  assert(sample.stageChildren>0,'empty route '+route);
  assert.equal(sample.assetErrors.length,0,'unloaded image '+JSON.stringify(sample.assetErrors));
  assert.equal(untrusted.length,0,'external/unpinned asset '+untrusted.join('|'));
  assert.deepEqual(errs,[],'JS/network errors '+errs.join('|'));
  await page.addStyleTag({content:'*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}'});
  const file=label+'/'+v.id+'/'+route+'.png',dest=path.join(out,file);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  await page.screenshot({path:dest,fullPage:true,animations:'disabled',caret:'hide',timeout:25000});
  return {file,sha256:SHA(fs.readFileSync(dest)),bytes:fs.statSync(dest).size,sample,errors:errs};
 }finally{await ctx.close()}
}
function renderHTML(repoPath){
 cp.execFileSync('node',['qa/universal-template-v1/build.cjs'],{cwd:repoPath,encoding:'utf8',timeout:120000,stdio:['ignore','pipe','pipe'],maxBuffer:12000000});
 return fs.readFileSync(path.join(repoPath,'qa/universal-template-v1/dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
}
(async()=>{
 try{
  assert.equal(git(['rev-parse','HEAD']),candidate,'HEAD sha mismatch');
  assert.equal(git(['rev-parse',baseline]),baseline,'baseline SHA unavailable');
  // git worktree add --force is NOT used. The baseline protected branch is read-only.
  fs.rmdirSync(temp);
  git(['worktree','add','--detach',temp,baseline]);
  baselineWorktree=true;
  const originalSHA=git(['rev-parse','HEAD'],{cwd:temp});assert.equal(originalSHA,baseline);
  const packSHA1=git(['rev-parse',baseline+':qa/universal-template-v1/fixture-packs.cjs']);
  const packSHA2=git(['rev-parse',candidate+':qa/universal-template-v1/fixture-packs.cjs']);
  assert.equal(packSHA1,packSHA2,'input fixture drift; before/after not comparable');
  const original=renderHTML(temp),candidateHTML=renderHTML(repo);
  files.baseline=SHA(original);files.candidate=SHA(candidateHTML);
  servers.baseline=await serve(original);servers.candidate=await serve(candidateHTML);
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
  try{
   for(const v of viewports)for(const route of routes){
    const pair=matrix.pairs.find(p=>p.route===route&&p.viewport===v.id);
    assert(pair,'missing manifest pair '+route+'/'+v.id);
    const a=await capture(browser,'before',servers.baseline.url,v,route);
    const b=await capture(browser,'after',servers.candidate.url,v,route);
    const diffFile='diff/'+v.id+'/'+route+'.png';
    const diff=comparePNG(path.join(out,a.file),path.join(out,b.file),path.join(out,diffFile));
    const rec={id:pair.pairId,route,viewport:v.id,baseline,candidate,
      before:{file:a.file,sha256:a.sha256,bytes:a.bytes,dom:a.sample},
      after:{file:b.file,sha256:b.sha256,bytes:b.bytes,dom:b.sample},
      diff:{file:diffFile,sha256:SHA(fs.readFileSync(path.join(out,diffFile))),...diff},
      automatedAssessment:diff.changedPixels===0?'PIXEL_EQUIVALENT':'VISUAL_CHANGE_REVIEW_REQUIRED',
      ownerDecision:'PENDING',independentQADecision:'PENDING',physicalDevice:'NOT_TESTED'};
    report.pairs.push(rec);report.actualBeforeAfterFiles+=2;report.actualDiffFiles++;
    console.log('N4B_PAIR',rec.id,rec.automatedAssessment,'changedRatio',diff.changedRatio,
      'dimensions',diff.beforeDimensions.join('x'),diff.afterDimensions.join('x'));
    writeJSON();
   }
  }finally{await browser.close()}
  assert.equal(report.pairs.length,24);
  assert.equal(report.actualBeforeAfterFiles,48);
  assert.equal(report.actualDiffFiles,24);
  const header='pairId,route,viewport,baseline,candidate,before,after,diff,changedRatio,beforeSHA256,afterSHA256,diffSHA256,automatedAssessment,ownerDecision,independentQADecision\n';
  const lines=report.pairs.map(p=>[p.id,p.route,p.viewport,p.baseline,p.candidate,p.before.file,p.after.file,p.diff.file,p.diff.changedRatio,p.before.sha256,p.after.sha256,p.diff.sha256,p.automatedAssessment,p.ownerDecision,p.independentQADecision].join(','));
  fs.writeFileSync(path.join(out,'VISUAL_PARITY_LEDGER.csv'),header+lines.join('\n')+'\n');
  report.renderedHTMLSHA256=files;
  report.status='AUTOMATED_24_PAIRS_CAPTURED_REVIEW_PENDING';
  writeJSON();
  console.log('N4B_SCREENSHOT_CAPTURE_PASS 24 pairs / 48 before-after PNG / 24 diff PNG; independent QA/Owner/real devices PENDING.');
 }catch(e){report.status='FAIL_OR_INCOMPLETE';report.errors.push(String(e.stack||e));writeJSON();console.error(e);process.exitCode=1}
 finally{
  if(servers.baseline)await closeServer(servers.baseline.server);
  if(servers.candidate)await closeServer(servers.candidate.server);
  if(baselineWorktree){try{git(['worktree','remove','--force',temp])}catch(e){console.error('WORKTREE_CLEANUP',String(e));process.exitCode=1}}
 }
})();
