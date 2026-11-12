# QUY TRÌNH CHUẨN – PHÁT TRIỂN NỘI DUNG VÀ QA DỰ ÁN LỚP 2
Phiên bản đề xuất: PROCESS-V1-DRAFT, ngày 2026-11-12.
Phạm vi: Toán, Tiếng Việt, Tiếng Anh. Bài 20 là mẫu đầu tiên CHƯA QUA NGHIỆM THU GIAO DIỆN cuối cùng.

## Nguyên tắc bất biến
- SGK là chuẩn kiến thức LV1; SBT/VBT bổ trợ LV2; tham khảo cho LV3; sách giáo viên chỉ tham khảo sư phạm, chia theo đầu bài học (không ép tuần).
- Nguồn SGK/SBT JSON trên Drive được bảo toàn ID và provenance. Không tự công nhận nguồn chưa xác minh là chính xác.
- Ưu tiên mẫu + sinh biến thể có điều kiện + kiểm tra đáp án độc lập + QA theo rủi ro. Không "dùng đại" câu tùy ý.
- GitHub quản lý phiên bản nội dung/mã; Drive giữ nguồn học liệu, snapshot và minh chứng QA; Sheets quản lý mục lục/biên soạn/học sinh/QA. Không có hai nguồn nội dung chính thức cùng sửa độc lập.
- Bài mới phải dùng renderer và bộ chấm được đăng ký, không tạo CSS riêng; test-theo-main là mốc UI hiện tại.
- Dữ liệu học sinh, sao, lượt học phải tách khỏi kho nội dung và không bao giờ đi vào GitHub công khai.
- Mỗi câu/bài có ID ổn định, template version, runtime version, seed/hash để truy vết.

## Quy trình áp dụng từng bài
1) Khóa chuẩn UI và blueprint các dạng bài (Bài 20: UI20-01 ... UI20-06).
2) Xác định lesson ID, kỹ năng, LV1/LV2/LV3, kế hoạch bài lớn/câu con, renderer từng câu.
3) Tập hợp nguồn SGK/SBT/STK cũ và kiểm tra phạm vi KIẾN THỨC, không bắt buộc kiểm chứng mọi câu trích xuất.
4) Thiết kế mẫu có ràng buộc, tạo biến thể và tính đáp án bằng solver độc lập.
5) Biên soạn JSON nguồn có schema và dữ liệu sư phạm đầy đủ; đảm bảo các trường bắt buộc theo renderer.
6) Chạy validator: cấu trúc, nội dung, nhóm, thứ tự, đầu vào renderer, đáp án, nghiệm duy nhất, Asset ID/quan hệ ảnh.
7) Chấm rủi ro R1 số học -> R4 đọc hiểu/ngôn ngữ, QA tay tương ứng; câu phức tạp không tự phê duyệt.
8) Build Runtime Pack bất biến + manifest (source revision, content hash, schema version, asset version, QA).
9) Kết nối app từ registry, chạy hồi quy giao diện/chấm/server và đối chiếu với UI baseline cả máy tính/điện thoại.
10) Ghi nhật ký test, source commit, minh chứng, trạng thái; chỉ phát hành sau WEBAPP_PASS + PEDAGOGY_PASS.
11) Giữ phiên bản rollback và học sinh cũ; không ghi sao cho staging.

## Hợp đồng giữa các tầng
SOURCE (Google Drive/SGK) -> AUTHORING (mẫu + kỹ năng + phiên bản) -> VALIDATED JSON -> RUNTIME PACK -> ADAPTER -> RENDERER -> ANSWER CHECKER -> PROGRESS/STARS.
- Adapter không được tự rút gọn lời văn, gộp câu ngược với nhẩm cơ bản, hoặc suy luận đơn vị ngoài dữ liệu đã được xác nhận.
- Renderer phải yêu cầu đúng input contract; thiếu dữ liệu -> chặn xuất bản và báo lỗi ID/field, không đoán.
- Với mỗi loại renderer phải có fixture đúng, sai, trường hợp biên và ảnh nghiệm thu.
- Chấm và UI phải có version API đồng bộ; chạy hàm không tham số để test trực tiếp trong GAS.
- CSS hash bằng nhau không chứng minh UI bằng nhau: kiểm tra DOM, số ô, nhóm và kết quả thực tế.

## Khi áp dụng đa môn
Cùng dùng Lesson/Skill/Question/Template/Session/Asset/Answer/QA/Manifest.
Mỗi môn có renderer, validator và generator riêng: Toán (số học, nghiệm, hình), Tiếng Việt (đọc, chính tả, ngữ nghĩa), Tiếng Anh (từ vựng, ngữ pháp, âm thanh).
Đừng phát hành renderer ba môn chỉ dựa trên việc Bài 20 đạt; mở rộng qua bài đại diện và nghiệm thu độc lập.

## Tài liệu bắt buộc
- Blueprint bài học: số bài lớn, số câu con, tên phần, mục tiêu, renderer, chấm.
- Nhật ký lỗi: ID, bằng chứng, nguyên nhân, bản vá, test, trạng thái.
- Báo cáo QA: phép kiểm, phiên bản phần mềm, kết quả thực tế, ảnh.
- Manifest phát hành và link rollback.

Trạng thái: TÀI LIỆU QUY TRÌNH ĐỀ XUẤT, chưa tự động tích hợp vào CI/CD hoặc GAS.
