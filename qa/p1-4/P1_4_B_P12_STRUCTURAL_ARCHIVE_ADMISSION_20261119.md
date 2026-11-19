# P1.4-B — P1.2 structural archive admission (nonplayable)
Date: 2026-11-19

## Decision
`STRUCTURAL_ARCHIVE_ADMITTED · STUDENT_PLAYABLE_0 · NO_RUNTIME_ROUTING · RELEASE_NO_GO`.

Source branch `test/p1-2-b-b001-b004-content-variants-20261118` at `109300158378cbbf48a4724453cc1e555d7eaccd`, tree `b7673791cabebe9c5b63eaad27851566932745fb`; 73 Git blob SHA entries copied unchanged. All are NEW paths; no existing be-hoc files modified.

## Exactly what is admitted
- 52 files in `du-lieu/bai-hoc/toan/v1/` and `v2/`: B001–B024 24 V1 immutable source indexes, 24 V2 layered packages, 4 matching schemas/manifests.
- 9 QA files in `qa/p1-2/`, including 24/24 byte source equality test, crosswalk and checkpoint.
- 12 QA files in `qa/p1-2-b/`, covering B001–B004 79 C1, 27 inherited C4 DEV references, 52 missing content candidates, 8 original recipes and 32 original DEV previews. There are **0** signed source-exact, **0** approved public variants, **0** student playables.
- Existing `GiaoDien.html`, `83_Visual_Orchestrator.html`, `19_KhongGianHocToan.html`, `KhoBaiHoc.gs`, graders and all P1.3 assets remain unchanged. No P0 variant router is imported.

## Source gates preserved, not promoted
P1.2-A documented `24/24` structural lesson and crosswalk PASS, 536 C1 source candidate references, 96 G2 review candidates, 17 templates and 7 exclusions, 41 unresolved renderer candidate routes. No automatic source exact or renderer grant.
P1.2-B documented `79/79` PDF filename/hash/page scope, 27 C4 DEV, 52 source transcriptions pending, 32 DEV original previews and 2 estimated scoring policy conflicts. The source PDF binaries are NOT included, and CI cannot independently re-hash them; inherited PDF evidence remains review-only.
B20 legacy 51 rows and P0.5 30-question H.2 acceptance are separate from B020 33 candidate source records. Do not silently join.
User's evolving B001-B024 workbook V5-V7 is a different data review track; this archived P1.2 evidence does not replace or certify the latest content workbook.

## Negative security requirements
- No `answerKey`, `solution`, `expectedAnswer`, grading rubric or student identity promoted to public render.
- `publicVariantReady = 0`, `studentPlayable = 0` and source exact source approvals = 0 are expected PASS of **denial policy**.
- No web endpoint, router, GAS, SHEET, MAIN or production code is modified by archive admission.
- Run 24/24 V1->V2 structural tests, B001-B004 negative admission and content QA; no student-ready claim is permitted.

## Closure
QA on an integration branch is required before merging into `be-hoc`. Archive-only rollback: revert this merge/commit and delete only these imported archive paths; do not delete old project sources or modify any GAS project. Live student lesson release remains separate.
