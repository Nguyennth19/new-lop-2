# G7 — Hoàn thiện thư viện hình ảnh · Nhật ký tiến trình

**Ngày đối chiếu:** 2026-11-12 · **Nhánh:** `g7-asset-registry-20261112` · **Cổng phát hành:** STAGING / CHƯA PHÁT HÀNH

## Nguồn sự thật đã đọc
- Drive gốc: https://drive.google.com/drive/folders/16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8
- Kho 288: https://drive.google.com/drive/folders/1IEIvmL_DmV9M1YxuWuBtvNeahilByl0x
- Registry V4: https://docs.google.com/spreadsheets/d/1YJXRsOKywSkJuIaJunYWgYyD0ZoKiccvBtkePP74-50
- Báo cáo Deep QA V3.5 ngày 29/10, thư mục 99_MANIFEST_QA.
- Nhân vật V1.0.1: trong `PHASE_1B_Character_Master_REVIEW/03_MASTER_PNG_WEBP_PENDING_APPROVAL/v1.0.1_QA_PENDING`.
- Robot đang sử dụng tại `hinh-anh/pilot-g3`, không đồng nhất với toàn bộ tài sản đã duyệt.

## Các mốc công việc (chỉ đánh dấu khi có bằng chứng)
| Mốc | Kết quả | Trạng thái |
|---|---|---|
| G7.01 | Xác định 24 nhóm SH01–SH12, M01–M12 | DONE |
| G7.02 | Lập danh mục 288 Asset ID / nhãn kế hoạch / nhãn quan sát | DONE |
| G7.03 | Đọc lại các thư mục PNG master và ghi nhận 288/288 Drive file ID, kích thước byte | DONE |
| G7.04 | Tách 100 mục nhãn không khớp, không tự phê duyệt | BLOCKED_CONTENT |
| G7.05 | Ghi nhận 6 cặp PNG/WebP nhân vật (trong Drive v1.0.1 QA_PENDING), 3 Robot pilot | INVENTORIED |
| G7.06 | Tạo bản CSV tra cứu PNG→WebP, JSON máy đọc, bộ chuyển đổi có checksum | DONE |
| G7.07 | Tích hợp bộ tra cứu Asset ID vào bản staging GAS | CODE_READY / NOT_DEPLOYED |
| G7.08 | Tải xuống và chuyển đổi mới 288 PNG → WebP, kiểm tra thực tế byte / alpha / SHA-256 | NOT_RUN_IN_THIS_SESSION |
| G7.09 | Soát 100 nhãn và ký duyệt chuyên môn cho từng mã | PENDING_REVIEW |
| G7.10 | Tải WebP lên Drive + GitHub, đọc lại và so checksum, lập release URL | NOT_STARTED |
| G7.11 | Kiểm thử giao diện ba môn và phát hành | NOT_STARTED |

**Không được gọi toàn bộ thư viện là APPROVED khi G7.08–G7.11 chưa đạt.**

## Phân loại
- `SHARED`: 144 ảnh trong SH01–SH12, có thể tái sử dụng trong Toán, Tiếng Việt, Tiếng Anh **khi ngữ nghĩa khớp**.
- `MATH`: 144 ảnh thuộc M01–M12, chỉ mặc định dùng cho Toán.
- `CHARACTER`: bé trai/bé gái với trạng thái, hành động riêng; không tráo đổi vai.
- `ROBOT`: header, hero, động viên; lưu riêng, không mượn ảnh từ nhóm học liệu.
- Kho `04_VIETNAMESE_GRADE_2_FUTURE` chưa được tính là tài sản đã phát hành.

## Các ngoại lệ quan trọng cần đối soát
- `KL_SH01_010`: theo danh mục là **ổi**, ảnh quan sát là **thanh long**.
- `KL_SH01_011`: theo danh mục là **thanh long**, ảnh quan sát là **ổi**.
- `KL_SH10_001`: danh mục từng ghi cầu vồng nhưng ảnh là cây xanh (theo Deep QA V3.5).
- 6 cặp hình gần nhau theo pHash: M06-01/SH04-01; SH08-02/SH12-05; M06-03/SH12-06; SH08-11/SH12-12; M06-03/SH08-03; SH08-12/SH12-11. Không tự xóa hay nhập ID.

