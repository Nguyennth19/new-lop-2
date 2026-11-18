# P0 TEST NEW – B20 & Tangram UX patch · QA handoff
**Status:** `CODE_QA_PASS` · `CHROMIUM_SYNTHETIC_PASS` · `REAL_GAS_POST_PATCH_VISUAL_PENDING` · `STUDENT_RELEASE_NO_GO`
**Date:** 2026-11-18 · **Existing branch only:** `test-new`

## Tested code checkpoint
`13674d3ebc415249c32724cfad7e5be29433360c` – [full two-job GitHub CI PASS](https://github.com/Nguyennth19/new-lop-2/actions/runs/44226057957).

Previous owner-provided screenshots prove B20 loaded in real GAS TEST **before this UX patch**, not after. No current live GAS deployment was changed by the GitHub integration.

## 7 requested changes addressed
1. LV1/LV3 vertical: remove both duplicated D2 practice accordions and the lower public base-10 hint accordion from the active B20 screen; preserved original D2 and SVG modules, original column input renderer and independent theory. Redundant red/colored practice blocks no longer appended.
2. Vertical grading: trusted GAS TEST returns **only** per-cell `correct/wrong` statuses after a complete one-use submitted answer, not expected digits. Overall question status remains the original full-question server verdict. Incomplete vertical answers receive no per-cell answer oracle; changing a graded answer invalidates the stale score/display. No writes/stars/points.
3. LV1 mental: three group cards share one desktop row; responsive on smaller viewports; remove unnecessary per-question audio buttons; no extra exercise family.
4. Word problems LV1/LV2: explicit click-to-speak button reads the public displayed question; summary quantities emphasized by styled, HTML-escaped number spans; no solution prompt read.
5. LV3 group `toan_b20_lv3_ex4`: cap visible questions at **3** in the client selector, trusted server selector and existing smoke selector together. 51 private source questions remain unchanged.
6. LV3 groups 2/3/4: add a per-question optional **carry scratch field** with numeric keypad and draft reset. It is intentionally excluded from `data-ml-field`, trusted grading payload, answer key, and scoring. *Whether carry should be an assessed field is a separate scope/policy request*.
7. Tangram D5: remove one-click `Ghép vào mẫu` auto-placement UI and replace with always-enabled `↺ Làm lại` clearing all placements/selection; preserve drag, rotation, select and manual placement.

## Automation evidence
- `qa/p0-ux-patch/test_ux_contract.cjs`: **14/14 PASS**.
- `qa/p0-ux-patch/test_ux_browser.cjs`: **35/35 Chromium PASS**, desktop 1600×900 and mobile 390×844, plus Tangram manual placement/reset. Fixture-only, no Google authenticated GAS.
- `qa/p0-g2b-adaptation/test_integrated_browser.cjs`: **72/72 PASS** desktop/mobile, 25 synthetic review cases; source reviewer 0/25.
- `qa/g3b/test_b20_client_cache_browser.cjs`: **7/7 PASS**.
- G3-A synthetic VM/HTTP, G3-B boundary and browser mock, 25-case contract QA also PASS on the same CI; no production deploy/no private answers returned.
- Screenshots and scoped receipts in CI artifacts `p0-g2b-visual-review-fixtures-only`, `g3b-test-only-code-qa`. Artifacts are fixtures, not real GAS verification.

## Owner's short REAL GAS TEST acceptance steps
1. **Pull `test-new`**, verify the exact checked SHA. **Do not merge to MAIN.**
2. In the existing isolated `Lop2-P0-TEST-NEW` Apps Script project select **Deploy → Manage deployments → Edit → New version → Deploy** to update the *same deployment ID*. This UI action must be done by the Google account owner; this GitHub action has not deployed GAS.
3. In the existing `/exec`, hard refresh. LV1 test vertical (no duplicate red/pink expandable boxes; green **cell** only after submitting full response, incorrect full question stays not-correct), three mental groups same row on desktop and no audio, word TTS and number emphasis.
4. LV2 word audio and highlighted summary. LV3 group 4 exactly 3 questions; groups 2/3/4 have a separate optional carry **scratch** input; compare real expected server total with visible total.
5. D5 select/rotate/place then `Làm lại` (zero pieces placed). Confirm no auto-fit button; D9 and asset lab unaffected.
6. Record independent B20 and G2B visual acceptance receipts with screenshots, reviewer signatures, QA sheet checksums, zero score writes and rollback version. Leave student release NO-GO until those are signed.

**Rollback:** revert current TEST deployment to previously known-good GAS version, leave GitHub MAIN and the QA Sheet untouched. Do not create another TEST deployment. Do not mark the Google Apps Script visual acceptance PASS merely from CI.
