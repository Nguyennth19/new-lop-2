# UI20-01 — ĐẶC TẢ HIỂN THỊ VÀ NỘI DUNG BÀI 20
Trạng thái: DESIGN_APPROVED_COUNTS / CONTENT_NOT_YET_BUILT / UI_NOT_YET_ACCEPTED
Ngày: 2026-11-12. Nguồn yêu cầu: quyết định của chủ dự án trong phiên trao đổi 12/11/2026.
Nhánh làm việc: test-b20-bien-the-20261112; chuẩn giao diện bất biến: test-theo-main.
Lưu ý: đây là BLUEPRINT, chưa phải dữ liệu runtime và chưa cam kết các câu đã được phát hành.

## A. Quy định đếm và bố cục
- Bài lớn = một section trong lượt, đánh số Bài 1–3. Mỗi lượt đúng 3 bài lớn.
- Câu con = một bài tập được chấm; số lượng từng lượt 8/8/8/5/9/7 = **45**.
- Sidebar ghi ví dụ "LV1-A · 3 bài"; vùng kết quả ghi số câu con "Đã làm 1/8". Không lấy số section thay cho số ô chấm.
- Trong một bài lớn, hiển thị 2–3 câu con cùng dạng trên một hàng **khi chiều rộng đáp ứng**; màn hình nhỏ tự xuống hàng, không thu chữ đến mức khó đọc.
- Mọi câu con phải có số thứ tự và ID bất biến; layout nhóm KHÔNG được thay đổi thứ tự học.
- Giữ header/sidebar/result panel/dock và CSS từ test-theo-main; không thêm style riêng cho B20. Chỉ mở rộng renderer DÙNG CHUNG nếu dạng tương tác hiện có chưa hỗ trợ.
- Giao diện phải hiển thị câu dẫn dễ hiểu, cỡ chữ phù hợp học sinh lớp 2. Không nhét cả đoạn văn vào grid nhỏ của phép tính.

