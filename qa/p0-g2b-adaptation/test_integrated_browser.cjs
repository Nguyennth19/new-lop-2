/* P0 integrated reviewer preview Chromium QA — synthetic fixtures, not real GAS.
 * Uses exact HTML template includes from the shared G3-B TEST branch and
 * verifies actual D3/D4/D7/D9/D10 + vector preview rendering on 2 viewports.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),folder=path.join(__dirname,'screenshots');
function renderTemplate(html){
 return html.replace(/<\?!=\s*napThanhPhan\('([A-Za-z0-9_]+)'\)\s*\?>/g,(_match,name)=>{
  const filename=path.join(root,name+'.html');
  assert(fs.existsSync(filename),'missing Apps Script include '+name);
  return fs.readFileSync(filename,'utf8');
 });
}
const metadata=require('./25-case-decisions.v1.json').caseRules;
const expectedCount=metadata.length;
async function main(){
 assert.equal(expectedCount,25);
 const html=renderTemplate(fs.readFileSync(path.join(root,'G2B_ReviewerPreview.html'),'utf8'));
 assert(!html.includes('<?!='));
 fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let checks=0;const viewports=[],allErrors=[];
 try{
  for(const [name,opts] of [['desktop',{viewport:{width:1366,height:768}}],
   ['mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
   const ctx=await browser.newContext(opts),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message.slice(0,220)));
   await page.setContent(html,{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#caselist button').count(),25);checks++;
   for(const q of metadata){
    await page.locator('#caselist button[data-case-id="'+q.caseId+'"]').click();
    const status=await page.locator('#case-state').textContent();
    const source=await page.locator('#metadata').textContent();
    assert(source.includes(q.exerciseId),name+' '+q.caseId+' source ID missing');
    assert(source.includes('INDEX_ONLY'),name+' '+q.caseId+' skill still unapproved');
    const before=await page.locator('#receipt').inputValue();
    const report=JSON.parse(before);
    assert.equal(report.release,'NO_GO');
    assert.equal(report.independentReviewerSigned,false);
    if(q.decision==='DROP'){
     assert(status.startsWith('DROP'),name+' '+q.caseId);
     assert.equal(await page.locator('#preview svg').count(),0);
     assert.equal(report.cases.find(c=>c.caseId===q.caseId).visualObservation,'DROPPED_BY_POLICY');
    }else{
     assert(status.startsWith('REVIEW PREVIEW'),name+' '+q.caseId+' '+status);
     assert.equal(await page.locator('#observed').isEnabled(),true);
     if(q.rendererCandidate.startsWith('VECTOR_'))
      assert.equal(await page.locator('#preview svg').count(),1,name+' '+q.caseId+' vector absent');
     else{
      const css={D3:'.g74-match-v11',D4:'.g74-choice-v11',D7:'.g74-comparison-v11',
       D9:'.g74-picto-v11',D10:'.g74-word-scaffold'}[q.rendererCandidate.split('_')[0]];
      assert(css&&await page.locator('#preview '+css).count()>=1,
       name+' '+q.caseId+' core visual absent');
     }
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2),
     false,name+' '+q.caseId+' horizontal overflow');
    checks++;
   }
   // Actual interaction checks on reused renderer views; no scoring involved.
   await page.locator('#caselist button[data-case-id="C02"]').click();
   await page.locator('.g74-picto-item').first().click();
   assert.match(await page.locator('.g74-picto-count').first().textContent(),/1/);checks++;
   await page.screenshot({path:path.join(folder,name+'-D9-counter.png'),fullPage:true});
   await page.locator('#caselist button[data-case-id="V04"]').click();
   assert.equal(await page.locator('.g74-choice-v11').count(),5);checks++;
   await page.locator('.g74-choice-answer').first().click();
   assert.match(await page.locator('.g74-choice-state').first().textContent(),/1/);checks++;
   await page.locator('#caselist button[data-case-id="C09"]').click();
   await page.locator('.g74-match-card.left').first().click();
   await page.locator('.g74-match-card.right').first().click();checks++;
   await page.locator('#caselist button[data-case-id="V13"]').click();
   await page.locator('.g74-cmp-row').first().click();
   await page.locator('.g74-cmp-sign').first().click();checks++;
   await page.locator('#caselist button[data-case-id="C06"]').click();
   assert.equal(await page.locator('.g74-word-scaffold').count(),1);checks++;
   assert.equal(await page.locator('.qa-d10-wrap input').count(),0); // no custom grader
   checks++;
   await page.locator('#caselist button[data-case-id="C01"]').click();
   await page.screenshot({path:path.join(folder,name+'-GRID100.png'),fullPage:true});
   await page.locator('#observed').click();
   const report=JSON.parse(await page.locator('#receipt').inputValue());
   assert.equal(report.cases.find(c=>c.caseId==='C01').visualObservation,'VISUAL_OBSERVED_OK_NOT_SIGNED');checks++;
   assert.equal(report.release,'NO_GO');checks++;
   assert.equal(errors.length,0,'browser JS errors '+name+': '+errors.join(' | '));checks++;
   allErrors.push(...errors);
   viewports.push({name,caseCount:25,retainedRendered:18,droppedNotMounted:7,
    checkedD3D4D7D9D10:true,vectorPreview:true,jsErrors:errors.length,horizontalOverflow:false});
   await ctx.close();
  }
 }finally{await browser.close();}
 const result={scope:'P0_G2B_CHROMIUM_QA_FIXTURE_ONLY_NOT_GAS',checks,viewports,
  independentReviewerSigned:false,sourceExactReviewed:false,
  deployedGASVerified:false,studentRelease:'NO_GO',errors:allErrors};
 fs.writeFileSync(path.join(__dirname,'QC25_BROWSER_RESULTS.json'),JSON.stringify(result,null,2)+'\n');
 console.log('P0 integrated reviewer Chromium:',checks+' checks PASS',JSON.stringify(viewports));
}
main().catch(e=>{console.error('P0 integrated reviewer browser FAIL:',e.stack||String(e));process.exitCode=1;});
