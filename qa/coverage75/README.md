# DATA-B / COVERAGE-75 — Source Coverage Audit (2026-11-17)

**Status: INVENTORY PASS · OWNER MISMATCH ACTIVE 0 · HISTORICAL RESOLVED 65 · SOURCE/PEDAGOGY/RENDERER/RELEASE NO-GO.** Audit-only branch derived from `be-hoc @59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff`. No production changes.

## What is preserved rather than re-extracted

- `REFERENCE_MASTER_CURRICULUM_SURVEY_V01 / CURRICULUM_MAP`: all **75** canonical lesson IDs `MATH_B001`–`MATH_B075`.
- `LOP2_CONSOLIDATED_MASTER_B001_B075... / SOURCE_1406`: **1,406 source candidates** (**677 SGK**, **729 VBT**) across all 75 lessons, with original IDs, provenance and BQA ownership. **All 1,406 remain `EXCLUDED_PENDING_B`**.
- `LOP2_C1_ALL_IN_ONE_JSON_BUILD_B001_B075 / C1_BUILD_INDEX`: **1,406 candidate JSON envelopes**, 75 lesson envelopes; **0/1,406 render-eligible**. The C1 final report notes **1,053** without complete source prompt, **353** with partial hint only.
- Historical `P3_EXERCISES`: **707** records. These are **not additional approved source-exact questions**.
- Current MASTER's preliminary ledger: **82 SGK + 270 VBT** records across B001–B024, with partial/secondary provenance.
- G2's 96 candidate records: **86 SGK + 10 VBT**, affecting 7 lessons (B001, B010, B019, B020, B022, B023, B024). The G2 and SOURCE_1406 string IDs have 0 exact matches; **semantic equivalence and de-duplication are unproven**.
- Existing legacy B20 runtime/QA: **51** questions, not counted as source-proven SGK entries. G3-A TEST private-grading work remains independent.

## Verified coverage tiers

| Tier | Lessons | What it actually means |
|---|---:|---|
| `MASTER_G2_CANDIDATES` | 7 | Detail ledger + G2 source-observed candidate |
| `MASTER_LEDGER_ONLY` | 17 | Detail MASTER SGK/VBT ledger, source/part QA incomplete |
| `HISTORICAL_C1_ONLY` | 51 | Historical source candidates + C1 scaffolds exist; this MASTER has no lesson exercise ledger |
| **TOTAL** | **75** | **0 lesson eligible for release** |

**24/24** B001–B024 lessons have at least one SGK and one VBT record when MASTER ledgers and G2 candidates are combined. This does **not** prove exhaustive book coverage. B025–B075 have candidate data in the older source/C1 books, not an empty repository.

## Blocking exceptions

1. **RESOLVED in V8/C1:** Older Consolidated owner discrepancies were B061 28 + B062 37 = 65 historical rows. V8 patch `V8-OWNER-FIX-20261109-01` repaired them; active owner discrepancies are now **0**. Do not rewrite historical SOURCE data.
2. Historical SOURCE track PDFs have their own edition/source SHA. The G2 reference MASTER PDF SHA differs for Tập 1; page/edition crosswalk is required before treating evidence as interchangeable.
3. V8 has **0/75 source-verified lesson gates**, even though its static registry triage covers all 75.
4. `G2B` independent signatures **0/96**; `rendererId`, `assetId`, `publicVariant` granted **0**.
5. `B020` has separate legacy content and grading/privacy controls. `B024` alpha remains unapproved with schema/grading blockers.

## Deliverables / authoritative links

- [Governance MASTER 75 rows](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910113)
- [Per-lesson evidence & issues](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910114)
- [Metrics and definitions](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910115)
- `DATA_B_COVERAGE75_SNAPSHOT.json`: no answer/rubric or learner data, exact row-by-row snapshot with pinned source references.
- `verify_coverage75.cjs`: automated crosswalk and fail-closed QA.

## Next decisions, without re-extraction

1. **P0 owner issue CLOSED in V8/C1:** Preserve 65 historical fixes and revalidate active 0 when mapping changes. Edition/source PDF boundaries remain independent.
2. **P0:** Crosswalk seven G2 lessons against historical 1,406 records by lesson/session/page/semantics. The 96 G2 IDs cannot simply be appended as new exercises.
3. **P1:** For remaining B001–B024 ledger records, independently inspect exact part/slot/figure and complete reviewer signoff.
4. **P2:** For B025–B075, reuse the existing 1,406 C1 scaffolds: fill the missing source-exact prompts, visual geometry, grading contracts and lesson-scoped skills; keep provenance and BQA owner.
5. **Release:** trusted public/private grading, renderer/asset policy approval, human source signoff, and actual GAS TEST network QA remain separate gates.

## Rollback

The work adds tabs 13–15 to the governance Sheet and this isolated audit branch. No alteration to MASTER / Consolidated / V8 / C1 / B20 sources, `be-hoc`, `main`, GAS or student records. Disable/ignore the new tabs or branch to return to the prior state; do not delete prior ledgers.

## Owner report reconciliation — 2026-11-17

- Canonical active 0 across BQA-17/18; history B061=28 and B062=37, sum=65 resolved by V8-OWNER-FIX-20261109-01. Two separate batch-boundary issues are also closed, not included in 65.
- V8_OWNER_CANONICAL_LOCK and C1_FINAL_REPORT are the evidence authorities; old V8_INTERIM_REPORT/Consolidated do **not** mean 65 still open.
- Google Sheet `15_COVERAGE75_ROLLUP` now has separate metrics **0 open / 65 historical resolved**; `13_COVERAGE75_MASTER` and `14_COVERAGE75_EVIDENCE` already showed 0 active.
- Snapshot and CI test enforce current 0 and historic 65 while preserving 75/1406 totals. Source documents, original BQA records and learner data are unchanged. Release remains NO-GO.
- [V8 authority](https://docs.google.com/spreadsheets/d/1VlscK4-xviocaAKxebOpvTL0Kpjpa1ILEGUYdb13Hzo/edit) · [C1 authority](https://docs.google.com/spreadsheets/d/1GPChHRV4sZ4ZplgJmIIkcIFeERLIjUruoY-s3H7_TVM/edit) · [audit errata](https://github.com/Nguyennth19/new-lop-2/blob/audit/master-state-reconciliation-20261117/qa/global-audit/COVERAGE75_OWNER_AND_STATE_ERRATA_20261117.json)
