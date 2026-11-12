# G7.2-B – Bộ quy tắc dựng hình biến thể (PILOT)
**Thời điểm:** 2026-11-12 · **Nhánh:** `g7-1-content-audit-20261112`
**Trạng thái:** `PILOT_LOGIC_PASS / CONTENT_SIGNOFF_PENDING / NOT_DEPLOYED`

## Mục tiêu và phạm vi
Tạo bộ máy **lập kế hoạch bố cục thuần dữ liệu** (không chạm HTML/GS/CSS đang chạy, không sửa PNG/WebP). Từ `object`, vai trò ảnh, các ràng buộc, câu hỏi và `seed`, trả về **kế hoạch dựng hình** với `asset_ids`, `placements`, nhóm đếm, nhãn đo lường hoặc grid. Đây chưa phải DOM renderer, chưa là API ảnh, chưa có ảnh gốc WebP hiển thị; các bản plan dùng dữ liệu thử nghiệm.

## Đầu ra GitHub
- `pilot_asset_profiles.json` – 22 hồ sơ ảnh kiểm soát riêng, thuộc tính số lượng 1 cho gà/sách/khối đơn lẻ là **PILOT_PROVISIONAL**, không tự ghi ngược Registry.
- `variant_engine.js` – hàm `buildPlan(input, registry, profiles, seed)`, `eligibleAssets`, `validateInput`, `stableIndex`.
- `test_variant_engine.cjs` – 26 ca Node test: các biến thể chính, sai màu/số lượng, đúng trang nguồn, dữ kiện lít/kg, 10/100 ô, đếm 3+3, random ổn định.
- `trial_plans_15.json` – 15 fixture G7.1-C có kế hoạch đầu ra được sinh bởi **mã engine đã commit** (14 `OK`, 1 `ASSET_REQUIRED_REVIEW` cố ý vì `SOURCE_FIGURE_ID` chỉ là placeholder).

## Các chính sách đã mã hóa
1. `DECORATIVE / ILLUSTRATIVE`: một ảnh có thể đại diện cho nhóm nếu không phải căn cứ tính đáp án; không tuyên bố có số lượng chính xác.
2. `DATA_BEARING`: đếm, nhóm, số lượng phải khớp dữ liệu biến thể. Ví dụ 3+3 tạo 6 placements trong hai nhóm A/B. Sách 5 cuốn tạo 5 placements từ ảnh đơn, không tự dùng ảnh chồng có số lượng không kiểm định.
3. `SOURCE_LOCKED`: chỉ xuất bản đúng Asset ID đã ghim trong Registry; nếu thiếu `ASSET_REQUIRED_REVIEW`, không random.
4. Lọc theo đối tượng, màu, closure/kiểu, dạng đơn/chồng trước khi chọn seed. Một hộp quà không tự biến thành chồng hộp; `KL_SH12_006` là hộp đơn, chồng hộp là `KL_M03_012`.
5. `ten_strip` cho ra grid 10 ô và `hundred_grid` cho ra 10×10 bằng UI primitives; sai cấu trúc thì từ chối, không hiển thị lưới giả.
6. `mass`/`capacity`: nhãn 2 kg / 3 l xuất phát từ dữ liệu bài sinh, **không khẳng định cân/mức nước trong bitmap không có chứng cứ**; kế hoạch dùng sơ đồ tạo mới, còn scale/kim cần renderer và QA riêng.
7. Random giả ngẫu nhiên ổn định theo seed; giữ một hình trong một lượt làm, có thể đổi ở lượt khác. Không dùng Math.random mỗi lần vẽ.
8. Trường hợp thiếu đối tượng, sai constraint, nhãn nguồn không tồn tại, số lượng vượt giới hạn hoặc không đủ profile -> `ASSET_REQUIRED_REVIEW` hoặc `INVALID_REQUEST`, **không đoán hình gần giống**.

## Kết quả test
- **26/26 PASS** với bộ kiểm thử logic chạy trên mã đã đọc lại từ GitHub, bằng V8 sandbox-compatible assertion harness. File Node test đã lưu để chạy lại qua lệnh `node --test asset-review/V5/G7_2_B/test_variant_engine.cjs` trên máy có Node (chưa xác nhận đã thực thi chính lệnh Node ngoài GitHub).
- 15/15 fixture có plan, gồm 14 OK và 1 yêu cầu xem lại hợp lệ: T15 mã nguồn `SOURCE_FIGURE_ID` cố tình không tồn tại.
- 22/22 ảnh pilot nằm trong Registry V5 288; các đối tượng gà/sách được gắn `PILOT_PROVISIONAL_SINGLE_ICON`, **không phải content QA PASS**.
- Chưa có kiểm thử ảnh render thực, không đo độ đẹp, số lượng hiển thị thực trên mobile/desktop, tốc độ tải, cache, alpha hay WebP byte của 22 ảnh pilot.
- 288 ảnh gốc và Registry V5 chưa sửa. Quy tắc chỉ giới hạn 22 profile; các ảnh khác **chưa nằm trong phạm vi pilot**.

## Cổng cần vượt trước G7.2-C hoặc tích hợp
1. Chạy Node `--test` trên môi trường clone/pull và lưu log runtime độc lập.
2. Dựng **visual sandbox** từ WebP gốc (KHÔNG ảnh giả): so hình 3+3, sách 1/5, hộp đơn/chồng, giày đúng màu, grid 10/100, kg/lít; không lẫn dữ kiện trên bitmap.
3. Kiểm ảnh thực tế gà/sách/khối để xác minh `objects_per_image=1`, sau đó chuyển profile PILOT_PROVISIONAL thành VERIFIED khi có bằng chứng.
4. Gắn toàn bộ asset với source URI/chính sách truy cập CDN sau kiểm tra checksum G7.3. Chỉ khi được nghiệm thu mới phát hành vào Web App TEST.

## Khôi phục nếu hội thoại bị treo
- Mở nhánh `g7-1-content-audit-20261112` → `asset-review/V5/G7_2_B/`.
- Đọc `README` và `trial_plans_15.json` trước; so `variant_engine.js` và `test_variant_engine.cjs` theo commit.
- Không merge `main` hoặc `test-theo-main`. Tạo commit riêng, bổ sung `V5_CHANGE_HISTORY` và không ghi đè dữ liệu gốc.
- Rollback bằng `git revert <commit_sha>` trên nhánh G7 khi cần; không xóa lịch sử.
