# P0.5-H — Ma trận nghiệm thu sư phạm 30 câu Bài 20
Ngày 13/11/2026 • Nhánh kiểm định `test/p0-5-h-pedagogy-20261113`.
Nguồn dữ liệu khóa nguyên: `thu-nghiem/bai-20-bien-the/runtime.json`, schema `b20-variant-pilot-1.0`, nguồn biến thể `PROJECT_ORIGINAL_VARIANT` (chỉ tham chiếu phạm vi chương trình, không coi là câu SGK chép nguyên).
**Không chỉnh sửa dữ liệu nguồn, bảng học sinh, bộ chấm, CSS hoặc Apps Script deployment.**

## 1. Kết quả độc lập
- **30/30 phép tính và đáp án toán học chính xác**, tính riêng đặc thù câu 001 là đáp số **1 chục được nhớ** (không phải 61).
- **6/6 lượt đúng kế hoạch:** LV1-A 6, LV1-B 6, LV2-A 5, LV2-B 5, LV3-A 4, LV3-B 4.
- **0 lỗi cứng toán học/schema/đơn vị/lượt** trong kiểm định tĩnh.
- **7 ID cần rà soát sư phạm**, chia thành 3 trường hợp về độ khó/gợi ý LV1 và 4 trường hợp câu dẫn "Tính bằng cách thuận tiện".
- Đáp án đều trong phạm vi số học 100; 2 bài có lời văn đều có phép cộng phù hợp, kết quả có đơn vị và diễn giải.
- Trạng thái quyết định: `MATH_DATA_PASS / PEDAGOGY_REVIEW_REQUIRED / OWNER_SIGNOFF_PENDING`, không được chuyển `LABEL_APPROVED` hay `RELEASE_READY` trước khi duyệt.

## 2. Ma trận đầy đủ theo ID
| ID hậu tố | Lượt | Dạng | Phép tính/yêu cầu kiểm | Đáp án | Đánh giá |
|---|---|---|---|---|---|
| 001 | LV1-A | carry | 9 + 2 = 11 → nhớ ? | 1 chục | MATH_PASS |
| 002 | LV1-A | vertical | 67 + 16 | 83 | MATH_PASS |
| 003 | LV1-A | vertical | 37 + 18 | 55 | MATH_PASS |
| 004 | LV1-A | mental | 15 + 78 | 93 | REVIEW: LV1_MENTAL_SCAFFOLD |
| 005 | LV1-A | vertical | 17 + 14 | 31 | MATH_PASS |
| 006 | LV1-A | vertical | 17 + 34 | 51 | MATH_PASS |
| 007 | LV1-B | mental | 47 + 34 | 81 | REVIEW: LV1_MENTAL_SCAFFOLD |
| 008 | LV1-B | vertical | 37 + 24 | 61 | MATH_PASS |
| 009 | LV1-B | vertical | 69 + 26 | 95 | MATH_PASS |
| 010 | LV1-B | mental | 57 + 36 | 93 | REVIEW: LV1_MENTAL_SCAFFOLD |
| 011 | LV1-B | vertical | 15 + 38 | 53 | MATH_PASS |
| 012 | LV1-B | vertical | 39 + 44 | 83 | MATH_PASS |
| 013 | LV2-A | mental | 59 + 34 | 93 | MATH_PASS |
| 014 | LV2-A | mental | 15 + 56 | 71 | MATH_PASS |
| 015 | LV2-A | mental | 19 + 14 | 33 | MATH_PASS |
| 016 | LV2-A | word | 47 + 34 | 81 chiếc kẹo | MATH_PASS |
| 017 | LV2-A | three | 49 + 24 + 11 | 84 | MATH_PASS |
| 018 | LV2-B | mental | 46 + 45 | 91 | MATH_PASS |
| 019 | LV2-B | mental | 16 + 15 | 31 | MATH_PASS |
| 020 | LV2-B | mental | 36 + 55 | 91 | MATH_PASS |
| 021 | LV2-B | word | 34 + 39 | 73 quyển truyện | MATH_PASS |
| 022 | LV2-B | three | 57 + 14 + 15 | 86 | REVIEW: REPHRASE_CONVENIENCE |
| 023 | LV3-A | reverse | ? + 25 = 53 | 28 | MATH_PASS |
| 024 | LV3-A | three | 28 + 39 + 16 | 83 | REVIEW: REPHRASE_CONVENIENCE |
| 025 | LV3-A | reverse | ? + 38 = 97 | 59 | MATH_PASS |
| 026 | LV3-A | three | 14 + 67 + 10 | 91 | REVIEW: REPHRASE_CONVENIENCE |
| 027 | LV3-B | reverse | ? + 68 = 85 | 17 | MATH_PASS |
| 028 | LV3-B | three | 27 + 58 + 13 | 98 | MATH_PASS |
| 029 | LV3-B | reverse | ? + 47 = 65 | 18 | MATH_PASS |
| 030 | LV3-B | three | 26 + 49 + 16 | 91 | REVIEW: REPHRASE_CONVENIENCE |

ID đầy đủ: `VAR_B20_20261112_<ID hậu tố>`. Trạng thái MATH_PASS là kết quả phép toán, **không đồng nghĩa sư phạm đã ký**.

