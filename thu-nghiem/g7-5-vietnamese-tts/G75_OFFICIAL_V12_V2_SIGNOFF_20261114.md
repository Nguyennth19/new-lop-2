# G7.5 – BIÊN BẢN CHỐT CHÍNH THỨC HAI CHẾ ĐỘ GIỌNG ĐỌC (2026-11-14)

**Quyết định của chủ dự án:** đã nghe thử trực quan G7.5 V2; đánh giá V2 có nhịp điệu tốt nhất, đồng thời yêu cầu **giữ lại cả V1.2 và V2** để có thể chuyển đổi khi sử dụng sau này. Đề nghị đặt quyền chọn chế độ đọc trong **mục Phụ huynh**.

## 1. Phê duyệt / đóng băng
- **G7.5 V1.2 — Chuẩn / Stable** (`vi_math_v12_stable`): GIỮ NGUYÊN làm profile được phê duyệt, phương án lựa chọn/đối chứng, không ghi đè bằng V2.
- **G7.5 V2 — Tự nhiên / Dynamic** (`vi_math_v2_dynamic`): ĐƯỢC NGHIỆM THU NGHE TRỰC QUAN, ưu tiên **mặc định khi tích hợp trong tương lai**. Mức QA logic: 46 ca chuẩn hóa + 4 ca ngữ cảnh/ngữ điệu PASS, GitHub Actions PASS `43590646311`.
- Hợp đồng cấu hình/registry chính thức: `G75_APPROVED_VOICE_PROFILE_REGISTRY_V1.json`.
- Đóng băng file V1.2 từ nhánh `test/g7-5-vi-tts-compat-v1-20261114` blob `f67c87ddd4633d937248de3f75273eb1d7940e40`; V2 từ nhánh `test/g7-5-v2-prosody-20261114` blob `2c11e1b6e99f63665a05d4b4f875d9984b2741f4`. Không sửa/đè hai bản.
- V1.2 Google Drive: https://drive.google.com/file/d/1KMHix06TX6BYT3xv8c_weAw5cS_3YlQy/view
- V2 Google Drive: https://drive.google.com/file/d/1M7i9Yk6Gn9W9mj-4Jd4z1hFc6dDwnNKr/view

## 2. Quy tắc tích hợp trong Phụ huynh (CHƯA THỰC HIỆN)
- Vị trí dự kiến: **Góc của ba mẹ → Cài đặt → Giọng đọc**, chỉ thay đổi sau khi xác thực phiên phụ huynh hợp lệ.
- Nhãn: **Tự nhiên – V2 (đề xuất)** và **Chuẩn – V1.2**.
- Cấu hình máy chủ sau này: `voiceProfileId` thuộc `vi_math_v12_stable | vi_math_v2_dynamic`; mặc định `vi_math_v2_dynamic`.
- Có nút nghe thử trước khi lưu; lưu ở phạm vi học sinh/nhà phụ huynh theo hợp đồng dữ liệu được duyệt, có thể khôi phục; không dùng PIN hay session token ở client như một giả lập quyền.
- Khi gặp trình duyệt/thiết bị không hỗ trợ voice `vi-VN`: thông báo rõ; fallback V1.2 có kiểm soát nếu hoạt động; không tuyên bố thành công khi thiếu giọng.
- Chỉ thay đổi cách **đọc** của nội dung đã được phép hiển thị. Không làm thay đổi câu hỏi, chữ số, phép tính, chấm điểm, sao, CSS renderer, kho câu hỏi hay lộ đáp án Dạng 10 trước khi được phép.
- Không áp dụng MathSpeechNormalizer cho tiếng Anh; tiếng Anh giữ cấu hình/giọng đã nghiệm thu riêng.
- Cấu hình phụ huynh tương lai cần QA riêng trên Apps Script HTMLService, Android/iOS và tính đúng đắn của phục hồi/rollback.

## 3. Phân biệt nghiệm thu phiên bản với phát hành ứng dụng
- **ĐÃ CHỐT:** hai bản HTML tham chiếu, chất lượng nghe V2 trên trường hợp người dùng thử, mặc định đề xuất V2, chính sách cho phép phụ huynh chọn.
- **CHƯA CHỐT:** kỹ thuật triển khai trong Web App, trạng thái tương thích mọi thiết bị, kiểm thử phiên phụ huynh, bảo vệ trusted grading và phê duyệt P1.
- `RELEASE_READY=false`. Không thay đổi `main`, `test-theo-main`, P0.6 F-C.4, Web App TEST Version 6 hoặc dữ liệu tiến độ/sao/điểm của học sinh.
- Không tự động tạo tùy chọn giao diện trong `36_CuaVaoPhuHuynh.html`: đây là yêu cầu sản phẩm đã được duyệt cho giai đoạn tích hợp tương lai.

## 4. Truy vết và khôi phục
- Approval branch: `test/g7-5-approved-voice-profiles-20261114`, tách từ V2 HEAD `c9880bfc56aec0cfc4ea7f788983bcc3761d7b48`.
- Đọc hồ sơ này, registry và `G75_FINAL_APPROVAL_CURRENT_STATE.json` để khôi phục chính sách.
- Baseline P0.6 đóng băng: `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2`.
- Sau này chỉ tiến hành tích hợp bằng một nhánh riêng và cổng nghiệm thu P1/Phụ huynh mới; không coi hồ sơ ký duyệt tài liệu là lệnh deploy.
