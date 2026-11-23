# BIÊN BẢN THỰC NGHIỆM HỢP NHẤT N7–N8–N9
Mã hồ sơ: PRE-N10-A / ULT_N7_N8_N9_LIVE_GAS_EXECUTION_AND_RECOVERY_EVIDENCE_20261124
Ngày đối chiếu: 24/11/2026 (GMT+7)
Phân loại: EVIDENCE_CONSOLIDATED / AI-ASSISTED_RECONCILIATION / KHÔNG PHẢI CHỮ KÝ OWNER HOẶC QA ĐỘC LẬP
Quyết định: TECHNICAL_LAB_SCOPED_PASS; N9_INDEPENDENT_QA_PENDING; N8_EXTERNAL_ATOMIC_CAS_OPEN; N10_AUDIT_PREPARATION_ONLY; RELEASE_NO_GO.
## 1. NGUỒN VÀ THỨ TỰ ƯU TIÊN
- Mã nguồn và kiểm thử khóa tại commit LAB f3f63c595d87aa4c822416eb31c434116237d842 (nhánh lab/ult-n7-simplified-gas-rebase-20261123); CI 45246796464 SUCCESS 74/74 PASS, 0 FAIL. https://github.com/Nguyennth19/new-lop-2/actions/runs/45246796464
- Hồ sơ N9 trước đó: https://github.com/Nguyennth19/new-lop-2/blob/f3f63c595d87aa4c822416eb31c434116237d842/qa/universal-template-n4-prep/n7-simplified-lab/N9_FINAL_CLOSURE_EVIDENCE_20261124.md
- Checkpoint kỹ thuật và quản trị: https://github.com/Nguyennth19/new-lop-2/issues/15
- Sổ ký nhận N5: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit
- Báo cáo phản biện N5–N9 khóa rà soát 02:18 GMT+7: https://docs.google.com/document/d/17xGSSqdNi7iwZQX270G1J8bNAqV6b0lSGtObGKgseg8/edit
- GAS TEST có project ID 10fN1hTCJg1Ruwr0tHafi_rmkkeZAUw-5umiGhNcqrgwPx2rYu1fOZl3M. Source repository snapshot is NOT cryptographic attestation of deployed/live GAS code. Source SHA of exact live editor contents: NOT VERIFIED; do not claim equivalence.
- Nhật ký GAS được Owner gửi trong cuộc trò chuyện là bằng chứng thực thi theo báo cáo Owner, KHÔNG phải bản xuất audit log bất biến từ Google Cloud/GAS. Đối chiếu trực tiếp Google Sheets và CI chỉ xác nhận những mục nêu riêng ở dưới.
## 2. N7 — SINGLE WRITER / GHI THẬT TRÊN SHEET CÔ LẬP
- GAS TEST: https://script.google.com/home/projects/10fN1hTCJg1Ruwr0tHafi_rmkkeZAUw-5umiGhNcqrgwPx2rYu1fOZl3M/edit
- N7 live Sheet: https://docs.google.com/spreadsheets/d/1zA7ab0tpcgn68BJd8bizNR8LfuFG57yzsm1YM-SEF9I/edit
- Backup tiền ghi (không có sự kiện N7): https://docs.google.com/spreadsheets/d/1iomsoeXTLEmpRjqzf5v6WiU1ea4CE5EbipTenfPSyw8/edit
- Tab 15_NhatKy_HanhDong: hai sự kiện ULT13B gốc và một sự kiện N7_LAB_N7_KEY_001 tại A4:H4, action N7_TEST_METADATA_ONLY, PREPARED → PROJECTED_PENDING, occurred_at 2026-11-24T00:59:03+07:00; evidence SHA-256 b1e999e4afaedd5d566940bbb3e9e74e75e7cdcd3ea30e7a37915352fc03d40b.
- Kiểm tra trực tiếp: live 3 dòng dữ liệu, backup 2 dòng dữ liệu, backup là prefix chính xác; không có sự kiện N7 trùng; hàng 5 trống. Không tự diễn giải PROJECTED_PENDING là VERIFIED hay ACTIVE.
- Owner báo chạy N7_KiemTraTrangThai: writesEnabled:false, isolatedCopyConfigured:true, grantConfigured:false, releaseAllowed:false sau thử ghi. Quyền ghi vẫn OFF; không suy ra grant ban đầu có đủ đầy đủ giấy tờ TTL/allowlist.
- GAS runtime source checksum, danh mục triggers/deployments, quyền editor toàn diện, lịch sử cấp/revoke TEST Write Grant: OPEN để đối chiếu, không ghi giả.
## 3. N8 — READ-ONLY GAS + RAM SIMULATION / KHÔNG PHẢI REMOTE ATOMIC CAS
- N8 code: https://github.com/Nguyennth19/new-lop-2/blob/f3f63c595d87aa4c822416eb31c434116237d842/qa/universal-template-n4-prep/n7-simplified-lab/N8_CAS_ReadOnly.gs
- Owner xác nhận N8_DienTapXungDotChiDoc chạy thật trên GAS nhưng chỉ đọc journal thật, rồi dùng dữ liệu trong RAM để thử 4 tình huống: (a) event_id và SHA trùng → IDEMPOTENT_NO_RETRY; (b) event_id trùng, SHA đổi → IDEMPOTENCY_CONFLICT/HARD DENY trong mô phỏng; (c) chỉnh dữ liệu RAM hoặc baseline cũ → JOURNAL_DRIFT_RECONCILE_REQUIRED; (d) so sánh snapshot trước/sau đọc GAS thật không thay đổi, dataRows=3 và writes=0. Không ghi payload xung đột thật lên Sheet.
- Owner đã chạy N8_XacMinhGuardMoiChiDoc; log được báo: ok:true, mode:N7_N8_GUARD_READ_ONLY_MATCH, journalDigest:b2c3b85fcf882fb5f8d84f4da89f8eb889fe8fdefce1757900eb48be85cbc6d8, dataRows:3, n7EventCount:1, writes:0, release:false, atomicCasProven:false.
- N8 hiện chứng minh snapshot parity, phát hiện drift mô phỏng và chính sách không retry; KHÔNG chứng minh một giao dịch remote atomic CAS, interleaving writer ngoài GAS, 2-store atomic commit, hoặc F02 direct editor bypass. DB-04 vẫn OPEN ngoài Single Writer LAB.
- Không được dùng modifiedTime của Sheet làm bằng chứng tự động idempotency PASS. Chưa có 4 log ghi thật mới và không tạo chúng trong PRE-N10-A.
## 4. N9 — KHÔI PHỤC READ-ONLY / RAM DRY-RUN / PROVIDER ONE-CELL RESTORE
- Owner đã chạy N9_KiemTraPhucHoiChiDoc, N9_DienTapKhoiPhucKhongGhi, N9_KiemTraCongDongCuoiChiDoc trên GAS TEST. Các log báo PASS với mode tương ứng N9_READ_ONLY_RECONCILIATION, N9_RAM_RESTORE_REPLAY_ONLY và N9_FINAL_GATE_READ_ONLY; journal digest b2c3b85fcf882fb5f8d84f4da89f8eb889fe8fdefce1757900eb48be85cbc6d8, reconstructedDataRows=3, backupDataRows=2, writes=0, restores=0, release:false.
- N9 Final Gate đúng là BLOCKED_PENDING_INDEPENDENT_QA_AND_REAL_RESTORE_EVIDENCE tại thời điểm chạy; readyToCloseN9:false, qaSigned:false; tab 16_Rollback nguồn chỉ có hàng tiêu đề.
- Test RESTORE CÓ GHI THẬT trên bản sao disposable riêng: https://docs.google.com/spreadsheets/d/1Q3X8sYSNdWmO2p88ZlaEnMneYtKO52sT06FhfHXjjuw/edit
- Đã tiêm lỗi thực tại 15_NhatKy_HanhDong!F3: PENDING_INDEPENDENT_REVIEW → N9_SYNTHETIC_FAULT_INJECTED_DISPOSABLE_ONLY; đã đọc lại xác nhận. Sau đó dùng Google Sheets updateCells phục hồi chính xác F3 về PENDING_INDEPENDENT_REVIEW; đọc lại A1:H6 khớp hoàn toàn backup gốc. Đây là proof của SINGLE-CELL RESTORE trên disposable copy, KHÔNG phải khôi phục một giao dịch 7 tab hoặc phục hồi nhật ký N7 thật.
- Kế hoạch N9 khóa SHA-256 0e291c5888d649d5b4e68c7504bd3aeb9e88493b27d7c54a4e0cd77778a0394b (SHA-256 của JSON kế hoạch UTF-8 canonical, không phải SHA của toàn bộ Sheet 7 tab).
- Chưa có RTO có timestamp từ cùng nguồn đo, chưa có audit COMMIT_UNKNOWN khi mất kết nối thật, chưa có event bù trừ append-only hoặc dòng thử thật trong Tab 16_Rollback. Không ghi thay chỉ để đánh dấu hoàn tất.
- Backup tiền ghi cố ý chỉ có 2 sự kiện: TUYỆT ĐỐI KHÔNG đè lên live journal có sự kiện N7 đã được chấp nhận.
## 5. MA TRẬN N5–N9 / DB VÀ CÁC ĐIỀU KIỆN MỞ
N5: CLOSED_INTERNAL_OWNER_ACCEPTANCE cho 5/5 W1 trong phạm vi nội bộ; Owner self receipt SHA RTM theo Sổ ký. Đây không phải QA độc lập; placeholder thời điểm cuối trong Sổ ký và tham chiếu phiếu N0-S phải xử lý ở PRE-N10-B, không backdate.
N6: READONLY_AUDIT + SYNTHETIC_CI_PASS 16/16 (run 45142063620); DB-01 chỉ mở cổng trình tự nhờ chính sách N5, chưa được tuyên bố full schema closed; DB-02..DB-05 OPEN khi chưa có quyết định và QA chính thức.
N7: ONE REAL ISOLATED METADATA APPEND PROVEN; guard/readback đã PASS; F01/F02/out-of-band authority limitations OPEN; không đồng nhất ScriptLock với provider CAS.
N8: READ_ONLY_GAS_AND_RAM_SIMULATION_PASS trong phạm vi; không có external atomic CAS chứng minh; DB-04 OPEN.
N9: LAB READ-ONLY/RAM PASS, disposable one-cell provider restore/readback PASS; OWNER_SCOPE_ACCEPTANCE chưa xác minh riêng; INDEPENDENT_QA_UNSIGNED; FULL_CLOSED NO-GO.
N10: READY_FOR_INDEPENDENT_AUDIT_PREPARATION; chưa QA SIGNED/PASS.
N11 / ULT-V1.3-C: NO-GO.
Draft PR #14,#16–#25: unmerged theo các checkpoint đã khóa; không tự merge.
NO-GO: giữ nguyên be-hoc, governed TEST, Sheet Bài 20, release_eligible, ACTIVE và học sinh. Không bật quyền ghi, không phát hành.
## 6. DANH SÁCH BẰNG CHỨNG CÒN THIẾU (KHÔNG TẠO GIẢ)
A. Chứng thực hash/export thực tế phiên bản mã nằm trong GAS editor sau lần Owner cập nhật cuối; inventory triggers/deployments/permissions và TEST write-grant lịch sử (N7).
B. Bản xuất nguyên văn immutable GAS execution logs N8 4 ca và publisher-side failure injection (nếu N10 yêu cầu chứng minh ngoài RAM); hiện chỉ có log Owner báo qua chat + CI + source + Sheet readback.
C. Log lỗi liên nguồn Drive–Sheet / COMMIT_UNKNOWN thực tế, thử journal-level compensation và multi-tab restore nếu đưa vào phạm vi N10; chưa có.
D. Chữ ký Owner chấp thuận rõ phạm vi nghiệm thu N9 và reviewer QA độc lập có tài khoản, timestamp, nguồn kiểm tra thực tế; chưa có.
E. Chỉnh 2 placeholder/tham chiếu N5 và đồng bộ Master QA Index thuộc PRE-N10-B, không thay thế bằng biên bản này.
F. SHA-256 toàn bộ 7 tab của backup/clone: chưa được tính và xác minh theo quy ước canonical độc lập; chỉ đối chiếu trực tiếp A1:H6 của Tab 15 ở lần thực nghiệm, không khai đã kiểm checksum 7/7.
## 7. CỔNG KẾT THÚC PRE-N10-A
PASS khi tồn tại đúng một bản biên bản Google Docs và một bản Markdown mirror có nội dung thống nhất, liên kết nguồn/checkpoint, phân loại bằng chứng, trạng thái OPEN, và không thay đổi mã nguồn, tài nguyên N7 đã nghiệm thu hoặc trạng thái release.
Quyết định: PRE_N10_A_EVIDENCE_CONSOLIDATED; QA_SIGNATURE_NOT_GRANTED; NO_GO_RELEASE.
