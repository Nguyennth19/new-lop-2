# P1.2-B — B001–B004: tái sử dụng C4, biến thể DEV và kiểm toán nguồn SGK/VBT

**Thời điểm:** 18/11/2026 · **Trạng thái:** `P12B_DEV_CONTENT_AND_ORIGINAL_VARIANT_CANDIDATES_TECH_PASS_SOURCE_EXACT_OPEN`

**Phạm vi:** B001–B004; tái sử dụng 27 câu C4 có 121 parts và 24 JSON P1.2-A; tạo ứng viên biến thể mới không trích SGK nguyên văn. Không tạo renderer/GAS mới, không ghi Sheet gốc, không thay MAIN.

## 1. Thực hiện và bằng chứng

| Lớp | Kết quả | Bằng chứng / ranh giới |
|---|---:|---|
| SOURCE C1 B001–B004 | **79/79** | 24+16+23+16; giữ nguyên C1 IDs và V1/V2 blobs |
| Nội dung DEV C4 hiện có | **27/27** | 24 B001, 3 B002, 121 part slots; trỏ tới C4_REAL_JSON riêng tư, không xuất đáp án lên GitHub |
| Nội dung C1 chưa có C4 | **52** | 13 B002, 23 B003, 16 B004; lập hàng đợi nguyên mã, chưa nội dung verified/parts/validator |
| Tệp PDF SGK/VBT gốc | **2/2 SHA-256** | Tải trực tiếp Drive và băm bytes, đối chiếu mọi C1 sourceId/fileId/hash |
| Chỉ mục 79 ứng viên ↔ file và trang PDF | **79/79** | Trang liên quan được render/kiểm bằng hình; không ký duyệt nguyên văn từng câu |
| Hình thức/ý đồ 52 câu thiếu nội dung | **52/52** | Từ hình trang gốc, 31 renderer IDs đề xuất và 21 chưa có route; tất cả DENY |
| Công thức biến thể mới | **8 family** | Sáng tạo độc lập, giữ nguyên nguồn SGK/VBT; không giả sourceExact |
| Biến thể xem trước | **32 DEV** | 8 cho mỗi bài; renderer tham chiếu D4 ở TEST, 0 publicVariant được cấp quyền |
| Sai lệch scoring ước lượng | **2 cần sửa** | `SGK_B001_L2_E01`, `SGK_B001_L2_E02`: policy NO_AUTO_GRADE ↔ generic scoring flag true |
| Đáp án C4/private chuyển lên GitHub | **0** | Chỉ ID/vị trí cell, part types; giữ answer/private ở Sheet trusted |
| Nghiệm thu source exact/renderer/GAS/học sinh | **0** | Gate giữ nguyên: NO-GO |

## 2. Ma trận chi tiết

| Bài | C1 ứng viên | C4 DEV đã dựng | C1 chờ hydrat hóa | Mẫu xem trước mới | Ghi chú |
|---|---:|---:|---:|---:|---|
| B001 – Ôn tập các số đến 100 | 24 | **24** | 0 | 8 | 2 trường hợp ước lượng phải NO_AUTO_GRADE; chưa ký source exact |
| B002 – Tia số, số liền trước/sau | 16 | **3** | **13** | 8 | Tia số và bảng số cần renderer ngữ nghĩa có chứng cứ |
| B003 – Thành phần cộng/trừ | 23 | 0 | **23** | 8 | Bảng phép tính, cột, hình màu và bài toán có lời văn phải phân tách renderer |
| B004 – Hơn, kém nhau bao nhiêu | 16 | 0 | **16** | 8 | Hình đếm con vật, đo chiều dài, lời văn phải xác minh đơn vị/count |

## 3. Nguồn PDF thực đã kiểm

- SGK Toán 2 Tập 1, Drive ID `1Zfiw7VMZ_34cW1ZfaY3iuoRJLmaEuvfr`, SHA-256 `cb8cb303294edc0be2f36a9507965b59345c0d53c296d610858e7454dfa8321e`.
- VBT Toán 2 Tập 1, Drive ID `1YIWc2IJtyQQ-e5w6-Zrzwwik7-EEyqoW`, SHA-256 `7c77820bb52a9f59b790180a16adc8231993768f59a16bb86084bb2f65f171cf`.
- Tất cả 79 C1 source records ghi đúng hai file ID/hash này; 12 trang PDF SGK khác nhau và 17 trang PDF VBT khác nhau đã được xem ảnh. Với SGK, trang in thường là trang PDF trừ 1; VBT trang in trùng trang PDF trong phạm vi khảo sát.
- **Không** đưa hình trang sách hay nội dung đáp án cá nhân từ PDF/Sheet vào GitHub. Phải tiếp tục đối chiếu chính xác bài con, chữ đề, slot, giá trị hình và chính sách đáp án trước khi cấp source exact.

