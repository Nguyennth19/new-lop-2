'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const delta=require('./synth5-prompt-delta.review.json'),baseDir=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(baseDir,p)),blob=b=>createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const pack=JSON.parse(read('pilot-lessons.review.json').toString('utf8')),find=id=>pack.lessons.flatMap(x=>x.questions).find(x=>x.variantId===id);
test('pinned source/admission/composite/grader blobs unchanged',()=>{
 assert.equal(blob(read('pilot-lessons.review.json')),delta.baseSourceGitBlobSha);
 assert.equal(blob(read('pilot-grader.qa-only.cjs')),delta.baseGraderGitBlobSha);
 assert.equal(blob(read('b1-admission.review.json')),delta.baseAdmissionGitBlobSha);
 assert.equal(blob(read('b1-composite.review.json')),delta.baseCompositeGitBlobSha);
});
test('only one SYNTH_5 prompt text field changes',()=>{
 const base=find('N13B1_SYNTH_5');assert(base);assert.equal(delta.contract,'N13_SYNTH5_PROMPT_ONLY_DELTA_V1');
 assert.equal(delta.baseCommit,'c7f7773c796c7fd853aa3dcb0b47bd1379d7cf41');
 assert.deepEqual(delta.change,{path:'reviewDto.parts[id=b].model.prompt.text',before:'Chọn các số lớn hơn 30 và bé hơn 34.',after:'Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.'});
 const expected=JSON.parse(JSON.stringify(base));expected.reviewDto.parts.find(p=>p.id==='b').model.prompt.text=delta.change.after;assert.deepEqual(delta.question,expected);
 const reverted=JSON.parse(JSON.stringify(delta.question));reverted.reviewDto.parts.find(p=>p.id==='b').model.prompt.text=delta.change.before;assert.deepEqual(reverted,base);
});
test('variant metadata and all release gates preserved',()=>{
 const base=find('N13B1_SYNTH_5');
 for(const k of ['variantId','lessonId','level','skillIdCandidate','sourceExerciseId','sourceOrigin','sourceAnchor','reuseRef','visualIntent','assetId','semanticMapping','rendererGrant','publicVariant','studentRelease'])assert.deepEqual(delta.question[k],base[k],k);
 assert.equal(delta.question.level,'LV2');assert.equal(delta.question.rendererGrant,'DENY');assert.equal(delta.question.publicVariant,null);assert.equal(delta.question.studentRelease,false);assert.equal(delta.question.sourceExerciseId,null);
});
test('part A, MULTIPLE mode, options and y/z QA key unchanged',()=>{
 const base=find('N13B1_SYNTH_5'),[a,b]=delta.question.reviewDto.parts;
 assert.deepEqual(a,base.reviewDto.parts[0]);assert.equal(b.id,'b');assert.equal(b.kind,'D4');assert.equal(b.model.questionId,'b');assert.equal(b.model.selectionMode,'MULTIPLE');assert.equal(b.model.speechEnabled,true);
 assert.deepEqual(b.model.options,base.reviewDto.parts[1].model.options);
 assert.deepEqual(b.model.options.map(x=>[x.id,x.content.text]),[['x','30'],['y','31'],['z','33'],['w','34']]);
 assert.match(read('pilot-grader.qa-only.cjs').toString('utf8'),/N13B1_SYNTH_5:\{b:\['y','z'\]\}/);
});
test('SYNTH_3/4/6 stay denied in the pinned pack',()=>{
 for(const id of ['N13B1_SYNTH_3','N13B1_SYNTH_4','N13B1_SYNTH_6']){const q=find(id);assert(q);assert.equal(q.rendererGrant,'DENY');assert.equal(q.publicVariant,null);assert.equal(q.studentRelease,false);}
});
