# DATA-B / G3-A · Trusted GAS TEST Adapter (không phát hành)

**Nhánh:** `test/data-b-g3a-trusted-gas-adapter-20261117` (gốc `be-hoc` `59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff`).

## Hợp đồng TEST

- Public `g3aLayBaiToan20Test`/`layBaiToan20`: whitelist hiển thị, không `answer`, `solutionPrompt`, `puzzle.ans`, không `rendererPolicies` chưa duyệt.
- Private `khoLayBaiHoc_` nằm sau GAS (tên kết thúc `_`). `g3aChamBaiToan20Test` đọc private trên server, chỉ trả `correct`, `total`, `answered`, danh sách `{id,status}`; không trả đáp án, không ghi lịch sử hoặc sao.
- `g3aTaoPhienChamB20Test`: tạo token 1 lần, TTL 300 giây, gắn tài khoản/cấp độ, giới hạn **24 lượt token/giờ/tài khoản TEST**. Đối tượng gửi lên chỉ chứa answer inputs; không nhận điểm tự khai.
- `g3aLayBaiB024Test`/`g3aChamBaiB024Test` luôn từ chối vì source-exact và schema còn NO-GO. Không đưa B024 alpha private lên repo.
- `ghiNhanKetQuaToan20` trên nhánh này **luôn throw G3A_TEST_READ_ONLY_NO_REWARDS**. Giao diện không gọi API sao/thành tích.
- `d2ChamTinCayTest` được khoá cùng allowlist TEST, vẫn không cộng điểm.

## Bắt buộc trước khi thử bằng GAS thật

**KHÔNG được triển khai nhánh TEST này vào Apps Script đang phục vụ học sinh.** Tạo project Apps Script TEST riêng từ nhánh, dùng **bản sao workbook B20 đã xoá tab lưu vết học sinh, sao thưởng và ghi chú nhạy cảm**. Không dùng workbook chính làm nguồn.

Script Properties trong project TEST (không ghi giá trị thật trong GitHub):

```
G3A_TEST_ENABLED=true
G3A_TEST_ALLOWED_EMAILS=<danh sách email người thử đã cho phép, phân cách dấu phẩy>
G3A_TEST_SOURCE_SPREADSHEET_ID=<ID workbook QA sao chép và đã làm sạch>
```

Đặt quyền Web App **chỉ tài khoản được phép**; nếu `Session.getActiveUser().getEmail()` rỗng, ứng dụng **từ chối** thay vì chấm không xác thực. Không bật thuộc tính trên project production. Các hàm được bảo vệ kiểm cả cờ TEST, nguồn Sheet không trùng `CAU_HINH_LOP_2.SHEET_MAC_DINH` và email allowlist.

## Chạy thử mã cách ly/CI

```
node qa/g3a/test_g3a_isolated.cjs
node qa/g3a/test_g3a_http_loopback.cjs
```

Dùng workbook **giả lập gồm 51 câu không chứa câu trả lời/PII thật**, không có kết nối Google. Kết quả hiện tại: 33/33 kiểm thử VM, 6/6 kiểm thử serialized HTTP loopback = 39/39 PASS. **Không gọi đây là GAS E2E hoặc network regression thật**.

## Cổng cần kết thúc

1. Reviewer độc lập: G2-B 96/96 source text/part/slot, 10 hiệu chỉnh, 15 topology/quantity có bằng chứng, ký duyệt với reviewer ID/ngày/SHA. Hiện chưa có chữ ký (0/96).
2. B20: QA workbook có cấu trúc thực; nối API GAS TEST; mở Chrome Network và ghi bản phản hồi `g3aLayBaiToan20Test`, `g3aTaoPhienChamB20Test`, `g3aChamBaiToan20Test`. Không được xuất `answer`,`solutionPrompt`,`puzzle.ans` hay `correctAnswer`; test replay, sai scope, token expiry, không tăng tab 90/91.
3. B024: chỉ mở sau khi LessonPackage V2/schema, SGK/VBT source, rubrics multi-answer và 19 part validators được phê duyệt; hiện từ chối có chủ đích.
4. Kiểm lại đúng renderer/asset/skill theo chính sách E04/C07–C12 và P0 private grading; không tự merge hay tự cấp GO.

## Rollback

Nhánh này hoàn toàn mới, không sửa `be-hoc`, `main`, `test-theo-main` hay GAS deployed. Quay về commit `59187c6...` nếu không áp dụng và tiếp tục dùng dữ liệu G2 riêng; không cần rollback data production.
