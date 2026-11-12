# M2.2-A – Chuẩn hóa lịch tuần và chuỗi ngày học
Ngày thực hiện: 2026-11-12. Nhánh: `test-theo-main`.
Mốc trước sửa: M2.1 – `97aa441038708a89a5bacdfbdac6ad21b330f392`.

## Phạm vi thực hiện
- **Lịch học tuần này**: luôn thứ Hai–Chủ nhật của tuần hiện tại theo `Asia/Ho_Chi_Minh`.
- **Chuỗi ngày học**: 4 ngày quá khứ + hôm nay + 2 ngày tương lai (7 vòng).
- **Trạng thái có xác minh**: completed ✓ (xanh lá); progressing ! (xanh dương); missed × (đỏ); hôm nay ★ (cam); tương lai • (xám). Khi máy chủ chưa xác minh: ? (xám).
- **Thông điệp động**: chuỗi liên tiếp, hoàn thành hôm nay, chưa hoàn thành hôm qua, trở lại học và khởi động khi chưa có dữ liệu.
- Ẩn câu chú thích kỹ thuật `Hoạt động trong 7 ngày gần nhất · Dữ liệu máy chủ` trên thẻ Lịch học tuần này.
- Khi tab mở qua nửa đêm Việt Nam, làm mới cửa sổ ngày và gọi đọc tổng quan từ máy chủ lần nữa.
- Giữ nguyên dữ liệu `week` hiện có cho biểu đồ thành tích; bổ sung trường `attendance` từ dữ liệu nộp bài để không gây regression.

## Tiêu chí phân loại
Trong máy chủ `ThanhTichBaoCao.gs`, dùng dữ liệu **được xác minh** từ `90_Lan_lam_bai`:
- `completed`: trong ngày có lượt nộp đã trả lời ít nhất một câu và có `correct / total >= 70%` (đúng ngưỡng hoàn thành hiện hành, không thay luật cấp sao).
- `progressing`: có nộp ít nhất một câu đã trả lời, nhưng chưa có lượt đạt >=70%.
- `missed`: ngày đã qua, không có lượt học được ghi nhận.
- `empty`: hôm nay chưa có lượt học hợp lệ.
- `unknown`: chưa nhận dữ liệu chuyên cần đáng tin cậy.
- `future`: ngày chưa đến; không chấm vắng.
Ngưỡng 70% dùng để **phân loại hiển thị**, không tự tạo sao, không thay ledger hay trạng thái LV.

**Giới hạn:** Bản hiện tại không ghi riêng sự kiện “bắt đầu nhưng chưa nộp”. Vì vậy trạng thái `progressing` chỉ có thể dựa vào lượt nộp, không thể suy ra từ việc mở bài hoặc nhập nháp. Không tự nhận bé đã học khi không có dữ liệu máy chủ.

## File thay đổi
| File | Sửa gì? |
|---|---|
| `ThanhTichBaoCao.gs` | Thêm `achAttendance_`, xuất `attendance`, giữ nguyên `week`/sao |
| `16_LichHocChuyenCan.html` | Hai cửa sổ ngày và bộ hiển thị trạng thái/thông điệp, tự làm mới khi qua ngày |
| `15_ThanhTichHoatDong.html` | Gọi renderer lịch và chuỗi từ cùng `attendance` |
| `02_CSS_TrangChu.html` | Chỉ bổ sung màu/icon trạng thái đúng yêu cầu, chưa chỉnh kích thước card |

## Kiểm thử tự động đã chạy
- **12/12** bài kiểm tra logic: thứ Năm 12/11/2026, Chủ nhật cùng tuần, sang thứ Hai, tuần đổi năm 2026→2027, cửa sổ ngày 4–1–2 qua năm, completed/progressing/missed/empty, thông điệp khi hoàn thành hoặc chưa xong.
- **7/7** kiểm tra DOM mock: lịch đúng 7 ô, chuỗi 7 vòng, đầu tuần thứ Hai, cuối tuần Chủ nhật, sao hôm nay, caption ẩn, thông điệp được gắn.
- Parse JavaScript client và Apps Script: PASS trong kiểm tra tĩnh.
- Giao diện Google Apps Script thực tế và đối chiếu screenshot: **PENDING**, chưa coi là nghiệm thu.

## Những gì KHÔNG sửa
- `GiaoDien.html` và khung robot sidebar.
- Thư viện hình/Asset ID, renderer bài Toán, bảng kết quả, bàn phím.
- Chấm câu hỏi, xác minh cấp sao và ghi ledger.
- CSS kích thước thẻ chuỗi ngày (dành cho M2.2-B), robot theo ngữ cảnh (M2.2-C).
- Không merge `main`; không dùng nội dung từ `test-bai-20`.

## Checklist kiểm thử Web App TEST
1. Pull nhánh `test-theo-main`, `clasp push` vào đúng dự án TEST, tạo phiên bản deployment mới.
2. Mở ngày Thứ Hai đến Chủ nhật: lịch tuần không chạy theo “7 ngày gần nhất”.
3. Trên ngày hiện tại, cửa sổ chuỗi có bốn ngày bên trái và hai ngày bên phải; sao cam ở giữa.
4. Có lượt đạt >=70%: ngày quá khứ dấu ✓ xanh; có lượt chưa đạt: ! xanh dương; không nộp: × đỏ.
5. Khi mất kết nối/chưa nhận dữ liệu, các ngày quá khứ hiển thị ? xám, không chấm × oan.
6. Kiểm tra thông báo thành tích theo dữ liệu đã xác nhận và việc không còn caption kỹ thuật.
7. So sánh font, kích thước, sidebar, bảng kết quả và màn Bài 20 với bản `main`.
8. Không thử nộp để tạo sao trong môi trường dữ liệu thật. M2.2-A không sửa logic thưởng.

## Khôi phục
- Dùng `git revert <SHA commit M2.2-A>` trên nhánh `test-theo-main` để hoàn tác chỉ bước này.
- Hoặc kiểm tra bản gốc `97aa441` để đối chiếu.
- Mọi tài liệu M1/M2.0/M2.1 vẫn tồn tại theo lịch sử Git.
