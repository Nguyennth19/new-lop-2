# Tích hợp Trang quản lý Phụ huynh V1.0 – Hướng dẫn nghiệm thu

**Ngày:** 11/11/2026  
**Mã nguồn:** `Nguyennth19/new-lop-2`  
**Phạm vi:** cổng vào từ Robot + thông tin bé; PIN 4 số; tổng quan, báo cáo, ví sao, huy hiệu, ghi chú, đổi PIN. **Không tạo cửa hàng đổi quà hay liên kết YouTube/game.**

## 1. Các file tách riêng

| File | Chức năng |
|---|---|
| `PhuHuynhMayChu.gs` | Xác thực PIN, phiên 10 phút, khóa sau 5 lần nhập sai, thông tin quản trị, cộng/trừ sao, ghi chú, đổi/khôi phục PIN |
| `36_CuaVaoPhuHuynh.html` | UI phụ huynh: đăng nhập, dashboard, báo cáo, ví sao, huy hiệu, ghi chú, cài đặt |
| `37_CSS_PhuHuynh.html` | Giao diện responsive, theo font và bảng màu toàn dự án |
| `GiaoDien.html` | Bọc avatar Robot + thông tin bé thành nút `ph-entry` và nạp hai module chuyên biệt |

Không đưa trang quản lý vào sidebar của bé. Phần quản lý nằm trong overlay riêng và không hiển thị dữ liệu trước khi máy chủ xác thực.

## 2. THIẾT LẬP PIN LẦN ĐẦU — bắt buộc trước khi test

**Không có PIN mặc định. Không điền PIN vào GitHub hoặc file HTML/GS.**

1. Pull mã nguồn và đồng bộ các file `.gs`, `.html` vào Apps Script.
2. Mở Apps Script **Project Settings → Script properties**.
3. Thêm khóa `PH_PIN_BOOTSTRAP` và giá trị **bốn số bạn tự chọn**. Chọn số khó đoán, không dùng `0000`, `1234`, năm sinh hoặc ngày sinh.
4. Trong Apps Script Editor, chạy thủ công hàm `phuHuynhKhoiTaoPin_` dưới quyền chủ dự án. Google yêu cầu cấp quyền khi chạy lần đầu.
5. Hàm tự tạo salt + bộ kiểm chứng băm, ghi Script Properties và **xóa `PH_PIN_BOOTSTRAP`**. Không cần lưu mã PIN ở nơi nào khác trong dự án.
6. Deploy Web App **New version**, truy cập bằng Chrome máy tính hoặc Android và bấm cả vùng Robot + tên bé để đăng nhập.

**Khi quên PIN:** tạo lại khóa `PH_PIN_BOOTSTRAP`, sau đó chủ dự án chạy `phuHuynhKhoiPhucPinQuanTri_` trong Editor. Hàm xóa khóa tạm và thu hồi tất cả phiên cũ. Không có nút reset PIN công khai trong web.

**Vì an toàn:** Không triển khai Web App chế độ `Anyone` để quản lý ví sao bằng PIN bốn chữ số đơn lẻ. Hạn chế quyền truy cập đến đúng thành viên gia đình; nếu cần mở công khai về sau, phải bổ sung Google Sign-In hoặc cơ chế xác thực phụ huynh mạnh hơn ở backend.

## 3. Dữ liệu

Tái sử dụng `90_Lan_lam_bai`, `91_So_sao` và `ACH_PROFILE=gia_dinh_01`.
Tự tạo tab `92_Ghi_chu_phu_huynh` khi phụ huynh mở dashboard lần đầu; các cột: `note_id, at_utc, profile_id, content`.
Không nhập dữ liệu demo, không thay SGK, bài tập hoặc logic chấm bài.

**Hai khái niệm tách biệt:**
- Sao hành trình = chỉ sao kiếm từ hoạt động học (XP), không giảm khi đổi thưởng.
- Ví sao = số dư của toàn bộ giao dịch. Thưởng phụ huynh tăng ví, không tăng XP. Trừ sao là giao dịch mới `parent_redeem` chứ không xóa lịch sử.

## 4. Mục giao diện

