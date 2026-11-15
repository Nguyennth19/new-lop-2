# G7.6-B.5-C – Append-only QA journal / Recovery
**Ngày:** 16/11/2026. **Branch:** `test/g7-6-b5c-integration-readiness-gates-20261116`. **Baseline:** B5B `98e4fe63cbfe1ab42dc4b16e8b8666ffc5b73fae`.

| Sequence | Ref | Thao tác và bằng chứng |
|---|---|---|
| 00 | Owner chat | Người dùng xác nhận B5A Tangram OK, JSON 15/15 và B5B TTS audio OK; ra lệnh B5C audit-only, **không merge/deploy/GAS/D10/student IO**. |
| 01 | B5B CI `43734323444` | Đọc checkpoint, xác minh run COMPLETED/SUCCESS đúng SHA, kiểm số lượng 1602 assertions và 14 case. |
| 02 | B5A 15/15 JSON | Đọc 2017 bytes do người dùng tải, SHA256 `91b1fb439db708e0d909e59bec5a311341618631e0ce61a664f476bd3fdf1fb0`; 15/15 check true. JSON ghi Windows Chrome 157 1536×791; `reviewerApproved:false` và `pedagogicalApproval:false` giữ nguyên, không nâng thành formal signature. |
| 03 | Google Drive ID `1RDqkZ1LDl-DEQOEJ6ZTo6dddHtHjoBdH` | Lưu tệp JSON gốc vào folder dự án; không sửa raw. |
| 04 | Branch B5C | Tạo nhánh cô lập từ B5B SHA chính xác; nguồn G7.4, P0.6, G7.5, MAIN, test-theo-main giữ nguyên. |
| 05 | `94135a943f9392911b9f8994a74720d1471a98f1` | 19-gate machine readable GO/NO-GO; GO audit/read-only, NO-GO app/MAIN/GAS/D10/student writes. |
| 06 | `1ea3a5130b84b0454ebf50d92d9db9d27bc02d70` | Pure evaluator fail-closed; không có write/deploy commands. |
| 07 | `2f1c5848d940640b420f657a1857b0e6feddac12` | Snapshot nguyên JSON trong GitHub QA; CI so SHA256 đúng file nguồn. |
| 08 | `aacd45efa568964fa120b70893c94546af8c58ea` | Bắt đúng 14 cờ allow read-only/disallow runtime, không thay policy. |
| 09 | `33d075f9bb91fca59961acdfd5946a7d96459663` | Node assertions đối chiếu nguồn, hash B5A, owner audio chat, 19 gates, điều kiện phủ định/giả mạo. |
| 10 | `ed0dcdd95f384e64a9736f4427a6dd79ea9631af` | Sửa kiểm schema manifest theo đúng `lop2.g76.resource-renderer-manifest.v1`, key `rendererRegistry`. |
| 11 | `74997abcfad43e5110fe2e8c024f7ea99b2c1799` | Workflow kiểm immutable P0.6/G7.5/demo hash, inherited 1602, B5C matrix, artifact. |
| 12 | CI run `43739986699` FAILURE | Quy tắc `known` thiếu trạng thái công khai `PASS_CI` tại C04, khiến technical GO audit bị từ chối. Bản gốc release NO-GO không bị nới lỏng. |
| 13 | `4ecc2da31816ecebfe3b8a37c075801175e3bfad` | Chấp nhận trạng thái `PASS_CI` cho gate kỹ thuật, giữ tất cả release NO-GO cứng. |
| 14 | CI run `43740040417` SUCCESS | A–B5B **1602/1602**, B5C **108/108**. Tổng **1710/1710**; 15/15 receipt hash PASS; GO only read-only, NO-GO all runtime. |
| 15 | `39dcb5497411e569f5c7bc892e9cd03ae168081c` | Báo cáo B5C phạm vi 19 cổng; không đồng nhất PASS source với app release. |
| 16 | `d3bce5b2bc767e54399b20e22ef2827003850a0c` | Checkpoint với các SHA nguồn, matrix GO/NO-GO, rollback chính xác. |
| 17 | CURRENT | Nhật ký này; tiếp tục lưu Drive checkpoint và kiểm CI trên HEAD cuối, không deploy. |

## Các ranh giới không thể bỏ
- GO **chỉ** cho thiết kế hợp đồng/kiểm toán/CI read-only trong nhánh TEST cô lập.
- NO-GO cho `test-theo-main`, `main`, GAS, trusted D10 grading, dữ liệu học sinh, điểm/sao và tự động bật WebP/Fluent.
- 288 nhãn đã duyệt không có nghĩa content QA đã duyệt; 46 Fluent chỉ staging.
- E04 là `toan_b999` lab; thiếu SGK bài–trang/skillId/owner pedagogy; mental renderer TEST overlay chưa nằm trong manifest chính thức.
- B5B TTS được người dùng xác nhận nghe đạt **theo chat**, không thay đổi file B5B checkpoint đã khóa và không suy ra iOS/Android model.
- Rollback đơn giản: ngừng dùng B5C decision files và quay B5B SHA `98e4fe63cbfe1ab42dc4b16e8b8666ffc5b73fae`; không có GAS/runtime cần revert.

**Source of truth:** `qa/g7-6-b5c/integration-go-no-go.matrix.v1.json`, `qa/g7-6-b5c/checkpoint.g76b5c.v1.json`, workflow `.github/workflows/g7-6-b5c-readiness-no-deploy.yml`.
