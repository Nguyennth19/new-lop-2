# G7.2-A — Asset Registry V5 WORKING (288 images)
**Mốc:** 2026-11-12 · **Branch:** `g7-1-content-audit-20261112` · **Trạng thái:** WORKING / RELEASE BLOCKED

## Nguyên tắc bất biến
- Không sửa, tái xuất, đổi tên hoặc ghi đè 288 PNG và 288 WebP nguồn.
- `asset_id`, `png_sha256`, `webp_sha256`, nhãn catalog gốc và provenance lấy nguyên từ G7 QA.
- Nhãn thực tế: với 100 nhãn lệch dùng **đề xuất sửa nhãn theo 4 contact sheet G7.1**; 188 mục còn lại dùng nhãn quan sát có trạng thái kiểm định trước đó; **chưa có owner signoff cho bất kỳ snapshot phát hành V5**.
- 24 nhóm phân loại theo **12 SHARED + 12 MATH**, mã nhóm là chuẩn làm việc. Riêng tên M07, M09, M10, M11, M12 xác nhận từ thư mục Drive gốc (`TIME_CALENDAR`, `MONEY_SHOPPING`, `DATA_PROBABILITY`, `COMPARISON_PATTERNS`, `ADVANCED_PROBLEMS`).
- Mỗi hình có thể giữ nhiều quan hệ biến thể; sáu cặp G7.1-B đều **giữ hai file độc lập**, không alias cứng, random sau khi lọc ngữ nghĩa.
- Cột `visible_object_count` không đoán dựa trên tên: đã mở PNG master của **11 asset** và ghi nhận 9 icon đơn lẻ cùng 2 đôi giày (2 chiếc, 1 đôi). **277 để trống**, cần nguồn visual QA trước khi dùng làm dữ kiện.
- `repeatable` và `composable` được ghi là **candidate** hoặc **verified only for the 11 inspected cases**, không phải quyền chạy tự động ngay.
- Sách giáo khoa/VBT là tài liệu kiểm tra nội dung và mục tiêu bài; renderer biến thể có thể dựng từ hình cơ sở nếu không làm sai dữ kiện.

## Các file
1. `Asset_Registry_V5_WORKING_288.csv`: 288 mã, nhãn thực tế & catalog nguyên thủy, checksum, nguồn, QA, nhóm, thuộc tính/giá trị chưa biết, luật dựng ảnh, nhóm variant.
2. `Asset_Registry_V5_WORKING_288.json`: snapshot JSON theo từng ID cho tích hợp thử nghiệm sau này; **không triển khai production khi nội dung chưa phê duyệt**.
3. `Asset_Variants_V5_6_GROUPS.csv`: quan hệ 6 cặp, không dùng ID thay thế cố định.
4. `G7_2_A_QA_AND_RECOVERY_20261112.md`: nhật ký checkpoint và hướng phục hồi.

Google Sheets quản lý được lưu tại:
https://docs.google.com/spreadsheets/d/11-CWHCV-skwvhW3XG8dCfAKAtmrQVySTqqjGxPx1RA4/edit

Sheet gồm `V5_REGISTRY_288`, `V5_VARIANT_GROUPS`, `V5_QA_SUMMARY`, `V5_CHANGE_HISTORY`, `V5_DATA_DICTIONARY`. Nơi lưu trên Drive: folder `99_MANIFEST_QA` (ID `1uYFzG6snotp2uIebcIJFjGf9spHeWvC7`).

## Hiệu đính trọng yếu
Trong kiểm tra lại PNG, `KL_SH12_006` là **một hộp quà**, không phải chồng hộp quà như một bản báo cáo G7.1 trước đó. `KL_M03_012` mới thể hiện **chồng hộp quà**. Đã sửa cặp VAR_03, bảng G7.1-B, JSON lựa chọn ngẫu nhiên và bộ test 15 tình huống. **Không được tiếp tục sử dụng nhận định cũ "SH12_006 = stack"**. Nguồn kiểm: PNG master đã mở trực tiếp trên Drive, khác biệt số lượng rõ bằng mắt.

## Điểm chốt G7.2-A
**Đạt kiểm định tĩnh Registry** (số hàng, ID, hash theo manifest, liên kết nhóm, provenance, trạng thái release); **chưa nghiệm thu nội dung toàn bộ**.
- Không sửa CSS/HTML/GS.
- Không sửa nhánh `test-theo-main` hay `main`.
- Không phát hành bộ WebP hoặc thay ảnh ứng dụng.

## Công việc tiếp
1. Rà nhãn cuối cùng cùng chủ dự án để chuyển trạng thái `OWNER_SIGNOFF_PENDING`.
2. QA thuộc tính định lượng/nhận diện 277 tài sản còn lại theo ưu tiên ảnh được dùng thật ở SGK/VBT, không bắt buộc xử lý toàn bộ trước một pilot nhỏ nếu không dùng cho phép tính.
3. G7.2-B: đặc tả và kiểm thử bộ dựng ảnh từ asset có thật, gắn các ràng buộc số lượng/đơn vị; kiểm tra 15 fixture bằng renderer thực.
4. G7.2-C: đối chiếu Google Sheets V5 ↔ snapshot CSV/JSON, visual QA và checksum gói nguồn trước khi phát hành.
