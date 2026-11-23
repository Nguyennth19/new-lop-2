# N6 — Synthetic LAB Contract & Failure Test Pack — 2026-11-23 (GMT+7)

**DECISION: N6_SYNTHETIC_TEST_PACK_SCOPED_PASS / REMEDIATION_NOT_IMPLEMENTED / N5_HUMAN_GATES_PENDING / NO_GO_TEST_WRITE.**

## Verified execution

- GitHub source test: [n6-failure-contract.test.cjs](../n6-synthetic-lab/n6-failure-contract.test.cjs).
- LAB branch: `lab/ult-n4-final-b-n5-handover-20261123` (Draft PR [#25](https://github.com/Nguyennth19/new-lop-2/pull/25)).
- Source commit: `9bc9a9318da353a7ac72962434ba78d1b7e64c18`.
- Workflow: [n6-synthetic-db-contract-lab.yml](https://github.com/Nguyennth19/new-lop-2/blob/lab/ult-n4-final-b-n5-handover-20261123/.github/workflows/n6-synthetic-db-contract-lab.yml).
- Workflow commit: `97505d3162bf2e4b0f4348ba895cafab3f5f783e`.
- **GitHub Actions [run 45142063620](https://github.com/Nguyennth19/new-lop-2/actions/runs/45142063620) SUCCESS**, exact checkout SHA `97505d3162bf2e4b0f4348ba895cafab3f5f783e`, job `synthetic-db-contract` SUCCESS, Node test summary **16 tests, 16 PASS, 0 FAIL**. All **DB-T01..15** individually PASS plus one global guard. Direct job log checked, job ID `137582237251`.
- An **additional, more expansive local-only** Node harness was executed on Node v22.16.0 (17/17 PASS, 0 FAIL); its SHA-256 `bd64cf67ca426fa8002357170a4d5059dfab9263a9c226c70875599b1bbe99a6`. This local file is separate from the 16-test GitHub version, so **do not attribute 17 tests to GitHub CI**.
- Workflow triggers only on push to this LAB branch touching its N6 test folder or itself, with `permissions: contents: read`, no secrets and no deployment action. It did not execute against GAS or Sheets.

## Test matrix (all synthetic; not genuine DB closure)

| Test | Demonstrated in synthetic Node LAB | Limits / production closure still needed |
|---|---|---|
| DB-T01 | Deny missing N0-S receipt, mismatched CI SHA or W1 human gate | Fake status-proof objects, not authenticated N5 signatures |
| DB-T02 | D2 arithmetic/skill acceptance and denial | Not live D2 renderer regression or lesson approval |
| DB-T03 | D5 geometry shape policy | Simplified shape fixtures, not renderer/pedagogy QA |
| DB-T04 | D9 EXACT_COUNT fail-closed assetId/countUnit/symbolValue | Sample asset vocabulary only, no full live asset audit |
| DB-T05 | D10 one-operation, private answer denial | No trusted grading/server validation |
| DB-T06 | Idempotent retry returns one logical batch | In-memory Map, not a durable idempotency store |
| DB-T07 | Reject competing fake writer or duplicate execution id | Sequential simulated conflict, not actual parallel writers/Google Sheet race |
| DB-T08 | Journal/readback fault leads to recoverable pending | Simulated failures, no real partial external write |
| DB-T09 | Source mutation after snapshot causes stale deny | In-memory version/digest, no live Google re-read |
| DB-T10 | Stale expectedRevision or digest rejected | No atomic remote CAS |
| DB-T11 | Unauthorized fake actor denied | Mock actor string, no real IAM/credential enforcement |
| DB-T12 | Stale/unsigned/partial rollback preserves active | Simulated pointer, no production rollback |
| DB-T13 | Typed APPROVED row cannot authorize | No live Sheet approval ingestion |
| DB-T14 | Test-only HMAC checks digest/role/expiry, rejects tampering | Public hardcoded LAB test secret; NOT an authentic external identity/signature provider |
| DB-T15 | AI_CANDIDATE_ONLY cannot approve/release/grade | No live AI provider or grading service |
| Global | Candidate output always non-release and model active pointer unchanged | No system-level no-write proof beyond isolated workflow operations |

**Important correction on strength of evidence:** This validates the *test contract and mock fail-closed responses*, not production implementation of Single Writer, CAS, idempotency, cross-writer concurrency, E2E data integrity, authenticated signatures or learner release safety. Therefore `DB-01 BLOCKED`, `DB-02..05 OPEN`. Do not mark `DB-T01..15 PRODUCTION_PASS`.

## Provenance and governance

- Canonical RTM source: https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view ; 10.495 bytes / prior SHA256 `d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b`. N0-S recipient A3/A4 still pending.
- V1.3-B frozen source: `af02456fcc2b3be856091edc899c699890d74da0`. No modification to V1.3 publisher-core, 36 frozen renderer/CSS files, main, be-hoc, GAS, students or sheet.
- Prior N6 read-only audit: [N6 DB01..05 audit](N6_DB01_DB05_READONLY_AUDIT_REMEDIATION_READINESS_20261123.md).
- N5: 5/5 scoped technical PASS; 0/5 independent QA signatures; 0/5 W1 CLOSED. Hence DB-01 remains BLOCKED and V1.3-C write integration remains forbidden.
- Drive mirror/landing: https://docs.google.com/document/d/17I4dRJSXRuyiDWh2gD-T6_umP4m4FRc6rmNY02pH74U/edit ; index: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit ; single signature register: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit (not modified by N6).
- No separate administrative PR, no human signature fabricated, no Sheet TEST/MAIN writes or sharing changes.

## Next gate

1. Independent human closure of N5 W1-01..05 and N0-S A3/A4 with authenticated timestamp and scope.
2. Independent QA to review this N6 synthetic evidence as test-design proof, identify missing production threat cases and reviewer authorization.
3. After explicit approval, implement data writer/CAS/signature controls in a separately gated TEST environment (N7-N9 per N0-N11 roadmap) and then rerun DB-T01..15 against actual integration/fault injection, validating external write/readback, concurrency, security and rollback. N10/11 remain human release gates.

**Final verdict:** `N6_SYNTHETIC_LAB_CONTRACT_PASS` (16/16 CI checks for this suite) and `N6_DB_REMEDIATION_NO_GO` simultaneously. This is deliberate, not contradictory.
