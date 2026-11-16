# BE-HOC D2 V1.2 – kết nối bài học thật, không ghi điểm từ D2

**Baseline** `a69cb2153590645b1f9ee7119011cfbd7a324eae`; **Ngày** 2026-11-16.

## Những gì thực sự đã kết nối
- Reuse **byte-identical** core/view từ G7.4 D2 V1.2, không viết lại.
- Nhúng `47_D2V12_Core.html`, `48_D2V12_View.html` vào `GiaoDien`, adapter `49_D2V12_BaiHoc.html`, CSS `50_CSS_D2V12.html` phạm vi `#mathFullScreen`.
- `19_KhongGianHocToan.html` gọi `BE_HOC_D2_V12.mountB20(fullData,root,view)` sau khi render câu từ Google Sheets. Chỉ đối với lesson ID `toan_b20`, dạng `vertical`, `valid`, phép cộng hai số có hai chữ số, kết quả **0..99**. Không sửa câu, không tạo bài mới, không xem `q.answer`.
- Mỗi câu đủ điều kiện có một bảng mở rộng `🧮 Thử đặt tính D2 V1.2 (không tính điểm)`; khi mở sẽ mount renderer đã kiểm thử, nhập từ đơn vị→chục, toggle ô nhớ; nút nghe dùng G7.5 V2, phím số GAS hiện hữu có hook khi D2 có focus. Chấm bài và ô trả lời chính hiện có vẫn nguyên.
- Submit của bảng D2 báo **đã ghi trong phiên luyện tập**; không gửi lên server, không cấp sao, không thay việc nộp bài chính. Đây là bước nối vào **bài thực** an toàn, không phải tuyên bố đã thay thế logic chấm.

## Chính sách
- `OPTIONAL_HINT`: ô nhớ/mượn chỉ gợi ý. Không tự chuyển sang `REQUIRED_ASSESSED`, vì cần owner lesson policy.
- PV100: 2 cột, kết quả <=99, 70+30/99+1 bị từ chối do thiếu cột trăm.
- PV1000: 3 cột, core/view hoạt động trên QA-only fixtures 356+128, 475+428, 599+399; trừ 402−187; **999+1, 500+500 trả lỗi RESULT_OUT_OF_SCOPE_NO_FOUR_COLUMN**. Các fixture PV1000 **không được gắn tùy tiện vào Bài 20**, vì bài thật B20 chỉ phép cộng có nhớ hai chữ số và chưa có chính sách bài–trang PV1000.
- Bản D2 không có trusted grading, không sử dụng trả lời thử để gửi tiến độ/điểm. Hồ sơ phê duyệt D2 graded end-to-end vẫn chưa hoàn tất.
- Không GAS deploy, không đổi `main`, `test-theo-main`, manifest, cổng C07/C08/C09/C12, bảng dữ liệu học sinh.

## QA
Node: bộ biên dịch D2 nguyên bản, nguồn thực được lọc đúng lesson/type/op/level, chính sách ô nhớ, nhập 1000 không tràn, chống lộ đáp án. Chromium desktop 1366 và mobile emulation 390 kiểm tra bảng thật (mocked lesson data), nhập hàng đơn vị/chục, ô nhớ, ghi nhận không chấm, và kích thước hiển thị. Trình duyệt mô phỏng dùng dữ liệu bài thử có kiểm soát và **không phải nghiệm thu GAS thực tế**.

## Rollback
Quay về commit `a69cb2153590645b1f9ee7119011cfbd7a324eae`; giữ nguyên toàn bộ máy chủ và phần chấm đã có.
