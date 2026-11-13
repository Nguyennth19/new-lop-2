# P0.5-H.1 — Biên bản chuẩn hóa nội dung sư phạm và phiếu trình duyệt
Ngày: 13/11/2026 | Bài `toan_b20` | Trạng thái: **CANDIDATE_TEXT_QA_PASS / OWNER_SIGNOFF_PENDING**
Nhánh: `test/p0-5-h1-pedagogy-copy-20261113` xuất phát từ `test/p0-5-h-pedagogy-20261113`.

## A. Phạm vi thay đổi và bất biến
- Chỉ sửa **7 ID** `004,007,010,022,024,026,030`: mỗi câu hai trường `prompt` và `solution_prompt`, tổng 14 trường.
- Giữ nguyên 30 `question_id`, sáu `session_id`, `type`, `skill_id`, `parameters` gồm a/b/c, `answer`, `unit`, thứ tự, đáp án và nguồn biến thể. Các câu còn lại không thay.
- `runtime.json` chỉ thay các dòng liên quan 7 câu và không thay `release_status=STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF`.
- `B20_BienTheMayChu.gs` chỉ đổi URL nguồn JSON **khóa theo commit** `1e9c700f1fd85427b30e9f1f42c8c49669011e33` và cache key `b20_pilot_20261113_h1_pedagogy_copy_v1` để bảo đảm bản TEST đọc đúng nội dung mới. Mã chấm/đọc/ghi còn lại không sửa; kiểm tra byte-identical sau khôi phục hai cấu hình này qua git blob hash `2cac0c171aa5c60a01bf5d918f4e2f4b53a1c16c`.
- **Không merge MAIN, test-theo-main, không thay dữ liệu học sinh, điểm, sao, CSS, HTML renderer hoặc Apps Script TEST deployment đang phục vụ.** Việc đổi nguồn trên nhánh không tự cập nhật Web App /exec.

## B. Ma trận trước → sau (7 câu)
| ID | Lượt | Câu dẫn trước | Câu dẫn mới | Hướng dẫn lời giải mới |
|---|---|---|---|---|
| `004` | LV1-A | Tính nhẩm: 15 + 78 = ? | Tính: 15 + 78 = ? | Đơn vị: 5 + 8 = 13, viết 3 nhớ 1 chục. Chục: 1 + 7 + 1 = 9. Vậy 15 + 78 = 93. |
| `007` | LV1-B | Tính nhẩm: 47 + 34 = ? | Tính: 47 + 34 = ? | Đơn vị: 7 + 4 = 11, viết 1 nhớ 1 chục. Chục: 4 + 3 + 1 = 8. Vậy 47 + 34 = 81. |
| `010` | LV1-B | Tính nhẩm: 57 + 36 = ? | Tính: 57 + 36 = ? | Đơn vị: 7 + 6 = 13, viết 3 nhớ 1 chục. Chục: 5 + 3 + 1 = 9. Vậy 57 + 36 = 93. |
| `022` | LV2-B | Tính bằng cách thuận tiện: 57 + 14 + 15 = ? | Tính: 57 + 14 + 15 = ? | Tính lần lượt: 57 + 14 = 71; 71 + 15 = 86. Vậy 57 + 14 + 15 = 86. |
| `024` | LV3-A | Tính bằng cách thuận tiện: 28 + 39 + 16 = ? | Tính: 28 + 39 + 16 = ? | Tính lần lượt: 28 + 39 = 67; 67 + 16 = 83. Vậy 28 + 39 + 16 = 83. |
| `026` | LV3-A | Tính bằng cách thuận tiện: 14 + 67 + 10 = ? | Tính: 14 + 67 + 10 = ? | Tính lần lượt: 14 + 67 = 81; 81 + 10 = 91. Vậy 14 + 67 + 10 = 91. |
| `030` | LV3-B | Tính bằng cách thuận tiện: 26 + 49 + 16 = ? | Tính: 26 + 49 + 16 = ? | Tính lần lượt: 26 + 49 = 75; 75 + 16 = 91. Vậy 26 + 49 + 16 = 91. |

**Lý do:** 3 câu LV1 thay lệnh “Tính nhẩm” bằng “Tính” và mô tả cộng hàng đơn vị → nhớ chục → cộng hàng chục; 4 câu phép cộng ba số thay lệnh “Tính bằng cách thuận tiện” khi không có cặp số tròn chục rõ ràng bằng “Tính” và lời giải cộng lần lượt. Các câu có cặp số thuận tiện thực sự (`017`, `028`) giữ nguyên.

