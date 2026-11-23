# Master QA Index – Drive canonical governance snapshot

Drive: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit
Revision: AHj4eMSpInArN5BpkutIKWXqLLIvqKt9umLmfZsI3bUhZPPKfzHNQK8tLcVXvP22nwBqeYWjyxcND7H65aAbZ_UL4c2WkntYwuoDyOdzAg
Source frozen N4 Final-A: 08942daadf92027903cf2d1eeecf7293e27f68bc
Status: N4_GOVERNANCE_BASELINE_LOCKED_WITH_ACCESS_EXCEPTIONS, N5_STARTED_SCOPE_AND_EVIDENCE_INTAKE_ONLY, HUMAN_QA_PENDING, RELEASE_NO_GO.
This mirror is read-only. No GitHub reviewer or independent Owner signature inferred.

MASTER QA INDEX — DỰ ÁN LỚP 2 / ULT V1
Phiên bản 2026-11-23 N4-C.7, chỉ mục duy nhất; giữ nguyên kho bằng chứng gốc và các đường dẫn cũ.
TRẠNG THÁI TỔNG: LAB TECHNICAL PASS IN SCOPED CI; N0-S HUMAN ACK OPEN; W1-05 FINAL OPEN; NO MERGE, NO GAS, NO RELEASE.
Quy tắc: Không đồng nhất TECH_PASS / OWNER_CHAT_ACCEPTED / HUMAN_QA_SIGNED / CLOSED / RELEASE_APPROVED. Chỉ thay trạng thái khi có bằng chứng kèm người, tài khoản, thời điểm, commit và scope.
00. NƠI LƯU TRỮ — SINGLE SOURCE OF TRUTH
Kho di sản tài nguyên: https://drive.google.com/drive/folders/16uf-v_CVwm0R9RdY3OLv7WnhqFeBSAe8
Cây quản trị master-be-hoc: https://drive.google.com/drive/folders/1Ezox_EkVV7PHdZNQbW9VlIKYh2Es17Rh
Kho QA gốc chứa ZIP/checksum/hình: https://drive.google.com/drive/folders/1r6nUv4SGNTpBEnJPi-jkKJ58urkxtCzu
N4-C.7 checkpoint (sibling folder): https://drive.google.com/drive/folders/1LJjsUjOKwcK3vkAJ_dWnXZhJNISggoMV
Sổ ký nhận duy nhất (KHÔNG tạo bản sao để ký): https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
Chính sách D1/D10 cần duyệt: https://docs.google.com/document/d/1eauNbzFV_niR5G3bylb1CIDiSktrZRYt2cZXVBTP4vo/edit
Phản biện ngoài N4-C.6: https://docs.google.com/document/d/1yTEOBpIndT-88LRgrS4mHpbbNhHREu4xXRXHND73SYQ/edit
Biên bản N4-C.5: https://docs.google.com/document/d/1INKboI8U_3obKISo_wTnOz8lLTECVSE_MFTu9lzmlxY/edit
01. KHÓA NGUỒN / PHẠM VI
be-hoc frozen@1b69e277f8de6cb156f46a1d85af33bdad70c0ef; R1/R2@fe15c79b21b9f056694f8127330934d997affd45; V1.3-B@af02456fcc2b3be856091edc899c699890d74da0.
N0-S ruleset 27874759 VERIFIED ACTIVE, PR mandatory, review count 0 (KHÔNG phải human approval).
N0-S checksum raw 10495 bytes / SHA256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b; human A3/A4 identity+time PENDING.
N0-S evidence folder: https://drive.google.com/drive/folders/11UtNJJClteMxoAAYXM6Gc0LX1Jwmo63q
GitHub Issue #15: https://github.com/Nguyennth19/new-lop-2/issues/15
02. CI VÀ NHẬT KÝ DỰ ÁN — G7.4/G7.6 → N0/N1/N4
Kho lịch sử G7.x tại LOP 2, chưa coi toàn bộ tiền sử có manifest kiểm toán 100% ở phiên này.
N1 / W1-01..03: PR #14, head 3bd6224d3d99644c0d303fc493612a8fddafdd91; CI 45108466189 SUCCESS ở phạm vi N1. RTM closure PENDING.
N4 prep PR #16, head 3c86cc57ca354f2771340f68438eae84d1896e22, CI 45109505809; chỉ QA prep.
N4-A PR #17 head 5e09b4a45e6b3d075c6770bb91facf8289c08f6c; local CI 45114546368 PASS, live-origin smoke 45114449881 PASS trên asset mẫu, chưa kiểm live 100% asset.
N4-B PR #18 head b467befbf5532c7dd3c1e04222d71aed7519a73d; CI 45115735605 PASS tạo 24 pairs / 48 PNG / 24 diff. 20 pairs RGBA exact parity, 4 changes D1/D10 Owner image accepted via chat.
N4-C.1: https://docs.google.com/document/d/1VozIBDbT7ZAf8y18siwuMCEGLBmB8i6_Oegp-53qZ5E/edit (xem nguồn đối chiếu N4-B bên dưới).
N4-C.1 signed-review intake: https://docs.google.com/document/d/1V0gNmUbJNh8SziLqc52sttXINK97BhhB2_Eod8uOG18/edit
N4-C.2 20 pairs review: https://docs.google.com/document/d/1vQ5oMFP_scSgkqh0pwvyVpKIml5mL6_O7vvPQl3ecLs/edit
N4-C.3 PR #19 head f6acdbba1e96f8d70110a1512a88d648286fe7dd; CI 45118577956 SUCCESS (R1/R2 48; D1/D10 31; N1-A 8 cases).
N4-C.3-B PR #20 head 1ad172bae5b15a5e83012fe2538e3082fff0347c; CI 45119493865 SUCCESS (Chrome probes 8 observations), physical-phone Owner positive chat; OS/browser/case matrix not verified.
N4-C.3-B Drive kit: https://drive.google.com/file/d/1-i0bLX77x4ONlf9RoDiqWRInMRC8turP/view
N4-C.4 Owner reconcile: https://docs.google.com/document/d/1u7QP4CFCxq5hIvAoRmCE7cCxdBv_3ezIgi4aqL33Ft8/edit
N4-C.5 Gate decision: https://docs.google.com/document/d/1INKboI8U_3obKISo_wTnOz8lLTECVSE_MFTu9lzmlxY/edit
N4-C.6 human intake: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
N4-C.6 policy: https://docs.google.com/document/d/1eauNbzFV_niR5G3bylb1CIDiSktrZRYt2cZXVBTP4vo/edit
N4-C.7 single index / per-row RTM gate reconciliation: see GitHub draft PR #21 and Drive sibling folder above.
03. DEPENDENCY PR MAP (ALL DRAFT/UNMERGED @ 2026-11-23)
PR #14 R1/R2 → N1
PR #16 N1 → N0S/N4 QA prep
PR #17 N4 prep → N4-A
PR #18 N4-A → N4-B
PR #19 N4-B → N4-C.3
PR #20 N4-C.3 → N4-C.3-B
N4-C.7 documentation branch extends #20; no runtime changes permitted. Do not retarget/rebase/squash or merge simply to simplify counts.
Single reviewer signature and N0-S receipt still PENDING; human QA distinct from repo admin.
04. QUYẾT ĐỊNH, OPEN ITEMS, ROLLBACK
BLOCKED: N0S-A3/A4 independent checksum receipt; independent QA identity/signature; phone device OS/browser/scope trace; D1 learner-facing internal labels (t1_split1 / TEST), D10 ASCII minus vs U+2212 trusted-grading contract; separate RTM closure W1-01..05 and DB-01..05.
D1 long scroll accepted in Owner positive LAB UX scope but watchlist; D2 PNG hash mismatch with exact RGBA parity is technical note, not release blocker.
D1 proposal: semantic presentation adapter plus DOM/accessibility learner validator, not just grep JS. Require human policy approval and scoped LAB regression before learner release.
D10 proposal: '+' → ADD, '-' and '−' → SUB in explicit allowlist; server independent validation, answer key protected; do not implement until approved and tested.
Rollback for LAB-only: stop private LAN server/remove unpacked bundle; source rollback to frozen SHA. Never modify be-hoc/main/GAS/Sheet.
Status at N4-C.7: CONDITIONAL_GO_EVIDENCE_INTAKE_ONLY / NO_GO_W1_05_FINAL_MERGE_PRODUCTION.
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
N4-C.7-B — W1-01 DIRECT CALLBACK QA (23/11/2026)
CI 45129448098 SUCCESS: https://github.com/Nguyennth19/new-lop-2/actions/runs/45129448098
Draft PR #22: https://github.com/Nguyennth19/new-lop-2/pull/22
Báo cáo Drive canonical: https://docs.google.com/document/d/1-dYdMZxEuFeIw1r1MOzycRQx32EcelDzREHC2yiTIlk/edit
Bằng chứng ZIP Drive: https://drive.google.com/file/d/1XJFVg0AxDrEAfWRB4CZfW3by3yD44sGk/view
Phạm vi: D1/D2 callback spy 24 assertion groups / desktop+mobile Chrome emulation; N1-A 8 cases PASS; nguồn đóng băng không sửa. Trước đó CI 45129199895 và 45129337463 FAIL do harness fixture/blank semantics, log giữ nguyên.
W1-01: TECHNICAL_SCOPED_PASS, QA_INDEPENDENT_PENDING, W1_01_CLOSURE_PENDING; W1-02..05/DB-01..05 còn OPEN theo RTM nguồn. N0-S A3/A4, D1/D10 policy, W1-05 cuối và release NO-GO.
N4-C.7-C — W1-02 12-ROUTE DRAFTKEY CHECKPOINT (23/11/2026)
W1-02 technical CI scope: PASS. CI 45130344244 SUCCESS: 50 browser check groups, 144 distinct-key variant comparisons, 12 routes × desktop/mobile, 8 N1-A regression cases PASS. Code does not alter renderer/CSS core. Important: setData clears ephemeral memory as separate defense, so avoid claiming persistence across browser refresh or independent durable-store isolation.
Google Drive report: https://docs.google.com/document/d/1iZirPPk81QlgVV4AQQrdmJIeMWSyfJaEEVtLIkiIaeA/edit
Google Drive artifact: https://drive.google.com/file/d/146jf464cFbFElXpDPHXteGlZTjmMdOxm/view
GitHub Draft PR #23: https://github.com/Nguyennth19/new-lop-2/pull/23
Conclusion: W1_02_SCOPED_TECH_PASS / INDEPENDENT_QA_PENDING / W1_02_FORMAL_CLOSURE_PENDING; N0-S, D1/D10 policies, remaining RTM and release still NO-GO.
N4-FINAL-A CONSOLIDATED TECHNICAL & POLICY DECISION — 23/11/2026
New D10 pedagogical/a11y observable CI 45131772681 SUCCESS: 8 D10 '+'/'-'/'−'/two-step-reject scoped cases (desktop + mobile Chromium), N1-A 8/8, R1/R2 48 checks/20 screenshots, source freeze PASS. W1-03 = TECHNICAL_SCOPED_PASS, no trusted grading and no real VoiceOver/TalkBack proof. W1-04 = existing binary-origin/semantic CI scoped PASS (45114546368, 45114449881); full manifest and W1-T06 human QA review pending. W1-05 = 24 matched image pairs + Owner 4 visuals/one-phone chat accepted; human signoff/device provenance still pending. No W1-03..05 RTM CLOSED.
Selected technical policies for human signoff: D1 learner-mode semantic slot labels + fail-closed DOM/accessible name gate, LAB debug retained, no frozen source change. D10 allowlist '+'→ADD, ASCII '-' and mathematical '−'→SUB, invalid other dashes rejected; trusted server independently validates, no browser grading grant, no answer-key exposure. Both NOT implemented, Owner/independent QA approval pending. 
Drive FINAL-A report: https://docs.google.com/document/d/1jV-dsKvpqbsZcwP4RJFj4bv7-1GAOBOh24gGm42lPrE/edit
CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/45131772681
Evidence ZIP: https://drive.google.com/file/d/1FjZuZwpJE5MwItuQZpUKwbeh23rP9ixt/view
Drive checkpoint: https://drive.google.com/drive/folders/1YrLny7mAGYg5FAscrmPWxBaKElog1yTE
FINAL-A = TECHNICAL_CONSOLIDATED / FINAL-B HUMAN_GATE_RECHECK_NEXT / NO MERGE, GAS, SHEET WRITE, RELEASE.
N4-FINAL-B — FINAL ACCEPTANCE AND CONTROLLED N5 HANDOVER (23/11/2026)
N4 condition after verifying PRs #14/#16/#17..#24 all DRAFT/UNMERGED and green CI: N4_TECHNICALLY_READY_HUMAN_GATES_PENDING; N4 NOT CLOSED. GO only for N5 isolated LAB scope/source-contract preparation; no merge, production, GAS/Sheet, student release or trusted grading.
Final-B canonical Drive report: https://docs.google.com/document/d/1MJ4g3MboEq_IB-LNJs09wIeZTG3nJW1zIJYweCA88W0/edit
Drive flat sibling archive: https://drive.google.com/drive/folders/1hfHW0b6ulzsr4zYC1FlAmvZO9WjW0U6l
Human ACK ledger: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
Confirmed still missing: N0-S A3/A4 dated identity-bound receipt, independent QA reviews, D1 learner labels policy, D10 trusted grader operator policy, W1 formal closure/owner scope. CI green is scoped; DB rows remain OPEN/BLOCKED.
N5 allowed starting contract: define N5 source-backed scope and responsibilities, compatibility matrix/manifest and synthetic fixtures in independent LAB; N5 integration/release requires new explicit authorization after W1/DB gates.
No N4-C.8 or FINAL-C created: this is the single final decision; reopen only on new evidence/approval, not for administrative step proliferation.
N4-FINAL-B — ĐỐI SOÁT PHẢN BIỆN BÊN THỨ BA VÀ PR↔HEAD↔CI (23/11/2026)
Báo cáo nguồn (AI independent verification, KHÔNG phải QA ký): https://docs.google.com/document/d/1Y7BKPNpjkAT-1pNty8qUoNH9Ubyskn2W9uapzYWf3LY/edit
Danh sách CHÍNH XÁC PR mở tuần tự: #14 → #16 → #17 → #18 → #19 → #20 → #21 → #22 → #23 → #24 → #25. Tất cả Draft/Unmerged tại mốc đối soát; khác nhau giữa CI chạy mã test gốc và CI trên commit bao gồm báo cáo Markdown là bình thường nhưng phải công khai.
PR #22 HEAD 49d17dc5a2fba70a46faac9a0540f30b1f4f3eec – CI minh chứng W1-01 45129448098 SUCCESS (trên SHA test 78c88797918ff2508f69e3bb80a9c22ea7a2c648); commit đầu chứa hồ sơ có thể khác SHA CI này.
PR #23 HEAD ed4c89704a2568903d5e24d836a9ef538898a56f – CI gốc 45130344244 SUCCESS và CI cuối trên HEAD 45130767674 SUCCESS.
PR #24 HEAD 08942daadf92027903cf2d1eeecf7293e27f68bc – CI gốc 45131772681 SUCCESS và CI cuối trên HEAD 45132282477 SUCCESS.
PR #25 HEAD kiểm nghiệm N4-FINAL-B cần tra GitHub khi đối soát mới; lưu báo cáo quản trị, KHÔNG cấp quyền merge/release.
Quy ước N4/Trusted grader cần bổ sung vào hợp đồng sau khi kiểm schema: với giá trị ô D1 tùy chọn/không nhập, chuỗi rỗng "" và thuộc tính không hiện diện (undefined) đều diễn đạt chưa trả lời; số 0 hoặc chuỗi "0" là giá trị tường minh khác ô rỗng; không tự chấp nhận null hoặc chuỗi không hợp lệ nếu chưa duyệt. Đây là đề xuất hợp đồng, chưa là trusted-grader implementation PASS.
Sổ duy nhất vẫn pending chứng cứ người thật: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
Cảnh báo phân quyền: báo cáo bên thứ ba 1Y7BKPNpjkAT-1pNty8qUoNH9Ubyskn2W9uapzYWf3LY có anyone:reader. Khuyến nghị Owner chuyển Restricted nếu đây là QA nội bộ, nhưng hành động quyền chưa được thực hiện.
Ưu tiên vận hành: phiên Owner xác nhận device/OS/browser/route/time và policy D1/D10, A3/A4 do người nhận RTM tự ký, QA độc lập phân công và review; N5 preparation LAB vẫn có GO có điều kiện, N4_CLOSED và release vẫn NO-GO.
N0-S / QA-CLOSURE — NHẬT KÝ ĐỐI SOÁT RTM VÀ CHỮ KÝ ĐỘC LẬP (23/11/2026)
RTM CSV bản thô lấy lại từ Drive 10.495 bytes, SHA-256 trực tiếp d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b: PASS byte integrity. N0-S A3/A4 signature account/time vẫn PENDING, không đồng nhất kỹ thuật với người nhận độc lập.
W1 matrix: W1-01 CI 45129448098, W1-02 CI cuối 45130767674, W1-03 CI cuối 45132282477, W1-04 CI 45114546368 / 45114449881, W1-05 CI 45115735605 + ảnh parity + Owner 12 routes tự xác nhận. Tất cả 5/5 SCOPED_TECH_PASS; 0/5 QA_SIGNED và 0/5 RTM_CLOSED.
Đã truy vấn 11 PR #14,#16,#17,#18,#19,#20,#21,#22,#23,#24,#25: đều OPEN/DRAFT/UNMERGED, reviews API mỗi PR đều rỗng. Reviewer cần Owner chỉ định GitHub username có thẩm quyền, không được tự gán.
Ma trận canonical (nội bộ, không đưa tài khoản cá nhân lên GitHub): https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit mục 10; biên bản bàn giao https://docs.google.com/document/d/1MJ4g3MboEq_IB-LNJs09wIeZTG3nJW1zIJYweCA88W0/edit mục 11.
D1/D10 Owner approved-in-chat-in-principle; QA/security/grader authorization pending. Chỉ GO chuẩn bị N5 LAB isolated; NO GO merge/GAS/Sheet/trusted grading/release.
N4-GOVERNANCE-LOCK → N5-START (23/11/2026) — CHỐT BASELINE KHÔNG ĐỒNG NGHĨA N4 CLOSED
Nguồn lộ trình gốc N0–N11 https://docs.google.com/document/d/1OXxKt3d7pXXGASRew89R9T8y5QKUzf3QbRaaVWtoyRE/edit: N5 = “Đóng kỹ thuật 5 việc W1 bằng RTM”; điều kiện PASS “0 W1 blocker còn mở”; N6 mới kiểm DB-01..05, N7 writer, N8 CAS/idempotency, N9 recovery, N10 signed audit, N11 GO/NO-GO V1.3-C. Không gán nhầm N5 thành phát triển dữ liệu hay sửa Sheet.
N5-START canonical contract: https://docs.google.com/document/d/17I4dRJSXRuyiDWh2gD-T6_umP4m4FRc6rmNY02pH74U/edit; GitHub mirror trong cùng Draft PR #25.
Nguồn frozen be-hoc 1b69e277f8de6cb156f46a1d85af33bdad70c0ef, R1/R2 fe15c79b21b9f056694f8127330934d997affd45, N4-FINAL-A exact CI HEAD 08942daadf92027903cf2d1eeecf7293e27f68bc tại run 45132282477 SUCCESS. N4 source/CI proof preserved, không yêu cầu chạy lại trên docs-only commit.
RTM CSV RAW 10.495 bytes SHA256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b. W1 5/5 technical SCOPED_PASS, QA signed 0/5, RTM CLOSED 0/5; QA reviewer vẫn chưa được chỉ định; N0-S A3/A4 con người PENDING. D1/D10 Owner APPROVED_IN_CHAT_IN_PRINCIPLE; không phải release approval.
DRIVE ACCESS EXCEPTION REGISTER: Đã xác minh mẹ QA archive 1r6nUv4 và folder Final-B 1hfHW0b6 Restricted, Final-B canonical, Master Index và Sổ ký Restricted. Nhưng 3 tệp có permission trực tiếp: 1Y7BKPN... report bên 3 anyone:reader, 1yTEOB... báo cáo N4-C6 anyone:reader, 1xz-9tx... RTM N0-S receipt anyone:commenter. Chưa sửa quyền; Owner phải cho phép/sắp xếp quyền người đọc đã biết. Không công bố ALL_RESTRICTED.
N4 GOVERNANCE_LOCK = BASELINE_LOCKED_WITH_THREE_ACCESS_EXCEPTIONS_AND_HUMAN_SIGNOFF_PENDING. N5_STARTED_SCOPE_READINESS_ONLY; không phải N5 PASS, NO_GO merge/GAS/Sheet/trusted grade/learner.

