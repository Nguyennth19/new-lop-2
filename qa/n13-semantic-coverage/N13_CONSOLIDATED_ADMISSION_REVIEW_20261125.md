# N13 — Consolidated Admission Review

**Review ID:** `N13_CONSOLIDATED_ADMISSION_REVIEW_20261125`  
**Date:** 2026-11-25 (GMT+7)  
**Review branch:** `qa/n13-consolidated-admission-review-20261125`  
**Review base / inherited SYNTH_5 Owner-acceptance HEAD:** `73cc8d7c1bf69ba5771424ffbbb08d2187895334`  
**Disposition:** `N13_ADMISSION_REVIEW_COMPLETED_WITH_BLOCKERS`  
**Admission decision:** `NO_GO — 0/10 formally admitted; studentPlayable=0`

## 1. Executive decision

The consolidated review is complete for the current N13 review pack. Closing the isolated SYNTH_5 prompt QA and receiving the Owner's real-device Vietnamese TTS confirmation removes the specific SYNTH_5 QA/TTS hold only. It does **not** change formal admission.

All ten review variants remain review-only:
- `sourceExactApproved=false`
- `skillIdApproved=null`
- `rendererGrant=DENY`
- `publicVariant=null`
- `studentRelease=false`
- Pilot pack `gradingAuthority=DENY`

The seven source-routing anchors remain HOLD; four estimation anchors remain HOLD; LV3 has no approved reference. No qualified pedagogy reviewer decision is evidenced in this review.

## 2. Source/checkpoint basis

Reviewed directly at inherited HEAD `73cc8d7c1bf69ba5771424ffbbb08d2187895334`:
- `AGENTS.md`
- `qa/n13-semantic-coverage/README.md`
- `B1_REVIEW.md`, `PILOT_FINAL.md`
- `coverage.review.json`, `candidates.review.json`
- `b1-composite.review.json`, `b1-admission.review.json`
- `pilot-lessons.review.json`, `source-visual-closure.review.json`
- `pilot-lessons.test.cjs`, `pilot-gas.test.cjs`, `pilot-grader.qa-only.cjs`, `trusted-oracle.qa-only.cjs`, `N13PilotGrade.gs`
- Isolated SYNTH_5 delta and Owner acceptance record under `delta-synth5-prompt-only-20261125/`
- GitHub Issue #15 decision/evidence comments #7136173193, #7139569274, #7150879309, #7151332838, #7151571813 and #7151911121.

The ten-variant pack contains five variants for `MATH_B001` and five for `MATH_B002`, with 17 parts total. The ten are review variants, not ten source-exact reproductions. The review JSON marks their origin `ORIGINAL_VARIANT_CONCEPT_ANCHORED_NOT_SOURCE_EXACT` and `sourceExerciseId=null`.

## 3. Variant-by-variant disposition

