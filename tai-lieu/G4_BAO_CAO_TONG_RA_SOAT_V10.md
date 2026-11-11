# G4 – Tổng rà soát, kiểm thử hồi quy và sửa lỗi Lớp 2 V1.0

**Ngày kiểm tra:** 11/11/2026  
**Nguồn:** nhánh `main` của `Nguyennth19/new-lop-2` và Google Sheet dữ liệu Toán Bài 20 `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8`.  
**Nhánh sửa lỗi:** `audit/g4-kiem-tra-on-dinh-v1`.

**Phạm vi nghiệm thu:** kiểm toán mã tĩnh, kiểm tra nguồn dữ liệu thật, mô phỏng đơn vị và sửa lỗi ít rủi ro. **KHÔNG đồng nghĩa đã kiểm thử trình duyệt hoặc deployment Apps Script đang chạy.**

## A. Tổng quan hiện trạng

| Hạng mục | Kết quả xác minh |
|---|---|
| Mã nguồn Apps Script + JavaScript | **23/23** tệp cú pháp hợp lệ trong V8/JS parser |
| `GiaoDien.html` | 20 thẻ script mở và 20 thẻ đóng; 32 partial có tệp tương ứng; 0 include trùng |
| Google Sheet | 9 tab gồm 6 tab chương trình và 3 tab Thành tích / Sao / Ghi chú |
| Dữ liệu câu hỏi Toán Bài 20 | 51 ID duy nhất: 16 đặt tính, 9 tính nhẩm, 8 lời văn, 18 tìm chữ số |
| Quy tắc chọn câu theo nhóm | 38 câu thực tế: **LV1 = 12, LV2 = 4, LV3 = 22** |
| Client/server chọn câu | **38/38 ID khớp đúng thứ tự**, không có câu khác giữa client/server |
| Phép cộng có dữ liệu n1+n2/đáp án | Không phát hiện sai số học trên dữ liệu được đọc |
| Nội dung câu hỏi trống hoặc không parse được puzzle | 0 trong số 51 câu được đối chiếu |
| `90_Lan_lam_bai`, `91_So_sao`, `92_Ghi_chu_phu_huynh` | Đã tạo bảng/cột, **chưa có dòng giao dịch** tại thời điểm đọc |
| Giao diện hình ảnh | Robot và 6 loại vật thể có mapping; nhiều hình PNG hiện còn kích thước lớn |

## B. Lỗi đã sửa trong mã

| ID | Mức độ | Lỗi xác định | Tệp sửa và hướng giải quyết | Đã test |
|---|---|---|---|---|
| G4-01 | Cao | Cache bài Toán server có TTL `21600` giây (6 giờ), trái với chú thích 2 phút; sửa Sheet có thể không cập nhật | `DuLieuToanSheet.gs`: khóa cache mới, TTL **300 giây**, vẫn giữ hàm xóa cache thủ công `lamMoiBoNhoToan20_` | Cú pháp + đối chiếu source |
| G4-02 | Trung bình | Trình duyệt giữ snapshot bài Toán qua deploy cùng phiên bản cache | `27_BoNhoBaiHoc.html`: bump `VERSION` để lần đầu cập nhật tải lại dữ liệu; sau đó TTL browser vẫn **30 phút** | Cú pháp |
| G4-03 | Trung bình | Hình ảnh lời văn không xuất hiện khi `q.svg` trống hoặc parse lỗi dù có PNG/WebP hợp lệ | `19_KhongGianHocToan.html`: gắn hình trong kho độc lập trạng thái SVG, giữ fallback khi ảnh không tải | Cú pháp + kiểm tra nhánh mã |
| G4-04 | Trung bình | Câu tìm chữ số có `null` trong `puzzle` có thể gây lỗi `v.ans` ở trình duyệt | `26_ChamCauHoiToan.html`: kiểm tra `null` trước khi truy cập | Mock test |
| G4-05 | Trung bình | Bài quiz demo Tiếng Việt/Tiếng Anh gọi `ghiNhanBatDauHoc()`, làm sai lịch chuyên cần thật | `14_BaiTapTuongTac.html`: không ghi ngày học khi mở bài demo | Cú pháp |
| G4-06 | Cao | Khi giao dịch phụ huynh chờ khóa, phiên vừa thu hồi có thể được chấp nhận theo kiểm tra trước lock | `PhuHuynhMayChu.gs`: xác minh lại token phiên trong lock ở cộng/trừ sao, ghi chú, đổi PIN | Mock test xác thực + cú pháp |

