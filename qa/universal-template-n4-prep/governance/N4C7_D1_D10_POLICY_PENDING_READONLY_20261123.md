# ULT N4-C.6 – D1 Learner Labels and D10 Minus Policy Decision – 20261123

> REDACTED READ-ONLY AUDIT MIRROR. Editable canonical signoff/policy on restricted Drive: https://docs.google.com/document/d/1eauNbzFV_niR5G3bylb1CIDiSktrZRYt2cZXVBTP4vo/edit
> Source Google Docs revision at mirror: AHj4eMQHABZnOAUvvtK6FeE1Ahs_jJZvwOC86FaJf2l_2Zz-IPfBWRwN9zAjCAGdQejtAQ8dDcKmZrLCSjX60JUk4ELEGWAGpQxadRTDFA
> Mirrored for third-party status review; GitHub text IS NOT a human-signed receipt and MUST NOT be edited to forge signature.

N4-C.6 – D1 LEARNER LABELS & D10 MINUS: POLICY DECISION DOSSIER
Dự án Lớp 2 / Universal Learning Template Independent LAB
Ngày 23/11/2026 (GMT+7)
Mức độ: POLICY_PROPOSAL_AWAITING_HUMAN_APPROVAL. Đây không phải hợp đồng đã phê duyệt hay bản vá đã phát hành.
1. MỤC TIÊU VÀ NGUYÊN TẮC
Đóng hồ sơ ra quyết định về hai rủi ro learner-facing còn mở, không thay nguồn be-hoc đã đóng băng và không thiết kế lại renderer đã được Owner đánh giá tốt.
Nguồn ứng viên: N4-C.3-B commit 1ad172bae5b15a5e83012fe2538e3082fff0347c; CI 45119493865 SUCCESS.
Hồ sơ nguồn phản biện: https://docs.google.com/document/d/1Xa1yAr_YBslU-FYD-ZDPcMCjT9kIu_DQOg54iPdbD2M/edit
Biên bản N4-C.5: https://docs.google.com/document/d/1INKboI8U_3obKISo_wTnOz8lLTECVSE_MFTu9lzmlxY/edit
Chỉ lập quyết định cho đúng phạm vi ảnh, tương tác, nguồn dữ liệu, loại thiết bị và trusted grader có chứng cứ. Mọi phê duyệt bắt buộc gắn commit, người ký, tài khoản và thời điểm.
2. D1-UX-01 – NHÃN KỸ THUẬT TRONG GIAO DIỆN TRẺ
ĐÃ XÁC MINH: trên LAB vùng bài có “Ô đang chọn: t1_split1” và “TEST: chỉ thu ô nhập...” ở desktop/mobile. Đây là nhãn dev/test; không phải văn bản sư phạm phù hợp cho học sinh lớp 2. Người Owner đã trải nghiệm và đánh giá chung LAB “rất ok”, nhưng không phải tuyên bố phê duyệt riêng việc cho trẻ nhìn nhãn này.
KHUYẾN NGHỊ: không phát hành learner-facing nguyên trạng. Giữ nguyên mã frozen core 36 tệp, chọn một trong hai cách trên nhánh LAB độc lập có CI:
  Phương án A (ưu tiên xem xét): adapter/presentation mapping chuyển slot IDs sang mô tả sư phạm như “Ô số thứ nhất”, “Ô số thứ hai”; ẩn lời chú thích TEST bằng rule lọc văn bản có kiểm chứng, không ẩn trạng thái trả lời/feedback quan trọng, không phá aria-label hoặc khối đếm.
  Phương án B: đánh dấu các dấu vết TEST chỉ thuộc môi trường LAB, tách biệt đường dựng learner; cổng learner build validator chặn phát hành nếu có chuỗi kỹ thuật nhạy cảm; không cần sửa ngay LAB nếu chỉ phục vụ QA.
