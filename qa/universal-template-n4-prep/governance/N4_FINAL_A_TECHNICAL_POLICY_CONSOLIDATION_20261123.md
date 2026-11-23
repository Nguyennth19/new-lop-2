# N4-FINAL-A — Technical & Policy Consolidation

Canonical Google Doc: https://docs.google.com/document/d/1jV-dsKvpqbsZcwP4RJFj4bv7-1GAOBOh24gGm42lPrE/edit
Revision: AHj4eMQzjDJ9E7WTmIPCsRbnUNi_7VQ1agkPqANvOuNs5lGHyXAdt3tGH-cWNdJbwUPyMhlyRRkWmaqwLEYBKbBsxlVmbBcTdVqmkW8iLA
CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/45131772681
ZIP Drive: https://drive.google.com/file/d/1FjZuZwpJE5MwItuQZpUKwbeh23rP9ixt/view
This document is a read-only evidence mirror; proposals are **not** authenticated human policy approvals.

N4-FINAL-A — TECHNICAL & POLICY CONSOLIDATION
Dự án Lớp 2 / ULT V1 | 23/11/2026 GMT+7
Mã hồ sơ: ULT-N4-FINAL-A-20261123-V1
Trạng thái: TECHNICAL_CONSOLIDATION_PASS_WITH_GATES; OWNER_POLICY_APPROVAL_PENDING; INDEPENDENT_QA_PENDING; NO_GO_INTEGRATION_RELEASE.
Đây là hồ sơ tổng hợp kỹ thuật do AI lập, không phải chữ ký QA, phê duyệt sư phạm cuối hoặc cấp quyền phát hành.
1. PHẠM VI VÀ NGUYÊN TẮC
N4-FINAL-A gộp W1-03/04/05, kiểm chuyên sâu D10 và chốt một PHƯƠNG ÁN KỸ THUẬT DUY NHẤT cho hai chính sách D1/D10. Không mở N4-C.7-D/E/F, không thiết kế lại giao diện đã Owner chấp thuận.
Kế thừa baseline chính từ N4-C.7-C: ed4c89704a2568903d5e24d836a9ef538898a56f. Nhánh riêng: lab/ult-n4-final-a-technical-policy-20261123. Mã renderer/CSS nguồn be-hoc tiếp tục byte-frozen.
RTM nguồn chuẩn 10.495 bytes SHA256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b:
https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view
Sổ ký nhận con người duy nhất (không sao chép): https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
Master QA Index: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit
2. BẰNG CHỨNG CI THỰC
Mới N4-FINAL-A: https://github.com/Nguyennth19/new-lop-2/actions/runs/45131772681 — SUCCESS.
Log xác minh: ULT_V1_BUILD_SOURCE_LOCK_PASS (28 modules + 8 CSS; 12 routes); ULT_V1_CORE_CONTRACTS_PASS (24 core compiles); N4_FINAL_A_D10_BROWSER_PASS (8 scoped cases, grading NO_GRANT); N1A_ADDENDUM 8 cases/0 failures; ULT_R1_R2_BROWSER_STATE_AND_MODES_PASS 48 checks/20 screenshots; scope guard PASS.
Bằng chứng ZIP N4-FINAL-A: https://drive.google.com/file/d/1FjZuZwpJE5MwItuQZpUKwbeh23rP9ixt/view
Thư mục checkpoint cấp ngang trong QA archive: https://drive.google.com/drive/folders/1YrLny7mAGYg5FAscrmPWxBaKElog1yTE
CI W1-03 sẵn có: 45118577956 (31 focused D1/D10, 48 R1/R2, 8 N1-A), 45119493865 (D10 inputMode, '-' Unicode draft).
W1-04 sẵn có: 45114546368 (WebP/SVG local binary Chromium) và 45114449881 (live-origin representative SHA/MIME), đều SUCCESS.
W1-05 sẵn có: 45115735605 (24 matched before/after pairs) và N4-C2 exact RGBA 20/20 parity; Owner xác nhận 4 cặp D1/D10 và đánh giá trải nghiệm LAB trên điện thoại tốt qua chat.
3. W1-03 — D10 PHƯƠNG TRÌNH NGANG MỘT PHÉP TÍNH VÀ ĐÁP SỐ
RTM W1-T05 yêu cầu mẫu cộng/trừ một phép tính, hỗ trợ đọc màn hình, giữ 5 trường nhập, snapshot parity và Owner phê duyệt hình ảnh, D10 grading vẫn NO_GRANT.
Mới xác minh trên Chromium desktop1366/mobile390: 8 trường hợp (3 toán tử +, ASCII -, Unicode − và 1 trường hợp hai phép toán bị từ chối trên mỗi viewport).
FIVE FIELDS: n1, op, n2, sum, answer. Nhãn aria-label tương ứng là Số thứ nhất, Dấu phép tính cộng hoặc trừ, Số thứ hai, Kết quả phép tính, Đáp số. Equation có role=group và aria-label Phép tính một bước. Có câu dẫn, tóm tắt và câu lời giải chọn được.
Mẫu cộng 12 + 6 = 18 và mẫu trừ 12 - 6 = 6 / 12 − 6 = 6 được nhập thử và thấy draft lưu nguyên giá trị. Ban kiểm tra này không tự xác nhận kết quả chấm toán học của trusted server; chỉ kiểm việc nhập/lưu và ý nghĩa trình bày. Fixture hai phép tính bị từ chối D10_ONE_STEP_ONLY. Đáp số và phông 16 px, không tràn ngang ở viewport thử.
N4-C1 Owner đã xác nhận 4 ảnh D1/D10; N4-C3B Owner đã thử điện thoại theo hướng dẫn và đánh giá tốt. Chưa có xác minh screen reader VoiceOver/TalkBack thực; việc có aria-label không đồng nghĩa chứng minh navigation/accessibility đầy đủ.
PHÁN QUYẾT: W1_03_SCOPED_TECHNICAL_PASS, OWNER_VISUAL_ACCEPTED_VIA_CHAT; INDEPENDENT_A11Y_UX_QA_PENDING, FORMAL_RTM_CLOSURE_PENDING.
4. W1-04 — ẢNH NHỊ PHÂN THẬT, NGỮ NGHĨA ĐẾM ĐÚNG
RTM W1-T06A/B/C: tải/giải mã asset local có naturalWidth > 0, HTTP origin/404 fail, FLUENT:red_apple allowed với EXACT_COUNT và sách/mismatched countUnit/symbolValue phải fail closed.
Phạm vi đã có: N4-A CI local 45114546368 SUCCESS (asset thực trong browser); N4-A live-origin 45114449881 SUCCESS trên mẫu nguồn đại diện; test R1/R2 ở CI hiện tại tiếp tục PASS các trường hợp semantic/exact-count và fail-closed fallback.
Giới hạn: không suy rằng toàn kho WebP/Fluent đã có chứng minh HTTP live từng tệp; không tự đóng một hàng RTM chỉ do vài binary smoke test. Đánh giá asset nguồn đầy đủ phải dựa vào manifest + nguồn + checksum riêng, không lấy CI W1-04 làm kiểm toàn kho.
PHÁN QUYẾT: W1_04_SCOPED_BINARY_AND_SEMANTIC_QA_PASS; QA_INDEPENDENT_SIGNOFF_AND_FULL_W1_T06_COVERAGE_REVIEW_PENDING.
5. W1-05 — 24 CẶP ẢNH VÀ TRẢI NGHIỆM OWNER
RTM W1-T07: 12 route × desktop/390px = 24 BEFORE + 24 AFTER; cùng fixture/viewport/mode/zoom, so ảnh và Owner ký duyệt phạm vi.
N4-B CI 45115735605 tạo bộ 24 cặp, N4-C.2 kiểm 20/20 cặp còn lại exact decoded RGBA, N4-C1 Owner xác nhận 4 D1/D10; N4-C3 Chromium tương tác PASS; N4-C3B Owner thử LAB điện thoại và cho phản hồi tích cực.
Khác biệt: phản hồi Owner trong chat là chấp thuận phạm vi trải nghiệm họ mô tả, không đủ để chứng minh tên máy, OS, trình duyệt, từng route và chữ ký QA độc lập.
PHÁN QUYẾT: W1_05_AUTOMATED_VISUAL_AND_OWNER_CHAT_ACCEPTANCE; FORMAL_OWNER_IDENTITY_BOUND_AND_INDEPENDENT_QA_PENDING; W1_05_STAYS_OPEN.
6. KẾT LUẬN CHÍNH SÁCH D1 — PHƯƠNG ÁN KỸ THUẬT ĐƯỢC CHỌN ĐỂ TRÌNH DUYỆT
CHỌN KẾT HỢP A+B (proposed locked technical direction):
A. Learner presentation adapter ánh xạ slotId theo ngữ nghĩa lesson/skill/variant thành tên dễ hiểu với học sinh; nhãn active slot là nhãn mô tả, không xuất “t1_split1”.
B. Learner-only release gate chặn fail-closed nếu text hiển thị thực tế hoặc accessible name lộ token nội bộ “t1_...” hoặc thông báo “TEST: chỉ thu ô nhập...”.
Duy trì LAB diagnostic, không chỉnh code frozen be-hoc, không dùng CSS global display:none, không chặn chuỗi có trong mã nhưng không xuất hiện ở learner DOM/a11y tree. Mỗi mapping phải dựa vào 6 slot thực theo public plan, không phỏng đoán sư phạm.
Không ghim sticky keypad hoặc tách bài; Owner đã đánh giá trải nghiệm mobile ổn. Không phát hành learner khi các nhãn kỹ thuật chưa được chặn hoặc đổi.
MỨC QUYẾT ĐỊNH: TECHNICAL_DESIGN_SELECTED_FOR_OWNER_AND_PEDAGOGY_SIGNOFF; IMPLEMENTATION_NOT_AUTHORIZED; POLICY_HUMAN_APPROVAL_PENDING.
7. KẾT LUẬN CHÍNH SÁCH D10 — PHƯƠNG ÁN CHUẨN HÓA ĐƯỢC CHỌN ĐỂ TRÌNH DUYỆT
CHỌN enum canonical ADD/SUB với allowlist: '+' U+002B => ADD; '-' U+002D => SUB; '−' U+2212 => SUB. REJECT U+2013 en dash, U+2014 em dash, chữ lạ, nhiều toán tử, giá trị rỗng và dữ liệu sai schema. Không tự coi các dấu khác tương đương toán tử.
Client adapter có thể hỗ trợ normalize/presentation, nhưng trusted server PHẢI thực hiện parse/validate/normalize độc lập theo allowlist và kiểm lessonId/skillId/variant/bank revision, giới hạn phép một bước, số và đơn vị, kiểm câu trả lời trên server. Không tin “sum”, answer hoặc enum do client cấp làm đáp án đúng; không lộ private answer key qua publicVariant. Kiểm negative/tamper/replay trước khi cho phép chấm thực.
Không thay bố cục D10 vì Owner đã duyệt; nút +/− nhanh chỉ là watchlist UX nếu thiết bị thật báo khó nhập.
MỨC QUYẾT ĐỊNH: TECHNICAL_CONTRACT_SELECTED_FOR_OWNER_AND_TRUSTED_GRADING_AUTHORITY_SIGNOFF; NOT_IMPLEMENTED; PRIVATE_GRADER_NOT_PROVED; RELEASE_NO_GO.
8. GATE VÀ BÀN GIAO N4-FINAL-B
W1-03: TECH_SCOPED_PASS, formal QA/Owner signoff PENDING.
W1-04: TECH_SCOPED_PASS, exact RTM T06 evidence review/human signoff PENDING.
W1-05: visual evidence & Owner CHAT accepted, independent reviewer/formal close PENDING.
D1/D10: hai phương án kỹ thuật đã chọn để duyệt; chưa có phê duyệt có thẩm quyền và chưa triển khai; learner exposure & trusted grading vẫn BLOCKED.
N0-S A3/A4: PENDING identity-bound timestamp and receipt.
DB-01..05: giữ nguyên theo RTM gốc, không suy hoàn thành DB từ N4.
Khuyến nghị N4-FINAL-B: rà soát đủ bằng chứng theo cổng, lấy xác nhận người thật vào sổ ký duy nhất, khóa commit và lập một biên bản closure/handover duy nhất. Kết quả có thể là N4 CLOSED nếu đủ ký nhận hoặc N4 TECHNICALLY_READY/HUMAN_GATES_PENDING và chỉ GO chuẩn bị N5 trên LAB tách biệt.
KHÔNG làm ở N4-FINAL-B: dựng lại UI, chạy lại toàn bộ CI PASS khi nguồn không thay đổi, tự phê duyệt D1/D10, merge #14..#23, dùng GAS/Sheets learner hoặc phát hành.
9. DUAL ARCHIVE CONTRACT
Báo cáo Drive là bản cộng tác; GitHub Markdown là snapshot có SHA/Google Doc revision và liên kết chéo. PR Draft bảo toàn lịch sử. Người thứ 3/4 đọc Master QA Index → report FINAL-A → CI/ZIP → ký nhận. Không sao chép chữ ký/tài khoản cá nhân lên GitHub; nếu thiếu một phía phải ghi SYNC_PENDING.