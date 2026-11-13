# P0.5-I.3 — Biên bản đóng nghiệm thu chức năng và Release Gate có kiểm soát

Ngày: 2026-11-13 (Asia/Ho_Chi_Minh)
Phạm vi: Apps Script TEST Bài 20 (toan_b20), 30 câu, sáu lượt; không phải phê duyệt production.

## Kết luận kép
- **FUNCTIONAL_PILOT_ACCEPTED_BY_OWNER**: nghiệm thu chức năng hoàn thành, đủ cơ sở sử dụng Pilot Bài 20 làm đầu vào P0.6.
- **AUTOMATED_RELEASE_GATE_BLOCKED**: giữ `RELEASE_READY=false` và không tự nâng trạng thái `webapp`, `sessions`, `browser` trong `evidence-current.json`.
- Không suy luận rằng Apps Script Version 6 ánh xạ trực tiếp vào một Git SHA; Version 6 chỉ được ghi nhận qua ảnh và thao tác của người vận hành.

## Nguồn đã đối chiếu
1. Nhánh mã H.2 `test/p0-5-h2-owner-signoff-20261113`, commit `1dfa16c6dbde8045ab3f9145bc9f18bad08bd008`; CI run 43374702036 SUCCESS.
2. JSON H.1 được khóa tại commit `1e9c700f1fd85427b30e9f1f42c8c49669011e33`, blob `b14d556c5deeb561106e0c81f275387bef538842`.
3. Hai log người vận hành của `kiemTraMoiTruongP05KhongGhi` và `kiemTraNoiDungP05DaDuyet`: `status=PASS`, `questionCount=30`, `sessionCount=6`, `approvedPromptsMatched=7`, `noWrites=true`, `noStars=true`, `p03Locked=true`.
4. Ảnh triển khai TEST mới Version 6 lúc 18:18 13/11/2026, ID `AKfycbwVxQnRxmWtNKszA9SIk6ahglpPJz008TYVlHPRR0pz5ZVf9FX5IlC36jM8zhQrRy7iXg`, Web App `/exec`. Ảnh hiển thị LV1-A đúng 6/6, điểm 10. Không đưa thông tin cá nhân vào kho.
5. Người vận hành xác nhận tất cả sáu lượt có kết quả tương tự, 7 prompt đúng, chấm sai/để trống đúng, desktop/mobile và fallback hoạt động. Loại chứng cứ: `OWNER_OPERATOR_ATTESTATION`, không biến thành sáu kết quả JSON giả tạo.
6. Google Sheets QA `LOP2_P05_QA_ISOLATED_20261113`: đọc độc lập sau thử nghiệm phạm vi `90_Lan_lam_bai!A1:L1000` và `91_So_sao!A1:I1000`; mỗi tab chỉ có hàng tiêu đề. Không phát hiện bản ghi học sinh hoặc sự kiện cấp sao trong các tab này.

## Ma trận nghiệm thu
| Mục | Kết luận | Loại chứng cứ |
|---|---|---|
| STATIC | PASS | CI GitHub H.2 |
| PEDAGOGY | PASS trong phạm vi chủ dự án | Phiếu ký duyệt H.2 |
| I.1 | PASS | Log Editor TEST do người vận hành cung cấp |
| SESSIONS (thử thực tế) | ACCEPTED_BY_OWNER | Ảnh LV1-A + xác nhận đủ sáu lượt |
| BROWSER (thử thực tế) | ACCEPTED_BY_OWNER | Xác nhận desktop/mobile/fallback |
| Không ghi Sheets QA | NO_WRITE_OBSERVED | Đọc lại 90/91 |
| WEBAPP (tự động) | PENDING | Thiếu provenance Version 6–SHA và ping/load có chứng cứ độc lập |
| SESSIONS (tự động) | PENDING | Thiếu sáu dòng số học gắn /exec |
| BROWSER (tự động) | PENDING | Chưa điền evidence object có tham chiếu chứng cứ đầy đủ |

## Những việc cố ý KHÔNG làm
- Không sửa đáp án / câu hỏi, MAIN, test-theo-main, deployment production hoặc ScriptProperties.
- Không tự tạo kết quả per-session, ảnh mobile, URL version, snapshot/hash chưa có.
- Không sửa Release Gate để hợp thức hóa dữ liệu thiếu và không ép người vận hành làm lại sáu lượt.
- Không đồng nhất trạng thái thử nghiệm chấp nhận được với quyền phát hành ứng dụng thật.

## Rollback runbook
- Bảo tồn nhánh nguồn H.2 và nhánh biên bản `test/p0-5-i2-webapp-evidence-20261113`.
- Nếu cần rollback TEST runtime, trước hết mở Deploy → Manage deployments, đọc version đang được chỉ định và lịch sử version. Chọn lại **phiên bản TEST cũ đã được xác minh** (không đoán là v5) hoặc khôi phục từ code H.2 đã lưu; chỉ thao tác đúng TEST deployment.
- Không đảo dữ liệu QA sau kiểm tra bằng các lệnh xóa; nếu tab 90/91 tăng bản ghi thì dừng và điều tra trước khi sửa.
- Chỉ nâng Production Release Gate khi có quyết định chủ dự án riêng và biên nhận còn thiếu được xác minh.

## Chuyển giao P0.6
- Tái sử dụng `qa-runner.cjs`, `release-gate.cjs`, validator, bộ dựng câu, quy tắc sư phạm và JSON versioned.
- Bài 20 chứng minh nền tảng nhưng không cố định số lượt/câu, loại câu hoặc tương tác cho bài khác.
- Bài SGK/SBT không có đáp án: tính/biên soạn đáp án theo loại câu, kiểm định bằng toán/rubric, lưu nguồn gốc đáp án và phê duyệt chuyên môn tách rời.
- Tiến hành P0.6 trên nhánh TEST riêng; tuyệt đối không merge production do riêng quyết định này.
