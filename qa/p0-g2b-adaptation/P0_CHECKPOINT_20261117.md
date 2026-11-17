# P0 G2B — Final technical TEST checkpoint 2026-11-17

**Status:** `DECISION_MAPPING_25_PASS` · `REUSABLE_TEMPLATE_CODE_29_OF_29_PASS` · `SOURCE_REVIEWER_0_OF_25` · `STUDENT_RELEASE_NO_GO`.

## Grounded source

- Original 25-case source audit SHA `969bdad4495839fddf303685e59416674460988c`: 10 G1 corrections, 15 topology risks, 24 unique source exercises, 0 independent human source signoffs.
- Owner explicitly confirmed original SGK/VBT visual/source accuracy and approved replacement/structural/drop rule; this is **owner transformation policy approval**, not an independent reviewer signature.
- [Original reviewer 25 tab](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910116) unchanged.
- [New 25-case decisions tab](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910119): count 25; 11 KEEP_VARIANT; 7 KEEP_STRUCTURAL; 7 DROP; 24 unique; 18 family template pass; 0 independently approved; 0 ready for release. Sheet formula local `vi_VN` uses `;`, readback no errors.

## Runtime staging integration

- Origin be-hoc SHA `59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff` (unchanged); staging branch `test/p0-g2b-variant-adaptation-20261117`.
- `89_P0_VariantRouter.html`: typed source/lesson/skill semantic contract, 24 pinned origin IDs, 7 family drop gates, family validation, seeded two-group generator, D4 independent 5-to-4 choice adaptation, `buildCandidatePool` dedup.
- `90_P0_VectorStructural.html`: six SVG preview families (hundred grid, sum pyramid, polyline length, multipath comparison, stepped number line, missing-digit subtraction). Review-preview-only DOM opt in; never scores.
- `89_P0_VariantRouter.html::compileReviewPayload`: maps 18 kept case checks to D3/D4/D7/D9/D10 actual compiler payloads or review vector; D9 E04 TOTAL/estimate-tens sidecars explicitly missing, so code does **not** claim playable D9 totals.
- `GiaoDien.html` includes 89/90 before `83_Visual_Orchestrator`. `83` makes test-only `p0Candidate` and `p0ReviewPreview` available; any `q.p0Adaptation` in the existing student lesson route is **denied** pending source-independent+renderer policy. Variant ID separate from pinned `sourceExerciseId`.
- `DROP` means exclude from generator pool, retain source history and reviewer evidence. Pool of all 25 checks => **17 unique retained** (18 keep checks minus 1 duplicate C01=V03); **8 excluded** (7 DROP + 1 duplicate). Replacement only from signed same-lesson/skill pool, no invention.

## CI evidence

- [GitHub Actions 44098183197](https://github.com/Nguyennth19/new-lop-2/actions/runs/44098183197) on exact tested SHA `375a5c0cf72642c045335ecc38f3b35591b23ea6`: `29/29 PASS`, `0 FAIL`.
- Included: 25-source mapping in one assertion, 18 compiled renderer payloads, 6 vector family previews, fixed 24-ID pin, source crosswalk/identity and poisoned public payload negatives, 5-to-4 D4 choice compatibility, D3 one-to-one rejection, D9 E04 missing support, origin dedup, count exact boundary and seed stability.
- CI is Node/VM and render-string tests; **not Chrome visual QA, GAS network E2E or student release**.

## Operational gates

| Gate | State |
|---|---|
| Owner transformation choice | CONFIRMED |
| Structured family recognition and candidate payload | CODE PASS 29/29 |
| Independent source/part/slot approval | 0/25; original 0/96 |
| Renderer grant/asset grant/publicVariant publishing | 0 |
| E04 total / exact-estimate and D2 missing-operand policy | NOT APPROVED |
| Trusted grading + real GAS TEST | NOT VERIFIED |
| Browser/device visual QA | NOT RUN |
| Production deploy / learner reward | NO_GO |

## Rollback

- No edits to `main`, `test-theo-main`, `be-hoc`, production GAS, original G1/G2/reviewer 16, student score ledger or 90/91/92.
- Disable staging by not merging the TEST branch. Return to `be-hoc@59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff`. Do not turn historical insecure B20 client grading on in students.
- Next major step B01–B24: compose one JSON lesson package per lesson with canonical provenance and an attached `adaptationContract`; generated variants **never claim to be literal SGK copies**. Admit only after separate source and policy approvals.
