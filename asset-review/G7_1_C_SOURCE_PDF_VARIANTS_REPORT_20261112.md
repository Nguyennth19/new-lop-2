# G7.1-C — Kiểm tra 85 khoảng trống theo hướng biến thể và ghép hình
**Ngày:** 12/11/2026 · **Phạm vi:** 47 MATH + 38 SHARED · **Trạng thái:** VARIANT_FIRST_TRIAGE_COMPLETE / EXERCISE_EXACT_SOURCE_QA_PENDING

## Quy tắc được chủ dự án xác nhận
Một hình minh họa có thể đại diện cho nhóm (ví dụ một con gà thay cho đàn gà) **nếu câu hỏi không suy ra dữ kiện từ hình**. Khi số lượng, nhóm, đơn vị, hình khối, trật tự hoặc màu sắc ảnh hưởng đáp án, renderer phải tạo đúng cấu trúc từ các hình cơ sở. Một ảnh đơn lẻ là vật liệu có thể lặp, xếp hàng/cột, ghép khung, chồng lớp hoặc gắn nhãn đúng đề. SGK/VBT là nguồn xây **mục tiêu/dạng bài**, không yêu cầu biến thể trông đúng từng chi tiết artwork gốc. Không được sửa sai ngữ nghĩa Toán vì mục tiêu đa dạng hóa.

**Ví dụ đã khóa:** hai chuồng, mỗi chuồng ba con gà ⇒ renderer bố trí 3+3=6 cá thể gà `KL_SH05_004`; không dùng một gà nếu yêu cầu học sinh đếm. "Một cuốn sách" dùng `KL_SH03_006` một lần; "năm cuốn" có thể lặp 5 lần và xếp chồng. Không cần vẽ 1 file PNG cho mỗi số lượng.

## Kiểm tra nguồn sách trực tiếp
Đã tải PDF gốc từ Google Drive và **xem 48 trang mẫu** ở bốn tài liệu (16 SGK1 + 16 VBT1 + 8 SGK2 + 8 VBT2), bằng cách render từng trang hình; còn 12 trang khảo sát SGK1 phục vụ định vị bài. Đây là **kiểm tra trực quan nguồn thật ở phạm vi trang mẫu theo chủ đề**, không phải sign-off hình của từng bài/tiểu mục.
- SGK Toán 2 tập 1: https://drive.google.com/file/d/1Zfiw7VMZ_34cW1ZfaY3iuoRJLmaEuvfr/view
- VBT Toán 2 tập 1: https://drive.google.com/file/d/1YIWc2IJtyQQ-e5w6-Zrzwwik7-EEyqoW/view
- SGK Toán 2 tập 2: https://drive.google.com/file/d/1T8RaavitX03_f0VvxjO1zOiXjnMBhrrs/view
- VBT Toán 2 tập 2: https://drive.google.com/file/d/15XyTPJBRMHXGikjGyZ_o4vWzQWTOtVCU/view

**Chứng cứ minh họa kiểm tra qua hình trang thật (số trang là số trang PDF, 1-based):**
| Nhóm | Trang đã trực tiếp xem | Nhận định |
|---|---|---|
| M01 đếm/đồ vật | SGK1 PDF trang 8, 10; VBT1 PDF trang 8, 10 | Hình, nhóm phần tử và ô có thể ghép từ một icon + renderer theo số lượng |
| M02 chục/trăm/giá trị hàng | SGK1 PDF trang 8, 14, 15; VBT1 PDF trang 8 | Thanh 10, bảng giá trị hàng, lưới 10×10 là dữ kiện Toán → dựng theo mô hình số |
| M03 nhóm, phép nhân/chia | SGK2 PDF trang 8, 11, 14; VBT2 PDF trang 8, 11, 14, 21 | Số nhóm và số vật mỗi nhóm phải đúng; lặp icon rồi sắp bố cục |
| M04 ki-lô-gam/cân | SGK1 PDF trang 58–62; VBT1 PDF trang 57–60 | Có hình cân đĩa, cân hiển thị, túi đồ vật; số đo/kim cân bắt buộc chính xác nếu là dữ kiện |
| M05 lít/dung tích | SGK1 PDF trang 63–66; VBT1 PDF trang 61–66 | Có bình, xô, ca và nhãn lít; tạo vạch, số và mức nước ở renderer, không tự gán dung tích theo hình |

