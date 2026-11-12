# P0.4 — QA Runner tập trung V1 (audit 2026-11-13)

## Branch, boundary and rollback
- Branch: `test/p0-4-qa-runner-20261113` from `test/p0-3-dry-run-no-write-20261112`.
- Does not merge or modify MAIN, `test-theo-main`, the existing 30 B20 questions, runtime JSON, HTML, CSS, server grader or grades.
- P0.3 approval property has been returned to `NO` **according to the user**. Offline QA never enables or reads that live property.
- Rollback: do not deploy or merge. Restore P0.3 branch or revert only P0.4 commits; keep P0.2/P0.3 code and test evidence intact.

## Reused modules
| Mode | Inherited suites | Purpose | Runtime |
|---|---|---|---|
| FAST | `thu-nghiem/p0-2/kiem-thu-validator-v1.cjs`, `thu-nghiem/p0-3/kiem-thu-snapshot.cjs` | JSON/adapter/renderer/grading contracts, simulated no-write snapshots | Node/offline |
| FULL_SAFE | FAST plus `qa/g7-4-b3-1/test-controlled-merge.cjs` and `test-visual-fallback.cjs` | Additional frozen UI, assets, fallback regression | Node/offline |
| UI_REGRESSION | The two existing G7.4-B.3.1 tests | DOM simulation and static layout invariants | Node/offline (NOT real browser) |

`qa-runner.cjs` only invokes these suites through `node:child_process`, enforces timeouts, interprets existing PASS/FAIL summaries, checks test file digests and tracked git status. It DOES NOT recreate P0.2/P0.3 validators or perform grading itself. `kiem-thu-runner.cjs` validates mode routing and result parsing. No live Apps Script, Google Sheets, external network, credentials or student account is accessed by the runner.

## Report contract
Every run emits one JSON summary to stdout with `version,mode,lessonId,schemaVersion,sourceCommit,scope,noWrites,webapp,browser,status,durationMs,passed,failed,tests,errors`. Errors are bounded and standardized as `{code,reason}`. Test results include original suite ID, source file, runtime and cases.
Release implication: offline mode PASS is a **STATIC_PASS** gate, not `WEBAPP_PASS`, `BROWSER_PASS` or `RELEASE_READY`.

## Verification performed in assistant session
- Verified repository diff: exactly 4 paths: added `qa-runner.cjs`, `kiem-thu-runner.cjs`, `.github/workflows/p0-4-qa-runner.yml`, and a **2-line existing P0.3 test harness correction**.
- Why the inherited test correction? Existing VM mock referenced `require('node:crypto')` from inside sandbox, where require is not available; replaced with host closure `crypto` import. No GAS runtime file, grader, Question ID, source data or snapshot contract changed.
- Read back source from GitHub: all three JS files pass V8 syntax compilation.
- Workflow is scoped to `test/p0-4-qa-runner-*` push or explicit dispatch; GitHub token permission is `contents:read`. Executes `kiem-thu-runner.cjs` then selected mode, fails on nonzero exit, and verifies clean tracked worktree.
- Existing P0.2 and P0.3 individual suite logic and B20 answer tests had been verified in prior P0.2/P0.3 work, including user-provided real Apps Script P0.3 PASS log recorded on Drive/GitHub.

## Pending independent execution
- **CI_EXECUTION_PENDING**: no GitHub Actions run/job log observed in this session. Do not claim `FAST/FULL_SAFE/UI_REGRESSION` has passed in the new centralized runner until an actual CI log shows PASS.
- **BROWSER_PENDING**: no device/browser visual regression has run as part of P0.4.
- **GAS_TEST_ENV_PENDING**: authenticated runtime ScriptProperties/TEST binding not independently confirmed. P0.3 runtime log was supplied by user; live no-write evidence is separately preserved.
- **PEDAGOGY_PENDING**: content-level signoff is not in P0.4 scope.

## How to run
```sh
node thu-nghiem/p0-4/kiem-thu-runner.cjs
node thu-nghiem/p0-4/qa-runner.cjs FAST
node thu-nghiem/p0-4/qa-runner.cjs FULL_SAFE
node thu-nghiem/p0-4/qa-runner.cjs UI_REGRESSION
```
GitHub Actions: `P0.4 QA Runner (TEST only)`, choose mode and dispatch on the TEST branch. Standard push on the TEST branch also runs `FULL_SAFE`.

## Acceptance checklist
- [x] Isolated branch; preserved immutable baseline CSS, HTML, B20 30-question pack
- [x] Inherited validators and no-write regression, no duplicated grading
- [x] FAST/FULL_SAFE/UI_REGRESSION modes and normalized report/error format
- [x] Read-only, no score or student persistence within runner
- [x] Versioned CI workflow and rollback
- [x] Structural/source readback QA
- [ ] CI run with PASS outcome and retained log evidence
- [ ] Browser/mobile smoke, if needed for P0.5 release
