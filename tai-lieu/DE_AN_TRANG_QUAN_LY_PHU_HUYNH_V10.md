# Thiết kế trang quản lý phụ huynh V1.0 – Lớp 2
Ngày: 11/11/2026
Trạng thái: **ĐỀ ÁN THẢO LUẬN; CHƯA TRIỂN KHAI WEB APP**.
Nguồn đối chiếu: `GiaoDien.html`, `ThanhTichMayChu.gs`, `11_TrangChuDieuHuong.html`, `tai-lieu/GHI_CHU_TRANG_PHU_HUYNH_DOI_THUONG_SAU.md` trên nhánh main.

## 1. Vị trí và nguyên tắc
- Tạo trang riêng `parent` trong cùng Google Apps Script Web App, không tạo app thứ hai ngay.
- Truy cập từ cụm **Robot avatar + Bạn nhỏ lớp 2 + Nhà thám hiểm tri thức** ở góc trên phải, clickable toàn bộ với button, hỗ trợ keyboard, aria-label, vùng chạm >=44px. Đừng chỉ gắn onclick vào ảnh.
- Không đưa Trang phụ huynh vào sidebar học sinh.
- Khi thoát quản lý, trả về trang học trước đó; chỉ nút đóng/thoát, không che nội dung khi chưa xác thực.
- Chia mô-đun để không sửa lan truyền HTML chung: `36_CuaVaoPhuHuynh.html`, `37_CSS_PhuHuynh.html`, `PhuHuynhXacThuc.gs`, `PhuHuynhQuanTri.gs`, `38_DashboardPhuHuynh.html`, `39_QuanLySaoPhuHuynh.html` (tên dự kiến).

## 2. Sáu khu vực
### A. Tổng quan (P0)
- Hồ sơ bé, ngày học hợp lệ, thời gian học **theo các lượt đã ghi nhận** (chưa đại diện thời gian tập trung thật), số bài/LV hoàn thành, kết quả gần đây, tổng sao học tập (XP), ví sao, huy hiệu mới.
- Hoạt động gần đây, mục tiêu tuần; không hiển thị số liệu giả khi chưa có dữ liệu.
- Trạng thái liên kết máy tính + tablet Android cùng profile; báo lỗi đồng bộ minh bạch.

### B. Báo cáo học tập (P0)
- Theo môn Toán/Tiếng Việt/Tiếng Anh, 7 ngày/4 tuần, độ chính xác, kỹ năng vững/cần luyện và lịch sử lượt nộp.
- Bộ lọc môn, khoảng thời gian, cấp độ, bài và chủ đề.
- Chỉ có dữ liệu thực Toán Bài 20 ở giai đoạn hiện tại; môn khác hiển thị 'Chưa có dữ liệu học thật', không suy diễn.

### C. Quản lý sao (P0, quan trọng nhất)
- XP học tập **không giảm**; ví sao = tổng giao dịch; thưởng phụ huynh chỉ tăng ví, không tăng XP.
- Giao dịch: `parent_bonus` cộng, `parent_redeem` trừ, `parent_refund` hoàn (thiết kế sau). Có lý do, số sao, dấu thời gian, eventId, profileId, idempotency.
- Không sửa/xóa giao dịch; sửa sai bằng giao dịch bù có liên kết tham chiếu.
- Tự động kiểm tra ví không âm và giới hạn trị tuyệt đối; không chấp nhận delta do frontend tự tính mà không kiểm tra server.
- Mỗi thao tác cộng/trừ phải xác nhận lại PIN/phiên quản trị hợp lệ. Không đưa hàm `dieuChinhSaoPhuHuynh_` ra client trực tiếp.
- Danh mục quà và tự động kiểm soát thời gian Youtube/game **hoãn**, vẫn có thể ghi `note` 'đổi quà thủ công'.

### D. Huy hiệu và mục tiêu (P1)
- Xem điều kiện 12 huy hiệu, tiến độ từng huy hiệu, phân tích vì sao chưa đạt.
- Cho phép phụ huynh điều chỉnh mục tiêu tuần; không tùy ý cấp huy hiệu học lực sai dữ kiện.
- Quy tắc thưởng tự động dùng phiên bản cấu hình; có lịch sử thay đổi.

### E. Kế hoạch học (P1)
- Lập mục tiêu theo buổi/tuần, lịch theo môn; ghi ngày nghỉ hợp lý để không phạt chuyên cần.
- Bổ sung gợi ý luyện tập dựa trên kết quả thực; không ép thời lượng học quá lâu.
- Lịch chưa có dữ liệu phải hiển thị 'Chưa thiết lập', không dùng lịch demo.

### F. Hồ sơ và cài đặt (P0 một phần, P2 còn lại)
- Đổi PIN, cấu hình phiên, chọn hồ sơ khi hỗ trợ đa trẻ; backup/export CSV và nhật ký thay đổi chỉ cho phụ huynh.
- Trường hợp quên PIN: reset bằng quyền chủ ứng dụng/định danh phụ huynh đã xác thực, không có nút reset PIN công khai.
- Tránh yêu cầu tên thật, địa chỉ, ảnh riêng tư của trẻ khi không cần thiết.