Bản gốc là scan image-only hoặc không có text trả về khi fetch; đã dùng hiển thị trang PDF thực. KHÔNG coi workbook trung gian hoặc SEO text nguồn thứ cấp là phê duyệt 1:1.

## Kết quả bảng 85
- **85/85 có đề xuất phương thức dựng**, theo từng `asset_id`, gồm 47 MATH và 38 SHARED.
- **47 MATH** đã định tuyến đến các phương thức `COMPOSE`, `RENDER_GRID/TABLE`, `OVERLAY_LABEL`, `REUSE_OBJECT` và các ràng buộc số lượng/màu/đơn vị. Có chỉ dẫn asset đã tồn tại; xác minh 100% Asset ID ứng viên được liệt kê tồn tại trong manifest 288.
- **38 SHARED**: cho phép minh họa linh hoạt khi nội dung không phụ thuộc đúng loại đồ vật; nếu bài đang kiểm tra nhận diện loài/đồ vật, không được tráo loại vì thiếu hình. Cần liên kết với từng nội dung bài được chọn trước khi khẳng định một ảnh mới là bắt buộc.
- **0/85 trường hợp đủ bằng chứng để ra lệnh tạo file hình mới** ở thời điểm kiểm tra. Đây là **0 trường hợp đã chứng minh cần vẽ** chứ không có nghĩa đã chứng minh `0 cần vẽ`.
- Các mã `source_evidence_resolution` đều là `VISUAL_THEME_PAGES_REVIEWED_NOT_EXACT_EXERCISE` hoặc `ILLUSTRATIVE_CONTEXT_EXAMPLES_ONLY`; không tự gọi `EXACT_SOURCE_QA_PASS` cho tất cả 85.

## Trường hợp nhạy cảm cần chống sai đáp án
1. 1 vật ≠ nhiều vật khi hình dùng để đếm.
2. Thanh 10 ô, tấm 100 ô, bảng giá trị hàng phải có đúng cấu trúc, không dùng ảnh tương tự chỉ vì cùng màu.
3. Quả cân không nhãn không có nghĩa là 1 kg/2 kg/5 kg. Khi yêu cầu số kg, text hiển thị phải lấy từ đề sinh biến thể.
4. Bình, chai, ca không tự xác định được 1 l/2 l; nhãn lít, vạch và mức nước phải từ dữ liệu bài.
5. Ảnh đồ trang trí có thể ngẫu nhiên theo nhóm; ảnh chứa dữ kiện hoặc nguồn khóa phải được lọc/ràng buộc hoặc cố định.

## QA kiểm định tĩnh
- Bảng 85: `85/85` Asset ID duy nhất.
- 47 mục Toán được ánh xạ phương pháp cụ thể, 38 mục dùng chung có quy tắc fallback minh họa.
- Các Asset ID tham chiếu trong bảng 85: **không có ID không tồn tại** đối chiếu CSV QA 288.
- 15 tình huống test định nghĩa trong JSON với 18 Asset ID tham chiếu thực tế: **18/18 tồn tại**.
- Chưa thực thi engine runtime, chưa QA bằng browser triển khai, chưa duyệt từng trang bài toán và chưa kiểm định số đo từ tất cả trang nguồn.

## Hồ sơ
- `G7_1_C_85_VARIANT_FIRST_ASSESSMENT_20261112.csv` — bảng 85 dòng, tình huống/method/ID nguồn/trang sách tham khảo và status.
- `G7_1_C_COMPOSITION_AND_VARIANT_QA_CASES.json` — quy tắc trang trí/dữ kiện, 15 trường hợp kiểm thử.
- Bảng 100 và 6 cặp từ G7.1-B giữ nguyên lịch sử; không ghi đè master.

**Bước còn mở:** xác định bộ bài/biến thể nào sẽ dùng từng biểu tượng, kiểm tra thêm trang nguồn tương ứng nếu bài đếm/đo/đọc hình thực tế có ràng buộc. Chỉ tạo asset bổ sung khi UI ghép/hình sẵn không thể diễn đạt đúng mục tiêu bài đã chọn. Không merge, không sửa Apps Script, không phát hành ảnh.