**Nguyên tắc bảo toàn:** Không thay `04_Cau_hoi`, đáp án, dữ liệu toán, ghi chú, sổ sao, dữ liệu giao dịch; không tự cộng hoặc reset sao; không sửa ảnh đã nghiệm thu.

## C. Kết quả kiểm thử G4

### C1. Kiểm tra tĩnh và đối chiếu dữ liệu
- [x] Cú pháp **23/23** JS/GS qua JS parser.
- [x] Includes **32/32** partials tìm thấy, không trùng; `<script>` **20/20**.
- [x] Không phát hiện API giọng đọc Chrome/TTS cũ còn gọi trong mô-đun JS/GS.
- [x] Không phát hiện `195 ngôi sao`, `stars +=` hoặc `activityRecords` trong mã JS/GS được rà soát.
- [x] Dữ liệu Sheet: 51 câu, 8 nhóm, không trùng ID; 38 câu được chọn đồng nhất client/server.

### C2. Test mô phỏng nghiệp vụ – **16/16 đạt**
- [x] Khởi tạo PIN xóa `PH_PIN_BOOTSTRAP` tạm.
- [x] 5 lần sai PIN kích hoạt khóa, PIN đúng cũng bị từ chối trong trạng thái khóa.
- [x] Đăng nhập PIN đúng trả token phiên.
- [x] Thưởng +50 vào ví.
- [x] Gửi lại cùng `requestId` chỉ một giao dịch.
- [x] Trừ -20, ví còn 30.
- [x] Chặn trừ vượt số dư.
- [x] Lưu ghi chú phụ huynh.
- [x] Đổi PIN thành công và làm token cũ mất hiệu lực.
- [x] PIN mới có thể đăng nhập.
- [x] Chấm đặt tính có nhớ.
- [x] Chấm tính nhẩm.
- [x] Chấm lời văn đảo thứ tự hai số hạng (phép cộng).
- [x] Chấm tìm chữ số theo puzzle.
- [x] Chấm puzzle có ô `null` không ném lỗi.
- [x] Tự động khóa/cập nhật logic phiên qua mô phỏng được kiểm tra.

**Lưu ý:** Hash digest trong mock là hàm giả lập, *không phải kiểm chứng tốc độ/độ an toàn thực tế của SHA-256 Apps Script*. Không có quyền bấm trực tiếp trên giao diện Google Apps Script hoặc cài deployment mới trong kiểm tra này.

## D. Rủi ro CHƯA giải quyết – ưu tiên triển khai

### P0 – Bắt buộc xác nhận trước khi sử dụng điểm quy đổi giá trị
1. **Quyền truy cập Web App/định danh phụ huynh chưa xác minh thực tế.** PIN bốn số không phải lớp bảo vệ duy nhất đủ mạnh khi Web App công khai; Apps Script có thể chạy quyền người triển khai. Không đặt deployment ở chế độ mọi người/ẩn danh khi thao tác cộng trừ sao thật. Cần kiểm tra cấu hình người truy cập, người thực thi và tài khoản gia đình. Tham khảo chính thức: https://developers.google.com/apps-script/guides/services/authorization và https://developers.google.com/apps-script/reference/base/session .
2. **Cần chạy thật luồng PIN, lần đầu cấp phép, giao dịch và hai thiết bị**. Chưa có bằng chứng QA trình duyệt thực hoặc log xác minh sau deploy.
3. **Lượt nộp và thời gian học hiện có thành phần do client gửi lên.** Máy chủ tự chấm đáp án thật, nhưng thời gian `active_seconds` chưa có heartbeat tin cậy; biểu đồ “phút học chủ động” hiện chưa đủ cơ sở coi là thời gian chú ý thực tế.

### P1 – Quan trọng nhưng có thể làm sau phát hành sửa lỗi
4. **Trạng thái đã học/chấm tức thì trên trình duyệt** vẫn có thể khác kết quả server hoặc hai thiết bị. `cauDaDungToan` và một phần chuyên cần vẫn dùng `localStorage`; sidebar/lộ trình cần dần chuyển sang bằng chứng server nếu muốn đồng bộ đầy đủ.
5. **Một hồ sơ mặc định `gia_dinh_01`.** Không triển khai cho nhiều gia đình trong chung Web App khi chưa có xác thực hồ sơ và phân quyền.
6. **PIN 4 số có thể bị khóa toàn cục do người khác thử sai liên tục** nếu app lộ công khai; cần kiểm soát danh tính/bound rate-limit theo user trước khi mở rộng.
7. **Sổ sao qua Sheet** có thể chậm khi lịch sử tăng lớn; hiện đọc nhiều dòng mỗi dashboard/giao dịch. Cần phân trang/summary cache hoặc database khi quy mô tăng.
8. **Tab Sheet đang có timezone `Etc/GMT`**, còn script đặt `Asia/Ho_Chi_Minh`. Các hàm ghi log dùng ISO + `achDay_` định rõ múi giờ Việt Nam, nhưng khi xây công thức hoặc filter thời gian trong Sheet cần thống nhất timezone.

