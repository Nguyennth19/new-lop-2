'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {loadManifest,checkManifest,validateEnvelope,resolvePublicEnvelope}=require('./resource-renderer-resolver.cjs');
const root=path.resolve(__dirname,'../..'),manifest=loadManifest();let n=0;
function eq(a,b,msg){assert.deepStrictEqual(a,b,msg);n++}
function ok(v,msg){assert.ok(v,msg);n++}
function packet(typeId='D1',updates={}){
 const strategies={D1:'STRUCTURED_DIAGRAM',D2:'HTML_FIELDS',D3:'HTML_FIELDS',D4:'HTML_FIELDS',
  D5:'PARAMETRIC_SVG',D6:'HTML_FIELDS',D7:'PARAMETRIC_SVG',D8:'PARAMETRIC_SVG',
  D8A:'PARAMETRIC_SVG',D8B:'PARAMETRIC_SVG',D9:'NO_VISUAL',D10:'HTML_FIELDS'};
 return {schemaVersion:'g76.public-envelope.v1',lessonId:'TOAN_B20',questionId:'Q_001',
  variantId:'V_001',typeId,mode:'PRACTICE',
  display:{prompt:'Em hãy quan sát rồi trả lời.',publicParameters:{a:8,b:5,dm:1,m:1}},
  visualIntent:{visualMode:typeId==='D9'?'EXACT_COUNT':'REPRESENTATIVE',renderStrategy:strategies[typeId]},
  speech:{enabled:true,profileId:'vi_math_v2_dynamic',visiblePromptOnly:true},...updates};
}
eq(checkManifest(manifest).count,12,'12 complete references');
eq(manifest.design.typeIds.length,12);
eq(manifest.assets.registry288.count,288);
eq(manifest.assets.registry288.categories,24);
eq(manifest.assets.fluentEmojiFlat.count,46);
eq(manifest.assets.fluentEmojiFlat.enabled,false);
eq(manifest.speechProfiles.defaultProfileId,'vi_math_v2_dynamic');
eq(manifest.release.ready,false);eq(manifest.release.gasDeployAllowed,false);
const asset=JSON.parse(fs.readFileSync(path.join(root,manifest.assets.registry288.path),'utf8'));
eq(asset.assets.length,288);eq(new Set(asset.assets.map(a=>a.category)).size,24);
eq(asset.assets.filter(a=>a.label_status==='LABEL_APPROVED').length,288);
eq(asset.assets.filter(a=>a.content_qa==='PENDING_UNLESS_EXPLICITLY_VERIFIED').length,288);
const fluent=JSON.parse(fs.readFileSync(path.join(root,manifest.assets.fluentEmojiFlat.path),'utf8'));
eq(fluent.total,46);eq(fluent.productionActivation,false);
eq(manifest.assets.repoSnapshotAtBaseCommit.webpFiles,13);
eq(manifest.assets.repoSnapshotAtBaseCommit.pngFiles,9);
eq(manifest.assets.repoSnapshotAtBaseCommit.svgFiles,46);
eq(manifest.assets.countComposition.status,'TEST_ONLY_COUNT_SAFE_GATED');
eq(manifest.legacyReference.frozenDemoHtml.sha256,'78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced');
const allPaths=[
 ...manifest.rendererRegistry.flatMap(x=>x.source.files),
 manifest.assets.registry288,manifest.assets.semanticPolicy,manifest.assets.visualIntentSchema,
 manifest.assets.visualModePolicy,manifest.assets.structuredDiagramPolicy,manifest.assets.fluentEmojiFlat,
 ...manifest.assets.countComposition.sources,...manifest.assets.pilotCharacters.files,
 manifest.legacyReference.frozenDemoHtml,...manifest.legacyReference.legacyG6Files
];
eq(allPaths.length>30,true);
for(const file of allPaths){
 ok(/^[a-f0-9]{40}$/.test(file.gitBlobSha),'pinned blob format '+file.path);
 ok(fs.existsSync(path.join(root,file.path)),'source exists '+file.path);
 const observed=execFileSync('git',['hash-object',file.path],{cwd:root,encoding:'utf8'}).trim();
 eq(observed,file.gitBlobSha,'source has not drifted '+file.path);
}
for(const p of manifest.speechProfiles.profiles){
 ok(/^[a-f0-9]{40}$/.test(p.gitBlobSha),'externally pinned voice file git blob '+p.id);
 ok(p.status.includes('STANDALONE'),'standalone voice not falsely integrated');
}
for(const id of manifest.design.typeIds){
 const actual=resolvePublicEnvelope(manifest,packet(id));
 if(id==='D10')eq(actual.code,'D10_EXISTING_G6_ONLY_NEW_VARIANT_ROUTE_DENIED');
 else {
  ok(actual.ok,id+' resolves reference descriptor');
  eq(actual.grading.enabled,false);eq(actual.releaseReady,false);eq(actual.voice.profileId,'vi_math_v2_dynamic');
  eq(actual.renderer.id,id);
  eq(actual.renderer.files.length>0,true);
  eq(actual.visual.assetId,null);
 }
}
const safe=packet('D1');eq(validateEnvelope(safe).ok,true);
const unsafe={...safe,display:{...safe.display,publicParameters:{...safe.display.publicParameters,answerKey:13}}};
eq(resolvePublicEnvelope(manifest,unsafe).code,'FORBIDDEN_OR_CYCLIC_PUBLIC_FIELD');
eq(resolvePublicEnvelope(manifest,{...safe,display:{...safe.display,publicParameters:{details:{solution:'13'}}}}).code,'FORBIDDEN_OR_CYCLIC_PUBLIC_FIELD');
eq(resolvePublicEnvelope(manifest,{...safe,display:{...safe.display,publicParameters:{result:13}}}).code,'FORBIDDEN_OR_CYCLIC_PUBLIC_FIELD');
eq(resolvePublicEnvelope(manifest,{...safe,visualIntent:{...safe.visualIntent,assetId:'KL_M04_001'}}).code,'STATIC_ASSET_BINDING_NOT_AUTHORIZED');
eq(resolvePublicEnvelope(manifest,{...safe,visualIntent:{...safe.visualIntent,visualMode:'EXACT_COUNT',renderStrategy:'REPEAT_APPROVED_ASSET'}}).code,'COUNT_SAFE_RESOLUTION_REQUIRES_TRUSTED_APPROVAL');
eq(resolvePublicEnvelope(manifest,{...safe,visualIntent:{...safe.visualIntent,countEvidenceRef:'untrusted'}}).code,'UNVERIFIED_CLIENT_COUNT_EVIDENCE');
eq(resolvePublicEnvelope(manifest,{...safe,typeId:'D12'}).code,'UNKNOWN_TYPE_OR_MODE');
eq(resolvePublicEnvelope(manifest,{...safe,typeId:'D10',mode:'ASSESSMENT'}).code,'D10_EXISTING_G6_ONLY_NEW_VARIANT_ROUTE_DENIED');
eq(resolvePublicEnvelope(manifest,{...safe,typeId:'D2',display:{...safe.display,publicParameters:{fourColumnRequired:true}},visualIntent:{visualMode:'REPRESENTATIVE',renderStrategy:'HTML_FIELDS'}}).code,'COLUMN_1000_BOUNDARY_PENDING');
eq(resolvePublicEnvelope(manifest,{...safe,speech:{...safe.speech,profileId:'unknown'}}).code,'VOICE_PROFILE_NOT_APPROVED');
eq(resolvePublicEnvelope(manifest,{...safe,visualIntent:{visualMode:'REPRESENTATIVE',renderStrategy:'PARAMETRIC_SVG'}}).code,'RENDER_STRATEGY_FORBIDDEN_FOR_TYPE');
eq(resolvePublicEnvelope(manifest,{...safe,studentScore:100}).code,'UNEXPECTED_ROOT_FIELD');
const mutated=JSON.parse(JSON.stringify(manifest));mutated.assets.fluentEmojiFlat.allowAutoFallback=true;
eq(resolvePublicEnvelope(mutated,safe).code,'MANIFEST_UNTRUSTED_FLUENT_AUTO_ACTIVATION');
const mutated2=JSON.parse(JSON.stringify(manifest));mutated2.release.ready=true;
eq(resolvePublicEnvelope(mutated2,safe).code,'MANIFEST_UNTRUSTED_RELEASE_GUARD_FAIL');
const schema=JSON.parse(fs.readFileSync(path.join(root,manifest.dataIntegration.contractPath),'utf8'));
eq(schema.properties.typeId.enum.length,12);
eq(schema.additionalProperties,false);
eq(schema.properties.display.additionalProperties,false);
eq(schema.properties.speech.additionalProperties,false);
console.log('G76_MANIFEST_RESOLVER_TEST_PASS',n,'assertions;',manifest.rendererRegistry.length,
 'pinned renderers; 288 assets; 46 Fluent SVG; D10 and grading fail-closed; GAS denied');
