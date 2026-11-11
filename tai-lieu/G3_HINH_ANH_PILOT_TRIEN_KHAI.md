# G3 – Dựng thử năm ảnh được chủ dự án duyệt

**Quyết định của chủ dự án:** “xác nhận duyệt cả 5 hình theo đề xuất”, ngày 11/11/2026.  
**Phạm vi quyết định:** duyệt 5 **ảnh cụ thể** cho pilot; ảnh kẹo phải được hiểu là **kẹo bọc giấy**, không phải kẹo mút. Robot là nhân vật đại diện chính. Đây **không phải** quyết định phê duyệt toàn bộ 288 hình hoặc nghiệm thu giao diện Apps Script.

## Đã sửa trong nhánh `pilot-hinh-anh-g3`

- 5 file gốc được chép nguyên byte từ Drive qua Git blob vào `hinh-anh/pilot-g3/`.
- `34_HinhAnhDungChung.html`: bộ ánh xạ 5 ảnh, URL commit bất biến, tải khi cần, fallback SVG/emoji. Các trường hợp gà/kẹo chỉ kích hoạt khi prompt bài toán có từ tương ứng. Không lưu ảnh trong Google Sheet, không gọi Drive mỗi lần chuyển bài.
- `35_CSS_HinhAnhPilot.html`: avatar Robot crop hiển thị bằng CSS (không sửa file master), Robot vẫy chào ở hero, Robot động viên ở sidebar; ảnh gà và kẹo vừa khung 88×82px.
- `GiaoDien.html`: marker 3 vị trí hình Trang chủ và nạp hai module dùng chung.
- `19_KhongGianHocToan.html`: khi render word problem, ảnh thật che phần SVG cũ chỉ khi tải thành công; SVG vẫn có mặt khi ảnh lỗi. Không sửa giá trị bài toán, đáp án hay chấm sao.

## Quyết định release và hạn chế
- **Branch thí điểm, chưa merge main**, vì chưa có kết quả QA thực tế desktop/tablet Android từ Web App.
- Ba file Robot là WebP 90–94 KB/file; hai hình vật thể còn là **PNG master 2134×2134** để thử đường dữ liệu (~273 KB và ~200 KB). Đây là **pilot chức năng, chưa phải bản tối ưu hiệu năng**; cần chuyển hai hình vật thể thành WebP 160/320px từ bộ preview trước khi phát hành chính thức.
- Có bộ WebP preview 5 hình + crop avatar được tạo trong phiên QA trước. Hiện GitHub pilot đưa bản gốc để bảo toàn nguyên byte và dễ kiểm checksum; CSS tạo crop hiển thị mà không sửa master.
- Tất cả hình đặt tại một URL nguyên bản của commit `8819b99cf353583726c1164857a4b411ed13ec2b`, không phụ thuộc Google Drive sharing link.
- Không thay phép toán bằng hình. Một con gà minh họa không đại diện cho số lượng 28/17 con.

## Checklist
- [x] Chủ dự án duyệt cả năm hình ứng viên, đồng ý remap kẹo.
- [x] Kiểm tra tải lên GitHub đủ 5 file binary và blob SHA.
- [x] JS cú pháp hợp lệ, các thẻ <script> cân bằng, module ảnh nạp trước module toán.
- [x] Fallback SVG/emoji nếu ảnh tải lỗi (đã rà soát mã).
- [ ] Tối ưu 2 PNG vật thể thành WebP publish, kèm crop avatar đúng chuẩn.
- [ ] Mở Web App branch thử bằng Chrome máy tính và tablet Android; xác nhận ảnh xuất hiện và không cắt sai.
- [ ] Ảnh gà/kẹo được đối chiếu đúng hai câu lời văn Sheet tại bản triển khai thật.
- [ ] Xác nhận ảnh không che text, ô nhập, bàn phím, nội dung lý thuyết.
- [ ] So sánh tốc độ tải trang, network 4G/tablet.
- [ ] Chủ dự án duyệt screenshot trình duyệt trước khi merge vào main.

## Pull nhánh thử nghiệm
```bash
git fetch origin pilot-hinh-anh-g3
git switch pilot-hinh-anh-g3
git pull origin pilot-hinh-anh-g3
```
**Lưu ý:** với `clasp`, các file binary `hinh-anh/pilot-g3/*` không phải file Apps Script hợp lệ; chỉ đồng bộ các file `.gs` và `.html` (hoặc cơ chế lọc tương ứng). Ảnh được phục vụ từ GitHub raw, không upload ảnh binary vào Apps Script. Khi triển khai cần bảo đảm URL raw truy cập được từ Chrome/Android.
