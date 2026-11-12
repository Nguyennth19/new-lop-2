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

## Chẩn đoán đồng bộ lệch (G2.5.3)
Bản này có 3 dấu hiệu khác nhau:
1. Tab/tiêu đề Web App TEST: G252-BUILD-20261112-R2.
2. Góc trên bên phải trình duyệt: TEST G252-BUILD-20261112-R2 (được tạo trong GiaoDien.html).
3. Thanh tiêu đề của màn Bài 20: G252-BUILD-20261112-R2 (được tạo trong 42_ThuNghiemBai20.html).
Nếu chỉ LV2-A giảm số câu nhưng thiếu dấu hiệu số 2/3 thì mã máy chủ và giao diện đang ở hai phiên bản khác nhau. Không thể sửa việc đó bằng CSS.

Chạy lệnh trên local:
- git branch --show-current
- git rev-parse --short HEAD
- clasp status
- clasp push (xác nhận bao gồm 42_ThuNghiemBai20.html, 43_CSS_ThuNghiemBai20.html, GiaoDien.html, MayChu.gs)
- clasp open (đối chiếu từng tệp trong editor Apps Script)
- Apps Script -> Deploy -> Manage deployments -> Edit -> New version -> Deploy
- Tải lại URL /exec đã triển khai, hoặc /dev khi đang đăng nhập đúng tài khoản.
- Trong editor, chạy kiemTraBuildBai20_() để đối chiếu sáu lượt và version.

Bản G2.5.2 được thêm đầy đủ lên GitHub trước đó; ảnh màn hình G2.5 cũ thể hiện frontend chưa cập nhật. Build marker không chứng minh render đúng nhưng giúp phân biệt nguồn lỗi.

## G2.5.4 – Dùng lại giao diện chuẩn, không hiển thị nhãn thử nghiệm
- Dùng root #mathFullScreen: sidebar, header, bảng kết quả và bàn phím dùng quy tắc CSS chung 20/22/25/29.
- Các quy tắc module và 1 bài lời văn/dòng đã chuyển từ 43_CSS_ThuNghiemBai20 sang cuối 20_CSS_KhongGianHocToan, với class module chỉ dùng khi bài có dạng đó. CSS 43 không còn được nạp.
- Không còn banner màu vàng, build version hoặc chú thích TEST trên màn bài làm.
- Các ID data-g25- là hook lập trình của nhánh thử, không hiển thị lên màn hình; không ghi kết quả/sao lên máy chủ.
- Sáu lượt vẫn dùng bản dữ liệu 28 câu (LV2-A 3 câu).
- Tuyệt đối chưa merge khi chưa kiểm thử trên Web App và so sánh giao diện ở desktop/tablet.
- Với việc sửa #mathFullScreen, không được mở đồng thời cả renderer cũ và mới trên cùng trang: lối vào Bài 20 trong nhánh đã chặn renderer cũ.
