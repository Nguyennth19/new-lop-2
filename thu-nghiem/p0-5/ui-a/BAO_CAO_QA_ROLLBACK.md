# P0.5-UI-A — Mobile responsive TEST | QA & rollback (2026-11-13)

## Problem from actual mobile screenshot
A narrow permanent sidebar consumed the viewport, shrinking the math learning workspace to the point where two vertical-addition cards and answer input cells were too cramped and could overlap. A floating show-keyboard button occupied part of the bottom area. The user approved UI-A FIRST, reserving UI-B result/answer/order changes for later acceptance.

## Isolated implementation
Branch: `test/p0-5-ui-a-mobile-20261113`, based on `test/p0-5-release-gate-20261113`.
- NEW `46_CSS_Mobile_B20_UIA.html`: CSS media queries only (`max-width:760px`, `max-width:640px`), all scoped under `#mathFullScreen`. Narrow devices use a horizontally swipeable session navigation instead of a permanent left column; the viewport is dedicated to the workspace. Small phones show vertical math cards one per row, with original number/input column geometry restored; results remain in the original order; keyboard dock spans viewport width; floating show-keyboard control is compact.
- `GiaoDien.html`: ONE extra `napThanhPhan('46_CSS_Mobile_B20_UIA')` include after approved CSS. No other app logic changed.
- NEW `thu-nghiem/p0-5/ui-a/kiem-thu-layout.cjs`: 12 read-only checks, including accepted CSS baseline hash, approved UI JS hash, result/action module hash, mobile-only scope, nav/card layout, and absence of sheet/score calls.
- NEW `.github/workflows/p0-5-ui-a-mobile.yml`: isolated TEST-only GitHub Actions workflow.

## Actual GitHub Actions evidence
https://github.com/Nguyennth19/new-lop-2/actions/runs/43365369374
- UI-A focused scope/contract regression: **12/12 PASS**
- Inherited P0.4 FULL_SAFE: **4/4 suites PASS, 46 cases**
- B20 30-question rendering/grading offline regression: **PASS**
- GitHub Actions final worktree clean: **PASS**.
All above are offline/CI checks, **NOT real mobile-browser layout validation**. The assistant did NOT update or redeploy the user's TEST Apps Script.

## Mobile acceptance checklist
1. Pull **only** `test/p0-5-ui-a-mobile-20261113` into the same isolated Apps Script TEST project connected to the isolated QA sheet. Confirm `46_CSS_Mobile_B20_UIA.html` exists at Apps Script root (some pull tools skip nested paths; this file is root).
2. Update existing TEST deployment via Deploy → Manage deployments → Edit → New version → Deploy; do not edit production deployment, do not change ScriptProperties. Keep `P03_QA_TEST_APPROVED=NO`.
3. Real phone portrait: the LV strip under the header scrolls horizontally; lesson content fills the width; vertical math cards appear one below another without clipped number/input cells; test LV1-A, LV2-A and LV3-B; no horizontal page overflow.
4. Real phone: test virtual numeric keyboard open/close, scrolling near bottom, input focus, result cards still reachable, submit remains functional. Desktop: sidebar retained and score/answer modules stay where they were (UI-B is not in scope).
5. After user performs manual testing, read-only recheck of QA workbook ledger tabs 90/91, capture screenshots and log PASS/FAIL.

## Scope and gate
NO changes to `19_KhongGianHocToan.html`, `20_CSS_KhongGianHocToan.html`, `22_CSS_BaiHocKetQua.html`, `25_CSS_SuaBoCucBaiHoc.html`, `29_CSS_BangKetQua_V26.html`, `B20_BienTheMayChu.gs`, Runtime B20 JSON, student scores, MAIN or `test-theo-main`.
`UI_A_OFFLINE_CI_PASS` is confirmed; `UI_A_MOBILE_VISUAL_PENDING`, `UI_B_NOT_STARTED`, `RELEASE_READY=false`.

## Rollback
If layout fails on TEST, redeploy previously known-good TEST version and/or pull `test/p0-5-release-gate-20261113`. The override has no permanent data side effects. Do not merge into MAIN/production before real-phone and desktop verification.
