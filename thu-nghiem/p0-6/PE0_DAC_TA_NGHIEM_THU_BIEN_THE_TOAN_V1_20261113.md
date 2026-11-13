# P0.6-E.0 — ĐẶC TẢ NGHIỆM THU BIẾN THỂ SƯ PHẠM MÔN TOÁN LỚP 2
**Mã tài liệu:** LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1.0-CANDIDATE  
**Ngày:** 13/11/2026 (Asia/Ho_Chi_Minh)  
**Trạng thái:** `SPEC_DRAFT_FOR_OWNER_SIGNOFF` — tiêu chuẩn đề xuất, **chưa phải chữ ký duyệt của chủ dự án**  
**Phạm vi:** Toán 2, theo bài học/chủ đề; LV1 dựa khung kiến thức SGK, LV2 mở rộng luyện tập theo SBT/VBT, LV3 biến thể vận dụng trong ranh giới đã học. Không sao chép nguyên câu hoặc nguyên hình SGK/SBT làm điều kiện bắt buộc.  
**Áp dụng sau duyệt:** P0.6-E.1 và các bài Toán mới; không tự động hồi tố thay đổi H.1/H.2 Bài 20.  
**Bảo vệ:** TEST-only; không sửa Apps Script Web App Version 6, MAIN, test-theo-main, production, không cập nhật Sheet học sinh/điểm/sao. `RELEASE_READY=false`.

## 0. Quyết định kiến trúc và từ vựng chuẩn
**Nguyên tắc tối cao: SGK/SBT neo năng lực và giới hạn kiến thức, không neo cố định vật thể/hình thức giao diện.** Mỗi câu dự án tạo phải chứng minh được nó đánh giá đúng một hoặc nhiều mục tiêu `skillId` của `lessonId`, trong giới hạn `mathConstraints`. Có thể tạo bài có quả cam thay quả táo, thêm/bớt đồ vật, đổi trị số, thay nối bằng chọn/đúng–sai, hoặc chọn tình huống khác; chỉ **PASS** nếu giữ được bằng chứng đánh giá năng lực yêu cầu.

Phân biệt bốn khái niệm:
- `CURRICULUM_SCOPE`: tên bài, mục tiêu, phép toán, phạm vi, loại đơn vị, kĩ năng đã học. Nguồn: SGK/SBT và sổ chương trình; chỉ mục thứ cấp **không** được ghi là bằng chứng đã đọc trang SGK gốc.
- `QUESTION_VARIANT`: câu do dự án biên soạn, có mã riêng; `questionOrigin=PROJECT_ORIGINAL_VARIANT`, không nói là câu SGK.
- `ANSWER_ORIGIN`: câu hỏi biến thể được dự án tự tính đáp án thì `PROJECT_DERIVED`, không giả SGK có lời giải. `verification` và `pedagogyApproval` là hai cổng **độc lập**.
- `ASSESSMENT_EQUIVALENCE`: dạng tương tác mới đo đúng năng lực nào; chỉ đổi hình thức không mặc nhiên tương đương về độ khó hay kĩ năng.

### Ranh giới nguồn và quyền duyệt
| Nguồn | Chức năng | Không được suy diễn |
|---|---|---|
| SGK | Neo mục tiêu, tiến trình, đơn vị, giới hạn kiến thức | Không đòi giữ nguyên từng câu, ảnh, màu, con số |
| SBT/VBT | Neo kiểu luyện tập/mức độ và kiểm tra phân tầng | Không bắt chép từng bài, không mặc định mọi bài đều có đáp án |
| Sách tham khảo | Ý tưởng LV3 sau kiểm tra không vượt chương trình | Không tự gán là kiến thức bắt buộc SGK |
| Sách giáo viên | Hướng dẫn sư phạm, ví dụ cách hướng dẫn | Không là ngân hàng câu hỏi/đáp án chính thức |
| Ma trận dự án | Chỉ mục phạm vi, skill mapping, tình trạng kiểm nguồn | `INDEX_ONLY` ≠ `PRIMARY_PAGE_VERIFIED` |

**Nguồn đã đối chiếu cho đặc tả:** Google Sheets `MASTER — Curriculum & Question Type Matrix — Toán 2 KNTT — Survey V0.1`, các tab `CURRICULUM_MAP`, `SGK_B001_B024_AUDIT`, `QA_REFERENCE_CASES`, `RENDERER_MATRIX`; hồ sơ P0.6 A–E trên GitHub; quy tắc G7.4 Count-Safe và asset scene. Các ví dụ B25/B26 chỉ mới được đối chiếu mục lục/index, chưa tuyên bố kiểm trang SGK chính.

