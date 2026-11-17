# LỚP 2 — GLOBAL STATE RECONCILIATION & HARD QA/QC

**Ngày đánh giá:** 17/11/2026 (Asia/Ho_Chi_Minh)  
**Loại:** kiểm toán hồi cứu độc lập, *không* sửa nguồn, không merge/deploy, không kích hoạt phát hành.  
**Trạng thái:** `AUDIT_EVIDENCE_RECONCILED_PARTIAL · OFFICIAL_CANONICAL_APPROVAL_PENDING · RELEASE_NO_GO`.

## 1. Kết luận chủ đạo

Không tồn tại **một** nhánh/file vừa là bản giao diện ổn định nhất, vừa sở hữu toàn bộ ảnh nguồn, renderer, dữ liệu SGK–VBT, phê duyệt và deployment. Dự án phân nhánh thành các sản phẩm có phạm vi nghiệm thu khác nhau. **Nguồn chân lý phải chọn theo phân hệ, mốc phê duyệt và SHA cụ thể**, không chọn `max(date)` và không lấy báo cáo tổng hợp cũ làm nguồn có thẩm quyền cao hơn bảng quyết định/commit mới.

**Phân biệt nghiêm ngặt:** `PRESENT` / `STRUCTURAL_PASS` / `TECH_QA_PASS` / `OWNER_APPROVED_IN_SCOPE` / `LIVE_DEPLOYMENT_VERIFIED` / `STUDENT_RELEASE_APPROVED`. Việc đạt một trạng thái KHÔNG suy ra trạng thái kế tiếp.

## 2. Phạm vi trực tiếp kiểm được và giới hạn

- GitHub: đã liệt kê HEAD **123 nhánh có trước** và **124 nhánh sau khi tạo nhánh kiểm toán** `audit/master-state-reconciliation-20261117`. Lưu nguyên tên nhánh + HEAD SHA trong `BRANCH_HEAD_INVENTORY_20261117.json`; kiểm cây và chứng cứ CI/code trên các HEAD quan trọng. **Không tuyên bố đã chạy hoặc đọc sâu toàn bộ code của 124 nhánh**, chưa có hồi quy xuyên nhánh tự động toàn kho.
- Drive: đã kiểm các thư mục trực tiếp của MASTER-BE-HOC, tìm nguồn cũ ngoài MASTER, đọc báo cáo G7.3/G7.5/G7.6, các workbook Consolidated/V8/C1/C4, P0.6 và văn bản quản trị. Các thư mục khác trên toàn Drive có thể chứa tài nguyên chưa được nhận diện; kết quả là **deep-research có giới hạn truy cập**, không phải duyệt từng tệp trên mọi Drive.
- Sheets: kiểm các worksheet `SOURCE_1406`, `LESSONS_75`, `V8_OWNER_CANONICAL_LOCK`, `V8_INTERIM_REPORT`, `C1_*`, `C4_*`, bảng B20 và MASTER COVERAGE-75.
- Chats: dùng lịch sử Project được đưa vào ngữ cảnh, các biên bản owner attestation lưu cùng commit và các mốc tại các cuộc trò chuyện đang truy xuất. **Không có giao diện lấy toàn văn của mọi cuộc trò chuyện cũ đã hoàn thành, bao gồm cuộc trò chuyện treo. Không tuyên bố đã đọc được 100% transcript**; xuất lịch sử chat sẽ là một nguồn bổ sung nếu sau này cần chứng minh phát ngôn không có biên bản.
- Quy định mới được trực tiếp đọc: `/mnt/data/universal_ai_coding_guidelines-vn-version.md` (bản EN tương đương), và DOCX Thư viện `BẢN CHUẨN HÓA ĐỊNH DẠNG — QUY TRÌNH GITHUB · GOOGLE DRIVE · GEMINI · CHATGPT.docx` (bản 15/11). Nếu người dùng muốn ám chỉ hai tệp khác, cần đối chiếu tên cụ thể trước khi xem đây là tập quy định đầy đủ.

## 3. Ma trận phiên bản/nguồn tốt nhất được hỗ trợ bởi bằng chứng

