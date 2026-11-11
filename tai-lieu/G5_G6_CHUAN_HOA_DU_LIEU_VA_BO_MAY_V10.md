# G5 + G6 — Chuẩn hóa dữ liệu và bộ máy bài học Lớp 2

**Chốt:** 11/11/2026 · **Dành cho một học sinh lớp 2, sử dụng trong gia đình.**  
**Nhánh thực hiện:** `feature/g5-g6-chuan-hoa-bo-may-v1`

## 1. Nguyên tắc được duyệt và giữ nguyên

- **PIN 4 số:** giữ nguyên cơ chế hiện hành; không bổ sung đăng nhập nhiều lớp hay nâng cấp xác thực trong G5/G6.
- **Hồ sơ:** giữ duy nhất `gia_dinh_01`, không xây module đa hồ sơ.
- **Thiết bị:** người sử dụng đã nghiệm thu Chrome máy tính và Android về bố cục; lượt sửa này không được tuyên bố đã chạy lại trên thiết bị từ phía trợ lý.
- **Dữ liệu thực:** giữ nguyên Toán `toan_b20` gồm lý thuyết, ba LV và 51 câu hỏi từ Google Sheet; coi là **chưa học** khi cả ba tab 90/91/92 chưa có giao dịch.
- **Tiếng Việt / Tiếng Anh:** giữ thẻ môn và bìa WebP, không hiển thị bài mẫu hoặc câu hỏi demo.
- **Sao hành trình và ví sao:** không thêm/xóa điểm; chỉ máy chủ xác nhận dấu tích, ngày học và sổ sao. PIN phụ huynh không bị reset.

## 2. Đã kiểm tra dữ liệu trên Google Sheet

Spreadsheet ID `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8`

| Tab | Kiểm tra |
|---|---|
| `01_Bai_hoc` | Có Bài 20 đúng mã `toan_b20` |
| `02_Cap_do` | LV1, LV2, LV3 |
| `03_Nhom_bai` | 8 nhóm |
| `04_Cau_hoi` | **51/51 câu hợp lệ**, 16 đặt tính, 9 tính nhẩm, 8 lời văn, 18 tìm chữ số |
| `90_Lan_lam_bai` | **Chỉ có hàng tiêu đề**, không có kết quả thật để xóa |
| `91_So_sao` | **Chỉ có hàng tiêu đề**, không có sao cần điều chỉnh |
| `92_Ghi_chu_phu_huynh` | **Chỉ có hàng tiêu đề** |

**Không xóa câu hỏi, SGK/SBT, dữ liệu cấu hình, hình gốc hoặc các tab QA.** Vì ba tab hoạt động đã trống, reset trên máy chủ được xác nhận ở trạng thái ban đầu mà không cần thao tác xóa hàng.

## 3. Tái cấu trúc module

| Module | Nhiệm vụ |
|---|---|
| `CauHinh.gs` | Một nguồn Sheet ID (property `ID_GOOGLE_SHEET_DU_LIEU` có thể ghi đè), mã hồ sơ và timezone |
| `KhoBaiHoc.gs` | Bộ đọc 4 tab nội dung, chuẩn hóa schema, kiểm tra câu hỏi, cache 5 phút; dùng lại cho bài tiếp theo |
| `DuLieuToanSheet.gs` | Adapter rất mỏng `layBaiToan20()` gọi `khoLayBaiHoc_('toan_b20')` |
| `DocDuLieuSheet.gs` | Đồng bộ hàm lấy workbook từ cùng cấu hình |
| `ThanhTichMayChu.gs` | Lõi sổ sao + nộp/chấm bài |
| `ThanhTichBaoCao.gs` | Báo cáo thành tích, huy hiệu, kỹ năng, tổng quan |
| `ThanhTichQuanTri.gs` | Điều chỉnh sao thủ công cho quản trị; giữ API/logic cũ |
| `TienDoHocTap.gs` | API tiến độ chỉ đọc từ `90_Lan_lam_bai` và `91_So_sao` |
| `38_KhoiTaoDuAn.html` | Reset localStorage/sessionStorage cũ **một lần cho mỗi trình duyệt** |
| `39_DongBoTienDo.html` | Ghi trạng thái lộ trình, dấu tích, câu đã đúng từ dữ liệu máy chủ |
| `40_DemTuongTacHocTap.html` | Bộ đếm thời gian tương tác khi tab có focus; dừng khi ẩn |
| `41_HienThiCauHoiToan.html` | Renderer riêng cho đặt tính, nhẩm, lời văn, tìm chữ số |
| `19_KhongGianHocToan.html` | Điều phối bài Toán, sidebar, nhập liệu, nộp, gọi chấm, không gắn chặt HTML từng dạng |
| `16_LichHocChuyenCan.html` | Chuyên cần theo summary từ máy chủ, không dựa localStorage |

**Tiêu chuẩn thiết kế:** Không tạo thêm một file .gs/.html cho mỗi bài, không sao chép mã Google Sheet vào nhiều module. Khi thêm câu hỏi mới, dữ liệu nằm ở Sheet; khi có *dạng câu hỏi mới*, chỉ cần bổ sung renderer + bộ chấm tương ứng.

