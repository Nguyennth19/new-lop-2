# M1 – KIỂM KÊ KIẾN TRÚC LỚP 2
Ngày: 2026-11-12 | Nhánh phân tích: `test-theo-main` | Mốc nguồn: `main@1d9bb77420e367d1739d2077f9e8c928a0417185`

## Mục tiêu và phạm vi
M1 là **kiểm kê và thiết kế ranh giới module**, không thay giao diện, CSS, logic chấm hoặc ledger sao. Số liệu được lấy từ cây Git nguyên trạng, không phải kết quả kiểm thử toàn diện Web App.
- **105 file**; HTML: 37, Apps Script (.gs): 11, ảnh PNG/WebP: 22, tài liệu Markdown: 28, CSV: 4, và tệp cấu hình khác: 3.
- Bảng chi tiết từng file, kích thước, blob SHA: `M1_DANH_MUC_FILE.csv`.
- Bản kiểm kê dữ liệu máy đọc: `M1_MANIFEST_MODULES.json`.

## Kết luận theo thành phần
| Thành phần | Hiện trạng xác nhận | Việc cần chuẩn hóa |
|---|---|---|
| App shell/sidebar chính | HTML sidebar, topbar, mobile-nav nằm trực tiếp trong `GiaoDien.html`; CSS rải tại nền tảng + trang chủ | Khung sidebar chung có slot menu; giữ y hệt UI |
| Header/sidebar học Toán | `19_KhongGianHocToan.html` vừa dựng shell vừa điều hành LV và bài làm | Tách shell + navigation view model; dùng chung lớp kiểu dáng |
| Bàn phím Toán | DOM/phím/sự kiện nằm trong `19_`; CSS nằm `20_`, `22_`, `29_` | 1 module keypad sở hữu DOM/event, cấu hình tập phím |
| Module câu Toán | `41_HienThiCauHoiToan.html` tạo vertical/mental/missing_digit/word_problem | Giữ interface renderer; không duplicate trong bài |
| Chấm câu Toán | `26_ChamCauHoiToan.html` có `danhGiaCauToan` | Giữ hàm chấm độc lập UI và kho thưởng |
| Bảng kết quả | Hàm `renderResults()` nằm `19_`; CSS `22_`, `25_`, `29_` | Tách component hiển thị dựa trên trạng thái, không tự ghi sao |
| Điểm/sao | `33_KetNoiThanhTich.html` gửi đáp án; `ThanhTichMayChu.gs` xác minh và ghi ledger | Bảo toàn quyền chấm server, khóa chống trùng và lịch sử cũ |
| Tiến độ | `39_DongBoTienDo.html` đọc tiến độ server; `27_BoNhoBaiHoc.html` cache nội dung tạm | Cấu trúc state và sự kiện chung, không trộn điểm với cache |
| Icon MUI | `07_BieuTuongMUI.html` cung cấp `muiIcon()`; vẫn có SVG trực tiếp | Chuẩn hóa API icon và vị trí, không đổi icon đã chốt |
| Hình/nhân vật | `34_HinhAnhDungChung.html` có 9 asset được định danh, 8 ánh xạ câu B20, `35_` định dạng slot pilot | Mở rộng asset registry + slot config, không map theo văn bản dài hạn |
| Phụ huynh | `36_CuaVaoPhuHuynh.html` đã có UI riêng; `PhuHuynhMayChu.gs` API/PIN | Giữ boundary bảo mật, dùng chung shell components khi phù hợp |

## Năm điểm có rủi ro bảo trì cao
1. `19_KhongGianHocToan.html`: shell, trình bày, xử lý sự kiện, chấm bài và kết quả cùng file (~17 KB).
2. CSS chồng lớp `20_` → `22_` → `25_` → `29_`: `#mathFullScreen` được sử dụng hàng chục lần ở hai file cuối; thứ tự include trở thành logic ngầm.
3. Biến `:root` lặp lại trong `01_CSS_NenTang`, `02_CSS_TrangChu` và `04_CSS_LoTrinh` – chưa có nguồn token duy nhất.
4. Catalog ảnh gắn với URL commit cố định và mapping Bài 20; fallback theo từ khóa có thể chọn ảnh sai khi số lượng bài tăng.
5. Nghiệp vụ sao phải được kiểm chứng tại server: nếu thay selector lượt học mà không nâng cấp cùng đường xác minh, có thể gây bất nhất tiến độ/thưởng.

## Những gì ĐÃ tách và nên giữ nguyên
- `23_ChonCauHoiToan`, `26_ChamCauHoiToan`, `41_HienThiCauHoiToan`: ba trách nhiệm khác nhau đã có file riêng.
- `33_KetNoiThanhTich` (client) / `ThanhTichMayChu.gs` (server); hệ thống lịch sử và sao được xử lý server-side.
- `34_HinhAnhDungChung`: dịch vụ hình dùng chung thí điểm.
- `39_DongBoTienDo` và `27_BoNhoBaiHoc`: khác biệt giữa dữ liệu điểm thực và cache tạm.

## Phạm vi KHÔNG khẳng định
- Không kết luận đã QA 288 ảnh chỉ từ manifest repository.
- Không khẳng định mọi độ phân giải và tác vụ học sinh đã qua kiểm tra.
- Không thay đổi cấu trúc Google Sheets hoặc Apps Script triển khai.
- Chưa nghiệm thu việc tách file nào; đó là bước M2–M5.