| Phân hệ | Mốc có thẩm quyền trong phạm vi | Kết quả được bảo toàn | KHÔNG được suy diễn |
|---|---|---|---|
| Giao diện/ứng dụng ổn định | `test-theo-main@f51a12cc` đối chiếu `main@1d9bb774` | UI baseline, dữ liệu hiện hành riêng | Không coi nhánh `be-hoc` nhiều file hơn là bản GAS đang chạy |
| Mã phong phú nhất cho học Toán/hình | `be-hoc@59187c6f` | 288 G7 WebP + 30 WebP nhân vật +46 SVG Fluent; source PNG master **24/288** | 288 WebP ≠ 288 PNG gốc đã chuyển; CI tại HEAD backup ≠ CI E2E |
| Quy tắc dựng hình 10 dạng | G7.6 manifest ở `test/g7-6-resource-renderer-consolidation-v1-20261114`, bộ QA G7.6 B5C | 12 reference items, kiểm hợp đồng và UI kỹ thuật riêng, B5C 1710 assertions PASS | Không phải tất cả renderer tích hợp vào GAS và tất cả bài SGK |
| Giọng đọc tiếng Việt | `test/g7-5-approved-voice-profiles-20261114` | **V1.2 stable và V2 dynamic được chủ dự án xác nhận**; V2 ưu tiên | Phần chọn giọng của phụ huynh chưa hiện thực; không xem chủ dự án ký Android/iOS |
| Bộ 288 ảnh | Registry mới sau phê duyệt 188 nhãn tại G7.4 B5.7 Perf-A | **288/288 LABEL_APPROVED**, file WebP binary checksum 288/288 PASS | **Count/semantic QA từng hình chưa toàn PASS**, CDN/production release riêng |
| C1 | Google Sheet `LOP2_C1_ALL_IN_ONE_JSON_BUILD_B001_B075_20261109` | Owner `APPROVED_FOR_C1`, **75 lesson +1.406 JSON envelopes**, 6 chunk readback | C1 = scaffold, **0 renderable tại chính C1**, không phải thu hồi quyền C1 |
| C4 | `LOP2_C4_AUTO_PIPELINE_ALL1406_RUN1_20261109` | **27 câu DEV thực**, 121 parts, Node 132/132, browser 27 desktop+27 mobile; 1.379 deferred | Không tuyên bố 27 đã deploy/GAS/student release |
| B061/B062 owner | **V8 corrected** + C1 (không dùng Consolidated stale) | **B059–B062 BQA-17**, B063–B066 BQA-18; **0 active owner discrepancies**; 65 lỗi owner +2 batch historically resolved | Không khôi phục cảnh báo 65 *đang mở* chỉ vì Consolidated cũ còn ghi |
| SOURCE 75 bài | 1.406 candidate SOURCE lịch sử và C1; 677 SGK +729 VBT | Đã có dữ liệu ứng viên cho tất cả **75 bài** | Không có nghĩa 1.406 câu source-exact hoặc đã duyệt |
| G2/G2-B 96 | `10_G2_96_MATRIX`, `11_G2B_REVIEW_QUEUE` | 86 SGK +10 VBT cho 7 bài, nguồn đã so kỹ thuật, **0/96 độc lập ký** | ID khác kho SOURCE không chứng minh 96 câu mới; tránh cộng 96 vào 1.406 |
| B20 sư phạm 30 | P0.5 H.2 owner signoff | **30 câu/6 lượt** nghiệm thu sư phạm theo phạm vi H.2 | Không thay thế B20 legacy **51 hàng** hoặc toàn bộ bản live |
| B20 legacy 51 | Sheets 01–04 + `be-hoc` loader | 51 câu B20, `answer` ở client vẫn tồn tại tại `be-hoc` | Không dùng trực tiếp với học sinh trước khi vá privacy và E2E |
| G3-A trusted grading | `test/data-b-g3a-trusted-gas-adapter-20261117@59827dee` | **39/39 local VM/HTTP loopback** và GitHub CI PASS `44029669866` | **Chưa có GAS real network test**, không cấp quyền phát hành |
| P0.6 technical acceptance | `test/p0-6-fc-audit-20261114` F-C.4 | **ĐÃ ĐÓNG KỸ THUẬT TEST độc lập**, owner approved scope with exclusions | Không mở lại mốc đã PASS; không đồng nghĩa GAS V6/production GO |
| G7.6 E04/C07–C09 | C08.6 branch `@733422f1`, signed-evidence resolver | Synthetic crypto-validator CI PASS; 6 approval packets tracked | **0/6 actual owner signatures; C07, C08, C09 pending** |
| B024 alpha | `CANDIDATE_B024_LESSON_PACKAGE_ALPHA.json` + G3 private QA | 19 VBT alpha parts checked as candidates; fail-closed grading | Không công nhận source exact hoặc usable production |
| Workflow policy | `PROJECT_RULES.review-candidate.v0.1.md@11d691aa` | 10-rule candidate + AI handoff index; read-only; **0/10 formal owner adoption** | Không tự tạo root `PROJECT_RULES.md`/auto deploy |

