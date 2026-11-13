'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const Engine=require('./geometry-v11-core.js'),f=require('./geometry-v11-fixtures.js');let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++},ok=a=>{assert.ok(a);n++};
const shapes=Engine.compile(f.shape),tan=Engine.compile(f.tangram);ok(shapes.ok);ok(tan.ok);
eq(shapes.plan.items.length,6);eq(tan.plan.items.length,3);eq(tan.plan.targets.length,3);
ok(Object.isFrozen(shapes.plan));ok(Object.isFrozen(shapes.plan.items[0].geometry.points[0]));
const ss=Engine.session(shapes.plan);eq(ss.snapshot().selectedShapeIds,[]);
ss.toggleShape('s1');ss.toggleShape('s3');eq(ss.snapshot().selectedShapeIds,['s1','s3']);
ss.toggleShape('s1');eq(ss.snapshot().selectedShapeIds,['s3']);
eq(ss.toggleShape('missing').reason,'UNKNOWN_SHAPE');eq(ss.rotatePiece('s1').reason,'WRONG_MODE');
eq(ss.restore({exerciseId:'GEO_SHAPES_REFERENCE',mode:'SHAPE_SELECT',selectedShapeIds:['s2','s2']}).reason,'INVALID_DRAFT_SHAPES');
eq(ss.snapshot().selectedShapeIds,['s3']);
ok(ss.restore({exerciseId:'GEO_SHAPES_REFERENCE',mode:'SHAPE_SELECT',selectedShapeIds:['s6','s2']}).ok);
eq(ss.snapshot().selectedShapeIds,['s6','s2']);ss.clear();eq(ss.snapshot().selectedShapeIds,[]);
const ts=Engine.session(tan.plan);eq(ts.snapshot().pieces.roof.rotation,90);
ok(ts.selectPiece('roof').ok);ok(ts.rotatePiece('roof').ok);eq(ts.snapshot().pieces.roof.rotation,180);
ok(ts.placePiece('roof','target_roof').ok);eq(ts.snapshot().pieces.roof.placedTargetId,'target_roof');
eq(ts.snapshot().pieces.roof.rotation,180); // No silent auto-zeroing.
eq(ts.placePiece('wall','target_roof').reason,'TARGET_OCCUPIED');
ok(ts.movePiece('roof',90,100).ok);eq(ts.snapshot().pieces.roof.placedTargetId,null);
eq(ts.rotatePiece('roof',45).reason,'INVALID_ROTATION');eq(ts.selectPiece('missing').reason,'UNKNOWN_PIECE');
const saved=ts.snapshot();
const invalid=JSON.parse(JSON.stringify(saved));invalid.pieces.wall.placedTargetId='target_roof';invalid.pieces.roof.placedTargetId='target_roof';
eq(ts.restore(invalid).reason,'INVALID_DRAFT_PIECE_STATE');eq(ts.snapshot(),saved);
ok(ts.restore(saved).ok);ts.clear();eq(ts.snapshot().pieces.roof.rotation,90);
for(let i=0;i<100;i++){
 const data={...f.shape,exerciseId:'SHAPE_VARIANT_'+i,
 shapes:f.shape.shapes.map((p,j)=>({...p,id:'x'+j,label:'Biến thể '+i+' '+j}))};
 ok(Engine.compile(data).ok);
}
for(const v of [
 {...f.shape,shapes:[{...f.shape.shapes[0],isQuad:true},...f.shape.shapes.slice(1)]},
 {...f.tangram,pieces:[{...f.tangram.pieces[0],targetRot:0},...f.tangram.pieces.slice(1)]},
 {...f.tangram,answerKey:{roof:'target_roof'}}
])eq(Engine.compile(v).reason,'ANSWER_KEY_FORBIDDEN');
eq(Engine.compile({...f.shape,shapes:[{...f.shape.shapes[0],geometry:{type:'path',d:'M0 0'}},...f.shape.shapes.slice(1)]}).reason,'INVALID_GEOMETRY');
for(const filename of ['geometry-v11-view.js','geometry-v11-fixtures.js']){
 const src=fs.readFileSync(__dirname+'/'+filename,'utf8');new vm.Script(src);
 ok(!/google\.script\.run|localStorage|awardStars|showFeedback/.test(src));
}
const locked=fs.readFileSync(__dirname+'/../g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html');
eq(crypto.createHash('sha256').update(locked).digest('hex'),'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
console.log('PASS '+n+' assertions incl 100 shape variant contracts, two modes, SHA and safety');
