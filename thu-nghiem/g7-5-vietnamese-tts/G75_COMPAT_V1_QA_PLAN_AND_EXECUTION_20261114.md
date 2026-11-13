# G7.5 – VIETNAMESE TTS COMPATIBILITY TEST V1 – KẾ HOẠCH & BIÊN BẢN THỰC THI
Ngày 2026-11-14. Phạm vi: TEST ĐỘC LẬP. KHÔNG deploy / sửa Web App TEST Version 6.
Reference: `G75_WEB_SPEECH_API_VIETNAMESE_REFERENCE_V1_20261114.md`, SHA nguồn HTML `78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced`.
Branch: `test/g7-5-vi-tts-compat-v1-20261114`.
P0.6 frozen: `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2`. RELEASE_READY=false.

## 1. Tài sản trong bộ thử
- `compat-v1/G75_VietnameseSpeechService.js`: module Web Speech API thử nghiệm, chọn giọng `vi-VN` rõ ràng, xử lý `voiceschanged`, `onstart`/`onend`/`onerror`, chống event cũ khi đổi câu.
- `compat-v1/G75_TTS_Compatibility_Preview.html`: phòng thử browser độc lập, phát câu thường/Toán/đơn vị đo, thống kê voice và ghi nhận người thật nghe hay chưa. Chỉ lưu báo cáo khi người QA bấm sao chép; không network.
- `compat-v1/G75_GAS_TestServer.gs`, `G75_GAS_Compatibility_Preview.html`, `G75_SpeechService_JS.html`: bộ Apps Script **mẫu cho dự án GAS mới độc lập**, dùng `HtmlService.createTemplateFromFile`. KHÔNG thêm `doGet` này vào dự án đang chạy, vì trùng entrypoint.
- `compat-v1/G75_SpeechService.test.cjs`: mock tests unit.
- `.github/workflows/g7-5-vi-tts-compat-v1.yml`: CI read-only syntax + unit mock + GAS template static, xuất artifact 14 ngày. CI này **không** chứng minh giọng Việt có sẵn hay người dùng nghe âm thanh.

## 2. Quy trình tái hiện một cách an toàn
A. Standalone HTML: tải **cùng thư mục** `G75_TTS_Compatibility_Preview.html` và `G75_VietnameseSpeechService.js`, mở qua một web server local HTTPS/localhost hoặc môi trường test tương đương; bấm nút nghe; ghi rõ thiết bị/browser và chọn radio người nghe. Một số trình duyệt hạn chế file:// nên nếu file:// không chạy phải thử qua localhost.
B. Apps Script TEST độc lập: **không** dùng project/clasp đang deploy Version 6. Tạo một dự án Google Apps Script thử riêng theo chủ ý chủ dự án; copy nội dung ba file GAS tương ứng vào files tên `G75_GAS_TestServer.gs`, `G75_GAS_Compatibility_Preview.html`, `G75_SpeechService_JS.html`; kiểm tra template không còn `<script src>` bên ngoài; deploy **riêng** dưới TEST với quyền truy cập hạn chế; bấm phát qua giao diện `HtmlService` rồi xuất phiếu QA. Không deploy tự động trên cuộc kiểm tra này.
C. Ghi phiếu QA ẩn thông tin nhạy cảm; không thu log nội dung học sinh. So sánh cùng câu/cùng thiết bị giữa standalone và GAS, tách lỗi voice availability khỏi sandbox/user gesture.

## 3. Các cổng kiểm thử
| Gate | Tiêu chí | Kết luận hiện tại |
|---|---|---|
| G75-QA-00 | Parse JS, mock voice selection, no-voice, unsupported, lifecycle, cancellation, static GAS contract | CI_PENDING/VERIFY_RUN |
| G75-QA-01 | Desktop Chrome, có vi-VN thật, người QA xác nhận nghe rõ các dấu | PENDING_REAL_DEVICE |
| G75-QA-02 | Android Chrome, nghe tiếng Việt số và toán, không lặp phát âm | PENDING_REAL_DEVICE |
| G75-QA-03 | iOS Safari, có giọng Việt và sự kiện callback thích hợp | PENDING_REAL_DEVICE |
| G75-QA-04 | GAS HtmlService iframe trên project TEST mới, người QA xác nhận thực sự nghe được | PENDING_ISOLATED_GAS_DEPLOYMENT |
| G75-QA-05 | So sánh standalone vs GAS cùng browser; thoát câu khi đang đọc và bấm lặp | PENDING_E2E |
| G75-QA-06 | MathSpeechFormatter đọc 0–1000, đơn vị đo, dấu toán được kiểm chứng giáo viên | NOT_IMPLEMENTED; PENDING_PEDAGOGICAL_QA |

**Không kết luận `COMPATIBILITY_PASS` khi chưa có G75-QA-01 và QA-04 trên thiết bị thật.** Lỗi thiếu voice phải giữ kết quả NO_VI_VOICE/VOICE_LOADING_OR_UNAVAILABLE; không tự đọc bằng tiếng Anh. Có thể thử fallback âm thanh file riêng sau quyết định khác.

## 4. Mẫu biên bản QA thủ công
- Run ID: G75-MANUAL-___
- Tester: người có thẩm quyền (do chủ dự án cung cấp; không tự bịa).
- Date/time device: ___ (không tự dùng thời gian máy chủ).
- Browser/OS: ___
- Surface: STANDALONE / GAS_HTMLSERVICE_TEST
- `getVoices()`: count ___, matched vi-VN voice name ___
- Prompt heard (natural Vietnamese tones): PASS / FAIL / UNTESTED
- Math expression heard: PASS / FAIL / UNTESTED
- Unit words heard: PASS / FAIL / UNTESTED
- onstart/onend/error log: ___
- User gesture / repeat / cancel / question transition: ___
- Console redacted / screenshot/link: ___
- Signoff: ____
- Gate: PASS/FAIL/PENDING

## 5. Cổng ra trước P1
Only if QA-00–05 required devices/Apps Script evidence and QA-06 (if math formatter planned) reach explicit acceptance: submit TEST-only integration decision to owner. Never change existing `RELEASE_READY=false`, scoring, P0.6 closure, main, test-theo-main or Web App TEST Version 6. Until then status `TEST_HARNESS_READY_REAL_DEVICE_GAS_QA_PENDING`.

## 6. Recovery
Read `G75_COMPAT_CURRENT_STATE.json`, this log, GitHub Actions run(s) at pinned SHA, and source kit. Archive exported manual JSON QA outside this code path with device/session labels only. No background run or human-audible observation is claimed.
