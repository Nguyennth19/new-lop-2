# F-A.1 — PHIẾU TỔNG HỢP TRÌNH DUYỆT E.0 P01–P06
**Không phải quyết định phê duyệt.** Phạm vi TEST-only, không sửa nguyên tắc bất biến G0–G8, policy gốc hoặc quy trình phát hành.

| ID | Kiến nghị áp dụng | Điều kiện bắt buộc | Quyết định thực tế |
|---|---|---|---|
| P01 | CHẤP NHẬN: SGK/SBT neo phạm vi, không bắt buộc giống nguyên văn/hình | Mọi biến thể gắn lessonId/skillId, phản ánh phạm vi kiến thức đã học | PENDING_APPROVAL |
| P02 | CHẤP NHẬN CÓ ĐIỀU KIỆN: V1 đổi số/vật; V2 đổi tương tác; V3 đổi cấu trúc | V1 giữ ràng buộc toán; V2 kiểm tương đương & độ khó; V3 có chuyên gia duyệt family trước | PENDING_APPROVAL |
| P03 | CHẤP NHẬN: hình theo vai trò | NONE/DECORATIVE không buộc hình; COUNTABLE/MEASUREMENT/GEOMETRY phải chính xác dữ kiện; kiểm G7.4 | PENDING_APPROVAL |
| P04 | CHẤP NHẬN CHO TEST: Validator G0–G8 fail-closed | PASS kỹ thuật không thay sư phạm; G5 readonly không thành interactive | PENDING_APPROVAL |
| P05 | CHẤP NHẬN: mức độ và số lượt theo từng bài | 4/2/2 là B21 pilot, không làm quota toàn lớp 2; sư phạm duyệt trước khi dùng | PENDING_APPROVAL |
| P06 | CHẤP NHẬN CÓ ĐIỀU KIỆN: approve template/family + 100% QA sinh | Có sampling theo rủi ro, chính sách drift, lưu hash, reviewer và điều kiện rollback | PENDING_APPROVAL |

## Phân định chữ ký
Đây là đề xuất kỹ thuật/sư phạm do F-A.1 tổng hợp, **không phải xác nhận của chủ dự án**. Chỉ đổi trạng thái từng P01–P06 khi có thông điệp phê duyệt rõ của chủ dự án và ghi đủ `policyId, policyVersion, policySha256, decision, scope, conditions, reviewerRef, reviewedAt, evidenceRef` theo chính sách E.0. Bản quyền phê duyệt B21 **riêng** với E.0.

## Gói B21
LV1 thực hành 2D+1D có nhớ; LV2 giải phép cộng 2D+2D có nhớ theo thuật toán đặt tính; ứng viên LV3 mới yêu cầu chọn phần tách làm tròn chục, kết quả và giải thích. Cùng phép toán nhưng yêu cầu chiến lược trung gian có thể được so sánh rõ với việc chỉ điền đáp số. Không tự cho phép UI/rendering hai trường. Cổng G5 BLOCKED; G7/G8 PENDING. Kiểm tra phạm vi B21 theo SGK/SBT chính thức vẫn cần reviewer, hiện INDEX_VERIFIED.