## C. Chốt kỹ thuật
- CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/43373249484 **SUCCESS** (đã kiểm tra log từng bước).
- H1 frozen-content tests: **8/8 PASS** (30 ID, toàn bộ tham số/đáp án/level được khóa).
- Tính độc lập: **30/30 PASS**; 6 lượt đúng cấu trúc; 0 lỗi kỹ thuật; 0 cảnh báo trong **7 quy tắc đã xử lý**; `PRELIMINARY_AUDIT_PASS` không đồng nghĩa sư phạm chính thức PASS.
- Regression B20: PASS (30 câu render, chấm đúng/sai).
- FULL_SAFE: PASS 46/46 (4 suites); UI-A: 12/12 PASS; UI-B: 13/13 PASS.
- Release Gate: vẫn **RELEASE_BLOCKED**, do `PEDAGOGY_UNSIGNED` và các bằng chứng Web App/six-session/visual còn thiếu trong strict JSON contract.
- Trạng thái dữ liệu: `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF` vẫn giữ.

## D. Điểm cần chuyên gia xem và giới hạn
1. Câu `004,007,010`: tính nhớ đúng; hướng dẫn “Đơn vị/Chục” cần đối chiếu văn phong sách và cách người học hiểu chữ “viết ... nhớ 1 chục”; xem có cần biểu diễn trực quan ở LV1.
2. Câu `022,024,026,030`: gợi ý tính lần lượt đúng đáp án; người duyệt có thể chọn cách nhóm khác phù hợp hơn, nhưng phải kiểm tra 30/30 nếu sửa.
3. Hai câu ba số `017` và `028` chưa thêm lời giải phân tích cách nhóm tròn chục trong H.1 vì ngoài phạm vi 7 ID; có thể làm vòng bổ sung sau nếu cần.
4. **Giới hạn UI quan trọng:** `solution_prompt` có trong Runtime JSON và trong API trả về `results[id].explanation`, nhưng `19_KhongGianHocToan.html` hiện chỉ hiển thị điểm và ký hiệu đúng/sai, chưa trình bày lời giải cho học sinh. Vì yêu cầu H.1 là chỉnh nội dung, không đổi giao diện, điều này chưa thay đổi; cần nghiệm thu riêng trước khi tuyên bố học sinh nhìn thấy hướng dẫn.
5. URL runtime phải được đối chiếu trên bản TEST riêng sau pull và redeploy nếu người vận hành muốn kiểm chứng trực tiếp. Chưa có GAS log H.1 runtime; không công bố `WEBAPP_PASS`.

## E. Phiếu xét duyệt sư phạm (chưa ký)
**Người duyệt:** ______________________

**Vai trò/chức trách:** ______________________

**Ngày duyệt:** ______________________

**Phương án:** `ACCEPT_AS_IS` / `ACCEPT_WITH_NOTES` / `REVISE_AND_RETEST` / `REJECT`

**Quyết định đối với 7 ID:** ______________________

**Ghi chú về hai câu 017,028 và việc hiển thị hướng dẫn:** ______________________

**Bằng chứng duyệt/đường dẫn tài liệu:** ______________________

Chỉ sau khi người có thẩm quyền xác nhận bằng chứng, mới được đưa phiếu từ `OWNER_SIGNOFF_PENDING` sang trạng thái ký. Không sửa trực tiếp `signedOff` trong Release Gate khi chưa có quyết định.

## F. Rollback và bước tiếp
- Nếu nội dung mới không phù hợp: quay lại nhánh `test/p0-5-h-pedagogy-20261113`, khôi phục nguồn JSON commit cũ và cache key cũ **trên TEST**, không cần thay dữ liệu học sinh.
- Nếu duyệt có điều kiện, lập nhánh sửa tường minh các ID, chạy lại B20 + H1 frozen + FULL_SAFE; trình ký lại.
- Bước tiếp vận hành: gửi phiếu cho giáo viên/người phụ trách duyệt 7 câu; nếu muốn nghiệm thu qua Web App, pull nhánh H.1 vào **Apps Script TEST** gắn bảng QA và deploy new TEST version, kiểm tra JSON nguồn; tránh coi pull là đã cập nhật deployment.
