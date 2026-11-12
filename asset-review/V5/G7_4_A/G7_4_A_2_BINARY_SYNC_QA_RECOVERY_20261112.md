# G7.4-A.2 — Đồng bộ 288 WebP lên GitHub, xác minh hash và cấu hình TEST

**Ngày kiểm định:** 2026-11-12 (Asia/Ho_Chi_Minh)
**Trạng thái:** `BINARY_SYNC_288_PASS` · `RAW_URL_SAMPLE_PASS` · `TEST_LOADER_SOURCE_QA_PASS` · `APPS_SCRIPT_BROWSER_QA_PENDING`
**Production `main`: KHÔNG THAY ĐỔI.**
**Nhánh dữ liệu/ảnh:** `g7-1-content-audit-20261112`
**Nhánh ứng dụng kiểm thử:** `test-theo-main` (chỉ thêm module và include).

## 1. Commit nhị phân bất biến – MỐC KHÔNG ĐƯỢC SỬA
- **Binary commit:** `653bfbc73002a188dcea0b714247b84cc28a4fed`
- **Git tree SHA:** `f3337dc2dfe733d8d0c39627deaf3eb671a62050`
- **Đường dẫn:** `hinh-anh/webp-g7/v1/WEBP/{SHxx|Mxx}/KL-{...}.webp`
- **Số tệp:** 288 file WebP, 24 nhóm x 12, gồm 144 SHARED + 144 MATH.
- 24 commit theo các đợt 12 ảnh; sau mỗi đợt dùng `create_blob`, `create_tree`, `create_commit`, `update_ref` để giữ checkpoint.
- Ảnh giải nén từ hai ZIP Drive release-candidate, **không chỉnh sửa/re-encode**. Mỗi file so SHA-256 với manifest G7.3 trước khi push.
- Kiểm lại toàn bộ Git tree: đủ 288 file, đúng tên, size, đúng nhóm, không thiếu. **Tính lại Git blob SHA-1 trên bytes source** và so với SHA Git tree: 288/288 KHỚP. Do đó byte đã xuất bản trùng với byte source (đã qua SHA-256 288/288).
- Đối chiếu repo API: `Nguyennth19/new-lop-2` ở trạng thái `public`.

## 2. URL ảnh thật
**Mẫu địa chỉ bất biến:**

`https://raw.githubusercontent.com/Nguyennth19/new-lop-2/653bfbc73002a188dcea0b714247b84cc28a4fed/hinh-anh/webp-g7/v1/WEBP/SH05/KL-SH05-04.webp`

Kiểm tra với GitHub connector:
- `KL-SH05-04.webp` và `KL-M03-12.webp`: trả về tài nguyên **binary**; connector từ chối giải mã UTF-8 (đúng cho WebP).
- `KL-SH01-01.webp`, `KL-M12-12.webp`: trả về binary.
- Đường dẫn cố tình sai: **404**.
- Manifest JSON được tải qua GitHub Raw tại commit `a3965bb99c8de43c44cccae1921dd8fd98fab365`, đọc đủ 288 entries.
- **Giới hạn chứng cứ:** công cụ connector không cung cấp trực tiếp header `Content-Type`/CORS hay Chromium Android bên ngoài; việc khẳng định 200 + MIME image/webp + CORS từ web app cần **browser QA**. Web crawler công khai báo cache miss đối với URL mới; KHÔNG coi đó là lỗi từ GitHub.
- File danh mục 288 URL và Git blob SHA: `asset-review/V5/G7_4_A/G7_4_A_2_VERIFIED_288_GITHUB_URLS.json` (commit `e25c0af0cdee33fa05f0a0703bf400a8566748fc`).

