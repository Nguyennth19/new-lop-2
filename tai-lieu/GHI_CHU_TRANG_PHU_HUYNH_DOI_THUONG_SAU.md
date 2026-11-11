# Ghi chú dành riêng cho trang phụ huynh – Đổi thưởng và điều chỉnh sao
Ngày 11/11/2026. **CHƯA TRIỂN KHAI GIAO DIỆN ĐỔI QUÀ TRONG LỚP 2.**

## Quyết định
Bé hiện chỉ học, xem số sao và huy hiệu. Chưa hiển thị cửa hàng, nút đổi quà, cấp thời gian YouTube hoặc phê duyệt. Khi mở rộng, xây dựng **trang phụ huynh riêng**, có thể là Web App Apps Script khác dùng cùng kho dữ liệu `91_So_sao`. Không cần liên kết trực tiếp với giao diện bé nếu không mong muốn.

## Đã chuẩn bị sẵn cho tương lai
- `ThanhTichMayChu.gs`: sổ sao bất biến theo sự kiện, mỗi dòng có `event_key, at_utc, profile_id, event_type, delta, lesson_id, level, attempt_id, note`.
- Sao hành trình: **chỉ cộng sự kiện học tập** (`level_done`, `perfect`, `improved`, `retry_success`, `daily`); không tăng khi phụ huynh tặng thêm sao vào ví.
- Ví sao: **tổng tất cả delta** (cộng thành tích/thưởng phụ huynh và trừ đổi thưởng). Số dư không được âm.
- Hàm nội bộ `dieuChinhSaoPhuHuynh_(delta, lyDo)` đã có LockService, kiểm tra số sao và nhật ký bất biến. Chỉ gọi qua Apps Script Editor hoặc các hàm admin được kiểm soát sau này. KHÔNG xuất nút này vào Web App bé và KHÔNG gọi trực tiếp từ client.
- +100 sao là sự kiện `parent_bonus`; -80 sao là `parent_redeem`, có lý do, thời điểm và khóa giao dịch riêng. Không sửa lại số cũ hoặc xóa dòng lịch sử.

## Yêu cầu bắt buộc khi phát triển trang phụ huynh
1. Định danh và xác thực phụ huynh (Google Account hoặc cơ chế mật khẩu/OTP đáng tin cậy). Không dùng PIN lưu trong JavaScript, không tin thao tác chỉ ở frontend.
2. Quy trình `requested → approved → delivered`, có `rejected/refunded`. Khi từ chối không mất sao; nếu đã trừ phải hoàn sao bằng **sự kiện mới**, không xóa dòng cũ.
3. Phụ huynh chỉnh được danh mục quà, giá, giới hạn mỗi tuần, lý do tăng/trừ và lịch sử.
4. Có thể kết hợp phiếu thưởng YouTube Kids, web-game hoặc quà vật lý; Web App thường không có quyền điều khiển toàn bộ ứng dụng Android hay sửa Family Link trực tiếp.
5. Dữ liệu phải đồng bộ giữa Chrome máy tính và tablet Android qua cùng bảng server.
6. Trước khi kết nối bên ngoài phải chuyển từ chế độ hồ sơ gia đình mặc định sang xác thực người dùng thực sự; không triển khai Web App công khai ẩn danh cho chức năng đổi thưởng.
7. Bài học cũ và các con số demo **không được chuyển thành sao có thể đổi**.

## Ví dụ lịch sử
| Sự kiện | Thay đổi ví | Sao hành trình | Ví sao |
|---|---:|---:|---:|
| Bé hoàn thành LV1 | +15 | 15 | 15 |
| Phụ huynh thưởng thêm | +20 | 15 | 35 |
| Đổi phần thưởng | -25 | 15 | 10 |
| Hoàn trả một yêu cầu đổi bị hủy | +25 (sự kiện hoàn trả, **không tính XP**) | 15 | 35 |

**Lưu ý kỹ thuật:** Phiên bản hiện tại đã tách XP học tập với thưởng phụ huynh. Nếu tương lai thêm hoàn trả, dùng `parent_refund` để cộng ví mà không cộng XP. Chưa cho phép hoàn trả qua giao diện hiện tại.

## Phạm vi phiên bản đang làm
Chỉ có dashboard số liệu thật, điểm thưởng học và sổ sao. Không tạo `DanhMucQua`, `YeuCauDoiQua`, không thêm nút/phần thưởng YouTube.