## 1. NGUYÊN TẮC BIẾN THỂ (V.1)

### 1.1. Năm điều bất biến
1. **Mục tiêu:** giữ `skillId` và cấu trúc năng lực đã chốt cho bài. Bài tổng hợp có thể nhiều skill, nhưng mỗi câu phải map rõ.
2. **Toán học:** phép toán, số hạng, phạm vi, có nhớ/mượn, điều kiện đơn vị, dấu phép tính, quan hệ và đáp án phải đúng với phiên bản câu được tạo.
3. **Mức nhận thức:** tương tác có thể thay đổi nhưng nếu từ tự lập phép tính sang chọn đáp án gợi ý thì đó có thể là **mức dễ hơn**, phải đổi nhãn độ khó; không ghi `EQUIVALENT` nếu mất phần năng lực đang đo.
4. **Minh họa có ý nghĩa:** hình để đếm/so sánh/đo/nhận dạng hình phải khớp toàn bộ dữ kiện bài. Hình trang trí có thể khác về số lượng/loại đồ vật nếu không gây hiểu sai.
5. **Đánh giá:** mỗi câu có đáp án/rubric, phép kiểm độc lập, renderer hỗ trợ, chính sách đáp án sai/bỏ trống và trạng thái phê duyệt. Không tự `PASS` vì JSON hợp schema.

### 1.2. Ba lớp biến thể
| Mã | Biến đổi | Quyền mặc định | Bằng chứng tối thiểu |
|---|---|---|---|
| `V1_SURFACE` | Đổi tên, đồ vật, hình không thiết yếu, trị số trong ranh giới, thứ tự trình bày không ảnh hưởng suy luận | `ELIGIBLE_FOR_AUTO_QA` với template đã duyệt | Ràng buộc toán + answer proof + asset policy |
| `V2_INTERACTION` | Nối ↔ ghép cặp; nối ↔ lựa chọn/đúng–sai; điền số ↔ lựa chọn; đổi thao tác nhưng không đổi chủ đích đánh giá | `CONDITIONAL` | Bảng mapping, kiểm mức khó, đúng/sai và distractor |
| `V3_STRUCTURAL` | Số thuần ↔ lời văn, hình ↔ bảng, đổi biểu diễn kiến thức hoặc số bước | `REVIEW_REQUIRED` lần đầu mỗi family | Đối chiếu skill, proof, ngữ nghĩa, reviewer; approve template trước khi sinh hàng loạt |

**Lưu ý đặc biệt:** với V1, *đổi trị số* hợp lệ **chỉ khi** bộ sinh số không đổi bản chất toán (ví dụ B21 yêu cầu cộng có nhớ thì cả biến thể vẫn phải có nhớ); với V2, thay nối bằng đúng–sai có thể chuyển từ đối chiếu nhiều quan hệ sang nhận diện một mệnh đề đơn, nên cần kiểm năng lực tương đương hoặc ghi `SIMPLIFIED`.

### 1.3. Trạng thái theo 2 lớp, không đánh đồng
- `TECHNICAL_QA=PASS|FAIL|PENDING`: schema, proof, asset, renderer, regression.
- `PEDAGOGY=APPROVED|REVIEW_REQUIRED|REJECTED`: phạm vi bài, tương đương nhận thức, hướng dẫn, độ khó.
- `VARIANT_ACCEPTANCE=PASS` chỉ khi tất cả cổng bắt buộc PASS **và** sư phạm APPROVED; nếu đủ kỹ thuật nhưng thiếu duyệt → `PENDING_REVIEW`; vi phạm kiến thức/toán/ngữ nghĩa → `FAIL`; thiếu công cụ/renderer/nguồn thiết yếu → `BLOCKED` hoặc `PENDING` theo loại.
- `SOURCE_SCOPE_STATUS=PRIMARY_VERIFIED|INDEX_VERIFIED|PENDING` độc lập; mức `INDEX_VERIFIED` có thể dùng dựng biến thể TEST dựa phạm vi đã xác định, nhưng không được tuyên bố là kiểm khớp trang gốc.

### 1.4. Tạo biến thể theo `lessonId`, không ép khuôn Bài 20
Một bài có thể 1, 2 hoặc nhiều session; có thể không dùng hình và/hoặc không dùng đáp án số. Cấu trúc 30 câu/6 lượt **chỉ** là baseline Bài 20. Số bài sinh theo ngân sách QA, độ phủ skill và tính sẵn sàng renderer, không theo số trang SGK.

## 2. QUY TẮC DỰNG HÌNH VÀ KẾ HOẠCH ASSET (V.2)

