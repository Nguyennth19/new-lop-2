# Giai đoạn 2 — QA trực quan 5 hình thí điểm (Pilot Review V1)

**Ngày:** 11/11/2026  
**Trạng thái:** `TECH_REVIEW_COMPLETE / OWNER_VISUAL_SIGNOFF_PENDING`  
**Nguồn:** Hình gốc tải trực tiếp từ Google Drive. **Chưa thay ảnh hoặc phát hành vào Web App.**

## 1. Căn cứ

- Giai đoạn 1: `tai-lieu/GIAI_DOAN_1_CHOT_DANH_MUC_HINH_V10.md`
- Định danh 5 hình: `tai-lieu/ASSET_APP_SLOT_MAPPING_PILOT.csv`
- Bằng chứng kiểm tra từng hình, Drive ID, file SHA-256: `tai-lieu/G2_PILOT_5_ASSETS_QA_EVIDENCE.csv`
- Style Lock V3: https://drive.google.com/file/d/19AB83QfYiSDEHuyfCZVY0FcnMtJgp9JT/view
- Registry V4: https://docs.google.com/spreadsheets/d/1YJXRsOKywSkJuIaJunYWgYyD0ZoKiccvBtkePP74-50/edit
- Quy định phát hành nhân vật: https://drive.google.com/file/d/1pZ5h4a5dBoG6MxVXMk-Fh372dIiuhlss/view

### Nguyên tắc
- Tech QA chỉ chứng minh file tải, đọc, có alpha, không cắt viền. **Không tự đổi** trạng thái `REVIEW_REQUIRED`, `BLOCKED_CONTENT_SIGNOFF` thành `APPROVED`.
- Style Lock V3 cho 288 đồ vật **loại trừ Robot/Boy/Girl** đã chốt phong cách từ trước; không kết luận Robot bóng glossy là lỗi vi phạm Style Lock của đồ vật.
- Đối với đồ vật: giữ hình đẹp và đúng nội dung chưa đủ; kiểm tra 2D storybook không đổ bóng 3D/gradient mềm. Khi không rõ, giữ `STYLE_REVIEW_REQUIRED`.
- Không sửa master, registry QA gốc, GitHub runtime, Google Sheet bài học hoặc điểm thưởng.

## 2. Ảnh thí điểm đã kiểm tra trực tiếp

| STT | Asset / file | Kích thước / dung lượng gốc | Kết quả kỹ thuật | Kết quả trực quan | Quyết định |
|---|---|---:|---|---|---|
| 1 | `KL_ROBOT_MASCOT_01_standing_front_v1.0.0.webp` | 367×601; 91.8 KiB | RGBA, padding 15px, không cắt | Robot đứng rõ, toàn thân ở 48px quá nhỏ | **Đạt QA kỹ thuật; avatar cần crop mặt riêng** |
| 2 | `KL_ROBOT_MASCOT_02_wave_step_v1.0.0.webp` | 403×594; 90.4 KiB | RGBA, padding 15px | Tay vẫy, khuôn mặt và toàn thân rõ | **Ứng viên phù hợp hero; chờ chủ dự án duyệt** |
| 3 | `KL_ROBOT_MASCOT_05_wink_pencil_thumbsup_v1.0.0.webp` | 373×583; 88.8 KiB | RGBA, padding 15px | Mắt nháy, ngón cái và bút dễ nhận ra | **Ứng viên phù hợp động viên; chờ duyệt** |
| 4 | `KL_SH05_004` / `KL-SH05-04.png` | 2134×2134; 266.2 KiB | RGBA, padding 150px | Đúng **gà mái**; đủ mỏ, đuôi, chân; nhìn được 160px | **Nội dung phù hợp; chờ owner + style gate** |
| 5 | `KL_SH02_010` / `KL-SH02-10.png` | 2134×2134; 195.6 KiB | RGBA, padding 150px | Là **kẹo tròn bọc giấy hai đầu**, không phải **kẹo mút** | **Phải REMAP semantic + owner/style signoff** |

### Drive file ID đã xác minh
- Robot avatar: `1Hzb8D0YkCe6fpGsVxb869ySN1pN62SJ7`
- Robot hero: `188TgikdY2p1ZOhopmB_Ta9zFmXjfGVh-`
- Robot thưởng: `17SGKZAIdaHliClJ6m5_hFs-_pdwPqY5H`
- Gà mái: `1l7kXSgRF1aziLzqPDlcgC9Dg5mcqg7l3`
- Kẹo: `1ymsXl6jC9fKmGhcwWUdZlkbMD8LQ29Uk`

## 3. Kết quả phép thử hiển thị

