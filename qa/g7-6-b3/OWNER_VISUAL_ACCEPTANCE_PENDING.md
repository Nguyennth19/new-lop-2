# G7.6-B.3 – OWNER VISUAL / REAL-DEVICE ACCEPTANCE CHECKLIST

**Trạng thái:** `PENDING_OWNER_REVIEW`. Chứng cứ Chrome headless là bằng chứng kỹ thuật, **không** tự động thay thế phê duyệt của người quản lý hoặc thử trên điện thoại vật lý.

## Dữ liệu cần phân biệt trước khi xem ảnh
- `math.mental` NUMBER_INPUT (6): 100% dữ liệu thực E03 pinned P0.6 B21; UI nhập số mới ở nhánh B.3, **không** phải D1/D4, chưa vào manifest 12 renderer.
- D2 (2): dữ liệu thực E03 và renderer gốc đã pin.
- D4 (2): dữ liệu thực E02 và renderer gốc đã pin.
- D5 Tangram (2), D9 biểu đồ so sánh (2): **E04 sidecar sinh từ seed thật** dưới chính sách kỹ thuật `DRAFT_TECHNICAL_ONLY_OWNER_SIGNOFF_PENDING` và `toan_b999` laboratory, **không** tuyên bố E02/E03 đã hỗ trợ hay được SGK phê duyệt.
- Bất kỳ dữ liệu `answerSpec`, `correctOptionValue`, `gradingKey` xuất ra màn hình/browser pack đều là **FAIL**.

## Vùng kiểm tra hình bằng mắt (ảnh GitHub Actions artifact)

| Vùng | Cần xác nhận trực quan | Tình trạng |
|---|---|---|
| Mental 390px | 6 phép cộng đúng đề và chữ, ô kết quả không vỡ khung, có nhãn nhập/đếm số | PENDING OWNER |
| Column 390px | 2 phép đặt tính đúng hàng đơn vị/chục, không bị cắt grid/ô nhớ | PENDING OWNER |
| Choice 390px | 2 bộ trắc nghiệm hiện đủ lựa chọn, không hiển thị dấu đúng/sai hoặc đáp án được đánh dấu sẵn | PENDING OWNER |
| Tangram 390px | 2 đề có 3 mảnh/3 đích, nút xoay/đặt dùng được, SVG không chồng lấn khó hiểu | PENDING OWNER |
| Pictograph 390px | 2 bài số lượng emoji khớp `itemCounts` từng hàng, chạm đếm không làm biến mất item | PENDING OWNER |
| All 360/390/1440px | Không tràn ngang; màu, chữ và điều hướng phù hợp với demo gốc; ảnh toàn trang không có vùng trắng do lỗi JS | PENDING OWNER |
| Nền `test-theo-main` | Chưa tích hợp; không dùng hình chụp TEST để phê duyệt CSS/app main | NOT OPEN |
| Điện thoại vật lý | iOS/Android màn 360–390px, thử tap, nhập số, xoay Tangram, kéo trang; kiểm không che bàn phím | NOT TESTED |
| Voice TTS vật lý | nghe giọng Việt rõ và không đọc đáp án; chưa tích hợp hay xác nhận âm thanh | NOT TESTED |

## Cơ chế bằng chứng
Workflow `.github/workflows/g7-6-b3-producer-visual-qa.yml` chạy Chrome thực ở viewport 360/390/1440; xuất ảnh PNG, JPEG preview, JSON kiểm độ rộng và cờ `ownerVisualSignoff:PENDING`, `realPhysicalDevice:false`, `automaticPixelParity:false`.
- Không thay đổi renderer G7.4, P0.6 E02/E03, G6, main, test-theo-main hoặc GAS.
- Ảnh test phản ánh **dữ liệu mẫu công khai được sinh ra**, không có dữ liệu học sinh hoặc khóa đáp án.
- Người duyệt ghi kết quả riêng theo thời điểm/thiết bị/version; không tự nâng cờ `PASS` khi chưa có bằng chứng.

## Gate quyết định sau B.3
B3-VISUAL-STRUCTURAL = CI PASS chỉ khi browser và ảnh kiểm được đúng CSS viewport, không overflow, DOM và native interactions đều đạt.
B3-OWNER-VISUAL = PENDING cho đến khi xem và ký xác nhận ảnh chi tiết.
B3-PHYSICAL-DEVICE = PENDING/NOT_TESTED vì môi trường CI không sở hữu điện thoại.
B3-P06-E04-APPROVAL = BLOCKED cho đến khi có policy/curriculum/owner signoff riêng.
B3-APP-INTEGRATION = BLOCKED; `test-theo-main` chỉ được xem xét sau gate khác.
D10 TRUSTED_GRADING = BLOCKED; GAS DEPLOY = BLOCKED.
