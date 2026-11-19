# LỚP 2 — Global Deep Research & Hard QA/QC / Canonical `be-hoc`
**Report:** `R03 SOURCE-PARITY & RUNTIME WIRING AUDIT` · **Date:** 2026-11-19 · **Decision:** `PARTIAL_INTEGRATION · SOURCE_PARITY_PASS_IN_SCOPE · INTEGRATION_GAPS_REMAIN · OWNER_VISUAL_PENDING · LIVE_BLOCKED · RELEASE_NO_GO`

> This is a **verified partial checkpoint** of a larger global audit, not the false assertion that every asset, branch commit and past chat has been read. This report does not change any source app, actual GAS project, learner spreadsheet or owner approval.

## A. Sources, provenance and priority

- **Target protected by frozen SHA:** `Nguyennth19/new-lop-2/be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`, Git source snapshot. `be-hoc` is not branch-protected; therefore the audit branch is deliberately separate.
- **Mandatory rules read entirely:** `AGENTS.md`, both `universal_ai_coding_guidelines` (VI/EN), and `PROJECT_INSTRUCTIONS_CHATGPT.md`. Rules are authoritative for all audit decisions: don't assume, YAGNI/reuse existing, surgical-only, explicit before/after criteria.
- **GitHub inventory:** `BRANCH_HEAD_INVENTORY_20261119.json`: 148 branch names + full HEAD hashes discovered from both pages. Only key independent source trees actually read; listing metadata ≠ deep source verification. Full historical commit and QA reconstruction not complete.
- **Original frozen 10-type HTML:** SHA256 `78998d2c3968686973cc5f0ed9a02d04606430431bca789154b74fde13de3ced` from G7.4 original, stored as reference in independent TEST branch `qa/g7-4-column-calc-reference-v1/advanced-source/Original_10Forms_Grade2_20261113.html`; external prototype ≠ authorized change to current learner UI.
- **UI owner baseline:** `test-theo-main@f51a12cc07b44f0f893c2e0de40e387cc17b5c3b`; four CSS blobs 01/02/03/04 match `be-hoc` byte-for-byte. No pixel parity comparison of actual GAS done.
- **Independent renderer and user evidence:** G7.4 C3, D2, D10 standalone; G7.6 B4.1/B5A/B5B/B5C, read directly from named source GitHub branches and Drive reports. Owner B5A 15/15 interaction and B5B sound "ok" are preserved **within those scopes**, no educational producer/GAS approval implied.
- **Asset policy:** owner-locked `KIDLEARN_2D_STORYBOOK_STYLE_LOCK_V3.md` (Drive ID `19AB83QfYiSDEHuyfCZVY0FcnMtJgp9JT`), G7.4 visual orchestrator appendix (Drive ID `1ieoithvbTQr6X0iaLDYdd2OeQdnCo-GV`) and G7.6 manifest/registries. 288 approved labels ≠ accurate semantic count for all lessons.
- **Live Sheets:** Google Sheet B20 `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` (01/02/03/04 actual headers inspected); B001–B024 V7 R05 `1bypzbcK8supU4A3GdbqjUe7jOSy6butgKlFPypWneUA` 13_BAN_GIAO inspected. Later V7.0.3/R07 mentioned by owner, not accessible in audit source this session and **not replaced by R05**.
- **Drive coverage:** project folder 44 visible direct items and 4 child folders inspected; `LOP-2-NEW` curriculum/QA, `KIDLEARN_ASSET_LIBRARY` releases/styles/12 math and 12 shared categories found, but no false claim of all nested assets' binary inspection. Current GAS project/deployment ID/properties/auth/browser not accessible. Full inaccessible chat history/Gemini transcripts NOT_VERIFIED.

## B. Canonical Feature Acceptance Matrix

Machine/source-auditable document: `qa/canonical-reconciliation/CANONICAL_FEATURE_ACCEPTANCE_MATRIX_20261119.md`. Each row identifies approved-in-scope reference, byte-checked app source, current wiring/loader behavior, curriculum, security and release gates. Original frozen DEMO is not automatically authorized as active production UI. The matrix separates:

