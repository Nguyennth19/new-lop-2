/** G6: Bộ nạp nội dung chuẩn chung cho các bài, không tạo dữ liệu demo.
 * Giữ đúng schema 4 tab Sheet (01,02,03,04); nguồn dữ liệu đã cấu hình một chỗ.
 * Bài khác chỉ thêm dữ liệu Sheet và loại câu hỏi có bộ chấm phù hợp.
 */
const KHO_BAI_HOC_VERSION='g3a_v1_private_source_20261117';
function khoDocTab_(wb,name){
 const sh=wb.getSheetByName(name);
 if(!sh)throw Error('Thiếu tab '+name);
 const values=sh.getDataRange().getDisplayValues();
 if(!values.length)return [];
 const keys=values.shift().map(x=>String(x).trim());
 return values.filter(row=>row.some(v=>String(v).trim())).map(row=>{
  const obj={};keys.forEach((k,i)=>{if(k)obj[k]=row[i]||'';});return obj;
 });
}
/** Read only the public visual contract from a trusted Sheet row. Never return a grading key. */
function khoVisualContract_(x){
 const renderer=String(x.renderer_id||'').trim().toUpperCase();
 const skillId=String(x.skill_id||'').trim();
 const visualIntent=String(x.visual_intent||'').trim().toUpperCase();
 const assetId=String(x.asset_id||'').trim();
 const semanticLabel=String(x.semantic_label||'').trim();
 const countUnit=String(x.count_unit||'').trim();
 const countText=String(x.exact_quantity||'').trim();
 const json=String(x.public_variant_json||'').trim();
 // No implied renderer from question prompt or filename.
 if(!renderer&&!assetId&&!semanticLabel&&!(skillId&&json))return null;
 if(renderer&&!/^D(?:10|8A|8B|[1-9])$/.test(renderer))return null;
 if((renderer||json)&&!/^[A-Z0-9_\\-]{3,90}$/.test(skillId))return null;
 if(visualIntent&&!['DECORATIVE','CHOICE','EXACT_COUNT'].includes(visualIntent))return null;
 if(assetId&&!/^(?:FLUENT:[a-z0-9_]+|KL_(?:SH|M)\d{2}_\d{3}|KL2_[A-Z0-9_]+)$/.test(assetId))return null;
 if(semanticLabel.length>120||countUnit.length>30)return null;
 if(countText&&!/^(?:[1-9]|[1-4][0-9]|50)$/.test(countText))return null;
 let publicVariant={};
 if(json){
  if(json.length>16000)return null;
  try{publicVariant=JSON.parse(json)}catch(e){return null;}
  if(!publicVariant||Array.isArray(publicVariant)||typeof publicVariant!=='object')return null;
  const forbidden=/^(?:answer|answers|answerKey|correctAnswer|correct|correctOptionId|expectedAnswer|expectedResult|expectedCarry|solution|solutionPrompt|gradingKey|isCorrect|teacherSolution|prefilledSolution|gradingState|grade|starCredit|starAmount|studentId|__proto__|constructor|prototype)$/;
  function safe(v,depth){
   if(depth>12)return false;
   if(Array.isArray(v))return v.length<=120&&v.every(a=>safe(a,depth+1));
   if(v&&typeof v==='object')return Object.keys(v).every(k=>!forbidden.test(k)&&safe(v[k],depth+1));
   return v===null||typeof v==='string'||typeof v==='boolean'||(typeof v==='number'&&isFinite(v));
  }
  if(!safe(publicVariant,0))return null;
 }
 return {rendererId:renderer||null,skillId:skillId||null,visualIntent:visualIntent||'DECORATIVE',
   assetId:assetId||null,semanticLabel:semanticLabel||null,countUnit:countUnit||null,
   exactQuantity:countText?Number(countText):null,publicVariant};
}
function khoChuyenCauHoi_(x){
 const allowed=['vertical','mental','word_problem','missing_digit'];
 const structured=['matching','choice','geometry','drag_sort','comparison','measurement','capacity','weight','pictograph','counting','number_input','interactive'];
 const visualContract=khoVisualContract_(x);
 // New exercise families may be shown only with an explicit safe public
 // variant. This never opts them into legacy scoring, rewards or submissions.
 const structuredValid=structured.includes(x.type)&&!!visualContract&&
  !!visualContract.skillId&&!!String(x.question_id||'').trim()&&
  !!String(x.section_id||'').trim()&&!!String(x.level||'').trim()&&
  !!String(x.public_variant_json||'').trim();
 let puzzle=null;
 if(x.puzzle_json){try{puzzle=JSON.parse(x.puzzle_json)}catch(e){}}
 const puzzleValid=Array.isArray(puzzle)&&puzzle.length>0&&puzzle.some(row=>Array.isArray(row)&&row.some(cell=>cell&&typeof cell==='object'&&cell.ans!==undefined));
 const valid=(allowed.includes(x.type)&&(x.type==='missing_digit'?puzzleValid:Boolean(x.prompt&&x.answer)))||structuredValid;
 return {id:x.question_id,level:x.level,sectionId:x.section_id,order:Number(x.order)||0,
  label:x.label,type:x.type,prompt:x.prompt,n1:x.n1,op:x.op,n2:x.n2,answer:String(x.answer||''),
  unit:x.unit,group:x.group,theme:x.theme,summary:x.summary,solutionPrompt:x.solution_prompt,
  svg:x.svg||'',puzzle,visualContract,displayOnly:structuredValid,valid,issue:valid?'':'Thiếu đề bài hoặc dữ liệu ô số trong Google Sheet'};
}
/**
 * Curricular binding policy is read from the real lesson row; never infer a
 * renderer from a textbook title or prompt. New forms require recorded QA.
 * This is a public display authorization, not trusted scoring authorization.
 */
