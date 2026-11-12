# Bài 20 – bản thử nghiệm biến thể (12/11/2026)

- Bản thử nghiệm **không sửa** dữ liệu SGK/SBT, bộ 51 câu Bài 20 hoặc mã nguồn triển khai chính.
- Dữ liệu gốc lấy theo cấu trúc Bài 20 từ bảng `Lớp 2 - Data bài 20...` (xuất phát từ `gemini-code`).
- `runtime.json`: 30 câu biến thể, chia 6 lượt LV1: 12, LV2: 10, LV3: 8. QA số học và số lượng đã kiểm tra tự động. Chưa QA sư phạm/UI thực tế.
- `xem-thu.html`: chạy tại trình duyệt (tải tệp về rồi mở), không ghi tiến độ vào Google Sheets.
- Hình ảnh G7, puzzle đa nghiệm, bài gốc chưa đạt QA và câu có lời văn mới vẫn cần kiểm tra trước khi phát hành chính.
- Các câu đều có ID mới `VAR_B20_...` và không được gắn nhãn câu nguyên văn SGK.

**Lưu ý**: Đây là gói dữ liệu thay thế thử nghiệm cho bài 20, không phải bản sửa kho JSON nguồn gốc SGK/SBT. Để làm trên ứng dụng Apps Script, cần lắp bộ đọc pack vào nhánh thử nghiệm sau khi thống nhất luồng runtime.