- **Tổng quan:** sao hành trình, ví sao, cấp độ hoàn thành, ngày học, độ chính xác, huy hiệu, hoạt động 7 ngày và bài nộp gần đây.
- **Báo cáo:** Toán/Tiếng Việt/Tiếng Anh; 4 tuần; nhóm kỹ năng. Hiển thị “Chưa có dữ liệu thật” nếu chưa có lượt nộp.
- **Quản lý sao:** thưởng (+) / trừ (-) 1–10.000 sao, có lý do >=6 ký tự, yêu cầu nhập lại PIN, xác nhận trước khi ghi; 120 giao dịch mới nhất.
- **Huy hiệu:** điều kiện, số tiến độ, đạt/chưa đạt.
- **Ghi chú:** ghi và xem ghi chú phụ huynh, không ảnh hưởng điểm/huy hiệu.
- **Cài đặt:** đổi PIN (yêu cầu PIN cũ), đăng xuất, không reset từ client.

## 5. Kiểm soát dữ liệu quan trọng

- Không gửi hàm `dieuChinhSaoPhuHuynh_` cũ trực tiếp từ web.
- API ghi `phuHuynhDieuChinhSao` kiểm tra **token máy chủ + PIN + requestId + số dư + idempotency** trong một `LockService`.
- Phiên CacheService có TTL/idle khoảng 10 phút, lưu token ngẫu nhiên chỉ ở bộ nhớ tab, không lưu PIN/token vào localStorage.
- 5 lần nhập sai PIN -> khóa toàn cục 15 phút (phù hợp app dùng một hồ sơ gia đình); phiên cũ mất hiệu lực khi đổi PIN.
- Không cho số dư âm; xử lý lỗi bằng thông báo, không báo thành công trước khi máy chủ trả về.
- Ghi chú và lý do được escape khi render, giảm rủi ro injection vào Sheet.
- Vì đây vẫn là PIN 4 số và ứng dụng chạy quyền chủ script, **không coi nó là hệ thống xác thực đủ mạnh cho Web App công khai**.

## 6. QA tĩnh và kiểm thử mô phỏng đã thực hiện

- [x] Hai module JS/GS mới parse syntax không lỗi.
- [x] `GiaoDien.html` có 20 cặp `<script>` đóng/mở, nạp CSS + JS đúng, chỉ 1 `ph-entry`.
- [x] Không cấu hình PIN: trạng thái báo chưa thiết lập, không tự đặt mã mặc định.
- [x] Khởi tạo PIN xóa property tạm.
- [x] Năm lần nhập sai: khóa 15 phút; PIN đúng khi đang khóa vẫn bị từ chối.
- [x] Đăng nhập đúng cho token máy chủ; trang đọc thông tin yêu cầu token.
- [x] Cộng +50, gửi lại cùng requestId => chỉ cộng **một lần**.
- [x] Trừ -20 => ví còn 30, không được trừ quá số dư.
- [x] Ghi chú hoạt động trong mock server.
- [x] Đổi PIN thu hồi token cũ và cho phép đăng nhập PIN mới.
- [ ] Kiểm chứng thật trên Web App Apps Script với quyền và script properties.
- [ ] Chrome máy tính / tablet Android: mở PIN, chuyển tab, nhập 4 số, ghi lưu, thoát và tự hết phiên.
- [ ] Hai thiết bị đồng bộ cùng Sheet, không thể gọi API ghi nếu không có token hợp lệ.
- [ ] Thử mạng chập chờn và xác minh không ghi giao dịch trùng.

### Lưu ý hiệu năng
Trang chỉ gọi Google Sheet khi phụ huynh đăng nhập hoặc chủ động tải lại. Khi chuyển giữa các tab quản lý, ứng dụng dùng snapshot hiện có để tránh đọc Sheet lặp lại.

## 7. Trạng thái phát hành

Mã nguồn đã được lưu GitHub. **Chưa tự cấu hình PIN, chưa triển khai Apps Script hay kiểm thử Chrome thật** từ phía trợ lý. Sau khi pull và cài PIN, cần nghiệm thu trên Web App trước khi sử dụng sổ sao cho phần thưởng có giá trị.
