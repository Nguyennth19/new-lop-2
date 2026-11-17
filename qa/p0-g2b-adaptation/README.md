# P0 / G2-B — Bảng chuyển đổi 25 case + tự nhận diện bài tương tự

**Ngày:** 17/11/2026 · **Nhánh:** `test/p0-g2b-variant-adaptation-20261117` · **Trạng thái:** TEST/REVIEW ONLY, **không phát hành**.

## Quyết định chuyển đổi đã nhận từ chủ dự án

Chấp nhận nội dung nguồn SGK/VBT đúng nguyên văn, nhưng hình minh họa có thể được biến thể hóa hoặc chuyển sang vector nếu bảo toàn **phép toán, số lượng, đơn vị, quan hệ, kỹ năng và quy tắc chấm**. Nguồn G1 sai được giữ lịch sử, **không dùng làm source tạo bài**. Chỉ dùng ảnh trích trong gói reviewer riêng tư; tuyệt đối không đăng PDF/PNG SGK lên GitHub công khai.

**Phân loại:** 11 KEEP_VARIANT · 7 KEEP_STRUCTURAL · 7 DROP = 25 case / 24 unique exerciseIds (C01 và V03 là cùng bài bảng số). Không xóa dữ liệu lịch sử; `DROP` nghĩa là loại khỏi **generator pool** của phiên học và bù bằng các bài phù hợp khác theo lessonId/skillId.

| Mã | exerciseId | Trạng thái | Family | Renderer/adapter ứng viên |
|---|---|---|---|---|
| C01 | SGK_B001_LT03_E04 | `KEEP_STRUCTURAL` | `GRID_100_2X2` | `VECTOR_GRID100` |
| C02 | SGK_B019_LT01_E03 | `KEEP_VARIANT` | `TWO_GROUP_COUNT_ADD` | `D9_E04_SIDECAR` |
| C03 | SGK_B019_LT01_E04 | `KEEP_STRUCTURAL` | `ADDITION_PYRAMID` | `VECTOR_PYRAMID` |
| C04 | SGK_B020_LT01_E05 | `KEEP_STRUCTURAL` | `POLYLINE_LENGTH` | `VECTOR_POLYLINE` |
| C05 | SGK_B022_HD_E03 | `KEEP_VARIANT` | `WORD_LESS_THAN` | `D10_GUIDED` |
| C06 | SGK_B022_LT02_E05 | `KEEP_VARIANT` | `WORD_LESS_THAN` | `D10_GUIDED` |
| C07 | SGK_B022_LT03_E04 | `KEEP_VARIANT` | `WORD_COMPLEMENT` | `D10_GUIDED` |
| C08 | SGK_B023_LT03_E03 | `KEEP_VARIANT` | `WORD_COMPLEMENT` | `D10_GUIDED` |
| C09 | SGK_B023_LT03_E05 | `KEEP_VARIANT` | `ONE_TO_ONE_ARITH_MATCH` | `D3_MATCHING` |
| C10 | SGK_B023_LT04_E04 | `KEEP_VARIANT` | `WORD_PART_WHOLE` | `D10_GUIDED` |
| V01 | SGK_B001_LT03_E01 | `KEEP_VARIANT` | `SYNTHETIC_EXACT_COUNT_TENS` | `D9_E04_COUNT` |
| V02 | SGK_B001_LT03_E02 | `KEEP_VARIANT` | `SYNTHETIC_EXACT_COUNT_TENS` | `D9_E04_COUNT` |
| V03 | SGK_B001_LT03_E04 | `KEEP_STRUCTURAL` | `GRID_100_2X2` | `VECTOR_GRID100` |
| V04 | SGK_B010_LT01_E02 | `KEEP_VARIANT` | `MANY_TO_ONE_OPTIONS` | `D4_MULTI_ITEM_SINGLE` |
| V05 | SGK_B010_LT01_E04 | `DROP` | `HIDDEN_3D_BLOCKS` | `NONE` |
| V06 | SGK_B010_GAME01_G01 | `DROP` | `BOARD_GAME_GRAPH` | `NONE` |
| V07 | SGK_B019_LT02_E05 | `DROP` | `MAZE_GRAPH` | `NONE` |
| V08 | SGK_B020_HD_E03 | `DROP` | `MATCHSTICK_TOPOLOGY` | `NONE` |
| V09 | SGK_B020_LT02_E03 | `KEEP_STRUCTURAL` | `POLYLINE_COMPARE` | `VECTOR_MULTIPATH` |
| V10 | SGK_B020_LT03_E02 | `KEEP_STRUCTURAL` | `NUMBER_LINE_STEP` | `VECTOR_NUMBER_LINE` |
| V11 | SGK_B022_LT01_E03 | `DROP` | `BRANCH_PATH` | `NONE` |
| V12 | SGK_B022_LT03_E05 | `DROP` | `MULTI_ROW_GRAPH` | `NONE` |
| V13 | SGK_B023_LT01_E05 | `KEEP_VARIANT` | `SUBTRACTION_COMPARE` | `D7_COMPARE` |
| V14 | SGK_B023_LT03_E02 | `KEEP_STRUCTURAL` | `COLUMN_MISSING_DIGITS` | `VECTOR_COLUMN_SLOTS` |
| V15 | VBT_B024_T02_E02 | `DROP` | `MULTIPAGE_STRING_PATH` | `NONE` |

