# P0.6-D — Question Renderer Registry đa môn (TEST-only)

Ngày: 2026-11-13, Asia/Ho_Chi_Minh
Nhánh: `test/p0-6-d-renderer-registry-20261113`
Base: `test/p0-6-c-qa-grading-20261113`

## Đã triển khai
1. `thu-nghiem/p0-6/question-renderer-registry-v1.cjs`: phân phối thuần theo `question.kind` và `renderer.component`, không xét tên bài cố định. Handler được inject, không tự tạo form/chấm bài/ghi dữ liệu. Fallback tĩnh, không tương tác, không in câu sai hay prompt chưa được hỗ trợ.
2. `thu-nghiem/p0-6/renderer-b20-bridge-v1.cjs`: ánh xạ sáu kind `math.vertical`, `math.mental`, `math.carry`, `math.three`, `math.reverse`, `math.word` sang đúng hàm hiện hữu `vertical/mental/word` của `41_HienThiCauHoiToan.html`; truyền đúng đối tượng câu đã được `42_AdapterBienTheB20.html` chuẩn bị. Chặn lệch ID, lời dẫn, loại câu, tham số, đáp án, đơn vị và lessonId.
3. `renderReadonlyPreview` hỗ trợ xem trước câu dạng ngôn ngữ đã đăng ký; escape HTML, không có input hay chức năng chấm tự động. Câu chưa được hỗ trợ hiển thị thông báo bất động, không gắn nhầm renderer khác.
4. `thu-nghiem/p0-6/kiem-thu-renderer-registry-v1.cjs`: 19 ca kiểm. Dùng Node VM gọi chính hai file `.html` hiện hữu làm baseline; kiểm 30/30 HTML đầu ra của bộ chọn mới giống tuyệt đối với renderer Bài 20 cũ, kiểm đủ 6 lượt, unknown kind, sai tham số/đáp án, cross-lesson, XSS fallback, thiếu handler và các API ghi.
5. `.github/workflows/p0-6-d-renderer-registry.yml`: chạy kiểm định D + C + B + A + P0.4 FULL_SAFE + hồi quy nguồn B20, xác nhận P0.5 Release Gate vẫn khóa.

## Bằng chứng CI
- GitHub Actions: https://github.com/Nguyennth19/new-lop-2/actions/runs/43429236553
- Source commit `ebe1dbf396cc1e9f1f4ae2b051079f3b563878cc`.
- Kết quả `SUCCESS` với tất cả các step quan trọng: D renderer parity, C grading, B adapter, A contract, inherited FULL_SAFE, B20 original regression, release gate blocked, no file mutations.
- **19/19** ca QA D pass, bao gồm **30/30** câu HTML parity chính xác.
- Không coi đây là kiểm thử trình duyệt thật, không xác nhận hỗ trợ tương tác Tiếng Việt/Tiếng Anh lúc này.

## Giới hạn và an toàn
- Registry và B20 bridge hiện là Node/CI offline; chưa gắn vào `doGet`, HTML templates, Apps Script TEST Web App Version 6 hay production. Không sửa `41_HienThiCauHoiToan.html` hoặc `42_AdapterBienTheB20.html`.
- Việc giữ nguyên output trong Node VM với mock `E/input/baseCard` xác nhận cách chọn renderer không làm sai HTML tại các fixture B20; **không thay thế** visual QA thực trên desktop/mobile.
- Câu mở chưa được tự động chấm; nếu không có handler/rubric được duyệt, đầu ra phải `UNSUPPORTED` hoặc readonly, không tạo giao diện trả lời gây hiểu nhầm là đã chấm.
- Tất cả đường ghi điểm/sao, lịch sử học sinh và phát hành production không thay đổi. `RELEASE_READY=false`.

## Rollback
- Runtime đang sử dụng không đổi, nên không cần thao tác rollback Web App.
- Nếu suite D lỗi, revert ba tệp D mới và workflow ở nhánh D, trở về `test/p0-6-c-qa-grading-20261113`. Giữ `test/p0-5-i2-webapp-evidence-20261113` làm mốc nghiệm thu Pilot. Chỉ thực hiện trên TEST, không tác động MAIN / test-theo-main.
- Khi tích hợp thực tế sau này, feature flag phải mặc định OFF và đường renderer B20 cũ vẫn là mặc định; chỉ bật nếu UI smoke + six-session regression đạt.

## Bước kế tiếp
P0.6-E: Multi-Lesson Pilot (chọn một bài Toán ngoài B20 và một bài Tiếng Việt hoặc Tiếng Anh), chuẩn bị fixtures đúng nguồn/bài, adapter/renderer theo kind, QA sư phạm và kiểm tra có điều kiện trên TEST độc lập trước bất kỳ phát hành nào.
