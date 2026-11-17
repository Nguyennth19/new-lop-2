# B001–B024 — P0 source-driven LessonPackage checkpoint

**Date** 2026-11-17 · **staging branch** `test/p0-b01-b24-lessonpackage-v1-20261117`

## Verified artifacts

- Generator input immutable source snapshot: `qa/p0-b01-b24/inputs/source-index.v1.json`, live read from C1 + G2 / MASTER for exactly 24 lessons. No student records/grades or hidden answer keys copied.
- Build script: `scripts/lessonpackage/build_b001_b024.cjs` (`--write`, `--check`, deterministic).
- 24 LessonPackage files + one `manifest.B001-B024.json`: generated and committed at **`f471cad2ceb6885a787e9e055ec8d19eff3b8f3e`**.
- Formal `lessonpackage.schema.v1.json` and source-aware `qa/p0-b01-b24/test_lessonpackages.cjs`.
- [Live MASTER index tab 20](https://docs.google.com/spreadsheets/d/1F6LBKvTjmOsRd1QlB0Zj9QStHu6oCb7t-rXEXKXE4Ts/edit#gid=910120): 24 bounded metadata rows, each linking to *immutable GitHub JSON file commit*, no 536 question rows pushed into Google Sheets.

## Readback evidence (source bytes not guessed)

| Property | Verified |
|---|---:|
| JSON lessons | 24/24 |
| C1 source envelope candidates | 536 |
| G2 technical review records | 96 |
| G2 adaptation rule checks | 25 |
| Distinct adaptation source exercises | 24 |
| Keep unique preview candidates | 17 |
| DROP source exercises excluded | 7 |
| Ready publicVariants | 0 |
| Independently source signed | 0 |
| Playable student questions | 0 |
| Source-to-G2 automatic ID joins | 0 |
| Student release | **NO-GO** |

[Github Actions build 44102558488](https://github.com/Nguyennth19/new-lop-2/actions/runs/44102558488): SUCCESS, **101/101 tests**; the workflow generated all 24 JSON and pinned them to `f471cad2ceb6885a787e9e055ec8d19eff3b8f3e`. QA is source/contract validation only, not Android/iOS browser QA nor real GAS.

**Source identity limitation:** C1 `L1/H1` IDs and G2 `LT01/HD` IDs have no exact overlap. They can refer to the same printed exercise; do not falsely count 632 distinct student exercises or fuzzy-join without an independently signed source crosswalk. The layer `technicalReviewCandidates` is separate from the 536 `questions` candidates.

**Missing content limitation:** C1 has no verified full prompt, part/slot, validator or answer authority. Question-level `skillId`/renderer remain null for C1, with lesson skill only as index-level candidate. G2 source evidence identifies page/skill candidates but only 17 template candidate refs are safe to preview; typed variant parameters and reviewer/renderer/policy approvals are not present. The 25 owner-reviewed transformations do not constitute 25 independent signed source verifications.

## Gates and next action

`PACKAGE_JSON_STRUCTURED_PASS` and `TEST_INDEX_CONTRACT_PASS` do not change `SOURCE_EXACT_SIGNED=0`, `PEDAGOGY_APPROVED=NO`, `RENDERER_GRANTED=0`, `GAS_TEST_E2E=NOT_RUN`, `PUBLIC_VARIANT_READY=0`, `RELEASE=NO_GO`.

Next: **B01–B24 semantic hydration** using approved family templates and C1/G2 source sidecars — populate verified prompt, numeric operands, part slots and safe publicVariant under a **new version** for the specific lesson; continue to use trusted server grading for answers. Keep historical source candidates frozen; never invent SGK exact question text or merge C1/G2 IDs without evidence.

## Rollback

- Prior TEST adaptation base: `test/p0-g2b-variant-adaptation-20261117@a00a7f348db566bc024ff7ba42d874fe5d6c018a`.
- Student-facing branches unchanged: `be-hoc`, `test-theo-main`, `main`.
- No GAS deployment, grade log, parent/scores, source workbook or 25 reviewer registers edited. To roll back, discard this isolated TEST branch and remove optional tab 20 after retaining audit evidence. Never roll back into insecure legacy client grading.

### Schema / final QA extension

- `du-lieu/bai-hoc/toan/v1/lessonpackage.schema.v1.json` formally defines the nonplayable V1 package gate.
- [Further CI on test source SHA 61661986ed13309699665843f54cc6bd022a2dce](https://github.com/Nguyennth19/new-lop-2/actions/runs/44103551700) = **102/102 PASS**, 0 FAIL; the generated QA report was pinned in the branch by the same isolated job. This supersedes the 101-test count of the original build without changing 24 lesson JSON content.
