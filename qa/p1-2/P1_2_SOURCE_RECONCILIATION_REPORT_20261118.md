# P1.2 — B001–B024: báo cáo nguồn, ứng viên và renderer

**Ngày:** 18/11/2026 · **Nhánh:** `test/p1-2-b001-b024-layered-lesson-packages-20261118`
**Trạng thái:** `STRUCTURAL_DATA_LAYER_AND_CROSSWALK_PASS_CONTENT_APPROVAL_PENDING`. Không triển khai GAS, không sửa MAIN/Sheets/Drive/dữ liệu học sinh.

## Mốc nguồn kế thừa

- P1.1 chính thức: `P1_1_OFFICIAL_SOURCE_ROUTING_19@6a05a042bd614f22450ec74e99f5e65aecee3399` (blob `1930790369530aecd4b95ab0ce793dd8d87c6477`).
- 24 JSON V1 bất biến: `test/p0-b01-b24-lessonpackage-v1-20261117@c1bd73e5f8606b38ed4497d3b7f23c77a2b93ad9`.
- G7.6 registry 12 renderer chính thức trong phạm vi TEST: manifest blob `27c6db04ce514c83d2b72f4068f20df8917e45ff`.

## Kết quả kỹ thuật

| Thành phần | Đối soát | Hạn chế |
|---|---:|---|
| Lesson JSON V2 | 24/24 | Chỉ cấu trúc và nguồn ứng viên |
| C1 source candidates | 536/536 | Chưa được ký source-exact |
| G2 technical review candidates | 96/96 | Chưa có chữ ký reviewer độc lập |
| Rule-based template candidates | 17/17 | 0 publicVariant |
| DROP khỏi variant pool | 7/7 | Vẫn giữ nguồn gốc |
| Renderer candidate ID khớp registry nguyên tên | 72 | Chỉ khớp tên, chưa được cấp phép theo ngữ nghĩa |
| Renderer candidate không có exact route | 34 | Cần đối chiếu alias/hợp đồng |
| Candidate không có renderer name | 7 | Không được tự đoán |
| Public variants / student playable | 0 / 0 | NO-GO |
| Generator byte-for-byte | 24/24 PASS | Source V1 được giữ nguyên |
| QA negative | 9/9 PASS | Chặn public answer, auto-join, giả signoff, giả grant |
| Crosswalk | 536+96+17+7 PASS | Không tự ghép C1/G2 |

