# F-B.3 – Bài Toán thứ hai: B20 independent onboarding evidence
**Scope:** ISOLATED_TEST_PREVIEW_ONLY. **Do not conflate with Apps Script Web App Version 6 deployment**.
**B20 source:** `thu-nghiem/bai-20-bien-the/runtime.json` pinned Git blob `b14d556c5deeb561106e0c81f275387bef538842` (30 questions, 6 sessions, 6 question kinds).
**Independent pedagogy:** H.2 owner chat approval recorded at `thu-nghiem/p0-5/closure/BIEN_BAN_H2_PHE_DUYET_CHU_DU_AN.md` (Git blob `7faaf36b5b74f0ae233e8e3060b47b3b3123e74c`). This is **not** B21 G7/G8 approval and not a signature by an external teacher.
**Independent renderer source:** `41_HienThiCauHoiToan.html` + `42_AdapterBienTheB20.html` + `26_ChamCauHoiToan.html`, each pinned by own immutable Git blob. B20 data adapted by existing `adapter-b20-v1.cjs` without modifying the source.
**QA:** [GitHub Actions Run 43460267147](https://github.com/Nguyennth19/new-lop-2/actions/runs/43460267147), exact commit `4b6650d2a89713161a9881a10066598680ddf596`, **SUCCESS**. H.1 immutable tests, B20 adapter QA, renderer 30/30 and B20 scoring regressions, Chromium desktop/mobile browser interactions all PASS.
- Desktop Chromium 1366px: **30/30** correct, wrong, blank; 0 JS page errors; no horizontal overflow.
- Mobile Chromium 390px (iPhone 13 emulation): **30/30** correct, wrong, blank; 0 JS page errors; no horizontal overflow.
- Six kinds independently covered in each profile: carry 1, vertical 8, mental 9, word 2, three 6, reverse 4.
- Screenshot and generated standalone HTML / JSON evidence: artifact [14055299028](https://github.com/Nguyennth19/new-lop-2/actions/runs/43460267147/artifacts/14055299028), `fb3-b20-browser-independent-evidence`. 30-day retention; scripts and this summary persist.
- First newly authored workflow attempt `43460161855` failed YAML parsing (unquoted colon in name), fixed before tests ran; run `43460267147` passed.

## Policy / separation
B20 uses H.1 frozen answer/skills + its own H.2 owner pedagogical approval, **not** B21 policy or SHA, and source status remains `STAGING_DEMO_ONLY_NOT_PEDAGOGY_SIGNED_OFF` as safe runtime contract. New F-B.3 approval evidence is an external signoff record; do not mutate runtime JSON.
- B20 `lessonVersion=p0.6-fb-test-b20-v1`, `sourceRef=B20_H1_IMMUTABLE_JSON`, `rendererRef=B20_41_42_26_RENDERER`, `policyReviewRef=BIEN_BAN_H2_PHE_DUYET_CHU_DU_AN.md`, QA ref=this document.
- The F-B.3 verifier must check exact source, approval and renderer hashes plus 30/6 structural coverage before returning a TEST-only proof.
- Registry must reject B21 verifier for B20 and vice versa; lesson rollback must remain isolated.

## Boundaries
`G5_B20=PASS_FOR_ISOLATED_BROWSER_TEST`. The original Web App Version 6 and LIVE Apps Script version-to-SHA provenance remain unverified, even though P0.5 owner had approved a functional pilot. No deployment/grades/stars/student data; `RELEASE_READY=false`. New B24 and Tiếng Việt candidates remain `PENDING_INDEPENDENT_QA`.

**F-B.3 completion criteria:** a second trust anchor bound to independently checked B20 source/approval/renderer/QA; separate B20 and B21 selection PASS with cross-lesson forgery denial and scoped rollback; CI PASS at final F-B branch HEAD.
