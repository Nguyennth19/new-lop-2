# QA – Bài 20 biến thể tích hợp Apps Script (nhánh thử nghiệm)

Ngày: 2026-11-12
Nhánh: `test-b20-bien-the-20261112`
Trạng thái: **STATIC + SERVER-MOCK PASS / BROWSER WEB APP NOT TESTED**

## Đã tích hợp
- `DuLieuToanSheet.gs`: `layBaiToan20()` chuyển sang bộ đọc JSON; bộ đọc Sheet gốc giữ lại là `layBaiToan20Goc_()`.
- `B20_BienTheMayChu.gs`: đọc gói JSON tại URL gắn với commit cố định, kiểm tra 30 câu / 6 lượt / ID / số học / thuộc tính, chấm thử bằng `b20ChamThu()`.
- `19_KhongGianHocToan.html`: sử dụng khung học Toán hiện tại; bổ sung điều hướng sáu lượt, nhập câu trả lời và nhận kết quả từ máy chủ.
- `27_BoNhoBaiHoc.html`: tăng phiên bản cache, chấp nhận cấu trúc runtime pilot.
- `12_DuLieuLoTrinh.html`: sửa nhãn nguồn thành thử nghiệm JSON.
- `ThanhTichMayChu.gs`: chặn chấm thưởng dữ liệu cũ khi pilot hoạt động.
- `KiemThuHeThong.gs`: nhận biết chế độ thử nghiệm.
- `appsscript.json`: thêm OAuth scope UrlFetchApp.

## Kết quả kiểm tra tĩnh và giả lập GAS
- 30 ID duy nhất; 6 lượt 6/6/5/5/4/4: PASS.
- Số học toàn gói, phép cộng có nhớ và kết quả: PASS theo bộ kiểm tra kỹ thuật.
- Mẫu mock máy chủ trả về đúng khi nhập đúng, sai khi nhập sai: PASS.
- Không được chấm câu thuộc lượt khác: PASS.
- Các tệp JS/GAS đã thay đổi kiểm tra cú pháp: PASS.
- Cộng sao / ghi học sinh: **TẮT có chủ ý** trong bản pilot.
- Chạy trực tiếp Web App bằng trình duyệt: **CHƯA THỰC HIỆN** (cần đồng bộ Apps Script, cấp quyền external_request, mở URL bản triển khai thử nghiệm).
- QA trực quan từng kiểu câu, trải nghiệm bàn phím di động, cỡ chữ, bố cục: **CHỜ TEST THỰC TẾ**.
- QA sư phạm, độ khó LV3, ngôn ngữ 2 câu có lời văn: **CHỜ DUYỆT**.
- Ảnh thư viện G7: chưa gắn vào gói thử nghiệm này.
- Chế độ pilot chấm trả lời bằng một ô số cho mọi dạng câu (chưa tái hiện riêng bàn tính cột dọc hoặc UI puzzle). Đây là điều chỉnh chủ ý để thử vòng đầu, **không được coi đã hoàn thành kiểm tra renderer gốc**.

## Cách thử trong Apps Script
1. Sao lưu bản Apps Script đang dùng trước khi đổi nhánh.
2. Đồng bộ nhánh `test-b20-bien-the-20261112` qua công cụ GitHub/Apps Script.
3. Kiểm tra tệp `B20_BienTheMayChu.gs` đã xuất hiện ở gốc dự án, không có tiền tố `apps-script/`.
4. Trong Apps Script Editor chạy `kiemTraB20BienThe()` (lần đầu cấp quyền UrlFetchApp).
5. Nếu báo PASS, tạo triển khai Web App **riêng cho thử nghiệm**.
6. Mở ứng dụng > Lộ trình học > Toán 2 > Bài 20 > LV1; chọn LV1-A, làm 6 câu; thử LV1-B / LV2-A / LV2-B / LV3-A / LV3-B.
7. Kiểm tra trường hợp nhập trống, nhập sai, nhập đúng, đổi lượt, làm lại và quay về Lộ trình.
8. Kiểm tra sheet `90_Lan_lam_bai`, `91_So_sao` không có giao dịch mới do pilot.
9. Không hợp nhất nhánh vào main và không phát hành cho trẻ cho tới khi QA trình duyệt/sư phạm đạt.

