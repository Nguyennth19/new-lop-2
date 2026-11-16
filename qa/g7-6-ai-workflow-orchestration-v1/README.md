# LOP2 — AI Workflow Orchestration V1 (AI-1, READ-ONLY CANDIDATE)

**Status:** TECHNICAL TEST ONLY / not official PROJECT_RULES. **Date:** 2026-11-16.
**Baseline:** `11d691aa9e5f82f27b8df664ee710b17009d5600`; branch `audit/g7-6-ai-workflow-orchestration-v1-20261116`.

## Practical use
1. Read `PROJECT_STATE_INDEX.v1.json` for the exact pinned GitHub modules, 3 external Drive reference pointers and current gate snapshot. Read on demand, not as a full source dump.
2. Use `HANDOFF_CONTRACT.v1.json` and `HANDOFF_EXAMPLE.pending.v1.json` to prepare a small task packet, with taskId, source SHA, sourceRefs, acceptance checks, blockers and rollback.
3. Run `node qa/g7-6-ai-workflow-orchestration-v1/orchestration.test.cjs` after any candidate change. Fail on corrupted Git blob or suggested protected path.
4. A receiving model or person explicitly checks the pinned refs and independent QA. This is a manual handoff contract, **not an automated connection to a Gemini API** or an authority to call models asynchronously.
5. Only if a separate approved workflow-rule policy exists may later stages propose an official root `PROJECT_RULES.md` and context distribution. The 10 owner review records are unchanged and unsigned.

## What is and is not built
Built: read-only 10-source index with byte pins, source-narrow handoff contract, synthetic candidate packet, validator, negative tests, GitHub-only CI and rollback. No Apps Script source, runtime manifest, Google Sheets, asset activation, trusted grading or student state touched.

Not built: autonomous Gemini/ChatGPT cross-model execution; Google Drive webhook, secret sharing, PWA, release, write adapter, continuous scheduler or production dashboard. Each needs a separate scoping and approval gate.

## Precedence
Historical Drive prompt documents and the external multi-AI PDF/DOCX are reference material. SGK/VBT source validation, P0.6, C07/C08/C09 owner approval and the G7.6 manifest remain independently authoritative. A green CI equals technical validation, never human pedagogical approval.

## How to resume after a stalled conversation
Start from the branch's verified HEAD and CI; compare pinned context index with Git blob source; read only target `group` refs, then check 10 rules owner pending and C08.6 six E04 signatures pending. Record changed paths and next authorized QA with explicit rollback. Never rely on chat memory as sole source of truth.
