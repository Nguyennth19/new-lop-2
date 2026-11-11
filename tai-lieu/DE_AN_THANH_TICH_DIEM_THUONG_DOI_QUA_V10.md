# Đề án hệ thống Thành tích – Sao thưởng – Đổi quà V1.0
Ngày: 11/11/2026 | Trạng thái: **thiết kế thảo luận, chưa triển khai logic sản phẩm**
Nguồn kỹ thuật: repo `Nguyennth19/new-lop-2`, ảnh giao diện Thành tích do chủ dự án gửi.

## 1. Hiện trạng xác minh
- `GiaoDien.html` hardcode: `195` sao, `02:15:21` thời gian, `2/5` huy hiệu, `4` bài tập, `1` kiểm tra, `7` bài giảng; cột 7 ngày cũng là số liệu mẫu tĩnh.
- `15_ThanhTichHoatDong.html`: `activityRecords` là mảng dữ liệu demo.
- `16_LichHocChuyenCan.html`: đã có `localStorage` cho ngày bắt đầu và ngày hoàn thành thực, nhưng `LICH_TIET_MAU` là lịch ví dụ; chưa có bộ thống kê/ledger xuyên thiết bị.
- `19_KhongGianHocToan.html`: lưu tiến độ và kết quả theo trình duyệt; không dùng làm nguồn số dư điểm thưởng tin cậy.
- `DuLieuToanSheet.gs`: có dữ liệu câu hỏi Toán Bài 20. Chưa có backend điểm thưởng và đổi quà.

## 2. Nguyên tắc giáo dục
- Khuyến khích tiến bộ, kiến thức, thói quen và nỗ lực; không chỉ số phút ngồi trước màn hình.
- Không trừ điểm vì sai bài, nghỉ ốm hoặc không học liên tục. Cho phép phụ huynh đánh dấu ngày nghỉ hợp lý.
- Bé lựa chọn phần thưởng, phụ huynh quyết định đổi thưởng; ưu tiên quà phi màn hình, giới hạn quà màn hình.
- Không bảng xếp hạng công khai giữa trẻ, không cơ chế quay thưởng/ngẫu nhiên, không quảng cáo để kiếm điểm.
- Tính theo kết quả được kiểm tra; không trao thưởng lại khi nạp trang, gửi lại request hoặc làm lại cùng một LV.

## 3. Thang điểm đề xuất thử nghiệm (PHỤ HUYNH CÓ THỂ CHỈNH)
| Sự kiện | Sao cộng | Điều kiện |
|---|---:|---|
| Hoàn thành LV1 | 15 | đạt >=70% câu đúng, lần đầu cho lesson+LV |
| Hoàn thành LV2 | 25 | đạt >=70%, lần đầu |
| Hoàn thành LV3 | 35 | đạt >=70%, lần đầu |
| Hoàn thiện xuất sắc | +5 | 100% câu đúng ở LV, tối đa một lần/LV |
| Tiến bộ cá nhân | +5 | điểm tăng ít nhất 20 điểm phần trăm so với lần đầu, tối đa một lần/LV |
| Hoạt động học hợp lệ đầu ngày | +5 | tối đa một lần/ngày; cần tương tác có kết quả, không chỉ mở tab |
| Luyện tập kiên trì | +5 | sửa đúng bài trước đó làm sai, tối đa một lần/LV |
- Các cột là **quy tắc thử nghiệm** chứ không phải chỉ tiêu sư phạm bắt buộc.
- LV có câu hỏi chưa có khả năng kiểm tra tự động: không tự cộng điểm bằng thao tác mở xem; có cơ chế xác nhận học xong riêng.
- Một bài LV chỉ được cộng một lần cho từng loại thành tích, truy bằng `event_key`; cho phép phụ huynh điều chỉnh điểm thủ công với giải trình.
- Không cộng sao dựa trên số phút học hoặc số lượt bấm; số phút là chỉ số hỗ trợ.

## 4. Hai loại điểm bắt buộc tách biệt
- **Sao hành trình** = tất cả sao kiếm được trong quá trình học (XP/lifetime), không giảm sau khi đổi.
- **Ví sao** = tổng sao cộng hợp lệ − sao đã trừ do đổi quà/điều chỉnh; không được âm.
- **Huy hiệu** là vĩnh viễn (trừ khi phát hiện gian lận và phụ huynh xử lý). **Điểm bài kiểm tra** (thang 10) là chỉ số học lực, không tự đồng nhất với Sao.
- Ví dụ: đạt 320 sao, đã đổi 100 sao, ví còn 220; huy hiệu và 320 XP giữ nguyên.

## 5. Sáu thẻ dashboard mới
1. Thời gian học chủ động (chỉ tích lũy khi đang tương tác, dừng khi tab ẩn/không hoạt động).
2. Sao hành trình (XP) / số dư Ví sao (cho bé thấy cả hai).
3. Số huy hiệu đạt/tổng số huy hiệu theo quy tắc.
4. Số bài/cấp độ đã hoàn thành duy nhất (không đếm làm lại).
5. Mức độ thành thạo (%) theo chủ đề và môn, có cỡ mẫu/tần suất rõ ràng.
6. Số ngày học tuần này và chuỗi chuyên cần (cho nghỉ hợp lý).
- Thông số các bài kiểm tra vẫn có trong tab phân tích sâu.

