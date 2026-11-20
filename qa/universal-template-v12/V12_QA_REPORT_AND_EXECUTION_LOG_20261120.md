# ULT-V1.2 — Hợp đồng chấm tin cậy theo dạng bài / Independent QA & Checkpoint Ledger

**Ngày:** 20/11/2026  
**Dự án:** LOP2 – UNIVERSAL LEARNING TEMPLATE V1  
**Phạm vi:** riêng nhánh `lab/universal-learning-template-v12-grading-20261120`, xuất phát từ `ULT V1 owner-tested LAB@c7be0c6e003820f775a5ab3332a50622175f65b4`.  
**Quyết định:** `LAB_TRUSTED_GRADING_CONTRACT_PASS_IN_SCOPE`; **không phải** `AUTHENTICATED_GAS_GRADING_PASS` và **NO-GO** phát hành học sinh.

## 1. Yêu cầu, giới hạn và nguyên tắc không mất dữ liệu

- Người sử dụng đã trải nghiệm và xác nhận **OK bản Template LAB V1**, nên V1.2 giữ nguyên các renderer/CSS xuất phát từ `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef` và tạo nhánh kế thừa độc lập, không thay đổi mã nguồn ứng dụng.
- Mục tiêu V1.2: mỗi dạng bài có hợp đồng nhận bản nháp, điều kiện hợp lệ, thuật toán/đáp án tham chiếu **phía Node LAB**, quyền được/không được chấm, và phản hồi không mang đáp án khóa.
- Hai bộ dữ liệu mẫu A/B được khóa trên máy chủ TEST; dữ liệu JSON tự nạp vẫn hiển thị và tương tác được nhưng **không tự động nhận quyền chấm**; trạng thái `trustedData=false` khi nạp JSON ngoài.
- Mã Node TEST dùng **ngân hàng đáp án tổng hợp được lưu trong repository**, vì vậy **không phải kho bí mật** nếu repository công khai. Chỉ dùng để chứng minh sự tách biệt mã chấm khỏi HTML; không dùng cho học sinh.
- Không chuyển đáp án, sao, điểm, quyền học sinh hoặc tiến độ vào `GiaoDien.html`, Google Sheets, Google Drive hay GAS. Không triển khai môi trường nào.

## 2. Ma trận quyền chấm hiện tại

| Route | Hợp đồng kiểm tra bản nháp | Quyền LAB | Lưu ý |
|---|---|---|---|
| D1 | Sáu ô tách–gộp và đổi đơn vị | **NO_GRANT** | Chưa chốt oracle sư phạm cho đủ 6 ô |
| D2 | Từng chữ số đáp số, ID biến thể và ô nhớ tùy chọn | **LAB_CHECKED** | PV100 tổng hợp; ô nhớ chưa tính điểm |
| D3 | Nối một–một đầy đủ, không trùng đầu mút | **LAB_CHECKED** | Mapping A/B chỉ là ngân hàng TEST |
| D4 | Lựa chọn đơn, đúng ID, không lộ nhãn correct | **LAB_CHECKED** | TEST đáp án chọn opt2 |
| D5 | Ghép Tangram | **NO_GRANT** | B5A tương tác đã OK riêng; oracle E04 chưa phê duyệt |
| D6 | Xếp hết thẻ vào đúng vị trí, kiểm trùng | **LAB_CHECKED** | ORDER-only trong A/B |
| D7 | Tất cả dấu so sánh >, <, = và hàng tương ứng | **LAB_CHECKED** | Chỉ các biểu thức mẫu đã kiểm |
| D8 | Độ dài nhập và vạch số 0 trùng điểm A (sai số 2px) | **LAB_CHECKED** | Chính sách căn thước chỉ dành cho TEST, chưa duyệt giáo dục |
| D8A | Bình dung tích thay đổi nước | **NO_GRANT** | Practice/simulation, không đủ bài toán chấm |
| D8B | Cân đĩa động học | **NO_GRANT** | Practice/simulation, không đủ bài toán chấm |
| D9 | Các ô trả lời số lượng/chênh lệch trong biểu đồ | **LAB_CHECKED** | Chỉ chấm trường số, không chấm thứ tự thao tác đếm |
| D10 | Câu lời giải + phép tính G6 + đáp số | **NO_GRANT** | LAB chỉ có adapter bước chọn câu; chưa đạt hợp đồng lời văn đầy đủ |

