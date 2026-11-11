# G5 + G6 V1.0 — Chuẩn hóa dữ liệu và bộ máy bài học

**Ngày:** 11/11/2026 · **Dự án:** `Nguyennth19/new-lop-2`  
**Phạm vi:** **CHỈ MỘT HỌC SINH**, ứng dụng gia đình; giữ PIN phụ huynh 4 số và hồ sơ `gia_dinh_01`.  
**Trạng thái:** Mã nguồn đã thực hiện, kiểm tra tĩnh và mô phỏng đạt; **chưa triển khai hay chạy end-to-end trên Apps Script trong đợt này**.

## I. Quyết định được người dùng xác nhận

- Không mở rộng bảo mật PIN/đa hồ sơ vào đợt này.
- Người dùng đã kiểm tra Chrome máy tính + Android và xác nhận hiển thị ổn trong G4.
- **Đưa toàn bộ tiến độ và thành tích về trạng thái khởi đầu**: Toán chỉ giữ Bài 20 **chưa học**; Tiếng Việt, Tiếng Anh để trống; không giữ quiz, chủ đề, lượt học hoặc người học demo.
- Dấu tích học và chuyên cần lấy từ máy chủ, không lấy localStorage.
- G5 thêm bộ đếm tương tác thật, nhưng chưa giả vờ đây là phép đo khả năng tập trung hay thời gian đọc lý thuyết.
- Tối ưu hình bìa và minh họa thành WebP, bảo toàn PNG master.
- Tập trung Sheet ID, timezone và profile vào cấu hình riêng.
- Tách bộ nạp bài học, renderer câu Toán và xử lý thành tích ra chức năng chuyên trách.

## II. Trạng thái khởi đầu của dữ liệu

Google Sheet: https://docs.google.com/spreadsheets/d/1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8/edit

**Đối chiếu trước reset:** ba tab `90_Lan_lam_bai`, `91_So_sao`, `92_Ghi_chu_phu_huynh` đều **chỉ có tiêu đề, không có dòng giao dịch**. Vì vậy **không cần xóa dữ liệu trên máy chủ** và không thực hiện bất kỳ thao tác phá hủy Sheet nào. 51 câu hỏi Bài 20 được giữ nguyên.

`38_KhoiTaoDuAn.html` xóa các khóa `lop2_*`, `math_*`, `toan_b20_*` trong localStorage/sessionStorage **một lần trên từng trình duyệt** khi nhận bản G5. Khóa marker `lop2_g5_reset_20261111_completed` ngăn lặp lại. **Không xóa PIN phụ huynh** trong Script Properties, không xóa ảnh, SGK hay điểm thật trên server.

**Quy tắc từ nay:** Khi có dữ liệu học thật, cập nhật phiên bản ứng dụng không được tự reset lại. Mọi dấu tích/điểm phải xác nhận theo server `layTienDoHocTap`, không từ trạng thái trình duyệt cũ.

## III. Bộ khung dữ liệu và kiến trúc G6

| Module | Một nhiệm vụ chính | Dùng lại |
|---|---|---|
| `CauHinh.gs` | 1 Spreadsheet ID + timezone `Asia/Ho_Chi_Minh` + profile `gia_dinh_01` | Toàn ứng dụng |
| `DocDuLieuSheet.gs` | Đọc dữ liệu bảng, dùng hàm kết nối chung | Nhiều môn |
| `KhoBaiHoc.gs` (mới) | Đọc các tab `01_Bai_hoc`, `02_Cap_do`, `03_Nhom_bai`, `04_Cau_hoi`, chuẩn hóa schema, 5 phút cache | Bài mới |
| `DuLieuToanSheet.gs` | Adapter `layBaiToan20`; không lặp code đọc Sheet | Toán B20 |
| `TienDoHocTap.gs` (mới) | Đọc hoàn thành LV từ `91_So_sao` và câu đúng từ `90_Lan_lam_bai` | Server source of truth |
| `ThanhTichMayChu.gs` | Chấm/nộp và phát thưởng theo ledger | Logic lõi |
| `ThanhTichBaoCao.gs` (mới) | Huy hiệu, phân tích, dashboard | Thành tích |
| `ThanhTichQuanTri.gs` (mới) | Điều chỉnh sao thủ công qua Editor | Quản trị |
| `PhuHuynhMayChu.gs` | PIN, phiên, giao dịch có xác thực, ghi chú | Phụ huynh |
| `38_KhoiTaoDuAn.html` (mới) | Dọn vết tích local/demo cũ một lần | Migration G5 |
| `39_DongBoTienDo.html` (mới) | Đồng bộ tiến độ và thẻ Trang chủ, lộ trình, sidebar | UI |
| `40_DemTuongTacHocTap.html` (mới) | Đếm thời gian theo thao tác, loại thời gian không hoạt động hoặc tab ẩn | UI |
| `41_HienThiCauHoiToan.html` (mới) | Renderer 4 kiểu câu hỏi, không lưu/chấm điểm | UI bài Toán |
| `19_KhongGianHocToan.html` | Điều hướng, trình bày, bàn phím, kiểm tra tạm, kết nối máy chủ | Toán |

