# Biên bản chốt nghiệm thu hình ảnh G3 — 11/11/2026

## Quyết định
Chủ dự án đã xác nhận: **“ok chốt nghiệm thu hoàn thành 100%”**. Đây là phê duyệt của chủ dự án đối với gói G3 V1.2; chấp thuận kết thúc đợt thử hình ảnh và đưa Pull Request #3 vào nhánh `main`.

## Phạm vi đã chấp thuận
- Sửa avatar Robot bị cắt: dùng `robot_avatar_head_96.webp`, CSS không phóng toàn thân.
- Giữ Robot chào ở Trang chủ và Robot động viên ở sidebar.
- Minh họa Bài 20 bằng asset Drive: gà, kẹo bọc giấy, sách, táo, ruy băng, bánh quy; ánh xạ chính xác 8 mã câu hỏi lời văn LV1/LV2.
- Giữ toàn bộ bài học/ô nhập/chấm bài, kết quả, sao thưởng và fallback SVG.
- Đưa 10 ảnh gồm các hình gốc và ảnh bổ sung vào `hinh-anh/pilot-g3/`, module `34_HinhAnhDungChung.html`, CSS `35_CSS_HinhAnhPilot.html`.

## Bằng chứng và phạm vi QA
- Người sử dụng đã kiểm tra và chấp thuận hình ảnh theo lời xác nhận trong cuộc trò chuyện.
- Kiểm tra bằng mã đã xác nhận đủ 8/8 ánh xạ câu hỏi, thử cú pháp module, 19 thẻ script mở/đóng và tình trạng fallback.
- Không có kết quả đo tốc độ tải, mô phỏng toàn trình Chrome tablet Android từ môi trường thực thi trợ lý. **“100%” ở đây là trạng thái nghiệm thu của chủ dự án**, không phải chứng nhận tự động tất cả thiết bị/điều kiện mạng.
- Bốn PNG master bổ sung vẫn giữ định dạng nguồn trong pilot; tối ưu sang WebP phát hành là cải tiến hiệu năng tiếp theo, không ngăn chốt nghiệm thu nội dung và hiển thị đã được chấp thuận.
- Không sửa trạng thái QA gốc của toàn bộ thư viện Drive hoặc tự coi 288 hình còn lại đã được duyệt.

## Hướng dẫn cập nhật
Sau khi merge PR #3 vào `main`:
```bash
git switch main
git pull origin main
```
Với Google Apps Script/clasp, chỉ đồng bộ các file `.gs`, `.html`; ảnh binary trên GitHub được nạp bằng URL raw từ module ảnh.

## Đợt phát triển kế tiếp
Tiếp tục sử dụng cấu trúc Asset ID và fallback đã duyệt; tối ưu ảnh WebP, kiểm thử trên mạng chậm và mở rộng tài sản sau khi mỗi nhóm được phê duyệt. Không cần mở lại nghiệm thu G3 trừ khi người sử dụng báo lỗi mới.
