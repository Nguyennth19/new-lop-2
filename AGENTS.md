# AGENTS.md — Quy trình mặc định cho AI khi làm việc với dự án Lớp 2

Phạm vi: toàn bộ repository `Nguyennth19/new-lop-2`. Đây là quy tắc làm việc cho tác nhân lập trình; **không phải phê duyệt phát hành**.

## Nguồn quy chuẩn
- [Bản gốc tiếng Việt](tai-lieu/quy-chuan-ai/universal_ai_coding_guidelines-vn-version.md)
- [Bản gốc tiếng Anh](tai-lieu/quy-chuan-ai/universal_ai_coding_guidelines-eng-version.md)
- [Hướng dẫn áp dụng trong ChatGPT Project](tai-lieu/quy-chuan-ai/PROJECT_INSTRUCTIONS_CHATGPT.md)

Bốn nguyên tắc bắt buộc: **Think Before Coding, Simplicity First (YAGNI), Surgical Changes, Goal-Driven Execution**. Việc kiểm soát mức độ áp dụng tùy độ phức tạp: thay đổi nhỏ và rõ ràng thì thực hiện trực tiếp; thay đổi kiến trúc, dữ liệu, bảo mật, sư phạm và logic cốt lõi phải kiểm chứng kỹ.

## Thứ tự ưu tiên
1. An toàn, bảo mật, bảo vệ dữ liệu học sinh và các cổng phê duyệt đã được ghi nhận.
2. Hợp đồng dữ liệu, quy định sư phạm, manifest/QA đã phê duyệt, ranh giới TEST–MAIN và yêu cầu cụ thể của chủ dự án (không tự hiểu rằng yêu cầu chung cho phép vượt cổng đặc thù).
3. Quy chuẩn chung trong hai file nguồn và quy trình tại đây.
4. Sở thích kỹ thuật/đề xuất mới của tác nhân AI.

Nếu nguồn mâu thuẫn, báo rõ phạm vi xung đột; chọn thay đổi **nhỏ nhất, có thể đảo ngược, không phát hành**. Không giả vờ đã có bằng chứng hoặc quyền phê duyệt.

## Quy trình mặc định cho mỗi tác vụ
1. **Ground / checkpoint:** Xác minh nhánh, HEAD SHA, các file liên quan, trạng thái cổng/CI, phạm vi đã nghiệm thu và nguồn dữ liệu thật. Không suy diễn rằng nội dung một nhánh khác đã có trong nhánh đang sửa.
2. **Scope / tiêu chí:** Nêu input, output, giả định quan trọng, cách xử lý mơ hồ, tiêu chí PASS/FAIL, ràng buộc bất biến, rủi ro và phương án rollback. Với tác vụ nhỏ, có thể rút gọn phần trình bày nhưng không bỏ kiểm tra.
3. **Reuse trước khi tạo mới:** Tìm renderer, resolver, bộ đọc, cấu trúc dữ liệu, hình ảnh và test đã tồn tại. Không tự tạo abstraction, config, phụ thuộc hoặc tính năng phòng hờ.
4. **Sửa chính xác:** Chỉ thay đổi file/dòng liên quan, giữ quy ước tên/style, không refactor lan man; dọn chỉ phần code thừa do chính thay đổi tạo ra. Không đưa file `.gs`/`.html` của Apps Script vào tiền tố `apps-script/`: ứng dụng nằm ở repository root.
5. **Kiểm chứng phù hợp:** Chạy các test hợp đồng/logic, bảo mật, dữ liệu, CI, regression giao diện/trình duyệt nếu tác động; kiểm tra trước/sau và ghi nhận kết quả THẬT. Bằng chứng đã được đóng băng không cần tái QA khi không đổi byte/hợp đồng; kiểm thử riêng đường tích hợp mới.
6. **Truy vết:** Ghi phạm vi diff, SHA/nhánh/commit, câu lệnh test, số lượng PASS/FAIL, link CI (nếu có), hạn chế, cổng còn chặn và SHA rollback. Khi công việc dài, cập nhật checkpoint/nhật ký ở mỗi mốc hoàn thành có ý nghĩa để phiên mới tiếp tục được.
7. **Bàn giao có phân cấp:** Phân biệt rõ `SOURCE_READY`, `TEST_PASS`, `GAS_TEST_VERIFIED`, `OWNER_APPROVED`, `RELEASE_APPROVED`. Không đánh đồng việc code load được, QA PASS hoặc có nhánh mới với GO đưa vào MAIN/sử dụng cho học sinh.

## Các quy tắc riêng của Lớp 2
- Nguồn học liệu: SGK làm cơ sở LV1; VBT/Luyện tập LV2; tài liệu tham khảo LV3; sách giáo viên **chỉ tham khảo sư phạm**. Kiểm tra bài–trang–`lessonId`–`skillId`; không tự gán dạng bài vào bài học vì chỉ trùng từ khóa.
- Luồng bài tập qua điều phối cần hợp đồng có chứng cứ `lessonId`, `skillId`, loại/dạng bài, `visualIntent`, `assetId` **hoặc** mapping ngữ nghĩa tin cậy và `publicVariant`. Dữ liệu chưa đủ thì dùng fallback đã có, không tự tạo liên kết SGK hoặc tự đoán đáp án.
- Tái sử dụng 12 route renderer D1–D10 (kể cả D8A/D8B), 288 WebP được pin, 46 Fluent SVG và nguồn tham chiếu/manifest hiện hành khi đúng phạm vi. Một hình minh họa **không mặc nhiên** là đơn vị đếm; dựng đúng số lượng phải có ngữ nghĩa đơn vị đếm và bằng chứng exact-count phù hợp.
- Bảo vệ tách biệt public/private payload; không đưa đáp án bí mật ra client; Dạng 10 chấm trên trusted server. Giữ các cổng riêng cho Tangram D5 / biểu đồ D9 (SGK/E04), chính sách phạm vi D2/1000 và các cổng sư phạm chưa duyệt.
- Không tự đổi tên Asset ID/lesson ID, không âm thầm sửa manifest/chứng cứ QA lịch sử, không chạm điểm, sao, bảng dữ liệu thật của học sinh.
- `be-hoc` là nhánh làm việc tích hợp đang được sử dụng tại thời điểm tạo tài liệu này. Trước mỗi tác vụ **đọc lại nhánh/HEAD và trạng thái mới**, không cố định checkpoint lịch sử như sự thật hiện tại.
- Thay đổi TEST/nhánh làm việc không đồng nghĩa quyền merge `main`/`test-theo-main`, triển khai GAS TEST, xuất bản hoặc phát hành. Khi còn cổng chặn, trạng thái mặc định là **NO-GO phát hành**.

## Mẫu kết thúc công việc
`Mục tiêu → Nguồn & checkpoint → File thay đổi → Kiểm thử và bằng chứng → Trạng thái cổng → Rủi ro/còn chặn → Rollback → Bước kế tiếp`.

Giữ báo cáo ngắn gọn nhưng không lược bỏ dữ kiện kiểm chứng. Nếu chưa thể chạy test hoặc chưa kết nối nguồn, ghi rõ **CHƯA XÁC MINH**, không ghi PASS.