**Nguyên tắc thêm bài:** dữ liệu câu hỏi đi vào Sheet theo ID; nội dung cùng dạng dùng renderer/chấm hiện có. Dạng bài hoặc môn mới yêu cầu adapter/renderer/checker tương ứng, **không tự nhận là đã hỗ trợ cả Tiếng Việt/Tiếng Anh khi chưa có dữ liệu**.

## IV. Những gì đã bỏ khỏi bản mới

- Xóa **9 bài/chủ đề lộ trình minh họa Tiếng Việt và Tiếng Anh**; hai môn hiện có mảng nội dung rỗng.
- Xóa ngân hàng quiz mẫu TV/Anh, modal “Câu hỏi thử nghiệm”, số người học giả `13.624`, `8.904`, `4.881`, số bài `92/33` giả.
- Lộ trình Toán chỉ còn `toan_b20` với các mức `new/new/new`, đồng bộ từ server nếu đã có sự kiện học thật.
- Không đọc/ghi `lop2_v19_topic_progress`, `lop2_b20_ketqua_v1`, `lop2_b20_drafts_v23`, `lop2_b20_submitted_v24`, `lop2_v22_ngay_hoc` để quyết định “đã học”.
- `16_LichHocChuyenCan.html` lấy 7 ngày học từ `layTongQuanThanhTich()`, không tạo dấu chuyên cần trên thiết bị.
- Kết quả chấm cục bộ chỉ để phản hồi bài tập tức thời. `39_DongBoTienDo` chỉ hiển thị dấu tích chính thức sau API server `layTienDoHocTap`.

## V. Bộ đếm tương tác

`40_DemTuongTacHocTap.html` tính thời gian từ khoảng cách các sự kiện nhập/phím trong bài; chỉ cộng khoảng dưới hoặc bằng 30 giây khi tab đang hiển thị và Chrome có focus, chặn 1800 giây/lượt. Reset khi đổi LV hoặc làm lại.

**Giới hạn:** Đây là **ước lượng thời gian tương tác**, không phải đo tập trung/đọc thụ động. Dữ liệu vẫn được trình duyệt chuyển đến máy chủ; giá trị học thuật thực tế chủ yếu là tính đúng/sai và số lượt nộp do server xác minh.

## VI. Ảnh WebP

Bản nguồn PNG không bị xóa. Tệp dùng cho giao diện:

- 6 vật thể: `hinh-anh/webp-g5/math_*_160.webp` → 160×160, khoảng **3,8–5,8 KB/ảnh**, thay cho PNG 156–331 KB.
- 3 bìa môn: `hinh-anh/webp-g5/{Toan,Tieng-Viet,Tieng-Anh}-2-800.webp` → 800×450, khoảng **53–66 KB/ảnh**, thay cho PNG 2,0–2,2 MB.
- `34_HinhAnhDungChung.html` dùng URL GitHub commit đã ghim cho 6 vật thể, có fallback SVG.
- `AnhMonToan.html`, `AnhMonTiengViet.html`, `AnhMonTiengAnh.html` dùng commit ghim cho 3 ảnh bìa.

