# P1.4-B — Cross-Branch Canonical Reconciliation & Safe Integration Ledger
Date 2026-11-19 | Target: `be-hoc` | Status: `SOURCE_RECONCILED_PARTIAL · TEST_ONLY · LIVE_PENDING · NO_PRODUCTION_RELEASE`

## Commit boundary and no-loss rule
- Original be-hoc baseline `59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff`.
- UX regressions reconciled and merged by PR #10 at `bca2613155b711e047db8b8fb9e908a3e8ec7f9e`. Unit CI verified green at PR commit `06e94a9a89e0ea54d2f6ef03de314f4d1a659223`. REAL GAS and pixel-perfect owner/device review are separate.
- P1.3-C.3 direct-verification source commit `9da26587c59c4df769ba95e5e46fd15965454d3b`; Git tree `606b21931773c2bce67d133d12333a5148eb72bf` compared byte-for-byte by blob SHA against old be-hoc HEAD: **329 new paths, one modified path (GiaoDien.html), 0 deletions**. New paths: 264 PNG, 57 QA/evidence, 5 CI workflows, 3 runtime TEST-only modules.
- New integration is **source-only**: 288 PNG MASTER total (24 previous + 264 new), existing 332 WebP preserved, all existing 30 characters, Fluent, D1-D10, scoring/UI/lesson files preserved. Only template addition is a server-side gated C.2 sidecar. No flags enabled.
- Master integration must run P1.4 UX, P1.3 A/B/C/C1/C2/C3 and be-hoc orchestrator tests together. PR staging branch can be discarded independently; revert the merge commit if post-merge defect.

## Decision table: 19-domain source-of-truth ledger
Grounded in `audit/p1-1-source-of-truth-ledger-20261118/qa/p1-1/SOURCE_OF_TRUTH_LEDGER_19.review.v1.json`, status `REVIEW_CANDIDATE_RECONCILED_NOT_OWNER_LOCKED`. The source ledger reviewed 129 branch heads, not every source byte or all chat transcripts. No source below is globally promoted beyond its recorded scope.

| Domain | Previously supported decision | Integration into be-hoc now |
|---|---|---|
| MAIN | historic code baseline, not live attested | PRESERVE, never modify |
| test-theo-main UI | owner visual reference | PRESERVE shell; targeted UI restoration PR #10 |
| be-hoc orchestrator/assets | technical source and CI within limits | PRESERVE old modules and loader; add gated source assets |
| B061/B062 owner V8 | corrected owner metadata only | REFERENCE, do not resurrect 65 resolved mismatches |
| 75 lesson source | 1,406 candidate records, 0/75 independently exact | REFERENCE ONLY |
| C1 JSON | 1,406 envelopes owner-approved for C1/readback | KEEP EXTERNAL; no authorization to render |
| C4 DEV | 27 DEV items technical QA | REFERENCE ONLY, no student grade |
| B20 pedagogy H.2 | 30 owner-approved questions, scope-specific | PRESERVE decision, not same as 51 legacy rows |
| B20 legacy Sheet | 51 runtime rows; client answer exposure and open sharing noted | EXISTING ONLY; no migration/production privilege |
| P0.6 F-C.4 | isolated technical TEST closed | PRESERVE technical acceptance |
| G7.4 renderer manifest | 12 reference items for 10 families | PRESERVE existing D1-D10 registry, require real lesson approval |
| G7.5 voices | V1.2 stable and V2 dynamic owner-approved | KEEP TTS engine/theory; remove mental card listen only |
| G7.6 C07-C09/E04 | 0/6 signed decision packets | DENY unsolicited curriculum route |
| G7.3/G7.4 labels | 288/288 image LABEL-approved | KEEP current WebP pins; exact-count still policy-gated |
| G3A trusted grader | 39/39 isolated PASS, no GAS live | TEST REFERENCE, never promote private answers |
| G2-B 96 | review queue, 0/96 independent signed | DENY source exact |
| B024 alpha | DEV candidate | DENY student release |
| DATA CONTRACT V2 | proposed, not production | REFERENCE |
| PROJECT RULES global | candidate, 0/10 owner adoption | DO NOT silently supersede policy |

