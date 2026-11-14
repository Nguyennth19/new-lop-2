'use strict';
const assert=require('node:assert/strict');
const V12=require('./capacity-weight-v12-view.js');
let count=0;
const near=(a,b,why)=>{assert.ok(Math.abs(a-b)<1e-8,why+': '+a+' !== '+b);count++};
const yes=(v,why)=>{assert.ok(v,why);count++};
const a=V12.literGeometry(8,3,8),b=V12.literGeometry(5,1,8);
near(a.step,b.step,'shared 1L step');
near(a.vesselHeight/b.vesselHeight,8/5,'8L silhouette proportional to 5L');
near(a.vesselHeight,8*a.step,'8 liter ticks');near(b.vesselHeight,5*b.step,'5 liter ticks');
near(a.waterHeight,3*a.step,'3 liter water');near(b.waterHeight,1*b.step,'1 liter water');
near(a.bottom,b.bottom,'same bottom datum');
near(a.waterTop,204-3*a.step,'8L level from bottom');
near(b.waterTop,204-b.step,'5L level from bottom');
const sameLiters=V12.literGeometry(5,3,8);
near(sameLiters.waterTop,a.waterTop,'3 liters same absolute height in both containers');
for(const cap of [1,2,5,8,10,12,15,20,100]){
 for(const now of [0,Math.floor(cap/2),cap]){
  const g=V12.literGeometry(cap,now,Math.max(cap,8));
  near(g.waterHeight,now*g.step,'waterHeight formula '+cap+'/'+now);
  near(g.vesselHeight,cap*g.step,'vessel formula '+cap+'/'+now);
  yes(g.waterTop>=g.vesselTop&&g.waterTop<=g.bottom,'fill bounds');
 }
}
for(const args of [[0,0,8],[5,6,8],[8,-1,8],[8,3,5],[101,5,101],[5,2,0]]){
 assert.throws(()=>V12.literGeometry(...args));count++;
}
console.log('QA_D2_PROPORTIONAL_LITER_GEOMETRY_PASS',count,'assertions');