Không kiến nghị ghim phím sticky hoặc tách Phần A/B khi Owner chưa thấy vấn đề thực tế; giữ dài trang D1 trong watchlist.
TRƯỚC KHI PHÊ DUYỆT: kiểm tra trên ảnh thực và đầu ra DOM sau tương tác, accessibility, ba cấp độ, cả 12 route để tránh lọc nhầm; không dùng CSS global display:none mù quáng. Chỉ được đánh dấu FIX_PASS khi có PR + CI + Owner QA xác nhận.
Chủ quyết định D1: [OWNER/EDTECH APPROVER CHƯA XÁC ĐỊNH]
Chọn A / B / BỊ CHẶN: [PENDING]
Lý do, commit, rollback, link CI, thời điểm/tài khoản: [PENDING]
Tình trạng trước release: BLOCKER. Tình trạng riêng trong LAB cô lập: KNOWN_LIMITATION_ACCEPTABLE_FOR_TEST_ONLY.
3. D10-INPUT-02 – DẤU ASCII '-' VÀ TOÁN HỌC '−'
ĐÃ XÁC MINH: năm trường n1/op/n2/sum/answer có draft round-trip trên Chrome; CSS font 16px; op inputMode=text. Chromium có thể lưu nguyên U+2212 vào draft. Chưa có bằng chứng trusted server grader canonicalize hai dấu.
KHÔNG KẾT LUẬN: dữ liệu U+2212 đã gây lỗi chấm; việc lưu vào draft không chứng minh grader cho điểm đúng. Cũng không lấy phản hồi “rất ok” làm kiểm định từng toán tử.
KIẾN NGHỊ CONTRACT (chờ phê duyệt):
  Tầng UI có thể cung cấp nút chọn toán tử +/− phù hợp trẻ lớp 2, nhưng không thay trình bày khi chưa có kiểm thử UX thiết bị.
  Tầng adapter chuẩn hóa rõ ràng các mã Unicode hợp lệ về enum ADD/SUB trước khi truyền trusted server; không tự sửa đáp án, không tự tạo phép tính mới, không chấp nhận mọi ký tự gần giống.
  Chỉ cho phép các dạng một phép tính và các phép +/− thuộc chính sách bài đã phê duyệt; loại bỏ dấu không hợp lệ, nhiều phép tính, khoảng trắng bất thường nếu hợp đồng quy định.
  Trusted grader tự xác minh policy/skill/lesson/variant, tính và chấm trên server, không tin đáp án/hint/answerKey từ client hoặc publicVariant.
ĐỀ XUẤT BẢNG KIỂM TRƯỚC QA:
  '+' => ADD; '-' U+002D => SUB; '−' U+2212 => SUB (nếu phê duyệt); dấu en-dash U+2013 và em-dash U+2014 => REJECT trừ khi có lý do sư phạm/contract riêng.
  Đầu vào rỗng, hai dấu, chữ lạ, nhiều toán tử, giá trị n1/n2/sum/answer sai định dạng, client tự gắn answerKey => REJECT.
  Dạng cộng/trừ hợp lệ => trusted server tính và phản hồi theo policy, kiểm nhất quán sum và answer dưới từng tình huống có lời văn.
  Kiểm Chrome mobile emulation và Android/iOS thật với bàn phím ảo mở, focus, cuộn, không tràn ngang; không suy rằng iOS đã PASS chỉ vì font 16px.
  Kiểm rằng nhập '-' và '−' tạo cùng ngữ nghĩa nếu phê duyệt, và không rò đáp án/khóa chấm ra bundle public.
QUYẾT ĐỊNH CHƯA CÓ: policy chuẩn hóa, vị trí normalize, response lỗi, tests trusted grader và QA độc lập.
Chủ quyết định D10: [TECH CONTRACT OWNER + SƯ PHẠM / CHƯA XÁC ĐỊNH]
Scope: [LAB ONLY / learner rollout / PENDING]
Policy option, link PR/CI, SHA, người ký và thời điểm: [PENDING]
Tình trạng trước learner grading: BLOCKER. Chưa sửa hay merge mã nguồn.
4. PHÂN LOẠI VÀ ƯU TIÊN
D1 UX: P0 đối với giao diện học sinh; có thể được xem là nợ LAB test-only với cảnh báo hiện rõ, không tự chuyển thành nợ được phép phát hành.
D10 minus: P0 đối với chấm học sinh; hợp đồng trusted-grade bắt buộc trước mở quyền chấm, không chỉ UI đẹp.
D1 mobile dài trang: WATCHLIST — Owner đã đánh giá trải nghiệm tốt; không mở việc sửa nếu không có lỗi tái hiện.
D2 desktop PNG bytes khác, pixel giống: QA NOTE — không cần fix CSS.
N0-S A3/A4 và QA độc lập: GOVERNANCE BLOCKERS — là chứng cứ con người, không được giải quyết bằng script giả.
5. MẪU PHÊ DUYỆT CHÍNH SÁCH
Mã vấn đề (D1-UX-01/D10-INPUT-02): [CHỜ]
Phương án được chọn: [CHỜ]
Môi trường chấp thuận: [LAB / LEARNER / CHƯA RÕ]
Commit SHA; link PR/CI; chứng cứ và rollback: [CHỜ]
Người phê duyệt được ủy quyền + tài khoản xác thực: [CHỜ]
Người QA độc lập + tài khoản xác thực: [CHỜ]
Ngày giờ GMT+7: [CHỜ]
Kết luận: [APPROVED / CHANGES_REQUIRED / PENDING]
Một ô được điền APPPROVED mà thiếu người/tài khoản, phạm vi và bằng chứng vẫn được xem là ADVISORY_ONLY.
Không merge PR #18/#19/#20, không GAS, không Google Sheet sản phẩm hay phát hành cho học sinh khi hồ sơ ký chưa đầy đủ.
