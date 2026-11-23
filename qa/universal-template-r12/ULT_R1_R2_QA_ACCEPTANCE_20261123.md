# LOP2 · ULT-R1/R2 – Template Integration Hardening
## Hồ sơ khóa nguồn, phản biện 16 phát hiện, nghiệm thu kỹ thuật và rollback

**Ngày làm việc:** 23/11/2026 · **Môi trường:** LAB độc lập · **Quyết định phát hành:** `NO-GO STUDENT/GAS`

**Nhánh thực hiện:** `lab/ult-r1-r2-hardening-20261123`  
**Base chính xác:** `ULT-V1.3-B@af02456fcc2b3be856091edc899c699890d74da0`  
**Renderer nguồn khóa:** `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`  
**Báo cáo phản biện nền:** `ULT-REVIEW-RC01-20261120`, SHA-256: `7fe0faef4cc10f88a85f1e91a10f58987212deb8760803406596889cabf3db82`; báo cáo chính xác tại `/mnt/data/LOP2_UniTemplate_Independent_Review_Critical_Assessment_20261120.md` trong phiên kiểm toán.  
**V1 Owner UX baseline:** LAB V1 đã được chủ dự án trải nghiệm OK trước khi thực hiện R1/R2; **việc sửa CSS D1/chế độ phụ chưa được chủ dự án nghiệm thu trực quan**.

### A. R1 – Baseline & Evidence Lock

1. Đọc lại báo cáo phản biện gốc, không lấy tóm tắt lịch sử làm bằng chứng thay cho tài liệu.
2. Pin commit `be-hoc` và `V13B`; mô-đun gốc gồm **28 JS/HTML + 8 CSS** được `qa/universal-template-v1/build.cjs` kiểm tra byte với Git blob của `be-hoc`. Phần overlay LAB tự lưu SHA-256 riêng trong `SOURCE_PROVENANCE.json`; không làm sai nhãn “28+8” nguyên gốc.
3. Kế thừa PASS nguồn trước thay đổi tại CI ULT-V1.3-B: <https://github.com/Nguyennth19/new-lop-2/actions/runs/44698575458>. Lượt kiểm thử R1/R2 đầu tiên đã PASS: <https://github.com/Nguyennth19/new-lop-2/actions/runs/45097909019>. Các lần chạy tiếp theo có thể bị `cancel-in-progress` khi cập nhật lại test; trạng thái cuối phải xác minh **đúng HEAD**.
4. Không có bản độc lập byte-level của sáu tệp `_3` trong phiên làm việc; không khẳng định pixel đối chiếu từng tệp `_3` đã thực hiện.
5. **Rollback:** không merge hoặc vô hiệu hóa nhánh LAB mới; không cần hoàn nguyên PROD/Main/GAS vì chưa ghi chúng.

### B. R2 – Mã đã triển khai, thay đổi cực tiểu

| Mã | Đường dẫn trong nhánh LAB | Phạm vi |
|---|---|---|
| R2-01 | `qa/universal-template-r12/d1-scoped.css` | Thêm CSS D1 thiếu, chỉ áp dụng bên trong `#ulStage`, lưới 390px và desktop, nút nhập tối thiểu 44px |
| R2-02 | `qa/universal-template-r12/lab-hardening.js` | `wrapD1`, `wrapD2`, `wrapD10` chuẩn `snapshot/restore/clear/destroy`; kiểm tra draft trước khi phục hồi |
| R2-03 | cùng adapter | Capability set theo mode + skill + type, chỉ TEST: D2 ADD/PV100/PV1000, D2 SUBTRACT/PV100, D5 SHAPE_SELECT/TANGRAM, D6 SORT/ORDER, D8 CLOCK/RULER |
| R2-04 | cùng adapter | Bộ kiểm tra `visualIntent`/đơn vị/ảnh từ resolver gốc, gồm nested asset ID của D3/D4/D6/D7/D8A/D8B và ký hiệu biểu đồ D9 |
| R2-05 | `qa/universal-template-v1/lab-runtime.js` | Kết nối adapter, giữ `packTrusted` cũ cho A/B và NO-GRANT cho JSON ngoài; thông báo xóa nháp khi đổi gói; không thay nguồn chấm |
| R2-06 | `qa/universal-template-v1/build.cjs` | Đóng gói overlay riêng, ghi hash các file overlay; source lock gốc vẫn bắt buộc |
| R2-07 | `qa/universal-template-r12/fixture-modes.cjs` | Tạo pack C 18 câu/route, gồm 6 case TEST bổ sung; không phải lesson sư phạm thật |
| R2-08 | `qa/universal-template-r12/hardening-browser.test.cjs` | Chromium desktop/mobile: draft 12 route, composite 5 trường D10, mode phụ, semantic rejection và lỗi tải ảnh giả lập |
| R2-09 | `.github/workflows/ult-r12-hardening.yml` | Rebuild/pin, V1/V1.2/V1.3 baseline, QA R2, diff allowlist, upload artifact, không deploy |

