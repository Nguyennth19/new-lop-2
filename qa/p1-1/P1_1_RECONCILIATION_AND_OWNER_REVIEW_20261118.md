# P1.1 — Source of Truth Ledger 19 phân hệ (18/11/2026)

**Trạng thái:** `RECONCILED_REVIEW_CANDIDATE` · **chưa có phê duyệt khóa ledger chính thức** · **không merge/deploy**, không ghi Sheet dữ liệu học sinh.

## Kết quả đối soát trực tiếp
- 19/19 record của ledger 17/11 được kế thừa, đối chiếu ID/SHA; 19 GitHub/Drive source references giữ nguyên trong phạm vi, không lấy file mới nhiều hơn làm thay bản chuẩn vô điều kiện.
- GitHub `129` nhánh **trước khi tạo nhánh audit P1.1**; so với [scan cấu trúc 124 nhánh ngày 17/11](https://github.com/Nguyennth19/new-lop-2/blob/audit/master-state-reconciliation-20261117/qa/global-audit/BRANCH_TREE_RUNTIME_REPORT_20261117.json): **5 nhánh mới** và **2 nhánh HEAD thay đổi**, 0 nhánh lịch sử biến mất. Đã đọc tree các nhánh delta; tree path ≠ PASS code/CI.
- Google Drive project root 44 mục trực tiếp, asset root 8 folder trực tiếp; MASTER inventory ghi **1.769** nguồn lịch sử. Chưa đọc SHA/bytes của toàn bộ 1.769, không gắn `FULL_DRIVE_AUDIT_PASS`.
- Google Sheet `MASTER_BE_HOC_A1_INVENTORY_CONTROL_20261117` có tab `18_SOURCE_OF_TRUTH_19`, `17_GLOBAL_AUDIT_CORRECTIONS`, `20_LESSONPACKAGE_B01_B24`; phiên này đọc và đối chiếu. Không sửa các tab nguồn.
- Folder `new-gap` truy cập được ở **ID đầy đủ** `12R_DKbSSO6XPTv2gYFztVuSOHmHqwX4m` gồm Sheet B20 + ba ảnh môn; lỗi 404 trước đó do dùng ID thiếu ký tự cuối.

## Delta phải giữ, không được bỏ sót
1. `test/p0-b01-b24-lessonpackage-v1-20261117`: **24 JSON, 536 C1 + 96 G2 technical candidates, 102/102 CI PASS trên SHA 61661986**, **0 publicVariant / 0 student-playable**. Là P1.2 input, KHÔNG phải 24 bài đã duyệt sư phạm nguồn.
2. `test/p0-g2b-variant-adaptation-20261117`: **25 review checks / 24 source IDs**; 11 KEEP_VARIANT, 7 KEEP_STRUCTURAL, 7 DROP; chủ dự án duyệt *chính sách chuyển đổi*, reviewer độc lập **0/25**, renderer/asset/public grant 0.
3. `test/data-b-g3b-b20-trusted-gas-e2e-20261117`: đóng bypass raw Sheet trong nhánh TEST; CI tích hợp SUCCESS trên SHA `e1e4f108...`, **real GAS TEST chưa deploy/chưa kiểm Network**. Giữ G3-A 39/39 là baseline lịch sử, G3-B không hồi tố xóa PASS G3-A.
4. `test-new`: 7 UX thay đổi B20/Tangram; **CI 44226057957 SUCCESS tại 13674d3e...**, HEAD hiện tại `59ad330271caffeee92b339816f45eb87be20040` mới hơn (commit tài liệu bàn giao); không nhận CI cũ như QA thực trên toàn HEAD. GAS post-patch còn phải nghiệm thu riêng. Không thay baseline giao diện `test-theo-main`.
5. PNG nguồn GitHub **24/288** cá thể, khác với Drive đã có 288/288 và WebP runtime 288/288; còn **264 PNG** cần nhập + hash ở P1.3. 30 WebP tư thế nhân vật có mirror nhưng quyền ứng dụng và QA nhân vật vẫn riêng.
6. P0.1 theo [biên bản](https://docs.google.com/document/d/1yVVYxCnSSk5AEZuV0pRnRybPf0DbKyzHyvdUtBOByjQ/edit) = `AUDIT_DONE`. Chủ dự án xác nhận trải nghiệm/chức năng P0 trong hội thoại ngày 18/11; **không** thay thế real GAS/production evidence.

## Những trạng thái không được mở lại do snapshot cũ
- B061/B062: **0 owner discrepancy active, 65 resolved historical** (V8-OWNER-FIX-20261109-01). C1 75/75 lesson JSON + 1.406 envelopes `OWNER_APPROVED_FOR_C1`; C4 27 DEV. Không hạ nghiệm thu C1 chỉ vì 0/1.406 render-eligible ở chính C1.
- P0.6 **FC4 closed technical isolated TEST**; **release NO-GO** là cổng khác.
- 288/288 **asset labels approved** (khác math semantics/counted scenes); G7.5 **V1.2 và V2 voice owner-approved** trong phạm vi; reference renderer 10 families/12 routes được giữ.
- G7.6 C07/C08/C09 owner signatures **0/6** theo hồ sơ kiểm toán; G2B source-exact **0/96** trong sổ reviewer. Không đặt lại 0 cho các phần owner đã duyệt một cách riêng.
- `PROJECT_RULES.review-candidate.v0.1` **0/10 thông qua chính thức**; không tự tạo quy định root hay auto push/deploy/backup delete.

## Quyết định thiết kế ledger
Mỗi record JSON lưu `domain`, `selectedSource.kind/url/sha/driveId/modifiedUtc/observedBranchHeadSha`, `passScope`, `owner.decisionStatus/scope`, `evidenceRefs`, `supersedesHistorical`, `supersededBy`, `newerScopeCandidates`, `rollback`, `releaseState`. `supersededBy=null` nghĩa chưa có quyết định thay thế bản đang chọn, không nghĩa không tồn tại nhánh mới. 8 addendum theo scope P0.1, B01–B24, G2B25, G3B, TEST-NEW UX, PNG, Drive folder và owner P0 để **không làm sai 19-domain baseline**.

## Gate/nhật ký QA
| Gate | Giá trị | Kết luận |
|---|---:|---|
| P1.1 source record identity | 19/19 | PASS cấu trúc và HEAD/Drive ID được đối chiếu |
| Old source per-scope PASS preservation | 19/19 | PASS điều kiện không hạ cấp hồ sơ lịch sử |
| Git branch inventory | 129 HEAD | PASS liệt kê; không phải 129 cây code regression PASS |
| Full byte-level Drive checksum | chưa làm | UNVERIFIED |
| Every old chat transcript | chưa thể truy toàn văn | UNVERIFIED |
| Real GAS deployment-to-SHA | chưa kiểm | UNVERIFIED |
| 19 official owner ledger approvals | 0/19 khóa ledger mới | PENDING |
| P1.1 release promotion | 0 | NO-GO |

**Reconciliation:** Expected 19 / Accessible 19 / Processed 19 / Identifier Verified 19 / Full deep-content reverified 0 / Failed identity 0 / Pending canonical owner lock 19. Phân loại **`P1_1_LEDGER_STRUCTURAL_PASS_OWNER_LOCK_PENDING`**.

**Rollback:** chỉ bỏ tham chiếu nhánh `audit/p1-1-source-of-truth-ledger-20261118`. Tất cả 19 nguồn, Google Sheets, MAIN, `test-theo-main`, `be-hoc`, GAS, số liệu học sinh và mốc owner đã nghiệm thu không thay đổi.

**Kế tiếp:** chủ dự án đối chiếu/chốt đúng 19 lựa chọn nguồn (có thể chốt theo nhóm phân hệ), rồi P1.2 dùng 24 JSON + crosswalk source/skill/renderer; P1.3 đồng bộ 264 PNG từng hash. Không tái tạo từ đầu.