## 6. Biểu đồ
- **7 ngày gần nhất**: các cột số phút học *chủ động*, chiều cao số phút thật, phân nhóm 3 môn; tooltip phút và số bài. Ngày thiếu dữ liệu phân biệt với ngày 0.
- **Theo môn**: 3 đường hoặc thanh thể hiện tỷ lệ hoàn thành mục tiêu Toán, Tiếng Việt, Tiếng Anh; không dùng điểm thi cộng lẫn vào phút.
- **Xu hướng 4 tuần**: độ chính xác và số bài hoàn thành; chỉ so sánh những bài/cấp độ tương đương.
- **Ma trận năng lực**: từng chủ đề/kỹ năng; hiển thị Đang luyện / Tiến bộ / Vững, dựa trên lần đánh giá gần đây và cỡ mẫu hợp lệ.
- **Tiến độ mục tiêu tuần**: vòng tiến độ/bậc thang 4 ngày học hợp lệ, mỗi ngày khoảng 10–20 phút chia phiên phù hợp.
- Không hiển thị điểm số tương đối so với trẻ khác.

## 7. Danh mục huy hiệu ban đầu
| ID | Tên | Điều kiện minh họa |
|---|---|---|
| FIRST_STEP | Ngôi sao đầu tiên | 1 cấp độ đầu tiên hoàn thành |
| TRY_AGAIN | Em không bỏ cuộc | sửa đúng câu sau khi đã làm sai |
| WEEK_3 | Chăm học | 3 ngày hợp lệ trong 1 tuần (không cần liên tiếp) |
| WEEK_5 | Bền bỉ | 5 ngày học hợp lệ trong tuần |
| TEN_LESSONS | Nhà khám phá | 10 bài duy nhất hoàn thành |
| MATH_10 | Nhà toán học nhí | 10 bài Toán đạt tiêu chí |
| VIET_10 | Bạn yêu tiếng Việt | 10 bài Tiếng Việt đạt tiêu chí |
| EN_10 | English Explorer | 10 bài Tiếng Anh đạt tiêu chí |
| FULL_MASTERY | Thám hiểm 3 cấp độ | 1 bài đủ LV1/2/3 |
| IMPROVE_20 | Tiến bộ vượt bậc | tăng kết quả một chủ đề >=20 điểm phần trăm |
| THIRTY | Siêu khám phá | 30 bài duy nhất hoàn thành |
| MONTH_GOAL | Chiến binh tháng | hoàn thành mục tiêu tuần 3 trong 4 tuần |
- Ảnh huy hiệu sáng và có ngày đạt; huy hiệu chưa đạt hiển thị điều kiện và tiến độ, không chỉ khóa.
- Có thể bổ sung huy hiệu theo bộ sách/kỹ năng, phải có ID duy nhất và phiên bản quy tắc.

## 8. Đổi thưởng: phụ huynh xác nhận
| Reward ID | Quà minh họa | Sao | Kiểm soát |
|---|---|---:|---|
| FAMILY_GAME | Chọn trò chơi cả nhà | 60 | phụ huynh sắp xếp |
| STICKER | Sticker/sưu tầm | 80 | phụ huynh cấp |
| STORY | Chọn truyện kể buổi tối | 40 | chọn theo sở thích, không thay quyền được đọc truyện thường ngày |
| WEBGAME_10 | Chơi web-game đã duyệt 10 phút | 80 | tối đa theo ngày, duyệt trước, giới hạn bằng đồng hồ / ứng dụng phụ huynh |
| YTKIDS_10 | Xem YouTube Kids 10 phút | 100 | phụ huynh duyệt, không tự mở YouTube thường |
| OUTING | Chọn hoạt động cuối tuần | 200 | phụ huynh sắp xếp |
- Giá sao là giá khởi tạo, không phải tương quan học-phút hay khuyến nghị sức khỏe.
- Giới hạn ban đầu gợi ý: quà màn hình không quá 20 phút/ngày và 2 yêu cầu/tuần, vẫn phải nằm trong giới hạn màn hình do phụ huynh đặt.
- Không biến thời gian chơi thành điều kiện bắt buộc học, không bớt đi quyền nghỉ ngơi, vận động và các sinh hoạt cơ bản.
- Trạng thái yêu cầu: `requested` → `approved` → `delivered`; hoặc `rejected`/`cancelled`. Chỉ trừ sao theo cơ chế giao dịch rõ ràng có thể hoàn lại khi từ chối.
- Trẻ không thể tự phê duyệt; parent PIN/tài khoản riêng, audit log bắt buộc.

