# V2.5 — Rà soát giao diện bài học và phân mô-đun (11/11/2026)

## Mục tiêu
Sửa theo bốn ảnh mới: phần lý thuyết không bị chừa cột phải, dùng SVG chung; bài làm và cột kết quả nằm trong **một vùng cuộn duy nhất**; mở rộng các nhóm bài dài; giảm câu không đại diện và hạn chế lỗi khi chỉnh sửa.

## Kết quả đã lập trình
1. **Lý thuyết**: giữ header cố định của không gian học, ẩn phần banner lặp trong nội dung; toàn bộ chiều ngang giữa sidebar và mép phải dành cho phần trình bày; phần tiêu đề cột đơn vị nền cam nhạt chữ nâu đậm để dễ đọc; SVG theo `muiIcon()`; nội dung không chấm điểm.
2. **Bài học LV1–LV3**: `.ml-workspace` là vùng cuộn chính; `.ml-content` không tạo scrollbar riêng; `.ml-results` dùng `position:sticky;top:0` trong cùng vùng cuộn. Trên tablet/mobile, bảng kết quả xuống dưới. Dock bàn phím giữ riêng ở cuối viewport để thao tác cảm ứng.
3. **Bố trí câu**: bài dọc lớn hơn, tính nhẩm giãn thành nhóm rộng, bài lời văn cả hàng không bị bó vào 2–3 cột.
4. **Dữ liệu**: không ghi đè 51 câu Google Sheet. Chính sách chọn câu tại `23_ChonCauHoiToan.html` tự động cho Bài 20:
   - LV1 đặt tính: 4/6; nhẩm: 2/3 mỗi dạng, tổng 6/9; lời văn: 2/2.
   - LV2 lời văn: 4/6.
   - LV3: 22/28 (đặt tính 6/10; nhóm tìm chữ số giữ mỗi nhóm tối đa 6; nhóm còn lại tối đa 4).
   - Tổng số hiện: **38/51**, trong đó LV1=12, LV2=4, LV3=22.
5. **Chấm & progress**: sử dụng tập câu hiển thị cho số câu đúng/đã trả lời/tiến độ hoàn thành; `26_ChamCauHoiToan.html` là bộ chấm thuần dữ liệu, không thao tác DOM.

## Cấu trúc đã tách
| File | Vai trò | Phạm vi tái sử dụng |
|---|---|---|
| `DuLieuToanSheet.gs` | Đọc Sheet và chuẩn hóa dữ liệu | Adapter cho các bài khác (sẽ tổng quát hóa ID) |
| `23_ChonCauHoiToan.html` | Quy tắc rút gọn câu theo section/group | Có thể cấu hình từng bài |
| `26_ChamCauHoiToan.html` | Chấm 4 kiểu câu Toán | Tái dùng cho bài Toán cùng dạng |
| `19_KhongGianHocToan.html` | Điều phối màn học, đầu vào, tiến độ và kết quả | Nên tách tiếp theo contract sau khi ổn định |
| `21_LyThuyetToan.html` | Lý thuyết và gộp chục | Nội dung chuyên biệt Bài 20 |
| `20_CSS_KhongGianHocToan.html` | CSS khung cơ sở | Shared lesson shell |
| `22_CSS_BaiHocKetQua.html` | Cột kết quả | Shared result layout |
| `25_CSS_SuaBoCucBaiHoc.html` | Bản override V2.5 | Đóng băng sau QA, gộp theo giai đoạn ổn định |

Các module có thứ tự nạp cố định qua `GiaoDien.html`. Không thay đổi tên thành đường dẫn có dấu /, phù hợp yêu cầu `clasp` và Apps Script.

## QA tự động đã thực hiện
- 13 tệp JavaScript: kiểm tra cú pháp không lỗi.
- `GiaoDien.html`: số thẻ script mở/đóng cân bằng (16/16).
- 51 câu nguồn, 38 câu chọn; bảng chọn LV1=12, LV2=4, LV3=22.
- 8 mẫu chấm đối chứng (đúng/sai cho 4 kiểu câu): 8/8 khớp.
- **Chưa** chạy trên deployed Web App và kiểm thử cảm ứng thực.

## Quản trị toàn dự án — đề xuất theo giai đoạn
1. Giữ `GiaoDien.html` như composition root, không dàn thêm nghiệp vụ trong file này.
2. Chia module theo chức năng, không chia file tùy ý: `DanhSachMonHoc`, `DieuHuong`, `DuLieuLoTrinh`, `ThanhTich`, `ChuyenCan`, `CauHoi`, `ChamBai`, `KetQua`, `LyThuyet`.
3. Trước khi chuyển JS sang file mới, xây dựng kiểm thử `QA_CauHoi`, `QA_DieuHuong`, `QA_Progress` và cảnh báo thiếu file include.
4. Không tạo nhiều lệnh `google.script.run` cho từng câu: một lần lấy dữ liệu cho một bài, cache 120 giây; không đưa 51 câu vào HTML tĩnh.
5. Sau khi xác nhận V2.5 trên desktop/tablet/mobile, gộp các CSS override thành stylesheet chuẩn để tránh xung đột, trước khi mở rộng thêm bài.

## Kiểm thử thực tế sau deploy
- Vào Lý thuyết: nội dung trải full phần bên phải sidebar; không có thanh kết quả bên phải.
- Cuộn LV1: chỉ workspace cuộn; phần kết quả bám theo ở bên phải; không có 2 thanh cuộn sát nhau.
- Bài 1: 4 cột dọc; Bài 2: 3 dạng x 2 câu; Bài 3: 2 bài lời văn tràn chiều ngang.
- Kiểm tra LV2/LV3; chấm, nháp, tiến độ và bàn phím touch.
- So sánh 1366px/1024px/768px/390px; ở <=840px bảng kết quả chuyển xuống dưới.

**Nguồn**: https://docs.google.com/spreadsheets/d/1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8/edit

**Hạn chế**: Khi chưa kiểm thử giao diện thực tế, không thể xác nhận đã đạt pixel-perfect hoặc thanh cuộn đúng trên tất cả phiên bản Chrome/Safari/Google Apps Script iframe.
