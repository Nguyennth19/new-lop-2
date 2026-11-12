# P0.1 — KIỂM TOÁN THÀNH PHẦN QA VÀ BẢNG KẾ THỪA KID_LEARN
Ngày kiểm toán: 2026-11-12. Phạm vi: audit mã nguồn, không chạy production và không sửa code ứng dụng.
Dự án đích: https://github.com/Nguyennth19/new-lop-2/tree/test-b20-bien-the-20261112
Nguồn đối chiếu: https://github.com/Nguyennth19/Kid_Learn
Bộ UI bất biến: test-theo-main.

## Kết quả kiểm toán
**Không xây QA lại từ đầu.** Lớp 2 đã có phần xác minh bài học, server chấm, chặn ghi sao ở staging và test renderer B20. Thiếu orchestration chung, hợp đồng dữ liệu đủ chặt, test không-ghi dựa trên snapshot dữ liệu, và release gate thống nhất.

| Mã | Nhu cầu | Dự án Lớp 2 hiện có | Kid_Learn tham khảo | Quyết định | P0 tiếp theo |
|---|---|---|---|---|---|
| QA-01 | Kiểm tra tab, bài, dữ liệu | KiemThuHeThong.gs: check 7 tab và gọi layBaiToan20; KhoBaiHoc.gs: đọc 4 tab, valid cơ bản | Integrity_Check_V3.gs; Schema_V3_Definitions.gs | GIỮ và MỞ RỘNG validator required/ID/ref/enum, không thay schema Sheets | P0.2 |
| QA-02 | Hợp đồng response và adapter | 27_BoNhoBaiHoc.html kiểm lesson/questions/sessions hoặc sections/levels, lỗi metadata; 42_AdapterBienTheB20.html map 30 câu | Product_Lesson_Player_Context_4C3_V3.gs | GIỮ + phân lớp kiểm định raw JSON/adapter/renderer, không chép Player V3 | P0.2 |
| QA-03 | Chấm toán và kiểm thử câu | 26_ChamCauHoiToan.html; B20_BienTheMayChu.gs API chấm cả lượt, 30/30 đúng và 30/30 sai; kiem-tra-hoi-quy.js | Product_Lesson_Interaction_DryRun_4C5_V3.gs | GIỮ server-authoritative checker; mở rộng mẫu và kiểu câu; không lấy data-ans/client grading | P0.2/P0.4 |
| QA-04 | DRY_RUN và không ghi | B20 staging trả recorded:false, starsAwarded:0; ThanhTichMayChu.gs chặn ghi nếu B20 staging | QA_Dry_Run_No_Write_V3.gs (snapshot before/after), Product_Write_Contract_4D1_V3.gs | GIỮ chặn ghi, BỔ SUNG snapshot so hàng/ledger/trạng thái; không sao chép toàn bộ Write Router | P0.3 |
| QA-05 | QA runner tập trung | KiemThuHeThong.gs check thủ công, script Node B20 độc lập; chưa có 1 entrypoint chung cho các bài | QA_Batch_Test_Runner_V3.gs: FAST/FULL_SAFE, read-only | KẾ THỪA ý tưởng suite runner, mỗi test metadata + pass/fail + no-write, timeout-safe; không nhập 200+ GAS files | P0.4 |
| QA-06 | UI regression | UI20-02A CSS scoped + Node kiểm HTML/nhóm/ô nhập; browser QA do người dùng xác nhận riêng | QA_E2E_UI_DEV_V3.gs; Product_Lesson_Player_Context_4C3_V3.gs | GIỮ baseline test-theo-main, bổ sung fixtures/screenshots và browser smoke; CSS SHA chưa đủ | P0.4 |
| QA-07 | Asset ID / G7 | tai-lieu/ASSET_CATALOG_288_V4_INVENTORY.csv, G2/G5 QA files; 34_HinhAnhDungChung.html fallback | Product_Asset_Registry_Plan_4B2R5_V3.gs, MST_MediaAssets | TÁI DÙNG danh mục G7, bổ sung manifest/asset availability/semantic mapping, không tạo MediaAssets mới khi chưa cần | P0.2/P0.4 |
| QA-08 | Release gate/rollback | tài liệu QA_APP_SCRIPT, NHAT_KY_LOI_VA_PHONG_NGUA, UI20 report; chưa có gate tự động thống nhất | Prod_Runtime_Smoke_Test_3NH_V3.gs, các phase gates | HỌC state machine STATIC_PASS/WEBAPP_PASS/PEDAGOGY_PASS/RELEASE_READY, không nhập quy trình PROD cồng kềnh | P0.5 |
| QA-09 | Kiểm soát sao và tiến độ | ThanhTichMayChu.gs ledger 90/91, 33_KetNoiThanhTich.html và 39_DongBoTienDo.html server source | Product_Write_Contract_4D1_V3.gs, QA_Dry_Run_No_Write_V3.gs | GIỮ triển khai hiện tại; bổ sung chứng cứ no-write, bảo toàn idempotency | P0.3 |
| QA-10 | Tiếng Việt và đa môn | Chưa thấy bộ QA chuẩn dạng câu Tiếng Việt/Anh tương đương B20 | Run3_Golden_Question_Runtime_Bridge_B01_B05_V1.gs (nhánh dev/run3-golden-runtime-bridge-b01-b05) | CHỈ kế thừa nguyên lý read-only/dry-run, không tuyên bố đã có đáp án văn học/ngôn ngữ đúng | Sau P0 |
| QA-11 | CI và Firebase | Chưa có pipeline CI thống nhất kiểm tất cả mô-đun GAS | rebuild/firebase-mvp/.github/workflows/rebuild-dry-run.yml | KẾ THỪA cấu trúc CI dry-run khi phù hợp; KHÔNG chuyển Firebase/Firestore | P0.4 tùy giai đoạn |