| Variant | Candidate level / content | Owner and technical evidence | Remaining disposition |
|---|---|---|---|
| `N13B1_SYNTH_1` | B001, LV1 candidate; three EXPANDED parts with progressive givens | AI review recommends retain LV1. No specific Owner level approval or qualified pedagogy signoff recorded. | **HOLD** — reviewer must validate concept/level and source mapping; not source-exact. |
| `N13B1_SYNTH_2` | B001, LV2 candidate; three independent expanded-number items | Owner selected retain LV2 **as an independent-practice candidate only**; not empirical difficulty evidence and not formal level admission. | **HOLD** — reviewer/source-scope decision and formal skill/renderer admission still absent. |
| `N13B1_SYNTH_3` | B002, currently LV1 candidate; step-1 and step-2 number lines | Owner's conditional LV2 direction requires a qualified reviewer to verify step-2 was already taught, endpoints provide sufficient support, and lesson/SGK scope aligns. | **HOLD** until all three prerequisites are evidenced; otherwise retain HOLD (do not silently extend LV1 scope). |
| `N13B1_SYNTH_4` | B002, currently LV1 candidate; coordinate matching on step-2 line with `2+4` and `6-2` | Owner's conditional LV2 direction requires qualified confirmation of both step-2 number-line and prerequisite arithmetic. | **HOLD** until both prerequisites and scope are verified; otherwise HOLD. |
| `N13B1_SYNTH_5` | B002, LV2 candidate; number line + D4 multiple-choice subset selection | Exact prompt-only wording approved by Owner; isolated delta and automated regression PASS; Owner confirmed real-device Vietnamese TTS sounded acceptable. | **QA CLOSED / ADMISSION HOLD** — source exactness, qualified pedagogy, skill and renderer approvals remain absent. |
| `N13B1_SYNTH_6` | B002, LV2 candidate; D4 true/false + open-interval integer input | Owner accepted in principle only a bounded exception for part b: canonical natural-number inputs `36,37,38,39` where `35 < n < 40`. | **HOLD** — qualified reviewer must explicitly approve the narrow exception against Governance V16 unique-answer policy. No grader change is authorized before that decision. |
| `N13B1_SYNTH_7` | B002, LV2 candidate; predecessor/given/successor table | AI review recommends retain LV2 with repaired instruction; no specific Owner level approval or qualified pedagogy signoff recorded. | **HOLD** — source/task coverage and level require qualified review. |
| `PV_B001_PLACE_VALUE_S1031` | B001, LV1 candidate; one D4 single-choice item | AI review recommends retain LV1. D4 is an interaction route, not curriculum-skill approval. | **HOLD** — no source-exact, skill or renderer approval. |
| `N13B_SYNTH_1` | B001, LV1 candidate; semantic place-value table | AI review recommends retain LV1. | **HOLD** — separate ID from `N13B1_SYNTH_1`; source/skill/renderer review remains open. |
| `N13B_SYNTH_2` | B001, LV2 candidate; semantic place-value table | AI review recommends HOLD level decision; consider LV1 only after source-scope review. | **HOLD** — do not conflate with `N13B1_SYNTH_2`; verify SGK scope before any reclassification. |

### SYNTH_5 exact acceptance boundary

The isolated fixture changes only `reviewDto.parts[id=b].model.prompt.text` to:

> Trong các số sau, chọn những số lớn hơn 30 và bé hơn 34.

It preserves IDs, part A number line, MULTIPLE mode, speech flag, options `30,31,33,34`, and QA-only correct option IDs `y,z`. The original `pilot-lessons.review.json` source pack remains unchanged; the accepted prompt is in the separate TEST/QA delta only.

