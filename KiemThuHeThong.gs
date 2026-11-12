/** G5+G6: kiểm thử KHÔNG thay đổi dữ liệu, chỉ chạy thủ công từ Apps Script Editor. */
function kiemTraHeThongLop2_(){
 const wb=moBangDuAn_();
 const must=['01_Bai_hoc','02_Cap_do','03_Nhom_bai','04_Cau_hoi','90_Lan_lam_bai','91_So_sao','92_Ghi_chu_phu_huynh'];
 const sheets=must.map(n=>({name:n,exists:!!wb.getSheetByName(n)}));
 if(sheets.some(x=>!x.exists))throw Error('Thiếu Google Sheet: '+sheets.filter(x=>!x.exists).map(x=>x.name).join(', '));
 const lesson=layBaiToan20();if(!lesson||lesson.lesson.id!=='toan_b20')throw Error('Không đọc được Bài 20');
 if(lesson.variantPilot){
  const qa=kiemTraB20BienThe();
  return {ok:qa.ok,mode:'B20_VARIANT_PILOT',questions:qa.questionCount,sessions:qa.counts,
    qaNote:'Chỉ kiểm tra runtime staging; không ghi sao và không xác nhận dữ liệu học sinh.',
    sheets, timeZoneSheet:wb.getSpreadsheetTimeZone(),timeZoneApp:CAU_HINH_LOP_2.MUI_GIO};
 }
 const ids=lesson.questions.map(x=>x.id),unique=new Set(ids);
 if(unique.size!==ids.length)throw Error('Có mã câu hỏi Bài 20 bị trùng');
 const progress=layTienDoHocTap();
 const summary=layTongQuanThanhTich();
 if(progress.attemptCount===0&&(progress.completedLevels.LV1||progress.completedLevels.LV2||progress.completedLevels.LV3))
  throw Error('Có dấu tích đã học nhưng chưa từng nộp bài');
 return {ok:true,lessonId:lesson.lesson.id,questions:ids.length,levels:lesson.levels.length,
  sections:lesson.sections.length,attemptCount:progress.attemptCount,saoHanhTrinh:summary.earned,
  viSao:summary.balance,timeZoneSheet:wb.getSpreadsheetTimeZone(),
  timeZoneApp:CAU_HINH_LOP_2.MUI_GIO,sheets,
  note:'Kiểm tra chỉ đọc, không thay đổi bài học/sổ sao.'};
}
