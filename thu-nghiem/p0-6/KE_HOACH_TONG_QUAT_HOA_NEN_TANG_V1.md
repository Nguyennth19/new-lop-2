# P0.6 – Nền tảng đa bài, đa môn | Khởi động kiến trúc

Ngày: 2026-11-13. Trạng thái: **DESIGN_ONLY / TEST_ONLY**.
Nguồn chuyển giao: `thu-nghiem/p0-5/closure/BIEN_BAN_P05_I3_KET_THUC_FUNCTIONAL_RELEASE_BLOCKED_20261113.md`.
Nguồn pilot: B20 H.2 `1dfa16c6dbde8045ab3f9145bc9f18bad08bd008`.
Release production: **BLOCKED**. Không sửa MAIN/test-theo-main, không truy cập/ghi dữ liệu học sinh.

## 0. Nguyên tắc bất biến
1. **Bài 20 là phép thử của bộ máy, không phải khuôn mẫu**: số câu, số lượt, mức độ, prompt, renderer, rubric và hình đều phải cấu hình theo bài.
2. **JSON-first, versioned**: tách dữ liệu từng bài thành file JSON có schema, ID bền vững, provenance và migration; Sheets chỉ làm danh mục/chỉ mục và hoạt động quản trị, không trở thành kho 10.000+ dòng cho nội dung.
3. **Không đồng nhất nguồn đề với nguồn đáp án**: SGK có thể không có đáp án; hệ thống tự tính hoặc biên soạn, kiểm tra toán học/rubric và trình duyệt sư phạm có kiểm soát.
4. **Tách nội dung, UI, chấm bài, hình ảnh, QA và tiến độ**; không trộn sản sinh biến thể với tiến trình thực của học sinh.
5. **QA theo rủi ro**: unit/static/schema hàng loạt; nghiệm thu trực quan theo representative examples/risk, không bắt người vận hành test tay mọi câu mọi bài.
6. **Các thao tác P0.6 mặc định chỉ đọc và TEST**; mọi nhánh muốn cấp sao/ghi tiến độ phải qua release gate riêng.

## 1. Hợp đồng dữ liệu bài học đề xuất (bản nháp)
```json
{
  "schemaVersion": "lop2.lesson.v1",
  "lessonId": "toan_b20",
  "subject": "toan",
  "curriculum": {"grade": 2, "lessonRef": "b20"},
  "contentVersion": "immutable-sha-or-semver",
  "source": {"questionOrigin": "PROJECT_ORIGINAL_VARIANT", "references": []},
  "levels": [{"id": "LV1", "intent": "..." }],
  "sessions": [{"id": "LV1-A", "questionIds": []}],
  "questions": [{
    "id": "VAR_B20_20261112_001",
    "kind": "math.carry",
    "levelId": "LV1",
    "sessionId": "LV1-A",
    "prompt": "...",
    "parameters": {},
    "answerSpec": {
      "mode": "exact",
      "origin": "PROJECT_DERIVED",
      "verification": {"type": "deterministic_rule", "status": "PASS"},
      "pedagogyApproval": {"status": "APPROVED_BY_PROJECT_OWNER"}
    },
    "renderer": {"component": "math.carry"},
    "assets": {"sceneId": null}
  }]
}
```
Đây là một **đặc tả dự kiến**, không phải cấu trúc runtime H.2 hiện tại. Triển khai migration bằng adapter, không rewrite bộ 30 câu đã duyệt.