## B. Ma trận nội dung đã chốt
| Lượt | Bài lớn | Mục tiêu / Renderer | Số câu con | Yêu cầu nội dung và cách hiển thị | Cách chấm |
|---|---|---|---:|---|---|
| LV1-A | 1 Hiểu số nhớ | carry_explained | 2 | Mỗi câu: trình bày phép cộng 2 số hai chữ số, câu dẫn về hàng đơn vị, giải thích 10 đơn vị đổi thành 1 chục; hỏi nhớ bao nhiêu chục; 2 thẻ kề nhau | 1 ô số/câu, đáp án 1 chục, giải thích đúng từng phép |
| LV1-A | 2 Đặt tính rồi tính | vertical_addition | 3 | 3 thẻ đặt tính, cột chục/đơn vị thẳng hàng, ô nhớ, ô kết quả; dùng phép cộng có nhớ phạm vi 100 | Chấm hàng chục/hàng đơn vị/ô nhớ theo quy định rõ |
| LV1-A | 3 Tính nhẩm dễ | mental_addition | 3 | 3 thẻ/câu nhỏ, số đơn giản, một bước, câu dẫn ngắn; không chen bài đặt tính | Chấm kết quả nguyên |
| LV1-B | 1 Đặt tính rồi tính | vertical_addition | 3 | 3 thẻ cùng dạng; thay số, vẫn phạm vi 100 | Chấm từng ô |
| LV1-B | 2 Tính nhẩm cơ bản | mental_addition | 3 | 3 câu, mức tương đương hoặc tăng nhẹ với LV1-A | Chấm kết quả |
| LV1-B | 3 Tính nhẩm nâng cao | mental_reasoning | 2 | 2 câu; có thể chọn cách tách/chục để nhẩm; không vượt bài | Chấm đáp án, lời giải khi cần |
| LV2-A | 1 Đặt tính rồi tính | vertical_addition | 3 | 3 câu, hỗn hợp cấu hình vẫn đúng kiến thức đã học | Chấm từng ô |
| LV2-A | 2 Tính nhẩm | mental_addition | 3 | 3 câu tăng độ đa dạng, trình bày theo thẻ | Chấm kết quả |
| LV2-A | 3 Bài toán có lời văn | word_problem | 2 | 2 câu; mỗi câu đủ đề, tóm tắt, lời giải, phép tính, đáp số, đơn vị | Chấm số hạng, phép tính, kết quả/đáp số và đơn vị theo contract |
| LV2-B | 1 Tính nhẩm | mental_reasoning | 3 | 3 câu trong một bài lớn, tăng độ khó có kiểm soát | Chấm kết quả |
| LV2-B | 2 Lời văn 1 | word_problem | 1 | Đề, tóm tắt, câu lời giải, phép tính, đáp số và đơn vị | Chấm cấu trúc bài giải |
| LV2-B | 3 Lời văn 2 | word_problem | 1 | Bài toán lời văn khác ngữ cảnh/mức suy luận, đủ các phần bắt buộc | Chấm cấu trúc bài giải |
| LV3-A | 1 Thiếu chữ số hàng đơn vị | vertical_missing_unit | 3 | Dạng đặt tính cột; thay một chữ số hàng đơn vị ở số trên/số dưới/kết quả, ô trống nằm đúng vị trí | Chấm chữ số bị che, không chỉ chấm tổng |
| LV3-A | 2 Thiếu chữ số hàng chục | vertical_missing_tens | 3 | Dạng đặt tính cột; thay một chữ số hàng chục ở số trên/số dưới/kết quả, kèm số nhớ khi cần | Chấm chữ số bị che |
| LV3-A | 3 Hỗn hợp trong cột | vertical_missing_mixed | 3 | Đặt tính hỗn hợp chục/đơn vị; có câu nhiều vị trí cần điền khi đã có quy tắc nghiệm duy nhất | Chấm các vị trí và tính nhất quán; chỉ dùng mẫu có nghiệm duy nhất |
| LV3-B | 1 Nhẩm suy luận nâng cao | advanced_mental | 3 | Không dùng bố cục đặt tính; có tìm số thiếu bằng biểu thức nhẩm | Chấm kết quả + kiểm định duy nhất |
| LV3-B | 2 Tính nhẩm kết hợp | advanced_mental_multistep | 3 | 3 câu nhiều bước nhưng trong phạm vi chương trình; hiển thị biểu thức rõ, không tràn chữ | Chấm kết quả và quy tắc phép tính |
| LV3-B | 3 Bài toán có lời văn | word_problem_reasoning | 1 | 1 bài lời văn vận dụng; đầy đủ 6 thành phần như các bài lời văn trước | Chấm theo cấu trúc và kết quả |

**Tổng: 18 bài lớn / 45 câu con.**
**Cách hiểu mục LV3-B:** hai bài lớn nhẩm nâng cao (3+3 câu con), một bài lớn lời văn (1 câu), KHÔNG đặt tính. Số lượng và yêu cầu này bám theo lời chốt của chủ dự án, còn tên bài và độ khó chi tiết là gợi ý cần QA sư phạm.
**LV3-A:** cấu hình 3/3/3 tính theo **9 câu con được chấm**; nếu một câu có nhiều ô trống thì vẫn là một câu, phải kiểm tra nghiệm duy nhất và lưu đủ ô/chữ số.

## C. Mẫu nội dung minh họa và hướng dẫn hiển thị
### Hiểu số nhớ
Tiêu đề: "Bài 1 – Hiểu số nhớ". Câu dẫn: "Khi cộng hai số, em cộng hàng đơn vị trước."
Ví dụ: "Tính 39 + 22. Ở hàng đơn vị: 9 + 2 = 11. 11 đơn vị gồm 1 chục và 1 đơn vị. Em viết 1 ở hàng đơn vị và nhớ 1 chục sang hàng chục."
Câu hỏi có ngữ cảnh: "Em nhớ bao nhiêu chục?" [ô nhập] "chục".
Không dùng dạng cô đọng "9+2=11→nhớ=1" như màn hình cũ. Biến thể thứ hai dùng số khác, cấu trúc giải thích vẫn đầy đủ. Hai câu trình bày trong thẻ riêng, cùng hàng khi đủ chỗ.