## 3. PIN 4 chữ số và an toàn
- PIN 4 số chỉ có 10.000 khả năng, **không đủ làm yếu tố xác thực duy nhất** cho Web App công khai có quyền ghi Sheets.
- Chế độ gia đình giới hạn quyền truy cập Web App: PIN làm bước khóa giao diện bổ sung. Nếu Web App mở cho người lạ, phải có định danh người lớn mạnh hơn (ví dụ tài khoản Google được chấp thuận) và kiểm tra quyền ở máy chủ; `Session.getActiveUser().getEmail()` có thể rỗng khi script chạy theo quyền deployer, không được dựa vào trường này mà chưa xác minh execution mode.
- Server lưu **bộ kiểm chứng PIN đã băm, có salt** trong Script Properties; không bao giờ nhúng PIN/băm vào HTML, source GitHub, localStorage hoặc Sheet có quyền xem công khai. Google Apps Script không có sẵn Argon2 chuẩn; phải chọn giải pháp KDF an toàn được kiểm tra hoặc sử dụng identity provider, không tuyên bố SHA256 đơn lẻ đủ chống đoán offline.
- Rate-limit theo định danh/tài khoản và thời gian, lock 15 phút sau 5 sai (có thể cấu hình), phiên máy chủ có token ngẫu nhiên, hết hạn khi nhàn rỗi 10 phút, kiểm tra token+quyền ở **mọi API admin**, không chỉ lúc mở giao diện.
- Re-auth khi trừ sao, đổi PIN, xuất dữ liệu trẻ, reset; khóa toàn bộ API admin bằng role server, chống race bằng LockService.
- HTTPS, không đưa secret vào response, không log PIN; rollback và audit log.
- Khi đã có phụ huynh thật, không dùng `ACH_PROFILE='gia_dinh_01'` chung cho nhiều người dùng; thiết kế profile ID và quyền truy cập rõ.

## 4. Giao dịch và bộ máy hiện tại
- `ThanhTichMayChu.gs` đã có `layTongQuanThanhTich()`, sổ sao `91_So_sao`, hàm nội bộ `dieuChinhSaoPhuHuynh_(delta, lyDo)`. V1 cần đặt một API admin có server-side permission check, không đổi cấu trúc ledger không cần thiết.
- Cần giải quyết sự phân biệt `earned` (sao học tập) và `balance` (ví sao) kể cả khi có hoàn/refund.
- Nên thêm `admin_action_id` / request_key idempotent và actor, reference transaction, audit. Giá trị hiện tại là một profile, chưa đa người dùng.

## 5. Quy trình triển khai
1. **P0A – Shell:** click vùng hồ sơ -> PIN view -> return to previous view; CSS responsive, icon đồng bộ; không làm API ghi.
2. **P0B – Authentication & permission:** triển khai PIN/server-session/rate-limit; kiểm thử gọi API admin trực tiếp khi chưa có token phải từ chối.
3. **P0C – Dashboard read-only:** tổng quan + báo cáo thực, cache data một phiên; bắt đầu số 0.
4. **P0D – Ledger actions:** cộng/trừ sao có xác nhận, lịch sử, request key và retry, không âm; QA máy tính/tablet; sao học tập không thay đổi.
5. **P1 – huy hiệu và mục tiêu tuần.**
6. **P2 – lập kế hoạch, nhập/xuất, đa hồ sơ, quà & đổi thưởng có quy trình; liên kết bên thứ ba phát triển riêng.**

## 6. Kiểm thử nghiệm thu bắt buộc
- Vùng Robot+chữ mở được trang và back/ESC/Android trở về đúng.
- 5 PIN sai phải khóa; sau thời gian/qua thiết bị khác vẫn tuân server limit; nhập PIN đúng không ghi ra log.
- Không token: gọi API cộng/trừ hoặc đổi PIN từ DevTools bị từ chối. Token của trẻ/expired không thể chỉnh.
- Bấm hai lần/tải lại request: chỉ một dòng giao dịch; ví không âm; bonus +50 tăng ví 50 nhưng XP giữ nguyên; trừ -20 giảm ví đúng; lịch sử audit đủ.
- Chrome máy tính và tablet Android cùng profile thấy cùng ví khi mở trang; không làm lộ PIN hoặc file sao.
- Không thêm dữ liệu demo vào ledger; lỗi đọc Sheet phải báo lỗi, không hiển thị như số 0 có thật.
- Lưu code và tài liệu trên GitHub trước khi pull; có test/static QA và checklist runtime.

## 7. Nguồn kỹ thuật
- Apps Script executeAs/access: https://developers.google.com/apps-script/manifest/web-app-api-executable
- Apps Script identity limitations: https://developers.google.com/apps-script/reference/base/session
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

**Trạng thái:** Chỉ thiết kế và lưu GitHub. Chưa sửa `GiaoDien.html`, chưa thêm màn hình đăng nhập thật, chưa đặt PIN hoặc tạo quyền admin.