### 2.1. Ma trận vai trò hình
| Vai trò | Cần hình? | Đúng số lượng/đơn vị? | Cho đổi vật? | Cho ghép ảnh đơn? | Gate |
|---|---|---|---|---|---|
| `DECORATIVE` trang trí | Tùy chọn | Không, nếu không gợi dữ kiện trái bài | Có | Có | `SEMANTIC_SAFE`; fallback được phép |
| `CONTEXT` gợi ngữ cảnh | Theo family | Chỉ nếu câu tham chiếu trực tiếp vào vật | Có, cùng loại đếm/đơn vị phù hợp | Có | `TEXT_IMAGE_CONSISTENT` |
| `COUNTABLE` đếm/cộng/trừ nhóm vật | Bắt buộc nếu câu nói “quan sát hình” | **BẮT BUỘC** tổng, nhóm, số mất/nhận, phần nhìn thấy | Có nếu bảo toàn tính đếm và ý nghĩa | Có, mỗi đơn thể thực sự đại diện 1 vật | `COUNT_SAFE_PASS` |
| `COMPARISON` nhiều/ít, cao/thấp/dài/ngắn | Bắt buộc theo câu | Đúng quan hệ, tỉ lệ khi nó là dữ kiện | Có nếu tương đương | Có | `RELATION_VERIFIED` |
| `MEASUREMENT` cân, lít, thước | Bắt buộc nếu câu đọc từ hình | Đúng vạch, số đo, đơn vị, mốc, điều kiện đọc | Chỉ khi vật đo không đổi kỹ năng | Có nếu chính xác | `UNIT_SCALE_VERIFIED` |
| `GEOMETRY` đoạn thẳng, thẳng hàng, tứ giác, đường gấp khúc | Bắt buộc nếu câu nhận dạng từ hình | Đúng điểm, nét, cạnh, giao nhau, đóng/mở | Không áp dụng vật táo/cam | SVG định lượng được | `GEOMETRIC_TOPOLOGY_VERIFIED` |

**Quy tắc phân định:** “3 quả táo” trong đề là dữ kiện phải giữ **3** ở hình COUNTABLE hoặc thay đề thành “4 quả cam” và dựng **4** quả cam, đồng bộ đáp án; không được thay hình 1 con gà để đại diện 5 con gà nếu câu yêu cầu đếm ngay trên hình. Nếu hình chỉ là bối cảnh “đàn gà”, một hình gà có thể làm minh họa **khi câu chữ không yêu cầu người học suy ra số con từ hình**.

### 2.2. Quy trình từ tiêu đề bài tới `AssetPlan`
1. Từ `lessonId`, tiêu đề, skill matrix, family và các ràng buộc → xác định `visualConcepts` (vật đếm, tia số, hình học, đo lường, bảng...).
2. Xác định vai trò hình theo **câu biến thể đang sinh**, không lấy ảnh từ SGK làm danh sách mua bắt buộc. Một bài có thể có các family có hình và family không hình.
3. Tra thư viện đã QA theo `assetId`, label, nguồn, giấy phép, role và trạng thái `Count-Safe`. Thứ tự: (a) dùng hình sẵn; (b) ghép nhiều hình đơn; (c) sinh sơ đồ toán học/SVG theo tham số; (d) nếu thực sự thiếu thì đưa vào `ASSET_GAP`. Không xin tạo ảnh mới chỉ vì sách dùng vật thể khác.
4. Sinh `visualScene` có số nhóm, số lượng, layout, alt text, fallback và `countExpectation`. Đối chiếu số/quan hệ với `answerSpec`.
5. Dựng thử, QA trên mobile/desktop cho family rủi ro; ảnh không hiển thị thì `DECORATIVE` có thể fallback, còn hình là dữ kiện thì cần fallback **tương đương dữ kiện** hoặc chặn câu.

### 2.3. Hợp đồng `AssetPlan` đề xuất (chưa thay G7.4 runtime)
```json
{
  "lessonId": "toan_b21",
  "questionFamily": "math.count_add",
  "visualRole": "COUNTABLE",
  "sourcePolicy": "REUSE_FIRST",
  "semantic": "hai nhóm cam; tổng chính là số vật được hỏi",
  "groups": [{"label":"nhóm 1","assetSemantic":"orange_single","count":4},
             {"label":"nhóm 2","assetSemantic":"orange_single","count":2}],
  "countExpectation":{"groups":[4,2],"total":6,"derivedFromQuestion":true},
  "assetIds": [],
  "countSafeStatus": "PENDING",
  "altText": "Nhóm thứ nhất có 4 quả cam, nhóm thứ hai có 2 quả cam",
  "fallbackMode": "EQUIVALENT_COUNT_DIAGRAM",
  "assetQA": "PENDING"
}
```
Ví dụ chỉ minh họa hợp đồng, **chưa xác nhận có asset cam đơn trong kho**; khi thiếu `assetIds`, trạng thái không được nâng lên `COUNT_SAFE_PASS`. Mẫu này mô tả kĩ năng cộng nhóm, không tự động gán vào B21 nếu câu cụ thể của B21 đánh giá phép cộng có nhớ khác với 4+2. `4+2` chỉ là ví dụ tổng quát, **không hợp lệ làm câu B21 bắt buộc có nhớ**.

