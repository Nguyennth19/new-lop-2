# N5-START — Scope, Source Lock & W1 RTM Readiness Contract

Google Drive canonical: https://docs.google.com/document/d/17I4dRJSXRuyiDWh2gD-T6_umP4m4FRc6rmNY02pH74U/edit
Google Drive revision: AHj4eMQB3GVamAIDhjntBvC2PkLAYrCdEkSBueljTjpIBQ8wxLN05QRupgHKSR_1tBCSRuowXXk3xBSomSZ5TXoqXIIHdXF9jsQ5v5HBzA
Authority: source N0–N11 roadmap https://docs.google.com/document/d/1OXxKt3d7pXXGASRew89R9T8y5QKUzf3QbRaaVWtoyRE/edit
State: N5_STARTED_SCOPE_AND_EVIDENCE_INTAKE_ONLY, N5_PASS_PENDING_0_W1_BLOCKERS, N4_GOVERNANCE_BASELINE_LOCKED_WITH_ACCESS_EXCEPTIONS.
No human or QA signature inferred. No source code, GAS, Sheet, or release action authorized.

ULT N5-START — SCOPE, SOURCE LOCK & W1 RTM READINESS CONTRACT
Dự án Lớp 2 / Universal Learning Template V1 — 23/11/2026 (GMT+7)
Trạng thái: N5_STARTED_IN_SCOPE_AND_EVIDENCE_INTAKE_ONLY
N4: GOVERNANCE_BASELINE_LOCKED_WITH_ACCESS_EXCEPTIONS / TECHNICALLY_READY_HUMAN_GATES_PENDING
N5: PASS GATE NOT MET — 5 W1 SOURCE RTM ROWS STILL OPEN; QA independent signatures 0/5.
1. NGUỒN QUY PHẠM VÀ SỬA LẠI ĐỊNH NGHĨA N5
Theo “Báo Cáo Phản Biện Chuyên Sâu & Đối Chiếu Độc Lập (Bản Chốt 23/11/2026)”, mục 4, “Hàng đợi triển khai có cổng N0–N11”, đoạn “Chặng P0 – Đóng dứt điểm W1”:
Nguồn gốc roadmap: https://docs.google.com/document/d/1OXxKt3d7pXXGASRew89R9T8y5QKUzf3QbRaaVWtoyRE/edit
N0: Khóa nguồn, lập RTM.
N1: W1-01 Restore Guard D1/D2.
N2: W1-02 Composite DraftKey & 12 LabRenderHandle.
N3: W1-03 D10 one-operation.
N4: W1-04 binary assets, W1-05 24 matched screenshot pairs.
N5: “Đóng kỹ thuật 5 việc W1 bằng RTM”; đầu ra CI đúng HEAD và biên bản duyệt thiết bị; PASS yêu cầu “0 W1 blocker còn mở”.
N6: Kiểm chứng/lập đề xuất sửa DB-01..05 trên Sheet TEST, phê duyệt riêng trước mọi ghi.
N7: Single Writer và quyền ghi TEST.
N8: CAS/revision, idempotency, journal.
N9: Recovery/fault injection/rollback.
N10: Kiểm toán độc lập và Owner ký duyệt.
N11: GO/NO-GO mở ULT-V1.3-C.
Do vậy N5 KHÔNG được định nghĩa lại là data schema, DB remediation, generator multi-family, hay Big Data B001–B024. Những ý này là dependency/dòng công việc về sau (N6+, R3/R4 hoặc pha nội dung), cần phê duyệt và gate riêng.
Tài liệu roadmap là đánh giá độc lập AI tổng hợp lộ trình; khi xuất hiện quyết định cao hơn được xác thực thay đổi N0–N11, chỉ cập nhật theo change control.
2. KHÓA NGUỒN VÀ CỔNG N4 GOVERNANCE
Bất biến frozen be-hoc: 1b69e277f8de6cb156f46a1d85af33bdad70c0ef. R1/R2: fe15c79b21b9f056694f8127330934d997affd45.
N4-FINAL-A CI SUCCESS 45132282477 ở HEAD 08942daadf92027903cf2d1eeecf7293e27f68bc.
N4-FINAL-B baseline Draft PR #25 tại https://github.com/Nguyennth19/new-lop-2/pull/25; baseline doc-only QA bắt đầu tại f86bb176c384e5ad4b3bd22fac1cd22fef56e135; việc cập nhật Markdown hành chính KHÔNG thay frozen renderer/CSS hoặc tương đương chạy lại kỹ thuật.
Chuỗi PR đang Draft và chưa merge: #14,#16,#17,#18,#19,#20,#21,#22,#23,#24,#25. Cấm tự merge, squash/rebase, đổi main/be-hoc hoặc GAS production.
RTM canonical: https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view; 10.495 byte, SHA-256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b, đã tính lại từ RAW ở checkpoint N0-S/QA-CLOSURE.
Sổ ký con người DUY NHẤT: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit ; không tạo sổ mới.
Master QA Index canonical: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit.
Issue quản trị: https://github.com/Nguyennth19/new-lop-2/issues/15.
3. MA TRẬN W1 CỦA CỔNG N5
W1-01 Restore Guard: kỹ thuật SCOPED_PASS CI 45129448098; QA độc lập CHƯA KÝ; RTM OPEN. Đối soát T01/T02 callback 1 final, invalid draft atomic, D1/D2 0 khác blank, focus, PV100/PV1000/borrow. Ngữ nghĩa blank: chuỗi rỗng và trường thiếu đều là chưa trả lời nhưng 0 khác blank; server contract tương lai cần duyệt.
W1-02 DraftKey: kỹ thuật SCOPED_PASS CI 45130344244 và HEAD 45130767674; QA độc lập CHƯA KÝ; RTM OPEN. T03/T04 5 phần identity + 12 routes, giới hạn setData xóa RAM khi đổi pack.
W1-03 D10: kỹ thuật SCOPED_PASS CI 45131772681 và HEAD 45132282477; QA độc lập CHƯA KÝ; RTM OPEN. T05 1 toán tử, 5 field, accessible names; Owner duyệt nguyên tắc D10 trong chat. VoiceOver/TalkBack/trusted grading vẫn chưa chứng minh.
W1-04 Binary/Exact Count: kỹ thuật SCOPED_PASS CI 45114546368/45114449881; QA độc lập CHƯA KÝ; RTM OPEN. T06A/B/C xác minh scope local+origin sample và positive/negative, chưa suy rộng thành toàn bộ HTTP asset.
W1-05 Visual 24 pairs: kỹ thuật SCOPED_PASS CI 45115735605, 20/20 pixel parity còn lại; Owner tự khai Samsung “tab” chạy Android, browser “chrom, samsung”, thử 12/12 route, THỜI ĐIỂM KIỂM THỬ CHƯA XÁC ĐỊNH. QA độc lập CHƯA KÝ; RTM OPEN.
TỔNG: 5/5 W1 có technical scoped evidence, 0/5 QA SIGNED, 0/5 RTM CLOSED; chưa đạt 0 blockers theo gate N5.
D1 policy A+B và D10 ADD/SUB allowlist: OWNER_APPROVED_IN_CHAT_IN_PRINCIPLE; chưa có QA/security/trusted-grader implementation acceptance hoặc learner release grant.
N0-S A3/A4: RAW integrity PASS kỹ thuật, xác nhận người nhận có tài khoản và thời điểm thật vẫn PENDING. Không dùng ngày lập tài liệu thay thời điểm người nhận.
DB-01 BLOCKED; DB-02..05 OPEN theo RTM, không đóng giả trong N5.
4. HỢP ĐỒNG N5 – PHẠM VI ĐƯỢC PHÉP
A. Read-only proof intake: thu xếp 5 hàng RTM có canonical_requirement, required_new_tests, close_gate, link assertion, CI exact commit SHA, artifact Drive, Owner evidence, reviewer verdict và limitation.
B. W1-05 device scope: ghi nhận Owner chat có 12/12 route trên Android Samsung tab; chưa ghi model cụ thể, OS/browser version, timestamp, matrix từng browser. Không tự hoàn thiện hay ép thử lại nếu reviewer chấp nhận scope thực tế; nếu cần Android/iOS/browser đầy đủ trước learner thì yêu cầu gate riêng.
C. Human QA: Owner chỉ định reviewer độc lập khác người viết PR, đủ quyền read Restricted; reviewer thực sự kiểm 11 Draft PR, đánh giá từng hàng W1 và ghi xác nhận bằng tài khoản/timestamp/SHA trong Sổ ký N4-C.6 hoặc GitHub review. Không gán tài khoản trống.
D. Quyết định: chỉ có quyền ghi W1 CLOSED khi mỗi close_gate RTM đã thỏa, CI đúng HEAD, QA+Owner scope xác thực; nếu không, giữ OPEN và báo CHANGES_REQUIRED cùng bằng chứng, không thêm tên substage.
E. Documentation mirrors: cập nhật Master QA Index, Final-B handover, Issue #15 và PR #25 doc-only. N5-START chỉ tài liệu; chưa có nhu cầu mở PR kỹ thuật mới hoặc code.
F. Rollback: trở về commit CI-verified N4-FINAL-A 08942daadf... và GitHub branch Draft nguyên gốc; mọi sửa docs append-only/revision, không xoá chứng cứ cũ.
5. QUYỀN TRUY CẬP — GOVERNANCE LOCK KHÔNG PHẢI SECURITY LOCK HOÀN TOÀN
Đã kiểm metadata trực tiếp: QA archive parent 1r6nUv4... restricted; N4-FINAL-B folder restricted; N4 Final B report, Master QA Index, Sổ ký restricted.
Có ngoại lệ trực tiếp chưa xử lý: báo cáo phản biện bên thứ ba 1Y7BKPN... anyone:reader nằm trong thư mục Final-B restricted; báo cáo N4-C.6 1yTEO... anyone:reader; N0-S RTM receipt 1xz-9... anyone:commenter. Parent restricted KHÔNG ngăn permission trực tiếp trên file.
Các quyền ngoại lệ phải được Owner duyệt phạm vi chia sẻ trước khi đổi và kiểm lại sau đổi. Không tuyên bố “ALL RESTRICTED”; chưa đổi quyền ở checkpoint này. Không copy email cá nhân vào GitHub.
6. CONDITIONS TO EXIT N5 AND HANDOVER TO N6
Khi cả năm W1 được reviewer độc lập và Owner xác nhận đúng từng điều kiện RTM; N0-S receipt được ký; bản evidence/index có SHA đúng HEAD; không còn W1 blocker liên quan. Quyết định N5 PASS phải được chốt có người ký và phạm vi, không tự suy từ CI xanh.
Sau đó N6 mới kiểm riêng DB-01..05 ở READ-ONLY/DRY-RUN; quyền ghi TEST phải được cấp duyệt riêng; không chạm Google Sheet sản phẩm, câu trả lời riêng tư, hoặc thông tin học sinh.
Cho đến khi đạt gate: N5_OPEN_W1_FORMAL_CLOSURE_PENDING; CONDITIONAL_GO_EVIDENCE_INTAKE_ONLY; NO_GO_MERGE_GAS_SHEET_TRUSTED_GRADE_LEARNER_RELEASE.