# Đánh giá khả năng thay thế hình tự vẽ trong Web App Lớp 2
**Ngày:** 11/11/2026  
**Trạng thái:** ĐỀ XUẤT / CHƯA THAY ẢNH TRONG WEB APP  
**Repository:** https://github.com/Nguyennth19/new-lop-2  
**Kho dự án Drive:** https://drive.google.com/drive/folders/16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8

## 1. Hiện trạng đã đối chiếu

### Kho ảnh
1. `new-gap` lưu 3 PNG bìa Toán, Tiếng Việt, Tiếng Anh (mỗi hình ~2 MB) và Google Sheet Bài 20. Các bìa môn học **đã được đưa vào repo** dưới `hinh-anh/...` và module `AnhMonToan.html`, `AnhMonTiengViet.html`, `AnhMonTiengAnh.html`. Không nhập trùng.
2. `KIDLEARN_ASSET_LIBRARY/02_SHARED_ASSETS/SH01–SH12`: 12 nhóm đồ vật dùng lại giữa Toán/Tiếng Việt/Anh, mỗi nhóm có `00_SOURCE_SHEETS` và `01_PNG_MASTER`.
3. `KIDLEARN_ASSET_LIBRARY/03_MATH_GRADE_2/M01–M12`: 12 nhóm đồ vật Toán, mỗi nhóm có source và PNG master.
4. `KIDLEARN_ASSET_LIBRARY/01_CHARACTERS_APPROVED_REFERENCE` hiện trống khi list; bộ character nằm ở `GĐ1_KHOA_PHONG_CACH_DUYET_MAU_THAM_CHIEU/PHASE_1B_Character_Master_REVIEW/03_MASTER_PNG_WEBP_PENDING_APPROVAL/v1.0.1_QA_PENDING` và `v1.0.0_QA_PENDING`. Không tuyên bố Robot/Boy/Girl đã release từ tên thư mục.
5. `99_MANIFEST_QA` có báo cáo Deep QA V3.5 (29/10) và registry V4 working recon (10/11); theo báo cáo V3.5, 288/288 PNG đọc được, RGBA 2134×2134, 188 ảnh đúng nhãn, **100 ảnh mismatch nội dung/nhãn**; 288 WebP lossless ở **staging**, chưa đồng nghĩa `APPROVED`/release. Vì đã có registry V4 mới hơn, cần kiểm theo registry mới ở vòng triển khai; báo cáo cũ không được dùng để xác nhận trạng thái hiện tại.
6. Style Lock V3 (28/10): minh họa 2D storybook, viền rõ, mảng màu phẳng, không 3D/gradient halo, nhân vật đã duyệt không restyle; ảnh vật thể ô 512×512 master PNG alpha, master giữ nguyên, WebP tạo sau QA.

### Web App GitHub
- `GiaoDien.html`: topbar avatar hiện là SVG biểu tượng người, `.hero-art` là emoji/SVG/CSS (sách/đám mây/ngôi sao); mascot sidebar là SVG mặt cười. **Không xác nhận có hình chân dung bé gái raster trong topbar** từ mã hiện tại; cần đối chiếu vị trí cụ thể trên screenshot và character tương ứng.
- `19_KhongGianHocToan.html`: toán lời văn render nội dung SVG từ trường `q.svg` Sheet, rồi chép các node cho phép trong `installSvg()`. Toán đặt tính/ô số/tìm chữ số là UI toán chính xác; không thay toàn bộ bằng ảnh.
- `21_LyThuyetToan.html`: giải thích và mô hình khối chục/đơn vị đang là DOM/CSS, có thành phần tương tác `toggleNhomChucToan()`. Không thay khối tương tác bằng ảnh tĩnh.
- `AnhMon*.html`: bìa môn học đang tham chiếu GitHub raw; giữ lại/không nhân đôi.

## 2. Ma trận quyết định vị trí ảnh

| Vị trí | Nguồn hình gợi ý | Cách tích hợp | Ưu tiên | Điều kiện |
|---|---|---|---|---|
| Avatar bé gái topbar | Girl approved v1.0.1, nếu có QA/release | Thay phần icon trong khung 40–48px, giữ CSS; ảnh chân dung crop riêng | P1 | Đúng nhân vật, alpha, dễ nhận biết ở kích thước nhỏ |
| Hero Trang chủ | Girl/Boy/Robot reference | Ảnh web tối ưu kích thước 240–420px, tách khỏi text | P1 | Nhân vật thuộc release được duyệt; không dùng PNG 2MB gốc |
| Mascot/mẹo nhỏ | Character approved | Asset theo ID | P2 | Tách phụ kiện/biểu cảm chỉ nếu được duyệt |
| Toán lời văn gà/kẹo | SH05 animals / SH02 food hoặc asset được đối chiếu ý nghĩa | Render `<img>` chỉ ở vị trí minh họa; giữ text, ô nhập, phép tính DOM | P0 thí điểm | Không dùng hình sai nhãn, số lượng đồ vật đúng đề nếu có số lượng cụ thể |
| Lý thuyết khối chục/đơn vị | M01/M02 chỉ dùng nếu đúng ý nghĩa | Giữ mô hình thao tác DOM/SVG; có thể bổ sung nhân vật hoặc ảnh nền nhẹ | P2 | Không đánh mất thao tác gộp 10 và quy luật đổi chục |
| Phép tính dọc, ô điền, đồng hồ/thước/tiền | Programmatic SVG/HTML chuẩn | **Không** thay bằng ảnh raster | Giữ nguyên | Chính xác vị trí, số và tương tác |
| Bìa Toán/Tiếng Việt/Anh | Đã có ở repo | Chỉ tối ưu WebP nếu cần | Giữ | Không thêm bản trùng |

