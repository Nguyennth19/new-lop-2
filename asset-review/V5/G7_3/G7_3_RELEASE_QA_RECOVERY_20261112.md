# G7.3 – Release Candidate WebP 288 / Checkpoint QA & Recovery

**Ngày:** 2026-11-12 · **Nhánh:** `g7-1-content-audit-20261112` · **Cổng:** `G7_3_TECH_QA_PASS`, `APP_RELEASE_BLOCKED`.

## Phạm vi & bằng chứng trực tiếp
- Nguồn G7: 2 ZIP trên Google Drive staging, mỗi tệp 144 WebP; đã mở ZIP, CRC kiểm toàn bộ tệp, kiểm SHA-256 từng ảnh theo báo cáo gốc G7 288.
- Kiểm **288/288 WebP**: 144 SHARED, 144 MATH, 24 sheet x 12; đúng tên `WEBP/{sheet}/{webp_filename}`, không thiếu, trùng hay thừa file; 288/288 SHA-256 byte-match với manifest, đúng 512×512 WEBP, decode bằng Pillow.
- 254 ảnh QUALITY_90, 34 LOSSLESS_FALLBACK. Tổng bytes ảnh không tính metadata **12.350.644**.
- G7.2-C đã được người dùng nghiệm thu trực quan. Đây là xác nhận sandbox; không nâng 277 thuộc tính chưa QA thành PASS.
- Nhãn Registry V5 A1: 100 `LABEL_APPROVED`, 188 `OWNER_SIGNOFF_PENDING`. Không ký hộ cho 188 mục còn lại.
- Nội dung học liệu: tôn trọng biến thể (một ảnh đơn có thể lặp thành nhóm), nhưng không đổi số lượng/đơn vị/màu khi đó là dữ kiện trả lời.

## Snapshot nguồn staging (SHA-256 ZIP)
| Scope | ZIP name | SHA-256 |
|---|---|---|
| SHARED | G7_SHARED_144_WEBP_STAGING_20261112.zip | `65219bd7a2a5707f31febf18b28593d1a82c15241927b00420824e9532b49dfc` |
| MATH | G7_MATH_144_WEBP_STAGING_20261112.zip | `b7d74696b6e0df6fa9a6da2f334533e0b5a8dee6ac24890043946290c232f3ea` |

## Bản sao độc lập trên Drive
Thư mục: https://drive.google.com/drive/folders/1wLT1TcvAsLZTzk4Z8-Am2AD5gSwTaykR
- Shared: https://drive.google.com/file/d/1HFF4d7WeDKbTaHNmXVVhyVsxtPyiHO0-/view
- Math: https://drive.google.com/file/d/1SYt7imPZSVZ4HKgoC-SU7Xhvp6EdviaE/view

**Đã tải lại** cả hai bản copy, kiểm SHA file ZIP bản copy khớp SHA ZIP staging tương ứng. Do đó **288 bytecode WebP trên Drive được giữ nguyên**. Không sửa/di chuyển bản nguồn staging.

## Gói tổng hợp kiểm tra độc lập
- Tên: `G7_3_288_WEBP_RELEASE_CANDIDATE_20261112.zip`
- 288 WebP + `MANIFEST.csv` + `RELEASE_METADATA.json` + `README.md`.
- SHA-256 ZIP: `03eaa4017719cc739964b7990f3934e9f4da0c794f7383fc3b766a91ce856bc9`
- Bytes: `12.403.667`.
- Manifest CSV SHA-256: `cf5277e3a50c62c8d96e7f82af116bc0476787a68cff84d79479cdb22851aba6`.
- Đã kiểm lại mọi tệp trích từ gói tổng hợp có SHA khớp G7 manifest.
- **Trạng thái lưu trữ:** Gói tổng hợp hiện là attachment sandbox của cuộc trò chuyện; **chưa upload lên Drive và chưa push các tệp ảnh nhị phân lên GitHub**. Hai ZIP scope lưu trên Drive chứa toàn bộ 288 WebP và đã xác minh tương đương; GitHub có manifest 288 ID/path/SHA/label gate.

## GitHub (chỉ metadata QA, không gắn URL ảo cho file)
- `asset-review/V5/G7_3/ASSET_288_RELEASE_CANDIDATE_MANIFEST.json`: 288 ID ↔ đường dẫn tương đối `WEBP/SHxx/` hoặc `WEBP/Mxx/`, SHA, tên hiện tại, approval, thuộc tính source.
- `asset-review/V5/G7_3/G7_3_RELEASE_QA_RECOVERY_20261112.md`: file này.
- Không lưu 288 WebP qua GitHub binary (không có upload binary được xác minh trong phiên). Vì vậy **không tuyên bố GitHub đã host hình**.

## QA gates / rào cản phát hành
| Gate | Status |
|---|---|
| WebP binary 288/288 hash, naming, dimensions | PASS |
| Google Drive release-candidate ZIP copies & hash | PASS |
| WebP packaged ZIP local & hash | PASS |
| V5 Asset ID paths and 100 approved label snapshot | PASS_METADATA |
| Visual sandbox user approval | APPROVED |
| Thuộc tính định lượng và đồ vật theo từng bài | PARTIAL_OPEN |
| Phát hành URL ảnh/public access/CDN | NOT_CONFIGURED |
| GitHub lưu 288 binary ảnh | NOT_SYNCED |
| G7.4 ứng dụng test renderer/asset loader | NOT_STARTED |
| Merge production main | BLOCKED |

## Khôi phục khi chat treo
1. Mở manifest JSON ở GitHub trong nhánh G7, đối chiếu 288 Asset ID.
2. Mở thư mục Drive candidate, tải hai ZIP, xác minh SHA-256 nêu trên.
3. Mở report file này và tab `V5_CHANGE_HISTORY`; kiểm 100 nhãn approved và 188 giữ trạng thái.
4. Khi cần đầy đủ bộ tổng hợp, có thể dựng lại từ hai ZIP scope mà không phải sửa binary: giải nén đúng đường dẫn `WEBP/{sheet}/{filename}`; checksum từng file đã có.
5. Bước tiếp theo là thiết lập đường dẫn ảnh thực, sandbox/app TEST reader, xác nhận phạm vi thuộc tính/ảnh và CDN; **chỉ sau đó mới quyết định release production**.
6. Mọi sửa đổi cần commit/nhật ký riêng; không ghi đè PNG/WebP gốc, không merge `main` trong G7.3.

## Mốc thời gian có thể audit
- G7.2-C manifest/visual QA: `183867a93ecdcd880a76d6e20ea03dfd97baab76`
- G7.2-A.1 duyệt nhãn 100: `3e015d6c81eb7fcc16ffd4e21d7c5a3cab18af36`
- G7.3 manifest JSON: `a3965bb99c8de43c44cccae1921dd8fd98fab365`