### P2 – Hiệu năng và bảo trì
9. **Ảnh bìa môn học 2–2,2 MB/ảnh**, sáu PNG vật thể khoảng 156–331 KB/ảnh; đã có phiên bản WebP riêng cho Robot nhưng ảnh vật thể đang là PNG lớn. Cần tối ưu ảnh web ở 160/320px, giữ master nguyên vẹn, QA Android/4G.
10. Mô-đun Toán đã tách cơ bản nhưng còn xử lý nhiều UI trong `19_KhongGianHocToan.html`; chưa có bộ máy bài học đa môn dùng chung, sẽ là G5/G6.
11. Một số dữ liệu Tiếng Việt/Tiếng Anh là demo; không nên xem đó là giáo án chính thức.
12. Google Sheet ID hiện còn hardcode trong `.gs`; khi chuyển môi trường/đổi file có thể gây nhầm nguồn. Nên dùng Script Properties + cơ chế kiểm tra ID trong G5, nhưng không đổi bây giờ vì có nguy cơ làm sai kết nối đang hoạt động.
13. Việc chọn câu hiện chủ động giới hạn **38/51**. Đây là quy tắc học tập được thiết kế, không phải mất 13 câu. Không tự sửa phạm vi mà chưa xét sư phạm.
14. **Hướng dẫn khởi tạo PIN ở trình biên tập** có hàm tên kết thúc bằng `_`; cần xác nhận trải nghiệm chọn/chạy hàm trên Apps Script tiếng Việt. Không tạo một wrapper công khai có thể bị gọi qua `google.script.run` để tránh nguy cơ khởi tạo PIN trái phép.

## E. Checklist nghiệm thu thực tế sau pull

1. **Đồng bộ `main` và triển khai “Phiên bản mới”.** Xác nhận Web App không mở công khai nếu có quản trị ví sao.
2. **Trang chủ:** đủ hình Robot avatar/banner/mascot; không bị cắt hoặc che chữ.
3. **Toán Bài 20:** mở Lý thuyết, LV1 (12), LV2 (4), LV3 (22); thay giữa cấp độ không gửi nhiều lần đến Sheet; không có 2 thanh cuộn cạnh nhau; bàn phím số hoạt động.
4. **Hình lời văn:** thử hai câu gà/kẹo ở LV1, bốn câu LV2 hiện hành. Thử làm trống `svg` ở bản Sheet thử riêng để xác nhận fallback hình, **không chỉnh Sheet đang sử dụng chỉ để QA**.
5. **Chấm bài:** bỏ trống, đúng, sai, sửa lại, nộp hai lần; kiểm tra trạng thái trên UI và hàng mới trong `90_Lan_lam_bai` và `91_So_sao`.
6. **Trang phụ huynh:** bấm Robot+thông tin -> đăng nhập, 5 PIN sai, trừ vượt số dư, thưởng/trừ có lý do, ghi chú, đổi PIN, phiên cũ bị từ chối. **Dùng giao dịch test nhỏ và hoàn trả bằng giao dịch bù nếu có phát sinh**.
7. **Android Chrome:** lặp lại các luồng học, nhập số, trang phụ huynh; cùng hồ sơ phải thấy số dư như máy tính.
8. **Hiệu năng:** dùng Chrome DevTools Network so sánh cold load, warm load, ảnh tải, số request và lỗi console; chụp màn hình desktop/tablet.

## F. Đầu ra và quyết định

- G4 **đạt phần kiểm tra tĩnh + mock**, các bản vá an toàn đã lưu trên GitHub.
- **Chưa đạt full runtime QA** do không thực thi deployment Apps Script/Chrome/Android trong phiên này.
- Sau khi QA thực tế, mới kết luận Web App ổn định và triển khai tiếp G5/G6.
- Không thay đổi Google Sheet trong G4; đã đọc metadata, header và 51 dòng câu hỏi phục vụ đối chiếu.

Để dùng file đã sửa trên GitHub: `git switch main && git pull origin main` **sau khi PR G4 đã được merge**, sau đó đồng bộ Apps Script và cập nhật deployment.
