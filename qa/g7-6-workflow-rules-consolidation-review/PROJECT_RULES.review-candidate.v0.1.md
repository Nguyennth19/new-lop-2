# PROJECT_RULES – CONSOLIDATED REVIEW CANDIDATE v0.1

> **UNSIGNED – REVIEW ONLY – NOT THE OFFICIAL PROJECT_RULES.md**
> Source: audit branch `audit/g7-6-workflow-rules-consolidation-review-20261116`; pinned base `6d88daa3383956e8e43ca1a8a328914a86386138` (16/11/2026).
> This text cannot authorize GitHub merges, GAS deployment, P0.6/renderer registration, school content publication, learner data IO, score or star changes. No owner approvals have been recorded.

## 0. Precedence and authoritative source
- No external workflow document, AI-generated response, successful CI, or Git commit changes existing signed owner decisions or the C07–C12 / P0.6 release gates.
- Refer to approved source policies by **exact path, immutable SHA and approval scope**. A historical README, external DOCX or PROCESS-V1-DRAFT remains background reference where it conflicts with later locked audit gates.
- Keep source of truth distinct: SGK/VBT originals, working canonical and source QA, public/private runtime contract, renderer registry, application, student data and owner approval. Never promote a derived summary into canonical records.

## C01 – Task provenance (R01: new coordination delta)
Each handoff and audit task carries `taskId`, module + lesson or asset scope where relevant, `sourceRef` (book/pages/record or code path), `baselineBranch`, `baselineSha`, `changeSet`, `expectedQA`, `actualCI`, `evidenceRefs`, `blockers`, `ownerStatus`, `rollbackRef` and a concise `nextAction`. Fields that do not apply may use `N/A + reason`; never fill unknown facts as PASS.

## C02 – Small context index (R02: new coordination delta)
Start a new AI session from a **metadata-only context index**: versioned pointers to relevant source SHA, audit status, known blockers, changed paths and target QA. Read the few modules actually needed instead of copying the entire repository, all books, all student records, secrets, private answer keys or screenshots into prompts, a Drive snapshot or a public artifact.

## C03 – Model-neutral handoff + independent review (R03: new coordination delta)
Tasks may pass between ChatGPT, Gemini or human reviewers through the same pinned task packet. A second reviewer checks **inputs, scope, negative tests, hashes and gaps** independently. Never use one AI's output as evidence that a different model or the owner approved it; record disagreements and stop at NO-GO where unresolved. Work is resumed from the latest verified checkpoint, not chat memory alone.

## C04 – Reuse-first before new generators or UI components (R08: new coordination delta)
Before authoring a new renderer, asset selector, speech normalizer, source exporter, or generator, inspect the **existing ID/version/source pin and QA scope**. Prefer a compatible reference implementation or small tested adapter. If truly new behavior is needed, open a separate contract/fixture/visual regression review. Do not assume the 12 renderer reference items, 288 asset metadata, and the voice profiles are all active in the app.

## C05 – Evidence retention & auditable rollback (R10: new coordination delta)
Append a checkpoint and execution log with the tested SHA, affected files, CI run, immutable source evidence, errors/open blockers, approval scope and rollback. Never overwrite source originals or previous approval records. Automatic backup deletion, count-based pruning and inaccessible external-only references are not a substitute for an owner-approved retention and restore procedure. Distinguish **technical evidence lock** from **content/pedagogical approval**.

## Existing specialist policies – reference, do not duplicate
- **R04 – CI / deployment boundary:** pinned no-deploy CI `.github/workflows/g7-6-b6-c086-no-deploy.yml` and release matrix `qa/g7-6-b5c/integration-go-no-go.matrix.v1.json`; developer commits do not authorize `clasp push`, merges or release.
- **R05 – Audit integrity and approval states:** `qa/g7-6-b6-c086/execution-log.c086.md`, `qa/g7-6-b6-c085/approval-evidence-lock.v1.json` and signed decision state `qa/g7-6-b6-c086/resolution.pending.v1.json`. A technical PASS cannot become owner APPROVED.
- **R06 – Independent C07–C09:** `qa/g7-6-b6/approvals/C08.approval.pending.v1.json`, `qa/g7-6-b6/approvals/C09.approval.pending.v1.json`, `qa/g7-6-b6-c086/resolution.pending.v1.json`. Current C07 = pending; C08 = PENDING; C09 = PENDING_C08.
- **R07 – Curriculum provenance:** `thu-nghiem/bai-20-bien-the/QUY_TRINH_DU_LIEU_RENDERER_QA_LOP2.md`, `qa/g7-6-b6-c082/source-item-review.v1.json`; SGK LV1, VBT LV2, reviewed references LV3 only. The process document is marked draft; use the latest owner source decisions and exercise-level proofs when they exist.
- **R09 – Security and client trust:** `du-lieu/g7-6/variant-public-envelope.schema.json`, `qa/g7-6-b5c/integration-go-no-go.matrix.v1.json`; private answerSpec/keys, grade and stars must not become browser-visible or authorized by client claims.

## C08.6 and renderer / manifest state
- `qa/g7-6-b6-c086/resolution.pending.v1.json` is 6/6 owner records PENDING and zero verified approvals; keep it unchanged.
- `MATH_MENTAL_NUMBER_INPUT_V1` registration remains an independent C07 candidate and is not added by this document.
- D5 Tangram lab 3 pieces and B027 SGK 4 triangles are not equivalent; D9 current 2 rows/1 icon = 1 unit must not auto-map all B065 tasks.
- No change to source Google Sheets, P0.6, application/GAS, learner records, `main` or `test-theo-main`.

## Decision and adoption
**All ten owner decisions remain PENDING** in `owner-review.pending.v1.json`. Only after explicit human review, source references and approved version pin should a separate authorized action create an official root `PROJECT_RULES.md`. The candidate itself is not that file.
