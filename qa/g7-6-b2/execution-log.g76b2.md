# G7.6-B.2 – Nhật ký thao tác và điểm khôi phục (append-only)

**Ngày:** 2026-11-15. **Nhánh:** `test/g7-6-b2-real-producer-submode-chrome-20261115`. Phạm vi TEST riêng; không đụng các nhánh ứng dụng, G6, P0.6 hoặc GAS.

| Thứ tự | Commit / CI | Thao tác | Kiểm chứng |
|---|---|---|---|
| 00 | `0a8768ac5658f6396e76f68a3513a3c1e6843918` | Khởi tạo nhánh B.2 từ baseline G7.6-B đã PASS | Không làm lại 296 A hoặc 221 B |
| 01 | `613b3237a4027e1cd15e9fcffd3ac87529b60fa1` | Thêm `submode-bridge.cjs`: D5 Tangram / D9 difference | Tái sử dụng native core G7.4 |
| 02 | `b760f14b23b021b918c23233f0a1bda01b38d6ac` | Thêm `real-producer-bridge.cjs`: P0.6 E02/E03 thực, pin SHA | Không copy source hoặc tạo generator giả |
| 03 | `fe2c9259b363f28249255822ee4be7d9d54ff5bc` | Thêm test P0.6 thực & submode/negative | 123 assertions sau CI |
| 04 | `a16dfd154db38cffc73517475363146e796006a5` | HTML Chrome harness mount native views | Không tạo UI renderer mới |
| 05 | `e362322e629189e9e3cacd21a00b3f9da56c3793` | Parser Chrome DOM/interaction | Browser 33 checks |
| 06 | `737670df52b7e59f4a364be4869e27855ee4d189` | Tạo CI P0 checkout riêng và Chrome | Run đầu không PASS vì helper CSS chưa tồn tại ở commit đó, được giữ làm lịch sử |
| 07 | `4e203972d180e2a61fbdd97f7cd8878276f6ff20` | Thêm helper trích CSS từ bản V1.2 nguyên gốc | CI `43687232787`: PASS, 123 B.2 + 517 inherited, Chrome headless 500px/1440px |
| 08 | `6fa32eb3e62d6adb928eabd26d05e3994b810e60` | Bổ sung Chrome DevTools true mobile emulation script | Cần wire CI |
| 09 | `ffcd6d61cfc75bca1e43b9d690631d77046b2f04` | CI thực chạy 390px CDP | Run `43687399139` PASS; 390 CSS viewport, no overflow, 33 checks; artifact `14150833681` |
| 10 | `249f7b81efff15181f77762b3d64501cd26bd8e9` | Báo cáo G7.6-B.2 | B2-7 chưa mở |
| 11 | `89b4d91f540975b3cffb84d9f5f29c9f115cd39b` | Checkpoint B.2 | Ghi đầy đủ nguồn, QA, rollback |

## Nhánh nguồn phải bảo vệ
- G7.6-A `ee20a8b7394e22e6028d6760c49b77c54a2814cc`.
- G7.6-B `0a8768ac5658f6396e76f68a3513a3c1e6843918`.
- P0.6 producer `c0c5620f30edd92ab45d4ec87a8a07ffa38948e2`, Actions checkout độc lập.
- Trước khi tiếp tục: đọc checkpoint JSON, báo cáo, audit CI và current HEAD, so sánh diff với B; không lấy phần code ngẫu nhiên của `test-theo-main` đưa sang B.2.

## Đã kiểm chứng
- Producer P0.6 E03: 8 real questions; 2 vertical map D2, 6 mental NUMBER_INPUT intentionally blocked; E02 CHOICE 2 map D4.
- Submode native D5 Tangram, D9 difference trên fixture khác hẳn producer P0.6; không giả định đã kích hoạt generator mode.
- CI node: A 296 PASS, B 221 PASS, B.2 123 PASS; Chrome real 1440 width and CDP actual 390 width, 33 checks each.
- B.2 demo không grades, không TTS audible, không auto asset, không Web App TEST, không student/stars.
- Chrome command `--window-size=390` tạo width thật 500; giải quyết bằng CDP verify 390 CSS actual và no-overflow.

## Điểm dừng/BLOCKED
- 6 bài `math.mental` NUMBER_INPUT cần renderer/mapping tương đương hợp đồng; không ép sang D1.
- Tangram và D9 difference chưa do P0.6 producer sinh, chưa có P0 pedagogic policy cấp quyền.
- Screenshot cho owner review; Chrome không chứng minh chạm trên thiết bị vật lý hoặc TTS audio; asset 288 image content QA chưa hoàn tất.
- G6 D10 trusted grading, GAS TEST V6, merge `test-theo-main`, production đều chưa được phép.

## Phục hồi / rollback
1. Mở `qa/g7-6-b2/checkpoint.g76b2.v1.json`; kiểm commit/CI baseline và artefact.
2. Xem `docs/kiem-dinh/G7.6-B2_REAL_PRODUCER_SUBMODE_CHROME_QA_20261115.md` và run https://github.com/Nguyennth19/new-lop-2/actions/runs/43687399139.
3. Đối chiếu protected diff so với `0a8768ac...`; không rerun G7.6-A/B nghiệm thu.
4. Nếu fail gate: dừng tiêu thụ B.2 và quay lại commit B, tuyệt đối không ghi đè renderer/P0.6/GAS.
