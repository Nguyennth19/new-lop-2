# M2.1 – TẬP TRUNG CẤU HÌNH GIAO DIỆN AN TOÀN
Ngày 2026-11-12; nhánh `test-theo-main`.

## Đã làm
- Chuyển **19 biến CSS :root có đúng một định nghĩa** từ `02_CSS_TrangChu.html` (15 biến) và `04_CSS_LoTrinh.html` (4 biến) sang `01_CSS_NenTang.html`.
- Giữ nguyên tên biến và giá trị: font hệ thống, màu trạng thái, nền và màu riêng của lộ trình.
- Giữ nguyên toàn bộ selector phần tử, thứ tự nạp stylesheet, media query và HTML/JS.
- Không chỉnh logic chấm, thưởng sao, dữ liệu học sinh.

## Kiểm định nguồn
- 19/19 token được di chuyển đúng một lần.
- Tập hợp toàn bộ cặp biến/giá trị trong 3 file giống trước và sau.
- Dãy @media trong từng file giống trước và sau.
- **Chưa thể xác nhận pixel-perfect** nếu chưa có ảnh trước/sau trên Web App thật và đối chiếu computed style.

## Chưa chuyển (có chủ đích)
- Biến màu `--blue`, `--ink`, `--muted`, `--bg`, `--yellow` v.v. được ghi đè nhiều lần; di chuyển lúc này có thể thay thứ tự cascade.
- `--app-sidebar-width`, `--app-header-height`, `--app-view-top-gap` phụ thuộc breakpoint; giữ tại file gốc.
- 18_CSS_HocToan/20/22/25/29 sẽ xử lý qua chủ sở hữu component ở M3, không gộp ồ ạt.
- Breakpoint chỉ được **kiểm kê và lập bản đồ**, chưa đồng nhất 800/840/980/... vì thay số sẽ thay cách dàn trang.

## Cổng tiếp theo
1. Pull nhánh và deploy vào Apps Script TEST riêng.
2. Chụp màn nền gốc `main` và nhánh M2.1 cùng viewport.
3. Đối chiếu font, màu, kích thước, sidebar, bàn phím, bảng kết quả, các LV Toán và ảnh.
4. Chỉ chốt M2.1 sau khi mọi sai khác ngoài dự kiến được xử lý.
