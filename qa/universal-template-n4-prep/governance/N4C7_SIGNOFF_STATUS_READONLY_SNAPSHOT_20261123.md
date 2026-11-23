# ULT N4-C.6 – Human Evidence Intake & Signoff Register – 20261123

> REDACTED READ-ONLY AUDIT MIRROR. Editable canonical signoff/policy on restricted Drive: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
> Source Google Docs revision at mirror: AHj4eMQ0bT4EL37za5CU4yVnarDdV2M4d7Y2nl__sf1XCQDt9TSHnHksGQX4iriF7Y_ooUEHpNK6XYx3FxZFep_nZlYyEt9stc6vIQjwdg
> Mirrored for third-party status review; GitHub text IS NOT a human-signed receipt and MUST NOT be edited to forge signature.

N4-C.6 – HUMAN EVIDENCE INTAKE & SIGNOFF REGISTER
Dự án Lớp 2 / Universal Learning Template V1 | LAB-only
Ngày rà soát: 23/11/2026 (GMT+7)
HỒ SƠ TIẾP NHẬN: AI_PREPARED / HUMAN_ACK_PENDING / NO_GO_W1_05
Không có chữ ký được điền hộ; mỗi người tự xác nhận qua tài khoản đã được phân công.
1. PHÁN QUYẾT PHẠM VI
Có bằng chứng kỹ thuật đủ điều kiện chuyển sang thu nhận chứng cứ con người (GO_EVIDENCE_INTAKE_ONLY).
Không có cơ sở để coi toàn bộ N0-S, W1-05, QA độc lập, quyền merge hoặc phát hành là hoàn tất. Tách kỹ thuật PASS khỏi chứng cứ con người và chính sách xử lý sư phạm.
Từ việc Owner đã nói bốn ảnh D1/D10 đạt và thử nghiệm LAB trên điện thoại “rất ok”, ghi OWNER_ACCEPTANCE_VIA_CHAT_FOR_STATED_SCOPE. Không tự suy ra Android+iOS, các thao tác riêng, danh tính tài khoản ký hoặc thời điểm chính xác.
2. DANH SÁCH BẰNG CHỨNG ĐÃ KHÓA
N0-S frozen: be-hoc 1b69e277f8de6cb156f46a1d85af33bdad70c0ef; R1/R2 fe15c79b21b9f056694f8127330934d997affd45; V1.3-B af02456fcc2b3be856091edc899c699890d74da0.
N4-A (ảnh nhị phân): CI 45114546368 PASS; live-origin CI 45114449881 PASS.
N4-B (48 ảnh/24 cặp): CI 45115735605 PASS; N4-C.1 Owner đã chấp nhận 4 ảnh bằng lời trong chat; N4-C.2 20/20 RGBA đồng nhất.
N4-C.3 (Chromium desktop/mobile): CI 45118577956 PASS.
N4-C.3-B (gói LAB tự chứa): CI 45119493865 PASS; commit 1ad172bae5b15a5e83012fe2538e3082fff0347c; Owner đã thử điện thoại và cho nhận xét tích cực qua chat.
PR #18 b467befbf5532c7dd3c1e04222d71aed7519a73d, #19 f6acdbba1e96f8d70110a1512a88d648286fe7dd, #20 1ad172bae5b15a5e83012fe2538e3082fff0347c đều OPEN, DRAFT, UNMERGED khi kiểm.
GitHub Issue #15 chưa có bình luận ký nhận; bản N0-S A4 còn ô thời điểm chưa điền.
3. BẢNG NHẬN BẰNG CHỨNG — MỖI HÀNG CÓ CHỦ THỂ VÀ CỔNG
N0S-A3-RTM-CHECK: NGƯỜI NHẬN ĐỘC LẬP tự tải CSV, tính SHA-256, đối chiếu 10.495 byte và 10 dòng lỗi; điền thời điểm, tài khoản và chữ ký/bình luận ở tài liệu receipt. Trạng thái: PENDING.
N0S-A4-ACK: NGƯỜI NHẬN có thẩm quyền xác nhận tiếp nhận và phạm vi chứng cứ, không tự cấp quyền phát hành. Trạng thái: PENDING.
N4-OWNER-VISUAL: OWNER đã xác nhận D1/D10 desktop/mobile qua chat; ghi phạm vi rõ, có thể bổ sung tài khoản/thiết bị và thời điểm kiểm nếu sẵn có. Trạng thái: ACCEPTED_BY_CHAT, chưa identity-bound.
N4-DEVICE-EVIDENCE: OWNER điền loại điện thoại, OS, trình duyệt, route/kiểm tra, thời điểm và ảnh/video nếu có. Trạng thái: DETAILS_PENDING. Không yêu cầu thử lại toàn bộ nếu có bằng chứng đương thời đầy đủ.
N4-IND-QA: NGƯỜI QA ĐỘC LẬP phải xem cả ba PR #18/#19/#20 và hồ sơ Drive, kiểm rủi ro D1/D10 và quyết định APPROVED / CHANGES_REQUIRED theo đúng SHA, tài khoản và thời điểm. Trạng thái: PENDING.
N4-POLICY-D1: OWNER/SƯ PHẠM quyết định liệu nhãn t1_split1/TEST sẽ bị ẩn, thay bằng tên trẻ hiểu hoặc chặn bản learner. Trạng thái: PENDING_APPROVAL.
N4-POLICY-D10: NGƯỜI CHỊU TRÁCH NHIỆM HỢP ĐỒNG CHẤM quyết định canonicalization '-'/'−', giới hạn phép tính, kiểm thử cả thành công và thất bại với trusted grader trước production. Trạng thái: PENDING_APPROVAL.
N4-W1-RTM: QA kiểm từng hàng W1-01..W1-05, DB-01..DB-05, giữ các thiếu sót ngoài phạm vi N4 ở OPEN cho đến khi có link closure; không đóng cả W1 chỉ nhờ một CI. Trạng thái: PENDING.
Các vai trò phải tách biệt theo chính sách. Một tài khoản chỉ được tính làm QA độc lập nếu được phân công hợp lệ và không tự phê duyệt chính thay đổi của mình.
4. CÁCH THỨC GHI NHẬN CÓ THỂ KIỂM CHỨNG
Người phản hồi tự đăng nhập tài khoản, mở Google Docs (hoặc bình luận GitHub PR/Issue). Trích dẫn số mục và điền: (i) role/họ tên hoặc định danh được tổ chức phê duyệt, (ii) tài khoản người gửi được xác thực, (iii) commit SHA, (iv) nguồn và scope bằng chứng, (v) quyết định, (vi) ngày giờ GMT+7, (vii) ngoại lệ/rủi ro nếu có.
Mọi trường [PASS] do một AI biên soạn hoặc chưa có tài khoản/thời điểm chỉ là dữ liệu gợi ý, không thay thế xác nhận cá nhân. Google Docs edit text riêng cũng không tự chứng minh người ký nếu thiếu lịch sử/quyền kiểm chứng.
Không cần chia sẻ toàn bộ thư mục ra chế độ 'Anyone with link'. Cấp Viewer/Commenter đúng người cần xem, và bảo toàn khả năng trích dẫn revision.
5. MẪU PHẢN HỒI N0-S RIÊNG
Tài liệu gốc: https://docs.google.com/document/d/1xz-9txPepnDC_B8m4C3KXbwiWgwLv1sG6Kx-dRN70Yo/edit
CSV RAW: https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view
Expected SHA-256: d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b.
Người nhận thực hiện (tự điền): [PENDING]
Phương pháp SHA và máy kiểm: [PENDING]
SHA thực tế: [PENDING]
Kết quả [MATCH / MISMATCH]: [PENDING]
Thời điểm GMT+7: [PENDING]
Tài khoản/nguồn bình luận đã xác thực: [PENDING]
Mọi xác nhận chỉ là chứng cứ nhận RTM; không đồng nghĩa phê duyệt bộ renderer hoặc cho phép release.
6. MẪU PHẢN HỒI QA ĐỘC LẬP
Người / đơn vị / vai trò và tài khoản: [PENDING]
Danh sách commit đã kiểm: [PENDING]
D1 bấm phím/cuộn và nhãn kỹ thuật: [APPROVED / FIX_REQUIRED / NOT_TESTED]
D10 dấu trừ và chấm đáng tin cậy: [APPROVED / FIX_REQUIRED / NOT_TESTED]
N4 ảnh và tương tác Chromium: [APPROVED / CHANGES_REQUIRED / NOT_TESTED]
Thiết bị, hệ điều hành, trình duyệt và phạm vi: [PENDING]
Bằng chứng (ảnh/video/CI/PR comment): [PENDING]
Xác nhận độc lập theo chức trách: [APPROVED / REJECTED / PENDING]
Ngày giờ và phạm vi phát hành: [PENDING]
Không giả mạo dấu ký, không coi AI review là ký nhận.
7. CỔNG ĐƯỢC PHÉP / KHÔNG ĐƯỢC PHÉP
GO: tiếp tục thu thập ACK và phản hồi; kiểm nghiệm/chốt chính sách; sửa phạm vi LAB theo PR tách biệt nếu có blocker thật, có CI và rollback.
NO-GO: tự chấp nhận rủi ro D1/D10 khi chưa được phê duyệt; đóng W1-05 hoặc N0-S; merge #18/#19/#20; kết nối GAS hoặc Sheet sản phẩm; chấm học sinh hay phát hành.
Bước kế tiếp phù hợp: N4-C.7 – Verified Human ACK, Policy Approval & Gate Recheck. Chỉ chuyển trạng thái từng ô nếu chứng cứ xuất hiện, không tạo thành công giả.