**7/12 route** có chính sách chấm LAB tổng hợp; **5/12** chưa được cấp quyền, vẫn giữ renderer tương tác. Không suy diễn đây là 7/10 dạng Toán đã chốt sư phạm.

## 3. Kiến trúc đã triển khai

```
Bộ A/B công khai ──validate lessonId/skillId/renderer──> Renderer LAB
              └── bản nháp hợp lệ ──POST same-origin──> Node LAB
                                                        │
                                           Policy 12 route (7 cấp / 5 khóa)
                                                        │
                                     Sổ đáp án TEST nằm ngoài HTML
                                                        │
                                            CHECKED / INCOMPLETE
                                            REJECTED / NOT_AUTHORIZED
```

Các tệp V1.2:
- `qa/universal-template-v12/synthetic-private-bank.cjs`: dữ liệu chấm TEST tổng hợp cho A/B; **không được coi là bí mật**.
- `qa/universal-template-v12/trusted-grader.cjs`: hợp đồng 12 dạng, xác thực phạm vi server source, kết quả không trả đáp án.
- `qa/universal-template-v12/http-grade-boundary.cjs`: giới hạn POST JSON 16 KiB, nguồn gọi `127.0.0.1` cùng Origin, khóa content-type và no-store.
- `qa/universal-template-v12/trusted-grader.test.cjs`: QA 138 assertions, đúng/sai/chưa xong/giả mạo/không có quyền cho A/B.
- `qa/universal-template-v12/browser-grading.test.cjs`: Chrome desktop/mobile, đủ 7 route × A/B, mỗi route thử đúng rồi sai; 8 kiểm tra API lỗi, 28 ảnh.
- `qa/universal-template-v1/build.cjs`, `lab-runtime.js`, `local-server.cjs`, `trusted-grade-lab.cjs`, `contracts.test.cjs`, `browser.test.cjs`: được cập nhật **chỉ trên nhánh V1.2** để phục vụ giao diện/nút chấm theo quyền, với hồi quy 48 tương tác V1 vẫn được kiểm lại.
- `.github/workflows/universal-template-v12-grading.yml`: no-deploy CI, kiểm tra diff không động tới mã ứng dụng hay nguồn V1 đã nghiệm thu.

## 4. Nhật ký thực hiện và bằng chứng FAIL → FIX → PASS

| Mốc | CI/commit | Kết quả và xử lý |
|---|---|---|
| R01 | `54a433b...` | Tạo rubric phía Node, không đưa bank vào HTML |
| R02 | `4980847...` | Hợp đồng 12 route, fail-closed 5 route |
| R03 | `6b08215...` | Kiểm thử adversarial 138 assertions |
| R04 | `5462646...` | Thêm ranh giới HTTP same-origin localhost |
| R05 | `44673123350` | **FAIL**: bài test V1 gửi bản nháp D2/D4 thiếu ID theo hợp đồng V1.2; không hạ tiêu chuẩn an toàn |
| R06 | `fe8a1ac...` | Chỉnh đúng các fixture test V1 theo định danh biến thể/câu hỏi |
| R07 | `44673226072` | **FAIL audit allowlist** vì thay đổi tệp contract test chưa được nêu trong danh mục cho phép; source + 138 assertions đều PASS |
| R08 | `a18f7d8...` | Bổ sung chính xác tên tệp test vào allowlist, không mở quyền sửa root app |
| R09 | <https://github.com/Nguyennth19/new-lop-2/actions/runs/44673271825> | **SUCCESS**, source lock 28 module + 8 CSS, old contract, QA 138 assertions, audit root diff |
| R10 | `d73e8ec...`, `01eb7a1...` | Test-browser mới: 7 route × A/B × desktop/mobile, đồng thời chạy lại toàn bộ LAB V1 |
| R11 | <https://github.com/Nguyennth19/new-lop-2/actions/runs/44673567537> | **SUCCESS**: 138 assertions, 48 tương tác hồi quy V1, **28 cặp thử đúng/sai qua giao diện** (tức 56 lần đánh giá), 8 hàng rào HTTP, 24+28=**52 ảnh** |
| R12 | `V12_QA_REPORT_AND_EXECUTION_LOG_20261120.md` | Lưu hồ sơ này và giải thích giới hạn, rollback |