## 2. Các module tái sử dụng
| Module | Tái sử dụng | Cần tổng quát hóa |
|---|---|---|
| JSON loader + adapter | loader B20, schema, versioned source | nhận `lessonId`, không hardcode B20 |
| Validator | P0.2 và B20 regression | kiểm schema, ID, số học, nguồn đáp án, cấu trúc đa môn |
| QA Runner | P0.4 FULL_SAFE | chọn bộ test tự động theo `subject/kind`, xuất biên nhận |
| Question Renderer | UI-A/B, math renderer | registry theo dạng câu, plugin renderer Tiếng Việt/Anh |
| Grading Engine | exact numeric B20 | `exact`, `normalized_text`, `multiple_valid`, `rubric`, `manual_review` |
| Pedagogy Rules | H.1 và H.2 | ma trận theo bài/môn/độ tuổi, cổng người duyệt |
| Asset resolver | WebP/Fluent Flat/math SVG | scene mapping và điều kiện đếm tách biệt |
| Release Gate | P0.5 fail-closed | gate chung + chuyên biệt theo môn; bằng chứng có provenance |
| Progress/Stars | không sử dụng khi Pilot TEST | tích hợp riêng sau phê duyệt, không được mở bởi QA |

## 3. Dữ liệu SGK không có đáp án
Dùng ít nhất ba trường ĐỘC LẬP: `origin` (nguồn đáp án), `verification` (đã kiểm tra thế nào), `pedagogyApproval` (đã duyệt hay chưa). Không dùng một enum để trộn lẫn ba trạng thái.
- Toán: `exact`, `set_of_answers`, `math_expression`; nghiệm thu tính toán tự động, xử lý đơn vị và chấp nhận biểu thức tương đương nếu phù hợp.
- Tiếng Việt: `normalized_text`, nhiều đáp án hợp lệ, rubric mở, hoặc cần người duyệt; tránh chấm máy cứng một câu văn tự luận.
- Tiếng Anh: `normalized_text`, multiple_choice, matching, spelling và rubric theo yêu cầu. Khác biệt dấu câu/viết hoa chỉ được chuẩn hóa khi phù hợp mục tiêu học tập.
- Gắn `questionOrigin=TEXTBOOK_DERIVED|WORKBOOK_DERIVED|PROJECT_ORIGINAL_VARIANT|REFERENCE_DERIVED`; không ghi nhận biến thể như trích nguyên văn SGK.

## 4. Kế hoạch từng bước
**P0.6-A — Inventory & contracts (không sửa runtime)**: kiểm kê QA runner, gate, renderer, loader, JSON, hình; lập bảng phụ thuộc và schema chuẩn có fixture kiểm thử cho 3 môn. Tiêu chí hoàn thành: schema + validator trên fixtures PASS; compatibility B20 H.2 PASS.
**P0.6-B — Adapter & registry trên TEST**: resolver chọn bài/môn, adapter chuyển B20 JSON cũ sang contract mới *trong bộ nhớ*; giữ nguyên bản JSON nguồn và 30 ID.
**P0.6-C — QA engine chung**: bộ kiểm toán toán/đáp án/rubric đa môn, lưu chứng cứ tự động, cổng negative cases.
**P0.6-D — Renderer registry**: chọn renderer theo question.kind, fallback có kiểm soát; không gắn logic B20 vào trang học chung.
**P0.6-E — Multi-lesson pilot**: dùng một bài đại diện khác cùng môn và một bài đại diện của môn khác; chỉ tăng phạm vi khi QA sư phạm và kỹ thuật đạt.
**P0.6-F — Release governance**: phát hành TEST theo lessonVersion, rollback độc lập theo bài, không ghi dữ liệu học sinh trước khi được phê duyệt.

## 5. Cổng an toàn và rollback
- P0.6 trên nhánh riêng này, không phát hành production.
- Bất biến: JSON H.1, 30 ID, câu, đáp án, version 6 TEST đang thử; nếu adapter sai, tắt feature flag P0.6 và trở về bản H.2.
- Mọi file TEST mới cần có header nguồn, phạm vi, QA, migration và hướng rollback.
- Mỗi thành phần có fixture và regression tự động; test thủ công chỉ chọn mẫu rủi ro/đại diện, tránh lặp sáu lượt đã hoàn thành.
- Sẵn sàng P0.6-A khi hoàn thành kiểm kê thực tế, chưa coi roadmap là implementation.
