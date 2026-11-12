# Nhánh test-bai-20 (G2.5)
Không merge vào main. Chỉ triển khai trên Apps Script TEST riêng.

## Cách kiểm tra
1. git fetch origin
2. git switch test-bai-20
3. git pull --ff-only origin test-bai-20
4. Cấu hình .clasp.json cho Script ID dự án TEST (không commit ID).
5. clasp push, triển khai Web App TEST và mở Bài 20.
6. Mở Bài 20 bình thường: nhánh TEST tự mở trực tiếp màn sáu lượt LV1-A/B, LV2-A/B, LV3-A/B, không cần nút thử màu vàng.
7. Nhập từng ô, chọn Kiểm tra, xem phản hồi robot.
   
Dữ liệu đọc từ G23_Sau_Luot, G23_Cau_Bo_Sung, G24_Sua_Du_Lieu trong Google Sheet đã cấu hình. Mã mới ThuNghiemBai20.gs chỉ đọc, không ghi Sheet.
Giao diện test không gửi yêu cầu sao thưởng hoặc lưu tiến độ. Các màn production ban đầu vẫn hiện nguyên trạng.
Chưa được phê duyệt xuất bản: câu mới, hình minh họa và các thay đổi sư phạm còn phải nghiệm thu.
Phần tự động chọn bài theo bảy ngày hiện chỉ là bộ kiểm thử quy tắc trong Sheet, chưa tích hợp vào màn này.

## G2.5.1 – Sửa lỗi màn hình cũ
- Commit sửa: `6e39414552d18fef3a1bf432f2f2f6a7a8c04814`.
- Trên nhánh test-bai-20, lối vào Bài 20 mặc định dẫn đến sáu lượt; renderer production cũ vẫn giữ trong mã để so sánh nhưng không được gọi từ lối vào này.
- Sau pull, cần `clasp push`, tạo phiên bản Web App TEST mới và mở URL /exec vừa triển khai (hoặc dùng /dev trên tài khoản có quyền). Chỉ pull Git không tự cập nhật bản Web App đã deploy.
- Không triển khai bản TEST vào Apps Script đang chạy cho học sinh.

## G2.5.2 – Bố cục theo module và lời văn một dòng
- Mở Bài 20 từ lộ trình => màn sáu lượt của nhánh TEST; không dùng HTML demo độc lập.
- LV1-A 2 câu hiểu nhớ + 4 câu đặt tính; mỗi kỹ năng là một module.
- Bố cục desktop tối đa 3 thẻ/hàng; tablet 2; mobile 1. Mỗi câu lời văn là một hàng toàn chiều rộng.
- LV2-A hiển thị 3 bài lời văn (thứ tự 1–3). Hai bài còn lại vẫn ở G23_Sau_Luot để phát triển ôn tập, không xóa.
- LV1-B, LV2-B và LV3 sử dụng module theo skill_id; LV3 bốn câu => 3 + 1 trên desktop.
- Bảng kết quả dùng lại CSS ml-result-card, ml-answer-chip, ml-legend; chip câu sai có thể mở hội thoại robot.
- Robot dùng Asset ID ROBOT_AVATAR từ HINH_ANH_APP; chưa tự đổi sang nhân vật chưa QA.
- Khôi phục bàn phím số trên màn TEST; không thay đổi bàn phím chính.
- Mỗi lượt giữ bản nháp trong bộ nhớ trang, không ghi sao, điểm, tiến độ hoặc lịch sử.
- 8 bài kiểm thử bộ chấm (đúng/sai cho 4 dạng) và 4 bài render thành công bằng kiểm thử hàm; vẫn cần QA trên Web App, thiết bị desktop.
- Chưa đồng bộ dữ liệu nguồn 04_Cau_hoi hoặc merge main.
