# M1 – HỢP ĐỒNG MODULE VÀ KẾ HOẠCH TÁI CẤU TRÚC

**Nhánh duy nhất để triển khai:** `test-theo-main`. `main` là chuẩn đối chiếu không chỉnh sửa. Không chuyển file từ `test-bai-20` vào đây.

## Nguyên tắc bắt buộc
1. Visual parity trước tiên: giao diện, font, màu, kích thước, khung, icon, điểm và bàn phím giống `main` tại cùng viewport.
2. Mỗi thay đổi chỉ tách **một trách nhiệm**; giữ nguyên API công khai, ID DOM và nguồn dữ liệu nếu có thể.
3. Không sửa chế độ cấp sao, ledger hoặc phân quyền phụ huynh trong nhánh refactor giao diện.
4. Không đổi tên/di chuyển Apps Script vào thư mục gây lỗi clasp; tên Việt không dấu, top-level.
5. Không xóa file cũ trước khi kiểm thử tính tương đương; giữ rollback SHA/commit từng bước.
6. CSS sở hữu theo component; không dùng các bản vá hậu kỳ làm kiến trúc chính.

## Thứ tự triển khai sau M1
| Bước | Thao tác | File đích dự kiến | Gate bắt buộc |
|---|---|---|---|
| M2.0 | Chốt baseline QA và ảnh chuẩn tại desktop + mobile | Tài liệu + ảnh chụp thực tế | Có ảnh gốc cùng viewport và kịch bản kiểm thử |
| M2.1 | Tập trung token, không đổi computed style | `01_CSS_NenTang` | Screenshot không đổi, computed values không lệch |
| M3.1 | Tách HTML shell + header/sidebar của không gian Toán | `KhungHocChung.html` | LV1–3, back, sidebar, focus và tab hoạt động như gốc |
| M3.2 | Tách bàn phím hiển thị và xử lý sự kiện | `BanPhimChung.html` | Nhập, xóa, đổi ô, phép toán, mobile không che ô |
| M3.3 | Tách bảng kết quả | `BangKetQuaChung.html` | Đúng/sai/chưa làm/chưa kiểm tra, thời gian và nút nộp |
| M3.4 | Module phản hồi, nhân vật | `NhanVatHoiThoai.html` | Không hiện khi không cần; asset fallback an toàn |
| M4.1 | Asset registry và vị trí | `ThuVienAsset`, `CauHinhViTriAnh` | Không sai nhãn, đúng slot/kích cỡ và fallback |
| M5 | QA hồi quy, xem xét merge khi người dùng duyệt | Không tự merge | Đạt toàn bộ cổng nghiệm thu |

## Hợp đồng tối thiểu mỗi module
- **Input:** dữ liệu bất biến/hoặc state có mô tả rõ.
- **Output:** HTML / DOM theo interface hoặc sự kiện.
- **Owner:** 1 file component; 1 file CSS sở hữu style (nếu có).
- **Được phép:** tương tác trong phạm vi UI component.
- **Không được:** ghi sao, cập nhật Google Sheet, thay lesson id hay grant permission.
- **Test:** cấu trúc DOM, thao tác, visual parity, bàn phím, responsive, rollback.

### Ví dụ module bảng kết quả
Input: `{questions, answers, grading, attempt, duration, submissionStatus}`.
Output: markup/trạng thái, callback `onSubmit`, `onReset`, `onSelectQuestion`.
Không gọi `THANH_TICH_GUI.send` hoặc tự tính thưởng; controller cấp callbacks tương ứng.

### Ví dụ module bàn phím
Input: `{keys, selectedInput, inputMode, disabled}`.
Output: sự kiện `onKey`, `onErase`, `onToggle`.
Không tự ghi kết quả câu hỏi. Toán cung cấp bộ phím toán, không hard-code vào khung chung.

## Kiểm thử hồi quy tối thiểu
- Trang chủ: sidebar, topbar, 3 môn, robot, responsive.
- Lộ trình: chuyển môn, mở Bài 20, LV1–3, trở về.
- Câu Toán: vertical, mental, missing_digit, word_problem; đúng, sai, bỏ trống, sửa và nộp lại.
- Bàn phím: chuột, phím máy tính, focus, Backspace, số nhớ, nhập đáp án.
- Kết quả: bộ đếm, trạng thái từng câu, thời gian, sao **chỉ server cấp**.
- Hình: asset tải được, slot đúng, fallback khi lỗi mạng.
- Phụ huynh: trang đăng nhập, dashboard, quyền, lịch sử sao.
- Desktop chính của bé và mobile: không che nội dung/nút.
- Smoke test Google Apps Script TEST và log server.
