# Thành tích thực V1.1 — bàn giao GitHub
Ngày: 11/11/2026 · Trạng thái: **đã cập nhật mã nguồn trên main, chưa triển khai Web App cuối cùng**

## Quyết định phạm vi
- Triển khai 6 chỉ số thật, biểu đồ 7 ngày, tổng hợp 4 tuần, ba môn (chỉ Toán có dữ liệu nộp thật), ma trận kỹ năng Bài 20, 12 huy hiệu và 2 loại sao.
- **Không triển khai trang đổi quà/phê duyệt phụ huynh**. Lưu yêu cầu riêng trong `tai-lieu/GHI_CHU_TRANG_PHU_HUYNH_DOI_THUONG_SAU.md`.
- Reset số liệu demo của Thành tích, banner sao Trang chủ, chuỗi 3 ngày mẫu, trạng thái giả đã hoàn thành ở lộ trình Tiếng Việt/Anh. Không xóa các bài học và nháp Toán đã làm trong trình duyệt.
- Các kết quả và dấu tích từ bản demo cũ KHÔNG được chuyển thành sao. Ví mới khởi đầu từ **0** nếu sổ sao chưa có sự kiện.

## Tệp triển khai
- `ThanhTichMayChu.gs` (mới): đọc/ghi hai tab, kiểm tra lại đáp án, ghi lượt nộp, khóa giao dịch, ghi sao duy nhất theo mốc, huy hiệu, thống kê tuần, kỹ năng, điều chỉnh sao bằng hàm editor-only.
- `33_KetNoiThanhTich.html` (mới): thu các ô nhập Toán, gửi đáp án nguyên gốc và attemptId ổn định khi retry, hiển thị kết quả đồng bộ với máy chủ.
- `15_ThanhTichHoatDong.html` (viết lại): không còn `activityRecords` demo; lấy dashboard từ `layTongQuanThanhTich`, hiển thị 6 chỉ số, 12 huy hiệu, đồ thị 7 ngày/4 tuần, ba môn, ma trận kỹ năng, lịch sử bài nộp; giữ cache trong RAM một phiên.
- `32_CSS_ThanhTichThuc.html` (mới): CSS nâng cấp cho dashboard mới.
- `GiaoDien.html`: bỏ HTML số liệu demo, nạp CSS và JS bridge mới.
- `19_KhongGianHocToan.html`: sau nộp LV gọi bridge; không thưởng 2 sao bằng JavaScript.
- `11_TrangChuDieuHuong.html`: nạp dữ liệu khi chuyển Thành tích (không ép gọi lại khi còn cache).
- `14_BaiTapTuongTac.html`: quiz demo Tiếng Việt/Anh không ghi sao hoặc hoàn thành bài.
- `12_DuLieuLoTrinh.html`: bỏ tiến độ giả các môn chưa nhập dữ liệu; giữ tiến độ Toán địa phương.
- `16_LichHocChuyenCan.html`, `10_DanhSachMonHoc.html`: xóa số liệu demo.
- Các file gốc về dữ liệu bài học và cache vẫn giữ nguyên.

## Google Sheets
Tận dụng Sheet nguồn Bài 20 (ID được khai báo trong `ThanhTichMayChu.gs`):
- `90_Lan_lam_bai`: attempt_id, at_utc, profile_id, lesson_id, level, correct, total, answered, active_seconds, subject, title, correct_ids.
- `91_So_sao`: event_key, at_utc, profile_id, event_type, delta, lesson_id, level, attempt_id, note.
- **Hai tab được tự động tạo với hàng tiêu đề khi lần đầu Web App gọi API thành tích**, không cần nhập thủ công. Chưa tạo dữ liệu thưởng demo.
- Luồng dùng `SpreadsheetApp.openById` và `LockService` để tránh cộng trùng.

## Chính sách sao
- LV1 +15, LV2 +25, LV3 +35 (khi đúng >=70%; chỉ lần đầu mốc mỗi lesson+LV).
- Đạt 100% +5 /LV một lần.
- Tăng >=20 điểm phần trăm so lần nộp đầu +5 /LV một lần.
- Sửa đúng câu ban đầu làm sai +5 /LV một lần.
- Ngày có ít nhất 1 câu đúng +5 mỗi ngày một lần.
- Sai bài không trừ sao, bấm lại không cộng lại; màn hình học chỉ gửi đáp án, server tự chấm từ Sheet nguồn.
- **Sao hành trình (XP):** chỉ tổng sự kiện học thật. **Ví sao:** tổng delta mọi giao dịch (học, tặng thêm, đổi/trừ). Tặng thêm từ phụ huynh tăng ví nhưng không tạo XP học ảo.
- Bài cũ/dữ liệu demo/localStorage không được nhận thưởng hồi tố.

