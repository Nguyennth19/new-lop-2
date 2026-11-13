# G7.5 – WEB SPEECH API / VIETNAMESE TTS REFERENCE V1
Ngày lập: 2026-11-14 (Asia/Ho_Chi_Minh)
Loại: KNOWLEDGE_REFERENCE_ONLY / NOT_IMPLEMENTED / QA_PENDING
Dự án: Lớp 2. Bảo vệ: P0.6 đã đóng kỹ thuật TEST độc lập, `RELEASE_READY=false`.
Mục tiêu: lưu nguồn gốc, kiến trúc tham khảo, các rủi ro và hợp đồng kiểm thử để tái sử dụng sau này, không tự triển khai Web App.

## 1. Provenance nguồn
- File do chủ dự án cung cấp trong hội thoại: `th_c_h_nh_to_n_l_p_2_ch_n_tr_i_s_ng_t_o.html`, tiêu đề HTML `Thực Hành Toán Lớp 2 - Chân Trời Sáng Tạo`.
- SHA-256 bytes của file HTML tải lên (đã tính trong runtime): `78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced`.
- Dòng nguồn: HTML ~2239 dòng theo bản tách dòng, không đưa nguyên demo vào repo. Cơ chế giọng nói: dòng ~268-369; hàm `speakVietnamese` dòng 348–359; `toggleMute` 361–367. `speakCurrentPrompt` ~657–660; nút đọc câu/phương án dạng 1,2,4,10; đọc số trong biểu đồ dạng 9 ~1992.
- Tính năng dựa trên code nguồn: `SpeechSynthesisUtterance`, `window.speechSynthesis`, `utter.lang='vi-VN'`, `rate=0.95`, `pitch=1.1`, `speechSynthesis.cancel(); speak(utter)`; `AudioContext` riêng cho âm hiệu ứng.
- Đánh giá hiện tại: đã đọc mã; file không xác định `voice` bằng `getVoices()`, không có `voiceschanged`, `utter.onerror/onstart/onend`, không kiểm sự kiện phát thành công hoặc lỗi môi trường GAS. **KHÔNG khẳng định TTS đã chạy được trong Web App hiện tại hoặc bản HTML độc lập.**
- Phân biệt nguồn với đề xuất: phần 1 mô tả file; phần tiếp theo là KIẾN NGHỊ kiến trúc, chưa thực thi.

## 2. Kiến nghị module dùng lại
`VietnameseSpeechService` là module dùng chung ở tầng tương tác, không phải dữ liệu câu hỏi hay grading:
- `getCapabilities()`: kiểm `speechSynthesis` và `SpeechSynthesisUtterance`, phát hiện danh sách voice; cho phép trạng thái `VOICE_LOADING`/ `NO_VI_VOICE` thay vì giả thành công.
- `listVoices()`: `speechSynthesis.getVoices()`, lắng nghe `voiceschanged` (có fallback nếu API event không hỗ trợ); ưu tiên chính xác `vi-VN`, rồi giọng `vi*`, không tự tuyên bố `utter.lang` ép được giọng Việt nếu trình duyệt thiếu voice.
- `speak({text, locale:'vi-VN', rate, pitch, requestId, context})`: chỉ nhận văn bản đã chuẩn hóa và phát trên thao tác chủ động; phân biệt `REQUESTED`, `STARTED`, `ENDED`, `ERROR`, `CANCELLED`, `UNSUPPORTED`; onstart xác nhận có bắt đầu tổng hợp nhưng KHÔNG chứng minh người nghe thực sự nghe được.
- `stop()`, `cancelStaleOnQuestionChange()`, mute riêng giữa voice và SFX; requestId và last-call-wins chống giọng đọc cũ chạy sang câu mới.
- `MathSpeechFormatter`: tách khỏi service, biến phép tính/dấu/đơn vị và số sang lời đọc tiếng Việt; không làm lộ đáp án; định nghĩa string theo ngữ cảnh, không thay dữ liệu câu hỏi gốc.
- `speechText` có thể lấy từ question metadata, fallback qua formatter đã QA; không gọi nguyên văn HTML/markup hoặc lấy lời giải khi học sinh chưa làm.
- `SpeechAudioDiagnostics`: ghi loại thiết bị/trình duyệt, voice selected/lang, trạng thái request và mã lỗi, không lưu văn bản bài riêng tư hoặc dữ liệu học sinh; chẩn đoán chỉ trong TEST.
- Có thể cân nhắc fallback âm thanh đã chuẩn bị hoặc TTS bên ngoài **sau** QA về voice availability/privacy/cost; KHÔNG tự thêm API key hoặc dịch vụ bên thứ ba.

