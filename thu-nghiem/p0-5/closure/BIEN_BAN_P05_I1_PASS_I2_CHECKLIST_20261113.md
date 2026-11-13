# P0.5-I — I.1 PASS, I.2 nghiệm thu deployment TEST (2026-11-13)

## Phạm vi và nguồn
- Nguồn ứng dụng bất biến: `test/p0-5-h2-owner-signoff-20261113`, commit `1dfa16c6dbde8045ab3f9145bc9f18bad08bd008`.
- H.1 JSON commit `1e9c700f1fd85427b30e9f1f42c8c49669011e33`; blob SHA `b14d556c5deeb561106e0c81f275387bef538842`.
- QA workbook: `LOP2_P05_QA_ISOLATED_20261113` (không lưu spreadsheet ID vào hồ sơ công khai).
- Không sửa MAIN, test-theo-main, production, câu hỏi, đáp án, điểm, sao hoặc ScriptProperties.

## I.1 — PASS (bằng chứng log người vận hành)
Người vận hành chạy `kiemTraMoiTruongP05KhongGhi` trong Apps Script TEST và cung cấp:
```json
{"version":"P0.5-env-preflight-v1","status":"PASS","codes":[],"environment":"TEST_EXPECTED_SHEET","testWorkbookVerified":true,"p03Locked":true,"noWrites":true,"tabs":[{"tab":"90_Lan_lam_bai","exists":true,"lastRow":1,"lastColumn":12},{"tab":"91_So_sao","exists":true,"lastRow":1,"lastColumn":9}]}
```
Người vận hành bổ sung helper read-only thiếu trong Apps Script TEST rồi chạy `kiemTraNoiDungP05DaDuyet`:
```json
{"version":"P0.5-I-approved-b20-receipt-v1","lessonId":"toan_b20","status":"PASS","errors":[],"questionCount":30,"sessionCount":6,"approvedPromptsMatched":7,"matchedSuffixes":["004","007","010","022","024","026","030"],"sourceCommitPinned":true,"p03Locked":true,"noWrites":true,"noStars":true,"readOnly":true}
```
Những kết quả này là **USER_EXECUTION_LOG**; không giả định rằng Apps Script deployment `/exec` đã dùng chính version Editor này.
Đọc độc lập Google Sheets QA phạm vi `90_Lan_lam_bai!A1:L1000` và `91_So_sao!A1:I1000`: mỗi tab đúng một hàng tiêu đề, không có bản ghi (ảnh chụp trạng thái trước kiểm thử I.2, không thay thế snapshot/hash độc lập).

## I.2 — Cổng còn thiếu, không lặp QA đã PASS
1. Apps Script TEST: Deploy → Manage deployments → mở đúng deployment TEST → đối chiếu deployment ID/URL `/exec`, version hiện tại và nguồn H.2. Việc có code mới ở Editor không tự cập nhật deployment cũ.
2. Nếu version TEST chưa bao gồm H.2: chỉ cập nhật **TEST deployment** bằng New version; không deploy production, không sửa ScriptProperties hoặc bật `P03_QA_TEST_APPROVED`.
3. Desktop/mobile: smoke mở Toán → Bài 20; kiểm lần lượt 7 prompt đã duyệt, vertical/mental/three/carry/word/reverse, nhập số, kết quả, bàn phím, WebP fallback, không có undefined/NaN; lưu 2 ảnh và loại bỏ dữ liệu cá nhân.
4. Chạy các lượt thật trên chính `/exec` TEST: `LV1-A=6`, `LV1-B=6`, `LV2-A=5`, `LV2-B=5`, `LV3-A=4`, `LV3-B=4`. Mỗi lượt thu correct/total, wrongCorrect, recorded=false, starsAwarded=0; kiểm ít nhất một trường hợp sai và bỏ trống; chỉ yêu cầu thêm sáu lượt toàn-sai nếu cần tuân thủ nguyên văn quy trình P0.5 trước đó.
5. Sau khi kiểm thử, đối chiếu lại hai tab 90/91 với snapshot trước (rowCount/header/hash), nếu thay đổi thì `NO_WRITE_FAIL`.
6. Chỉ khi có bằng chứng hợp lệ mới điền `webapp`, `sessions`, `browser` vào `thu-nghiem/p0-5/evidence-current.json` và chạy `release-gate.cjs` tại nhánh TEST. Gate giữ fail-closed.

## Gate và rollback
- STATIC: PASS; PEDAGOGY: PASS; I.1: PASS (log người vận hành).
- WEBAPP: PENDING; SESSIONS: PENDING; BROWSER: PENDING.
- `RELEASE_READY=false`. Không tự nhận diện `/exec` từ URL ứng viên cũ.
- Nếu sai phiên bản hoặc ghi bảng QA: ngừng, chuyển lại TEST deployment về version đã lưu trước I.2; giữ nguyên MAIN, test-theo-main và dữ liệu học sinh.

## Quy tắc sư phạm cho P0.6
SGK/SBT có thể không cung cấp đáp án; câu hỏi biến thể dùng đáp án do dự án tính/biên soạn, xác minh bằng rule engine hoặc rubric phù hợp môn, lưu nguồn đáp án riêng biệt với trạng thái phê duyệt. Bài 20 là pilot, không cố định sáu lượt hay loại câu vào kiến trúc chung.
