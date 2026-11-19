# P1.3-C.2 — Controlled GAS TEST Integration & Device QA (2026-11-19)

## Decision
**SOURCE INTEGRATION + AUTOMATED DESKTOP/MOBILE CHROME QA PASS; LIVE GAS TEST DEPLOYMENT NOT DONE / PRODUCTION NO-GO.**

This checkpoint adds a server-side opt-in gate, loads the unified resolver as a separate TEST-only sidecar in the existing `GiaoDien.html` template, and adds an explicit manual TEST bridge. It does not replace the existing orchestrator, auto-bind student content, change user-facing CSS/HTML structure, or enable the flag.

## Inherited base
- C.1 PASS baseline `ea2a564b1c50e4a3410b6466d13094bb2e9428fb`.
- 35 current character source pins Drive↔GitHub SHA-256, 288 PNG MASTER provenance, all inherited gates preserved.
- Existing `59`, `85`, `87`, `88`, `83` visual adapters/renderer unaffected.

## Changed/added files
1. `P13_C2_CauHinhTEST.gs`: read-only `p13C2GASTestEnabled_()` checks **three** Script Properties and returns `false` unless ALL match:
   - `LOP2_ENVIRONMENT=GAS_TEST`
   - `P13_C2_UNIFIED_RESOLVER=ENABLED`
   - `P13_C2_OWNER_TEST_APPROVAL=APPROVED_FOR_GAS_TEST`
   Never reads URL or client flags; does not write properties. This is an operational feature gate, **not** authentication or authorization for student data.
2. `GiaoDien.html`: ONE server-template conditional after existing `83_Visual_Orchestrator` and before `19_KhongGianHocToan`; OFF skips **both** C.2 script includes. Existing component order and DOM/CSS otherwise preserved.
3. `90_C2_Test_Integration_Bridge.html`: separate opt-in sidecar exposing `planQuestion` and `mountDecorative`, with no assignment or monkey-patch to `83`. Uses existing lesson/renderer/skill policy; never performs grading or student writes.
4. `qa/p1-3/test_p1_3_c2_gas_gate.cjs`: six flag cases, including missing values and `PRODUCTION` with all other values supplied → OFF; explicit load order and orchestrator object identity preserved.
5. `qa/p1-3/test_p1_3_c2_desktop_mobile.cjs`: compiles actual `GiaoDien.html` template plus repo partials for OFF and ON; renders each in real headless Chrome on desktop 1366×768 and emulated mobile 390×844; checks legacy API, layout geometry, DOM, opt-in bridge and denied quantity. Captures four screenshots.
6. `.github/workflows/p1-3-c2-gas-test-qa.yml`: runs the inherited P1.3 A/B/C/C.1 regressions, gate tests, browser tests, screenshot artifact upload.

## Evidence
- CI successful run `44462601381`; Chrome checks **48 PASS**; server flag scenarios **6/6 PASS**.
- Browser screenshot artifact `p1-3-c2-desktop-mobile-screenshots`, artifact ID `14500800993`, four PNG screenshots (desktop/mobile × OFF/ON).
- No new explicit owner approval is assumed from the synthetic `APPROVED_FOR_GAS_TEST` test fixture. No real production credentials, Script Properties or Apps Script deployed service were read or changed.
- Browser testing is automated headless Chromium using an offline HTML compilation of the actual GAS template; **NOT** a live GAS web-app smoke test, actual physical device, human UX/visual sign-off or full functional data/backend acceptance test.

## Integration and release matrix
| Gate | Status |
|---|---|
| Source integrity, versioned manifest, B.1–C.1 regressions | PASS |
| GAS template source include order | PASS |
| Default OFF / production forcibly OFF when environment != GAS_TEST | PASS |
| Controlled explicit TEST bridge | PASS |
| Desktop + emulated mobile Chromium geometry/DOM | PASS |
| Chrome screenshot capture (4) | PASS |
| Manually reviewed screenshots, visual owner signoff | PENDING |
| Actual GAS TEST deployment, backend calls and human test | NOT EXECUTED |
| Real Android/iOS physical device test | NOT EXECUTED |
| Approved fallback pairs for public student lessons | PENDING |
| MAIN manifest integration / student release | NO-GO |

## Activation procedure (NOT performed)
1. Create a **separate Apps Script GAS TEST deployment/project**, not MAIN, and keep three flag properties absent until explicit human approval.
2. Verify clone/pull source and `napThanhPhan` includes; default OFF first, record baseline screenshots, renderer/grading and rollback identifier.
3. Only following recorded approval, set the exact three Script Properties in GAS TEST. Never expose flag control to page/query parameters.
4. Smoke-test all major views, 10 exercise families, backend trusted grading, multiple browsers, real phone touch/viewport, error fallback, accessibility/lesson identity.
5. Revert any feature regression by deleting `P13_C2_UNIFIED_RESOLVER` or setting it `DISABLED` (flag OFF). Roll back audit branch to base C.1 commit if source rollback needed.
6. Do not enable in MAIN without a separate explicit signed release decision.

## Technical notes / known limits
- Sidecar bridge is **available when enabled**, but the existing `mountLesson` still uses its established semantic routing; no automatic replacement of application lesson orchestration. This is deliberate non-regression behavior.
- Visual screenshots are CI artifacts, not proof of manually verified pixel-identical layouts; automated checks compare key style and geometry.
- The user-facing application under the default OFF flag is intended to preserve identical behavior; final live deployment proof remains a separate gate.
