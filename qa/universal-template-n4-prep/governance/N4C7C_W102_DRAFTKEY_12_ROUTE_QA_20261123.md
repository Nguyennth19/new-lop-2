# N4-C.7-C W1-02 Audit – Drive canonical snapshot

Drive: https://docs.google.com/document/d/1iZirPPk81QlgVV4AQQrdmJIeMWSyfJaEEVtLIkiIaeA/edit
Revision: AHj4eMTX6DSfpopNnXgi7g70SbPMI5fTimklWgXUmi546x6ovR2hIlevpEeIwYMXgtoHItvIi5iD4k5h9uPCY9eQSqJj4IwnIaNXI8Stog
Read-only redacted GitHub mirror; human QA signoff must occur under authenticated identity on restricted Drive/GitHub. Latest appendices supersede earlier status labels.

N4-C.7-C — W1-02 COMPOSITE DRAFTKEY & 12-RENDERER LIFECYCLE QA
Dự án Lớp 2 / ULT V1 | LAB độc lập | 23/11/2026 GMT+7
Phán quyết: TECHNICAL_CHROMIUM_SCOPED_PASS / INDEPENDENT_QA_AND_W1_02_CLOSURE_PENDING / NO_RELEASE
Tài liệu dành cho QA và bên thứ ba; không có chữ ký hoặc phê duyệt giả lập.
1. BẰNG CHỨNG VÀ SOURCE LOCK
Baseline PR #22 tại 49d17dc5a2fba70a46faac9a0540f30b1f4f3eec.
Branch: lab/ult-n4c7c-w102-draftkey-lifecycle-20261123.
GitHub workflow: .github/workflows/ult-n4c7c-w102-draftkey.yml
GitHub test: qa/universal-template-n4-prep/n4c7c-w102-draftkey-lifecycle.test.cjs
CI SUCCESS: https://github.com/Nguyennth19/new-lop-2/actions/runs/45130344244
CI artifact ID 14797801318.
Drive ZIP: https://drive.google.com/file/d/146jf464cFbFElXpDPHXteGlZTjmMdOxm/view
Drive folder: https://drive.google.com/drive/folders/1cqTbyn13bUiiWl2REINtpHhwFY1QW9h5
RTM source original: https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view
Canonical single human signoff: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
Source renderer modules and CSS frozen by build.cjs (28 modules + 8 CSS); no edits to frozen originals, GAS/Sheet, private grading bank or student data.
2. ĐỊNH NGHĨA HỢP ĐỒNG NĂM THÀNH PHẦN
Theo qa/universal-template-v1/lab-runtime.js dòng 56–67, DraftKey được tạo từ:
  packId | contentVersion | lessonId | questionId | rendererVersion
Các thành phần được encodeURIComponent và nối có dấu phân cách '|'. rendererVersion gắn frozen renderer source SHA, LAB host version, core/view và mode D5 nếu có.
contentVersion được lấy trực tiếp từ pack nếu có; nếu không có, LAB dùng FNV64 xác định theo nội dung pack. FNV64 là định danh cục bộ nhằm phân biệt bản nháp, KHÔNG phải checksum mật mã cho quyền phê duyệt.
setData() tại runtime lines 252–263 luôn xóa memory của bộ dữ liệu cũ. Đây là một cơ chế bảo vệ riêng, không tự chứng minh độ an toàn của persistent draft store ngoài RAM hoặc qua nhiều phiên trình duyệt.
3. KIỂM THỬ CỤ THỂ ĐÃ PASS
Chạy trên Chromium desktop 1366×768 và mobile emulator 390×844 (không phải điện thoại thật), đủ 12 đường dựng:
D1 D2 D3 D4 D5 D6 D7 D8 D8A D8B D9 D10.
Mỗi renderer được kiểm đủ năm trường có giá trị, tạo key nhất quán và xác định khi nạp lại fixture.
Với từng renderer, sáu biến thể được kiểm:
 (1) Thay packId;
 (2) Thay contentVersion tường minh;
 (3) Thay lessonId đồng bộ cấu trúc bài;
 (4) Thay questionId;
 (5) Giữ nguyên questionId nhưng thay rendererId và public variant bằng dạng khác có hợp đồng hợp lệ;
 (6) Giữ packId/questionId nhưng đổi nội dung lesson để xác minh local fallback contentVersion thay đổi.
