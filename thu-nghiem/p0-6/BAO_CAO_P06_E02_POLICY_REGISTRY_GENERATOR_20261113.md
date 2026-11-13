# P0.6-E.0.2 — Biên bản Lesson Variant Policy Registry & Generator Contract
**Ngày:** 13/11/2026, Asia/Ho_Chi_Minh
**Nhánh:** `test/p0-6-e02-policy-registry-generator-20261113`
**Trạng thái:** `E02_OFFLINE_IMPLEMENTATION_PASS / OWNER_POLICY_SIGNOFF_PENDING`
**Nguồn:** P0.6-E.0, E.0.1, P0.6-A–E. TEST-only; MAIN, test-theo-main, Apps Script TEST Version 6, JSON H.1 Bài 20, tiến độ và sao không thay đổi.

## 1. Mục tiêu và thành phần
- `variant-policy-registry-v1.cjs`: Policy Registry theo `lessonId`, allowlist môn Toán, digest SHA-256 khớp chính sách versioned. Không tải chính sách từ đường dẫn người dùng; từ chối source ref lạ, bài lạ, sai digest và policy mismatch. Bản đọc là snapshot bất biến.
- `math-variant-generator-v1.cjs`: Generator Contract sinh **V1 số học** và **V2 số học → chọn đáp án** theo template allowlist; sinh `seed` cố định / chế độ tham số đầu vào, giới hạn 1–12 câu, bảo toàn skill, type, answer proof, source, grade, lessonId, session và ID. V3/hình học chưa có proof/asset phải BLOCKED hoặc chuyển review, không tự sinh thành câu chấm.
- `policy-generator-fixtures-v1.cjs`: B21 registry và template được cắm qua loader TEST; chính sách gốc khóa SHA-256 `fc0af7c369cc60761e2e6b3fba94128e327823fd00f6c99583473a02db43f64d`, `status=DRAFT_OWNER_SIGNOFF_PENDING`.
- `kiem-thu-policy-generator-v1.cjs`: 26 ca kiểm registry, hash, biến thể deterministic, vượt phạm vi số, không nhớ, sai skill, V3, nguồn bị chỉnh sửa, sai đáp án, hình cần Count-Safe, tương tác đổi độ khó, QA, quyền ghi, bất biến dữ liệu nguồn.
- `xuat-bien-nhan-generator-v1.cjs`: biên nhận SHA nguồn, SHA policy, SHA kiểm định G0–G8 cho ba biến thể auto, không chứa dữ liệu học sinh.
- `.github/workflows/p0-6-e02-policy-generator.yml`: CI chạy E.0.2 + E.0.1 + E + D + C + B + A, P0.4 FULL_SAFE, hồi quy B20, test Release Gate vẫn khóa và không có tracked writes.

## 2. Hợp đồng generator và quy tắc
- **Dữ liệu đầu vào**: `lessonId`, `templateId`, `seed`, `count` (1–12), tương tác `NUMBER_INPUT` hoặc `CHOICE`, tùy chọn `candidates` để tiêm tập số cụ thể khi QA. Không cấp quyền duyệt qua tham số caller.
- **Nguồn phạm vi**: Policy Registry `lessonId → versioned policy`. B21 chỉ cho `ADD_CARRY_REVIEW`, phép `ADD`, số hạng 1–99, tổng 0–100, yêu cầu cộng có nhớ. Thuật toán auto chọn cặp hợp giới hạn, có ít nhất số hạng đầu hai chữ số.
- **Bộ dựng**: không lấy ảnh từ SGK; template ghi `requiredAssetRole` (NONE, DECORATIVE, COUNTABLE...). B21 hiện là NONE. COUNTABLE bắt buộc có scene/Count-Safe QA; chưa đủ chứng cứ → BLOCKED, không ghép ảnh ngẫu nhiên.
- **Đáp án**: luôn `PROJECT_DERIVED`, `answerSpec.proof` từ tham số; không gán nguồn đáp án là sách. QA E.0.1 chạy **từng ứng viên**. Nếu G0/G1/G4 FAIL hoặc thiếu điều kiện cấu trúc, ứng viên bị từ chối.
- **Chấm/duyệt**: generator trả `CANDIDATES_PENDING_APPROVAL`, không tự đổi `pedagogyApproval.status`, không nâng `policy.status`, không tạo hoặc phát điểm/sao. Bài chưa có renderer tương tác và chủ dự án chưa ký, receipt `BLOCKED`.
- **Bất biến số lượng**: không ép cấu trúc 30 câu/6 lượt của B20 sang các bài khác. Thử sinh B21 mỗi câu trong lesson một-câu riêng; P0.6-E.0.3 nếu cần nên thêm composition multi-session theo lesson manifest chứ không nhồi vào app.

