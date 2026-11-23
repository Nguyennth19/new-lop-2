# N4-FINAL-B — Drive read-only audit snapshot

Google Drive canonical: https://docs.google.com/document/d/1MJ4g3MboEq_IB-LNJs09wIeZTG3nJW1zIJYweCA88W0/edit
Drive revision: AHj4eMSfuaco5xv0ZzMKfzgrBypOTpB3FFZIWcW66coJEFmeFcTz-H6P-oK6SYSWmQITAtoXFNaAozD1pUdNmVqbararV8lKUCnAZXOfEQ
Status: CSV_BYTE_SHA256_PASS / N0S_A3_A4_HUMAN_ACK_PENDING / W1_TECH_SCOPED_5_OF_5_PASS / W1_INDEPENDENT_QA_SIGNED_0_OF_5 / RELEASE_NO_GO.
Note: private signer/account fields are NOT copied to GitHub. Source of truth for human signoff is the existing restricted register; never infer QA signatures from this snapshot.

N4-FINAL-B — FINAL ACCEPTANCE DECISION & CONTROLLED N5 HANDOVER
Dự án Lớp 2 – Universal Learning Template V1 | LAB-only
Ngày quyết định hồ sơ: 23/11/2026 (GMT+7)
Mã: ULT_N4_FINAL_B_ACCEPTANCE_N5_HANDOVER_20261123_V1
KẾT LUẬN: N4_TECHNICALLY_READY_HUMAN_GATES_PENDING
QUYỀN: CONDITIONAL_GO_N5_ISOLATED_PREPARATION_ONLY
KHÔNG ĐƯỢC: N4_CLOSED / W1_05_CLOSED / MERGE / GAS_TEST_OR_MAIN / WRITE_SHEET / LEARNER_RELEASE / TRUSTED_GRADE_GRANT
Biên bản này được lập từ đối soát AI và nguồn kỹ thuật; không chứa chữ ký Owner hoặc QA độc lập được giả lập.
1. ĐỐI TƯỢNG ĐỐI SOÁT VÀ MÃ NGUỒN KHÓA
GitHub repository: https://github.com/Nguyennth19/new-lop-2
Nguồn gốc be-hoc frozen: 1b69e277f8de6cb156f46a1d85af33bdad70c0ef
R1/R2 baseline: fe15c79b21b9f056694f8127330934d997affd45
N4-FINAL-A đã xác minh CI theo commit: 08942daadf92027903cf2d1eeecf7293e27f68bc
Nhánh bàn giao N4-FINAL-B tạo từ đúng commit này: lab/ult-n4-final-b-n5-handover-20261123
PR #14, #16, #17, #18, #19, #20, #21, #22, #23, #24: tất cả OPEN/DRAFT/UNMERGED tại thời điểm kiểm. Chuỗi PR tuyến tính theo base; không lấy số PR làm số lỗi.
Không tự coi các Draft PR/CI là thay đổi đã đi vào MAIN, be-hoc, GAS hoặc ứng dụng học sinh.
Sổ ký nhận DUY NHẤT: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
Master QA Index canonical: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit
RTM CSV gốc: https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view ; 10.495 byte, SHA-256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b.
Issue tracking chung: https://github.com/Nguyennth19/new-lop-2/issues/15
2. MA TRẬN CHỨNG CỨ KỸ THUẬT
N4-A tải ảnh nhị phân thật: CI 45114546368 SUCCESS với nguồn local/pinned; live-origin representative CI 45114449881 SUCCESS. Không nhận toàn bộ kho đã kiểm HTTP live.
N4-B đối chứng ảnh: CI 45115735605 SUCCESS với 24 cặp trên 12 routes/2 viewport; N4-C.2 có 20/20 cặp còn lại RGBA parity, bốn ảnh D1/D10 Owner đã chấp nhận qua chat. Byte PNG D2 khác không đồng nghĩa thay đổi pixel.
N4-C.3 Chromium interaction: CI 45118577956 SUCCESS; mobile emulation không thay bằng chứng Android/iOS vật lý.
N4-C.3-B phone LAB package: CI 45119493865 SUCCESS, Owner đã báo trong chat thử điện thoại theo LAN và thấy “rất ok”; không xác minh tên máy, OS, browser, từng thao tác hoặc chữ ký độc lập.
W1-01 D1/D2 restore guard: CI 45129448098 SUCCESS cho callback/focus/zero vs empty trong 24 assertion groups trên Chrome; source scope QA-only. Closure vẫn PENDING.
W1-02 5-part DraftKey, 12-route lifecycle: CI 45130767674 SUCCESS với 50 browser groups, 144 biến thể key trong fixture LAB; không suy luận sang persistent draft storage/server. Closure PENDING.
W1-03 D10 UI và pedagogy/a11y DOM: CI 45132282477 SUCCESS trong suite có 8 trường hợp cộng/trừ/two-step reject (đã tính trong log 45131772681), regression N1-A 8/8, R1/R2 48/48. Có aria labels cho 5 field, không phải VoiceOver/TalkBack thực; grading NO_GRANT. Closure PENDING.
W1-04 binary + exact-count: có CI positive/negative theo phạm vi đã chạy; cần reviewer đối chiếu W1-T06A/B/C theo đúng manifest/scope. Closure PENDING.
W1-05 24 cặp matched, Owner visual/phone chat accepted; chưa có authenticated identity-bound Owner scope/time + QA độc lập. Closure PENDING.
RTM DB-01..05 vẫn OPEN/BLOCKED với đúng canonical requirements; không thay nhãn sai: DB-01 sequencing W1 trước V1.3-C; DB-02 schema/generator multi-family; DB-03 repeated writeback/idempotency; DB-04 stale snapshot/TOCTOU/live CAS; DB-05 signed approval/AI-candidate trust boundary.
3. GATE NGƯỜI THẬT VÀ PHÊ DUYỆT CHÍNH SÁCH
N0-S A3/A4: hồ sơ receipt trên Drive vẫn có placeholder “Thời điểm: [Ngày giờ GMT+7]”. Mặc dù có [PASS] và tài khoản viết trong nội dung, chưa được chứng minh là xác nhận đã ký bởi người nhận qua tài khoản và thời điểm thực: PENDING.
Issue #15: chưa có bình luận xác nhận độc lập qua tài khoản GitHub tại lần kiểm; PR #23/#24: không có review người thật được ghi nhận.
Owner trong chat đã duyệt ảnh D1/D10 và báo trải nghiệm điện thoại tích cực: OWNER_CHAT_ACCEPTED_SCOPE_ONLY.
D1 POLICY: chọn phương án kỹ thuật A+B để trình phê duyệt — semantic learner labels trong presentation adapter + fail-closed rendered DOM/accessibility learner gate. Chưa duyệt có định danh, chưa triển khai; bản LAB có thể giữ nhãn TEST nhưng bản học sinh phải chặn.
D10 POLICY: đề xuất '+' U+002B=>ADD; '-' U+002D và '−' U+2212=>SUB, các dash khác từ chối. Trusted server độc lập xác minh lessonId/skillId/variant/private revision, tính/chấm phép một bước, không tin sum/answer do client, không lộ answer key. Chưa được ký duyệt hoặc kiểm trusted grading live.
Reviewer độc lập và Owner/edtech/authorized grading authority phải xác nhận cụ thể theo đúng scope/SHA trước khi đánh dấu APPROVED. Không dùng AI review, [PASS] trong bản nháp, PR Draft hoặc phê duyệt bằng lời không định danh làm chữ ký cuối.
4. PHÁN QUYẾT HAI TRỤC, KHÔNG TRỘN LẪN
TECHNICAL: TECHNICALLY_READY_FOR_N5_LAB_DESIGN_HANDOVER. N4-A/B/C và W1-01..05 đã có bằng chứng PASS đúng các phạm vi kiểm thử được ghi, không có yêu cầu thiết kế lại UI do Owner báo ổn.
HUMAN/ADMIN: HUMAN_GATE_PENDING; N0-S receipt; độc lập QA; policy D1/D10; W1 row-level final closure; thông tin physical-device provenance; release authority chưa được chốt.
N4_FINAL_STATUS = TECHNICALLY_READY_HUMAN_GATES_PENDING; NOT CLOSED.
W1/DB final status = OPEN/BLOCKED per source RTM unless independently signed with evidence.
N4 hoàn thành đợt final review nhưng không được tuyên bố “100% N4 CLOSED”.
5. N5 HANDOVER BOUNDARY — ĐƯỢC LÀM VÀ KHÔNG ĐƯỢC LÀM
Cho phép chuẩn bị N5 trên LAB cô lập: nghiên cứu, rà soát nguồn tài nguyên đã PASS, soạn kiến trúc/manifest/contract, test fixtures synthetic, schema/validator khép kín và ma trận tương thích N4→N5; không phát sinh học sinh thật hoặc viết dữ liệu ngoài LAB.
Bước mở N5 đầu tiên đề xuất: N5-START — Scope, Source Lock & Readiness Contract. Nhiệm vụ: xác định rõ phạm vi N5 dựa trên kế hoạch sản phẩm/RTM nguồn, input/output không làm thay đổi renderer đã nghiệm thu; dùng các JSON/manifest/contract sẵn có; xác minh thứ tự triển khai và cổng kỹ thuật/pháp lý. Tránh tự dựng N5 chức năng mới chỉ từ tên giai đoạn.
N5 cần một nhánh LAB riêng từ commit khóa được duyệt; không tự merge PR #14..#24, không đưa qua main/be-hoc, không GAS TEST/MAIN, không cập nhật Sheets chính thức, không Trusted Grade, không đưa ra học sinh. Các thay đổi trong QA LAB nếu cần phải có CI và rollback riêng.
N5 scope chỉ trở thành triển khai/tích hợp thật khi: W1 closures có signoff, DB-01 sequence gate đủ, data/schema/grading bank chính sách đã phê duyệt, trusted server/security, Owner/QA authentic signoff và release/rollback decision.
Không đợi toàn bộ DB code mới được thiết kế sơ đồ hoặc fixture của N5, nhưng tuyệt đối không đi đường vòng qua “GO LAB preparation” để phát hành.
6. CÔNG VIỆC CON NGƯỜI CẦN ĐÓNG, KHÔNG MỞ THÊM NHÁNH N4
A. Người nhận RTM xác minh độc lập checksum, điền account và timestamp vào N0-S receipt (hoặc bình luận được xác thực); không nhờ AI ký.
B. Owner làm rõ thông tin loại máy/OS/browser và phạm vi từng phần đã test nếu tài liệu bắt buộc; không yêu cầu thử lại nếu đã có chứng cứ đương thời.
C. QA độc lập review PR #14..#24 theo chain và gate từng RTM W1; ghi APPROVED hoặc CHANGES_REQUIRED có SHA/CI/link/time; không ký thay.
D. Owner/pedagogy phê duyệt D1 policy, người chịu trách nhiệm trusted grading phê duyệt D10 policy và test/QA riêng trước learner.
E. Người chịu quyền phát hành chốt riêng GO/NO-GO cho mọi merge/GAS/Sheet/learner release sau RTM W1/DB closure.
Những việc trên sẽ chỉ cập nhật Sổ ký nhận N4-C.6, không tạo thêm 5 phiếu ký trùng.
7. DUAL ARCHIVE, OWNERSHIP VÀ KHẢ NĂNG TIẾP NHẬN
Google Drive: báo cáo native restricted thuộc checkpoint N4-FINAL-B, sổ ký và master index giữ URL gốc; evidence ZIP/ảnh bất biến lưu tại folder nguồn, không sao chép hàng loạt.
GitHub: nhánh LAB có Markdown mirror báo cáo/handover, Draft PR có mã commit và CI link; Issue #15 ghi checkpoint; bản GitHub không chứa email/tài khoản riêng tư và không đóng vai trò chữ ký.
Mỗi nguồn có URL chéo, source SHA, ngày, scope, ai ký (nếu được xác minh), trạng thái kỹ thuật/human và rollback. Nếu chỉ một bên được ghi, phải dán SYNC_PENDING thay vì công bố 2 bên đã đồng bộ.
Người thứ ba bắt đầu từ Master QA Index → báo cáo N4-FINAL-A → báo cáo N4-FINAL-B → PR/CI + evidence archive → Sổ ký nhận. Không phải đọc lại toàn bộ cuộc trò chuyện.
8. ĐIỀU KIỆN KÍCH HOẠT QUYẾT ĐỊNH N4 CLOSED SAU NÀY
Chỉ sau khi nhận đủ signoff theo RTM W1-01..05, N0-S A3/A4, QA độc lập, phê duyệt learner D1 / D10 private grader và các yêu cầu device/rollback cần thiết: đối soát lại revision + tài khoản + SHA ở một điểm quyết định. Cập nhật riêng trạng thái N4 CLOSED hoặc CHANGES_REQUIRED. Không chạy lại các CI đã PASS khi frozen SHA không đổi trừ khi chính sách yêu cầu phạm vi mới.
Tại lần đối soát này không đủ bằng chứng để cấp N4 CLOSED; đây là kết luận hoàn tất đợt N4-FINAL-B, không phải yêu cầu mở N4-FINAL-C hay một loạt N4-C.x.
9. CHECKPOINT LƯU ĐỒNG THỜI SAU KHI TẠO DRAFT PR
Draft PR #25: https://github.com/Nguyennth19/new-lop-2/pull/25
GitHub Markdown: https://github.com/Nguyennth19/new-lop-2/blob/lab/ult-n4-final-b-n5-handover-20261123/qa/universal-template-n4-prep/governance/N4_FINAL_B_ACCEPTANCE_N5_HANDOVER_20261123.md
Master QA Index: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit
Status khóa: N4_TECHNICALLY_READY_HUMAN_GATES_PENDING; N5_LAB_PREPARATION_GO; N4_CLOSED_NOT_GRANTED; RELEASE_NO_GO.
10. PHẢN BIỆN BÊN THỨ BA VÀ KẾT LUẬN KIỂM SOÁT SAU N4-FINAL-B — 23/11/2026
Nguồn đối soát: https://docs.google.com/document/d/1Y7BKPNpjkAT-1pNty8qUoNH9Ubyskn2W9uapzYWf3LY/edit
Phân loại: AI_INDEPENDENT_VERIFICATION_ONLY, không phải chữ ký QA độc lập. Chấp nhận kiến nghị phiên ký nhận tập trung trước khi mở rộng N5, nhưng không biến khuyến nghị ngắn hạn thành cam kết rằng QA độc lập đủ sức ký toàn chuỗi PR trong một phiên.
Đã xác minh nguồn có quyền anyone:reader, còn Sổ ký nhận N4-C.6 Restricted. Chuyển quyền nguồn sang Restricted cần quyết định của Owner; không tự sửa quyền.
Điểm cần cập nhật: Master QA Index phải nêu đủ PR #14,#16..#25, HEAD, CI thử nghiệm ban đầu và CI trên HEAD (PR #23: 45130344244 → 45130767674; PR #24: 45131772681 → 45132282477). Đã lập phụ lục chính xác trong Master QA Index, không sửa các đoạn lịch sử trước đó để tránh xóa truy vết.
Hợp đồng tương lai cần quy định blank D1: "" tương đương trường vắng (undefined) trong ngữ nghĩa chưa trả lời; tuyệt đối khác số 0 hoặc "0". Chỉ là kiến nghị giao diện trusted-server, chưa có phê duyệt/implementation.
Thứ tự khuyến nghị: (1) Owner tự xác nhận thiết bị và phê duyệt có phạm vi D1 A+B/D10 allowlist; (2) người nhận RTM xác thực độc lập A3/A4 + thời điểm, phân công QA có thẩm quyền; (3) QA review W1-01..05 trên SHA và tài liệu một lần; (4) chuẩn bị N5 scope/manifest trên LAB. Không tăng danh sách PR hoặc bắt đầu code tích hợp N5 khi chưa đủ người kiểm soát.
Tình trạng không đổi: N4_TECHNICALLY_READY_HUMAN_GATES_PENDING; N5_LAB_PREPARATION_CONDITIONAL_GO; N4_CLOSED/RELEASE_NO_GO.
11. N0-S / QA-CLOSURE — BÀN GIAO MA TRẬN VÀ QA ĐỘC LẬP (23/11/2026)
Tính lại từ file CSV RAW ở Drive: SHA-256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b, 10.495 bytes — BYTE_INTEGRITY_PASS. Đóng A3/A4 cần đúng người nhận ký bằng tài khoản/thời điểm có chứng cứ. Mẫu còn placeholder, không tự điền.
W1-01..W1-05: 5/5 TECHNICAL_SCOPED_PASS theo bộ bằng chứng từng hàng tại Sổ ký nhận N4-C.6 mục 10; 0/5 QA SIGNED; 0/5 RTM CLOSED. GitHub: 11/11 Draft PR #14,#16..#25 đều chưa merge và API reviews của 11 PR đều rỗng.
Owner đã quyết định D1 A+B và D10 ADD/SUB về nguyên tắc qua chat; chưa đồng nghĩa QA độc lập hoặc cấp quyền chấm học sinh.
Người QA độc lập: OWNER_ASSIGNMENT_REQUIRED (cần GitHub username, phạm vi và quyền tài liệu; không tự gán reviewer). Sau phân công, QA review toàn chuỗi PR và đối chiếu 5 hàng W1 theo required_new_tests và close_gate trong CSV nguồn. Việc này có thể dùng một reviewer bao quát hoặc phân tách chuyên môn accessibility/asset/security; chữ ký phải xác thực.
Handover: chỉ GO N5 isolated LAB scope/contract preparation theo N4-FINAL-B; giữ tất cả NO-GO merge, GAS, Sheet, W1/DB closure, trusted grading, learner release.