`SOURCE_PRESENT → SCRIPT_LOADED → RUNTIME_WIRED → APPROVED_PARITY_TESTED → OWNER_ACCEPTED → LIVE_GAS_VERIFIED → RELEASE_APPROVED`.

**High-priority findings:**

| Severity | Feature | Exact source observation | Correct decision |
|---|---|---|---|
| P0 security | Grading/answers | `KhoBaiHoc.gs` serializes `answer` to public question object; `26_ChamCauHoiToan.html` compares `q.answer` client-side | No new grade/student release until trusted server contract and independent GAS E2E |
| P1 integration | D2 V1.2 | Byte-frozen D2 core/view present; `19_KhongGianHocToan` removed `mountB20` invocation while `83_Visual_Orchestrator` explicitly skips D2 expecting that host | Identify already-approved inline arrangement before surgical fix; **never revive extra accordion by assumption** |
| P1 integration | B20 data→12 renderer routes | Sheet `04_Cau_hoi` has no `renderer_id/skill_id/visual_intent/public_variant_json`, `01_Bai_hoc` has no `visual_renderer_policy_json`; loader and orchestrator require these for advanced routing | Preserve legacy B20; contract/curriculum QA before introducing new fields or variants |
| P1 integration | Word V1.1 | D10 core and adapter source blobs are present but new scaffold needs approved variant/envelope. B20 legacy word UI and inputs are present | Do not claim V1.1 scaffold is active based on loader alone |
| P1 source content | B001–B024 | 24 V1 and 24 V2 structural packages present; studentPlayable=0; V7 R05 64/384 prompts with 4 oracle mismatches and author-fixed issues not independent QA | PRIVATE REVIEW, no automatic publish/lesson activation |
| P2 rollout | D5/D9, D8A/D8B | Sources present and relevant standalone technical QA PASS; E04 and per-asset semantics pending | Keep standalone LAB; no unapproved lesson mapping |
| P2 live | Unified resolver | P1.3-C3 source exists but GAS TEST flag default OFF; true versioned deployment and rollback absent | LIVE_BLOCKED; do not enable until isolated TEST attested |
| P2 visual | B20 3-line summary & UI | New P1.4 source test checks literal separator, not owner-provided screenshot parity; 4 core CSS blobs same as old UI | OWNER_VISUAL_PARITY_PENDING; preserve current without reinventing |

## C. Canonical Source / Asset / Data Manifest

`qa/canonical-reconciliation/CANONICAL_SOURCE_ASSET_DATA_MANIFEST_20261119.json` contains **18 pinned entries** (source reference/commit or Drive ID, current path, exact blob or evidence scope, source status, runtime gate, decision). Do not use number of entered items as full-project coverage. Some references are QA/LAB-only by design.

Examples of **byte-identical, not missing** sources:
- D2 V1.2 `47_D2V12_Core` `16ae440618...` and `48_D2V12_View` `214b615d0c...`.
- D8A V1.2 `78_D8A_View` `865dcf673...`.
- D10 V1.1 `80_D10_Core` `0e82f85...` and `81_D10_Adapter` `dcbc9a798...`.
- Tangram B5A `54_Tangram_V12` `2c768bbe...`.
- G7.5 TTS V2 `44_G75_NormalizerToanV2` `605a8ed9...`.
- 332 existing WebP historical Git blobs and 288 PNG MASTER reported intact by previous HEAD checks; no new binary reinspection this checkpoint.

## D. Gap & Regression Report

**Root cause:** Past P1.4 relied on file/sha/CI existence and test expectations edited for the new UX; it did not prove actual equivalence between owner-approved standalone/demo and integrated learner card on real GAS. Critical route mismatch at D2 and missing B20 visual contract demonstrate this explicitly.

**No speculative remediation:** Current owner disallows two extra D2/SVG accordion sections in B20 cards. Auto-restoring `mountB20` would recreate an approved-to-remove regression; fixing by suppressing the standalone source is also unauthorized. Correct work must first pin owner-approved inline arrangement and exact before/after equivalence.

**Historical PASS not downgraded:** P0.6 F-C.4 technical closure, G7.5 V1.2/V2 TTS, G7.6 B5A 15/15 user test, B5B owner's audible OK, 288 approved labels preserved in own scopes. E04, official mental renderer, source exact and LIVE release remain separate.