## Phát hiện tránh xây trùng
1. Không xây lại bộ chấm số học: mở rộng 26_ChamCauHoiToan.html / chấm server có sẵn.
2. Không xây lại cache lesson hoặc thư viện hình: sử dụng 27_BoNhoBaiHoc.html và catalog G7.
3. Không xây lại kho Sheets: bổ sung hợp đồng validation ở trên KhoBaiHoc.gs.
4. Không xây lại hệ thống sao/điểm: chỉ kiểm tra an toàn ghi dựa trên 90_Lan_lam_bai/91_So_sao.
5. Không nhập nguyên QA_Batch_Test_Runner_V3.gs vì phụ thuộc nhiều hàm kidlearnV3, trạng thái ScriptProperties và bảng V3 khác.
6. Không nhập login/Firebase, toàn bộ CSS và ứng dụng phụ huynh vào P0.
7. Không dùng schema Kid_Learn V3 thay thế các bảng 01/02/03/04 đã chốt; chỉ học nguyên lý schema contract và integrity.

## Gap có bằng chứng và thứ tự ưu tiên
- **P0.2** (HIGH): validator chuẩn 3 lớp source/adapter/renderer; kiểm input contract từng loại; khóa JSON 30 câu hiện hành không đổi; chuẩn bị test 45 câu sau.
- **P0.3** (HIGH): DRY_RUN flag và snapshot no-write (90/91, 01–04 nếu có phát sinh), assertion trước/sau; không cấp sao ở staging.
- **P0.4** (HIGH): một bộ runner `FAST`, `FULL_SAFE`, `UI_REGRESSION`, mỗi suite trả kết quả có error code, lesson ID, schema version, source commit và duration. Node tests + GAS self-test riêng; không cần chạy từng hàm thủ công.
- **P0.5** (HIGH): chuẩn hóa báo cáo `STATIC_PASS / WEBAPP_PENDING / PEDAGOGY_PENDING`, nghiệm thu 6 lượt B20, rollback, bản ghi QA vào GitHub và Drive.
- Không đưa Firebase, AI tự chấm câu mở, handwriting Canvas vào giai đoạn P0.

## Tình trạng kiểm chứng và giới hạn
- Đã đọc và so sánh mã: các tệp QA, schema, dry-run, write contract, lesson player và asset registry trong Kid_Learn/main; bridge ở dev/run3; README/dry-run CI ở rebuild/firebase-mvp.
- Đã rà 133 file trong nhánh Lớp 2 TEST, 233 file trong Kid_Learn main theo file tree; xem danh sách thay đổi hai nhánh Kid_Learn còn lại.
- Không thực thi bộ QA ở Kid_Learn hoặc kết nối dữ liệu học sinh; chỉ kiểm toán năng lực **có trong mã**. Không được viết "PASS vận hành" cho các thành phần chưa chạy.
- Đã có xác nhận từ người dùng rằng deployment của bản vá lỗi tải dữ liệu B20 hoạt động OK; kết quả này không thay cho P0.3 no-write test.
- P0.1 **AUDIT_DONE** — chỉ báo cáo và đề xuất, chưa tích hợp code QA.

## Quy ước đã chốt
NG: ngắn gọn; TL: chỉ thảo luận không code; GT: giải thích đủ chi tiết, không dài dòng.
Nguyên lý chung: **Một kỹ năng kiến thức → nhiều hình thức tương tác và biến thể**, không đánh đồng các hình thức với dạng kiến thức độc lập.
