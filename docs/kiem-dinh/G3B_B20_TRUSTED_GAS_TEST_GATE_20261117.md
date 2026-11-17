# G3-B — B20 trusted grading / real GAS TEST gate

**17/11/2026 | Only isolated TEST | NO production deployment.** Baseline G3-A `938286b4712a` on TEST; G3-A inherited 39/39 synthetic tests. Branch `test/data-b-g3b-b20-trusted-gas-e2e-20261117`.

## Confirmed and corrected bypass
- `DocDuLieuSheet.gs::layThongTinDuLieuBaiHoc` previously exported raw 4-tab data, including `04_Cau_hoi.answer`, `solution_prompt`, `puzzle_json`. G3-A's `layBaiToan20` allowlist alone did not close this bypass.
- G3-B unconditionally disables raw exporter. Legacy `layBaiToan20` and `doGet` now require `g3aQaContext_` (TEST enabled, isolated workbook, nonempty allowlisted tester identity).
- Existing `g3aLayBaiToan20Test` public projection retains all 51 B20 questions while dropping secret fields and puzzle `ans`; `g3aChamBaiToan20Test` holds correct answers on the server and returns only grading status.
- `achS_` uses in-memory empty ledgers for TEST dashboard. `ghiNhanKetQuaToan20` still rejects rewards. Parent endpoints blocked/disabled for TEST only. Real children/student tabs never read, created or written by these paths.

## Verified isolated QA workbook
Google Sheet: https://docs.google.com/spreadsheets/d/1Y4PldXPFXr08wJEHvxLw_3KWk97a0Q6BS3p-kiMxxRQ/edit

It has exactly four content tabs (01_Bai_hoc, 02_Cap_do, 03_Nhom_bai, 04_Cau_hoi) and 51 questions (16 vertical, 9 mental, 8 word_problem, 18 missing_digit). This private workbook contains answer keys for GAS server grading only; NEVER put it in GitHub/public payload. Do not mutate it as a way to satisfy CI.

## Required real GAS TEST evidence — STILL PENDING
1. Create a separate TEST Apps Script project, not the current student Web App. Its source must equal the exact G3-B commit SHA.
2. Set Script Properties privately: `G3A_TEST_ENABLED=true`; `G3A_TEST_SOURCE_SPREADSHEET_ID` = QA workbook ID; `G3A_TEST_ALLOWED_EMAILS` = specific authorized testers. Do not put any email or token into repo.
3. GAS TEST `appsscript.json` includes `https://www.googleapis.com/auth/userinfo.email` for `Session.getActiveUser().getEmail()` and spreadsheet scope for the QA source. Choose **Execute as user accessing the web app** and grant OAuth access for authorized tester(s), not execute as deployer. Restrict Web App to the tester identity. If `Session.getActiveUser().getEmail()` is blank, the app MUST deny; never fall back to shared/anonymous identity.
4. Capture TEST project ID, deployment ID, version, deployed code SHA, tester identity proof and a redacted Chrome Network payload for `g3aLayBaiToan20Test` and `layBaiToan20`; recursively assert absence of `answer`, `ans`, `solutionPrompt`, `correctAnswer`, `gradingKey`.
5. From authorized QA browser call the legacy `layThongTinDuLieuBaiHoc`: it must fail with `G3B_LEGACY_RAW_SHEET_EXPORT_DISABLED`. Do not return raw 04_Cau_hoi rows.
6. Create level-scoped one-time session and submit real B20 LV1/LV2/LV3 answers through `g3aTaoPhienChamB20Test` and `g3aChamBaiToan20Test`; check correct/wrong/empty, bad scope, token replay, expiry, B024 deny, rate limit. Returned grading response must be key-free and `awarded:false`, `writes:0`.
7. Verify exact QA workbook tab count/row count before and after; no 90_Lan_lam_bai, 91_So_sao, 92_Ghi_chu_phu_huynh created; production workbook untouched. Check desktop/mobile Web App UI and reset navigation.
8. Record evidence in an append-only signed run receipt with `REAL_GAS_E2E_PASS` only if real authenticated Network evidence exists; otherwise `REAL_GAS_E2E_NOT_RUN`.

**Current gate:** `SOURCE_HARDENED_TEST_BRANCH`; `LOCAL/CI_QA` pending workflow success; `REAL_GAS_E2E_NOT_RUN`; `RELEASE_NO_GO`. No connector in this session can create/deploy/execute Google Apps Script projects; a successful Github CI is NOT real GAS.

## Rollback
Stop/discard TEST deployment and return to G3-A SHA `59827dee9a712dadfafb6b06d4f59403cf2c7783`. Historical `be-hoc@59187c6`, `main`, `test-theo-main`, production Sheet and student data remain untouched. Never roll back the closed public-leak change into a student app.
