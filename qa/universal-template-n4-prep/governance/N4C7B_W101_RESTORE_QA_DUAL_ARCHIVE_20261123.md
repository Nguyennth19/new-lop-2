# N4-C.7-B – W1-01 restore guard technical evidence

Google Docs canonical: https://docs.google.com/document/d/1-dYdMZxEuFeIw1r1MOzycRQx32EcelDzREHC2yiTIlk/edit
Drive revision: AHj4eMTmjoammj1H53pf2bw0TFcSi1QvKEDt5WjW4LYHL522aKuhQlta_kPbsKOFRUzUkhDeGwJFqlvTfZJ8uUbymyvO5siHJ8rXyIX4GA
CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/45129448098
Artifact: https://drive.google.com/file/d/1XJFVg0AxDrEAfWRB4CZfW3by3yD44sGk/view
Authoring scope: AI technical summary; human signoff not supplied. Changes to signer information are not accepted via this read-only snapshot.

N4-C.7-B — W1-01 RESTORE GUARD: BEHAVIORAL QA & CONDITIONAL GATE DECISION
Dự án LOP2/ULT V1 | 23/11/2026 GMT+7
Phân loại: technical CI evidence, not human QA signature.
KẾT LUẬN: W1-01 CALLBACK/RESTORE TECHNICAL PASS IN SCOPED CHROMIUM; W1-01 FINAL CLOSURE PENDING.
1. NGUỒN VÀ CHECKPOINT KHÓA
Baseline N4-C.7: fa60dfc61ba9d6d6ae28c029be079193c06aabbf.
Lab test head: 78c88797918ff2508f69e3bb80a9c22ea7a2c648.
PR #22: https://github.com/Nguyennth19/new-lop-2/pull/22
CI 45129448098: https://github.com/Nguyennth19/new-lop-2/actions/runs/45129448098 (SUCCESS)
ZIP bằng chứng: https://drive.google.com/file/d/1XJFVg0AxDrEAfWRB4CZfW3by3yD44sGk/view
Thư mục QA (cấp ngang với các checkpoint): https://drive.google.com/drive/folders/1Xjqgzv0TdTK3EFsUq81ZrFiI37dHjlqS
RTM nguồn nguyên bản, 10.495 bytes, SHA256 d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b:
https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view
Sổ ký nhận duy nhất: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
2. PHẠM VI THỰC THI
Kiểm thử headless Chromium tại desktop1366 và mobile390 emulation, không phải điện thoại thật. Test harness mới:
qa/universal-template-n4-prep/n4c7-w101-restore-callback.test.cjs
Workflow:
.github/workflows/ult-n4c7b-w101-restore-guard.yml
Build kiểm chữ ký/khóa 36 file renderer/CSS gốc; thay đổi chỉ test/CI. Không chỉnh core be-hoc, Sheet, GAS, server chấm hoặc học sinh.
24 assertion groups = 12 trường hợp hành vi mỗi viewport:
D1: restore 0 khác rỗng, active slot, callback của kết quả cuối đúng một lần; invalid draft từ chối và không đổi trạng thái; clear chỉ một callback cuối.
D2: riêng PV100, PV1000 carry và PV100 subtract borrow; trong mỗi biến thể test restore đúng 0/rỗng/focus và một callback cuối; invalid draft từ chối atomically; clear trả về một callback cuối.
N1-A hồi quy thêm 8 ca/0 lỗi, gồm DraftKey five-component, 12-route lifecycle và D10 một phép tính. Đếm test rõ ràng, không cộng số lượng theo nhãn W1 bị trùng thành các tình huống độc lập.
Log GitHub: N4C7_W101_BROWSER_GATE_PASS 24 assertion groups; N1A_ADDENDUM 8 cases 0 failures; scope guard PASS.
3. LỊCH SỬ KIỂM THỬ THẤT BẠI TRƯỚC KHI PASS – KHÔNG CHE GIẤU
Run 45129199895 FAIL: test fixture dùng hai chữ số “34” cho ô t1_split2 có giới hạn một chữ số trong plan; harness chưa đúng, không phải bằng chứng renderer lỗi.
Run 45129337463 FAIL: harness giả định ô rỗng D1 luôn có trường lưu chuỗi rỗng, trong khi API có thể không đưa trường chưa nhập vào snapshot; điều kiện test được sửa để 0 vẫn tường minh và blank có thể bằng “”, undefined theo hợp đồng collect.
Run 45129448098 SUCCESS sau khi sửa test harness, không chỉnh bất kỳ renderer/CSS gốc nào.
Người QA độc lập cần kiểm nghiệm lại các giả định blank serialization và tương ứng variant public; những lần fail vẫn được giữ lại trong log Github để truy vết.
4. ĐÁNH GIÁ THEO RTM GỐC
W1-01 canonical requirement: “Restore guard D1/D2: suppress intermediate onChange, keep focus/active and 0 versus empty”.
W1-T01: callback spy D1 và D2. Test này thực sự quan sát số callback và so snapshot thông báo với snapshot cuối; xác nhận một notification cuối/restore và clear trên từng route được kiểm. Phân biệt “một callback cuối” với “zero callbacks”: theo RTM cổng yêu cầu “Only one intended final notification per restore”.
W1-T02: D2 PV100/PV1000, borrow, focus và 0/rỗng; PASS ở ba public variants thử nghiệm. D1 có kiểm active & 0/rỗng trong biến thể mẫu; chưa chứng minh mọi plan/level/fixture.
Kết luận kỹ thuật: đánh dấu W1_01_T01_T02_SCOPED_CHROMIUM_PASS; chưa được phép đóng W1-01 toàn bộ cho đến khi QA độc lập xác nhận source SHA/CI, biên bản Owner và RTM requirement coverage phù hợp.
W1-02..05 và DB-01..05: giữ nguyên trạng thái trong RTM nguồn, không chuyển trạng thái qua đây.
5. QUYẾT ĐỊNH TIẾP THEO
Giữ Draft PR #22 mở, không merge. Cần QA độc lập ghi quyết định trong Sổ ký nhận duy nhất N4-C.6, gắn SHA test và CI run, thời điểm, tài khoản và phạm vi.
Đồng thời quyết định chính sách learner D1 và trusted-grader D10 vẫn PENDING. Không dùng test W1-01 để suy ra DB or grading PASS.
Khi đủ xác nhận, đối soát riêng W1-02/W1-03 và các hàng W1-04/05; các thay đổi nếu phát sinh chỉ thử LAB test-first với CI, rollback, Drive/GitHub đồng thời.
NO-GO: merge/release/GAS/Sheet/student grading/W1-05 final closure.
6. QUY ĐỊNH LƯU HAI NỀN TẢNG
Báo cáo native Google Docs trên Drive là bản người thật xem/bình luận; Markdown GitHub là bản snapshot liên kết có commit. Không giả lập chữ ký, không chia sẻ email/định danh người ký vào repo; nếu một bên lỗi thì ghi SYNC_PENDING.