## 3. Phân tầng đánh giá
| Tầng | Số câu | Các dạng | Đánh giá |
|---|---:|---|---|
| LV1 (A/B) | 12 | Nhớ 1 chục (1), đặt tính (8), tính nhẩm (3) | Cốt lõi phù hợp, nhưng 3 câu tính nhẩm 2 số hai chữ số có nhớ có thể khó sớm với người mới học; cân nhắc gợi ý/đổi nhãn |
| LV2 (A/B) | 10 | Nhẩm (6), có lời văn (2), ba số (2) | Tăng tính ứng dụng và dạng bài hợp lý; 1 câu ba số thiếu cặp số thuận tiện rõ ràng |
| LV3 (A/B) | 8 | Tìm số còn thiếu (4), ba số (4) | Dạng vận dụng/nâng cao phù hợp định hướng; 3 câu ba số yêu cầu "thuận tiện" nhưng chưa tạo chiến lược tròn chục rõ ràng |

Yêu cầu cấp chương trình lớp 2 cho phép phép cộng có nhớ và biểu thức hai dấu phép tính. Tuy nhiên việc sử dụng tính nhẩm/cộng ba số/tìm số chưa biết phải phù hợp với **thời điểm học thực tế**, không tự coi tất cả có mặt trong Bài 20 SGK. Đối chiếu tham khảo:
- SGK Toán 2 Kết nối tri thức Bài 20, OLM: https://partner.olm.vn/thu-vien-so/doc-sach/sach.4491472559.4491472559
- Yêu cầu môn Toán lớp 2 CTGDPT 2018: https://navi.edu.vn/thu-vien/wp-content/uploads/2024/08/chuong-trinh-moi-gdpt-2018-mon-toan-lop-2.pdf

## 4. Danh sách đề nghị xử lý (chưa sửa nguồn)
| ID | Cấp | Vấn đề | Hướng xử lý không phá dữ liệu |
|---|---|---|---|
| 004 | LV1-A | “Tính nhẩm: 15 + 78” đòi cộng nhớ ở 2 số hai chữ số | Xem xét đổi nhãn “Tính” hoặc thêm gợi ý tách chục và đơn vị |
| 007 | LV1-B | “Tính nhẩm: 47 + 34” ngay LV1 | Tương tự; không đổi số và đáp án nếu chỉ chỉnh nhãn |
| 010 | LV1-B | “Tính nhẩm: 57 + 36” ngay LV1 | Tương tự; xem thứ tự luyện tập sau câu đặt tính |
| 022 | LV2-B | 57 + 14 + 15, “Tính bằng cách thuận tiện” nhưng không có cặp tròn chục dễ thấy | Ưu tiên đổi câu dẫn thành “Tính” hoặc thay biến thể sau khi xét duyệt |
| 024 | LV3-A | 28 + 39 + 16, yêu cầu tương tự | Tương tự |
| 026 | LV3-A | 14 + 67 + 10, yêu cầu tương tự | Tương tự; có thể tách 10 nhưng không tạo cặp tròn chục rõ |
| 030 | LV3-B | 26 + 49 + 16, yêu cầu tương tự | Tương tự |

**Lưu ý thêm:** Cả sáu câu ba số (017/022/024/026/028/030) có `solution_prompt` chủ yếu ghi phép cộng bằng đáp số, chưa mô tả cách nhóm số, trong khi câu dẫn gợi chiến lược “thuận tiện”. Nên bổ sung **gợi ý hoặc lời giải diễn giải** nếu mục tiêu là kiểm tra chiến lược tính chứ không chỉ đáp số. Các câu 017 và 028 có cặp tạo số tròn chục (`49+11=60`, `27+13=40`) nên không nằm trong bốn cảnh báo câu dẫn.

**Lưu ý về LV3 đảo phép tính:** Các ID 023/025/027/029 đều đúng toán. Cần giáo viên xác nhận học sinh đã được giới thiệu quan hệ cộng–trừ và phép trừ có nhớ trước khi sử dụng LV3; không coi đó là lỗi số học.

## 5. Kết luận bước H và trách nhiệm
- Cổng tính đúng dữ liệu: `MATH_DATA_PASS` (30/30).
- Cổng phân tầng/diễn đạt: `PEDAGOGY_REVIEW_REQUIRED` (7 ID ưu tiên; vấn đề gợi ý 6 câu ba số).
- Cổng nguồn: `CURRICULUM_SCOPE_ONLY`, biến thể gốc của dự án, không tuyên bố khớp từng bài/trang SGK.
- Cổng ký duyệt: `PEDAGOGY_UNSIGNED`.
- Phát hành: `RELEASE_READY=false`.

Người chịu trách nhiệm duyệt nội dung cần lựa chọn `ACCEPT_AS_IS`, `ACCEPT_WITH_NOTES`, hoặc `REVISE_AND_RETEST` đối với các đề nghị ở mục 4, kèm bằng chứng và ngày. Không được tự cập nhật `signedOff:true` qua QA tự động.

## 6. Kiểm chứng và rollback
Chạy `node thu-nghiem/p0-5/closure/audit-pedagogy-b20.cjs` để lấy đủ 30 hàng và cảnh báo, `node thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js` để kiểm chấm. CI đi cùng nhánh chỉ hoạt động TEST. Nếu cần sửa câu dẫn sau duyệt, tạo branch riêng, diff từng ID và chạy lại toàn bộ 30 câu; không chạm PROD, MAIN, `test-theo-main`.
