# P1.4 – Be-hoc canonical integration ledger (work-in-progress)

Date 2026-11-19 · TARGET be-hoc · BASE_SHA 59187c6fe0e1faadaeaf6f9aa5cacb76861b51ff
Status: PARTIAL SOURCE RECONCILIATION; owner visual acceptance / deployment pending. Not a FULL_ACCEPTED claim.

## Rules
1. be-hoc is the only proposed future integration target for learner app GAS, NOT an unconditional deployment source.
2. Reference modules may remain in named test branches with exact SHA. Import only an approved **file/function** diff with proper source evidence; never merge an entire divergent G7 branch simply because it contains later dates.
3. Earlier owner UX acceptance outranks experimental TEST-only widgets on learner screens, but previously approved standalone renderer capability must not be deleted.
4. Every proposed module must track sourceRef, source SHA, inherited contract, source-data gate, UX acceptance, CI, device QA, live GAS TEST gate and rollback.
5. No TEST feature becomes production merely because CI says PASS; no student grading or data write authorization from these checks.

## Git comparison evidence, using be-hoc as base
| Source branch | Git comparison | Important touched files | Integration decision |
|---|---|---|---|
| main and test-theo-main | historical UX baseline; source diff checked directly | 19_KhongGianHocToan, 41_HienThiCauHoiToan, GiaoDien | retain approved shell; avoid wholesale overwrite |
| test/g7-4-word-problem-unification-v11-20261114 | DIVERGED, ahead 459 / behind 103 | 19,41, old G7 adapter files | contract available in be-hoc 80_D10_Core / 81_D10_Adapter; owner visual diff pending |
| test/g7-5-approved-voice-profiles-20261114 | DIVERGED, ahead 368 / behind 103 | old TTS/lesson files | G75 V2 already present; turn off per-mental-card voice without removing theory/voice engine |
| test/g7-6-resource-renderer-consolidation-v1-20261114 | DIVERGED, ahead 558 / behind 103 | reference manifest, old 19/41 | map renderer-by-renderer; no blind merge |
| test/p0-6-fc-audit-20261114 | DIVERGED, ahead 338 / behind 103 | QA, legacy B20 integration | technical-TEST closure inherited with exclusions |
| test/p1-2-b001-b024-layered-lesson-packages-20261118 | AHEAD of be-hoc 49 commits / behind 0 | 83_Visual_Orchestrator, 89_P0_VariantRouter, 90_P0_VectorStructural, B001–B024 JSON | requires dedicated data/schema/security integration gate; do NOT silently replace B20 Sheet |
| audit/p1-3-c2-gas-test-flag-deviceqa-20261119 | AHEAD of be-hoc 88 commits / behind 0 | 89_Asset_Unified_Resolver_TEST, 90_C2_Test_Integration_Bridge, P13_C2_CauHinhTEST.gs, GiaoDien | flag-default-OFF, isolated TEST only, main release NO-GO |
| audit/p1-3-c3-live-gas-acceptance-20261119 | AHEAD of be-hoc 92 commits / behind 0 | same C2 integration plus C3 QA evidence | offline simulation PASS; real live endpoint confirmation pending |

Git 'ahead' means branch ancestry/difference, NOT an approval or proof that all files are ready.

## P1.4 first UX patch (draft PR #10)
- 19_KhongGianHocToan.html: remove automatic insertion of extra D2 TEST and place-value SVG accordions; standalone implementation files unchanged.
- 41_HienThiCauHoiToan.html: remove speech button appended within mental rows; no deletion of G75 TTS engine or theory button.
- 41 + 43_CSS_ThanhPhanBaiToan: render B20 Sheet summary facts separated by `|` or newlines on individual escaped lines. Source `04_Cau_hoi.summary` still unchanged.
- qa/be-hoc-ui/test_p1_4_ux_regression.cjs + qa/be-hoc-tts-v2/tts-v2.test.cjs: regression expectations.
- CI workflow no deploy. No main, be-hoc or GAS changes until gates are met.

## Gates before this patch merges to be-hoc
- G1 source and diff review, including all dependent UI variants; PENDING
- G2 CI unit PASS on final commit; PENDING
- G3 owner-approved visual desktop/mobile LV1/LV2/LV3 (including summary); PENDING
- G4 no regression to old authorized scoring and save/progress; PENDING
- G5 explicit approval to integrate this UX patch into be-hoc; PENDING

## Gates before claiming be-hoc fully consolidated
- Complete module inventory from all known branches and Drive evidence with ownership/QA for every app-relevant decision.
- Reconcile B001–B024 layered lesson packages, content source/skill IDs, legacy B20 and new JSON contracts.
- Reconcile P1.3-C Unified Asset Resolver flag OFF/ON/OFF with isolated real GAS TEST endpoint.
- Test devices/browser, loader, TTS, 10 renderer families, images, trusted grading, privacy, performance, rollback.
- Verify GAS deployment SHA/version and spreadsheet override independently.
- Only then record FULL_ACCEPTED with owner sign-off. MAIN/PRODUCTION has a separate release decision.

## Resume checkpoint
See draft PR #10 against be-hoc. Before further work read latest be-hoc head, PR head, CI status, and this ledger; never equate a historic QA PASS with live deployment acceptance.
