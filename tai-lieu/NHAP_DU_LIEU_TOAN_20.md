# Nhập dữ liệu Toán 2 — Bài 20 (giai đoạn 1)

## Nguồn dữ liệu
- Google Sheet: https://docs.google.com/spreadsheets/d/1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8/edit
- Mã bài: `toan_b20`
- Mã nguồn HTML gốc ghi trong Sheet: `gemini-code-1793256861158.html` (chưa tìm thấy tệp HTML mẫu trực tiếp).
- Trạng thái kiểm chứng nguồn SGK: **Chưa đối chiếu SGK** (theo tab `00_Tong_quan`).

## Kết quả đối chiếu dữ liệu
- Tổng 51 câu, 8 nhóm, LV1 17 câu, LV2 6 câu, LV3 28 câu.
- Tính cột dọc: 16; tính nhẩm: 9; bài toán có lời văn: 14; tìm chữ số: 12.
- **45/51 câu có đề bài hoặc ma trận ô số đủ để học tương tác.**
- **6/51 câu CHƯA ĐỦ DỮ LIỆU**: nhóm `toan_b20_lv3_ex3` (6 dòng), loại `word_problem` nhưng thiếu `prompt`, `n1`, `n2`, `puzzle_json`. Chỉ có kết quả số. Không suy đoán đề bài.
- 12 câu `missing_digit` đã kiểm tra số học: các phép cộng suy ra từ `puzzle_json` khớp tổng.
- LV3 chưa thể được đánh dấu hoàn tất cho đến khi 6 câu trên được bổ sung hoặc biên tập lại đúng loại.

## Các tệp mới
- `DuLieuToanSheet.gs`: đọc dữ liệu Google Sheets theo tên tab, cache 120 giây, xác thực câu đủ dữ liệu.
- `17_HocToanTuSheet.html`: dựng bài học bằng 4 dạng tương tác, so đáp án, lưu tiến độ cục bộ.
- `18_CSS_HocToan.html`: CSS riêng.

## Các tệp đã dọn
- `12_DuLieuLoTrinh.html`: bỏ toàn bộ Toán demo, chỉ giữ bài 20 lấy từ Sheet.
- `11_TrangChuDieuHuong.html`: bỏ ngân hàng câu hỏi Toán demo.
- `14_BaiTapTuongTac.html`: bỏ fallback dùng câu Toán demo.
- `15_ThanhTichHoatDong.html`: bỏ bản ghi hoạt động Toán giả lập.
- `GiaoDien.html`: bỏ câu đố Toán demo ở cửa sổ chung, hiển thị tên bài 20 ở gợi ý.
- `10_DanhSachMonHoc.html`: chỉ hiển thị 1 bài Toán hiện đã nhập.

## Triển khai
1. Đồng bộ GitHub vào Apps Script. Trong `appsscript.json` đã có scope `https://www.googleapis.com/auth/spreadsheets`.
2. Ủy quyền cho Apps Script đọc bảng tính khi được hỏi. Tài khoản thực thi Web App phải có quyền đọc Sheet.
3. Triển khai phiên bản Web App mới, mở **Lộ trình học > Toán 2 > Bài 20 > LV1/LV2/LV3**.
4. Kiểm thử một phép cộng cột dọc, một tính nhẩm, một bài toán có lời văn (với hình SVG), một phép điền ô trống; thử nhập sai, nhập đúng, đổi cấp độ và trở về lộ trình.

## Giới hạn hiện tại
- Chưa có bản `gemini-code-1793256861158.html` gốc để so sánh bố cục pixel-by-pixel. Render bám theo các loại `question_type` và dữ liệu `svg` trong Sheet.
- Chưa chạy xác nhận trên Web App triển khai thật.
- Tiến độ vẫn lưu `localStorage` theo trình duyệt, chưa ghi ngược về Sheet.
- Bảng điểm, hình minh họa và trạng thái chuyên cần chưa phải hệ thống dữ liệu hoàn chỉnh.
