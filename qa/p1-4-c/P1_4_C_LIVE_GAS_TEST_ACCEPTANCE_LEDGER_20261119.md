# P1.4-C — LIVE GAS TEST Regression & Owner Acceptance
Date 2026-11-19 · Source locked at `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`

## Recorded outcome
**PINNED_SOURCE_TECHNICAL_GATE PASS (conditional on CI), LIVE TEST NOT EXECUTED, OWNER ACCEPTANCE PENDING, PRODUCTION NO-GO.**

### Exact attempted endpoint
User supplied `https://script.google.com/macros/s/AKfycbxzHiRvKpQLsxAg0wBP6NhkwHeiZ4zMLOaj7_QpmJ6oN3twHjrpFkyrZ1o_MvxfXMIcUQ/exec` as be-hoc-pulled Web App candidate. **Do not infer** it is a separate GAS TEST project or tied to a pinned deployment version.
- Public web request: cache miss; no response body or deployment metadata.
- Isolated HTTP request: local DNS resolution error for `script.google.com`, no HTTP response.
- No connected authenticated GAS Projects / Deployments / Script Properties management API available.
- No screenshot, effective Script Properties, immutable deployment version, server response, access control or test-isolated spreadsheet established.
- Because access failed, **not evidence of application failure**; it is an evidence and tool-access blocker.

## Acceptance matrix (all must pass on an authorized, isolated GAS TEST)
| Gate | Scope / method | Current evidence | Decision |
|---|---|---|---|
| C00 | Source lock, immutable Git commit and 19-domain technical ledger | be-hoc SHA pinned; CI source guard | TECHNICAL PASS pending latest CI |
| C01 | GAS project ID, TEST-only deployment ID, effective deployment version, operator, isolated spreadsheet ID and rollback version | none authenticated | BLOCKED |
| C02 | **OFF baseline** all 3 Script Properties absent/disabled, original orchestrator unchanged, UI layout, login/navigation, source identity | P1.3 OFF simulator and offline Chrome tests | LIVE NOT RUN |
| C03 | **LV1** vertical 28+45 with carry (no TEST D2/SVG accordion), mental rows no button, summary rows | source gates and prior offline tests | LIVE NOT RUN |
| C04 | **LV2** exercise variants, scoring, hints, keyboard/touch, feedback; no mental speech | no real network session | LIVE NOT RUN |
| C05 | **LV3** allowed lesson content only; ensure no accidental promotion of 24 candidate JSON lesson packages | `studentPlayable=0` fail-closed source | LIVE NOT RUN |
| C06 | All ten renderer families D1–D10 with D8A/D8B, D5 Tangram, D9 pictograph; exact-count, images, units and layout | reference technical QA; no current GAS E2E | LIVE NOT RUN |
| C07 | TTS Vietnamese theory/audio profile on approved contexts; mental arithmetic question listen removed | source/unit QA | LIVE NOT RUN |
| C08 | Trusted grading (no client private keys) with **synthetic-only** student session, scoreboard and save, answer authority and no duplicate writes | no authenticated TEST server | LIVE NOT RUN |
| C09 | WebP 332 and PNG MASTER 288 source pins; resolved asset/fallback, broken-image fail-closed, count-safe | Git blob and offline resolver QA | LIVE NOT RUN |
| C10 | Desktop 1366x768, mobile 390x844, Chrome/Android/Safari/iOS actual owner interaction and screenshots | offline Chromium PASS only | OWNER PENDING |
| C11 | Following explicit owner TEST approval, exact three flags ON: existing orchestration must remain unchanged; decorative resolver bridge enabled | offline ON simulation only | LIVE NOT RUN |
| C12 | Real OFF rollback: unset/disable `P13_C2_UNIFIED_RESOLVER`, independently verify original DOM/lesson and effective deployed version, optionally restore previous TEST deployment | offline byte-equality simulated only | LIVE NOT RUN |
| C13 | Owner UX approval, complete signed evidence and separate production release decision | no signoff | NO-GO |

### Mandatory LIVE evidence shape
Store redacted, non-student-identifying records only: `runId`, UTC timestamp, operator role, TEST project identity hash, deployment version, source SHA, feature state OFF/ON/OFF, each gate result, synthetic fixture ID, screenshot names, screenshot checksums, JavaScript errors summary, image fallback results, rollback deployment version, owner signoff. Do not record credentials, private answer keys or student names.

### Safe execution
1. **Source preflight:** run `node qa/p1-4-c/test_p1_4_c_pinned_source.cjs` and all inherited P1.4-B, P1.3 and B20 unit tests. This can run in Actions and says nothing about live deployment.
2. **Verify authorization and isolation:** via Apps Script `Deploy > Manage deployments`, capture TEST Project ID/deployment version and confirm it maps to pinned source. Effective Script Properties OFF, actual TEST spreadsheet not the live student workbook. If any fact cannot be established, stop; no ON test.
3. **OFF read-only smoke:** run `P13_C3_GAS_TEST_URL=<verified TEST URL> P13_C3_EXPECT_FLAG=OFF node qa/p1-3/test_p1_3_c3_live_gas.cjs` from an authorized browser host; verify actual LV1/2/3 manually against synthetic fixture and document screenshots.
4. **Owner-approved ON only:** in isolated TEST project set the exact three TEST properties. Run the same read-only runner with `P13_C3_EXPECT_FLAG=ON`; continue a separate interactive test with synthetic-only data.
5. **Rollback:** disable `P13_C2_UNIFIED_RESOLVER` (or remove it), verify OFF on the *same* live TEST deployment and restore previous TEST deployment version if needed. Record actual screenshots, timestamps and QA owner acceptance.
6. MAIN, user data and production stay unchanged. No automatic CI deployment or background monitoring of URL is permitted.

## Safety and remaining independent blockers
- P1.2 B001–B024 `studentPlayable=0`; no promotion.
- V7 workbook R05 on Drive has only 64 actual prompt rows and reports four B015 grade oracle mismatches plus 24 author-fixed issues not independently verified. V7 must not be silently imported into runtime.
- P1.3 production image placement and licensing remain independently gated.
- A historical 51-row B20 spreadsheet default exists; actual GAS Script Property override has not been checked; do not assert the runtime workbook.
- Access to a generic `/exec` URL alone does not certify source version or TEST isolation.
- No approval is inferred from the creation of this audit branch or from P1.3 C.3 dry-run PASS.

## Re-entry / rollback checkpoint
Base `1b69e277f8de6cb156f46a1d85af33bdad70c0ef`, separate `audit/p1-4-c-live-gas-acceptance-20261119` branch; remove audit branch to roll back P1.4-C preparation. Application source, MAIN, be-hoc, Drive and GAS remain byte-identical until independent signoff.
