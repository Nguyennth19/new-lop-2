# G7.6-B – Execution Log / Recovery Journal (2026-11-15)

> Append-only phase record. Isolated TEST scope; times only when observed from GitHub. Never infer successful deployment or modify protected branches.

| Order | Git commit / evidence | Event | Verification |
| --- | --- | --- | --- |
| 00 | `ee20a8b7394e22e6028d6760c49b77c54a2814cc` | Verified G7.6-A pinned HEAD and 296-assertion checkpoint | Source unchanged; new independent TEST branch |
| 01 | new branch `test/g7-6-b-variant-adapter-matrix-v1-20261115` | Branched exactly from checkpoint A | create_branch from exact SHA |
| 02 | `1232718b202ab15fcb282d76455cd8be89e48f62` | Added 12-row adapter matrix | `du-lieu/g7-6/variant-adapter-matrix.v1.json` |
| 03 | `dc7acdaa9876a47334b94a01f353739b6c9bb06d` | Added public-projection adapter and native reference-plan conversions | `qa/g7-6/variant-adapter-bridge.cjs` |
| 04 | `62094eabe43520349030d1c29584a00ccaad6477` | Added 12-type test matrix, P0 B21-pattern fixtures, negative security | `qa/g7-6/variant-adapter-bridge.test.cjs` |
| 05 | `a83d8572c9b30c5d5a6b6d132e88078e71a27404` | Added independent GitHub Actions workflow | `.github/workflows/g7-6-b-variant-adapter-matrix.yml` |
| 06 | run `43682760355` (05:50 UTC) | Actions success: inherited A 296 assertions; B 221 assertions | https://github.com/Nguyennth19/new-lop-2/actions/runs/43682760355 |
| 07 | artifact `14148614688` | Uploaded public-safe receipt, no answer key | https://github.com/Nguyennth19/new-lop-2/actions/runs/43682760355/artifacts/14148614688 |
| 08 | `412f5e01b4ae228ef2a5b10e35e85e244aea9cda` | Reported per-gate QA, scope, known gaps | `docs/kiem-dinh/G7.6-B_VARIANT_ADAPTER_MATRIX_CONTRACT_INTEGRATION_20261115.md` |
| 09 | `2232f2a4cf9ab6c53d4a8e2403836d81f1db5c6e` | Saved recovery checkpoint | `qa/g7-6/checkpoint.g76b.v1.json` |

## Trust and QA boundaries
- A TEST pass is not a production release. B1/B2/B3/B4/B5/B6 PASS only at contract, pure native-core and offline fixture scope.
- D10 stays in G6; new graded variants/legacy client grader blocked.
- P0.6 producer is outside this branch; D2/D4 typed source compatibility is not live E2E.
- Dynamic SVG uses pinned renderer. Fluent Flat auto-fallback disabled. 288 asset registry entries do not grant content authorization.
- 2 TTS profiles select approved descriptors; no live Web Speech or speaking hidden correct answers.
- `test-theo-main` named preferred future app base, not changed.
- No GAS deploy, student data, score, stars or protected file modifications.

## Recovery when a chat freezes
1. Open branch `test/g7-6-b-variant-adapter-matrix-v1-20261115` and `qa/g7-6/checkpoint.g76b.v1.json`.
2. Read `du-lieu/g7-6/variant-adapter-matrix.v1.json`, this journal, and the G7.6-B report.
3. Verify the baseline `ee20a8b...` is an ancestor; compare changed files against A. Read-only source files must be unchanged.
4. Review CI run `43682760355` artifact and current workflow runs; rerun Node TEST only as needed.
5. Continue from the blocked B7 gates, **not** from G7.6-A or new unapproved runtime/GAS paths.

## Stop conditions and rollback
If manifest blob check, public-answer guard, native compiler, static SVG policy, test/protected files, or CI fails, block promotions. Restore to baseline A commit, leaving TEST branch for forensic tracing. Never silently apply a patch to `main` or `test-theo-main`.
