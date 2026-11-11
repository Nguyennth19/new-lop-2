/** G6: Bộ nạp nội dung chuẩn chung cho các bài, không tạo dữ liệu demo.
 * Giữ đúng schema 4 tab Sheet (01,02,03,04); nguồn dữ liệu đã cấu hình một chỗ.
 * Bài khác chỉ thêm dữ liệu Sheet và loại câu hỏi có bộ chấm phù hợp.
 */
const KHO_BAI_HOC_VERSION='g7_asset_id_v1';
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
function khoChuyenCauHoi_(x){
 const allowed=['vertical','mental','word_problem','missing_digit'];
 let puzzle=null;
 if(x.puzzle_json){try{puzzle=JSON.parse(x.puzzle_json)}catch(e){}}
 const puzzleValid=Array.isArray(puzzle)&&puzzle.length>0&&puzzle.some(row=>Array.isArray(row)&&row.some(cell=>cell&&typeof cell==='object'&&cell.ans!==undefined));
 const valid=allowed.includes(x.type)&&(x.type==='missing_digit'?puzzleValid:Boolean(x.prompt&&x.answer));
 return {id:x.question_id,level:x.level,sectionId:x.section_id,order:Number(x.order)||0,
  label:x.label,type:x.type,prompt:x.prompt,asset_id:String(x.asset_id||'').trim(),n1:x.n1,op:x.op,n2:x.n2,answer:String(x.answer||''),
  unit:x.unit,group:x.group,theme:x.theme,summary:x.summary,solutionPrompt:x.solution_prompt,
  svg:x.svg||'',puzzle,valid,issue:valid?'':'Thiếu đề bài hoặc dữ liệu ô số trong Google Sheet'};
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
 const result={lesson:{id:lesson.lesson_id,title:lesson.title,subject:lesson.subject,series:lesson.series},
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