**Không xóa ảnh nguồn** vì vẫn cần phục hồi và đối chiếu chất lượng.

## VII. Múi giờ

Cấu hình Apps Script dùng `Asia/Ho_Chi_Minh`; lần kiểm tra Sheet sau yêu cầu đổi timezone, API tiếp tục trả `Asia/Saigon` (alias lịch sử của cùng UTC+07:00). Không chênh lệch giờ giữa hai tên vùng, nhưng cần ưu tiên ISO UTC và `Utilities.formatDate` với `Asia/Ho_Chi_Minh`, tránh dùng múi giờ hệ thống tùy máy khi tổng hợp ngày học.

## VIII. Kiểm tra đã thực hiện

- [x] 31 mô-đun JS/GS đã kiểm tra bằng JS parser, không có lỗi cú pháp.
- [x] 35 `napThanhPhan` tương ứng file thật, không trùng; 23 thẻ script mở/đóng cân bằng (trước bước tách renderer; kiểm tra cuối sẽ cập nhật).
- [x] Google Sheet Bài 20: 51 câu, đủ 51 câu hợp lệ theo schema.
- [x] Bộ nạp mới và quy tắc client/server: **LV1 12/12, LV2 4/4, LV3 22/22** cùng ID/thứ tự.
- [x] API tiến độ rỗng trả `LV1=false, LV2=false, LV3=false`, 0 câu đúng và 0 lượt nộp.
- [x] Test 7/7 cho 4 renderer và nguồn dấu tích server: đạt.
- [x] Nguồn 6 vật thể WebP và 3 cover WebP đã upload GitHub và kiểm tra size/path.
- [ ] Chưa bấm thực trên Google Apps Script deployment mới hoặc tablet Android bản G5/G6; người dùng đã xác nhận Chrome/Android phiên bản G4 ổn định.
- [ ] Đồng bộ trạng thái server → trang học trên hai thiết bị cần nghiệm thu sau khi triển khai mới.
- [ ] Đối chiếu ảnh WebP trong Chrome Android và kiểm thử tải chậm cần nghiệm thu sau deploy.

## IX. Hướng dẫn cập nhật

```bash
git switch main
git pull origin main
```

Đồng bộ **chỉ file `.gs`, `.html`, và `appsscript.json`** vào Apps Script. Các asset `hinh-anh/` được phục vụ qua GitHub raw URL, **không upload PNG/WebP như tệp Apps Script**. Sau đó chọn `Triển khai → Quản lý các lượt triển khai → Chỉnh sửa → Phiên bản mới → Triển khai`.

**Sau khi cập nhật lần đầu:** kiểm tra Bài 20 mới tinh (chưa có tích), các tab TV/Anh trống, thành tích 0, PIN phụ huynh giữ nguyên; nộp thử LV1 và kiểm tra dấu tích server sau khi reload. Trên Chrome Android cũng hiển thị cùng trạng thái khi tải lại.

**Giữ nguyên PIN 4 số và một hồ sơ, không thêm cửa hàng đổi quà/tự động kiểm soát YouTube/game.**

## X. Rủi ro/chưa xong

- Màn hình dùng một hồ sơ gia đình; không dùng làm sản phẩm public cho nhiều người.
- Dù mã nguồn tách nhỏ hơn, `19_KhongGianHocToan.html` còn xử lý nhiều UI (bàn phím và chấm tại màn hình). Cần tách tiếp theo nhu cầu thực tế, không đại tu để tránh làm hỏng Bài 20 đã nghiệm thu.
- Hệ thống thời gian tương tác có thể thấp hơn thời gian bé đọc lý thuyết vì không có thao tác; không dùng làm căn cứ thưởng/phạt.
- Nếu người dùng đã nộp bài sau lúc kiểm tra 3 tab trống và trước khi kéo bản G5, **dữ liệu thật sẽ không bị xóa**, server vẫn coi đó là học thật; cần kiểm tra lại nếu muốn reset sau khi phát sinh.
