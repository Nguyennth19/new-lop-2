# P0.6-E.0.3 — Biên bản Multi-Family Generator & Lesson Composition
**Ngày:** 13/11/2026 (Asia/Ho_Chi_Minh)  
**Nhánh:** `test/p0-6-e03-multi-family-composition-20261113`  
**Trạng thái:** `TECHNICAL_COMPOSITION_PASS / PEDAGOGY_AND_POLICY_PENDING`.  
**Phạm vi:** OFFLINE TEST; không thay MAIN, test-theo-main, Web App Version 6, Bài 20 H.1/H.2, Google Sheets học sinh, điểm/sao; `RELEASE_READY=false`.

## 1. Bổ sung thực tế
- `math-lesson-composer-v1.cjs`: composer thuần, gọi bộ sinh E.0.2 theo family, chia theo `manifest.sessions[].allocations`, tạo JSON `lop2.lesson.v1`, **re-audit G0–G8 toàn bài** sau khi cập nhật level/session; kiểm bất biến ID, số, tỷ lệ, quota, skills và mối quan hệ session.
- `pilot/toan_b21.multi-family-policy.candidate.json`: bản mở rộng policy **TEST DRAFT**, hai subskill dự kiến `ADD_CARRY_2D_1D` và `ADD_CARRY_2D_2D`; parent `ADD_CARRY_REVIEW`; nguồn chỉ mục B21, **không phải phê duyệt SGK**. Hash pinned `1072ac8d9bbf03a3ccdd7ff694fc514e9c1d404ca0a3c1ac26fd8558490b059c`.
- `pilot/toan_b21.composition.candidate.json`: manifest lesson với 3 levels, 3 families, 4 sessions, quota cố định **LV1 4 / LV2 2 / LV3 2**; mọi level `pedagogyStatus=PENDING`; không mở quyền dùng cho học sinh.
- `composer-fixtures-v1.cjs`: registry và policy SHA allowlist, chuẩn hóa nguồn B21 sẵn có. Không thay policy E.0.2 nguyên bản.
- `kiem-thu-multi-family-composer-v1.cjs`: **27 ca QA**, gồm chiết suất seed, skill coverage, phân phối câu/lượt, multiple renderer kind, no-dup, proof, fallback và negative cases.
- `xuat-bien-nhan-composition-v1.cjs`: xuất báo cáo 8 câu kèm gate matrix và SHA nguồn/lesson/manifest/receipt trong Actions log.
- `.github/workflows/p0-6-e03-multi-family.yml`: E.0.3 + E.0.2/E.0.1/E/D/C/B/A + P0.4 FULL_SAFE + B20 source regression + P0.5 gate blocked.
- `PHIEU_TRINH_KY_CHINH_SACH_E0_TOAN_20261113.md`: hồ sơ trình ký E.0, không giả chữ ký.

## 2. Cấu hình B21 TEST
| Cấp độ | Session | Số câu | Family | SkillId |
|---|---|---:|---|---|
| LV1 | LV1-A + LV1-B | 4 | F_2D_1D | ADD_CARRY_2D_1D |
| LV2 | LV2-A | 2 | F_2D_2D | ADD_CARRY_2D_2D |
| LV3 | LV3-A | 2 | F_2D_2D_CHALLENGE | ADD_CARRY_2D_2D |
**Tổng:** 8 câu, 4 sessions, 3 cấp độ, 3 families, 2 subskill. Có 2 loại renderer kind `math.mental`/`math.vertical`. Đây là độ phủ kỹ thuật, **không** là xác nhận LV3 khó hơn LV2, không khẳng định ba cấp độ đã phù hợp bài B21.

