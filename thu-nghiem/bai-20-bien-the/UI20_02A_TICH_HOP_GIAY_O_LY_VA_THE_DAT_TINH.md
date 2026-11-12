# UI20-02A – Tích hợp giấy ô ly và thẻ phép tính từ lop-2-new
Ngày: 2026-11-12. Trạng thái: STATIC_PASS / WEBAPP_VISUAL_PENDING / PEDAGOGY_PENDING.
Nhánh: test-b20-bien-the-20261112.
UI reference: test-theo-main. Reference repository: https://github.com/Nguyennth19/lop-2-new (six branches reviewed; main contains UI pattern).
Phạm vi: tái sử dụng COMPONENT, không thay ứng dụng và không áp dụng nguyên hệ font, Tailwind, data-ans.

## Quy tắc tích hợp
- Tệp chuẩn 20_CSS_KhongGianHocToan.html GIỮ NGUYÊN 100% so với test-theo-main.
- Chỉ bổ sung 43_CSS_ThanhPhanBaiToan.html: tất cả selector bắt đầu bằng #mathFullScreen, không có body/html/:root toàn cục, không import Baloo 2/Quicksand/Tailwind.
- GiaoDien.html bổ sung duy nhất include 43 ở cuối vùng CSS đã có; giữ header, sidebar, results, keyboard.
- 41_HienThiCauHoiToan.html cải tiến các hàm word(), vertical(), puzzle() sẵn có, không thêm trình dựng riêng cho B20.
- 19_KhongGianHocToan.html: chạm thẻ đặt tính đưa con trỏ vào đơn vị; tự tiến ĐV → Nhớ → Chục; sau Chục nhảy sang câu tiếp theo; dùng chung cả phím ảo và bàn phím cứng; không sửa API máy chủ.

## Mục kế thừa và kiểm tra
| Component | Kế thừa | Giữ nguyên |
|---|---|---|
| Word | giấy ô ly 28px/7px, tóm tắt tách biệt, nhãn 'Phép tính', input gạch chân, đơn vị trong phép tính, đáp số | WebP/SVG G7, input data-ml-field, đáp án ở server |
| Vertical | nền ô ly 2 cấp ở kết quả, nhấn thẻ bắt đầu từ đơn vị, chuyển con trỏ | ô nhớ, dấu +, thứ tự cột và CSS khung chính |
| Missing digit | nền ô ly 2 cấp trong phần kết quả; tái sử dụng puzzle renderer | cấu trúc ô trống/câu nguồn, không tự sinh câu mới |
| Shared UI | chỉ style trong #mathFullScreen, không can thiệp menu/keyboard | font Inter, bố cục đã chốt, thanh điểm/sao |

## Bộ kiểm thử đã chạy
- 30/30 câu hiện tại được renderer trả HTML có đủ ô nhập phù hợp.
- 30/30 đáp án đúng chấm đúng và 30/30 đáp án sai bị từ chối qua mock server hiện có.
- Bài lời văn có đầy đủ ml-word-structured, ml-word-summary, ml-graph-paper, ml-word-calc-line, 'Phép tính:', 'Đáp số:', data-ml-svg; không đưa data-ans vào HTML.
- Vertical có ml-vertical-paper; puzzle test có ml-puzzle-paper.
- CSS mới có ô ly 2 cấp (28px/7px), không import font ngoài hoặc Tailwind. CSS gốc 20 không thay đổi so với test-theo-main.
- Đã kiểm tra cú pháp JS/GAS, API chấm staging và móc hình G7.
- Test script: node thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js. Lần chạy mô phỏng cuối: PASS.
- CHƯA chạy Web App thật, CHƯA chụp screenshot sau khi triển khai; không đánh dấu UI_PASS.

## Những gì cố ý KHÔNG đưa từ repository cũ
- Không thay toàn bộ Stylesheet.html, Index.html, Tailwind, Baloo 2 hoặc Quicksand.
- Không chuyển cơ chế chấm từ data-ans ở DOM sang ứng dụng chính.
- Không sử dụng 51 câu Gemini như dữ liệu sư phạm đã xác minh.
- Không thêm nút 'đổi đề', 'làm lại', 'kiểm tra bài này' riêng từ reference repo.
- Không ghi điểm, sao, tiến độ trên GAS staging.
- Không biến blueprint 45 câu của UI20-01 thành 30 câu đã đạt: nội dung hiện tại vẫn là 30 câu (6/6/5/5/4/4), khác yêu cầu 45 (8/8/8/5/9/7).

## Kiểm tra trình duyệt cần thực hiện
1. Đồng bộ nhánh test-b20-bien-the-20261112 lên Apps Script TEST, tạo Deployment VERSION MỚI, tải lại Web App.
2. LV2-A hoặc LV2-B: mở bài lời văn; kiểm tra nền ô ly mảnh 28px/7px, dòng TÓM TẮT, BÀI GIẢI, Phép tính: và Đáp số; hình G7 vẫn tải hoặc giữ SVG nếu mạng lỗi.
3. LV1-A/B: chạm ô trống thẻ đặt tính; nhập đơn vị → tự chuyển ô nhớ → hàng chục; sau khi nhập xong chuyển qua câu kế, không lặp.
4. LV3 hiện tại còn dạng mental; thử nghiệm puzzle mẫu trong bộ test; chỉ QA trực quan LV3-A đặt tính thiếu ô sau UI20-02 nội dung/renderer bổ sung.
5. Thử nộp đúng/sai/làm lại/chuyển lượt; điểm staging được hiển thị, không ghi Sheet thưởng.
6. Kiểm tra desktop (tối thiểu 1440px), tablet và mobile (360–390px), đảm bảo các khung không tràn và font vẫn Inter.

## Rollback
- Quay về commit trước UI20-02A hoặc đồng bộ lại các tệp từ test-theo-main.
- Xóa include 43_CSS_ThanhPhanBaiToan khỏi GiaoDien.html, hoàn tác 41_HienThiCauHoiToan.html và 19_KhongGianHocToan.html về commit trước UI20-02A.
- B20_BienTheMayChu.gs không thay, các sheet điểm/sao không thay, runtime 30 câu chưa thay; không cần xóa dữ liệu học sinh.
- Tệp 43 CSS có thể để nguyên mà không được nạp; nếu không có include sẽ không ảnh hưởng app.
