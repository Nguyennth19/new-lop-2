'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=x=>fs.readFileSync(path.resolve(__dirname,'../..',x),'utf8');
const policy=JSON.parse(read('qa/g7-4-renderer-batch-qa-v1/qa-c3-d8ab-asset-policy.v1.json'));
const inventory=JSON.parse(read('qa/g7-4-capacity-weight-reference-v11/asset-inventory.v11.json'));
const registry=JSON.parse(read('du-lieu/asset-selector/asset-registry-288.v1.json'));
const core=require('../g7-4-capacity-weight-reference-v11/capacity-weight-v11-core.js');
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++},eq=(a,b,m)=>{assert.deepStrictEqual(a,b,m);n++};
eq(policy.decision,'SVG_DYNAMIC_MATH_IS_AUTHORITATIVE_STATIC_ASSETS_OPTIONAL_UNTIL_APPROVED');
eq(policy.renderer8A.approvedStaticAssetId,null);eq(policy.renderer8B.approvedStaticAssetId,null);
eq(inventory.entries.filter(x=>x.approvedAssetId).length,0);
for(const [item,family,drive] of [[policy.renderer8A.optionalCandidate,'KL_M05','15cwvMibrCmTTbL2mYCdyoSQvMVE3pyJ7'],[policy.renderer8B.optionalCandidate,'KL_M04','1Tq481TgyU2mYFR7g8t3xZs0uQGQjgXI-']]){
 const asset=registry.assets.find(x=>x.asset_id===item.assetId);
 ok(!!asset,'registry ID present');
 ok(item.assetId.startsWith(family));
 eq(asset.label_status,'LABEL_APPROVED');
 eq(asset.content_qa,'PENDING_UNLESS_EXPLICITLY_VERIFIED');
 eq(item.canActivate,false);
 eq(item.sourcePngDriveId,drive);
 ok(inventory.entries.some(e=>e.driveId===drive&&e.approvedAssetId===null),'no fictitious renderer mapping');
}
for(const [a,b,rel] of [[3,5,'LEFT_LIGHTER'],[5,3,'RIGHT_LIGHTER'],[5,5,'BALANCED']]){
 const tilt=core.balanceTilt(a,b);eq(tilt.relation,rel);
 if(a<b)ok(tilt.leftY<tilt.rightY,'left lighter pan rises');
 if(a>b)ok(tilt.leftY>tilt.rightY,'right lighter pan rises');
 if(a===b)eq(tilt.leftY,tilt.rightY);
}
const c2=read('qa/g7-4-renderer-batch-qa-v1/qa-c2-renderer-parity-lab.html');
ok(c2.includes('G74Type1C2.mount'),'real DOM renderer kept');
ok(c2.includes('G74ColumnKeypadC2.mount'),'optional native-input keypad kept');
const legacy=read('42_AdapterBienTheB20.html');
const grader=read('26_ChamCauHoiToan.html');
ok(legacy.includes('answer:String(q.answer)'),'block remains: legacy client answer field');
ok(grader.includes('Number(q.answer)'),'block remains: client-side comparison');
eq(policy.gate,'PASS_SVG_PRIMARY_POLICY_STATIC_ASSET_BINDING_PENDING');
console.log('QA-C3-ASSET-AND-D10-BOUNDARY PASS',n,'assertions; two existing registry IDs identified NOT bound; D10 legacy P0 carried');
