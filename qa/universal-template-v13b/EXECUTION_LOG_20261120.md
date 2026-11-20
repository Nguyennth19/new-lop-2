# ULT-V1.3-B — Execution Log & QA Closure (2026-11-20)

**Checkpoint:** `LOP2 – UNIVERSAL LEARNING TEMPLATE V1 · Governed Sheet TEST & Candidate Intake`  
**Branch:** `lab/universal-learning-template-v13b-sheet-test-20261120`  
**Parent:** `ULT-V1.3@7af2dd4d98f9e39989a13b8f9144d3f472df37b2`  
**Status:** `GOVERNED_SHEET_TEST_CREATED · CANDIDATE_INTAKE_QA_PASS · SIGNATURE_PENDING · NO_GO_REAL_RELEASE`

## R01 – Grounding, policy and historical source protection

- Re-opened `ULT-REVIEW-RC01-20261120` (independent critical review) and reconfirmed its key blockers: missing D1 CSS, draft round-trips D1/D2/D10, D5 `SHAPE_SELECT`, D6 `SORT`, D8 `CLOCK`, semantic EXACT_COUNT, client `packTrusted` by object identity, no authenticated real grading.
- The earlier user accepted **V1 LAB UI** only, not the full multi-data/multi-subject production contract. These blockers remain open; V1.3-B does not silently patch frozen renderers.
- Re-read exact JSON contract `qa/universal-template-v13/SHEET_CONTROL_CONTRACT_V1.json` on parent branch; 7 proposed tabs. Reconfirmed original B20 Google Sheet ID `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` and **never called a write action** for it.

## R02 – New native Google Sheets TEST environment

