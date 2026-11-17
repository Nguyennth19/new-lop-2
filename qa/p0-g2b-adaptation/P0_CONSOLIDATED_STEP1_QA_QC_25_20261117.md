# P0 – Consolidated QA/QC & Single GAS TEST Acceptance
## Bước 1: Hoàn thiện QA/QC 25 case học liệu/hình (17/11/2026)

**Trạng thái:** `STEP1_TECHNICAL_QA_PASS` · `25/25 CASE_CONTRACT_QC_PASS` · `SOURCE_INDEPENDENT_SIGNOFF_0/25` · `RENDERER_ASSET_PUBLIC_GRANTS_0` · `REAL_GAS_NOT_RUN` · `STUDENT_RELEASE_NO_GO`.

### Phạm vi được kế thừa, không kiểm toán lại nguồn SGK/VBT

- Source audit: `audit/data-b-g2b-p0-source-visual-20261117@969bdad4495839fddf303685e59416674460988c`, `qa/g2b-p0/review-25.snapshot.json`. Nguồn PDF và SHA crop giữ nguyên; **không trích xuất lại, không đăng ảnh SGK/VBT**.
- Quyết định chuyển đổi: `test/p0-g2b-variant-adaptation-20261117@a00a7f348db566bc024ff7ba42d874fe5d6c018a` trước QA mới. Chốt `11 KEEP_VARIANT`, `7 KEEP_STRUCTURAL`, `7 DROP` trên 25 case; C01=V03 cùng exerciseId nên **17 unique origins được giữ**, **7 DROP** và **1 bản ghi giữ trùng** không vào generator pool.
- Reviewer độc lập: bảng [16_G2B_P0_REVIEW_25](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910116) vẫn `0/25 SIGNED`. Chủ dự án xác nhận quy tắc *biến thể/vector/drop*; **không tương đương chứng nhận trang–phần–slot độc lập hoặc quyền phát hành**.

### Kiểm toán hợp đồng theo từng case

Các cột `skillId` bên dưới là **INDEX_ONLY**, không phải chứng nhận SGK độc lập. `renderer` đều là ứng viên/preview; một case được KEEP không mặc nhiên playable.

