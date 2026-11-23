# N5 Signed Acceptance Session + GAS TEST Access / Recovery — Human Handoff
**Checkpoint:** 2026-11-23, Asia/Ho_Chi_Minh. **NOT a human signature or authorization**. Direct evidence reconciled in current turn; no Sheet TEST/MAIN or GAS modification, no sharing change, no clone, no credentials, no merge.

## Final current verdict
`N5_SIGNED_SESSION_PACK_PREPARED` / `N5_HUMAN_SIGNOFF_PENDING` / `N0S_A3_A4_PENDING` / `N7_GAS_ACCESS_STATIC_REVIEW_COMPLETED_RUNTIME_ACCESS_UNKNOWN` / `N7_TEST_ROLLBACK_PLAN_ONLY` / `N7_WRITE_NO_GO`.

The only valid N5 closure is **recipient independently signs A3/A4 and authorized independent QA + Owner sign all 5 W1 rows in the sole existing register**. Neither chatbot, synthetic CI, repo owner posting a bot-composed comment, nor prefilled `[PASS]` creates a genuine signature. GitHub Issue #15 comments remain technical handoffs.

## 1. Session evidence lock (directly checked)
- Repository `Nguyennth19/new-lop-2`; PR #14 and #16–#25 **11/11 Draft, unmerged, 0 formal submitted GitHub reviews** checked by each PR API; PR #25 at `0e171c02073ca03facd890de06761eb8bce05b87`, `requested_reviewers=null`.
- N4-C.6 sole human register: https://docs.google.com/document/d/1_owTNZsMmIA97-t971YCEABnjcCSXac9XmJsos12in4/edit ; no independently signed row is present as of readback. Do not create competing signature ledger.
- N0-S receipt: https://docs.google.com/document/d/1xz-9txPepnDC_B8m4C3KXbwiWgwLv1sG6Kx-dRN70Yo/edit ; `[Ngày giờ GMT+7]` still blank and `[PASS]` is a static template. RTM CSV raw https://drive.google.com/file/d/1yLORfhubf3zRN654RPH9CObJ2U-DJcn4/view ; prior 10,495-byte / SHA256 `d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b`. Recipient must compute independently; AI cannot attest for them.
- Frozen `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`; V1.3-B `af02456fcc2b3be856091edc899c699890d74da0`.
- N6 synthetic CI [45142063620](https://github.com/Nguyennth19/new-lop-2/actions/runs/45142063620) 16/16 PASS and N7 GAS-only synthetic CI [45146703567](https://github.com/Nguyennth19/new-lop-2/actions/runs/45146703567) 13/13 PASS; neither verifies actual GAS deployment, role grants or rollback.

## 2. Human-signed session agenda — no fabricated attestations
| Gate | Reviewer action / SHA-bound evidence | Owner action | Status |
|---|---|---|---|
| H-00 Named independent reviewer | Owner explicitly identifies distinct GitHub account, Google recipient email and access scope; reviewer not implementer/PR author | Designate reviewer; authorized real account required | `UNASSIGNED` |
| H-01 N0-S A3/A4 | Recipient downloads exact 10,495-byte CSV and verifies SHA256 `d238fabe7085c9ada3f2dcc2a7c6a6675b688917b2a69175544a35a4e109ef3b`; enter actual tool/method/account/offset-aware time and source link in existing receipt | Confirm recipient is appropriate; do not substitute Owner/self QA if role separation required | `PENDING` |
| H-02 W1-01 | Restore guard callback/focus, blank/zero; [CI 45129448098](https://github.com/Nguyennth19/new-lop-2/actions/runs/45129448098), SHA `78c88797918ff2508f69e3bb80a9c22ea7a2c648`; inspect twice-with-SHA clause | Accept exact scope after QA decision | `SCOPED_TECH_PASS / QA_UNSIGNED` |
| H-03 W1-02 | Composite 5-field DraftKey, 12 routes; [CI 45130767674](https://github.com/Nguyennth19/new-lop-2/actions/runs/45130767674) SHA `ed4c89704a2568903d5e24d836a9ef538898a56f`; in-memory not durable | Accept exact scope after QA decision | `SCOPED_TECH_PASS / QA_UNSIGNED` |
| H-04 W1-03 | One-step D10 a11y; [CI 45132282477](https://github.com/Nguyennth19/new-lop-2/actions/runs/45132282477) SHA `08942daadf92027903cf2d1eeecf7293e27f68bc`; no real VoiceOver/TalkBack and no trusted grader | D10 +/- mapping only in principle, human sign exact scope | `SCOPED_TECH_PASS / QA_UNSIGNED` |
| H-05 W1-04 | Sample real binary/HTTP404 + semantic exact-count; [CI 45114546368](https://github.com/Nguyennth19/new-lop-2/actions/runs/45114546368), [45114449881](https://github.com/Nguyennth19/new-lop-2/actions/runs/45114449881), SHAs `5e09b4a45e6b3d075c6770bb91facf8289c08f6c`, `88a7b26fa1c2e7efd035582b35f29cc6bcd6a9ef` | Approve asset sample coverage only | `SCOPED_TECH_PASS / QA_UNSIGNED` |
| H-06 W1-05 | 24 BEFORE/AFTER matches [CI 45115735605](https://github.com/Nguyennth19/new-lop-2/actions/runs/45115735605), SHA `b467befbf5532c7dd3c1e04222d71aed7519a73d`; QA decides Android-only scoped sufficiency | Confirm Samsung Android tablet, Chrome/Samsung browser, 12/12 routes with truthful **actual time if known**; otherwise create new timestamped trial; decide iOS/a11y separately for release | `SCOPED_TECH_PASS / QA_UNSIGNED; DEVICE_TIME_UNKNOWN` |
| H-07 Owner final closure | QA records each row separately in sole N4-C.6 register and submits authenticated PR review; flag `CHANGES_REQUIRED` with precise reason rather than mass-approve | Owner individually accepts/rejects scope/time and D1 A+B, D10 ADD/SUB policy under own authenticated identity | `0/5 CLOSED` |
| H-08 N7 GAS readiness | Independent QA reviews F01–F04 and sharing/trigger inventory | Decide whether **future isolated TEST workbook copy** and limited GAS TEST project can even be considered | `BLOCKERS_OPEN` |
| H-09 Separate TEST write grant | Must be decided only after N5 closes and N7 real permission/restore evidence | Issue explicit short-lived grant scoped to specific TEST copy ID/tabs/actions and revoke condition; not from this session packet | `NOT_ISSUED` |

**Authentic event format** (fill only by real actor): `actor_account, actor_role, time_GMT+7, decision APPROVED_SCOPED|CHANGES_REQUIRED|REJECTED, W1_ID_or_N0S, evidence_CI+SHA, reviewed_scope, excluded_scope, reason, link_to_signed_record`. Never write hypothetical values into canonical register. If a new code SHA differs from a signed SHA, reviewer must re-evaluate material changes.

## 3. Actual Google Drive sharing snapshot (read only)
- Governed TEST Sheet file `1HlHOrvAQCt4HzOPlaX0moLdRP69ITnPLtEjy6mt_6zs`: native metadata returned **one owner permission only**. This does NOT establish no Apps Script code, triggers, bound scripts or other alternate writers.
- N0-S receipt Doc `1xz-9txPepnDC_B8m4C3KXbwiWgwLv1sG6Kx-dRN70Yo`: direct **`anyone:commenter`**; confidential approval intake should be Restricted + named recipient(s). **Not changed** by this session; Owner decision required.
- Third-party audit Doc `1cUKfSUnT6YGLGpuZ8jvK9gvWpVCMkySiHbRQXHIxSIc`: `anyone:reader`, classify before sharing externally.
- No live permission edit made; re-read metadata after Owner changes before recording `PASS`.

## 4. GAS project source inspection — concrete writer pathways, runtime remains UNKNOWN
Source branch ref `0e171c02073ca03facd890de06761eb8bce05b87` (same frozen ancestry). **This is static GitHub source, NOT Apps Script API live deployment inventory.**
- `appsscript.json` blob `a96e1d5c67868d4f6a53b1825fc68b9d6547ffbc`: manifest specifies `https://www.googleapis.com/auth/spreadsheets` (broad spreadsheet OAuth scope), `V8`, GMT+7. Do not assert runtime token scope is identical or deployed version.
- `CauHinh.gs` blob `a76639c9980cb74054caa19396c697749ecceefc`: property `ID_GOOGLE_SHEET_DU_LIEU`, default source Sheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8`, `moBangDuAn_()` calls `SpreadsheetApp.openById(id)`. Actual Script Properties cannot be read here. Potential mis-target risk if property is changed.
- `MayChu.gs` blob `c07ade076c8e566f8f5463dae073acfd0d2b396d`: `doGet()` serves learner HTML. Existing learner project must remain frozen.
- `P13_C2_CauHinhTEST.gs` blob `397857ce8114028e5916902a8e315db8d9f6a85c`: test opt-in flags require `LOP2_ENVIRONMENT=GAS_TEST`, `P13_C2_UNIFIED_RESOLVER=ENABLED`, `P13_C2_OWNER_TEST_APPROVAL=APPROVED_FOR_GAS_TEST`; this **does not constitute N7 write grant**.
- `ThanhTichMayChu.gs` blob `0039f4ae75673dddc93c2f2a81a98343a6991d0c`: `ghiNhanKetQuaToan20` uses `LockService.getScriptLock()` and `appendRow` for attempt/ledger records, plus initialization calls. **Existing learner app has functioning write-path code** that must not be rewritten under N7.
- `ThanhTichQuanTri.gs` blob `ed37112b8e69d8b122af5c16718a1e6b1528d9ad`: internal admin ledger `appendRow` under ScriptLock.
- `PhuHuynhMayChu.gs` blob `c2a7dfb0a1f53b0ccc09a8a4cceb29f64534c8db`: parent note / ledger `appendRow` and ScriptLock. N7 must not accidentally share privileges with these paths.
- Search for MIME `application/vnd.google-apps.script` in connected Drive returned zero files (not proof none exist, Apps Script API inventory unavailable through current connector). We did **not** inspect live project ID, deployments, active triggers, OAuth grants, Script Properties, or execution-as identity. They must remain `RUNTIME_ACCESS_UNKNOWN`.

**REQUIRED OWNER-OPERATED READ-ONLY AUDIT** in Apps Script editor: for each currently deployed script, record project ID (restricted evidence), linked Sheet ID/bound vs standalone, script owner and authorized editors, deployment version/URL/execute-as/access scope, triggers and trigger owner, relevant Script Properties *names and nonsecret values only* (`ID_GOOGLE_SHEET_DU_LIEU`, `LOP2_ENVIRONMENT`, P13 flags) without sharing PIN/hash or secret tokens; compare against repo SHA. This is an evidence request, NOT a claim we have inspected Google backend. Never disclose live URL or account secrets in public GitHub Issue.

## 5. Restore and rollback: explicit OFFLINE plan, not a drill
- **R0**: no creation of actual TEST copy until Owner's separate permission. Source current governed Sheet TEST is READ-ONLY.
- **R1**: define in advance isolated TEST copy with exact new file ID, only two *synthetic* pilots, 7-tab schema, separate GAS project+deployment, no learner account, no original source Sheet or B020 promotion.
- **R2**: before any future write record a Drive copy/immutable version, checksum manifest for tab 10–16 headers/rows, and `CANDIDATE` state; ensure snapshot link and access are scoped.
- **R3**: test stop after intent, after metadata append, before/after readback, double-click/retry, lock collision, external editor changing a row and expired grant; stop at `RECONCILE_REQUIRED` and do not blindly retry.
- **R4**: manual RESTORE from snapshot for TEST copy only; verify seven tabs, row counts, SHA/unique eventId, unchanged source, and leave `ACTIVE` forbidden.
- **R5**: independent reviewer signs test results and Owner decides to authorize/deny further TEST-only rollout; real exercise is still `NOT_RUN`.
- Existing `16_Rollback` tab currently header-only, and no verified live snapshot, restore log, cloned file or deployed writer exists for this gate. The actual learner Sheet is not a rollback target for the N7 test.

## 6. Closure classification / next action
| Gate | Current result |
|---|---|
| N0-S A3/A4 | PENDING — no independent signed receipt |
| N5 W1-01..05 | 5/5 SCOPED_TECH_PASS, 0/5 QA_SIGNED / RTM_CLOSED |
| N7 GAS source/static OAuth review | DESK_REVIEW_DONE; runtime project/deploy/trigger/Script Properties UNKNOWN |
| TEST Sheet sharing | OWNER_ONLY in returned file metadata; alternative writers NOT VERIFIED |
| N0-S sharing exception | anyone:commenter — OPEN |
| N7 TEST copy / rollback drill | PLAN_READY_FOR_HUMAN_REVIEW, NOT_RUN |
| N7 F01–F04 | BLOCKER / OPEN |
| N7 actual write grant | NOT_ISSUED |
| DB-01 / DB-02..05 | BLOCKED / OPEN |

**Recommended single decision round:** Have authorized recipient independently complete A3/A4, Owner name QA, QA review W1-01..05 with exact CI/SHA, Owner sign scoped device/policy records, Owner restrict N0-S direct anyone permission, Owner supply redacted read-only Apps Script editor/deployment inventory. THEN independently review N7 F01–F04 and approve/reject limited TEST copy/drill plan. **NO-GO for all actual TEST writer calls.**