## Hợp đồng điều phối tái sử dụng ngay ở mức TEST

Input tối thiểu của `89_P0_VariantRouter.html::classify`:

```json
{
  "lessonId": "MATH_B019",
  "originExerciseId": "SGK_B019_LT01_E03",
  "skillId": "ADDITION",
  "questionType": "counting",
  "semanticKind": "TWO_GROUP_COUNT_ADD",
  "visualIntent": "EXACT_COUNT",
  "semantic": {
    "groups": [
      {"id": "a", "label": "Cá", "quantity": 18},
      {"id": "b", "label": "Ngôi sao", "quantity": 5}
    ],
    "task": "TOTAL", "unit": "con", "seed": 1121
  },
  "publicVariant": {}
}
```

- **Không tự phân loại bằng từ khóa/cảnh minh họa.** Cần `lessonId`, `originExerciseId`, `skillId`, dạng bài, `semanticKind`, `visualIntent`, `semantic`, `publicVariant` typed. Trùng bài–trang nhưng sai lesson/skill bị DENY; 24 origin đã pin family, không được đổi nhãn `DROP` để lách chặn. Những bài khác có thể dùng family **chỉ nếu hợp đồng ngữ nghĩa đầy đủ đạt kiểm thử**; nếu không đủ dữ liệu -> DENY.
- **TEMPLATE_QA_PASS_ONLY**: khi các ràng buộc ngữ nghĩa được xác minh tự động (số lượng, ±1/±10, từng đoạn cm, many-to-one, phép trừ một bước...). Với bài chưa ký source exact, PASS chỉ cho **candidate/test**, không là `SOURCE_APPROVED` hay `RELEASE_PASS`.
- **Không đồng nhất bài SGK với bài biến thể**: giữ `originExerciseId` để truy nguồn và `variantId` riêng khi sinh biến thể; đánh dấu `isSourceExact=false` cho hình/đề mới. Biến thể mới phải giữ kỹ năng, không được gán nguyên văn SGK cho con cá/ngôi sao thay vỏ ốc.
- **Ranh giới renderer:** D3 ghép 1:1, do đó V04 nhiều–một phải dùng 5 câu D4 SINGLE riêng; D9 pictograph hiện chỉ có COUNT/COMPARE_DIFFERENCE, tổng hai nhóm C02 cần sidecar E04 hoặc D10 ghép, **không được báo D9 tổng đã chạy**; D2 Core có SUBTRACT nhưng host manual-carry B20 ADD-only, V14 cần VECTOR_COLUMN_SLOTS riêng (chưa tương tác/được chấm).
- **Hình đếm:** mọi EXACT_COUNT bắt buộc `countUnit`, n chính xác và đúng n vật thể được tạo. WebP đơn lẻ không chứng minh n; D9 mới tối đa 40 vật thể/nhóm. V01/V02 tạo **n riêng**, không gán n chưa kiểm của hình gốc.
- **Vector:** `90_P0_VectorStructural.html::renderSvg` dựng bản xem trước six semantic families, nhãn độ dài chi phối kết quả, không đo pixel. Chỉ `mountReviewPreview` khi container có `data-p0-review-preview="true"`; không đưa vào các lượt học chính hoặc giao diện học sinh.
- **Bảo mật:** client/publicVariant tuyệt đối không có answer, rubric, solutionPrompt, expected*, điểm/sao hoặc gradingKey; chấm server thật là cổng độc lập. Bộ điều phối 83 chỉ nhận candidate và trả `P0_PENDING_INDEPENDENT_SOURCE_REVIEW_AND_RENDERER_GATE`; không tự nâng quyền.

