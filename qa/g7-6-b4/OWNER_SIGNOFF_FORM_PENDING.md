# G7.6-B.4 – OWNER SIGNOFF FORM (chưa ký duyệt)

> **Biểu mẫu để chủ dự án điền sau khi trực tiếp xem ảnh và dùng thiết bị.** Đây không phải chữ ký điện tử hay phê duyệt sẵn. `ownerApproved=false`.

## 1. Thông tin chứng cứ
- Nhánh nguồn: `test/g7-6-b4-owner-visual-policy-20261115`.
- Mã B3 kế thừa: `c3757227856f50e0e122407e0121c3e40e024728`.
- B4 CI run/head SHA: lấy từ `qa/g7-6-b4/checkpoint.g76b4.v1.json` sau đóng checkpoint.
- Chrome ảnh: tải artifact B4 hoặc ZIP lưu Drive. Ảnh chỉ chứng minh viewport và trình duyệt giả lập.
- File thử thiết bị: `G76B4_Standalone_RealDevice_Review_TEST.html`, **độc lập một file**.
- Phiếu thiết bị được người thử xuất: `G76B4_Manual_Device_Review_NOT_APPROVED.json` (kèm ảnh/video nếu có).

## 2. Chọn kết luận sau khi tự kiểm nghiệm

| Nội dung | Kiểu chứng cứ cần xem | Trạng thái hiện tại |
|---|---|---|
| Tính nhẩm 6 câu | Nhập/xóa qua bàn phím số thực, chữ/toán hạng đúng, không hiện đáp án | PENDING REAL DEVICE |
| D2 đặt tính 2 câu | Ô đơn vị/chục, nhập và di chuyển, không cắt khung | PENDING REAL DEVICE |
| D4 trắc nghiệm 2 câu | Đủ lựa chọn, chạm và bỏ chọn, không đánh dấu đáp án đúng | PENDING REAL DEVICE |
| Tangram 2 đề | Khung số 1/2/3, không mã kỹ thuật, chọn/xoay/đặt thật và reset | PENDING REAL DEVICE |
| Biểu đồ D9 2 đề | Đếm đúng biểu tượng, hơn/kém phù hợp, chạm đếm và xóa | PENDING REAL DEVICE |
| Bố cục 360/390/1440 | Hình ảnh rõ, không tràn, nút đủ lớn, không che bàn phím | PENDING OWNER |
| Voice/TTS | Đọc tiếng Việt nghe được, không lộ đáp án | NOT TESTED: B4 KHÔNG MỞ TTS |
| Renderer mental phụ trợ | Đồng ý/không đồng ý đăng ký vào TEST manifest bằng quy trình riêng | PENDING |
| E04 Tangram | Đề xuất bài SGK, trang, kỹ năng, giới hạn LV có bằng chứng | PENDING SOURCE |
| E04 biểu đồ | Đề xuất bài SGK, trang, kỹ năng, đơn vị tranh, LV có bằng chứng | PENDING SOURCE |

**Dữ liệu phải bổ sung khi phê duyệt:** thiết bị (model/OS/browser), ngày giờ, bản code commit, file JSON kết quả, ảnh/video có thể đối chiếu, ghi nhận lỗi, quyết định của chủ dự án (PASS / PASS WITH CONDITIONS / FAIL) và chữ ký hoặc xác nhận cụ thể.

## 3. Các quyết định không thể suy ra từ CI
- Đăng ký `MATH_MENTAL_NUMBER_INPUT_V1` ở trạng thái renderer phụ trợ được **kiến nghị**, không được tự đưa vào resource manifest hiện hành.
- E04 đang dùng lab `toan_b999`; **không** tự nối sang B21 hoặc giả định có nguồn bài–trang SGK. LV3 chưa hỗ trợ bởi generator hiện tại.
- Nếu chủ dự án muốn duyệt màu/nút/nhãn không có nghĩa là đã duyệt curriculum E04 hoặc route grading.
- Không có đường chấm điểm, sao, học sinh hay trusted D10; toàn bộ dữ liệu là TEST.

## 4. Đề xuất bước sau khi nhận bằng chứng
Sau khi chủ dự án xác nhận riêng 3 nhóm: (1) hình/UX, (2) thiết bị vật lý, (3) renderer/pedagogy, thực hiện một cổng **B4.1 SIGNOFF RECORDING**: ghi người duyệt, quyết định và evidence ref trong file mới (không ghi đè các checkpoint đã PASS), chạy CI bảo vệ. Chỉ khi cổng đó PASS mới lên kế hoạch xem xét nền `test-theo-main` (vẫn không merge/deploy nếu chưa được chấp thuận).
