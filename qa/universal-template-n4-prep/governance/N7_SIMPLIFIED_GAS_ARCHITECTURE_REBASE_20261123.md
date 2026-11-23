# N7-SIMPLIFIED-ARCHITECTURE-REBASE — GAS / Sheets / Drive / GitHub / Docs
Date: 2026-11-23, Asia/Ho_Chi_Minh. **Design + synthetic-only QA; no changes to the learner app, renderer, GAS deployment, TEST/MAIN Sheets or actual writer.** Rebase decision based on Owner's explicit constraint: ONE child, existing Google/GitHub stack ONLY, no Firestore, Cloud Run, Cloud Functions, dedicated service or PKI.

**Verdict:** `N7_SIMPLIFIED_DESIGN_PREPARED` / `N7_WRITE_AUTHORITY_NOT_GRANTED` / `N7_REAL_INTEGRATION_NOT_RUN`. This document supersedes N7 *technology preferences* requiring external transactional database/service; it **does not waive** N5, DB-01, signed independent QA, fail-closed safety or rollback. Reference [prior adversarial findings](N7_INDEPENDENT_ARCHITECTURE_CHALLENGE_HUMAN_APPROVAL_PACKET_20261123.md) and [N6 16/16 synthetic CI](N6_SYNTHETIC_LAB_CONTRACT_FAILURE_TEST_PACK_20261123.md).

## A. Architecture decision & ownership (ADR N7-SIM-001)
| Component | Owner in minimal pilot | Change policy |
|---|---|---|
| GitHub, locked commit + QA/manifest JSON | Versioned source of code, policies, approved synthetic/learning pack candidate; immutable digest | PR + source SHA binding; no direct learner activation |
| Drive, versioned per-lesson JSON + backup snapshots | Content archive/mirror and staging receipts, independent restore source | No unverified overwrite; manifest points only after validation |
| Native TEST Sheets 7 existing control tabs | Human-readable requests, QA decisions, candidate references, journal projection | N7 writer restricted to metadata after explicit separate grant; NOT a transaction engine |
| Apps Script (future, isolated TEST deployment) | **One serialization and authorized write gateway**, uses `LockService.getScriptLock()`, checks digest/idempotency/state, stages/test-projections, performs readback | Single deployed entrypoint; never allow other scripts to bypass; frozen GAS app remains untouched |
| Google Docs | Human signoff register/QA evidence and governance, NOT executable authentication authority | Authenticated account/time + immutable artifact refs, no machine grant from document text |
| N7 synthetic Node pack | Models GAS behaviors without requiring GAS runtime | No external network, Sheets, secret, actual deployment or fixture on child account |

