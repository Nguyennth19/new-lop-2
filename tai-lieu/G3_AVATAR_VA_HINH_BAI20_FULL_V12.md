# Giai đoạn 3 — Avatar Robot và minh họa đầy đủ Bài 20 (bản thử V1.2)
Ngày 11/11/2026. Nhánh: `pilot-hinh-anh-g3`. **Chưa gộp main / chưa chạy nghiệm thu Web App thật.**

## Phản hồi từ Chrome
Người sử dụng xác nhận banner và các vị trí đã thay hình ổn, nhưng **avatar Robot trên thanh trên cùng bị cắt**. Yêu cầu đồng thời bổ sung toàn bộ hình minh họa ở những câu toán lời văn còn lại trong Bài 20.

## Thay đổi đã triển khai
1. **Avatar:** từ ảnh toàn thân `robot_avatar_full.webp` với `transform:scale(1.55)` sang bản **crop đầu/vai riêng** `robot_avatar_head_96.webp` (96×96 px, WebP khoảng 3.2 KB) dựng từ master Robot 01, giữ nguyên nhân vật. `35_CSS_HinhAnhPilot.html` đặt ảnh giữa khung tròn, không zoom/lệch offset. SVG cũ là fallback nếu ảnh không tải.
2. **Ảnh minh họa đầy đủ Bài 20:** `34_HinhAnhDungChung.html` ánh xạ theo `question_id` của Google Sheet, không đoán theo tên bài. Đã kiểm tra nội dung nguyên bản bằng cách đọc `04_Cau_hoi` và xem trực tiếp 4 ảnh ứng viên mới.
3. **Không sửa Toán:** giữ nguyên câu hỏi, số, phép tính, ô nhập, chấm bài, số sao, phần giải thích và sidebar.
4. **Ảnh nguồn:** lưu trong `hinh-anh/pilot-g3/`, gọi qua `raw.githubusercontent.com` gắn với commit bất biến `4177627bbc1a941c5568cf7c5703a8811e0e1999`, không dùng URL xem file Drive.

## Mapping tám câu toán lời văn (LV1/LV2)
| question_id | asset_id | hình web | nguồn Drive | kiểm duyệt |
|---|---|---|---|---|
| toan_b20_lv1_ex3_01 | KL_SH05_004 | math_hen.png | 1l7kXSgRF1aziLzqPDlcgC9Dg5mcqg7l3 | Đã duyệt pilot |
| toan_b20_lv1_ex3_02 | KL_SH02_010 | math_wrapped_candy.png | 1ymsXl6jC9fKmGhcwWUdZlkbMD8LQ29Uk | Đã duyệt pilot, nhãn kẹo bọc giấy |
| toan_b20_lv2_problems_01 | KL_SH02_010 | math_wrapped_candy.png | cùng nguồn | Đã duyệt pilot |
| toan_b20_lv2_problems_02 | KL_SH05_004 | math_hen.png | cùng nguồn | Đã duyệt pilot |
| toan_b20_lv2_problems_03 | KL_SH03_006 | math_book.png | 1x6zrt53ZjfS9BB60vsuVRhVDlMFlx2Fy | **Mới: chỉ dùng thử** |
| toan_b20_lv2_problems_04 | KL_SH01_001 | math_apple.png | 1x-If-Nv0tu8jRbWNyCIP4j5ukgtA9wlc | **Mới: chỉ dùng thử** |
| toan_b20_lv2_problems_05 | KL_M08_007 | math_ribbon.png | 1mggfBaeOlot4fPA7OELFMvaljbp98g6S | **Mới: chỉ dùng thử** |
| toan_b20_lv2_problems_06 | KL_SH02_009 | math_cookie.png | 1ZES6WwLn6LoAhBD5O8OqKRJm_tByWy3X | **Mới: chỉ dùng thử** |

**Lưu ý:** 4 ảnh bổ sung thuộc kho bản master và registry còn `BLOCKED_CONTENT_SIGNOFF`; việc dùng trên *nhánh demo* không đồng nghĩa đã được duyệt phát hành chính thức. Hai ảnh LV2 cuối vẫn có ánh xạ đầy đủ, dù giao diện hiện có thể chỉ chọn bốn câu LV2 theo quy tắc tối ưu số bài.

## QA đã kiểm
- 5 file binary mới trên GitHub: head avatar, apple, book, ribbon, cookie; original pilot 5 vẫn đủ.
- Mã mô-đun ảnh và CSS độc lập, không trộn vào Google Sheet.
- Test khởi tạo 8 `question_id` với mock DOM: 8/8 ánh xạ đến file kỳ vọng.
- JS parse syntax và thẻ script 19/19. Các ảnh có lỗi tải sẽ hiện lại SVG.
- Chưa thực hiện browser/screenshot nghiệm thu trên Chrome desktop + tablet Android.
- 4 ảnh mới hiện vẫn là PNG master (tổng ~1,05 MB); cần tạo WebP cỡ 160/320px để phát hành chính thức nếu nghiệm thu đạt.

## Hướng dẫn lấy nhánh
```bash
git fetch origin pilot-hinh-anh-g3
git switch pilot-hinh-anh-g3
git pull origin pilot-hinh-anh-g3
```

**Quan trọng khi dùng clasp:** Google Apps Script chỉ nhận các tệp `.gs`/`.html`. Không đồng bộ các ảnh binary trong thư mục `hinh-anh/` vào trình biên tập Apps Script. Ảnh đã ở GitHub và được module JS đọc từ URL raw.

## QA tiếp theo
1. Trang chủ: kiểm tra avatar không cắt tai/đầu khi 40–48 px; hero và mascot vẫn bình thường.
2. Toán Bài 20 LV1/LV2: ảnh trong đề bài gà, kẹo, sách, táo, ruy băng, bánh quy; kiểm tra với Sheet, đặc biệt hai câu LV2 hiện đang bị chọn ẩn.
3. Android Chrome: thời gian tải ảnh, layout 88×82 px, bàn phím không bị đè.
4. Đăng ký duyệt chính thức 4 ảnh mới trước khi merge main; tối ưu WebP và kiểm tra mạng chậm.