## Additional later checkpoints
- P1.2-A `P1_2_QA_CHECKPOINT_20261118.json`: 24/24 layered structures and crosswalk PASS, **0 student-playable**, 0 approved publicVariant, 41 renderer candidate routes DENY. Not imported into active runtime; require dedicated fail-closed data archival gate.
- P1.2-B `P12B_B001_B004_SOURCE_VARIANT_DEEP_QA_REPORT_20261118.md`: 27 C4 DEV, 52 source items still missing content, 32 original variants DEV preview, 0 student-approved. Do not merge experimental data generator into runtime.
- P1.3-B.3 `P1_3_B3_FINAL_GOVERNANCE_APPROVAL_CLOSURE_20261119.md`: technical governance PASS but decorative-only restrictions; no new semantic permission, 35/35 character sources PASS.
- P1.3-C.2 `P1_3_C2_GAS_TEST_CONTROLLED_INTEGRATION_DEVICE_QA_20261119.md`: source integration and 48 Chromium checks PASS, **LIVE NOT EXECUTED**.
- P1.3-C.3 dry-run `P1_3_C3_LIVE_GAS_TEST_ACCEPTANCE_ROLLBACK_20261119.md`: simulated OFF->ON->OFF PASS, real deploy not executed. Direct verification `P1_3_C3_DIRECT_LIVE_ENDPOINT_ATTEMPT_20261119.md` remains `LIVE_BLOCKED`.
- P1.4 UX PR #10: unit PASS; visual owner acceptance / actual GAS still distinct.

## Runtime controls and hard NO-GO
The new `P13_C2_CauHinhTEST.gs` condition requires three server Script Properties:
- `LOP2_ENVIRONMENT=GAS_TEST`
- `P13_C2_UNIFIED_RESOLVER=ENABLED`
- `P13_C2_OWNER_TEST_APPROVAL=APPROVED_FOR_GAS_TEST`

If any one is missing or environment is PRODUCTION, C.2 JS is **not included**. The bridge never patches `83_Visual_Orchestrator.html`, changes the actual `mountLesson`, or enables trusted grading. Old B20 UI/achievement semantics and B01-B24 source authorizations unchanged. No GAS project, student Sheet, property or deployed /exec changed by source merge.

## Explicit QA acceptance gates
1. Git tree no deletion, 329 + 1 exact incoming SHA, previous P1.4 UX files unchanged (SOURCE_DIFF_GUARD).
2. `qa/be-hoc-ui/test_p1_4_ux_regression.cjs`; `qa/be-hoc-tts-v2/tts-v2.test.cjs`.
3. `qa/be-hoc-orchestrator/{orchestrator-contract,fluent-46,semantic-character-contract,structured-auto-binding,structured-source-ingestion,drive-png-master-pins}.test.cjs`.
4. `qa/p1-3/test_png_master_288.cjs`, `test_p1_3_b_characters.cjs`, `test_p1_3_b2_governance.cjs`, `test_p1_3_c_unified_resolver.cjs`, `test_p1_3_c1_fluent_hardening.cjs`, `test_p1_3_c2_gas_gate.cjs`, `test_p1_3_c3_rollback_drill.cjs`.
5. Offline desktop/mobile Chromium including OFF/ON and no layout regressions; NOT LIVE.
6. Human visual/functional B20 and real isolated GAS TEST OFF/ON/OFF evidence before any LIVE_PASS.
7. No MAIN/production deployment without separate release approval.

## Remaining blockers
- P1.2 data schema/source authorization: 24 structural packages are not 24 playable lessons.
- Trusted GAS grading/session and server authority remain independently gated, no client answer leakage authorized.
- Exact deployed GAS script ID, version, Git commit mapping and isolated spreadsheet/script properties not verified.
- No exhaustive read of all Drive files or all historic chat transcripts is claimed. Further entries need path+SHA+scope+QA evidence and explicit reconciliation.

## Rollback
Integration source commit parent is be-hoc `bca2613155b711e047db8b8fb9e908a3e8ec7f9e`. Before merging record new PR/merge commit; rollback only the new source-only commit or revert its merge, **never hard-reset be-hoc or delete the pinned assets**, and do not overwrite earlier owner-approved reference branches. GAS is untouched, thus no runtime deployment rollback was performed.
