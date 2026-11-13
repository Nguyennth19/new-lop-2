# P0.6-B — Nghiệm thu B.1–B.4 Adapter & Registry (TEST)
Ngày: 2026-11-13, Asia/Ho_Chi_Minh
Branch: `test/p0-6-b-adapter-registry-20261113`
Base: `test/p0-6-platform-foundation-20261113`

## Kết quả đã thực hiện

### B.1 Lesson Registry
- `thu-nghiem/p0-6/lesson-registry-v1.cjs`: chọn theo `lessonId`, kiểm tập môn học được hỗ trợ và format, loader injected, trả lỗi có mã khi thiếu bài/loader, không tự fetch network.
- Đã kiểm `toan_b20`, bài Tiếng Việt fixture có 1 lượt, trường hợp bài chưa đăng ký. Registry không trỏ cứng mọi yêu cầu về Bài 20.

### B.2 Legacy Adapter
- `thu-nghiem/p0-6/adapter-b20-v1.cjs`: chuyển `runtime.json` sang `lop2.lesson.v1` *trong bộ nhớ*.
- Bảo toàn toàn bộ 30 `question_id`, prompt, đáp án, parameters, thứ tự, session IDs và 6 cấu hình `[6,6,5,5,4,4]`. Tách `questionOrigin`, `answerSpec.origin`, kiểm định và nghiệm thu sư phạm thành trường khác nhau.
- Giữ thông tin legacy thiết yếu (type/skillId/unit/solutionPrompt/templateId), không tự chấm bài hoặc viết Sheet.
- Dữ liệu `runtime.json` nguồn H.1 **không thay đổi**, blob SHA bất biến `b14d556c5deeb561106e0c81f275387bef538842`.

### B.3 Compatibility QA
- `thu-nghiem/p0-6/kiem-thu-adapter-registry-v1.cjs`: 20 ca fixture, bất biến, input sai, đa bài, kiểm source git-blob và không có API ghi.
- GitHub Actions run: https://github.com/Nguyennth19/new-lop-2/actions/runs/43420505949 — SUCCESS (commit `793970c77cf3609749451a7db6e377627c12b56e`).
- Các step SUCCESS: P0.6-B tests, P0.6-A tests, inherited P0.4 FULL_SAFE, B20 full offline regression, P0.5 release gate fail-closed và clean tracked worktree.
- Ghi chú: số test của tệp xác định theo `run` trong source; kết quả Actions xác nhận step PASS. Không coi kiểm thử offline là browser/production.

### B.4 Rollback
- `thu-nghiem/p0-6/lesson-selector-v1.cjs`.
- `featureFlag` mặc định OFF; khi đó chỉ Bài 20 đã có legacy fallback được phép chạy đường cũ.
- Khi ON mà adapter B20 lỗi, lựa chọn chuyển lại dữ liệu legacy bằng callback được cấu hình riêng. Câu hỏi môn khác/ID lạ bị BLOCKED, không fallback nhầm sang B20.
- Việc fallback chỉ chọn nguồn dữ liệu; **chưa gắn vào runtime UI**, không phải rollback deployment thật. Khi chuyển sang P0.6-C/D cần thêm switch vận hành và kiểm chứng trên TEST riêng.
- Khi revert P0.6-B, chỉ revert các file mới dưới `thu-nghiem/p0-6` và workflow B; có thể quay lại base P0.6-A. Không thay đổi Apps Script TEST Version 6 hoặc MAIN.

## Các giới hạn và quyết định Release Gate
- Hiện chỉ thiết lập Registry và Adapter trên Node/CI TEST, không kết nối GAS, không tác động UI, dữ liệu học sinh, sao hay các nhánh đã phê duyệt.
- `answerSpec.verification.status=PASS` phản ánh các phép tính B20 đã được kiểm toán toán học; không phải suy luận tự động từ schema cho bài mới.
- Tiếng Việt chỉ là fixture kỹ thuật, chưa có câu hỏi sư phạm thực tế/đã duyệt.
- `RELEASE_READY=false`. Cổng P0.5 vẫn BLOCKED theo thiết kế, không điền thêm bằng chứng thiếu.
- P0.6-C: tổng quát hóa QA Runner và bài toán chấm nhiều dạng; P0.6-D: Renderer Registry theo kind. Chỉ sau các cổng kiểm định đó mới đánh giá tích hợp thử trên Apps Script TEST riêng.
