# P0.5-G — Đóng nghiệm thu UI-B & rà soát Release Gate
Ngày: 13/11/2026. Nhánh kiểm soát: `test/p0-5-release-closure-20261113`.
Cơ sở: `test/p0-5-ui-b-equations-20261113`, **không merge MAIN/test-theo-main, không sửa các file ứng dụng đã nghiệm thu**.

## 1. Những bằng chứng đã thực tế đạt
- P0.5-A — user-run Apps Script TEST `PreflightTestKhongGhi.gs → kiemTraMoiTruongP05KhongGhi`: `PASS`, `testWorkbookVerified:true`, `p03Locked:true`, `noWrites:true`, tab 90/91 chỉ có header.
- P0.5-C — `B20_BienTheMayChu.gs → kiemTraGoiDuLieuUI20` và `kiemTraKetNoiB20`: 30 câu, 6 lượt, staging và noWrites (user-supplied GAS logs, verified contract).
- P0.5-D — `B20_BienTheMayChu.gs → kiemTraChamLuotB20`: `total:30` chấm đúng 6/6,6/6,5/5,5/5,4/4,4/4; `recorded:false`, `starsAwarded:0` (user GAS log). Không phải kiểm thử sáu lượt browser có bảng thống kê theo từng lượt.
- P0.5-E/F — user supplied desktop and Android screenshots of TEST deployment created from isolated workbook; tested correct/wrong/blank, keyboard, lesson navigation. Latest **explicit user confirmation**: `test/p0-5-ui-b-equations-20261113` displays correctly on multiple device interfaces and passes the recommended manual tests, including both equation alignment and ordering `Nộp bài → Kết quả → Đáp án`.
- P0.5-UI-B CI final https://github.com/Nguyennth19/new-lop-2/actions/runs/43368421216 is SUCCESS (UI-B 13/13, UI-A 12/12, FULL_SAFE 46/46, 30-item B20 regression). Browser QA confirmation is an **operator attestation**, not independent browser instrumentation.
- **Post-acceptance independent read-only workbook verification** (current QA workbook only): `90_Lan_lam_bai` one 12-column header row / zero data rows; `91_So_sao` one 9-column header row / zero data rows. No student row content read into reports.

## 2. Decision ledger (avoid false RELEASE_READY)
| Gate | Status | Evidence / remaining |
|---|---|---|
| STATIC | PASS | P0.4 inherited + UI-A/UI-B successful Actions |
| TEST ENVIRONMENT | PASS (USER GAS LOG) | Independent QA workbook, P03 approval closed |
| DESKTOP/MOBILE UI | PASS (USER ATTESTATION) | UI-A/B layouts and interactions reported passed |
| WEBAPP | PARTIAL/PENDING | New TEST deployment supplied by operator, but no immutable deployment version/source SHA/API binding evidence; do not fabricate |
| B20 SIX-SESSIONS | PARTIAL/PENDING | 30/30 GAS grading + user multi-session interactions; no six **explicit numeric Web App result rows** `correct,total,wrongCorrect,recorded,starsAwarded` matching the current gate JSON contract |
| BROWSER gate | PARTIAL/PENDING | Operator confirms UI and input; independent visual baseline/image-fallback PASS or screenshot ref for latest UI-B not yet archived |
| PEDAGOGY | BLOCKED | Source package `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF`, no signed academic review |
| RELEASE_READY | **FALSE** | All 5 strict gates not yet PASS |

A full six-session **all-correct** PASS contract is not interchangeable with tests that intentionally include wrong/blank answers; do not invent 30/30 browser totals from the user statement. In particular, avoid mutating `evidence-current.json` to synthetic complete evidence just to turn the release status green.

## 3. Remaining work to transition TEST to RELEASE_READY
1. Capture exact TEST `Deploy → Manage deployments` deployment version and source revision; confirm mapping to independently approved QA workbook. File: `thu-nghiem/p0-5/QUY_TRINH_NGHIEM_THU.md` (manual checklist; not executable).
2. Obtain 6 Web App per-session numerical results (positive/negative/blank checks and no-write outcome). If actual mixed-answer regression is used, update Release Gate **contract via reviewed change** instead of fabricating `correct=total` for all six.
3. Save visual evidence for final UI-B on desktop and mobile and an explicit image-fallback check; do not copy student data into public artifacts.
4. Complete pedagogical review, validate lesson variant suitability, and have an authorized reviewer sign the B20 pack (no status bypass). The academic approval is independent of 30/30 arithmetic correctness.
5. Re-run QA release gate, inspect 90/91 post-test, and only then evaluate release candidate. No PROD deploy in this step.

## 4. Rollback
No application source code modified on this closure branch. If any future UI or logic regression is found, return to UI-B `test/p0-5-ui-b-equations-20261113` for accepted visuals, or UI-A `test/p0-5-ui-a-mobile-20261113` for earlier stable version. Never change MAIN, `test-theo-main`, original student workbook or production deployment; `P03_QA_TEST_APPROVED` must stay NO.
