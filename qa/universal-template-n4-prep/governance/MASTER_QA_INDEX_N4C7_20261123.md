<!-- Google Drive canonical edited Doc: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit -->
<!-- Source base commit: 1ad172bae5b15a5e83012fe2538e3082fff0347c -->

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
N4-C.1: https://docs.google.com/document/d/1V0gNmUbT7ZAf8y18siwuMCEGLBmB8i6_Oegp-53qZ5E/edit (xem nguồn đối chiếu N4-B bên dưới).
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
