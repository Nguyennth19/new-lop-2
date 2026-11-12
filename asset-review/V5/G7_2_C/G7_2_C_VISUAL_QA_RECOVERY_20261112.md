# G7.2-C – Visual Sandbox WebP thật: QA & Recovery

**Ngày:** 2026-11-12 · **Nhánh làm việc:** `g7-1-content-audit-20261112` · **Trạng thái:** `VISUAL_SANDBOX_CREATED / BROWSER_QA_PASS / RELEASE_BLOCKED`

## Checkpoint G7.2-C
1. Đã tải từ Google Drive staging G7 hai file gốc `G7_SHARED_144_WEBP_STAGING_20261112.zip` và `G7_MATH_144_WEBP_STAGING_20261112.zip` (mỗi tệp đúng **144 WebP**).
2. Trích **22 WebP thực**, đúng Asset ID trong profile pilot G7.2-B, giữ nguyên binary. Cả **22/22 SHA-256 WebP** đã đối chiếu trùng `G7_BAO_CAO_QA_CHUYEN_DOI_288.csv`; cả 22 decode được, 512×512 RGBA (WebP có alpha). Tổng dung lượng ảnh thử nghiệm: **849.214 byte**.
3. Dựng Visual Sandbox độc lập `index.html` + `assets/*.webp`, không dùng CDN/Drive runtime, có **19 trường hợp**: 15 fixture ban đầu + túi/mũ/giày xanh + gallery 22 ảnh. Có menu chọn tình huống, đổi lượt seed, giả lập khung desktop/tablet/mobile. Ảnh khớp bản WebP G7 staging, không phải emoji/ảnh stock.
4. Test Chromium headless trên **3 viewport (1440×900, 768×1024, 390×844)** × **19 tình huống** = **57 trường hợp**. **57/57 PASS**, 0 JavaScript runtime exception, 0 trang tràn ngang, tất cả `img.complete && naturalWidth>0`. Kiểm đếm: T02 sáu gà/2 chuồng, T03 một sách, T04 năm sách, T07 mười khối đơn vị, T08 mười ô, T09 100 ô, T15 dừng khi nguồn ảnh không tồn tại, T19 đủ 22 hình.
5. Đã chụp bằng Chromium các kịch bản T01, T02, T04, T09, T10, T11, T19. Ảnh chụp và bộ ZIP sandbox offline là output hiện hành trong cuộc trò chuyện.

## File sandbox của phiên này
- `G7_2_C_Visual_Sandbox.zip` (1.841.461 byte), **SHA-256: `f2cdb77b2953e4010f2d812dff0c81a736d4d7d4c0906a647e2e5c5bd5677164`**. Nội dung: `index.html`, 22 ảnh, `asset_verified_22.json`, `QA_browser_results.json`, screenshot QA và README.
- Hướng sử dụng: tải ZIP từ cuộc trò chuyện G7.2-C, giải nén, mở `G7_2_C_Visual_Sandbox/index.html` bằng trình duyệt. Không cần internet.
- **Lưu ý giới hạn:** Bản ZIP chưa được upload ngược lên Google Drive/GitHub bằng connector vì connector upload yêu cầu file_uri được cấp bởi connector, không nhận trực tiếp container path. SHA và nội dung được ghi ở đây để truy vết; file ZIP có thể lấy từ cuộc trò chuyện này. **Không diễn giải là ZIP đã đồng bộ Drive/GitHub.**

## Những gì G7.2-C đã / chưa kiểm
| Gate | Kết quả |
|---|---|
| SHA WebP 22/22 từ staging | PASS |
| Alpha/decode/512px 22/22 | PASS |
| Browser responsive 57/57 | PASS |
| Logic số lượng/nhóm/10×10 và chặn nguồn thiếu | PASS_TRIAL |
| 26 test logic G7.2-B | PASS_PREVIOUS_CHECKPOINT |
| Nội dung và ý nghĩa học liệu trong cả 288 hình | NOT_FULLY_SIGNED_OFF |
| Thuộc tính 277 ảnh chưa chứng minh là một vật thể | STILL_PENDING |
| Kim cân/thang chia lít đúng số liệu | NOT_CERTIFIED: text overlay sơ đồ, KHÔNG dùng bitmap làm nguồn đo |
| Ứng dụng thật (desktop/mobile) | NOT_DEPLOYED |
| Duyệt thủ công sản phẩm bởi người sử dụng | PENDING |
| Phát hành lên nhánh main | BLOCKED |

## Cảnh báo ý nghĩa học tập
- Ảnh gà có thể là biểu tượng đại diện cho đàn trong phần **DECORATIVE**; hình chứa dữ kiện đếm phải lặp đúng số cá thể.
- `KL_SH12_006` **một hộp quà**, `KL_M03_012` **chồng hộp quà**; tuyệt đối không tráo trong bài đếm.
- Ở dạng khối lượng/dung tích, nhãn `2 kg`/`3 l` do đề sinh riêng, **không đồng nghĩa bitmap quả cân/ca có khắc vạch đúng đó**. Nếu học sinh phải đọc từ hình cân/ca, cần renderer số đo đủ điều kiện và nghiệm thu riêng.
- Lựa chọn ngẫu nhiên chỉ sau khi lọc đúng màu, số lượng, kiểu dáng; một lượt dùng seed ổn định.

## Giai đoạn tiếp
1. Người dùng tải sandbox ZIP và nghiệm thu giao diện trên máy/điện thoại. Ghi nhận 19 kịch bản.
2. Đối chiếu ảnh gà/sách/khối đơn trên PNG gốc và duyệt thuộc tính để đưa pilot thành nguồn thật cho renderer.
3. Đóng gói bộ visual sandbox vào Drive/GitHub qua luồng upload file được hỗ trợ, có checksum và snapshot sau phát hành.
4. Tiến hành G7.3 kiểm 288 WebP và chuẩn hóa đường dẫn Asset ID. **Không merge cho đến khi được người dùng duyệt.**

## Mốc giữ nguyên
- Google Sheet Registry V5: https://docs.google.com/spreadsheets/d/11-CWHCV-skwvhW3XG8dCfAKAtmrQVySTqqjGxPx1RA4/edit
- Folder staging Drive: https://drive.google.com/drive/folders/1McZB8KXvvBZQ3yMr94Ih6cHK57QhF3xo
- GitHub branch: https://github.com/Nguyennth19/new-lop-2/tree/g7-1-content-audit-20261112
- G7.2-B source: `asset-review/V5/G7_2_B/variant_engine.js`
- G7.2-A.1 label approval: `asset-review/V5/G7_2_A_1_QA_RECOVERY_20261112.md`