Artifact đối chiếu R11: `ULT_V12_TRUSTED_LAB_TEST_ONLY`, ID `14600863992`, **6,293,657 bytes**, SHA256 ZIP `29bed1a900f79c82538aada44edbc54237a8f7bd36d8a901d34e260abf957e83`. Mở GitHub Actions của R11 để tải HTML LAB V1.2, hai gói A/B và ảnh/bằng chứng QA.

## 5. Trạng thái cổng nghiệm thu

| Gate | Kết luận |
|---|---|
| G1 — Không thay `be-hoc` và root renderer | **PASS** (Git diff + SHA source) |
| G2 — Thay dữ liệu A/B mà không sửa renderer | **PASS LAB** |
| G3 — 12 route hiển thị, tương tác, không hồi quy | **PASS LAB 48 lượt** |
| G4 — Phân quyền chấm, reject malformed, không xuất answer-key vào HTML | **PASS LAB trong phạm vi 7 route** |
| G5 — POST HTTP ở localhost, kiểm lỗi và origin | **PASS LAB**; **KHÔNG có xác thực người dùng thật** |
| G6 — Chấm 12 route đầy đủ cho học sinh | **NO-GO** |
| G7 — GAS TEST, private bank thực, rate-limit, quyền/phiên đăng nhập | **NO-GO** |
| G8 — Đối chiếu SGK/skill, dữ liệu thật B001–B024, E04/owner sư phạm | **PENDING** |
| G9 — Nghiệm thu UX V1.2 của chủ dự án | **PENDING** (UX V1 đã được chủ dự án xác nhận OK) |
| G10 — Google Sheets, AI Data Builder, JSON publisher/version/rollback | **CHƯA THỰC HIỆN** |

## 6. Đề xuất cổng tiếp theo

**ULT-V1.3 – Data Publisher & Approval Gate (DRY RUN trước):** thiết kế các sheet quản trị chỉ giữ metadata, `lessonId/skillId`, loại dữ liệu, số lượng, QA, phiên bản, `publicJsonUri`, `privateKeyRef`, trạng thái phê duyệt và rollback pointer; dựng validator + JSON candidate/publisher dry-run trước khi tự tạo Big Data. Chỉ dữ liệu được owner ký duyệt mới chuyển vào manifest ACTIVE. Không ghi Sheets/Drive/GAS khi chưa qua TEST và phê duyệt.

**Điều kiện không được bỏ qua:** real trusted grading phải sử dụng kho khóa **không công khai**, xác thực học sinh/phiên, chống phát lại/gửi trùng, rate limit và kiểm thử đối kháng độc lập. HTTP localhost ở đây chỉ là bản hợp đồng để chứng minh luồng, không thay thế bảo mật production.

**Rollback:** giữ `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef` và LAB V1 `c7be0c6e003820f775a5ab3332a50622175f65b4` bất biến; bỏ nhánh V1.2 để quay lại nguồn LAB V1. Không deployment/Sheet/Drive nào đã được ghi.
