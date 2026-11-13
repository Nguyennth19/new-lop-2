# P0.6-E – Multi-Lesson Pilot | Nghiệm thu kỹ thuật có điều kiện
Ngày: 2026-11-13 (Asia/Ho_Chi_Minh)
Nhánh TEST: `test/p0-6-e-multi-lesson-pilot-20261113`
Không chạm Apps Script TEST V6, MAIN, test-theo-main, production, Sheet học sinh, điểm/sao hoặc runtime.json B20 H.1.

## 1. Nguồn, mức đối chiếu, lý do chọn
**Toán Bài 21 – Luyện tập chung:** tra từ Google Sheets `MASTER — Curriculum & Question Type Matrix — Toán 2 KNTT — Survey V0.1`, sheet `CURRICULUM_MAP` (MATH_B021: Luyện tập chung, ôn cộng có nhớ), `SGK_B001_B024_AUDIT` (SGK trang 80–82 theo chỉ mục thứ cấp; VBT 77–79 theo chỉ mục), và `QA_REFERENCE_CASES` (`QA_B021_VALID`, ví dụ `67+3=70`). Bản này có một câu dựa trên ví dụ QA đã ghi và một biến thể toán học `48+7=55`, đều được đánh dấu `PROJECT_ORIGINAL_VARIANT`; không tuyên bố trích nguyên văn SGK.
**Tiếng Việt:** nguồn SGK Tiếng Việt 2 tập 1 có trong Drive (PDF file ID `1qefOcVt-FgZfvWbUxzjyeSdhWjwElq5a`), nhưng chưa trích xuất và kiểm chứng được bài–trang–đoạn cụ thể. Vì vậy ứng viên `tieng_viet_doc_hieu_pilot` dùng đoạn văn **do dự án biên soạn** (“Sáng nay, Lan đến lớp sớm.”) chỉ để thử luồng đọc hiểu; chưa đặt nó vào bài SGK cụ thể. `PROJECT_ORIGINAL_VARIANT`, `PENDING` đối với xác minh nội dung và ký duyệt. Không coi ứng viên này là bài thực tế đã đối chiếu SGK.

## 2. Các file được thêm
- `thu-nghiem/p0-6/pilot/toan_b21.candidate.json`
- `thu-nghiem/p0-6/pilot/tieng_viet_doc_hieu.candidate.json`
- `thu-nghiem/p0-6/multi-lesson-pilot-v1.cjs` – chọn 2 bài bằng Registry, loader allowlist, `lesson-selector-v1`, `validateLesson`, `auditLesson`, `validateProof`, `auditAnswerSpec`, `Question Renderer Registry` chỉ readonly, không input/chấm học sinh.
- `thu-nghiem/p0-6/kiem-thu-multi-lesson-v1.cjs` – 18 ca QA về nguồn, số học, mã bài, bảo vệ nhánh, receipt, XSS, no-write và tương thích B20.
- `thu-nghiem/p0-6/xuat-bien-nhan-pilot-v1.cjs` – in biên nhận hash và mã trạng thái không chứa dữ liệu học sinh.
- `.github/workflows/p0-6-e-multi-lesson.yml` – E + hồi quy A/B/C/D, P0.4 FULL_SAFE, B20.

## 3. Kết quả kỹ thuật và biên nhận
Actions `https://github.com/Nguyennth19/new-lop-2/actions/runs/43430119351`, commit `bea36e3861f0ce90bd40f229a93a88bd67b8b829`.
- B21: `load=PASS`, `contract=PASS`, `READONLY_PREVIEW_PASS`; hai phép tính được kiểm chứng bằng phép cộng từ tham số câu, hai câu `REVIEW_REQUIRED` do chưa phê duyệt sư phạm. source SHA-256 `4c9d7ce1d55b0cd4fe51a2d43f6e2f01d3a0b3cbdf30196264ac5988c46a6b85`; receipt `c7738eb9729b393abccc11206771acf1b61473e220fcdd11eac2e3b53ff3d235`.
- TV: `load=PASS`, `contract=PASS`, `READONLY_PREVIEW_PASS`; câu mở/tập đáp án chưa duyệt `REVIEW_REQUIRED`, không tự chấm. source SHA-256 `2af69ce819f7f440b451fe984250031092e47906e4cc16ddcd268dab59b51b48`; receipt `d4e33d2092fd5e5dc9c6427540dd1d8df3923eb1debc86925ae6ef7ed2ce714d`.
- Hai biên nhận được xuất vào log GitHub Actions; không phải chữ ký số hoặc xác minh sư phạm độc lập.
- Full regression A–D/B20 và Gate fail-closed vẫn được thực thi.
- Không tự gọi `GRADE_PASS` cho bài chưa được ký duyệt, không bật nhập liệu, không cấp sao, không viết tiến độ.

## 4. Quyết định
- **P0.6-E TECHNICAL_PIPELINE: PASS** đối với hai ứng viên TEST trong môi trường offline.
- **CONTENT_SOURCE_VERIFICATION: PARTIAL** (B21 có căn cứ nội dung/chỉ mục và một QA case; TV chưa có bài/trang đã đối chiếu).
- **PEDAGOGY_APPROVAL: PENDING** với cả hai bài; không dùng thử với học sinh.
- **MULTI-LESSON PRODUCTION READINESS: BLOCKED**; `RELEASE_READY=false`. Renderer của bài mới hiện chỉ readonly, chưa có giao diện tương tác hoặc chấm học sinh thực tế.

## 5. Cổng tiếp theo
E.1: SGK/VBT primary page evidence đúng bài Toán 21, đồng thời chọn bài Tiếng Việt và đối chiếu sách bài–trang–đoạn thực tế. Nếu không đủ chứng cứ, giữ TV dưới nhãn `DEMO_ONLY`.
E.2: Duyệt sư phạm và danh sách các đáp án hợp lệ, rồi chuyển `verification.status` và `pedagogyApproval.status` theo người có thẩm quyền, không chỉnh chỉ để mở gate.
E.3: Mở renderer tương tác TEST cách ly với feature flag OFF theo mặc định, kiểm số câu/loại câu và rollback.
E.4: Chỉ cho phép ghi tiến độ/sao sau một đợt release riêng biệt, không gộp với E.

## 6. Rollback
Chỉ cần revert các file E trên nhánh này hoặc checkout `test/p0-6-d-renderer-registry-20261113`. Không cần rollback Web App Version 6 vì chưa triển khai nó. JSON nguồn B20 và cổng P0.5 giữ nguyên.