## N5-W1-CLOSURE — RTM evidence & independent QA readiness / 2026-11-23
Decision: **N5_TECHNICALLY_READY_HUMAN_GATES_PENDING**, W1 5/5 technical scoped PASS; 0/5 independent QA signed; 0/5 RTM formally CLOSED. No release grant. Canonical detailed 12-column matrix: [N5 W1 closure](N5_W1_CLOSURE_RTM_INDEPENDENT_QA_READINESS_20261123.md), documentation commit 59abe46552f6018af578d220338869e37f9fd291 (subsequent docs-only commits do not invalidate previously tested runtime SHA). Drive counterpart: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit; N5 START: https://docs.google.com/document/d/17I4dRJSXRuyiDWh2gD-T6_umP4m4FRc6rmNY02pH74U/edit. Issue #15 https://github.com/Nguyennth19/new-lop-2/issues/15#issuecomment-7095719691 ; PR #25 https://github.com/Nguyennth19/new-lop-2/pull/25#issuecomment-7095720483.
W1-01 CI45129448098/78c88797, W1-02 CI45130767674/ed4c8970, W1-03 CI45132282477/08942daad, W1-04 CI45114546368/5e09b4a4 and CI45114449881/88a7b26f, W1-05 CI45115735605/b467befb. N0-S A3/A4 pending recipient signed verification. Owner 12 routes on Samsung Android tablet Chrome/Samsung by chat; timestamp unknown. QA independently review all 11 Draft PR and sign existing single register; DB-01 BLOCKED, DB-02..05 OPEN. NO MERGE/GAS/SHEET/TRUSTED GRADING/STUDENT RELEASE.


