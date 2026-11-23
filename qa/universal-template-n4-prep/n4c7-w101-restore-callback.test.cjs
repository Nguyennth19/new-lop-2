'use strict';
/* W1-01 supplemental *behavioral evidence*, not W1 closure or learner release.
   Frozen original renderer/CSS untouched. Explicitly assert one final callback
   (not zero) and never emit any intermediate callback from restore/clear.
*/
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),{makeC}=require('../universal-template-r12/fixture-modes.cjs');
const dist=path.resolve(__dirname,'../universal-template-v1/dist');
const out=path.resolve(__dirname,'dist/N4C7_W101');fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(dist,'LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html'));
const report={scope:'W1-01_D1_D2_DIRECT_CALLBACK_SPY',status:'RUNNING',
 browser:'REAL_CHROMIUM_DESKTOP_AND_MOBILE_EMULATION_NOT_PHONE_HARDWARE',
 ownerSignoff:'PENDING',independentQA:'PENDING',results:[],errors:[]};
const server=http.createServer((req,res)=>{if(req.url==='/lab'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)}else{res.statusCode=404;res.end('LAB_ONLY')}});
const listen=()=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));
const close=()=>new Promise(r=>server.close(r));
(async()=>{
 const port=await listen(),browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.ULT_SYSTEM_CHROME==='1'?{channel:'chrome'}:{})});
 try{
  for(const viewport of [{name:'desktop1366',width:1366,height:768,touch:false},{name:'mobile390',width:390,height:844,touch:true}]){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},hasTouch:viewport.touch,isMobile:viewport.touch});
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({viewport:viewport.name,error:String(e)}));
   try{
    await page.goto('http://127.0.0.1:'+port+'/lab');
    await page.waitForFunction(()=>window.ULTLAB&&window.ULTLAB_HARDENING&&window.G74Type1C2&&window.KLColumnV12);
    const result=await page.evaluate(pack=>{
      const findings=[];
      const stable=x=>JSON.stringify(x);
      // D1 direct harness, no test bypass, renderer callback observer.
      const q1=pack.questions.find(q=>q.rendererId==='D1'),host1=document.createElement('div');
      document.body.append(host1);let calls1=[];
      const d1=window.ULTLAB_HARDENING.wrapD1(window.G74Type1C2,host1,q1.publicVariant,s=>calls1.push(JSON.parse(JSON.stringify(s))));
      assert(d1.ok,'D1 mount failed');
      const init=d1.snapshot(), ids=Object.keys(init.values);
      const target={variantId:init.variantId,values:{...init.values},active:'t1_split2'};
      for(const id of ids)target.values[id]='';
      target.values.t1_split1='0';target.values.t1_split2='34';
      calls1=[];const restore=d1.restore(target);
      assert(restore.ok,'D1 restore failed');
      assert(calls1.length===1,'D1 restore fired '+calls1.length+' callbacks, expected final only');
      assert(stable(calls1[0])===stable(d1.snapshot()),'D1 callback not final snapshot');
      assert(d1.snapshot().values.t1_split1==='0'&&d1.snapshot().values.t1_split2==='34','D1 zero/empty/digits lost');
      assert(d1.snapshot().values[ids.find(x=>x!=='t1_split1'&&x!=='t1_split2')]==='','D1 blank no longer blank');
      assert(d1.snapshot().active==='t1_split2','D1 selected target not restored');
      findings.push({id:'D1_ZERO_EMPTY_ACTIVE_FINAL_ONLY',callbacks:calls1.length,active:d1.snapshot().active,slots:ids.length});
      calls1=[];const invalid=d1.restore({...target,active:'unknown_slot'});
      assert(!invalid.ok&&calls1.length===0,'D1 invalid restore must be rejected silently');
      assert(d1.snapshot().values.t1_split1==='0','D1 invalid restore mutated state');
      findings.push({id:'D1_INVALID_DRAFT_ATOMIC_REJECTION',callbacks:calls1.length,reason:invalid.reason});
      calls1=[];const clear=d1.clear();assert(clear.ok&&calls1.length===1,'D1 clear did not emit exactly final callback');
      assert(stable(calls1[0])===stable(d1.snapshot()),'D1 clear callback not final');
      findings.push({id:'D1_CLEAR_FINAL_ONLY',callbacks:calls1.length});
      d1.destroy();host1.remove();

      // D2 direct harness: test PV100, PV1000, subtract/borrow separately.
      const spec=[
       ['D2_PV100_ZERO_EMPTY',pack.questions.find(q=>q.rendererId==='D2').publicVariant],
       ['D2_PV1000_CARRY',pack.questions.find(q=>q.questionId==='R2_C_D2_PV1000').publicVariant],
       ['D2_PV100_BORROW',pack.questions.find(q=>q.questionId==='R2_C_D2_SUBTRACT').publicVariant]
      ];
      for(const [label,variant] of spec){
       assert(variant,label+' missing public fixture');
       const plan=window.KLColumnV12.publicPlan(variant);assert(plan.ok,label+' public plan invalid');
       const host=document.createElement('div');document.body.append(host);let messages=[];
       const d2=window.ULTLAB_HARDENING.wrapD2(window.KLColumnViewV12,host,plan,s=>messages.push(JSON.parse(JSON.stringify(s))),()=>{});
       assert(d2.ok,label+' mount failed');
       const initial=d2.snapshot(),target={...initial};
       for(const slot of plan.answerSlots)target[slot.id]='';
       target.result_ones='0';
       for(const t of plan.transitionSlots)target[t.id]=true;
       messages=[];const r=d2.restore(target,'result_ones');
       assert(r.ok,label+' restore failed');
       assert(messages.length===1,label+' had '+messages.length+' callbacks during restore');
       assert(stable(messages[0])===stable(d2.snapshot()),label+' callback included intermediate state');
       assert(d2.snapshot().result_ones==='0'&&d2.snapshot().result_tens==='',label+' zero/empty lost');
       assert(document.activeElement?.dataset.answer==='result_ones',label+' focus mismatch');
       findings.push({id:label+'_RESTORE_ONE_FINAL_CALLBACK',callbackCount:messages.length,transitionCount:plan.transitionSlots.length});
       messages=[];const bad=d2.restore({...target,result_ones:'12'},'result_ones');
       assert(!bad.ok&&messages.length===0,label+' invalid draft emitted callbacks');
       assert(d2.snapshot().result_ones==='0',label+' invalid draft mutated');
       findings.push({id:label+'_INVALID_REJECTS_ATOMICALLY',callbackCount:messages.length});
       messages=[];assert(d2.clear().ok,label+' clear failed');
       assert(messages.length===1&&stable(messages[0])===stable(d2.snapshot()),label+' clear did not emit one final state');
       findings.push({id:label+'_CLEAR_ONE_FINAL_CALLBACK',callbackCount:messages.length});
       d2.destroy();host.remove();
      }
      return findings;
    },makeC());
    for(const entry of result)report.results.push({viewport:viewport.name,...entry,pass:true});
    assert(result.length===12,viewport.name+' expected 12 W1-01 checks');
   }finally{await context.close()}
  }
  assert.equal(report.errors.length,0,'Javascript page errors');
  report.status='CHROMIUM_W101_CALLBACK_GATE_PASS_HUMAN_REVIEW_PENDING';
  console.log('N4C7_W101_BROWSER_GATE_PASS',report.results.length,'assertion groups; human QA PENDING');
 }catch(e){report.status='FAIL';report.errors.push(String(e.stack||e));console.error(e);process.exitCode=1}
 finally{fs.writeFileSync(path.join(out,'N4C7_W101_CALLBACK_EVIDENCE.json'),JSON.stringify(report,null,2)+'\n');await browser.close();await close()}
})().catch(e=>{console.error(e);process.exitCode=1});
