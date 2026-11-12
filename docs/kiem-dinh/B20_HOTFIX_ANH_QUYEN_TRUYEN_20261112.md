# B20 – Hotfix ảnh quyển truyện bị trống (12/11/2026)

## Tình huống và nguyên nhân
Người dùng kiểm tra Apps Script Web App bằng `test-b20-bien-the-20261112`: câu 016 về kẹo có ảnh; câu 021 "Tủ sách có 34 quyển truyện. Thư viện nhận thêm 39 quyển truyện" có khung trắng.

Đối chiếu `34_HinhAnhDungChung.html` thấy `wordAsset(q)` chỉ nhận `quyển sách|cuốn sách`, không nhận `quyển truyện`, `cuốn truyện`, `tủ sách`. Do đó từ khóa không khớp và không gọi `attach(...,'BOOK')`. Câu kẹo khớp `kẹo` nên hiện bình thường.

## Sửa tối thiểu
- Nhánh: `hotfix/b20-book-illustration-20261112`, tạo từ đúng `test-b20-bien-the-20261112`.
- Chỉ thay một nhánh kiểm tra trong `34_HinhAnhDungChung.html`: thêm `quyển truyện|cuốn truyện|tủ sách` vào phép kiểm `BOOK`.
- Không sửa `GiaoDien.html`, CSS, câu hỏi, renderer 41, dữ liệu JSON, bảng điểm hay MAIN.
- Tiếp tục dùng ảnh `math_book_160.webp` của thư viện G5 cho nhánh này. Đây là giải pháp khôi phục hành vi nhánh B20 legacy, KHÔNG khẳng định G7.4-B.3 được deploy.

## Kiểm thử
GitHub Actions: https://github.com/Nguyennth19/new-lop-2/actions/runs/43256636178 — **SUCCESS**, 9/9 PASS:
kẹo, quyển truyện, quyển sách, cuốn truyện, tủ sách, gà, trường hợp không liên quan, câu không phải lời văn, xử lý lỗi ảnh.

## Kiểm tra trên Apps Script TEST
1. Pull `hotfix/b20-book-illustration-20261112` thay vì nhánh gốc `test-b20-bien-the-20261112`.
2. Đồng bộ Apps Script staging riêng, tạo **New version** trong Manage deployments và mở URL /exec của deployment đó.
3. Kiểm tra Bài 20 LV2-A câu 016 và LV2-B câu 021; xác nhận hình và bố cục không đổi.
4. Nếu chưa có ảnh, kiểm tra Network của URL G5 `math_book_160.webp`, phản hồi 200 và không có lỗi tải; tách lỗi URL với lỗi chọn từ khóa.
5. Bất cứ lỗi nào rollback bằng cách redeploy version TEST trước đó hoặc pull lại `test-b20-bien-the-20261112`. Không thay đổi MAIN.

Chú ý: Trong nhánh G7.4-B.3 sau này, Asset Scene JSON đã định nghĩa cặp `VAR_B20_20261112_021 → KL_SH03_006` nhưng bản `test-b20-bien-the-20261112` chưa có wiring G7.4-B.3. Đây là hai con đường tích hợp khác nhau, tránh nhầm lẫn.
