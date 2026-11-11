# Không gian học Toán V2.3 — đối chiếu mẫu Gemini HTML

Mẫu do chủ dự án cung cấp: `gemini-code-1793256861158.html`.
Nguồn câu hỏi động: [Google Sheets Bài 20](https://docs.google.com/spreadsheets/d/1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8/edit).

## Kiến trúc
- Mã nguồn Apps Script GitHub: `19_KhongGianHocToan.html` + `20_CSS_KhongGianHocToan.html`.
- Dữ liệu: `DuLieuToanSheet.gs`, lấy từ 6 tab `00_Tong_quan`, `01_Bai_hoc`, `02_Cap_do`, `03_Nhom_bai`, `04_Cau_hoi`, `05_Cau_hinh` (chỉ các tab liên quan bài hiện tại được sử dụng khi chạy).
- `17_HocToanTuSheet.html` chỉ còn lớp trạng thái, đã loại bỏ bộ renderer cũ có lỗi JavaScript.
- Nút **Vào học ngay** trên thẻ môn Toán mở trực tiếp không gian bài; nút **Vào học** tại từng LV cũng mở và chọn đúng cấp độ.
- Không gian riêng là một màn full-screen trong cùng Web App (không mở tab trình duyệt mới), có đường quay về Lộ trình.

## UI
1. Header: môn Toán 2, tên bài 20, progress hoàn thành theo câu.
2. Sidebar: Lý thuyết (trống để phát triển sau), LV1 – Học kiến thức, LV2 – Luyện tập, LV3 – Vận dụng nâng cao. Chỉ LV hoàn thành 100% mới có tích xanh.
3. Nội dung: card cột dọc theo hàng chục/đơn vị/ô nhớ, tính nhẩm 5 cột, toán lời văn gồm tóm tắt + phép tính nhiều ô + đáp số, trò tìm chữ số bị giấu.
4. Dock bàn phím cuối trang: số 0–9, +, −, xóa, tiếp; tương tác chuột, phím vật lý và chạm cảm ứng. Nút ẩn/hiện.
5. Chấm bài từng nhóm / toàn cấp độ, tô màu đúng – sai – trống, lưu nháp localStorage và tiến độ cục bộ.

## Dữ liệu sửa theo HTML mẫu gốc
6 bản ghi `toan_b20_lv3_ex3_01..06` trong tab `04_Cau_hoi` được phục hồi ma trận ô số `puzzle_json` từ mẫu. Đã đổi type thành `missing_digit` và sửa `03_Nhom_bai!D8`.
**Hiện 51 câu có dữ liệu cấu trúc.** Tính đúng nội dung SGK vẫn cần QA độc lập; không khẳng định đã được thẩm định.

## Kiểm thử cần chạy trên Web App triển khai
- Bấm **Vào học ngay** từ môn Toán / Bài 20 / từng cấp độ và xác nhận màn mới mở.
- Mở Lý thuyết: vùng nội dung trắng.
- Dùng chuột và chạm màn hình trên 4 loại card, bàn phím dock, nút Tiếp, Xóa.
- Kiểm tra từng mức: nhập sai → đỏ, bỏ trống → vàng, đúng → xanh; tiến độ tăng một lần cho mỗi câu.
- Đổi LV/thoát/vào lại: nháp và tiến độ vẫn còn trên cùng trình duyệt; sidebar chỉ tích xanh khi đủ số câu.
- Kiểm tra chiều rộng desktop, tablet, điện thoại.
- Google Apps Script cần quyền đọc Sheets của tài khoản đang thực thi Web App.

## Giới hạn
- Đã kiểm tra cú pháp JS trên GitHub, **chưa xác nhận chạy thực tế trên Web App hoặc kiểm thử cảm ứng trên thiết bị**.
- Màn học làm theo cách trình bày và nguyên tắc tương tác từ mẫu, **không phải bản sao pixel-perfect**; không nhúng CSS CDN Tailwind/canvas-confetti của mẫu.
- Trạng thái vẫn nằm trong localStorage, chưa đồng bộ đa thiết bị.
