# Giai đoạn 1 — Chốt danh mục hình sử dụng cho Web App Lớp 2

**Ngày kiểm kê:** 11/11/2026  
**Trạng thái:** INVENTORY_CLOSED / APP_RELEASE_BLOCKED_PENDING_SIGNOFF  
**Phạm vi:** Robot làm **hình đại diện chính**, bé trai/bé gái làm nhân vật phụ trợ; kho 144 hình dùng chung và 144 hình Toán. Chưa thay ảnh đang chạy.

## I. Nguồn chính thức đã đọc

- Folder tổng: https://drive.google.com/drive/folders/16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8
- Kho ảnh: https://drive.google.com/drive/folders/1IEIvmL_DmV9M1YxuWuBtvNeahilByl0x
- Bộ nhân vật v1.0.0: https://drive.google.com/drive/folders/18mNr15yhJVyx7fWPqzDQOokk5iomzpgg
- Bộ nhân vật sửa v1.0.1: https://drive.google.com/drive/folders/1lDde-KUs8sc5UQ3GP0GEuPdLmn2YqT2x
- Quy tắc lưu trữ kép v1.0: https://drive.google.com/file/d/1pZ5h4a5dBoG6MxVXMk-Fh372dIiuhlss/view
- Báo cáo xác minh v1.0.0: https://drive.google.com/file/d/1POewCpboLyw1USHrhKH8taP7ZL1J_-G4/view
- Style Lock V3: https://drive.google.com/file/d/19AB83QfYiSDEHuyfCZVY0FcnMtJgp9JT/view
- Deep QA 288 V3.5: https://drive.google.com/file/d/1C4wHd6Gt277lgF3Rf8vHMJ3Wql4hYpJi/view
- **Registry V4 working (mới hơn):** https://docs.google.com/spreadsheets/d/1YJXRsOKywSkJuIaJunYWgYyD0ZoKiccvBtkePP74-50/edit
  - Đã đọc trực tiếp `V4_REGISTRY_288` đủ 288 hàng, `V4_GROUP_QA`, `V4_DECISIONS` và mẫu `Asset tracker`.
- Trang mã đang dùng: `GiaoDien.html`, `19_KhongGianHocToan.html`, `21_LyThuyetToan.html`, `AnhMonToan.html`, `AnhMonTiengViet.html`, `AnhMonTiengAnh.html`.

## II. Kết quả kiểm kê/chốt ID — KHÔNG đồng nghĩa cấp quyền đưa vào production

| Kho | Số ID/bản | Kết quả | Gate |
|---|---:|---|---|
| Robot | 6 tư thế WebP v1.0.0 | Đã xác định chính xác tên, Drive file ID | `REVIEW_REQUIRED` |
| Bé trai | 12 tư thế v1.0.0 + 3 bản sửa v1.0.1 | Đã xác định phiên bản, Drive ID; bản sửa thay cho đúng tư thế gốc sau duyệt | `QA_PENDING` |
| Bé gái | 12 tư thế v1.0.0 + 3 bản sửa v1.0.1 | Đã xác định phiên bản, Drive ID | `QA_PENDING` |
| Shared SH01–SH12 | 144 ID | 12 file/master mỗi nhóm, đủ nhóm | `BLOCKED_CONTENT_SIGNOFF` |
| Math M01–M12 | 144 ID | 12 file/master mỗi nhóm, đủ nhóm | `BLOCKED_CONTENT_SIGNOFF` |
| Ba bìa môn | 3 ảnh hiện có trên `hinh-anh/` GitHub | Đang sử dụng, không nhập trùng | `IN_USE` |

**Lưu ý phân biệt số lượng:** 30 tư thế nhân vật gốc là 6 Robot + 12 bé trai + 12 bé gái, và **6 file sửa v1.0.1 là phiên bản của sáu tư thế đó**, không tạo thêm sáu nhân vật/tư thế mới. Tổng ghi trong inventory là 36 *bản file WebP* qua hai phiên bản.

