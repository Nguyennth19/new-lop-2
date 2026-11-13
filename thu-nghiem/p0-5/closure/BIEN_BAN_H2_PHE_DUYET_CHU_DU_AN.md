# P0.5-H.2 — Ghi nhận phê duyệt sư phạm của chủ dự án
Ngày ghi nhận: 2026-11-13 (Asia/Ho_Chi_Minh)
Bài: `toan_b20` — 30 câu, 6 lượt, biến thể dự án.

## Nguồn phê duyệt
Người sử dụng, với tư cách người điều phối/chủ trì dự án, xác nhận trực tiếp trong cuộc trò chuyện:
> "tôi xác nhận **Nghiệm thu và ký duyệt sư phạm** --> bước tiếp theo"

**Phạm vi quyết định**: chấp thuận bộ nội dung đã qua P0.5-H.1 tại `test/p0-5-h1-pedagogy-copy-20261113` gồm bảy câu điều chỉnh `004,007,010,022,024,026,030` và 23 câu không chỉnh sửa. Đây là **phê duyệt được ghi nhận từ phát biểu của người dùng trong chat**, không phải chữ ký điện tử độc lập hay xác minh danh tính/ủy quyền bên thứ ba. Không tự đặt tên người duyệt, chức danh giáo viên hoặc tạo ảnh chữ ký.

## Bản dữ liệu được khóa
- `thu-nghiem/bai-20-bien-the/runtime.json` — Git blob SHA `b14d556c5deeb561106e0c81f275387bef538842`.
- Commit bất biến chứa đúng 7 sửa văn bản `1e9c700f1fd85427b30e9f1f42c8c49669011e33`.
- `B20_BienTheMayChu.gs` TEST đọc đúng commit này và cache key `b20_pilot_20261113_h1_pedagogy_copy_v1`.
- Kiểm định H.1 GitHub Actions PASS https://github.com/Nguyennth19/new-lop-2/actions/runs/43373399268.
- Mọi `question_id`, `answer`, `parameters`, `level`, `session_id` và 6 lượt giữ nguyên.

## Quyết định chuyên môn đã ghi nhận
`ACCEPT_AS_IS` đối với **bộ nội dung H.1** để chuyển sang khâu xác nhận Web App TEST cuối cùng.
`PEDAGOGY_APPROVED_BY_PROJECT_OWNER_CHAT_ATTESTATION`: **PASS trên phạm vi chủ dự án xác nhận**.
Chưa xác lập phê duyệt độc lập bởi giáo viên hoặc tổ chuyên môn; nếu cơ chế quản trị của đơn vị yêu cầu duyệt độc lập, phải có bằng chứng đó trước phát hành rộng rãi.

## Giới hạn quan trọng
- File `runtime.json` **tiếp tục giữ** `release_status=STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF` vì đó là *hợp đồng an toàn runtime Web App TEST* đang được kiểm tra trong `B20_BienTheMayChu.gs`. Quyết định sư phạm được lưu **ngoài runtime**; không lách cơ chế chống ghi hoặc tự sửa cờ release.
- `solution_prompt` hiện là nội dung API; chưa được trình bày trực tiếp trong màn làm bài. Phê duyệt nội dung không đồng nghĩa phê duyệt chức năng hiện lời giải.
- Chưa có bằng chứng phiên bản deployment TEST mới **sau H.1**, chưa có sáu dòng kết quả định lượng Web App gắn đúng commit này, và chưa có ảnh/fallback UI-B H.1 với tham chiếu độc lập.
- `RELEASE_READY=false` cho đến khi WEBAPP, SESSIONS và BROWSER PASS và có quyết định phát hành riêng; không tự merge MAIN hoặc deploy production.

## Bước tiếp theo P0.5-I
1. Pull `test/p0-5-h2-owner-signoff-20261113` hoặc bản H.1 đã khóa vào **Apps Script TEST duy nhất** gắn workbook QA `LOP2_P05_QA_ISOLATED_20261113`, không dùng sheet dữ liệu thật. Kiểm tra tệp `B20_BienTheMayChu.gs` đang trỏ tới JSON commit H.1.
2. Giữ `P03_QA_TEST_APPROVED=NO`, chạy preflight `PreflightTestKhongGhi.gs → kiemTraMoiTruongP05KhongGhi`, `B20_BienTheMayChu.gs → kiemTraGoiDuLieuUI20`, `kiemTraKetNoiB20` và `kiemTraChamLuotB20` trên TEST; đánh dấu bằng chứng riêng biệt.
3. Deploy → Manage deployments → Edit TEST deployment → New version. Ghi lại phiên bản/deployment ID, xác minh bản `/exec` mới sau H.1.
4. Nghiệm thu văn bản 7 câu trên màn hình: ba nhãn "Tính" ở LV1, bốn nhãn "Tính" ở LV2/3 và chấm 6 lượt. Kiểm cả đúng/sai/bỏ trống, desktop/mobile, ảnh fallback.
5. Đọc lại tab QA `90_Lan_lam_bai`, `91_So_sao`, không được có thêm hàng.
6. Kết luận theo Release Gate, không nâng PASS nếu bằng chứng định lượng chưa đủ.

## Rollback
Không có thay đổi nội dung/chấm bài ngoài H.1. Giữ nhánh H.1 làm mốc đã duyệt; nếu TEST thất bại, quay lại deployment UI-B TEST trước đó mà không thay dữ liệu học sinh.
