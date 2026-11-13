/**
 * G7.4-B.5.3 — generic visualIntent enrichment for normalized variant JSON.
 * Pure module: no spreadsheets, network, UI, scoring or per-question asset mappings.
 * Original SGK/SBT + source runtime JSON are never modified.
 * This is a projection (enriched copy), not a migration of stored source records.
 */
var KLVisualIntentBienTheV1=(function(){
'use strict';
const VERSION='kidlearn-variant-visual-intent-v1';
const VALID_INTENT=['decorative','quantity','counting'];
const VALID_MODE=['symbolic','exact','counting','literal'];
const str=x=>typeof x==='string'?x.trim():'';
const source=x=>str(x).slice(0,2000);
function enrichQuestion(raw,options){
 options=options||{};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))
   throw Error('VISUAL_QUESTION_INVALID');
 const q=Object.assign({},raw),hasIntent=Object.prototype.hasOwnProperty.call(raw,'visualIntent');
 const word=raw.type==='word'||raw.type==='word_problem';
 if(!word&&!hasIntent)return q; // do not add decoration to arithmetic/other tasks
 const intent=hasIntent?raw.visualIntent:(word?'decorative':undefined);
 if(!VALID_INTENT.includes(intent))throw Error('VISUAL_INTENT_INVALID');
 const mode=raw.quantityMode||(intent==='decorative'?'symbolic':'exact');
 if(!VALID_MODE.includes(mode))throw Error('VISUAL_QUANTITY_MODE_INVALID');
 if(intent==='decorative'&&mode!=='symbolic')throw Error('VISUAL_DECORATIVE_EXACT_CONFLICT');
 if(intent!=='decorative'&&mode==='symbolic')throw Error('VISUAL_EXACT_INTENT_CONFLICT');
 const requestedCount=raw.requestedCount;
 if(intent!=='decorative'&&(!Number.isInteger(requestedCount)||requestedCount<1||requestedCount>48))
   throw Error('VISUAL_COUNT_REQUIRED');
 if(intent==='decorative'&&requestedCount!==undefined)throw Error('VISUAL_COUNT_FOR_DECORATIVE');
 const subject=str(raw.subject)||str(raw.unit);
 const tags=raw.semanticTags===undefined?(subject?[subject]:[]):raw.semanticTags;
 if(!Array.isArray(tags)||tags.length>12||tags.some(t=>typeof t!=='string'||!t.trim()||t.length>80))
   throw Error('VISUAL_TAGS_INVALID');
 if(new Set(tags).size!==tags.length)throw Error('VISUAL_TAGS_DUPLICATED');
 q.visualIntent=intent;q.quantityMode=mode;
 if(subject)q.subject=source(subject).slice(0,100);
 q.semanticTags=tags.slice();
 if(intent!=='decorative')q.requestedCount=requestedCount;
 return q;
}
function projectPack(pack,options){
 if(!pack||typeof pack!=='object'||!Array.isArray(pack.questions))
   throw Error('VISUAL_PACK_INVALID');
 const enriched=pack.questions.map(q=>enrichQuestion(q,options));
 const ids=new Set();
 for(const q of enriched){
  const id=q.question_id||q.id;
  if(typeof id!=='string'||!id||ids.has(id))throw Error('VISUAL_DUPLICATE_OR_MISSING_ID');
  ids.add(id);
 }
 return Object.assign({},pack,{questions:enriched,visualIntentSchema:VERSION});
}
function toSelectionRequest(q,options){
 if(!q||!VALID_INTENT.includes(q.visualIntent))return null;
 options=options||{};
 return {question_id:q.question_id||q.id,lesson_id:q.lesson_id||options.lesson_id,
  subjectArea:q.subjectArea||options.subjectArea||'toan',
  type:q.type,prompt:q.prompt,unit:q.unit,subject:q.subject,
  semanticTags:Array.isArray(q.semanticTags)?q.semanticTags.slice():[],
  visualIntent:q.visualIntent,quantityMode:q.quantityMode,
  ...(Number.isInteger(q.requestedCount)?{requestedCount:q.requestedCount}:{})};
}
/**
 * Generic pipeline, injected selector prevents coupling to GAS or a single lesson:
 * raw variant pack -> enriched questions -> optional sidecar + auto scene selection.
 * Never edits source pack, questions, manual mappings or score data.
 */
function projectAndSelect(pack,manualSidecar,compiledRules,selector,options){
 const enriched=projectPack(pack,options);
 if(!selector||typeof selector.mergeQuestions!=='function')
   throw Error('VISUAL_SELECTOR_REQUIRED');
 const sidecar=manualSidecar||{
  schema_version:'kidlearn-variant-asset-scene-v1',mode:'STAGING_ONLY',question_scenes:{}
 };
 const selected=selector.mergeQuestions(enriched.questions,sidecar,compiledRules);
 return Object.assign({},enriched,{assetScenes:selected});
}
return Object.freeze({VERSION,enrichQuestion,projectPack,toSelectionRequest,projectAndSelect});
})();
