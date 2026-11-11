/** G5 – Cấu hình chung: đúng một nguồn dữ liệu, một học sinh và múi giờ Việt Nam.
 * Lần đầu tự dùng ID nguồn đã nghiệm thu; có thể ghi đè bằng Script Properties.
 * Không bao giờ đặt PIN, khóa bí mật hoặc dữ liệu cá nhân trong mã.
 */
const CAU_HINH_LOP_2=Object.freeze({
 MA_SHEET_THUOC_TINH:'ID_GOOGLE_SHEET_DU_LIEU',
 SHEET_MAC_DINH:'1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8',
 HO_SO:'gia_dinh_01',
 MUI_GIO:'Asia/Ho_Chi_Minh',
 PHIEN_BAN_DU_LIEU:'g5-g6-v1',
 CAC_TAB:['01_Bai_hoc','02_Cap_do','03_Nhom_bai','04_Cau_hoi'],
 CAC_TAB_TIEN_DO:['90_Lan_lam_bai','91_So_sao','92_Ghi_chu_phu_huynh']
});
function lop2IdSheet_(){
 return PropertiesService.getScriptProperties().getProperty(CAU_HINH_LOP_2.MA_SHEET_THUOC_TINH)||CAU_HINH_LOP_2.SHEET_MAC_DINH;
}
function lop2MoSheet_(){return SpreadsheetApp.openById(lop2IdSheet_());}
function lop2HoSo_(){return CAU_HINH_LOP_2.HO_SO;}
function lop2MuisGio_(){return CAU_HINH_LOP_2.MUI_GIO;}
/** Chạy trong Editor nếu cần lưu ID chính thức vào Script Properties. */
function lop2LuuCauHinhSheet_(){
 const id=CAU_HINH_LOP_2.SHEET_MAC_DINH;
 if(!id)throw Error('Thiếu Spreadsheet ID.');
 PropertiesService.getScriptProperties().setProperty(CAU_HINH_LOP_2.MA_SHEET_THUOC_TINH,id);
 return 'Đã lưu nguồn Sheet: '+id;
}
function lop2KiemTraKetNoi_(){
 const wb=lop2MoSheet_();
 const tabs=CAU_HINH_LOP_2.CAC_TAB.concat(CAU_HINH_LOP_2.CAC_TAB_TIEN_DO);
 return {ok:tabs.every(t=>!!wb.getSheetByName(t)),tabs:tabs.map(name=>({name,found:!!wb.getSheetByName(name)})),timezone:wb.getSpreadsheetTimeZone(),profile:lop2HoSo_()};
}
