# N5 Human Closure Intake + N7 Single Writer & TEST Write Authority — Design-only checkpoint

Date: 2026-11-23 (GMT+7). Decision: **N5_HUMAN_CLOSURE_PENDING / N7_DESIGN_READY_FOR_REVIEW / N7_WRITE_AUTHORITY_NOT_GRANTED**. This document is **not** a signature, permission grant, actual writer, integration, merge, or production approval.

## 0. Evidence lock and verification boundaries

- Repository: https://github.com/Nguyennth19/new-lop-2 ; current documentation-only Draft PR #25 branch `lab/ult-n4-final-b-n5-handover-20261123`, prior HEAD `81a8eb2360805f776fdaa71c69f86111cf9af1dd` at intake.
- Frozen `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`; R1/R2 `fe15c79b21b9f056694f8127330934d997affd45`; N4-FINAL-A `08942daadf92027903cf2d1eeecf7293e27f68bc`; V1.3-B `af02456fcc2b3be856091edc899c699890d74da0`.
- Canonical RTM CSV: https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view ; 10,495 bytes / prior raw SHA256 `d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b`; independent recipient A3/A4 still NOT SIGNED.
- Evidence: N5 report [here](N5_W1_CLOSURE_RTM_INDEPENDENT_QA_READINESS_20261123.md), N6 read-only DB audit [here](N6_DB01_DB05_READONLY_AUDIT_REMEDIATION_READINESS_20261123.md), N6 synthetic test [here](N6_SYNTHETIC_LAB_CONTRACT_FAILURE_TEST_PACK_20261123.md), [CI 45142063620](https://github.com/Nguyennth19/new-lop-2/actions/runs/45142063620) SUCCESS at `97505d3162bf2e4b0f4348ba895cafab3f5f783e` with 16/16 in-memory tests (DB-T01..15 and global).
- N5 review readback: PR #14, #16–#25 all 11 Draft/unmerged and 0 review submissions on each; N4-C.6 single signoff register has no independent row-level QA signed; receipt still has `[Ngày giờ GMT+7]`. Issue #15 has only pre-existing technical audit comments.
- Canonical human signoff register: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit ; N0-S receipt: https://docs.google.com/document/d/1xz-9txPepnDC_B8m4C3KXbwiWgwLv1sG6Kx-dRN70Yo/edit ; Master QA Index: https://docs.google.com/document/d/1FAbWq6Si-ZI6qLEUR-hr2Pw-2zf3Y6mnAvl2phBaV2Y/edit ; Drive N5/N6 checkpoint: https://docs.google.com/document/d/17I4dRJSXRuyiDWh2gD-T6_umP4m4FRc6rmNY02pH74U/edit .

## 1. N5 human closure — actual intake checklist, NOT an artificial closure

| Human gate | Required authenticated proof | Current verified status | Human-only action |
|---|---|---|---|
| N0-S A3/A4 | Independent recipient account; fetched CSV bytes 10,495; SHA256 exact; method, source URL, actual GMT+7 timestamp and self-attested scope | PENDING; prefilled PASS and an account name without timestamp do not count | Recipient posts own authenticated receipt in existing N0-S doc or Issue #15 |
| Reviewer assignment | Reviewer(s) independent from PR author, actual account IDs, authorized access to restricted evidence, documented scope | UNASSIGNED / NO authenticated GitHub PR review | Owner names authorized reviewer; no automatic assignment |
| W1-01 | T01/T02; callback/focus/zero/blank; CI45129448098 SHA78c88797918ff2508f69e3bb80a9c22ea7a2c648 and RTM twice-with-SHA gate | TECH_SCOPE_PASS / QA UNSIGNED | QA verifies and signs exact row |
| W1-02 | T03/T04; 5-field DraftKey; 12 handles; CI45130767674 SHAed4c89704a2568903d5e24d836a9ef538898a56f | TECH_SCOPE_PASS / QA UNSIGNED | QA verifies and signs exact row |
| W1-03 | T05 one-operation D10 a11y/5 fields; CI45132282477 SHA08942daadf92027903cf2d1eeecf7293e27f68bc; trusted grade NO_GRANT | TECH_SCOPE_PASS / QA UNSIGNED | QA a11y/UX verdict, Owner scope bound |
| W1-04 | T06A/B/C local + origin sampled real binary / HTTP 404 / semantic negatives; CI45114546368 and 45114449881 | TECH_SCOPE_PASS / QA UNSIGNED | QA checks sample coverage limitations |
| W1-05 | T07 24 pairs; CI45115735605 SHAb467befbf5532c7dd3c1e04222d71aed7519a73d; physical tablet scope | TECH_SCOPE_PASS / QA UNSIGNED | Owner authenticates 12-route Samsung Android Chrome/Samsung statement with actual time if available; QA judges scoped matrix |
| D1/D10 policy | D1 A+B semantic learner labels + fail-closed DOM gate; D10 '+'=>ADD, '-'/'−'=>SUB only; separate trusted grader acceptance | APPROVED_IN_CHAT_IN_PRINCIPLE only | Authorized pedagogy/security decisions separately, not a release grant |
| W1 final close | Each row independent QA decision, Owner decision, exact commit/CI/evidence, permissions and exceptions, timestamp | 0/5 CLOSED | Sign in existing register; RTM still OPEN before proof |

**Owner device evidence does not imply iOS, VoiceOver, TalkBack, or production reliability.** No unnecessary full test repeat without changed code/criteria or a reviewer-identified gap. On error, label `CHANGES_REQUIRED` with reproducible evidence, scope, severity and minimal LAB-only fix; do not silently flip CLOSED.

## 2. N7 architecture — preparation only

**Purpose:** one authority-controlled write path for the 7-tab governed TEST metadata ledger. It must not grant write by merely knowing Sheet URL, a typed `APPROVED` cell, a CI token, or a signed design report. No code or API credentials are configured by this checkpoint.

### 2.1 Trust boundaries / components

1. **Input:** authenticated bounded read receipt from the native TEST Sheet; existing 7-tab `SHEET_CONTROL_CONTRACT_V1.json`; source metadata only. Original B20 Sheet, grades, answers and `04_Cau_hoi.answer/solution_prompt` remain inaccessible.
2. **Candidate validator (non-privileged):** validates strict header/IDs, 4-family schema, source/provenance, privacy, math, semantic/asset policy; hashes canonical candidate payload. AI remains `AI_CANDIDATE_ONLY`; no writes.
3. **Approval verifier (trusted, external):** receives independent QA and Owner signed assertions linked to `packId`, lesson/skill/source policy, candidate `publicSha256`, contentVersion, scope, expiry and signer identity. Distinct actors and authorization; never treats Sheet text or hardcoded LAB HMAC as identity.
4. **N7 Write Authority Gate:** deny by default. Only after N5 signed CLOSED + N0-S A3/A4 + DB-01 sequencing guard + separate scoped **TEST WRITE GRANT** from authorized Owner/admin can a non-public isolated service identity be allowed to attempt TEST writes. Must be reversible, audited, time-limited and target explicitly allowlisted.
5. **Single Writer adapter:** one service identity and serialized per-lesson queue, immutable idempotency ledger/unique index outside unprotected Sheet cells, durable transaction journal; no client/AI/CI direct write. The TEST sheet is a *projection*, not a lock/transaction coordinator.
6. **Revision/CAS boundary (N8):** freshness check of source digest and expected revision just before commit; atomic pointer transition in authoritative store, fail-close on another writer or unexpected revision; no direct LIVE/MAIN pointer, no ACTIVE before later phase signoff.
7. **Recovery (N9):** append-only event journal, partial-write recovery, readback reconciliation, rollback to last committed manifest with signed QA/Owner decision. No operation here executes any of this.

### 2.2 Proposed write request and permit contracts

Request fields: `requestId`, `idempotencyKey`, `executionId`, `lessonId`, `candidateSha256`, `sourceReceiptSha256`, `sourceRevision`, `expectedManifestRevision`, `targetSpreadsheetId`, `proposedRows`, `mode`, `actorServiceId`, `dryRun`.

Grant fields: `grantId`, `purpose`, `environment=TEST`, `targetSpreadsheetId`, `allowedTabs`, `allowedActions`, `issuerAccount`, `approverAuthorityEvidence`, `notBefore`, `expiresAt`, `revocable`, `dryRunOnly`, `N5ClosureEvidence`, `DB01GateEvidence`, `auditSink`.

N7 **current grant status:** `NOT_ISSUED`. Any future grant requires authenticated issuer, exact sheet/tab/range, duration, service principal, least privilege, rollback plan and independent QA. A mock or document containing fields does **not** constitute a permit. Prohibited: grant on `be-hoc`, `main`, production GAS, original Sheet, student data or private answer keys.

### 2.3 Minimal state machine and deny rules

`READONLY_CANDIDATE -> VALIDATED_TECHNICAL -> PENDING_INDEPENDENT_REVIEW -> PENDING_OWNER_APPROVAL -> APPROVED_FOR_TEST_STAGING (conditional) -> STAGED_TEST -> TEST_COMMIT_CANDIDATE`.

All state changes are proposals until explicit TEST authorization. Any `ACTIVE` or release transition remains forbidden until N8/N9/N10/N11 gates. Reject: missing N5/DB-01 proof; missing independent signer; stale digest; unauthorized service; wrong target/tab; expired grant; duplicate execution mismatch; conflicting idempotency key; partial journal; AI claim to approve; public answer key; external writer; any real student record.

### 2.4 Seven-tab write-intent matrix (no actual writes)

| Tab | N7 proposed effect after future grant | Restriction |
|---|---|---|
| 10_DanhMuc_Bai | READ ONLY by N7 | No source/eligibility promotion |
| 11_YeuCau_Data | READ ONLY by N7 | No modification to input requests by writer |
| 12_KetQua_Validator | INSERT new validator decision metadata, bounded rows | CI PASS ≠ signed QA; append-only |
| 13_PheDuyet | INSERT verified approval receipt reference, not authorization source | Cannot type APPROVED to bypass |
| 14_PhienBan_JSON | INSERT immutable candidate reference / content SHA | No ACTIVE unless later gate |
| 15_NhatKy_HanhDong | APPEND unique event record | No overwrite/delete, durable external journal first |
| 16_Rollback | INSERT signed rollback plan reference only | N9 verified recovery separate |
Never allow direct SQL/Sheets `update` or fixed-range overwrite as a generalized write API. Exact permitted operations will be finalized after provider-specific transaction testing.

### 2.5 Acceptance traceability: link DB and N6 evidence

| Architecture gate | Required proof after authorized implementation | Synthetic evidence reused |
|---|---|---|
| N7-AUTHORITY | Missing/expired/wrong-target grant → reject; no service principal bypass | DB-T01 + DB-T13–15 models |
| N7-SINGLE-WRITER | Duplicate same request returns same logical result; 2 writers/concurrent external collision are rejected, no overwritten journal | DB-T06–08 (in-memory only) |
| N7-READBACK | Actual provider readback binds request, result, journal SHA and event ID | DB-T08; no external proof |
| N8-ATOMIC-CAS | Fresh source digest/revision, concurrent mutation and external writer fail without ACTIVE change | DB-T09–11; mock only |
| N9-RECOVERY | Actual partial-write fault injection and signed rollback + readback | DB-T12; mock only |
| N10/11-HUMAN | Independent QA + Owner authority and release decision | No mock can replace humans |

The existing N6 [CI 45142063620](https://github.com/Nguyennth19/new-lop-2/actions/runs/45142063620) at `97505d3162bf2e4b0f4348ba895cafab3f5f783e` is **16/16 PASS solely for synthetic contracts**, not N7 real integration PASS.

## 3. Responsibility split and risk register

- Owner/release authority: scope of TEST grant, time limit, allowed tabs, release/rollback and real device scope.
- Independent QA: W1 row-level review, N7 architecture threat review, idempotency/failure test sign-off; distinct from implementing identity.
- Repo admin: branch protection and GitHub permissions only, not pedagogy/security signoff.
- Writer service operator: provision & constrain separate credentials **only after** explicit authorization. No secrets in repository, markdown or Google Sheet.
- Remaining high risks: Sheet lacks atomic multi-row transaction; in-memory Map is not durable CAS; receipt of 2026-11-20 is stale unless re-read; no identified external signature provider; no independent QA account; TEST permission may permit unauthorized side writes unless isolated; last known 7-tab Sheet contains only 2 D2/LV2 synthetic requests.
- Mitigations: authorized service principal, transaction-capable source of truth external to Sheet, deny-all default, staged rollout, readback, protected immutable journal and revocation drill.

## 4. Exit decisions

**N5:** `N5_TECHNICALLY_READY_HUMAN_GATES_PENDING`. No independent QA signatures or A3/A4 recipient proof; do not mark W1 CLOSED.

**N7 design:** `N7_DESIGN_READY_FOR_INDEPENDENT_REVIEW`; `N7_WRITE_AUTHORITY_NOT_GRANTED`; `N7_RUNTIME_NOT_IMPLEMENTED`. DB-01 BLOCKED; DB-02..05 OPEN. No TEST writes, no GAS, no merge, no trusted grade, no learner release.

**Next action under N0–N11:** obtain authenticated N5 signoff; independently review N7 authority contract and provider feasibility; request **a separate written TEST write authorization** only after N5/DB-01 gate. Then N7 isolated TEST integration and N8/N9 real concurrency/recovery QA before N10/N11 Owner decision. Avoid new administrative PRs or redesigning frozen UI.
