# Lớp 2 Vui Học – Google Apps Script V2.1

Dự án chuyển từ file **Demo Lớp 2 V2.1**, giữ giao diện và logic demo; phân tách CSS, hình bìa, icon SVG Material UI, dữ liệu môn học, lộ trình, bài tập, thành tích. Mỗi tệp được đặt tên tiếng Việt **không dấu** để dễ đọc và tương thích Apps Script.

## Cài đặt vào Google Sheets

1. Mở **Google Sheets đích → Tiện ích mở rộng → Apps Script**.
2. Lấy **Script ID** trong **Cài đặt dự án** (khác Spreadsheet ID).
3. Máy tính cần Node.js, sau đó:

```bash
npm install -g @google/clasp
clasp login
git clone https://github.com/Nguyennth19/new-lop-2.git
cd new-lop-2
# Nếu đang dùng nhánh chưa merge:
git switch feat/google-apps-script-v2-1
cd apps-script
cp .clasp.example.json .clasp.json
# Mở .clasp.json và thay DIEN_SCRIPT_ID_CUA_BAN bằng Script ID thật
clasp status
clasp push
```

4. Trong Apps Script chọn **Triển khai → Lần triển khai mới → Ứng dụng web**. Trong giai đoạn kiểm thử, hạn chế quyền truy cập ở mức chủ dự án.

**Chiều đúng:** GitHub → `git pull` → `clasp push` → Apps Script. **`clasp pull` là chiều ngược** (Apps Script → máy tính); không dùng nó để gửi mã lên Google Sheets.

## Phân chia module

| Mảng | File |
|---|---|
| Máy chủ / trang chính | `MayChu.gs`, `GiaoDien.html` |
| CSS nền, trang chủ, thành tích, lộ trình | `01_CSS_*.html` → `04_CSS_*.html` |
| Icon SVG chuẩn MUI | `07_BieuTuongMUI.html` |
| Ảnh minh họa Toán, Tiếng Việt | `08_AnhMonToan.html`, `09_AnhMonTiengViet.html` |
| Danh sách môn | `10_DanhSachMonHoc.html` |
| Trang chủ và điều hướng | `11_TrangChuDieuHuong.html` |
| Dữ liệu và hiển thị lộ trình | `12_DuLieuLoTrinh.html`, `13_HienThiLoTrinh.html` |
| Bài tập tương tác | `14_BaiTapTuongTac.html` |
| Thành tích, hoạt động gần đây | `15_ThanhTichHoatDong.html` |
| Cấu hình/đọc Google Sheets | `CauHinh.gs`, `DocDuLieuSheet.gs` |

`GiaoDien.html` là trang được `doGet()` kết xuất. Các file JS/CSS được ghép bằng `<?!= napThanhPhan('Tên') ?>`. Mọi file cần push nằm trong **apps-script/**.

### Giới hạn V2.1

- Chủ đề, bài học, ảnh, câu hỏi, thành tích vẫn theo dữ liệu mẫu V2.1.
- Tiến độ học lưu bằng **localStorage**, chưa đồng bộ giữa thiết bị.
- `layThongTinDuLieuBaiHoc()` là API đọc Sheet **tùy chọn**, chưa kết nối với lộ trình trong giao diện.
- Chưa triển khai Web App thực tế/QA với tài khoản thật; không mở cho học sinh trước khi kiểm tra phân quyền và bảo vệ dữ liệu trẻ em.
- Chưa đối chiếu nội dung demo với sách giáo khoa.

Xem [Hướng dẫn triển khai](tai-lieu/HUONG_DAN_TRIEN_KHAI.md) và [Checklist QA](tai-lieu/KIEM_THU.md).
