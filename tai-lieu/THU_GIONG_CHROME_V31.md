# V3.1 — Thử giọng Chrome trực tiếp trong Web App Toán 2

Ngày 11/11/2026

## Vấn đề được quan sát
Người dùng chụp Chrome DevTools khi ứng dụng Google Apps Script đang mở. Lệnh `speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('vi'))` trả về `[]`.

Điều này chứng minh **không có giọng gắn nhãn tiếng Việt được liệt kê trong thời điểm và frame kiểm tra**; không chứng minh chắc chắn toàn bộ hệ điều hành không có giọng tiếng Việt. Cần thử sau `voiceschanged`, trên trang Web App thực tế và có thể thử giọng mặc định.

## Triển khai GitHub
- `30_ThuGiongChrome.html`: mô-đun thử giọng thuần Chrome Web Speech API; hiển thị tổng giọng, số giọng vi-*, danh sách theo tên/lang, nút tải lại danh sách, nút phát thử và nút dừng.
- `31_CSS_ThuGiongChrome.html`: style responsive của khu vực thử.
- `21_LyThuyetToan.html`: đặt panel thử tại cuối trang Lý thuyết; không ảnh hưởng LV.
- `19_KhongGianHocToan.html`: gọi setup sau khi render trang; gọi stop khi thoát.
- `GiaoDien.html`: nạp JS trước không gian Toán và CSS trong HEAD.

## Thử ngay
1. Pull repo `Nguyennth19/new-lop-2` và triển khai Web App Apps Script phiên bản mới.
2. Mở Toán 2 → Bài 20 → Lý thuyết; cuộn xuống cuối, đến phần **Thử giọng đọc Chrome**.
3. Xem Tổng giọng và Giọng tiếng Việt. Nếu 0, bấm Tải lại danh sách.
4. Bấm **Phát thử Chrome** (cần thao tác người dùng). Lắng nghe xem có giọng phát thực tế hay không.
5. Nếu có nhiều giọng, chọn giọng có `vi-VN`, thử từng lựa chọn. `Chrome mặc định (vi-VN)` chỉ yêu cầu locale; không bảo đảm ngữ âm Việt.
6. Nếu danh sách [] và phát thử bằng giọng tiếng Anh/nam, ghi nhận **không đạt chuẩn giáo dục**. Không dùng fallback đó làm giọng chính cho học sinh; chuyển phương án MP3 giọng nữ tạo sẵn.
7. Thử Chrome trên Android/Windows/macOS cùng thiết bị sử dụng thực tế, kiểm tra trong iframe Google Apps Script và trình duyệt riêng.

## Quy tắc
- Đoạn thử cố định: “Chào em! Hôm nay chúng ta học Toán lớp hai. Ba mươi sáu cộng mười bảy bằng năm mươi ba. Sáu cộng bảy bằng mười ba, viết ba nhớ một.”
- Công cụ thử dùng giọng Chrome thực tế, không gọi Google Sheet hoặc API TTS và không ghi dữ liệu người dùng.
- Không tuyên bố giọng nữ khi chỉ thấy `vi-VN`; Web Speech API không cung cấp trường giới tính ổn định.
- Khu vực thử phục vụ QA; chỉ gỡ sau khi chọn được engine phát chính thức.
- Kiểm tra tĩnh: JS không lỗi cú pháp, thẻ script trong `GiaoDien.html` cân bằng 19/19, thứ tự module đúng.
- Chưa thể xác nhận tiếng phát thực tế trong Chrome từ kết quả QA tĩnh.
