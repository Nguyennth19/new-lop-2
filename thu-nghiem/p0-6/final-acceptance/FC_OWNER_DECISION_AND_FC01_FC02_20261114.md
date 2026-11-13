# F-C — BIÊN BẢN GHI NHẬN QUYẾT ĐỊNH CỦA CHỦ DỰ ÁN (KHÔNG PHẢI BIÊN BẢN ĐÓNG P0)
Ngày ghi nhận: 2026-11-14 (Asia/Ho_Chi_Minh; chỉ xác định ngày, không tự tạo giờ ký).
Nhánh: `test/p0-6-fc-audit-20261114`
Nguồn quyết định: thông điệp trực tiếp của chủ dự án trong cuộc trò chuyện F-C: **"Yêu cầu hoàn thiện FC-01/FC-02 trước khi đóng P0. Hãy lập biên bản quyết định và cập nhật checkpoint trên nhánh F-C; không tự ký duyệt hoặc phát hành."**
Mã quyết định nội bộ để tham chiếu: `FC-OWNER-DIRECTION-20261114-01` (mã hồ sơ kỹ thuật do dự án đặt, KHÔNG phải chữ ký/xác thực danh tính).
Phân loại: `REQUEST_CORRECTION_BEFORE_P0_CLOSURE`.
Trạng thái: `OWNER_DECISION_RECORDED_CLOSURE_WITHHELD`.
`RELEASE_READY=false`.

## Nội dung quyết định và phạm vi hiệu lực
1. Chủ dự án **không chấp thuận đóng P0.6 ở bước này**; hoàn thiện FC-01 và FC-02 trước khi lập lại hồ sơ trình ký đóng P0.
2. Cho phép ghi chép, đối chiếu và hoàn thiện minh chứng trên nhánh kiểm toán F-C; không tự tạo chữ ký P0, không thay quyền phát hành.
3. Không thay đổi các quyết định G7/G8 TEST đã được ghi ngày 2026-11-13, không mở rộng chúng thành phê duyệt production.
4. Không sửa `main`, `test-theo-main`, Web App TEST Version 6; không ghi dữ liệu học sinh, điểm hoặc sao; không deploy, merge hay thay `RELEASE_READY`.
5. Các cổng kỹ thuật A–F đã PASS giữ nguyên bằng chứng; không chạy lại chỉ vì có quyết định hồ sơ mới.

## FC-01: Đối chiếu bản cũ và quyết định mới
- Văn bản lịch sử `thu-nghiem/p0-6/PHIEU_TRINH_KY_CHINH_SACH_E0_TOAN_20261113.md` có `OWNER_SIGNOFF_PENDING`: phản ánh **thời điểm soạn phiếu trước khi chủ dự án quyết định**, không phải bản ghi từ chối G8.
- `final-acceptance/FA_POLICY_SIGNOFF_PACKET.md` là gói đề nghị và lưu P01–P06 `PENDING_APPROVAL` tại thời điểm đề nghị.
- `final-acceptance/FA_OWNER_APPROVAL_G7_G8_20261113.md` ghi rõ thông điệp "tôi ký duyệt G7/ G8", timestamp ghi nhận `2026-11-13T22:19:13.111+07:00`, chính sách E.0 P01–P06 được chấp nhận **chỉ cho TEST có điều kiện**.
- `final-acceptance/FA_DECISION_REGISTER.md` ghi P01–P06 `OWNER_APPROVED_TEST_SCOPE`; `FA_CURRENT_STATE.json` ghi policyE0/B21Pedagogy/G7/G8 phê duyệt TEST.
- Quy tắc hiệu lực: **decision mới có phạm vi hẹp và thời điểm muộn hơn chi phối TEST**, nhưng **không sửa hồi tố** trạng thái của phiếu trình ký lịch sử; không tự cấp quyền bài mới hoặc production.
- Kết quả FC-01: `DOCUMENTARY_RECONCILED_FOR_TEST`, không phải `PRODUCTION_APPROVED`. Ghi chú bù trừ bằng phụ lục độc lập; văn bản cũ không bị ghi đè.

