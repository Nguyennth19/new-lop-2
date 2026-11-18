# P1.1 — BIÊN BẢN CHỦ DỰ ÁN CHẤP THUẬN SOURCE ROUTING 19/19

**Ngày ghi nhận theo cuộc trò chuyện:** 18/11/2026 (Asia/Ho_Chi_Minh).
**Quyết định:** `OWNER_APPROVED_SOURCE_SELECTION_SCOPE_ONLY`.
**Tài liệu chính thức:** [`P1_1_OFFICIAL_SOURCE_ROUTING_19.json`](P1_1_OFFICIAL_SOURCE_ROUTING_19.json).
**Commit lần đầu phát hành:** `8719e1af93346b5767c6cb76054aff4bbe69b89d`.
**Git blob SHA của routing JSON:** `1930790369530aecd4b95ab0ce793dd8d87c6477`.
**Ma trận chủ dự án phê duyệt:** `qa/p1-1/P1_1_DEEP_SOURCE_DECISIONS_19.review.v2.json`, commit `38593b68484db86c0c4aa63c2da17a6d0f0406a3`, blob `e361b934b32bb42a0e0f8075a8df3d2ee09b562a`.
**Baseline cũ giữ nguyên:** `bf3d2adf90aa2594ac7a5b407218c36a028bc9ea`.

## 1. Lời xác nhận trực tiếp của chủ dự án

> **xác nhận toàn bộ ma trận 15 GIỮ / 4 THAY theo phạm vi** -> có thể phát hành `P1_1_OFFICIAL_SOURCE_ROUTING_19` làm nguồn tham chiếu chính thức cho P1.2 và P1.3. Các cổng riêng về source-exact SGK, GAS thực tế, quyền renderer và phát hành cho học sinh vẫn giữ nguyên.

Đây là **phê duyệt được ghi nhận từ cuộc trò chuyện của chủ dự án**, không phải chữ ký số, không có timestamp ký điện tử và không khẳng định xác thực danh tính độc lập.

## 2. Kết luận hành chính

| Loại hồ sơ | Trạng thái |
|---|---|
| 19 lựa chọn nguồn quản trị P1.1 | **OWNER APPROVED** |
| 15 nguồn giữ / 4 nguồn thay đúng scope | **OWNER APPROVED** |
| `P1_1_OFFICIAL_SOURCE_ROUTING_19` | **ISSUED — P1.2/P1.3 SOURCE SELECTION ONLY** |
| Nguồn SGK/VBT từng item / ảnh ngữ nghĩa | **KHÔNG được cấp phép thêm** |
| G2B 96 kiểm nguồn độc lập | **0/96, còn pending** |
| G7.6 sáu hồ sơ chính sách/owner | **0/6, còn pending** |
| GAS TEST thực và version-to-Git-SHA | **CHƯA nghiệm thu** |
| Quyền tự động renderer/asset/publicVariant | **KHÔNG được cấp phép** |
| Phát hành học sinh / ghi điểm sao | **NO-GO** |
| 10 bổ sung `PROJECT_RULES` review candidate | **0/10, chưa chính thức** |

## 3. Bốn thay nguồn chỉ phục vụ P1, không thu hồi PASS cũ

- **G3A → G3B:** chỉ mã chấm tin cậy TEST; giữ PASS G3A; chưa E2E GAS thật.
- **B024 alpha → B024.lesson.json:** chỉ gói làm việc P1.2; giữ alpha và nguồn lịch sử, 0 playable.
- **DATA_CONTRACT_V2 → `lessonpackage.schema.v1.json`:** chỉ schema nội bộ cho 24 LessonPackage TEST; tài liệu DATA_CONTRACT_V2 và schema 2.0.0 candidate không bị thu hồi.
- **PROJECT_RULES review candidate → `AGENTS.md`:** chỉ hướng dẫn tác nghiệp AI/Dev, không phải chốt 10 chính sách chưa duyệt.

## 4. Ranh giới thay đổi và rollback

Chỉ ghi tệp chính thức và biên bản trên nhánh `audit/p1-1-source-of-truth-ledger-20261118`. Không sửa `main`, `test-theo-main`, `be-hoc`, manifest runtime, Google Sheets, Drive, Apps Script, dữ liệu điểm/sao hoặc bài SGK.

Nếu routing bị rút lại sau này, dùng bản nguồn 19 record cố định tại `bf3d2adf90aa2594ac7a5b407218c36a028bc9ea`; **không tự restore G3A raw exporter vào ứng dụng học sinh**. Mọi hủy bỏ/đổi routing phải có quyết định mới.

**Checkpoint P1.1:** `OFFICIAL_SOURCE_ROUTING_APPROVED · INTEGRATION_AND_STUDENT_RELEASE_NO_GO`.
