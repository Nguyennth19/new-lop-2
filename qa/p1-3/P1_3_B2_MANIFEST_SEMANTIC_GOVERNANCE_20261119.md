# P1.3-B.2 — Character Manifest & Semantic Governance (2026-11-19)

## Scope and inherited PASS
- Base B.1 checkpoint: `c17be322960f01ab7417d1e1ecc685eb7de141ac`; separate audit branch only.
- Binary reconciliation for 30 WebP + 5 PNG source sheets: PASS, independently sourced from Drive and compared to GitHub SHA-256, preserved unchanged.
- New versioned governance manifest: `qa/p1-3/P1_3_B2_CHARACTERS_MANIFEST.v2.json`, 30 runtime decorative poses and 5 non-runtime source sheets.
- Original review manifest `qa/p1-3/P1_3_CHARACTERS_30_SOURCE_MANIFEST.review.v1.json` is **immutable historical evidence**, including its original `BINARY_QA_PENDING_RUN` snapshot. Current status must be read from B.2 manifest, **not** misrepresented as historical approval.

## Governance contract
- All 30 current `KL2_*` character IDs: `role=DECORATIVE`, `countSafe=false`, `choiceEligible=false`, `quantityApproved=false`.
- Exactly 30 decorative calls through existing semantic router are allowed; `CHOICE` and `EXACT_COUNT` are denied for all 30.
- Legacy `KL_*_v1.0.0` and `v1.0.1` names are not automatic aliases for current `KL2_*`.
- All 5 source sheets have `runtimeEligible=false`.
- Existing runtime reference is preserved, not rewritten; no new permissions or new app placements are inferred.
- Source QA `PASS_35_OF_35` **does not imply** image/semantic owner approval; `studentRelease=NO_GO`.

## CI and regression
- `node qa/p1-3/test_png_master_288.cjs`: inherited P1.3-A source pin.
- `node qa/p1-3/test_p1_3_b_characters.cjs`: B.1 35 asset binary and SHA-256 aggregate pin.
- `node qa/p1-3/test_characters_30.cjs`: existing character image checks.
- `node qa/p1-3/test_p1_3_b2_governance.cjs`: B.2 manifest, Drive IDs, blob immutability, 30 decorative allows, 60 fail-closed rejections and legacy rejects.

## Acceptance boundaries
- B.2 technical governance can PASS independently of separate human approvals for adding/changing actual public character placement.
- Do not change `87_Characters_Drive_30.html`, `88_Visual_Semantic_Router.html`, UI, CSS, existing WebP or PNG, main manifest or production.
- Any future proposal to change the visual owner's labels, public routing or student release must be a separate signed decision and new tests; no implicit GO.
- Rollback consists solely of reverting the B.2 audit commits; B.1 and P1.3-A remain intact.
