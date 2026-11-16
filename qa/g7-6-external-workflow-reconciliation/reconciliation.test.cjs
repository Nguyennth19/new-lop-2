'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const child=require('node:child_process');
const x=require('./module-crosswalk.v1.json'),c=require('./checkpoint.v1.json');
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++},ok=x=>{assert.ok(x);n++};
eq(x.matrix.length,52);eq(x.counts.total,52);eq(x.sources.pdfPages,317);eq(x.githubPins.scannedFileCounts.main,105);eq(x.githubPins.scannedFileCounts.testTheoMain,118);eq(x.githubPins.scannedFileCounts.isolatedAuditBaseline,757);
eq(x.sourceAndReleaseLocks.c08,'PENDING');eq(x.sourceAndReleaseLocks.c09,'PENDING');eq(x.sourceAndReleaseLocks.testRegistration,false);
const cls=['ALREADY_EXISTS','PARTIAL_EXISTS','DUPLICATE','CANDIDATE','RISK_NO_GO','UNVERIFIED'],opts=['REUSE','PROPOSE_RULE','TEST_ONLY','BACKLOG','REJECT_DIRECT'];
eq(new Set(x.matrix.map(r=>r.id)).size,52);
for(const r of x.matrix){ok(cls.includes(r.classification));ok(opts.includes(r.decision));ok(/^https:\/\/github\.com\/Nguyennth19\/new-lop-2\/blob\/[0-9a-f]{40}\//.test(r.githubUrl));ok(/^https:\/\//.test(r.driveUrl));eq(r.runtimeChangeAllowed,false);eq(r.ownerApprovalStatus,'NOT_GRANTED_BY_THIS_AUDIT');ok(r.sourcePdfPage>=1&&r.sourcePdfPage<=317);}
for(const r of x.matrix){
 const version=r.githubScope==='MAIN_CODE'?x.githubPins.main:x.githubPins.isolatedAuditBaseline;
 try{child.execFileSync('git',['cat-file','-e',version+':'+r.githubPath],{stdio:'ignore'});n++;}
 catch(e){throw Error('UNVERIFIED_GITHUB_FILE '+r.id+' '+r.githubPath);}
}
const tally={};for(const r of x.matrix)tally[r.classification]=(tally[r.classification]||0)+1;eq(tally,x.counts.byClass);eq(tally['RISK_NO_GO']>5,true);
const csv=fs.readFileSync(path.join(__dirname,'module-crosswalk.v1.csv'),'utf8');
eq(csv.trim().split(/\r?\n/).length,53);eq(csv.includes('EXTERNAL'),false);
for(const value of Object.values(c.noGo))eq(value,true);
eq(c.baseCommit,x.githubPins.isolatedAuditBaseline);eq(c.c08,'PENDING');eq(c.c09,'PENDING_C08');
console.log('G76_EXTERNAL_WORKFLOW_RECONCILIATION_AUDIT_PASS',n,'assertions; NO GO runtime, owner unapproved');