- Created **[Governed Sheet TEST](https://docs.google.com/spreadsheets/d/1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs/edit)** ID `1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs`; confirmed distinct from B20 source.
- Initially created a local seven-tab XLSX with `artifact_tool`; Drive native import action did not accept the provided local input and returned `InvalidActionArgumentsError`. **No duplicate imported Sheet was created.** Then created the native TEST Sheet directly through Google Drive and initialized the seven headers via native `batch_update_spreadsheet`.
- Tabs: `10_DanhMuc_Bai`, `11_YeuCau_Data`, `12_KetQua_Validator`, `13_PheDuyet`, `14_PhienBan_JSON`, `15_NhatKy_HanhDong`, `16_Rollback`. Applied frozen headers, light neutral styling and native dropdown constraints on relevant columns.
- `10_DanhMuc_Bai!A1:H4`: two synthetic LAB lessons, one *source-only* `MATH_B020` registry row. All `release_eligible=FALSE`.
- `11_YeuCau_Data!A1:M3`: `LAB_PILOT_A` and `LAB_PILOT_B`, both D2 `COLUMN_ADD`, LV2, 20 questions, `SYNTHETIC_QA_ONLY`, `REQUESTED`.
- First readback confirmed exact tab names, requests, source statuses and non-empty dropdown metadata. `13_PheDuyet` and `16_Rollback` remain unpopulated.

## R03 – Real native TEST Sheet read receipt

- Read native TEST Sheet via authenticated connected Google Sheets actions (exact ranges `11_YeuCau_Data!A1:M3` and `10_DanhMuc_Bai!A1:H4`) using **FORMULA** render option to detect formula injection.
- Committed **`SHEET_TEST_READ_RECEIPT_20261120.json`** to a separately scoped GitHub TEST branch. Receipt contains actual header + synthetic row values, seven tab names, source ID, read-only mode and no answer/private student fields.
- **IMPORTANT:** This is a point-in-time verified read. GitHub Actions does not have Google Drive credentials, does not poll the Sheet continuously and cannot automatically detect subsequent edits. New Sheet edits require a new connector read receipt and hash validation before reprocessing.
- `governed-intake.cjs` consumes only verified receipt values, enforces exact metadata/header parity, source-catalog matching, no formula injection, `release_eligible=FALSE`, known D2 generator grant, independent public schema/math/source validator, plan SHA, pending owner approval and zero publishing.
- AI model connector is **NOT connected**. `acceptAIProposal` only defines a fail-closed untrusted proposal boundary and rejects AI mode when the Sheet request is deterministic. This does not claim automatic AI generation.

## R04 – GitHub CI QA and dual-pack proof

Two CI run checkpoints were kept to preserve trace:

1. **[CI 44697976391 – PASS](https://github.com/Nguyennth19/new-lop-2/actions/runs/44697976391)**: 2 captured synthetic request rows, 40 generated D2 questions, **76 intake assertions**, inherited V1.3 publisher **93 assertions**, V1.2 grader **138 assertions**, original source 28 modules + 8 CSS parity, 12-renderer baseline **48 browser mounts/interactions**, new-sheet JSON **80 D2 browser mounts/inputs** desktop/mobile. Zero real grading grants or external publishing writes.
2. **[CI 44698212840 – PASS](https://github.com/Nguyennth19/new-lop-2/actions/runs/44698212840)**: rerun with source SHA-256 logging for audit. Artifact `ULT_V13B_GOVERNED_SHEET_TEST_INTAKE_EVIDENCE`, ID `14612170713`, ZIP SHA256 `bef9c29b36b32911a9f27f21eaf053f706267101dd65320b37200ca74f807c72`. Includes candidate JSON A/B, candidate plans, read receipt, validator evidence, event stream and 8 screenshots.

Source content digests (canonical public JSON payload hashes, **not** the ZIP archive digest):
- `LAB_PILOT_A`: `943d502b4de648636009e0b1f357a805463890f338b62fe514a3df318335c2b6`.
- `LAB_PILOT_B`: `f8fe930a6ea63f95a948d31024ec868eea2474f77e9b49a50ea34c3d5b26afce`.

## R05 – TEST-only evidence write-back

After CI PASS, wrote **only** to new TEST Sheet ID `1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs`:

| Tab / cells | Action | Approval semantics |
|---|---|---|
| `12_KetQua_Validator!A2:K3` | 2 receipts, SHA256, CI link, schema/math/skill synthetic-pass, asset N/A, technical reviewer `NOT_HUMAN_REVIEWED` | `PENDING_INDEPENDENT_REVIEW`; **not approved** |
| `14_PhienBan_JSON!A2:I3` | 2 candidate content digests and `sha256-<prefix>` version IDs | `CANDIDATE` only; no staging URI, no manifest activation |
| `15_NhatKy_HanhDong!A2:H3` | 2 QA events, previous/requested to pending review, content SHA and GitHub CI timestamp | append-only intent in TEST; no production event |
| `13_PheDuyet!A1:H1` | **Header only** | No fake owner signature / no delegated approval |
| `16_Rollback!A1:G1` | **Header only** | No ACTIVE release exists to restore |

No external source B20 edits, no `be-hoc` edits, no GAS TEST deployment, no real private grading, no student-playable records, no live AI invocation.

## R06 – Status and handoff

| Acceptance | Status |
|---|---|
| Native isolated TEST Sheet with 7 approved *structural* tab headers | **PASS** |
| Read exact sample request/catalog rows from TEST | **PASS connector read** |
| Snapshot-to-independent-validator-to-JSON | **PASS for synthetic D2 × 40** |
| Client accepts swapped new JSON without renderer modifications | **PASS LAB D2 only** |
| QA writeback to TEST with digest, proof link and audit rows | **PASS TEST** |
| Live automated change detection / reconciliation with Google Sheet | **NOT BUILT** |
| AI Data Builder call, educational source validation for real lessons | **NOT BUILT** |
| Verified human signature + publication CAS/rollback transaction | **NO-GO** |
| Full 10-math-family capability, state round-trip, image count safety | **OPEN per critical review** |
| Google GAS / MAIN / B001–B024 big data | **NO-GO** |

**Next suggested gate:** `ULT-V1.3-C – Signed Candidate Registration & Authenticated Read-only Sync` **only after** resolving owner-reviewed V1 design gaps. Introduce independently verified sheet revision/digest sync, source-approval checks, validated AI candidate admission and a TEST-only authenticated service; keep publishing off until two real approved lessons pass. Do not transform a typed `APPROVED` in Sheet into publication authority.

**Rollback:** discard the V1.3-B branch and archive/ignore the isolated TEST Sheet. The previous LAB V1/V1.2/V1.3 and original B20 Sheet need no restoration because they were not changed.