**Evidence**: `SOURCE_OF_TRUTH_RECONCILIATION_CANDIDATE.json` trên nhánh audit có link, SHA và trạng thái riêng của 19 phân hệ. Cột 'best' nghĩa bản tốt nhất **theo phạm vi đã xác minh**, không là phép tự hợp nhất mọi branch.

## 4. Những lỗi kiểm kê đã tái hiện được và cách sửa

| Mã | Lỗi/hiểu sai | Root cause | Cách sửa không phá dữ liệu |
|---|---|---|---|
| E01 | COVERAGE75 báo **65 lỗi B061/B062 đang mở** | So SOURCE owner của V8 với LESSONS thuộc **Consolidated trước khi vá**, thay vì chính LESSONS V8 | Xuất **ERRATA** và đánh dấu hai hàng cảnh báo cũ `SUPERSEDED_BY_V8_OWNER_FIX`, không sửa SOURCE_1406/V8/C1 |
| E02 | Nói C1 chưa hoàn thành/chưa được duyệt | Nhầm `APPROVED_FOR_C1/READBACK_VERIFIED` với `PLAYABLE` | Giữ **C1 COMPLETE/APPROVED**; C4 **27 DEV**; cổng student RELEASE vẫn riêng |
| E03 | Xem P0.6 chưa đóng | Nhầm NO-GO production với mốc kỹ thuật F-C.4 | Bảo toàn `P0_6_TECHNICAL_CLOSED_ISOLATED_TEST_ONLY` |
| E04 | Báo 288 hình chưa duyệt nhãn theo G7.3 | Lấy snapshot 100 approved/188 pending cũ | Áp phê duyệt **288 nhãn ở B5.7 Perf-A**, vẫn phân biệt count/semantic QA từng hình |
| E05 | Suy 288 WebP đã chuyển đủ 288 PNG gốc | Nhầm output binary và source PNG mirror | Giữ WebP 288/288 và PNG master 24/288 riêng |
| E06 | Lấy G2 96 ID không trùng -> 96 câu mới | So chuỗi thay vì source semantics | Crosswalk theo SGK/VBT, phiên/tiết/trang/part/figure; không nhân đôi |
| E07 | Dựa vào CI PASS để coi app safe | Kiểm thử Node/VM thay cho GAS `google.script.run`/student auth | Kiểm browser Network thật, session, replay, quyền server, rollback |
| E08 | G7.6 C08.6 CI PASS => đã có owner signature | Thử khóa ký giả lập trong CI | Ghi `0/6 signed`; không tạo chứng cứ owner |
| E09 | Coi 75 chỉ mục là 75 bài Web App | `01_Bai_hoc` mục lục bao phủ 75 nhưng `02–04` chỉ B20 | Bài live = lesson+levels+questions+grader+runtime+QA, không phải index count |
| E10 | Snapshot ZIP backup = HEAD hiện hành | Backup be-hoc trên Drive pin `77cf6d75`, repo live `59187c6f` | Chưa khẳng định có bản khôi phục binary toàn HEAD; cần archive đúng HEAD và SHA/CRC sau khi được duyệt |

## 5. Deep QA nguồn, an toàn và phát hành

- `main` là **mã repository**, không xác thực deployment Apps Script. Cần kiểm deployment ID, version/code SHA, email identity của deployment, payload Network và quyền bảng dữ liệu trước khi gọi LIVE_PASS.
- `be-hoc@59187c6` `KhoBaiHoc.gs` vẫn xuất `answer:String(x.answer||'')`; `26_ChamCauHoiToan.html` chấm theo `q.answer`. G3-A là nhánh test riêng, **chưa được merge vào be-hoc** và không có GAS thực.
- `MASTER-BE-HOC/07_PHAT_HANH_ROLLBACK` hiện trống; không suy ra **chưa từng có** phát hành lịch sử, nhưng không có hồ sơ phát hành qua thư mục này. Lưu riêng trạng thái deployment thực tế chưa được chứng minh.
- P0.6 kỹ thuật đã đóng theo phạm vi; G7.6 phụ trợ, G3-A security, G2B source signoff là những cổng *mới/độc lập*, không làm mất giá trị nghiệm thu cũ.
- V8 source validation `0/75`, G2B `0/96`: chỉ phản ánh các tập chứng cứ cụ thể, **không tự phủ nhận** các bộ bài/test có quyết định chủ dự án riêng (B20 H.2, C4 DEV, G7.5 audio).
- Các bản cũ không được xóa; dùng `supersededBy` + reference SHA, chỉ sửa trạng thái ở bản chỉ số kế thừa sau khi đúng owner cho phép.

