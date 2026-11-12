# P0.2 — Validator V1 | QA & rollback
Date: 2026-11-12 (Asia/Ho_Chi_Minh)
Branch: `test/p0-2-validator-v1-20261112`
Base (immutable): `test/g7-4-b3-1-controlled-merge-20261112` @ `6ccf51a288fa0a9ad57f5cc5afdb9c4ae8cae5bd`
Scope: QA-only; no CSS/HTML edits, no B20 question edits, no Sheets or student records writes.
Previous P0.1: [Drive audit](https://docs.google.com/document/d/1yVVYxCnSSk5AEZuV0pRnRybPf0DbKyzHyvdUtBOByjQ/edit).

## Artifacts
- `thu-nghiem/p0-2/validator-v1.js`: pure independent V1 API for source, adapter, renderer, single-question grade, session-grade; findings have `code,questionId,field,reason`.
- `thu-nghiem/p0-2/kiem-thu-validator-v1.cjs`: offline Node regression using existing runtime.json and existing adapter. Command: `node thu-nghiem/p0-2/kiem-thu-validator-v1.cjs`.

## Evidence: executed in isolated JavaScript runtime (not GAS deployment)
| Check | Result |
|---|---|
| Real B20 30-question source + 6 sessions | PASS |
| Actual existing adapter output, 30 IDs preserved | PASS |
| Renderer data contract / 6 levels | PASS |
| 18 additional validation positive + deliberate negative cases | PASS 18/18 |
| Existing server grader stubbed read-only: all six sessions correct answers | PASS 30/30 |
| Existing server grader stubbed read-only: intentionally wrong answers | PASS 30/30 rejected |
| `recorded:false`, `starsAwarded:0` for all six sessions | PASS |
| Browser/App Script deployed runtime | NOT RUN |
| Snapshot of Google Sheets 90/91 before/after | NOT RUN — P0.3 |
| Pedagogical review / full 45-question content | NOT RUN |

The negative cases include duplicate ID, orphaned ID, session mismatch, invalid prompt/type/answer/arithmetic, broken adapter section and invalid asset ID.
No HTTP calls to the live Web App or Sheet writes were performed. The server-grade test uses stub `CacheService` and `UrlFetchApp` bound to unchanged local runtime JSON.

## Boundary & reuse
This validator does not replace `KhoBaiHoc.gs`, `42_AdapterBienTheB20.html`, `41_HienThiCauHoiToan.html`, `26_ChamCauHoiToan.html` or the server-authoritative B20 grader. It is **opt-in** for QA; not wired into production paths. For other subjects, use `validateSource(raw,{allowedTypes:[...]})` with future approved question types, and adapt to standard `levels/sections/questions` before calling renderer checks. Unsupported Vietnamese/English answer semantics must be validated separately; this code makes no claim of language-pedagogical correctness.

## Release gate
**STATIC_PASS / WEBAPP_PENDING / PEDAGOGY_PENDING / P0.3_NO_WRITE_PENDING**. This is NOT a production release.

## Rollback
No application runtime files were touched, so rollback consists of **not merging or deploying** the TEST branch. To remove the QA-only addition if later merged, revert commits adding `thu-nghiem/p0-2/` or restore the exact base commit `6ccf51a...` on a new disposable branch. Never force-reset MAIN or `test-theo-main`.

## Next
P0.3: immutable snapshot before/after real read-only trials; P0.4: combine runner and UI regression; P0.5: deployment and pedagogical acceptance.
