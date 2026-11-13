# F-A G5 – Chromium Browser QA Evidence (isolated TEST preview)
Recorded: 2026-11-13T22:32:53.744+07:00 Asia/Ho_Chi_Minh

## Verifiable CI
- Source test commit: `226bc61be8b7a8de10c9820d3fad38362fa9b4ce`
- GitHub Actions run: `43453411019` — completed `SUCCESS` (both jobs).
- Run URL: https://github.com/Nguyennth19/new-lop-2/actions/runs/43453411019
- Browser evidence artifact: ID `14053541276`, name `fa-g5-browser-evidence`, 485,335 bytes; includes generated HTML, `g5-browser-evidence/desktop.png`, `mobile.png`, `results.json`; 30-day GitHub retention.
- Artifact URL: https://github.com/Nguyennth19/new-lop-2/actions/runs/43453411019/artifacts/14053541276
- Artifact zip digest from Actions log: `92153de940ed2b50dbc9bcd564b84fcbfae2d0c4daf78d8457fe8c34f2c0cac5`.
- Browser: Chromium with pinned Playwright `1.56.1` on `ubuntu-24.04`.
- Earlier CI run `43453248981` FAILED installing Playwright on Ubuntu 26.04; fixed by pinning runner only, no production code changes.

## Results extracted from runner logs
| Device profile | Viewport | B21 | Blank / wrong / correct | Page errors | Horizontal overflow | Conclusion |
|---|---|---|---|---|---|---|
| Desktop Chromium | 1366×768 | 8/8: LV1=4, LV2=2, LV3=2 | Checked all 8 | 0 | None (1366=1366) | PASS |
| Mobile Chromium (iPhone 13 emulation) | 390 px wide | 8/8: LV1=4, LV2=2, LV3=2 | Checked all 8 | 0 | None (390=390) | PASS |

## Scope and limitation
- Preview generated directly from existing `41_HienThiCauHoiToan.html` and `26_ChamCauHoiToan.html` through bounded B21 Compatibility Bridge; generated 8 question cards from E03 composer.
- Actual browser entered and submitted fields, checked DOM results, captured screenshots and QA JSON. Not merely readonly HTML or Node VM grading.
- LV3 assesses both regrouping-to-ten `bridge` and final `answer`; original E03 composer, B21 pilot JSON and H.1 B20 remain unchanged.
- `G5=PASS_FOR_ISOLATED_TEST_PREVIEW`. This **does not** mean Apps Script Web App Version 6 has this integration; live deployment/browser QA of Version 6 intentionally out of scope. No merge/deployment, no real students, no points or stars, `RELEASE_READY=false`.
- G7/G8 project-owner approval was recorded in `FA_OWNER_APPROVAL_G7_G8_20261113.md`; test-only conditions preserved.
- Retention risk: GitHub artifact expires after 30 days, but recipe/scripts, run URL and summarized structured evidence persist in repository. Regenerate preview by running workflow on F-A branch.
