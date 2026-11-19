# LOP2 – UNIVERSAL LEARNING TEMPLATE V1 · Independent LAB

**Bản thử nghiệm tách biệt dữ liệu và hệ thống, không triển khai cho học sinh.** Nhánh: `lab/universal-learning-template-v1-20261119`, nguồn khóa: `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`. Tất cả file mới ở `qa/universal-template-v1/` và một workflow CI LAB; không thay Apps Script, Sheet, điểm/sao hoặc PROD.

## Mục tiêu và phạm vi

- **Toán V1:** mười dạng G7.4, mười hai renderer IDs `D1,D2,D3,D4,D5,D6,D7,D8,D8A,D8B,D9,D10`.
- **Độc lập dữ liệu:** đổi JSON công khai A/B hoặc nạp một JSON thứ ba qua browser; `validate → compile → mount → interact` mà không chỉnh HTML / renderer.
- **Tái sử dụng nguyên source:** build tự lấy đúng byte 28 module HTML/JS và 8 CSS gốc ở root, so với Git blob tại checkpoint. Không viết lại thuật toán dựng D2, Tangram, dung tích, biểu đồ, lời văn hay TTS.
- **An toàn:** mỗi câu phải khớp chính xác `lessonId`, `skillId`, `questionType` với quyền route QA của LAB; `publicVariant` phải qua validator chặn trường đáp án và metadata riêng tư ở mọi độ sâu; renderer không lưu điểm/sao; TTS do người dùng bấm, không tự phát. Backend thử nghiệm Node **chỉ chấm D2 và D4**, với logic kiểm tra ở Node không nhúng vào trang HTML. Các dạng khác phải có hợp đồng chấm phía máy chủ trước khi bật.
- **Bài học thật:** chưa có quyền tự động gán D5/D9 hoặc bất kỳ dữ liệu SGK. Fixture A/B chỉ là synthetic QA, không phải B020 đã duyệt.
- **Môn khác:** chỉ thiết kế phần vỏ, điều hướng, bộ nhớ tương tác, kết nối, đọc và manifest theo cách dùng lại; **không** tạo renderer Tiếng Việt/Tiếng Anh trong V1.

## Chạy thử độc lập

Sau khi checkout nhánh LAB ở máy có Node.js 22:

```bash
node qa/universal-template-v1/build.cjs
node qa/universal-template-v1/contracts.test.cjs
node qa/universal-template-v1/local-server.cjs
```

Mở `http://127.0.0.1:8765/lab`. Chọn **Bộ A / Bộ B**, chọn LV1–LV3, mở từng loại D1–D10 hoặc nạp một `LAB_MATH_*.json` tương thích. Có thể tải gói HTML độc lập, public JSON và manifest SHA256 ở artifact của GitHub Actions (không cần chạy GAS). Nếu mở HTML trực tiếp bằng file://, chấm thử sẽ bị vô hiệu hóa đúng chủ đích.

Để chạy browser QA trong repository đã cài Playwright:

```bash
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install chromium
node qa/universal-template-v1/browser.test.cjs
```

`dist/` được tạo lại ở mỗi build, không phải đầu vào đã duyệt. File HTML độc lập là **LAB tĩnh**, không phải Apps Script deployment.

## Hợp đồng JSON công khai tối thiểu

```json
{
  "schemaVersion": "LOP2_UNIVERSAL_LAB_PUBLIC_V1",
  "packId": "MATH_LAB_A",
  "status": "LAB_FIXTURE_ONLY_NO_GAS_RELEASE",
  "lesson": {
    "id": "LAB_MATH_A",
    "subject": "MATH",
    "title": "Toán 2 – Bộ dữ liệu mẫu A",
    "grade": 2,
    "studentRelease": false,
    "sourceStatus": "SYNTHETIC_QA_ONLY"
  },
  "questions": [
    {
      "lessonId": "LAB_MATH_A",
      "questionId": "LAB_A_D2",
      "rendererId": "D2",
      "skillId": "COLUMN_ADD",
      "questionType": "vertical",
      "level": "LV2",
      "visualIntent": "DECORATIVE",
      "assetId": null,
      "publicVariant": {
        "variantId": "COL_LAB_A0001",
        "profile": "PV100",
        "operation": "ADD",
        "level": "LV2",
        "a": 36,
        "b": 17,
        "carryPolicy": "OPTIONAL_HINT",
        "assetId": null
      }
    }
  ]
}
```

