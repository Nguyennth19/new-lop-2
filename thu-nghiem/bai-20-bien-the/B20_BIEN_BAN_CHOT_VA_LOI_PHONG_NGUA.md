# NHẬT KÝ QUYẾT ĐỊNH & LỖI — BÀI 20
Ngày: 2026-11-12 · Chuẩn UI: test-theo-main · Nhánh thay đổi: test-b20-bien-the-20261112.

## Quyết định nghiệp vụ mới
- Chốt sáu lượt: LV1-A 2/3/3; LV1-B 3/3/2; LV2-A 3/3/2; LV2-B 3/1/1; LV3-A 3/3/3; LV3-B 3/3/1.
- 18 BÀI LỚN và 45 CÂU CON, không đồng nghĩa 45 ô nhập.
- Câu "Hiểu số nhớ" phải có phép tính đầy đủ, giải thích hàng đơn vị và câu hỏi rõ.
- Bài nhẩm/chia nhóm: 2–3 câu cùng dạng trên hàng khi đủ chỗ; không nhồi đoạn văn vào grid số.
- Bài lời văn luôn có đề, tóm tắt, bài giải, câu lời giải, phép tính và đáp số/đơn vị.
- LV3-A: điền thiếu chữ số ở cột đơn vị/chục/hỗn hợp, solver kiểm nghiệm duy nhất.
- LV3-B: nhẩm nâng cao và một bài lời văn, không dùng giao diện đặt tính.
- Giữ test-theo-main cho header/sidebar/result/keyboard/CSS. Không ghi kết quả thật trong staging.

## Lỗi cũ cần regression
B20-UI-01: nhóm sai, văn bản dài trong ô 78px => CSS đúng vẫn có thể vỡ bố cục.
B20-UI-02: adapter để summary rỗng/solutionPrompt mặc định => mất nội dung lời văn.
B20-UI-03: ép reverse/three/carry vào mental => sai mẫu và vị trí nhập.
B20-API-01: deployment Apps Script không có API chấm lượt => nút Nộp không chạy.
B20-QA-01: chỉ kiểm tra cú pháp/CSS SHA chưa đủ; phải có DOM/fixtures và QA web thật.

## Điểm khác biệt với mã hiện tại
Gói JSON B20 hiện có 30 câu (6/6/5/5/4/4). Blueprint mới cần 45 (8/8/8/5/9/7).
Lượt LV3-A trước đây là reverse/three dạng nhẩm, KHÔNG phải digit-mask trong cột.
Không được gọi UI20-01 là "đã xong triển khai" chỉ vì tài liệu chốt nội dung.
Các sửa cũ được bảo toàn trong NHAT_KY_LOI_VA_PHONG_NGUA.md; bản này là biên bản quyết định 45 câu và danh sách rủi ro mới.

## Lịch sử và trạng thái
2026-11-12 — SPEC_RECORDED: ghi nhận yêu cầu chi tiết và blueprint mới.
2026-11-12 — IMPLEMENTATION_NOT_STARTED: chưa tạo 15 câu bổ sung, chưa chỉnh renderer theo blueprint và chưa deploy.
NEXT — xây fixtures 45 câu có QA; thử UI20-02/03; chạy test tự động và browser; ghi riêng kết quả đạt/chưa đạt vào nhật ký.
