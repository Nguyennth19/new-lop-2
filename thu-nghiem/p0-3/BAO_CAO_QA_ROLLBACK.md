# P0.3 — DRY_RUN & no-write snapshot QA | 2026-11-12
Branch: `test/p0-3-dry-run-no-write-20261112`
Base: `test/p0-2-validator-v1-20261112`
Spreadsheet actually inspected via authenticated read-only Google Sheets connector: `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` (matches `CauHinh.gs` default; **ScriptProperties runtime override not observable from connector**).
Audit scope: both `90_Lan_lam_bai` and `91_So_sao`, A1:Z1000, all configured rows and columns, valueRenderOption FORMULA.
No student values, names, submissions or individual row contents were printed or committed.

## Confirmed evidence
- Before and after snapshots were read from the **actual configured Google Sheet** across the full current 1000×26 grid for each ledger.
- 90_Lan_lam_bai: 12 nonempty cells before, 12 after; canonical full returned cell matrix **exactly equal**: PASS.
- 91_So_sao: 9 nonempty cells before, 9 after; canonical full returned cell matrix **exactly equal**: PASS.
- In between the two live reads, the existing `chamLuotToan20BienThe` server logic was executed in an **isolated JavaScript environment** with stubbed `CacheService` and `UrlFetchApp`. 6/6 sessions PASS; 30/30 expected correct accepted, 30/30 intentionally incorrect rejected; returned `recorded:false`, `starsAwarded:0`.
- The first real-sheet before/after baseline check with only the P0.2 JSON validator in between also found both matrices unchanged.
- Offline full P0.3 GAS runner simulation: PASS normal, FAIL_CLOSED on unexpected tab mutation, missing 91_So_sao, and missing TEST approval.

## Artifacts
- `QA_Snapshot_NoWrite.gs`: optional read-only GAS test runner. Gated by a preexisting `P03_QA_TEST_APPROVED=YES` Script Property, manual invocation `kiemTraP03KhongGhiDuLieu` on an independently authorized TEST Apps Script project only. Computes SHA-256 of both displayed cell values and formulas for the full grid before/after 6 server grading sessions, logs only metadata/digests. No sheet writing APIs in module.
- `kiem-thu-snapshot.cjs`: repeatable Node offline regression with fail-closed negative cases. Run `node thu-nghiem/p0-3/kiem-thu-snapshot.cjs`.

## Release assessment
- **LIVE_SHEET_SNAPSHOT_PASS**: real sheet content unchanged during connector-observed interval.
- **STUBBED_GRADER_PASS**: existing server grading logic passes six sessions in isolation.
- **GAS_TEST_DEPLOYMENT_PENDING**: no permission or execution interface for the actual bound Apps Script TEST deployment was used. DO NOT describe as full production/App Script no-write proof.
- **SCRIPT_PROPERTIES_OVERRIDE_UNVERIFIED**: current GAS ScriptProperties override of spreadsheet ID cannot be confirmed by source config alone. Never execute script against actual student workbook until TEST bound script ID and target workbook are verified.
- **WEBAPP_PENDING / PRODUCTION_NOT_TOUCHED**.
- Concurrent third-party writes would cause snapshot diff FAIL; equality does not establish who could have written outside the tested interval.

## Rollback
No production code, CSS, HTML or question JSON modified. Do not merge or deploy the isolated TEST branch. Restore exact parent `test/p0-2-validator-v1-20261112` if necessary, or revert only `thu-nghiem/p0-3/` commits after independent review. Never reset MAIN or `test-theo-main`.
Next gate: run `kiemTraP03KhongGhiDuLieu` in a verified separate Apps Script TEST environment and capture redacted JSON PASS output and current ScriptProperties-to-workbook mapping; compare ledger counts/hashes again via authorized connector.
