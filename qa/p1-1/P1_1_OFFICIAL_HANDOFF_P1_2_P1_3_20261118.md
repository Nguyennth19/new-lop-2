# P1.1 — BÀN GIAO SOURCE ROUTING CHÍNH THỨC CHO P1.2 / P1.3

**Trạng thái:** `OFFICIAL_SOURCE_ROUTING_SCOPE_ONLY` — lựa chọn nguồn đã được chủ dự án xác nhận trong cuộc trò chuyện ngày 18/11/2026.

**Nguồn phải đọc đầu mỗi phiên:** [`P1_1_OFFICIAL_SOURCE_ROUTING_19.json`](P1_1_OFFICIAL_SOURCE_ROUTING_19.json). Mốc pin ban đầu: `8719e1af93346b5767c6cb76054aff4bbe69b89d`, Git blob `1930790369530aecd4b95ab0ce793dd8d87c6477`. [Biên bản owner](P1_1_OWNER_APPROVAL_RECEIPT_OFFICIAL_20261118.md).

## Nguyên tắc sử dụng

1. Không phát minh dữ liệu nguồn đã có. Nạp đúng SHA/Drive file ID được khóa cho từng phân hệ; ưu tiên immutable Git refs và `owner scope` hơn HEAD theo ngày.
2. 15 KEEP bảo lưu kết quả đã PASS, 4 thay chỉ tác động scope được phê duyệt; không tự gộp hai version thành một.
3. Khả năng kiểm từng nguồn SGK, quyền renderer và tài nguyên, thử mạng GAS/thiết bị, quyền điểm/sao/phát hành phải kiểm riêng. P1.1 không phải giấy phép release.
4. Dữ liệu học sinh, nguồn answer/private, Apps Script MAIN và các tab 90/91/92 không được sửa trong quy trình build source.

## P1.2 — LessonPackage B001–B024

- Input JSON hiện hữu: [`manifest.B001-B024.json`](https://github.com/Nguyennth19/new-lop-2/blob/test/p0-b01-b24-lessonpackage-v1-20261117/du-lieu/bai-hoc/toan/v1/manifest.B001-B024.json) tại SHA `c1bd73e5f8606b38ed4497d3b7f23c77a2b93ad9`; **24 JSON**, **536 C1 candidates**, **96 G2 technical**, **0 publicVariant**, **0 playable**.
- V8/Consolidated/C1 và C4 là nguồn riêng: V8 source registry candidate; C1 envelopes owner-approved scope; C4 27 DEV exercises. Không cộng G2 vào 1.406 khi chưa crosswalk ngữ nghĩa/ID.
- Renderer 12 route: `G7_4_RENDERER_MANIFEST_12`, không tạo renderer mới chỉ để khớp nguồn; mapping cần `lessonId`, `skillId`, `questionType`, `visualIntent`, `assetId` hoặc semantic mapping được kiểm, và `publicVariant`.
- G3-B thay G3-A là **mã grading TEST** cho hợp đồng public/private; không đưa answerSpec/answer/solutionPrompt lên browser; GAS thật vẫn chưa nghiệm thu. D10 trusted server riêng.
- D5/D9 E04, source-exact từng bài, kỹ năng, chính sách D2=1000 và renderer grant tiếp tục fail closed.

## P1.3 — PNG nguồn và nhân vật

- Kho PNG nguồn Drive: [KIDLEARN_ASSET_LIBRARY](https://drive.google.com/drive/folders/1IEIvmL_DmV9M1YxuWuBtvNeahilByl0x); số liệu kiểm kê lịch sử **288 PNG master**, GitHub mirrored **24**, còn **264**.
- Bộ WebP runtime **288/288** và nhãn **288/288** đã PASS riêng; 46 SVG Fluent staged và 30 WebP nhân vật có scope khác.
- Kiểm byte SHA-256 từng PNG gốc cùng file ID Drive, đường dẫn đích GitHub, asset ID, dimension và mapping; QA nhân vật riêng; giữ nguồn nguyên bản, không thay PNG master bằng 288 WebP hoặc source sheet composite.
- Gắn quyền exact-count theo ngữ nghĩa và hình thật; không suy rằng một hình minh họa đồng nghĩa một đơn vị đếm.

## 4 nguồn thay trong phạm vi P1

1. **G3A_TRUSTED_GRADING_CODE**: [nguồn P1](https://github.com/Nguyennth19/new-lop-2/tree/test/data-b-g3b-b20-trusted-gas-e2e-20261117) — `G3B_TEST_CODE_ONLY`. Nguồn lịch sử: [giữ lại](https://github.com/Nguyennth19/new-lop-2/tree/test/data-b-g3a-trusted-gas-adapter-20261117).
2. **B024_ALPHA**: [nguồn P1](https://github.com/Nguyennth19/new-lop-2/blob/test/p0-b01-b24-lessonpackage-v1-20261117/du-lieu/bai-hoc/toan/v1/B024.lesson.json) — `P1_2_WORKING_PACKAGE_TEST_ONLY`. Nguồn lịch sử: [giữ lại](https://drive.google.com/file/d/1INMFN1grCl7upyiVoing9ErRq2kn9DTQ/view).
3. **DATA_CONTRACT_V2**: [nguồn P1](https://github.com/Nguyennth19/new-lop-2/blob/test/p0-b01-b24-lessonpackage-v1-20261117/du-lieu/bai-hoc/toan/v1/lessonpackage.schema.v1.json) — `P1_2_SCHEMA_TEST_ONLY`. Nguồn lịch sử: [giữ lại](https://drive.google.com/file/d/1IjQMGHPUC-JiirpYeHT_0kbiISWZAiqc/view).
4. **PROJECT_RULES_GLOBAL**: [nguồn P1](https://github.com/Nguyennth19/new-lop-2/blob/be-hoc/AGENTS.md) — `DEV_GUIDANCE_ACTIVE_NOT_POLICY_ADOPTION`. Nguồn lịch sử: [giữ lại](https://github.com/Nguyennth19/new-lop-2/tree/audit/g7-6-workflow-rules-consolidation-review-20261116).

## Kiểm thử và rollback

- QA kỹ thuật nguồn: 19/19 ID/SHA được kiểm, 15/4 đối chiếu; đọc lại JSON và receipt GitHub.
- QA sư phạm/học liệu: chỉ chuyển từ candidate sang source-exact khi có bằng chứng bản in, bài/trang, bài con, hình, đáp án và reviewer tương ứng; source status không bị P1.1 tự nâng.
- Rollback tổng thể: không nhập routing mới vào P1 consumer; quay về ledger P1.1 frozen `bf3d2adf90aa2594ac7a5b407218c36a028bc9ea`, không chỉnh Apps Script hoặc dữ liệu học sinh.

**Tiêu chí P1.1 đóng:** `OWNER_APPROVED_SOURCE_ROUTING_19=PASS`; `P1_2_CONTENT_SOURCE_EXACT=OPEN`; `P1_3_PNG_HASH_288=OPEN`; `ACTUAL_GAS_E2E=OPEN`; `STUDENT_RELEASE=NO_GO`.