## Phục hồi
- Đồng bộ lại `test-theo-main`; sử dụng bộ đọc `khoLayBaiHoc_('toan_b20')`.
- Không cần di chuyển hoặc xóa 33 ứng viên SGK/SBT hay 51 câu gốc.
- Không xoá sổ sao hoặc nhật ký học sinh để hoàn tác.

## R1.1 — 2026-11-12: Hàm công khai và lỗi chấm bài

- `kiemTraB20BienThe()`: tên hàm công khai, dùng trong Apps Script Editor > Run, thay cho `kiemTraB20BienThe_()`.
- `kiemTraKetNoiB20()`: kiểm tra phiên bản endpoint, dự kiến trả về `apiVersion: b20-r1-1-20261112`.
- `chamBaiToan20BienThe(request)`: endpoint giao diện gọi.
- `b20ChamThuNoiBo_(request)`: hàm nội bộ; `b20ChamThu(request)` giữ lại như alias staging tương thích.
- Khi endpoint không khả dụng, UI thông báo phải cập nhật bản Web App và mở lại nút Kiểm tra để thử lại.
- Kiểm tra mock server: 30/30 đáp án đúng, 30/30 đáp án sai, từ chối câu không thuộc lượt; cú pháp các tệp sửa đạt.
- Chưa triển khai hoặc kiểm tra Web App chạy thực tế. Cần **tạo version mới trong Manage deployments**, vì Apps Script Editor có mã mới không đảm bảo deployment /exec đã cập nhật.
- Bước này **không sửa CSS, renderer hay dữ liệu bài học**. R1.2/R1.3 thực hiện riêng.

## R1.2 + R1.3 – Renderer chung và chuẩn giao diện test-theo-main

- **Nguồn giao diện chuẩn:** `test-theo-main`, không lấy giao diện pilot trước làm chuẩn.
- Phục hồi cấu trúc `19_KhongGianHocToan.html` từ `test-theo-main`, loại bỏ hoàn toàn `pilotRender()` và HTML/CSS nội tuyến bổ sung ở pilot.
- Tạo `42_AdapterBienTheB20.html`: dữ liệu JSON (30 câu, 6 lượt) -> schema `lesson / levels / sections / questions` mà renderer hiện tại đã nhận.
- Chỉ thêm lệnh include adapter vào `GiaoDien.html`; không thay markup shell.
- Bổ sung nhánh nhận `pilotPrompt` có điều kiện vào renderer chung `41_HienThiCauHoiToan.html` (giữ lối hiển thị câu hỏi cũ đối với bài chuẩn).
- Dùng menu `ml-navigation`, các thẻ `ml-section`, `ml-card`, bộ bàn phím và bảng kết quả hiện có. Chọn lượt `LV1-A/B, LV2-A/B, LV3-A/B` trong sidebar.
- `chamLuotToan20BienThe()` chấm nguyên lượt trên máy chủ, hỗ trợ đặt tính (ones/tens/carry), lời văn (n1/n2/op/sum/answer), câu số (answer). Không ghi sao hoặc tiến độ.
- Khi chấm thất bại, hiển thị lỗi trên vùng kết quả hiện có và cho phép thử lại.
- Tăng version cache trình duyệt để tránh dữ liệu từ pilot cũ.
- `20_CSS_KhongGianHocToan.html` có blob SHA **3933b7f1812e08831bb7de90c1bf0f39ab87b073**, trùng **tuyệt đối** với `test-theo-main`.
- Không bổ sung CSS mới hay thuộc tính `style=` trong `19_KhongGianHocToan.html`.
- QA tĩnh: JS/GAS 4/4 cú pháp PASS; adapter 30/30 câu, 6/6 lượt, 10 nhóm render không thiếu dữ liệu; mock máy chủ 30/30 đáp án đúng PASS và 30/30 đáp án sai bị từ chối.
- Rủi ro chưa khóa: giao diện đặt tính/lời văn trên thiết bị thật, ảnh G7, độ khó LV3 và ngôn ngữ hai bài lời văn. **Cổng QA trình duyệt = CHƯA TEST**.
- Chưa thay nhánh `test-theo-main`, chưa merge, chưa deploy Apps Script. Sau pull cần **New Version** cho deployment staging và chạy test trực quan trên desktop/mobile.