**No duplicate or false data counts:** 119 D2 V1.3 / 239 D8A / 191 D10 V1.1 / 298 Tangram / 306 B5B reference QA/doc paths absent in be-hoc each came from overlapping historical trees; NOT a sum or proof missing features, and many underlying exact source blobs already preserved.

## E. QA execution and source parity

- Original be-hoc commit `1b69e277f8de6cb156f46a1d85af33bdad70c0ef` remains frozen and unchanged by audit branch.
- New `qa/canonical-reconciliation/test_frozen_reference_source_parity.cjs` verifies 11 independent Git blob pins and forbids changes outside audit-only paths.
- First CI `44479378714` FAIL because one character was incorrectly copied in expected `04_CSS_LoTrinh` Git blob. GitHub job log established actual SHA `56cafa2ed86f3d7bfa850ed7aa80d061159a8caa`, same as independently fetched test-theo-main and be-hoc. The **audit fixture, not app source**, was corrected in `0c546bfb45bb65a2fb839f593a705a06764e90a1`; failure preserved.
- Rerun `44479523767` SUCCESS; latest `44479681841` SUCCESS on `670dbf6eca071fddda606797d4bd805ad9208faa`. Workflow source parity, B20 UX/TTS, orchestrator/asset fail-closed, 24 JSON schema checks completed SUCCESS. This does **not** prove functional owner parity.
- Full browser comparison to owner-approved reference, LIVE GAS TEST, physical device audio, synthetic trusted grading and private-data boundary remain **NOT_TESTED** in this audit. Do not replace with offline mock results.

## F. Checkpoint and rollback

- Pre-audit source checkpoint `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef` intact.
- Dedicated `audit/global-canonical-reconciliation-20261119` branch, output only under `qa/canonical-reconciliation/` plus isolated NO DEPLOY GitHub workflow.
- Append-only real-time log `qa/canonical-reconciliation/EXECUTION_LOG_20261119.md`: checkpoints R00–R03 and all source/CI/decision boundaries.
- Branch inventory `BRANCH_HEAD_INVENTORY_20261119.json`: 148 names+SHAs with `HEAD_METADATA_ONLY`.
- Rollback this research alone: discard audit branch; **do not reset, cherry-pick wholesale, or delete owner-approved histories**.
- No pull request to alter `be-hoc` was merged or opened in this research stage. No Script Properties, GAS deployment, Drive/Sheet/score changes.

## G. Remaining Blockers and next safe action

1. **AUTHORITATIVE_OWNER_VISUAL_REFERENCE:** locate exact screenshots/standalone owner-approved source for D2 inline/B20, 10 types and 3 levels; independent browser A/B after choosing source. Can't claim parity until actual DOM and visuals compared.
2. **D2_WIRING_CONTRACT:** preserve legacy vertical and no extra accordions; examine best approved host pattern and design minimal integration diff with independent test before activating.
3. **B20_RENDERER_DATA_CONTRACT:** require correct `lessonId/skillId/visualIntent/publicVariant` with legitimate provenance and curriculum approval. No fabricated columns or questions.
4. **TRUSTED_SERVER_GRADING:** private answers remain exposed by legacy pathway, pilot G3A doesn't supply real GAS authority. Separate security E2E/synthetic session and migration policy.
5. **B001_B024_R07_SOURCE:** later file cited in another project chat is not directly available in current Drive/Library search. Must reopen exact original R07 and private validator before promoting.
6. **GAS_TEST_SOURCE_PROVENANCE:** verify TEST script ID, version, actual isolated Sheet/Script Properties and OFF→ON→OFF; cannot infer from /exec URL.
7. **FULL_DRIVE_BINARY_AND_CHAT_AUDIT:** nested folders and inaccessible conversations/third-party artifacts need review, as allowed by actual access; don't assert 100% coverage.

**Decision now:** `SOURCE_REFERENCE_PARITY_PASS` for tested subset; `OWNER_VISUAL/INTEGRATION/LIVE PENDING`, `RELEASE_NO_GO`. **No corrective merge into be-hoc justified yet** because changing the host now would risk recreating exactly the unauthorized UI regression the owner reported. Proceed by pinning the *approved target behavior* with side-by-side proof and then surgical staging.