**Không sửa** 28 JS renderer gốc, 8 CSS gốc, `be-hoc`, GAS, Google Sheets TEST, Google Sheets B20, source SGK, trusted grading logic hay manifest ACTIVE.

### C. Ledger F01–F16: kết quả chính xác theo mức bằng chứng

| Phát hiện | Quyết định/triển khai | Trạng thái |
|---|---|---|
| F01 thiếu CSS D1 | Có CSS overlay #ulStage, browser kiểm computed grid và nút ≥44px | `LAB_REMEDIATED; OWNER_VISUAL_PENDING` |
| F02 D1 thiếu snapshot/restore | Wrapper dùng API `collect/reset/select/input`, giữ giá trị `0`, active slot và sáu ô, thử vòng đi–về | `LAB_REMEDIATED` |
| F03 D2 mất số và ô nhớ | Wrapper khôi phục bằng native `input` và `click` để cập nhật state nội bộ, không gán bí mật đáp án | `LAB_REMEDIATED` |
| F04 D10 mất năm trường | Composite draft gồm `selectedStatementId` và `fields:{n1,op,n2,sum,answer}`; listener input/change | `LAB_REMEDIATED; G6_FULL_HOST_PENDING` |
| F05 D5 SHAPE_SELECT sai View | `SHAPE_SELECT` vào `KLGeometryTangramViewV11`; B5A TANGRAM giữ host cũ | `LAB_REMEDIATED; E04_NO_GRANT` |
| F06 QA_GRANTS 1–1 | Thay bằng **tập** mode/skill/type khai báo, chỉ LAB, có reject thử sai; không mở grading | `LAB_CAPABILITY_TEST; EDUCATION_PENDING` |
| F07 ép ảnh DECORATIVE | Context theo role, unit, count; chặn WebP count, Fluent books count, nested assets | `LAB_SEMANTIC_QA_PASS; NETWORK_LOAD_PENDING` |
| F08 fixture không có ảnh thật | Pack C dùng `FLUENT:red_apple/tangerine` biểu đồ 6/8 icon, D4 CHOICE ảnh; lưu URL và ảnh màn hình | `METADATA/DOM_PASS; BINARY_LOAD_NOT_FULLY_VERIFIED` |
| F09 packTrusted A/B reference | Giữ chốt an toàn; upload pack C **được render nhưng không chấm** | `SECURITY_GUARD_PRESERVED; SERVER_REGISTRY_R4_PENDING` |
| F10 đa môn | Không xây renderer ngôn ngữ khi chưa được duyệt | `R5_PENDING` |
| F11 nhãn kỹ thuật UX | CSS D1 cải thiện vùng chạm; chưa đổi thuật ngữ/nhãn trong renderer đóng băng | `OWNER_UX_PENDING` |
| F12 D6 cảm ứng | Chromium mobile/desktop thao tác click/select, vẫn có đường chạm; chưa có thiết bị thật | `MOBILE_EMULATION_PASS; DEVICE_PENDING` |
| F13 CSS lặp, View D8A/B | Không xóa/gộp khi chưa có pixel parity | `DEFERRED_SAFELY` |
| F14 raw GitHub pins | Giữ nguyên SHA nguồn, không tự chuyển CDN | `INTENTIONALLY_PRESERVED` |
| F15 bằng chứng QA version | Giữ V1 2 route scorer và V1.2 7 route; log có scope, không sửa bằng chứng cũ | `VERSIONED_EVIDENCE` |
| F16 sư phạm, bố cục | Không tự thay câu/nút B5A/D2/G6 đã owner nghiệm thu | `PEDAGOGY/OWNER_PENDING` |

### D. Các cổng Q01–Q08 và mức chứng minh

**Q01 – CSS D1:** kiểm `getComputedStyle(display: grid)`, min-touch-size, không horizontal overflow, ảnh 390px/desktop: `TEST_PASS`, owner trước–sau `PENDING`.

**Q02 – Draft lifecycle:** trên **12/12 route nguồn**, nhập/chạm → `snapshot` → chuyển câu → mở lại → `deepEqual(snapshot)` ở desktop và mobile. D1 kiểm `'0'` khác `''`, D2 kiểm `carry_tens`, D10 kiểm đủ năm ô. Clear D1 và mount lại rỗng: `TEST_PASS`. Không đồng nhất bảo toàn state trong một phiên LAB với khôi phục qua reload/session của ứng dụng học sinh.

**Q03 – Mode coverage:** pack C chứa thêm `D2 SUBTRACT/PV100`, `D2 ADD/PV1000`, `D5 SHAPE_SELECT`, `D6 SORT`, `D8 CLOCK`, `D9 EXACT_COUNT`; source compile + mount trong Chromium: `TEST_PASS`. `D2 SUBTRACT/PV1000`, các skill/phân phối thực tế, E04 và rubric chấm: **chưa được phép**, cần phê duyệt riêng.