## R1.3.1 – Bản vá theo ảnh test 12/11/2026

**Lưu ý:** Những mục R1.2–R1.3 ở trên là lịch sử trước lần sửa này, không còn là đánh giá mới nhất.

- B20-UI-01: tách các panel luyện tập tối đa 2 câu; không nhét toàn bộ `prompt` vào cột 78px của `.ml-mental-row`.
- B20-UI-02: bài lời văn được cấp tóm tắt, câu lời giải, đơn vị ở **phép tính** và đáp số.
- B20-UI-03: `carry`, `three`, `reverse` dùng ô toán 5 cột chuẩn, giữ đúng thứ tự từ manifest. LV3-A và LV3-B: 2 panel, mỗi panel 2 câu.
- B20-API-01: `chamLuotToan20BienThe` đã có trong mã; cảnh báo “chưa có API” trên ảnh là bằng chứng deployment đang mở không có endpoint này, không phải bằng chứng dữ liệu sai.
- `kiemTraKetNoiB20()` nay ghi ra Execution log `apiVersion: b20-r1-3-1-20261112`, `gradingEndpoint: chamLuotToan20BienThe`, `endpointReady:true`.
- `kiemTraChamLuotB20()` kiểm tra chấm 30 câu trên máy chủ thật theo dữ liệu tải được, không ghi sao hoặc lượt học. Chạy được qua thanh **Run**.
- Kiểm tra tĩnh đã thực hiện: 30/30 renderer; 30/30 đáp án đúng; 30/30 đáp án sai; CSS màn học Toán và khung `GiaoDien.html` (ngoại trừ include adapter) giống `test-theo-main`.
- **Chưa QA bằng trình duyệt sau bản vá**. Không được đánh dấu `WEBAPP_PASS` cho đến khi người dùng kiểm tra deployment mới.

### Cách test sau pull
1. Pull **đúng** nhánh `test-b20-bien-the-20261112` (không dùng `test-theo-main`).
2. Trong Apps Script Editor chạy `kiemTraKetNoiB20()`; xác minh Execution log có `endpointReady:true`.
3. Chạy `kiemTraChamLuotB20()`; phải log `total:30`, `recorded:false`, `starsAwarded:0`. Nếu báo lỗi dừng ở đây, chưa deploy.
4. **Deploy > Manage deployments > Edit > Version: New version > Deploy**. Nếu mở link `/exec` cũ mà chưa cập nhật version, sẽ tiếp tục nhận lỗi không có hàm.
5. Tải lại cứng trang Web App, kiểm tra LV1-A/B, LV2-A/B, LV3-A/B. Nộp lần đúng, lần sai, sửa đáp án rồi nộp lại, xem số câu đúng và trạng thái màu. Không được ghi `90_Lan_lam_bai` hoặc `91_So_sao`.
6. So sánh giao diện `test-theo-main` cùng kích thước desktop/mobile, đặc biệt các panel 2 bài, ô điền số và đơn vị lời văn.
7. Nhật ký lỗi gốc, bằng chứng, cách phòng tránh: `NHAT_KY_LOI_VA_PHONG_NGUA.md`. Bộ test lặp lại: `node thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js`.

**Nguyên tắc:** Giữ trạng thái thử nghiệm, không merge hoặc phát hành cho học sinh khi chưa có nghiệm thu trực quan và sư phạm.