## 4. Đã gỡ nội dung và lịch demo

- Xóa lộ trình và câu quiz mẫu của Tiếng Việt/Anh; thẻ môn vẫn hiện “Chưa mở”.
- Trang chủ không còn các đề nhiệm vụ và ngày 09–15/11/2026 gán cứng; ngày học và chuỗi chuyên cần giả đã bỏ.
- Toán Bài 20 có mức tiến độ `new,new,new` khi chưa có sự kiện cấp sao thật; không đánh dấu chỉ vì từng mở bài.
- Bộ reset xóa khóa localStorage/sessionStorage cũ có tiền tố `lop2_`, `math_`, `toan_b20_` một lần trên từng thiết bị; **không xóa PIN hoặc dữ liệu Google Sheet**.
- Đổi phiên bản cache phía trình duyệt sang `g6_v1_b20_20261111`, tránh đọc nháp từ deploy trước. Bản nháp trong lần mở hiện tại chỉ sống trong RAM.
- Thông tin sau nộp được máy chủ trả về và tải lại thành tích/tiến độ, không cho tự đánh dấu LV dựa trên phía client.

## 5. Thời gian tương tác và chuyên cần

- `DEM_TUONG_TAC` cộng khoảng thời gian giữa các thao tác của bé (bấm bàn phím, nhập số) khi cửa sổ có focus; không tính khoảng trống hơn 30 giây và tạm dừng nếu tab bị ẩn. Có giới hạn 30 phút/lượt.
- Đây là **ước lượng từ tương tác thực**, không phải đo thời gian tập trung bằng camera; máy chủ vẫn coi trường `active_seconds` là thống kê, không dùng để tự cấp điểm.
- Chuyên cần được xác nhận sau khi nộp bài có câu đúng, dựa trên thời gian máy chủ và tổng quan thành tích.

## 6. Tối ưu hình ảnh

- 3 bìa môn chuyển PNG ~2–2,2 MB sang WebP 800×450 (~52–66 KB mỗi ảnh).
- 6 hình vật thể Toán chuyển từ PNG master 2134×2134 (hàng trăm KB) sang WebP 160×160 (khoảng 4–6 KB).
- Giữ nguyên tất cả PNG master trong GitHub/Drive, chỉ module URL chuyển sang `hinh-anh/webp-g5/` phiên bản commit bất biến.
- Hình avatar Robot 96×96 cũ được giữ nguyên để tránh ảnh bị cắt.

## 7. Múi giờ

- `CauHinh.gs` sử dụng **`Asia/Ho_Chi_Minh`** cho logic.
- Google Sheet thực tế khi đọc là **`Asia/Saigon`** (tên tương đương UTC+7, không đổi lệch thời gian). Đã gửi cập nhật `Asia/Ho_Chi_Minh` qua Google Sheets API; API trả lại tên được chuẩn hóa `Asia/Saigon`. Vì vậy không ép người dùng thay cấu hình bằng thao tác thủ công; cần tiếp tục dùng `Utilities.formatDate(...,'Asia/Ho_Chi_Minh',...)` cho thống kê học.

## 8. QA đã xác minh

- Cú pháp của tất cả JS/GS đã kiểm bằng parser JS (kiểm tra tĩnh); 24/24 thẻ script cân bằng, không thiếu partial.
- `KhoBaiHoc.gs` thử với dữ liệu Sheet thực (mock workbook/CacheService): **51 câu, 51 hợp lệ**, 8 nhóm, ba cấp độ, cache hoạt động.
- Kiểm tra lịch sử hiện tại: chưa có kết quả thật hoặc giao dịch sao để reset.
- Ảnh WebP xác nhận tồn tại đúng commit trên GitHub.
- Hệ thống còn cần kiểm thử hậu triển khai: điều hướng Toán, sidebar/dấu tích sau nộp, lịch chuyên cần giữa Chrome/Android, cùng Web App mới.

## 9. Triển khai

```bash
git switch main
git pull origin main
```

Đồng bộ **chỉ file .gs/.html** sang Apps Script, không đưa file ảnh nhị phân lên trình chỉnh sửa. Triển khai phiên bản Web App mới. Khi lần đầu tải ở mỗi trình duyệt, trình dọn cache cũ chạy đúng một lần. Không thực hiện reset thủ công trong Script Properties.

Có thể chạy thủ công `kiemTraHeThongLop2_()` trong Apps Script Editor để **đọc** cấu trúc bảng dữ liệu, mã Bài 20, sao và tiến độ mà không thay số liệu. Kết quả trả về phải có `ok:true`.

## 10. Những việc chưa mở rộng

- PIN phụ huynh/đa hồ sơ giữ nguyên theo quyết định của chủ dự án.
- Tiếng Việt và Tiếng Anh đang để trống đến khi nhập nguồn SGK/SBT đã duyệt.
- Không biến App thành hệ thống nhiều người dùng; không giới thiệu tính năng giọng đọc.
- Không tự xóa hoặc reset 288 hình trong kho hình.

**Trạng thái:** G5+G6 mã nguồn đã triển khai và kiểm tra tĩnh; nghiệm thu Web App thật sau khi bạn pull vẫn cần diễn ra để chính thức chốt phiên bản.
