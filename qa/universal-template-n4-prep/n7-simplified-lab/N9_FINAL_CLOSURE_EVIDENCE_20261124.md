# N9 FINAL CLOSURE — Disposable Synthetic Restore Evidence

Date: 2026-11-24 (Asia/Ho_Chi_Minh)
Scope: **LAB disposable clone ONLY. No governed TEST, MAIN, learner or existing N7 journal modifications.**
Verdict: **REAL_SINGLE_CELL_RESTORE_READBACK_PASS / INDEPENDENT_QA_UNSIGNED / N9_FULL_CLOSURE_NO_GO**.

## Locked restore plan (SHA-256)

Canonical plan encoding: JSON, UTF-8, no spaces, ordered keys exactly as shown below (Python `json.dumps(...,ensure_ascii=False,separators=(',',':'))`).

```json
{"schema":"N9_FINAL_DISPOSABLE_RESTORE_PLAN_V1","date":"2026-11-24","environment":"LAB_DISPOSABLE_SYNTHETIC","source_backup_id":"1iomsoeXTLEmpRjqzf5v6WiU1ea4CE5EbipTenfPSyw8","test_target_id":"1Q3X8sYSNdWmO2p88ZlaEnMneYtKO52sT06FhfHXjjuw","tab":"15_NhatKy_HanhDong","cell":"F3","initial_value":"PENDING_INDEPENDENT_REVIEW","injected_value":"N9_SYNTHETIC_FAULT_INJECTED_DISPOSABLE_ONLY","restored_value":"PENDING_INDEPENDENT_REVIEW","verification_range":"A1:H6","preserve_id":"N7_LAB_N7_KEY_001","expected_status":"READBACK_MATCH_PREWRITE_BACKUP","release":false}
```

**Plan SHA-256**: `0e291c5888d649d5b4e68c7504bd3aeb9e88493b27d7c54a4e0cd77778a0394b`.

## Executed evidence (Google Sheets provider, not mock)

- Immutable before-image reference: [prewrite backup](https://docs.google.com/spreadsheets/d/1iomsoeXTLEmpRjqzf5v6WiU1ea4CE5EbipTenfPSyw8/edit), journal A1:H3 with 2 synthetic events.
- Target: [N9 disposable clone](https://docs.google.com/spreadsheets/d/1Q3X8sYSNdWmO2p88ZlaEnMneYtKO52sT06FhfHXjjuw/edit), created from this backup. Target ID confirmed **distinct** from backed-up and accepted live IDs.
- Fault injection: `15_NhatKy_HanhDong!F3` from `PENDING_INDEPENDENT_REVIEW` to `N9_SYNTHETIC_FAULT_INJECTED_DISPOSABLE_ONLY` via a native Google Sheets `updateCells` call; direct readback confirmed the injected value.
- Restore: `F3` set back to exactly `PENDING_INDEPENDENT_REVIEW` via another provider `updateCells` call; direct readback confirmed.
- Final verification: entire `15_NhatKy_HanhDong!A1:H6` on disposable clone compared equal to the same range on original prewrite backup, including headers and 2 events. This verifies one-cell restore **only**, not multi-tab atomic rollback.
- Re-read accepted isolated TEST: 3 events, row4 `N7_LAB_N7_KEY_001` intact, row5 blank. No changes to source, backup, accepted N7 journal, release pointer, or student app.
- Technical regression baseline: [N7–N9 CI 74/74 PASS](https://github.com/Nguyennth19/new-lop-2/actions/runs/45245065665), prior HEAD `08cc965715353dc30d30a7e4c32a3f33357a1f37`.

## Governance and closure decision

- **Technical restore proof**: ACCEPTED for single-cell synthetic disposable clone, exact provider readback.
- **No claim** of transaction-wide rollback, remote atomic CAS, append-only compensation execution, or real recovery of the accepted N7 journal.
- **Owner separate rollback authorization and independent human QA endorsement**: not present / not verified. The instruction to run the N9 phase does not stand in for an independently signed QA artifact.
- **Tab `16_Rollback` of accepted isolated TEST**: intentionally unchanged, header-only; cannot invent `owner_signed_ref`, `qa_signed_ref`, or type an `APPROVED` cell to certify.
- **Decision**: `N9_REAL_DISPOSABLE_RESTORE_SCOPED_PASS`; `N9_FULL_CLOSURE_PENDING_INDEPENDENT_QA`; `N9_WRITE_OFF`; `RELEASE_NO_GO`.
- Close N9 FULL only after independent QA verifies this exact plan SHA, original backup and disposable target, confirms result in their own authenticated review, and the appropriate Owner records an explicit acceptance of the **bounded** restore scope. If governance requires a full journal-level compensating rollback, that additionally remains OPEN and requires separate scoped approval.
- No new deployment, no grant to existing N7 GAS, no production promotion, no schema expansion.
