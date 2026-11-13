# P0.5 – Release Gate V1 | QA & rollback (13/11/2026)

## Scope
New isolated branch: `test/p0-5-release-gate-20261113`, from `test/p0-4-qa-runner-20261113`. No changes to CSS, HTML, 30 B20 questions, Google Sheets or student ledger. MAIN and `test-theo-main` untouched.

## Deliverables
- `thu-nghiem/p0-5/release-gate.cjs`: pure deterministic fail-closed evaluator of STATIC, WEBAPP, SESSIONS, BROWSER, PEDAGOGY.
- `thu-nghiem/p0-5/kiem-thu-release-gate.cjs`: 15 positive/negative release contract tests; synthetic complete evidence is **test fixture**, NOT proof of real signoff.
- `thu-nghiem/p0-5/evidence-current.json`: previously verified P0.4 CI pass only; other evidence withheld/unsigned.
- `thu-nghiem/p0-5/QUY_TRINH_NGHIEM_THU.md`: TEST deployment prerequisites, desktop/mobile smoke and six-session expected observations, snapshot comparison, rollback.
- `.github/workflows/p0-5-release-gate.yml`: P0.5 TEST-branch CI reusing original P0.4 FULL_SAFE and B20 regression; expects release gate to block given incomplete evidence (no production deployment).

## Verified GitHub CI
Run: https://github.com/Nguyennth19/new-lop-2/actions/runs/43345396270
- FULL_SAFE inherited P0.4: PASS 4/4 suites, 46 assertions total.
- `thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js`: PASS real committed 30-question pack and six-session renderer/grader **offline** regression.
- P0.5 release contract tests: PASS 15/15.
- Incomplete evidence: expected `RELEASE_BLOCKED` gate, accepted as safe workflow SUCCESS.
- No tracked worktree changes.

## Current release gates
- STATIC: **PASS** (previous independently checked P0.4 CI run 43268208017, combined with inherited P0.5 CI).
- WEBAPP: **PENDING**, no verified TEST deployment URL/ID and runtime evidence.
- SESSIONS: **PENDING**, prior GAS P0.3 6 sessions PASS, but not six actual browser/Web App interaction results for P0.5.
- BROWSER: **PENDING**, no actual desktop/mobile screenshots or click-through tested.
- PEDAGOGY: **FAIL/BLOCKED**, runtime JSON still `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF`, no reviewer approval.
- **RELEASE_READY=false**. No attempt to merge/deploy to MAIN or PROD.

## Boundary on evidence
Static scripts verify contracts, not authenticity of user-supplied signoff. A manually populated evidence JSON alone does not establish independent QA, deployment identity, academic quality or permission to release. Real TEST deployment validation and human pedagogical signoff require independently reviewable evidence and responsible authorization. Avoid recording student rows, names, tokens, or detailed answers in public GitHub logs.

## Rollback
Do not merge or deploy P0.5 branch. On regression, switch to `test/p0-4-qa-runner-20261113`, or revert only added `thu-nghiem/p0-5/` and workflow in disposable TEST branch; never reset MAIN, `test-theo-main`, P0.2–P0.4 or student data.

## Continuation — TEST deployment preflight | 2026-11-13
- Authenticated read-only Google Sheets connector rechecked default workbook `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8`. Both protected tabs still have only header content: `90_Lan_lam_bai` 1 returned row/12 nonempty cells; `91_So_sao` 1 returned row/9 nonempty cells. Their configured grid is 1000x26. **This is not evidence that an independently deployed Apps Script TEST Web App uses this workbook.**
- No verified TEST Web App deployment URL, Script ID or effective ScriptProperties mapping was located in authorized project files. No browser or external live Web App was invoked and no claim of runtime PASS is made.
- Added manual TEST Apps Script **read-only** helper `thu-nghiem/p0-5/PreflightTestKhongGhi.gs`. It requires an explicitly allowlisted separate QA workbook via Script Property `P05_EXPECTED_TEST_SHEET_ID`, checks that effective `ID_GOOGLE_SHEET_DU_LIEU` matches it and is not the default workbook, and fails if `P03_QA_TEST_APPROVED=YES`. It opens the workbook *only after* these checks and reads metadata for tabs 90/91. No values or identifiers are logged.
- Added 7 offline negative tests `kiem-thu-preflight.cjs`, included in P0.5 GitHub Actions.
- GitHub Actions TEST run https://github.com/Nguyennth19/new-lop-2/actions/runs/43346203480 **SUCCESS**: P0.5 contract 15/15 PASS, environment preflight 7/7 PASS, inherited FULL_SAFE PASS, incomplete evidence properly RELEASE_BLOCKED.
- Next operational step: synchronize helper to **separate TEST project only**; set `ID_GOOGLE_SHEET_DU_LIEU` and `P05_EXPECTED_TEST_SHEET_ID` both to independently approved QA workbook ID (not default); leave P03 lock NO; run `kiemTraMoiTruongP05KhongGhi`; supply redacted PASS log and TEST deployment URL for browser acceptance. Do not alter MAIN, current student workbook or student scores.
- `RELEASE_READY=false` still. Rollback: drop helper/test/workflow modifications in TEST branch if needed, no production actions required.

## P0.5 QA isolated workbook — created and verified
- A NEW native Google Sheets workbook `LOP2_P05_QA_ISOLATED_20261113` has been created via authorized Google Drive integration, entirely separate from the app's default workbook.
- Seven tabs were created with the correct header schemas only: `01_Bai_hoc` (17), `02_Cap_do` (19), `03_Nhom_bai` (5), `04_Cau_hoi` (21), `90_Lan_lam_bai` (12), `91_So_sao` (9), `92_Ghi_chu_phu_huynh` (4).
- Re-read all seven tabs after authoring: exactly one header row in each, **zero copied data rows**, no real student ledger or star events. QA workbook ID deliberately omitted from public repo; record in the authorized TEST Script Properties only.
- Preflight environment is **NOT YET CONFIRMED**: connected GitHub/Drive tools cannot set Apps Script `ID_GOOGLE_SHEET_DU_LIEU` or `P05_EXPECTED_TEST_SHEET_ID` directly. User must configure both TEST Script Properties with the newly created private workbook ID, keep `P03_QA_TEST_APPROVED=NO`, and rerun `kiemTraMoiTruongP05KhongGhi`.
- This isolated workbook is sufficient for P0.5 preflight structural check; it is **not** populated with lesson 01–04 data, so only the read-only B20 pilot path can be evaluated subsequently and only after binding/deployment verified.
- `RELEASE_BLOCKED` remains until real TEST Web App, browser, six-session and pedagogy evidence.
