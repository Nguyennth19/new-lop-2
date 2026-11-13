# F-C.2 — PHIẾU XÁC NHẬN PHIÊN BẢN, DIGEST VÀ NGOẠI LỆ CHỨNG THỰC TEST
Ngày chuẩn bị: 2026-11-14; dự thảo trình chủ dự án, CHƯA ĐƯỢC KÝ.
Trạng thái: `PENDING_OWNER_EXPLICIT_CONFIRMATION`.
Repo: `Nguyennth19/new-lop-2`
Nhánh: `test/p0-6-fc-audit-20261114`
Bằng chứng nguồn: F-C.1 `FC1_E0_POLICY_ATTESTATION_RECONCILIATION_20261114.md`.

## A. Thông tin đề xuất khóa cho chính sách E.0
| Trường | Giá trị/căn cứ | Trạng thái |
|---|---|---|
| policyId | `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1` (F-A G8 reference) | TRACEABLE |
| sourceDocId | `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1.0-CANDIDATE` (header nguồn) | VERIFIED |
| canonicalPolicyVersion | **ĐỀ XUẤT** `V1.0-TEST` liên kết bản đặc tả `V1.0-CANDIDATE`; không thay hoặc xuất bản bản nguồn | OWNER_CONFIRMATION_PENDING |
| policy source | `thu-nghiem/p0-6/PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md` | VERIFIED |
| source Git blob | `69c07906f621b1ad91eba184a595544fe3b6d87c` | VERIFIED_CONNECTOR |
| source SHA-256 (UTF-8 text calculated) | `33636d43f895bc417e4916dcec8befcb27a489ff08f774ec1897aa4804cc486e` | CALCULATED, QA CHECK REQUIRED |
| independent raw-byte check | Workflow `.github/workflows/p0-6-fc2-policy-evidence.yml`: `git hash-object` + `sha256sum`, read-only; run `43477214932` on workflow creation commit `b9a9dfa4b7523d2b9da00497ef9d1b57021412e3` | STATUS TO BE VERIFIED FROM ACTIONS; do not assume success |
| owner approval provenance G8 | `FA_OWNER_APPROVAL_G7_G8_20261113.md`, owner chat approval recorded `2026-11-13T22:19:13.111+07:00` | TEST_ONLY |
| independent reviewedAt/signature | none | PENDING_OR_EXPLICIT_TEST_EXCEPTION |
| signed release | none | BLOCKED |

**Do not confuse** E.0 source SHA-256 with B21 generator candidate policy SHA-256 `1072ac8d9bbf03a3ccdd7ff694fc514e9c1d404ca0a3c1ac26fd8558490b059c`. Those are distinct documents and approvals.

## B. Xác nhận ngoại lệ cần quyết định chủ dự án
Chủ dự án có thể:
- **APPROVE_TEST_ATTESTATION_EXCEPTION**: giới hạn chứng thực E.0 cho TEST kỹ thuật độc lập bằng (i) bản nguồn khóa SHA-256 sau CI, (ii) thông điệp G8 đã ghi trong F-A, (iii) `recordedAt` lịch sử được mô tả là thời gian ghi nhận, **không** khai là thời gian ký số; (iv) `reviewerRef` là tham chiếu hội thoại chứ không phải xác thực danh tính độc lập. Cho phép dùng các chứng cứ đó để hoàn tất FC-02 *chỉ nhằm trình hồ sơ đóng P0 kỹ thuật TEST*, không phải chấp thuận đóng P0 hoặc phát hành.
- **REQUIRE_FORMAL_SIGNATURE**: yêu cầu bổ sung chứng thực độc lập về người duyệt, reviewedAt và chữ ký/hash trước khi FC-02 PASS.
- **REVISE_POLICY_VERSION**: yêu cầu đổi canonicalPolicyVersion, lập riêng bằng chứng hash/version và giải trình trước khi xin duyệt ngoại lệ.

**Mặc định khi chưa có thông điệp quyết định rõ:** `FC02=OWNER_ATTESTATION_PENDING`, `P0_CLOSURE=BLOCKED`, `RELEASE_READY=false`.

## C. Trường quyết định để trống đúng quy tắc
- `ownerDecision`: PENDING
- `approvedCanonicalPolicyVersion`: PENDING
- `ownerAcknowledgedPolicySha256`: PENDING
- `signedOrAcceptedAt`: PENDING
- `approvalEvidenceRef`: PENDING
- `conditions`: PREPARED_NOT_ACCEPTED
- `releaseDecision`: BLOCKED

## D. Ranh giới nếu chủ dự án đồng ý ngoại lệ TEST
Không sửa MAIN, `test-theo-main`, Web App TEST Version 6. Không tự động thông qua bài học khác, sư phạm B20/B21 ngoài phạm vi đã duyệt, không ghi học sinh/điểm/sao, không merge/deploy. `RELEASE_READY=false`. Sau khi FC-02 đủ bằng chứng và chủ dự án chấp thuận cách chứng thực, **vẫn cần quyết định đóng P0.6 riêng**.

## E. Checkpoint/recovery
Trước khi xử lý tiếp, kiểm tra branch HEAD, workflow run `43477214932` đúng SHA và conclusion, kiểm tra file `FC_CURRENT_STATE.json`. Nếu workflow FAIL phải giữ nguyên lỗi và phân tích; không tự ghi PASS. Nếu lời duyệt không rõ phạm vi, giữ PENDING. Không thay các báo cáo/CI PASS A–F.
