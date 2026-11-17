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