### 2.4. Liên kết G7.4 đã có
- Không tự suy số lượng từ tên ảnh, kích thước hoặc `repeat=5` khi vật chứa nhiều đối tượng. Cần `count_safe=true` đã xác minh từng asset, giới hạn lặp và đối chiếu `scene.groups`.
- WebP: ưu tiên asset ID chung, manifest đã kiểm hash/label, không trỏ URL ngẫu nhiên.
- Fluent Emoji Flat: dùng fallback/biểu tượng theo mapping đã QA, kiểm bản quyền/nguồn; **không tự coi emoji đồ vật đa thể là 1 vật đếm**.
- SVG toán học: ưu tiên đường thẳng, tia số, đoạn thẳng, vạch đo, tứ giác… có dữ kiện hình học sinh theo tham số, kiểm topology; hình toán học sai không được chữa bằng hình trang trí đẹp.
- Nếu cảnh lớn vượt ràng buộc scene hiện có (G7.4 `groups<=8`, `count<=24/item`, tổng<=48 theo bridge), phải tách cảnh hoặc thiết kế renderer số lượng khác, **không tự nới rào**.

## 3. MA TRẬN CHUYỂN ĐỔI TƯƠNG TÁC (V.3)

### 3.1. Quy tắc đánh giá tương đương
Mỗi phép chuyển cần ghi `sourceInteraction`, `targetInteraction`, `skillCoverage`, `difficultyDelta=EQUIVALENT|SIMPLIFIED|HARDER|DIFFERENT_SKILL`, `gradingMode`, `rendererAvailability`. Không có khái niệm “đã có renderer là được phép dùng”.

| Gốc | Biến thể mục tiêu | Điều kiện chấp nhận | Khuyến cáo |
|---|---|---|---|
| Nối phép tính ↔ kết quả | Ghép cặp thẻ | Bảo toàn từng quan hệ, tất cả đầu cặp và tính duy nhất | `V2_CONDITIONAL` |
| Nối nhiều cặp | Đúng/sai từng mệnh đề | Tạo tập mệnh đề đủ phủ quan hệ cần kiểm; không chỉ kiểm 1/5 cặp | `V2_CONDITIONAL`, có thể giản lược |
| Nối vật ↔ số lượng | Chọn số đúng | Hình đếm được, distractor không mơ hồ | `V2_CONDITIONAL` |
| Điền kết quả số | Chọn đáp án | Đúng số; phương án nhiễu hợp lý; nếu nhận diện nhẹ hơn phải hạ/cập nhật level | `V2_CONDITIONAL` |
| Điền bảng số | Đúng/sai hàng số | Vẫn đánh giá thứ tự/quy luật và đủ ô mục tiêu | `V2_CONDITIONAL` |
| Đếm hình → ghi số | Chọn số / đúng-sai số lượng | COUNT_SAFE và giữ năng lực đếm, ít nhất một distractor sai rõ | `V2_CONDITIONAL` |
| Tính nhẩm | Bài toán lời văn một phép | Ngữ cảnh rõ, đáp án và đơn vị đúng, có thể thêm đọc hiểu; đánh dấu `V3` | `REVIEW_REQUIRED` |
| Bài toán lời văn | Tính thuần | Có thể mất năng lực lập mô hình; **không** tự gắn `EQUIVALENT` | `REVIEW_REQUIRED` hoặc `FAIL` |
| Đo/đọc vạch trên hình | Chọn một số không hình | Mất năng lực đọc vạch; **không tương đương** | `FAIL` nếu skill gốc đo/đọc vạch |
| Vẽ đoạn thẳng theo yêu cầu | Chỉ nhận biết đúng/sai hình | Đánh giá nhận dạng chứ không kiểm năng lực vẽ | `FAIL` nếu mục tiêu bắt buộc là thực hiện thao tác vẽ |
| Nhận diện đường gấp khúc/tứ giác | Chọn hình đúng, đúng–sai theo hình | Hình chính xác topology, đáp án có chứng cứ hình học | `V2_CONDITIONAL` |

