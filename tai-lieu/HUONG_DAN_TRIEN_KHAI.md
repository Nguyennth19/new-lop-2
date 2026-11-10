# Hướng dẫn triển khai

1. Vào Google Sheets đích → Tiện ích mở rộng → Apps Script → Cài đặt dự án → **Script ID**.
2. Cài Node.js + `@google/clasp`, đăng nhập với `clasp login`.
3. Clone repo, chọn nhánh `feat/google-apps-script-v2-1` nếu chưa merge, `cd apps-script`.
4. Copy `.clasp.example.json` thành `.clasp.json` và điền Script ID.
5. Dùng `clasp show-file-status` kiểm tra → `clasp push`. Khi cập nhật GitHub: `git pull`, sau đó `clasp push`.
6. Apps Script → Triển khai → Ứng dụng web. Khi sửa source cần tạo phiên bản triển khai mới.

### Kết nối dữ liệu Sheets

Các tab được backend đọc: `01_Bai_hoc`, `02_Cap_do`, `03_Nhom_bai`, `04_Cau_hoi`. Nằm trong Sheet đang liên kết thì không cần cấu hình; nằm ở Sheet khác cần đặt Script Property `ID_GOOGLE_SHEET_DU_LIEU` bằng Spreadsheet ID. Hàm `layThongTinDuLieuBaiHoc` có thể chạy thử trong trình chỉnh sửa, **chưa nối với giao diện**.

### Lưu ý

- Backup mã Apps Script đang có trước khi `clasp push`.
- `clasp pull` là chiều Apps Script → máy tính, có thể ghi đè mã.
- Không công khai Web App trước khi hoàn tất kiểm thử và phân quyền.
