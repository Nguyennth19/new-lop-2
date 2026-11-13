# F-B.2 – Quản trị đa bài học theo lessonId, lessonVersion và bằng chứng độc lập
**Ngày:** 2026-11-13T23:01:00+07:00, Asia/Ho_Chi_Minh. **Phạm vi:** P0.6, nhánh `test/p0-6-fb-from-fa-20261113`, TEST độc lập. `RELEASE_READY=false`.

## Phạm vi thực thi
F-B.2 **không dựng lại** E03 Generator/Composer, F-A G5 Compatibility Bridge hoặc bộ chấm Toán. Sử dụng `fb-lesson-release-gate.cjs` (F-B.1) làm trust adapter riêng của B21; bổ sung registry theo từng bài và version bằng mã thuần.

| lessonId | lessonVersion | Nguồn/QA chính sách và renderer | Trạng thái |
|---|---|---|---|
| `toan_b21` | `p0.6-fb-test-b21-v1` | E03 Composer, F-A G5 Chromium 8/8, G7/G8 TEST, F-B.1 nguồn SHA | `INHERITED_ACCEPTED_TEST_ONLY` |
| `toan_b24` | `p0.6-fb-test-b24-v1` | Chưa kiểm duyệt, chưa có renderer/QA riêng | `PENDING_INDEPENDENT_QA` / BLOCKED |
| `tieng_viet_doc_hieu` | `p0.6-fb-test-tv-v1` | Chưa kiểm duyệt, chưa có renderer/QA riêng | `PENDING_INDEPENDENT_QA` / BLOCKED |

Hai bài đang khóa là **đăng ký placeholder để kiểm thử isolation**, không phải nội dung đã được đối chiếu SGK/SBT hay được chấp thuận.

## Thiết kế
- `fb2-lesson-catalog.candidate.json`: danh mục JSON tách từng lessonId/lessonVersion, không lưu câu hỏi vào Sheets, mọi lesson `allowStudentUse=false`, `deploy=false`, `releaseReady=false`.
- `fb2-multi-lesson-registry.cjs`: kiểm trùng/định dạng, default featureFlag OFF, chặn sai environment/version và yêu cầu bằng chứng/approval theo bài qua `trustedAdapterId`. JSON tự gắn `APPROVED` hay mượn evidence B21 không thể mở bài khác.
- `fb2-trusted-adapters.cjs`: **chỉ** nối B21 với F-B.1 đã nghiệm thu, thông qua match chính xác `lessonId`, `lessonVersion`, 4 trường provenance và nguồn `verify()`. Không tự tạo trust adapter cho B24/Tiếng Việt.
- `rollback(lessonId)`: tạo receipt chuyển **riêng lessonId đó** về `BLOCKED_DEFAULT`; không ghi/chuyển Apps Script deployment và không tác động bài khác.
- `kiem-thu-fb2-multi-lesson.cjs`: 12 nhóm QA tích cực/âm tính, bao gồm sai lesson, tăng quyền production, forged approval, forged trusted verification, rollback độc lập, B20 H.1 bất biến và F-B.1 regression.

## CI và bằng chứng
GitHub Actions `43459000348` tại commit `70c4eedd27b8e41bcccb71cf355cbe686480d26e` **SUCCESS**. Các bước kế thừa E03 validator/generator/composer, F-A G5 và F-B.1 PASS; F-B.2 registry regression PASS. CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/43459000348

### Quy tắc nâng bài mới từ PENDING
1. Xác minh phạm vi SGK/SBT theo bài và chốt policy/family/level riêng, gắn version + digest.
2. Renderer phù hợp với dạng câu được kiểm định trên trình duyệt TEST và có rubric/chấm riêng; không dùng sai renderer B21.
3. QA và phê duyệt G7/G8 riêng; không kế thừa chữ ký/receipt hoặc hash của B21.
4. Mã tin cậy riêng trong `trusted-adapters` + test negative/hồi quy, khớp lessonId/version/provenance. Cập nhật danh mục JSON chỉ sau các bước trên.
5. Mọi phát hành thật, dữ liệu học sinh/điểm/sao, MAIN, `test-theo-main`, Web App TEST Version 6 vẫn **BLOCKED**.

**Kết luận:** `F-B.2 MULTI_LESSON_GOVERNANCE_TECHNICAL_PASS`; chỉ B21 được truy cập dạng isolated preview khi caller bật featureFlag TEST rõ ràng. F-B.2 không cấp quyền triển khai hoặc sử dụng học sinh.
