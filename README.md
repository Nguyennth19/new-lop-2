# Lớp 2 – Dự án Google Apps Script V2.1 (đã sửa đường dẫn)

Mã nguồn dùng cho **Google Apps Script gắn với Google Sheets**, lấy từ giao diện Demo Lớp 2 V2.1. Các tệp `.gs` / `.html` / `appsscript.json` **nằm tại thư mục gốc repository**, không có tiền tố `apps-script/`.

## Khắc phục lỗi “Không tìm thấy tệp HTML có tên GiaoDien”

Apps Script chỉ tìm `createTemplateFromFile('GiaoDien')` khi tên dự án thực tế là **GiaoDien** (không phải `apps-script/GiaoDien`). Bản này chuyển tất cả tệp ứng dụng lên root, giữ nguyên lệnh trong `MayChu.gs`. Khi đồng bộ lại GitHub, kiểm tra danh sách tệp trong Apps Script không còn `apps-script/`; nếu còn, xóa các tệp phiên bản cũ để tránh khai báo `doGet` trùng.

## Ảnh bìa ba môn học

Ảnh gốc lấy từ [thư mục Drive của dự án](https://drive.google.com/drive/folders/12R_DKbSSO6XPTv2gYFztVuSOHmHqwX4m). Đã đưa bản sao PNG lên `hinh-anh/`:

| Môn | Ảnh GitHub | Biến JS |
|---|---|---|
| Toán | `hinh-anh/Toan-2.png` | `ANH_TOAN` |
| Tiếng Việt | `hinh-anh/Tieng-Viet-2.png` | `ANH_TIENG_VIET` |
| Tiếng Anh | `hinh-anh/Tieng-Anh-2.png` | `ANH_TIENG_ANH` |

Tệp `AnhMonToan.html`, `AnhMonTiengViet.html` và `AnhMonTiengAnh.html` khai báo URL `raw.githubusercontent.com`. Ảnh được tải qua Internet từ repository công khai; không yêu cầu người xem đăng nhập Drive.

## Sơ đồ tệp tại thư mục gốc

| Loại | Tệp |
|---|---|
| Máy chủ GAS | `MayChu.gs`, `CauHinh.gs`, `DocDuLieuSheet.gs` |
| Trang HTML chính | `GiaoDien.html` |
| CSS | `01_CSS_NenTang.html`, `02_CSS_TrangChu.html`, `03_CSS_ThanhTich.html`, `04_CSS_LoTrinh.html` |
| Material SVG | `07_BieuTuongMUI.html` |
| Ảnh môn | `AnhMonToan.html`, `AnhMonTiengViet.html`, `AnhMonTiengAnh.html` |
| Điều hướng / dữ liệu | `10_DanhSachMonHoc.html`, `11_TrangChuDieuHuong.html`, `12_DuLieuLoTrinh.html` |
| Lộ trình / bài tập / thành tích | `13_HienThiLoTrinh.html`, `14_BaiTapTuongTac.html`, `15_ThanhTichHoatDong.html` |
| Apps Script manifest | `appsscript.json` |

## Hai cách đồng bộ

**Cách 1 – Tích hợp GitHub trong Apps Script (như ảnh bạn gửi):** Chọn nhánh `main`, đồng bộ lại repository sau khi merge. Đảm bảo `GiaoDien.html` / `MayChu.gs` nằm tại root. Không để đồng thời bản cũ có tiền tố `apps-script/` trong Apps Script.

**Cách 2 – clasp:** Tạo dự án Apps Script gắn Sheet, copy `.clasp.example.json` → `.clasp.json`, thay Script ID. Từ **thư mục root của repository** chạy:
```bash
npm install -g @google/clasp
clasp login
clasp show-file-status
clasp push
```
Khi sửa GitHub thì dùng `git pull` rồi `clasp push`, không dùng `clasp pull` để gửi mã lên Apps Script. Sao lưu các tệp Apps Script cũ trước khi push.

Sau khi đồng bộ: chọn chạy `doGet` để kiểm tra không còn lỗi thiếu template; tiếp theo triển khai ứng dụng web trong Apps Script. `doGet` kiểm tra việc tạo trang, **không phải** phép thử đầy đủ trình duyệt.

## Giới hạn bản demo

Giao diện vẫn dùng dữ liệu mẫu V2.1 và lưu tiến độ trong localStorage, chưa đồng bộ theo tài khoản. Bộ API đọc Sheets chỉ là hàm hỗ trợ, chưa dùng trực tiếp để sinh bài học. Không triển khai công khai với học sinh thật trước khi QA phân quyền, lưu dữ liệu và đối chiếu kiến thức từ SGK.

Xem thêm `tai-lieu/HUONG_DAN_TRIEN_KHAI.md` và `tai-lieu/KIEM_THU.md`.
