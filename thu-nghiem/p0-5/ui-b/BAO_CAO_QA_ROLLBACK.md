# P0.5-UI-B + Căn chỉnh phép tính — QA, nghiệm thu và rollback
Ngày 13/11/2026 | Nhánh tách biệt: `test/p0-5-ui-b-equations-20261113` từ nhánh UI-A đã nghiệm thu trực quan.

## Các lỗi được người dùng ghi nhận
- Kết quả xuất hiện phía trên nút Nộp & chấm bài, còn nút nằm trong thẻ Đáp án — luồng đọc phản hồi không tự nhiên.
- Dãy tính nhẩm, số cộng ba số, nhớ, tìm số thiếu bị dồn một phía, `49+24 + 11 =` và các cụm chữ/số không cân khoảng cách; ô đáp án cách xa nhóm toán ở một số kích cỡ viewport. Có ảnh thực tế từ người dùng trên điện thoại và ảnh cắt của bài Toán; lỗi cũng tồn tại desktop.
- UI-A đã được nghiệm thu layout mobile; giữ nguyên nhánh UI-A để rollback.

## Đã sửa
1. `19_KhongGianHocToan.html`: khu vực panel đổi thứ tự DOM thành **Nộp bài (Làm lại + Nộp & chấm bài) → Kết quả → Đáp án** ở desktop và mobile. Vẫn dùng đúng `data-ml-submit`, `data-ml-reset-level`, `mlRewardSync`, `submissions`, `gradingState`, không thay grading API. Trên viewport tối đa 840px, sau khi chấm thành công tự cuộn đến thẻ Kết quả. Khi chưa nộp, kết quả vẫn —, không tạo điểm ảo.
2. Cũng trong `19_KhongGianHocToan.html`, thêm wrapper hiển thị `mental(q)` gọi renderer gốc rồi thêm khoảng trắng có chủ đích giữa số và dấu trong *chính nhãn hiển thị* cho dạng `three` và `carry`. Renderer nguồn `41_HienThiCauHoiToan.html` byte-identical, không thay câu/đáp án.
3. `47_CSS_B20_UIB_CanChinh.html`: override chỉ scoped `#mathFullScreen`, áp dụng cho mọi viewport, dùng flex center, gap responsive và ô nhập có độ rộng ổn định, tránh lưới 5 cột ép số vào bên trái/ô nhập ra xa; duy trì màu sắc.
4. `GiaoDien.html`: nạp module `47_CSS_B20_UIB_CanChinh` sau UI-A.
5. `thu-nghiem/p0-5/ui-a/kiem-thu-layout.cjs`: thay một ASSERT byte hash `19` quá cứng bằng kiểm tra bảo toàn đường gọi chấm/điều hướng; tất cả kiểm tra UI-A khác giữ nguyên.
6. `thu-nghiem/p0-5/ui-b/kiem-thu-ui-b.cjs`: 13 kiểm thử riêng, gồm DOM thứ tự/thao tác, điểm trống và sau chấm, format số ba số/nhớ, CSS scope, hợp đồng không ghi.
7. `.github/workflows/p0-5-ui-b-equations.yml`: CI TEST-only, kế thừa đầy đủ P0.4 + UI-A + B20.

## Kết quả CI đã chạy
- Run FAIL lần đầu: https://github.com/Nguyennth19/new-lop-2/actions/runs/43368234776. Hai ca mock không có `level` nên filter trả 0 câu; đây là lỗi fixture test, không phải bằng chứng sai grader. Đã sửa fixture đúng schema B20.
- Run PASS: https://github.com/Nguyennth19/new-lop-2/actions/runs/43368316705.
- **UI-B 13/13 PASS, UI-A 12/12 PASS, FULL_SAFE 46/46 PASS, 30-question B20 offline renderer/grader PASS, worktree sạch**.
- Không thay đổi `41_HienThiCauHoiToan.html`, `B20_BienTheMayChu.gs`, `20_CSS_KhongGianHocToan.html`, `29_CSS_BangKetQua_V26.html`, `thu-nghiem/bai-20-bien-the/runtime.json`.

## Kiểm thử thực tế bắt buộc trước khi chốt UI-B
- Pull nhánh `test/p0-5-ui-b-equations-20261113` vào đúng Apps Script TEST trên bảng `LOP2_P05_QA_ISOLATED_20261113`; kiểm tra file gốc `47_CSS_B20_UIB_CanChinh.html`, `19_KhongGianHocToan.html`, `GiaoDien.html`.
- Update chính deployment TEST: `Deploy → Manage deployments → Edit → New version → Deploy`; không chạm PROD.
- Desktop (Chrome) và mobile (Android): trên LV1-A, LV2-A/B, LV3-A/B xác nhận phép cộng 2 số, 3 số, nhớ và ô số thiếu được căn giữa, dấu/số không dính, ô nhập liền nhóm toán, không tràn hoặc gãy bố cục. Đặc biệt ảnh mẫu: `9 + 2 = 11 → nhớ = [ô]`, `49 + 24 + 11 = [ô]`, và câu `[ô] + 25 = 53`.
- Cột phản hồi **Nộp bài → Kết quả → Đáp án** trên desktop; mobile cùng thứ tự và sau khi chấm tự cuộn đến Kết quả. Kiểm tra tình huống chưa nộp, làm đúng/sai/bỏ trống, nút Làm lại, bàn phím.
- Sau test, đối chiếu bảng QA tab 90/91 chỉ có hàng tiêu đề; lưu ảnh màn hình và log được làm sạch thông tin cá nhân.

## Trạng thái / rollback
**UI_B_OFFLINE_CI_PASS**, **UI_B_BROWSER_VISUAL_PENDING**, `RELEASE_READY=false`. Không hợp nhất nhánh MAIN, không thay `test-theo-main` hoặc sản phẩm đang sử dụng. Nếu FAIL, redeploy TEST về version UI-A và pull lại `test/p0-5-ui-a-mobile-20261113`. Chưa mở cổng PEDAGOGY.