### 3.2. Quy tắc hiển thị và chấm
- Không đảo số đáp án hoặc đảo dữ kiện hình một cách độc lập.
- Đúng/sai cần mệnh đề kiểm được từ dữ liệu; khi câu hỏi đòi tất cả quan hệ, có thể có nhiều mệnh đề.
- Choice/matching cần đáp án đúng duy nhất **nếu câu nói chọn một**; nhiều đáp án đúng phải hiển thị hướng dẫn “chọn tất cả”.
- Renderer `NOT_BUILT`/PARTIAL chỉ được xem trước dưới `READONLY` hoặc `BLOCKED`. Không đánh dấu bài đạt thực thi học sinh chỉ vì hợp đồng cho phép dạng tương tác.
- Mỗi family có riêng các ca chọn đúng, sai, bỏ trống, hoán vị đáp án, kích thước mobile và khả năng bàn phím/trợ năng.

## 4. QA GATE – TIÊU CHÍ PASS/FAIL (V.4)

### 4.1. Cổng không được bỏ qua
| Mã | Cổng | PASS khi | FAIL/BLOCK khi |
|---|---|---|---|
| `G0_SCOPE` | Phạm vi bài/nguồn | Có lessonId, skillId, constraints và nguồn chỉ mục; nguồn ghi đúng cấp độ xác minh | Không xác định được bài/kỹ năng → BLOCKED; vượt scope → FAIL |
| `G1_MATH` | Đúng số, phép, quan hệ | Proof độc lập đúng, giá trị hợp lệ, unit đúng và đúng `carry/borrow` | Sai phép/giá trị/đơn vị/bước → FAIL |
| `G2_VARIANT` | Loại V1–V3 và kỹ năng | Mỗi biến thể có mapping và difficultyDelta; V3 có reviewer | Thay đổi skill không được phép → FAIL; thiếu mapping → PENDING |
| `G3_VISUAL` | Hình học/Count-Safe | Nếu data-bearing: ảnh/cảnh thỏa số/quan hệ/topology; nếu trang trí: không gây mâu thuẫn | Hình gây đáp án khác → FAIL; asset chưa QA mà bắt buộc → BLOCKED |
| `G4_INTERACTION` | Thao tác đo năng lực | Tương đương hoặc đổi level có chủ đích; distractor và số đáp án đúng | Chỉ test một phần năng lực không được khai báo → FAIL/PENDING |
| `G5_RENDER` | Dựng và fallback | Renderer cho kind đã QA; không chấm ngầm; fallback phù hợp vai trò hình | Chưa xây renderer cần tương tác → BLOCKED |
| `G6_ANSWER` | Đáp án, rubric | Answer origin và proof/rubric rõ; nhiều đáp án được duyệt | Không có đáp án khả kiểm hoặc tự chấm câu mở → BLOCKED |
| `G7_PEDAGOGY` | Sư phạm | Template/family đã được người có thẩm quyền duyệt, sample đại diện đạt | Chưa duyệt → PENDING; sai nhận thức → FAIL |
| `G8_RELEASE` | Bảo vệ môi trường | CI đúng SHA, QA receipt, no-write TEST, rollback, release độc lập | Thiếu biên nhận hoặc ghi data ngoài dự kiến → BLOCKED/FAIL |

### 4.2. Quy tắc ưu tiên và kết quả
- Nếu bất cứ cổng nào **FAIL** → `VARIANT_ACCEPTANCE=FAIL`.
- Nếu không FAIL nhưng có **BLOCKED** (không thể dựng/kiểm dữ kiện bắt buộc) → `BLOCKED`.
- Nếu không FAIL/BLOCKED nhưng còn **PENDING** (nguồn mức cao, asset QA, ký duyệt) → `PENDING_REVIEW`.
- Tất cả cổng bắt buộc PASS → `PASS_FOR_TEST` (chưa tự động `RELEASE_READY`). Production cần gate phát hành riêng.
- `PASS_WITH_NOTES` **không được** sử dụng để bỏ qua cổng toán hoặc hình dữ kiện.
- Checklist sư phạm phải ghi bằng chứng `reviewer`, `reviewAt`, `evidenceRef`; không tự dựng tên người duyệt hay phiên bản tài liệu.

