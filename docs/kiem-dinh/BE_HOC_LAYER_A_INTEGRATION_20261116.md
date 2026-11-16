# BE-HOC / Lớp A – Triển khai an toàn từ test-theo-main

**Ngày:** 2026-11-16; **nhánh mới:** `be-hoc`; **gốc:** `f51a12cc07b44f0f893c2e0de40e387cc17b5c3b`; **nguồn Lớp A:** `83bb8a1784fabead2cd31b497044a1274f8bf1a1`.

## Triển khai thực tế, không phóng đại
Đã giữ nguyên mọi file gốc của ứng dụng ngoại trừ:
- `41_HienThiCauHoiToan.html`: thay đúng nguồn G7.4 renderer đã chỉnh bài đặt tính, nhẩm, puzzle, lời văn (cùng hàm `taoHienThiCauToan`, không sửa lựa chọn, dữ liệu Sheets, chấm, sidebar, keyboard hay điểm/sao).
- `43_CSS_ThanhPhanBaiToan.html`: thêm CSS scoped `#mathFullScreen`; gắn include duy nhất vào `GiaoDien.html`. Không đổi CSS header, trang chủ, thành tích, lộ trình, phím.
- Các bản nguồn tham chiếu D2 V1.2, sơ đồ SVG/toán V2, G7.5 TTS V2, B20 adapter đã được lưu theo đúng Git blob trong `qa/be-hoc-lop-a/refs/` để bảo toàn phiên bản và QA kỹ thuật. **Chúng chưa được nối vào runtime GAS**.

## Tại sao chưa bật D2 V1.2/TTS/B20?
- D2 V1.2 có `gradingEnabled=false` và `runtimeEnabled=false`: muốn gắn vào bài cần adapter đối chiếu dữ liệu Sheet, bàn phím, chính sách ô nhớ, chấm tin cậy.
- Bộ dựng hình toán học có cùng module `answerKey()` dùng riêng phía server/QA. Không đưa nguyên module chứa đáp án vào HTML học sinh.
- TTS V2 là bộ chuẩn hóa văn bản có chủ xác nhận nghe độc lập, chưa có host click-to-speak/QA web thật.
- B20 adapter tạo trường `answer` cho client. Không bật biến thể B20 theo cách này khi chưa phân tách public/private, và không thay thế luồng Sheet hiện tại.
- Registry 288 asset là metadata, không bật auto binding; ảnh pilot đã có trong baseline vẫn được giữ.

## Trạng thái kiểm thử
Kiểm thử Node kiểm tra include trong `GiaoDien`, CSS hạn chế phạm vi, hàm renderer, HTML escaping, D2 không lộ đáp án, SVG public không chấm, TTS V2 đọc chuỗi số public, 2 source nâng cấp UI và bốn module staging.
**Không được gọi đây là QA visual trong browser hoặc GAS E2E**. Muốn phát hành cho bé phải có kiểm tra trực quan thật và quyết định triển khai riêng.

## Cổng chặn không thay đổi
C07 chờ độc lập; C08=PENDING, C09=PENDING_C08; C12 host integration chưa duyệt. Không merge main/test-theo-main, không deploy GAS, không ghi điểm/sao hoặc dữ liệu học sinh. Rollback = trở lại `f51a12cc07b44f0f893c2e0de40e387cc17b5c3b`; vì chưa triển khai GAS nên không có runtime rollback.

## Tiếp theo
`MVP-I2B – BE-HOC D2 HOST ADAPTER + B20 SAFE PUBLIC/PRIVATE REVIEW`, rồi `MVP-I3 – BROWSER/GAS TEST`. Chỉ mở từng tính năng sau khi QA chạy trên app và đủ quyền.
