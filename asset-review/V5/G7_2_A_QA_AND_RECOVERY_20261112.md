# G7.2-A — CHECKPOINT / QA / RECOVERY
**Ngày ghi nhận:** 2026-11-12 (Asia/Ho_Chi_Minh)
**Thao tác:** tạo mới metadata và bộ hồ sơ; **không sửa ảnh binary, không động ứng dụng, không merge**.
**Nhánh:** `g7-1-content-audit-20261112`
**Drive V5:** https://docs.google.com/spreadsheets/d/11-CWHCV-skwvhW3XG8dCfAKAtmrQVySTqqjGxPx1RA4/edit
**Thư mục lưu V5:** https://drive.google.com/drive/folders/1uYFzG6snotp2uIebcIJFjGf9spHeWvC7

## Checkpoint đã commit (khôi phục bằng SHA)
| Bước | Commit | Điều kiện được giữ |
|---|---|---|
| 1. Registry 288 & nguồn G7 | `fa48abdad13a549a9cdae5e76ad7fb6a8e97f249` | 288 IDs, 100 nhãn đề xuất, sha PNG/WebP |
| 2. 6 nhóm variant | `67413b5a0c79c61c98b446fe6278044003dceaab` | 6 quan hệ, giữ cả hai file |
| 3. Sửa nhãn nhóm M07–M12 từ folder nguồn | `81b3cc8f4ec5b241f6c79abae3327254b264db11` | Category theo Drive gốc |
| 4. JSON Registry V5 | `9a78b9decb558ce45346d0dde79998e21515ee93` | Snapshot không phát hành |
| 5. Sửa sai số hộp quà, quan hệ/cấu hình/test | `18ae6724ea5fd38ed056dc99080b1717595e0595`, `47581bfc4431f49fb029c0338058c7f7585cf677`, `28af994bdc34114519f90b2ec3bbe8b59abcc0de`, `abe0eb1dbcdb062431ceec22e79e6499881eacb0` | SH12_006 = hộp đơn; M03_012 = chồng |
| 6. Thuộc tính định lượng 11 PNG đã mở | `935c90dd321b58647e7221a202b8479c0becc29d` | 9 hình đơn, 2 đôi giày, 277 chưa suy đoán |
| 7. Đồng bộ lại JSON | `dd9d0c012340dfe2437e6860fe80a72f725116d7` | CSV/JSON nhất quán |
| 8. Hướng dẫn bộ V5 | `2ff9f72da463bd8ff229652e87bca7cf7e857031` | Khóa điều kiện chưa phát hành |

## Kiểm định đã thực hiện
- Drive native Sheet: 5 tabs; tab V5_REGISTRY_288 có **289 hàng gồm tiêu đề**, **288 ID duy nhất**, **24 category** và **100 nhãn thực tế khác catalog**.
- 6 dòng quan hệ variant, đúng 6 nhóm; **11 Asset IDs** xuất hiện trong 6 nhóm (vì một ID nằm hai nhóm).
- 288 PNG SHA-256 và 288 WebP SHA-256 là giá trị lưu từ nguồn QA G7, không được chỉnh sửa/hardcode lại; nguồn G7 ghi 288 technical PASS.
- 11 tài sản đã xem PNG master và ghi số lượng; số lượng/đơn vị đôi giày được phân biệt (2 chiếc = 1 đôi); 277 chưa có kiểm tra định lượng.
- 85 khoảng trống học liệu vẫn để trạng thái **PENDING_EXERCISE_LEVEL**, 47 Toán, 38 dùng chung; **0 hình mới được chứng minh bắt buộc**, không tương đương với bằng chứng rằng không cần vẽ.
- Đã đọc lại Sheets sau khi ghi và xuất `.xlsx` để render QA trực quan. Phần trình bày là working tracker có filter, freeze header; không phải bản ứng dụng.

## Lưu ý về mức độ xác minh
- **PASS_STATIC**: kiểm dữ liệu và liên kết; **KHÔNG có QA runtime/browser hoặc đối chiếu checksum độc lập từ 288 file binary** trong lượt G7.2-A.
- Các trường `label_vi_current`, `render_policy`, `composable`, `repeatable` chưa đồng loạt được ký duyệt nội dung, không dùng để chấm câu hỏi thực.
- Các báo cáo G7.1-C trước đó nhầm SH12_006 là chồng hộp quà; **hiệu đính G7.2-A là nguồn đúng hơn** dựa trên PNG gốc.

## Khôi phục khi hội thoại bị treo
1. Mở đúng branch `g7-1-content-audit-20261112`, thư mục `asset-review/V5/`; đọc tài liệu này trước.
2. So sánh bảng Google Sheet native và file `Asset_Registry_V5_WORKING_288.csv` + JSON trên GitHub; lấy Asset ID làm khóa, tuyệt đối không sắp xếp rồi ghi ngược nếu mất khóa.
3. Nếu có xung đột, lấy commit cuối đã QA làm mốc, tạo **file V5_NEXT** thay vì ghi đè PNG/WebP hoặc lịch sử nguồn.
4. Ưu tiên xác thực nhãn đã đề xuất (100), kiểm các trường định lượng (277) theo ưu tiên thực tế, rồi mới G7.2-B/C.
5. Mỗi lần thay đổi: commit riêng, cập nhật tab `V5_CHANGE_HISTORY` trên Drive, ghi SHA GitHub, số hàng ảnh hưởng, chứng cứ và trạng thái. Không merge nếu chưa có nghiệm thu trực quan.
6. Nếu cần rollback metadata, dùng `git revert <SHA>` trên nhánh làm việc; không sửa main.

## Tham chiếu gốc
- QA 288 Drive: https://drive.google.com/file/d/1py12RGUq7ONSpWrJMwStwZ2bOmEqBOlc/view
- G7.1 100 nhãn: `asset-review/G7_1_100_CONTENT_DECISIONS_CANDIDATE_20261112.csv`
- G7.1 6 cặp: `asset-review/G7_1_6_NEAR_DUPLICATE_DECISIONS_20261112.csv`
- G7.1-C 85 phương án: `asset-review/G7_1_C_85_VARIANT_FIRST_ASSESSMENT_20261112.csv`