## 3. Bằng chứng CI
- GitHub Actions: https://github.com/Nguyennth19/new-lop-2/actions/runs/43440199612
- Commit có mã + workflow đã kiểm: `4da9e6eedce8e39a912a9dfbedfe255421941a40`.
- Kết luận `SUCCESS`: E.0.3 **27/27**, biên nhận, E.0.2, E.0.1, E, D, C, B, A, P0.4 FULL_SAFE, hồi quy B20, cổng Release P0.5 fail-closed, no tracked writes.
- `lessonSha256=7c77a445418fd743c0ae4c62ea3a0c04ddfc81b21caddbc2b77a443a6ab2253f`.
- `manifestSha256` và toàn bộ hash nguồn trong log CI; `receiptSha256=33b021c4c78a7c73fa9dbad2cf01659d344983b7d5050c22b1e8ecaedfcf0a3d`.
- 8/8 câu: `G0/G1/G2/G4/G6=PASS`, `G3=NOT_APPLICABLE`, `G5=BLOCKED` (renderer chỉ readonly), `G7/G8=PENDING` (chưa duyệt); **tổng BLOCKED**.
- Các receipt chỉ chứng minh đầu ra kiểm định với nguồn tương ứng, không phải chữ ký người duyệt.

## 4. Kiểm soát rủi ro / chưa hoàn thành
- **Giao diện/renderer mới chưa tích hợp:** các dạng `math.mental` và `math.vertical` mới là kind dữ liệu TEST, không ngầm bảo đảm Web App đang dựng được bài ngoài B20.
- **V3 và hình học B26:** chưa được generator tự sinh; cần topology QA/rubric và chuyên gia. B24 cần policy và phép tính chuỗi phù hợp bài; không dùng nhầm policy B21.
- **Cấu hình độ khó:** LV1/2/3 được phân bổ kỹ thuật, chưa chứng minh tương đương sư phạm, đặc biệt mức LV3 còn sử dụng phép cộng hai số hạng dạng như LV2. Nếu không có sự khác biệt về kỹ năng nhận thức, phải sửa trước phê duyệt.
- **Chỉ mục/nguồn SGK:** scope là `INDEX_VERIFIED`, không gắn nhãn `PRIMARY_VERIFIED`. Biến thể không cần giống từng bài sách, nhưng phải đúng phạm vi kỹ năng.
- **QA coverage:** đã chứng minh tồn tại 2 subskill và 3 family; chưa triển khai tối ưu tỷ lệ tự động theo analytics hoặc lịch học, chưa có runtime student progress.
- **Bảo mật:** policy vẫn DRAFT, hash pinned, manifest `allowStudentUse=false`, QA noWrites/noStars; không tự duyệt nội dung.
- **Không sửa các file trước đây:** chỉ thêm các file dưới E.0.3 và workflow mới.

## 5. Quyết định nghiệm thu
- `E03_COMPOSER_AND_REGRESSION=PASS` cho phạm vi OFFLINE.
- `B21_8_QUESTIONS_TECHNICAL_COMPOSED=PASS`.
- `B21_8_QUESTIONS_PEDAGOGY=PENDING`.
- `E0_OWNER_POLICY_SIGNOFF=PENDING`.
- `APPS_SCRIPT_TEST_INTEGRATION=NOT_STARTED`; `PRODUCTION_RELEASE=BLOCKED`.

## 6. Rollback
Chỉ revert file E.0.3 khỏi `test/p0-6-e03-multi-family-composition-20261113`, hoặc khôi phục mốc `test/p0-6-e02-policy-registry-generator-20261113`. Vì không triển khai Web App nên không cần thay deployment. Dữ liệu Bài 20 đã khóa bất biến.

## 7. Hướng tiếp theo
1. Chủ dự án duyệt/chỉnh đặc tả E.0 qua phiếu trình ký riêng; không trộn ký chính sách với duyệt ngay từng câu.
2. Nghiệm thu sư phạm B21 family/level (đặc biệt LV3): thống nhất mục tiêu nhận thức và tỷ lệ theo bài.
3. Mở E.0.4 nếu cần: thêm bộ template đủ loại phép toán/đếm/hình trong phạm vi, gắn G7.4 AssetPlan và Renderer interactive TEST có feature flag OFF.
4. Chỉ sau đó E.1 chốt nội dung ứng viên theo **phạm vi kỹ năng và biến thể**, không ép nguyên hình/nguyên câu SGK.
