# Master QA Index – Drive canonical snapshot

Drive: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit
Revision: AHj4eMTX2Mh-Is_oJ3BEZaoyxX4suBMLzjOQ-7fTIs3mY8-pyGuPsMkaoRkU67B__nZDR0EzYgRlPGJXKxeUX3rkQu1QL1Q0Hn3cSqtypg
Read-only redacted GitHub mirror; human QA signoff must occur under authenticated identity on restricted Drive/GitHub. Latest appendices supersede earlier status labels.

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