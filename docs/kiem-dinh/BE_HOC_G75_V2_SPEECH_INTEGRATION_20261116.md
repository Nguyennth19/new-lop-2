# BE-HOC / G7.5 V2 – Kết nối nút nghe cho bài Toán
Ngày 2026-11-16. Nguồn: be-hoc@40bac7e3452492fad74c8b1982206c96a6797f7d. V2 SHA 605a8ed9b335526af82c8870dca4753bd511b913.

## Phạm vi
- Đã nối normalizer G7.5 V2 **byte-for-byte** vào raw Apps Script partial `44_G75_NormalizerToanV2.html`. Browser/controller ở `45_DieuKhienGiongDocToan.html`; CSS `46_CSS_GiongDocToan.html`, chỉ phạm vi #mathFullScreen.
- Nút **🔊 Nghe** cạnh câu đặt tính, nhẩm, lời văn, điền chữ số; nút **Nghe hướng dẫn** trên trang lý thuyết. Chỉ chạy do người học bấm; bấm lần nữa dừng, rời bài / đổi tab dừng.
- Câu văn đọc từ `ml-word-head p`, bài nhẩm từ chuỗi **đã hiển thị** trong row (không lấy giá trị input), đặt tính đọc hai toán hạng **đã hiển thị**; bài tìm chữ số trống đọc hướng dẫn chung; lý thuyết lấy tiêu đề và danh sách bước đang hiển thị. Không bao giờ truy cập `q.answer`, `solutionPrompt`, key chấm, điểm, sao, input, dữ liệu học sinh hoặc API máy chủ.
- Sử dụng Web Speech API của Chrome / thiết bị; cần tiếng Việt `vi-VN`, nhưng danh sách giọng tùy hệ điều hành. Không tải thư viện TTS từ internet. Không tự phát âm khi mở bài.
- Hệ thống đang xây trên nhánh `be-hoc`, chưa deploy GAS.

## Điều kiện nghiệm thu
Node unit kiểm tra trích nội dung, V2 normalization, stop/cancel, không chứa truy cập đáp án/điểm/network; Chrome desktop 1366px và viewport mobile 390px kiểm tra nút nhận click, text được gửi tới speechSynthesis stub, không tràn màn hình. **Browser stubbing chứng minh API invocation, không phải âm thanh phát ra từ loa**. Trải nghiệm âm thanh thực tế trên Windows/Android/iOS cần người dùng mở bản GAS TEST và nghe.

## Gate
C07/C08/C09, grader, điểm/sao, P0.6, manifest, main/test-theo-main: unchanged; NO-GO GAS release cho đến khi manual smoke.