| Case | Bài, skillId (INDEX_ONLY) | Quyết định / renderer ứng viên | Số lượng, đơn vị, hình–vector và fallback phải giữ |
|---|---|---|---|
| C01 | B001, NUMBER_SENSE | STRUCTURAL / VECTOR_GRID100 | Bốn miếng 2×2, quan hệ ±1/±10, cấm đè ô; preview only |
| C02 | B019, ADDITION | VARIANT / D9_E04_SIDECAR | Nguồn 18+5 vỏ ốc; biến thể hai nhóm cùng đơn vị, dùng bộ đếm trung tính, D9 chỉ COUNT; **TOTAL sidecar E04 chưa duyệt** |
| C03 | B019, ADDITION | STRUCTURAL / VECTOR_PYRAMID | Khối cộng liền kề, số gợi ý phải đúng phép cộng; vector không giả hình hải đăng gốc |
| C04 | B020, ADDITION | STRUCTURAL / VECTOR_POLYLINE | Tuyến đoạn thẳng tính theo **nhãn cm**, không dựa độ dài pixel; preview only |
| C05 | B022, SUBTRACTION | VARIANT / D10_GUIDED | Toán lời văn bớt đi/ít hơn, đơn vị theo đề mới; không sao chép sai nhân vật Mai An Tiêm từ tóm tắt cũ |
| C06 | B022, SUBTRACTION | VARIANT / D10_GUIDED | Nguồn Mai 23 kg, Mi nhẹ hơn 5 kg; giữ quan hệ và **kg** |
| C07 | B022, SUBTRACTION | VARIANT / D10_GUIDED | Nguồn 35 bông hoa, thấy 9; phép trừ phần bị che, giữ đơn vị **bông** |
| C08 | B023, SUBTRACTION | VARIANT / D10_GUIDED | Nguồn 60 phòng, 35 phòng bật đèn; bảo toàn tổng–phần |
| C09 | B023, SUBTRACTION | VARIANT / D3_MATCHING | Ghép toán một–một, hai phía cùng số phần tử và kết quả khác nhau; không dùng cho many-to-one |
| C10 | B023, SUBTRACTION | VARIANT / D10_GUIDED | Nguồn 32 con gà, 26 mái; không tái dùng lỗi 66; chấm server chưa cấp |
| V01 | B001, NUMBER_SENSE | VARIANT / D9_E04_COUNT | Mẫu a 32 viên bi, phần b chưa khóa count; phải **sinh n** + đơn vị, hai ô ước lượng/đếm cần E04 |
| V02 | B001, NUMBER_SENSE | VARIANT / D9_E04_COUNT | Cà chua nhóm mười nhưng tổng hình gốc chưa khóa; n mới ≤40, đơn vị rõ, estimate sidecar chờ duyệt |
| V03 | B001, NUMBER_SENSE | STRUCTURAL / VECTOR_GRID100 | Cùng sourceExerciseId C01, **không tạo bản ghi pool thứ hai** |
| V04 | B010, REVIEW_MIXED | VARIANT / D4_MULTI_ITEM_SINGLE | 5 phép tính/4 kết quả, many-to-one; dùng các câu D4 lựa chọn đơn riêng, **không dùng D3** |
| V05 | B010, REVIEW_MIXED | DROP / NONE | Khối 3D che khuất, **loại khỏi pool**, không đoán số khối |
| V06 | B010, REVIEW_MIXED | DROP / NONE | Bàn cờ nhiều cung, luật xúc xắc; không dựng đường hoặc giao diện giả |
| V07 | B019, ADDITION | DROP / NONE | Mê cung đồ thị, không suy đường hạt dẻ |
| V08 | B020, ADDITION | DROP / NONE | Que tính có phép cộng sai chủ ý; không thay bằng bài đúng/sai thường |
| V09 | B020, ADDITION | STRUCTURAL / VECTOR_MULTIPATH | Đường đỏ 48+32=80 cm, xanh 34+34=68 cm, đen 32+48=80 cm; so theo nhãn cm |
| V10 | B020, ADDITION | STRUCTURAL / VECTOR_NUMBER_LINE | Tia 64–100 bước 3; bốn phép tính; **cung nối SGK chưa được chứng minh**, preview số/nhãn không phải bài đúng–sai nguồn |
| V11 | B022, SUBTRACTION | DROP / NONE | Nhánh rẽ nhiều đáp án, không tự dựng topology |
| V12 | B022, SUBTRACTION | DROP / NONE | Đồ thị nhiều hàng/đường, chưa kiểm graph |
| V13 | B023, SUBTRACTION | VARIANT / D7_COMPARE | Chỉ giữ **so sánh từng cặp phép trừ**, không tuyên bố khôi phục đường nhím SGK |
| V14 | B023, SUBTRACTION | STRUCTURAL / VECTOR_COLUMN_SLOTS | Giữ ô khuyết ở toán hạng/kết quả, kiểm có nghiệm phép trừ; **D2 B20 ADD-only không thay thế được** |
| V15 | B024, REVIEW_MIXED | DROP / NONE | Đường sợi dây vắt hai trang VBT, không đoán topology đầu/cuối |

### Sửa tối thiểu trong mã hiện có

1. `89_P0_VariantRouter.html`: kiểm tra miếng GRID100 **không chồng ô**; `ADDITION_PYRAMID` kiểm các clue đúng tổng hai ô dưới, không trùng slot; `COLUMN_MISSING_DIGITS` kiểm *có ít nhất một nghiệm hợp lệ* bằng logic mượn theo cột, **không xuất đáp án/khóa chấm**.
2. `makeSeededTwoGroup(seed, labels, countUnit)` yêu cầu **countUnit tường minh**; không được mặc định `con`. Trong preview D9 dùng ký hiệu đếm trung tính thay vì hiển thị cá/ngôi sao không liên quan nhãn nguồn.
3. `qa/p0-g2b-adaptation/test_p0_contract.cjs`: tách riêng fixture bằng deep-clone (chặn negative test làm bẩn testcase tiếp theo); mở rộng lên **60 test**, gồm 25 bài kiểm tra độc lập từng case, mọi trường PIN nguồn, lesson–skill–renderer, unit/count, vector preview, fallback, 7 DROP và mọi đường student fail closed.
4. `.github/workflows/p0-g2b-adaptation-test.yml`: lưu cả `TEST_RESULTS.json` và `QC25_CASE_MATRIX_RESULTS.json` thành artifact QA scope-labeled; không triển khai GAS hay mở quyền.

