'use strict';
/* N4 FINAL-A: D10 pedagogical and accessibility observables.
 * Synthetic LAB, NO answer grading, NO UI modifications.
*/
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const output=path.resolve(__dirname,'dist/N4_FINAL_A');
fs.mkdirSync(output,{recursive:true});
const html=fs.readFileSync(path.resolve(__dirname,'../universal-template-v1/dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const server=http.createServer((req,res)=>{if(req.url==='/lab'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(html)}else{res.writeHead(404);res.end('LAB_ONLY')}});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
const report={suite:'N4_FINAL_A_D10_PEDAGOGY_A11Y',status:'RUNNING',physicalDevice:'NOT_TESTED',screenReaderHardware:'NOT_TESTED',serverGrading:'NOT_TESTED',ownerPolicy:'PENDING',independentQA:'PENDING',results:[],errors:[]};
(async()=>{
const port=await listen(),browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
try{
 for(const view of [{name:'desktop1366',width:1366,height:768,mobile:false},{name:'mobile390',width:390,height:844,mobile:true}]){
  const context=await browser.newContext({viewport:{width:view.width,height:view.height},hasTouch:view.mobile,isMobile:view.mobile});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push({device:view.name,error:String(e)}));
  try{
   await page.goto('http://127.0.0.1:'+port+'/lab');
   await page.waitForFunction(()=>!!window.ULTLAB?.getDraftIdentity?.());
   for(const op of ['+','-','−']){
    const ret=await page.evaluate(async op=>{
      const copy=x=>JSON.parse(JSON.stringify(x));
      const pack=copy(window.__ULTLAB_PACKS__.A);
      const q=pack.questions.find(x=>x.rendererId==='D10');
      if(op!=='+' ){
       q.publicVariant.prompt='Hoa có 12 chiếc bút, cho bạn 6 chiếc. Hoa còn lại bao nhiêu chiếc?';
       q.publicVariant.summary='Có 12 chiếc | Cho 6 chiếc';
       q.publicVariant.statementOptions[0].text='Số chiếc bút Hoa còn lại là:';
       q.publicVariant.statementOptions[1].text='Số chiếc bút Hoa có tất cả là:';
      }
      const valid=window.ULTLAB.validate(pack);
      if(!valid.ok)return {error:'FIXTURE_INVALID',detail:valid};
      const set=window.ULTLAB.setData(pack),open=window.ULTLAB.openQuestion(q.questionId);
      if(!set.ok||!open.ok)return {error:'MOUNT_FAILED',set,open};
      const stage=document.querySelector('#ulStage');
      const inputs=[...stage.querySelectorAll('[data-ml-field]')];
      const names=inputs.map(x=>x.dataset.mlField.split(':').at(-1));
      const labels=inputs.map(x=>x.getAttribute('aria-label'));
      const fontSizes=inputs.map(x=>getComputedStyle(x).fontSize);
      const summary=stage.querySelector('.ml-word-summary')?.textContent;
      const caption=stage.querySelector('.ul-word-answer-caption')?.textContent;
      const prompt=stage.querySelector('.ml-word-head')?.textContent;
      const group=stage.querySelector('.ul-word-equation');
      const selected=stage.querySelector('.g74-word-option-select');
      if(selected)selected.click();
      const fields=['n1','op','n2','sum','answer'];
      const answers=['12',op,'6',op==='+'?'18':'6',op==='+'?'18':'6'];
      for(let i=0;i<fields.length;i++){
       const input=stage.querySelector('[data-ml-field="'+q.publicVariant.questionId+':'+fields[i]+'"]');
       if(!input)return {error:'MISSING_FIELD_'+fields[i],names,labels};
       input.value=answers[i];input.dispatchEvent(new Event('input',{bubbles:true}));
      }
      const draft=window.ULTLAB.getDraft();
      const noGrade=await window.ULTLAB.grade();
      return {names,labels,fontSizes,inputModes:inputs.map(x=>x.inputMode),summary,caption,prompt,
        equationGroup:group?.getAttribute('aria-label'),equationRole:group?.getAttribute('role'),
        allFields:inputs.length,options:stage.querySelectorAll('.g74-word-option-select').length,
        draft,noGrade,overflow:document.documentElement.scrollWidth>innerWidth+3};
    },op);
    assert(!ret.error,JSON.stringify(ret));
    assert.deepEqual(ret.names,['n1','op','n2','sum','answer']);
    assert.equal(ret.allFields,5);
    assert(ret.labels.every(s=>typeof s==='string'&&s.length>=5&&!/^(n1|op|n2|sum|answer):?$/i.test(s)),'machine label leaked');
    assert(ret.fontSizes.every(s=>s==='16px'),'D10 font regression');
    assert.equal(ret.equationRole,'group');assert.equal(ret.equationGroup,'Phép tính một bước');
    assert(ret.caption.includes('Đáp số'));assert(ret.options>=1);
    assert(ret.summary&&ret.prompt&&!ret.overflow);
    assert.equal(ret.draft.fields.op,op);assert.equal(ret.draft.fields.n1,'12');assert.equal(ret.draft.fields.n2,'6');
    assert.equal(ret.draft.fields.sum,op==='+'?'18':'6');assert.equal(ret.draft.fields.answer,op==='+'?'18':'6');
    assert(typeof ret.draft.selectedStatementId==='string','Missing statement choice');
    assert.equal(ret.noGrade.status,'NOT_AUTHORIZED','LAB tried to grant trusted scoring');
    report.results.push({device:view.name,operator:op,pass:true,fields:ret.names,semanticLabels:ret.labels,
      equationGroup:ret.equationGroup,oneStep:true,grade:'NOT_AUTHORIZED',noOverflow:true});
   }
   const reject=await page.evaluate(()=>{
    const p=JSON.parse(JSON.stringify(window.__ULTLAB_PACKS__.A));
    p.questions.find(q=>q.rendererId==='D10').publicVariant.calculationSteps=2;
    return window.ULTLAB.validate(p);
   });
   assert.equal(reject.reason,'D10_ONE_STEP_ONLY');
   report.results.push({device:view.name,operator:'two_steps',pass:true,reason:reject.reason});
  }finally{await context.close()}
 }
 assert.equal(report.errors.length,0);
 report.status='CHROMIUM_PEDAGOGY_A11Y_OBSERVABLES_PASS_PHYSICAL_SCREENREADER_AND_GRADER_PENDING';
 console.log('N4_FINAL_A_D10_BROWSER_PASS',report.results.length,'scoped cases; GRADING NO_GRANT');
}catch(e){report.status='FAIL';report.errors.push(String(e.stack||e));console.error(e);process.exitCode=1}
finally{fs.writeFileSync(path.join(output,'N4_FINAL_A_D10_PEDAGOGY_A11Y_REPORT.json'),JSON.stringify(report,null,2)+'\n');await browser.close();await close()}
})().catch(e=>{console.error(e);process.exitCode=1});
