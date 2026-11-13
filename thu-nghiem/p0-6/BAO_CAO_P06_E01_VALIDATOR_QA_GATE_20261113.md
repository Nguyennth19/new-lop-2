# P0.6-E.0.1 — Biên bản triển khai Validator & QA tự động Toán
**Ngày:** 13/11/2026 (Asia/Ho_Chi_Minh)
**Nhánh TEST:** `test/p0-6-e01-math-variant-validator-20261113`
**Nguồn đặc tả:** `thu-nghiem/p0-6/PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md`.
**Trạng thái:** `TECHNICAL_QA_PASS / POLICY_OWNER_SIGNOFF_PENDING`.
**Phạm vi:** TEST offline; KHÔNG nối Apps Script, không thay Web App Version 6, MAIN, test-theo-main, dữ liệu học sinh, điểm/sao hoặc P0.5 Release Gate.

## 1. File bổ sung
- `thu-nghiem/p0-6/math-variant-validator-v1.cjs`: bộ kiểm G0–G8, phân loại `PASS/FAIL/BLOCKED/PENDING/NOT_APPLICABLE`, quyết định tổng theo thứ tự FAIL > BLOCKED > PENDING > PASS_FOR_TEST.
- `thu-nghiem/p0-6/pilot/toan_b21.variant-policy.candidate.json`: manifest phạm vi B21 dựa dữ liệu curriculum matrix, **DRAFT_OWNER_SIGNOFF_PENDING**, có quy tắc cộng có nhớ trong phạm vi 100; không giả đã duyệt.
- `thu-nghiem/p0-6/kiem-thu-math-variant-policy-v1.cjs`: **37 ca QA**, gồm cả trường hợp âm/cố ý sai và mô phỏng bằng chứng duyệt (nhãn `TEST_FIXTURE_ONLY`).
- `thu-nghiem/p0-6/xuat-bien-nhan-bien-the-toan-v1.cjs`: xuất biên nhận per-question G0–G8, SHA-256 nguồn/receipt, không chứa dữ liệu học sinh.
- `.github/workflows/p0-6-e01-math-variant-qa.yml`: CI riêng, kế thừa P0.6-E/D/C/B/A, P0.4 FULL_SAFE, Bài 20 và P0.5 fail-closed.

## 2. Quy tắc máy hóa G0–G8
| Gate | Máy kiểm được ngay | Không được máy tự quyết |
|---|---|---|
| G0_SCOPE | `lessonId`, skill allowlist, nguồn `INDEX_VERIFIED/PRIMARY_VERIFIED/PENDING`, hợp lệ schema | Chứng thực trang SGK chưa đọc |
| G1_MATH | Cộng, trừ, chuỗi cộng/trừ; proof với tham số câu; giới hạn số, nhớ/mượn, kết quả trung gian; B26 geometry luôn `PENDING` | Xác nhận topology SVG phức tạp |
| G2_VARIANT | V1/V2 có metadata, V3 buộc `PENDING` | Nghiệm thu V3 chưa có quy trình chủ dự án |
| G3_VISUAL | NONE/DECORATIVE; COUNTABLE kiểm đúng nhóm theo dữ kiện câu, tổng, Count-Safe evidence, giới hạn 48; MEASUREMENT/COMPARISON yêu cầu chứng cứ | Dấu hiệu thị giác, hình học, vạch đo chưa có bằng chứng runtime |
| G4_INTERACTION | Mapping, skill coverage, mức giảm độ khó, số quan hệ đánh giá, câu CHOICE cần đáp án đúng duy nhất/đáp án nhiễu không trùng | Kết luận sư phạm về tương đương nhận thức chưa duyệt |
| G5_RENDER | Kind khớp component, chỉ `QA_INTERACTIVE_PASS` có evidenceRef mới nhận; readonly không đủ | Cấp giấy chứng nhận browser/mobile chưa có |
| G6_ANSWER | Nguồn đáp án và proof, không tự suy đáp án do SGK cung cấp | Bài mở/khó phải review |
| G7_PEDAGOGY | Có approval state + evidence/reviewerRef, V3 vẫn PENDING | Xác thực người phê duyệt và tính chân thực chứng cứ |
| G8_RELEASE | Policy owner ref, CI ref, rollback, offline/noWrites/noStars | Production Release Gate vẫn độc lập; policy mẫu vẫn DRAFT |

### Quy tắc an toàn
1. Bất kỳ gate FAIL ⇒ toàn câu `FAIL`; không có FAIL nhưng BLOCKED ⇒ `BLOCKED`; còn PENDING ⇒ `PENDING_REVIEW`.
2. Chỉ `PASS_FOR_TEST` khi mọi gate áp dụng đạt, chính sách được khai báo `APPROVED_FOR_TEST_POLICY` và có đủ evidence refs; đây là **quyết định tính toán**, không phải chữ ký thực hay quyền bật production.
3. B21 policy thực tế vẫn `DRAFT_OWNER_SIGNOFF_PENDING`; hai câu B21 chỉ được test offline, không thể có `PASS_FOR_TEST`.
4. V2 không tự coi nối nhiều cặp → một đúng/sai là tương đương; đáp án trắc nghiệm phải có phương án nhiễu hợp lệ.
5. V3 và B26 hình học giữ `PENDING` ngay cả khi fixture tự khai `topologyVerified=true`. Hình COUNTABLE phải khớp dữ kiện câu, asset QA và hình được dựng thật; hình 70 vật đơn vượt giới hạn scene bị BLOCKED.
6. Không sửa B20 H.1/H.2; không cấu hình production properties; source/approval refs hiện ở TEST có thể mô phỏng nên khi triển khai thật cần kiểm chứng nguồn bằng signature/immutable evidence.

