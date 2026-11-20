# ULT-V1.3-B — Governed Sheet TEST & Candidate Intake

**Ngày:** 20/11/2026 · **Nhánh LAB:** `lab/universal-learning-template-v13b-sheet-test-20261120`  
**Kế thừa:** `ULT-V1.3@7af2dd4d98f9e39989a13b8f9144d3f472df37b2`  
**Chế độ:** `SHEET_TEST_WRITE_ONLY + READ_RECEIPT + LOCAL_CANDIDATE_DRY_RUN`  
**KHÔNG:** GAS TEST, sản xuất học liệu B001–B024, manifest ACTIVE, ghi Google Sheets gốc, phê duyệt thực, AI model tự chạy.

## 1. Môi trường TEST được tạo thật

- **[Governed Sheet TEST](https://docs.google.com/spreadsheets/d/1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs/edit)** – ID `1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs`.
- **Sheet B20 nguồn (GIỮ NGUYÊN):** ID `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8`; không gọi bất kỳ phương thức ghi nào đến ID này.
- Google Sheets TEST có 7 tab chuẩn từ `qa/universal-template-v13/SHEET_CONTROL_CONTRACT_V1.json`:
  `10_DanhMuc_Bai`, `11_YeuCau_Data`, `12_KetQua_Validator`,
  `13_PheDuyet`, `14_PhienBan_JSON`, `15_NhatKy_HanhDong`, `16_Rollback`.
- `10_DanhMuc_Bai!A1:H4` có 2 bài LAB tổng hợp và **B020 chỉ dùng để thử chặn nguồn**; cả 3 `release_eligible=FALSE`.
- `11_YeuCau_Data!A1:M3` có 2 yêu cầu `LAB_PILOT_A/B`, LV2, D2, `COLUMN_ADD`, 20 câu, `D2_PV100_ADD_WITH_CARRY_V1`, `SYNTHETIC_QA_ONLY`, `REQUESTED`.
- Các tab `12`–`16` được tạo với header chuẩn và vùng chưa ký duyệt. Dropdown ở LV, generator_mode, request_status, signature_verification và state; có freeze 1 dòng và các header/kích thước cột dễ đọc.
- Hai lần đối chiếu connector Google Sheets xác nhận tên tab và các hàng chính. **Google Sheets TEST là nơi quản trị riêng, không phải bản sao Sheet B20 có đáp án.**

## 2. Đường đọc dữ liệu đã chứng minh

```text
Google Sheets TEST (native)
  └─ bounded connector read: 10_DanhMuc_Bai!A1:H4
                           + 11_YeuCau_Data!A1:M3
       └─ source receipt: SHEET_TEST_READ_RECEIPT_20261120.json
            └─ strict header/source/catalog/status/version checks
                 └─ deterministic D2 source generator
                     └─ original D2 publicPlan + math/privacy validator
                           └─ immutable JSON CANDIDATE & proof
                               └─ PENDING_OWNER_APPROVAL / NO RELEASE
```

**Giới hạn quan trọng:** Google Drive connector đã đọc dữ liệu TEST thật và commit một **snapshot** có bằng chứng; **CI không có quyền/kết nối tự động polling Sheets**. Khi có thay đổi trên Sheet, cần một lần **chụp read-receipt mới** qua connector có xác thực. Không tuyên bố rằng Sheet tự thay đổi làm JSON trong GitHub tự cập nhật real-time.

`governed-intake.cjs` chỉ tiêu thụ snapshot đã thu được, kiểm tra ID Sheet, đủ 7 tab, khớp header, nguồn bài, từ chối công thức trong request, quyền bài, và bất kỳ cờ công bố thực nào. Học sinh/B020 không bao giờ được đưa qua nguồn TEST.

## 3. Candidate Intake & AI

- V1.3-B chạy được `LAB_PILOT_A` và `LAB_PILOT_B`: sinh 40 câu D2 synthetic (20 + 20) trong `qa/universal-template-v13b/dist/` cùng hash SHA-256 và virtual `staging://` plan.
- Các JSON chỉ là **ứng viên công khai**, không có private answer, khóa chấm, đánh giá đúng/sai hoặc quyền release.
- `acceptAIProposal(request, envelope)` là điểm tiếp nhận dữ liệu AI *chưa tin cậy*. Không cho AI tự phê duyệt, không chấp nhận AI cho yêu cầu `generator_mode=DETERMINISTIC` và không coi content từ model là dữ liệu đã qua Validator.
- **Không có live LLM/Gemini/OpenAI API call trong V1.3-B**; AI connector và giá/định mức/quyền phê duyệt sẽ được chọn riêng sau. AI không có quyền ghi JSON ACTIVE.
- CI kiểm chứng nạp hai gói JSON lấy từ snapshot Sheet vào LAB unchanged trên desktop/mobile, kiểm đủ 80 mount+nhập của D2 và không cho JSON upload đi chấm server.

## 4. Cổng phê duyệt, version và rollback

- `12_KetQua_Validator` phải phân biệt `technical CHECKED` với nghiệm thu sư phạm/ngữ nghĩa.
- `13_PheDuyet` **không có chữ ký**: không có người ký, chữ ký điện tử, scope digest hay bằng chứng xác thực.
- `14_PhienBan_JSON` có thể nhận trạng thái CANDIDATE sau CI TEST; không có ACTIVE pointer hay output thực trên GitHub/Drive.
- `15_NhatKy_HanhDong`: append-only, mỗi event chứa batch + source hash + proof (không giả mạo ngày/giờ).
- `16_Rollback`: chỉ metadata cho một hợp đồng phục hồi sau này. **Chưa có bản ACTIVE nên không có rollback thực.**
- Không thay đổi quyền, không ghi tiến độ/điểm/sao, không tạo manifest phát hành.
- Báo cáo phản biện `ULT-REVIEW-RC01-20261120` vẫn là cổng kỹ thuật: thiếu CSS D1, D1/D2/D10 draft roundtrip, các mode D5/D6/D8, EXACT_COUNT và chính sách grade by pack digest. **Cả V1.3 và V1.3-B đều không khắc phục những khoảng trống renderer này**, vì không sửa mã nguồn ứng dụng.

## 5. Tái chạy không có Google credentials

Từ checkout nhánh TEST với Node 22:

```bash
node qa/universal-template-v13b/governed-intake.cjs
node qa/universal-template-v13b/governed-intake.test.cjs
node qa/universal-template-v1/build.cjs
node qa/universal-template-v13b/sheet-candidate-browser.test.cjs
```

Kết quả từ snapshot hiện hành được tạo trong `qa/universal-template-v13b/dist/`:
- `LAB_PILOT_A_PUBLIC_CANDIDATE.json`, `LAB_PILOT_B_PUBLIC_CANDIDATE.json`
- `LAB_PILOT_*_PUBLISH_PLAN_TEST_ONLY.json`
- `LIVE_TEST_SHEET_INTAKE_EVIDENCE.json`, `TEST_GOVERNANCE_EVENTS.jsonl`
- `ULT_V13B_* .png` và `BROWSER_SWAPPABILITY_EVIDENCE.json` (khi chạy browser)

**Phạm vi chất lượng:** đủ kỹ thuật để tiếp tục thí điểm nhập xuất dữ liệu TEST. Không triển khai GAS/MAIN, không sửa `be-hoc`, không lập Big Data trước khi có QA hai bài học thật và các cổng kiến trúc theo phản biện.

## 6. Các bước tiếp nối có kiểm soát

1. Xác minh browser QA ở CI mới trên chính ảnh/JSON lấy từ snapshot Sheet; lưu SHA và kết quả.
2. Sau CI pass, chỉ ghi **kết quả kỹ thuật TEST** vào `12`, `14` và `15` nếu thực hiện thao tác ghi; tuyệt đối không ký ở `13` hoặc thay trạng thái ACTIVE.
3. Xây **governed read-only connector** có xác thực (service account/Apps Script TEST) khi được phê duyệt quyền truy cập: đọc thay đổi đúng ID, idempotency, quota, snapshot digest và provenance.
4. Triển khai `ULT-R1/R2` khắc phục các khoảng trống Template LAB đã xác nhận trước khi dùng dữ liệu bài thật, song song đặc tả AI Builder có kiểm định.

**Rollback:** ngừng CI/không dùng TEST Sheet, bỏ nhánh V1.3-B; không cần khôi phục `be-hoc` hoặc Google Sheets nguồn vì các nơi đó chưa bị ghi.