Owner device-TTS acceptance is recorded in [Issue #15 comment #7151911121](https://github.com/Nguyennth19/new-lop-2/issues/15#issuecomment-7151911121) and the [SYNTH_5 acceptance record](delta-synth5-prompt-only-20261125/synth5-owner-acceptance-20261125.md). This is an Owner statement, not an independent audio capture/device log.

## 4. Evidence and test reconciliation

| Evidence | Verified result | What it proves / does not prove |
|---|---|---|
| N13.2A review CI [45409360992](https://github.com/Nguyennth19/new-lop-2/actions/runs/45409360992) | `N13_2A_REVIEW_CONTRACT_PASS 243 checks`; 24 original review candidates | Review-contract checks only; no actual grade or runtime grant. |
| B1 composite CI [45419452653](https://github.com/Nguyennth19/new-lop-2/actions/runs/45419452653) | Node tests 8/8 PASS; browser marker `N13_B1_BROWSER_PASS 42` | Composite/view and fallback interaction checks at 360/768/1280 px; not source or pedagogy admission. |
| N13 pilot/GAS VM CI [45435375196](https://github.com/Nguyennth19/new-lop-2/actions/runs/45435375196) | Generated GAS source match; Node tests 13/13 PASS across ten variants; `PILOT_HTTP_PREVIEW_PASS 10 variants` | GAS-like code executed in Node VM with synthetic identity/config; no actual GAS deployment/execution, learner grading, writes or device acceptance. |
| SYNTH_5 isolated delta CI [45537281018](https://github.com/Nguyennth19/new-lop-2/actions/runs/45537281018) | 5/5 contract tests; Chromium HTTP/TTS API contract PASS at 360/768/1280 px | Exact one-field delta and UI/API contract; browser speech API is stubbed. |
| SYNTH_5 Owner-acceptance record CI [45539930688](https://github.com/Nguyennth19/new-lop-2/actions/runs/45539930688) | completed/success | Acceptance record commit retains the same technical gates. |
| N13.3 Full App Owner evidence, Issue #15 comments #7133102099 and #7133512027 | Owner-reported synthetic live read: 5 tabs/9 questions, baseline MATCH, writes DENY; Owner-reported device matrix 42/42 across Samsung/tablet/desktop | Separate Full App TEST evidence; not evidence that these ten review variants are formally admitted, source-exact, or trusted-grade enabled. |

The pilot QA grader is explicitly `OFFLINE_QA_ONLY`, returns `studentRelease:false` and `writes:0`. `N13PilotGrade.gs` has review configuration set to `null` (hard OFF). The VM test asserts no provider access and no Sheet/Properties write APIs. No actual GAS execution or trusted learner grading is established.

## 5. Source, visual and governance findings

### 5.1 Source exactness and routing

- `coverage.review.json`: 40 source-crosswalk IDs, 27 C4 references, 24 prior review candidates, seven current semantic candidates; `studentPlayable=0`.
- `pilot-lessons.review.json`: ten review variants; all seven source-routing anchors retained in `sourceRoutingHolds`.
- `source-visual-closure.review.json` (2026-11-24, explicitly AI visual review / no human signoff) records source mismatches:
  - B001 SGK tree exercise: C4/source blank structure does not align one-to-one.
  - B001 VBT robot exercise: source has 12 hand/sum positions; C4 records six formula parts; current synthetic covers sums only.
  - B002 SGK number lines: source has two 11-tick lines and ten blanks; synthetic has fewer ticks and a step-2 example.
  - B002 SGK balloon matching: source has 19 ticks and six balloons; four-label/four-tick prototype does not reproduce sparse geometry.
  - B002 VBT interval task: source has six missing tick labels plus open interval-list task; current variant uses fewer blanks plus D4.
  - B002 VBT true/false + inequality: source has four statements plus numeric input; current variant has one statement plus input.
  - B002 VBT neighbor table: source has six blanks across three incomplete rows; current variant has three blanks across two rows.
- Therefore, concept anchoring and correct rendering of a synthetic model do not establish source-exact reproduction. All seven routing records remain HOLD.
- Four estimation records remain HOLD: `SGK_B001_L2_E01`, `SGK_B001_L2_E02`, `VBT_B001_T03_E01`, `VBT_B001_T03_E02`. Estimation and exact counting remain distinct; no auto-grade policy approved.

### 5.2 PDF hash and ACL evidence reconciliation

There is a stale-field conflict across review artifacts:
- `source-visual-closure.review.json` and `pilot-lessons.review.json` retain the 2026-11-24 historical ACL string `ANYONE_WRITER_OBSERVED`.
- Later Owner evidence in [Issue #15 comment #7136173193](https://github.com/Nguyennth19/new-lop-2/issues/15#issuecomment-7136173193) reports Drive metadata `anyone:reader + owner`, public edit ACL closure PASS, and exact downloaded bytes/SHA256 matches for SGK (23,184,709 bytes; `f3ccd34900f2047afbcf88fa5f9e89dd8908ac09a44b4f266d4282375aeb7ff5`) and VBT (31,495,974 bytes; `392c43552a4d60480c22496542984ad6add55bab1744898031adc439947aed94`).
- `b1-admission.review.json` retains `pdfBytesReverified=false` and a historical writer ACL label, while its own supersession note points to the later Owner evidence and says there was no fresh ACL check in that delta.

Reconciliation: later Owner evidence supersedes the older public-writer observation for that recorded check, and source-byte hashes were reported verified. However, this consolidated review did not perform a fresh live Drive ACL/hash read. Recheck immediately before any formal source admission. In any case, PDF byte integrity does not convert concept-anchored synthetic variants into source-exact variants.

### 5.3 Skill, renderer, grading and bank sufficiency

- `NUMBER_SENSE` remains an index-only candidate, not a globally registered approved skill. All `skillIdApproved=null`.
- All `rendererIdApproved=null`; all `rendererGrant=DENY`; no production manifest registration.
- `gradingAuthority=DENY`; no trusted-grade grant, actual GAS execution or student write.
- Governance V16 threshold recorded in the admission review: fewer than eight variants per level means `CONTENT_BANK_INSUFFICIENT` for full-lesson release. Current counts:
  - `MATH_B001`: LV1=3, LV2=2, LV3=0.
  - `MATH_B002`: LV1=2, LV2=3, LV3=0.
- These are ten selected review variants, not a full bank. Do not manufacture extra pilot questions to meet the threshold.
- LV3 remains denied because no approved reference is recorded.

## 6. Blocking conditions and closure evidence required

| Blocker | Current state | Minimum evidence to close |
|---|---|---|
| Qualified pedagogy review | No qualified reviewer decision/signoff evidenced; all ten remain review-only | Named qualified reviewer, authenticated review record, date/time, exact source/checkpoint, item-by-item decisions and rationale. Specifically resolve step-2/arithmetic prerequisites for SYNTH_3/4 and V16 exception for SYNTH_6. |
| Source/SGK/VBT exactness and scope | `sourceExact=false`; seven routing HOLD; four estimation HOLD | Fresh PDF SHA/ACL check; source page/task/part crosswalk; resolve every visual/C4 mismatch; explicitly admit or keep each anchor HOLD. |
| Skill approval | `NUMBER_SENSE` candidate only; no approved skill ID | Qualified curriculum decision and explicit approved skill registry mapping; interaction route is not a curriculum skill. |
| Renderer/manifest | No renderer ID approval; grants DENY | Approved renderer contract and version, mapping evidence, manifest change reviewed and explicitly authorized. |
| Trusted grading | QA-only oracle/VM; hard OFF; no actual GAS | Separate security/authority review, approved trusted server grader, exact DTO/pack pin, live GAS TEST verification and negative-path/rollback evidence; explicit Owner authorization. |
| Bank sufficiency | Both lessons below V16 per-level threshold; no LV3 | Approved additional source-backed content and full-bank review, or an explicit scope decision that does not claim full-lesson release. Do not create filler variants. |
| SYNTH_6 multi-answer policy | Owner in-principle only; qualified reviewer pending | Explicit bounded exception approval under V16, or a separately reviewed prompt/model change; no silent grader modification. |
| Final admission / release | 0/10 admitted; all `publicVariant=null`, `studentRelease=false` | Separate per-variant admission decision after above gates; separate Owner authorization for integration/release. |

## 7. Non-effects and rollback

This review is a read-only admission assessment plus a new Markdown report on a separate QA branch. It does not modify:
- `pilot-lessons.review.json`, `b1-admission.review.json`, `b1-composite.review.json`, QA grader/oracle or generated GAS source;
- any renderer, manifest, GAS deployment, Google Sheet, Drive ACL, grant, READY, MAIN, Pilot or Release state.

No merge, deployment, live GAS execution, trusted grading, student data write or admission grant is authorized. SYNTH_3/4/6 remain HOLD. SYNTH_5 remains accepted only for its isolated prompt QA/TTS scope.

Rollback: delete this report file from the review branch or abandon the branch. The inherited SYNTH_5 delta and Owner-acceptance branch remain separate and untouched.