function khoRendererPolicies_(lesson){
 const raw=String(lesson.visual_renderer_policy_json||'').trim();
 if(!raw)return [];
 if(raw.length>24000)return [];
 let list;try{list=JSON.parse(raw)}catch(e){return [];}
 if(!Array.isArray(list)||list.length>12)return [];
 const supported=['D1','D2','D3','D4','D5','D6','D7','D8','D8A','D8B','D9','D10'];
 const result=[],seen={};
 for(const p of list){
  if(!p||typeof p!=='object'||Array.isArray(p))continue;
  const rendererId=String(p.rendererId||'').trim().toUpperCase();
  const type=String(p.questionType||'').trim(),skillId=String(p.skillId||'').trim();
  const evidenceId=String(p.evidenceId||'').trim();
  if(!supported.includes(rendererId)||seen[rendererId])continue;
  if(!/^[a-z_]{3,40}$/.test(type)||!/^[A-Z0-9_\\-]{3,90}$/.test(skillId))continue;
  if(p.qaStatus!=='PASS'||!/^[-A-Za-z0-9_.:/]{8,160}$/.test(evidenceId))continue;
  if((rendererId==='D5'||rendererId==='D9')&&p.e04Approved!==true)continue;
  // Special trusted-grading gates remain separate; policy grants ONLY display.
  seen[rendererId]=true;
  result.push({rendererId,type,skillId,qaStatus:'PASS',evidenceId,e04Approved:p.e04Approved===true});
 }
 return result;
}
function khoLayBaiHoc_(lessonId){
 if(!/^[a-z0-9_]{3,64}$/.test(String(lessonId||'')))throw Error('ID bài học không hợp lệ');
 const cache=CacheService.getScriptCache(),key='kho_bai_'+KHO_BAI_HOC_VERSION+'_'+lessonId;
 const hit=cache.get(key);if(hit)return JSON.parse(hit);
 const wb=moBangDuAn_();
 const lesson=khoDocTab_(wb,'01_Bai_hoc').find(x=>x.lesson_id===lessonId);
 if(!lesson)throw Error('Không tìm thấy bài '+lessonId);
 const levels=khoDocTab_(wb,'02_Cap_do').filter(x=>x.lesson_id===lessonId);
 const sections=khoDocTab_(wb,'03_Nhom_bai').filter(x=>levels.some(l=>l.level_id===x.level_id));
 const questions=khoDocTab_(wb,'04_Cau_hoi').filter(x=>x.lesson_id===lessonId).map(khoChuyenCauHoi_);
 const result={lesson:{id:lesson.lesson_id,title:lesson.title,subject:lesson.subject,series:lesson.series,rendererPolicies:khoRendererPolicies_(lesson)},
  levels:levels.map(x=>({id:x.level_id,level:x.level,name:x.name})),
  sections:sections.map(x=>({id:x.section_id,levelId:x.level_id,name:x.name,type:x.question_type})),
  questions,readAt:new Date().toISOString()};
 try{const raw=JSON.stringify(result);if(raw.length<95000)cache.put(key,raw,300)}catch(e){}
 return result;
}
function khoLamMoiBai_(lessonId){
 if(!/^[a-z0-9_]{3,64}$/.test(String(lessonId||'')))throw Error('ID bài học không hợp lệ');
 CacheService.getScriptCache().remove('kho_bai_'+KHO_BAI_HOC_VERSION+'_'+lessonId);
}

