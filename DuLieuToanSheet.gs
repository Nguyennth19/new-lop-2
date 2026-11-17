/* G6: adapter môn Toán bài 20 – dữ liệu chung qua KhoBaiHoc.gs. */
/** G3-A: browser may ONLY receive the allowlisted projection. */
function layBaiToan20(){
 g3aQaContext_(); // The legacy RPC name must enforce QA identity and source isolation.
 return khoLayBaiHocPublic_('toan_b20');
}
/** Chạy thủ công trong Apps Script Editor khi thay câu hỏi. */
function lamMoiBoNhoToan20_(){khoLamMoiBai_('toan_b20');return 'Đã xóa cache Bài 20';}
