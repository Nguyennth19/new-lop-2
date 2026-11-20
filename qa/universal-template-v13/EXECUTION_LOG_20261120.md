# LOP2 ULT-V1.3 · Realtime QA/Execution Ledger

**2026-11-20 Asia/Ho_Chi_Minh — DRY RUN only.**  
Branch `lab/universal-learning-template-v13-publisher-20261120` from frozen ULT-V1.2 `e74a3505c71b579e662b07991132ccfda3fe6e2e`. Original `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`. No checkout merge or Google Sheet/Drive/GAS write.

### R00 Source checkpoint
Read ULT V1.2 source+QA report; current `qa/universal-template-v1/lab-runtime.js`, `fixture-packs.cjs`, original D2 core; P1.2 layered schema and 24-lesson manifest, which states `studentPlayable:0` and `publicVariantReady:0` within that manifest. Native B20 Sheet `1ZFzjU1HbAOp0ZH4GNmBxMXci8YzLtPQHQixCX9ZITT8` metadata and bounded header rows read. Discovered 17 `01_Bai_hoc` and 21 `04_Cau_hoi` headers, including an `answer` column; no contract for new publisher state. Decided new control-tab schema without altering historical B20 sheet.

### R01 Contract & safe control model
Added `SHEET_CONTROL_CONTRACT_V1.json` with exact observed legacy Sheet headers, seven *proposed* governance tabs, role policy and state-machine, no actual Sheet creation. Production content source/signed approval separate from technical renderer source pass.

### R02 Generator, validator, publisher plan
Added `publisher-core.cjs`, `dry-run.cjs`, `publisher.test.cjs`. Deterministic LAB D2 public pilot A/B creates 20 + 20 LV2 addition variants. Data validation reuses actual original D2 `publicPlan`, SHA-256 normalized content and fail-closed public allowlist, skill/lesson mapping. Generates local staged candidate URI, manifest candidate, events, rollback plan, CSV header templates and source-denied B020 receipt; all external write counters zero.

### R03 QA FAIL (unbounded arithmetic loop) → bounded generator
First run `44691921610` was superseded/cancelled. During initial iteration, generator could increment endlessly for a value ending in 0 (cannot carry). Fixed by rejecting that approach and introducing bounded arithmetic; commit `660037bf5a9d96548b82234c210c8e4a44ddb82b`.
- Run `44692214776` **FAIL**: duplicate pairs under some additive combinations. No algorithm source shipping until uniqueness addressed.
- Commit `311e209935dff260c60bfad5096ec72494bf4d73`: finite pool with `a+b<=99`, true carry; seeded deterministic sampling **without replacement**, guaranteeing no duplicates and no infinite generation.
- Run `44692488887` **FAIL**: synthetic D2 IDs were missing the exact `COL_` prefix required by accepted source; corrected source data, **not renderer code**, commit `27ec4319f077465f75f2793a9f458c1052d34f33`.
- Run `44692654432` **SUCCESS**: 91 assertions, 2 × 20 D2, source B020 blocked, no external writes, existing V1 and V1.2 source regression PASS. Artifact `14608754510`.

### R04 Browser data interchange
Added `publisher-browser.test.cjs`, wired Chrome in no-deploy workflow and old 12-route LAB browser regression. Run `44692988429` **SUCCESS**: real HTML accepted generated A/B JSON via user file picker, mounted 40 questions × 2 viewports = 80 D2 instances, 80 filled inputs, grade denied for untrusted uploads. Existing 12-route LAB source/interactions preserved.

### R05 Strict public field/approval hardening
Added exact public-schema allowlists for parent pack, lesson, question and publicVariant; impossible to include extra fake `ownerApproval` keys. Failed/blocked B020 candidates no longer receive a staging URI. Early CI `44693163725` **FAIL** in an old QA expectation that the blocked B020 had a staging URI; test updated to check **null** stage and explicit unknown-public-key denial. Both code and QA were made stricter, no renderer changes.

### R06 CI acceptance proof
Run <https://github.com/Nguyennth19/new-lop-2/actions/runs/44693218423> **COMPLETED / SUCCESS**, commit `a472673212a356872aee9d6cb864fe6e3b6bf41c`. Recorded:
- `ULT_V13_SHEET_TO_JSON_DRY_RUN_CREATED`: 3 request rows (2 LAB, 1 real B20 blocked), 40 synthetic public questions, 0 external writes.
- `ULT_V13_PUBLISHER_DRY_RUN_CONTRACT_PASS`: **93 assertions** math/semantic/approval/rollback.
- `ULT_V1_BUILD_SOURCE_LOCK_PASS`: 28 original modules + 8 CSS byte-parity.
- `ULT_V1_CORE_CONTRACTS_PASS`: 24 original core compile checks.
- `ULT_V12_SERVER_GRADING_CONTRACT_PASS`: 138 assertions across 7 graded and 5 denied routes.
- `ULT_V1_BROWSER_12_ROUTES_X_2_PACKS_X_2_DEVICES_PASS`: 48 source route mounts/interactions.
- `ULT_V13_BROWSER_REPLACEMENT_PASS`: **80 actual D2 mounts + 80 input interactions**, 8 screenshots, no grade grant for uploaded JSON.
- Artifact: `ULT_V13_SHEET_TO_JSON_DRY_RUN_ONLY` id `14609630957`, **999,424 bytes**, GitHub ZIP SHA256 `23b5286c262ded5cd70767d8d31ca42923625ec4c35bb2e2200b942096c65181`.

### R07 12-route future generator readiness
Added `RENDERER_GENERATOR_MATRIX_V1.json` mapping 12 route IDs, skill/type, current LAB renderer tests, 7/5 grading grants and which generator policies remain blocked. D2 is the **only V1.3 runnable generator**. No 10-form Big Data claim.

### R08 / Next gate
`README.md` states proposed tab headers and permissions, full DRY RUN output, source B020 block, how to run and real release NO-GO. **None** of the following occurred: creation of Sheets governance tabs, live AI model invocation, publishing to GitHub or Drive, private grading on real users, activating a manifest, GAS deployment or modifying the accepted LAB/Student App.

**Next:** ULT-V1.3-B read-only Google Sheets adapter with owner-approved isolated governance TEST Sheet and real independent source QA before any active publisher. The hypothetical owner/QA signatures in data rows are not trustworthy; an actual publisher needs verified signatures, source/pedagogy approval, authenticated roles, versioned rollback and private answer storage. No changes to currently approved code until owner reviews the DRY RUN.

**Rollback:** Do not merge the V1.3 branch. `be-hoc` and ULT V1/V1.2 references remain frozen.
