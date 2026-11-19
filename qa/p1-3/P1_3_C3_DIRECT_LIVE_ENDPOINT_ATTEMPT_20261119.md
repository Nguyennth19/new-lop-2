# P1.3-C.3 — Live Endpoint Discovery and Direct Verification Attempt (2026-11-19)

## Decision
**LIVE GAS TEST VERIFICATION BLOCKED — NO-GO; no deployment or operational rollback performed.**

## Evidence consulted
- Drive record: `LOP2_P0.5_ReleaseGate_QA_Rollback_20261113`, Drive ID `1mMBzD03hBapxV9KVLi_6TJagxshoxrLpYxdpQQqxJN0`.
- That record explicitly states a **user-submitted Web App candidate** was received 2026-11-13 for `test/p0-5-release-gate-20261113`, head `17e5002c72fd01d3e209e0fa5b285cf27eb77190`. Its runtime deployment SHA and TEST isolation were **not verified at the time**.
- A 2026-11-17 Drive record `G3A_TRUSTED_GAS_TEST_AND_G2B_SIGNOFF_STATUS_20261117.md`, Drive ID `162F7IA72I1pcDmcA9J6QuFq9bXFl49Ux`, also states **REAL GAS NETWORK NOT_RUN** and separate GAS TEST provisioning pending.
- Neither old record authorizes interpreting the old candidate as a running P1.3-C.2 or P1.3-C.3 endpoint.

## Direct attempts on the historical candidate
- Public web reader attempted GET to the documented Apps Script `/exec` URL; **URL inaccessible via the tool**, no response HTML or script state returned.
- Independent sandbox HTTP attempt to the same endpoint encountered **DNS resolution failure**; this is an execution environment networking limitation, **not proof the deployment is unavailable or failing**.
- No authenticated Google Apps Script API deployment/script-property management tool was available in connected apps. Searching Drive metadata located historical documentation but not a verified current C.2 endpoint/deployment version.
- Therefore browser acceptance `OFF`, enabled `ON`, real B20 lesson tests, trusted grading, and real OFF rollback have **NOT** been executed on a deployed Web App.

## Boundary
- Prior C.3 offline simulation remains PASS; C.2 48 desktop/mobile Chrome checks were offline template tests.
- This audit changed **documentation only** on a separate branch. No changes to source, GAS, Script Properties, student data, MAIN, deployed endpoints or grading.
- Real LIVE PASS requires matching verified **GAS TEST project identity, deployment ID/version, source commit, script properties, isolated data workbook, and authenticated operator**. A working old URL alone does not prove these conditions.
- Never publish real Script Properties, student identifiers or private grader keys as evidence.

## Next authorized verification action
1. Retrieve the **current GAS TEST (not P0.5 historical) /exec URL** together with a redacted screenshot of Apps Script *Deploy > Manage deployments* showing deployment version, and confirmation the TEST project is independent from MAIN.
2. As an authorized TEST operator, confirm that C.2 sources from commit `1bc35a49bc9fbb0b2c4554fc0f7146479a847312` or a descendant have actually been pulled into this Apps Script deployment; check versioned deployment rather than trusting editor source.
3. Initially leave `P13_C2_UNIFIED_RESOLVER` absent or DISABLED. Run `qa/p1-3/test_p1_3_c3_live_gas.cjs` with `P13_C3_EXPECT_FLAG=OFF` against the verified URL in an environment with authenticated browser access.
4. After separately recorded owner TEST approval, use the approved isolated GAS TEST project and manually enable three named flags. Run read-only ON test, synthetic lesson/renderer tests, and then disable switch and verify OFF live again.
5. Preserve OFF/ON/OFF timestamps, screenshots, no-private-data network evidence, deployment version and real rollback report. Until then status remains **LIVE_PENDING / RELEASE_NO_GO**.

## Checkpoint
Inherited source checkpoint `cd5d0bf2fbd550ff2eb82d982ab39a9c74cf886f` untouched. Rollback: discard this documentation-only audit branch.