Đã dựng **bản contact sheet QA xem thử** ở tỷ lệ lớn và thu nhỏ; kiểm tra trên ba nền kem, xanh nhạt và xanh đậm. Ảnh nhân vật đọc được ở kích thước card/hero; gà/kẹo rõ ở 160px. Tuy nhiên:
- **Header 48 px:** Robot toàn thân chỉ còn hình tí hon → cần crop phần đầu từ source (không chỉnh master), tạo derivative `robot_head_avatar_96.webp` để hiển thị 40–48px.
- **Hero:** Robot vẫy chào không bị cắt mép, ứng viên tốt.
- **Khối lời văn:** chỉ đưa gà/kẹo vào vị trí minh họa, **không** đưa ảnh thay con số 28, 17 hoặc các ô giải/chấm bài.
- **Phong cách đồ vật:** ảnh gà có vùng chuyển màu mềm; ảnh kẹo có điểm sáng khá bóng. Không tự công nhận phù hợp Style Lock V3 khi chưa có duyệt mỹ thuật; cân nhắc chọn bản phẳng hơn hoặc ngoại lệ có ghi nhận.
- **Không trộn vai trò:** Robot làm mascot chính; bé trai/bé gái vẫn dùng ở bước khác, không thêm vào pilot 5 ảnh.

## 4. Bản tối ưu WebP chỉ để xem thử

Đã tạo **sáu ảnh WebP preview**, gồm 5 ảnh gốc thu nhỏ theo vị trí và 1 biến thể crop avatar, kèm `PREVIEW_MANIFEST.json`, checksum và README. Chỉ dùng để **đánh giá hình và kích thước**; không upload vào app production, không thay master Drive. Quy đổi:
- Robot 01 full-body 159×260 ~21 KiB
- Robot 02 hero 285×420 ~40 KiB
- Robot 05 115×180 ~13 KiB
- Gà 160×160 ~7 KiB
- Kẹo 160×160 ~5 KiB
- Avatar crop đầu 96×76 ~6 KiB
- **ZIP xem thử ~93 KiB**; không coi đây là kết quả QA browser thực tế.

Đường dẫn ZIP/contact sheet dùng trong phiên review nội bộ; có thể tải từ phản hồi gắn kèm trong cuộc trò chuyện, không được coi là đường dẫn GitHub/Drive vĩnh viễn.

## 5. Cổng quyết định G2

| Hình | Tech QA | Semantic QA | Style QA | Chủ dự án |
|---|---|---|---|---|
| Robot 01 avatar head crop | PASS | PASS | character style riêng, giữ nguyên | **PENDING** |
| Robot 02 vẫy chào | PASS | PASS | character style riêng, giữ nguyên | **PENDING** |
| Robot 05 động viên | PASS | PASS | character style riêng, giữ nguyên | **PENDING** |
| SH05-04 gà mái | PASS | PASS | **REVIEW_REQUIRED** | **PENDING** |
| SH02-10 kẹo bọc giấy | PASS | **REMAP_REQUIRED** | **REVIEW_REQUIRED** | **PENDING** |

**Kết luận:** Không có lỗi decode, thiếu alpha hoặc cắt cụt hình trong năm mẫu. **Giai đoạn 2 đạt kiểm tra kỹ thuật và nội dung sơ bộ; chưa đạt cổng duyệt phát hành chính thức.** Không đổi `V4_REGISTRY_288.release_gate` khi chưa có owner approval.

## 6. Sau khi chủ dự án duyệt

1. Ghi quyết định riêng cho từng asset: `ACCEPTED_FOR_PILOT`, `REMAP_AND_ACCEPTED`, `REJECTED` hoặc `REPAIR_REQUIRED`. Chấp thuận pilot chỉ có hiệu lực cho đúng hình, phiên bản, vị trí và checksum.
2. Chuẩn hóa WebP size, alt/fallback, asset manifest và URL phân phối ổn định; đưa các file lên **nhánh thử nghiệm/PR**, không tự merge main.
3. Dựng giao diện test Trang chủ avatar/hero và Toán Bài 20 hai câu lời văn; chụp desktop/tablet để người dùng duyệt.
4. Chỉ khi nghiệm thu giao diện mới merge và cập nhật Apps Script; giữ nguyên logic chấm, điểm sao, sidebar và module Toán tương tác.

## 7. Yêu cầu duyệt ngắn gọn

Chủ dự án chỉ cần xác nhận:
- Robot avatar: **crop mặt** hay muốn một tư thế khác?
- Robot 02, Robot 05: **đồng ý**, **sửa**, hay **thay**?
- Gà mái SH05-04: **đồng ý** hay **đổi**?
- Kẹo SH02-10: **chấp nhận ảnh kẹo bọc giấy và remap nhãn** hay **chọn hình khác**?
- Hai hình đồ vật có được chấp thuận ngoại lệ phong cách bóng nhẹ không, hay yêu cầu bản phẳng đúng Style Lock V3?

Không suy diễn chủ dự án đã chấp thuận chỉ từ việc yêu cầu "tiến hành duyệt".