## 6. Rà soát quy định `.md` và `.docx`

**Markdown:** `universal_ai_coding_guidelines-vn-version.md` + bản tiếng Anh tương đương: nguyên tắc tư duy trước khi code, YAGNI, sửa tối thiểu, mục tiêu kiểm chứng. Hợp lý để dùng làm **hướng dẫn kỹ thuật**, nhưng phần `Project-specific` để trống; không thay thế luật riêng SGK/GAS, không cấp quyền release.

**DOCX:** `BẢN CHUẨN HÓA ĐỊNH DẠNG — QUY TRÌNH GITHUB · GOOGLE DRIVE · GEMINI · CHATGPT.docx`: tài liệu dài gồm nhiều đề án, code mẫu, đề xuất `PROJECT_RULES.md`, phối hợp hai AI, đồng bộ và backup. Chỉ lấy **phần không xung đột** như context index theo module, giao việc qua SHA, code-review độc lập, CI/checkpoint và rollback. **Không thông qua tự động** các mã ví dụ:

1. `git commit`/GitHub event → `clasp push --force` vào GAS hoặc tự merge/deploy;
2. mã PIN phụ huynh cố định trong client (ví dụ giá trị mẫu trong DOCX) hoặc thách đố số học thay xác thực thực;
3. truyền `correctAnswer`, validator/rubric hoặc token bí mật xuống trình duyệt;
4. Webhook backup tự chuyển các bản cũ vào thùng rác theo số lượng/ngày mà không có retention policy và test phục hồi;
5. token OAuth/secret trong nguồn hoặc Drive snapshot công khai;
6. nội dung sinh bởi mô hình AI mặc nhiên biến thành SGK `SOURCE_EXACT`.

**SOP Big Data V2** trong Drive vẫn là **CANDIDATE**: mô hình G0–G6 và nguồn một lần + compiler từ canonical, QA bằng nguồn/crop, hợp lý nhưng không được thay đổi các mốc đã ký.

**GitHub `PROJECT_RULES.review-candidate.v0.1.md`** là bản *UNSIGNED* và `owner-review.pending.v1.json` hiện **0/10**. Các điểm mới nên đưa vào bản đề xuất theo 10 quy tắc, nhưng **không ghi đè root hoặc tự coi quy định đề xuất đã được chấp thuận**.

## 7. Quy tắc vận hành đề nghị cập nhật

1. **Source Selection Ledger** bắt buộc: mỗi mô-đun có stable ID, sourceRef+SHA, owner status, test & live status, supersededBy, rollback và giới hạn; thay đổi chỉ được phép sau diff.
2. **Source precedence:** owner signed decision (đúng scope) → QA/test readback tại pinned SHA → code/binary tại HEAD đã kiểm CI → candidate → historical. Riêng dữ liệu SGK/VBT, sách gốc + chứng cứ exact độc lập là thẩm quyền nội dung, không dùng suy luận từ CI.
3. **Báo lỗi phải xem `resolved` và `superseded`** trong cùng file và các bản mới hơn trước khi mở issue; cố định regression thử B061/B062 và các lỗi đã đóng.
4. **Never downgrade historical PASS:** ghi `scope`, `effectiveOnVersion`, `exceptions`; release pending không hồi tố xóa phê duyệt TEST hoặc sư phạm đúng phạm vi.
5. **PASS hierarchy machine-checkable:** static, browser desktop/mobile, human, actual GAS network, source independent, production release, tất cả độc lập.
6. **Reuse-first & surgical changes:** không tạo C1 từ đầu, không dựng renderer D10 mới khi G6 đã có, không đổi TTS V1.2/V2, không phá cấu trúc thẩm quyền.
7. **Public/private strict server boundary**: trusted grading, session and identity server side, no answer leaks to source webapp/cdn.
8. **ChangeSet append-only**: không sửa nguồn gốc; issue correction + checkpoint + CI SHA + rollback, không xóa backup tự động.
9. **Handoff ChatGPT–Gemini–human:** cùng một immutable packet với sourceId, QA scope, issue status và expected diff, không suy rằng mô hình thứ hai đã duyệt khi chưa có chữ ký.
10. **Stop condition:** bất kỳ `sourceExactPending`, `semanticsUnmapped`, `signaturePending`, `runtimeNetworkUnverified`, `productionApprovalMissing` => release NO-GO ở đúng cổng; không chặn thao tác đọc và test an toàn đã được cấp phép.

