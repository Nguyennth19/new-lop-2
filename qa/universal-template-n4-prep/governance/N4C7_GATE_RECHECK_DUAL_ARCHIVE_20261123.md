# N4-C.7 Drive Canonical Snapshot — updated RTM row mapping

Drive: https://docs.google.com/document/d/1hmEmyZLoW64wwGM0anHUiEHb6XQI2khLVzAcf3knDy0/edit
Google Docs revision: AHj4eMShh-3xzfkkyFmivBX4iy4pyIvYFZ9APkYOHdnzfSuCGAEKfzROWmyBCWF7peIvws87rRfvkcOQzlyCGtUi7IBRAvOt9xnakGjTiA
No private signer identities; read-only mirror. Existing historical statements superseded by the appended N4-C.7-A correction.

N4-C.7 — VERIFIED HUMAN ACK, POLICY APPROVAL & GATE RECHECK — CHECKPOINT
Date: 2026-11-23 GMT+7 | classification: LAB governance preparation / not signed / no release
Source: https://docs.google.com/document/d/1yTEOBpIndT-88LRgrS4mHpbbNhHREu4xXRXHND73SYQ/edit
Master Index intended in master-be-hoc/00; QA binary and evidence remain in original Drive folders.
GitHub branch: lab/ult-n4c7-governance-evidence-index-20261123, base HEAD N4-C.3-B 1ad172bae5b15a5e83012fe2538e3082fff0347c.
Google Drive folder: https://drive.google.com/drive/folders/1LJjsUjOKwcK3vkAJ_dWnXZhJNISggoMV
Canonical Human Signoff Register (only editable signoff authority): https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
D1/D10 policies awaiting human approval: https://docs.google.com/document/d/1eauNbzFV_niR5G3bylb1CIDiSktrZRYt2cZXVBTP4vo/edit
1. RECONCILIATION AND CHANGES OF PROCESS
This checkpoint does NOT create another signature form. Prior N4-C.1...C.5 forms are archival sources, not parallel signoff registries.
Current authority: Owner visual acceptance (4 D1/D10 screenshots) and phone LAB experience = CHAT_ACCEPTED_SCOPED; not authenticated QA signoff, no proven two-device/platform matrix.
N0-S A3/A4 receipt doc contains [PASS] and signer text but timestamp still placeholder; status HUMAN_ACK_PENDING.
Issue #15 and PR #18/#19/#20 had no standalone authenticated independent QA comments at last check.
No release permission is implied by ruleset 27874759 (review-count 0).
REPORTS: GitHub source-controlled Markdown copies and Drive editable Docs cross-link each other. For third/fourth parties, read Master QA Index first and only one Signoff Register.
2. GATE MATRIX / RTM RECONCILIATION (NOT A CLAIM OF 10 CLOSURES)
W1-01: N1-A has D2 PV100/1000 and borrow assertions; full RTM requirement-to-assertion mapping NOT YET VERIFIED. TECH_PARTIAL_PASS / CLOSURE_PENDING.
W1-02: N1-A draft identity/clear/remount coverage; complete DraftKey five-part contract needs per-field RTM mapping. TECH_PARTIAL_PASS / CLOSURE_PENDING.
W1-03: CI N1-A 45108466189; RTM source and independent closure detail PENDING.
W1-04: N4-A local real binary CI 45114546368 + live-origin sample 45114449881 PASS; human QA and W1-04 closure PENDING.
W1-05: 24-pair automated capture CI 45115735605 and Chrome interactions 45118577956 PASS, Owner visuals+phone chat positive, W1-05 formal closure PENDING.
DB-01: Single Writer — evidence of approved live TEST design, CAS enforcement, rollback/readback not verified; PENDING.
DB-02: Revision/CAS — transaction conflict and compare-and-swap proofs not verified; PENDING.
DB-03: Idempotency — replay/dedupe QA not verified; PENDING.
DB-04: Multi-store Journal — atomicity/recovery evidence not verified; PENDING.
DB-05: Readback + Rollback Drill — independent recovery rehearsal evidence not verified; PENDING.
DB mapping above reflects workstream label proposals and remains subject to actual source RTM exact row labels; do not overwrite RTM without row-to-row source verification.
3. POLICY DECISION RECOMMENDATIONS (NOT APPROVED)
D1-UX-01: propose A + B combined: semantic labels in learner-specific presentation adapter, and fail-closed DOM/accessible-text validator for internal IDs, preserving LAB diagnostic strings. Cross-check mapping against 6 slots by skill/publicVariant. No silent changes to frozen renderer.
D10-INPUT-02: propose '+' ADD and '-' ASCII / '−' U+2212 SUB; reject other dash characters/multi-token input; validate independently in trusted server, do not trust client answer/sum/answerKey. Check private grading bank and negative/tamper tests. Fast operator +/- buttons can be later UX option.
HUMAN DECISION: both PENDING; no production code committed.
4. PR / RULESET POLICY
PR dependency: #14 → #16 → #17 → #18 → #19 → #20; current #21 documentation extends #20 when created. Keep Draft/unmerged, no automatic merge chain. Reviewer rule >=1 may be beneficial ONLY after assigning eligible independent reviewer and verifying permissions/plan on nonproduction test rules. No ruleset change here.
5. NEXT HUMAN ACTION AND RECHECK
A. RTM recipient independently verifies 10495 bytes and SHA d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b and records timestamp/account via canonical Signoff Register / N0-S receipt.
B. Owner records device/browser/test scope and selects D1/D10 policy options via canonical register and policy doc.
C. Independent QA validates commits, CI artifacts and RTM per item and signs by account, timestamp, scope, links.
D. Re-run gate verification only for changed code or new evidence, not entire N4 suite if SHA unchanged.
E. Conditional gate decision: GO_HUMAN_EVIDENCE_INTAKE_AND_POLICY_REVIEW / NO_GO_W1_05_FINAL / NO_GO_MERGE_GAS_SHEET_RELEASE.
6. DUAL ARCHIVE CONTRACT — EFFECTIVE FROM N4-C.7
- All checkpoint decisions, state deltas, third-party feedback summaries must exist in both GitHub (immutable text under qa/universal-template-n4-prep/governance/ on LAB branch) and Drive (native Docs in project folder).
- Each update must include checkpoint, source SHA, Git commit, Google Drive document ID, timestamps, author (verified if human), evidence links, status and predecessor. No fabricated identity-bound signatures.
- In a cross-system outage: mark SYNC_PENDING with missing side explicitly, never claim dual-write PASS. Do not overwrite old evidence; append correction + superseded-by.
- Keep sensitive reviewer emails/identity secrets private in restricted Drive; public GitHub store non-personal status and redacted roles only.
- No copying all history into new folder, preserve source links, no duplicate writable Signoff Register.
N4-C.7 — DUAL ARCHIVE CHECKPOINT / 23-11-2026
Draft PR #21: https://github.com/Nguyennth19/new-lop-2/pull/21
GitHub immutable governance branch: https://github.com/Nguyennth19/new-lop-2/tree/lab/ult-n4c7-governance-evidence-index-20261123/qa/universal-template-n4-prep/governance
Master QA Index (Drive canonical): https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit
Checkpoint (Drive canonical): https://docs.google.com/document/d/1hmEmyZLoW64wwGM0anHUiEHb6XQI2khLVzAcf3knDy0/edit
Không tự nhận đã có chữ ký/human QA. W1-05, N0-S và learner release tiếp tục NO-GO.
N4-C.7-A — ĐÍNH CHÍNH RTM THEO 10 HÀNG NGUỒN GỐC (23/11/2026)
Nguồn chuẩn: CSV đã khóa https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view, 10.495 bytes, SHA256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b. Phần này thay thế cách gọi DB-01..05 suy diễn ở mục 2/những báo cáo trước, KHÔNG sửa CSV gốc.
W1-01 [OPEN]: Restore guard D1/D2; không tạo onChange trung gian, giữ focus/active và phân biệt 0 với rỗng. Bằng chứng N1-A n1a-browser.test.cjs dòng 28–85 kiểm D2 PV100/PV1000/borrow, focus, zero/empty, callbacks=1 ở restore và clear. Test tự mô tả đây là “intermediate callbacks”; cần xác định đó có phải thông báo cuối được phép hay sự kiện trung gian bị cấm. Chưa chứng minh callback spy D1 và tiêu chí W1-T01 hoàn tất.
W1-02 [OPEN]: DraftKey composite năm phần packId/contentVersion/lessonId/questionId/rendererVersion và thống nhất lifecycle 12 route. N1-A lines 88–132 kiểm key isolation và phiên bản, các đoạn 156–185 kiểm clear/destroy/remount 12 route. Có bằng chứng TECH_PARTIAL_PASS nhưng còn cần đối chiếu đầy đủ RTM W1-T03/W1-T04 theo cùng checkpoint và người QA ký.
W1-03 [OPEN]: D10 phương trình ngang một phép toán và Đáp số phù hợp trẻ, giữ nguyên 5 field và câu lời giải. N1-A lines 198–209 và N4-C1 Owner xác nhận ảnh qua chat; chưa có signed independent UX/a11y và grading vẫn NO_GRANT.
W1-04 [OPEN – technical evidence strong]: tải ảnh nhị phân thật và exact-count semantics cả positive/negative. N4-A CI local 45114546368 và live sample 45114449881 PASS; cần QA đối chiếu W1-T06A/B/C, ảnh decode thực, asset FLUENT:red_apple, negative sách/sai countUnit/symbolValue trước closure.
W1-05 [OPEN – technical evidence strong]: before/after 24 cặp cùng fixtures/viewport, Owner 4 ảnh D1/D10 accepted via chat, tương tác Chrome PASS; chưa có human signoff có tài khoản/ngày giờ/scope và device matrix đầy đủ.
DB-01 [BLOCKED]: Sequencing drift, điều kiện W1 technical/human closure phải trước V1.3-C. KHÔNG phải “Single Writer”. Cần gate checker DB-T01 không cho V1.3-C khi thiếu approvals.
DB-02 [OPEN]: Schema & generator coverage limited to D2 LV2; yêu cầu kiểm multi-family D2, D5/D8, D9 exact-count, D10, assetId/countUnit/symbolValue (DB-T02..05). KHÔNG phải “Revision/CAS”.
DB-03 [OPEN]: Repeat writeback overwrite, thiếu idempotency/append-only, race và audit journal (DB-T06..08). Đây là nơi Single Writer/idempotency liên quan, không phải nhãn đầy đủ DB-03 đơn lẻ.
DB-04 [OPEN]: TOCTOU từ stale snapshot, cần live re-read và expectedRevision/CAS, external writer conflict và rollback (DB-T09..12). KHÔNG phải “Multi-store Journal” theo tên chuẩn.
DB-05 [OPEN]: Signed approval & AI candidate trust boundary; bảng phê duyệt/rollback chưa đủ bằng chứng nhận chữ ký, AI_CANDIDATE_ONLY không được cấp chấm/phát hành (DB-T13..15). KHÔNG phải đơn thuần “Readback+Rollback Drill”.
TIÊU CHUẨN: Source RTM exact canonical_requirement luôn ưu tiên hơn tên gợi nhớ trong báo cáo. Mọi đóng cổng phải liên kết dòng CSV + assertion + CI SHA + reviewer + decision. Chưa có chữ ký mới: N0-S A3/A4, Independent QA, D1/D10 policy vẫn PENDING; Issue #15 chưa có comment độc lập.
QUYẾT ĐỊNH: N4-C.7 RTM_RECONCILIATION_CORRECTED; 0/10 RTM hàng được ký CLOSED qua bước này. NO MERGE / NO GAS / NO SHEET WRITE / NO STUDENT RELEASE.