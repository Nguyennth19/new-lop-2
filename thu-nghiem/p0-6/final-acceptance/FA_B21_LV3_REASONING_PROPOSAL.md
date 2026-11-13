# F-A.1 — Bài 21: ứng viên LV3 khác biệt về nhận thức (offline)
**Trạng thái:** `TECHNICAL_REASONING_PROOF_PASS` nếu và chỉ nếu kiểm thử trên commit tương ứng SUCCESS; `PEDAGOGY=PENDING_APPROVAL`; `G5=BLOCKED`.

## Tại sao bản E.0.3 chưa đủ
LV2 và LV3 đều dùng `ADD_CARRY_2D_2D` + `NUMBER_INPUT` với V1_SURFACE. Khác số hay `math.mental` không tự chứng minh mức vận dụng.

## Phương án F-A.1 – không thêm tính năng runtime
Tạo overlay độc lập **chỉ cho hai câu LV3 sinh từ Composer nguyên bản**. Thay vì chỉ điền đáp số, nhiệm vụ yêu cầu học sinh:
1. Xác định phần cần tách từ số hạng thứ hai để số hạng đầu tròn chục (`bridge`).
2. Cộng phần còn lại và viết kết quả (`total`); giải thích bước trung gian theo mẫu.

Ví dụ **minh họa, không phải kết quả seed bắt buộc**: 48 + 27: tách 2 từ 27, 48+2=50, 27-2=25, 50+25=75. Tách số đúng toán và có chuyển đổi biểu diễn chiến lược. Số lượng hình là NONE (không làm dữ kiện).

Đây là **đề xuất mức nhận thức cao hơn** phép đặt tính LV2 về mặt giải thích chiến lược; vẫn cần giáo viên xác nhận độ phù hợp chương trình B21. Yêu cầu hai trường trả lời không được auto-đánh giá bằng renderer `math.mental`; **không khai báo Web App đã hỗ trợ**. Overlay thực tế được kiểm chứng qua `b21-lv3-reasoning-overlay.cjs` và `kiem-thu-b21-lv3-reasoning.cjs`; không sửa E03 Composer, policy SHA pin, JSON B21 H.1 hay ứng dụng TEST.

## Chặn bắt buộc
- `LV3_DIDACTIC_PROPOSAL=READY_FOR_REVIEW`, **không** `APPROVED`.
- `G5=BLOCKED` đến khi có tương tác 2 trường và rubric tương ứng, hoặc được chủ dự án duyệt một hình thức đánh giá phù hợp đã có.
- `G7/G8=PENDING` đến khi reviewer có thẩm quyền ký hồ sơ policy/lesson.
- `RELEASE_READY=false`; không dùng với học sinh.
- Nếu LV3 cần đo năng lực được giới hạn chỉ ở phép tính đơn, reviewer có thể từ chối overlay; lúc đó không quảng cáo phân tầng LV3 đã hoàn chỉnh.
