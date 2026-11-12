# Nhật ký lỗi và phòng ngừa tái diễn — Bài 20 biến thể

Ngày ghi nhận: **2026-11-12** · Nhánh sửa: `test-b20-bien-the-20261112` · Chuẩn đối chiếu UI: `test-theo-main`.

## Nguyên tắc bắt buộc

1. Mỗi lỗi phải có: ID, bằng chứng, nguyên nhân ở mã nguồn, thay đổi, kiểm thử xác nhận, tình trạng.
2. **Không dùng việc “CSS không đổi” để kết luận UI đúng.** Phải kiểm tra contract dữ liệu/renderer + cấu trúc DOM + khả năng nhập/chấm từng loại.
3. Không thêm CSS mới hay style nội tuyến để chữa dữ liệu bị chuyển sai. Bắt buộc tận dụng renderer, component, class hiện có.
4. Không merge khi chưa đạt các cổng: schema, kiểm thử chấm, nghiệm thu cấu trúc nhóm, duyệt lời văn, kiểm thử trình duyệt/di động.
5. Dữ liệu B020 SGK/SBT và 51 câu `gemini-code` không bị ghi đè; điểm/sao staging không ghi thật.

## Danh sách lỗi từ ảnh test của người dùng

| ID | Bằng chứng | Nguyên nhân gốc | Khắc phục | Kết quả |
|---|---|---|---|---|
| B20-UI-01 | LV1/LV2/LV3: nhiều câu dồn 1 panel, text ngắt thành nhiều dòng, khác bài mẫu 2 ô | `42_AdapterBienTheB20` gom mọi câu `mental` theo loại, đặt `group:'Luyện tập'`; `41_HienThiCauHoiToan.mental()` đặt cả `pilotPrompt` dài vào ô 78px của grid 5 cột | Adapter chia nhóm theo thứ tự và cặp; renderer dùng biểu thức toán theo ô của layout cũ | OPEN |
| B20-UI-02 | Lời văn: thiếu tóm tắt/đơn vị ở phép tính; chỉ thấy “Phép tính:” | Adapter ép `summary:''`, `solutionPrompt:'Phép tính:'`; renderer `word()` không hiện đơn vị ở phép tính | Sinh tóm tắt có cấu trúc, dòng lời giải, đơn vị sau phép tính từ tham số; giữ DOM/class chuẩn | OPEN |
| B20-UI-03 | LV3: tìm số và cộng ba số chung một đoạn dài; font/bố cục hỏng | `reverse`, `three`, `carry` bị gộp vào `mental` bằng `pilotPrompt` | Chuyển từng kiểu sang biểu thức toán 5 cột, duy trì input ở vị trí đúng và nhóm 2 bài/panel | OPEN |
| B20-API-01 | Nộp bài không chấm; UI báo “Bản Web App chưa có API chấm lượt” | Client gọi `chamLuotToan20BienThe()` mới, không có trong deployment đang chạy (hoặc mã Apps Script chưa đồng bộ); đây không phải kết quả kiểm định toán học | Kiểm tra công khai API, bản deployment, tạo hàm self-test không tham số, giữ lỗi rõ và nút retry; kiểm tra staging sau deploy | OPEN – cần Web App thực tế |
| B20-QA-01 | Các bản trước báo “CSS giống” nhưng hiển thị sai | Chỉ kiểm tra SHA CSS và cú pháp JS, thiếu test cấu trúc câu hỏi, chuyển đổi và DOM từng dạng | Bổ sung hồi quy tự động với 30/30 câu, cấu trúc nhóm, HTML rendering, kiểm tra source parity | OPEN |

## Chính sách đóng lỗi

- `STATIC_PASS`: mã và hợp đồng dữ liệu đã qua kiểm tra bằng test tự động, **không** được ghi thành `UI_PASS`.
- `WEBAPP_PASS`: người kiểm tra thực hiện thao tác thật qua deployment Apps Script mới, đủ 6 lượt.
- `PEDAGOGY_PASS`: câu lời văn/mẫu câu và mức độ được duyệt.
- Chỉ khi đạt đủ những cổng cần thiết mới đổi sang `RELEASE_READY`.

## Checklist hồi quy bắt buộc cho mỗi bài tương lai

- Câu số học 2 số hạng dùng renderer 5 ô đang có; không nhét toàn bộ đề dài vào một span nhỏ.
- Câu ngược điền ô số cần hiển thị ô nhập ở **vị trí số thiếu**, không phải ô tổng.
- Cộng ba số có đủ ba số hạng và đúng vị trí ô đáp án.
- Câu lời văn phải có tóm tắt, lời giải và đơn vị ở phép tính và đáp số.
- Nhóm câu phải đúng thứ tự `question_ids` của kế hoạch lượt; mỗi panel luyện tập tối đa 2 câu khi thiết kế yêu cầu.
- Nút Nộp: có API public, xử lý thành công/thất bại/retry; không ghi điểm sao staging.
- Trình duyệt: desktop/mobile, keyboard, không tràn hoặc chồng lớp; CSS và shell đối chiếu `test-theo-main`.
