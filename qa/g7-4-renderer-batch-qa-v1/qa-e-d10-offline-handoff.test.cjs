'use strict';
/* QA-E preflight only. Verifies an answer-free G6 word renderer projection and
 * a private offline grade. Explicitly proves current G6/B20 runtime unsafe and NOT deployed.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const {createOfflineHandoff}=require('./qa-e-d10-offline-handoff.cjs');
const F=require('../g7-4-word-problem-unification-v11/word-unification-v11-fixtures.js');
let assertions=0;
const ok=(x,m)=>{assert.ok(x,m);assertions++},eq=(a,b,m)=>{assert.deepEqual(a,b,m);assertions++};
const data={
 lessonId:'LESSON_QAE_OFFLINE',questionId:'WORD_QAE_TEST_001',mode:'SELECT_STATEMENT',
 purpose:'ASSESSMENT',sourceRole:'DEMO_TEST_REFERENCE',calculationSteps:1,
 prompt:F.rice.prompt,summary:F.rice.summary,unit:F.rice.unit,
 statementOptions:F.rice.statementOptions,correctStatementId:'st1',
 operation:'SUBTRACT',a:36,b:12,expectedAnswer:24,
 pedagogyApproval:{status:'APPROVED_BY_TEACHER',evidenceRef:'UNIT_TEST_FIXTURE_NOT_REAL_APPROVAL'}
};
const handoff=createOfflineHandoff([data]);
const pub=handoff.publish(data.questionId);ok(pub.ok);
eq(pub.deliveryMode,'SERVER_GRADED_REQUIRED_NO_CLIENT_GRADER');
eq(handoff.validateProjection(pub).ok,true);
for(const k of ['answer','n1','n2','op','correctStatementId','answerExplanation'])
 eq(Object.prototype.hasOwnProperty.call(pub.publicQuestion,k),false);
eq(pub.publicQuestion.solutionPrompt,'');
ok(!JSON.stringify(pub.publicQuestion).includes('"expectedAnswer"'));
const rendererSource=read('41_HienThiCauHoiToan.html');
const renderer=new Function(rendererSource+'\nreturn taoHienThiCauToan;')();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const g6=renderer({E:esc,input:(q,id,length)=>'<input data-ml-field="'+esc(id)+'" maxlength="'+length+'">',
baseCard:(q,inside)=>'<article class="ml-word-card ml-word-structured" data-ml-q-card="'+esc(q.id)+'">'+inside+'</article>'});
const dom=g6.word(pub.publicQuestion);
ok(dom.includes('ml-word-card ml-word-structured'));
for(const k of ['n1','op','n2','sum','answer'])
 ok(dom.includes('data-ml-field="'+data.questionId+':'+k+'"'),'missing G6 field '+k);
ok(!dom.includes('>24<')&&!dom.includes('"24"')&&!dom.includes('answerKey'));
const req={lessonId:data.lessonId,questionId:data.questionId,mode:'SELECT_STATEMENT',
 selectedStatementId:'st1',fields:{n1:'36',op:'-',n2:'12',sum:'24',answer:'24'}};
eq(handoff.gradeOffline(req).correct,true);
eq(handoff.gradeOffline({...req,selectedStatementId:'st2'}).correct,false);
eq(handoff.gradeOffline({...req,fields:{...req.fields,sum:'25'}}).correct,false);
eq(handoff.publish('BOGUS').ok,false);
eq(handoff.validateProjection({...pub,publicQuestion:{...pub.publicQuestion,answer:'24'}}).code,'CLIENT_ANSWER_FIELD_LEAK');
const legacy=read('42_AdapterBienTheB20.html'),legacyGrader=read('26_ChamCauHoiToan.html');
ok(legacy.includes('answer:String(q.answer)'),'Do not mark legacy client leak fixed');
ok(legacyGrader.includes('Number(q.answer)'),'Existing G6 client grader requires answer; cannot activate public projection without server route');
eq(handoff.gasIntegrated,false);eq(handoff.g6SourceModified,false);eq(handoff.studentDataWrites,false);
console.log('PASS QA-E PREP '+assertions+' assertions: G6 word HTML renders without key, offline trusted service grades, LEGACY RUNTIME BLOCKED');