## 4. Bảo vệ nghiệm thu cũ và giới hạn biến thể

- 27 câu C4 vốn đã DEV QA trong C4; lần này khớp ID, PDF trang, 121 parts. Giữ nguyên trạng thái `DEV_ONLY`, không làm lại logic đã PASS.
- 32 preview mới **là 32 câu toán gốc sinh từ 8 quy tắc**, không phải 32 câu đã nghiệm thu SGK/VBT; không gắn nhãn LV3 nếu chưa có nguồn tham khảo và giáo viên duyệt.
- Preview dùng schema public display G7.6 làm **hợp đồng dữ liệu xem trước** và chỉ ứng viên D4. Không kết nối D4 thực trong GAS, không dùng browser grading, không cấp publicVariant.
- B004 có nhiều bài đếm vật thật và giải toán có lời văn. Mẫu D4 lựa chọn trong DEV **không thay thế** G6/D10 scaffolding hoặc count-safe pictograph; mapping còn chặn là có chủ ý.
- Hai cảnh ước lượng đang có cờ `answer.scoring_enabled=true` trong C4 mặc dù sư phạm ghi `NO_AUTO_GRADE`; ở P1.2-B tất cả projection đều DENY, không bật chấm tự động trước khi kiểm chính sách server.

## 5. Hồ sơ tạo mới

- [Định vị nội dung 27 DEV, 121 phần](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_C4_27_CONTENT_HYDRATION_REFS.review.v1.json)
- [79 nguồn C1 / C4 source admission](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_B001_B004_79_SOURCE_ADMISSION_QUEUE.review.v1.json)
- [79 chỉ mục PDF hash và trang gốc](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_PRIMARY_PDF_HASH_AND_PAGE_79.review.v1.json)
- [52 nhãn ngữ nghĩa có bằng chứng hình trang](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_52_SOURCE_SEMANTIC_REVIEW_CANDIDATES.review.v1.json)
- [8 công thức biến thể nguyên bản](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_ORIGINAL_VARIANT_RECIPES_8.review.v1.json)
- [32 biến thể DEV xem trước](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_ORIGINAL_VARIANT_PREVIEWS_32.review.v1.json)
- [Mã tái sinh và QA 32 câu](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/original_variant_preview_generator.cjs)
- [Checkpoint P1.2-B](https://github.com/Nguyennth19/new-lop-2/blob/test/p1-2-b-b001-b004-content-variants-20261118/qa/p1-2-b/P12B_B001_B004_CHECKPOINT_20261118.json)

## 6. Việc cần thực hiện tiếp (không dựng lại hệ thống)

**P1.2-B.2 – Source-exact và nội dung của 52 câu đang thiếu:**

1. B002: rà 13 câu SGK/VBT theo PDF được pin; chuẩn hóa tia số, bảng liền trước/sau, hình lựa chọn; kiểm component đủ hợp đồng.
2. B003: rà 23 câu; phân tách D2 cột, D3 ghép, D9 đếm màu, D10 lời văn; giữ ước lượng/đếm màu cần proof.
3. B004: rà 16 câu; ưu tiên số lượng con vật, khác biệt chiều dài, câu lời văn và đơn vị; nguồn hình không có count-proof thì không dùng hình asset minh họa để tính chính xác.
4. Trước khi cấp publicVariant: ký độc lập từng câu, xác nhận per-question skillId/renderer/asset, chấm trusted GAS, kiểm trực quan và phê duyệt sư phạm đúng scope.

**Rollback:** bỏ nhánh `test/p1-2-b-b001-b004-content-variants-20261118`, quay về P1.2-A `1a550444a188697cef5ae1ce007e4c7f8b11946d`; không có thao tác cần khôi phục trên MAIN/GAS/Drive/điểm sao.

**Kết luận:** `P12B_DEV_QA_PASS · SOURCE_BOOK_PDF_SHA_PAGE_PASS · 52_SOURCE_EXACT_AND_CONTENT_OPEN · 32_DEV_ORIGINAL_PREVIEWS_PASS · STUDENT_RELEASE_NO_GO`.
