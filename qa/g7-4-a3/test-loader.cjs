#!/usr/bin/env node
'use strict';
// G7.4-A.3: isolated QA; does not modify the application, DOM, CSS or production.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const RELEASE='653bfbc73002a188dcea0b714247b84cc28a4fed';
const BASE='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/'+RELEASE+'/hinh-anh/webp-g7/v1/';
const MANIFEST_URL='https://raw.githubusercontent.com/Nguyennth19/new-lop-2/'+RELEASE+'/ASSET_288_RELEASE_CANDIDATE_MANIFEST.json';
const source=fs.readFileSync(path.join(ROOT,'42_TaiAnhTheoAssetID.html'),'utf8');
const sandbox={module:{exports:{}},globalThis:{},setTimeout,clearTimeout,AbortController};
sandbox.globalThis=sandbox;
vm.runInNewContext(source,sandbox,{filename:'42_TaiAnhTheoAssetID.html'});
const api=sandbox.module.exports;
const report=[];
async function test(name,run){
  try {await run();report.push({name,status:'PASS'});console.log('PASS',name);}
  catch(err){report.push({name,status:'FAIL',message:String(err)});console.error('FAIL',name,String(err));}
}
function mockDom(kind='svg'){
  const children=[{kind}],listeners={};
  const target={children,appendChild(img){children.push(img);img.parentNode=this;},removeChild(img){const i=children.indexOf(img);if(i>=0)children.splice(i,1);img.parentNode=null;}};
  let image;
  const doc={createElement(){image={dataset:{},addEventListener(event,cb){listeners[event]=cb;},trigger(event){if(listeners[event])listeners[event]();}};return image;}};
  return {target,doc,get img(){return image;}};
}
(async()=>{
  const response=await fetch(MANIFEST_URL);
  assert.equal(response.status,200,'Pinned manifest download must return 200');
  const manifest=await response.json();
  const loader=api.create({manifestUrl:MANIFEST_URL,assetBaseUrl:BASE,allowCandidate:true});
  await test('Manifest has exactly 288 unique valid IDs',()=>assert.equal(api.validateManifest(manifest,{allowCandidate:true}).count,288));
  await test('Candidate blocked by default',()=>assert.equal(api.validateManifest(manifest).code,'RELEASE_NOT_APPROVED'));
  await test('Opt-in useManifest succeeds',()=>assert.equal(loader.useManifest(manifest).ok,true));
  await test('SH ID resolves immutable pinned path',()=>assert.equal(loader.resolve('KL_SH01_001').url,BASE+'WEBP/SH01/KL-SH01-01.webp'));
  await test('M ID resolves immutable pinned path',()=>assert.equal(loader.resolve('KL_M12_012').url,BASE+'WEBP/M12/KL-M12-12.webp'));
  await test('All 288 IDs resolve to matching paths',()=>assert.equal(manifest.assets.every(a=>loader.resolve(a.asset_id).url===BASE+a.relative_path),true));
  await test('Malformed ID is refused',()=>assert.equal(loader.lookup('../etc').code,'INVALID_ASSET_ID'));
  await test('Absent valid ID refused',()=>assert.equal(loader.lookup('KL_M01_099').code,'ASSET_NOT_FOUND'));
  await test('HTTP is disallowed',()=>assert.equal(api.validateBaseUrl('http://example.com/'),false));
  await test('Constructor is inert',()=>assert.equal(api.create({assetBaseUrl:BASE}).status().state,'IDLE'));
  await test('Mount success does not replace SVG',()=>{
    const d=mockDom();const r=loader.mount(d.target,'KL_M01_008',{document:d.doc});
    assert.equal(r.ok,true);assert.equal(d.target.children[0].kind,'svg');assert.equal(d.target.children.length,2);
  });
  await test('404 image event restores SVG without removing it',()=>{
    const d=mockDom();let code=null;loader.mount(d.target,'KL_SH01_001',{document:d.doc,onFallback:c=>code=c});d.img.trigger('error');
    assert.equal(code,'IMAGE_LOAD_FAILED');assert.equal(d.target.children.length,1);assert.equal(d.target.children[0].kind,'svg');
  });
  await test('Network image event restores emoji without removing it',()=>{
    const d=mockDom('emoji');let code=null;loader.mount(d.target,'KL_M12_012',{document:d.doc,onFallback:c=>code=c});d.img.trigger('error');
    assert.equal(code,'IMAGE_LOAD_FAILED');assert.equal(d.target.children.length,1);assert.equal(d.target.children[0].kind,'emoji');
  });
  await test('Missing ID calls fallback and retains SVG',()=>{
    const d=mockDom();let code=null;const r=loader.mount(d.target,'KL_SH01_099',{document:d.doc,onFallback:c=>code=c});
    assert.equal(r.code,'ASSET_NOT_FOUND');assert.equal(code,r.code);assert.equal(d.target.children.length,1);
  });
  await test('Manifest not ready retains SVG',()=>{
    const d=mockDom();let code=null;const l=api.create({assetBaseUrl:BASE});const r=l.mount(d.target,'KL_SH01_001',{document:d.doc,onFallback:c=>code=c});
    assert.equal(r.code,'MANIFEST_NOT_READY');assert.equal(code,r.code);assert.equal(d.target.children.length,1);
  });
  await test('Missing asset host retains SVG',()=>{
    const d=mockDom();let code=null;const l=api.create({assetBaseUrl:'',allowCandidate:true});assert.equal(l.useManifest(manifest).ok,true);
    const r=l.mount(d.target,'KL_SH01_001',{document:d.doc,onFallback:c=>code=c});
    assert.equal(r.code,'ASSET_HOST_NOT_CONFIGURED');assert.equal(code,r.code);assert.equal(d.target.children.length,1);
  });
  await test('Manifest fetch network failure has structured status',async()=>{
    const l=api.create({manifestUrl:MANIFEST_URL,assetBaseUrl:BASE,allowCandidate:true,fetchFn:async()=>{throw Error('offline');}});
    assert.equal((await l.init()).code,'FETCH_FAILED');
  });
  await test('Manifest HTTP 404 has structured status',async()=>{
    const l=api.create({manifestUrl:MANIFEST_URL,assetBaseUrl:BASE,allowCandidate:true,fetchFn:async()=>({ok:false,status:404})});
    assert.equal((await l.init()).code,'FETCH_FAILED');
  });
  const failed=report.filter(x=>x.status==='FAIL').length;
  console.log(JSON.stringify({stage:'G7.4-A.3',release:RELEASE,total:report.length,passed:report.length-failed,failed,results:report},null,2));
  process.exitCode=failed?1:0;
})().catch(err=>{console.error('BLOCKED: cannot fetch pinned manifest:',err);process.exitCode=2;});