### 4.3. Tự động hóa theo rủi ro để tránh nghiệm thu từng câu
| Mức | Ví dụ | Cách QA |
|---|---|---|
| `LOW` | V1 số thuần cùng một rule đã duyệt | Unit/schema/math proof tự động cho **100% câu**, kiểm mắt chọn mẫu mỗi family/mốc |
| `MEDIUM` | V2 chuyển interaction, V1 COUNTABLE | 100% toán/scene mapping + auto negative; nghiệm thu trực quan đại diện mỗi family/thiết bị |
| `HIGH` | V3 lời văn, đổi năng lực, hình đo/hình học | 100% kiểm điều kiện dữ liệu/topology + thẩm định template và mẫu rủi ro; V3 mới không tự approve |
| `CRITICAL` | Hình dữ kiện thay đáp án, tự chấm câu mở, vượt phạm vi chương trình | FAIL/BLOCKED; sửa rồi chạy lại, không cho qua bằng chọn mẫu |

Với câu đã sinh hàng loạt, **không yêu cầu đọc tay tất cả** nếu có rule đã duyệt và engine kiểm 100% điều kiện quyết định được. Nhưng nếu một họ bài xuất hiện lỗi hệ thống, tạm chặn cả họ đến khi QA lại.

### 4.4. Hợp đồng biên nhận QA tối thiểu
```json
{
  "policyId": "LOP2-P06-E0-MATH-VARIANT-ACCEPTANCE-V1",
  "lessonId": "toan_b21",
  "candidateId": "VAR_B21_E_001",
  "variantLevel": "V1_SURFACE",
  "sourceScopeStatus": "INDEX_VERIFIED",
  "skillIds": ["ADD_CARRY_REVIEW"],
  "constraintRef": "MATH_B021",
  "mathProof": "PASS",
  "visualRole": "NONE",
  "assetGate": "NOT_APPLICABLE",
  "interactionFrom": "NUMBER_INPUT",
  "interactionTo": "NUMBER_INPUT",
  "difficultyDelta": "EQUIVALENT",
  "rendererGate": "READONLY_PREVIEW_ONLY",
  "pedagogyGate": "PENDING",
  "qaSourceCommit": null,
  "qaReceiptSha256": null,
  "overall": "PENDING_REVIEW"
}
```
Ví dụ trạng thái nháp, không phải biên nhận ký số hay kết luận phát hành. Biên nhận thật phải có SHA nguồn/file, SHA kết quả, ID câu, trạng thái từng cổng, phiên bản rule/asset/renderer và liên kết quyết định phê duyệt. Không lưu thông tin nhận dạng học sinh.

## 5. ÁP DỤNG THỬ CHO BA BÀI TOÁN (V.5)

### 5.1. B21 – Luyện tập chung (MATH_B021)
**Phạm vi theo bảng dự án:** ôn phép cộng có nhớ B19–B20; được phép 2 chữ số + 1 chữ số hoặc 2 chữ số + 2 chữ số trong phạm vi đã học, không đưa phép trừ có nhớ thuộc B22/B23. Chỉ mục SGK 80–82, VBT 77–79 là dữ liệu mục lục/chỉ mục, chưa đồng nghĩa với soát trang nguồn gốc.

| ID ví dụ | Biến thể | Hình | Nghiệm thu đề xuất |
|---|---|---|---|
| `B21-V1-01` | `67 + 3 = ?` → 70; V1 thay số trong family phép cộng có nhớ | NONE | `MATH_PASS`, `PEDAGOGY_PENDING`; có ví dụ QA trong `QA_B021_VALID` |
| `B21-V1-02` | `48 + 7 = ?` → 55 | NONE | `MATH_PASS`; tương ứng ứng viên P0.6-E, chờ ký duyệt |
| `B21-V2-03` | “67+3=70 đúng hay sai?” thay một câu tính số | NONE | `CONDITIONAL`: chỉ một đúng/sai không nhất thiết tương đương khả năng tự tính |
| `B21-FAIL-04` | `64 - 8 = ?` | NONE | `FAIL:G0_SCOPE` vì đưa phép trừ có nhớ chưa thuộc khung B21 |
| `B21-FAIL-05` | `45 + 3 = ?` thành câu duy nhất cho family *có nhớ* | NONE | `FAIL` vì không có nhớ, dù phép cộng đúng số học |

**Kế hoạch hình B21:** mặc định hình `OPTIONAL` cho phép tính thuần; nếu dùng kẹo/cam để mô hình hóa cộng thì cần phù hợp số lượng tính toán (có thể không thực tế nếu 67 đối tượng, ưu tiên bó chục/đơn vị có Count-Safe). Đối với phép cộng qua chục, khuyến nghị sơ đồ chục–đơn vị hoặc khối chục hơn việc rải 70 đồ vật.

