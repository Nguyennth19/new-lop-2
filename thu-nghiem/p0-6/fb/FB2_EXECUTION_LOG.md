# F-B.2 – Nhật ký thực thi và phục hồi
Thời gian ISO8601 Asia/Ho_Chi_Minh. Mọi dòng DONE cần bằng chứng commit/CI.
| Thời điểm | Mốc | Trạng thái | Hành động / bằng chứng |
|---|---|---|---|
| 2026-11-13T23:01:00+07:00 | FB2-00 | DONE | Xác minh F-B HEAD `964b100b5fd2708a52a04970de831ce1707ebc75`, CI `43456202013` SUCCESS; checkpoint trước sửa `0b27b062e3edbdda138330068accf37ca22ad137` |
| 2026-11-13T23:01:00+07:00 | FB2-01 | DONE | Đăng ký danh mục JSON 3 bài: B21 kế thừa, B24/Tiếng Việt khóa; commit `0390546771ccaeb8f11ca27f382342c7a02208bf` |
| 2026-11-13T23:01:00+07:00 | FB2-02 | DONE | Tạo registry đa bài với trust adapter/rollback độc lập; commit `75d57a6f5d5fb51b199b0bed8e5d2cf33f0f06e5` |
| 2026-11-13T23:01:00+07:00 | FB2-03 | DONE | Nối riêng B21 vào F-B.1 qua `fb2-trusted-adapters.cjs`, commit `e88c03d7c17a9dc33fe4aef32f86d88a59e7557c`; không tự cấp chứng thực cho bài mới |
| 2026-11-13T23:01:00+07:00 | FB2-04 | DONE | Viết 12 nhóm kiểm thử cross-lesson, forged approval, rollback và B20 regression, commit `0c551a43837602d0ca6c122a35bf1160bb5f5f21` |
| 2026-11-13T23:01:00+07:00 | FB2-05 | DONE | Gắn kiểm thử vào CI `70c4eedd27b8e41bcccb71cf355cbe686480d26e`; run `43459000348` SUCCESS |
| 2026-11-13T23:01:00+07:00 | FB2-06 | BLOCKED | Chưa nghiệm thu riêng B24/Tiếng Việt; chưa cho phép student/deploy/Version 6; RELEASE_READY=false |

Khôi phục: đọc `final-acceptance/FB_CURRENT_STATE.json`, kiểm tra HEAD từ GitHub trước khi sửa; chạy lại `.github/workflows/p0-6-fb-governance.yml`. Bản ghi JSON không tự động đổi trạng thái ứng dụng.
