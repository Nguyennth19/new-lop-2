# P0.5-H — Phiếu nghiệm thu sư phạm Bài 20 (CHƯA KÝ)
Bài: `toan_b20` — Phép cộng có nhớ số hai chữ số với số hai chữ số. Nguồn dữ liệu kiểm tra: `thu-nghiem/bai-20-bien-the/runtime.json`, 30 câu, 6 lượt (LV1-A 6; LV1-B 6; LV2-A 5; LV2-B 5; LV3-A 4; LV3-B 4). Đây là **biến thể dự án**, không phải tuyên bố sao chép nguyên bài SGK/SBT.

## Các tiêu chí duyệt nội dung (người được ủy quyền ký)
- [ ] Phạm vi kiến thức: các phép cộng có nhớ, số và đơn vị phù hợp chương trình Toán lớp 2; không có câu vượt cấp.
- [ ] Độ chính xác 30 câu: đáp án, nhớ một chục, thứ tự các bước, cách trình bày đặt tính, tính nhẩm, cộng ba số, tìm số thiếu và bài toán lời văn; kiểm thêm câu cố ý sai/chưa điền.
- [ ] Mức độ LV1/LV2/LV3 và hai lượt A/B: khối lượng và cách tăng độ khó hợp lý, tránh câu gây hiểu nhầm; không cần mỗi hình giống hệt sách giáo khoa.
- [ ] Sư phạm lời văn: câu hỏi rõ nghĩa, tóm tắt/đơn vị phù hợp, không mơ hồ giữa số đồ vật và đơn vị của đáp số.
- [ ] Ảnh minh họa: có thể ghép/tái sử dụng asset đơn nếu vẫn đúng nội dung toán; hình thất bại phải có fallback và không làm thay đổi phép tính.
- [ ] Trải nghiệm học sinh lớp 2: ô nhập, màu đúng/sai, nút nộp và kết quả dễ hiểu trên desktop/mobile; không tự cộng sao/ghi điểm trong gói staging.
- [ ] Kiểm ngẫu nhiên độc lập ít nhất một trường hợp cho mỗi dạng câu và kiểm đủ 6 lượt với bằng chứng.
- [ ] Ghi rõ các lỗi còn tồn tại, quyết định chỉnh sửa hoặc từ chối nghiệm thu.

**Người duyệt:** CHƯA XÁC ĐỊNH

**Ngày duyệt:** CHƯA CÓ

**Bằng chứng ký/biên bản:** CHƯA CÓ

**Kết luận:** `PEDAGOGY_UNSIGNED` — tuyệt đối không cập nhật `signedOff:true` hoặc xóa trạng thái `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF` khi chưa có người duyệt xác nhận. Kết quả CI/ứng dụng hoạt động tốt không thể thay thế nghiệm thu này.

## Ghi chú về cổng hiện hành
Release Gate đang kiểm tra chính xác sáu dòng kết quả `correct==total` do Web App TEST. Vì người dùng đã thử cả tình huống sai/bỏ trống, log của các lượt đó không thể giả thành tổng đúng 30/30. Cần một trong hai: (a) đợt nghiệm thu chuẩn với đủ 6 lượt toàn đúng, hoặc (b) một thay đổi contract được review để nhận cả hai ma trận đúng/sai, kèm kết quả thực — không lách gate.

## Rollback
Giữ nguyên nhánh UI-B đã được nghiệm thu, không thay file dữ liệu hoặc chấm bài; mọi sửa nội dung về sau phải tách TEST và đối chiếu lại toàn bộ 30 câu. Không merge MAIN khi chưa có chữ ký.