CI PASS [run 44246041439](https://github.com/Nguyennth19/new-lop-2/actions/runs/44246041439) tại SHA `e647e02c7e529ede0a7c14e35e0aa11b35dc0e56`. Log xác minh 24/24 sinh lại giống hệt, tất cả test và 9 negative fixtures PASS. **Không phải** kiểm thử chính xác SGK, GAS E2E hoặc phê duyệt phát hành.

## Ma trận 24 bài

| # | lessonId | C1 | G2 | Template | PublicVariant |
|---:|---|---:|---:|---:|---:|
| 1 | MATH_B001 | 24 | 12 | 3 | 0 |
| 2 | MATH_B002 | 16 | 0 | 0 | 0 |
| 3 | MATH_B003 | 23 | 0 | 0 | 0 |
| 4 | MATH_B004 | 16 | 0 | 0 | 0 |
| 5 | MATH_B005 | 30 | 0 | 0 | 0 |
| 6 | MATH_B006 | 18 | 0 | 0 | 0 |
| 7 | MATH_B007 | 40 | 0 | 0 | 0 |
| 8 | MATH_B008 | 16 | 0 | 0 | 0 |
| 9 | MATH_B009 | 12 | 0 | 0 | 0 |
| 10 | MATH_B010 | 14 | 8 | 1 | 0 |
| 11 | MATH_B011 | 46 | 0 | 0 | 0 |
| 12 | MATH_B012 | 16 | 0 | 0 | 0 |
| 13 | MATH_B013 | 10 | 0 | 0 | 0 |
| 14 | MATH_B014 | 26 | 0 | 0 | 0 |
| 15 | MATH_B015 | 19 | 0 | 0 | 0 |
| 16 | MATH_B016 | 16 | 0 | 0 | 0 |
| 17 | MATH_B017 | 15 | 0 | 0 | 0 |
| 18 | MATH_B018 | 8 | 0 | 0 | 0 |
| 19 | MATH_B019 | 24 | 12 | 2 | 0 |
| 20 | MATH_B020 | 33 | 16 | 3 | 0 |
| 21 | MATH_B021 | 19 | 0 | 0 | 0 |
| 22 | MATH_B022 | 34 | 17 | 3 | 0 |
| 23 | MATH_B023 | 42 | 21 | 5 | 0 |
| 24 | MATH_B024 | 19 | 10 | 0 | 0 |

## Bảo toàn kho đã nghiệm thu

- C1 đã được chủ dự án nghiệm thu 75 lesson/1.406 envelope trong **phạm vi C1**; 536 ứng viên thuộc 24 bài được bảo toàn, không tái tạo.
- C4 có 27 câu DEV thực, 24 B001 và 3 B002, 121 parts, kiểm thử riêng; chưa chuyển answer/rubric vào student payload. Đây là đầu vào ưu tiên của P1.2-B.
- B20 sư phạm H2 30 câu và B20 legacy 51 câu vẫn là hai track độc lập với C1 33 source candidates và G2 16 candidates của B020; không cộng dồn hoặc đồng nhất ID.
- G3B là grading TEST bảo mật, chưa có actual GAS E2E cho 24 gói V2; không lộ answer/solution/rubric ở client.
- G7.4: 288/288 nhãn WebP đã được duyệt; count-safe và semantic mapping từng cảnh chưa tự được duyệt, 264 PNG master còn thuộc P1.3.

## Tác vụ chưa hoàn tất của P1.2

1. **P1.2-B — Source hydration:** đọc SGK/VBT đúng bản và trang, đối chiếu từng `originExerciseId`, lời đề, phần/ô, đơn vị và hình; bổ sung prompt/parts/answer *chỉ sau nguồn đã kiểm*. Trước tiên B001–B004 và tận dụng C4 27 DEV.
2. **P1.2-C — Semantic contract:** đối chiếu `lessonId`, `skillId`, `questionType`, `visualIntent`, `assetId` hoặc semantic mapping, `countUnit`, chính sách renderer/E04; 72 exact route chỉ là candidate, xử lý 34 alias và 7 trống.
3. **P1.2-D — Student-ready gate:** sinh biến thể có seed từ nội dung đã duyệt, giữ đáp án/rubric trên trusted server, kiểm thử GAS thực và nghiệm thu sư phạm trước khi cấp publicVariant.

## Hồ sơ và rollback

- [24 gói và SHA](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/du-lieu/bai-hoc/toan/v2/manifest.B001-B024.layered.v2.json)
- [Schema V2](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/du-lieu/bai-hoc/toan/v2/lessonpackage.layered.schema.v2.json)
- [Generator deterministic](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/qa/p1-2/build_layered_packages.cjs)
- [Validator / 9 negative cases](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/qa/p1-2/test_layered_packages.cjs)
- [Crosswalk B001–B012](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/qa/p1-2/P1_2_CROSSWALK_B001_B012.review.v1.json)
- [Crosswalk B013–B024](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/qa/p1-2/P1_2_CROSSWALK_B013_B024.review.v1.json)
- [Checkpoint máy](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b001-b024-layered-lesson-packages-20261118/qa/p1-2/P1_2_QA_CHECKPOINT_20261118.json)

**Rollback:** bỏ nhánh TEST P1.2, dùng V1 pin `c1bd73e5f8606b38ed4497d3b7f23c77a2b93ad9`. Không có nguồn gốc/dữ liệu học sinh/MAIN/GAS được sửa.

**Kết luận:** `P1_2_24_LAYERED_STRUCTURAL_PASS · SOURCE_EXACT_PENDING · PUBLIC_VARIANT_0 · STUDENT_RELEASE_NO_GO`.
