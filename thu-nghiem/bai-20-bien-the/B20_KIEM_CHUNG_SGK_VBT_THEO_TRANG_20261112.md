# B20 – KIỂM CHỨNG THEO TRANG SGK/VBT GỐC (2026-11-12)

Trạng thái: SOURCE_VISUAL_AUDIT_COMPLETE_FOR_EXERCISE_TYPE / NOT_CONTENT_TRANSCRIPTION_QA
Phạm vi DUY NHẤT: Bài 20, Toán 2 Tập 1, Kết nối tri thức; chỉ xác minh dạng bài và liên kết trang, không sửa ngân hàng câu hỏi hay ảnh.
Nguồn:
- SGK Toán 2 Tập 1: https://drive.google.com/file/d/1Zfiw7VMZ_34cW1ZfaY3iuoRJLmaEuvfr/view — trang PDF 77–80, số trang sách in 76–79.
- VBT Toán 2 Tập 1: https://drive.google.com/file/d/1YIWc2IJtyQQ-e5w6-Zrzwwik7-EEyqoW/view — trang PDF và trang in 72–76.
- Chỉ mục 33 ID: bảng LOP2_C1_ALL_IN_ONE_JSON_BUILD_B001_B075_20261109, sheet SOURCE_1406 / C1_QUESTION_JSON, lesson_id B020.

## Kết quả
- 33 bài tập đánh số ở cấp bài lớn: SGK 16 (Hoạt động 3 + Luyện tập 5+4+4), VBT 17 (Tiết 1:4; Tiết 2:5; Tiết 3:4; Tiết 4:4). **Một bài lớn thường chứa nhiều câu con**.
- Phân nhóm thành **13 dạng thao tác**. Đây là phân loại chức năng đề xuất dựa trên hình sách, không phải 13 nhãn sẵn có trong C1.
- **5/13 dạng (18/33 bài lớn)** có thể ánh xạ về kiểu tương ứng với UI20-01 sau khi biên soạn/kiểm định nội dung: đặt tính; cộng ngang/nhẩm; cộng ba số; lời văn; điền kết quả chuỗi cộng.
- **8/13 dạng (15/33 bài lớn)** chưa có kiểu tương ứng trực tiếp trong UI20-01: que tính, nhận biết/ghép kết quả, khối lượng, độ dài theo hình, sắp xếp, đường ngắn nhất, tia số, đèn logic.
- **0/33 bài nguồn đủ cấu trúc để phát hành ngay** trên gói C1 (prompt_normalized thiếu, answer checker trống, render_eligible NO). Điều này KHÔNG có nghĩa nguồn SGK/VBT thiếu nội dung; nó có trên PDF, nhưng chưa được nhập vào JSON chi tiết.

## Bảng đối chiếu 33 ID theo 13 dạng
| Code | Dạng | Số bài lớn | Khả năng tương thích UI20-01 | ID nguồn |
|---|---|---:|---|---|
| VERTICAL | Đặt tính / tính theo cột | 9 | Có dạng tương ứng | SGK_B020_H1_E01, SGK_B020_H1_E02, SGK_B020_L1_E01, SGK_B020_L2_E01, SGK_B020_L3_E01, VBT_B020_T1_E01, VBT_B020_T1_E02, VBT_B020_T2_E01, VBT_B020_T3_E01 |
| MENTAL | Tính cộng dạng ngang | 1 | Có dạng tương ứng | VBT_B020_T4_E01 |
| THREE | Cộng ba số | 2 | Có dạng tương ứng | SGK_B020_L2_E04, VBT_B020_T3_E04 |
| WORD | Bài toán có lời văn | 4 | Có dạng tương ứng | SGK_B020_L1_E04, SGK_B020_L3_E04, VBT_B020_T2_E04, VBT_B020_T4_E04 |
| CHAIN | Điền kết quả trong chuỗi phép cộng | 2 | Có dạng tương ứng | SGK_B020_L3_E03, VBT_B020_T4_E03 |
| MATCHSTICK | Chuyển que tính sửa phép tính | 2 | Chưa có renderer tương ứng | SGK_B020_H1_E03, VBT_B020_T1_E03 |
| CHECK_MATCH | Nhận biết phép tính đúng / ghép phép tính với kết quả | 2 | Chưa có renderer tương ứng | SGK_B020_L1_E02, VBT_B020_T2_E02 |
| WEIGHT | Ghép kết quả phép cộng khối lượng | 2 | Chưa có renderer tương ứng | SGK_B020_L1_E03, VBT_B020_T2_E03 |
| MEASURE | Đường đi/đo độ dài theo hình | 2 | Chưa có renderer tương ứng | SGK_B020_L1_E05, VBT_B020_T2_E05 |
| ORDER | Sắp xếp phép tính theo kết quả | 2 | Chưa có renderer tương ứng | SGK_B020_L2_E02, VBT_B020_T3_E02 |
| PATH | So sánh và chọn đường ngắn nhất | 2 | Chưa có renderer tương ứng | SGK_B020_L2_E03, VBT_B020_T3_E03 |
| NUMBERLINE | Nối phép tính với số trên tia số | 2 | Chưa có renderer tương ứng | SGK_B020_L3_E02, VBT_B020_T4_E02 |
| LAMP | Suy luận tô đèn bằng điều kiện tổng | 1 | Chưa có renderer tương ứng | VBT_B020_T1_E04 |

