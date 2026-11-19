# ULT V1 — Acceptance Matrix / QA Gate Decision
**Date:** 2026-11-19 · **Project:** LOP2 – UNIVERSAL LEARNING TEMPLATE V1 · **Status:** `INDEPENDENT_LAB_TECH_PASS · PARTIAL_TRUSTED_GRADING · NO_GO_STUDENT_DEPLOY`

## Reference and immutable scope
- Original app reference `be-hoc@1b69e277f8de6cb156f46a1d85af33bdad70c0ef`, unchanged as independently verified after LAB build.
- LAB branch `lab/universal-learning-template-v1-20261119`. GitHub compare `base→LAB`: 23 commits ahead, 0 behind, 10 **ADDED** paths (9 in `qa/universal-template-v1/` and 1 no-deploy CI workflow), **0 application source changed**, 0 deleted.
- GitHub Actions last browser suite at CI commit `bedae30df3b4f4196f1623d6e219a024a52f7b84`: <https://github.com/Nguyennth19/new-lop-2/actions/runs/44491438977>, **completed/success**.
- Source manifest: 28 frozen renderer/asset/TTS modules + 8 CSS source files verified byte-for-byte against original base at build time. `ULT_V1_BUILD_SOURCE_LOCK_PASS`.
- Artifact `LOP2_UNIVERSAL_TEMPLATE_V1_LAB` ID `14513356171`, 2,989,487 bytes, SHA-256 of provider ZIP `b3212703bb17223c93c644fc92732e29ae83dbe4227ca5952c9afe71255ff1f4`.
- Artifact includes one standalone `LOP2_UNIVERSAL_TEMPLATE_V1_LAB.html`, two separate public JSON packs `LAB_MATH_A.json`/`LAB_MATH_B.json`, `SOURCE_PROVENANCE.json`, 24 Chromium screenshots (six selected visual types x A/B x desktop/mobile), and `BROWSER_QA_EVIDENCE.json`. Download from GitHub Actions workflow, not from a made-up sandbox path.

## Gate Matrix

| ID | Goal | Observed QA | Decision |
|---|---|---|---|
| T1 | Independent LAB not touching current B20 | `qa/universal-template-v1` only; compare base→LAB forbids app root diff, 28/8 byte-pins | **PASS** |
| T2 | 10 math families and 12 original renderer IDs | D1,D2,D3,D4,D5,D6,D7,D8,D8A,D8B,D9,D10 registered; 24/24 A/B core compilation PASS | **PASS source contract** |
| T3 | Layout, LV1/2/3, input/draw/click | Chromium Chrome 157, 48 renderer mounts and **48 actual click/input interactions** across 12 routes x 2 packs x desktop/mobile; no JS errors, no horizontal overflow | **PASS offline TEST** |
| T4 | Replace data without code changes | Built-in A/B switch; third JSON file upload, same adapter/renderer bytes; visible generated content varies | **PASS offline TEST** |
| T5 | Fail-closed semantic/data validation | Reject nested answerKey, invalid type/skill/lessonId, unsupported renderer, invalid core publicPlan; rejected package does not replace active valid one | **PASS LAB contract** |
| T6 | Safe scoring interface | Node-only private lab grader excluded from HTML; D2/D4 positive/negative requests verified through localhost HTTP, user score/stars not touched. Remaining 10 IDs return NOT_AUTHORIZED. | **PARTIAL – LAB_ONLY** |
| T7 | User-authorized image and fallback | Reuse WebP 288 + 46 Fluent and SVG sources; D5/D8/D8A/D8B/D9 interactions browser-pass. Not all asset IDs tested against live network/quantity policies. | **PARTIAL** |
| T8 | Vietnamese TTS and UI | Original G75V2 normalizer and click-only speech mechanism included; actual mobile audio not listened to in this QA | **SOURCE_READY; DEVICE_PENDING** |
| T9 | 10-form actual lesson production | LAB synthetic data are not source-exact SGK; no user approval for D5/D9 E04 or D2/1000; source B001–B024 structured candidates not playable. | **BLOCKED** |
| T10 | Trusted GAS + progress + roles | Not connected to authenticated GAS, private grader for all approved forms or student scores. | **NO_GO** |