**CI:** [run 44116404225](https://github.com/Nguyennth19/new-lop-2/actions/runs/44116404225) — **60/60 PASS, 0 FAIL**, VM/Node, không phải kiểm visual Chrome hay real GAS. Bản CI chứng minh **quy tắc**; các payload fixture không được coi là nguyên văn 25 đề SGK/VBT.

### Cổng QA/QC và fallback được khóa

| Gate | Trạng thái |
|---|---|
| 25 case / 24 unique source pin, lesson/skill index, renderer-family mapping | **25/25 CODE QA PASS**, không tái QA trang SGK |
| 6 family vector review SVG | **CODE QA PASS**, review only, chưa nghiệm thu ảnh trên Web App |
| Unit/count D9 | **COUNTER VALIDATION PASS**, E04 TOTAL/ESTIMATE = **PENDING** |
| D3/D4/D7/D10 adapter hợp đồng | **CODE QA PASS**, trusted-grade từng family chưa duyệt |
| 18 KEEP / 17 unique origin pool | **TEMPLATE ONLY**; fallback **DENY STUDENT ROUTE** nếu thiếu source/policy |
| 7 DROP | **EXCLUDE**, giữ hồ sơ lịch sử; không tự thay bằng câu chưa approved cùng kỹ năng |
| Reviewer độc lập / chi tiết part-slot | **0/25 SIGNED**; chưa được nâng từ INDEX_ONLY |
| Cấp quyền asset/renderer/publicVariant | **0** |
| Web App TEST / Network B20 + 25 case/Chrome mobile | **NOT RUN**, phải chung **một deployment GAS TEST** |
| MAIN / TEST-THEO-MAIN / score/student writes | **UNTOUCHED** |

### Bàn giao thẳng sang Bước 2 – một bản TEST tích hợp

- **Source A (đóng kiểm toán 25 case):** nhánh `test/p0-g2b-variant-adaptation-20261117`, mã/QA ở `89_`, `90_`, `83_`, `GiaoDien.html` và `qa/p0-g2b-adaptation/`. Không mang ảnh SGK/VBT vào GitHub.
- **Source B (B20 trusted, đã làm):** `test/data-b-g3b-b20-trusted-gas-e2e-20261117@08edaffad8acfc12d62f840f36e1ff0e2b0ade6c` — server grading và browser smoke riêng, không dùng client key.
- **Cách kết hợp:** sử dụng **một nhánh TEST đang có** làm target, chỉ chuyển các byte thay đổi liên quan từ nguồn A sang B sau khi kiểm xung đột và test security. Không merge ồ ạt hoặc thay `main`/`test-theo-main`. Giữ `p0Adaptation` ở REVIEW/DENY cho đến khi có reviewer. Trong bản GAS TEST **hai biên bản nghiệm thu độc lập**:
  1. `B20_TRUSTED_GRADING_REAL_GAS_E2E` — auth/Network, LV1–LV3, replay, no writes.
  2. `G2B_25_CASE_VISUAL_SEMANTIC_ACCEPTANCE` — preview 18 keep (17 unique), 7 DROP, đúng units, hình/fallback, Chrome desktop/mobile và reviewer 25 case.
- **Không yêu cầu deploy ngay ở Bước 1.** Chỉ chuẩn bị tích hợp, kiểm thử trên cùng một branch và **một lần deploy GAS TEST** sau khi các cổng trước triển khai đạt PASS. Hai bộ biên bản có thể cùng deployment ID/SHA nhưng **không chia sẻ chữ ký hoặc đánh đồng PASS**.

**Rollback:** bỏ các commit TEST mới hoặc trở về `test/p0-g2b-variant-adaptation-20261117@a00a7f348db566bc024ff7ba42d874fe5d6c018a`; giữ nguyên chủ nguồn V8/C1/G2B, không thay số liệu điểm/sao, không xóa evidence/ảnh gốc.