### 5.2. B24 – Luyện tập chung (MATH_B024)
**Phạm vi theo chỉ mục:** ôn cộng và trừ có nhớ đến B23; cho phép bài toán nhiều bước theo năng lực của bài. Dữ liệu dự án có ví dụ `25 + 65 - 30 = 60` tại QA reference; chỉ mục SGK 95–97, VBT 91–93 là nguồn gián tiếp.

| ID ví dụ | Biến thể | Hình | Nghiệm thu đề xuất |
|---|---|---|---|
| `B24-V1-01` | `25 + 65 - 30 = ?` → 60 | NONE | `MATH_PASS`, yêu cầu reviewer xác nhận family chain thuộc mục tiêu |
| `B24-V1-02` | `36 + 44 - 20 = ?` → 60 | NONE | `MATH_PASS`; cần kiểm mỗi bước và giới hạn số |
| `B24-V2-03` | Cho ba kết quả 60/50/70, chọn kết quả của chuỗi | NONE | `CONDITIONAL`: đổi từ tự tính sang nhận biết, `difficultyDelta=SIMPLIFIED` nếu cần |
| `B24-V3-04` | Lời văn “có 25 viên bi, thêm 65, cho đi 30; còn bao nhiêu?” | CONTEXT/COUNTABLE tùy câu có yêu cầu nhìn hình | `REVIEW_REQUIRED`: kiểm tính hợp lý ngữ cảnh và nếu có ảnh đếm thì đúng nhóm |
| `B24-FAIL-05` | Hình có 20 viên bi nhưng đề dựa trên 25 để tính | COUNTABLE | `FAIL:G3_VISUAL` do hình trái dữ kiện |

**Kế hoạch hình B24:** `NONE` cho chuỗi số; `DECORATIVE` nếu hình chỉ gợi bối cảnh; `COUNTABLE` phải khớp câu, ưu tiên hình thanh/khối số hoặc phép biến đổi biểu diễn, không cố nhồi hàng chục vật riêng gây khó kiểm trên mobile.

### 5.3. B26 – Đường gấp khúc, hình tứ giác (MATH_B026)
**Phạm vi theo chỉ mục** `CURRICULUM_MAP`: nhận biết đường gấp khúc, hình tứ giác, có khả năng thao tác với hình. Trang–bài SGK và VBT cụ thể **chưa được kiểm nguồn sơ cấp** (mức `INDEX_CROSSCHECKED/PENDING_PAGE_REVIEW`).

| ID ví dụ | Biến thể | Hình | Nghiệm thu đề xuất |
|---|---|---|---|
| `B26-V2-01` | Nhận biết hình tứ giác bằng cách chọn một trong nhiều hình SVG | GEOMETRY | `PENDING_ASSET_QA`: cần SVG thực, đúng 4 cạnh và hình đóng, distractor rõ |
| `B26-V2-02` | “Hình A là đường gấp khúc. Đúng hay sai?” | GEOMETRY | `CONDITIONAL`, phải phân biệt với đường cong và hình kín; không đòi vẽ nếu skill đang là nhận diện |
| `B26-FAIL-03` | Hình có 5 cạnh nhưng được gắn nhãn tứ giác | GEOMETRY | `FAIL:G1_MATH/G3_VISUAL` |
| `B26-FAIL-04` | Bài “Hãy vẽ đoạn thẳng dài 5 cm” chuyển thành chỉ chọn đúng/sai hình vẽ | GEOMETRY | `FAIL:G4_INTERACTION` nếu `skillId` yêu cầu thao tác vẽ; hơn nữa skill vẽ phải xét lại có thuộc bài hay không |

**Kế hoạch hình B26:** ưu tiên SVG toán học theo tham số `vertices`, `edges`, `closed`, `segmentCount`, `topologyVerified`; dùng điểm đầu/cuối/đỉnh dễ phân biệt, kích thước chạm phù hợp mobile. Không dùng WebP trang trí để thay hình hình học tính đáp án. Khi renderer `SVG_DRAW` chưa xây (đã ghi `NOT_BUILT` trong ma trận) thì chỉ bật dạng chọn/nhận diện đã được hỗ trợ hoặc ở chế độ readonly; yêu cầu vẽ phải `BLOCKED`.

### 5.4. Ma trận chốt ba bài
| Bài | Mục tiêu kiểm | Bằng chứng kỹ thuật hiện có | Thiếu để PASS |
|---|---|---|---|
| B21 | Cộng có nhớ, V1/V2 số và tương tác | P0.6-E có 2 câu `mathProof=PASS`, readonly PASS | Duyệt phạm vi/độ khó và kiểu tương tác; renderer học sinh khi phát hành |
| B24 | Chuỗi cộng/trừ và chuyển ngữ cảnh | Có QA reference/ma trận mức chỉ mục, **chưa chạy fixture theo bộ E.0** | Tạo ứng viên, proof mỗi bước, reviewer, QA renderer |
| B26 | Topology hình học và tương tác | Có ma trận bài/hình, `SVG_DRAW` mới đề xuất | Kiểm trang SGK/VBT, dựng SVG chính xác, validator hình và renderer, duyệt sư phạm |

