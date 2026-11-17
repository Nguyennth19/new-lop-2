/** Không đưa ID hay dữ liệu cá nhân lên GitHub. */
const CAU_HINH_LOP_2 = Object.freeze({
  MA_SHEET_THUOC_TINH: 'ID_GOOGLE_SHEET_DU_LIEU',
  SHEET_MAC_DINH: '1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8',
  MUI_GIO: 'Asia/Ho_Chi_Minh',
  MA_HOC_SINH: 'gia_dinh_01',
  CAC_TAB: ['01_Bai_hoc', '02_Cap_do', '03_Nhom_bai', '04_Cau_hoi']
});
/** Chỉ chạy thủ công khi dùng Sheets dữ liệu riêng. */
function caiDatIdSheetDuLieu() {
  const spreadsheetId = ''; // Chỉ điền khi chuyển sang một bảng dữ liệu khác.
  if (!spreadsheetId) throw new Error('Chưa nhập Spreadsheet ID nguồn dữ liệu');
  PropertiesService.getScriptProperties().setProperty(
    CAU_HINH_LOP_2.MA_SHEET_THUOC_TINH, spreadsheetId);
}

/** Một nguồn cấu hình cho toàn bộ dữ liệu học tập và thành tích. */
function moBangDuAn_(){
 const p=PropertiesService.getScriptProperties();
 // G3-A TEST branch never opens the production B20 Sheet, even accidentally.
 const id=String(p.getProperty('G3A_TEST_SOURCE_SPREADSHEET_ID')||'').trim();
 if(!id||id===CAU_HINH_LOP_2.SHEET_MAC_DINH)throw Error('G3A_TEST_SHEET_NOT_ISOLATED');
 return SpreadsheetApp.openById(id);
}
