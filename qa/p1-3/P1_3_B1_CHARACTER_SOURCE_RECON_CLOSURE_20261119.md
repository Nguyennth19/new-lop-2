# P1.3-B.1 — Character Source Reconciliation Closure (2026-11-19)

## Decision
**PASS — independent binary provenance for 30 current character WebP and 5 current character PNG source sheets.** No release or renderer approval implied.

## Authoritative source discovery
- Initial manifest folder `1FZtiDtMTalwfbTAkzBM6lPUpg4YA8V73` enumerated empty. Exact-name metadata lookup using Drive filter `name contains 'KL2_'` located 35 current source assets spread across character-group `webp` and `source_sheets` folders.
- Per-asset unique Drive IDs: `qa/p1-3/drive-character-source-pins.v1.json`.
- Each of 35 original files was downloaded from Drive as raw binary through authenticated Google Drive access.
- Comparison target: separate GitHub Actions run `44453919909` artifact `p1-3-b-character-github-sha256` generated from checked-out GitHub repository bytes.
- Independent per-file SHA-256 and independently computed Git blob SHA-1 compared against GitHub artifact + immutable GitHub manifest.

## Verification
| Test | Outcome |
| --- | --- |
| Character WebP sources | 30/30 PASS |
| PNG source sheets | 5/5 PASS |
| File lengths Drive vs GitHub | 35/35 MATCH |
| SHA-256 Drive vs GitHub | 35/35 MATCH |
| Git blob SHA-1 Drive vs GitHub | 35/35 MATCH |
| Independent source hash aggregate | `bb51a57de383331217588693f73e8b8ec059e345fc1ea2eb14b025664086f9d4` |
| Source total bytes | 10,076,719 |
| CI independent aggregate pin verification | PASS |

- Root algorithm: `SHA256(UTF8(concat(sorted filename + TAB + lower-case sha256 + LF)))`, exact-case filename order.
- Independent row reconciliation exported separately as `P1_3_B1_CHARACTER_35_SHA256_RECON_20261119.json` and `.csv`.
- CI gate: `node qa/p1-3/test_p1_3_b_characters.cjs`.
- CI run: https://github.com/Nguyennth19/new-lop-2/actions/runs/44456328735

## Version distinction — do not conflate
1. **Current reference**: 30 `KL2_*_v1.webp` + 5 `KL2_*_SOURCE_SHEET_v1.png` — exact Drive and GitHub binary identity verified.
2. **Archive v1.0.0**: 30 `KL_*_v1.0.0.webp` in Drive `02_WEBP_DELIVERY`, folder ID `1wNvA2VWIfl9lghkaAi_MMcstLpj67E3D`. This is a different naming/versioning series with different per-image byte sizes and must not be substituted into current `KL2` references.
3. **Correction v1.0.1**: separate `01_CORRECTED_PNG_WEBP` folder `1rDSvX8Li9Mw_8wfLVAcbhInrbt-U8zys`, with legacy corrected files; not approved as replacements for `KL2_...`.
4. **Source sheet lineage**: five legacy `SOURCE_*_v1.0.0.png` files in Drive `00_SOURCE_SHEETS` were independently downloaded and their Git blob SHA-1 values matched the five current GitHub source sheet blobs. Their filenames and folder locations differ but source bytes are identical. Current `KL2_...SOURCE_SHEET_v1.png` Drive IDs are preserved as canonical assets in the new pins manifest.

## Preserved safety and policy
- Original P1.3-A base: `eb3fef5504f39935d16a0e9d3ad400fd0066fc61`.
- No existing images rewritten, including 288 PNG MASTER and 332 WebP.
- Character role remains `DECORATIVE`; `countSafe=false`, `quantityApproved=false`.
- `studentRelease=NO_GO` remains unchanged. P1.3-B.1 source reconciliation PASS does not imply general P1.3-B policy or integration approval.
- Rollback: revert only P1.3-B commits on its separate audit branch.

## Remaining P1.3-B closure boundary
- Reconcile any legacy character QA-status metadata in a new manifest revision rather than silently rewriting the historic review snapshot.
- Obtain explicit owner approval for semantic roles and any intended public routing or UI placement. Do not reapprove visuals or turn decorative characters into count-safe assets automatically.
