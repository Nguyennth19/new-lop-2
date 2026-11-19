# LOP2 – UNIVERSAL LEARNING TEMPLATE V1 · Nhật ký triển khai / REAL-TIME

Date: 2026-11-19 (Asia/Ho_Chi_Minh). Source frozen `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`.
Independent branch: `lab/universal-learning-template-v1-20261119`.
Scope: **OFFLINE / LOCAL NODE TEST ONLY; NO GOOGLE APP SCRIPT / NO STUDENT DATA / NO MAIN**.

## ULT-00 – Architecture locked for LAB
- Goal: data-swappable generic renderer shell, 10 math families, 12 source renderer IDs, validation, scoped public images, click TTS, ability to later attach trusted backend.
- Preserve: original 288 WebP semantics, G7.4 demo and G7.6 B5A Tangram placements, D2 V1.2, SVG capacity/weight, D10 G6 adapter, G75 V2 normalizer; do not redesign or bulk merge.
- Differentiation: LAB_2_PACKS ≠ B20 approved lesson, source/standalone PASS ≠ real GAS deployment; no official D5/D9 E04.
- New branch from existing `be-hoc`, no edits to GAS root module files. Rollback: drop independent branch only.

## ULT-01 – Public data packs
- `fixture-packs.cjs` creates two different public fixture sets A/B using same 12 renderer IDs, across LV1–LV3. Each case has skill/type, visual intent and publicVariant.
- Inputs are synthetic, not textbook-signed. No answer key in public object.
- QA discovered D3 A duplicate answer texts and D9 A nonsensical MORE_THAN source, corrected in data only at `3def627a8e559aa23ecb4855b81cc1e18a502f08`. Preserve fixes in fixture lineage.

## ULT-02 – Data-driven standalone runtime
- `lab-runtime.js` uses original source modules and a new LAB-only mapping, not `83_Visual_Orchestrator` lesson-specific B20 policy. Supports `setData(pack)`, `openQuestion(questionId)`, A/B dropdown, JSON upload, per-level navigation, draft memory only.
- Validate public nested object recursively, ensure known renderer + official source core compile succeeds, reject `answerKey/correct/expected/solution/studentId` and unsafe types.
- D1 original input; D2 original manual-carry renderer; D3–D9 original mount APIs; D5 B5A Tangram renderer; D10 original adapter on LAB-only G6 compatible card, without public grading key.
- TTS V2 normalize text on explicit click; no auto speech or student storage.

## ULT-03 – Build byte-verified source
- `build.cjs` takes 28 existing renderer/asset/TTS modules and 8 CSS files from root, compares exact source bytes with frozen `be-hoc` Git blobs before output, writes self-contained `dist/LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html`, two public JSONs and `SOURCE_PROVENANCE.json`.
- First GitHub CI `44489362675`: **FAIL** in TEST-only D4 Node validator on mistaken question ID suffix; `build.cjs` and source locks already succeeded.
- Corrected ONLY private LAB grader ID-check at commit `c477b31c3ed39712b688c2fb2d1f44d2024592aa`; second CI `44489495846`: **SUCCESS**, original core compile 24/24, source byte pins, D2/D4 private fake server tests.
- Isolated generated HTML ~296 kB, no GAS dependency.

## ULT-04 – Trusted scoring separation
- `trusted-grade-lab.cjs` is a Node-only module excluded from HTML; for the initial LAB only D2 and D4 can return `CHECKED`, with both correct and incorrect synthetic inputs checked server side.
- Other renderer submissions always return `NOT_AUTHORIZED`; no student scores or persistent reward state.
- `local-server.cjs` listens only on 127.0.0.1, serves LAB HTML and private grading to aid local QA; not a deployable GAS API or authenticated production trusted server.
- UI grade button disabled for data not connected to localhost or routes without authorized LAB scorer.
- Full 10-family trusted grading + secure authenticated GAS remain explicit **NO-GO** until policies and E2E.

## ULT-05 – Browser QA / evidence
- `browser.test.cjs` tests actual rendered HTML through local in-process HTTP server, 12 routes × A/B × desktop/mobile, and accepts a third custom JSON through the file picker. Rejects nested private answer fields and verifies both positive/negative D2/D4 server response.
- Initial Chromium job `44490605032`: **FAIL** at D4 selected option assertion. The test clicked the neighboring TTS icon (generic `.g74-choice-options button` selector), not the actual `.g74-choice-answer` button. Correction only in test selector at `e0a33828fc51a975a02bd76f53a81b6a34c66592`. Original source unchanged; FAIL retained.
- Browser test also verifies no viewport horizontal overflow and captures screenshots for D2, D5, D8A/B, D9 and D10.
- Current gate after selector correction: **CI running, not presumed PASS**. Reference: `https://github.com/Nguyennth19/new-lop-2/actions/runs/44490815874`.

## ULT-06 – Process and rollback
- GitHub Actions workflow `.github/workflows/universal-template-lab-v1.yml` has no deployment tokens or app writes, enforced audit-only paths; uses runner installed Chrome where available, Playwright as fallback, and concurrency cancellation.
- Read-only original root modules, Drive, current Google Sheet B20, main and test-theo-main all untouched.
- NO-Go: real GAS, actual B001–B024 content, private scoring on 10 families, signed pedagogical mapping, parent/student score, owner browser acceptance.
- Next: resolve latest browser run, pin run+artifact hash, verify no application diffs, then T4 contract+trusted server on all supported families **without fake completion**.

## ULT-07 – 2026-11-19 · Independent LAB E2E accepted IN OFFLINE SCOPE
- Exact source checksum PASS: 28 original JS modules + 8 CSS byte-identical to be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef; generated HTML ~298,163 bytes.
- Core unit compile 24/24 PASS: 12 renderer IDs x two different public JSON packs A/B. Server-only grade module is never bundled in the browser.
- CI run 44490815874 SUCCESS: 48 renderer mounts; third user JSON accepted; nested answerKey denied; D2/D4 local server correct/incorrect submissions verified.
- Additional contract hardening requires exact lessonId per question and approved LAB skillId/questionType. CI 44491226787 SUCCESS at 662577198030cc8fae0ab2d39551607c495f456c.
- Final expanded Chrome browser CI 44491438977 SUCCESS at bedae30df3b4f4196f1623d6e219a024a52f7b84: 48 renderer mounts + 48 actual click/input interactions, 24 screenshots, no browser JavaScript failures/viewport overflow.
- Evidence artifact LOP2_UNIVERSAL_TEMPLATE_V1_LAB ID 14513356171 size 2,989,487 bytes, ZIP sha256 b3212703bb17223c93c644fc92732e29ae83dbe4227ca5952c9afe71255ff1f4; link https://github.com/Nguyennth19/new-lop-2/actions/runs/44491438977.
- QA report ULT_V1_ACCEPTANCE_MATRIX_20261119.md contains all 12 routes, exact Test-vs-Production boundaries, original CI failures and artifact provenance.
- GitHub compare baseline be-hoc to this LAB shows 10 new paths only (9 under qa/universal-template-v1 and one no-deploy workflow), 0 app source edits, no GAS/Sheet mutation.
- Technical status: T1-T3 PUBLIC LAB PASS; trusted grader is PARTIAL D2/D4 local Node only; owner live device and source lesson data remain PENDING; student release NO_GO.
- Rollback: discard lab/universal-learning-template-v1-20261119 branch; preserve be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef.