## Kiểm tra phạm vi UI20-01 (18 bài lớn / 45 câu con)
- Hiểu số nhớ: **có minh chứng** từ phần Khám phá SGK trang in 76, ví dụ 36+17 và “6 cộng 7 bằng 13, viết 3, nhớ 1”. **Không phải một trong 33 bài tập đánh số**.
- Đặt tính: có nguồn trực tiếp, nhiều bài.
- Tính nhẩm: có bài “Tính” dạng ngang và ba số; nội dung phải lọc theo phạm vi và độ khó.
- Lời văn: có 4 bài nguồn, nhưng có thể chỉ cho một bước; cần chọn/sửa và kiểm tra tính đa dạng theo LV2/LV3.
- Điền kết quả chuỗi phép cộng: có 2 bài nguồn. **Khác** với LV3-A yêu cầu che chữ số hàng đơn vị/hàng chục trong phép đặt tính.
- LV3-A (thiếu chữ số hàng đơn vị/chục/hỗn hợp trong cột): **không có dạng đúng tương ứng trực tiếp** trong 33 bài; que tính di chuyển không phải cùng một dạng. Cần mẫu dự án mới và solver đảm bảo nghiệm duy nhất.
- LV3-B (nhẩm nâng cao, lời văn): có yếu tố tương tự nhưng yêu cầu độ khó/mục tiêu phải QA; không mặc định bài nguồn đủ để phân bố 3/3/1.

## Các lưu ý phương pháp
1. 33 là bài tập lớn/ID; không được so trực tiếp với 45 câu con của UI20-01.
2. “Phù hợp dạng” không đồng nghĩa copy nguyên câu; “chưa có UI20-01” không có nghĩa không thuộc kiến thức Bài 20. Những dạng thiếu được lưu registry để mở rộng renderer sau này hoặc biến đổi có phê duyệt.
3. Một số hoạt động trong SGK mang tính chọn/so sánh kết quả trong ngữ cảnh, không phải nhẩm số thuần.
4. Phần tiêu đề và vị trí sách in đối chiếu bằng ảnh PDF; không dùng 51 câu Gemini làm chứng cứ.
5. Mã `source_question_id` đã có nhưng các trường nội dung C1 chưa đầy đủ; bước tiếp theo nếu cần tái sử dụng trực tiếp là nhập có chọn lọc dữ liệu từ ảnh SGK/VBT, không tuyên bố đã QA toàn bộ câu con.

## Trạng thái thực thi
- PDF_PAGE_VERIFIED: SGK 77–80 / VBT 72–76
- SOURCE_EXERCISE_CROSSWALK: 33/33 đối chiếu vị trí và loại bài lớn
- UI20_TYPE_COVERAGE: 5 dạng, 18 bài lớn
- UI20_MISSING_TYPES: 8 dạng, 15 bài lớn
- QUESTION_CONTENT_READY: 0 theo trạng thái C1 hiện có
- NO_SOURCE_SHEET_MODIFICATIONS: true
- RUNTIME_B20_NOT_CHANGED: true
