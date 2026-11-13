# P0.6-A — Kiểm kê sáu module và hợp đồng JSON V1

Ngày 13/11/2026 | Nhánh TEST: `test/p0-6-platform-foundation-20261113`
**Phạm vi:** chỉ tài liệu, schema, validator và fixture/CI offline. Không sửa Apps Script Web App, MAIN, `test-theo-main`, JSON B20 hoặc dữ liệu học sinh.

## Kiểm kê tại mã nguồn
| Thành phần | Điểm vào hiện có | Điều kiện đang gắn B20 | Hướng tái sử dụng |
|---|---|---|---|
| 1. JSON Loader | `B20_BienTheMayChu.gs` → `b20DocPackThu_` | URL nguyên bản commit H.1, `lesson_id=toan_b20`, 6 lượt/30 câu, cache B20, staging | `lessonId` + registry theo phiên bản; giữ cache khóa theo lesson/version |
| 2. Validator | `thu-nghiem/p0-2/validator-v1.js` | Nhánh xác minh tham số số học B20 và `b20Baseline` | Validator hợp đồng chung + các rule engine từng môn |
| 3. QA Runner | `thu-nghiem/p0-4/qa-runner.cjs` | mặc định `lessonId=toan_b20`, 4 suite và số ca tối thiểu cố định | Runner theo cấu hình bài / dạng câu, dùng lại các suite P0.4 |
| 4. Release Gate | `thu-nghiem/p0-5/release-gate.cjs` | `toan_b20`, sáu `LV1-A...LV3-B`, tổng 30 câu | Cổng chung nhận manifest/gate evidence; gate sư phạm + browser riêng theo môn; tuyệt đối fail-closed |
| 5. Question Renderer | `41_HienThiCauHoiToan.html`, `42_AdapterBienTheB20.html` | `chuyenB20BienTheSangRenderer` chỉ nhận `variantPilot/toan_b20`; phép cộng cố định | Registry `kind -> renderer`, fallback trạng thái không hỗ trợ, giữ UI-B đã duyệt |
| 6. Asset Resolver | `43_CauNoiAssetBienThe.html`, `44_TaiAnhTheoAssetID.html`, asset-scenes | ID mẫu `KL_SH/KL_M`, loader kiểm đúng 288 ảnh, scene count tối đa 48 | Registry theo kho và vai trò, không dùng 'file count' làm số lượng trong phép toán; mở rộng Fluent/SVG riêng có QA |

## Thay đổi trong P0.6-A
- `lesson-contract.v1.schema.json`: cấu trúc đa môn, không ép 30 câu hoặc 6 lượt.
- `validator-lesson-v1.cjs`: kiểm ID và tham chiếu giữa levels/sessions/questions, answer provenance, mode, rubric, điều kiện countable asset. Thuần, không network/GAS/Sheets.
- `kiem-thu-contract-v1.cjs`: ba fixtures hợp lệ, các ca lỗi và bất biến B20.
- `.github/workflows/p0-6-a-contract.yml`: chạy test contract + hồi quy B20, kế thừa FULL_SAFE, không có quyền ghi.

## Hợp đồng nguồn và đáp án
`questionOrigin` mô tả **nguồn câu hỏi**: SGK, SBT, tham khảo hoặc biến thể dự án.
`answerSpec.origin` mô tả **nguồn đáp án**: nguồn có sẵn hoặc dự án tự xây dựng.
`answerSpec.verification` mô tả **cách/điều kiện kiểm chứng**.
`answerSpec.pedagogyApproval` mô tả **phê duyệt sư phạm**.
Không suy luận `verification.status=PASS` chỉ vì JSON hợp schema; validator chỉ xác nhận **tính hợp lệ cấu trúc**, không tự chấm đáp án mở hoặc ký duyệt.

## Cổng kiểm định P0.6-A
1. Fixture cả 3 môn PASS, negative cases bị chặn, không yêu cầu 30 câu hay 6 lượt cho mọi bài.
2. B20 H.1 giữ nguyên nguồn và 7 prompt, 30 ID và six-session distribution; không sửa JSON.
3. FULL_SAFE P0.4 và regression B20 không bị suy giảm; kết quả từ GitHub Actions phải xem riêng.
4. Test contract không chứa Apps Script runtime writes, không deploy và không thay release gate P0.5.
5. Chỉ sau kiểm định A mới sang P0.6-B Adapter Registry (in-memory, flag OFF theo mặc định).

## Rủi ro/giới hạn
- JSON Schema là mô tả loại dữ liệu; validator bổ sung các quan hệ tham chiếu và nội quy. Chưa có tích hợp thư viện kiểm JSON Schema đầy đủ, vì vậy *schema conformity full* chưa được chứng nhận.
- Fixtures của Tiếng Việt / Anh là ví dụ kỹ thuật, KHÔNG phải câu hỏi sư phạm đã được phê duyệt.
- Không triển khai engine chấm đáp án thật, không cho phép renderer tự suy luận kết quả.
- Không đánh đồng kho 288 WebP đang có với thư viện hình mở rộng sau này.

## Rollback
Chỉ xóa/revert các file mới dưới `thu-nghiem/p0-6` và workflow `p0-6-a-contract.yml` trên nhánh P0.6 TEST; hoàn toàn không chạm Apps Script TEST Version 6, dữ liệu H.1 hay MAIN. Mốc P0.5: `test/p0-5-i2-webapp-evidence-20261113`.
