/** Không đưa ID hay dữ liệu cá nhân lên GitHub. */
const CAU_HINH_LOP_2 = Object.freeze({
  MA_SHEET_THUOC_TINH: 'ID_GOOGLE_SHEET_DU_LIEU',
  CAC_TAB: ['01_Bai_hoc', '02_Cap_do', '03_Nhom_bai', '04_Cau_hoi']
});
/** Chỉ chạy thủ công khi dùng Sheets dữ liệu riêng. */
function caiDatIdSheetDuLieu() {
  const spreadsheetId = '';
  if (!spreadsheetId) throw new Error('Chưa nhập Spreadsheet ID nguồn dữ liệu');
  PropertiesService.getScriptProperties().setProperty(
    CAU_HINH_LOP_2.MA_SHEET_THUOC_TINH, spreadsheetId);
}
