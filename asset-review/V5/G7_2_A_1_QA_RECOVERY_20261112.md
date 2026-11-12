# G7.2-A.1 — Chốt nhãn 100 tài sản, checkpoint phê duyệt

**Ngày:** 2026-11-12 · **Nhánh:** `g7-1-content-audit-20261112` · **Loại nghiệm thu:** CHỈ NHÃN ẢNH · **Release:** BLOCKED

## Quyết định
Chủ dự án yêu cầu chốt 100 nhãn thực tế dựa trên G7.1 trước G7.2-C. Các nhãn đúng theo nội dung quan sát trong 4 contact sheet G7.1 được chấp thuận để dùng làm metadata V5. Giữ `catalog_label_original_vi` để truy vết; không đổi tên file, Asset ID, PNG/WebP hay hash. Không được hiểu là đã xác thực số lượng, khối lượng, đơn vị, kiểu hình hay khả năng sử dụng mọi ảnh trong đề.

## Kết quả
- 288/288 mã nguồn và 100/100 mã ngoại lệ đã đối chiếu với CSV nguồn G7.1: **0 mâu thuẫn** ở nhãn mới, nhãn cũ, PNG filename, SHA-256 WebP.
- 100 mục chuyển `OWNER_SIGNOFF_PENDING` thành `LABEL_APPROVED`; trường `content_review_status` -> `LABEL_APPROVED_ATTRIBUTE_QA_PENDING`.
- 188 mục trước đây khớp trực quan vẫn giữ nguyên trạng thái; **không tự ký duyệt 188 mục** và không làm ảnh hưởng nội dung của chúng.
- `release_status` vẫn là `BLOCKED_CONTENT_APPROVAL` ở cả 288 mục. Các cổng thuộc tính vật thể (gồm 277 giá trị số lượng chưa xác minh ở V5) vẫn giữ nguyên.
- Các trường số lượng đã xác minh ở 11 ảnh pilot, chính sách 6 nhóm biến thể và mã G7.2-B không thay đổi.

## Snapshot GitHub / rollback
- BEFORE (bản làm việc lịch sử): `asset-review/V5/Asset_Registry_V5_WORKING_288.csv` và `Asset_Registry_V5_WORKING_288.json`. Đây là bản trước G7.2-A.1, được giữ nguyên.
- Bảng duyệt 100: `asset-review/V5/G7_2_A_1_LABEL_APPROVAL_100.csv`. Commit `c9022d561a84724711b94e014b5c3ddb60334e96`.
- AFTER CSV: `asset-review/V5/Asset_Registry_V5_A1_LABELS_APPROVED_288.csv`. Commit `42778357fa0b0445c7fc9088a02a816bfbca4e9c`.
- AFTER JSON: `asset-review/V5/Asset_Registry_V5_A1_LABELS_APPROVED_288.json`. Commit `e1d7fbdadc02380b495d4440f18a04e4bf73f875`.
- Google Sheet: https://docs.google.com/spreadsheets/d/11-CWHCV-skwvhW3XG8dCfAKAtmrQVySTqqjGxPx1RA4/edit ; `V5_REGISTRY_288` chỉ cập nhật cột H/I trên đúng 100 hàng tương ứng Asset ID, không đổi giá trị nhãn, checksum, công thức hay trật tự.

## Kiểm định bắt buộc
- Xác minh 288 hàng, 288 ID độc nhất, đúng 100 mục `LABEL_APPROVED` / 188 mục chưa phê duyệt nhãn cuối.
- So khớp CSV AFTER ↔ JSON AFTER ↔ Google Sheet bằng Asset ID.
- Đối chiếu trường `png_sha256`, `webp_sha256`, `label_vi_current`, `catalog_label_original_vi` giữa BEFORE/AFTER: phải **không thay đổi**.
- Không gọi `RELEASE_PASS` chỉ vì nhãn được duyệt. Nhánh `main`, `test-theo-main` và toàn bộ ứng dụng không đổi.

## Nếu cuộc trò chuyện bị treo
Mở nhánh `g7-1-content-audit-20261112`, đọc file này, `G7_2_A_1_LABEL_APPROVAL_100.csv` và các snapshot AFTER; xác minh SHA commit trong GitHub. Tiếp tục từ G7.2-C **Visual Sandbox** và 85 khoảng trống học liệu theo mức độ sử dụng thật, không mở lại bước sửa nhãn 100 ảnh. Khi cần hoàn tác, dùng snapshot BEFORE để đưa trạng thái H/I trở về trên đúng 100 Asset ID, hoặc revert commit độc lập. Không ghi đè file nguồn.
