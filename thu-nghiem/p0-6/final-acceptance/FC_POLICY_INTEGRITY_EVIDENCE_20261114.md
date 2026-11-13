# F-C — PHỤ LỤC XÁC MINH TOÀN VẸN CHÍNH SÁCH E.0 (FC-02)
Ngày: 2026-11-14; phạm vi TEST only, không phải chữ ký của chủ dự án.

## Khóa nguồn và phép tính
- Repo: `Nguyennth19/new-lop-2`.
- Commit nguồn kiểm toán: `4d79b660789b3732289070aec7b5af776757eebb` (nhánh F-C trước cập nhật quyết định).
- Tài liệu: `thu-nghiem/p0-6/PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md`.
- Git blob: `69c07906f621b1ad91eba184a595544fe3b6d87c`.
- SHA-256 nội dung UTF-8 được GitHub connector trả về: `33636d43f895bc417e4916dcec8befcb27a489ff08f774ec1897aa4804cc486e`.
- Cách tính: tải `fetch_file` theo commit, tính SHA-256 trên văn bản UTF-8 bằng chương trình JavaScript SHA-256 (kiểm vector chuẩn `abc` = `ba7816bf8f01cfea414140de5dae2223b00361f20015ad`).
- **Giới hạn xác minh:** đây là SHA-256 của nội dung Unicode do connector cung cấp khi mã hóa UTF-8; chưa đối chiếu độc lập trực tiếp với bytes raw blob bằng một công cụ thứ hai. Không sử dụng làm chữ ký số, chứng cứ đã được chủ dự án phê duyệt đúng digest, hoặc release attestation.
- Phép kiểm lặp lại khuyến nghị khi cần đóng dấu raw byte: `git show 4d79b660789b3732289070aec7b5af776757eebb:thu-nghiem/p0-6/PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md | sha256sum`, lưu stdout và phiên bản Git vào hồ sơ. **Lệnh này chưa được chạy trong cuộc kiểm toán này**.

## Tách quyền và thời điểm
- `policyId` tham chiếu G8: `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1`.
- `sourceDocId` tại đầu đặc tả là `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1.0-CANDIDATE`. Không tự tuyên bố hai tên là cùng một canonical policyVersion đã ký.
- `policyVersionCanonical`: `PENDING_OWNER_OR_AUTHORIZED_POLICY_CONFIRMATION`.
- `decision`: `OWNER_APPROVED_TEST_SCOPE_CONDITIONAL_ON_G5` (theo hồ sơ F-A), không phải quyết định đóng P0.
- `reviewerRef`: `PROJECT_OWNER_EXPLICIT_CHAT_APPROVAL_2026-11-13_G7_G8`.
- `decisionRecordedAt`: `2026-11-13T22:19:13.111+07:00` từ hồ sơ F-A.
- `independentlyVerifiedReviewedAt`: PENDING; không đồng nhất thời điểm ghi nhận hồ sơ với dấu thời gian ký độc lập.
- `approvalOfThisExactPolicySha256`: PENDING; chưa có bằng chứng người duyệt đã xác nhận chính digest này.
- `releaseSignature`: NONE.
- `P0ClosureApproval`: WITHHELD_BY_OWNER_PENDING_FC01_FC02.

## Kết luận kiểm toán
FC-02 **có thêm chứng cứ digest tái lập** nhưng chưa đạt chuẩn đóng dấu quyết định bất biến toàn phần. Trạng thái `PENDING_FORMAL_ATTESTATION`; không tự chuyển sang PASS. `RELEASE_READY=false`.

## Bổ sung F-C.1 – Đối chiếu ba đường GitHub, không thay chứng thực byte gốc
- Đã lấy trực tiếp Git blob SHA `69c07906f621b1ad91eba184a595544fe3b6d87c`, file tại commit `2c39eb555de9e2c8fe44ef156ae0fbf12d5c8a6f` và raw content tại cùng commit. Ba chuỗi nội dung trả về giống hệt nhau; Git SHA của file cũng trùng object SHA ở trên.
- Phép SHA-256 UTF-8 `33636d43f895bc417e4916dcec8befcb27a489ff08f774ec1897aa4804cc486e` giữ nguyên; không tuyên bố chứng thực raw byte độc lập hoặc chủ dự án đã ký digest này.
- Chuẩn hóa fields và các mục còn thiếu: xem `FC1_E0_POLICY_ATTESTATION_RECONCILIATION_20261114.md`. `FC-02=PARTIAL_SOURCE_CROSS_VERIFIED_SIGNOFF_PENDING`; `RELEASE_READY=false`.
