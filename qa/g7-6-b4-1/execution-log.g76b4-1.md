# G7.6-B.4.1 – OWNER EVIDENCE INTAKE / EXECUTION LOG

**Ngày:** 2026-11-15 · **Branch:** `test/g7-6-b4-1-owner-evidence-signoff-20261115` · **B4 base:** `322015ee50d76fcbc067f9e4ee90ae471f3dd062`.
**Mục tiêu:** tiếp nhận có kiểm soát phản hồi trực tiếp của người dùng và phiếu JSON có 13/13 mục PASS, không làm giả chữ ký hay nghiệm thu sư phạm.

| # | Nguồn / commit | Thao tác |
|---|---|---|
| 0 | Tệp người dùng tại `/mnt/data/G76B4_Manual_Device_Review_NOT_APPROVED.json` | Đọc JSON gốc được người dùng cung cấp, kiểm schema, 13 checkboxes, viewport Windows Chrome. SHA256 `d039fd3b4ef1aac636c4a57ded40e3a6fe11f29cb08169bde830fe8a13426527`, 1838 bytes. |
| 1 | Nhánh B4 `322015ee...` | Khởi tạo B4.1 độc lập; không sửa B4, P0.6, G7.4 hay main/test-theo-main. |
| 2 | Drive `16wGMStVH__nndQApRqEFPN_h5o69q4wR` | Lưu bản JSON người dùng nguyên gốc trong thư mục dự án Lớp 2, xác minh 1838 bytes và parent. |
| 3 | `16254d749847d1b5b2718822d5b88d94443824d6` | Ghi snapshot JSON đúng bytes vào GitHub TEST, không đổi `reviewerApproved:false`, `reviewerSignature:null`. |
| 4 | `a5a768fb864f4e5d0c0cdb85d256598ba47cd90e` | Biên nhận xác nhận người dùng qua chat, phân biệt tự xác nhận đa nền tảng và chứng cứ cụ thể Windows Chrome. |
| 5 | `ed4dfb2593e4b88011ff1fcf1d1d4bd677229674` | Node validator: SHA chính xác, 13 checkboxes true, negative tests cấm giả mạo chữ ký/chính sách/GAS/D10. |
| 6 | `2390bea50e8d31c43c39089b5f256ad15c36d741` | CI nguồn pin B4 và P0.6, inherited 1005 assertions, B4.1 86 assertions. |
| 7 | Run `43721619029` | GitHub Actions SUCCESS tại commit workflow `2390bea50e8d31c43c39089b5f256ad15c36d741`, artifact `14164628043`. |
| 8 | `3900255e5143492115df5bab3f704b4a305e156c` | Báo cáo chi tiết trong `docs/kiem-dinh/G7.6-B4.1_OWNER_EVIDENCE_INTAKE_QA_20261115.md`. |
| 9 | Google Doc `1X7Lu_WVpr8zuMC1Akaht7BrRtb72VSUaRogFz_wH9Ao` | Lưu và đọc kiểm tra 44 đoạn biên bản trong thư mục dự án. |
| 10 | `86251b3088a6bb59f5ccc0bdacfce2a947a8f3b8` | Checkpoint JSON: 1091 assertions A–B4.1; owner UX attested; user source signature vẫn thiếu; app/policy/graded paths khóa. |
| 11 | CURRENT | Journal append-only. Sau commit này xác minh CI trên HEAD cuối, không tạo PR/merge/deploy. |

## Quy tắc bảo vệ
- Người dùng xác nhận UI/tương tác/đa nền tảng qua chat: **OWNER_ATTESTED**.
- Tệp JSON cụ thể chỉ chứng minh phiếu tạo trong **Windows Chrome 157 ở CSS viewport 1536×791** và tất cả 13 mục được đánh dấu; không chứa thông tin riêng của điện thoại Android/iPhone.
- Không biến xác nhận trải nghiệm thành chữ ký số hoặc phê duyệt chính sách E04. Không tự đổi `reviewerApproved:false` hoặc `pedagogicalApproval:false`.
- Không đăng ký `MATH_MENTAL_NUMBER_INPUT_V1` vào manifest khi chưa có cổng riêng; không gắn E04 với bài SGK chưa xác minh. Không chạm GAS, G6, D10, scores, stars, records.
- Rollback ngay: ngừng tiêu thụ hồ sơ B4.1 và sử dụng checkpoint B4 `322015ee50d76fcbc067f9e4ee90ae471f3dd062`.

**Bước tiếp:** B4.2 – nhận chứng cứ chi tiết theo từng thiết bị nếu cần, rồi giải quyết quyết định riêng về đăng ký renderer phụ trợ và chính sách E04 với bài–trang SGK.
