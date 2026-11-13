# P0.5 — Quy trình nghiệm thu Web App TEST & release gate
Ngày: 2026-11-13. Áp dụng cho nhánh `test/p0-5-release-gate-20261113` **sau khi tạo một triển khai TEST riêng**.
**Không thay đổi MAIN, test-theo-main, Web App production, dữ liệu của học sinh hoặc 30 câu nguồn B20.**

## Ranh giới bắt buộc trước khi mở Web App
1. Xác nhận chính xác Apps Script project/deployment ID, URL, SHA nguồn checkout và bảng Sheet được gắn trong **ScriptProperties**; không suy từ `CauHinh.gs` mặc định nếu ScriptProperties có override. Chỉ thử với deployment TEST độc lập và workbook giả lập/QA được cho phép.
2. Kiểm tra `P03_QA_TEST_APPROVED=NO` sau P0.3 (được người dùng xác nhận); không bật lại để chạy thử UI. Không dùng tài khoản học sinh thật.
3. Lưu giá trị snapshot/hash hai tab 90/91 và thời điểm trước thử; QA này phải không ghi điểm/sao. Nếu không thể cấu hình môi trường TEST tách biệt, **DỪNG — WEBAPP_PENDING**.
4. Xác minh mã runtime đang là bản TEST dự kiến và hợp đồng API `layBaiToan20`/ `chamLuotToan20BienThe` trả về đúng kiểu; lưu thông tin deployment ID, commit, URL ở kho bằng chứng có kiểm soát (không đưa token hoặc ID cá nhân lên GitHub).

## Web App smoke (TEST only)
- Trên desktop Chrome/Edge: tải trang, chuyển Toán → Bài 20 → LV1/2/3, kiểm tra mỗi lượt A/B.
- Trên điện thoại Android/iOS hoặc trình duyệt mobile thực: giữ đủ ô nhập/nhãn, cuộn, điều hướng bàn phím, không tràn khung và không mất CSS nền.
- Kiểm tra hình sách/kẹo: WebP xuất hiện đúng, khi lỗi ảnh phải fallback về ảnh cũ/emoji; ảnh trang trí **không thay đổi số liệu toán**.
- Kiểm tra riêng `vertical`, `mental`, `word_problem`/tóm tắt/đáp số; không hiện `undefined`, `NaN`, `data-ans` hay lỗi console.
- Bằng chứng tối thiểu: ngày giờ, thiết bị và phiên bản trình duyệt, 2 ảnh screenshot desktop/mobile, log console đã loại dữ liệu nhạy cảm, URL TEST và source commit. Không tự tick PASS nếu thiếu bằng chứng.

## Nghiệm thu cả 6 lượt trực tiếp qua Web App
| Lượt | Số câu | Đáp án đúng | Lượt cố ý sai | recorded | starsAwarded |
|---|---:|---:|---:|---|---:|
| LV1-A | 6 | 6/6 | 0/6 | false | 0 |
| LV1-B | 6 | 6/6 | 0/6 | false | 0 |
| LV2-A | 5 | 5/5 | 0/5 | false | 0 |
| LV2-B | 5 | 5/5 | 0/5 | false | 0 |
| LV3-A | 4 | 4/4 | 0/4 | false | 0 |
| LV3-B | 4 | 4/4 | 0/4 | false | 0 |

Sau cả hai lượt kiểm thử (đúng/sai), chụp lại snapshot 90/91 từ chính workbook đã xác minh. Hash và kích thước phải giống hệt trước thử; nếu có thay đổi thì không kết luận nguyên nhân nhưng **NO_WRITE_FAIL** và dừng release. Không xuất nội dung từng dòng dữ liệu học sinh vào GitHub.

## Bằng chứng phải bổ sung vào `evidence-current.json` để nâng gate
- `webapp`: `environment:'TEST'`, `deploymentId`, `sourceCommit`, `ping:'PASS'`, `load:'PASS'`, `noWrites:true`, `noStars:true`, `sheetBindingVerified:true`, `approvalFlagReset:true`.
- `sessions`: `runtime:'TEST_WEBAPP'`, `results` đủ sáu `sessionId` với `total,correct,wrongCorrect,recorded:false,starsAwarded:0`.
- `browser`: `environment:'TEST'`, `desktop:'PASS'`, `mobile:'PASS'`, `visualBaseline:'PASS'`, `inputFlow:'PASS'`, `imageFallback:'PASS'`, `evidenceRef`.
- `pedagogy`: chỉ người có quyền nghiệm thu sư phạm xác nhận `signedOff:true`, `questionCount:30`, `lessonId:'toan_b20'`, `reviewer`, `sourceStatus` đã được ký, `evidenceRef`. Không tự sửa nhãn `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF` để lách cổng.
- Dữ liệu khai báo phải được người nghiệm thu **đối chiếu bằng chứng độc lập**. Release Gate chỉ kiểm hợp đồng/điều kiện; không tự xác thực chữ ký hay ảnh chụp.

## Kiểm tra lại & rollback
```sh
node thu-nghiem/p0-4/qa-runner.cjs FULL_SAFE
node thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js
node thu-nghiem/p0-5/kiem-thu-release-gate.cjs
node thu-nghiem/p0-5/release-gate.cjs thu-nghiem/p0-5/evidence-current.json
```
Lệnh cuối **cố ý exit 1** chừng nào còn cổng PENDING/FAIL; đó là hành vi chống phát hành.
Không merge/deploy nhánh TEST; nếu gặp sai lệch thì ngừng, phục hồi về `test/p0-4-qa-runner-20261113` hoặc revert riêng file P0.5, giữ nguyên MAIN, test-theo-main và dữ liệu học sinh.
