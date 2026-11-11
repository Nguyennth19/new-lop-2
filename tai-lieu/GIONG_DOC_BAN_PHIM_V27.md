# V2.7 — Giọng Việt, bo góc, bảng kết quả và bàn phím (11/11/2026)

## Đối chiếu GitHub trước khi sửa
- `Nguyennth19/lop-2-new/Script_UI.html`: `initSpeechSynthesisVoices`, `speakVietnamese`; đợi 60 ms sau `speechSynthesis.cancel()`, giọng `vi-VN`, rate 0.92, pitch 1.1 để hạn chế bị nuốt âm trên Safari/iOS.
- `Nguyennth19/hoc-tieng-anh/JS_Speaking.html`: lưu `voiceURI`, tốc độ và chọn giọng qua `localStorage`.
- Trình duyệt Web Speech API không có trường giới tính đáng tin cậy. Chọn theo tên chỉ là ưu tiên; người dùng có thể chọn giọng Việt chính xác trong hộp chọn trên trang Lý thuyết.
- Không chuyển GitHub thành dịch vụ TTS công khai. Repo giữ mã nguồn, trình duyệt dùng giọng đã cài trên thiết bị.

## Sửa mã nguồn
- `28_GiongDocTiengViet.html`: kết hợp logic 2 repo: refresh danh sách giọng, ưu tiên vi-VN/giọng nữ theo tên, lưu `voiceURI` và tốc độ, xử lý chuỗi văn bản thành đoạn 135 ký tự, đợi 60 ms rồi mới phát, dừng/hủy an toàn.
- `21_LyThuyetToan.html`: thêm select `mlVoiceChoice`, nút nghe bài giảng và nút dừng. Thẻ select được khởi tạo sau khi dựng DOM bởi `19_KhongGianHocToan.html`.
- `19_KhongGianHocToan.html`: bàn phím 16 nút `0–9,+,−,×,÷,=,⌫`; bỏ Tiếp; Enter trên bàn phím vật lý chỉ chuyển sang ô sau; bỏ Đọc đề ở bảng kết quả.
- `29_CSS_BangKetQua_V26.html`: hai nút ở cùng hàng: Làm lại đỏ (trái), Nộp & chấm bài xanh lá (phải); bo góc 18px module; 16 phím responsive.
- Không xóa nút nghe bài giảng trên Lý thuyết vì yêu cầu bỏ là nút Đọc đề trong bảng kiểm tra.

## Kiểm thử tĩnh
- 14 mô-đun JS đọc lại: không có SyntaxError.
- `GiaoDien.html`: 18 thẻ script mở/đóng.
- Không còn chuỗi Tiếp → và `data-ml-read-level` trong không gian Toán.
- Có các nút ×, ÷, =, xóa và hai hành động ở bảng kết quả.
- **Cần QA trực tiếp:** giọng nữ thực tế trên thiết bị mục tiêu (Android/iOS/Chrome/Safari), tự động phát sau gesture; chiều cao bàn phím khi 16 nút; sự nhất quán màu của hai nút trong Apps Script Web App.

## Cách dùng giọng đọc
1. Mở Bài 20 > Lý thuyết > Giọng đọc.
2. Chọn giọng `vi-VN` nữ có trên máy, ví dụ HoaiMy, nếu danh sách có.
3. Bấm Nghe bài giảng; có nút Dừng.
4. Lựa chọn ghi ở localStorage và áp dụng cho lần mở tiếp theo trên cùng thiết bị.
5. Nếu danh sách không có giọng Việt, cần cài giọng Việt vào hệ điều hành/trình duyệt hoặc dùng dịch vụ tạo audio chuyên dụng (chưa tích hợp).
