# Đánh giá TTS tiếng Việt cho Lớp 2 — 11/11/2026

## Kết luận

Ưu tiên thử **VieNeu-TTS v3 Turbo** để **sinh trước audio giọng nữ** cho học liệu cố định. Dự phòng: **Vi-F5-TTS** nếu chất giọng không đạt. Không chạy mô hình Python/PyTorch/ONNX trong Google Apps Script; Apps Script chỉ quản lý metadata và URL file, trình duyệt tải và phát MP3/OGG với play/pause. Tránh API TTS trên mỗi lượt mở bài.

### Cơ sở xác minh
- VieNeu-TTS: https://github.com/pnnbao97/VieNeu-TTS — README xác nhận v3 Turbo mã nguồn mở có 25 preset voices, CPU/GPU, API HTTP tương thích OpenAI và Docker. v4 là độc quyền, **không open-source**. Code repo Apache-2.0; phải kiểm tra riêng model card, tokenizer, phụ thuộc và điều khoản dùng giọng.
- Vi-F5-TTS: https://github.com/danhtran2mind/Vi-F5-TTS — fine-tune mô hình F5-TTS, mã MIT, dùng reference audio/text, PyTorch/Gradio, tác giả thừa nhận một số lỗi ngắt nghỉ và ngữ điệu.
- vietnamese-tts-local: https://github.com/hoangtung386/vietnamese-tts-local — API /api/tts xuất WAV, chạy Ubuntu 24.04 + NVIDIA GPU, Python 3.12; phiên bản triển khai mẫu dùng backbone VieNeu 0.3B Q4/ONNX. Một worker, không hỗ trợ multi-user production theo README.
- wyoming-vietnamese: https://github.com/luuquangvu/wyoming-vietnamese — hệ sinh thái Wyoming/Home Assistant, NghiTTS & ZeroTTS, tự-host offline, cần lớp chuyển giao thức cho web; không chọn làm lựa chọn đầu vì tăng chi phí vận hành.
- vPhon: https://github.com/kirbyj/vPhon — từ chữ Quốc ngữ sang IPA theo Bắc/Trung/Nam, KHÔNG phải engine tạo audio.
- Text2PhonemeFast: https://github.com/manhcuong02/Text2PhonemeFast — Python, G2P/phoneme, hữu ích để phân tích lỗi phát âm, KHÔNG phải engine tạo audio.
- a11y-vietnamese: https://github.com/cmpitg/a11y-vietnamese — mô hình nghiên cứu/chuẩn bị tư liệu ghi âm, repo archived, không dùng production.
- dictionary: https://github.com/minhqnd/dictionary — API từ điển, IPA và TTS từng từ, không phù hợp tạo bài giảng dài; có phân biệt giấy phép mã nguồn/dữ liệu.
- Không xác nhận chất lượng giọng qua README: chỉ chọn sau thử nghe đối chứng trên 3-5 đoạn học liệu tiếng Việt lớp 2.

## Mục tiêu QA giọng cô giáo
1. Giọng nữ tiếng Việt được xác minh bằng nghe, ổn định về vùng giọng và cao độ; không fallback giọng tiếng Anh.
2. Đọc chuẩn: '36 + 17 = 53' → 'ba mươi sáu cộng mười bảy bằng năm mươi ba'; 'LV1' → 'cấp độ một'; ô nhớ/hàng chục/đơn vị; đọc dấu thanh và ngắt câu.
3. Thử nội dung Toán, Tiếng Việt, câu lời văn, câu có số, dấu phép tính và tên riêng.
4. Không clone giọng người thật nếu chưa có sự đồng ý/quyền hợp lệ. Chỉ dùng giọng preset hoặc reference voice được cấp phép.
5. Sản xuất audio ở môi trường offline/server riêng; kiểm định thủ công lần đầu rồi xuất MP3 phù hợp web (mã hóa từ WAV nếu cần).
6. Hash văn bản đã chuẩn hóa + model/version + preset voice; cache audio chỉ thay khi nội dung hoặc voice thay đổi.

## Luồng sản xuất dự kiến
Google Sheets (text + bài) → chuẩn hóa lời đọc theo ngữ cảnh/số/biểu thức toán → hàng đợi sinh audio ngoài Apps Script → VieNeu-TTS/Vi-F5 → kiểm duyệt/duyệt file → lưu MP3 ở storage có URL hợp lệ → bảng Audio_Manifest (audio_id, lesson_id, target_id, text_hash, model_version, voice_id, url, duration, approved, updated_at) → GAS trả manifest → browser Audio() tải/phát, cache tùy trình duyệt.

**Hạn chế kiến trúc**: Apps Script không chạy inference ML native; Google Drive chia sẻ có hạn mức/quyền và không phải CDN audio streaming. Nên cân nhắc Firebase Storage/Cloud Storage hoặc hosting hỗ trợ Range/CORS, kiểm tra quyền truy cập, ngân sách và tính ổn định. GitHub dùng lưu mã/manifest tài liệu, không lưu hàng nghìn audio nhị phân vào repo.

## Thử nghiệm kỹ thuật đề xuất (không tác động phiên bản Web App đang phát hành)
- Chọn 5 đoạn từ Bài Toán 20 (lý thuyết cộng nhớ, cột dọc, toán lời văn, tìm chữ số, chuỗi phép tính).
- Đánh giá 2 giọng nữ VieNeu v3 Turbo và 1 giọng Vi-F5/hoặc 1 giọng TTS thương mại làm mốc theo 5 tiêu chí: rõ dấu (30%), đúng số/phép tính (30%), ngắt nhịp (20%), tự nhiên (10%), đồng nhất (10%).
- Chỉ khi nghe đạt mới tích hợp module 30_AudioPlayer.html + manifest/API, mặc định tắt Web Speech fallback không kiểm soát.
- Thiết lập quyền/giấy phép model và audio trước khi triển khai.
- Kế hoạch QA test tải lần đầu, replay, pause/resume, mạng yếu, chuyển LV, điện thoại; kiểm tra cache URL và đếm lượt fetch.

## Trạng thái
Đã nghiên cứu README/GitHub, **chưa thử chạy model**, **chưa tạo mẫu âm thanh**, **chưa thay thế engine phát trên Web App**. Đây là tài liệu quyết định kiến trúc chứ không phải hoàn tất tích hợp.
