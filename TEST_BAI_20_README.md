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
