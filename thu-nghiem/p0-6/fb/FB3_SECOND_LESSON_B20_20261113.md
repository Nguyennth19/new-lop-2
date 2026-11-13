# F-B.3 – Nghiệm thu tiếp nhận bài Toán thứ hai (Bài 20)

**Phạm vi:** P0.6 TEST độc lập; không nâng production, không Apps Script deploy, không student records/scores/stars.
**Bài được chọn:** `toan_b20` (30 câu, 6 lượt, 6 kiểu), vì có tài sản độc lập H.1/H.2 đã qua QA; **không dùng B21 policy hoặc B21 QA để hợp thức hóa B20**.
**Version ứng viên:** `p0.6-fb-test-b20-v1`. `RELEASE_READY=false`.

## Chứng cứ B20 độc lập
- **H.1 JSON nguồn bất biến:** Git blob `b14d556c5deeb561106e0c81f275387bef538842`, tại `thu-nghiem/bai-20-bien-the/runtime.json`. Không sửa nguyên văn, ID, số, đáp án, 6 lượt hay trạng thái STAGING an toàn.
- **H.2 phê duyệt riêng:** `thu-nghiem/p0-5/closure/BIEN_BAN_H2_PHE_DUYET_CHU_DU_AN.md`, blob `7faaf36b5b74f0ae233e8e3060b47b3b3123e74c`. Phê duyệt của chủ dự án ghi từ chat, không phải chứng nhận độc lập của giáo viên.
- **Renderer/grader:** nguồn `41_HienThiCauHoiToan.html`, `42_AdapterBienTheB20.html`, `26_ChamCauHoiToan.html`, kiểm tra Git blob riêng (không dùng G5 B21 làm bằng chứng). Giữ lại code đã tối ưu.
- **QA B20:** [run 43461166457](https://github.com/Nguyennth19/new-lop-2/actions/runs/43461166457) SUCCESS sau sửa lỗi giả định thứ tự danh mục; H1 bất biến, B20 adapter, renderer, server scoring regression PASS.
- **Trình duyệt thực tế:** [run 43460267147](https://github.com/Nguyennth19/new-lop-2/actions/runs/43460267147) SUCCESS ở commit `4b6650d2a89713161a9881a10066598680ddf596`. Desktop Chromium 1366 px **30/30** PASS, mobile iPhone 13 emulation 390 px **30/30** PASS; các trường hợp đúng/sai/bỏ trống, 0 JS error, không tràn ngang. Sáu kiểu: carry 1, vertical 8, mental 9, word 2, three 6, reverse 4.
- **Ảnh và HTML QA:** artifact `fb3-b20-browser-independent-evidence` ID `14055299028`, ảnh desktop/mobile, HTML và JSON; artifact GitHub mặc định 30 ngày. Các mã sinh và tài liệu này được bảo lưu để tái chạy.
- **Registry nhiều bài:** [run 43461166510](https://github.com/Nguyennth19/new-lop-2/actions/runs/43461166510) SUCCESS, kiểm B20 30 câu và B21 8 câu bằng trust adapter/sha khác nhau; sai lesson/version, lấy chứng cứ của nhau hoặc tự ghi APPROVED đều bị chặn.

## Bổ sung trong F-B.3
`fb3-b20-independent-verifier.cjs` kiểm H1 source blob, H2 review blob, 3 blob renderer/adapter/grader, hợp đồng `lop2.lesson.v1`, 30 IDs, 6 kinds, và tạo nội dung/policy/receipt SHA256 *riêng B20*. `fb2-lesson-catalog.candidate.json` đăng ký B20 `INDEPENDENT_ACCEPTED_TEST_ONLY` với adapter `INDEPENDENT_B20_F_B_3`, không tự duyệt B24 và Tiếng Việt. `kiem-thu-fb3-second-lesson.cjs` gồm 11 nhóm chống trộn B20/B21, sai policy, rollback độc lập. `xuat-bien-nhan-fb3-b20.cjs` tạo JSON QA riêng để lưu trong artifact TEST.

## Trạng thái từng bài
| Bài | Số câu | Trạng thái TEST |
|---|---:|---|
| `toan_b21` | 8 | Đã chấp nhận từ F-A, chỉ trong TEST độc lập |
| `toan_b20` | 30 | **INDEPENDENT_ACCEPTED_TEST_ONLY** sau kiểm duyệt H1/H2 và QA B20 |
| `toan_b24` | Chưa duyệt | PENDING_INDEPENDENT_QA, BLOCKED |
| `tieng_viet_doc_hieu` | Chưa duyệt | PENDING_INDEPENDENT_QA, BLOCKED |

## Lỗi được phát hiện và sửa
1. Workflow ban đầu [43460161855](https://github.com/Nguyennth19/new-lop-2/actions/runs/43460161855) thất bại phân tích YAML do tên step chứa dấu hai chấm không đặt trong dấu nháy; bản sửa đã được CI xác minh thành công.
2. Khi thêm B20 vào danh mục, test FB2 cũ `altered.lessons[1]` tình cờ trỏ vào B20 thay vì B24. Đã thay bằng `find(x => x.lessonId==='toan_b24')` để kiểm chứng cấu trúc theo định danh, không phụ thuộc thứ tự. CI [43461166510](https://github.com/Nguyennth19/new-lop-2/actions/runs/43461166510) SUCCESS.

## Ranh giới chốt
**F-B.3 = TECHNICAL_PASS_FOR_ISOLATED_TEST** sau khi các job F-B.3 mới đạt CI. Đây là chứng cứ mở ứng viên TEST độc lập cho B20, **không** phê duyệt Google Apps Script V6 hay production; không tạo quyền ghi tiến độ, điểm, sao. Rollback chỉ khóa riêng `lessonId` trên registry, **không** chỉnh Apps Script deployment.

**Bước sau F-B.3:** chuyển sang hoàn thiện hội đồng gate/kiểm toán P0 theo chứng cứ A–F, không mở V6 hay MAIN nếu chưa có quyết định riêng.
