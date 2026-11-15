# G7.6-B.3 – EXECUTION / RECOVERY JOURNAL (append-only)

**Ngày:** 2026-11-15. **Phạm vi:** TEST only; không thay P0.6 E02/E03, G7.4 renderer, G6, main, test-theo-main, GAS hay dữ liệu học sinh.
**Mốc B.2:** `be426e6c10c6ae9636a9a8b28c59b407641222d4`.
**Nguồn P0.6 đúng:** `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2` (checkout độc lập).
**Kết luận code:** 899 assertions (296 A, 221 B, 123 B2, 259 B3) PASS; Chrome CDP 360/390/1440px PASS; owner/device/pedagogy vẫn chờ.

| Trình tự | Commit hoặc workflow | Dấu vết |
|---|---|---|
| 00 | B.2 `be426e6c...` | Tạo nhánh `test/g7-6-b3-producer-coverage-visual-20261115` từ đúng baseline |
| 01 | `91e5018728308f1921ea5c0a66cae1508af28fb9` | `mental-number-input.cjs`: 6 câu thật P0.6, validate policy, public whitelist |
| 02 | `098d6914fedc07b9f4acd46a6107a7493976eb75` | `mental-number-input-view.js`: input chỉ TEST, không grade |
| 03 | `fdbf03253c4444622daf7cdc28c2aa938336c951` | Chính sách E04 riêng kỹ thuật, `toan_b999`, không SGK |
| 04 | `781bdb613ac5acc5bcf2a6e9a156301306be16cf` | Sidecar E04 sinh seed Tangram và pictograph với digest/receipt; không sửa P0.6 E02/E03 |
| 05 | `46e0c3665a113259598444faffcc7ace16dfce6d` | Bộ kiểm thử thực E03+E02+E04, negative security, public browser data |
| 06 | `39e2ee6ca3a37bf6c8a74512a8f1bbb1a84d2a04` | Chrome harness 14 mẫu, 5 panel và kiểm input/select/tap/rotate |
| 07 | `54683f307fd8d6371d14e297b06f890b582b5c16`, `7fa6c15b88501e180bea6c3ffe066e8825ffeecf` | Browser DOM parser và CDP screenshot 360/390/1440 |
| 08 | `b0a3a67303b3eb8d75ade007edf1c4c50fce9ede` | Tạo CI độc lập, protected source check, P0.6 pinned checkout |
| 09 | `2e9b5ea4da2d24fd54774ea999c353695fa074b2` | Sửa harness: phần tử ẩn phải có chiều cao 0, không đòi touch target 44px |
| 10 | `f5a687ab0451614b36dc297afd29b702fce8c6ce`, `cede27f03edc2d7c9c3a0f121b46df334e302042` | Desktop scrollbar 15px không phải lỗi tràn ngang; viewport mobile kiểm chính xác |
| 11 | `3e9feed0228bd7c18a004743abd05d40e6bc4380`, `9eea65800566e08998794a14d7d9d5c16b03d0a0` | Chụp JPEG preview Chrome để kiểm hình thực; thumbnail được xem |
| 12 | `2ddfc0c08968272d4232edc4d327320240338044` | Owner visual checklist PENDING, lưu issue nút Tangram hiện `target_roof` |
| 13 | `557798c9d73bf321d8420b1ce7d9091d3db4cca4` | Thay Chrome `dump-dom` thiếu ổn định bằng CDP ở desktop |
| 14 | `da8d75ef9563868f94920b7b9a5e2c0b1b24d428` | Clear input, choice, Tangram, chart sau QA trước chụp; ẩn receipt ở panel review |
| 15 | `6a4dffc6aa84f0c79db9dcdd141fb462a65e330e` | Đổi vị trí 3 mảnh Tangram, fix chồng mảnh trong ảnh review |
| 16 | `29b6d7fdccf0d0f7a4bda3ec2e59041826908a5c` | Thêm kiểm thử khoảng cách các mảnh (255 -> 259 assertions) |
| 17 | `5a5447f0467f1762a11fd09c8bc602945711b4e0`, `6195936732189037875c99e09d77ee319f1f2dc6` | Browser startup retry, stderr capture & sửa newline DevTools port |
| 18 | `2c104e58126daceeabee35ade3ad076a45945719` | Báo cáo QA: cổng PASS kỹ thuật vs BLOCKED policy/device |
| 19 | `70d431c805a9064ae9e8bc96717852ee25353bfa` | Tăng khoảng cách Tangram tránh chạm viền khi 180/270 độ |
| 20 | `b13be47dcc041ebd50d46d1c08c7dfe72827bcfa` | CI run `43690976255` PASS; 259 B3 + 640 inherited, 8 Chrome PNG |
| 21 | Drive ZIP `1BijI-0NOWulHsvMXutoHq2hZOEkPz850` | Artifact `14151948077` đồng bộ ZIP `1924546` bytes vào đúng folder dự án |
| 22 | Docs `11q_-0X6NcodGr_5KADNnKikQSAMrEeBE6dV2nw2isrY` | Tạo hồ sơ Drive, di chuyển vào thư mục dự án, ghi nội dung/checkpoint, verify 59 đoạn |
| 23 | `87e3d39cbb5cd603fa5332a84576d4ed75319adb` | Checkpoint JSON ghi pins, tests, visual issues, Drive evidence, rollback |
| 24 | **CURRENT** | File journal này, sau commit cần check CI HEAD cuối; tuyệt đối không ghép ứng dụng |

## CI lịch sử – Không đánh tráo bằng chứng
- Có các lượt CI thất bại ban đầu: `43689656359`, `43689730505` (QA hidden touch target / scrollbar); `43690000671` (dump-dom hoàn tất trước DOM ready); `43690456471` (Chrome CDP không kịp mở port); từng nguyên nhân đã được lưu và xử lý, **không gọi những run này PASS**.
- **Đã PASS và được kiểm chứng:** run `43690976255`, SHA `b13be47dcc041ebd50d46d1c08c7dfe72827bcfa`; log `G76B3_PRODUCER_COVERAGE_PASS 259 assertions`, `G76B3_EIGHT_SCREENSHOT_PNG_EVIDENCE_PASS 8`.
- Artifact `14151948077` đã chuyển về Drive ZIP cùng nội dung, không trông đợi Actions retention.
- Visual QA: xem tất cả PNG 390px: đúng kiểu biểu đồ/số lượng, không tràn, không để input thử; nút Tangram còn hiển thị mã kỹ thuật `target_roof` và owner signoff vẫn **PENDING**.

## Bước tiếp và khôi phục
- Mở `qa/g7-6-b3/checkpoint.g76b3.v1.json`, báo cáo B.3 và Google Doc; xem artifact ZIP trên Drive.
- Nếu CI mới fail: xem tên step và stdout/stderr, so sánh với PIN baseline B2; không lặp lại A/B/B2 khi không cần.
- Rollback: ngừng sử dụng TEST B3, quay về `be426e6c10c6ae9636a9a8b28c59b407641222d4`; protected branches/GAS không đổi.
- Bước sau: **B.4 owner visual + policy signoff**. Chỉ sau khi cổng riêng PASS mới được cân nhắc phối hợp `test-theo-main`. D10 trusted grading và GAS tiếp tục khóa.