**Data ownership rule:** GitHub SHA locks approved *content*; Drive stores immutable copy/restore; Sheets stores *index/operations*, not 10k questions and not the unique truth of release; GAS alone would orchestrate **TEST metadata** after grant. Production student play, actual grades and manifest ACTIVE remain outside N7 pilot. Source Sheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` is not a write target. TEST Sheet allowlisted only after separate grant: `1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs`.

## B. Explicit simplifying assumptions / limits
- One child does **not** mean zero concurrency: double tap, retry, scheduled trigger, duplicate doPost and manual Sheet edits remain realistic.
- `LockService` serializes cooperating executions in **the same script project** only. It is **not** a Google Sheet multi-tab transaction, distributed mutex or protection from direct editors / other scripts.
- `PropertiesService` is a small-state hint/cache, not an immutable transaction ledger, and cannot by itself prove atomic multi-resource writes or serve as a secure trust anchor.
- Sheets `appendRow` + Drive file create + script property update do **not** commit as one atomic operation. An acknowledged network timeout may have succeeded; never blindly repeat an append. Fail uncertain outcome to `RECONCILE_REQUIRED`; reread by eventId + digest and verify before retry.
- Prefer GitHub immutable candidate pack and Drive content snapshot; a small bounded TEST Sheet metadata ledger is appropriate only under tightly scoped permissions and manual governance. Explicitly document risk that a Sheet owner/editor can override protections.
- No "production-complete" authenticity claim from typed `APPROVED` values or synthetic HMAC. For one Owner, human review of locked SHA + authenticated GitHub PR review *can be evidence*, while actual issuance of a TEST grant must be a separate manual, allowlisted and verifiable operation controlled by authorized Owner. Do not infer token possession from document or comment text alone.
- No complicated service accounts at this phase; use dedicated existing Apps Script identity with least feasible workbook sharing, review enabled deployments, and no student-facing action capable of invoking maintenance writer. If provider-enforced limited per-tab rights cannot be configured, consider isolated **TEST copy** and document residual edit access.
- If exact rollback and conflict repair cannot be demonstrated in TEST, keep read-only; no automatic promotion to MAIN.

## C. Proposed GAS writer contract (NOT code, NOT API/TEST authorization)
`N7_GAS_TEST_INTENT_V1` envelope fields:
```json
{
  "contract": "N7_GAS_TEST_INTENT_V1",
  "environment": "TEST",
  "requestId": "LAB_N7_0001",
  "idempotencyKey": "LAB_N7_0001",
  "executionId": "LAB_EXEC_001",
  "lessonId": "LAB_MATH_PILOT_A",
  "candidateSha256": "<64-char-hex>",
  "sourceReceiptSha256": "<64-char-hex>",
  "sourceRevision": "source-captured-revision",
  "expectedIndexRevision": "REV_000001",
  "targetSpreadsheetId": "1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs",
  "tab": "12_KetQua_Validator",
  "action": "APPEND_TEST_METADATA",
  "rowsDigest": "<64-char-hex>",
  "grantId": "NOT_ISSUED",
  "dryRun": true
}
```
The literal sample `grantId=NOT_ISSUED` **must fail authorization**. In implementation, define canonical JSON encoding and digest binding `(environment,target,lesson,requestId,idempotencyKey,candidateSHA,sourceSHA,sourceRevision,expectedIndexRevision,tab,action,rowsDigest,grantId)`. `executionId` is unique *attempt* identity, not request logical identity. Reusing same key+same digest is readback/idempotent; key+changed digest is `IDEMPOTENCY_CONFLICT`; conflicting target/action is a hard failure.

**Proposed authorization record** (manual authenticated Owner, not an automatic signature): `grantId,issuerAccount,issuedAt,expiresAt,allowedScriptProjectId,allowedDeploymentId,environment=TEST,targetSpreadsheetId,allowedTabs,allowedActions,maxOperations,maxRows,contentSha256,sourceScope,revoked,reviewRefs,allowedActor`. Canonical source: Owner-controlled restricted governance record backed by immutable PR+SHA and verified runtime allowlist; no student-facing entrypoint, no public API/Sheet field can create a grant. **Currently NONE issued**. Cannot enable by changing a `APPROVED` cell, JSON file or issue comment.

**Stage machine**: `PREPARED -> AUTHORIZED -> LOCKED -> INTENT_RECORDED -> PROJECTED_PENDING -> READBACK_VERIFIED -> COMMITTED` with `REJECTED` / `RECONCILE_REQUIRED`. All written data are LAB-only TEST **metadata**, never public lesson ACTIVE, never answers or students. Under uncertain partial write, hold until human/operator reconciles; do not promise exactly-once physical append.

**Pseudo-procedure after separate TEST grant**:
1. Verify deployment+actor+environment+target and an independently authenticated, non-expired, unrevoked TEST grant; check N0-S recipient and N5 W1 closure + N7 QA decision. Missing any => deny before locking.
2. Compute strict canonical digest; reject private fields and non-allowlisted tabs/actions; acquire a bounded ScriptLock; on timeout DENY/RETRY_LATER.
3. Under lock reread current request / source digest and checkpoint index; check duplicate key -> if same digest return *verified existing result*, else deny. If stale index / unexpected writer -> stop to RECONCILE_REQUIRED.
4. Persist small immutable intent/receipt first (Drive uniquely named by digest, or use dedicated protected journal record). A write uncertainty is not permission to append twice.
5. Append only approved TEST metadata to tabs 12–16 (tab 10/11 read only). Readback by eventId + digest; record COMMITTED only when all intended projections verified. If incomplete, RECONCILE_REQUIRED and no release pointer advance.
6. Release lock in finally; record operator-visible status and recovery instruction; never silently overwrite a committed event.
7. Rollback: manual Owner+QA reason and scoped target snapshot, new compensating event (not deletion of prior log), readback, no AUTO ACTIVE release.

**Important:** this is a proposal. Real GAS service identity, event store, timeout behavior, Google quota, Sharing rules and on-device scenarios must be independently tested before any WRITE GRANT.

## D. Seven-tab boundary
| Tab | N7 simplified writer after future permission | Source of truth |
|---|---|---|
| 10_DanhMuc_Bai | READ only | Catalog |
| 11_YeuCau_Data | READ only | Request list |
| 12_KetQua_Validator | Bounded append of technical metadata | Snapshot + QA references |
| 13_PheDuyet | Mirror verified approval reference only; never trust hand-entered APPROVED | Human register + authenticated review |
| 14_PhienBan_JSON | Candidate checksum/path append only; **no ACTIVE** | Pinned GitHub JSON + Drive backup |
| 15_NhatKy_HanhDong | Append eventId + payload digest + previous state, no overwrite | Reconciled journal records |
| 16_Rollback | Append signed plan reference only, no actual rollback by this phase | Owner+QA signed decision and backup |
Do not turn this list into real Sheets API grants; these are **application-level restrictions** and require provider-specific feasibility checks.

## E. Rebase N7-F01..F12 — preserve finding IDs, tailor mitigation to one-child constraints
| ID | Old severity | Pilot priority / status | Simplified resolution candidate (design only) | Independent proof before TEST write |
|---|---|---|---|---|
| F01 multi-resource atomicity | BLOCKER | **BLOCKER / OPEN** | ScriptLock, intent before projection, verify/reconcile after partial Sheet/Drive success; compensating event, never declare atomic multi-tab | Simulated+GAS TEST fault after each boundary; no duplicate logical result |
| F02 out-of-band editor | BLOCKER | **BLOCKER / OPEN** | Separate TEST workbook, restrict editors, audit other GAS deployments, readback/hash drift detection; residual Owner direct edit explicitly accepted | permission inventory + manual-edit-during-write drill |
| F03 idempotency key replay | BLOCKER | **BLOCKER / OPEN** | Key -> canonical digest and result; reject same key+changed payload, including altered target | mock fault + restart test and GAS TEST duplicate checks |
| F04 signer trust | BLOCKER | **BLOCKER / OPEN** | One Owner and separate independent QA identified with account-bound GitHub/Docs evidence; manual time-bounded TEST grant; no PKI or fabricated HMAC | Two human identities & reviewer authority check, reject unauthenticated typed approval/expired grant |
| F05 N5 source precedence | HIGH | **HIGH / OPEN** | One existing N4-C.6 signoff register; bind reviews to CI/commit SHA, conflict => NO_GO | N5 A3/A4 + 5/5 W1 human sign |
| F06 tab privileges | HIGH | **HIGH / OPEN** | GAS allowlist tabs 12–16, forbid 10/11; restrict editor roles for dedicated TEST Sheet | runtime denial & provider permission audit |
| F07 TOCTOU | HIGH | **HIGH / OPEN** | Lock + live reread + index revision/checksum, compare before each append; may still race with manual edits | controlled concurrent/outside-edit TEST exercise |
| F08 journal integrity | HIGH | **HIGH / OPEN** | unique immutable Drive intent/receipt + Sheet append mirror + reconciliation index | crash + tampered event + readback |
| F09 rollback | HIGH | **HIGH / OPEN** | versioned Drive snapshot, compensating events + Owner+QA manual approval | TEST restoration / readback without overwriting unrelated rows |
| F10 AI/data boundary | HIGH | **HIGH / OPEN** | synthetic schema allowlist, no 04_Cau_hoi answers or student data, no AI auth | negative private-field tests, D2/D5/D9/D10 separate QA |
| F11 grants revocation | MEDIUM | **MEDIUM / OPEN** | short-lived grant, record ID, count, revoke flag; no automation from Sheet text | expired/revoked/over-limit test |
| F12 proof scope | MEDIUM | **MEDIUM / OPEN** | distinguish CI mock from real integration + human QA, accept Samsung tablet scope only as declared | no human pass inferred, dedicated device signoff |
**Do not falsely label any F01..F12 CLOSED** based on a design update, and do not downgrade F01..F04 merely because there is one child.

## F. Synthetic QA checks and authorization boundary
- Keep N6 CI run [45142063620](https://github.com/Nguyennth19/new-lop-2/actions/runs/45142063620) **16/16 scoped PASS, mock only**. N7 mock test pack should add `SIM-T01..12` for 12 findings incl. two requests, same key/different payload, outsider writes, stale version, journal failure, restore, expired grant and denied Sheet targets. New tests cannot call `SpreadsheetApp`, `DriveApp`, `UrlFetchApp`, web/network or real Apps Script.
- Distinguish offline `SIM_PASS` from authentic `GAS_TEST_INTEGRATION_PASS`, `N5_HUMAN_CLOSED` and `N7_WRITE_GRANT_ISSUED`.
- DO NOT run real GAS/Sheet writes; do NOT modify frozen renderer assets; do NOT merge N4–N7 Draft PRs.

## G. Governance + exit gates
- N5: 5/5 scoped technical pass, 0/5 signed independent QA, 0/5 CLOSED; N0-S A3/A4 independent recipient pending. Use [single human register](https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit). No self-sign.
- DB-01 BLOCKED, DB-02..05 OPEN; actual DB-T01..15 still mock only. Synthetic PASS cannot advance REAL WRITE.
- Preserve existing LAB PR #25 as an archival predecessor **without adding more code to it**. This rebase lives on separate LAB branch `lab/ult-n7-simplified-gas-rebase-20261123` based on frozen PR25 HEAD `0e171c02073ca03facd890de06761eb8bce05b87`. Do not rewrite old history or claim PR25 is doc-only: it already contains N6 code and workflow.
- No Firestore/Cloud Run/Functions/PKI/secret manager requirement in *current plan*. Future upgrade is optional if multiple students or concurrency/compliance demands grow; don't build now.
- Exit for THIS phase: versioned design + F01..12 rebase + test mock verified + Drive mirror/checkpoint + clear NOT_ISSUED state.
- Exit for future **N7 write**: all N5 human closure and N0-S A3/A4; independently accepted F01–F04 mitigations/limitations; real permission inventory; distinct Owner-issued short scoped TEST grant; backup/rollback evidence, then controlled writer integration on isolated TEST copy (not automatically the current Sheet). NO release.