## N6 — DB-01..05 READ-ONLY AUDIT CHECKPOINT / 2026-11-23
Decision: `N6_READONLY_AUDIT_COMPLETED_REMEDIATION_READY_HUMAN_GATES_PENDING`. No TEST writes, no DB remediation PASS and no change to frozen renderer/main/be-hoc. Full detailed source-locked report: [N6 DB01..05 read-only audit](N6_DB01_DB05_READONLY_AUDIT_REMEDIATION_READINESS_20261123.md), initial report commit `6e870fd3b862a53e89a3b0b974c3aa316310f6e8`. Drive readback/mirror [N5/N6 landing](https://docs.google.com/document/d/17I4dRJSXRuyiDWh2gD-T6_umP4m4FRc6rmNY02pH74U/edit) and [Master QA Index](https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit). [Issue #15 checkpoint](https://github.com/Nguyennth19/new-lop-2/issues/15#issuecomment-7095798913), [PR #25](https://github.com/Nguyennth19/new-lop-2/pull/25#issuecomment-7095799983).
Direct read-only Sheet TEST 7 tabs (2026-11-23): 2 D2 LV2 synthetic requests, 2 QA-pending validators, no approval or rollback rows, no ACTIVE version. Code `af02456fcc2b3be856091edc899c699890d74da0` uses 2026-11-20 captured snapshot, no live CAS or write. DB-01 BLOCKED sequencing; DB-02 schema/generator coverage OPEN; DB-03 idempotent append-only writes OPEN; DB-04 stale snapshot/TOCTOU/CAS OPEN; DB-05 signatures/AI trust boundary OPEN. All DB-T01..15 proposed, not executed. N5 0/5 independent QA signed and 0/5 RTM CLOSED. NO MERGE, GAS, SHEET WRITE, TRUSTED GRADING OR LEARNER RELEASE.
