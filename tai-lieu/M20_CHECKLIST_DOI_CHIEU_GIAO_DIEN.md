# M2.0 – CHUẨN SO SÁNH GIAO DIỆN (BASELINE)

**Ngày:** 2026-11-12. **Commit chuẩn:** `main@1d9bb77420e367d1739d2077f9e8c928a0417185`. **Nhánh làm việc:** `test-theo-main`.

## Bằng chứng kỹ thuật đã có
- Danh mục CSS, SHA từng file, số khối :root, truy vấn @media và font: `M20_CHUAN_CSS.json`.
- Các file HTML/GS đang hoạt động chưa bị chỉnh sửa bởi M2.0.
- Không có ảnh chụp Web App hoặc phép đo computed style từ browser trong phiên này; không nhận PASS trực quan trước khi có bằng chứng thực.

## Bộ màn phải chụp, cùng kích thước/zoom = 100%
| Màn chuẩn | Desktop 1536×864 | Desktop 1280×800 | Tablet 820×1180 | Mobile 390×844 |
|---|---|---|---|---|
| Trang chủ: header/sidebar/3 môn và avatar | Chờ | Chờ | Chờ | Chờ |
| Lộ trình Toán: danh sách chủ đề, trạng thái | Chờ | Chờ | Chờ | Chờ |
| Bài 20 LV1: đặt tính, tính nhẩm | Chờ | Chờ | Chờ | Chờ |
| Bài 20 LV2: bài toán lời văn | Chờ | Chờ | Chờ | Chờ |
| Bài 20 LV3: tìm chữ số ẩn | Chờ | Chờ | Chờ | Chờ |
| Bàn phím số + bảng kết quả | Chờ | Chờ | Chờ | Chờ |
| Thành tích và cửa phụ huynh | Chờ | Chờ | Chờ | Chờ |

## Những thuộc tính phải giữ
1. Font họ, cỡ, trọng lượng, chiều cao dòng; không thay chữ và nội dung.
2. Chiều rộng sidebar, header, khu vực học, bảng kết quả, khoảng cách cột và thanh cuộn.
3. Các màu chủ đạo, trạng thái đúng/sai, nút, icon, gradient, đường viền, bóng.
4. Bố cục theo breakpoint; bàn phím không che nút hoặc ô nhập.
5. Nhân vật, slot hình, kích thước WebP và vị trí minh họa.
6. Tương tác: mở/đóng, chuyển LV, nhập từng ô, kiểm tra, nộp, ghi thưởng máy chủ; **không dùng tài khoản/dữ liệu thật để test ghi điểm**.

## Phân loại kết quả QA
- **STATIC_PASS**: cú pháp, dependency, selector/token và tương đương thứ tự khai báo đã được kiểm tra bằng mã.
- **VISUAL_PENDING**: chưa có screenshot/computed style từ Web App.
- **VISUAL_PASS**: chỉ sau khi so sánh trên cùng viewport, zoom, dữ liệu và font tải hoàn tất.
- **BLOCK**: khác giao diện hoặc thay đổi chức năng; không merge.

## Nhật ký kiểm soát
- M2.0: chỉ thêm tài liệu baseline và danh sách cần chụp, không sửa mã ứng dụng.
- M2.1: commit riêng sau M2.0; gom token không thay đổi giá trị cuối cùng. Nếu không kiểm định được thứ tự cascade, giữ token tại file gốc và ghi backlog.
- M3+: không triển khai trước khi đạt các cổng liên quan của M2.
