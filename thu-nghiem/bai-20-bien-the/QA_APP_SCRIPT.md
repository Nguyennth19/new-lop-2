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
