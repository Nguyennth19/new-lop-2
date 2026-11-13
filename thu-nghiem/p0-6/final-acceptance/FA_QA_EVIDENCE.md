# F-A — QA EVIDENCE AND SIGNOFF BOUNDARY
## Verified historical evidence
- E03 source HEAD: `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583` (source documentation commit).
- E03 CI: Run ID `43440199612`; head SHA `4da9e6eedce8e39a912a9dfbedfe255421941a40`; GitHub REST conclusion `success`; https://github.com/Nguyennth19/new-lop-2/actions/runs/43440199612
- Most recent E03 source-HEAD CI: Run ID `43440539685`; SHA `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583`; conclusion `success`; https://github.com/Nguyennth19/new-lop-2/actions/runs/43440539685
- F-A CI: Run ID `43447904122`; SHA `2b3a3893226725b0e149811e0bea15e1fa3298cf`; conclusion `success`; all job steps success; https://github.com/Nguyennth19/new-lop-2/actions/runs/43447904122
- E03 report: 27/27 offline composer tests. G0/G1/G2/G4/G6 PASS, G3 N/A, G5 BLOCKED, G7/G8 PENDING. Technical success is not release readiness.
- Branch F-A base: source `b0ae0eab7f4b8bfe5687ae49cdb701da74ba9583`; initial recovery checkpoint commit `742784f5a11c93ff314349f94cca2db231ea1056`.
- No CI claim for F-A until a run ID and result have been inspected through GitHub after this commit.

## F-A static audit criteria
JSON parsing, 4/2/2 and total 8, exactly 3 family IDs/4 sessions, no duplicate sessions, allocations match quotas, explicit source-scope INDEX_VERIFIED, all pedagogyStatus PENDING, no owner signoff, allowStudentUse=false, draft policy, carry-required and bounded operands, risk flag when LV3 has LV2 skill/interaction/variant class. The flag is a required PENDING rather than a false claim of FAIL mathematics.

## QA execution / ledger
| Run | SHA | Conclusion | Notes |
|---|---|---|---|
| E03 43440199612 | 4da9e6eedce8e39a912a9dfbedfe255421941a40 | SUCCESS | Prior inherited OFFLINE tests |
| F-A 43447904122 | 2b3a3893226725b0e149811e0bea15e1fa3298cf | SUCCESS | Verified all steps: static safety audit, variant validator, policy generator, multi-family composer. Does not certify pedagogy |

No changes to main, test-theo-main, Web App TEST Version 6, H.1 Bài 20 or student records. `RELEASE_READY=false`.

## F-A.1 independently verified run
- Run ID `43449443133` at SHA `7e8fa5906f8f9988e45ab2ec7b6ff2f22eecb487`: `success`; https://github.com/Nguyennth19/new-lop-2/actions/runs/43449443133. All job steps passed: F-A safety, E0.1 validator, E0.2 generator, E0.3 composer, B21 LV3 bridge-to-ten overlay proof, no-deployment marker.
- **Scope limitation:** LV3 proof only in separate offline reasoning overlay, not in composer-generated student renderer. G5 BLOCKED, G7/G8 PENDING; no owner approval inferred. Policy decision packet created in commit `da082aa39f1d2975128e751c309f52fa466be69a`.

## G5 Compatibility Bridge – current evidence
- FIRST RUN FAILURE: [43451071228](https://github.com/Nguyennth19/new-lop-2/actions/runs/43451071228), SHA `c970c205ed525de67368974040e22dc0e94c97f7`. Failure in malicious-input test: test injected invalid answer in unused LV2 field, incorrectly expected failure. Existing Validator/Generator/Composer passed. Fixed test to inject into a required field, verified GitHub content after client ReadTimeout (did not duplicate write).
- VERIFIED RETEST: [43451418264](https://github.com/Nguyennth19/new-lop-2/actions/runs/43451418264), SHA `dc6e7ed0dc24aa371b2d30a10ee8528f57e5b069`, completed `success`. Bridge reuses actual source `41_HienThiCauHoiToan.html` renderer and `26_ChamCauHoiToan.html` grader in Node VM; validates 8 B21 questions across LV1/LV2/LV3, correct/wrong/blank/invalid input and LV3 two fields. No student records, deployment or CSS changes.
- **Limitation:** source-backed interactive HTML and grading in offline harness only; NO browser/mobile/desktop Web App TEST integration or deployment verified. G5_OFFLINE_BRIDGE=PASS; G5_LIVE_INTEGRATION=BLOCKED. Keep F-A handover pending until actual TEST UI QA evidence exists.
- Owner decision G7/G8 recorded with scoped authorization at `FA_OWNER_APPROVAL_G7_G8_20261113.md`; policy approval is not release permission. `RELEASE_READY=false`.

## G5 gate-state regression repair
- Run `43451745036` at SHA `487ab8d846241194c91e3470b367365dd3baad09` FAILED at FA static auditor: old assertion still required PENDING policy after owner TEST-scope G7/G8 approval; other tests were skipped. Changed only audit assertion/output to distinguish owner approval vs unsigned source JSON.
- Run `43451893690` at SHA `7aa1dfc0b8fd3fe9a1b4f28aeae0122f3d4d96a2`: `success`. The FA static auditor, original E0 validator/generator/composer, LV3 reasoning and G5 legacy renderer/grader compatibility all completed successfully. Browser/mobile deployment test still unperformed; fail-closed G5 live remains blocked.

## Final Chromium browser evidence and closure
- CI [43453411019](https://github.com/Nguyennth19/new-lop-2/actions/runs/43453411019) at SHA `226bc61be8b7a8de10c9820d3fad38362fa9b4ce` SUCCESS. Static F-A validator/generator/composer and browser tests succeeded. Chromium browser actual DOM interactions: desktop 1366px 8/8 PASS, mobile 390px 8/8 PASS, correct/wrong/blank, 0 JS page errors, 0 horizontal overflow.
- Artifact `14053541276` (HTML generated preview + `desktop.png`, `mobile.png`, `results.json`), 485335 bytes, 30-day retention. Details / reproducibility: `FA_G5_BROWSER_QA_20261113.md`.
- Failure recovery: run `43453248981` was blocked by unsupported Ubuntu 26.04 Playwright environment, fixed by using Ubuntu 24.04. GitHub Actions demonstrates browser QA for isolated TEST preview, not Apps Script Web App Version 6. No deployment.
- Gate summary: G5 `PASS_FOR_ISOLATED_TEST_PREVIEW`; G7/G8 `OWNER_APPROVED_TEST_SCOPE`; `RELEASE_READY=false`. Full F-A closure limited to TEST/standalone preview only; production/live-version integration remains separate from this acceptance.
