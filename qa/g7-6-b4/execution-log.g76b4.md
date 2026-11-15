# G7.6-B.4 – REAL-TIME QA EXECUTION / RECOVERY JOURNAL

**Ngày:** 2026-11-15. **Nhánh TEST:** `test/g7-6-b4-owner-visual-policy-20261115`. **Tình trạng:** PASS kỹ thuật; owner, thiết bị vật lý, chính sách E04 còn chặn.

| # | Commit / evidence | Đã thực hiện và kết quả |
|---|---|---|
| 00 | Baseline `c3757227856f50e0e122407e0121c3e40e024728` | Tạo B.4 độc lập từ B.3 đã PASS; pin P0.6 E02/E03 `c0c5620f...`. |
| 01 | `1d16574193119902e02f75a67199540d595626ba` | Tangram target label wrapper TEST, tên Khung số 1/2/3; preserve native IDs and handlers. |
| 02 | `23ef1ca9b55b0e5fc5978acb14479ee10d04bc74` | Decision pack chỉ là kiến nghị: auxiliary mental renderer, E04 tách nhóm, nguồn SGK pending. |
| 03 | `ab9bc07c0db33f376819cd1761003feb2712c4ea` | Manual QA JS: 13 mục; export JSON offline; reviewerSignature:null, không ghi mạng. |
| 04 | `4f22d5a7bb36548d9043c2aa5f2a707f55f6dafa` | Form HTML phone review, checkbox chưa chọn, ghi chú và xuất JSON. |
| 05 | `eb9768918aa2c0589979a3b8bcd655228d0847d8` | Build standalone HTML 1 file từ B3 public producer samples + renderer pin, không cần GAS. |
| 06 | `a2c6cef3a0d50b30303b0885e31cbf84cdc9c448` | 106 assertions policy guard và source/label projection, owner approval luôn PENDING. |
| 07 | `2fb47a09e29aa973f7dc01174e98911906d3d006` | Chrome CDP file:// 360/390/1440, check target labels và simulated touch; physical=false. |
| 08 | `f69ff2dac2c0fe1949a9b90c1125de7e9ba58dbe` | GitHub workflow: protected diff, pinned P0.6, inherited 899, build, Chrome, evidence. |
| 09 | CI `43713470245` FAIL | Bộ kiểm thử tĩnh sai tên field `ownerSignature`; sản phẩm ghi đúng `reviewerSignature`. Không nới lỏng guard. |
| 10 | `13c5dde621188c09a3c9edf6994ffc9f20ab23c4` | Sửa bộ kiểm thử tĩnh đúng tên receipt; giữ code và policy nguyên. |
| 11 | CI `43713554156` PASS | 296 A + 221 B + 123 B.2 + 259 B.3 + 106 B.4 = 1005 assertions PASS. |
| 12 | Artifact `14161177629` | Offline HTML ~94,289 byte, ảnh Chrome 360/390/1440 và JSON receipts. |
| 13 | Drive ZIP `1s0CO7yvzXaSi5x05eSEG3cdTfIpIAP2b` | Đã tải artifact và lưu vào đúng thư mục dự án; metadata xác nhận ZIP 1,580,077 byte. |
| 14 | Container review | Mở hình 390px Tangram: nút Khung số 1/2/3, mảnh tách biệt; form 13 mục có nút xuất và không mục nào được đánh dấu. |
| 15 | Drive Doc `15zrg5VF1SRgznf144sTpAcMReYXBby9M4k-wqNFUwPI` | Lưu biên bản B.4; chuyển vào folder dự án, đọc kiểm tra 57 đoạn. |
| 16 | `b4c79770ab221c36607c153dc9dbbdd79ff6b6a4` | Báo cáo chi tiết B4, phân tách PASS kỹ thuật và các cổng chờ ký. |
| 17 | `2af58bb2882ae6cdc6a2061893590bdab8dd2f7b` | Owner signoff form chờ; hướng dẫn nộp JSON phone/test ảnh thật. |
| 18 | `5b94f7f21bbacb5569056ac8fe56fb0b1279bb2b` | Checkpoint B4 JSON lưu nguồn/QA/Drive/gates/rollback. |
| 19 | CURRENT | Journal này, sẽ xác minh CI HEAD cuối sau khi thêm file; không đụng protected files. |

## Bằng chứng CI và điều kiện chặn
- Baseline B.3 `c3757227856f50e0e122407e0121c3e40e024728` – cả A/B/B2/B3 đã PASS trước bước này; B4 không chép sửa nguồn renderer.
- CI success: https://github.com/Nguyennth19/new-lop-2/actions/runs/43713554156
- Artifact: https://github.com/Nguyennth19/new-lop-2/actions/runs/43713554156/artifacts/14161177629
- Chrome offline: viewport CSS 390 Tangram (54 checks + chạm giả lập đặt mảnh), 390 Mental (54), 360 all (59), 1440 all (59). Giao diện Tangram cho 2 đề có 6 nút tiếng Việt, vẫn giữ target IDs nội bộ; không grading.
- Local single HTML: `G76B4_Standalone_RealDevice_Review_TEST.html`, SHA256 `27b72ecb4db8c98c9e0d568d443f639a65eff7be1f862ba3455aaf7856971502`.
- Chủ dự án **CHƯA** cung cấp phiếu thử điện thoại thật hoặc ký phê duyệt. B4 chỉ là toolkit + đề xuất policy; E04 curriculum chưa xác định SGK bài/trang.

## Phục hồi
1. Đọc `qa/g7-6-b4/checkpoint.g76b4.v1.json`, `owner-decisions.candidate.json`, và biên bản Drive.
2. Dùng CI run 43713554156 + ZIP Drive để đối chiếu tất cả bằng chứng thực có, không tuyên bố physical PASS từ Chrome.
3. Nếu xảy ra lỗi TEST: dừng sử dụng B4, quay về B3 `c3757227...`. Không có app/GAS nào cần rollback vì không triển khai.
4. Tiếp nhận phiếu người thật và SGK sau mới tạo **B4.1 – OWNER EVIDENCE SIGNOFF**. Không nâng chính sách bằng cách sửa trường JSON `PENDING` thành `APPROVED` mà thiếu bằng chứng.

**Guard tuyệt đối:** không merge main/test-theo-main; không deploy GAS; không mở trusted grading D10; không ghi student scores, stars, attendance; không sửa G6/G7.4/P0.6 E02/E03.