## Registry / renderer-specific result

| Route | Original source | Two different valid public specs | Browser DOM + real interaction | Trusted grading |
|---|---|---|---|---|
| D1 | `65_D1_Type1` | PASS | PASS | NO_GRANT |
| D2 | `47_D2V12_Core/48_D2V12_View` | PASS | PASS | LOCAL_NODE_LAB_PASS |
| D3 | `66_D3_Core/67_D3_View` | PASS | PASS | NO_GRANT |
| D4 | `68_D4_Core/69_D4_View` | PASS | PASS | LOCAL_NODE_LAB_PASS |
| D5 | `53_Geometry_Core/54_Tangram_V12` | PASS | PASS | NO_GRANT / E04 |
| D6 | `71_D6_Core/72_D6_View` | PASS | PASS | NO_GRANT |
| D7 | `73_D7_Core/74_D7_View` | PASS | PASS | NO_GRANT |
| D8 | `75_D8_Core/76_D8_View` | PASS | PASS | NO_GRANT |
| D8A | `77_D8A_Core/78_D8A_View` | PASS | PASS | NO_GRANT |
| D8B | `77_D8A_Core/79_D8B_View` | PASS | PASS | NO_GRANT |
| D9 | `55_Pictograph_Core/56_Pictograph_View` | PASS | PASS | NO_GRANT / E04 |
| D10 | `80_D10_Core/81_D10_Adapter` | PASS | PASS on **simplified LAB G6 host** | NO_GRANT |

## Logged fixes (never erase earlier FAIL)
1. `44489362675` FAIL: Node private D4 grading script assumed a question ID suffix not used by synthetic fixture. Corrected server-side ID policy only at `c477b31c3e...`. `44489495846` PASS.
2. `44490605032` FAIL: browser test clicked D4's neighboring TTS button instead of `.g74-choice-answer`, causing `REJECTED`. Corrected only selector at `e0a33828fc...`. `44490815874` PASS.
3. Upgraded public question contract to carry explicit `lessonId` and policy-match exact `skillId/questionType`, with reject tests. `44491226787` PASS.
4. Added meaningful click/input to every renderer in 48 A/B/device runs; `44491438977` PASS. No frozen be-hoc renderer source edits.

## What is explicitly NOT achieved
- Not 10/10 secured server grading; no authenticated GAS TEST, no official content ingestion from Google Sheets, no updater/publisher or AI Data Builder connection. Node TEST grader lacks authenticated student access/anti-replay and cannot be used for real pupils.
- The LAB's generic D10 host is not a pixel-identical B20 integrated word card; actual authorized host parity still pending.
- Screenshot artifact records browser state, not owner signoff. No sound was physically listened to, no real B020/21 page authorization.
- Not a production multi-subject app; the interface and data transport concepts may be reused by Tiếng Việt and Tiếng Anh, but no subject-specific renderer has been implemented.

## Suggested next gates
- `ULT-V1.1`: owner visual review of downloadable LAB against approved reference, including desktop/mobile click UX and audio; independent renderer public/private privacy review.
- `ULT-V1.2`: standardized deterministic server grader contracts for all *assessed* routes; some purely illustrative routes may legitimately stay ungraded. Add authenticated GAS TEST only with explicit authorization.
- `ULT-V1.3`: versioned JSON publisher/manifest with approval gate, sheet management tables and rollback; separate from bulk B001–B024 content authoring.
- `ULT-V1.4`: two actual approved (not synthetic) distinct lessons prove swap without source edits.

**Rollback:** Delete LAB branch or avoid merging; `be-hoc` remains unchanged. Nothing was deployed.