**Đây là đề xuất chỉnh sửa**, chưa phải `PROJECT_RULES.md` chính thức. Không tự áp đặt quyền merge, GAS deploy, học sinh hoặc thay quy chế giữ dữ liệu.

## 8. Bằng chứng cốt lõi & checkpoint

- [V8 owner fix + source](https://docs.google.com/spreadsheets/d/1VlscK4-xviocaAKxebOpvTL0Kpjpa1ILEGUYdb13Hzo/edit)
- [C1 complete](https://docs.google.com/spreadsheets/d/1GPChHRV4sZ4ZplgJmIIkcIFeERLIjUruoY-s3H7_TVM/edit)
- [C4 DEV 27](https://docs.google.com/spreadsheets/d/1dHPppAogU3GkfgWwulF1hJGF3Ftl-QojP-YxINAENnU/edit)
- [P0.6 F-C.4 owner decision](https://github.com/Nguyennth19/new-lop-2/blob/test/p0-6-fc-audit-20261114/thu-nghiem/p0-6/final-acceptance/FC4_P06_TECHNICAL_TEST_CLOSURE_OWNER_DECISION_20261114.md)
- [G7.6 B5C no deploy](https://docs.google.com/document/d/1sR7cLDGGGm6qG5rRmk-Bm7a3I4G9XEzHVZmQgxbD9WI/edit)
- [C08.6 0/6 owner signatures](https://github.com/Nguyennth19/new-lop-2/blob/test/g7-6-b6-c086-owner-resolution-signed-evidence-20261116/qa/g7-6-b6-c086/resolution.pending.v1.json)
- [be-hoc PNG/source checkpoint](https://github.com/Nguyennth19/new-lop-2/blob/be-hoc/docs/kiem-dinh/BE_HOC_ORCHESTRATOR_DRIVE_SYNC_CHECKPOINT_20261117.md)
- [288 label signoff record](https://github.com/Nguyennth19/new-lop-2/blob/test/g7-4-b5-7-perf-a-owner-label-approval-20261113/qa/g7-4-b5-7-perf-a/owner-label-approval-188.audit.json)
- [G7.5 V1.2/V2 approval](https://docs.google.com/document/d/1EwQ0MHg8GlfTo4dgyRdPX9scVL7d7mWjm2jUQaB3JyA/edit)
- [Review-only `PROJECT_RULES`](https://github.com/Nguyennth19/new-lop-2/blob/audit/g7-6-workflow-rules-consolidation-review-20261116/qa/g7-6-workflow-rules-consolidation-review/PROJECT_RULES.review-candidate.v0.1.md)
- [G3A local test CI](https://github.com/Nguyennth19/new-lop-2/actions/runs/44029669866)
- [SOP Big Data V2 CANDIDATE](https://drive.google.com/file/d/1yP2DJ19_CDvzXZ7wNSPK1kEDdBeNgBbW/view)

## 9. Điều kiện để chốt kiểm toán hoàn toàn

Chưa đủ bằng chứng để tuyên bố **deep QA hoàn tất 100%** các cuộc trò chuyện, các file của toàn Drive, tất cả phiên bản GAS đang chạy, toàn bộ 124 nhánh hoặc chính thức phê duyệt 10 quy định mới. Muốn nâng cổng `FULL_AUDIT_PASS`, cần bổ sung: (i) export chat history/owner decisions chưa lưu; (ii) inventory Drive toàn cây và checksum (có thể phân batch); (iii) CI provenance/changelog đầy đủ cho các nhánh giữ lại; (iv) GAS deployment SHA + Network kiểm thật; (v) owner quyết định `PROJECT_RULES` theo từng điều khoản. Các phần đã chứng minh ở bảng trên **không bị hạ trạng thái** vì giới hạn này.

**Rollback:** ngừng tham chiếu file trong `audit/master-state-reconciliation-20261117`; các nhánh nguồn, Sheets, MAIN, GAS, dữ liệu học sinh và bản duyệt gốc không bị thay đổi.
