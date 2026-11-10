/** Đọc 4 tab dữ liệu, không tự ghi hay thay đổi các tab. */
function layThongTinDuLieuBaiHoc() {
  const ss = moBangDuLieu_(), ketQua = {};
  CAU_HINH_LOP_2.CAC_TAB.forEach(tenTab => {
    const sheet = ss.getSheetByName(tenTab);
    if (!sheet) { ketQua[tenTab] = []; return; }
    const rows = sheet.getDataRange().getDisplayValues();
    if (rows.length < 2) { ketQua[tenTab] = []; return; }
    const headers = rows.shift();
    ketQua[tenTab] = rows.filter(r => r.some(v => v !== '')).map(r => {
      const item = {};
      headers.forEach((name, i) => { if (name) item[name] = r[i] || ''; });
      return item;
    });
  });
  return ketQua;
}
function moBangDuLieu_() {
  const id = PropertiesService.getScriptProperties()
    .getProperty(CAU_HINH_LOP_2.MA_SHEET_THUOC_TINH);
  if (id) return SpreadsheetApp.openById(id);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('Chưa liên kết Spreadsheet dữ liệu');
}
