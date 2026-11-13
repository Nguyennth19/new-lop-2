# P0.6-C — QA Engine & Grading Contract đa môn (TEST / OFFLINE)

Ngày: 2026-11-13 (Asia/Ho_Chi_Minh)
Nhánh: `test/p0-6-c-qa-grading-20261113`
Kế thừa P0.6-B; không triển khai mã Apps Script, Web App TEST Version 6, MAIN, `test-theo-main`, production hoặc dữ liệu học sinh.

## Đầu ra
1. `thu-nghiem/p0-6/grading-contract-v1.cjs` — kiểm chứng câu hỏi và chấm thử nghiệm thuần, không IO. Trả `PASS|FAIL|REVIEW_REQUIRED|BLOCKED` khi audit đáp án; trả `CORRECT|INCORRECT|REVIEW_REQUIRED|BLOCKED` khi chấm.
2. `thu-nghiem/p0-6/qa-engine-v1.cjs` — kiểm toán bài theo lesson JSON V1, bằng chứng gồm hash SHA-256 nguồn, source commit tùy chọn, danh sách ID/mã trạng thái, digest biên nhận. Không lưu đáp án học sinh, thông tin cá nhân hoặc token.
3. `thu-nghiem/p0-6/kiem-thu-qa-grading-v1.cjs` — ca kiểm thử đúng/sai/bỏ trống, đáp án tự suy ra, trường hợp cố ý sai, nhiều đáp án được duyệt, rubric, English/Vietnamese cần review và chứng cứ bất biến.
4. `.github/workflows/p0-6-c-qa-grading.yml` — CI độc lập, kế thừa kiểm thử P0.6-B/P0.6-A/P0.4 và Bài 20, đồng thời xác nhận P0.5 Release Gate vẫn fail-closed.

## Nguyên tắc chấm
- **Toán:** Chỉ đánh dấu `PASS` khi phép chứng minh quyết định được, số nguyên an toàn, câu hỏi đã qua duyệt và phép chứng minh được khớp với tham số câu. Hỗ trợ các kiểu phép toán B20: cộng, tổng nhiều số, tìm số hạng thiếu, nhớ sang chục; không thực thi biểu thức tự do.
- **Tiếng Việt/Tiếng Anh – đáp án ngắn:** `normalized_text` hoặc `set_of_answers` chỉ được so khớp văn bản trong tập do người duyệt khai báo, có evidence ref cụ thể và quy tắc chuẩn hóa được cấu hình rõ. Không tự coi từ đồng nghĩa hay câu diễn đạt khác là tương đương. Không bỏ dấu tiếng Việt; không tự đổi hoa/thường khi chưa cho phép.
- **Câu trả lời mở:** `rubric`, `manual_review` luôn trả `REVIEW_REQUIRED` dù đã duyệt rubric. Không tự tính điểm, sao hoặc đoán ngữ nghĩa.
- **Nguồn SGK thiếu đáp án:** `PROJECT_DERIVED` là nguồn đáp án; để được tự chấm phải có phép kiểm độc lập và phê duyệt nội dung. `verification.status=PASS` trong JSON là điều kiện cần nhưng không đủ.
- **Không ghi dữ liệu:** Engine không gọi Sheets/GAS/Web App, không chứa API cấp sao/tiến độ và không xử lý dữ liệu học sinh thật.

## QA và bằng chứng thực
- CI đầu tiên commit `17650c98d414cb6841574fc9c6c97d8093563b06`: SUCCESS.
- Trong kiểm định bổ sung đã phát hiện một ca âm kỳ vọng `BLOCKED` trong khi phát hiện sai lệch toán trả `FAIL`; đã sửa **kỳ vọng kiểm thử**, giữ nguyên mục tiêu an toàn: kết quả tuyệt đối không `PASS`. Hai lượt CI trung gian FAIL được giữ làm lịch sử, không xóa.
- Lượt CI sau sửa tại commit `75ef6cdf0f7b457be67f9c286fafd9bbdbfad9e7`, run https://github.com/Nguyennth19/new-lop-2/actions/runs/43428400824: **SUCCESS**.
- Bộ C có 27 ca kiểm (bao gồm thêm ca chống giả mạo proof và bằng chứng duyệt văn bản), đồng thời kiểm toàn bộ 30 đáp án B20 đúng/sai/bỏ trống.
- CI kế thừa P0.6-B, P0.6-A, P0.4 FULL_SAFE, B20 nguyên bản và cổng P0.5 fail-closed.

## Những giới hạn còn lại
- Đây là bộ kiểm thử offline; chưa kết nối runtime renderer hoặc chấm bài Web App. Không sử dụng biên nhận này để tuyên bố Web App TEST đã chấm mọi môn.
- Xác minh toán độc lập đối với B20 hoạt động trên tham số nguồn/loại câu; với bài mới cần module proof và kiểm toán kiến thức riêng, không tự bật PASS chỉ nhờ schema.
- Đáp án ngôn ngữ nhiều cách diễn đạt/đúng ngữ nghĩa chưa thể tự suy luận; phải duyệt tập đáp án hoặc chuyển đánh giá thủ công.
- SHA-256 biên nhận giúp phát hiện sửa đổi khi so sánh với bản nguồn, **không phải chữ ký số độc lập** hoặc chứng minh người duyệt là giáo viên.
- Release Gate P0.5 vẫn `RELEASE_READY=false`.

## Rollback
- Nếu cần hoàn tác C, chỉ revert các tệp C mới tại nhánh `test/p0-6-c-qa-grading-20261113` (ba module/test và workflow).
- Nhánh `test/p0-6-b-adapter-registry-20261113` là mốc quay lại; không thay đổi B20 `runtime.json`, 30 ID, 6 lượt và đáp án H.1.
- Feature flag của bộ chọn P0.6-B vẫn mặc định OFF; không tác động deployment V6.
- Khi triển khai runtime sau này, cần một cổng phê duyệt riêng, xử lý bài chưa có đáp án/rubric và giữ rollback độc lập theo bài.

## Bước kế tiếp
**P0.6-D — Question Renderer Registry theo dạng câu**: ánh xạ `kind` với renderer có sẵn, có fallback "chưa hỗ trợ" để không dựng sai, kế thừa kiểm thử P0.6-C và không nối Web App cho đến khi QA đạt.