## 3. Kiến trúc hình ảnh đề xuất
- Tạo **manifest ánh xạ** `asset_id, file_name, observed_label, source_folder, qa_status, usage_context, image_webp, fallback, width, height, version, sha256`. Đối chiếu `catalog_label` và `observed_label`; chỉ dùng asset đã đạt duyệt nội dung.
- Một `AssetCatalog.gs` hoặc JSON đọc một lần khi phát hành; một module `34_HinhAnhDungChung.html` hỗ trợ lấy URL/fallback, lazy loading, `srcset`, alt. Để giảm lượt call Sheet, **gói manifest tĩnh trong mã JS** cho một bản release; không gọi Drive API mỗi lần render câu.
- Phát hành **WebP tối ưu** theo kích thước hiển thị, giữ PNG master nguyên vẹn trên Drive. Ví dụ minh họa nhỏ 96–160px, card 160–256px, hero 320–480px, device-pixel-ratio tùy bối cảnh; so sánh kích cỡ trước khi chuẩn hóa.
- Ảnh web phát qua URL ổn định (GitHub raw ít phù hợp nếu quy mô lớn; giai đoạn pilot dùng static repo, khi lớn cân nhắc storage/CDN). **Không dùng** URL `drive.google.com/file/d/.../view` làm `img src`, vì trang HTML/chính sách quyền chia sẻ có thể làm ảnh lỗi.
- Giữ UI text, ô nhập và đồ thị toán bằng HTML/SVG; ảnh chỉ thay minh họa trang trí/ngữ cảnh học liệu. Fallback nếu asset lỗi vẫn hiện bài học với SVG hoặc icon.
- Mỗi ảnh có `alt` theo vai trò, decorative `alt=""`; không chèn chữ vào ảnh để giữ responsive.
- Mobile/tablet: lazy load dưới màn hình, ưu tiên tải avatar/hero có kích thước cố định, tránh layout shift, kiểm tra chiều cao cards không ép ảnh.
- Tách quy định phong cách nhân vật (Robot/Boy/Girl) với kho đồ vật 2D storybook, không trộn style khi chưa được duyệt.

## 4. Quy trình triển khai (chưa thực hiện)
**G0 Kiểm kê:** xác định các vị trí hình hiện tại cùng `asset_id` phù hợp; xem status trong registry QA V4.
**G1 Đối soát:** chọn 3–5 ảnh thử (Girl avatar, 1 ảnh hero, gà/kẹo cho bài lời văn); kiểm quan hệ ID–nội dung–alpha–style–quyền.
**G2 Release kỹ thuật:** tối ưu webp có checksum + manifest; **không ghi đè master**; đưa vào nhánh GitHub pilot, không cập nhật main khi chưa duyệt.
**G3 Gắn module:** không viết hardcode hàng chục URL trong `GiaoDien.html`, dùng một hàm render/fallback thống nhất; giữ trang làm bài/giải toán.
**G4 QA trên Chrome desktop và tablet Android:** kiểm đủ ảnh, lỗi URL/permission, số lượng vật thể, alpha, vùng chạm, thời gian tải, layout, alt; chụp screenshot trước/sau.
**G5 Duyệt và phát hành:** người dùng duyệt ảnh và giao diện trước khi merge chính thức.

### Quy tắc quan trọng
- **Không lấy nhãn catalog làm bằng chứng nội dung:** V3.5 có 100 mismatch; tra `observed_label` và bản V4 mới nhất.
- **Không tự xem thư mục `QA_PENDING` như đã duyệt.**
- **Không thay minh họa có ý nghĩa toán học bằng hình đẹp nhưng sai số lượng hoặc đơn vị.**
- **Không đưa ảnh PNG 2134×2134 trực tiếp vào card 100×100.**
- **Không sửa số liệu câu hỏi hoặc cấu trúc chấm khi đang thực hiện đợt thay minh họa.**

## 5. Cần xác nhận ở pilot
- Topbar bé gái mà người dùng đề cập: mã hiện tại là icon người SVG, có thể là ảnh ở bản demo khác; cần đối chiếu screenshot đúng vùng.
- Girl/Robot/Boy v1.0.1 đang có thư mục QA_PENDING: chưa xác nhận release có thể tích hợp.
- 100 mismatch theo V3.5 cần đánh giá cùng registry V4 working recon, không tuyên bố chúng đã sửa xong.
