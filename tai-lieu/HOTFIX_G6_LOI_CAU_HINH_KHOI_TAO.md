# HOTFIX G6 – ReferenceError CAU_HINH_LOP_2 is not defined

**Triệu chứng:** Sau pull từ main lên Google Apps Script, lỗi `ReferenceError: CAU_HINH_LOP_2 is not defined`, dòng 8, file `ThanhTichMayChu.gs`.

## Nguyên nhân đã xác minh

G5/G6 đặt `const ACH_PROFILE=CAU_HINH_LOP_2.MA_HOC_SINH;` ở cấp toàn cục của `ThanhTichMayChu.gs`. Khi Apps Script khởi tạo tệp này trước khi `CauHinh.gs` chạy, tham chiếu tới hằng cấu hình chưa sẵn sàng làm sập ứng dụng ngay lúc tải.

## Bản vá

Thay khai báo toàn cục bằng `function achProfile_(){return CAU_HINH_LOP_2.MA_HOC_SINH;}` và thay tất cả điểm sử dụng `ACH_PROFILE` bằng `achProfile_()` trong 5 module: `ThanhTichMayChu.gs`, `ThanhTichBaoCao.gs`, `ThanhTichQuanTri.gs`, `TienDoHocTap.gs`, `PhuHuynhMayChu.gs`.

**Không** đổi profile, PIN, Google Sheet, schema, sao, dữ liệu hay quy tắc học. Không cần cấu hình lại `PH_PIN_BOOTSTRAP`.

## Kiểm chứng

- 6/6 module JS/GS được kiểm tra đều parse hợp lệ.
- Giả lập tải toàn bộ các module nghiệp vụ trước `CauHinh.gs`: **khởi tạo thành công**, `achProfile_()` trả về `gia_dinh_01`.
- 0 khai báo hoặc tham chiếu `ACH_PROFILE` còn sót trong năm file đã sửa.
- Chưa triển khai Apps Script thật từ phía trợ lý; sau pull cần tạo phiên bản triển khai mới.

## Hướng dẫn

```bash
git switch main
git pull origin main
```

Đồng bộ file `.gs` đã đổi, rồi Apps Script → **Triển khai** → **Quản lý các lượt triển khai** → biểu tượng **Chỉnh sửa** → **Phiên bản mới** → **Triển khai**.

Nếu lỗi vẫn còn: kiểm tra `CauHinh.gs` và `ThanhTichMayChu.gs` đã được đồng bộ đúng bản, tránh còn file tên cũ hoặc dự án Apps Script khác cùng URL. Không sửa dữ liệu thành tích để chữa lỗi này.