/** G3-A: public projection by an explicit allowlist, not a blacklist.
 * The source q (including answer, puzzle.ans, solutionPrompt) never leaves GAS.
 * This function MUST NOT be used as a grading source.
 */
function g3aB20PublicQuestion_(q){
 if(!q||typeof q!=='object'||Array.isArray(q))throw Error('G3A_BAD_QUESTION');
 const keys=['id','level','sectionId','order','label','type','prompt','n1','op','n2',
   'unit','group','theme','summary','svg','valid','issue','displayOnly'];
 const out={};
 keys.forEach(function(k){
  const v=q[k];
  if(v===undefined||v===null)return;
  if(typeof v==='string')out[k]=v.slice(0,k==='svg'?8000:2000);
  else if(typeof v==='number'&&Number.isFinite(v))out[k]=v;
  else if(typeof v==='boolean')out[k]=v;
 });
 // All unknown properties are dropped. In particular no correct answer cell.
 if(Array.isArray(q.puzzle)){
  if(q.puzzle.length>8||q.puzzle.some(function(r){return !Array.isArray(r)||r.length>8;}))
   throw Error('G3A_BAD_PUZZLE');
  out.puzzle=q.puzzle.map(function(row){return row.map(function(cell){
   if(cell!==null&&typeof cell==='object')return {blank:true};
   if(cell===null)return null;
   if(typeof cell==='number'&&Number.isFinite(cell))return cell;
   if(typeof cell==='string'&&cell.length<15)return cell;
   throw Error('G3A_BAD_PUZZLE_CELL');
  });});
 }
 // B20 release policy has not approved any structured publicVariant / visual asset.
 // Silently omitting unapproved q.visualContract prevents a nested key bypass.
 out.visualContract=null;
 return out;
}
function khoLayBaiHocPublic_(lessonId){
 const src=khoLayBaiHoc_(lessonId);
 if(!src||!src.lesson||src.lesson.id!==lessonId)throw Error('G3A_SOURCE_CONFLICT');
 if(!Array.isArray(src.questions)||src.questions.length>500)throw Error('G3A_BAD_SOURCE');
 return {lesson:{id:src.lesson.id,title:String(src.lesson.title||''),
   subject:String(src.lesson.subject||''),series:String(src.lesson.series||''),rendererPolicies:[]},
   levels:src.levels.map(function(v){return {id:v.id,level:v.level,name:v.name};}),
   sections:src.sections.map(function(v){return {id:v.id,levelId:v.levelId,name:v.name,type:v.type};}),
   questions:src.questions.map(g3aB20PublicQuestion_),readAt:new Date().toISOString(),
   securityContract:'G3A_PUBLIC_ALLOWLIST_V1',gradingAuthority:'SERVER_ONLY_TEST'};
}
