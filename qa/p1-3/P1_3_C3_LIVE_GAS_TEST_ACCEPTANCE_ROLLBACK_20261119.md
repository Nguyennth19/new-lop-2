# P1.3-C.3 — Live GAS TEST Acceptance & Rollback Drill (2026-11-19)

## Gate decision
**READINESS / DRY-RUN TECHNICAL PASS. LIVE GAS TEST = NOT EXECUTED; NO-GO for live acceptance, MAIN and production.**

There is no connected Google Apps Script deployment or Script Properties mutation tool in this session, and no authenticated GAS TEST deployment address was verified. Therefore no claim of a live deployment, actual owner property changes, student lesson execution, or real deployment rollback is made.

## Inherited locked baseline
- P1.3-C.2 base commit: `1bc35a49bc9fbb0b2c4554fc0f7146479a847312`.
- The C.2 template has a server-side feature gate `p13C2GASTestEnabled_()`. All of `LOP2_ENVIRONMENT=GAS_TEST`, `P13_C2_UNIFIED_RESOLVER=ENABLED` and `P13_C2_OWNER_TEST_APPROVAL=APPROVED_FOR_GAS_TEST` must match.
- The resolver is a separate opt-in sidecar, NOT a replacement for established `83_Visual_Orchestrator` or `mountLesson`.
- Main/production is not changed; default absence of properties = OFF.

## Created C.3 artifacts
- `qa/p1-3/test_p1_3_c3_live_gas.cjs`: **read-only** browser acceptance runner for a separately supplied HTTPS `script.google.com/macros/s/<ID>/exec` or `/dev` URL. Requires `P13_C3_GAS_TEST_URL` and explicit `P13_C3_EXPECT_FLAG=OFF|ON`. Blocks all missing/malformed URLs. No deployment/properties/grading actions. Runs desktop (1366×768) and emulated mobile (390×844), checks HTTP response, app DOM, 12 renderer registrations, OFF/ON bridge presence, JS errors and screenshots. Output file is a local JSON evidence report with the deployment identifier redacted.
- `qa/p1-3/test_p1_3_c3_rollback_drill.cjs`: **simulated** Script Properties cycle OFF→ON→OFF, proves OFF HTML bytes restored exactly by SHA-256; additionally denies PRODUCTION and unset values.
- `.github/workflows/p1-3-c3-readiness-qa.yml`: reruns inherited source and resolver gates, C.2 integration, rollback simulation; syntax-checks the live runner **without running it**.
- This approval ledger documents pending human decisions and separated live gates.

## Acceptance evidence matrix
| Gate | Result / evidence |
|---|---|
| 288 PNG source SHA-256 / 35 character source roots | PASS inherited |
| Unified selection / Fluent failure guard | PASS inherited |
| C.2 GAS source load order and default OFF | PASS inherited |
| C.3 rollback flag simulation OFF→ON→OFF | PASS in GitHub CI, deterministic template SHA-256 equality |
| C.3 live runner syntax | PASS (not runtime) |
| GAS TEST deployment availability and ownership | NOT VERIFIED |
| Actual OFF on live GAS Web App | NOT EXECUTED |
| Actual ON with explicit owner approval | NOT EXECUTED |
| Real backend lesson B20 and D1–D10 regression | NOT EXECUTED |
| Real phone/desktop user test and screenshot signoff | NOT EXECUTED |
| Live OFF rollback with deployment evidence | NOT EXECUTED |
| MAIN/PRODUCTION | NO-GO |

## Strict live procedure (requires actual authorized GAS TEST)
1. **Preflight / authority:** Identify exact GAS TEST Script ID, deployment ID, immutable version, authorized operator, environment and rollback version. Record approval for test-only publication. Verify TEST is separated from MAIN and production data; never export student identifiers or private grading/answers.
2. **OFF baseline:** Deploy the exact approved GitHub TEST commit to the separate GAS TEST project. Leave all three feature properties absent or disabled. Open TEST URL as authorized operator and run `P13_C3_EXPECT_FLAG=OFF`; preserve screenshot, JSON evidence and timestamp. Verify existing B20 lesson, feedback, grading and main navigation via hands-on test; do not submit real student data.
3. **Controlled ON:** Following explicit approval, enable three matching TEST Script Properties only in test project. Record identity and change timestamp. Run `P13_C3_EXPECT_FLAG=ON`; check that the bridge is available but the original orchestrator is intact. Call only decorative TEST functions in a safe fixture, not any unsanctioned production lesson flow.
4. **Functional acceptance:** Run actual B20 lesson and available renderer families on TEST with synthetic student fixture. Verify mathematical correctness, lessonId/skillId restrictions, trusted grading isolation, fallback for invalid images and accessible recovery. Perform real desktop, Android and iOS browser review; record screenshots and evaluator signoff.
5. **LIVE rollback drill:** Disable `P13_C2_UNIFIED_RESOLVER` in the GAS TEST Script Properties. Reload TEST URL; require OFF evidence and restored original lesson path. If the template or modules changed, restore previously recorded TEST deployment version, never MAIN. Record timestamps, operator, deployed version, screenshots, and a live OFF acceptance report.
6. **Approval:** Only after OFF, ON, live rollback and owner/device reviews actually PASS may the LIVE gate be upgraded. MAIN remains a completely separate release decision.

## Commands for an authorized external CI/operator environment
```bash
# Run against a TEST deployment with consent; URLs and credentials remain outside Git.
npm install --no-save --no-package-lock playwright-core@1.57.0
export P13_C3_GAS_TEST_URL="https://script.google.com/macros/s/TEST_DEPLOYMENT_ID/exec"
export P13_C3_EXPECT_FLAG=OFF
node qa/p1-3/test_p1_3_c3_live_gas.cjs

# After an independently logged TEST-only owner approval/property change:
export P13_C3_EXPECT_FLAG=ON
node qa/p1-3/test_p1_3_c3_live_gas.cjs

# After resetting the GAS TEST feature switch to DISABLED:
export P13_C3_EXPECT_FLAG=OFF
node qa/p1-3/test_p1_3_c3_live_gas.cjs
```

Do not record actual deployment IDs, credentials, student data or teacher grading keys in Git. These commands do not change Script Properties. Actual tests must capture approved evidence under a restricted environment. Require separate explicit owner sign-off to continue.

## Rollback checklist
- [x] Source-level kill switch designed and CI-simulated.
- [x] OFF template SHA-256 equivalence verified in simulated test.
- [ ] Live TEST deployment version captured.
- [ ] Live OFF baseline screenshot/lesson validation.
- [ ] Explicit authorized owner approval recorded.
- [ ] Live ON test and real lesson checks.
- [ ] Live OFF rollback performed and verified.
- [ ] Human acceptance of device QA.
- [ ] Any MAIN/production approval (out of scope).

## Fail-closed policy
No automatic flag activation, no production deployment, no automatic swap of exact-count images and no change to student grading. Status of human/live gates remains `PENDING` until signed and evidenced, regardless of GitHub CI PASS.
