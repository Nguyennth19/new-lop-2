# LOP2 – Universal Learning Template · ULT-V1.3

## Sheet → AI candidate → Independent Validator → Versioned JSON → Approval Gate → Manifest / Rollback

**Status: OFFLINE DRY RUN, NO PUBLISH, NO AUTHORIZED STUDENT DATA.**

**Reference frozen:** `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`; LAB V1 owner-accepted at `c7be0c6e003820f775a5ab3332a50622175f65b4`; LAB V1.2 core/grading source at `e74a3505c71b579e662b07991132ccfda3fe6e2e`.

The design explicitly rejects the assumption that a valid JSON file or technically passing question is automatically authorized to appear in a real pupil's lesson.

### 1. Current Google Sheets grounding – READ ONLY

The existing B20 Google Sheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` was inspected through native connected Sheets metadata and narrow header reads on **20 November 2026**. Its existing tabs `01_Bai_hoc`, `02_Cap_do`, `03_Nhom_bai`, `04_Cau_hoi`, `05_Cau_hinh`, `06_Ky_nang_B20`, `06_Anh_xa_Cau_hoi`, and `G24_Cong_Kiem_Dinh` remain untouched. Exact headers are pinned in `SHEET_CONTROL_CONTRACT_V1.json`.

**Safety note:** `04_Cau_hoi` has a column `answer` (plus other solution-oriented fields) and is not a safe direct public JSON export. This LAB publisher **never reads question content or answer cells** and only consumes the 13 proposed request-control columns.

Proposed **new** governance tabs (currently only CSV header templates, **not actual newly created Sheets**):

| Tab | Role | Safe process |
|---|---|---|
| `10_DanhMuc_Bai` | Registry of lessons / exact source role | Distinguish `LAB` and `MATH_B001–B024` source gates |
| `11_YeuCau_Data` | Request AI/deterministic generation | Exact `lesson_id`, `skill_id`, `renderer_id`, rule, count, LV |
| `12_KetQua_Validator` | QA evidence / SHA256, math/schema/skill/source | Independent outcome; no self-approval |
| `13_PheDuyet` | Scoped technical / pedagogical / owner approval evidence | External verified signer required, not a typed "APPROVED" cell |
| `14_PhienBan_JSON` | JSON staged URI, digest, version, previous pointer | One immutable version per valid content digest |
| `15_NhatKy_HanhDong` | Append-only state transition ledger | Restore after failures, idempotency, source trace |
| `16_Rollback` | Compare-and-swap rollback plan | Explicit owner + independent QA authorization |

### 2. Data path and role boundaries

```text
Google Sheets request data (proposed 11_YeuCau_Data) — read-only interface
     │
     ├── Deterministic Generator: D2 arithmetic, bounded + source rule
     │
     └── AI Data Builder interface (NOT CONNECTED): AI candidate proposal only
                     │
                     ▼
        Independent Schema + Mathematical + Skill + Renderer Validator
                     │
                     ▼
           Immutable public JSON candidate (SHA-256 / staging://)
                     │
                     ▼
      Source/Pedagogy + Independent QA + Owner Approval Gate
                     │
           pending / blocked (NO auto publish)
                     │
                     ▼
      Release manifest CAS plan + rollback plan + append-only log
        (DRY RUN ONLY; current ACTIVE pointer unchanged)
```

AI cannot claim `approvalState`, forge `signedEvidenceRef`, choose a production path, or auto grant a renderer. `acceptAICandidateEnvelope` accepts `AI_CANDIDATE_ONLY` for **proposal**, not QA or publication. No model API/Google AI connector is invoked in V1.3.

**An externally verified signature reader, production file store and authenticated publisher are intentionally NOT implemented in this dry run.** Caller-supplied approval rows are never authoritative.

### 3. Actual V1.3 pilot

- Two independent synthetic control rows `LAB_PILOT_A` and `LAB_PILOT_B`; each creates **20 PV100 D2 ADD_WITH_CARRY / LV2** questions under distinct `LAB_MATH_PILOT_A` and `LAB_MATH_PILOT_B` lessons.
- Deterministic pool-based generator avoids duplicate variants, infinite loops and out-of-range two-digit sums; SHA256 is stable for the same input.
- All 40 questions are tested against the **original `47_D2V12_Core.html`** `publicPlan` without editing the renderer. The full JSON has no answer/solution/student fields and is marked `LAB_FIXTURE_ONLY_NO_GAS_RELEASE`.
- All requests pass through independent checks: header and formula-injection rejection, exact known fields and IDs, arithmetic carry and range, duplicate IDs, skill and renderer compatibility, source status and version CAS.
- The same publisher processes a synthetic request labeled `MATH_B020` with source status `STRUCTURED_SOURCE_AND_TEMPLATE_INDEX_NOT_STUDENT_PLAYABLE`, **blocks** it at source gate, does not generate an exportable public B20 candidate, and never updates an active release. The read-only blocked decision is recorded in `BLOCKED_MATH_B020_READ_ONLY.json`.
- Two 20-question JSONs can be imported into the original LAB file-picker: Chrome desktop/mobile rendered **80 D2 mounts and 80 learner input interactions**, with **grade button disabled** for uploaded JSON. Attempting to import the wrong skill policy was rejected without replacing a valid pack.
- 12-route owner LAB baseline regenerated and browser-tested independently on the same CI; 28 original source modules and 8 original CSS files remain byte-verified.
- The 12-route readiness matrix `RENDERER_GENERATOR_MATRIX_V1.json` explicitly marks **D2 generator = TEST** and all other families as `GENERATOR_PENDING` or `PEDAGOGY_PENDING`. It does not imply all types can now have unrestricted AI generation.

### 4. Outputs

Run from a checkout of this branch with Node 22:

```bash
node qa/universal-template-v13/dry-run.cjs
node qa/universal-template-v13/publisher.test.cjs
node qa/universal-template-v1/build.cjs
```

The output folder `qa/universal-template-v13/dist/` contains:
- `LAB_PILOT_A_PUBLIC_CANDIDATE.json`, `LAB_PILOT_B_PUBLIC_CANDIDATE.json`: self-contained LAB-only candidate packages.
- `LAB_PILOT_*_PUBLISH_PLAN.json`: content digest, `staging://` virtual paths, gate state, CAS/rollback and `writeOperations:0`.
- `RELEASE_MANIFEST_CANDIDATE.json`: no production ACTIVE changes.
- `BLOCKED_MATH_B020_READ_ONLY.json`: exact denial reason, without exporting source data.
- `ROLLBACK_PLAN.json`, `EVENT_LEDGER_APPEND_ONLY.jsonl`, `QA_READBACK.json`.
- `AI_BUILDER_INTAKE_CONTRACT.json`: future external AI interface.
- Seven `*.HEADER_TEMPLATE.csv` headers only for proposed Sheets tabs. The existing Google Sheet is not edited.
- `BROWSER_SWAPPABILITY_EVIDENCE.json`, eight Chrome screenshot files if browser QA run.

To run Chrome QA locally after building LAB and dry-run outputs:

```bash
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install chromium
node qa/universal-template-v1/browser.test.cjs
node qa/universal-template-v13/publisher-browser.test.cjs
```

The GitHub Actions workflow `.github/workflows/universal-template-v13-dryrun.yml` performs the build/validation/browser/no-loss QA and uploads `ULT_V13_SHEET_TO_JSON_DRY_RUN_ONLY`. The workflow has **contents:read** and `persist-credentials:false`; no API keys or publishing workflow.

### 5. Approval and version/rollback principles

- Candidate may become `VALIDATED_TECHNICAL` after deterministic QA, but *not* `STUDENT_PLAYABLE`. No actual signature verifier exists in this phase.
- For synthetic LAB packages, manifest status remains `PENDING_OWNER_APPROVAL` and staging path begins with `staging://`; this is a virtual URI **not a published GitHub or Google Drive link**.
- No production `ACTIVE` pointer is ever mutated. `activePointerAfter == activePointerBefore` in all dry-run outputs.
- An actual publisher MUST implement: source exact/pass gate, authenticated roles, verified owner and independent QA approval, secret answer storage, compare-and-swap manifest revision, atomic version-publish switch, append-only logs, rollback and idempotency.
- The `simulateRollback` API validates expected current revision, known historical target, independent approvals, yet returns only a simulation. It writes nothing.

### 6. Known release blockers and next step

- **NO-GO**: Existing P1.2 B001–B024 layered packages are structural candidates, not student playable; original content SGK/skillId/page approvals are not inherited from candidate status.
- **NO-GO**: No native Google Sheets governance tabs were created yet; the current source sheet is unchanged; the live adapter is not connected.
- **NO-GO**: No live AI content generator, no authenticated private answer repository, no production trusted grading or GAS TEST.
- **NO-GO**: ULT V1.2's seven server-side grading routes are **synthetic LAB-only**; five routes remain ungraded by design/approval.
- **NO-GO**: Owner has accepted LAB V1 UX, but has not signed real source content/publishing policies for ULT V1.3.

**Suggested next gate: `ULT-V1.3-B – Governed Sheet TEST & Candidate Intake`**. Only after approval of proposed governance headers and permissions should a separate TEST Sheet be created (never edit the B20 source Sheet in place). Connect limited read-only row ingestion, external AI candidate generation under strict quotas, independent QA, approval verification and a staging-only publisher with rollback. Do not begin 24-lesson Big Data until two *independently approved* real lessons prove the pipeline.