## 9. Kết nối ứng dụng bên thứ ba
- **Giai đoạn 1 (khả thi ngay):** Web App cấp phiếu đổi thưởng, phụ huynh bấm duyệt; mở Family Link **Bonus time** hoặc thiết lập YouTube Kids Timer thủ công. Đây không phải API tự động.
- Google Family Link có hướng dẫn Bonus time: https://support.google.com/families/answer/15957417 . Không xác nhận có public API được hỗ trợ để Web App điều chỉnh giới hạn.
- YouTube Kids timer có kiểm soát của phụ huynh: https://support.google.com/youtubekids/answer/6130558 .
- **Giai đoạn 2:** API của game/app do gia đình kiểm soát (có hợp đồng/hỗ trợ chính thức) → webhook phiếu quyền truy cập có hạn.
- **Giai đoạn 3:** Ứng dụng Android/extension riêng *nếu thật sự cần*, quyền phụ huynh và Android/Chrome policy riêng; Web App thuần không thể tự khóa/mở tất cả website và ứng dụng thiết bị.
- Không dựa vào endpoint nội bộ đảo ngược của Family Link hoặc token Google nhạy cảm trong Apps Script frontend.

## 10. Kiến trúc dữ liệu / chống cộng trùng
Đề xuất Google Sheet các tab:
- `HocSinh` (id bí danh, không yêu cầu tên thật nếu không cần).
- `PhienHoc` (sessionId, thời điểm, tương tác, môn, activeSeconds).
- `LanLamBai` (attemptId, lessonId, LV, tổng câu, đúng, firstSubmission, timestamps).
- `SuKienDiem` (eventId, eventKey duy nhất, profileId, ruleVersion, deltaStars, sourceAttemptId, occurredAt, createdAt).
- `ViSao` (tổng hợp tính từ ledger, KHÔNG là nguồn sự thật).
- `HuyHieu` (profileId, badgeId, unlockedAt, evidenceEventId).
- `DanhMucQua` (rewardId, price, weeklyCaps, parentalApproval, enabled).
- `YeuCauDoiQua` (requestId, requested/approved/delivered/rejected/refunded, parentId, timestamps).
- `CauHinhThuong` (mốc ngày, mức giá, kiểm soát tối đa).
- `NhatKyQuanTri` (điều chỉnh, lý do, phụ huynh).
Server `.gs` ghi và duyệt giao dịch bằng LockService + eventKey idempotency; không dựa vào localStorage làm nguồn số dư. Điểm chấm xác thực ở server theo đáp án gốc, không tin điểm do JS client gửi. Mỗi hoạt động ghi 1 lần, dữ liệu cùng một profile đồng bộ giữa Chrome máy tính và tablet Android. Chỉ load summary/badges/charts khi mở tab Thành tích và cache summary có phiên bản ngắn.
Lưu ngày theo `Asia/Ho_Chi_Minh`; lưu thời gian UTC trong log để đối chiếu. Dữ liệu demo không tự chuyển thành điểm có thể đổi quà.

## 11. Lộ trình triển khai đề xuất
- **P0:** phân loại các thành tích demo; định nghĩa các sự kiện học thật và điểm/ ví sao; kiểm thử không cấp điểm lặp khi retry/double click.
- **P1:** backend ghi attempt + event ledger và dashboard 6 chỉ số thực; import dữ liệu lịch sử nếu kiểm chứng được.
- **P2:** huy hiệu, biểu đồ 7 ngày/4 tuần, tiến độ kỹ năng; giữ giao diện bé dễ hiểu.
- **P3:** danh mục quà và phiếu đổi thưởng, phụ huynh duyệt thủ công, lịch sử giao dịch và hoàn sao.
- **P4:** tích hợp ứng dụng ngoài có API được hỗ trợ và thử nghiệm thiết bị Android.

## 12. QA nghiệm thu
Cần kiểm tra ít nhất: 100 lần gửi cùng attempt chỉ cộng 1; làm lại LV không cộng lại cơ sở; tăng kết quả đạt mốc mới chỉ cộng bonus một lần; phụ huynh từ chối có hoàn sao; ví không âm; quản trị điều chỉnh có nhật ký; đồng bộ máy tính/tablet; tab không tương tác không tính thời gian; mốc nửa đêm và timezone; khi Sheet lỗi không cộng sao vô căn cứ.

### Tham khảo
- Nghiên cứu tổng quan phần thưởng gamification năm 2026: https://doi.org/10.1016/j.edurev.2026.100766 ; đề cao phần thưởng ít áp lực và tự chủ chọn quà, chưa có kết luận tuyệt đối về mọi trẻ.
- Meta-analysis K–12 2025: https://doi.org/10.1002/pits.70056 .
- Google Family Link bonus time: https://support.google.com/families/answer/15957417?hl=en .
- YouTube Kids Timer: https://support.google.com/youtubekids/answer/6130558?hl=en .

**Trạng thái:** tài liệu thảo luận được lưu vào GitHub, chưa sửa mã giao diện/logic, chưa tạo hoặc ghi điểm vào Google Sheet.
