# P0 A — B20 Trusted Grading · GAS TEST Acceptance

**Gate:** `REAL_GAS_NOT_RUN` / `ACCEPTANCE_PENDING` / `STUDENT_RELEASE_NO_GO`  
**Target:** the ONE isolated GAS TEST Web App shared with G2B 25-case visual review. This report is independent of the G2B educational/visual reviewer decision.

## Evidence available before deployment

- Existing G3-B branch `test/data-b-g3b-b20-trusted-gas-e2e-20261117`; G3-A TEST server source and private-grading boundary are unchanged by G2B integration.
- Node/VM: 33/33. Mock HTTP: 6/6. G3-B negative/regression checks: 32/32. Simulated browser `google.script.run` bridge: 21/21. **These are not real GAS E2E results.**
- Same-branch integrated CI: https://github.com/Nguyennth19/new-lop-2/actions/runs/44119669559 (2 jobs PASS, no deployment).
- QA source workbook `G3A_TEST_ONLY_B20_QA_WORKBOOK_20261117` has exact tab counts **1 / 3 / 8 / 51** at last read. No student reward/attempt tabs. Private source data and answer keys never included in public GitHub.

## One GAS TEST deployment – B20 acceptance receipt

| Requirement | Evidence required from that exact deployment | State |
|---|---|---|
| Deployment provenance | isolated GAS project, deployment ID, version and matching GitHub SHA pinned in private reviewer ledger | NOT_RUN |
| Identity and source | active user allowed, blank/unlisted denied, private script properties and QA workbook only | NOT_RUN |
| GAS Editor-only server audit | execute `g3bAuditGasServerOnce_()` as tester, redacted receipt PASS, 0 writes | NOT_RUN |
| Authenticated browser smoke | `<TEST_EXEC_URL>?g3bSmoke=1`, **21/21**, redacted receipt; never log token/answer | NOT_RUN |
| B20 visual and interaction | normal TEST Web App B20 LV1/LV2/LV3, correct/wrong/empty, desktop/mobile | NOT_RUN |
| Network secrets | inspect real google.script.run response for zero answer-key, rubric and private row fields | NOT_RUN |
| Token/replay and scope | replay, unknown origin and B024 DENY, cache/TTL/rate limits | NOT_RUN |
| Side effects | 01–04 tab counts and workbook checksum unchanged; 90/91/92 not created, 0 stars/writes | NOT_RUN |
| Approval | authorized reviewer ID/time, receipt SHA and owner decision | NOT_SIGNED |

**Biên nhận cần điền bằng chứng tại deployment thực (không ghi bí mật):**
```json
{
  "record": "P0_A_B20_REAL_GAS_TEST_ACCEPTANCE",
  "deploymentCodeSha": "NOT_DEPLOYED",
  "deploymentIdStoredPrivately": false,
  "editorAuditReceiptSha": null,
  "browserSmokeReceiptSha": null,
  "networkRedactionReview": "NOT_RUN",
  "visualLV1LV2LV3": "NOT_RUN",
  "noWritesVerified": false,
  "reviewerSigned": false,
  "decision": "NO_GO"
}
```

**Hard stop:** no signed `REAL_GAS_E2E_PASS` or actual authenticated Network trace ⇒ `P0_A=NO_GO`, even when GitHub CI and simulated browser pass. Absolutely no production release, score writes or parent ledger. Rollback: disable/revoke isolated TEST deployment; return to independently recorded pinned SHA; never overwrite production GAS.