Sáu biến thể × 12 route × 2 viewport = 144 phép đối chiếu khóa ở cấp dữ liệu bên trong 24 nhóm kiểm tra KEY.
Mỗi trường hợp xác nhận key không trùng với baseline và không có draft cũ được nhập lại. Lưu ý việc không nhập lại được bảo vệ đồng thời bởi đổi key và việc setData xóa memory: không chứng minh hai yếu tố hoạt động độc lập khi có persistent store.
Mỗi renderer thử thao tác DOM thật, nhận snapshot, chuyển sang route khác, xác minh root cũ bị tháo khỏi DOM, trở về route gốc, phục hồi snapshot y nguyên, clear draft và xác minh remount không tái xuất hiện dữ liệu cũ.
24 nhóm LIFECYCLE + 24 nhóm KEY + 2 nhóm không có page JS error = 50 nhóm PASS.
Hồi quy N1-A 8 trường hợp/0 failures.
CI scope guard PASS: diff chỉ thêm QA test và workflow, không sửa source đã đóng băng.
4. PHẠM VI CHƯA ĐƯỢC CHỨNG MINH
Không có kiểm thử localStorage/IndexedDB hoặc vòng đời bản nháp qua refresh/đóng trình duyệt; runtime hiện dùng memory trong tab và xóa khi đổi pack.
Chưa chứng minh khóa phiên bản metadata có chữ ký hay nội dung công khai thuộc trusted server; FNV64 không dùng làm checksum phê duyệt.
Chưa chứng minh nhiều tab, nhiều thiết bị, nhiều người học hoặc phát hành trên GAS/production.
Không xác minh trusted grading, protection khỏi dữ liệu không đáng tin, hay chấm D10 (cổng khác).
Chưa có QA độc lập ký xác nhận danh tính, ngày giờ và phạm vi. Owner xác nhận tốt trên điện thoại ở checkpoint trước không tự suy thành W1-02 signed acceptance.
Các biến thể được tạo từ fixture LAB của dự án, không phải bằng chứng độ phủ 100% ngân hàng SGK nhiều bài.
5. QUYẾT ĐỊNH THEO RTM W1-02
Canonical requirement: Composite DraftKey và LabRenderHandle thống nhất trên 12 đường dựng.
W1-T03: synthetic same questionId với pack/content/lesson/renderer khác, kiểm key khác và không phục hồi draft cũ – SCOPED PASS.
W1-T04: snapshot, restore, clear, destroy/DOM detach, remount trên 12 renderer – SCOPED PASS.
Khuyến nghị ghi W1-02 = TECHNICAL_TEST_PASS_SCOPED_CHROMIUM; chưa CLOSED cho đến khi QA độc lập đối chiếu RTM, fixture/CI SHA, chính sách lưu bản nháp, ký nhận và phạm vi phù hợp.
Mọi quyết định chính sách D1 learner labels và D10 minus/trusted-grader vẫn PENDING; N0-S A3/A4 còn PENDING; W1-05 cuối và phát hành NO-GO.
6. QUY TẮC LƯU VÀ CHUYỂN GIAO
Bản Google Docs trên Drive để cộng tác/bình luận; bản Markdown trên GitHub có revision nguồn và commit để đối chiếu. Sổ ký nhận duy nhất là N4-C.6, không tạo biểu mẫu song song. Sửa đổi sau này phải giữ log và đồng bộ hai nơi; nếu lệch phải ghi SYNC_PENDING.
7. ĐỒNG BỘ CHECKPOINT SAU KHI TẠO PR
Draft PR #23: https://github.com/Nguyennth19/new-lop-2/pull/23
GitHub governance Markdown: https://github.com/Nguyennth19/new-lop-2/blob/lab/ult-n4c7c-w102-draftkey-lifecycle-20261123/qa/universal-template-n4-prep/governance/N4C7C_W102_DRAFTKEY_12_ROUTE_QA_20261123.md
Trạng thái: W1_02_SCOPED_TECH_PASS / QA_INDEPENDENT_PENDING / HUMAN_ACK_PENDING / RELEASE_NO_GO. Khi tài liệu thay đổi, bản Markdown snapshot cần cập nhật revision tương ứng.