**Registry V4 về đồ vật:**
- 288/288 `release_gate = BLOCKED_CONTENT_SIGNOFF`.
- 188 `VISUALLY_MATCHED_NOT_APPROVED`, 100 `MISMATCH_REVIEW_REQUIRED`.
- `v4_triage`: 188 `RETAIN_PENDING_SIGNOFF`; 8 `REMAP_CANDIDATE`; 43 `SEMANTIC_REVIEW`; 49 `MATH_SEMANTIC_REVIEW`.
- 24/24 nhóm có 12 file theo `V4_GROUP_QA`; đây là kiểm kê tên file, **không phải** release.
- 6 cặp nghi hình tương tự trong Deep QA V3.5: không được xóa/chuyển vị trí trước khi review.
- 288 ảnh có QA kỹ thuật V3.5 (RGBA, 2134×2134, tổng PNG khoảng 72,2 MiB, WebP lossless staging khoảng 39,83 MiB); V4 `BINARY_READBACK_NOT_REPEATED`, tức chưa kiểm tra lại toàn bộ checksum của bản V4.

## III. Quy định phong cách và bảo toàn nguồn

1. Mọi hình đồ vật mới theo **2D Storybook Style Lock V3**: viền bo màu rõ, tô mảng 2–4 vùng, nhận diện tốt ở 96 px, không bóng 3D/đổ glow, không phối hiệu ứng khiến khác phong cách.
2. **Robot, bé trai, bé gái** dùng style nhân vật riêng đã khóa; không dùng quy tắc vẽ lại đồ vật để sửa lại các character đã được duyệt phong cách.
3. Bảo tồn master PNG RGBA nguyên vẹn trong Drive, có asset ID, file ID, hash; không ghi đè source; bản WebP tối ưu cho website được phát hành theo phiên bản riêng.
4. Trong V4: dạng ID logic `KL_SH05_004`, tên file Drive `KL-SH05-04.png`. Hai chuỗi **không giống nhau**; mã dùng để tra danh mục, tên file dùng để tìm ảnh, **không tự dựng tên file bằng phép thay dấu**.
5. Không lấy `source_folder_url` hoặc Drive share link làm `<img src>`; tạo URL ổn định của ảnh web sau khi xuất bản và xác minh readback.
6. Chỉ phát hành khi vượt cả cổng kỹ thuật + cổng duyệt nội dung + kiểm chứng URL/độ tương phản + QA giao diện Chrome desktop/tablet Android.

## IV. Danh mục vị trí chốt để dùng sau khi QA
Xem đầy đủ `tai-lieu/ASSET_APP_SLOT_MAPPING_PILOT.csv`, gồm 13 slot có fallback và cổng QA.

**Vai trò nhân vật:**
- **Robot là hình đại diện chính** của ứng dụng (avatar, hero, mascot, phản hồi học tập). Dùng `KL_ROBOT_MASCOT_01_standing_front_v1.0.0` và `KL_ROBOT_MASCOT_02_wave_step_v1.0.0` làm ứng viên.
- **Bé nam/bé nữ là nhân vật hỗ trợ:** hướng dẫn, học cùng, ví dụ ngữ cảnh; không thay vai trò Robot chính. Ứng viên đơn giản: `KL_BOY_HOME_02_wave_v1.0.0`, `KL_GIRL_HOME_02_wave_v1.0.0`.
- Các pose được sửa ở v1.0.1 phải được ưu tiên thử thay cho pose tương ứng v1.0.0 khi đạt QA (ví dụ `KL_BOY_SCHOOL_05_point_book_v1.0.1` và `KL_GIRL_SCHOOL_05_point_book_v1.0.1`). **Không đảo phiên bản một cách tự động.**

