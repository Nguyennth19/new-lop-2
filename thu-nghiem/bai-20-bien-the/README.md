# Bài 20 – bản thử nghiệm biến thể (12/11/2026)

- Bản thử nghiệm **không sửa** dữ liệu SGK/SBT, bộ 51 câu Bài 20 hoặc mã nguồn triển khai chính.
- Dữ liệu gốc lấy theo cấu trúc Bài 20 từ bảng `Lớp 2 - Data bài 20...` (xuất phát từ `gemini-code`).
- `runtime.json`: 30 câu biến thể, chia 6 lượt LV1: 12, LV2: 10, LV3: 8. QA số học và số lượng đã kiểm tra tự động. Chưa QA sư phạm/UI thực tế.
- `xem-thu.html`: chạy tại trình duyệt (tải tệp về rồi mở), không ghi tiến độ vào Google Sheets.
- Hình ảnh G7, puzzle đa nghiệm, bài gốc chưa đạt QA và câu có lời văn mới vẫn cần kiểm tra trước khi phát hành chính.
- Các câu đều có ID mới `VAR_B20_...` và không được gắn nhãn câu nguyên văn SGK.

**Lưu ý**: Đây là gói dữ liệu thay thế thử nghiệm cho bài 20, không phải bản sửa kho JSON nguồn gốc SGK/SBT. Để làm trên ứng dụng Apps Script, cần lắp bộ đọc pack vào nhánh thử nghiệm sau khi thống nhất luồng runtime.

## Tích hợp trực tiếp vào ứng dụng Lớp 2 (staging)

Đã kết nối trên nhánh `test-b20-bien-the-20261112`:
- `layBaiToan20()` đọc JSON cố định theo commit (UrlFetchApp) qua `B20_BienTheMayChu.gs`.
- Màn hình Toán hiện tại tự chuyển sang chế độ pilot 6 lượt khi dữ liệu có `variantPilot:true`.
- `b20ChamThu()` kiểm tra đáp án phía máy chủ. Không lưu kết quả vào tab 90 và không ghi sao vào tab 91.
- Có thể quay về luồng đọc Sheets bằng cách đồng bộ nhánh `test-theo-main`, không phải xóa/ghi đè dữ liệu cũ.

Để chạy thử trực tiếp, đồng bộ nhánh thử nghiệm vào **một deployment Apps Script staging riêng**, chạy `kiemTraB20BienThe_()` trong Editor để cấp quyền URL Fetch và kiểm tra dữ liệu, rồi mở app > Lộ trình > Toán > Bài 20. Xem `QA_APP_SCRIPT.md` để biết những cổng QA đã đạt/chưa đạt.

**Giới hạn:** Các câu được trả lời qua một ô nhập số cho cả 6 dạng; giao diện riêng đặt tính, puzzle và hình ảnh G7 chưa chuyển đổi. Bộ câu biến thể chưa qua phê duyệt sư phạm hoặc kiểm thử trực tiếp trên Web App. Không dùng để xác nhận tiến độ học sinh.
