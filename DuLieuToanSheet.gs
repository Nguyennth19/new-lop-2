/**
 * Đọc bài Toán 20 trực tiếp từ Google Sheets.
 * Không sao chép dữ liệu mẫu vào mã nguồn; giữ Sheet là nguồn duy nhất.
 * Mỗi lượt đọc có thể cache tối đa 2 phút.
 */
const TOAN_SHEET_ID = '1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8';
function layBaiToan20() {
  const cache=CacheService.getScriptCache();
  const hit=cache.get('toan_b20_v26_20261111');
  if(hit) return JSON.parse(hit);
  const wb=SpreadsheetApp.openById(TOAN_SHEET_ID);
  const tab = name => {
    const sh=wb.getSheetByName(name);
    if(!sh) throw new Error('Thiếu tab '+name);
    const values=sh.getDataRange().getDisplayValues();
    const keys=values.shift().map(x=>String(x).trim());
    return values.filter(r=>r.some(x=>String(x).trim())).map(r=>{
      const o={}; keys.forEach((k,i)=>{if(k)o[k]=r[i]||''});return o;
    });
  };
  const lesson=tab('01_Bai_hoc').find(x=>x.lesson_id==='toan_b20');
  if(!lesson)throw new Error('Không tìm thấy bài toan_b20');
  const levels=tab('02_Cap_do').filter(x=>x.lesson_id===lesson.lesson_id);
  const sections=tab('03_Nhom_bai').filter(x=>levels.some(l=>l.level_id===x.level_id));
  const questions=tab('04_Cau_hoi').filter(x=>x.lesson_id===lesson.lesson_id).map(x=>{
    const validTypes=['vertical','mental','word_problem','missing_digit'];
    let puzzle=null;
    if(x.puzzle_json){try{puzzle=JSON.parse(x.puzzle_json)}catch(e){}}
    // Không tự tạo câu hỏi chỉ từ đáp án.
    const valid=validTypes.includes(x.type) && (
      x.type==='missing_digit' ? Array.isArray(puzzle)&&puzzle.length>0&&puzzle.some(row=>row.some(cell=>cell&&typeof cell==='object'&&cell.ans!==undefined)) :
      Boolean(x.prompt&&x.answer)
    );
    return {
      id:x.question_id,level:x.level,sectionId:x.section_id,order:Number(x.order)||0,
      label:x.label,type:x.type,prompt:x.prompt,n1:x.n1,op:x.op,n2:x.n2,
      answer:String(x.answer||''),unit:x.unit,group:x.group,theme:x.theme,
      summary:x.summary,solutionPrompt:x.solution_prompt,svg:x.svg||'',puzzle:puzzle,
      valid:valid,issue:valid?'':'Thiếu đề bài hoặc dữ liệu ô số trong Google Sheet'
    };
  });
  const result={lesson:{id:lesson.lesson_id,title:lesson.title,subject:lesson.subject,series:lesson.series},
    levels:levels.map(l=>({id:l.level_id,level:l.level,name:l.name})),
    sections:sections.map(s=>({id:s.section_id,levelId:s.level_id,name:s.name,type:s.question_type})),
    questions:questions,readAt:new Date().toISOString()};
  // CacheService giới hạn dung lượng giá trị ~100KB; bỏ cache khi lớn.
  try{const raw=JSON.stringify(result);if(raw.length<95000)cache.put('toan_b20_v26_20261111',raw,21600)}catch(e){}
  return result;
}

/** Chỉ chạy thủ công trong Apps Script Editor khi thay dữ liệu Bài 20.
 * Browser cache cần tải lại trang hoặc hết hạn 30 phút (đổi CACHE_VERSION khi phát hành).
 */
function lamMoiBoNhoToan20_() {
  CacheService.getScriptCache().remove('toan_b20_v26_20261111');
  return 'Đã xóa cache phía máy chủ cho bài toan_b20';
}