**Không đồng nhất** việc ví dụ đã tính ra kết quả đúng với trạng thái `VARIANT_ACCEPTANCE=PASS`. Đây là **ca thiết kế để thử tiêu chí**, không phải quyết định duyệt nội dung mới.

## 6. HỢP ĐỒNG TRIỂN KHAI KẾ THỪA (P0.6-A–E và G7.4)
Đề xuất bổ sung dưới `lesson.variantPolicy` hoặc sidecar `<lessonId>.variant-policy.json`, không sửa một lần tất cả `runtime.json`. Khuyến nghị các trường:
- `policyVersion`, `lessonId`, `scopeRefs`, `allowedSkills`, `forbiddenSkills`, `mathConstraints`.
- `variantFamilies[].id/level/allowedChangeSet/answerRule/allowedInteractionMap/requiredAssetRole`.
- `question[].variantLevel/skillIds/provenance/difficultyDelta/assetPlanRef/interactionTransform/answerProofRef/reviewerStatus`.
- `assetPlan[].role/semantic/countSafeStatus/countExpectation/geometry/topology/assetIds/fallback`.
- `qaGate[].id/status/evidenceRef`, `receiptSha256`, `sourceCommit`, `approval`.
Duy trì tách biệt **source questions**, **answer derivation**, **pedagogy approval**, **image rights** và **runtime release**; một trường không thể tự thay thế trường khác.

## 7. BIÊN BẢN NGHIỆM THU ĐẶC TẢ – CHỜ CHỦ DỰ ÁN DUYỆT
| Hạng mục | Đã có trong đặc tả | Trạng thái |
|---|---|---|
| E.0-01 Nguyên tắc V1/V2/V3 | Có 5 bất biến, mức biến thể, ranh giới nguồn | `SPEC_READY_FOR_REVIEW` |
| E.0-02 AssetPlan / Count-Safe / SVG | Có role, reuse-first, count/semantic/topology | `SPEC_READY_FOR_REVIEW` |
| E.0-03 Ma trận interaction | Có 10 phép chuyển và điều kiện không tương đương | `SPEC_READY_FOR_REVIEW` |
| E.0-04 QA Gate | Có G0–G8, luật ưu tiên, kiểm thử theo rủi ro | `SPEC_READY_FOR_REVIEW` |
| E.0-05 Ví dụ ba bài | B21, B24, B26 với ca đúng/sai/chờ | `SPEC_READY_FOR_REVIEW` |
| E.0-06 Ký duyệt chính sách | Chưa có | `OWNER_SIGNOFF_PENDING` |
| E.0-07 Validator và CI thực thi chính sách | Chưa triển khai; đây là bản đặc tả | `IMPLEMENTATION_PENDING` |

**Quyết định hiện hành:** `SPEC_COMPLETE_FOR_OWNER_REVIEW`; `POLICY_ACTIVE=false`; `RELEASE_READY=false`. Không tự chuyển `PEDAGOGY=APPROVED` khi chủ dự án chưa xác nhận.

**Quy tắc đóng E.0:** chỉ cập nhật trạng thái policy `APPROVED_FOR_TEST_POLICY` sau khi chủ dự án xác nhận tiêu chí; tiếp theo tạo schema/validator/negative fixtures và CI trên nhánh TEST độc lập, đối chiếu ma trận B21/B24/B26. Chưa yêu cầu dùng học sinh hoặc production.

### Rollback và nhật ký thay đổi
- Phiên bản này chỉ thêm tài liệu trên nhánh `test/p0-6-e0-math-variant-acceptance-20261113`; rollback bằng revert tài liệu hoặc checkout nhánh P0.6-E trước đó.
- Không chỉnh sửa H.1 Bài 20 30 câu, Apps Script V6, dữ liệu học sinh, thư viện hình, G7.4 chính thức hoặc cờ P03.
- Mọi thay đổi ranh giới skill/biến thể/ảnh sau phê duyệt phải có `policyVersion`, change reason, reviewer, test differential và đường lùi.

**Người lập:** trợ lý kỹ thuật (bản nháp để chủ dự án phê duyệt).  
**Người phê duyệt:** [chưa ký]  
**Ngày phê duyệt:** [chưa có]  
**Kết quả:** `PENDING_OWNER_SIGNOFF`
