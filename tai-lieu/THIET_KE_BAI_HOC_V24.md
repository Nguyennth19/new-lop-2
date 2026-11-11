# Không gian bài học Toán – V2.4 (11/11/2026)

## Tài liệu đối chiếu
- Ảnh màn hình 3 vùng: sidebar vàng, bài làm xanh dương, kết quả đỏ do chủ dự án cung cấp.
- Mã tham khảo: https://github.com/Nguyennth19/lop-2-new
- Sheet tham khảo (không thay nguồn bài học): https://docs.google.com/spreadsheets/d/1RR8mdHv6vT9Y7tqF0moy1gSUhoDpLx7GilPwqayqt9s/edit
- Mẫu lý thuyết: `gemini-code-1793256861158.html` do chủ dự án gửi trong cuộc trò chuyện.
- Sheet bài 20 đang dùng: https://docs.google.com/spreadsheets/d/1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8/edit

## Thay đổi
- Sidebar: không có dòng tuần 8, không dùng tích xanh đầu dòng; tích xanh nằm cuối mỗi LV chỉ khi 100% câu đúng. Đồng bộ font Inter với vỏ ứng dụng.
- Workspace: nội dung bài tập co giãn, cuộn độc lập; kết quả là cột bên phải giữ nguyên vị trí khi cuộn bài.
- Kết quả: thời gian nộp / thời gian làm / số câu trả lời / điểm thang 10; không gán giả thời gian và điểm. Hệ thống ghi thời gian nộp khi bấm nút kiểm tra toàn cấp độ, lưu bản cuối ở trình duyệt.
- Đáp án: màu xanh đúng, đỏ sai, cam trống, xám chưa kiểm tra. Chấm theo số câu, có danh sách số thứ tự.
- Lý thuyết: lấy tóm tắt cách đặt tính, 36+17=53 và mô hình khối lập phương gộp đơn vị thành chục từ HTML mẫu; chỉ giải thích, nghe đọc, tương tác gộp; không có kiểm tra hoặc ghi điểm.
- Layout tự chuyển về 1 cột / kết quả phía dưới ở tablet/mobile; bàn phím vẫn hỗ trợ cảm ứng.

## Mã nguồn
- 19_KhongGianHocToan.html
- 20_CSS_KhongGianHocToan.html (cơ sở)
- 21_LyThuyetToan.html (mới)
- 22_CSS_BaiHocKetQua.html (mới)
- GiaoDien.html (đăng ký nạp hai tệp mới)

## QA
- Đã kiểm cú pháp JS bằng bộ phân tích JavaScript; tất cả mô-đun được kiểm tra đều PASS; kiểm tra cân bằng 14 thẻ script mở/đóng trong GiaoDien.html.
- Chưa được kiểm thử trực tiếp trên Web App đã triển khai, trên cảm ứng thiết bị hay ở trình duyệt thật.
- Đo thực nghiệm và điều chỉnh breakpoint sau khi có ảnh Web App chạy thật.
- Tiến độ vẫn lưu localStorage, chưa đồng bộ đa thiết bị.
- Dữ liệu thực vẫn do Sheet cũ cung cấp; hai nguồn mới dùng để tham khảo cách hiển thị và kiến trúc.