## 3. Cấu hình Loader
- `42_TaiAnhTheoAssetID.html` `assetBaseUrl` đã gắn binary commit bất biến `653bfbc...fed`; không dùng link Google Drive làm `img.src`.
- `manifestUrl` dùng commit metadata `a3965bb...365`; riêng manifest vẫn có trạng thái `CANDIDATE_NOT_APP_DEPLOYED`, do đó `allowCandidate:true` chỉ dùng cho TEST.
- Loader ở trạng thái **IDLE** khi trang khởi tạo; `KL_ASSET_V5.init()` và `mount()` chỉ chạy khi người kiểm thử/bộ dựng bài gọi. Không tự thay 34_HinhAnhDungChung (ảnh G5).
- File module cập nhật trên nhánh G7: commit `76025322350768b879eb710969c65e807d810e7e`.
- `ASSET_HOST_POLICY.json` cập nhật commit `d66b36af3e1f30f92c3add584872fddd91e2ddd2`.

## 4. Ứng dụng TEST – chỉ hai thay đổi
Branch: `test-theo-main`.
1. Thêm `42_TaiAnhTheoAssetID.html`: commit `9606e9ff2891c099b695998bc0d28628141046bb`.
2. Thêm đúng **1 include** trong `GiaoDien.html` sau module 34: commit `f51a12cc07b44f0f893c2e0de40e387cc17b5c3b`.

So sánh với baseline `e217a4555ed5ac3627638f0a0254b81ed57337d0`: chỉ hai file trên thay đổi. Không sửa `main`, phần giao diện/CSS, câu hỏi hay cơ chế G5.

## 5. QA có bằng chứng
| Cổng | Kết quả |
|---|---|
| Source SHA-256 đối chiếu G7.3 | PASS 288/288 |
| Git Blob SHA-1 tính từ source = Git Tree sha | PASS 288/288 |
| Tệp/đường dẫn/byte size trên GitHub | PASS 288/288 |
| Repo public + thử URL raw binary, negative 404 | PASS giới hạn 4 mẫu |
| Manifest JSON ở URL commit bất biến | PASS 288/288 |
| Loader unit tests | PASS 30/30 bằng V8 assertion harness |
| TEST integration smoke (source + mocked fallback) | PASS 10/10 |
| Live Apps Script deployment / Chrome Android/desktop HTTP MIME/CORS | **PENDING** – cần pull/deploy TEST và kiểm tra |
| G7.4-B bộ dựng biến thể | NOT STARTED |
| Production | BLOCKED |

**Không tuyên bố đã QA trực tiếp Web App TEST trong môi trường triển khai**: nội dung được cập nhật trên nhánh TEST nhưng vẫn cần người quản lý `clasp pull/push` hoặc deploy bản test, sau đó quan sát Chrome thực tế.

## 6. Khôi phục khi cuộc trò chuyện bị treo
1. **Giữ mốc binary** `653bfbc...fed`; các commit về sau không thay đổi URL nếu Loader được pin vào commit này.
2. Mở `asset-review/V5/G7_4_A/G7_4_A_2_VERIFIED_288_GITHUB_URLS.json` để đọc 288 URL và hash.
3. Kiểm tra trạng thái nhánh TEST: `42_TaiAnhTheoAssetID.html` và `GiaoDien.html`, rồi so với baseline `e217a455...`.
4. Nếu module TEST gặp lỗi: revert hai commit `f51a12c` và `9606e9f` trên TEST; G5 vẫn hoạt động.
5. Không ghi đè 288 PNG/WebP trên Drive, không merge `main`. Mọi thay đổi tiếp theo phải có commit SHA, phạm vi và cổng QA rõ.
6. Hoàn tất smoke test browser, MIME/CORS và fallback thật trước khi G7.4-B.

## Tham chiếu
- [GitHub binary commit](https://github.com/Nguyennth19/new-lop-2/tree/653bfbc73002a188dcea0b714247b84cc28a4fed/hinh-anh/webp-g7/v1/WEBP)
- [Drive release QA source](https://drive.google.com/drive/folders/1wLT1TcvAsLZTzk4Z8-Am2AD5gSwTaykR)
- [Google Sheets V5](https://docs.google.com/spreadsheets/d/11-CWHCV-skwvhW3XG8dCfAKAtmrQVySTqqjGxPx1RA4/edit)