**Toán Bài 20 — ba ứng viên cần soi kỹ:**
- `KL_SH05_004`: catalog và observed đều là **gà mái**; phù hợp minh họa đàn gà nhưng **chưa owner signoff**. Dùng ở vị trí hình minh họa, không để bức hình một con gà hàm ý 28 con.
- `KL_SH02_010`: catalog = **kẹo mút**, observed = **kẹo bọc giấy**; có thể đúng ngữ cảnh "kẹo" của bài toán nhưng **cần remap/sư phạm duyệt**, không lấy catalog để mô tả sai ảnh.
- `KL_M02_001`: catalog = **khối đơn vị xanh**, observed = **khối lập phương màu vàng**; `KL_M02_002`: catalog = **khối đơn vị đỏ**, observed = **thanh chục xanh lá**. **Không thay mô hình toán bằng những hình này** trước math QA.
- SVG động có phép tính, khối tương tác gộp 10, ô nhập, cột đơn vị/chục và trường đáp án **giữ nguyên HTML/SVG**.
- Ba bìa môn đã được tích hợp từ Drive vào repo; không tạo bản sao.

## V. Các file Giai đoạn 1 đã lưu GitHub

1. `tai-lieu/ASSET_CATALOG_288_V4_INVENTORY.csv` — toàn bộ 288 asset ID, 24 nhóm, tên catalog/observed, status V4, tên PNG, URL folder; `app_release_status=BLOCKED_PENDING_CONTENT_SIGNOFF`.
2. `tai-lieu/CHARACTERS_ROBOT_BOY_GIRL_INVENTORY.csv` — 30 WebP v1.0.0 + 6 WebP v1.0.1, tên, Drive file ID, nhóm, kích cỡ file, QA gate và role đề xuất.
3. `tai-lieu/ASSET_APP_SLOT_MAPPING_PILOT.csv` — 13 vị trí ảnh, asset ID ứng viên, fallback nếu chưa duyệt.
4. Báo cáo này.

**Không đưa vào app thêm ảnh trong Giai đoạn 1.** Không sửa Google Sheet, câu hỏi, giao diện, JS hoặc CSS runtime.

## VI. Gate chuyển sang Giai đoạn 2

- [ ] Người sở hữu xác nhận rõ **Robot là mascot/đại diện chính** (theo yêu cầu mới nhất) và duyệt ảnh cụ thể cho topbar/hero.
- [ ] Xem từng image qua contact sheet và full PNG/WebP ở nền trắng/kem/xanh đậm; Robot và các pose chọn không bị méo/tóc/tay/bàn cắt.
- [ ] Duyệt `KL_SH05_004` (gà mái) và đối soát `KL_SH02_010` (kẹo bọc giấy), hoặc chọn ID khác có nội dung đã duyệt.
- [ ] V4 chuyển đúng asset pilot sang `APPROVED` bằng biên bản/chữ ký của người chịu trách nhiệm; không sửa 288 trạng thái hàng loạt.
- [ ] Đóng gói 3–5 WebP tối ưu (file ID + SHA256) và nạp từ asset manifest **trên nhánh thử nghiệm**; fallback SVG giữ nguyên.
- [ ] QA desktop + tablet Android: tốc độ tải, ảnh nét, không vỡ bố cục, không sai bài toán, không thay đổi kết quả học/điểm sao.
- [ ] Duyệt screenshot trước khi merge `main`/triển khai Web App.

## VII. Kết luận

**Giai đoạn 1 hoàn tất ở mức kiểm kê, nhận dạng, phân loại và chốt ứng viên sử dụng**, nhưng **chưa hoàn tất ở mức duyệt phát hành**. Không có cơ sở từ hồ sơ hiện tại để tự nâng `QA_PENDING` hoặc `BLOCKED_CONTENT_SIGNOFF` thành `APPROVED`. Mục tiêu tiếp theo là duyệt 3–5 ảnh thí điểm, sau đó mới xuất asset web, thay hình và kiểm chứng.
