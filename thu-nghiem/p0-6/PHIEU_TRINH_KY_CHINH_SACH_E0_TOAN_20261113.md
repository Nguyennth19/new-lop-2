# P0.6-E.0 — HỒ SƠ TRÌNH KÝ CHÍNH SÁCH BIẾN THỂ TOÁN
**Ngày:** 13/11/2026 (Asia/Ho_Chi_Minh)
**Trạng thái:** `OWNER_SIGNOFF_PENDING`. Hồ sơ để người có thẩm quyền phê duyệt, không đại diện chữ ký của họ.
**Nguồn:** `PE0_DAC_TA_NGHIEM_THU_BIEN_THE_TOAN_V1_20261113.md`; E.0.1 Validator G0–G8, E.0.2 Policy Registry/Generator và E.0.3 Composer.
**Mốc code:** nhánh `test/p0-6-e03-multi-family-composition-20261113`.

## A. Những quyết định cần chủ dự án phê duyệt
| Mã | Nội dung trình duyệt | Đề nghị | Trạng thái |
|---|---|---|---|
| P01 | SGK/SBT là khung năng lực, không yêu cầu chép nguyên văn câu/hình | Chấp nhận | PENDING |
| P02 | V1 đổi số, vật, bối cảnh trong phạm vi; V2 đổi thao tác sau kiểm tương đương; V3 cần chuyên môn | Chấp nhận có điều kiện | PENDING |
| P03 | Hình NONE/DECORATIVE/COUNTABLE/GEOMETRY theo vai trò; COUNTABLE phải khớp dữ kiện, ưu tiên tái sử dụng G7.4 | Chấp nhận | PENDING |
| P04 | QA G0–G8, tiêu chí FAIL/BLOCKED/PENDING/PASS_FOR_TEST | Chấp nhận cho TEST offline | PENDING |
| P05 | Tỷ lệ LV1/LV2/LV3, số lượt và họ câu được **cấu hình theo từng bài**, không dùng một tỷ lệ cho toàn bộ lớp 2 | Chấp nhận; B21 mẫu 4/2/2 chỉ là pilot | PENDING |
| P06 | Chấp nhận việc phê duyệt **template/family** có QA 100% câu sinh tự động thay vì đọc thủ công 100% câu | Chấp nhận khi có sampling theo rủi ro, reviewer và cảnh báo drift | PENDING |

## B. Ranh giới giữa chính sách và một bài cụ thể
- Chấp nhận E.0 **không đồng nghĩa** ký duyệt 8 câu B21, 3 mức độ của B21, các tên subskill do dự án bổ sung, hay sách trang gốc.
- Những bài có chính sách `DRAFT_OWNER_SIGNOFF_PENDING` không được gắn `APPROVED_FOR_TEST_POLICY` tự động.
- Với B21, subskill `ADD_CARRY_2D_1D` và `ADD_CARRY_2D_2D` là **phân loại kỹ thuật dự kiến**, cần đối chiếu mục tiêu bài và phê duyệt chuyên môn. LV3 hiện chỉ phân nhóm theo tham số, **chưa khẳng định** là khó hơn LV2.
- Với B24, B26 phải có manifest riêng: không dùng policy B21 để sinh phép trừ hay xác nhận topology hình học.
- Không biến `PASS_FOR_TEST` giả lập thành chứng cứ thực tế hoặc cho phép cấp điểm/sao.

## C. Cơ chế ký duyệt tối thiểu
Một bản phê duyệt hợp lệ cần lưu: `policyId`, `policyVersion`, `policySha256`, `decision=APPROVED_FOR_TEST_POLICY|REVISE|REJECT`, `scope`, `conditions`, `reviewerRef`, `reviewedAt`, `evidenceRef`; có dấu vết bất biến và người duyệt có thẩm quyền. Khi chưa có, giữ nguyên draft.

**Không điền sẵn:** tên người ký, ngày ký, chữ ký, ID biên bản hoặc trạng thái APPROVED.

## D. Cổng mở sang bước tiếp theo
1. Chủ dự án xác nhận hoặc sửa chính sách E.0 trước.
2. Quy tắc đầy đủ của template/level được kiểm bằng E.0.1, E.0.2, E.0.3 trên policy SHA đã duyệt.
3. Nghiệm thu các family B21 ở LV1/2/3 theo năng lực; nếu LV3 chỉ lặp lại LV2, phải chỉnh family hoặc độ khó.
4. QA G7.4 theo hình dữ kiện; readonly → interactive cần UI/mobile QA riêng.
5. Trước khi phát hành phải có Release Gate mới đủ bằng chứng; P0.5 gate hiện vẫn `RELEASE_READY=false`.

**Kết luận hồ sơ:** `READY_FOR_OWNER_REVIEW`, `OWNER_SIGNOFF_PENDING`, `WEBAPP_TEST_NOT_PERFORMED`, `PRODUCTION_BLOCKED`.
