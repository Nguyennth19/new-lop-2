# LỚP 2 — ĐỀ XUẤT ĐIỀU CHỈNH QUY ĐỊNH CHUNG SAU HARD QA

> **REVIEW ONLY · CHƯA ĐƯỢC CHỦ DỰ ÁN KÝ DUYỆT · KHÔNG THAY THẾ `PROJECT_RULES.md` CHÍNH THỨC.** Bản đề xuất đọc cùng `qa/g7-6-workflow-rules-consolidation-review/PROJECT_RULES.review-candidate.v0.1.md`, quyết định R01–R10 còn 0/10 approval và các chính sách chuyên môn đã đóng băng.

## Kết hợp hai tài liệu mới

1. `.md` Universal AI Coding Guidelines: giữ **Think Before Coding**, **Simplicity First**, **Surgical Changes**, **Goal-Driven Execution**. Trừ khi một việc có các cổng phát hành/độ rủi ro cao, tránh tạo hàng loạt bước QA lặp cùng một bằng chứng.
2. `.docx` Quy trình GitHub–Google Drive–Gemini–ChatGPT: chỉ dùng quản trị chia vai, context index theo module, bàn giao đầu vào có mã hash, review chéo và khả năng khôi phục. Các đoạn code ví dụ **không mang quyền triển khai**. Bác bỏ auto `clasp push --force`, tự xóa backup, PIN client hardcode, public answer spec, tự ký hay tự suy source-exact.

## 10 điều khoản đề xuất để chủ dự án duyệt từng mục

| ID | Quy định đề xuất | Tham chiếu xung đột/cổng cần giữ | Quyết định hiện hành |
|---|---|---|---|
| R01 | Mỗi nhiệm vụ có baseline/HEAD, scope, sourceRef, expectedQA, actual CI, rollback, nextAction | Nối với historical execution logs | PENDING_OWNER |
| R02 | Chỉ nạp `PROJECT_STATE_INDEX` metadata trước, sau đó đọc đúng phân hệ, không dump secrets | GitHub AI-1 index read-only | PENDING_OWNER |
| R03 | Mọi handoff AI–AI–human ghi source SHA, review độc lập và bất đồng | Không thay chữ ký người duyệt | PENDING_OWNER |
| R04 | `CI_GREEN != LIVE_DEPLOYMENT_APPROVED` và không có auto `clasp push` | C07–C19, GAS TEST/MAIN | REFERENCE_EXISTING; PENDING_OWNER |
| R05 | Logs/decision append-only, không xóa ZIP backup nếu chưa có retention policy | Backup pre-A1, Release/rollback | REFERENCE_EXISTING; PENDING_OWNER |
| R06 | Giữ độc lập phê duyệt renderer C07, curriculum E04 C08, producer C09 | 0/6 C08.6 actual signed | REFERENCE_EXISTING; PENDING_OWNER |
| R07 | Không thay SGK LV1, VBT LV2, LV3 tham khảo; dùng exact source evidence/semantics | SOP Big Data V2 candidate, SGK title/printing | REFERENCE_EXISTING; PENDING_OWNER |
| R08 | Reuse-first theo 19 domain pins, không xây lại module đã PASS và approved scope | G7.4, G7.5, P0.6 F-C.4 | PENDING_OWNER |
| R09 | Public DTO chỉ allowlist; private grading chỉ trên trusted server | G3A real GAS pending; be-hoc legacy leak | REFERENCE_EXISTING; PENDING_OWNER |
| R10 | Sau mỗi thay đổi phải ghi snapshot, errata, sourceSha, reviewer scope, CI, rollback | Không xóa/cập nhật hồ sơ lịch sử | PENDING_OWNER |

## 6 invariant bổ sung để chống bỏ sót liên tiếp

- **S1 – Resolved-issue-first:** trước khi tái mở lỗi, tìm trong bản nguồn `resolved/reopened/supersededBy` và latest authority theo scope. Regression bắt buộc: B061/B062 active owner mismatch = 0 trong V8/C1, historic 65 != unresolved 65.
- **S2 – Scope-aware QA:** phân tách từng cột `SOURCE_QA`, `SCHEMA_QA`, `VISUAL_QA`, `PEDAGOGY`, `CLIENT_SECURITY`, `SERVER_SECURITY`, `CI`, `REAL_GAS`, `PRODUCTION`; không có trạng thái PASS chung.
- **S3 – Canonical selection per domain:** stable lesson + source edition SHA + package version + source branch SHA + owner decision; không dùng duy nhất timestamp hoặc nhánh main.
- **S4 – No semantic double count:** các ID `G2`/C1/SOURCE khác định dạng phải map theo textbook track, session/page/part/shape. `NO_TEXT_ID_OVERLAP` không là `NEW_EXERCISE`.
- **S5 – No historical regression:** owner approval of C1, P0.6 F-C.4 technical closure, G7.5 V1.2/V2, 288 label approval được giữ nguyên **đúng phạm vi**; các cổng chưa GO phải được ghi ở dòng riêng.
- **S6 – Restore proof:** backup phải pin commit, archive SHA và kiểm file list/CRC, từng loại nguồn WebP/PNG/SVG riêng; không ghi `BACKUP_OK` chỉ vì CI backup job xanh.

## Không tự thực thi từ tài liệu quy định

Không sửa root policy, không bật script dựa vào sample DOCX, không merge nhánh, không ghi GAS deployment, không ghi điểm/sao, không sửa dữ liệu học sinh. Để ban hành phải có phê duyệt cụ thể R01–R10, quyết định nhánh/phiên bản, kế hoạch rollback và negative QA trên đường lệnh triển khai.

## Nguồn gốc

- Tham khảo quy tắc đã soạn: `audit/g7-6-workflow-rules-consolidation-review-20261116@11d691aa9e5f82f27b8df664ee710b17009d5600`.
- Tiêu chuẩn coding `.md`: `universal_ai_coding_guidelines-vn-version.md` và EN tương ứng, đã đọc bản được cung cấp trong không gian làm việc.
- DOCX được đọc: `BẢN CHUẨN HÓA ĐỊNH DẠNG — QUY TRÌNH GITHUB · GOOGLE DRIVE · GEMINI · CHATGPT.docx` trong Library; là hồ sơ lịch sử, không tự suy là bản chính sách đã ký.
