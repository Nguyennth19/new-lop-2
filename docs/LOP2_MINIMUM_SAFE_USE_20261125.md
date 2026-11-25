# Lớp 2 — Hướng dẫn sử dụng tối thiểu an toàn

**Mã tài liệu:** `LOP2_MINIMUM_SAFE_USE_20261125`  
**Trạng thái:** `DEMO_ONLY / NOT_READY_FOR_STUDENT_USE`  
**Phạm vi:** hướng dẫn sử dụng tối thiểu, không thay thế nghiệm thu hoặc phê duyệt phát hành.

## 1. Kết luận điều hành

Hiện có thể dùng bản V2.1 trên nhánh `main` để **xem và trình diễn giao diện với dữ liệu mẫu**, nếu Owner đã có sẵn một URL Web App hợp lệ. Chưa có bằng chứng trong repository xác nhận URL triển khai hiện hành, vì vậy tài liệu này không cung cấp hoặc suy đoán URL.

Không dùng bản này để tổ chức học thật, chấm điểm, theo dõi tiến độ học sinh, báo cáo phụ huynh hoặc ghi nhận kết quả chính thức.

## 2. Phân biệt ba phần của dự án

### A. Ứng dụng V2.1 trên `main` — chỉ demo giao diện

README tại checkpoint `main@1d9bb77420e367d1739d2077f9e8c928a0417185` xác định:
- Ứng dụng GAS V2.1 sử dụng dữ liệu mẫu.
- Tiến độ hiện lưu trong `localStorage`, chưa đồng bộ theo tài khoản.
- Hàm hỗ trợ đọc Sheets `layThongTinDuLieuBaiHoc` chưa được nối vào giao diện để sinh bài học.
- README cảnh báo không triển khai công khai với học sinh thật trước khi QA phân quyền, lưu dữ liệu và đối chiếu kiến thức SGK.

Do đó, bản V2.1 chỉ phù hợp để xem bố cục, điều hướng và thao tác giao diện bằng dữ liệu mẫu. `localStorage` không phải hồ sơ học tập tập trung và không bảo đảm đồng bộ giữa thiết bị/trình duyệt.

### B. Universal Learning Template / N4–N5 — chưa đủ điều kiện đưa vào sử dụng

Checkpoint N4 ghi nhận W1-01..05 có 5/5 kiểm thử kỹ thuật theo phạm vi PASS, nhưng 0/5 được QA độc lập ký và 0/5 đóng RTM. N0-S A3/A4 vẫn cần xác nhận nhận bàn giao độc lập có checksum và thời điểm xác thực. N5 chưa đạt điều kiện đóng chính thức.

Các kết quả CI kỹ thuật không thay thế chữ ký QA/Owner, nghiệm thu thiết bị thực tế hoặc quyền triển khai. Không suy diễn trạng thái LAB thành quyền dùng TEST/MAIN.

### C. N13 synthetic lesson pack — chưa được dùng với học sinh

Báo cáo N13 tại commit `c9a44da52cfed6b8c1eb5673e2d9f2eb701d6305` kết luận:
- 0/10 biến thể được admission; `studentPlayable=0`.
- `sourceExactApproved=false`, `skillIdApproved=null`, `rendererGrant=DENY`, `publicVariant=null`, `studentRelease=false`.
- SYNTH_5 chỉ PASS trong phạm vi prompt QA và Owner xác nhận TTS thiết bị; vẫn chưa được admission.
- SYNTH_3 và SYNTH_4 còn điều kiện tiên quyết sư phạm; SYNTH_6 còn chờ reviewer đủ năng lực đánh giá ngoại lệ nhiều đáp án theo Governance V16.
- Bảy source-routing anchors và bốn estimation anchors vẫn HOLD; ngân hàng bài chưa đạt ngưỡng V16 cho phát hành bài học đầy đủ.

Issue #26 đang chờ Owner chỉ định reviewer đủ năng lực và xác nhận tính độc lập. Không tự gán reviewer.

## 3. Quy trình demo an toàn tối thiểu

Chỉ thực hiện khi Owner đã có URL Web App V2.1 được phép truy cập:

1. Mở URL hiện có do Owner cung cấp; không lấy URL từ tài liệu cũ hoặc tự suy đoán deployment.
2. Chỉ dùng dữ liệu mẫu/giả lập. Không nhập tên, mã định danh, kết quả, thông tin liên hệ hoặc dữ liệu thật của học sinh.
3. Chỉ kiểm tra giao diện: trang chủ, lịch, ba môn học, lộ trình, LV1/LV2/LV3, trang thành tích và hiển thị trên các kích thước màn hình.
4. Nếu thử refresh, hiểu rằng tiến độ chỉ được lưu cục bộ trong trình duyệt đó; không coi đây là đồng bộ tài khoản hay sao lưu.
5. Không dùng kết quả trong demo để chấm điểm, đánh giá năng lực hoặc báo cáo học tập.
6. Kết thúc demo, xóa dữ liệu thử trong trình duyệt nếu thiết bị được dùng chung.