## Trang phụ huynh: chỉ chuẩn bị sổ giao dịch
Đã có hàm nội bộ `dieuChinhSaoPhuHuynh_(delta, lyDo)` trong `.gs`; chỉ nên thực hiện từ Apps Script Editor bởi người quản trị. Mỗi thao tác dùng eventKey riêng, khóa giao dịch và bảo vệ ví không âm.
**Chưa có** giao diện đổi, tự động duyệt, phiếu thưởng YouTube, thanh toán, webhook hay kết nối Family Link.

## Hạn chế và bảo mật
1. V1.1 là **một hồ sơ gia đình mặc định** (`gia_dinh_01`) trong backend. Nếu Web App cho bất kỳ người nào truy cập công khai, các lượt nộp có thể ảnh hưởng chung đến ví sao. **Phải hạn chế quyền truy cập deployment** trước khi dùng sao để đổi quà thật; xây dựng hồ sơ/xác thực khi mở rộng đa người dùng.
2. Frontend vẫn có dữ liệu đáp án để kiểm tra tức thời; không thể dùng Web App công khai không xác thực làm cơ sở chống gian lận tuyệt đối. Server không tin điểm gửi từ frontend, nhưng vẫn cần kiểm soát quyền.
3. Thời gian học là thời gian lượt làm được báo về và giới hạn tối đa 30 phút/lượt, không phải đo chính xác sự tập trung. Chưa có heartbeat hoạt động hay đồng hồ chủ động theo thiết bị.
4. Tiếng Việt và Tiếng Anh hiện chưa có bộ dữ liệu nộp chính thức. Biểu đồ các môn này hiển thị “Chưa có dữ liệu thật”, không tự cấp điểm từ quiz demo.
5. Cache thành tích trên UI trong phiên; mỗi lượt nộp thành công làm mới số liệu bằng một lệnh server. Google Sheet không phải database lớn: sẽ cần tối ưu khi số lượt làm nhiều.
6. Cột `correct_ids` và rule có phiên bản; thay đổi cấu trúc câu hỏi cần migrate/quy tắc chấm, không tự trao lại điểm lịch sử.

## QA đã thực hiện trong môi trường mô phỏng
- Bắt đầu với bảng trống: XP 0, ví 0, huy hiệu 0, 7 ngày biểu đồ.
- Một lượt nộp sai một nửa: chỉ nhận sao ngày học nếu có câu đúng.
- Gửi lại cùng attemptId: không tăng dòng nộp hay sao.
- Nộp cải thiện và 100%: mốc thành công, xuất sắc, tiến bộ và sửa đúng từng loại tối đa một lần.
- Phụ huynh tặng thêm +20: tăng ví, giữ nguyên XP.
- Trừ -15: giảm ví; trừ vượt số dư bị từ chối.
- 12 huy hiệu, thống kê môn/tuần/kỹ năng có dữ liệu định dạng từ server.
- Kiểm tra cú pháp JS các mô-đun đã chỉnh.

**Chưa kiểm thử triển khai thật trong Apps Script, quyền ghi Sheet, khả năng cấp quyền giữa máy tính và Android, hiệu năng/luồng đa thiết bị.**

## Các bước sau khi pull
1. Đồng bộ repo vào Apps Script; cập nhật Web App deployment **new version** và cấp quyền đọc/ghi Google Sheet cho script.
2. Mở Trang chủ hoặc Thành tích; xác nhận hai tab `90_Lan_lam_bai`, `91_So_sao` được tự tạo. Ban đầu các chỉ số phải là 0.
3. Nộp LV1 có câu đúng: kiểm tra bảng kết quả có dòng “Đã đồng bộ” và giao dịch sao ở Sheet; bảng Thành tích tăng đúng.
4. Nộp lại cùng đáp án: kiểm tra chỉ một lượt nộp được ghi, không cộng sao lại.
5. Mở trên Chrome máy tính và tablet Android theo quyền truy cập Web App đã cấu hình; số dư cùng một hồ sơ.
6. Chỉ sau QA thật mới chấp nhận đổi quà có giá trị.
