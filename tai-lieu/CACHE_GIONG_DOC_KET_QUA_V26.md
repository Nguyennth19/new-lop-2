# Phiên bản V2.6 — Cache, giọng đọc Việt Nam và bảng kết quả

Ngày cập nhật: 2026-11-11. Repo triển khai: `Nguyennth19/new-lop-2`.

## 1. Cache theo bài (không phụ thuộc LV)
- `27_BoNhoBaiHoc.html`: `Map` trong bộ nhớ tab + `sessionStorage`, TTL 30 phút, khóa `lop2_lesson_cache_v26_b20_20261111_toan_b20`. Hỗ trợ dùng lại khi đổi trang hoặc LV và gộp các request trùng nhau; dữ liệu học sinh, điểm và nháp không ghi vào cache này.
- `DuLieuToanSheet.gs`: `CacheService.getScriptCache()` TTL tối đa 21600 giây (6 giờ), key `toan_b20_v26_20261111`, giới hạn 95KB; cache có thể bị hệ thống xóa sớm.
- Quản trị: chạy `lamMoiBoNhoToan20_()` thủ công trên Apps Script Editor sau khi cập nhật Sheet. Trình duyệt đã mở vẫn có cache 30 phút; đổi phiên bản khóa client khi phát hành dữ liệu mới cần cập nhật tức thì.
- Không có truy cập Google Sheets khi đổi LV/Lý thuyết trong cùng phiên đã tải.

## 2. Giọng đọc
- `28_GiongDocTiengViet.html` thay cho các hàm Web Speech rời rạc trong không gian Toán và phần lý thuyết.
- Ưu tiên `vi-VN` và những tên giọng nữ được thiết bị công bố, như `Microsoft HoaiMy`. Nếu không có giọng Việt chuẩn, trình duyệt có thể dùng giọng mặc định.
- Tốc độ 0.88, cao độ 1.08, chia đoạn dài để tránh gián đoạn.
- GitHub chỉ lưu mã nguồn; không tải script động từ GitHub tại runtime, không gửi văn bản lên dịch vụ TTS ngoài. Muốn cam kết giọng nữ trên mọi thiết bị cần nhà cung cấp TTS/audio riêng và cấu hình quyền/API.
- Nút `Đọc đề` ở bảng kết quả sẽ đọc toàn bộ tiêu đề nhóm và đề bài hiện hành; Lý thuyết giữ nút `Nghe bài giảng`.

## 3. Thay đổi giao diện
- Loại bỏ các nút `Nghe yêu cầu`, `Kiểm tra bài này`, `Xóa bài này` từ mọi nhóm trong LV, và `Kiểm tra toàn cấp độ` dưới nội dung.
- Bảng kết quả có nút `Nộp & chấm bài`, `Làm lại`, `Đọc đề`; thu nhỏ các thẻ, lưới đáp án 5 cột trên màn lớn, thông tin thời gian/điểm gọn. CSS `29_CSS_BangKetQua_V26.html`.
- `Làm lại` xóa nháp và kết quả nộp hiện thời của LV, nhưng không xóa thành tích lịch sử đã ghi nhận; tránh làm mất kết quả hoàn thành trước.
- Định dạng cũ V2.4 không bị gỡ khỏi repo để giảm rủi ro hồi quy; ưu tiên CSS V2.6 nạp cuối.

## 4. Kiểm thử đã thực hiện
- Kiểm tra cú pháp JS các module sửa: PASS.
- Thẻ script trong `GiaoDien.html`: 18 mở, 18 đóng.
- Không có selector nút cũ trong `19_KhongGianHocToan.html`.
- Cache: hai yêu cầu đồng thời + lượt gọi thứ ba + tạo instance mới từ `sessionStorage` đều chỉ gọi loader một lần.
- TTS giả lập giọng `Vietnamese Male` và `Microsoft HoaiMy`: chọn HoaiMy theo mức ưu tiên.
- **Chưa kiểm thử đầy đủ trên Web App triển khai thật, Android, iOS, Chrome, Safari**; không thể khẳng định giới tính giọng đọc trên mọi thiết bị.

## 5. Triển khai
1. Đồng bộ GitHub sang Apps Script.
2. Tạo deployment phiên bản mới.
3. Mở Bài 20, đổi Lý thuyết/LV1/LV2/LV3; kiểm tra không gọi lại server khi chuyển.
4. Bấm `Đọc đề` và `Nghe bài giảng` trên các thiết bị kiểm thử.
5. Kiểm tra `Nộp & chấm bài`, `Làm lại`, lưu nháp, trạng thái đáp án, tiến độ.
6. Khi Sheet đổi, xóa cache phía server và đổi phiên bản cache phía client nếu cần cập nhật tức thì.

Tài liệu kỹ thuật: https://developers.google.com/apps-script/reference/cache/cache và https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices.
