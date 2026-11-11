# Đánh giá báo cáo nghiên cứu mới về TTS trên Google Apps Script — V3.2

Ngày 11/11/2026. Tài liệu gốc: "Báo Cáo Giọng Đọc Tiếng Việt Trên Google Chrome (1).pdf" (9 trang), chủ dự án cung cấp.

## Kết luận
Không tích hợp nguyên mã trong báo cáo vào Web App chính thức. Ưu tiên tái sử dụng kiến trúc tách backend/frontend, bộ chuẩn hóa văn bản, trình phát HTML Audio, cache metadata và nguyên tắc không fallback giọng tiếng Anh. Phần Google Translate TTS qua endpoint không chính thức chỉ nên xem là thử nghiệm kỹ thuật cô lập, không có cam kết giọng nữ, SLA, tính bền vững, chi phí/quyền sử dụng.

## Đối chiếu theo nội dung báo cáo
- Trang 1–2: `vi-VN` là locale Web Speech thường dùng; một số môi trường đặt mã `vi_VN`. Khẳng định Chrome Desktop mặc định luôn có "Google Tiếng Việt" và Windows luôn cài được "Microsoft An" chưa được kiểm chứng phổ quát.
- Trang 2: chờ sự kiện `voiceschanged` hợp lý, nhưng đã kiểm trên thiết bị mục tiêu: Chrome hiển thị tổng 54 voices, số gắn nhãn tiếng Việt 0. Không được tự fallback sang giọng tiếng Anh.
- Trang 3: kiến trúc 3 tầng. Tầng 1 dùng Google Translate Proxy không chính thức: không bảo đảm tương thích, uptime hay chọn giọng nữ chỉ bằng `tl=vi`; không đưa vào đường đi chính. Tầng 2 Cloud Neural2 vi-VN-Neural2-A là lựa chọn dịch vụ chính thức, có ngưỡng miễn phí nhưng phải kích hoạt billing. Tầng 3 chỉ phát nếu có giọng `vi` đạt yêu cầu, nếu không báo lỗi rõ.
- Trang 4–5: chuẩn hóa ngày tháng, đơn vị, tiền tệ là ý tưởng hữu ích; regex chuyển số tiền `500.000đ` thành `500000 đồng` chưa phải đọc bằng chữ; quy tắc `1/2` có thể là phân số hoặc ngày. Phải thêm tokenizer, number-to-words và quy tắc ngữ cảnh SGK, không cam kết "không bao giờ đọc lẫn tiếng Anh".
- Trang 5–7: cache cả MP3 Base64 vào một khóa `CacheService` vượt giới hạn 100 KB/giá trị cho nhiều bài; ví dụ 2 phút ở 64 kbps ~960 KB MP3/~1.28 MB Base64. Cache chỉ nên chứa URL/hash và metadata. Module frontend `new Audio()` và Map cache hợp lý, nhưng cần đồng bộ play/pause/error, timeout, chống request trùng, iframe policy.
- Trang 8: gắn qua `onclick`, selector hoặc data attribute là lựa chọn giao diện; tránh trộn logic từng môn vào module chung. Không cần sao chép ví dụ có nội dung tiền tệ từ một báo cáo chung vào bài Toán lớp 2.
- Trang 9: API Google Cloud TTS là chính thức, `vi-VN-Neural2-A` nữ. Lưu bí mật trong `PropertiesService` là đúng hướng, nhưng cần xác minh đúng cơ chế auth/billing/phân quyền, quota và giới hạn ký tự trước khi triển khai. Tránh xuất API key ra frontend.

## Nguồn đối chiếu bên ngoài
- Apps Script CacheService: https://developers.google.com/apps-script/reference/cache/cache (100 KB/entry; tối đa 6 giờ, có thể evict trước)
- Apps Script quota: https://developers.google.com/apps-script/guides/services/quotas (URL Fetch hạn mức theo loại tài khoản)
- Google Cloud TTS giá: https://cloud.google.com/text-to-speech/pricing (Neural2 free tier có điều kiện, cần bật billing)

## Kiến trúc thực tế đề xuất cho Lớp 2
Google Sheet (bài + đoạn văn cần đọc) → text normalization (toán, tiếng Việt, tiếng Anh độc lập) → engine TTS chính thức hoặc VieNeu-TTS tự chạy tại máy sản xuất → kiểm duyệt âm thanh giọng nữ → xuất MP3 → lưu audio trong kho file phù hợp → manifest `audio_id, lesson_id, text_hash, voice_version, audio_url, approved` → trình phát HTML Audio play/pause/resume, chỉ tải khi dùng.

Trong giai đoạn kiểm định, làm mẫu 5–10 đoạn Bài 20. Đánh giá trên máy tính Chrome và tablet Android; không thay bộ phát chính hoặc tắt các nút hiện tại trước khi có MP3 đạt chuẩn.

## Trạng thái
Đã đánh giá 9 trang và tài liệu chính thức; **chưa chạy URL Google Translate TTS**, chưa xác nhận endpoint/điều khoản, chưa tạo audio, chưa thay module đang chạy trong Web App. Đây là nghiên cứu/khuyến nghị kỹ thuật, không phải tích hợp chính thức.