# F-C.4 — BIÊN BẢN QUYẾT ĐỊNH ĐÓNG P0.6 KỸ THUẬT (TEST ĐỘC LẬP)

Ngày ghi nhận: 2026-11-14 (Asia/Ho_Chi_Minh). Không suy diễn giờ ký, chữ ký số hay xác thực danh tính độc lập.
Repository: `Nguyennth19/new-lop-2`
Audit branch: `test/p0-6-fc-audit-20261114`
Nguồn checkpoint trước quyết định: `34451b56c3e95493961ad2974720d059a012f22d`.
Quyết định: `APPROVE_P0_6_ISOLATED_TEST_TECHNICAL_CLOSURE_WITH_EXCLUSIONS`
Trạng thái nghiệm thu: `P0_6_TECHNICAL_CLOSED_ISOLATED_TEST_ONLY`
Trạng thái phát hành: `RELEASE_READY=false` / `PRODUCTION_RELEASE_BLOCKED`.

## 1. Lời xác nhận của chủ dự án
Thông điệp trực tiếp được ghi nhận:
> **"Chấp thuận đóng P0.6 về mặt kỹ thuật trong phạm vi TEST độc lập, với các giới hạn và ngoại lệ đã ghi đầy đủ trong biên bản F-C.3."**

Đây là **quyết định phê duyệt của chủ dự án được ghi nhận từ hội thoại** và lưu làm bằng chứng quản trị của dự án. Không phải ảnh chữ ký, chữ ký số hoặc xác thực danh tính bên thứ ba. Người lập biên bản không ký thay chủ dự án.

- decisionProvenance: `PROJECT_OWNER_EXPLICIT_CHAT_APPROVAL_2026-11-14_FC4`.
- decisionRecordedDate: `2026-11-14` (theo ngày hội thoại, không tự tạo timestamp ký).
- signedAt / cryptographicSignature: `NOT_ASSERTED`.
- approvalScope: `ISOLATED_TEST_TECHNICAL_ONLY`.
- policy E.0: `V1.0-TEST`, được xác nhận ở F-C.3; Git blob `69c07906f621b1ad91eba184a595544fe3b6d87c`, SHA-256 `33636d43f895bc417e4916dcec8befcb27a489ff08f774ec1897aa4804cc486e`.

## 2. Những cổng đóng
| Gate | Kết luận trong phạm vi đã chứng minh | Bằng chứng |
|---|---|---|
| A – Hợp đồng dữ liệu và validator | PASS OFFLINE TEST | `FC_P06_TONG_HOP_KIEM_TOAN_20261114.md`; CI `43418492205` |
| B – Adapter/Registry/fallback | PASS OFFLINE TEST | CI `43420505949` |
| C – QA Engine/Grading Contract | PASS OFFLINE TEST | CI `43428400824` |
| D – Renderer Registry/parity B20 | PASS OFFLINE TEST | CI `43429236553` |
| E – Pilot/Generator/Composer | PASS OFFLINE TEST | CI `43440199612` |
| F-A – Chính sách sư phạm E.0, B21 G5/G7/G8 | PASS ISOLATED TEST | `FA_OWNER_APPROVAL_G7_G8_20261113.md`; Chromium CI `43453411019`, B21 8/8 trên desktop/mobile |
| F-B – Versioning/rollback và B20 tiếp nhận độc lập | PASS ISOLATED TEST | B20 Chromium CI `43461674746`, B20 30/30 desktop/mobile; governance `43462067810` |
| FC-01 – Đối chiếu hồ sơ quyết định | PASS DOCUMENTARY TEST | `FC_OWNER_DECISION_AND_FC01_FC02_20261114.md` |
| FC-02 – SHA-256, phiên bản và ngoại lệ chứng thực TEST | PASS DOCUMENTARY TEST UNDER OWNER EXCEPTION | `FC2_E0_VERSION_DIGEST_TEST_EXCEPTION_DECISION_PACKET_20261114.md`, `FC3_E0_OWNER_TEST_EXCEPTION_DECISION_20261114.md`; raw-byte CI `43477214932` SUCCESS |
| FC-03/04 – Tổng hợp và quyết định đóng P0.6 | APPROVED TEST TECHNICAL CLOSURE | `FC3_P06_TEST_CLOSURE_READINESS_20261114.md`; thông điệp chủ dự án ghi tại mục 1 |

Không thay, chạy lại hoặc cấp lại PASS cho các module A–F; chỉ kế thừa QA và commit đã chốt.

## 3. Ngoại lệ và giới hạn bắt buộc
1. **Không chứng nhận** tích hợp hoặc triển khai Google Apps Script Web App TEST Version 6; không có attestation version-to-Git-SHA của deployment.
2. **Không chứng nhận** vận hành production, học sinh thực tế, ghi điểm/sao/lịch sử hoặc các chức năng dành cho phụ huynh.
3. B24 và Tiếng Việt vẫn `PENDING_INDEPENDENT_QA` / `BLOCKED`; chỉ B20 và B21 có bằng chứng độc lập trong TEST.
4. Rollback theo bài học là **logical TEST rollback**, không phải chứng cứ rollback deployment thật.
5. Ngoại lệ về chứng thực thời điểm/định danh độc lập chỉ áp dụng cho hồ sơ kỹ thuật TEST, không áp dụng cho release hoặc ký số production.
6. GitHub Actions artifacts có thời hạn lưu; SHA, script, CI link và tài liệu là tham chiếu phục hồi, không bảo đảm ZIP được lưu vĩnh viễn.
7. Không sửa `main`, `test-theo-main`, Web App TEST Version 6; không merge, không deploy.
8. `RELEASE_READY=false` không được thay đổi theo quyết định đóng kỹ thuật này.

## 4. Kết luận và tình trạng tiếp theo
**ĐÃ ĐÓNG P0.6 về mặt kỹ thuật trong phạm vi TEST độc lập**, với tất cả ngoại lệ ở mục 3. Đây là **quyết định đóng mốc kỹ thuật**, không phải phê duyệt phát hành sản phẩm.
`P0_6_TECHNICAL_CLOSED_ISOLATED_TEST_ONLY=true`
`P0_6_PRODUCTION_RELEASE_APPROVED=false`
`RELEASE_READY=false`

Mọi hoạt động tiếp theo phải được quyết định thành công việc/mốc riêng và có phê duyệt tương ứng; biên bản này không tự động mở quyền đối với Web App V6.

## 5. Khôi phục khi gián đoạn
Đọc `FC_CURRENT_STATE.json`, biên bản F-C.3, F-C.1/2 và hồ sơ F-A/F-B. Xác minh HEAD nhánh F-C và blob SHA của tài liệu này trước khi tái thao tác. Không ghi lại quyết định trùng; không lấy kết quả CI commit cũ để khẳng định một bản triển khai mới. Nếu checkpoint và biên bản không đồng bộ sau gián đoạn, đối chiếu HEAD và cập nhật trạng thái chỉ trên nhánh F-C.
