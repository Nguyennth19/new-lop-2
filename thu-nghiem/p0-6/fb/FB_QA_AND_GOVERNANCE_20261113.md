# F-B.1 — Versioned TEST Lesson Governance & Rollback
Time: 2026-11-13T22:47:29.197+07:00 (Asia/Ho_Chi_Minh)
**Status: TECHNICAL_PASS / TEST_PREVIEW_ONLY / RELEASE_READY=false**.

## Scope and provenance
- Branch: `test/p0-6-fb-from-fa-20261113`; base F-A `612bcf54c5c67247c97be1c2c6a931c367ddeb5b`.
- F-A inherited owner-approved G7/G8 (TEST only), G5 Chromium browser QA desktop/mobile 8/8, receipt and Composer; **no F-A source reimplementation**.
- E03 source policy remains DRAFT and `INDEX_VERIFIED`; no automatic publication or source rewrite.
- `lessonId=toan_b21`; `lessonVersion=p0.6-fb-test-b21-v1`, 8 questions, LV1/LV2/LV3=4/2/2.
- Gate `fb-lesson-release-gate.cjs` pins all Composer-produced hashes for policy, content and receipt and requires source CI reference. It rejects unknown lesson/version/environment and student/persistence/deploy permission; OFF by default.
- A deterministic, read-only candidate JSON and QA/rollback receipt are built by `xuat-bien-nhan-fb.cjs`. They are workflow artifacts, not published into Web App or Google Sheets.
- `rollback()` returns to `BLOCKED_DEFAULT` for this lesson only. It is a logical TEST preview rollback; **not** Google Apps Script deployment rollback.

## Verified CI
- GitHub Actions run: [43455957462](https://github.com/Nguyennth19/new-lop-2/actions/runs/43455957462).
- Commit: `900edeebb5c88518312596aa3e7d784415d9c4b4`.
- Conclusion: **SUCCESS**. E03 Validator, Generator and Composer, inherited G5 Bridge, F-B governance regression **10/10 PASS** and export completed.
- Candidate digest: `51e314ae033cc8fb85a301eeb82f65d80f0a5ae1647d569eba94c9d9b37237e3`.
- Artifact: `fb-b21-test-candidate-evidence`, ID `14052649246`, 1365 bytes, 30-day retention, includes candidate JSON and QA receipt.
- Artifact link: https://github.com/Nguyennth19/new-lop-2/actions/runs/43455957462/artifacts/14052649246

## Acceptance boundaries
| Gate | Outcome |
|---|---|
| Inherited F-A G5/G7/G8 | PREVIOUSLY PASS/OWNER_APPROVED_TEST_SCOPE |
| F-B fail-closed TEST lessonVersion gate | PASS |
| F-B 10 negative/safety regression checks | 10/10 PASS |
| F-B deterministic JSON candidate and QA receipt | PASS |
| Independent per-lesson rollback to blocked flag | PASS |
| Google Apps Script TEST Version 6 integration | NOT_PERFORMED |
| Student-facing persistence, stars, scores | BLOCKED |
| Production release | BLOCKED |

## Next F-B controlled activity
Generalize the validated gate to additional `lessonId` only after each lesson receives its own approved policy, family/level mapping, renderer QA and source hashes. Any actual Apps Script TEST integration requires a separate owner authorization and QA; **do not infer authorization from F-A G7/G8**.

Recovery: inspect `FB_CURRENT_STATE.json` and this report, verify remote HEAD + GitHub Actions run before any further write. No changes to MAIN, test-theo-main, Version 6 or B20 H.1.