Các thuộc tính ví dụ **không phải quyền mapping bài học thật**. JSON tải lên được chạy ở LAB, không tự ghi GitHub, Sheet, Drive hay cấp sao. Vùng private grading cần máy chủ độc lập và quyền học sinh trước khi chuyển sang môi trường thật.

## 12 renderer LAB, chính sách chấm

| Nhóm | Nguồn đã khóa trong be-hoc | Hiển thị/tương tác trong LAB | Chấm điểm |
|---|---|---|---|
| D1 | `65_D1_Type1` | Tách/gộp, bàn phím riêng | Chưa cấp |
| D2 | `47_D2V12_Core`, `48_D2V12_View` | Đặt tính theo cột, ô nhớ | Node localhost TEST |
| D3 | `66_D3_Core`, `67_D3_View` | Nối cặp | Chưa cấp |
| D4 | `68_D4_Core`, `69_D4_View` | Chọn đáp án | Node localhost TEST |
| D5 | `53_Geometry_Core`, `54_Tangram_V12` | Tangram nguồn B5A | Chưa cấp, E04 pending |
| D6 | `71_D6_Core`, `72_D6_View` | Kéo/thả hoặc chạm để xếp | Chưa cấp |
| D7 | `73_D7_Core`, `74_D7_View` | Chọn dấu so sánh | Chưa cấp |
| D8 | `75_D8_Core`, `76_D8_View` | Thước kẻ | Chưa cấp |
| D8A | `77_D8A_Core`, `78_D8A_View` | Bình nước tỷ lệ dung tích | Chưa cấp |
| D8B | `77_D8A_Core`, `79_D8B_View` | Cân 2 đĩa có độ nghiêng đúng | Chưa cấp |
| D9 | `55_Pictograph_Core`, `56_Pictograph_View` | Đếm/chạm biểu đồ | Chưa cấp, E04 pending |
| D10 | `80_D10_Core`, `81_D10_Adapter` | Câu lời giải gắn trên host G6 tối giản | Chưa cấp, trusted grading pending |

Tất cả được đọc byte nguyên từ `be-hoc`. `D10` gắn vào một host G6 tối giản riêng trong LAB; không chứng minh đồng nhất pixel với card B20 đang dùng. Bộ điều phối LAB tránh cơ chế `83_Visual_Orchestrator` gắn cứng `toan_b20`; kiến trúc production cần adapter hợp đồng được phê duyệt trước khi dùng.

## Các cổng nghiệm thu

1. **T1–T3 – LAB source/UX:** build nguyên nguồn, JSON A/B đổi được, 12 renderer compile/mount, desktop/mobile, thao tác không lỗi, không tự load đáp án.
2. **T4 – Validator:** chặn trường private sâu, ID sai, cấu trúc số học không hợp lệ, renderer không có trong registry; bảo đảm thất bại không phá bản dữ liệu đang hiển thị.
3. **T5 – Trusted grading:** local-only Node phản hồi ĐẠT/CHƯA ĐẠT cho D2/D4, không truyền answerKey. Những renderer còn lại **NO_GRANT**, không giả PASS.
4. **T6 – Phát hành:** **NO-GO**, do chưa có đăng ký chính sách SGK, dữ liệu B001–B024 đạt QA, GAS TEST/authenticated backend, 10/10 trusted grading, thiết bị và owner acceptance.

## Quy tắc khi mở rộng sang dữ liệu thật

AI có thể sinh JSON ứng viên; validator kiểm toán, hệ thống tạo version/manifest, người có thẩm quyền duyệt, publisher cập nhật đúng vị trí theo ID. Không để AI tự chọn quyền phát hành, đổi tên bài, tự kết luận đáp án hoặc viết thẳng vào Sheet học sinh.

**Bước tiếp:** Sau khi LAB độc lập ổn định, hoàn thiện 10/10 trusted grading trên bộ dữ liệu synthetic, kiểm tra output composition 2+ lessons, rồi kết nối read-only JSON lesson source đã được phê duyệt; chỉ sau đó bàn tới GAS TEST.
