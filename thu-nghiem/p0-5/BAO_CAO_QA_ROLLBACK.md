# P0.5 – Release Gate V1 | QA & rollback (13/11/2026)

## Scope
New isolated branch: `test/p0-5-release-gate-20261113`, from `test/p0-4-qa-runner-20261113`. No changes to CSS, HTML, 30 B20 questions, Google Sheets or student ledger. MAIN and `test-theo-main` untouched.

## Deliverables
- `thu-nghiem/p0-5/release-gate.cjs`: pure deterministic fail-closed evaluator of STATIC, WEBAPP, SESSIONS, BROWSER, PEDAGOGY.
- `thu-nghiem/p0-5/kiem-thu-release-gate.cjs`: 15 positive/negative release contract tests; synthetic complete evidence is **test fixture**, NOT proof of real signoff.
- `thu-nghiem/p0-5/evidence-current.json`: previously verified P0.4 CI pass only; other evidence withheld/unsigned.
- `thu-nghiem/p0-5/QUY_TRINH_NGHIEM_THU.md`: TEST deployment prerequisites, desktop/mobile smoke and six-session expected observations, snapshot comparison, rollback.
- `.github/workflows/p0-5-release-gate.yml`: P0.5 TEST-branch CI reusing original P0.4 FULL_SAFE and B20 regression; expects release gate to block given incomplete evidence (no production deployment).

## Verified GitHub CI
Run: https://github.com/Nguyennth19/new-lop-2/actions/runs/43345396270
- FULL_SAFE inherited P0.4: PASS 4/4 suites, 46 assertions total.
- `thu-nghiem/bai-20-bien-the/kiem-tra-hoi-quy.js`: PASS real committed 30-question pack and six-session renderer/grader **offline** regression.
- P0.5 release contract tests: PASS 15/15.
- Incomplete evidence: expected `RELEASE_BLOCKED` gate, accepted as safe workflow SUCCESS.
- No tracked worktree changes.

## Current release gates
- STATIC: **PASS** (previous independently checked P0.4 CI run 43268208017, combined with inherited P0.5 CI).
- WEBAPP: **PENDING**, no verified TEST deployment URL/ID and runtime evidence.
- SESSIONS: **PENDING**, prior GAS P0.3 6 sessions PASS, but not six actual browser/Web App interaction results for P0.5.
- BROWSER: **PENDING**, no actual desktop/mobile screenshots or click-through tested.
- PEDAGOGY: **FAIL/BLOCKED**, runtime JSON still `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF`, no reviewer approval.
- **RELEASE_READY=false**. No attempt to merge/deploy to MAIN or PROD.

## Boundary on evidence
Static scripts verify contracts, not authenticity of user-supplied signoff. A manually populated evidence JSON alone does not establish independent QA, deployment identity, academic quality or permission to release. Real TEST deployment validation and human pedagogical signoff require independently reviewable evidence and responsible authorization. Avoid recording student rows, names, tokens, or detailed answers in public GitHub logs.

## Rollback
Do not merge or deploy P0.5 branch. On regression, switch to `test/p0-4-qa-runner-20261113`, or revert only added `thu-nghiem/p0-5/` and workflow in disposable TEST branch; never reset MAIN, `test-theo-main`, P0.2–P0.4 or student data.
