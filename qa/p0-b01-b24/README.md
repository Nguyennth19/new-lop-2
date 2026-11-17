# B001–B024 · LessonPackage JSON V1

**Lập ngày 17/11/2026. Chỉ dùng trên nhánh TEST.** Không chạm MAIN, `be-hoc`, `test-theo-main`, GAS hoặc dữ liệu học sinh.

## Đầu ra đã tạo

- 24 JSON tại [`du-lieu/bai-hoc/toan/v1`](https://github.com/Nguyennth19/new-lop-2/tree/test/p0-b01-b24-lessonpackage-v1-20261117/du-lieu/bai-hoc/toan/v1), mỗi bài B001–B024 một file, kèm `manifest.B001-B024.json`.
- [Google Sheets tab 20](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910120): **chỉ mục 24 dòng** + URL bất biến tới commit chứa JSON và tổng hợp bằng công thức.
- [Nguồn C1](https://docs.google.com/spreadsheets/d/1GPChHRV4sZ4ZplgJmIIkcIFeERLIjUruoY-s3H7_TVM/edit) được đóng băng thành `inputs/source-index.v1.json`: 536 bản ghi candidate, 536 C1 envelope, 24 bài.
- [G2 source QA](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910110): 96 bản ghi kỹ thuật, 25 quyết định ở [tab 19](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910119).

**Không cộng 536 + 96 thành 632 bài tập độc lập.** C1 (hệ ID `L1/H1`) khác G2 (hệ ID `LT01/HD`), không có ID trùng tuyệt đối và chưa được ký crosswalk. Mỗi LessonPackage chứa `questions[]` là candidate C1 và `technicalReviewCandidates[]` là hồ sơ G2 riêng.

## Quy định chung được mã hóa

Mỗi record đều mang **nguồn gốc, bài, cấp, seed ổn định, lesson skill candidate, question type, visualIntent, assetId, semanticMapping, rendererCandidate, publicVariant và approval**. Trường thiếu bằng chứng để `null` (không tự đoán). `seed` dùng FNV1a 32-bit ổn định, **không phải khóa bí mật**, chưa phát sinh publicVariant.

25 case: **11 KEEP_VARIANT + 7 KEEP_STRUCTURAL + 7 DROP**, có một trùng C01/V03. `variantPool.candidates` có **17 ID duy nhất**, chỉ phục vụ TEMPLATE TEST, `playable=false`. Bảy case DROP bị loại khỏi pool; lịch sử nguồn vẫn giữ nguyên. Bài bù chỉ chọn từ pool đã duyệt cùng `lessonId`/`skillId`, không tự bịa câu.

C1 hiện thiếu prompt/part/slot/validator độc lập; 536 candidate đều không được chấm hay đưa cho học sinh. Skill C1 riêng từng câu không có => `skillId=null`, `lessonSkillCandidate` là chỉ mục bài, **không phải phê duyệt kỹ năng câu**. B017 có cảnh báo tiêu đề lệch bản SGK chính; không tự sửa tiêu đề nguồn.

## Tái dựng và nghiệm thu

```bash
node scripts/lessonpackage/build_b001_b024.cjs --write
node scripts/lessonpackage/build_b001_b024.cjs --check
node qa/p0-b01-b24/test_lessonpackages.cjs --write-report
```

Builder không truy cập Internet, chỉ dùng snapshot và 25 decision manifest. CI kiểm đúng 24 package, 536 C1, 96 G2, 25 rule, 17 template, 7 drop, publicVariant không chứa đáp án; ghi commit build **chỉ trên nhánh TEST**. `main`, GAS, Sheet SOURCE, điểm/sao và kho hình không thay đổi.

**Gate:** `PACKAGE_INDEX_PASS` có nghĩa là đủ JSON có cấu trúc và truy vết; **không** có nghĩa `SOURCE_SIGNED`, `PEDAGOGY_APPROVED`, `RENDERER_GRANTED`, `GAS_TEST_VERIFIED` hoặc `RELEASE_GO`. Để kích hoạt bài thật: bổ sung prompt/dữ kiện/slot có bằng chứng, đăng ký skill, typed semantic parameters, renderer/publicVariant và trusted grading được duyệt riêng. Rollback: quay lại `test/p0-g2b-variant-adaptation-20261117@a00a7f348db566bc024ff7ba42d874fe5d6c018a`.

## Formal schema & QA 102/102

- [LessonPackage V1 JSON Schema](https://github.com/Nguyennth19/new-lop-2/blob/test/p0-b01-b24-lessonpackage-v1-20261117/du-lieu/bai-hoc/toan/v1/lessonpackage.schema.v1.json): kiểu dữ liệu và bắt buộc gate fail-closed.
- [CI 102/102 PASS](https://github.com/Nguyennth19/new-lop-2/actions/runs/44103551700), kiểm thử đầy đủ 24 JSON cùng schema, không triển khai GAS.
- [QA result on GitHub](https://github.com/Nguyennth19/new-lop-2/blob/test/p0-b01-b24-lessonpackage-v1-20261117/qa/p0-b01-b24/TEST_RESULTS.json).