## FC-02: Danh mục trường và độ tin cậy bằng chứng
| Trường | Chứng cứ đang có | Kết luận |
|---|---|---|
| policyId | `LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1` trong bản ghi G8 | KNOWN_POLICY_REFERENCE (tài liệu nguồn có tên candidate V1.0) |
| policyVersion | Đặc tả nguồn mã `...V1.0-CANDIDATE` và bản ghi G8 `...V1` | NEEDS_EXPLICIT_CANONICAL_VERSION_SELECTION |
| policyGitBlobSha | `69c07906f621b1ad91eba184a595544fe3b6d87c` (Git blob của đặc tả nguồn tại checkpoint F-C trước quyết định) | KNOWN_IMMUTABLE_GIT_OBJECT |
| policySha256 | Không có SHA-256 của toàn bộ bytes đặc tả nguồn được kiểm và đóng dấu trong hồ sơ phê duyệt | PENDING_VALIDATED_SHA256; **không** dùng Git blob SHA-1 hoặc hash policy ứng viên B21 thay thế |
| decision | G8 `OWNER_APPROVED_TEST_SCOPE_CONDITIONAL_ON_G5` (F-A); F-C hiện `REQUEST_CORRECTION_BEFORE_P0_CLOSURE` | TWO DISTINCT DECISIONS; both recorded |
| scope | Chính sách E.0 P01–P06 và B21 G7/G8 TEST preview riêng | TEST_ONLY; V6/production excluded |
| conditions | G5 browser PASS, không quyền học sinh, không phê duyệt tự động các bài mới, nguồn B21 INDEX_VERIFIED | DOCUMENTED |
| reviewerRef | `PROJECT_OWNER_EXPLICIT_CHAT_APPROVAL_2026-11-13_G7_G8` | CHAT-PROVENANCE_ONLY; NOT identity/cryptographic proof |
| reviewedAt | `2026-11-13T22:19:13.111+07:00` là **thời điểm hồ sơ ghi nhận**, chưa có chứng nhận thời điểm ký độc lập | RECORDED_AT_KNOWN; INDEPENDENT_REVIEWED_AT_PENDING |
| evidenceRef | `FA_OWNER_APPROVAL_G7_G8_20261113.md`, `FA_POLICY_SIGNOFF_PACKET.md`, `FA_DECISION_REGISTER.md`, G5 run `43453411019` | LINKED |
| P0 closure signature | Không có quyết định đồng ý đóng P0 | NOT_SIGNED / BLOCKED |

### Quy tắc chốt FC-02
Khi chuẩn hóa `policySha256`, phải hash **raw bytes tại đúng commit** và lưu bằng chứng tính toán (công cụ, repo, path, commit, Git blob, hash), đối chiếu với bản nguồn. Trường `reviewedAt` không được tự sao chép từ `recordedAt` như thể có chứng thực độc lập. Nếu đóng P0 chỉ giới hạn TEST, người ký phải xác nhận có chấp thuận cách dùng bằng chứng chat-provenance và các ngoại lệ về chứng thực hay không; F-C không tự phán quyết.
**Kết quả FC-02:** `EVIDENCE_FIELDS_MAPPED_SIGNOFF_PENDING`. Không tuyên bố hoàn thiện một bản ký số bất biến khi thiếu trường.

## Trạng thái các cổng sau quyết định
- FC-01: `DOCUMENTARY_RECONCILED_FOR_TEST`.
- FC-02: `PENDING_FORMAL_ATTESTATION`.
- FC-06: `CLOSURE_WITHHELD_BY_OWNER`.
- A–F: `INHERITED_TECHNICAL_PASS_IN_PREVIOUS_TEST_SCOPES`.
- P0.6 close: `BLOCKED_PENDING_DOCUMENT_COMPLETION_AND_OWNER_SIGNOFF`.
- `RELEASE_READY=false`.
- V6 deployment or live rollback: `NOT_APPLICABLE_TO_ISOLATED_TEST`, and `BLOCKED_FOR_RELEASE`.

## Hướng xử lý tiếp theo, không mở chức năng P0
1. Chuẩn hóa version/hash đặc tả E.0 bằng chứng nguồn bất biến; chỉ ghi trường đã tính xác minh.
2. Lập phụ lục xác minh chính sách và thời gian/nguồn quyết định, có phân biệt `recordedAt` và `reviewedAt`.
3. Đối chiếu đủ các trường FC-02; mọi khoảng trống về xác thực người ký vẫn để PENDING hoặc báo cáo ngoại lệ cần chủ dự án quyết định.
4. Trình lại chủ dự án phiếu đóng P0 với trạng thái thực tế, không tự ký.

## Recovery
Kiểm tra HEAD nhánh F-C và SHA của tệp biên bản này, biên bản kiểm toán tổng hợp và `FC_CURRENT_STATE.json`. Khi gián đoạn giữa các commit, đọc lại các file và so sánh HEAD; không tạo lại quyết định trùng lặp. Bảo toàn nhánh F-B.3 nguồn `f60eb781df402df3373c4c0f5987087ab01a5764`.
