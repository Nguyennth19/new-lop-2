# G3-B — Execution log & verified gates (2026-11-17, Asia/Ho_Chi_Minh)

## Scope and immutable checkpoints

- Baseline G3-A TEST `59827dee9a712dadfafb6b06d4f59403cf2c7783`; G3-A retained `33/33` synthetic VM and `6/6` localhost JSON transport QA.
- `938286b4712aea713bdcf23cf554f7e3fe39b00e`: blocked raw four-tab `layThongTinDuLieuBaiHoc` exporter; guarded `layBaiToan20` and `doGet` with QA identity; disabled student ledger writes and parent APIs on isolated TEST only.
- `0b2b987828fdecab21c3a56b7400da6260b1c6fe`: added 18 negative regression cases and independent GAS TEST runbook. Workflow YAML initially invalid due an unquoted colon in a step title; GitHub run [44047873090](https://github.com/Nguyennth19/new-lop-2/actions/runs/44047873090) failed at workflow parsing, **not test PASS**.
- `dbd5588bf30b6cef7780ca05a83c713e285a48c1`: corrected the workflow title; [44047965814](https://github.com/Nguyennth19/new-lop-2/actions/runs/44047965814) completed SUCCESS.
- `6c46fd239ae1a189101c163a49c3332113dcbad6`: added explicit `userinfo.email` OAuth scope for `Session.getActiveUser().getEmail()` and CI assertion; [44048207494](https://github.com/Nguyennth19/new-lop-2/actions/runs/44048207494) completed SUCCESS, exact head SHA.
- Latest CI: `33/33` G3-A VM + `6/6` localhost mock HTTP + `18/18` G3-B negative/bypass checks = **57/57 PASS**, `0` failed. Tests assert no raw 04_Cau_hoi export, no browser key, no incorrect QA identity, no student/parent writes. All are synthetic or local transport, **NOT a Google Apps Script deployment**.
- QA workbook was independently observed through Google Sheets: `1Y4PldXPFXr08wJEHvxLw_3KWk97a0Q6BS3p-kiMxxRQ` has **4 tabs / 51 B20 questions** (16 vertical, 9 mental, 8 word_problem, 18 missing_digit), no tab 90/91/92. The 51 real answer keys remain private on this QA-only Sheet; do not commit them to GitHub.

## Gate matrix

| Gate | State | Evidence |
|---|---|---|
| PRIVATE_SOURCE_ISOLATED | SOURCE/CODE PREPARED | Dedicated QA workbook; `CauHinh.gs` prohibits the production spreadsheet ID |
| LEGACY_EXPORT_NO_LEAK | CI_PASS_IN_SCOPE | G3B 18 negative regressions |
| PUBLIC_B20_ALLOWLIST | CI_PASS_IN_SCOPE | G3A 33 mock cases + G3B |
| SERVER_GRADE_READONLY | CI_PASS_IN_SCOPE | 6 loopback mock cases; `awarded:false,writes:0` |
| ACTIVE_USER_SCOPE | CODE_QA_PASS | `appsscript.json` includes `userinfo.email`; actual OAuth consent pending |
| REAL_GAS_DEPLOYMENT | **NOT_RUN** | No connected Apps Script project/deployment execution action and no verified isolated TEST deployment |
| AUTHENTICATED_NETWORK_E2E | **NOT_RUN** | No real browser `google.script.run` trace or on-device QA yet |
| OWNER_APPROVED_STUDENT_RELEASE | **NO_GO** | QA branch only; owner gates remain independent |

## Exact next actionable test (does not waive pending gates)

Use the [G3-B real GAS TEST runbook](../../docs/kiem-dinh/G3B_B20_TRUSTED_GAS_TEST_GATE_20261117.md) from this commit. Only a new restricted, nonstudent Apps Script TEST project is allowed. Pin deployed source SHA; set Script Properties privately; deploy `execute as user accessing`, using an authorized tester with QA workbook access, deny any blank active email. Capture redacted Network request/response for public lesson, legacy export denial, level-scoped server grading, replay/invalid scope. Verify all four QA workbook tab names and all row counts remain unchanged. Sign only the real results; never infer success from CI.

## Invariants, rollback, no student release

Do not edit `be-hoc`, `main`, `test-theo-main`, historical QA, production B20 Sheet, scores, stars, attempt logs. Current TEST branch is optional and safe to discard. Rollback to G3-A `59827dee` for study only; **do not redeploy an insecure legacy export to students**. Until real GAS Network evidence exists, `P0_B20_FULL_CLOSURE=NO_GO`.

## 2026-11-17 P0 single-focus security closure attempt (same G3-B branch, NO NEW BRANCH)

**Owner instruction:** do not move to P0.1/lesson packages until B20 trusted grading is closed. Re-read `AGENTS.md` and `universal_ai_coding_guidelines-vn-version.md`: verify first, surgical changes, reuse existing tests, no production merge, do not equate local PASS to actual GAS.

- Existing public projection in `KhoBaiHoc.gs` copied raw `svg` from private Sheet into browser. Real isolated QA source has 8 non-empty word-problem SVG fragments. All 8 were inspected at a high-level for allowed tags/attributes; **the arbitrary markup boundary was not guaranteed by the old code**.
- **Fixed in-place**: `g3aSafePublicSvg_` rejects unsupported SVG tags, event handlers, URL references, script/style/foreignObject, attributes and other invalid fragments; known 8 QA picture primitives remain supported. `g3aB20PublicQuestion_` uses the validator instead of forwarding raw Sheet markup.
- Added 4 negative/malformed SVG contract tests to `qa/g3b/test_g3b_boundary.cjs`. CI [44107639516](https://github.com/Nguyennth19/new-lop-2/actions/runs/44107639516) SUCCESS 33 G3-A VM + 6 mock HTTP + 22 G3-B = **61/61**, 0 fail (SYNTHETIC/LOCAL, **NOT** real GAS).
- Added **one private editor-only GAS runtime command** `g3bAuditGasServerOnce_()` inside existing `G3ATrustedTest.gs` (name ends in underscore so not remotely callable from `google.script.run`). It checks QA source 4 tabs with 1/3/8/51 rows, rejects raw legacy export, ensures public questions contain no key fields, checks public SVG, uses one-time server-grading sessions at LV1/2/3 for correct/wrong/empty cases, denies B024, confirms unchanged source workbook and absence of student ledger tabs. Returns only PASS/FAIL labels; never returns an answer key, e-mail, token or student data. This function requires running in **a real separate authorized GAS TEST project** and its result is **NOT_RUN** in this session.
- CI [44108078257](https://github.com/Nguyennth19/new-lop-2/actions/runs/44108078257) SUCCESS on commit `406cde21f77d1bb493adf46a5d834969924f94b8`: GAS JavaScript syntax and 61 code tests PASS. **No connected Apps Script deploy/execute action, no authorized Web App deployment ID, and no authenticated browser Network trace were available.** Therefore real GAS and P0 release remain **NO_GO**.

**Exact single remaining acceptance session:** synchronize this branch's exact SHA to a *separate restricted GAS TEST project*, configure private `G3A_TEST_ENABLED`, QA workbook ID and `G3A_TEST_ALLOWED_EMAILS`; run `g3bAuditGasServerOnce_` once as an allowlisted account; deploy as **user accessing Web App**, record the real version/deployment ID, browser Network public/legacy/grade/replay/OAuth evidence and before/after QA workbook hash/tab counts; sign a receipt. **Do not treat the editor-only audit as Web App E2E**. Never deploy to production or enable points/star writes.

**Explicit blocker:** this connected toolset supports Drive/Sheets and GitHub, **not** creation/deployment/execution of Google Apps Script or a signed-in Chrome browser. The exact credential-dependent step cannot be performed truthfully from here. Keep remaining work on THIS branch; do not open further branches or switch to lesson-building work.

## P0 one-session Web App acceptance — browser smoke route, 2026-11-17

**No new branch.** New scope on the existing G3-B TEST branch only:

- `G3B_BrowserSmoke.html` is a restricted HTML Service page with a manual **Chạy kiểm thử GAS TEST** button, reachable only as `<ISOLATED_TEST_WEB_APP_EXEC_URL>?g3bSmoke=1` (use `&` if the URL already has query parameters).
- `MayChu.gs::doGet(e)` first invokes `g3aQaContext_()`; unauthorized/blank active-user email cannot view the smoke page. The normal student-like TEST UI is unchanged.
- The smoke page makes a public B20 allowlist request (51 source records), confirms no hidden keys or unapproved renderer policies, checks the legacy raw extractor fails, tests server-side **empty** and **wrong** submissions at LV1/LV2/LV3 with a 300-second one-use token, checks replay denial, and checks B024 denied. It **never uses private correct answers in the browser**.
- It creates a redacted, read-only receipt, without tester email, tokens, private answers or source Sheet rows. The report expressly says `GAS_WEBAPP_RPC_SMOKE_ONLY`, `gasEditorAuditVerified=false`, `networkTraceVerified=false`, `visualUXVerified=false`, `deployedCodeShaVerified=false`, `studentRelease=NO_GO`.
- The browser bridge has an independent local mocked `google.script.run` replay test of **21/21 PASS**. [CI run 44111761967](https://github.com/Nguyennth19/new-lop-2/actions/runs/44111761967) = **33/33 VM + 6/6 mock HTTP + 26/26 G3-B + 21/21 browser mocked checks**, 0 FAIL. This is NOT a real GAS deployment.
- QA source live-read (read-only): **4 tabs, with 1 / 3 / 8 / 51 data rows**, and real-level selector preview **LV1 12; LV2 4; LV3 22**. No learner profile, answer values, script credentials or confidential Sheet data were published.

### Close the real deployment-dependent gate exactly once

1. From the pinned **G3-B branch commit** (the last HEAD at deployment), create/synchronize a **separate TEST Apps Script project**; never deploy from `main`, `be-hoc` or an old G3-A SHA.
2. Set private Script Properties `G3A_TEST_ENABLED=true`, `G3A_TEST_SOURCE_SPREADSHEET_ID` to the isolated QA workbook `1Y4PldXPFXr08wJEHvxLw_3KWk97a0Q6BS3p-kiMxxRQ`, and `G3A_TEST_ALLOWED_EMAILS` to the real approved testers. Do not commit or paste identities, passwords or tokens. Grant that tester access to the QA workbook.
3. In Apps Script Editor, run **`g3bAuditGasServerOnce_()`** as the authorized tester and retain the returned **redacted** QA receipt. Require `ok=true`, `failed=0`, `writes=0`, `awarded=false`, workbook counts unchanged. This is REAL GAS SERVER test, NOT browser test.
4. Publish ONLY the isolated TEST Web App, **execute as user accessing the web app**, restricted to testers; record the deployed version/code-SHA match, deployment ID, identity gate, URL, and OAuth consent result privately. Empty `Session.getActiveUser().getEmail()` must be rejected.
5. Open that `/exec` URL with `?g3bSmoke=1` in the authenticated tester browser. Run the button once and save the **21/21 PASS** redacted receipt. Check the Chrome Network RPC response for `g3aLayBaiToan20Test`/`layBaiToan20` recursively contains no secret key, raw legacy export errors, and grading responses include no private answer fields.
6. On the **normal** `/exec` TEST page inspect B20 LV1/2/3 on desktop/mobile and actually submit through the lesson UI; compare source QA tab counts/hashes before and after. Verify no `90_Lan_lam_bai`, `91_So_sao`, `92_Ghi_chu_phu_huynh` created.
7. **Only then** sign `REAL_GAS_E2E_PASS` for that exact deployed SHA and reviewer. Without ALL independent evidence, preserve `REAL_GAS_E2E_NOT_RUN` and `P0_B20_FULL_CLOSURE=NO_GO`.

**Access limitation verified:** the active tools allow connected GitHub and Google Drive/Sheets access, but **no Apps Script project create/execute/deploy connector and no authenticated remote Chrome browser**; no real Web App URL/version/deployment receipt was available. The assistant did not claim to run real GAS or authenticate a tester and did not open any additional development branch. This is the sole remaining external acceptance blocker, not an invitation to start P0.1/P1.