**Q04 – Asset policy:** biểu đồ ASSET sử dụng từng hình `FLUENT:red_apple` / `FLUENT:tangerine` làm đúng **một** ký hiệu, 6+8 ký hiệu theo từng hàng. Chặn `FLUENT:books` `EXACT_COUNT`, đơn vị sai, `symbolValue=2`, D4 nested books; D4 `CHOICE` với red apple được phép. Ảnh tải thất bại có cảnh báo, không coi fallback là đúng dữ liệu. **Kiểm thử tải ảnh mạng thật và xác nhận người dùng thấy ảnh rõ vẫn cần thực hiện**.

**Q05 – Trusted scoring:** giữ quyền LAB server A/B; pack C mode/ảnh có `trustedData=false`, nút chấm không được bật; 7 route V1.2 trên Node localhost vẫn qua hồi quy. Server-side verified hash/expiry/user session/real GAS: `NO_GO` (R4).

**Q06 – Multi-subject:** `NO_GO UNTIL R5`, không tự nhận Toán/Việt/Anh là hoàn tất.

**Q07 – Governed publisher:** nhánh ULT-V13B và Google Sheet TEST cũ **không thay**, publisher DRY RUN chỉ tiếp tục QA 93 assertions và 80 DOM D2. Không có AI model live, chưa có chữ ký thật/ACTIVE.

**Q08 – Owner acceptance:** dữ liệu modes/CSS/hình và giao diện sau hardening chưa được chủ dự án nhìn nhận; **`OWNER_PENDING`**.

### E. Bằng chứng CI và kiểm toán thay đổi

CI nguồn/hồi quy đầu tiên: <https://github.com/Nguyennth19/new-lop-2/actions/runs/45097909019> **SUCCESS**, quan sát:
- 28+8 frozen source lock; 24 core contracts / 12 renderer IDs × A/B.
- V1.2: 138 assertions, 7 route scorer, 5 route NO_GRANT, 28 cặp đúng/sai và 8 HTTP checks.
- V1.3: 93 assertions, hai gói 20 D2 tổng hợp, B020 source BLOCKED; 80 mounts/input.
- V1: 48 lần tương tác trên 12 route × A/B × desktop/mobile.
- R1/R2 lần đầu: 44 acceptance checks/18 screenshots. Các kiểm thử mới bổ sung nested assets, CSS visual/touch và simulated network error trong commit kế tiếp; hãy xem **workflow gần nhất tại HEAD** để xác nhận trạng thái cuối, không đánh đồng chạy đầu tiên với commit cuối.

Workflow: <https://github.com/Nguyennth19/new-lop-2/actions/workflows/ult-r12-hardening.yml>. Các lần `cancelled` do concurrency cập nhật QA không phải PASS; giữ nguyên lịch sử thực tế.

**Rollback độc lập:** ngừng sử dụng `lab/ult-r1-r2-hardening-20261123` và quay về `ULT-V1.3-B@af02456fcc2b3be856091edc899c699890d74da0`. Không có migration hay sửa dữ liệu nên không phải chạy SQL/Sheet rollback. Chiến lược Git diff cho phép chỉ `qa/universal-template-r12/**`, `qa/universal-template-v1/{build.cjs,lab-runtime.js}` và workflow riêng.

### F. Hướng tiếp theo

1. **Owner Visual Acceptance:** thử ảnh D1 desktop/mobile, D2 nhớ/mượn, D10 điền đủ năm trường; xem hình ảnh Fluent positive/negative, D5 SHAPE_SELECT, D6 SORT, D8 CLOCK. Nếu chủ dự án từ chối UX: rollback nhánh LAB, không chạm be-hoc.
2. **R3:** mở đầy đủ ma trận mode theo lesson/skill/sư phạm được phê duyệt; không tự cấp E04.
3. **R4:** registered pack C với digest/phiên bản/skill server, từng gói được cấp quyền, chống giả mạo metadata và chống lộ grading keys.
4. **R5:** shell và SpeechService theo `subject/locale` không viết sớm renderer Việt/Anh.
5. **R6/V1.3-C:** chỉ mở Sheet sync có xác thực và AI Candidate Intake sau khi QA/sư phạm/privacy các cổng trên đạt; B001–B024 không tự chuyển thành STUDENT_PLAYABLE.

**Tuyên bố kiểm soát:** `R1/R2 LAB_TECH_TEST_PASS_IN_SCOPE / OWNER_UX_PENDING / ASSET_BINARY_QA_PENDING / AUTHENTICATED_GAS_NO_GO / REAL_LESSON_RELEASE_NO_GO`.
