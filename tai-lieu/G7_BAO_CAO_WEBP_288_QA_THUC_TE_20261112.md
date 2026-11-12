# G7 – Báo cáo chuyển đổi WebP và QA 288 ảnh (2026-11-12)

**Trạng thái:** 288/288 TECHNICAL_QA_PASS, CONTENT_SIGNOFF_PENDING, DRIVE_STAGING_VERIFIED, **KHÔNG PHÁT HÀNH CHÍNH THỨC**.

## Kết quả thực nghiệm trên PNG gốc
- Tải đủ 288 PNG (SH01–SH12: 144; M01–M12: 144) từ Google Drive, giữ nguyên file master.
- Đối chiếu SHA-256 nguồn với Manifest V3.5: **288/288 khớp**.
- PNG gốc: 2134 × 2134, RGBA. WebP đầu ra: **512 × 512, RGBA**.
- **254 ảnh** dùng WebP quality 90, **34 ảnh** không đạt PSNR >=34dB được chuyển sang **WebP lossless**. 288/288 WebP giải mã thành công, alpha khớp ảnh đã resize, lề vật thể >=24px, SHA-256 xác minh.
- Tổng PNG: **75,711,089 bytes**; WebP: **12,350,644 bytes**; giảm **83,69%**.
- Một số ảnh có nội dung toán học (cân, đồng hồ, thước, số lượng) phải kiểm định riêng nội dung/độ chính xác, dù pass kỹ thuật.

## Google Drive staging và kiểm tra tải ngược
- Thư mục: https://drive.google.com/drive/folders/1McZB8KXvvBZQ3yMr94Ih6cHK57QhF3xo
- SHARED 144 ảnh ZIP: https://drive.google.com/file/d/1nvCxNEUOeUgsvyq0youdSLyxwK65hlKz/view
  - SHA256 ZIP: `65219bd7a2a5707f31febf18b28593d1a82c15241927b00420824e9532b49dfc`
  - 6,338,856 bytes, 144 WebP; **144/144 hash thành viên ZIP khớp CSV QA**.
- MATH 144 ảnh ZIP: https://drive.google.com/file/d/1-KM_l0lmIz61T9mCQwEbOzDEIdYYomcS/view
  - SHA256 ZIP: `b7d74696b6e0df6fa9a6da2f334533e0b5a8dee6ac24890043946290c232f3ea`
  - 6,031,421 bytes, 144 WebP; **144/144 hash thành viên ZIP khớp CSV QA**.
- Bảng audit 288: https://drive.google.com/file/d/1py12RGUq7ONSpWrJMwStwZ2bOmEqBOlc/view
- Danh sách 100 nhãn cần duyệt: https://drive.google.com/file/d/1-kEkadwSkU3Ch1JyXuTPTmfndiRUlOOM/view
- 4 trang đối chiếu hình/nhãn:
  1. https://drive.google.com/file/d/1laTe6nhXHuJXo20UW9dvTu6TAgR5HnCV/view
  2. https://drive.google.com/file/d/1mS0HBfF5tfr-t-27ZsdoyuFVAQ_Jyg9T/view
  3. https://drive.google.com/file/d/1ENNTYIRXXkG0nzTBcbARi9I5h5JHzmhk/view
  4. https://drive.google.com/file/d/1FzHeoA3T6NrAbyU9ZsrO7XSVypB87uI-/view

**Kết quả tải ngược:** cả hai ZIP trên Drive được tải lại, byte-for-byte trùng bản local; kiểm tra từng WebP thành viên trong hai ZIP với bảng hash: 288/288 khớp.

## Kết quả đối soát 100 nhãn
- Danh mục lịch sử có **188 nhãn được đánh giá khớp** và **100 nhãn khác biệt** theo V3.5.
- Đã xây dựng bản *proposed semantic remap* cho 100 Asset ID: giữ nguyên mã, danh mục gốc và thêm `semantic_label_vi=observed_label_vi`; `semantic_resolution=REMAP_CANDIDATE_PENDING_SIGNOFF`.
- Bảng 100 ca và 4 contact sheet phục vụ duyệt. Không tự đổi nội dung file master hoặc coi nhãn quan sát là đã được ký duyệt.
- Với cân, thước, giờ, tiền và hình có giá trị/số lượng: nếu hình không có đơn vị hoặc dấu đo, không suy đoán giá trị theo nhãn cũ.
- 6 cặp ảnh tương tự từ QA V3.5 không được xóa hoặc gộp ID tự động.

## GitHub
- Nhánh: `g7-asset-registry-20261112`; PR nháp #9: https://github.com/Nguyennth19/new-lop-2/pull/9.
- Registry JSON 288 đã được bổ sung PNG hash, WebP hash/byte, profile nén và URL của hai ZIP staging trên Drive.
- CSV audit 288 và CSV 100 nhãn được commit trên nhánh G7.
- WebP **chưa được phát hành dưới dạng 288 file riêng trên GitHub**. Nhánh G7 chỉ có metadata/QA; tránh để bản ứng dụng gọi ảnh chưa ký duyệt.

## Điều kiện để chuyển từ STAGING thành APPROVED
1. Duyệt ngữ nghĩa và tên 100 nhãn ngoại lệ; ghi nhận người duyệt, ngày, quyết định.
2. Rà soát bổ sung hình có số liệu toán học; không gán số/giá trị không thể đọc rõ.
3. Chốt manifest version bất biến, công bố đường dẫn WebP từ kho GitHub ở commit hash cố định.
4. Tải ngược toàn bộ bản release từ GitHub + Drive, so 288 SHA-256 và QA giao diện ba môn.
5. Chỉ sau đó bật `ASSET_G7_RELEASE` và merge/deploy.

**Lưu ý:** PASS kỹ thuật không tương đương được duyệt nội dung hoặc đã phát hành.


## Bổ sung kiểm tra và mirror GitHub (2026-11-12)
- **18 Git binary parts**: 9 SHARED + 9 MATH đã được commit lên `hinh-anh/G7_STAGING_BIN` ở nhánh G7. Mỗi part 750,000 bytes (trừ phần cuối); SHA Git blob được kiểm tra trùng bản tính từ file thực tế, **18/18 khớp**. Đã đọc ngược Git tree xác nhận 18 file và dung lượng.
- Ghép các part theo thứ tự tên để tái tạo 2 ZIP, xác minh SHA256 ZIP đã liệt kê; xem `hinh-anh/G7_STAGING_BIN/README.md`. Đây chỉ là **bản sao lưu staging**, chưa phải 288 URL WebP riêng để ứng dụng sử dụng.
- **6 cặp nhân vật bé trai/bé gái v1.0.1** đã tải về từ Drive, mở giải mã WebP, có RGBA/alpha và ghi SHA256/cỡ thật vào `hinh-anh/G7_NHAN_VAT_QA_6.csv`. Trạng thái duyệt nội dung nhân vật vẫn `QA_PENDING`; 3 robot pilot nằm trong repo, chưa nhập chung release.
- Hồ sơ QA nhân vật trên Drive: https://drive.google.com/file/d/18cHtTPiymoDO25l5BNHRBYWENIJMJOgT/view
- Bộ ZIP staging tổng hợp 288 WebP học liệu + 6 WebP nhân vật + báo cáo QA + 4 contact sheets + script có thể tải trực tiếp tại hội thoại, không chứa PNG master.
- **Còn lại trước khi merge/deploy:** ký duyệt 100 nhãn, chốt nhãn học liệu có số đo/giá trị, đóng gói 288 URL WebP bất biến tại GitHub sau QA, kiểm thử trực quan GAS.
