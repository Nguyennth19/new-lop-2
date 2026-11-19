# P1.3-B — Character asset provenance & semantic control (2026-11-19)

## Inherited immutable baseline
- P1.3-A PASS checkpoint: `eb3fef5504f39935d16a0e9d3ad400fd0066fc61`.
- 288 PNG MASTER SHA-256 aggregate Drive pin is tested unchanged in P1.3-B CI.
- 332 original `be-hoc` WebP files must remain identical (path and Git blob SHA).
- Renderer, app UI, image router, public asset choices, deployed GAS and manifest MAIN are out of scope.

## P1.3-B limited audit scope
- 30 character WebP pose files: robot 6, boy home 6, boy school 6, girl home 6, girl school 6.
- 5 character PNG source sheets.
- Existing GitHub source manifest: `qa/p1-3/P1_3_CHARACTERS_30_SOURCE_MANIFEST.review.v1.json`.
- Validate 35 image signatures, file lengths, Git blob pins and derive independently reproducible GitHub-side SHA-256 inventory.
- Enforce policy: character pictures are **DECORATIVE**, `countSafe=false`, `quantityApproved=false`. Do not expose characters as exact count/choice answers.
- Character group `v1.0.0` and correction `v1.0.1` inventory is not evidence that these are the same bytes as `KL2_*_v1.webp`.

## Source reconciliation: BLOCKED / NOT VERIFIED
- Source folder reference from character manifest: `1FZtiDtMTalwfbTAkzBM6lPUpg4YA8V73`.
- Live Drive folder listing returned **0 items**. Search for `KL2_ROBOT_01_STAND` returned no matching source.
- A separate older inventory, `tai-lieu/CHARACTERS_ROBOT_BOY_GIRL_INVENTORY.csv`, lists different `KL_*_v1.0.0` and `v1.0.1` assets. These cannot be substituted automatically for the current `KL2_*_v1` assets.
- No independent SHA-256 Drive ↔ GitHub 35/35 assertion is permitted without verified exact source files and IDs.
- Legacy manifest `qaStatus=BINARY_QA_PENDING_RUN` describes its own outdated snapshot; new validation records are separate and do not silently rewrite historical review data.

## Gates
1. GitHub binary 35/35 and P1.3-A regression CI PASS -> **PARTIAL_PASS** for P1.3-B.
2. Ground exact 30 WebP and 5 PNG source IDs in Drive or original source package; compute SHA-256 on bytes from both platforms.
3. Publish row-level Drive ID / source version / Git SHA-1 / SHA-256 / format / dimensions / alpha / semantic eligibility / QA evidence manifest.
4. Confirm which legacy v1.0.0/v1.0.1 items are archival versus approved active references through explicit mapping and owner review.
5. Only after 35/35 independently reconciled and evidence complete can P1.3-B close PASS. Separate approval required for any integration or release.

## Rollback
Delete only P1.3-B audit commits or reset B branch to inherited baseline; never mutate the P1.3-A PASS branch. Production remains NO-GO in this audit.
