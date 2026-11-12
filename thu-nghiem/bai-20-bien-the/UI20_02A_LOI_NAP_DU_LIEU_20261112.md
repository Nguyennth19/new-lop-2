# UI20-02A — Lỗi không nạp được dữ liệu sau deployment (2026-11-12)
Trạng thái: ROOT_EXCEPTION_IDENTIFIED / STATIC_PASS / WEBAPP_PENDING.
Nhánh: test-b20-bien-the-20261112; test-theo-main không thay đổi.

## Bằng chứng
Ảnh người dùng: trang Bài 20 hiển thị "Không đọc được dữ liệu: Dữ liệu bài học không hợp lệ"; sidebar không có bài/lượt. Console chủ yếu là thông báo iframe/sandbox và trạng thái mạng; không phải exception của renderer.
Xâu lỗi chính xác được ném trong hàm `BO_NHO_BAI_HOC.save()` của `27_BoNhoBaiHoc.html`, khi `valid(value,'toan_b20')` trả false. Đây là lỗi HỢP ĐỒNG RESPONSE trước khi gọi adapter/render, không phải lỗi ô ly hoặc CSS.
Không có response object thật từ Web App trong ảnh nên chưa xác định chính xác response là null, wrapper {status,data}, hay bản GAS cũ/mới không đồng bộ.

## Điều đã đối chiếu
- `DuLieuToanSheet.gs` trên nhánh test: layBaiToan20() gọi b20DocPackThu_(), trả {variantPilot:true, lesson, sessions, questions}.
- `B20_BienTheMayChu.gs`: lấy từ commit bất biến, 30 câu/6 lượt.
- `27_BoNhoBaiHoc.html`: valid() yêu cầu lesson.id === toan_b20, questions array, và (variantPilot + sessions) HOẶC (sections + levels).
- Mock GAS có 30 câu, 6 lượt: PASS, cache.save(): PASS. Nhánh test không tạo sai response.
- Mock response wrapper {status:'success',data:{...}}: CHẶN chính xác như lỗi ảnh. Không tự unwrap wrapper hoặc sửa nguồn khi chưa biết response thực tế.

## Sửa an toàn
1. `27_BoNhoBaiHoc.html`: tăng version cache để xóa session cache cũ; lỗi dữ liệu hiển thị schema metadata: key names, lesson ID, variantPilot, câu/lượt, không lộ đáp án.
2. `B20_BienTheMayChu.gs`: hàm public `kiemTraGoiDuLieuUI20()` gọi đúng layBaiToan20(), log JSON metadata và validate 30 câu/6 lượt; không tham số, không ghi dữ liệu.
3. Giữ toàn bộ CSS/HTML và bộ chấm staging; không bật lại việc ghi Sheets hoặc sao.

## QA tĩnh
- JS syntax: PASS 3 tệp (cache, GAS, adapter).
- Gói fake GAS 30 câu/6 lượt, cache.save: PASS.
- Gói wrapper không đúng hợp đồng bị từ chối kèm nguyên nhân và keys: PASS.
- QA thật trên Web App: PENDING.

## Xác nhận sau pull
1. Đồng bộ nhánh TEST mới lên Apps Script.
2. Apps Script Editor → Run `kiemTraGoiDuLieuUI20()`; Execution log phải có `ok:true`, `questionCount:30`, `sessionCount:6`, `variantPilot:true`.
3. Nếu PASS: Deploy → Manage deployments → Edit → New version → Deploy; mở lại URL /exec và reload. Nếu fail, dừng ở server.
4. Nếu vẫn lỗi, sao chép **chính dòng cảnh báo mới** (chỉ chứa schema metadata) để khoanh vùng response thực tế. Không kết luận lỗi trình duyệt, CSS hay PDF khi chưa có bằng chứng.
5. Sau khi tải được 6 lượt, test UI lời văn, đặt tính, nộp đúng/sai; không ghi điểm/sao thật.