## Cơ chế PASS cho bài tương tự

| Cổng | Điều kiện | Kết quả |
|---|---|---|
| Family recognition | Typed semantic descriptor + lesson/skill/qType đúng | `TEMPLATE_QA_PASS_ONLY`, có thể dùng để preview/test |
| Exact count | n trong giới hạn, countUnit rõ, icon count chính xác | `TEMPLATE_QA_PASS_ONLY`, không mượn số nguồn chưa kiểm |
| Renderer core | D3/D4/D7/D9/D10/Vector compile/preview test tương thích | `CODE_CONTRACT_PASS` cho phạm vi cụ thể, không sinh tự động reward |
| Source independent review | Reviewer độc lập có ID, ngày, hash ảnh, part/slot signed | `SOURCE_APPROVED` chỉ khi hoàn tất hồ sơ |
| Special policy | E04 D5/D9, D2 mượn/nhớ, D10 trusted grading, C07–C12 | `POLICY_APPROVED` riêng từng skill/lesson/renderer |
| GAS TEST network | Quyền tester, no public keys, replay, no writes | `GAS_TEST_VERIFIED` khi có bằng chứng thật |
| Student release | Các cổng trước và QA UI/rollback/owner decision | `RELEASE_APPROVED` mới có thể GO |

**Quy định tự động:** QA của một family có thể được tái sử dụng cho bài tương tự khi hợp đồng và phiên bản renderer giống nhau. **Không tự thừa kế phê duyệt nguồn giáo khoa của bài khác**, không đổi `skillId` từ INDEX_ONLY sang signed chỉ vì cùng family.

## Nối vào code thật (nhưng không bật học sinh)

- `GiaoDien.html`: load 89 + 90 trước `83_Visual_Orchestrator`.
- `83_Visual_Orchestrator.html`: API `p0Candidate(contract)`, `p0ReviewPreview(host,contract)`; khi `q.p0Adaptation` xuất hiện, mặc định **deny ở student route** cho đến khi có chứng cứ nguồn + policy. Các câu B20 legacy không có `p0Adaptation` giữ nguyên giao diện/hành vi hiện tại.
- `qa/p0-g2b-adaptation/test_p0_contract.cjs`: test 25 quyết định, 14 family có thể giữ, 7 loại, 6 SVG vector families, core D3/D4/D7/D9/D10/D2 compatibility, xâm nhập khóa đáp án, source pin và source crosswalk, seed deterministic.
- `25-case-decisions.v1.json`: chỉ chứa nguồn dẫn, hash ảnh và quyết định; không chứa ảnh sách, rubric, đáp án bí mật hay dữ liệu người học.

## Rollback / next major step

**Không merge `main`, `test-theo-main`, `be-hoc`, không GAS deploy.** Nhánh TEST fork từ `be-hoc@59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff`; rollback bằng cách không áp dụng nhánh hoặc checkout SHA gốc. Khóa reviewer độc lập **0/25**, cổng 96 bài G2-B vẫn **0/96**, asset/renderer/publicVariant grant **0**. Bước dữ liệu B001–B024 tiếp theo lấy mapping family/nguồn theo cùng JSON contract, chỉ đưa vào pool nếu có dữ liệu biến thể hợp lệ và chính sách đã duyệt.