## 3. Kết quả thử ba bài
| Bài | Ca đã chạy | Kết quả có thể kết luận |
|---|---|---|
| B21 | Hai câu 67+3, 48+7; sai toán, sai carry, vượt số, mất skill, sai hình | G1 PASS cho 2 câu gốc; `G5=BLOCKED` do readonly; G7/G8 PENDING |
| B24 | `25+65-30=60` và sửa sai thành 61 | MATH G1 PASS với 60, FAIL với 61; không được phép suy ra đã nghiệm thu bài |
| B26 | Hình tứ giác – topology / nhận diện | G1/G3/G7 PENDING; chưa tự duyệt SVG/hình học |

## 4. Chứng cứ GitHub Actions
- Run cuối: https://github.com/Nguyennth19/new-lop-2/actions/runs/43436814929
- Source commit: `78c8b0eab3380a4348318fc17fe940041c22c5bf`.
- `SUCCESS`: E.0.1 (37 ca), xuất biên nhận, E, D, C, B, A, P0.4 FULL_SAFE, B20 hồi quy, P0.5 fail-closed, no tracked modifications.
- Hai lần CI trung gian FAILURE sau khi siết Count-Safe / option checks do fixture cũ chưa đủ điều kiện mới; đã cập nhật fixture và giữ lịch sử CI đầy đủ.
- Biên nhận B21 `VAR_B21_E_001` SHA-256: `136094875a98b267310515cd200b1db374c6868a5a810df567f7246fc5a442ca`.
- Biên nhận B21 `VAR_B21_E_002` SHA-256: `e937801e0318eee26b0eb6870a7e6029fc6567d2d38bc9b1312572ad3526b1fd`.
- Cả hai: `G0 PASS, G1 PASS, G2 PASS, G3 NOT_APPLICABLE, G4 PASS, G5 BLOCKED, G6 PASS, G7 PENDING, G8 PENDING`; tổng `BLOCKED`. Biên nhận phản ánh trạng thái thật, **không phải lỗi chấm toán**.

## 5. Hạn chế và việc cần làm
- E.0.1 là **bộ validator/QA tự động độc lập**, chưa tích hợp vào pipeline P0.6-E hay bộ sinh hàng loạt. Sau đó cần adapter metadata `variant`/policy theo bài, không sửa 30 câu B20.
- G0 dùng thông tin phạm vi và trạng thái nguồn do manifest khai báo; G7/G8 kiểm sự hiện diện của tham chiếu, chưa xác thực chữ ký người duyệt. Việc tự khai `APPROVED` trong fixture không cấp quyền phát hành.
- Kiểm Count-Safe đối chiếu danh sách nhóm + liên kết câu + mã bằng chứng; chưa mở và xem pixel của hình thật trong lượt CI này.
- Phép toán hỗ trợ ở E.0.1 chỉ cộng, trừ, chuỗi cộng/trừ và cổng hình học chờ; chưa có phép nhân/chia, so sánh số phức tạp, đo lường hình ảnh đầy đủ. Dạng chưa hỗ trợ phải BLOCKED.
- Để triển khai thật, cần kiểm hợp đồng đáp án/hình/renderer đến bản build đã ký, triển khai TEST độc lập feature flag OFF, visual QA trên mobile và cổng ký duyệt bản E.0.

## 6. Rollback
- Hoàn tác chỉ các file E.0.1 mới trên nhánh `test/p0-6-e01-math-variant-validator-20261113`; mốc sạch: `test/p0-6-e0-math-variant-acceptance-20261113`.
- Không yêu cầu rollback Apps Script V6 vì không triển khai lên runtime.
- `RELEASE_READY=false`, `P03_QA_TEST_APPROVED=NO` không bị thay đổi.

## 7. Quyết định nghiệm thu
- `E01_OFFLINE_IMPLEMENTATION=PASS` với phạm vi đã kiểm.
- `OWNER_POLICY_SIGNOFF=PENDING`.
- `B21_CANDIDATE_ACCEPTANCE=BLOCKED` (renderer readonly và chưa duyệt).
- `B24/B26_PEDAGOGICAL_ACCEPTANCE=PENDING`.
- `WEBAPP_TEST_NOT_PERFORMED`; `PRODUCTION_RELEASE=BLOCKED`.

**Đề xuất tiếp theo:** P0.6-E.0.2 – Chuẩn hóa mapping `lessonId → variant-policy.json` và generation templates có kiểm định, sau khi chủ dự án duyệt bộ tiêu chí E.0, rồi mới P0.6-E.1 theo cách nghiệm thu theo năng lực thay vì đối chiếu nguyên câu SGK.
