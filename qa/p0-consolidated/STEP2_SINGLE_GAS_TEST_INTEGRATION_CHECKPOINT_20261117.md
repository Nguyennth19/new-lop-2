# P0 – CONSOLIDATED QA/QC & SINGLE GAS TEST ACCEPTANCE
## STEP 2 – One integrated TEST build / two independent acceptance records

**Date:** 2026-11-17 · **Status:** `INTEGRATED_CODE_QA_PASS` · `CHROMIUM_DESKTOP_MOBILE_FIXTURE_PASS` · `REAL_GAS_TEST_NOT_DEPLOYED` · `INDEPENDENT_REVIEW_0_OF_25` · `STUDENT_RELEASE_NO_GO`.

### Controlled integration: NO new branches

The **single deployment candidate** remains the existing TEST branch:
`test/data-b-g3b-b20-trusted-gas-e2e-20261117`.

1. B20 trusted-grading baseline `08edaffad8acfc12d62f840f36e1ff0e2b0ade6c`: **10/10 protected source modules match original Git blob SHA exactly** after integration (`G3ATrustedTest.gs`, `KhoBaiHoc.gs`, `DocDuLieuSheet.gs`, `DuLieuToanSheet.gs`, `19_KhongGianHocToan.html`, `26_ChamCauHoiToan.html`, `ThanhTichMayChu.gs`, `PhuHuynhMayChu.gs`, `G3B_BrowserSmoke.html`, `appsscript.json`).
2. G2B code baseline `test/p0-g2b-variant-adaptation-20261117@1a331239f3572c8264e1c71cf74b1fda22ff9efc`: **5/5 copied source modules are byte-identical** in integrated TEST (`89_P0_VariantRouter.html`, `90_P0_VectorStructural.html`, `83_Visual_Orchestrator.html`, `25-case-decisions.v1.json`, `test_p0_contract.cjs`).
3. Surgical additions only to `GiaoDien.html`: include 89/90 **before** 83 and B20 screen 19; no rewrite of original B20 layout or client grading. `MayChu.gs` retains the existing B20 `?g3bSmoke=1` test and adds `?g2bReview=1` behind the existing `g3aQaContext_()` active-user gate.
4. `G2B_ReviewerPreview.html` and `G2B_ReviewFixtures.html` provide a **private reviewer synthetic-fixture preview**, using actual D3/D4/D7/D9/D10 cores and vector reference families (not recreating textbook art). No private SGK/PDF/PNG, answer key, server grading, award/stars, student write, or approval controls are introduced.
5. Original 25-case decisions and source provenance retained: 11 KEEP_VARIANT +7 KEEP_STRUCTURAL +7 DROP, 24 unique source IDs; 17 unique kept. Student renderer path still **fail-closed** for all 25 records pending source, policy and renderer grants.

### Single integrated CI evidence

[**Integrated GitHub Actions run 44119669559**](https://github.com/Nguyennth19/new-lop-2/actions/runs/44119669559) – pinned tested commit `e1e4f1084d3b6fc7e1d6d8f9c5588adc29053e48`, both jobs **SUCCESS**:

- **B20/bridge:** 33/33 isolated synthetic VM, 6/6 localhost HTTP mock, 32/32 G3B negative and identity checks, 21/21 simulated browser RPC tests.
- **G2B contract:** 60/60 tests incl. 25 dedicated case checks, 7 DROP, count units, true SVG vector topology, renderer and no-student-grant fallback.
- **Chromium real local browser, not GAS:** 72/72 assertions in desktop 1366×768 + mobile 390×844, each 25 case previews (18 retained case checks / 7 DROP), D3/D4/D7/D9/D10 interactive smoke, vector preview, no JavaScript page errors and no document horizontal overflow. Four fixture-only screenshots plus scoped JSON artifact in [CI artifact](https://github.com/Nguyennth19/new-lop-2/actions/runs/44119669559/artifacts/14343694133).

### Single GAS TEST deployment contract – not performed

**Deploy once, after final HEAD is frozen:** synchronize precisely the selected branch/commit to a **separate Google Apps Script TEST project** with the QA workbook `1Y4PldXPFXr08wJEHvxLw_3KWk97a0Q6BS3p-kiMxxRQ`, private `G3A_TEST_ENABLED`, `G3A_TEST_SOURCE_SPREADSHEET_ID`, `G3A_TEST_ALLOWED_EMAILS`, identity `userinfo.email`, and **Execute as user accessing the web app**. Explicit tester authorization only. Never overwrite an existing production deployment.

The same authenticated deployed URL is used for three pages, **not three deployments**:
- `<TEST_EXEC_URL>` → existing B20 LV1–LV3 read-only, trusted server grading.
- `<TEST_EXEC_URL>?g3bSmoke=1` → B20 authenticated RPC smoke, redacted 21-check receipt.
- `<TEST_EXEC_URL>?g2bReview=1` → G2B 25-case desktop/mobile synthetic-fixture review, redacted visual observation receipt. Source reviewer signatures remain a **separate** mandatory step.

### Two separate acceptance packets – never conflate pass states

- [P0 A – B20 Trusted Grading real GAS acceptance](B20_TRUSTED_GRADING_GAS_ACCEPTANCE_PENDING_20261117.md): `REAL_GAS_E2E_NOT_RUN` pending editor audit, browser authenticated Network, token expiry/replay, 0 writes, rollback and signed reviewer.
- [P0 B – G2B 25-case visual/semantic acceptance](G2B_25_CASE_VISUAL_SEMANTIC_ACCEPTANCE_PENDING_20261117.md): `GAS_VISUAL_NOT_RUN`, `SOURCE_SIGNED_0_OF_25`, E04/renderer/asset/publicVariant grants still `DENY`.

### STOP / rollback / scope

This work **does not** give student access to G2B candidates, grant source/renderer policies, run the real GAS editor, deploy TEST, write scores or modify `main`/`test-theo-main`/`be-hoc`. The editor smoke and real Network trace require an authorized Google tester and deployment tools not present in the current connector session. Do **not** claim real GAS PASS.

Rollback for B20: keep immutable `08edaffad...`; for 25-case source use `1a331239...`. To reject this integration simply do not deploy this existing TEST branch; for a deployed isolated TEST project disable or revoke its TEST deployment and record the SHA. Historical 25-case review rows and QA source PDF/crop stay untouched.

**Next:** retain one pinned TEST integration SHA and one authenticated GAS TEST deployment session; collect each acceptance packet independently. `P0.1` and `P1` remain out of scope.