## 3. API contract đề nghị
Input: `{requestId, lessonId, questionId, text|speechText, lang:'vi-VN', rate:0.9, voicePreference:'vi-VN', purpose:'PROMPT|OPTION|HINT|FEEDBACK', userGesture:true}`.
Output/event: `{requestId, status:'UNSUPPORTED|VOICE_LOADING|NO_VI_VOICE|REQUESTED|STARTED|ENDED|ERROR|CANCELLED', voiceId?, voiceLang?, errorCode?}`.
Voice selection must not expose hidden user accounts. Default `speechText` for TTS derived from approved prompt/question, not answer or grading engine. All data shown through existing question renderer; no write to scores/stars.
QA statuses: `STATIC_REFERENCE_PASS`, `DEVICE_TTS_PENDING`, `GAS_IFRAME_TTS_PENDING`, `MATH_PRONUNCIATION_PENDING`, `PEDAGOGY_REVIEW_PENDING`.

## 4. Minimal read-aloud test matrix (required before production integration)
- Voice: supported/unsupported; voices empty initially then asynchronously loaded; vi-VN present / absent / non-Vietnamese fallback; device muted/volume-off (not detectable automatically).
- Browser: desktop Chrome, Android Chrome, iOS Safari (when accessible); test on actual Apps Script HTMLService iframe and standalone HTML. Browser availability is not guaranteed by file/source.
- Gesture: tap button first; repeated taps, cancel, navigate to next question during audio; toggling mute; speak one option without speaking answer.
- Language: Vietnamese tone marks, punctuation, long text, numbers 0–1000, decimal separators, cộng/trừ/nhân/chia, cm/dm/m, kg/l, dates/time. Include similar looking expressions but different semantics.
- UX: audible verified by human tester, no double speech, no silent success, accessible focus/labels, no blocking grading when TTS unavailable.
- Tests: independent unit tests for formatter and voice selection; device/manual QA per platform; GAS E2E separately. Source HTML code is NOT the acceptance evidence.

## 5. Guardrails for P1
- Reuse technology pattern, not CSS/header/10 hardcoded example answers from demo.
- Do not modify sealed P0.6 A–F QA/CI or its `FC_CURRENT_STATE.json`.
- No changes to `main`, `test-theo-main`, existing Web App TEST Version 6; no live deployment and no updates to student data, scores or stars.
- `RELEASE_READY=false` until separate owner release decision.
- Next gate: `G7.5-VIETNAMESE_TTS_COMPATIBILITY_TEST_V1` / compatibility on a separate TEST branch, not automatic integration into P1.
- If file is reused: preserve this SHA256 and source ID, record which functions/patterns adopted, and add test-run IDs and exact commit.

## 6. Relation to current project baselines
P0.6 F-C.4 isolated TEST technical closure: branch `test/p0-6-fc-audit-20261114`, head `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2`. This reference branch is documentation-only, created from that exact checkpoint.
G7.4 image/renderer sources and P0.6 lesson-family registry remain authoritative; Vietnamese TTS is an **optional presentation accessibility service**, never a prerequisite for math correctness/grading. P1.0 start gate unchanged.

## 7. Recovery / handoff
Read this file and `G75_CURRENT_STATE.json` on `test/g7-5-vietnamese-tts-reference-20261114`. Verify branch HEAD, reference SHA and P0.6 base HEAD. Compare Google Drive copy using document title and provenance. State continues `REFERENCE_SAVED_QA_PENDING`; do not mark speech functional until device/GAS evidence exists.