## Bộ file G7
- `G7_Asset_Registry_288.json`: một record / ảnh, ID, hai nhãn, trạng thái QA, Drive file ID, tên PNG/WebP dự kiến.
- `G7_Bang_DoiChieu_PNG_WebP_288.csv`: mở trực tiếp bằng Google Sheets hoặc Excel; cột WebP còn trống khi chưa chuyển đổi/xác minh.
- `G7_NhanVat_Robot_BeTrai_BeGai.json`: các ảnh nhân vật có thể truy nguyên tới Drive + robot pilot đã có.
- `g7_convert_webp.py`: chạy ngoài ứng dụng, đọc PNG bằng Drive API ở chế độ read-only; xuất 512×512 WebP vào thư mục staging và CSV chứa SHA-256. Không sửa PNG master, không tự upload, không tự duyệt.
- `42_G7_ThuVienAsset.html`: API `ASSET_G7.get/create/mount/fromQuestion`. Chỉ trả ảnh khi catalog release có `status: APPROVED` và `webp_url`.
- `KhoBaiHoc.gs`: chuyển tiếp cột tùy chọn `asset_id` trong tab `04_Cau_hoi`. Không tự thay đổi Sheet thực tế.
- `34_HinhAnhDungChung.html`: nếu câu hỏi có `asset_id` thì chỉ tra theo mã; nếu mã chưa được duyệt, không tự suy đoán từ văn bản.

## Quy định chuyển đổi và phát hành
1. PNG master bất biến; không ghi đè. Sinh WebP từ nội dung thật, không chỉ đổi đuôi.
2. Output WebP 512×512, RGBA alpha; giữ canvas và lề, kiểm tra giải mã và pixel trong suốt.
3. `quality=90` mặc định; chạy thử nhiều chất lượng nếu ảnh chữ/thước/đồng hồ không đủ rõ; những hình đòi hỏi dấu đo chính xác cần đánh giá riêng.
4. Lưu SHA256 PNG và WebP, byte count, nguyên nhân lỗi; tuyệt đối không coi việc chuyển đổi thành công là duyệt nội dung.
5. Chỉ sau kiểm định nội dung + ảnh + phiên bản mới cấp release URL bất biến trên GitHub và kiểm tra tải ngược.
6. Ảnh Base64/Data URI chỉ cân nhắc cho icon rất nhỏ, không nhúng 288 ảnh vào HTML Apps Script vì gây phình trang và cache kém.
7. Cột `asset_id` nên được thêm vào Sheet câu hỏi khi dữ liệu bài học đã được duyệt; không ghi thẳng tên file vào từng hàng HTML.

## Ví dụ ghi dữ liệu
```json
{"question_id":"toan_b20_lv2_problems_04","asset_id":"KL_SH01_001"}
```
Cần duyệt tính đúng đắn về ngữ nghĩa trước khi gán; ví dụ không mặc định gán táo cho mọi câu hỏi nhắc đến trái cây. Khi ảnh còn blocked, giữ minh họa SVG/để trống tùy từng màn.

## Nhật ký quyết định và bảo toàn nguồn
- Duy trì ID định danh cố định khi sửa nhãn; không tái sử dụng ID để chỉ vật thể khác mà không ghi history.
- Không xóa, đổi tên, hoặc thay thế 288 master PNG trên Drive.
- Không merge vào main hoặc deploy GAS khi chưa hoàn thành QA.
- Bản stage này không thể thay cho chứng chỉ chuyển đổi WebP: chưa có 288 WebP mới, byte checksum, đồng bộ Drive/GitHub hoặc kiểm thử trình duyệt.


## Bổ sung kiểm tra và mirror GitHub (2026-11-12)
- **18 Git binary parts**: 9 SHARED + 9 MATH đã được commit lên `hinh-anh/G7_STAGING_BIN` ở nhánh G7. Mỗi part 750,000 bytes (trừ phần cuối); SHA Git blob được kiểm tra trùng bản tính từ file thực tế, **18/18 khớp**. Đã đọc ngược Git tree xác nhận 18 file và dung lượng.
- Ghép các part theo thứ tự tên để tái tạo 2 ZIP, xác minh SHA256 ZIP đã liệt kê; xem `hinh-anh/G7_STAGING_BIN/README.md`. Đây chỉ là **bản sao lưu staging**, chưa phải 288 URL WebP riêng để ứng dụng sử dụng.
- **6 cặp nhân vật bé trai/bé gái v1.0.1** đã tải về từ Drive, mở giải mã WebP, có RGBA/alpha và ghi SHA256/cỡ thật vào `hinh-anh/G7_NHAN_VAT_QA_6.csv`. Trạng thái duyệt nội dung nhân vật vẫn `QA_PENDING`; 3 robot pilot nằm trong repo, chưa nhập chung release.
- Hồ sơ QA nhân vật trên Drive: https://drive.google.com/file/d/18cHtTPiymoDO25l5BNHRBYWENIJMJOgT/view
- Bộ ZIP staging tổng hợp 288 WebP học liệu + 6 WebP nhân vật + báo cáo QA + 4 contact sheets + script có thể tải trực tiếp tại hội thoại, không chứa PNG master.
- **Còn lại trước khi merge/deploy:** ký duyệt 100 nhãn, chốt nhãn học liệu có số đo/giá trị, đóng gói 288 URL WebP bất biến tại GitHub sau QA, kiểm thử trực quan GAS.