## 3. QA thực tế
- Run: https://github.com/Nguyennth19/new-lop-2/actions/runs/43438451071
- Commit chạy CI: `cde0b55547979f1e60a430d06e7aeb165a17957d`
- Kết quả **SUCCESS**: E02 26/26, E01 37/37, E, D, C, B, A, P0.4 FULL_SAFE, B20 regression, Release Gate fail-closed, no tracked writes.
- Xuất ba bản ghi `SEEDED_AUTO`: `VAR_TOAN_B21_G_f480480254d9` (73), `VAR_TOAN_B21_G_e1803c1413a1` (74), `VAR_TOAN_B21_G_9571e97d23fb` (75).
- Hash receipt lần lượt: `9d25d5064c51b65b291fc60dcb868c3d29282b4dbcca2305eb5429665a98d429`; `f89c1cfff75cf900d40e56b37266cdec5678b96bcb94cfb75ae24f5ab4e22ee6`; `4be03db913744a2049b2e3b6eb0050a6567dce1fb1b1afaab2ecc7429506f74e`.
- G0, G1, G2, G4, G6 **PASS**; G3 **NOT_APPLICABLE**; G5 **BLOCKED** (renderer readonly), G7/G8 **PENDING**. **Tổng vẫn BLOCKED**, đúng fail-closed. Không coi ba câu là nội dung đã được ký duyệt.

## 4. Giới hạn chưa đạt
- Registry hiện mới cài thực tế **một** policy B21 đã khóa hash; **B24/B26 chưa được đăng ký**. Có thể bổ sung cùng contract sau khi có policy và QA riêng; không tự giả định mọi bài Toán giống B21.
- Generator hiện có phép cộng/trừ và chain ở mức hợp đồng, nhưng AUTO chỉ hỗ trợ tạo **cặp** cho ADD/SUBTRACT. B24 chain cần template, proof/range và duyệt riêng; B26 SVG topology luôn giữ cổng review.
- V2 `CHOICE` mới là hợp đồng chứa phương án lựa chọn/đáp án và G4 test; **renderer UI tương tác chưa được tích hợp**.
- G3 COUNTABLE chưa render hình thật hoặc nghiệm thu pixel; kiểm G7/G8 mới là kiểm hình thức evidence references, không xác thực danh tính người duyệt hay chữ ký số. Các bài cần hình dữ kiện phải qua G7.4 Count-Safe và QA trên màn hình.
- Policy E.0 đặc tả chưa được chủ dự án ký. `PASS_FOR_TEST` trong fixture không phải quyền phát hành production.
- Không đọc/chỉnh source SGK/SBT hay bài B20 trong bước E02. B21 giới hạn dựa ma trận đã đối chiếu trước đó, không phải nghiệm thu SGK trang gốc.

## 5. Quyết định và rollback
`E02_OFFLINE_IMPLEMENTATION=PASS`; `B21_GENERATED_CONTENT=BLOCKED_PENDING_APPROVAL_AND_RENDERER`; `OWNER_POLICY_SIGNOFF=PENDING`; `P03_QA_TEST_APPROVED=NO`; `RELEASE_READY=false`.
Rollback chỉ revert các file E02 mới trên `test/p0-6-e02-policy-registry-generator-20261113`, hoặc dùng mốc `test/p0-6-e01-math-variant-validator-20261113`. Không rollback Web App V6 vì chưa deploy.

## 6. Bước tiếp theo
P0.6-E.0.3: Composition/Generation manifest cho nhiều skill/family và session cấu hình; sau khi chủ dự án duyệt E.0, đưa policy đã ký sang nhánh TEST staging, bổ sung policy B24/B26 theo phạm vi từng bài và mở G7.4 Asset Resolver thực tế từng dạng. E.1 theo **phạm vi kiến thức/biến thể**, không đòi sao y hình câu SGK.