### Đặt tính
Dùng renderer cột có sẵn tại test-theo-main; giữ thẳng hàng chữ số, ô nhớ/chục/đơn vị. Bố trí 3 thẻ trên một hàng nếu đủ chiều rộng.

### Nhẩm
Biểu thức số có khoảng cách rõ ràng: "28 + 35 = [ ]", mỗi câu có nhãn; không đưa văn bản dài vào span 78px. Các mức nâng cao có thể dùng "[ ] + 25 = 53" hoặc "18 + 22 + 10 = [ ]" với renderer phù hợp.

### Lời văn
Luôn có sáu thành phần:
1) Đề bài có ngữ nghĩa, đơn vị đúng;
2) TÓM TẮT (các dòng dữ kiện và câu hỏi);
3) BÀI GIẢI (tiêu đề);
4) Câu lời giải hoàn chỉnh;
5) Phép tính có đơn vị, ví dụ "47 + 34 = 81 (chiếc kẹo)";
6) Đáp số "81 chiếc kẹo".
Ảnh chỉ minh họa có thể dùng Asset ID tương đương; ảnh mang dữ kiện phải đúng về số lượng/quan hệ.

### LV3-A – ô số bị che
Không dùng renderer một ô kết quả ở cuối. Tạo mặt nạ ô chữ số đúng vị trí hàng đơn vị/chục của số hạng trên/dưới/kết quả. Tất cả câu đòi xác định chữ số phải có nghiệm duy nhất, kiểm tra bằng solver.

## D. Giao diện, số ô và bộ chấm
- Một câu con có thể gồm nhiều ô nhập (đặt tính, lời văn, puzzle), nhưng được chấm là một câu.
- Sidebar dùng số BÀI LỚN (3); vùng kết quả dùng số CÂU CON (8,8,8,5,9,7).
- Lý thuyết giữ nguyên. Vùng bài, khung kết quả, bàn phím, cỡ font và các lớp CSS chuẩn test-theo-main.
- Thử nghiệm phải chấm đúng/sai và hiện điểm/giải thích, nhưng KHÔNG ghi sao hay tiến độ thật.
- Chấm trên server theo quy tắc phù hợp từng renderer; các dạng che ô phải dùng solver nghiệm duy nhất, không dùng phép so sánh tổng đơn giản.
- Runtime hiện tại chỉ có 30 câu (6/6/5/5/4/4) và **không** có đủ dữ liệu cho 45 câu mới; KHÔNG được đổi nhãn mà giữ nguyên nội dung.

## E. Các cổng nghiệm thu trước khi lập schema dùng chung
1. UI20-01 BLUEPRINT: cấu trúc 18 bài/45 câu, ý nghĩa mỗi câu, renderer, số ô và chấm được chốt.
2. UI20-02 DATA: sinh/duyệt đủ 45 câu hợp lệ, đúng kỹ năng/độ khó, ID không trùng.
3. UI20-03 RENDERER: đủ 6 kiểu trình bày nền tảng và các biến thể LV3-A, không thay đổi shell/CSS chuẩn.
4. UI20-04 SERVER: chấm cả 45 câu đúng/sai, có retry, không ghi dữ liệu chính thức.
5. UI20-05 VISUAL: so ảnh từng lượt desktop/mobile với test-theo-main; không tràn chữ/cột; bài lời văn có đủ phần, bàn phím hoạt động.
6. UI20-06 REGRESSION: renderer cũ vẫn hoạt động; no source overwrite; log QA cùng commit.

Trạng thái hiện tại: **SPEC_DRAFT / AWAITING UI + CONTENT IMPLEMENTATION**. Không tuyên bố RENDER_PASS chỉ từ số liệu mock.
