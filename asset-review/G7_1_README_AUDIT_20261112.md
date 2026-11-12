# G7.1 – Đối chiếu 100 ảnh lệch nhãn & 6 cặp nghi tương tự
Ngày: 2026-11-12 | Trạng thái: **CONTENT_MAPPING_REVIEWED / OWNER_SIGNOFF_PENDING**.

## Kiểm tra thực hiện
- Mở và đọc trực quan **4/4 contact sheet** `G7_DOI_CHIEU_NHAN_01–04.jpg` (100 ô hình), đối chiếu đúng 100 ID trong `G7_NHAN_SAI_CAN_DUYET_100_V2.csv`.
- Đọc danh sách 288 ảnh trong `G7_BAO_CAO_QA_CHUYEN_DOI_288.csv` và kiểm 100 ảnh lệch theo Asset ID.
- Mở thêm 11 PNG master trực tiếp từ Drive để xem **6 cặp nghi tương tự** (PNG 2134×2134 RGBA). Không dùng hình render lại để kết luận.
- Kiểm tra trùng nhãn dự kiến ↔ nhãn quan sát của **toàn bộ 288 ảnh** bằng so khớp Unicode không phân biệt hoa/thường, chuẩn khoảng trắng. Đây là đối chiếu **nhãn chính xác**, chưa đủ cho từ đồng nghĩa hay bài học cụ thể.
- **Không đổi tên, không ghi đè master, không cập nhật registry chính thức, không xuất bản release WebP và không đưa vào Apps Script.**

## Kết quả 100 ngoại lệ
| Nhóm | Số mục |
|---|---:|
| SHARED (SH01–SH12) | 50 |
| MATH (M01–M05) | 50 |
| Hình có nhãn dự kiến khác nhãn quan sát; đề xuất chỉnh nội dung trường nhãn thực tế | **100** |
| Trong đó có tài sản khác mang nhãn dự kiến trùng **chính xác** | **9** |
| Chưa tìm thấy nhãn trùng chính xác ở 287 tài sản còn lại | **91** |

**Phân biệt hai quyết định:** (1) **Sửa metadata để mô tả đúng ảnh thực tế**: đề xuất cho cả 100, không thay file binary hay Asset ID. (2) **Lấp chỗ trống của ảnh mà catalog từng dự kiến**: 9 có ứng viên tái sử dụng nhãn đúng; 91 chỉ là chưa có nhãn trùng tuyệt đối, không phải 91 ảnh bắt buộc vẽ mới. Việc một bài SGK có thực sự cần đúng vật thể, đúng màu, số lượng, đơn vị, hình học vẫn chưa được khóa nguồn. Không tự thông qua nội dung SGK.
 
### 9 ánh xạ tìm được bằng nhãn trùng chính xác
| Nhãn dự kiến thiếu ở vị trí ban đầu | ID cũ (thực tế khác) | ID có nhãn trùng |
|---|---|---|
| ổi | KL_SH01_010 | KL_SH01_011 |
| thanh long | KL_SH01_011 | KL_SH01_010 |
| mũ lưỡi trai | KL_SH08_011 | KL_SH09_004 |
| đôi tất | KL_SH09_006 | KL_SH09_009 |
| cầu vồng | KL_SH10_001 | KL_SH10_009 |
| bông hoa hồng | KL_SH10_004 | KL_SH10_002 |
| dây nhảy | KL_SH11_010 | KL_SH11_008 |
| máy tính tiền | KL_SH12_007 | KL_SH12_003 |
| bình tưới cây | KL_M05_011 | KL_M05_007 |

**Lưu ý:** 9 ánh xạ này mới là ứng viên dựa vào nhãn/ảnh; ứng dụng chưa được cập nhật tham chiếu. Các nhãn khái quát như "bông hoa hồng" vẫn cần nhìn nội dung trong ngữ cảnh nếu phân biệt hoa thật/hoa cách điệu.

### Sáu cặp nghi tương tự – đã xử lý phân loại
| Cặp | Quan sát | Đề xuất |
|---|---|---|
| M06-01 / SH04-01 | Hai quả bóng nhiều màu có bố cục khác | Giữ ID, ưu tiên **SH04** làm nguồn dùng chung; dùng M06 theo ngữ cảnh |
| SH08-02 / SH12-05 | Cùng túi giấy, khác dáng và quai | **Giữ hai biến thể**, không gộp binary |
| M06-03 / SH12-06 | Một hộp quà và chồng hộp quà | **Không gộp**: khác số lượng, ảnh hưởng bài đếm |
| SH08-11 / SH12-12 | Mũ rộng vành nơ hồng, hai bản vẽ khác | **Ứng viên tham chiếu dùng chung** theo ngữ cảnh, không xóa ID |
| M06-03 / SH08-03 | Hộp quà vàng-nơ đỏ gần tương đương | **Ứng viên tham chiếu dùng chung**, chờ rà bài học |
| SH08-12 / SH12-11 | Giày đỏ buộc dây / giày xanh dán quai | **Giữ hai biến thể**: khác màu/kiểu |

Không có bằng chứng cặp nào là **trùng byte**. Báo cáo Deep QA trước đó đã ghi 288 PNG có SHA-256 binary khác nhau. Vậy không xóa ảnh dựa trên perceptual hash.

## Ba cổng chưa được thông qua
1. **Owner signoff**: phê duyệt 100 nhãn thực tế và lựa chọn dùng chung cho 3 cặp. Bảng vẫn ghi PENDING, không giả mạo ký duyệt.
2. **Curriculum gap**: xác định trong SGK/VBT bài nào thực sự cần 91 nhãn chưa có đối ứng chính xác, đối chiếu đồng nghĩa, số lượng, bối cảnh trước khi quyết định thay/vẽ ảnh.
3. **Release**: khóa Asset Registry chính thức sau signoff, kiểm tra checksum và đồng bộ Drive/GitHub; app chỉ dùng bản phát hành duyệt.

## Bằng chứng gốc Drive
- Thư mục G7 staging: https://drive.google.com/drive/folders/1McZB8KXvvBZQ3yMr94Ih6cHK57QhF3xo
- Danh sách 100 V2: https://drive.google.com/file/d/1dIBOdTjHAmPRSxId1Gyowi-Y6btqBy4H/view
- Báo cáo 288: https://drive.google.com/file/d/1py12RGUq7ONSpWrJMwStwZ2bOmEqBOlc/view
- Deep QA V3.5: https://drive.google.com/file/d/1C4wHd6Gt277lgF3Rf8vHMJ3Wql4hYpJi/view

## Nhật ký nhánh
- Chi nhánh riêng: `g7-1-content-audit-20261112`, tách từ `test-theo-main`, chỉ chứa tài liệu kiểm định.
- Hai CSV: `asset-review/G7_1_100_CONTENT_DECISIONS_CANDIDATE_20261112.csv` và `asset-review/G7_1_6_NEAR_DUPLICATE_DECISIONS_20261112.csv`.
- **Không merge main, không sửa mã đang chạy.**