Nếu chưa có URL triển khai được Owner xác nhận, dừng ở mức đọc mã/tài liệu; không tự triển khai hoặc đồng bộ GAS.

## 4. Các thao tác bị cấm trong phạm vi hướng dẫn này

- Không đưa dữ liệu học sinh thật vào V2.1, TEST, Sheets hoặc GAS.
- Không bật trusted grading, ghi điểm, ghi tiến độ hoặc ghi dữ liệu học sinh.
- Không đưa 10 biến thể N13 vào luồng học sinh; không coi SYNTH_5 đã QA PASS là đã được admission.
- Không cấp skill, renderer, `publicVariant`, READY, Pilot hoặc Release.
- Không thay đổi manifest, source pack, DTO, grader, GAS, Sheet, Drive ACL, deployment hoặc nhánh MAIN.
- Không merge hoặc deploy bất kỳ nhánh QA/LAB nào.

## 5. Điều kiện tối thiểu trước khi chuyển từ demo sang học thật

### Đối với V2.1 hiện hữu
- Có deployment/URL do Owner xác nhận và xác định rõ phiên bản source tương ứng.
- QA phân quyền, dữ liệu, lưu trữ, khôi phục và thiết bị thực tế.
- Nối dữ liệu bài học vào giao diện chỉ sau khi hợp đồng dữ liệu và quyền đọc/ghi được nghiệm thu.
- Có nội dung SGK được đối chiếu và phê duyệt; không lấy dữ liệu mẫu làm nội dung dạy học chính thức.

### Đối với Universal Learning Template / N4–N5
- Hoàn tất N0-S A3/A4 với xác nhận độc lập có checksum và thời điểm xác thực.
- QA độc lập ký từng W1-01..05; RTM xác nhận 5/5 đóng và không còn blocker.
- Hoàn tất các cổng tiếp theo theo roadmap; không bỏ qua quyền ghi TEST, khôi phục, kiểm soát quyền và phê duyệt Owner.

### Đối với N13
- Owner chỉ định reviewer sư phạm đủ năng lực; xác minh chuyên môn và độc lập.
- Reviewer kiểm tra đủ 10 biến thể, ưu tiên SYNTH_3, SYNTH_4, SYNTH_6; dẫn nguồn PDF/trang/hash và kết luận riêng từng biến thể.
- Đóng các HOLD về source exactness, skill, renderer, grading và bank sufficiency theo từng quyết định riêng.
- Owner phê duyệt phạm vi admission và cho phép tích hợp bằng quyết định tách biệt.

## 6. Nguồn bằng chứng

- [README V2.1 trên main](https://github.com/Nguyennth19/new-lop-2/blob/main/README.md)
- [Checklist QA Apps Script](https://github.com/Nguyennth19/new-lop-2/blob/main/tai-lieu/KIEM_THU.md)
- [Hướng dẫn triển khai hiện có](https://github.com/Nguyennth19/new-lop-2/blob/main/tai-lieu/HUONG_DAN_TRIEN_KHAI.md)
- [N13 Consolidated Admission Review](https://github.com/Nguyennth19/new-lop-2/blob/qa/n13-consolidated-admission-review-20261125/qa/n13-semantic-coverage/N13_CONSOLIDATED_ADMISSION_REVIEW_20261125.md)
- [Issue #26 — N13 Pedagogy Review Handoff](https://github.com/Nguyennth19/new-lop-2/issues/26)
- [Issue #15 — N0-S / N4–N5 evidence and sign-off tracking](https://github.com/Nguyennth19/new-lop-2/issues/15)

## 7. Giới hạn và rollback

Đây là tài liệu hướng dẫn, không phải phê duyệt triển khai. Tài liệu được tạo trên nhánh riêng `docs/minimum-safe-use-20261125`, bắt đầu từ `main@1d9bb77420e367d1739d2077f9e8c928a0417185`. Không sửa source ứng dụng, cấu hình, dữ liệu, GAS, Sheets, ACL, TEST/MAIN hoặc deployment.

Có thể bỏ toàn bộ nhánh tài liệu này mà không ảnh hưởng source ứng dụng hay các nhánh QA/LAB.
